const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Public
router.get('/methods', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        methods: [
          {
            id: 'razorpay',
            name: 'Razorpay',
            type: 'gateway',
            supported: ['card', 'netbanking', 'upi', 'wallet'],
            enabled: true
          },
          {
            id: 'upi',
            name: 'UPI',
            type: 'direct',
            supported: ['upi'],
            enabled: true
          },
          {
            id: 'card',
            name: 'Credit/Debit Card',
            type: 'card',
            supported: ['visa', 'mastercard', 'rupay'],
            enabled: true
          }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods'
    });
  }
});

// @desc    Create payment session
// @route   POST /api/payments/session
// @access  Private
router.post('/session', protect, (req, res) => {
  try {
    const { amount, currency = 'INR', paymentMethod = 'razorpay' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Mock payment session for testing
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      data: {
        sessionId,
        amount,
        currency,
        paymentMethod,
        status: 'created',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        redirectUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/confirm`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create payment session'
    });
  }
});

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
router.post('/process', protect, (req, res) => {
  try {
    const { sessionId, paymentData } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Mock payment processing
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      data: {
        transactionId,
        sessionId,
        status: 'completed',
        amount: paymentData?.amount || 0,
        processedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment processing failed'
    });
  }
});

module.exports = router;
