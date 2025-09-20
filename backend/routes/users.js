const express = require('express');
const { query, validationResult } = require('express-validator');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const {
  protect,
  authorize
} = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getDashboardStats,
  getActivityFeed,
  toggleFavourite,
  getFavourites,
  deactivateAccount,
  getPlatformStats
} = require('../controllers/userController');

const router = express.Router();

// @desc    Get all users (for admin purposes)
// @route   GET /api/users
// @access  Private (Admin only - for future implementation)
router.get('/', protect, authorize('admin'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1-50'),
  query('role').optional().isIn(['user', 'owner', 'admin']).withMessage('Invalid user role'),
  query('isActive').optional().isBoolean().withMessage('isActive must be boolean')
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

    const { page = 1, limit = 20, role, isActive, search } = req.query;

    // Build search query
    const searchQuery = {};

    if (role) {
      searchQuery.role = role;
    }

    if (isActive !== undefined) {
      searchQuery.isActive = isActive === 'true';
    }

    if (search) {
      searchQuery.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, totalCount] = await Promise.all([
      User.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(searchQuery)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// @desc    Get user favorites (MUST BE BEFORE /:id route)
// @route   GET /api/users/my-favorites
// @access  Private
router.get('/my-favorites', protect, (req, res) => {
  console.log('🔍 My-Favorites route hit with user:', req.user?._id);
  res.json({
    success: true,
    message: 'My favorites endpoint working',
    data: {
      rooms: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalFavourites: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    }
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -securityInfo');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          profile: user.profile || {},
          preferences: user.preferences || {},
          favourites: user.favourites || [],
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, updateUserProfile);

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard/stats
// @access  Private
router.get('/dashboard/stats', protect, getDashboardStats);

// @desc    Get user activity feed
// @route   GET /api/users/dashboard/activity
// @access  Private
router.get('/dashboard/activity', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1-20')
], getActivityFeed);

// @desc    Get user by ID (MUST BE AFTER specific routes)
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Only allow users to view their own profile or public info
    const isOwnProfile = user._id.toString() === req.user.id;

    let userData;
    if (isOwnProfile) {
      userData = user.toObject();
    } else {
      // Return limited public information
      userData = {
        _id: user._id,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        profile: {
          city: user.profile?.city,
          state: user.profile?.state,
          bio: user.profile?.bio
        },
        createdAt: user.createdAt
      };
    }

    res.status(200).json({
      success: true,
      data: { user: userData }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
});

// @desc    Toggle favorite room
// @route   POST /api/users/favorites/:roomId
// @access  Private
router.post('/favorites/:roomId', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;
    
    // Simple toggle favorite implementation
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const favoriteIndex = user.favourites.indexOf(roomId);
    if (favoriteIndex > -1) {
      // Remove from favorites
      user.favourites.splice(favoriteIndex, 1);
    } else {
      // Add to favorites
      user.favourites.push(roomId);
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: favoriteIndex > -1 ? 'Removed from favorites' : 'Added to favorites',
      data: {
        isFavorite: favoriteIndex === -1,
        totalFavorites: user.favourites.length
      }
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle favorite'
    });
  }
});

// @desc    Remove room from favorites
// @route   DELETE /api/users/favorites/:roomId
// @access  Private
router.delete('/favorites/:roomId', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const favoriteIndex = user.favourites.indexOf(roomId);
    if (favoriteIndex > -1) {
      // Remove from favorites
      user.favourites.splice(favoriteIndex, 1);
      await user.save();
      
      res.json({
        success: true,
        message: 'Removed from favorites successfully',
        data: {
          isFavorite: false,
          totalFavorites: user.favourites.length
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Room not found in favorites'
      });
    }
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from favorites'
    });
  }
});

// @desc    Get platform statistics (public)
// @route   GET /api/users/stats/platform
// @access  Public
router.get('/stats/platform', getPlatformStats);

// ...
// @route   PATCH /api/users/deactivate
// @access  Private
router.patch('/deactivate', protect, deactivateAccount);

// @desc    Reactivate user account
// @route   PATCH /api/users/reactivate
// @access  Private
router.patch('/reactivate', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Reactivate user
    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account reactivated successfully. You can now reactivate your rooms manually.'
    });

  } catch (error) {
    console.error('Reactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate account'
    });
  }
});

module.exports = router;
