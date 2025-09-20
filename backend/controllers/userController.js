const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, profile } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      user.email = email;
      user.verified = false; // Reset verification if email changed
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }

    await user.save();

    // Remove password from response
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
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
        totalRevenue
      ] = await Promise.all([
        Room.countDocuments({ owner: userId }),
        Room.countDocuments({ owner: userId, isActive: true, isAvailable: true }),
        Booking.countDocuments({ ownerId: userId }),
        Booking.countDocuments({ ownerId: userId, status: 'requested' }),
        Booking.countDocuments({ ownerId: userId, status: 'confirmed' }),
        Booking.aggregate([
          { $match: { ownerId: userId, status: { $in: ['active', 'completed'] } } },
          { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
        ]).then(result => result[0]?.total || 0)
      ]);

      // Recent bookings
      const recentBookings = await Booking.find({ ownerId: userId })
        .populate('roomId', 'title')
        .populate('userId', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      stats = {
        totalRooms,
        activeRooms,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalRevenue,
        recentBookings
      };
    } else {
      // User dashboard stats
      const [
        totalBookings,
        activeBookings,
        completedBookings,
        favouriteRooms
      ] = await Promise.all([
        Booking.countDocuments({ userId: userId }),
        Booking.countDocuments({ userId: userId, status: { $in: ['confirmed', 'active'] } }),
        Booking.countDocuments({ userId: userId, status: 'completed' }),
        User.findById(userId).then(user => user?.favourites?.length || 0)
      ]);

      // Recent bookings
      const recentBookings = await Booking.find({ userId: userId })
        .populate('roomId', 'title address')
        .populate('ownerId', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      stats = {
        totalBookings,
        activeBookings,
        completedBookings,
        favouriteRooms,
        recentBookings
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
};

// @desc    Get user activity feed
// @route   GET /api/users/activity
// @access  Private
const getActivityFeed = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get recent activities based on user role
    let activities = [];

    if (req.user.role === 'owner') {
      // Owner activities: bookings, room views, etc.
      const bookingActivities = await Booking.find({ ownerId: userId })
        .populate('roomId', 'title')
        .populate('userId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      activities = bookingActivities.map(booking => ({
        type: 'booking',
        action: `New booking request for ${booking.roomId.title}`,
        user: booking.userId.name,
        timestamp: booking.createdAt,
        status: booking.status
      }));
    } else {
      // User activities: bookings, favourites, etc.
      const bookingActivities = await Booking.find({ userId: userId })
        .populate('roomId', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      activities = bookingActivities.map(booking => ({
        type: 'booking',
        action: `Booking request for ${booking.roomId.title}`,
        timestamp: booking.createdAt,
        status: booking.status
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
};

// @desc    Toggle favourite room
// @route   POST /api/users/favourites/:roomId
// @access  Private
const toggleFavourite = async (req, res) => {
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

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Initialize favourites array if it doesn't exist
    if (!user.favourites) {
      user.favourites = [];
    }

    const favouriteIndex = user.favourites.indexOf(roomId);
    let action = '';

    if (favouriteIndex > -1) {
      // Remove from favourites
      user.favourites.splice(favouriteIndex, 1);
      action = 'removed';
    } else {
      // Add to favourites
      user.favourites.push(roomId);
      action = 'added';
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Room ${action} ${action === 'added' ? 'to' : 'from'} favourites`,
      data: {
        isFavourite: action === 'added',
        favouritesCount: user.favourites.length
      }
    });
  } catch (error) {
    console.error('Toggle favourite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update favourites'
    });
  }
};

// @desc    Get favourite rooms
// @route   GET /api/users/favourites
// @access  Private
const getFavourites = async (req, res) => {
  try {
    console.log('🔍 getFavourites - Starting...');
    console.log('🔍 getFavourites - req.user exists:', !!req.user);
    console.log('🔍 getFavourites - req.user._id:', req.user?._id);
    
    const { page = 1, limit = 12 } = req.query;
    
    // Ensure user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    // Initialize favourites array if it doesn't exist
    let favourites = req.user.favourites || [];
    console.log('🔍 getFavourites - favourites length:', favourites.length);
    
    // Return empty favourites for now to test the basic flow
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const favouriteRooms = [];  // Empty for now
    const totalFavourites = 0;  // Empty for now
    const totalPages = 0;       // Empty for now

    console.log('✅ getFavourites - Returning success response');
    
    res.status(200).json({
      success: true,
      data: {
        rooms: favouriteRooms,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalFavourites,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('❌ Get favourites error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Deactivate user account
// @route   PATCH /api/users/deactivate
// @access  Private
const deactivateAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = false;
    await user.save();

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
};

// @desc    Get platform statistics (Admin only)
// @route   GET /api/users/platform-stats
// @access  Private (Admin)
const getPlatformStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOwners,
      totalRooms,
      totalBookings,
      activeBookings,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'owner' }),
      Room.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: { $in: ['confirmed', 'active'] } }),
      Booking.aggregate([
        { $match: { status: { $in: ['active', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]).then(result => result[0]?.total || 0)
    ]);

    // Monthly growth stats
    const monthlyStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOwners,
        totalRooms,
        totalBookings,
        activeBookings,
        totalRevenue,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform statistics'
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getDashboardStats,
  getActivityFeed,
  toggleFavourite,
  getFavourites,
  deactivateAccount,
  getPlatformStats
};
