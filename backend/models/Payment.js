const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: true
  },
  payer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide payment amount']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentType: {
    type: String,
    enum: ['security_deposit', 'monthly_rent', 'maintenance', 'refund'],
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'razorpay', 'bank_transfer', 'cash'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  transactionDetails: {
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    paymentIntentId: String, // Stripe payment intent ID
    razorpayOrderId: String, // Razorpay order ID
    gatewayResponse: mongoose.Schema.Types.Mixed,
    failureReason: String
  },
  refund: {
    refundId: String,
    refundAmount: Number,
    refundReason: String,
    refundedAt: Date,
    refundStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed']
    }
  },
  metadata: {
    description: String,
    invoiceUrl: String,
    receiptUrl: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
paymentSchema.index({ booking: 1, status: 1 });
paymentSchema.index({ payer: 1, status: 1 });
paymentSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
