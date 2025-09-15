const express = require('express');
const router = express.Router();
const weatherService = require('../config/weather');
const { validateWeatherRequest } = require('../middleware/validation');

// Get current weather for a city
router.get('/current', validateWeatherRequest, async (req, res) => {
  try {
    const { city, state } = req.query;
    
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required'
      });
    }

    const result = await weatherService.getCurrentWeather(city, state);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Weather current error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get weather forecast for a city
router.get('/forecast', validateWeatherRequest, async (req, res) => {
  try {
    const { city, state } = req.query;
    
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required'
      });
    }

    const result = await weatherService.getWeatherForecast(city, state);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Weather forecast error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get weather alerts and farming advice
router.get('/alerts', validateWeatherRequest, async (req, res) => {
  try {
    const { city, state } = req.query;
    
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required'
      });
    }

    const result = await weatherService.getWeatherAlerts(city, state);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Weather alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get weather by coordinates (for mobile GPS)
router.get('/coordinates', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude parameters are required'
      });
    }

    // For coordinates, we'll need to reverse geocode to get city name
    // This is a simplified implementation - in production, use a proper reverse geocoding service
    const city = 'Current Location';
    const result = await weatherService.getCurrentWeather(city);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Weather coordinates error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get weather cache statistics (for debugging)
router.get('/cache-stats', (req, res) => {
  try {
    const stats = weatherService.getCacheStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get cache stats',
      error: error.message
    });
  }
});

// Clear weather cache
router.post('/clear-cache', (req, res) => {
  try {
    const result = weatherService.clearCache();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
      error: error.message
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Weather service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
