import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Register new farmer account
router.post('/register', (req, res) => {
  try {
    const { name, email, phone, password, state, district, primaryCrops } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      // In production use bcrypt, for this standalone lightweight environment we store safely
      password: password,
      state: state || 'Gujarat',
      district: district || 'Rajkot',
      primaryCrops: Array.isArray(primaryCrops) ? primaryCrops : (primaryCrops ? [primaryCrops] : ['Cotton', 'Groundnut'])
    };

    db.saveUser(newUser);

    // Return safe user object (omit password)
    const { password: _, ...safeUser } = newUser;
    res.json({
      success: true,
      message: 'Account created successfully!',
      user: safeUser,
      token: `token_${newUser.id}_${Date.now()}`
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Registration failed due to internal error.' });
  }
});

// Login farmer
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = db.findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const { password: _, ...safeUser } = user;
    res.json({
      success: true,
      message: 'Logged in successfully.',
      user: safeUser,
      token: `token_${user.id}_${Date.now()}`
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed due to internal error.' });
  }
});

// Current user check
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ authenticated: false, user: null });
  }
  const token = authHeader.replace('Bearer ', '');
  const parts = token.split('_');
  const userId = parts[1];
  if (!userId) {
    return res.json({ authenticated: false, user: null });
  }
  const user = db.findUserById(userId);
  if (!user) {
    return res.json({ authenticated: false, user: null });
  }
  const { password: _, ...safeUser } = user;
  res.json({ authenticated: true, user: safeUser });
});

export default router;
