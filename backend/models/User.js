const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'professional', 'owner', 'admin'],
    default: 'student'
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']
  },
  avatar: {
    url: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    public_id: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Enhanced profile information
  profile: {
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    occupation: String,
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    },
    idProof: {
      type: { type: String, enum: ['aadhar', 'pan', 'passport', 'driving-license'] },
      number: String,
      verified: { type: Boolean, default: false }
    }
  },
  // Student-specific fields
  studentDetails: {
    college: {
      type: String,
      required: function () { return this.role === 'student'; }
    },
    course: {
      type: String,
      required: function () { return this.role === 'student'; }
    },
    year: {
      type: Number,
      required: function () { return this.role === 'student'; },
      min: 1,
      max: 6
    },
    studentId: String,
    graduationYear: Number
  },
  // Professional-specific fields
  professionalDetails: {
    company: {
      type: String,
      required: function () { return this.role === 'professional'; }
    },
    designation: String,
    workExperience: Number, // in years
    salary: {
      type: Number,
      select: false // Keep salary private
    }
  },
  // Owner-specific fields
  ownerDetails: {
    documentsVerified: {
      type: Boolean,
      default: false
    },
    bankDetails: {
      accountNumber: { type: String, select: false },
      ifscCode: String,
      accountHolderName: String,
      bankName: String
    },
    businessLicense: {
      number: String,
      verified: { type: Boolean, default: false },
      document: String
    },
    properties: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Room'
    }],
    totalEarnings: {
      type: Number,
      default: 0,
      select: false
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    }
  },
  address: {
    current: {
      street: String,
      area: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    permanent: {
      street: String,
      area: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  // Enhanced preferences for better matching
  preferences: {
    budget: {
      min: Number,
      max: Number
    },
    roomType: {
      type: String,
      enum: ['single', 'shared', 'family', 'any']
    },
    messType: {
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'both', 'jain', 'vegan']
    },
    cuisine: [{
      type: String,
      enum: ['north-indian', 'south-indian', 'gujarati', 'punjabi', 'bengali', 'maharashtrian', 'rajasthani', 'chinese', 'continental']
    }],
    amenities: [{
      type: String,
      enum: [
        'wifi', 'parking', 'gym', 'swimming_pool', 'security', 'elevator',
        'power_backup', 'water_supply', 'ac', 'washing_machine', 'refrigerator',
        'microwave', 'tv', 'balcony', 'garden', 'playground', 'common_room',
        'study_room', 'library', 'laundry', 'housekeeping', 'cctv', 'fire_safety'
      ]
    }],
    location: {
      preferredCities: [String],
      maxDistanceFromWork: Number, // in km
      nearbyRequirements: [{
        type: String,
        enum: ['college', 'university', 'hospital', 'metro', 'bus_stop', 'market', 'restaurant', 'bank', 'atm', 'pharmacy']
      }]
    },
    lifestyle: {
      smokingTolerance: { type: Boolean, default: false },
      alcoholTolerance: { type: Boolean, default: false },
      petFriendly: { type: Boolean, default: false },
      partyTolerance: { type: Boolean, default: false },
      quietHours: {
        start: String,
        end: String
      }
    }
  },
  // Activity tracking
  activity: {
    lastLogin: Date,
    searchHistory: [{
      query: String,
      filters: mongoose.Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now }
    }],
    viewedRooms: [{
      room: { type: mongoose.Schema.ObjectId, ref: 'Room' },
      viewedAt: { type: Date, default: Date.now }
    }],
    savedRooms: [{
      room: { type: mongoose.Schema.ObjectId, ref: 'Room' },
      savedAt: { type: Date, default: Date.now }
    }]
  },
  // Notification preferences
  notifications: {
    email: {
      newListings: { type: Boolean, default: true },
      bookingUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false }
    },
    sms: {
      bookingUpdates: { type: Boolean, default: true },
      emergencyAlerts: { type: Boolean, default: true }
    },
    push: {
      enabled: { type: Boolean, default: true },
      newMatches: { type: Boolean, default: true }
    }
  },
  // Account status
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'deactivated', 'pending-verification'],
    default: 'pending-verification'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    expiresAt: Date,
    features: [{
      type: String,
      enum: ['unlimited-search', 'priority-listing', 'advanced-filters', 'direct-contact', 'verified-badge']
    }]
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'address.current.city': 1 });
userSchema.index({ 'preferences.budget.min': 1, 'preferences.budget.max': 1 });
userSchema.index({ accountStatus: 1 });

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user's full profile based on role
userSchema.methods.getProfileData = function () {
  const baseProfile = {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    phone: this.phone,
    avatar: this.avatar,
    isVerified: this.isVerified,
    profile: this.profile,
    address: this.address,
    preferences: this.preferences,
    accountStatus: this.accountStatus
  };

  if (this.role === 'student') {
    baseProfile.studentDetails = this.studentDetails;
  } else if (this.role === 'professional') {
    baseProfile.professionalDetails = this.professionalDetails;
  } else if (this.role === 'owner') {
    baseProfile.ownerDetails = {
      ...this.ownerDetails,
      bankDetails: undefined, // Never expose bank details
      totalEarnings: undefined // Keep earnings private
    };
  }

  return baseProfile;
};

// Method to check if user can access premium features
userSchema.methods.hasPremiumAccess = function () {
  return this.subscription.plan !== 'free' &&
    this.subscription.expiresAt &&
    this.subscription.expiresAt > new Date();
};

module.exports = mongoose.model('User', userSchema);
