const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Room title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Room description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  roomType: {
    type: String,
    enum: ['single', 'shared', 'studio', 'apartment'],
    required: [true, 'Room type is required']
  },
  rentPerMonth: {
    type: Number,
    required: [true, 'Monthly rent is required'],
    min: [0, 'Rent cannot be negative']
  },
  securityDeposit: {
    type: Number,
    required: [true, 'Security deposit is required'],
    min: [0, 'Deposit cannot be negative']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    area: {
      type: String,
      required: [true, 'Area is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid pincode']
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  amenities: [{
    type: String,
    enum: [
      'wifi', 'ac', 'parking', 'laundry', 'kitchen', 'balcony',
      'furnished', 'gym', 'security', 'elevator', 'waterSupply',
      'powerBackup', 'tv', 'fridge', 'washingMachine', 'mess'
    ]
  }],
  photos: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    // Security & Anti-Scam Features
    uploadType: {
      type: String,
      enum: ['camera', 'gallery', 'uploaded'],
      default: 'uploaded'
    },
    uploadedFrom: {
      ipAddress: String,
      userAgent: String,
      device: String,
      location: {
        latitude: Number,
        longitude: Number
      }
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  rules: [String],
  preferences: [String],
  // Added for specific tenant targeting
  tenantType: {
    type: [String],
    enum: ['All', 'Bachelor', 'Family', 'Couples', 'Senior Citizen', 'Student', 'Working Professional'],
    default: ['All']
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  maxOccupancy: {
    type: Number,
    required: [true, 'Maximum occupancy is required'],
    min: [1, 'Occupancy must be at least 1'],
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  gender: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  verified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for owner name (for backward compatibility)
RoomSchema.virtual('ownerName').get(function () {
  return this.owner?.name || 'Unknown';
});

// FIXED: Remove conflicting virtual fields to avoid confusion
// Use actual schema fields: address.city for location, rentPerMonth for rent
// Virtual for full address string
RoomSchema.virtual('fullAddress').get(function () {
  const addr = this.address;
  return `${addr.street}, ${addr.area}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
});

// Virtual for display location (area, city)
RoomSchema.virtual('displayLocation').get(function () {
  return `${this.address.area}, ${this.address.city}`;
});

// Ensure virtuals are included in JSON output
RoomSchema.set('toJSON', { virtuals: true });
RoomSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update lastUpdated
RoomSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

// Method to calculate average rating
RoomSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.totalReviews = 0;
    return 0;
  }

  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = Math.round((totalRating / this.reviews.length) * 10) / 10;
  this.totalReviews = this.reviews.length;

  return this.rating;
};

// Method to add review
RoomSchema.methods.addReview = function (userId, rating, comment) {
  this.reviews.push({
    user: userId,
    rating,
    comment
  });

  this.calculateAverageRating();
  return this.save();
};

// Method to increment views
RoomSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// FIXED: Optimized indexes with correct field names and no duplicates
// Basic indexes for common queries
RoomSchema.index({ owner: 1 }); // Owner-based queries
RoomSchema.index({ roomType: 1 }); // Room type filtering
RoomSchema.index({ isAvailable: 1 }); // Availability filtering
RoomSchema.index({ featured: 1 }); // Featured rooms
RoomSchema.index({ rentPerMonth: 1 }); // Price filtering (FIXED: was 'price')
RoomSchema.index({ 'address.city': 1 }); // City-based searches (FIXED: was 'city')
RoomSchema.index({ 'address.area': 1 }); // Area-based searches
RoomSchema.index({ rating: -1 }); // Rating sorting
RoomSchema.index({ views: -1 }); // Views sorting
RoomSchema.index({ createdAt: -1 }); // Creation date sorting
RoomSchema.index({ amenities: 1 }); // Amenities filtering
RoomSchema.index({ maxOccupancy: 1 }); // Occupancy filtering

// Compound indexes for common query patterns
RoomSchema.index({ isAvailable: 1, 'address.city': 1, rentPerMonth: 1 }); // Search with availability, location, and price
RoomSchema.index({ roomType: 1, isAvailable: 1 }); // Room type with availability
RoomSchema.index({ 'address.city': 1, roomType: 1, isAvailable: 1 }); // City + type + availability
RoomSchema.index({ isAvailable: 1, featured: 1 }); // Available featured rooms

// Text index for search functionality
RoomSchema.index({
  title: 'text',
  description: 'text',
  'address.area': 'text',
  'address.city': 'text'
});

module.exports = mongoose.model('Room', RoomSchema);
