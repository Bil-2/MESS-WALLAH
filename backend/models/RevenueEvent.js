const mongoose = require('mongoose');

/**
 * RevenueEvent — Every financial transaction on the platform
 * Like a bank ledger: rent received, deposit paid, refund given
 * Inspired by: OYO, Booking.com revenue tracking
 */
const RevenueEventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'rent_received',       // Monthly rent paid by tenant
      'deposit_received',    // Security deposit paid
      'deposit_refunded',    // Security deposit returned to tenant
      'platform_fee',        // Fee charged by platform (future)
      'refund_to_tenant',    // Refund given back to tenant
      'penalty_charged',     // Late payment or damage penalty
      'bonus_payout'         // Bonus paid to owner (future promotional)
    ],
    required: true
  },

  // Amount
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },

  // References
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Payment details
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'bank_transfer', 'razorpay', 'cheque', 'other'],
    default: 'cash'
  },
  transactionId: String,
  razorpayPaymentId: String,

  // Status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },

  // Time-based grouping (for monthly/yearly reports)
  forMonth: {
    type: Number, // 1-12
    required: true
  },
  forYear: {
    type: Number,
    required: true
  },

  // Description / notes
  description: String,
  notes: String,

  // Who recorded this (owner, tenant, system)
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recordedBySystem: {
    type: Boolean,
    default: false
  },

  recordedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save: auto-set month and year from recordedAt
RevenueEventSchema.pre('save', function (next) {
  if (!this.forMonth || !this.forYear) {
    const date = this.recordedAt || new Date();
    this.forMonth = date.getMonth() + 1;
    this.forYear = date.getFullYear();
  }
  next();
});

// Indexes for fast reporting queries
RevenueEventSchema.index({ ownerId: 1, forYear: 1, forMonth: 1 });
RevenueEventSchema.index({ bookingId: 1 });
RevenueEventSchema.index({ roomId: 1, forYear: 1 });
RevenueEventSchema.index({ type: 1, status: 1 });
RevenueEventSchema.index({ recordedAt: -1 });

// Static: get monthly revenue summary for an owner
RevenueEventSchema.statics.getMonthlyReport = function (ownerId, year) {
  return this.aggregate([
    { $match: { ownerId: mongoose.Types.ObjectId(ownerId), forYear: year, status: 'completed' } },
    {
      $group: {
        _id: '$forMonth',
        totalRevenue: { $sum: '$amount' },
        eventCount: { $sum: 1 },
        types: { $addToSet: '$type' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

module.exports = mongoose.model('RevenueEvent', RevenueEventSchema);
