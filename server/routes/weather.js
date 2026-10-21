import express from 'express';
import { getLiveWeather, DISTRICT_COORDINATES } from '../weatherService.js';

const router = express.Router();

// Get live weather for selected district or coordinates
router.get('/', async (req, res) => {
  try {
    const { district, lat, lon } = req.query;
    const result = await getLiveWeather(
      district || 'Rajkot, Gujarat',
      lat ? parseFloat(lat) : null,
      lon ? parseFloat(lon) : null
    );

    if (!result.success) {
      return res.status(503).json(result);
    }
    res.json(result);
  } catch (err) {
    console.error('Weather route error:', err);
    res.status(500).json({
      success: false,
      error: 'WEATHER_FETCH_FAILED',
      message: 'Failed to fetch meteorological data.'
    });
  }
});

// Get supported agricultural districts list
router.get('/districts', (req, res) => {
  const districts = Object.keys(DISTRICT_COORDINATES).map((name) => ({
    name,
    state: DISTRICT_COORDINATES[name].state,
    primaryCrops: DISTRICT_COORDINATES[name].primaryCrops
  }));
  res.json({ success: true, districts });
});

export default router;
