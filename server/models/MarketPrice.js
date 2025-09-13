const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true
  },
  variety: String,
  market: {
    name: String,
    location: {
      state: String,
      district: String,
      city: String
    }
  },
  prices: {
    minimum: Number,
    maximum: Number,
    average: Number,
    modal: Number
  },
  unit: {
    type: String,
    default: 'quintal'
  },
  date: {
    type: Date,
    default: Date.now
  },
  trend: {
    type: String,
    enum: ['increasing', 'decreasing', 'stable']
  },
  priceHistory: [{
    date: Date,
    price: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
