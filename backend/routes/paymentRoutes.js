const express = require('express');
const { body, param, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  getPaymentStatus,
  refundPayment,
  handleWebhook
} = require('../controllers/paymentController');

const router = express.Router();

// Rate limiting for payment endpoints
const paymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 payment attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many payment attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const webhookRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 webhook calls per minute
  message: {
    success: false,
    message: 'Webhook rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation middleware
const validateBookingId = [
  body('bookingId')
    .notEmpty()
    .isMongoId()
    .withMessage('Valid booking ID is required')
];

const validatePaymentVerification = [
  body('razorpay_order_id')
    .notEmpty()
    .withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id')
    .notEmpty()
    .withMessage('Razorpay payment ID is required'),
  body('razorpay_signature')
    .notEmpty()
    .withMessage('Razorpay signature is required'),
  body('bookingId')
    .notEmpty()
    .isMongoId()
    .withMessage('Valid booking ID is required')
];

const validateRefund = [
  param('bookingId')
    .notEmpty()
    .isMongoId()
    .withMessage('Valid booking ID is required'),
  body('reason')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Refund reason must be between 10-500 characters'),
  body('amount')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Refund amount must be a positive number')
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// @desc    Create Razorpay payment order
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', [
  protect,
  paymentRateLimit,
  validateBookingId,
  handleValidationErrors
], createPaymentOrder);

// @desc    Verify payment signature and confirm booking
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', [
  protect,
  paymentRateLimit,
  validatePaymentVerification,
  handleValidationErrors
], verifyPayment);

// @desc    Handle payment failure
// @route   POST /api/payments/failure
// @access  Private
router.post('/failure', [
  protect,
  paymentRateLimit,
  body('bookingId')
    .notEmpty()
    .isMongoId()
    .withMessage('Valid booking ID is required'),
  body('error')
    .optional()
    .isObject()
    .withMessage('Error details must be an object'),
  handleValidationErrors
], handlePaymentFailure);

// @desc    Get payment status for a booking
// @route   GET /api/payments/status/:bookingId
// @access  Private
router.get('/status/:bookingId', [
  protect,
  param('bookingId')
    .notEmpty()
    .isMongoId()
    .withMessage('Valid booking ID is required'),
  handleValidationErrors
], getPaymentStatus);

// @desc    Process refund for a booking
// @route   POST /api/payments/refund/:bookingId
// @access  Private
router.post('/refund/:bookingId', [
  protect,
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 refund requests per hour
    message: {
      success: false,
      message: 'Too many refund requests. Please contact support.'
    }
  }),
  validateRefund,
  handleValidationErrors
], refundPayment);

// @desc    Razorpay webhook handler
// @route   POST /api/payments/webhook
// @access  Public (but verified via signature)
router.post('/webhook', [
  webhookRateLimit,
  // Raw body parser middleware for webhook signature verification
  express.raw({ type: 'application/json' })
], handleWebhook);

// @desc    Get Razorpay configuration for frontend
// @route   GET /api/payments/config
// @access  Private
router.get('/config', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        key: process.env.RAZORPAY_KEY_ID,
        currency: 'INR',
        name: 'MESS WALLAH',
        description: 'Secure Accommodation Booking',
        image: '/logo.png', // Your logo URL
        theme: {
          color: '#f97316' // Orange theme color
        },
        modal: {
          backdropclose: false,
          escape: false,
          handleback: false
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        timeout: 300, // 5 minutes
        remember_customer: true
      }
    });
  } catch (error) {
    console.error('❌ Get Payment Config Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment configuration'
    });
  }
});

// @desc    Get payment history for user
// @route   GET /api/payments/history
// @access  Private
router.get('/history', [
  protect,
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per 15 minutes
    message: {
      success: false,
      message: 'Too many requests for payment history'
    }
  })
], async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    const Booking = require('../models/Booking');
    
    const bookings = await Booking.find({ 
      user: userId,
      paymentStatus: { $in: ['completed', 'refunded'] }
    })
    .populate('room', 'title images address')
    .sort({ paidAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

    const totalPayments = await Booking.countDocuments({ 
      user: userId,
      paymentStatus: { $in: ['completed', 'refunded'] }
    });

    const payments = bookings.map(booking => ({
      id: booking._id,
      paymentId: booking.paymentId,
      amount: booking.totalAmount,
      status: booking.paymentStatus,
      paidAt: booking.paidAt,
      refundAmount: booking.refundAmount,
      refundedAt: booking.refundedAt,
      room: {
        title: booking.room.title,
        image: booking.room.images?.[0],
        address: booking.room.address
      },
      checkIn: booking.checkIn,
      checkOut: booking.checkOut
    }));

    res.status(200).json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPayments / parseInt(limit)),
          totalPayments,
          hasNextPage: parseInt(page) < Math.ceil(totalPayments / parseInt(limit)),
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('❌ Get Payment History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
