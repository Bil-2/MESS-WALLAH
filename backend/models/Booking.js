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
    enum: ['requested', 'confirmed', 'rejected', 'cancelled', 'active', 'completed', 'expired'],
    default: 'requested'
  },
  checkInDate: {
    type: Date,
    required: [true, 'Check-in date is required'],
    validate: {
      validator: function (value) {
        // FIXED: Add validation for past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value >= today;
      },
      message: 'Check-in date cannot be in the past'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Duration in months is required'],
    min: [1, 'Duration must be at least 1 month'],
    max: [24, 'Duration cannot exceed 24 months'],
    validate: {
      validator: function (value) {
        // FIXED: Add business logic validation
        // Don't allow unrealistic durations
        return Number.isInteger(value) && value >= 1 && value <= 24;
      },
      message: 'Duration must be a whole number between 1 and 24 months'
    }
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
    securityDeposit: {
      type: Number,
      required: true
    },
    // Added for platform revenue model
    platformFee: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    ownerAmount: {
      type: Number, // Amount owner will receive (Rent - Platform Fee)
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },
  seekerInfo: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['requested', 'confirmed', 'rejected', 'cancelled', 'active', 'completed', 'expired']
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
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  // FIXED: Consolidated payment fields - removed redundant paymentDetails.paymentStatus
  paymentDetails: {
    paymentMethod: {
      type: String,
      enum: ['cash', 'online', 'bank_transfer', 'upi', 'razorpay'],
      default: 'razorpay'
    },
    transactionId: String,
    paidAmount: {
      type: Number,
      default: 0
    },
    paymentDate: Date
  },

  // Razorpay specific fields
  paymentOrderId: {
    type: String,
    index: true
  },
  paymentId: {
    type: String,
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'initiated', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paidAt: {
    type: Date
  },

  // Refund fields
  refundId: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundStatus: {
    type: String,
    enum: ['none', 'initiated', 'processed', 'completed', 'failed'],
    default: 'none'
  },
  refundReason: String,
  refundedAt: Date,
  paymentFailureReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for end date calculation
BookingSchema.virtual('endDate').get(function () {
  if (this.checkInDate && this.duration) {
    const endDate = new Date(this.checkInDate);
    endDate.setMonth(endDate.getMonth() + this.duration);
    return endDate;
  }
  return null;
});

// Virtual for booking duration in days
BookingSchema.virtual('durationInDays').get(function () {
  if (this.checkInDate && this.duration) {
    return this.duration * 30; // Approximate days
  }
  return 0;
});

// Virtual for remaining days
BookingSchema.virtual('remainingDays').get(function () {
  if (this.status === 'active' && this.endDate) {
    const today = new Date();
    const diffTime = this.endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
  return 0;
});

// Ensure virtuals are included in JSON output
BookingSchema.set('toJSON', { virtuals: true });
BookingSchema.set('toObject', { virtuals: true });

// Generate booking ID before saving
BookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Method to check if booking can be cancelled
BookingSchema.methods.canBeCancelled = function () {
  return ['requested', 'confirmed'].includes(this.status);
};

// Method to check if booking is active
BookingSchema.methods.isActive = function () {
  return this.status === 'active' && new Date() < this.endDate;
};

// Method to check if booking is expired
BookingSchema.methods.isExpired = function () {
  return this.status === 'active' && new Date() >= this.endDate;
};

// Method to update status with history
BookingSchema.methods.updateStatus = function (newStatus, updatedBy, reason) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    updatedBy,
    reason
  });
  return this.save();
};

// Method to add message
BookingSchema.methods.addMessage = function (senderId, message) {
  this.messages.push({
    sender: senderId,
    message,
    timestamp: new Date()
  });
  return this.save();
};

// Indexes for better query performance
BookingSchema.index({ roomId: 1 });
BookingSchema.index({ userId: 1 });
BookingSchema.index({ ownerId: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ bookingId: 1 });
BookingSchema.index({ checkInDate: 1 });
BookingSchema.index({ createdAt: -1 });

// Compound indexes for common queries
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ ownerId: 1, status: 1 });
BookingSchema.index({ roomId: 1, status: 1 });
BookingSchema.index({ status: 1, checkInDate: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
