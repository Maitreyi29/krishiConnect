const express = require('express');
const axios = require('axios');
const WeatherData = require('../models/WeatherData');

const router = express.Router();

// @route   GET /api/weather/current
// @desc    Get current weather for location
// @access  Public
router.get('/current', async (req, res) => {
  try {
    const { lat, lon, state, district } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Check if we have recent data in database
    const existingData = await WeatherData.findOne({
      'location.coordinates.latitude': { $gte: lat - 0.1, $lte: lat + 0.1 },
      'location.coordinates.longitude': { $gte: lon - 0.1, $lte: lon + 0.1 },
      lastUpdated: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // 30 minutes
    });

    if (existingData) {
      return res.json({
        success: true,
        data: existingData
      });
    }

    // Fetch from external weather API (OpenWeatherMap example)
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    const weatherData = new WeatherData({
      location: {
        state,
        district,
        coordinates: { latitude: lat, longitude: lon }
      },
      current: {
        temperature: weatherResponse.data.main.temp,
        humidity: weatherResponse.data.main.humidity,
        windSpeed: weatherResponse.data.wind.speed,
        description: weatherResponse.data.weather[0].description,
        icon: weatherResponse.data.weather[0].icon
      },
      forecast: forecastResponse.data.list.slice(0, 5).map(item => ({
        date: new Date(item.dt * 1000),
        maxTemp: item.main.temp_max,
        minTemp: item.main.temp_min,
        humidity: item.main.humidity,
        rainfall: item.rain?.['3h'] || 0,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      })),
      alerts: generateWeatherAlerts(weatherResponse.data, forecastResponse.data)
    });

    await weatherData.save();

    res.json({
      success: true,
      data: weatherData
    });

  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data'
    });
  }
});

// @route   GET /api/weather/forecast
// @desc    Get weather forecast
// @access  Public
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon, days = 5 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    const forecast = forecastResponse.data.list.slice(0, days * 8).map(item => ({
      date: new Date(item.dt * 1000),
      temperature: item.main.temp,
      maxTemp: item.main.temp_max,
      minTemp: item.main.temp_min,
      humidity: item.main.humidity,
      rainfall: item.rain?.['3h'] || 0,
      windSpeed: item.wind.speed,
      description: item.weather[0].description,
      icon: item.weather[0].icon
    }));

    res.json({
      success: true,
      data: {
        location: { latitude: lat, longitude: lon },
        forecast
      }
    });

  } catch (error) {
    console.error('Forecast API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forecast data'
    });
  }
});

// Helper function to generate weather alerts
function generateWeatherAlerts(current, forecast) {
  const alerts = [];

  // High temperature alert
  if (current.main.temp > 40) {
    alerts.push({
      type: 'heat',
      severity: 'high',
      message: 'Extreme heat warning. Protect crops and ensure adequate irrigation.',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  }

  // Heavy rain alert
  const rainForecast = forecast.list.slice(0, 8);
  const totalRain = rainForecast.reduce((sum, item) => sum + (item.rain?.['3h'] || 0), 0);
  
  if (totalRain > 50) {
    alerts.push({
      type: 'rain',
      severity: 'medium',
      message: 'Heavy rainfall expected. Ensure proper drainage in fields.',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  }

  // Wind alert
  if (current.wind.speed > 15) {
    alerts.push({
      type: 'storm',
      severity: 'medium',
      message: 'Strong winds expected. Secure loose structures and protect young plants.',
      validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000)
    });
  }

  return alerts;
}

module.exports = router;
