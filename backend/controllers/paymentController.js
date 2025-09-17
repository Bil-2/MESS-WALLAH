const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    // Find the booking
    const booking = await Booking.findById(bookingId).populate('room');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify booking belongs to user
    if (booking.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to booking'
      });
    }

    // Check if booking is in pending status
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not in pending status'
      });
    }

    // Calculate total amount (in paise for Razorpay)
    const totalAmount = Math.round(booking.totalAmount * 100);

    // Create Razorpay order
    const orderOptions = {
      amount: totalAmount,
      currency: 'INR',
      receipt: `booking_${bookingId}_${Date.now()}`,
      payment_capture: 1,
      notes: {
        bookingId: bookingId,
        userId: userId,
        roomId: booking.room._id.toString(),
        roomTitle: booking.room.title
      }
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Update booking with payment order ID
    booking.paymentOrderId = razorpayOrder.id;
    booking.paymentStatus = 'initiated';
    await booking.save();

    res.status(200).json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: totalAmount,
        currency: 'INR',
        bookingId: bookingId,
        booking: {
          id: booking._id,
          room: {
            title: booking.room.title,
            images: booking.room.images,
            address: booking.room.address
          },
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          totalAmount: booking.totalAmount,
          guests: booking.guests
        }
      }
    });

  } catch (error) {
    console.error('❌ Create Payment Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify payment signature
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = req.body;

    const userId = req.user.id;

    // Find the booking
    const booking = await Booking.findById(bookingId).populate(['room', 'user']);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify booking belongs to user
    if (booking.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to booking'
      });
    }

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Payment verification failed
      booking.paymentStatus = 'failed';
      booking.status = 'cancelled';
      await booking.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Payment verified successfully
    booking.paymentId = razorpay_payment_id;
    booking.paymentStatus = 'completed';
    booking.status = 'confirmed';
    booking.paidAt = new Date();
    await booking.save();

    // Update room availability (if needed)
    const room = await Room.findById(booking.room._id);
    if (room.availableRooms > 0) {
      room.availableRooms -= 1;
      await room.save();
    }

    // Send confirmation email
    try {
      await sendBookingConfirmationEmail(booking);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the payment if email fails
    }

    // Generate receipt
    const receipt = await generateReceipt(booking);

    res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed',
      data: {
        booking: {
          id: booking._id,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          paymentId: booking.paymentId,
          totalAmount: booking.totalAmount,
          paidAt: booking.paidAt
        },
        receipt
      }
    });

  } catch (error) {
    console.error('❌ Verify Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Handle payment failure
const handlePaymentFailure = async (req, res) => {
  try {
    const { bookingId, error } = req.body;
    const userId = req.user.id;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify booking belongs to user
    if (booking.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to booking'
      });
    }

    // Update booking status
    booking.paymentStatus = 'failed';
    booking.status = 'cancelled';
    booking.paymentFailureReason = error?.description || 'Payment failed';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded',
      data: {
        bookingId: booking._id,
        status: booking.status,
        paymentStatus: booking.paymentStatus
      }
    });

  } catch (error) {
    console.error('❌ Handle Payment Failure Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to handle payment failure',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId).populate('room');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify booking belongs to user
    if (booking.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to booking'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        bookingId: booking._id,
        paymentStatus: booking.paymentStatus,
        paymentId: booking.paymentId,
        paymentOrderId: booking.paymentOrderId,
        status: booking.status,
        totalAmount: booking.totalAmount,
        paidAt: booking.paidAt
      }
    });

  } catch (error) {
    console.error('❌ Get Payment Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Refund payment
const refundPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason, amount } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId).populate(['room', 'user']);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized (booking owner or room owner)
    const isBookingOwner = booking.user._id.toString() === userId;
    const isRoomOwner = booking.room.owner.toString() === userId;
    
    if (!isBookingOwner && !isRoomOwner) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to process refund'
      });
    }

    // Check if payment was completed
    if (booking.paymentStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'No completed payment found for refund'
      });
    }

    // Calculate refund amount
    const refundAmount = amount || booking.totalAmount;
    const refundAmountPaise = Math.round(refundAmount * 100);

    // Create refund
    const refund = await razorpay.payments.refund(booking.paymentId, {
      amount: refundAmountPaise,
      notes: {
        reason: reason || 'Booking cancellation',
        bookingId: bookingId,
        refundedBy: userId
      }
    });

    // Update booking
    booking.refundId = refund.id;
    booking.refundAmount = refundAmount;
    booking.refundStatus = 'processed';
    booking.refundReason = reason;
    booking.refundedAt = new Date();
    booking.status = 'refunded';
    await booking.save();

    // Update room availability
    const room = await Room.findById(booking.room._id);
    room.availableRooms += 1;
    await room.save();

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: refund.id,
        refundAmount: refundAmount,
        refundStatus: 'processed',
        bookingStatus: booking.status
      }
    });

  } catch (error) {
    console.error('❌ Refund Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Webhook handler for Razorpay events
const handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload.payment.entity;

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(paymentEntity);
        break;
      case 'payment.failed':
        await handlePaymentFailedWebhook(paymentEntity);
        break;
      case 'refund.processed':
        await handleRefundProcessed(req.body.payload.refund.entity);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('❌ Webhook Error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
};

// Helper functions
const sendBookingConfirmationEmail = async (booking) => {
  const emailData = {
    to: booking.user.email,
    subject: 'Booking Confirmation - MESS WALLAH',
    template: 'booking-confirmation',
    data: {
      userName: booking.user.name,
      bookingId: booking._id,
      roomTitle: booking.room.title,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalAmount: booking.totalAmount,
      paymentId: booking.paymentId
    }
  };

  await sendEmail(emailData);
};

const generateReceipt = async (booking) => {
  return {
    receiptId: `RCP_${booking._id}_${Date.now()}`,
    bookingId: booking._id,
    paymentId: booking.paymentId,
    amount: booking.totalAmount,
    paidAt: booking.paidAt,
    room: booking.room.title,
    user: booking.user.name,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut
  };
};

const handlePaymentCaptured = async (paymentEntity) => {
  const orderId = paymentEntity.order_id;
  const booking = await Booking.findOne({ paymentOrderId: orderId });
  
  if (booking && booking.paymentStatus !== 'completed') {
    booking.paymentStatus = 'completed';
    booking.status = 'confirmed';
    booking.paidAt = new Date();
    await booking.save();
  }
};

const handlePaymentFailedWebhook = async (paymentEntity) => {
  const orderId = paymentEntity.order_id;
  const booking = await Booking.findOne({ paymentOrderId: orderId });
  
  if (booking) {
    booking.paymentStatus = 'failed';
    booking.status = 'cancelled';
    await booking.save();
  }
};

const handleRefundProcessed = async (refundEntity) => {
  const paymentId = refundEntity.payment_id;
  const booking = await Booking.findOne({ paymentId: paymentId });
  
  if (booking) {
    booking.refundStatus = 'completed';
    await booking.save();
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  getPaymentStatus,
  refundPayment,
  handleWebhook
};
