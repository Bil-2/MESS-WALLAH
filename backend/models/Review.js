const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    overall: {
      type: Number,
      required: [true, 'Please provide overall rating'],
      min: 1,
      max: 5
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5
    },
    location: {
      type: Number,
      min: 1,
      max: 5
    },
    amenities: {
      type: Number,
      min: 1,
      max: 5
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5
    },
    ownerBehavior: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    maxlength: [500, 'Review cannot be more than 500 characters']
  },
  pros: [String],
  cons: [String],
  images: [{
    url: String,
    public_id: String
  }],
  ownerReply: {
    message: String,
    repliedAt: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  reportedBy: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    reason: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ room: 1, rating: -1 });
reviewSchema.index({ reviewer: 1 });

// Ensure one review per booking
reviewSchema.index({ booking: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
