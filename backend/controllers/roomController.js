const Room = require('../models/Room');
const { validationResult } = require('express-validator');

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Owner only)
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

    const roomData = {
      ...req.body,
      owner: req.user._id
    };

    const room = await Room.create(roomData);
    await room.populate('owner', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating room',
      error: error.message
    });
  }
};

// @desc    Get all rooms with filtering and pagination
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = { isActive: true };

    // Location filter
    if (req.query.city) {
      filter['location.city'] = new RegExp(req.query.city, 'i');
    }

    // Price range filter
    if (req.query.minRent || req.query.maxRent) {
      filter['rent.monthly'] = {};
      if (req.query.minRent) filter['rent.monthly'].$gte = parseInt(req.query.minRent);
      if (req.query.maxRent) filter['rent.monthly'].$lte = parseInt(req.query.maxRent);
    }

    // Room type filter
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Target audience filter
    if (req.query.targetAudience) {
      filter.targetAudience = req.query.targetAudience;
    }

    // Amenities filter
    if (req.query.amenities) {
      const amenitiesArray = req.query.amenities.split(',');
      filter.amenities = { $in: amenitiesArray };
    }

    // Furnished filter
    if (req.query.furnished) {
      filter['specifications.furnished'] = req.query.furnished;
    }

    // Availability filter
    if (req.query.availableFrom) {
      filter['availability.availableFrom'] = { $lte: new Date(req.query.availableFrom) };
    }

    // Build sort object
    let sort = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort = { createdAt: -1 }; // Default sort by newest
    }

    // Location-based search (nearby rooms)
    if (req.query.lat && req.query.lng && req.query.radius) {
      const lat = parseFloat(req.query.lat);
      const lng = parseFloat(req.query.lng);
      const radius = parseFloat(req.query.radius) * 1000; // Convert km to meters

      filter['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radius
        }
      };
    }

    const rooms = await Room.find(filter)
      .populate('owner', 'name phone isVerified')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Room.countDocuments(filter);

    res.json({
      success: true,
      data: {
        rooms,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms',
      error: error.message
    });
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('owner', 'name email phone isVerified documentsVerified');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Increment view count
    room.views += 1;
    await room.save();

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching room',
      error: error.message
    });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Owner only)
const updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user is the owner
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('owner', 'name email phone');

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating room',
      error: error.message
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Owner only)
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user is the owner
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this room'
      });
    }

    // Soft delete - just mark as inactive
    room.isActive = false;
    await room.save();

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting room',
      error: error.message
    });
  }
};

// @desc    Get rooms by owner
// @route   GET /api/rooms/owner/my-rooms
// @access  Private (Owner only)
const getMyRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const rooms = await Room.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Room.countDocuments({ owner: req.user._id });

    res.json({
      success: true,
      data: {
        rooms,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your rooms',
      error: error.message
    });
  }
};

// @desc    Search rooms with text
// @route   GET /api/rooms/search
// @access  Public
const searchRooms = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchFilter = {
      isActive: true,
      $or: [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { 'location.address': new RegExp(q, 'i') },
        { 'location.city': new RegExp(q, 'i') },
        { type: new RegExp(q, 'i') },
        { targetAudience: new RegExp(q, 'i') }
      ]
    };

    const rooms = await Room.find(searchFilter)
      .populate('owner', 'name phone isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Room.countDocuments(searchFilter);

    res.json({
      success: true,
      data: {
        rooms,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching rooms',
      error: error.message
    });
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getMyRooms,
  searchRooms
};
