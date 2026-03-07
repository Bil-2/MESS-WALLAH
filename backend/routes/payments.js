const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { protect } = require('../middleware/auth');
const Booking = require('../models/Booking');
const RevenueEvent = require('../models/RevenueEvent');
const LifecycleService = require('../services/LifecycleService');

// Initialize Razorpay only if keys are present
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// @desc    Create a Razorpay order before payment
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment gateway is not configured on the server. Continuing as Cash/Request booking.'
      });
    }

    const { currency, bookingId, notes } = req.body;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'bookingId is required' });
    }

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId).populate('room');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // toString() comparison because req.user._id is object
    if (booking.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to pay for this booking' });
    }

    // CRITICAL SECURITY FIX: Do not trust the amount sent from the frontend.
    // Calculate the exact amount from the secure Database Booking record.
    const authenticAmount = booking.totalPrice;

    const options = {
      amount: Math.round(authenticAmount * 100), // Razorpay requires amount in smallest currency unit (paise)
      currency: currency || 'INR',
      receipt: `rcptid_${bookingId.toString().slice(-8)}`,
      notes: {
        bookingId: bookingId.toString(),
        userId: req.user._id.toString(),
        ...notes
      }
    };

    const order = await razorpay.orders.create(options);

    // Update booking with Razorpay Order ID for tracking
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('[Razorpay Create Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({ success: false, message: 'Missing payment verification data' });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: 'Server missing Razorpay secret' });
    }

    // Generate expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Payment is authentic!
    // Update booking status
    const booking = await Booking.findById(bookingId).populate('room');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found after payment' });
    }

    // CRITICAL SECURITY FIX: Idempotency Check
    // Prevent double-processing if the frontend retries a successful payment payload
    if (booking.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Payment was already verified and processed',
        data: { bookingId: booking._id, status: booking.status }
      });
    }

    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    await booking.save();

    // The payment acts as the trigger for generating the PDF receipt and the formal Room availability change.
    // Call the lifecycle service to record Revenue immediately.
    try {
      // We know the total rent + deposit + fee. 
      // For a simple integration, we record the total amount hitting the platform.
      await RevenueEvent.create({
        type: 'rent_received',
        amount: booking.totalPrice,
        currency: 'INR',
        roomId: booking.room._id,
        userId: req.user._id,
        ownerId: booking.owner, // payment goes to owner ultimately (minus fees)
        bookingId: booking._id,
        paymentMethod: 'razorpay',
        razorpayPaymentId: razorpay_payment_id,
        status: 'completed',
        description: `Razorpay booking initial payment for ${booking.room.title}`,
        platformFee: Math.round(booking.totalPrice * 0.05), // Example fee
      });

      // Log the analytics
      await LifecycleService.trackEvent({
        event: 'booking_completed',
        roomId: booking.room._id,
        userId: req.user._id,
        metadata: { method: 'razorpay', orderId: razorpay_order_id }
      });
    } catch (metricErr) {
      console.error('[Verify] Metric logging failed, but payment succeeded:', metricErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully and booking confirmed',
      data: {
        bookingId: booking._id,
        status: booking.status
      }
    });

  } catch (error) {
    console.error('[Razorpay Verify Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification error',
      error: error.message
    });
  }
});

module.exports = router;
