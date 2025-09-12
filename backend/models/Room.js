const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  ownerId: {
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
  address: {
    line1: {
      type: String,
      required: [true, 'Address line 1 is required']
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
    lat: Number,
    lng: Number
  },
  rentPerMonth: {
    type: Number,
    required: [true, 'Monthly rent is required'],
    min: [0, 'Rent cannot be negative']
  },
  deposit: {
    type: Number,
    required: [true, 'Deposit amount is required'],
    min: [0, 'Deposit cannot be negative']
  },
  amenities: [{
    type: String,
    enum: [
      'wifi', 'ac', 'parking', 'laundry', 'kitchen', 'balcony',
      'furnished', 'gym', 'security', 'elevator', 'water_supply',
      'power_backup', 'tv', 'fridge', 'washing_machine'
    ]
  }],
  photos: [String],
  availableFrom: {
    type: Date,
    required: [true, 'Available from date is required']
  },
  maxOccupancy: {
    type: Number,
    required: [true, 'Maximum occupancy is required'],
    min: [1, 'Occupancy must be at least 1']
  },
  roomType: {
    type: String,
    enum: ['bachelor', 'family', 'student', 'pg'],
    required: [true, 'Room type is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
RoomSchema.index({ ownerId: 1 });
RoomSchema.index({ 'address.city': 1 });
RoomSchema.index({ 'address.state': 1 });
RoomSchema.index({ roomType: 1 });
RoomSchema.index({ rentPerMonth: 1 });
RoomSchema.index({ isActive: 1, isAvailable: 1 });
RoomSchema.index({ createdAt: -1 });

// Compound indexes for common queries
RoomSchema.index({ 'address.city': 1, roomType: 1, isActive: 1 });
RoomSchema.index({ rentPerMonth: 1, 'address.city': 1, isActive: 1 });

module.exports = mongoose.model('Room', RoomSchema);
