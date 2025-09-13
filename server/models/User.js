const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number']
  },
  language: {
    type: String,
    enum: ['english', 'hindi', 'tamil', 'bengali', 'marathi', 'gujarati', 'punjabi', 'kannada', 'telugu', 'bhojpuri', 'odia'],
    default: 'english'
  },
  location: {
    state: String,
    district: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  farmingDetails: {
    landSize: Number, // in acres
    cropTypes: [String],
    farmingExperience: Number // in years
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash mobile number before saving (for basic security)
userSchema.pre('save', async function(next) {
  if (!this.isModified('mobile')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.mobile = await bcrypt.hash(this.mobile, salt);
  next();
});

// Compare mobile number
userSchema.methods.compareMobile = async function(enteredMobile) {
  return await bcrypt.compare(enteredMobile, this.mobile);
};

module.exports = mongoose.model('User', userSchema);
