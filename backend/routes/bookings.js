const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { sendEmail } = require('../services/notify');
const { rateLimiters, csrfProtection } = require('../middleware/advancedSecurity');

const router = express.Router();

// Apply rate limiting to all booking routes
router.use(rateLimiters.general);

// @desc    Create new booking request
// @route   POST /api/bookings
// @access  Private (Room seekers only)
router.post('/', [
  protect,
  csrfProtection,
  authorize('user', 'student'),
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

    if (!room.isActive || !room.isAvailable) {
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
      userId: req.user.id,
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
      userId: req.user.id,
      ownerId: room.owner._id,
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
        updatedBy: req.user.id
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
      // Email to room owner
      await sendEmail(room.owner.email, `New Booking Request - ${booking.bookingId}`, `
        <h2>New Booking Request</h2>
        <p>Hi ${room.owner.name},</p>
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
    const isAuthorized = booking.userId.toString() === req.user.id ||
      booking.ownerId.toString() === req.user.id;

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
    if (booking.ownerId.toString() !== req.user.id) {
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

    // Send email notification to seeker
    try {
      if (status === 'confirmed') {
        await sendEmail(booking.userId.email, `Booking Confirmed - ${booking.bookingId}`, `
          <h2>Booking Confirmed</h2>
          <p>Hi ${booking.userId.name},</p>
          <p>Your booking request for "${booking.roomId.title}" has been confirmed!</p>
          <p><strong>Booking Details:</strong></p>
          <ul>
            <li>Booking ID: ${booking.bookingId}</li>
            <li>Check-in Date: ${booking.checkInDate.toLocaleDateString('en-IN')}</li>
            <li>Duration: ${booking.duration} months</li>
            <li>Total Amount: ₹${booking.pricing.totalAmount.toLocaleString('en-IN')}</li>
          </ul>
          <p>Owner Contact: ${booking.ownerId.name} - ${booking.ownerId.phone}</p>
          <p>Best regards,<br>MESS WALLAH Team</p>
        `);
      } else {
        await sendEmail(booking.userId.email, `Booking Request ${status.charAt(0).toUpperCase() + status.slice(1)} - ${booking.bookingId}`, `
          <h2>Booking Request ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
          <p>Hi ${booking.userId.name},</p>
          <p>Your booking request for "${booking.roomId.title}" has been ${status}.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>Booking ID: ${booking.bookingId}</p>
          <p>Best regards,<br>MESS WALLAH Team</p>
        `);
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
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
      .populate('roomId')
      .populate('userId', 'name email')
      .populate('ownerId', 'name email');

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
    if (booking.status === 'confirmed') {
      try {
        await Room.findByIdAndUpdate(booking.roomId._id, { isAvailable: true });
      } catch (roomError) {
        console.error('Room availability update failed:', roomError);
      }
    }

    // Send notification to the other party
    const notifyUser = booking.userId.toString() === req.user.id ? booking.ownerId : booking.userId;
    const cancelledBy = booking.userId.toString() === req.user.id ? 'seeker' : 'owner';

    try {
      await sendEmail(notifyUser.email, `Booking Cancelled - ${booking.bookingId}`, `
        <h2>Booking Cancelled</h2>
        <p>Hi ${notifyUser.name},</p>
        <p>The booking for "${booking.roomId.title}" has been cancelled by the ${cancelledBy}.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>Booking ID: ${booking.bookingId}</p>
        <p>Best regards,<br>MESS WALLAH Team</p>
      `);
    } catch (emailError) {
      console.error('Cancellation email failed:', emailError);
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
