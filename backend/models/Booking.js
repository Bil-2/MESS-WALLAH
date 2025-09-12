const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['requested', 'confirmed', 'cancelled', 'completed'],
    default: 'requested'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  bookingId: {
    type: String,
    unique: true
  },
  pricing: {
    monthlyRent: {
      type: Number,
      required: true
    },
    deposit: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['requested', 'confirmed', 'cancelled', 'completed']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate booking ID before saving
BookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Indexes for better query performance
BookingSchema.index({ roomId: 1 });
BookingSchema.index({ userId: 1 });
BookingSchema.index({ ownerId: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ bookingId: 1 });
BookingSchema.index({ createdAt: -1 });

// Compound indexes for common queries
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ ownerId: 1, status: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
