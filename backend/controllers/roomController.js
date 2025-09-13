const Room = require('../models/Room');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;

// Get all rooms with filtering and pagination
const getRooms = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
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

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.area': { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      filter.$or = [
        { 'address.city': { $regex: location, $options: 'i' } },
        { 'address.area': { $regex: location, $options: 'i' } },
        { 'address.state': { $regex: location, $options: 'i' } }
      ];
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

    // Only show available rooms
    filter.isAvailable = true;

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
      data: {
        rooms,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRooms,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms',
      error: error.message
    });
  }
};

// Get single room by ID
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id)
      .populate('owner', 'name phone email verified')
      .lean();

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Increment view count
    await Room.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.status(200).json({
      success: true,
      data: { room }
    });
  } catch (error) {
    console.error('Get room by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room details',
      error: error.message
    });
  }
};

// Create new room (Owner only)
const createRoom = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      roomType,
      rentPerMonth,
      securityDeposit,
      address,
      amenities,
      rules,
      preferences
    } = req.body;

    // Create room object
    const roomData = {
      owner: req.user.id,
      title,
      description,
      roomType,
      rentPerMonth: parseInt(rentPerMonth),
      securityDeposit: parseInt(securityDeposit),
      address,
      amenities: Array.isArray(amenities) ? amenities : [],
      rules: Array.isArray(rules) ? rules : [],
      preferences: Array.isArray(preferences) ? preferences : [],
      photos: []
    };

    // Handle photo uploads if present
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: 'mess-wallah/rooms',
          transformation: [
            { width: 800, height: 600, crop: 'fill', quality: 'auto' }
          ]
        })
      );

      const uploadResults = await Promise.all(uploadPromises);
      roomData.photos = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id
      }));
    }

    const room = new Room(roomData);
    await room.save();

    // Populate owner details for response
    await room.populate('owner', 'name phone email verified');

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: { room }
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create room',
      error: error.message
    });
  }
};

// Update room (Owner only)
const updateRoom = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user is the owner
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }

    // Update room data
    const updateData = { ...req.body };

    // Handle new photo uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: 'mess-wallah/rooms',
          transformation: [
            { width: 800, height: 600, crop: 'fill', quality: 'auto' }
          ]
        })
      );

      const uploadResults = await Promise.all(uploadPromises);
      const newPhotos = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id
      }));

      updateData.photos = [...(room.photos || []), ...newPhotos];
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name phone email verified');

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: { room: updatedRoom }
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update room',
      error: error.message
    });
  }
};

// Delete room (Owner only)
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

    // Check if user is the owner
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this room'
      });
    }

    // Delete photos from cloudinary
    if (room.photos && room.photos.length > 0) {
      const deletePromises = room.photos.map(photo =>
        cloudinary.uploader.destroy(photo.publicId)
      );
      await Promise.all(deletePromises);
    }

    await Room.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete room',
      error: error.message
    });
  }
};

// Get room statistics
const getRoomStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments({ isAvailable: true });
    const totalUsers = await User.countDocuments();
    const totalBookings = await Room.aggregate([
      { $match: { isAvailable: false } },
      { $count: "bookings" }
    ]);

    const cityStats = await Room.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: '$address.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const priceStats = await Room.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: null,
          avgRent: { $avg: '$rentPerMonth' },
          minRent: { $min: '$rentPerMonth' },
          maxRent: { $max: '$rentPerMonth' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRooms,
        totalUsers,
        totalBookings: totalBookings[0]?.bookings || 0,
        successRate: 98, // Mock success rate
        cityStats,
        priceStats: priceStats[0] || { avgRent: 0, minRent: 0, maxRent: 0 }
      }
    });
  } catch (error) {
    console.error('Get room stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
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

    // Check if user is the owner
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
      message: `Room ${room.isAvailable ? 'made available' : 'marked as unavailable'}`,
      data: { room }
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update room availability',
      error: error.message
    });
  }
};

// Get featured rooms
const getFeaturedRooms = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const rooms = await Room.find({
      featured: true,
      isAvailable: true
    })
      .populate('owner', 'name phone email verified')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: { rooms }
    });
  } catch (error) {
    console.error('Get featured rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured rooms',
      error: error.message
    });
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
  getFeaturedRooms
};
