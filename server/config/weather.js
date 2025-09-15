const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = '786b8ab5eemshbaf74c47a1c71adp1909a2jsne90322eff8d3';
    this.baseURL = 'https://open-weather13.p.rapidapi.com';
    this.cache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
  }

  async getCurrentWeather(city, state = null) {
    try {
      const cacheKey = `current_${city}_${state || ''}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        return { success: true, data: cached.data, cached: true };
      }

      const cityQuery = state ? `${city}, ${state}` : city;
      
      const response = await axios.get(`${this.baseURL}/city`, {
        params: {
          city: cityQuery,
          lang: 'EN'
        },
        headers: {
          'x-rapidapi-host': 'open-weather13.p.rapidapi.com',
          'x-rapidapi-key': this.apiKey
        }
      });

      if (response.data && response.data.cod === 200) {
        const weatherData = this.formatCurrentWeather(response.data);
        
        // Cache the result
        this.cache.set(cacheKey, {
          data: weatherData,
          timestamp: Date.now()
        });

        return { success: true, data: weatherData, cached: false };
      } else {
        throw new Error('Invalid weather data received');
      }
    } catch (error) {
      console.error('Weather API error:', error.message);
      return {
        success: false,
        message: 'Failed to fetch weather data',
        error: error.message
      };
    }
  }

  async getWeatherForecast(city, state = null) {
    try {
      // For forecast, we'll use the current weather endpoint and simulate forecast
      // In a real implementation, you'd use a forecast-specific endpoint
      const currentWeather = await this.getCurrentWeather(city, state);
      
      if (!currentWeather.success) {
        return currentWeather;
      }

      const forecast = this.generateForecast(currentWeather.data);
      
      return {
        success: true,
        data: {
          current: currentWeather.data,
          forecast: forecast
        },
        cached: currentWeather.cached
      };
    } catch (error) {
      console.error('Weather forecast error:', error.message);
      return {
        success: false,
        message: 'Failed to fetch weather forecast',
        error: error.message
      };
    }
  }

  formatCurrentWeather(rawData) {
    return {
      location: {
        name: rawData.name,
        country: rawData.sys.country,
        coordinates: {
          lat: rawData.coord.lat,
          lon: rawData.coord.lon
        }
      },
      current: {
        temperature: {
          current: Math.round(this.fahrenheitToCelsius(rawData.main.temp)),
          feels_like: Math.round(this.fahrenheitToCelsius(rawData.main.feels_like)),
          min: Math.round(this.fahrenheitToCelsius(rawData.main.temp_min)),
          max: Math.round(this.fahrenheitToCelsius(rawData.main.temp_max))
        },
        weather: {
          main: rawData.weather[0].main,
          description: rawData.weather[0].description,
          icon: rawData.weather[0].icon
        },
        humidity: rawData.main.humidity,
        pressure: rawData.main.pressure,
        visibility: rawData.visibility / 1000, // Convert to km
        wind: {
          speed: rawData.wind.speed,
          direction: rawData.wind.deg
        },
        clouds: rawData.clouds.all,
        sunrise: new Date(rawData.sys.sunrise * 1000).toISOString(),
        sunset: new Date(rawData.sys.sunset * 1000).toISOString(),
        timestamp: new Date(rawData.dt * 1000).toISOString()
      }
    };
  }

  fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
  }

  generateForecast(currentWeather) {
    // Generate a 5-day forecast based on current weather
    // This is a simplified simulation - in production, use actual forecast API
    const forecast = [];
    const baseTemp = currentWeather.current.temperature.current;
    
    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Simulate temperature variations
      const tempVariation = (Math.random() - 0.5) * 10;
      const dayTemp = Math.round(baseTemp + tempVariation);
      const nightTemp = Math.round(dayTemp - 8);
      
      // Simulate weather conditions
      const conditions = ['Clear', 'Clouds', 'Rain', 'Thunderstorm'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        temperature: {
          day: dayTemp,
          night: nightTemp,
          min: nightTemp,
          max: dayTemp
        },
        weather: {
          main: randomCondition,
          description: this.getWeatherDescription(randomCondition),
          icon: this.getWeatherIcon(randomCondition)
        },
        humidity: currentWeather.current.humidity + (Math.random() - 0.5) * 20,
        wind: {
          speed: currentWeather.current.wind.speed + (Math.random() - 0.5) * 5
        }
      });
    }
    
    return forecast;
  }

  getWeatherDescription(main) {
    const descriptions = {
      'Clear': 'clear sky',
      'Clouds': 'scattered clouds',
      'Rain': 'light rain',
      'Thunderstorm': 'thunderstorm'
    };
    return descriptions[main] || 'unknown';
  }

  getWeatherIcon(main) {
    const icons = {
      'Clear': '01d',
      'Clouds': '03d',
      'Rain': '10d',
      'Thunderstorm': '11d'
    };
    return icons[main] || '01d';
  }

  // Get weather alerts and farming advice
  async getWeatherAlerts(city, state = null) {
    try {
      const weather = await this.getCurrentWeather(city, state);
      
      if (!weather.success) {
        return weather;
      }

      const alerts = this.generateFarmingAlerts(weather.data);
      
      return {
        success: true,
        data: {
          weather: weather.data,
          alerts: alerts,
          farmingAdvice: this.getFarmingAdvice(weather.data)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to generate weather alerts',
        error: error.message
      };
    }
  }

  generateFarmingAlerts(weatherData) {
    const alerts = [];
    const temp = weatherData.current.temperature.current;
    const humidity = weatherData.current.humidity;
    const windSpeed = weatherData.current.wind.speed;
    const weather = weatherData.current.weather.main.toLowerCase();

    // Temperature alerts
    if (temp > 30) {
      alerts.push({
        type: 'warning',
        title: 'Extreme Heat Alert',
        message: 'Very high temperatures detected. Increase irrigation frequency and provide shade for livestock.'
      });
    } else if (temp < 0) {
      alerts.push({
        type: 'warning',
        title: 'Frost Alert',
        message: 'Freezing temperatures expected. Protect sensitive crops and ensure livestock shelter.'
      });
    }

    // Humidity alerts
    if (humidity > 80) {
      alerts.push({
        type: 'info',
        title: 'High Humidity',
        message: 'High humidity may increase disease risk. Monitor crops for fungal infections.'
      });
    }

    // Wind alerts
    if (windSpeed > 25) {
      alerts.push({
        type: 'warning',
        title: 'Strong Winds',
        message: 'Strong winds detected. Secure loose equipment and check crop support structures.'
      });
    }

    // Weather condition alerts
    if (weather.includes('rain') || weather.includes('storm')) {
      alerts.push({
        type: 'info',
        title: 'Precipitation Expected',
        message: 'Rain expected. Adjust irrigation schedules and ensure proper drainage.'
      });
    }

    return alerts;
  }

  getFarmingAdvice(weatherData) {
    const temp = weatherData.current.temperature.current;
    const humidity = weatherData.current.humidity;
    const weather = weatherData.current.weather.main.toLowerCase();

    const advice = [];

    // Temperature-based advice
    if (temp > 25) {
      advice.push('Consider early morning or evening irrigation to reduce water loss');
      advice.push('Provide shade for livestock and ensure adequate water supply');
    } else if (temp < 10) {
      advice.push('Delay planting of warm-season crops');
      advice.push('Protect cold-sensitive plants with covers');
    }

    // Weather-based advice
    if (weather.includes('rain')) {
      advice.push('Reduce or skip irrigation today');
      advice.push('Ensure proper field drainage to prevent waterlogging');
    } else if (weather.includes('clear')) {
      advice.push('Good day for field operations and harvesting');
      advice.push('Monitor soil moisture levels');
    }

    // Humidity-based advice
    if (humidity > 70) {
      advice.push('Increase air circulation around crops');
      advice.push('Monitor for signs of fungal diseases');
    }

    return advice;
  }

  // Cache management
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      cacheKeys: Array.from(this.cache.keys()),
      cacheExpiry: this.cacheExpiry / (60 * 1000) // in minutes
    };
  }

  clearCache() {
    this.cache.clear();
    return { success: true, message: 'Weather cache cleared' };
  }
}

module.exports = new WeatherService();
