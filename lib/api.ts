const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// API utility functions
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('krishiconnect_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add existing headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.session) {
      this.token = response.session.access_token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('krishiconnect_token', response.session.access_token);
        localStorage.setItem('krishiconnect_user', JSON.stringify(response.user));
      }
    }

    return response;
  }

  async register(registrationData: any) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });

    if (response.success && response.token) {
      this.token = response.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('krishiconnect_token', response.token);
        localStorage.setItem('krishiconnect_user', JSON.stringify(response.user));
      }
    }

    return response;
  }

  async voiceLogin(audioData: any, name: string) {
    const response = await this.request('/auth/voice-login', {
      method: 'POST',
      body: JSON.stringify({ audioData, name }),
    });

    if (response.success && response.token) {
      this.token = response.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('krishiconnect_token', response.token);
        localStorage.setItem('krishiconnect_user', JSON.stringify(response.user));
      }
    }

    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('krishiconnect_token');
      localStorage.removeItem('krishiconnect_user');
    }
  }

  // Weather endpoints
  async getCurrentWeather(city: string, state?: string) {
    const params = new URLSearchParams({ city });
    if (state) params.append('state', state);
    
    return this.request(`/weather/current?${params.toString()}`);
  }

  async getWeatherForecast(city: string, state?: string) {
    const params = new URLSearchParams({ city });
    if (state) params.append('state', state);
    
    return this.request(`/weather/forecast?${params.toString()}`);
  }

  async getWeatherAlerts(city: string, state?: string) {
    const params = new URLSearchParams({ city });
    if (state) params.append('state', state);
    
    return this.request(`/weather/alerts?${params.toString()}`);
  }

  async getWeatherByCoordinates(lat: number, lon: number) {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString()
    });
    
    return this.request(`/weather/coordinates?${params.toString()}`);
  }

  async getWeatherCacheStats() {
    return this.request('/weather/cache-stats');
  }

  async clearWeatherCache() {
    return this.request('/weather/clear-cache', {
      method: 'POST'
    });
  }

  // Crop methods
  async getCropAdvice(crop: string, season?: string, state?: string, language?: string) {
    const params = new URLSearchParams({ crop });
    if (season) params.append('season', season);
    if (state) params.append('state', state);
    if (language) params.append('language', language);

    return this.request(`/crop/advice?${params}`);
  }

  async getAICropAdvice(query: string, userContext?: any) {
    return this.request('/crop/advice', {
      method: 'POST',
      body: JSON.stringify({ query, userContext }),
    });
  }

  async getCropList(season?: string, state?: string) {
    const params = new URLSearchParams();
    if (season) params.append('season', season);
    if (state) params.append('state', state);

    return this.request(`/crop/list?${params}`);
  }

  async getPestControl(crop: string, pestType?: string, symptoms?: string, location?: string) {
    return this.request('/crop/pest-control', {
      method: 'POST',
      body: JSON.stringify({ crop, pestType, symptoms, location }),
    });
  }

  async getSeasonalCrops(state?: string, month?: number) {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    if (month) params.append('month', month.toString());

    return this.request(`/crop/seasonal?${params}`);
  }

  async getAISeasonalAdvice(season?: string, location?: any, crops?: string[], userContext?: any) {
    return this.request('/crop/seasonal', {
      method: 'POST',
      body: JSON.stringify({ season, location, crops, userContext }),
    });
  }

  async getFertilizerAdvice(crop: string, soilType?: string, growthStage?: string, location?: any, userContext?: any) {
    return this.request('/crop/fertilizer', {
      method: 'POST',
      body: JSON.stringify({ crop, soilType, growthStage, location, userContext }),
    });
  }

  async getCropCacheStats() {
    return this.request('/crop/cache-stats');
  }

  async clearCropCache() {
    return this.request('/crop/clear-cache', {
      method: 'POST',
    });
  }

  // Market methods
  async getMarketPrices(crop?: string, state?: string, district?: string, limit?: number) {
    const params = new URLSearchParams();
    if (crop) params.append('crop', crop);
    if (state) params.append('state', state);
    if (district) params.append('district', district);
    if (limit) params.append('limit', limit.toString());

    return this.request(`/market/prices?${params}`);
  }

  async getMarketTrends(crop: string, days: number = 30) {
    const params = new URLSearchParams({
      crop,
      days: days.toString(),
    });

    return this.request(`/market/trends?${params}`);
  }

  async getNearbyMarkets(lat: number, lon: number, radius: number = 50) {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      radius: radius.toString(),
    });

    return this.request(`/market/nearby?${params}`);
  }

  async setPriceAlert(crop: string, targetPrice: number, alertType: string, contact: string) {
    return this.request('/market/price-alert', {
      method: 'POST',
      body: JSON.stringify({ crop, targetPrice, alertType, contact }),
    });
  }

  // Government schemes methods
  async getSchemes(state?: string, farmerType?: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    if (farmerType) params.append('farmerType', farmerType);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return this.request(`/schemes/list?${params}`);
  }

  async getSchemeDetails(id: string) {
    return this.request(`/schemes/${id}`);
  }

  async checkEligibility(eligibilityData: any) {
    return this.request('/schemes/eligibility-check', {
      method: 'POST',
      body: JSON.stringify(eligibilityData),
    });
  }

  async getSchemeCategories() {
    return this.request('/schemes/categories/list');
  }

  // Chat methods
  async askAnnData(message: string, language?: string, userId?: string, userContext?: any) {
    return this.request('/chat/ask', {
      method: 'POST',
      body: JSON.stringify({ message, language, userId, userContext }),
    });
  }

  async getChatHistory(userId: string, limit?: number) {
    const params = new URLSearchParams({ userId });
    if (limit) params.append('limit', limit.toString());

    return this.request(`/chat/history?${params}`);
  }

  async submitFeedback(messageId: string, helpful: boolean, rating?: number, comments?: string) {
    return this.request('/chat/feedback', {
      method: 'POST',
      body: JSON.stringify({ messageId, helpful, rating, comments }),
    });
  }

  async getChatStats(userId?: string) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);

    return this.request(`/chat/stats?${params}`);
  }

  async clearChatCache() {
    return this.request('/chat/clear-cache', {
      method: 'POST',
    });
  }

  // New AI-powered chat methods
  async askGemini(message: string, language?: string, userId?: string) {
    return this.request('/chat/gemini', {
      method: 'POST',
      body: JSON.stringify({ message, language, userId }),
    });
  }

  async getGeminiChatHistory(userId: string, limit?: number) {
    const params = new URLSearchParams({ userId });
    if (limit) params.append('limit', limit.toString());

    return this.request(`/chat/gemini/history?${params}`);
  }

  async submitGeminiFeedback(messageId: string, helpful: boolean, rating?: number) {
    return this.request('/chat/gemini/feedback', {
      method: 'POST',
      body: JSON.stringify({ messageId, helpful, rating }),
    });
  }

  // Voice API
  async textToSpeech(text: string, language: string): Promise<Blob> {
    const response = await this.request('/voice/text-to-speech', {
      method: 'POST',
      body: JSON.stringify({ text, language }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
