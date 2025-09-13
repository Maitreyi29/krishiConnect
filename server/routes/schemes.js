const express = require('express');
const GovernmentScheme = require('../models/GovernmentScheme');

const router = express.Router();

// @route   GET /api/schemes/list
// @desc    Get list of government schemes
// @access  Public
router.get('/list', async (req, res) => {
  try {
    const { state, farmerType, page = 1, limit = 10 } = req.query;

    let query = { isActive: true };
    if (state) {
      query.$or = [
        { 'location.applicableStates': new RegExp(state, 'i') },
        { 'location.applicableStates': 'all' }
      ];
    }
    if (farmerType) {
      query.$or = [
        { 'eligibility.farmerType': farmerType },
        { 'eligibility.farmerType': 'all' }
      ];
    }

    const schemes = await GovernmentScheme.find(query)
      .select('name description benefits timeline contactInfo')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GovernmentScheme.countDocuments(query);

    if (schemes.length === 0) {
      // Return sample schemes if no data exists
      const sampleSchemes = generateSampleSchemes();
      return res.json({
        success: true,
        data: sampleSchemes,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalSchemes: sampleSchemes.length
        },
        isSample: true
      });
    }

    res.json({
      success: true,
      data: schemes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalSchemes: total
      }
    });

  } catch (error) {
    console.error('Schemes list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch government schemes'
    });
  }
});

// @route   GET /api/schemes/:id
// @desc    Get detailed information about a specific scheme
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const scheme = await GovernmentScheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    res.json({
      success: true,
      data: scheme
    });

  } catch (error) {
    console.error('Scheme details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scheme details'
    });
  }
});

// @route   POST /api/schemes/eligibility-check
// @desc    Check eligibility for schemes
// @access  Public
router.post('/eligibility-check', async (req, res) => {
  try {
    const { 
      farmerType, 
      landSize, 
      annualIncome, 
      age, 
      state, 
      district 
    } = req.body;

    let query = { isActive: true };
    
    // Location filter
    if (state) {
      query.$or = [
        { 'location.applicableStates': new RegExp(state, 'i') },
        { 'location.applicableStates': 'all' }
      ];
    }

    const allSchemes = await GovernmentScheme.find(query);
    
    const eligibleSchemes = allSchemes.filter(scheme => {
      const eligibility = scheme.eligibility;
      
      // Check farmer type
      if (eligibility.farmerType && 
          !eligibility.farmerType.includes('all') && 
          !eligibility.farmerType.includes(farmerType)) {
        return false;
      }
      
      // Check land size
      if (landSize && eligibility.landSize) {
        if (eligibility.landSize.min && landSize < eligibility.landSize.min) return false;
        if (eligibility.landSize.max && landSize > eligibility.landSize.max) return false;
      }
      
      // Check income
      if (annualIncome && eligibility.income) {
        if (eligibility.income.min && annualIncome < eligibility.income.min) return false;
        if (eligibility.income.max && annualIncome > eligibility.income.max) return false;
      }
      
      // Check age
      if (age && eligibility.age) {
        if (eligibility.age.min && age < eligibility.age.min) return false;
        if (eligibility.age.max && age > eligibility.age.max) return false;
      }
      
      return true;
    });

    res.json({
      success: true,
      data: {
        eligibleSchemes: eligibleSchemes.map(scheme => ({
          id: scheme._id,
          name: scheme.name,
          description: scheme.description,
          benefits: scheme.benefits,
          applicationDeadline: scheme.timeline.applicationDeadline
        })),
        totalEligible: eligibleSchemes.length,
        totalChecked: allSchemes.length
      }
    });

  } catch (error) {
    console.error('Eligibility check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check eligibility'
    });
  }
});

// @route   GET /api/schemes/categories
// @desc    Get scheme categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [
      {
        name: 'Crop Insurance',
        description: 'Insurance schemes for crop protection',
        icon: '🛡️',
        count: 15
      },
      {
        name: 'Subsidies',
        description: 'Financial assistance and subsidies',
        icon: '💰',
        count: 25
      },
      {
        name: 'Equipment',
        description: 'Agricultural equipment and machinery',
        icon: '🚜',
        count: 18
      },
      {
        name: 'Training',
        description: 'Skill development and training programs',
        icon: '📚',
        count: 12
      },
      {
        name: 'Loans',
        description: 'Agricultural loans and credit facilities',
        icon: '🏦',
        count: 20
      },
      {
        name: 'Organic Farming',
        description: 'Support for organic farming practices',
        icon: '🌱',
        count: 8
      }
    ];

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// Helper function to generate sample schemes
function generateSampleSchemes() {
  return [
    {
      _id: 'sample1',
      name: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Comprehensive crop insurance scheme to protect farmers against crop losses',
      benefits: {
        subsidy: { percentage: 50 },
        other: ['Crop loss coverage', 'Premium subsidy', 'Quick settlement']
      },
      timeline: {
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      contactInfo: {
        department: 'Agriculture Department',
        phone: '1800-180-1551',
        website: 'https://pmfby.gov.in'
      }
    },
    {
      _id: 'sample2',
      name: 'Kisan Credit Card Scheme',
      description: 'Credit facility for farmers to meet agricultural expenses',
      benefits: {
        loan: { amount: 300000, interestRate: 7 },
        other: ['Easy loan access', 'Flexible repayment', 'Insurance coverage']
      },
      timeline: {
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      },
      contactInfo: {
        department: 'Banking Department',
        phone: '1800-180-1904',
        website: 'https://kcc.gov.in'
      }
    },
    {
      _id: 'sample3',
      name: 'Soil Health Card Scheme',
      description: 'Free soil testing and nutrient management recommendations',
      benefits: {
        other: ['Free soil testing', 'Nutrient recommendations', 'Improved productivity']
      },
      timeline: {
        applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
      },
      contactInfo: {
        department: 'Soil Health Department',
        phone: '1800-180-1551',
        website: 'https://soilhealth.dac.gov.in'
      }
    }
  ];
}

module.exports = router;
