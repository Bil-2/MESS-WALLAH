const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// @desc    Create new booking request
// @route   POST /api/bookings
// @access  Private (Room seekers only)
router.post('/', protect, authorize('seeker'), [
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

    if (!room.checkAvailability()) {
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
      room: roomId,
      seeker: req.user.id,
      status: { $in: ['pending', 'confirmed', 'active'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active booking request for this room'
      });
    }

    // Calculate pricing
    const monthlyRent = room.rent.monthly;
    const securityDeposit = room.rent.deposit;
    const maintenanceCharges = room.rent.maintenanceCharges || 0;
    const totalAmount = (monthlyRent * duration) + securityDeposit + (maintenanceCharges * duration);

    // Create booking
    const booking = await Booking.create({
      room: roomId,
      seeker: req.user.id,
      owner: room.owner._id,
      checkInDate: checkIn,
      duration: parseInt(duration),
      pricing: {
        monthlyRent,
        securityDeposit,
        maintenanceCharges,
        totalAmount
      },
      seekerInfo,
      specialRequests,
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        updatedBy: req.user.id
      }]
    });

    // Populate booking details
    await booking.populate([
      { path: 'room', select: 'title location.address location.city location.state' },
      { path: 'seeker', select: 'name email phone' },
      { path: 'owner', select: 'name email phone' }
    ]);

    // Send email notifications
    try {
      // Email to room owner
      await sendEmail({
        to: room.owner.email,
        template: 'booking-request',
        data: {
          ownerName: room.owner.name,
          bookingId: booking.bookingId,
          roomTitle: room.title,
          checkInDate: checkIn.toLocaleDateString('en-IN'),
          duration: duration,
          totalAmount: totalAmount.toLocaleString('en-IN'),
          seekerName: seekerInfo.name,
          seekerPhone: seekerInfo.phone,
          seekerEmail: seekerInfo.email,
          seekerOccupation: seekerInfo.occupation
        }
      });

      booking.notifications.emailSent.toOwner = true;
      await booking.save();
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
    if (req.user.userType === 'seeker') {
      searchQuery.seeker = req.user.id;
    } else if (req.user.userType === 'owner') {
      searchQuery.owner = req.user.id;
    }

    if (status) {
      searchQuery.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, totalCount] = await Promise.all([
      Booking.find(searchQuery)
        .populate('room', 'title images location.address location.city location.state')
        .populate('seeker', 'name email phone profile.occupation')
        .populate('owner', 'name email phone')
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
      .populate('room', 'title images location amenities contact')
      .populate('seeker', 'name email phone profile')
      .populate('owner', 'name email phone profile')
      .populate('statusHistory.updatedBy', 'name');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to view this booking
    const isAuthorized = booking.seeker._id.toString() === req.user.id ||
      booking.owner._id.toString() === req.user.id;

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
router.patch('/:id/status', protect, authorize('owner'), [
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
      .populate('room', 'title location')
      .populate('seeker', 'name email phone')
      .populate('owner', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this room
    if (booking.owner._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Check if booking can be updated
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot update booking with status: ${booking.status}`
      });
    }

    // Update booking status
    await booking.updateStatus(status, req.user.id, reason);

    // Handle room availability based on status
    if (status === 'confirmed') {
      try {
        await booking.room.bookRoom();
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
        await sendEmail({
          to: booking.seeker.email,
          template: 'booking-confirmation',
          data: {
            seekerName: booking.seeker.name,
            bookingId: booking.bookingId,
            roomTitle: booking.room.title,
            roomAddress: `${booking.room.location.address}, ${booking.room.location.city}, ${booking.room.location.state}`,
            checkInDate: booking.checkInDate.toLocaleDateString('en-IN'),
            duration: booking.duration,
            monthlyRent: booking.pricing.monthlyRent.toLocaleString('en-IN'),
            securityDeposit: booking.pricing.securityDeposit.toLocaleString('en-IN'),
            totalAmount: booking.pricing.totalAmount.toLocaleString('en-IN'),
            ownerName: booking.owner.name,
            ownerPhone: booking.owner.phone,
            ownerEmail: booking.owner.email
          }
        });
      } else {
        await sendEmail({
          to: booking.seeker.email,
          subject: `Booking Request ${status.charAt(0).toUpperCase() + status.slice(1)} - ${booking.bookingId}`,
          html: `
            <h2>Booking Request ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
            <p>Hi ${booking.seeker.name},</p>
            <p>Your booking request for "${booking.room.title}" has been ${status}.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>Booking ID: ${booking.bookingId}</p>
            <p>Best regards,<br>MESS WALLAH Team</p>
          `
        });
      }

      booking.notifications.emailSent.toSeeker = true;
      await booking.save();
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
router.patch('/:id/cancel', protect, [
  body('reason').optional().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
], async (req, res) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('seeker', 'name email')
      .populate('owner', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const isAuthorized = booking.seeker._id.toString() === req.user.id ||
      booking.owner._id.toString() === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status: ${booking.status}`
      });
    }

    // Update booking status
    await booking.updateStatus('cancelled', req.user.id, reason);

    // If booking was confirmed, make room available again
    if (booking.status === 'confirmed') {
      try {
        await booking.room.cancelBooking();
      } catch (roomError) {
        console.error('Room availability update failed:', roomError);
      }
    }

    // Send notification to the other party
    const notifyUser = booking.seeker._id.toString() === req.user.id ? booking.owner : booking.seeker;
    const cancelledBy = booking.seeker._id.toString() === req.user.id ? 'seeker' : 'owner';

    try {
      await sendEmail({
        to: notifyUser.email,
        subject: `Booking Cancelled - ${booking.bookingId}`,
        html: `
          <h2>Booking Cancelled</h2>
          <p>Hi ${notifyUser.name},</p>
          <p>The booking for "${booking.room.title}" has been cancelled by the ${cancelledBy}.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>Booking ID: ${booking.bookingId}</p>
          <p>Best regards,<br>MESS WALLAH Team</p>
        `
      });
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
    const isAuthorized = booking.seeker.toString() === req.user.id ||
      booking.owner.toString() === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to message on this booking'
      });
    }

    // Add message
    await booking.addMessage(req.user.id, message);

    // Populate the updated booking
    await booking.populate([
      { path: 'messages.sender', select: 'name' },
      { path: 'seeker', select: 'name email' },
      { path: 'owner', select: 'name email' }
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
      Booking.countDocuments({ owner: ownerId }),
      Booking.countDocuments({ owner: ownerId, status: 'pending' }),
      Booking.countDocuments({ owner: ownerId, status: 'confirmed' }),
      Booking.countDocuments({ owner: ownerId, status: 'active' }),
      Booking.countDocuments({ owner: ownerId, status: 'completed' }),
      Booking.aggregate([
        { $match: { owner: ownerId, status: { $in: ['active', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]).then(result => result[0]?.total || 0)
    ]);

    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          owner: ownerId,
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
