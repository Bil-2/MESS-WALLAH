const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    match: [/^\+[1-9]\d{1,14}$/, 'Please enter a valid international phone number']
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    sparse: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'student', 'owner', 'admin'],
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  registrationMethod: {
    type: String,
    enum: ['otp', 'email', 'complete'],
    default: 'email'
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  // CRITICAL: Account linking fields for unified authentication
  accountType: {
    type: String,
    enum: ['otp-only', 'email-only', 'unified'],
    default: 'email-only'
  },
  canLinkEmail: {
    type: Boolean,
    default: false
  },
  college: {
    type: String,
    maxlength: [100, 'College name cannot exceed 100 characters']
  },
  course: {
    type: String,
    maxlength: [100, 'Course name cannot exceed 100 characters']
  },
  year: {
    type: String,
    maxlength: [20, 'Year cannot exceed 20 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }],

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
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    lastSeen: {
      type: Date,
      default: Date.now
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
      enum: ['single', 'shared', 'studio', 'apartment']
    },
    budgetRange: {
      min: Number,
      max: Number
    },
    preferredCities: [String],
    amenities: [String]
  },

  // Saved searches
  savedSearches: [{
    name: {
      type: String,
      required: true,
      maxlength: 100
    },
    searchParams: {
      type: Object,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Activity tracking
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Security fields
  passwordResetToken: String,
  passwordResetExpires: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for account lock status
UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Index for better query performance
UserSchema.index({ phone: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'profile.city': 1 });
UserSchema.index({ verified: 1 });
UserSchema.index({ isActive: 1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to increment login attempts
UserSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }

  return this.updateOne(updates);
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Get user without sensitive information
UserSchema.methods.getPublicProfile = function () {
  const user = this.toObject();
  delete user.password;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.loginAttempts;
  delete user.lockUntil;
  return user;
};

// Method to generate password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = require('crypto').randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.passwordResetToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
