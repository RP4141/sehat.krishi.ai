import crypto from 'crypto';
import express from 'express';
import { db } from '../db.js';
import { getActiveApiKey } from '../aiService.js';
import { getMandiPrices } from '../mandiService.js';

const router = express.Router();

// In-memory set of active admin tokens
const activeAdminTokens = new Set();

function generateAdminToken() {
  const token = 'adm_' + crypto.randomBytes(24).toString('hex');
  activeAdminTokens.add(token);
  return token;
}

function verifyAdminToken(authHeader) {
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '').trim();
  return activeAdminTokens.has(token);
}

// ==========================================
// 1. PUBLIC ADMIN AUTH ENDPOINTS
// ==========================================

// Admin Login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Admin password is required.' });
    }

    const creds = db.getAdminCredentials();
    const validUser = (username || 'admin').trim().toLowerCase() === creds.username.toLowerCase();
    const validPass = password.trim() === creds.password.trim();

    if (!validUser || !validPass) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Admin credentials. Access Denied.'
      });
    }

    const token = generateAdminToken();
    res.json({
      success: true,
      message: 'Admin authentication verified successfully.',
      token,
      admin: {
        username: creds.username,
        role: 'Agricultural System Administrator',
        loginTime: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
  }
});

// Admin Token Verify
router.get('/verify', (req, res) => {
  if (verifyAdminToken(req.headers.authorization)) {
    return res.json({ success: true, authenticated: true });
  }
  return res.status(401).json({ success: false, authenticated: false, message: 'Admin session expired.' });
});

// Admin Logout
router.post('/logout', (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    activeAdminTokens.delete(token.replace('Bearer ', '').trim());
  }
  res.json({ success: true, message: 'Admin logged out successfully.' });
});

// Security Middleware to protect all admin endpoints below
const requireAdmin = (req, res, next) => {
  if (!verifyAdminToken(req.headers.authorization)) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED_ADMIN',
      message: 'Admin authorization required. Please log in with admin password.'
    });
  }
  next();
};

// Change Admin Password (Protected)
router.post('/change-password', requireAdmin, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ success: false, message: 'New password must be at least 4 characters long.' });
    }

    const creds = db.getAdminCredentials();
    if (creds.password !== currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    db.setAdminPassword(newPassword.trim());
    res.json({ success: true, message: 'Admin password changed successfully!' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
});

// ==========================================
// 2. PROTECTED ADMIN OPERATIONS
// ==========================================

// Get Admin Dashboard Overview Statistics
router.get('/stats', requireAdmin, (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
  }
});

// Get & Update AI Engine Settings
router.get('/config', requireAdmin, (req, res) => {
  const activeKey = getActiveApiKey();
  const config = db.getApiConfig();
  res.json({
    success: true,
    data: {
      ...config,
      hasKey: Boolean(activeKey),
      apiKeyMasked: activeKey ? `${activeKey.substring(0, 4)}...${activeKey.slice(-4)}` : 'Not Set'
    }
  });
});

router.post('/config', requireAdmin, (req, res) => {
  try {
    const { geminiApiKey, defaultModel, temperature, maxTokens, systemPromptMode } = req.body;
    const updated = db.setApiConfig({
      ...(geminiApiKey !== undefined && { geminiApiKey: geminiApiKey.trim() }),
      ...(defaultModel && { defaultModel }),
      ...(temperature !== undefined && { temperature: parseFloat(temperature) }),
      ...(maxTokens !== undefined && { maxTokens: parseInt(maxTokens, 10) }),
      ...(systemPromptMode && { systemPromptMode })
    });
    res.json({ success: true, message: 'Configuration saved successfully.', data: updated });
  } catch (err) {
    console.error('Config save error:', err);
    res.status(500).json({ success: false, message: 'Failed to save configuration.' });
  }
});

// Live AI Ping Test
router.post('/test-ai', requireAdmin, async (req, res) => {
  const startTime = Date.now();
  const apiKey = getActiveApiKey(req.body.apiKey);

  if (!apiKey) {
    return res.status(400).json({
      success: false,
      error: 'NO_KEY',
      message: 'No Google Gemini API key is configured. Please provide or save a key first.'
    });
  }

  try {
    const model = req.body.model || 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const testPrompt = {
      contents: [{ role: 'user', parts: [{ text: 'Respond with exactly one word: Ready.' }] }],
      generationConfig: { maxOutputTokens: 10 }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPrompt),
      signal: AbortSignal.timeout(10000)
    });

    const latency = Date.now() - startTime;
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        latencyMs: latency,
        error: data.error?.message || `HTTP ${response.status}`
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'OK';

    res.json({
      success: true,
      latencyMs: latency,
      modelUsed: model,
      reply,
      message: `Gemini API connected successfully (${latency}ms roundtrip).`
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      latencyMs: Date.now() - startTime,
      error: err.message || 'Connection test timed out.'
    });
  }
});

// Mandi Prices Management
router.get('/mandi', (req, res) => {
  const result = getMandiPrices();
  res.json(result);
});

router.post('/mandi', requireAdmin, (req, res) => {
  try {
    const { commodity, variety, mandi, district, state, minPrice, maxPrice, modalPrice, arrivals, trend } = req.body;
    if (!commodity || !mandi || !modalPrice) {
      return res.status(400).json({ success: false, message: 'Commodity, Mandi, and Modal Price are required.' });
    }

    const created = db.addCustomMandiPrice({
      commodity: commodity.trim(),
      variety: variety?.trim() || 'Standard Fair Quality',
      mandi: mandi.trim(),
      district: district?.trim() || 'General',
      state: state?.trim() || 'Gujarat',
      minPrice: parseFloat(minPrice) || parseFloat(modalPrice),
      maxPrice: parseFloat(maxPrice) || parseFloat(modalPrice),
      modalPrice: parseFloat(modalPrice),
      arrivals: arrivals?.trim() || '100 Tonnes',
      trend: trend || 'stable',
      arrivalDate: new Date().toISOString().split('T')[0]
    });

    res.json({ success: true, message: 'New mandi rate published successfully.', data: created });
  } catch (err) {
    console.error('Add mandi error:', err);
    res.status(500).json({ success: false, message: 'Failed to add mandi price.' });
  }
});

router.delete('/mandi/:id', requireAdmin, (req, res) => {
  const deleted = db.deleteCustomMandiPrice(req.params.id);
  res.json({ success: deleted });
});

// Feedback & Inquiries Desk
router.get('/feedback', requireAdmin, (req, res) => {
  const feedbacks = db.getFeedback();
  res.json({ success: true, data: feedbacks });
});

router.patch('/feedback/:id', requireAdmin, (req, res) => {
  const { status } = req.body;
  const updated = db.updateFeedbackStatus(req.params.id, status || 'Reviewed');
  if (updated) {
    res.json({ success: true, data: updated });
  } else {
    res.status(404).json({ success: false, message: 'Feedback entry not found.' });
  }
});

// Farm Profiles Directory
router.get('/farms', requireAdmin, (req, res) => {
  const farms = db.getFarmProfiles();
  const users = db.getUsers();
  res.json({ success: true, data: { farms, users } });
});

// Seasonal Advisory Broadcast
router.get('/advisory', (req, res) => {
  const advisory = db.getActiveAdvisory();
  res.json({ success: true, data: advisory });
});

router.post('/advisory', requireAdmin, (req, res) => {
  try {
    const { title, summary, status } = req.body;
    if (!title || !summary) {
      return res.status(400).json({ success: false, message: 'Title and summary are required.' });
    }
    const updated = db.setActiveAdvisory({ title, summary, status: status || 'Active' });
    res.json({ success: true, message: 'Seasonal advisory broadcast updated.', data: updated });
  } catch (err) {
    console.error('Advisory update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update advisory.' });
  }
});

export default router;
