const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateLogin, validateRegistration } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { name, mobile } = req.body;

    // Check if user exists
    let user = await User.findOne({ name: name.trim() });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        name: name.trim(),
        mobile,
        lastLogin: new Date()
      });
      await user.save();
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'krishiconnect_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        language: user.language,
        location: user.location,
        farmingDetails: user.farmingDetails
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   POST /api/auth/voice-login
// @desc    Voice-based login
// @access  Public
router.post('/voice-login', async (req, res) => {
  try {
    const { audioData, name } = req.body;

    // In a real implementation, you would:
    // 1. Process the audio data
    // 2. Convert speech to text
    // 3. Verify the voice pattern
    // 4. Match with stored voice prints

    // For now, we'll simulate voice login
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required for voice login'
      });
    }

    let user = await User.findOne({ name: name.trim() });

    if (!user) {
      user = new User({
        name: name.trim(),
        mobile: 'voice_user_' + Date.now(),
        lastLogin: new Date()
      });
      await user.save();
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'krishiconnect_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Voice login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        language: user.language,
        location: user.location,
        farmingDetails: user.farmingDetails
      }
    });

  } catch (error) {
    console.error('Voice login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during voice login'
    });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'krishiconnect_secret_key');
    const user = await User.findById(decoded.user.id).select('-mobile');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'krishiconnect_secret_key');
    const { language, location, farmingDetails } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.user.id,
      { 
        language,
        location,
        farmingDetails
      },
      { new: true, runValidators: true }
    ).select('-mobile');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
