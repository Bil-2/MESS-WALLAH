const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Room = require('../models/Room');
const { rateLimiters } = require('../middleware/advancedSecurity');

const router = express.Router();

// Apply rate limiting
router.use(rateLimiters.general);

// @desc    Smart Search with OYO-like Ranking Algorithm
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

    // 1. Build Match Stage (Filtering)
    let matchStage = { isAvailable: true };

    if (q) {
      matchStage.$or = [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { 'address.city': new RegExp(q, 'i') },
        { 'address.area': new RegExp(q, 'i') },
        { 'address.state': new RegExp(q, 'i') }
      ];
    }

    if (location) {
      matchStage.$and = matchStage.$and || [];
      matchStage.$and.push({
        $or: [
          { 'address.city': new RegExp(location, 'i') },
          { 'address.area': new RegExp(location, 'i') },
          { 'address.state': new RegExp(location, 'i') }
        ]
      });
    }

    // 2. Execute Aggregation Pipeline
    // This is the "Brain" of the OYO-like algorithm
    const pipeline = [
      { $match: matchStage },

      // Look up owner to check verification status
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'ownerDetails'
        }
      },

      // Calculate "Smart Score"
      {
        $addFields: {
          ownerVerified: { $arrayElemAt: ["$ownerDetails.isVerified", 0] }, // Extract verification status
          ownerName: { $arrayElemAt: ["$ownerDetails.name", 0] },
          ownerEmail: { $arrayElemAt: ["$ownerDetails.email", 0] },
          ownerPhone: { $arrayElemAt: ["$ownerDetails.phone", 0] },

          // SCORING ALGORITHM
          smartScore: {
            $add: [
              // 1. Verification Boost (Highest Priority): +500
              { $cond: [{ $eq: [{ $arrayElemAt: ["$ownerDetails.isVerified", 0] }, true] }, 500, 0] },

              // 2. Featured Boost (Paid/Premium): +300
              { $cond: [{ $eq: ["$featured", true] }, 300, 0] },

              // 3. Quality Score (Rating * 20): Max 100
              { $multiply: [{ $ifNull: ["$rating", 0] }, 20] },

              // 4. Popularity Score (Logarithmic View Boost): Max ~50
              { $multiply: [{ $log10: { $add: [{ $ifNull: ["$views", 0] }, 1] } }, 10] },

              // 5. Social Proof (More than 5 reviews): +20
              { $cond: [{ $gt: [{ $ifNull: ["$totalReviews", 0] }, 5] }, 20, 0] }
            ]
          }
        }
      },

      // Sort by the calculated Smart Score
      { $sort: { smartScore: -1, createdAt: -1 } },

      // Pagination
      { $skip: skip },
      { $limit: parseInt(limit) },

      // Cleanup: Remove sensitive owner details, keep only necessary
      {
        $project: {
          ownerDetails: 0, // Remove the raw lookup array
          // Explicitly include calculated fields we want to send
          owner: {
            name: "$ownerName",
            email: "$ownerEmail",
            phone: "$ownerPhone",
            isVerified: "$ownerVerified"
          },
          // Include original fields
          title: 1, description: 1, _id: 1, price: 1, rentPerMonth: 1, securityDeposit: 1,
          address: 1, photos: 1, amenities: 1, roomType: 1, isAvailable: 1,
          rating: 1, totalReviews: 1, views: 1, featured: 1, smartScore: 1, createdAt: 1
        }
      }
    ];

    const rooms = await Room.aggregate(pipeline);

    // Get total count for pagination (using same match stage)
    const total = await Room.countDocuments(matchStage);

    res.json({
      success: true,
      message: 'Smart search completed successfully',
      data: rooms,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNextPage: skip + rooms.length < total,
        hasPrevPage: page > 1
      },
      // Debug info to show algorithm working
      algorithm: {
        type: 'weighted_smart_score',
        parameters: ['verification', 'featured', 'rating', 'views', 'reviews']
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
