# KrishiConnect - AI-Powered Digital Farming Assistant

KrishiConnect is a comprehensive digital farming platform that empowers farmers with AI-driven crop advice, weather forecasts, market prices, and government scheme information. Built with Next.js and powered by Google's Gemini AI.

## 🌟 Features

### 🤖 AI-Powered Crop Advice
- **Gemini AI Integration**: Advanced AI assistant (AnnData) for personalized farming guidance
- **Contextual Responses**: Location and farming experience-based recommendations
- **Multi-language Support**: English and Hindi with more languages coming soon
- **Real-time Chat**: Interactive chat interface with suggestion buttons
- **Response Caching**: Intelligent caching for improved performance

### 🌾 Core Farming Features
- **Weather Forecasting**: 5-day weather predictions and alerts
- **Crop Management**: Planting, irrigation, and harvesting guidance
- **Pest Control**: AI-powered pest identification and treatment recommendations
- **Market Prices**: Real-time market data and price trends
- **Government Schemes**: Information about subsidies and farming schemes
- **Soil Health**: Soil testing and fertilizer recommendations

### 💬 Interactive AI Assistant
- **Natural Language Processing**: Ask questions in plain English or Hindi
- **Farming Expertise**: Specialized knowledge of Indian agriculture
- **Seasonal Advice**: Season-specific crop recommendations
- **Fertilizer Guidance**: NPK and organic fertilizer suggestions
- **Chat History**: Previous conversations saved for reference

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd krishiConnect
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Install Gemini AI dependency**
   ```bash
   npm install @google/generative-ai
   ```

### Configuration

1. **Set up Gemini AI API Key**
   
   The Gemini AI API key is already configured in the backend (`server/config/gemini.js`):
   ```javascript
   const genAI = new GoogleGenerativeAI('AIzaSyBdm0gktnEtNSwaNVoJmUk8Q7h7nWK3KNU');
   ```

2. **Environment Variables** (Optional)
   
   Create a `.env` file in the server directory for additional configuration:
   ```env
   PORT=5001
   NODE_ENV=development
   JWT_SECRET=krishiconnect_secret_key
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5001`

2. **Start the frontend** (in a new terminal)
   ```bash
   cd krishiConnect
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`

## 🧪 Testing the AI System

### 1. Registration and Login
- Register a new user with email, password, and farming details
- Login with your credentials

### 2. AI Chat Testing
- Click the floating chat button (🤖) in the bottom-right corner
- Try these sample queries:

**Crop Advice:**
```
"How to grow wheat in Punjab during winter?"
"Best fertilizer for rice in Maharashtra"
"When should I plant tomatoes?"
```

**Pest Control:**
```
"My wheat crop has yellow leaves and spots"
"How to control aphids organically?"
"Pest management for cotton crop"
```

**Seasonal Guidance:**
```
"What crops should I grow this season?"
"Kharif season recommendations for Gujarat"
"Best time to plant vegetables"
```

**General Farming:**
```
"How to improve soil health?"
"Government schemes for farmers"
"Market prices for onions"
```

### 3. API Endpoints Testing

**AI Crop Advice:**
```bash
curl -X POST http://localhost:5001/api/crop/advice \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How to grow wheat in winter?",
    "userContext": {
      "location": {"state": "Punjab", "district": "Ludhiana"},
      "language": "english",
      "farmingDetails": {"landSize": 5, "cropTypes": ["wheat", "rice"]}
    }
  }'
```

**AI Chat:**
```bash
curl -X POST http://localhost:5001/api/chat/ask \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Best crops for this season",
    "language": "english",
    "userId": "user123",
    "userContext": {"location": {"state": "Maharashtra"}}
  }'
```

## 🏗️ Architecture

### Backend Structure
```
server/
├── config/
│   ├── gemini.js          # Gemini AI service and caching
│   └── database.js        # Database configuration
├── routes/
│   ├── auth.js           # Authentication (Supabase)
│   ├── crop.js           # AI-powered crop advice
│   ├── chat.js           # AI chat assistant
│   ├── market.js         # Market data
│   └── schemes.js        # Government schemes
├── models/               # Database models
├── utils/
│   └── mockDatabase.js   # Mock data for testing
└── server.js            # Express server
```

### Frontend Structure
```
components/
├── ui/                   # Reusable UI components
├── ChatInterface.tsx     # AI chat component
├── Dashboard.tsx         # Main dashboard
└── LoginPage.tsx         # Authentication
lib/
├── api.ts               # API client with AI endpoints
└── hooks/
    └── useAuth.tsx      # Authentication hook
```

## 🤖 AI Features

### Gemini AI Integration
- **Model**: Gemini 1.5 Flash for fast, accurate responses
- **Caching**: 24-hour response caching for performance
- **Context Awareness**: User location, farming experience, and language
- **Specialized Prompts**: Tailored for Indian agriculture

### Supported Query Types
1. **Crop Management**: Planting, care, harvesting
2. **Pest & Disease**: Identification and treatment
3. **Seasonal Advice**: Season-specific recommendations
4. **Fertilizer Guidance**: NPK and organic options
5. **Weather Planning**: Weather-based farming decisions
6. **Market Intelligence**: Price trends and selling advice
7. **Government Schemes**: Subsidies and applications

### Cache Management
- **View Cache Stats**: `GET /api/crop/cache-stats`
- **Clear Cache**: `POST /api/crop/clear-cache`
- **Chat Stats**: `GET /api/chat/stats`

## 🌐 Multi-language Support

Currently supported:
- **English**: Full AI support
- **Hindi**: Full AI support with Hindi prompts

The AI can understand and respond in both languages, with context-aware responses based on user preference.

## 📱 Mobile Responsive

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Development

### Adding New AI Features
1. Add new methods to `server/config/gemini.js`
2. Create corresponding routes in `server/routes/`
3. Update API client in `lib/api.ts`
4. Add frontend components as needed

### Customizing AI Responses
Edit the `createFarmingPrompt` method in `server/config/gemini.js` to modify how the AI responds to different types of queries.

## 🚀 Deployment

### Production Setup
1. Set up a production database (MongoDB/PostgreSQL)
2. Configure environment variables
3. Build the frontend: `npm run build`
4. Deploy backend and frontend to your preferred hosting platform

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5001
DATABASE_URL=your_database_url
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the intelligent farming advice
- **Supabase** for authentication services
- **Next.js** and **React** for the frontend framework
- **Express.js** for the backend API

---

**Made with ❤️ for farmers** 🌾👨‍🌾
