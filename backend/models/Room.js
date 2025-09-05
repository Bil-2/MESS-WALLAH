const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a room title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a room description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['single', 'shared', 'family', 'studio', 'apartment'],
    required: [true, 'Please specify room type']
  },
  targetAudience: {
    type: String,
    enum: ['students', 'bachelors', 'family', 'any'],
    required: [true, 'Please specify target audience']
  },
  messDetails: {
    messName: {
      type: String,
      required: [true, 'Please provide mess name']
    },
    messType: {
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'both', 'jain', 'vegan'],
      required: [true, 'Please specify mess food type']
    },
    mealPlans: [{
      name: {
        type: String,
        required: true,
        enum: ['breakfast-only', 'lunch-only', 'dinner-only', 'breakfast-lunch', 'lunch-dinner', 'all-meals', 'custom']
      },
      price: {
        type: Number,
        required: true
      },
      description: String,
      timings: {
        breakfast: { start: String, end: String },
        lunch: { start: String, end: String },
        dinner: { start: String, end: String }
      }
    }],
    cuisine: [{
      type: String,
      enum: ['north-indian', 'south-indian', 'gujarati', 'punjabi', 'bengali', 'maharashtrian', 'rajasthani', 'chinese', 'continental']
    }],
    specialDiets: [{
      type: String,
      enum: ['diabetic-friendly', 'low-sodium', 'gluten-free', 'keto', 'high-protein']
    }],
    messRating: {
      foodQuality: { type: Number, default: 0, min: 0, max: 5 },
      cleanliness: { type: Number, default: 0, min: 0, max: 5 },
      service: { type: Number, default: 0, min: 0, max: 5 },
      value: { type: Number, default: 0, min: 0, max: 5 }
    }
  },
  rent: {
    monthly: {
      type: Number,
      required: [true, 'Please provide monthly rent']
    },
    security: {
      type: Number,
      required: [true, 'Please provide security deposit']
    },
    maintenance: {
      type: Number,
      default: 0
    }
  },
  location: {
    address: {
      type: String,
      required: [true, 'Please provide address']
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    state: {
      type: String,
      required: [true, 'Please provide state']
    },
    pincode: {
      type: String,
      required: [true, 'Please provide pincode'],
      match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode']
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    nearbyPlaces: [{
      name: String,
      type: {
        type: String,
        enum: ['college', 'university', 'hospital', 'metro', 'bus_stop', 'market', 'restaurant', 'bank', 'atm', 'pharmacy']
      },
      distance: Number // in km
    }]
  },
  specifications: {
    area: {
      type: Number,
      required: [true, 'Please provide room area in sq ft']
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 1
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 1
    },
    floor: {
      type: Number,
      required: true
    },
    totalFloors: {
      type: Number,
      required: true
    },
    furnished: {
      type: String,
      enum: ['fully-furnished', 'semi-furnished', 'unfurnished'],
      required: true
    },
    occupancy: {
      current: { type: Number, default: 0 },
      maximum: { type: Number, required: true }
    },
    roomFeatures: [{
      type: String,
      enum: ['attached-bathroom', 'balcony', 'study-table', 'wardrobe', 'ac', 'fan', 'window', 'natural-light']
    }]
  },
  amenities: [{
    type: String,
    enum: [
      'wifi', 'parking', 'gym', 'swimming_pool', 'security', 'elevator',
      'power_backup', 'water_supply', 'ac', 'washing_machine', 'refrigerator',
      'microwave', 'tv', 'balcony', 'garden', 'playground', 'common_room',
      'study_room', 'library', 'laundry', 'housekeeping', 'cctv', 'fire_safety'
    ]
  }],
  communityFeatures: {
    commonAreas: [{
      type: String,
      enum: ['dining-hall', 'tv-lounge', 'study-room', 'recreation-room', 'terrace', 'garden', 'parking']
    }],
    events: [{
      type: String,
      enum: ['cultural-events', 'festivals', 'birthday-celebrations', 'study-groups', 'sports-activities']
    }],
    rules: {
      smokingAllowed: { type: Boolean, default: false },
      alcoholAllowed: { type: Boolean, default: false },
      petsAllowed: { type: Boolean, default: false },
      guestsAllowed: { type: Boolean, default: true },
      couplesAllowed: { type: Boolean, default: true },
      partyAllowed: { type: Boolean, default: false },
      quietHours: {
        start: { type: String, default: '22:00' },
        end: { type: String, default: '07:00' }
      }
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    },
    caption: String,
    category: {
      type: String,
      enum: ['room', 'bathroom', 'kitchen', 'dining', 'common-area', 'exterior', 'amenities'],
      default: 'room'
    }
  }],
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableFrom: {
      type: Date,
      required: true
    },
    minimumStay: {
      type: Number,
      default: 1 // in months
    },
    maximumStay: {
      type: Number,
      default: 12 // in months
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  verification: {
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    verifiedAt: Date,
    documents: [{
      type: { type: String, enum: ['ownership', 'license', 'safety', 'photos'] },
      url: String,
      verified: { type: Boolean, default: false }
    }]
  }
}, {
  timestamps: true
});

roomSchema.index({ 'location.coordinates': '2dsphere' });
roomSchema.index({ 'location.city': 1, 'rent.monthly': 1 });
roomSchema.index({ type: 1, targetAudience: 1 });
roomSchema.index({ 'messDetails.messType': 1 });
roomSchema.index({ 'messDetails.cuisine': 1 });
roomSchema.index({ isActive: 1, featured: -1 });
roomSchema.index({ 'ratings.average': -1 });

roomSchema.virtual('totalCost').get(function () {
  const baseCost = this.rent.monthly + this.rent.security + this.rent.maintenance;
  const mealCost = this.messDetails.mealPlans.length > 0 ?
    Math.min(...this.messDetails.mealPlans.map(plan => plan.price)) : 0;
  return baseCost + mealCost;
});

roomSchema.virtual('overallMessRating').get(function () {
  const ratings = this.messDetails.messRating;
  return (ratings.foodQuality + ratings.cleanliness + ratings.service + ratings.value) / 4;
});

module.exports = mongoose.model('Room', roomSchema);
