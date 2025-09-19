const express = require('express');
const router = express.Router();
const securePaymentController = require('../controllers/securePaymentController');
const { protect, authorize } = require('../middleware/auth');
const {
  paymentRateLimit,
  validatePaymentSession,
  paymentValidationRules,
  validatePaymentData,
  encryptPaymentData,
  fraudDetection,
  paymentLogger,
  generatePaymentNonce,
  paymentCSRFProtection,
  paymentTimeout
} = require('../middleware/paymentSecurity');

// Apply payment-specific middleware to all routes
router.use(paymentLogger);
router.use(paymentTimeout);

// @desc    Create payment session
// @route   POST /api/payments/session
// @access  Private
router.post('/session',
  protect,
  paymentRateLimit,
  generatePaymentNonce,
  [
    ...paymentValidationRules.slice(0, 3), // amount, currency, paymentMethod
  ],
  validatePaymentData,
  fraudDetection,
  securePaymentController.createPaymentSession
);

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
router.post('/process',
  protect,
  paymentRateLimit,
  paymentCSRFProtection,
  validatePaymentSession,
  encryptPaymentData,
  securePaymentController.processPayment
);

// @desc    Verify payment status
// @route   GET /api/payments/verify/:bookingId
// @access  Private
router.get('/verify/:bookingId',
  protect,
  securePaymentController.verifyPaymentStatus
);

// @desc    Handle payment webhooks
// @route   POST /api/payments/webhook
// @access  Public (but verified by signature)
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  securePaymentController.handlePaymentWebhook
);

// @desc    Refund payment
// @route   POST /api/payments/refund
// @access  Private
router.post('/refund',
  protect,
  paymentRateLimit,
  [
    paymentValidationRules[0], // amount validation
  ],
  validatePaymentData,
  securePaymentController.refundPayment
);

// @desc    Get payment analytics
// @route   GET /api/payments/analytics
// @access  Private/Admin
router.get('/analytics',
  protect,
  authorize('admin'),
  securePaymentController.getPaymentAnalytics
);

module.exports = router;
