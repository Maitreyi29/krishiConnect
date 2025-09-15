const express = require('express');
const CropAdvice = require('../models/CropAdvice');
const mockDB = require('../utils/mockDatabase');
const geminiService = require('../config/gemini');

const router = express.Router();

// @route   POST /api/crop/advice
// @desc    Get AI-powered crop advice using Gemini
// @access  Public
router.post('/advice', async (req, res) => {
  try {
    const { query, userContext } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    // Get AI-powered advice
    const result = await geminiService.getCropAdvice(query, userContext);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || 'Failed to get crop advice'
      });
    }

    res.json({
      success: true,
      data: {
        query,
        response: result.response,
        cached: result.cached,
        timestamp: result.timestamp
      }
    });

  } catch (error) {
    console.error('Crop advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop advice'
    });
  }
});

// @route   GET /api/crop/advice (legacy support)
// @desc    Get crop advice based on crop type and location (legacy)
// @access  Public
router.get('/advice', async (req, res) => {
  try {
    const { crop, season, state, language = 'english' } = req.query;

    if (!crop) {
      return res.status(400).json({
        success: false,
        message: 'Crop name is required'
      });
    }

    // Convert GET request to AI query
    const query = `I need advice for growing ${crop}${season ? ` in ${season} season` : ''}${state ? ` in ${state}` : ''}`;
    const userContext = {
      location: state ? { state } : undefined,
      language,
      season
    };

    const result = await geminiService.getCropAdvice(query, userContext);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get crop advice'
      });
    }

    res.json({
      success: true,
      data: {
        cropName: crop,
        season: season || 'general',
        advice: result.response,
        cached: result.cached,
        timestamp: result.timestamp
      }
    });

  } catch (error) {
    console.error('Crop advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop advice'
    });
  }
});

// @route   POST /api/crop/pest-control
// @desc    Get AI-powered pest control advice
// @access  Public
router.post('/pest-control', async (req, res) => {
  try {
    const { crop, pestType, symptoms, location, userContext } = req.body;

    if (!crop || !symptoms) {
      return res.status(400).json({
        success: false,
        message: 'Crop name and symptoms are required'
      });
    }

    const result = await geminiService.getPestAdvice(crop, symptoms, location);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get pest control advice'
      });
    }

    res.json({
      success: true,
      data: {
        crop,
        symptoms,
        location,
        advice: result.response,
        cached: result.cached,
        timestamp: result.timestamp
      }
    });

  } catch (error) {
    console.error('Pest control error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pest control advice'
    });
  }
});

// @route   POST /api/crop/seasonal
// @desc    Get AI-powered seasonal recommendations
// @access  Public
router.post('/seasonal', async (req, res) => {
  try {
    const { season, location, crops, userContext } = req.body;
    
    const currentMonth = new Date().getMonth() + 1;
    let currentSeason = season;
    
    if (!currentSeason) {
      if (currentMonth >= 6 && currentMonth <= 10) {
        currentSeason = 'kharif';
      } else if (currentMonth >= 11 || currentMonth <= 3) {
        currentSeason = 'rabi';
      } else {
        currentSeason = 'zaid';
      }
    }

    const result = await geminiService.getSeasonalAdvice(currentSeason, location, crops);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get seasonal advice'
      });
    }

    res.json({
      success: true,
      data: {
        season: currentSeason,
        month: currentMonth,
        location,
        advice: result.response,
        cached: result.cached,
        timestamp: result.timestamp
      }
    });

  } catch (error) {
    console.error('Seasonal advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seasonal recommendations'
    });
  }
});

// @route   GET /api/crop/seasonal (legacy support)
// @desc    Get seasonal crop recommendations (legacy)
// @access  Public
router.get('/seasonal', async (req, res) => {
  try {
    const { state, month } = req.query;
    const currentMonth = month || new Date().getMonth() + 1;
    
    let season;
    if (currentMonth >= 6 && currentMonth <= 10) {
      season = 'kharif';
    } else if (currentMonth >= 11 || currentMonth <= 3) {
      season = 'rabi';
    } else {
      season = 'zaid';
    }

    const location = state ? { state } : undefined;
    const result = await geminiService.getSeasonalAdvice(season, location);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get seasonal advice'
      });
    }

    res.json({
      success: true,
      data: {
        season,
        month: currentMonth,
        advice: result.response,
        cached: result.cached,
        timestamp: result.timestamp
      }
    });

  } catch (error) {
    console.error('Seasonal crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seasonal recommendations'
    });
  }
});

// @route   POST /api/crop/fertilizer
// @desc    Get AI-powered fertilizer recommendations
// @access  Public
router.post('/fertilizer', async (req, res) => {
  try {
    const { crop, soilType, growthStage, location, userContext } = req.body;

    if (!crop) {
      return res.status(400).json({
        success: false,
        message: 'Crop name is required'
      });
    }

    const result = await geminiService.getFertilizerAdvice(
      crop, 
      soilType || 'general', 
      growthStage || 'general', 
      location
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get fertilizer advice'
      });
    }

    res.json({
      success: true,
      data: {
        crop,
        soilType,
        growthStage,
        location,
        advice: result.response,
        cached: result.cached,
        timestamp: result.timestamp
      }
    });

  } catch (error) {
    console.error('Fertilizer advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get fertilizer advice'
    });
  }
});

// @route   GET /api/crop/list
// @desc    Get list of available crops from mock database
// @access  Public
router.get('/list', async (req, res) => {
  try {
    const { season, state } = req.query;
    
    const crops = await mockDB.getCropAdvice();
    const cropNames = crops.map(crop => crop.cropName).filter(Boolean);
    
    res.json({
      success: true,
      data: [...new Set(cropNames)].sort()
    });

  } catch (error) {
    console.error('Crop list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop list'
    });
  }
});

// @route   GET /api/crop/cache-stats
// @desc    Get cache statistics (for debugging)
// @access  Public
router.get('/cache-stats', (req, res) => {
  try {
    const stats = geminiService.getCacheStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get cache stats'
    });
  }
});

// @route   POST /api/crop/clear-cache
// @desc    Clear the advice cache (for maintenance)
// @access  Public
router.post('/clear-cache', (req, res) => {
  try {
    geminiService.clearCache();
    res.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache'
    });
  }
});

module.exports = router;
