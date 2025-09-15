const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyBdm0gktnEtNSwaNVoJmUk8Q7h7nWK3KNU');

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.cache = new Map(); // Simple in-memory cache
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Generate cache key from user input
  generateCacheKey(query, context = {}) {
    const contextStr = JSON.stringify(context);
    return `${query.toLowerCase().trim()}_${contextStr}`;
  }

  // Check if cached response exists and is valid
  getCachedResponse(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      return cached.response;
    }
    return null;
  }

  // Store response in cache
  setCachedResponse(cacheKey, response) {
    this.cache.set(cacheKey, {
      response,
      timestamp: Date.now()
    });
  }

  // Create comprehensive farming prompt
  createFarmingPrompt(query, userContext = {}) {
    const { location, language = 'english', farmingDetails, season } = userContext;
    
    const systemPrompt = `You are AnnData, an expert agricultural advisor and farming assistant for Indian farmers. You have deep knowledge of:
- Indian crops, seasons, and farming practices
- Regional farming conditions across different states
- Pest and disease management
- Soil health and fertilizer recommendations
- Weather-based farming advice
- Government schemes and subsidies
- Market prices and trends
- Sustainable farming practices
- Traditional and modern farming techniques

User Context:
${location ? `Location: ${location.state}, ${location.district}` : 'Location: Not specified'}
${farmingDetails ? `Farming Experience: ${farmingDetails.farmingExperience || 'Not specified'} years` : ''}
${farmingDetails ? `Land Size: ${farmingDetails.landSize || 'Not specified'} acres` : ''}
${farmingDetails ? `Current Crops: ${farmingDetails.cropTypes ? farmingDetails.cropTypes.join(', ') : 'Not specified'}` : ''}
${season ? `Current Season: ${season}` : ''}
Language: ${language}

Guidelines for responses:
1. Provide practical, actionable advice suitable for Indian farming conditions
2. Consider regional climate, soil, and market conditions
3. Include specific timelines, quantities, and methods when relevant
4. Mention relevant government schemes or subsidies if applicable
5. Use simple, farmer-friendly language
6. Include cost-effective solutions
7. Consider both traditional wisdom and modern techniques
8. Provide seasonal recommendations when relevant
9. Include preventive measures for common issues
10. Keep responses concise but comprehensive

User Query: ${query}

Please provide detailed, practical farming advice based on the query and context above.`;

    return systemPrompt;
  }

  // Get crop advice from Gemini AI
  async getCropAdvice(query, userContext = {}) {
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(query, userContext);
      const cachedResponse = this.getCachedResponse(cacheKey);
      
      if (cachedResponse) {
        return {
          success: true,
          response: cachedResponse,
          cached: true,
          timestamp: new Date().toISOString()
        };
      }

      // Generate new response
      const prompt = this.createFarmingPrompt(query, userContext);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      // Cache the response
      this.setCachedResponse(cacheKey, response);

      return {
        success: true,
        response: response,
        cached: false,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Gemini AI Error:', error);
      return {
        success: false,
        error: error.message,
        response: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
      };
    }
  }

  // Get pest and disease advice
  async getPestAdvice(crop, symptoms, location) {
    const query = `I'm growing ${crop} and noticing these symptoms: ${symptoms}. Location: ${location}. Please help identify the issue and provide treatment recommendations.`;
    
    const context = {
      crop,
      symptoms,
      location,
      type: 'pest_disease'
    };

    return await this.getCropAdvice(query, context);
  }

  // Get seasonal farming advice
  async getSeasonalAdvice(season, location, crops = []) {
    const query = `What should I do for ${season} season farming? ${crops.length > 0 ? `I grow: ${crops.join(', ')}` : ''}`;
    
    const context = {
      season,
      location,
      crops,
      type: 'seasonal'
    };

    return await this.getCropAdvice(query, context);
  }

  // Get fertilizer recommendations
  async getFertilizerAdvice(crop, soilType, growthStage, location) {
    const query = `I need fertilizer recommendations for ${crop} in ${growthStage} stage. Soil type: ${soilType}. Location: ${location}`;
    
    const context = {
      crop,
      soilType,
      growthStage,
      location,
      type: 'fertilizer'
    };

    return await this.getCropAdvice(query, context);
  }

  // Clear cache (for maintenance)
  clearCache() {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

module.exports = new GeminiService();
