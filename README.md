# KrishiConnect - Smart Farming Assistant

KrishiConnect is an AI-powered farming assistant designed specifically for Indian farmers. It provides multilingual support, weather forecasts, crop advice, market prices, government schemes information, and an intelligent chat assistant (annData) to help farmers make informed decisions.

## 🌟 Features

### Frontend Features
- **Multilingual Support**: 11 languages including Hindi, Tamil, Bengali, Marathi, Gujarati, Punjabi, Kannada, Telugu, Bhojpuri, Odia, and English
- **Modern UI/UX**: Beautiful glassmorphism design with responsive layout
- **Voice Login**: Voice authentication support (coming soon)
- **Dynamic Language Switching**: Real-time UI language updates
- **Mobile-First Design**: Optimized for all device sizes

### Backend Features
- **User Authentication**: JWT-based secure authentication system
- **Weather Integration**: Real-time weather data and forecasts
- **Crop Advice**: Comprehensive crop guidance and recommendations
- **Pest Control**: Pest identification and treatment suggestions
- **Market Prices**: Live market prices and trends
- **Government Schemes**: Information about farming subsidies and schemes
- **AI Chat Assistant (annData)**: Intelligent farming assistant with multilingual support

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (optional - app works without it for demo)
- npm or yarn

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
   cd ..
   ```

4. **Environment Setup**
   
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```
   
   Create `.env` in the server directory:
   ```env
   NODE_ENV=development
   PORT=5001
   FRONTEND_URL=http://localhost:3002
   MONGODB_URI=mongodb://localhost:27017/krishiconnect
   JWT_SECRET=your_jwt_secret_key_here
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

5. **Start the servers**
   
   Start backend server:
   ```bash
   cd server
   PORT=5001 node server.js
   ```
   
   Start frontend server (in a new terminal):
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:5001/api

## 📁 Project Structure

```
krishiConnect/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Dashboard.tsx     # Main dashboard component
│   └── LoginPage.tsx     # Login page component
├── lib/                  # Utility libraries
│   ├── hooks/           # Custom React hooks
│   └── api.ts           # API client
├── server/              # Backend server
│   ├── config/         # Configuration files
│   ├── middleware/     # Express middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.js       # Main server file
└── public/             # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/voice-login` - Voice login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Weather
- `GET /api/weather/current` - Current weather
- `GET /api/weather/forecast` - Weather forecast

### Crop Management
- `GET /api/crop/advice` - Crop advice
- `GET /api/crop/list` - Available crops
- `POST /api/crop/pest-control` - Pest control advice
- `GET /api/crop/seasonal` - Seasonal crop recommendations

### Market Information
- `GET /api/market/prices` - Market prices
- `GET /api/market/trends` - Price trends
- `GET /api/market/nearby` - Nearby markets
- `POST /api/market/price-alert` - Set price alerts

### Government Schemes
- `GET /api/schemes/list` - List schemes
- `GET /api/schemes/:id` - Scheme details
- `POST /api/schemes/eligibility-check` - Check eligibility
- `GET /api/schemes/categories/list` - Scheme categories

### AI Chat (annData)
- `POST /api/chat/ask` - Ask AI assistant
- `GET /api/chat/history` - Chat history
- `POST /api/chat/feedback` - Submit feedback

## 🌍 Supported Languages

1. English
2. Hindi (हिंदी)
3. Tamil (தமிழ்)
4. Bengali (বাংলা)
5. Marathi (मराठी)
6. Gujarati (ગુજરાતી)
7. Punjabi (ਪੰਜਾਬੀ)
8. Kannada (ಕನ್ನಡ)
9. Telugu (తెలుగు)
10. Bhojpuri (भोजपुरी)
11. Odia (ଓଡ଼ିଆ)

## 🧪 Testing

### Backend API Testing
```bash
# Health check
curl -X GET http://localhost:5001/api/health

# Test chat functionality
curl -X POST http://localhost:5001/api/chat/ask \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, I need help with farming", "language": "english"}'

# Test weather (requires API key)
curl -X GET "http://localhost:5001/api/weather/current?lat=28.6139&lon=77.2090"
```

### Frontend Testing
1. Open http://localhost:3002
2. Test language switching
3. Try login functionality
4. Navigate through different features

## 🔐 Security Features

- JWT-based authentication
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS configuration
- Input validation and sanitization
- Secure password hashing (for mobile numbers)

## 🚧 Development Notes

### Current Status
- ✅ Complete backend API structure
- ✅ Frontend with multilingual support
- ✅ Authentication system
- ✅ AI chat functionality
- ✅ Weather integration ready
- ✅ Market prices API
- ✅ Government schemes API
- ⚠️ MongoDB integration (optional for demo)
- 🔄 External API integrations (requires API keys)

### Known Limitations
- MongoDB connection is disabled for demo purposes
- External API integrations require valid API keys
- Voice login is placeholder functionality
- Some features return sample data when database is not connected

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for Indian farmers**
