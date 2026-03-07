const mongoose = require('mongoose');

/**
 * GuestHistory — Full record of every person who ever lived in a room
 * Like a hotel guest register — permanent, never deleted
 * Inspired by: OYO stay history, hotel check-in/check-out records
 */
const GuestHistorySchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
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
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },

  // Duration
  contractStartDate: {
    type: Date,
    required: true
  },
  contractEndDate: {
    type: Date
  },
  actualCheckIn: {
    type: Date  // When tenant physically arrived
  },
  actualCheckOut: {
    type: Date  // When tenant physically left
  },
  durationMonths: {
    type: Number
  },

  // Financial summary for this stay
  rentPerMonth: Number,
  totalRentPaid: {
    type: Number,
    default: 0
  },
  depositPaid: Number,
  depositReturned: {
    type: Number,
    default: 0
  },
  depositReturnedAt: Date,

  // Why did the tenant leave?
  exitReason: {
    type: String,
    enum: [
      'contract_ended',      // Normal end of contract
      'early_exit_tenant',   // Tenant left before contract ended
      'early_exit_owner',    // Owner asked tenant to leave
      'evicted',             // Tenant evicted (non-payment / rules)
      'upgraded',            // Tenant moved to a better room
      'relocated',           // Tenant moved to another city
      'other'
    ]
  },
  exitNotes: String,

  // Two-way reviews
  ownerReviewOfTenant: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    givenAt: Date,
    tags: [String]  // e.g., ['clean', 'on_time', 'respectful']
  },
  tenantReviewOfRoom: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    givenAt: Date,
    tags: [String]  // e.g., ['clean', 'noisy', 'great_owner']
  },

  // Tenant info snapshot (in case tenant account deleted)
  tenantSnapshot: {
    name: String,
    phone: String,
    email: String,
    aadharNo: String,
    occupation: String,
    age: Number
  },

  status: {
    type: String,
    enum: ['active', 'completed', 'early_exit'],
    default: 'active'
  }
}, { timestamps: true });

// Indexes
GuestHistorySchema.index({ roomId: 1, contractStartDate: -1 });
GuestHistorySchema.index({ ownerId: 1 });
GuestHistorySchema.index({ tenantId: 1 });
GuestHistorySchema.index({ bookingId: 1 }, { unique: true });
GuestHistorySchema.index({ status: 1 });

// Virtual: how long did this stay last in days
GuestHistorySchema.virtual('stayDurationDays').get(function () {
  const start = this.actualCheckIn || this.contractStartDate;
  const end = this.actualCheckOut || this.contractEndDate || new Date();
  if (!start) return 0;
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
});

GuestHistorySchema.set('toJSON', { virtuals: true });
GuestHistorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('GuestHistory', GuestHistorySchema);
