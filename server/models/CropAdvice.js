const mongoose = require('mongoose');

const cropAdviceSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true
  },
  season: {
    type: String,
    enum: ['kharif', 'rabi', 'zaid', 'perennial'],
    required: true
  },
  region: {
    state: String,
    climateZone: String
  },
  advice: {
    planting: {
      bestTime: String,
      soilPreparation: String,
      seedTreatment: String,
      spacing: String
    },
    irrigation: {
      frequency: String,
      amount: String,
      criticalStages: [String]
    },
    fertilization: {
      organic: String,
      chemical: String,
      schedule: [String]
    },
    pestManagement: {
      commonPests: [String],
      preventiveMeasures: [String],
      organicSolutions: [String]
    },
    harvesting: {
      indicators: String,
      bestTime: String,
      postHarvest: String
    }
  },
  marketInfo: {
    averagePrice: Number,
    demandLevel: String,
    bestMarkets: [String]
  },
  language: {
    type: String,
    default: 'english'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CropAdvice', cropAdviceSchema);
