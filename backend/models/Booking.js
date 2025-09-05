const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: true
  },
  tenant: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  bookingDetails: {
    checkIn: {
      type: Date,
      required: [true, 'Please provide check-in date']
    },
    checkOut: {
      type: Date,
      required: [true, 'Please provide check-out date']
    },
    duration: {
      type: Number, // in months
      required: true
    },
    guests: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  pricing: {
    monthlyRent: {
      type: Number,
      required: true
    },
    securityDeposit: {
      type: Number,
      required: true
    },
    maintenance: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    pendingAmount: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'refunded'],
    default: 'pending'
  },
  messages: [{
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  ownerResponse: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected']
    },
    message: String,
    respondedAt: Date
  },
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    reason: String,
    cancelledAt: Date,
    refundAmount: Number
  },
  contract: {
    termsAccepted: {
      type: Boolean,
      default: false
    },
    digitalSignature: {
      tenant: String,
      owner: String
    },
    contractUrl: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ tenant: 1, status: 1 });
bookingSchema.index({ owner: 1, status: 1 });
bookingSchema.index({ room: 1, status: 1 });

// Virtual for booking duration in days
bookingSchema.virtual('durationInDays').get(function () {
  return Math.ceil((this.bookingDetails.checkOut - this.bookingDetails.checkIn) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate total amount
bookingSchema.pre('save', function (next) {
  if (this.isModified('pricing') || this.isModified('bookingDetails.duration')) {
    this.pricing.totalAmount = (this.pricing.monthlyRent * this.bookingDetails.duration) +
      this.pricing.securityDeposit +
      this.pricing.maintenance;
    this.pricing.pendingAmount = this.pricing.totalAmount - this.pricing.paidAmount;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
