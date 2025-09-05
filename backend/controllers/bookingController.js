const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create new booking request
// @route   POST /api/bookings
// @access  Private (Student/Tenant)
const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { roomId, checkIn, checkOut, duration, guests, message } = req.body;

    // Check if room exists and is available
    const room = await Room.findById(roomId).populate('owner');
    if (!room || !room.isActive || !room.availability.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available for booking'
      });
    }

    // Check if user is trying to book their own room
    if (room.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own room'
      });
    }

    // Check for existing active booking for this room
    const existingBooking = await Booking.findOne({
      room: roomId,
      status: { $in: ['pending', 'approved', 'confirmed', 'active'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Room already has an active booking'
      });
    }

    // Calculate pricing
    const pricing = {
      monthlyRent: room.rent.monthly,
      securityDeposit: room.rent.security,
      maintenance: room.rent.maintenance || 0,
      totalAmount: (room.rent.monthly * duration) + room.rent.security + (room.rent.maintenance || 0),
      paidAmount: 0,
      pendingAmount: (room.rent.monthly * duration) + room.rent.security + (room.rent.maintenance || 0)
    };

    const bookingData = {
      room: roomId,
      tenant: req.user._id,
      owner: room.owner._id,
      bookingDetails: {
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        duration,
        guests
      },
      pricing,
      messages: message ? [{
        sender: req.user._id,
        message,
        timestamp: new Date()
      }] : []
    };

    const booking = await Booking.create(bookingData);
    await booking.populate([
      { path: 'room', select: 'title location rent' },
      { path: 'tenant', select: 'name email phone' },
      { path: 'owner', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// @desc    Get all bookings for user
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    // Filter based on user role
    if (req.user.role === 'owner') {
      filter.owner = req.user._id;
    } else {
      filter.tenant = req.user._id;
    }

    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const bookings = await Booking.find(filter)
      .populate('room', 'title location images')
      .populate('tenant', 'name email phone college')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('tenant', 'name email phone college course year')
      .populate('owner', 'name email phone')
      .populate('messages.sender', 'name');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to view this booking
    if (booking.tenant._id.toString() !== req.user._id.toString() &&
      booking.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// @desc    Owner responds to booking request
// @route   PUT /api/bookings/:id/respond
// @access  Private (Owner only)
const respondToBooking = async (req, res) => {
  try {
    const { status, message } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either approved or rejected'
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the owner
    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this booking'
      });
    }

    // Check if booking is still pending
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking has already been responded to'
      });
    }

    // Update booking status and owner response
    booking.status = status;
    booking.ownerResponse = {
      status,
      message,
      respondedAt: new Date()
    };

    // Add message to conversation
    if (message) {
      booking.messages.push({
        sender: req.user._id,
        message,
        timestamp: new Date()
      });
    }

    await booking.save();
    await booking.populate([
      { path: 'room', select: 'title location' },
      { path: 'tenant', select: 'name email phone' },
      { path: 'owner', select: 'name email phone' }
    ]);

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error responding to booking',
      error: error.message
    });
  }
};

// @desc    Add message to booking conversation
// @route   POST /api/bookings/:id/messages
// @access  Private
const addMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized (tenant or owner)
    if (booking.tenant.toString() !== req.user._id.toString() &&
      booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to message in this booking'
      });
    }

    booking.messages.push({
      sender: req.user._id,
      message: message.trim(),
      timestamp: new Date()
    });

    await booking.save();
    await booking.populate('messages.sender', 'name');

    res.json({
      success: true,
      message: 'Message added successfully',
      data: booking.messages[booking.messages.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding message',
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to cancel
    if (booking.tenant.toString() !== req.user._id.toString() &&
      booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (!['pending', 'approved', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled at this stage'
      });
    }

    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledBy: req.user._id,
      reason: reason || 'No reason provided',
      cancelledAt: new Date()
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

// @desc    Confirm booking (after payment)
// @route   PUT /api/bookings/:id/confirm
// @access  Private
const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only tenant can confirm booking
    if (booking.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only tenant can confirm booking'
      });
    }

    // Check if booking is approved
    if (booking.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Booking must be approved before confirmation'
      });
    }

    booking.status = 'confirmed';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error confirming booking',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  respondToBooking,
  addMessage,
  cancelBooking,
  confirmBooking
};
