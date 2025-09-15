const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const geminiService = require('../config/gemini');

const router = express.Router();

// @route   POST /api/chat/ask
// @desc    Ask AnnData AI assistant powered by Gemini
// @access  Public
router.post('/ask', async (req, res) => {
  try {
    const { message, language = 'english', userId, userContext } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get AI response from Gemini
    const result = await geminiService.getCropAdvice(message.trim(), {
      ...userContext,
      language,
      userId
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || 'Failed to get AI response'
      });
    }

    // Save chat message to database if userId provided
    let chatMessageId = null;
    if (userId) {
      try {
        const chatMessage = new ChatMessage({
          userId,
          message: message.trim(),
          response: result.response,
          language,
          category: categorizeMessage(message),
          confidence: 0.95,
          cached: result.cached || false,
          timestamp: new Date()
        });
        const saved = await chatMessage.save();
        chatMessageId = saved._id;
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue without saving to DB
      }
    }

    res.json({
      success: true,
      data: {
        id: chatMessageId,
        message: message.trim(),
        response: result.response,
        cached: result.cached || false,
        timestamp: result.timestamp,
        language,
        suggestions: getSuggestions(categorizeMessage(message), language)
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
      .select('message response category createdAt cached');

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
    const { messageId, helpful, rating, comments } = req.body;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: 'Message ID is required'
      });
    }

    const chatMessage = await ChatMessage.findByIdAndUpdate(
      messageId,
      {
        feedback: { 
          helpful: Boolean(helpful), 
          rating: rating ? parseInt(rating) : undefined,
          comments: comments || '',
          timestamp: new Date()
        }
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

// @route   GET /api/chat/stats
// @desc    Get chat statistics and cache info
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.query;
    
    let stats = {
      cacheStats: geminiService.getCacheStats()
    };

    if (userId) {
      const userStats = await ChatMessage.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalChats: { $sum: 1 },
            cachedResponses: { $sum: { $cond: ['$cached', 1, 0] } },
            avgResponseTime: { $avg: '$responseTime' },
            categories: { $push: '$category' }
          }
        }
      ]);

      if (userStats.length > 0) {
        stats.userStats = userStats[0];
      }
    }

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat statistics'
    });
  }
});

// @route   POST /api/chat/clear-cache
// @desc    Clear the chat cache
// @access  Public
router.post('/clear-cache', (req, res) => {
  try {
    geminiService.clearCache();
    res.json({
      success: true,
      message: 'Chat cache cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache'
    });
  }
});

// Helper function to categorize messages
function categorizeMessage(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('temperature') || lowerMessage.includes('climate')) {
    return 'weather';
  }
  if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('grow') || lowerMessage.includes('harvest') || lowerMessage.includes('seed')) {
    return 'crop';
  }
  if (lowerMessage.includes('pest') || lowerMessage.includes('disease') || lowerMessage.includes('insect') || lowerMessage.includes('bug') || lowerMessage.includes('fungus')) {
    return 'pest';
  }
  if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('sell') || lowerMessage.includes('buy') || lowerMessage.includes('mandi')) {
    return 'market';
  }
  if (lowerMessage.includes('scheme') || lowerMessage.includes('subsidy') || lowerMessage.includes('government') || lowerMessage.includes('loan') || lowerMessage.includes('insurance')) {
    return 'scheme';
  }
  if (lowerMessage.includes('fertilizer') || lowerMessage.includes('manure') || lowerMessage.includes('nutrient') || lowerMessage.includes('soil')) {
    return 'fertilizer';
  }
  if (lowerMessage.includes('irrigation') || lowerMessage.includes('water') || lowerMessage.includes('drip') || lowerMessage.includes('sprinkler')) {
    return 'irrigation';
  }
  
  return 'general';
}

// Helper function to get suggestions based on category
function getSuggestions(category, language = 'english') {
  const suggestions = {
    english: {
      weather: ["What's the weather forecast for next week?", "When will it rain?", "Is it good weather for planting?"],
      crop: ["Best crops for this season", "How to grow wheat?", "When to harvest rice?"],
      pest: ["How to identify crop diseases?", "Organic pest control methods", "Common pests in my area"],
      market: ["Current market prices", "Best time to sell crops", "Nearby market information"],
      scheme: ["Government schemes for farmers", "How to apply for subsidies?", "Crop insurance information"],
      fertilizer: ["NPK fertilizer recommendations", "Organic fertilizer options", "Soil testing advice"],
      irrigation: ["Drip irrigation setup", "Water management tips", "Irrigation scheduling"],
      general: ["Weather forecast", "Crop advice", "Market prices", "Government schemes", "Pest control"]
    },
    hindi: {
      weather: ["अगले सप्ताह का मौसम कैसा रहेगा?", "बारिश कब होगी?", "क्या बुआई के लिए मौसम अच्छा है?"],
      crop: ["इस मौसम की बेहतरीन फसलें", "गेहूं कैसे उगाएं?", "धान की कटाई कब करें?"],
      pest: ["फसल की बीमारी कैसे पहचानें?", "जैविक कीट नियंत्रण", "मेरे क्षेत्र के आम कीट"],
      market: ["वर्तमान बाजार भाव", "फसल बेचने का सही समय", "नजदीकी मंडी की जानकारी"],
      scheme: ["किसानों के लिए सरकारी योजनाएं", "सब्सिडी के लिए आवेदन कैसे करें?", "फसल बीमा की जानकारी"],
      fertilizer: ["NPK खाद की सिफारिश", "जैविक खाद के विकल्प", "मिट्टी परीक्षण की सलाह"],
      irrigation: ["ड्रिप सिंचाई सेटअप", "पानी प्रबंधन के टिप्स", "सिंचाई का समय"],
      general: ["मौसम पूर्वानुमान", "फसल सलाह", "बाजार भाव", "सरकारी योजनाएं", "कीट नियंत्रण"]
    }
  };

  return suggestions[language]?.[category] || suggestions.english.general;
}

module.exports = router;
