import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { name, email, phone, category, message, rating } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const saved = db.saveFeedback({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      category: category || 'General Question',
      message: message.trim(),
      rating: rating ? parseInt(rating, 10) : 5
    });

    res.json({
      success: true,
      message: 'Thank you for your feedback! Our agricultural technical team will review your message.',
      data: saved
    });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to record your feedback. Please try again.'
    });
  }
});

router.get('/', (req, res) => {
  const feedbacks = db.getFeedback();
  res.json({ success: true, count: feedbacks.length, data: feedbacks });
});

export default router;
