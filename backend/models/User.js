const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  email: {
    type: String,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'owner', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: null
  },

  // Profile information
  profile: {
    age: {
      type: Number,
      min: [18, 'Age must be at least 18'],
      max: [100, 'Age cannot exceed 100']
    },
    occupation: {
      type: String,
      maxlength: [100, 'Occupation cannot exceed 100 characters']
    },
    city: {
      type: String,
      maxlength: [50, 'City cannot exceed 50 characters']
    },
    state: {
      type: String,
      maxlength: [50, 'State cannot exceed 50 characters']
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    }
  },

  // For room owners
  ownerDetails: {
    businessName: String,
    businessAddress: String,
    gstNumber: String,
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String
    }
  },

  // Preferences for room seekers
  preferences: {
    roomType: {
      type: [String],
      enum: ['bachelor', 'family', 'student', 'pg']
    },
    budgetRange: {
      min: Number,
      max: Number
    },
    preferredCities: [String],
    amenities: [String]
  },

  // Activity tracking
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'profile.city': 1 });

// Get user without sensitive information
UserSchema.methods.getPublicProfile = function () {
  const user = this.toObject();
  return user;
};

module.exports = mongoose.model('User', UserSchema);
