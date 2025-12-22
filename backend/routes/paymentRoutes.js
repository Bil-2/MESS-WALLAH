/**
 * PRODUCTION-GRADE PAYMENT ROUTES
 * Real Razorpay Integration with Full Security
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { protect } = require('../middleware/auth');
const { 
  rateLimiters,
  sanitizeInput 
} = require('../middleware/advancedSecurity');
const {
  verifyRazorpayWebhook,
  verifyPaymentSignature,
  validatePaymentAmount,
  handleIdempotency,
  detectFraud,
  updateFraudHistory,
  securePaymentLogger,
  verifyBookingAmount
} = require('../middleware/paymentSecurity');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const Notification = require('../models/Notification');
const {
  sendBookingConfirmationToCustomer,
  sendBookingNotificationToOwner,
  sendPaymentReceipt
} = require('../services/notify');

// Initialize Razorpay
let razorpay = null;

const initRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.log('[PAYMENT] Razorpay credentials not configured');
    return null;
  }
  
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('[PAYMENT] Razorpay initialized successfully');
    return razorpay;
  } catch (error) {
    console.error('[PAYMENT] Razorpay initialization failed:', error.message);
    return null;
  }
};

// Initialize on module load
initRazorpay();

// Apply security middleware to all payment routes
router.use(securePaymentLogger);

// ============================================
// GET /api/payments/config - Get payment configuration
// ============================================
router.get('/config', (req, res) => {
  const isConfigured = !!(
    process.env.RAZORPAY_KEY_ID && 
    process.env.RAZORPAY_KEY_SECRET
  );

  res.json({
    success: true,
    data: {
      configured: isConfigured,
      provider: 'Razorpay',
      keyId: isConfigured ? process.env.RAZORPAY_KEY_ID : null,
      currency: 'INR',
      supportedMethods: ['card', 'netbanking', 'upi', 'wallet'],
      minAmount: 100, // ₹1
      maxAmount: 10000000, // ₹1,00,000
      status: isConfigured ? 'active' : 'not_configured'
    }
  });
});

// ============================================
// POST /api/payments/create-order - Create Razorpay order
// ============================================
router.post('/create-order', [
  protect,
  rateLimiters.payment,
  handleIdempotency,
  detectFraud,
  validatePaymentAmount
], async (req, res) => {
  try {
    const { amount, currency = 'INR', bookingId, notes = {} } = req.body;

    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service not configured'
      });
    }

    // Verify booking if provided
    let booking = null;
    if (bookingId) {
      booking = await Booking.findById(bookingId);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Verify booking belongs to user
      if (booking.userId.toString() !== req.user._id.toString()) {
        console.log('[SECURITY] Unauthorized payment attempt for booking:', bookingId);
        return res.status(403).json({
          success: false,
          message: 'Not authorized to pay for this booking'
        });
      }

    // FIXED: Check if booking has already been paid
    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been paid for'
      });
    }

      // Verify amount matches booking
      const expectedAmount = booking.pricing.totalAmount * 100;
      if (amount !== expectedAmount) {
        console.log('[SECURITY] Amount mismatch:', { expected: expectedAmount, received: amount });
        return res.status(400).json({
          success: false,
          message: 'Payment amount does not match booking'
        });
      }

      // Check booking status
      if (!['requested', 'confirmed'].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot pay for booking with status: ${booking.status}`
        });
      }
    }

    // Create Razorpay order
    const orderOptions = {
      amount: amount, // Amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      notes: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
        bookingId: bookingId || 'direct_payment',
        ...notes
      }
    };

    const order = await razorpay.orders.create(orderOptions);

    // Update booking with order ID
    if (booking) {
      booking.paymentOrderId = order.id;
      booking.paymentStatus = 'initiated';
      booking.paymentDetails = {
        ...booking.paymentDetails,
        paymentMethod: 'razorpay'
      };
      await booking.save();
    }

    console.log('[PAYMENT] Order created:', order.id);

    res.status(201).json({
      success: true,
      message: 'Payment order created',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        keyId: process.env.RAZORPAY_KEY_ID,
        prefill: {
          name: req.user.name,
          email: req.user.email,
          contact: req.user.phone
        }
      }
    });

  } catch (error) {
    console.error('[PAYMENT] Order creation failed:', error);
    
    // Update fraud history on failure
    if (req.fraudHistory) {
      updateFraudHistory(req.user._id.toString(), false);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// POST /api/payments/verify - Verify payment
// ============================================
router.post('/verify', [
  protect,
  rateLimiters.payment,
  handleIdempotency
], async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingId 
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data'
      });
    }

    // Verify signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      console.log('[SECURITY] Invalid payment signature');
      
      // Update booking status to failed
      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          paymentStatus: 'failed',
          paymentFailureReason: 'Invalid signature'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - invalid signature'
      });
    }

    // Fetch payment details from Razorpay
    let payment;
    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (fetchError) {
      console.error('[PAYMENT] Failed to fetch payment:', fetchError);
    }

    // Update booking if provided
    if (bookingId) {
      const booking = await Booking.findById(bookingId)
        .populate('roomId', 'title address images')
        .populate('userId', 'name email phone')
        .populate('ownerId', 'name email phone');
      
      if (booking) {
        // Verify order ID matches
        if (booking.paymentOrderId !== razorpay_order_id) {
          console.log('[SECURITY] Order ID mismatch');
          return res.status(400).json({
            success: false,
            message: 'Order ID mismatch'
          });
        }

        const paidAmount = payment?.amount ? payment.amount / 100 : booking.pricing.totalAmount;
        const paymentDate = new Date();

        booking.paymentId = razorpay_payment_id;
        booking.paymentStatus = 'completed';
        booking.paidAt = paymentDate;
        booking.paymentDetails = {
          ...booking.paymentDetails,
          transactionId: razorpay_payment_id,
          paidAmount: paidAmount,
          paymentDate: paymentDate,
          paymentMethod: payment?.method || 'razorpay'
        };

        // Update booking status to confirmed if it was requested
        if (booking.status === 'requested') {
          booking.status = 'confirmed';
          booking.statusHistory.push({
            status: 'confirmed',
            timestamp: paymentDate,
            updatedBy: req.user._id,
            reason: 'Payment completed'
          });
        }

        await booking.save();
        console.log('[PAYMENT] Booking updated:', bookingId);

        // ============================================
        // SEND ALL NOTIFICATIONS
        // ============================================
        const checkInFormatted = booking.checkInDate.toLocaleDateString('en-IN', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        // 1. Email + SMS to Customer
        try {
          await sendBookingConfirmationToCustomer(
            booking.userId.email,
            booking.userId.phone,
            {
              bookingId: booking.bookingId,
              roomTitle: booking.roomId.title,
              checkIn: checkInFormatted,
              totalAmount: paidAmount,
              duration: booking.duration,
              ownerName: booking.ownerId.name,
              ownerPhone: booking.ownerId.phone,
              address: booking.roomId.address?.fullAddress || booking.roomId.address?.city
            }
          );
          console.log('[NOTIFY] Customer notification sent');
        } catch (notifyError) {
          console.error('[NOTIFY] Customer notification failed:', notifyError.message);
        }

        // 2. Email + SMS to Owner
        try {
          await sendBookingNotificationToOwner(
            booking.ownerId.email,
            booking.ownerId.phone,
            {
              bookingId: booking.bookingId,
              roomTitle: booking.roomId.title,
              checkIn: checkInFormatted,
              totalAmount: paidAmount,
              duration: booking.duration,
              customerName: booking.userId.name,
              customerPhone: booking.userId.phone,
              customerEmail: booking.userId.email
            }
          );
          console.log('[NOTIFY] Owner notification sent');
        } catch (notifyError) {
          console.error('[NOTIFY] Owner notification failed:', notifyError.message);
        }

        // 3. Payment Receipt to Customer
        try {
          await sendPaymentReceipt(
            booking.userId.email,
            {
              bookingId: booking.bookingId,
              roomTitle: booking.roomId.title,
              totalAmount: paidAmount,
              paymentId: razorpay_payment_id,
              paymentDate: paymentDate.toLocaleDateString('en-IN'),
              customerName: booking.userId.name,
              duration: booking.duration,
              monthlyRent: booking.pricing.monthlyRent,
              securityDeposit: booking.pricing.securityDeposit
            }
          );
          console.log('[NOTIFY] Payment receipt sent');
        } catch (notifyError) {
          console.error('[NOTIFY] Payment receipt failed:', notifyError.message);
        }

        // 4. In-App Notification for Customer
        try {
          await Notification.createNotification({
            userId: booking.userId._id,
            type: 'payment_success',
            title: '🎉 Booking Confirmed!',
            message: `Your booking for ${booking.roomId.title} is confirmed. Payment of ₹${paidAmount.toLocaleString('en-IN')} received.`,
            data: {
              bookingId: booking._id,
              roomId: booking.roomId._id,
              amount: paidAmount,
              actionUrl: `/bookings/${booking._id}`
            },
            priority: 'high'
          });
        } catch (notifyError) {
          console.error('[NOTIFY] Customer in-app notification failed:', notifyError.message);
        }

        // 5. In-App Notification for Owner
        try {
          await Notification.createNotification({
            userId: booking.ownerId._id,
            type: 'booking_confirmed',
            title: '🔔 New Booking Received!',
            message: `${booking.userId.name} booked ${booking.roomId.title}. Payment of ₹${paidAmount.toLocaleString('en-IN')} received.`,
            data: {
              bookingId: booking._id,
              roomId: booking.roomId._id,
              amount: paidAmount,
              actionUrl: `/owner/bookings`
            },
            priority: 'high'
          });
        } catch (notifyError) {
          console.error('[NOTIFY] Owner in-app notification failed:', notifyError.message);
        }
      }
    }

    // Update fraud history on success
    if (req.fraudHistory) {
      updateFraudHistory(req.user._id.toString(), true);
    }

    console.log('[PAYMENT] Payment verified:', razorpay_payment_id);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'completed',
        amount: payment?.amount ? payment.amount / 100 : null,
        method: payment?.method || 'razorpay'
      }
    });

  } catch (error) {
    console.error('[PAYMENT] Verification failed:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// POST /api/payments/webhook - Razorpay webhook
// ============================================
router.post('/webhook', [
  express.raw({ type: 'application/json' }),
  verifyRazorpayWebhook
], async (req, res) => {
  try {
    const event = req.body;
    
    console.log('[WEBHOOK] Received event:', event.event);

    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      
      case 'refund.created':
        await handleRefundCreated(event.payload.refund.entity);
        break;

      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity, event.payload.payment.entity);
        break;

      default:
        console.log('[WEBHOOK] Unhandled event:', event.event);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('[WEBHOOK] Error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Webhook handlers
async function handlePaymentCaptured(payment) {
  console.log('[WEBHOOK] Payment captured:', payment.id);
  
  const booking = await Booking.findOne({ paymentOrderId: payment.order_id });
  if (booking) {
    booking.paymentId = payment.id;
    booking.paymentStatus = 'completed';
    booking.paidAt = new Date();
    booking.paymentDetails.paidAmount = payment.amount / 100;
    await booking.save();
  }
}

async function handlePaymentFailed(payment) {
  console.log('[WEBHOOK] Payment failed:', payment.id);
  
  const booking = await Booking.findOne({ paymentOrderId: payment.order_id });
  if (booking) {
    booking.paymentStatus = 'failed';
    booking.paymentFailureReason = payment.error_description || 'Payment failed';
    await booking.save();
  }
}

async function handleRefundCreated(refund) {
  console.log('[WEBHOOK] Refund created:', refund.id);
  
  const booking = await Booking.findOne({ paymentId: refund.payment_id });
  if (booking) {
    booking.refundId = refund.id;
    booking.refundAmount = refund.amount / 100;
    booking.refundStatus = 'processed';
    booking.refundedAt = new Date();
    await booking.save();
  }
}

async function handleOrderPaid(order, payment) {
  console.log('[WEBHOOK] Order paid:', order.id);
  // Additional handling if needed
}

// ============================================
// POST /api/payments/refund - Initiate refund
// ============================================
router.post('/refund', [
  protect,
  rateLimiters.payment
], async (req, res) => {
  try {
    const { bookingId, amount, reason } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
    }

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only owner or admin can initiate refund
    const isOwner = booking.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to initiate refund'
      });
    }

    if (!booking.paymentId) {
      return res.status(400).json({
        success: false,
        message: 'No payment found for this booking'
      });
    }

    if (booking.refundStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Refund already processed'
      });
    }

    // Calculate refund amount
    const refundAmount = amount || booking.paymentDetails.paidAmount;
    
    // Create refund
    const refund = await razorpay.payments.refund(booking.paymentId, {
      amount: refundAmount * 100, // Convert to paise
      notes: {
        bookingId: bookingId,
        reason: reason || 'Customer requested refund'
      }
    });

    // Update booking
    booking.refundId = refund.id;
    booking.refundAmount = refundAmount;
    booking.refundStatus = 'initiated';
    booking.refundReason = reason;
    booking.status = 'cancelled';
    booking.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      updatedBy: req.user._id,
      reason: `Refund initiated: ${reason || 'Customer request'}`
    });
    await booking.save();

    console.log('[PAYMENT] Refund initiated:', refund.id);

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      data: {
        refundId: refund.id,
        amount: refundAmount,
        status: refund.status
      }
    });

  } catch (error) {
    console.error('[PAYMENT] Refund failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate refund',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// GET /api/payments/status/:orderId - Get payment status
// ============================================
router.get('/status/:orderId', protect, async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service not configured'
      });
    }

    const order = await razorpay.orders.fetch(orderId);
    
    // Verify user owns this order
    if (order.notes?.userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount / 100,
        currency: order.currency,
        status: order.status,
        attempts: order.attempts,
        createdAt: order.created_at
      }
    });

  } catch (error) {
    console.error('[PAYMENT] Status check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment status'
    });
  }
});

// ============================================
// GET /api/payments/history - Get payment history
// ============================================
router.get('/history', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find({
      userId: req.user._id,
      paymentStatus: { $in: ['completed', 'failed', 'refunded'] }
    })
    .select('bookingId paymentId paymentStatus paymentDetails paidAt refundAmount refundStatus pricing')
    .sort({ paidAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Booking.countDocuments({
      userId: req.user._id,
      paymentStatus: { $in: ['completed', 'failed', 'refunded'] }
    });

    res.json({
      success: true,
      data: {
        payments: bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('[PAYMENT] History fetch failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history'
    });
  }
});

module.exports = router;
