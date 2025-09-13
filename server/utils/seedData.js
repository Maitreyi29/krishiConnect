const CropAdvice = require('../models/CropAdvice');
const GovernmentScheme = require('../models/GovernmentScheme');
const MarketPrice = require('../models/MarketPrice');

const seedCropData = async () => {
  const crops = [
    {
      cropName: 'Rice',
      season: 'kharif',
      region: { state: 'Punjab', climateZone: 'subtropical' },
      advice: {
        planting: {
          bestTime: 'June-July',
          soilPreparation: 'Deep ploughing and puddling',
          seedTreatment: 'Treat seeds with fungicide',
          spacing: '20cm x 15cm'
        },
        irrigation: {
          frequency: 'Keep field flooded initially, then alternate wetting and drying',
          amount: '1200-1500mm total water requirement',
          criticalStages: ['Tillering', 'Panicle initiation', 'Flowering']
        },
        fertilization: {
          organic: 'Apply 10-12 tonnes FYM per hectare',
          chemical: 'NPK 120:60:40 kg/ha',
          schedule: ['Basal application', '21 days after transplanting', 'Panicle initiation']
        }
      }
    },
    {
      cropName: 'Wheat',
      season: 'rabi',
      region: { state: 'Uttar Pradesh', climateZone: 'temperate' },
      advice: {
        planting: {
          bestTime: 'November-December',
          soilPreparation: 'Fine tilth with good drainage',
          seedTreatment: 'Seed treatment with Vitavax',
          spacing: '22.5cm row spacing'
        },
        irrigation: {
          frequency: '4-6 irrigations depending on variety',
          amount: '300-350mm total water requirement',
          criticalStages: ['Crown root initiation', 'Tillering', 'Flowering', 'Grain filling']
        }
      }
    }
  ];

  try {
    await CropAdvice.deleteMany({});
    await CropAdvice.insertMany(crops);
    console.log('Crop data seeded successfully');
  } catch (error) {
    console.error('Error seeding crop data:', error);
  }
};

const seedSchemeData = async () => {
  const schemes = [
    {
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss/damage',
      eligibility: {
        farmerType: ['all'],
        landSize: { min: 0, max: 1000 }
      },
      benefits: {
        subsidy: { percentage: 50 },
        other: ['Crop loss coverage up to sum insured', 'Premium subsidy', 'Quick claim settlement']
      },
      location: {
        applicableStates: ['all']
      },
      timeline: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      },
      contactInfo: {
        department: 'Ministry of Agriculture',
        phone: '1800-180-1551',
        website: 'https://pmfby.gov.in'
      }
    },
    {
      name: 'Kisan Credit Card (KCC)',
      description: 'Credit facility to farmers for meeting production credit and investment needs',
      eligibility: {
        farmerType: ['small', 'marginal', 'large'],
        landSize: { min: 0.1, max: 100 }
      },
      benefits: {
        loan: { amount: 300000, interestRate: 7 },
        other: ['Flexible credit limit', 'Simple documentation', 'Insurance coverage']
      },
      location: {
        applicableStates: ['all']
      }
    }
  ];

  try {
    await GovernmentScheme.deleteMany({});
    await GovernmentScheme.insertMany(schemes);
    console.log('Scheme data seeded successfully');
  } catch (error) {
    console.error('Error seeding scheme data:', error);
  }
};

const seedMarketData = async () => {
  const marketPrices = [
    {
      cropName: 'Rice',
      variety: 'Basmati',
      market: {
        name: 'Karnal Mandi',
        location: { state: 'Haryana', district: 'Karnal', city: 'Karnal' }
      },
      prices: { minimum: 1800, maximum: 2200, average: 2000, modal: 2000 },
      trend: 'stable'
    },
    {
      cropName: 'Wheat',
      variety: 'HD-2967',
      market: {
        name: 'Meerut Mandi',
        location: { state: 'Uttar Pradesh', district: 'Meerut', city: 'Meerut' }
      },
      prices: { minimum: 2000, maximum: 2400, average: 2200, modal: 2200 },
      trend: 'increasing'
    }
  ];

  try {
    await MarketPrice.deleteMany({});
    await MarketPrice.insertMany(marketPrices);
    console.log('Market data seeded successfully');
  } catch (error) {
    console.error('Error seeding market data:', error);
  }
};

const seedAllData = async () => {
  console.log('Starting data seeding...');
  await seedCropData();
  await seedSchemeData();
  await seedMarketData();
  console.log('All data seeded successfully!');
};

module.exports = {
  seedCropData,
  seedSchemeData,
  seedMarketData,
  seedAllData
};
