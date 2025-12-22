const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Room = require('../models/Room');
const User = require('../models/User');
const Booking = require('../models/Booking');

const router = express.Router();

// @desc    Get analytics dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private (All authenticated users - role-based data)
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Get basic counts
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ isAvailable: true });
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Get room statistics by type
    const roomsByType = await Room.aggregate([
      {
        $group: {
          _id: '$roomType',
          count: { $sum: 1 },
          avgPrice: { $avg: '$rentPerMonth' }
        }
      }
    ]);

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('roomId', 'title rentPerMonth')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user statistics
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly booking trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get top locations
    const topLocations = await Room.aggregate([
      {
        $group: {
          _id: '$address.city',
          count: { $sum: 1 },
          avgPrice: { $avg: '$rentPerMonth' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      message: 'Analytics dashboard data retrieved successfully',
      data: {
        overview: {
          totalRooms,
          availableRooms,
          occupiedRooms: totalRooms - availableRooms,
          totalUsers,
          totalBookings,
          occupancyRate: totalRooms > 0 ? ((totalRooms - availableRooms) / totalRooms * 100).toFixed(1) : 0
        },
        roomsByType,
        usersByRole,
        recentBookings,
        bookingTrends,
        topLocations,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get room analytics
// @route   GET /api/analytics/rooms
// @access  Private (Admin only)
router.get('/rooms', protect, authorize('admin'), async (req, res) => {
  try {
    const roomAnalytics = await Room.aggregate([
      {
        $group: {
          _id: null,
          totalRooms: { $sum: 1 },
          avgPrice: { $avg: '$rentPerMonth' },
          minPrice: { $min: '$rentPerMonth' },
          maxPrice: { $max: '$rentPerMonth' },
          availableRooms: {
            $sum: { $cond: [{ $eq: ['$isAvailable', true] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      message: 'Room analytics retrieved successfully',
      data: roomAnalytics[0] || {
        totalRooms: 0,
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        availableRooms: 0
      }
    });

  } catch (error) {
    console.error('Room analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve room analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Track user activity
// @route   POST /api/analytics/track
// @access  Private
router.post('/track', protect, async (req, res) => {
  try {
    const { action, roomId, metadata } = req.body;

    // Log the activity (in production, save to database)
    console.log('Activity tracked:', {
      userId: req.user._id,
      action,
      roomId,
      metadata,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Activity tracked successfully',
      data: {
        action,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Track activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track activity',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get analytics summary (public endpoint for basic stats)
// @route   GET /api/analytics/summary
// @access  Public (limited data only)
router.get('/summary', async (req, res) => {
  try {
    // Get basic public statistics - SECURITY: Only expose aggregate counts, no user data
    const totalRooms = await Room.countDocuments({ isAvailable: true });
    const availableRooms = await Room.countDocuments({ isAvailable: true });
    
    // SECURITY: Don't expose exact user count to public
    const hasUsers = await User.countDocuments({ isVerified: true }) > 0;
    
    // Get room statistics by type (public data)
    const roomsByType = await Room.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: '$roomType',
          count: { $sum: 1 },
          avgPrice: { $avg: '$rentPerMonth' }
        }
      }
    ]);

    // Get top locations (public data - limited)
    const topLocations = await Room.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: '$address.city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 1, count: 1 } } // Don't expose avgPrice publicly
    ]);

    res.json({
      success: true,
      message: 'Analytics summary retrieved successfully',
      data: {
        overview: {
          totalRooms,
          availableRooms,
          occupiedRooms: totalRooms - availableRooms,
          hasActiveUsers: hasUsers, // Boolean only, not count
          occupancyRate: totalRooms > 0 ? ((totalRooms - availableRooms) / totalRooms * 100).toFixed(1) : 0
        },
        roomsByType,
        topLocations,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
