const encryptionService = require('../utils/encryption');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Room = require('../models/Room');
const crypto = require('crypto');

// Razorpay integration (secure implementation)
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class SecurePaymentController {
  // Create secure payment session
  async createPaymentSession(req, res) {
    try {
      const { bookingId, amount } = req.body;
      const userId = req.user.id;

      // Validate booking ownership
      const booking = await Booking.findById(bookingId);
      if (!booking || booking.user.toString() !== userId) {
        return res.status(403).json({
          error: 'Unauthorized booking access',
          code: 'UNAUTHORIZED_BOOKING'
        });
      }

      // Generate secure payment session
      const paymentSession = encryptionService.generatePaymentSession(
        userId,
        amount,
        'INR'
      );

      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `booking_${bookingId}_${Date.now()}`,
        notes: {
          bookingId,
          userId,
          sessionId: paymentSession.sessionId
        }
      });

      res.status(200).json({
        success: true,
        paymentSession: {
          sessionId: paymentSession.sessionId,
          sessionData: paymentSession,
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency
        }
      });

    } catch (error) {
      console.error('[PAYMENT_SESSION_ERROR]', error);
      res.status(500).json({
        error: 'Failed to create payment session',
        code: 'SESSION_CREATION_FAILED'
      });
    }
  }

  // Process secure payment
  async processPayment(req, res) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingId
      } = req.body;

      // Verify Razorpay signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          error: 'Payment signature verification failed',
          code: 'SIGNATURE_VERIFICATION_FAILED'
        });
      }

      // Verify payment with Razorpay
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      
      if (payment.status !== 'captured' && payment.status !== 'authorized') {
        return res.status(400).json({
          error: 'Payment not successful',
          code: 'PAYMENT_NOT_SUCCESSFUL'
        });
      }

      // Update booking with payment details
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          error: 'Booking not found',
          code: 'BOOKING_NOT_FOUND'
        });
      }

      // Encrypt payment details before storing
      const encryptedPaymentDetails = encryptionService.encryptPaymentData({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentMethod: payment.method,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status
      });

      booking.paymentStatus = 'completed';
      booking.paymentDetails = encryptedPaymentDetails;
      booking.paidAt = new Date();
      booking.status = 'confirmed';
      
      await booking.save();

      // Update room availability
      const room = await Room.findById(booking.room);
      if (room) {
        room.isAvailable = false;
        await room.save();
      }

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        booking: {
          id: booking._id,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          paidAt: booking.paidAt
        }
      });

    } catch (error) {
      console.error('[PAYMENT_PROCESSING_ERROR]', error);
      res.status(500).json({
        error: 'Payment processing failed',
        code: 'PAYMENT_PROCESSING_FAILED'
      });
    }
  }

  // Verify payment status
  async verifyPaymentStatus(req, res) {
    try {
      const { bookingId } = req.params;
      const userId = req.user.id;

      const booking = await Booking.findById(bookingId);
      
      if (!booking || booking.user.toString() !== userId) {
        return res.status(403).json({
          error: 'Unauthorized booking access',
          code: 'UNAUTHORIZED_BOOKING'
        });
      }

      // Decrypt payment details for verification
      let paymentDetails = null;
      if (booking.paymentDetails) {
        try {
          paymentDetails = encryptionService.decryptPaymentData(booking.paymentDetails);
          // Mask sensitive data before sending
          paymentDetails = encryptionService.maskSensitiveData(paymentDetails);
        } catch (error) {
          console.error('[PAYMENT_DECRYPTION_ERROR]', error);
        }
      }

      res.status(200).json({
        success: true,
        booking: {
          id: booking._id,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          paidAt: booking.paidAt,
          paymentDetails
        }
      });

    } catch (error) {
      console.error('[PAYMENT_VERIFICATION_ERROR]', error);
      res.status(500).json({
        error: 'Payment verification failed',
        code: 'PAYMENT_VERIFICATION_FAILED'
      });
    }
  }

  // Handle payment webhooks
  async handlePaymentWebhook(req, res) {
    try {
      const webhookSignature = req.headers['x-razorpay-signature'];
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      
      // Verify webhook signature
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expectedSignature !== webhookSignature) {
        return res.status(400).json({
          error: 'Webhook signature verification failed'
        });
      }

      const { event, payload } = req.body;
      
      switch (event) {
        case 'payment.captured':
          await this.handlePaymentCaptured(payload.payment.entity);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(payload.payment.entity);
          break;
        case 'payment.authorized':
          await this.handlePaymentAuthorized(payload.payment.entity);
          break;
      }

      res.status(200).json({ success: true });

    } catch (error) {
      console.error('[WEBHOOK_ERROR]', error);
      res.status(500).json({
        error: 'Webhook processing failed'
      });
    }
  }

  // Handle successful payment capture
  async handlePaymentCaptured(payment) {
    try {
      const booking = await Booking.findOne({
        'paymentDetails.razorpayPaymentId': payment.id
      });

      if (booking) {
        booking.paymentStatus = 'completed';
        booking.status = 'confirmed';
        await booking.save();

        // Send confirmation notification
        // This would integrate with your notification system
        console.log(`Payment captured for booking ${booking._id}`);
      }
    } catch (error) {
      console.error('[PAYMENT_CAPTURED_ERROR]', error);
    }
  }

  // Handle failed payment
  async handlePaymentFailed(payment) {
    try {
      const booking = await Booking.findOne({
        'paymentDetails.razorpayPaymentId': payment.id
      });

      if (booking) {
        booking.paymentStatus = 'failed';
        booking.status = 'cancelled';
        await booking.save();

        // Release room availability
        const room = await Room.findById(booking.room);
        if (room) {
          room.isAvailable = true;
          await room.save();
        }

        console.log(`Payment failed for booking ${booking._id}`);
      }
    } catch (error) {
      console.error('[PAYMENT_FAILED_ERROR]', error);
    }
  }

  // Handle authorized payment
  async handlePaymentAuthorized(payment) {
    try {
      const booking = await Booking.findOne({
        'paymentDetails.razorpayPaymentId': payment.id
      });

      if (booking) {
        booking.paymentStatus = 'authorized';
        await booking.save();

        console.log(`Payment authorized for booking ${booking._id}`);
      }
    } catch (error) {
      console.error('[PAYMENT_AUTHORIZED_ERROR]', error);
    }
  }

  // Refund payment
  async refundPayment(req, res) {
    try {
      const { bookingId, reason } = req.body;
      const userId = req.user.id;

      const booking = await Booking.findById(bookingId);
      
      if (!booking || booking.user.toString() !== userId) {
        return res.status(403).json({
          error: 'Unauthorized booking access',
          code: 'UNAUTHORIZED_BOOKING'
        });
      }

      if (booking.paymentStatus !== 'completed') {
        return res.status(400).json({
          error: 'Cannot refund incomplete payment',
          code: 'INVALID_REFUND_REQUEST'
        });
      }

      // Decrypt payment details to get payment ID
      const paymentDetails = encryptionService.decryptPaymentData(booking.paymentDetails);
      
      // Create refund with Razorpay
      const refund = await razorpay.payments.refund(paymentDetails.razorpayPaymentId, {
        amount: paymentDetails.amount * 100, // Convert to paise
        notes: {
          reason,
          bookingId,
          refundedBy: userId
        }
      });

      // Update booking status
      booking.paymentStatus = 'refunded';
      booking.status = 'cancelled';
      booking.refundDetails = encryptionService.encryptPaymentData({
        refundId: refund.id,
        refundAmount: refund.amount / 100,
        refundedAt: new Date(),
        reason
      });
      
      await booking.save();

      // Release room availability
      const room = await Room.findById(booking.room);
      if (room) {
        room.isAvailable = true;
        await room.save();
      }

      res.status(200).json({
        success: true,
        message: 'Refund processed successfully',
        refund: {
          id: refund.id,
          amount: refund.amount / 100,
          status: refund.status
        }
      });

    } catch (error) {
      console.error('[REFUND_ERROR]', error);
      res.status(500).json({
        error: 'Refund processing failed',
        code: 'REFUND_PROCESSING_FAILED'
      });
    }
  }

  // Get payment analytics (admin only)
  async getPaymentAnalytics(req, res) {
    try {
      // This would be protected by admin middleware
      const { startDate, endDate } = req.query;
      
      const matchStage = {
        paymentStatus: 'completed',
        paidAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      const analytics = await Booking.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            totalTransactions: { $sum: 1 },
            averageAmount: { $avg: '$totalAmount' }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        analytics: analytics[0] || {
          totalRevenue: 0,
          totalTransactions: 0,
          averageAmount: 0
        }
      });

    } catch (error) {
      console.error('[PAYMENT_ANALYTICS_ERROR]', error);
      res.status(500).json({
        error: 'Failed to fetch payment analytics',
        code: 'ANALYTICS_FETCH_FAILED'
      });
    }
  }
}

module.exports = new SecurePaymentController();
