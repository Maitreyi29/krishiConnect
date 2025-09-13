const express = require('express');
const axios = require('axios');
const MarketPrice = require('../models/MarketPrice');

const router = express.Router();

// @route   GET /api/market/prices
// @desc    Get current market prices for crops
// @access  Public
router.get('/prices', async (req, res) => {
  try {
    const { crop, state, district, limit = 10 } = req.query;

    let query = {};
    if (crop) query.cropName = new RegExp(crop, 'i');
    if (state) query['market.location.state'] = new RegExp(state, 'i');
    if (district) query['market.location.district'] = new RegExp(district, 'i');

    const prices = await MarketPrice.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    if (prices.length === 0) {
      // Generate sample data if no real data exists
      const samplePrices = generateSamplePrices(crop, state, district);
      return res.json({
        success: true,
        data: samplePrices,
        isSample: true
      });
    }

    res.json({
      success: true,
      data: prices
    });

  } catch (error) {
    console.error('Market prices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market prices'
    });
  }
});

// @route   GET /api/market/trends
// @desc    Get price trends for a specific crop
// @access  Public
router.get('/trends', async (req, res) => {
  try {
    const { crop, days = 30 } = req.query;

    if (!crop) {
      return res.status(400).json({
        success: false,
        message: 'Crop name is required'
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await MarketPrice.find({
      cropName: new RegExp(crop, 'i'),
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Calculate trend analysis
    const priceData = trends.map(t => ({
      date: t.date,
      price: t.prices.average || t.prices.modal
    }));

    let trendDirection = 'stable';
    if (priceData.length > 1) {
      const firstPrice = priceData[0].price;
      const lastPrice = priceData[priceData.length - 1].price;
      const change = ((lastPrice - firstPrice) / firstPrice) * 100;

      if (change > 5) trendDirection = 'increasing';
      else if (change < -5) trendDirection = 'decreasing';
    }

    res.json({
      success: true,
      data: {
        crop,
        period: `${days} days`,
        trend: trendDirection,
        priceHistory: priceData,
        analysis: {
          averagePrice: priceData.reduce((sum, p) => sum + p.price, 0) / priceData.length,
          highestPrice: Math.max(...priceData.map(p => p.price)),
          lowestPrice: Math.min(...priceData.map(p => p.price))
        }
      }
    });

  } catch (error) {
    console.error('Market trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market trends'
    });
  }
});

// @route   GET /api/market/nearby
// @desc    Get nearby market information
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon, radius = 50 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // In a real implementation, you would calculate distance-based queries
    // For now, we'll return sample nearby markets
    const nearbyMarkets = [
      {
        name: "Central Mandi",
        location: {
          state: "Sample State",
          district: "Sample District",
          city: "Sample City",
          address: "Main Market Road",
          coordinates: { latitude: parseFloat(lat) + 0.01, longitude: parseFloat(lon) + 0.01 }
        },
        distance: "5 km",
        facilities: ["Storage", "Transportation", "Quality Testing"],
        operatingHours: "6:00 AM - 6:00 PM",
        contact: {
          phone: "+91-9876543210",
          email: "central.mandi@example.com"
        },
        crops: ["Rice", "Wheat", "Cotton", "Sugarcane"]
      },
      {
        name: "Farmers Market",
        location: {
          state: "Sample State",
          district: "Sample District",
          city: "Sample City",
          address: "Agriculture Complex",
          coordinates: { latitude: parseFloat(lat) - 0.02, longitude: parseFloat(lon) + 0.02 }
        },
        distance: "12 km",
        facilities: ["Direct Sales", "Organic Certification"],
        operatingHours: "7:00 AM - 5:00 PM",
        contact: {
          phone: "+91-9876543211",
          email: "farmers.market@example.com"
        },
        crops: ["Vegetables", "Fruits", "Organic Produce"]
      }
    ];

    res.json({
      success: true,
      data: nearbyMarkets
    });

  } catch (error) {
    console.error('Nearby markets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby markets'
    });
  }
});

// @route   POST /api/market/price-alert
// @desc    Set price alert for a crop
// @access  Public
router.post('/price-alert', async (req, res) => {
  try {
    const { crop, targetPrice, alertType, contact } = req.body;

    if (!crop || !targetPrice || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Crop, target price, and contact information are required'
      });
    }

    // In a real implementation, you would save this to a PriceAlert model
    // and set up notifications when prices reach the target

    res.json({
      success: true,
      message: 'Price alert set successfully',
      data: {
        crop,
        targetPrice,
        alertType: alertType || 'above',
        contact,
        status: 'active',
        createdAt: new Date()
      }
    });

  } catch (error) {
    console.error('Price alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set price alert'
    });
  }
});

// Helper function to generate sample market prices
function generateSamplePrices(crop = 'Rice', state = 'Sample State', district = 'Sample District') {
  const crops = {
    'Rice': { min: 1800, max: 2200, unit: 'quintal' },
    'Wheat': { min: 2000, max: 2400, unit: 'quintal' },
    'Cotton': { min: 5500, max: 6500, unit: 'quintal' },
    'Sugarcane': { min: 280, max: 320, unit: 'quintal' },
    'Tomato': { min: 800, max: 1500, unit: 'quintal' },
    'Onion': { min: 1200, max: 2000, unit: 'quintal' }
  };

  const cropData = crops[crop] || crops['Rice'];
  const basePrice = (cropData.min + cropData.max) / 2;
  
  return Array.from({ length: 5 }, (_, i) => {
    const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
    const price = Math.round(basePrice * (1 + variation));
    
    return {
      cropName: crop,
      variety: 'Common',
      market: {
        name: `Market ${i + 1}`,
        location: {
          state,
          district,
          city: `City ${i + 1}`
        }
      },
      prices: {
        minimum: Math.round(price * 0.9),
        maximum: Math.round(price * 1.1),
        average: price,
        modal: price
      },
      unit: cropData.unit,
      date: new Date(),
      trend: Math.random() > 0.5 ? 'increasing' : 'stable'
    };
  });
}

module.exports = router;
