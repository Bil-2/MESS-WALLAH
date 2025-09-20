const Room = require('../models/Room');
const User = require('../models/User');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { createSafeSearchQuery } = require('../utils/regexSecurity');
const logger = require('../utils/productionLogger');

// Get all rooms with filtering and pagination
const getRooms = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      location,
      minRent,
      maxRent,
      roomType,
      amenities,
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object - make isAvailable optional for testing
    const filter = {};
    
    // Only filter by isAvailable if it's explicitly set to false
    if (req.query.isAvailable === 'false') {
      filter.isAvailable = false;
    } else if (req.query.isAvailable === 'true') {
      filter.isAvailable = true;
    }
    // If not specified, show all rooms

    if (search) {
      const searchQuery = createSafeSearchQuery(search, [
        'title',
        'description', 
        'address.city',
        'address.area'
      ]);
      Object.assign(filter, searchQuery);
    }

    if (location) {
      const locationQuery = createSafeSearchQuery(location, [
        'address.city',
        'address.area',
        'address.state'
      ]);
      Object.assign(filter, locationQuery);
    }

    if (minRent || maxRent) {
      filter.rentPerMonth = {};
      if (minRent) filter.rentPerMonth.$gte = parseInt(minRent);
      if (maxRent) filter.rentPerMonth.$lte = parseInt(maxRent);
    }

    if (roomType) {
      filter.roomType = roomType;
    }

    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      filter.amenities = { $in: amenitiesArray };
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const rooms = await Room.find(filter)
      .populate('owner', 'name phone email verified')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalRooms = await Room.countDocuments(filter);
    const totalPages = Math.ceil(totalRooms / parseInt(limit));

    res.status(200).json({
      success: true,
      data: rooms,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRooms,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error in getRooms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms',
      error: error.message
    });
  }
};

// Get featured rooms
const getFeaturedRooms = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not available'
      });
    }

    console.log('Fetching featured rooms with limit:', limit);

    const rooms = await Room.find({
      featured: true,
      isAvailable: true
    })
      .populate('owner', 'name phone email verified')
      .sort({ rating: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    console.log('Found featured rooms:', rooms.length);

    // Transform rooms data for frontend compatibility
    const transformedRooms = rooms.map(room => ({
      ...room,
      image: room.photos && room.photos.length > 0 ? room.photos[0].url : null,
      rent: room.rentPerMonth,
      location: `${room.address?.area || ''}, ${room.address?.city || ''}`.trim().replace(/^,\s*/, ''),
      verified: room.owner?.verified || false,
      reviews: room.totalReviews || 0
    }));

    res.status(200).json({
      success: true,
      data: {
        rooms: transformedRooms
      }
    });
  } catch (error) {
    console.error('Error in getFeaturedRooms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured rooms',
      error: error.message
    });
  }
};

// Get room by ID
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid room ID'
      });
    }

    const room = await Room.findById(id)
      .populate('owner', 'name phone email verified createdAt')
      .populate('reviews.user', 'name');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error in getRoomById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching room',
      error: error.message
    });
  }
};

// Create new room
const createRoom = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const roomData = {
      ...req.body,
      owner: req.user.id
    };

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      roomData.photos = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename
      }));
    }

    const room = new Room(roomData);
    await room.save();

    const populatedRoom = await Room.findById(room._id)
      .populate('owner', 'name phone email verified');

    res.status(201).json({
      success: true,
      data: populatedRoom,
      message: 'Room created successfully'
    });
  } catch (error) {
    console.error('Error in createRoom:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating room',
      error: error.message
    });
  }
};

// Update room
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check ownership
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }

    const updateData = { ...req.body };

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename
      }));
      updateData.photos = [...(room.photos || []), ...newPhotos];
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('owner', 'name phone email verified');

    res.status(200).json({
      success: true,
      data: updatedRoom,
      message: 'Room updated successfully'
    });
  } catch (error) {
    console.error('Error in updateRoom:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating room',
      error: error.message
    });
  }
};

// Delete room
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check ownership
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this room'
      });
    }

    await Room.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteRoom:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting room',
      error: error.message
    });
  }
};

// Toggle room availability
const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check ownership
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this room'
      });
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    res.status(200).json({
      success: true,
      data: room,
      message: `Room ${room.isAvailable ? 'made available' : 'made unavailable'}`
    });
  } catch (error) {
    console.error('Error in toggleAvailability:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating room availability',
      error: error.message
    });
  }
};

// Get room statistics
const getRoomStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ isAvailable: true });
    const featuredRooms = await Room.countDocuments({ featured: true });

    const avgRent = await Room.aggregate([
      { $group: { _id: null, avgRent: { $avg: '$rentPerMonth' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRooms,
        availableRooms,
        featuredRooms,
        averageRent: avgRent[0]?.avgRent || 0
      }
    });
  } catch (error) {
    console.error('Error in getRoomStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching room statistics',
      error: error.message
    });
  }
};

// Seed sample rooms function
const seedSampleRooms = async () => {
  try {
    console.log('🌱 Starting room seeding process...');

    // Check if rooms already exist
    const existingRooms = await Room.countDocuments();
    if (existingRooms > 0) {
      console.log(`📊 Database already has ${existingRooms} rooms. Skipping seeding.`);
      return;
    }

    // Create a sample owner user if none exists
    let sampleOwner = await User.findOne({ email: 'owner@messwallah.com' });
    if (!sampleOwner) {
      sampleOwner = new User({
        name: 'Sample Owner',
        email: 'owner@messwallah.com',
        phone: '9876543210',
        role: 'owner',
        verified: true,
        password: 'hashedpassword123' // In real app, this would be properly hashed
      });
      await sampleOwner.save();
      console.log('✅ Sample owner created');
    }

    // Sample room data
    const sampleRooms = [
      {
        title: 'Cozy Single Room in Koramangala',
        description: 'A comfortable single room with all basic amenities in the heart of Koramangala.',
        roomType: 'single',
        rentPerMonth: 12000,
        securityDeposit: 24000,
        address: {
          street: '123 Main Street',
          area: 'Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560034'
        },
        amenities: ['WiFi', 'AC', 'Parking', 'Security'],
        photos: [{
          url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
          filename: 'sample1.jpg'
        }],
        owner: sampleOwner._id,
        featured: true,
        isAvailable: true,
        rating: 4.5,
        totalReviews: 12
      },
      {
        title: 'Shared Room Near IT Park',
        description: 'Affordable shared accommodation perfect for working professionals.',
        roomType: 'shared',
        rentPerMonth: 8000,
        securityDeposit: 16000,
        address: {
          street: '456 Tech Street',
          area: 'Electronic City',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560100'
        },
        amenities: ['WiFi', 'Laundry', 'Kitchen', 'Security'],
        photos: [{
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          filename: 'sample2.jpg'
        }],
        owner: sampleOwner._id,
        featured: true,
        isAvailable: true,
        rating: 4.2,
        totalReviews: 8
      },
      {
        title: 'Studio Apartment in Indiranagar',
        description: 'Modern studio apartment with kitchen and all amenities.',
        roomType: 'studio',
        rentPerMonth: 18000,
        securityDeposit: 36000,
        address: {
          street: '789 Garden Road',
          area: 'Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560038'
        },
        amenities: ['WiFi', 'AC', 'Kitchen', 'Parking', 'Gym'],
        photos: [{
          url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
          filename: 'sample3.jpg'
        }],
        owner: sampleOwner._id,
        featured: true,
        isAvailable: true,
        rating: 4.7,
        totalReviews: 15
      }
    ];

    // Insert sample rooms
    await Room.insertMany(sampleRooms);
    console.log(`✅ Successfully seeded ${sampleRooms.length} sample rooms`);

  } catch (error) {
    console.error('❌ Error seeding rooms:', error);
    throw error;
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomStats,
  toggleAvailability,
  getFeaturedRooms,
  seedSampleRooms
};
