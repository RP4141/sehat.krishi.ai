import express from 'express';
import { getMandiPrices } from '../mandiService.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { state, district, mandi, commodity, search } = req.query;
    const result = getMandiPrices({ state, district, mandi, commodity, search });
    res.json(result);
  } catch (err) {
    console.error('Mandi route error:', err);
    res.status(500).json({
      success: false,
      error: 'MANDI_DATA_ERROR',
      message: 'Failed to retrieve mandi market prices.'
    });
  }
});

export default router;
