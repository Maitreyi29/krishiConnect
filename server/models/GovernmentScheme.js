const mongoose = require('mongoose');

const governmentSchemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eligibility: {
    farmerType: [String], // 'small', 'marginal', 'large', 'all'
    landSize: {
      min: Number,
      max: Number
    },
    income: {
      min: Number,
      max: Number
    },
    age: {
      min: Number,
      max: Number
    },
    other: [String]
  },
  benefits: {
    subsidy: {
      amount: Number,
      percentage: Number
    },
    loan: {
      amount: Number,
      interestRate: Number
    },
    equipment: [String],
    training: [String],
    other: [String]
  },
  applicationProcess: {
    documents: [String],
    steps: [String],
    onlinePortal: String,
    offlineProcess: String
  },
  location: {
    applicableStates: [String],
    applicableDistricts: [String]
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    applicationDeadline: Date
  },
  contactInfo: {
    department: String,
    phone: String,
    email: String,
    website: String
  },
  language: {
    type: String,
    default: 'english'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GovernmentScheme', governmentSchemeSchema);
