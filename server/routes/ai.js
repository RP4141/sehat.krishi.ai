import express from 'express';
import multer from 'multer';
import { askFarmingAssistant, analyzeCropPhoto, getActiveApiKey } from '../aiService.js';
import { db } from '../db.js';

const router = express.Router();

// Memory storage for image uploads (keeps things fast, secure, zero disk pollution)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP) are allowed.'));
    }
  }
});

// Check AI status
router.get('/status', (req, res) => {
  const activeKey = getActiveApiKey();
  res.json({
    configured: Boolean(activeKey),
    provider: 'Google Gemini',
    hasKey: Boolean(activeKey),
    activeKeyMasked: activeKey ? `${activeKey.substring(0, 4)}...${activeKey.slice(-4)}` : null,
    supportedLanguages: ['en', 'hi', 'gu']
  });
});

// Save runtime API Key
router.post('/key', (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid API key provided.' });
  }
  db.setApiConfig({ geminiApiKey: apiKey.trim() });
  res.json({
    success: true,
    message: 'API Key updated successfully.',
    configured: true
  });
});

// Ask natural language farming question
router.post('/ask', async (req, res) => {
  try {
    const { question, language, crop, conversationHistory, apiKey } = req.body;
    const result = await askFarmingAssistant({
      question,
      language,
      crop,
      conversationHistory,
      clientApiKey: apiKey
    });

    if (!result.success) {
      return res.status(result.error === 'API_KEY_REQUIRED' ? 401 : 400).json(result);
    }
    res.json(result);
  } catch (err) {
    console.error('API /ai/ask error:', err);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'An unexpected internal error occurred while processing your farming question.'
    });
  }
});

// Analyze crop photo with Vision AI
router.post('/analyze-crop', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'NO_IMAGE_FILE',
        message: 'No image file was received. Please select a valid crop photograph.'
      });
    }

    const { crop, symptoms, language, apiKey } = req.body;
    const result = await analyzeCropPhoto({
      imageBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
      crop,
      symptoms,
      language,
      clientApiKey: apiKey
    });

    if (!result.success) {
      return res.status(result.error === 'API_KEY_REQUIRED' ? 401 : 400).json(result);
    }
    res.json(result);
  } catch (err) {
    console.error('API /ai/analyze-crop error:', err);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: err.message || 'An error occurred during vision analysis.'
    });
  }
});

export default router;
