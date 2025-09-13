/**
 * Mock Database for Testing
 * In-memory data storage to simulate database operations
 */

class MockDatabase {
  constructor() {
    this.users = new Map();
    this.weatherData = new Map();
    this.cropAdvice = new Map();
    this.marketPrices = new Map();
    this.governmentSchemes = new Map();
    this.chatMessages = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User operations
  async createUser(userData) {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(userId, user);
    return user;
  }

  async findUserByMobile(mobile) {
    for (const [id, user] of this.users) {
      if (user.mobile === mobile) {
        return user;
      }
    }
    return null;
  }

  async findUserById(userId) {
    return this.users.get(userId) || null;
  }

  async updateUser(userId, updateData) {
    const user = this.users.get(userId);
    if (!user) return null;
    
    const updatedUser = {
      ...user,
      ...updateData,
      updatedAt: new Date()
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Weather data operations
  async saveWeatherData(data) {
    const id = `weather_${Date.now()}`;
    const weatherRecord = {
      id,
      ...data,
      timestamp: new Date()
    };
    
    this.weatherData.set(id, weatherRecord);
    return weatherRecord;
  }

  async getWeatherData(location) {
    for (const [id, weather] of this.weatherData) {
      if (weather.location === location) {
        return weather;
      }
    }
    return null;
  }

  // Crop advice operations
  async getCropAdvice(filters = {}) {
    const advice = Array.from(this.cropAdvice.values());
    
    if (filters.crop) {
      return advice.filter(item => 
        item.crop.toLowerCase().includes(filters.crop.toLowerCase())
      );
    }
    
    return advice;
  }

  async addCropAdvice(adviceData) {
    const id = `advice_${Date.now()}`;
    const advice = {
      id,
      ...adviceData,
      createdAt: new Date()
    };
    
    this.cropAdvice.set(id, advice);
    return advice;
  }

  // Market prices operations
  async getMarketPrices(filters = {}) {
    const prices = Array.from(this.marketPrices.values());
    
    if (filters.crop) {
      return prices.filter(item => 
        item.crop.toLowerCase().includes(filters.crop.toLowerCase())
      );
    }
    
    if (filters.state) {
      return prices.filter(item => 
        item.state.toLowerCase().includes(filters.state.toLowerCase())
      );
    }
    
    return prices;
  }

  // Government schemes operations
  async getGovernmentSchemes(filters = {}) {
    const schemes = Array.from(this.governmentSchemes.values());
    
    if (filters.state) {
      return schemes.filter(scheme => 
        scheme.eligibleStates.includes('All') || 
        scheme.eligibleStates.includes(filters.state)
      );
    }
    
    return schemes;
  }

  // Chat messages operations
  async saveChatMessage(messageData) {
    const id = `msg_${Date.now()}`;
    const message = {
      id,
      ...messageData,
      timestamp: new Date()
    };
    
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatHistory(userId, limit = 50) {
    const messages = Array.from(this.chatMessages.values())
      .filter(msg => msg.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
    
    return messages.reverse();
  }

  // Initialize sample data
  initializeSampleData() {
    // Sample users
    const sampleUsers = [
      {
        id: 'user_sample_1',
        name: 'Rajesh Kumar',
        mobile: '9876543210',
        language: 'hindi',
        location: { state: 'Punjab', district: 'Ludhiana' },
        farmingDetails: {
          landSize: 10,
          cropTypes: ['wheat', 'rice'],
          farmingExperience: 15
        }
      },
      {
        id: 'user_sample_2',
        name: 'Priya Sharma',
        mobile: '8765432109',
        language: 'english',
        location: { state: 'Maharashtra', district: 'Pune' },
        farmingDetails: {
          landSize: 5,
          cropTypes: ['sugarcane', 'cotton'],
          farmingExperience: 8
        }
      }
    ];

    sampleUsers.forEach(user => {
      this.users.set(user.id, {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Sample crop advice
    const sampleCropAdvice = [
      {
        id: 'advice_1',
        crop: 'wheat',
        season: 'rabi',
        advice: 'Plant wheat seeds in November-December for best yield',
        category: 'planting',
        language: 'english'
      },
      {
        id: 'advice_2',
        crop: 'rice',
        season: 'kharif',
        advice: 'Ensure proper water management during monsoon',
        category: 'irrigation',
        language: 'english'
      },
      {
        id: 'advice_3',
        crop: 'cotton',
        season: 'kharif',
        advice: 'Use pest-resistant varieties for better crop protection',
        category: 'pest_control',
        language: 'english'
      }
    ];

    sampleCropAdvice.forEach(advice => {
      this.cropAdvice.set(advice.id, {
        ...advice,
        createdAt: new Date()
      });
    });

    // Sample market prices
    const sampleMarketPrices = [
      {
        id: 'price_1',
        crop: 'wheat',
        price: 2100,
        unit: 'per quintal',
        market: 'Ludhiana Mandi',
        state: 'Punjab',
        date: new Date()
      },
      {
        id: 'price_2',
        crop: 'rice',
        price: 1850,
        unit: 'per quintal',
        market: 'Amritsar Mandi',
        state: 'Punjab',
        date: new Date()
      },
      {
        id: 'price_3',
        crop: 'cotton',
        price: 5200,
        unit: 'per quintal',
        market: 'Pune Mandi',
        state: 'Maharashtra',
        date: new Date()
      }
    ];

    sampleMarketPrices.forEach(price => {
      this.marketPrices.set(price.id, price);
    });

    // Sample government schemes
    const sampleSchemes = [
      {
        id: 'scheme_1',
        name: 'PM-KISAN',
        description: 'Direct income support to farmers',
        benefits: '₹6000 per year in three installments',
        eligibleStates: ['All'],
        category: 'financial_support',
        applicationLink: 'https://pmkisan.gov.in'
      },
      {
        id: 'scheme_2',
        name: 'Crop Insurance Scheme',
        description: 'Insurance coverage for crop losses',
        benefits: 'Coverage up to sum insured amount',
        eligibleStates: ['All'],
        category: 'insurance',
        applicationLink: 'https://pmfby.gov.in'
      },
      {
        id: 'scheme_3',
        name: 'Punjab Farmer Debt Relief',
        description: 'Debt relief for small farmers in Punjab',
        benefits: 'Loan waiver up to ₹2 lakhs',
        eligibleStates: ['Punjab'],
        category: 'debt_relief',
        applicationLink: 'https://punjab.gov.in'
      }
    ];

    sampleSchemes.forEach(scheme => {
      this.governmentSchemes.set(scheme.id, {
        ...scheme,
        createdAt: new Date()
      });
    });

    console.log('✅ Mock database initialized with sample data');
    console.log(`📊 Sample data loaded: ${this.users.size} users, ${this.cropAdvice.size} crop advice, ${this.marketPrices.size} market prices, ${this.governmentSchemes.size} schemes`);
  }

  // Utility methods
  getAllUsers() {
    return Array.from(this.users.values());
  }

  clearAllData() {
    this.users.clear();
    this.weatherData.clear();
    this.cropAdvice.clear();
    this.marketPrices.clear();
    this.governmentSchemes.clear();
    this.chatMessages.clear();
  }

  getStats() {
    return {
      users: this.users.size,
      weatherRecords: this.weatherData.size,
      cropAdvice: this.cropAdvice.size,
      marketPrices: this.marketPrices.size,
      governmentSchemes: this.governmentSchemes.size,
      chatMessages: this.chatMessages.size
    };
  }
}

// Create singleton instance
const mockDB = new MockDatabase();

module.exports = mockDB;
