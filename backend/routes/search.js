const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Room = require('../models/Room');
const { rateLimiters } = require('../middleware/advancedSecurity');

const router = express.Router();

// Apply rate limiting
router.use(rateLimiters.general);

// @desc    Basic search for rooms
// @route   GET /api/search
// @access  Public
router.get('/', [
  query('q').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Search query must be 1-100 characters'),
  query('location').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Location must be 1-50 characters'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1-50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { q, location, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = { isAvailable: true };

    if (q) {
      searchQuery.$or = [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { 'address.city': new RegExp(q, 'i') },
        { 'address.area': new RegExp(q, 'i') },
        { 'address.state': new RegExp(q, 'i') }
      ];
    }

    if (location) {
      searchQuery.$and = searchQuery.$and || [];
      searchQuery.$and.push({
        $or: [
          { 'address.city': new RegExp(location, 'i') },
          { 'address.area': new RegExp(location, 'i') },
          { 'address.state': new RegExp(location, 'i') }
        ]
      });
    }

    // Execute search with pagination
    const rooms = await Room.find(searchQuery)
      .populate('owner', 'name phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Room.countDocuments(searchQuery);

    res.json({
      success: true,
      message: 'Search completed successfully',
      data: rooms,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNextPage: skip + rooms.length < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Advanced search with filters
// @route   POST /api/search/advanced
// @access  Public
router.post('/advanced', [
  body('location').optional().trim().isLength({ max: 50 }).withMessage('Location cannot exceed 50 characters'),
  body('roomType').optional().isIn(['bachelor', 'family', 'student', 'pg']).withMessage('Invalid room type'),
  body('priceRange.min').optional().isNumeric().withMessage('Minimum price must be a number'),
  body('priceRange.max').optional().isNumeric().withMessage('Maximum price must be a number'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array'),
  body('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  body('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1-50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      location,
      roomType,
      priceRange,
      amenities,
      maxOccupancy,
      page = 1,
      limit = 10
    } = req.body;

    const skip = (page - 1) * limit;

    // Build advanced search query
    let searchQuery = { isAvailable: true };

    if (location) {
      searchQuery.$or = [
        { 'address.city': new RegExp(location, 'i') },
        { 'address.area': new RegExp(location, 'i') },
        { 'address.state': new RegExp(location, 'i') }
      ];
    }

    if (roomType) {
      searchQuery.roomType = roomType;
    }

    if (priceRange) {
      searchQuery.rentPerMonth = {};
      if (priceRange.min) searchQuery.rentPerMonth.$gte = priceRange.min;
      if (priceRange.max) searchQuery.rentPerMonth.$lte = priceRange.max;
    }

    if (amenities && amenities.length > 0) {
      searchQuery.amenities = { $in: amenities };
    }

    if (maxOccupancy) {
      searchQuery.maxOccupancy = { $gte: maxOccupancy };
    }

    // Execute advanced search
    const rooms = await Room.find(searchQuery)
      .populate('owner', 'name phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Room.countDocuments(searchQuery);

    // Get filter statistics
    const stats = await Room.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$rentPerMonth' },
          minPrice: { $min: '$rentPerMonth' },
          maxPrice: { $max: '$rentPerMonth' },
          totalRooms: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      message: 'Advanced search completed successfully',
      data: rooms,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNextPage: skip + rooms.length < total,
        hasPrevPage: page > 1
      },
      statistics: stats[0] || {
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        totalRooms: 0
      }
    });

  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({
      success: false,
      message: 'Advanced search failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
router.get('/suggestions', [
  query('q').notEmpty().trim().isLength({ min: 1, max: 50 }).withMessage('Query is required and must be 1-50 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { q } = req.query;

    // Get location suggestions
    const locationSuggestions = await Room.aggregate([
      {
        $match: {
          isAvailable: true,
          $or: [
            { 'address.city': new RegExp(q, 'i') },
            { 'address.area': new RegExp(q, 'i') },
            { 'address.state': new RegExp(q, 'i') }
          ]
        }
      },
      {
        $group: {
          _id: { $ifNull: ['$address.city', '$city'] },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get room type suggestions
    const roomTypeSuggestions = await Room.aggregate([
      {
        $match: {
          isAvailable: true,
          roomType: new RegExp(q, 'i')
        }
      },
      {
        $group: {
          _id: '$roomType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    res.json({
      success: true,
      message: 'Search suggestions retrieved successfully',
      data: {
        locations: locationSuggestions.map(item => ({
          name: item._id,
          count: item.count
        })),
        roomTypes: roomTypeSuggestions.map(item => ({
          name: item._id,
          count: item.count
        }))
      }
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get search suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
