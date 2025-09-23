const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Room = require('../models/Room');
const User = require('../models/User');
const Booking = require('../models/Booking');

const router = express.Router();

// @desc    Get analytics dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private (Admin only)
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
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
      .populate('user', 'name email')
      .populate('room', 'title rentPerMonth')
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

// @desc    Get analytics summary (public endpoint for basic stats)
// @route   GET /api/analytics/summary
// @access  Public
router.get('/summary', async (req, res) => {
  try {
    // Get basic public statistics
    const totalRooms = await Room.countDocuments({ isActive: true });
    const availableRooms = await Room.countDocuments({ isAvailable: true, isActive: true });
    const totalUsers = await User.countDocuments({ isActive: true });
    
    // Get room statistics by type
    const roomsByType = await Room.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$roomType',
          count: { $sum: 1 },
          avgPrice: { $avg: '$rentPerMonth' }
        }
      }
    ]);

    // Get top locations (public data)
    const topLocations = await Room.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$address.city',
          count: { $sum: 1 },
          avgPrice: { $avg: '$rentPerMonth' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      message: 'Analytics summary retrieved successfully',
      data: {
        overview: {
          totalRooms,
          availableRooms,
          occupiedRooms: totalRooms - availableRooms,
          totalUsers,
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
