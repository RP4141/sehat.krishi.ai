import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get farm profiles
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'] || req.query.userId || 'guest';
  const profiles = db.getFarmProfiles(userId);
  res.json({ success: true, data: profiles });
});

// Save or update farm profile
router.post('/', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId || 'guest';
    const { farmName, acres, soilType, irrigationSource, currentCrops, state, district, notes, id } = req.body;

    if (!farmName || !farmName.trim()) {
      return res.status(400).json({ success: false, message: 'Farm name is required.' });
    }

    const saved = db.saveFarmProfile({
      id,
      userId,
      farmName: farmName.trim(),
      acres: acres ? parseFloat(acres) : 0,
      soilType: soilType || 'Alluvial / Loamy',
      irrigationSource: irrigationSource || 'Borewell / Drip',
      currentCrops: Array.isArray(currentCrops) ? currentCrops : (currentCrops ? [currentCrops] : []),
      state: state || 'Gujarat',
      district: district || 'Rajkot',
      notes: notes || ''
    });

    res.json({ success: true, data: saved });
  } catch (err) {
    console.error('Save farm error:', err);
    res.status(500).json({ success: false, message: 'Failed to save farm profile.' });
  }
});

// Delete farm profile
router.delete('/:id', (req, res) => {
  const userId = req.headers['x-user-id'] || req.query.userId || null;
  const deleted = db.deleteFarmProfile(req.params.id, userId);
  res.json({ success: deleted });
});

// Get saved advice
router.get('/saved-advice', (req, res) => {
  const userId = req.headers['x-user-id'] || req.query.userId || 'guest';
  const adviceList = db.getSavedAdvice(userId);
  res.json({ success: true, data: adviceList });
});

// Save AI advice
router.post('/saved-advice', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId || 'guest';
    const { title, crop, category, question, answer, sources } = req.body;

    if (!answer) {
      return res.status(400).json({ success: false, message: 'Advice answer cannot be empty.' });
    }

    const saved = db.saveAdvice({
      userId,
      title: title || question?.substring(0, 50) || 'Farming Advice',
      crop: crop || 'General',
      category: category || 'Agronomy',
      question: question || '',
      answer,
      sources: sources || []
    });

    res.json({ success: true, data: saved });
  } catch (err) {
    console.error('Save advice error:', err);
    res.status(500).json({ success: false, message: 'Failed to save advice.' });
  }
});

// Delete saved advice
router.delete('/saved-advice/:id', (req, res) => {
  const userId = req.headers['x-user-id'] || req.query.userId || null;
  const deleted = db.deleteSavedAdvice(req.params.id, userId);
  res.json({ success: deleted });
});

export default router;
