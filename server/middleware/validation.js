const Joi = require('joi');

// Validation middleware for login
const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters'
    }),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
      'string.empty': 'Mobile number is required',
      'string.pattern.base': 'Please enter a valid Indian mobile number'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

// Validation middleware for registration
const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    language: Joi.string().valid('english', 'hindi', 'tamil', 'bengali', 'marathi', 'gujarati', 'punjabi', 'kannada', 'telugu', 'bhojpuri', 'odia').optional(),
    location: Joi.object({
      state: Joi.string().optional(),
      district: Joi.string().optional(),
      coordinates: Joi.object({
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional()
      }).optional()
    }).optional(),
    farmingDetails: Joi.object({
      landSize: Joi.number().positive().optional(),
      cropTypes: Joi.array().items(Joi.string()).optional(),
      farmingExperience: Joi.number().min(0).optional()
    }).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateLogin,
  validateRegistration
};
