const express = require('express');
const { body, query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const {
  advancedSearch,
  getSearchSuggestions,
  getNearbyProperties,
  getFilterOptions
} = require('../controllers/searchController');

const router = express.Router();

// Rate limiting for search endpoints
const searchRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    message: 'Too many search requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const suggestionRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // 200 requests per minute (for real-time suggestions)
  message: {
    success: false,
    message: 'Too many suggestion requests. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation middleware
const validateSearchParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('minPrice')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum price must be a non-negative integer'),
  query('maxPrice')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum price must be a non-negative integer'),
  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  query('radius')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Radius must be between 1 and 100 km'),
  query('sortBy')
    .optional()
    .isIn(['price', 'rating', 'distance', 'relevance'])
    .withMessage('Sort by must be one of: price, rating, distance, relevance'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

const validateCoordinates = [
  query('latitude')
    .notEmpty()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required'),
  query('longitude')
    .notEmpty()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required'),
  query('radius')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Radius must be between 1 and 50 km')
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// @desc    Advanced search with multiple filters
// @route   GET /api/search/advanced
// @access  Public
router.get('/advanced', [
  searchRateLimit,
  validateSearchParams,
  handleValidationErrors
], advancedSearch);

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
router.get('/suggestions', [
  suggestionRateLimit,
  query('query')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Query must be between 1 and 100 characters'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be between 1 and 20'),
  handleValidationErrors
], getSearchSuggestions);

// @desc    Get nearby properties
// @route   GET /api/search/nearby
// @access  Public
router.get('/nearby', [
  searchRateLimit,
  validateCoordinates,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  handleValidationErrors
], getNearbyProperties);

// @desc    Get filter options
// @route   GET /api/search/filters
// @access  Public
router.get('/filters', [
  searchRateLimit
], getFilterOptions);

// @desc    Save search query (for logged-in users)
// @route   POST /api/search/save
// @access  Private
router.post('/save', [
  protect,
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 saves per 15 minutes
    message: {
      success: false,
      message: 'Too many save requests. Please try again later.'
    }
  }),
  body('name')
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search name is required and must be under 100 characters'),
  body('searchParams')
    .notEmpty()
    .isObject()
    .withMessage('Search parameters are required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { name, searchParams } = req.body;
    const userId = req.user.id;

    // Find user and add saved search
    const User = require('../models/User');
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize savedSearches if it doesn't exist
    if (!user.savedSearches) {
      user.savedSearches = [];
    }

    // Check if user already has this search saved
    const existingSearch = user.savedSearches.find(
      search => search.name.toLowerCase() === name.toLowerCase()
    );

    if (existingSearch) {
      return res.status(400).json({
        success: false,
        message: 'A search with this name already exists'
      });
    }

    // Add new saved search
    user.savedSearches.push({
      name,
      searchParams,
      createdAt: new Date()
    });

    // Limit to 10 saved searches per user
    if (user.savedSearches.length > 10) {
      user.savedSearches = user.savedSearches.slice(-10);
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Search saved successfully',
      data: {
        savedSearch: user.savedSearches[user.savedSearches.length - 1]
      }
    });

  } catch (error) {
    console.error('❌ Save Search Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save search',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get user's saved searches
// @route   GET /api/search/saved
// @access  Private
router.get('/saved', [
  protect,
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per 15 minutes
    message: {
      success: false,
      message: 'Too many requests. Please try again later.'
    }
  })
], async (req, res) => {
  try {
    const userId = req.user.id;
    const User = require('../models/User');
    
    const user = await User.findById(userId).select('savedSearches');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        savedSearches: user.savedSearches || []
      }
    });

  } catch (error) {
    console.error('❌ Get Saved Searches Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get saved searches',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Delete saved search
// @route   DELETE /api/search/saved/:searchId
// @access  Private
router.delete('/saved/:searchId', [
  protect,
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 deletes per 15 minutes
    message: {
      success: false,
      message: 'Too many delete requests. Please try again later.'
    }
  })
], async (req, res) => {
  try {
    const { searchId } = req.params;
    const userId = req.user.id;
    const User = require('../models/User');

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.savedSearches) {
      return res.status(404).json({
        success: false,
        message: 'No saved searches found'
      });
    }

    // Remove the search
    const initialLength = user.savedSearches.length;
    user.savedSearches = user.savedSearches.filter(
      search => search._id.toString() !== searchId
    );

    if (user.savedSearches.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Saved search not found'
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Saved search deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete Saved Search Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete saved search',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
