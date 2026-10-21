import express from 'express';
import { getSchemes } from '../schemesData.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { search, category } = req.query;
    const result = getSchemes({ search, category });
    res.json(result);
  } catch (err) {
    console.error('Schemes route error:', err);
    res.status(500).json({
      success: false,
      error: 'SCHEMES_DATA_ERROR',
      message: 'Failed to retrieve government schemes.'
    });
  }
});

export default router;
