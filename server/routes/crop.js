const express = require('express');
const CropAdvice = require('../models/CropAdvice');
const mockDB = require('../utils/mockDatabase');

const router = express.Router();

// @route   GET /api/crop/advice
// @desc    Get crop advice based on crop type and location
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

    let query = { cropName: new RegExp(crop, 'i') };
    
    if (season) {
      query.season = season;
    }
    
    if (state) {
      query['region.state'] = new RegExp(state, 'i');
    }

    const advice = await CropAdvice.findOne(query);

    if (!advice) {
      // Return generic advice if specific not found
      const genericAdvice = {
        cropName: crop,
        season: season || 'general',
        advice: {
          planting: {
            bestTime: "Consult local agricultural experts for optimal planting time",
            soilPreparation: "Ensure proper soil testing and preparation",
            seedTreatment: "Use certified seeds and appropriate treatment",
            spacing: "Follow recommended spacing guidelines"
          },
          irrigation: {
            frequency: "Monitor soil moisture regularly",
            amount: "Provide adequate water based on crop stage",
            criticalStages: ["Germination", "Flowering", "Fruit development"]
          },
          fertilization: {
            organic: "Use compost and organic manure",
            chemical: "Apply balanced NPK fertilizers as per soil test",
            schedule: ["Pre-planting", "Vegetative stage", "Reproductive stage"]
          },
          pestManagement: {
            commonPests: ["Aphids", "Caterpillars", "Fungal diseases"],
            preventiveMeasures: ["Crop rotation", "Proper spacing", "Field sanitation"],
            organicSolutions: ["Neem oil", "Biological control", "Companion planting"]
          },
          harvesting: {
            indicators: "Monitor crop maturity indicators",
            bestTime: "Harvest at optimal maturity",
            postHarvest: "Proper drying and storage"
          }
        },
        marketInfo: {
          averagePrice: 0,
          demandLevel: "moderate",
          bestMarkets: ["Local mandis", "Direct sales"]
        }
      };

      return res.json({
        success: true,
        data: genericAdvice,
        isGeneric: true
      });
    }

    res.json({
      success: true,
      data: advice
    });

  } catch (error) {
    console.error('Crop advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop advice'
    });
  }
});

// @route   GET /api/crop/list
// @desc    Get list of available crops
// @access  Public
router.get('/list', async (req, res) => {
  try {
    const { season, state } = req.query;
    
    let query = {};
    if (season) query.season = season;
    if (state) query['region.state'] = new RegExp(state, 'i');

    const crops = await mockDB.getCropAdvice({ crop: 'cropName', query });
    
    res.json({
      success: true,
      data: crops.sort()
    });

  } catch (error) {
    console.error('Crop list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop list'
    });
  }
});

// @route   POST /api/crop/pest-control
// @desc    Get pest control advice
// @access  Public
router.post('/pest-control', async (req, res) => {
  try {
    const { crop, pestType, symptoms, location } = req.body;

    if (!crop || !symptoms) {
      return res.status(400).json({
        success: false,
        message: 'Crop name and symptoms are required'
      });
    }

    // Find crop advice that might contain pest information
    const cropAdvice = await CropAdvice.findOne({
      cropName: new RegExp(crop, 'i')
    });

    let pestAdvice = {
      crop,
      pestType: pestType || 'Unknown',
      symptoms,
      identification: "Based on symptoms, this could be a common pest issue",
      treatment: {
        immediate: [
          "Isolate affected plants if possible",
          "Remove severely damaged parts",
          "Apply organic neem oil spray"
        ],
        preventive: [
          "Maintain field hygiene",
          "Use resistant varieties",
          "Practice crop rotation",
          "Monitor regularly"
        ],
        organic: [
          "Neem oil application",
          "Biological control agents",
          "Companion planting",
          "Natural predators"
        ],
        chemical: [
          "Consult agricultural expert for appropriate pesticide",
          "Follow label instructions carefully",
          "Use protective equipment",
          "Observe pre-harvest intervals"
        ]
      },
      prevention: [
        "Regular field monitoring",
        "Proper plant spacing",
        "Balanced nutrition",
        "Water management"
      ]
    };

    if (cropAdvice && cropAdvice.advice.pestManagement) {
      pestAdvice.treatment.organic = cropAdvice.advice.pestManagement.organicSolutions;
      pestAdvice.prevention = cropAdvice.advice.pestManagement.preventiveMeasures;
    }

    res.json({
      success: true,
      data: pestAdvice
    });

  } catch (error) {
    console.error('Pest control error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pest control advice'
    });
  }
});

// @route   GET /api/crop/seasonal
// @desc    Get seasonal crop recommendations
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

    let query = { season };
    if (state) {
      query['region.state'] = new RegExp(state, 'i');
    }

    const seasonalCrops = await CropAdvice.find(query)
      .select('cropName season region marketInfo')
      .limit(20);

    res.json({
      success: true,
      data: {
        season,
        month: currentMonth,
        crops: seasonalCrops
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

module.exports = router;
