const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'english'
  },
  category: {
    type: String,
    enum: ['weather', 'crop', 'pest', 'market', 'scheme', 'general'],
    default: 'general'
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  feedback: {
    helpful: Boolean,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
