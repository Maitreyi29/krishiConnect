const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateLogin, validateRegistration } = require('../middleware/validation');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = 'https://tegpctsrpuanbtzgitek.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZ3BjdHNycHVhbmJ0emdpdGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzA1MDQsImV4cCI6MjA3MzQ0NjUwNH0.WJCRMjH-WibbNwl43_-vTvQRMr493eQhVCuX7aTt8so';
const supabase = createClient(supabaseUrl, supabaseKey);

// @route   POST /api/auth/register
// @desc    Register new user with Supabase
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, mobile, email, password, language, location, farmingDetails } = req.body;

    // Basic validation
    if (!name || !mobile || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, mobile, email, and password are required'
      });
    }

    // Mobile number validation (Indian format)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid Indian mobile number'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Register user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name.trim(),
          mobile: mobile.trim(),
          language: language || 'english',
          location: location || {},
          farmingDetails: farmingDetails || {}
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name,
        mobile: data.user?.user_metadata?.mobile,
        language: data.user?.user_metadata?.language,
        location: data.user?.user_metadata?.location,
        farmingDetails: data.user?.user_metadata?.farmingDetails
      },
      session: data.session
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user with Supabase
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name,
        mobile: data.user?.user_metadata?.mobile,
        language: data.user?.user_metadata?.language,
        location: data.user?.user_metadata?.location,
        farmingDetails: data.user?.user_metadata?.farmingDetails
      },
      session: data.session
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// @route   GET /api/auth/user
// @desc    Get current user
// @access  Private
router.get('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    
    // Get user from Supabase using the token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        mobile: user.user_metadata?.mobile,
        language: user.user_metadata?.language,
        location: user.user_metadata?.location,
        farmingDetails: user.user_metadata?.farmingDetails
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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
