const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const {
  sendEmail,
  sendBookingConfirmationToCustomer,
  sendBookingNotificationToOwner,
  sendBookingCancellation,
  sendBookingStatusUpdate
} = require('../services/notify');
const {
  rateLimiters,
  csrfProtection,
  sanitizeInput,
  preventInjection
} = require('../middleware/advancedSecurity');

const router = express.Router();

// Apply security middleware to all booking routes
router.use(sanitizeInput);
router.use(preventInjection);
router.use(rateLimiters.booking);

// @desc    Get user's own bookings
// @route   GET /api/bookings
// @access  Private (User)
router.get('/', [
  protect,
  query('status').optional().isIn(['pending', 'confirmed', 'rejected', 'cancelled', 'active', 'completed', 'expired']).withMessage('Invalid status'),
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

    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query for user's own bookings
    let query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    // Get bookings with pagination
    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone role')
      .populate('roomId', 'title location price roomType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    // Get booking statistics
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      message: 'All bookings retrieved successfully',
      data: bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total,
        hasNextPage: skip + bookings.length < total,
        hasPrevPage: page > 1
      },
      statistics: {
        byStatus: stats,
        totalRevenue: stats.reduce((sum, stat) => sum + (stat.totalAmount || 0), 0)
      }
    });

  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/admin
// @access  Private (Admin only)
router.get('/admin', [
  protect,
  authorize('admin'),
  query('status').optional().isIn(['pending', 'confirmed', 'rejected', 'cancelled', 'active', 'completed', 'expired']).withMessage('Invalid status'),
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

    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query for all bookings (admin view)
    let query = {};
    if (status) {
      query.status = status;
    }

    // Get all bookings with pagination
    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone role')
      .populate('roomId', 'title location price roomType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total,
        hasNextPage: skip + bookings.length < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get admin bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Create new booking request
// @route   POST /api/bookings
// @access  Private (Authenticated users)
router.post('/', [
  protect,
  csrfProtection, // SECURITY: CSRF protection enabled
  body('roomId').isMongoId().withMessage('Invalid room ID'),
  body('checkInDate').isISO8601().withMessage('Invalid check-in date'),
  body('duration').isInt({ min: 1, max: 24 }).withMessage('Duration must be between 1-24 months'),
  body('seekerInfo.name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
  body('seekerInfo.phone').matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number'),
  body('seekerInfo.email').isEmail().withMessage('Invalid email address'),
  body('specialRequests').optional().isLength({ max: 500 }).withMessage('Special requests cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { roomId, checkInDate, duration, seekerInfo, specialRequests } = req.body;

    // Check if room exists and is available
    const room = await Room.findById(roomId).populate('owner', 'name email phone');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Handle case where room doesn't have an owner (for seeded data)
    let roomOwner = room.owner;
    if (!roomOwner) {
      // Create or find a default owner for rooms without owners
      const User = require('../models/User');
      let defaultOwner = await User.findOne({ email: 'default.owner@messwallah.com' });

      if (!defaultOwner) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('DefaultOwner123!', 10);
        defaultOwner = await User.create({
          name: 'Default Room Owner',
          email: 'default.owner@messwallah.com',
          password: hashedPassword,
          phone: '+919876543210',
          role: 'owner',
          isVerified: true,
          isActive: true
        });
      }

      // Update the room with default owner
      await Room.updateOne({ _id: roomId }, { $set: { owner: defaultOwner._id } });
      roomOwner = defaultOwner;
      console.log(`[SUCCESS] Assigned default owner to room: ${room.title}`);
    }

    // FIXED: Check isAvailable instead of non-existent isActive field
    if (!room.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available for booking'
      });
    }

    // Validate check-in date
    const checkIn = new Date(checkInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past'
      });
    }

    // Check for existing pending/confirmed bookings for this user and room
    const existingBooking = await Booking.findOne({
      roomId: roomId,
      userId: req.user._id,
      status: { $in: ['requested', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active booking request for this room'
      });
    }

    // Calculate pricing
    const monthlyRent = room.rentPerMonth;
    const securityDeposit = room.securityDeposit;
    const totalAmount = (monthlyRent * duration) + securityDeposit;

    // Create booking
    const booking = await Booking.create({
      roomId: roomId,
      userId: req.user._id,
      ownerId: roomOwner._id,
      checkInDate: checkIn,
      duration: parseInt(duration),
      pricing: {
        monthlyRent,
        securityDeposit,
        totalAmount
      },
      seekerInfo,
      specialRequests,
      statusHistory: [{
        status: 'requested',
        timestamp: new Date(),
        updatedBy: req.user._id
      }]
    });

    // Populate booking details
    await booking.populate([
      { path: 'roomId', select: 'title address' },
      { path: 'userId', select: 'name email phone' },
      { path: 'ownerId', select: 'name email phone' }
    ]);

    // Send email notifications
    try {
      // Email to room owner about new booking request
      await sendEmail(roomOwner.email, `New Booking Request - ${booking.bookingId}`, `
        <h2>New Booking Request</h2>
        <p>Hi ${roomOwner.name},</p>
        <p>You have received a new booking request for "${room.title}".</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>Booking ID: ${booking.bookingId}</li>
          <li>Check-in Date: ${checkIn.toLocaleDateString('en-IN')}</li>
          <li>Duration: ${duration} months</li>
          <li>Total Amount: ₹${totalAmount.toLocaleString('en-IN')}</li>
          <li>Seeker: ${seekerInfo.name}</li>
          <li>Phone: ${seekerInfo.phone}</li>
          <li>Email: ${seekerInfo.email}</li>
        </ul>
        <p>Please log in to your dashboard to review and respond to this request.</p>
        <p>Best regards,<br>MESS WALLAH Team</p>
      `);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    // Create in-app notification for owner
    try {
      const Notification = require('../models/Notification');
      await Notification.createNotification({
        userId: roomOwner._id,
        type: 'booking_request',
        title: '📋 New Booking Request',
        message: `${seekerInfo.name} requested to book ${room.title} for ${duration} months starting ${checkIn.toLocaleDateString('en-IN')}`,
        data: {
          bookingId: booking._id,
          roomId: room._id,
          amount: totalAmount,
          actionUrl: '/owner/bookings'
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('In-app notification failed:', notifyError);
    }

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully',
      data: { booking }
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking request'
    });
  }
});

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
router.get('/my-bookings', protect, [
  query('status').optional().isIn(['pending', 'confirmed', 'rejected', 'cancelled', 'active', 'completed', 'expired']).withMessage('Invalid status'),
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

    const { status, page = 1, limit = 10 } = req.query;

    // Build query based on user type
    const searchQuery = {};
    if (req.user.role === 'user') {
      searchQuery.userId = req.user.id;
    } else if (req.user.role === 'owner') {
      searchQuery.ownerId = req.user.id;
    }

    if (status) {
      searchQuery.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, totalCount] = await Promise.all([
      Booking.find(searchQuery)
        .populate('roomId', 'title images address')
        .populate('userId', 'name email phone profile.occupation')
        .populate('ownerId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Booking.countDocuments(searchQuery)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        bookings,
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
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
});

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('roomId', 'title images address amenities contact')
      .populate('userId', 'name email phone profile')
      .populate('ownerId', 'name email phone profile')
      .populate('statusHistory.updatedBy', 'name');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to view this booking
    console.log('[DEBUG] Authorization check:');
    console.log('   Booking userId:', booking.userId.toString());
    console.log('   Request user._id:', req.user._id.toString());
    console.log('   Booking ownerId:', booking.ownerId.toString());

    const userId = booking.userId._id ? booking.userId._id.toString() : booking.userId.toString();
    const ownerId = booking.ownerId._id ? booking.ownerId._id.toString() : booking.ownerId.toString();

    const isAuthorized = userId === req.user._id.toString() ||
      ownerId === req.user._id.toString();

    console.log('   Is authorized:', isAuthorized);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: { booking }
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details'
    });
  }
});

// @desc    Update booking status (confirm/reject by owner)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Room owner only)
router.patch('/:id/status', [
  protect,
  csrfProtection,
  authorize('owner'),
  body('status').isIn(['confirmed', 'rejected']).withMessage('Status must be confirmed or rejected'),
  body('reason').optional().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
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

    const { status, reason } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate('roomId', 'title address')
      .populate('userId', 'name email phone')
      .populate('ownerId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this room
    // Handle populated ownerId
    const ownerId = booking.ownerId._id ? booking.ownerId._id.toString() : booking.ownerId.toString();

    if (ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Check if booking can be updated
    if (booking.status !== 'requested') {
      return res.status(400).json({
        success: false,
        message: `Cannot update booking with status: ${booking.status}`
      });
    }

    // Update booking status
    booking.status = status;
    booking.statusHistory.push({
      status,
      timestamp: new Date(),
      updatedBy: req.user.id,
      reason
    });

    await booking.save();

    // Handle room availability based on status
    if (status === 'confirmed') {
      try {
        await Room.findByIdAndUpdate(booking.roomId._id, { isAvailable: false });
      } catch (roomError) {
        return res.status(400).json({
          success: false,
          message: roomError.message
        });
      }
    }

    // Send notifications to seeker
    try {
      const statusMessage = status === 'confirmed'
        ? 'Your booking has been confirmed! Please proceed with payment.'
        : `Your booking has been rejected.${reason ? ` Reason: ${reason}` : ''}`;

      await sendBookingStatusUpdate(
        booking.userId.email,
        booking.userId.phone,
        {
          bookingId: booking.bookingId,
          roomTitle: booking.roomId.title,
          status,
          message: statusMessage
        }
      );
    } catch (notifyError) {
      console.error('Status update notification failed:', notifyError);
    }

    // Create in-app notification
    try {
      const Notification = require('../models/Notification');
      await Notification.createNotification({
        userId: booking.userId._id,
        type: status === 'confirmed' ? 'booking_confirmed' : 'booking_rejected',
        title: status === 'confirmed' ? '✅ Booking Confirmed!' : '❌ Booking Rejected',
        message: status === 'confirmed'
          ? `Great news! Your booking for ${booking.roomId.title} has been confirmed. Please complete the payment.`
          : `Your booking request for ${booking.roomId.title} was rejected.${reason ? ` Reason: ${reason}` : ''}`,
        data: {
          bookingId: booking._id,
          roomId: booking.roomId._id,
          actionUrl: `/bookings/${booking._id}`
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('In-app notification failed:', notifyError);
    }

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: { booking }
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    });
  }
});

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private (Seeker or Owner)
router.patch('/:id/cancel', [
  protect,
  csrfProtection,
  body('reason').optional().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
], async (req, res) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate('roomId', 'title')
      .populate('userId', 'name email phone')
      .populate('ownerId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization - handle populated objects
    const userId = booking.userId._id ? booking.userId._id.toString() : booking.userId.toString();
    const ownerId = booking.ownerId._id ? booking.ownerId._id.toString() : booking.ownerId.toString();

    const isAuthorized = userId === req.user.id || ownerId === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (!['requested', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status: ${booking.status}`
      });
    }

    const wasConfirmed = booking.status === 'confirmed';

    // Update booking status
    booking.status = 'cancelled';
    booking.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      updatedBy: req.user.id,
      reason
    });

    await booking.save();

    // If booking was confirmed, make room available again
    if (wasConfirmed) {
      try {
        await Room.findByIdAndUpdate(booking.roomId._id, { isAvailable: true });
      } catch (roomError) {
        console.error('Room availability update failed:', roomError);
      }
    }

    // Send notification to the other party
    const cancelledByUser = userId === req.user.id;
    const notifyUser = cancelledByUser ? booking.ownerId : booking.userId;
    const cancelledBy = cancelledByUser ? 'guest' : 'owner';

    // Send cancellation notifications
    try {
      await sendBookingCancellation(
        notifyUser.email,
        notifyUser.phone,
        {
          bookingId: booking.bookingId,
          roomTitle: booking.roomId.title,
          reason,
          refundAmount: wasConfirmed ? booking.pricing.totalAmount : null
        }
      );
    } catch (notifyError) {
      console.error('Cancellation notification failed:', notifyError);
    }

    // Create in-app notification
    try {
      const Notification = require('../models/Notification');
      await Notification.createNotification({
        userId: notifyUser._id,
        type: 'booking_cancelled',
        title: '❌ Booking Cancelled',
        message: `Booking ${booking.bookingId} for ${booking.roomId.title} has been cancelled by the ${cancelledBy}.${reason ? ` Reason: ${reason}` : ''}`,
        data: {
          bookingId: booking._id,
          roomId: booking.roomId._id,
          actionUrl: cancelledByUser ? '/owner/bookings' : '/bookings'
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('In-app notification failed:', notifyError);
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
});

// @desc    Add message to booking
// @route   POST /api/bookings/:id/messages
// @access  Private (Seeker or Owner)
router.post('/:id/messages', protect, [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1-1000 characters')
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

    const { message } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const isAuthorized = booking.userId.toString() === req.user.id ||
      booking.ownerId.toString() === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to message on this booking'
      });
    }

    // Add message
    booking.messages = booking.messages || [];
    booking.messages.push({
      sender: req.user.id,
      message,
      timestamp: new Date()
    });

    await booking.save();

    // Populate the updated booking
    await booking.populate([
      { path: 'messages.sender', select: 'name' },
      { path: 'userId', select: 'name email' },
      { path: 'ownerId', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Message added successfully',
      data: {
        booking: {
          _id: booking._id,
          messages: booking.messages
        }
      }
    });

  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add message'
    });
  }
});

// @desc    Get booking statistics
// @route   GET /api/bookings/stats/overview
// @access  Private (Owner only)
router.get('/stats/overview', protect, authorize('owner'), async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      activeBookings,
      completedBookings,
      totalRevenue
    ] = await Promise.all([
      Booking.countDocuments({ ownerId: ownerId }),
      Booking.countDocuments({ ownerId: ownerId, status: 'requested' }),
      Booking.countDocuments({ ownerId: ownerId, status: 'confirmed' }),
      Booking.countDocuments({ ownerId: ownerId, status: 'active' }),
      Booking.countDocuments({ ownerId: ownerId, status: 'completed' }),
      Booking.aggregate([
        { $match: { ownerId: ownerId, status: { $in: ['active', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]).then(result => result[0]?.total || 0)
    ]);

    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          ownerId: ownerId,
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
        totalBookings,
        pendingBookings,
        confirmedBookings,
        activeBookings,
        completedBookings,
        totalRevenue,
        monthlyBookings
      }
    });

  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking statistics'
    });
  }
});

module.exports = router;
