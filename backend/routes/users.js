const express = require('express');
const { query, validationResult } = require('express-validator');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (for admin purposes)
// @route   GET /api/users
// @access  Private (Admin only - for future implementation)
router.get('/', protect, [
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

// @desc    Get user by ID
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

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard/stats
// @access  Private
router.get('/dashboard/stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === 'owner') {
      // Owner dashboard stats
      const [
        totalRooms,
        activeRooms,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalViews,
        monthlyRevenue
      ] = await Promise.all([
        Room.countDocuments({ ownerId: userId }),
        Room.countDocuments({ ownerId: userId, isActive: true, isAvailable: true }),
        Booking.countDocuments({ ownerId: userId }),
        Booking.countDocuments({ ownerId: userId, status: 'requested' }),
        Booking.countDocuments({ ownerId: userId, status: 'confirmed' }),
        Room.aggregate([
          { $match: { ownerId: userId } },
          { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]).then(result => result[0]?.totalViews || 0),
        Booking.aggregate([
          {
            $match: {
              ownerId: userId,
              status: { $in: ['confirmed', 'completed'] },
              createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            }
          },
          { $group: { _id: null, revenue: { $sum: '$pricing.totalAmount' } } }
        ]).then(result => result[0]?.revenue || 0)
      ]);

      stats = {
        totalRooms,
        activeRooms,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalViews,
        monthlyRevenue
      };

    } else if (userRole === 'user') {
      // User dashboard stats
      const [
        totalBookings,
        activeBookings,
        completedBookings,
        savedRooms,
        totalSpent
      ] = await Promise.all([
        Booking.countDocuments({ userId: userId }),
        Booking.countDocuments({ userId: userId, status: 'confirmed' }),
        Booking.countDocuments({ userId: userId, status: 'completed' }),
        // Assuming saved rooms feature will be implemented later
        0,
        Booking.aggregate([
          {
            $match: {
              userId: userId,
              status: { $in: ['confirmed', 'completed'] }
            }
          },
          { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
        ]).then(result => result[0]?.total || 0)
      ]);

      stats = {
        totalBookings,
        activeBookings,
        completedBookings,
        savedRooms,
        totalSpent
      };
    }

    res.status(200).json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// @desc    Get user activity feed
// @route   GET /api/users/dashboard/activity
// @access  Private
router.get('/dashboard/activity', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1-20')
], async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let activities = [];

    if (userRole === 'owner') {
      // Get recent bookings and room activities
      const recentBookings = await Booking.find({ ownerId: userId })
        .populate('roomId', 'title')
        .populate('userId', 'name')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .lean();

      activities = recentBookings.map(booking => ({
        type: 'booking',
        action: `New booking request for "${booking.roomId.title}"`,
        details: `${booking.userId.name} requested to book your room`,
        status: booking.status,
        timestamp: booking.createdAt,
        bookingId: booking.bookingId
      }));

    } else if (userRole === 'user') {
      // Get user's booking activities
      const userBookings = await Booking.find({ userId: userId })
        .populate('roomId', 'title')
        .populate('ownerId', 'name')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .lean();

      activities = userBookings.map(booking => ({
        type: 'booking',
        action: `Booking request for "${booking.roomId.title}"`,
        details: `Status: ${booking.status}`,
        status: booking.status,
        timestamp: booking.createdAt,
        bookingId: booking.bookingId
      }));
    }

    res.status(200).json({
      success: true,
      data: { activities }
    });

  } catch (error) {
    console.error('Get activity feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity feed'
    });
  }
});

// @desc    Get platform statistics (public)
// @route   GET /api/users/stats/platform
// @access  Public
router.get('/stats/platform', async (req, res) => {
  try {
    const [
      totalUsers,
      totalOwners,
      totalSeekers,
      totalRooms,
      totalBookings,
      citiesCount
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'owner', isActive: true }),
      User.countDocuments({ role: 'user', isActive: true }),
      Room.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Room.distinct('address.city', { isActive: true }).then(cities => cities.length)
    ]);

    // Get top cities by room count
    const topCities = await Room.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$address.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOwners,
        totalSeekers,
        totalRooms,
        totalBookings,
        citiesCount,
        topCities
      }
    });

  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform statistics'
    });
  }
});

// @desc    Deactivate user account
// @route   PATCH /api/users/deactivate
// @access  Private
router.patch('/deactivate', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Deactivate user
    user.isActive = false;
    await user.save();

    // If owner, deactivate all their rooms
    if (user.role === 'owner') {
      await Room.updateMany(
        { ownerId: req.user.id },
        { isActive: false, isAvailable: false }
      );
    }

    // Cancel all pending bookings
    await Booking.updateMany(
      {
        $or: [
          { userId: req.user.id },
          { ownerId: req.user.id }
        ],
        status: 'requested'
      },
      {
        status: 'cancelled',
        $push: {
          statusHistory: {
            status: 'cancelled',
            timestamp: new Date(),
            updatedBy: req.user.id,
            reason: 'Account deactivated'
          }
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate account'
    });
  }
});

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
