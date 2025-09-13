const express = require('express');
const ChatMessage = require('../models/ChatMessage');

const router = express.Router();

// @route   POST /api/chat/ask
// @desc    Ask annData AI assistant
// @access  Public
router.post('/ask', async (req, res) => {
  try {
    const { message, language = 'english', userId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Analyze message to determine category
    const category = categorizeMessage(message);
    
    // Generate AI response based on message content and language
    const response = await generateAIResponse(message, language, category);

    // Save chat message to database
    if (userId) {
      const chatMessage = new ChatMessage({
        userId,
        message,
        response: response.text,
        language,
        category,
        confidence: response.confidence
      });
      await chatMessage.save();
    }

    res.json({
      success: true,
      data: {
        message,
        response: response.text,
        category,
        confidence: response.confidence,
        suggestions: response.suggestions || []
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message'
    });
  }
});

// @route   GET /api/chat/history
// @desc    Get chat history for user
// @access  Public
router.get('/history', async (req, res) => {
  try {
    const { userId, limit = 20 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const history = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('message response category createdAt');

    res.json({
      success: true,
      data: history.reverse() // Show oldest first
    });

  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history'
    });
  }
});

// @route   POST /api/chat/feedback
// @desc    Submit feedback for AI response
// @access  Public
router.post('/feedback', async (req, res) => {
  try {
    const { messageId, helpful, rating } = req.body;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: 'Message ID is required'
      });
    }

    const chatMessage = await ChatMessage.findByIdAndUpdate(
      messageId,
      {
        feedback: { helpful, rating }
      },
      { new: true }
    );

    if (!chatMessage) {
      return res.status(404).json({
        success: false,
        message: 'Chat message not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

// Helper function to categorize messages
function categorizeMessage(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('temperature')) {
    return 'weather';
  }
  if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('grow')) {
    return 'crop';
  }
  if (lowerMessage.includes('pest') || lowerMessage.includes('disease') || lowerMessage.includes('insect')) {
    return 'pest';
  }
  if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('sell')) {
    return 'market';
  }
  if (lowerMessage.includes('scheme') || lowerMessage.includes('subsidy') || lowerMessage.includes('government')) {
    return 'scheme';
  }
  
  return 'general';
}

// Helper function to generate AI responses
async function generateAIResponse(message, language, category) {
  const responses = {
    english: {
      weather: {
        greetings: [
          "I can help you with weather information! ",
          "Let me assist you with weather-related queries. ",
          "Weather is crucial for farming decisions. "
        ],
        responses: [
          "For accurate weather forecasts, I recommend checking the weather section in the app. You can get 5-day forecasts, rainfall predictions, and weather alerts for your area.",
          "Weather planning is essential for successful farming. The app provides real-time weather data, including temperature, humidity, and rainfall forecasts.",
          "To get the most current weather information, please enable location services and check the weather feature. It provides detailed forecasts and farming-specific weather alerts."
        ]
      },
      crop: {
        greetings: [
          "I'm here to help with your crop-related questions! ",
          "Let me provide you with crop guidance. ",
          "Crop management is key to successful farming. "
        ],
        responses: [
          "For specific crop advice, please visit the Crop Advice section. You can get information about planting, irrigation, fertilization, and harvesting for various crops.",
          "Each crop has specific requirements for soil, water, and nutrients. The app provides detailed guidance based on your location and season.",
          "I recommend checking the seasonal crop recommendations in the app. It provides information about the best crops to grow in your area during different seasons."
        ]
      },
      pest: {
        greetings: [
          "I can help you with pest and disease management! ",
          "Pest control is important for healthy crops. ",
          "Let me assist you with pest-related concerns. "
        ],
        responses: [
          "For pest identification and treatment, please use the Pest Control section. You can get information about common pests, organic solutions, and preventive measures.",
          "Early detection and proper treatment are crucial for pest management. The app provides both organic and chemical treatment options.",
          "Regular monitoring and preventive measures are the best approach to pest control. Check the pest management guidelines in the app."
        ]
      },
      market: {
        greetings: [
          "I can help you with market information! ",
          "Market prices are important for farming decisions. ",
          "Let me assist you with market-related queries. "
        ],
        responses: [
          "For current market prices, please check the Market Prices section. You can see prices for different crops in various markets near your location.",
          "Market trends and price history can help you make better selling decisions. The app provides detailed market analysis and price alerts.",
          "To get the best prices for your produce, compare prices across different markets using the market section in the app."
        ]
      },
      scheme: {
        greetings: [
          "I can help you with government schemes! ",
          "There are many schemes available for farmers. ",
          "Let me assist you with scheme information. "
        ],
        responses: [
          "For government schemes and subsidies, please check the Government Schemes section. You can find schemes based on your eligibility and location.",
          "Many schemes offer financial assistance, subsidies, and support for farmers. The app helps you find schemes you're eligible for.",
          "To apply for schemes, check the eligibility criteria and application process in the Government Schemes section."
        ]
      },
      general: {
        greetings: [
          "Hello! I'm annData, your farming assistant. ",
          "Hi there! I'm here to help with your farming needs. ",
          "Welcome! I'm your digital farming companion. "
        ],
        responses: [
          "I can help you with weather forecasts, crop advice, pest control, market prices, and government schemes. What would you like to know?",
          "The app has many features to help farmers like you. You can check weather, get crop advice, find market prices, and learn about government schemes.",
          "I'm here to provide farming guidance and information. Feel free to ask about crops, weather, markets, or any farming-related topics!"
        ]
      }
    },
    hindi: {
      weather: {
        greetings: [
          "मैं मौसम की जानकारी में आपकी मदद कर सकता हूं! ",
          "मौसम संबंधी प्रश्नों में आपकी सहायता करता हूं। ",
          "मौसम खेती के फैसलों के लिए महत्वपूर्ण है। "
        ],
        responses: [
          "सटीक मौसम पूर्वानुमान के लिए, मैं ऐप में मौसम सेक्शन देखने की सलाह देता हूं। आप अपने क्षेत्र के लिए 5-दिन का पूर्वानुमान, बारिश की भविष्यवाणी और मौसम अलर्ट प्राप्त कर सकते हैं।",
          "मौसम की योजना सफल खेती के लिए आवश्यक है। ऐप वास्तविक समय का मौसम डेटा प्रदान करता है, जिसमें तापमान, आर्द्रता और बारिश का पूर्वानुमान शामिल है।",
          "सबसे वर्तमान मौसम जानकारी प्राप्त करने के लिए, कृपया स्थान सेवाएं सक्षम करें और मौसम सुविधा देखें।"
        ]
      },
      general: {
        greetings: [
          "नमस्ते! मैं annData हूं, आपका खेती सहायक। ",
          "नमस्कार! मैं आपकी खेती की जरूरतों में मदद के लिए यहां हूं। ",
          "स्वागत है! मैं आपका डिजिटल खेती साथी हूं। "
        ],
        responses: [
          "मैं मौसम पूर्वानुमान, फसल सलाह, कीट नियंत्रण, बाजार मूल्य और सरकारी योजनाओं में आपकी मदद कर सकता हूं। आप क्या जानना चाहते हैं?",
          "ऐप में आप जैसे किसानों की मदद के लिए कई सुविधाएं हैं। आप मौसम देख सकते हैं, फसल सलाह प्राप्त कर सकते हैं, बाजार मूल्य पा सकते हैं और सरकारी योजनाओं के बारे में जान सकते हैं।",
          "मैं खेती मार्गदर्शन और जानकारी प्रदान करने के लिए यहां हूं। फसल, मौसम, बाजार या किसी भी खेती संबंधी विषय के बारे में बेझिझक पूछें!"
        ]
      }
    }
  };

  const langResponses = responses[language] || responses.english;
  const categoryResponses = langResponses[category] || langResponses.general;
  
  const greeting = categoryResponses.greetings[Math.floor(Math.random() * categoryResponses.greetings.length)];
  const response = categoryResponses.responses[Math.floor(Math.random() * categoryResponses.responses.length)];
  
  return {
    text: greeting + response,
    confidence: 0.85,
    suggestions: getSuggestions(category, language)
  };
}

// Helper function to get suggestions
function getSuggestions(category, language) {
  const suggestions = {
    english: {
      weather: ["Check 5-day forecast", "Weather alerts", "Rainfall prediction"],
      crop: ["Seasonal crops", "Planting guide", "Irrigation tips"],
      pest: ["Pest identification", "Organic solutions", "Prevention methods"],
      market: ["Current prices", "Price trends", "Nearby markets"],
      scheme: ["Eligible schemes", "Application process", "Subsidy calculator"],
      general: ["Weather forecast", "Crop advice", "Market prices", "Government schemes"]
    },
    hindi: {
      weather: ["5-दिन का पूर्वानुमान देखें", "मौसम अलर्ट", "बारिश की भविष्यवाणी"],
      crop: ["मौसमी फसलें", "बुआई गाइड", "सिंचाई टिप्स"],
      pest: ["कीट पहचान", "जैविक समाधान", "रोकथाम के तरीके"],
      market: ["वर्तमान मूल्य", "मूल्य रुझान", "नजदीकी बाजार"],
      scheme: ["योग्य योजनाएं", "आवेदन प्रक्रिया", "सब्सिडी कैलकुलेटर"],
      general: ["मौसम पूर्वानुमान", "फसल सलाह", "बाजार मूल्य", "सरकारी योजनाएं"]
    }
  };

  return suggestions[language]?.[category] || suggestions.english.general;
}

module.exports = router;
