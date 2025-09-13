const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  location: {
    state: String,
    district: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  current: {
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    description: String,
    icon: String
  },
  forecast: [{
    date: Date,
    maxTemp: Number,
    minTemp: Number,
    humidity: Number,
    rainfall: Number,
    description: String,
    icon: String
  }],
  alerts: [{
    type: String, // 'rain', 'storm', 'heat', 'cold'
    severity: String, // 'low', 'medium', 'high'
    message: String,
    validUntil: Date
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WeatherData', weatherDataSchema);
