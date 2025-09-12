const express = require('express');
const { body, validationResult, query } = require('express-validator');
const multer = require('multer');
const Room = require('../models/Room');
const User = require('../models/User');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary only if credentials are provided
let cloudinary = null;
if (process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET) {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (buffer, folder = 'mess-wallah/rooms') => {
  return new Promise((resolve, reject) => {
    if (!cloudinary) {
      reject(new Error('Cloudinary not configured'));
    } else {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    }
  });
};

// @desc    Get all rooms with search and filtering
// @route   GET /api/rooms
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1-50'),
  query('city').optional().trim().isLength({ min: 1 }).withMessage('City cannot be empty'),
  query('roomType').optional().isIn(['bachelor', 'family', 'student', 'pg']).withMessage('Invalid room type'),
  query('minRent').optional().isInt({ min: 0 }).withMessage('Min rent must be non-negative'),
  query('maxRent').optional().isInt({ min: 0 }).withMessage('Max rent must be non-negative'),
  query('occupancyType').optional().isIn(['single', 'shared', 'double', 'triple']).withMessage('Invalid occupancy type'),
  query('sortBy').optional().isIn(['rent', 'createdAt', 'rating', 'views']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], optionalAuth, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Extract query parameters
    const {
      page = 1,
      limit = 12,
      city,
      roomType,
      minRent,
      maxRent,
      occupancyType,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      amenities
    } = req.query;

    // Build search query
    const searchQuery = {
      isActive: true,
      isAvailable: true,
      availableRooms: { $gt: 0 }
    };

    // City filter
    if (city) {
      searchQuery['location.city'] = new RegExp(city, 'i');
    }

    // Room type filter
    if (roomType) {
      searchQuery.roomType = roomType;
    }

    // Occupancy type filter
    if (occupancyType) {
      searchQuery.occupancyType = occupancyType;
    }

    // Price range filter
    if (minRent || maxRent) {
      searchQuery['rent.monthly'] = {};
      if (minRent) searchQuery['rent.monthly'].$gte = parseInt(minRent);
      if (maxRent) searchQuery['rent.monthly'].$lte = parseInt(maxRent);
    }

    // Text search
    if (search) {
      searchQuery.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
        { 'location.nearbyLandmarks': { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Amenities filter
    if (amenities) {
      const amenityList = amenities.split(',');
      amenityList.forEach(amenity => {
        const [category, feature] = amenity.split('.');
        if (category && feature) {
          searchQuery[`amenities.${category}.${feature}`] = true;
        }
      });
    }

    // Sort options
    const sortOptions = {};
    if (sortBy === 'rent') {
      sortOptions['rent.monthly'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'rating') {
      sortOptions['rating.average'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'views') {
      sortOptions.views = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [rooms, totalCount] = await Promise.all([
      Room.find(searchQuery)
        .populate('owner', 'name phone email isVerified')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Room.countDocuments(searchQuery)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      data: {
        rooms,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        },
        filters: {
          city,
          roomType,
          minRent,
          maxRent,
          occupancyType,
          search,
          amenities
        }
      }
    });

  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms'
    });
  }
});

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('owner', 'name phone email isVerified profile.city profile.state')
      .lean();

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Increment view count (only if not the owner viewing)
    if (!req.user || req.user.id !== room.owner._id.toString()) {
      await Room.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
      room.views += 1;
    }

    res.status(200).json({
      success: true,
      data: { room }
    });

  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room details'
    });
  }
});

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Room owners only)
router.post('/', protect, authorize('owner'), upload.array('images', 10), [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5-100 characters'),
  body('description').trim().isLength({ min: 20, max: 1000 }).withMessage('Description must be between 20-1000 characters'),
  body('roomType').isIn(['bachelor', 'family', 'student', 'pg']).withMessage('Invalid room type'),
  body('occupancyType').isIn(['single', 'shared', 'double', 'triple']).withMessage('Invalid occupancy type'),
  body('totalRooms').isInt({ min: 1 }).withMessage('Total rooms must be at least 1'),
  body('availableRooms').isInt({ min: 0 }).withMessage('Available rooms cannot be negative'),
  body('rent.monthly').isInt({ min: 500 }).withMessage('Monthly rent must be at least ₹500'),
  body('rent.deposit').isInt({ min: 0 }).withMessage('Deposit cannot be negative'),
  body('location.address').trim().isLength({ min: 10, max: 200 }).withMessage('Address must be between 10-200 characters'),
  body('location.city').trim().isLength({ min: 2, max: 50 }).withMessage('City must be between 2-50 characters'),
  body('location.state').trim().isLength({ min: 2, max: 50 }).withMessage('State must be between 2-50 characters'),
  body('location.pincode').matches(/^[1-9][0-9]{5}$/).withMessage('Invalid pincode'),
  body('contact.phone').matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Validate available rooms <= total rooms
    if (parseInt(req.body.availableRooms) > parseInt(req.body.totalRooms)) {
      return res.status(400).json({
        success: false,
        message: 'Available rooms cannot exceed total rooms'
      });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        try {
          const result = await uploadToCloudinary(req.files[i].buffer);
          imageUrls.push({
            url: result.secure_url,
            caption: req.body[`imageCaption${i}`] || '',
            isPrimary: i === 0 // First image is primary
          });
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          // Continue with other images
        }
      }
    }

    // Create room data
    const roomData = {
      ...req.body,
      owner: req.user.id,
      images: imageUrls,
      // Parse nested objects
      rent: JSON.parse(req.body.rent || '{}'),
      location: JSON.parse(req.body.location || '{}'),
      amenities: JSON.parse(req.body.amenities || '{}'),
      rules: JSON.parse(req.body.rules || '{}'),
      preferredTenant: JSON.parse(req.body.preferredTenant || '{}'),
      contact: JSON.parse(req.body.contact || '{}')
    };

    const room = await Room.create(roomData);

    // Populate owner details
    await room.populate('owner', 'name phone email');

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
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Room owner only)
router.put('/:id', protect, authorize('owner'), upload.array('newImages', 10), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user owns this room
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }

    // Handle new image uploads
    const newImageUrls = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        try {
          const result = await uploadToCloudinary(req.files[i].buffer);
          newImageUrls.push({
            url: result.secure_url,
            caption: req.body[`newImageCaption${i}`] || '',
            isPrimary: false
          });
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
        }
      }
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Parse JSON fields if they exist
    ['rent', 'location', 'amenities', 'rules', 'preferredTenant', 'contact'].forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          // Keep original value if parsing fails
        }
      }
    });

    // Handle image updates
    if (newImageUrls.length > 0) {
      updateData.images = [...(room.images || []), ...newImageUrls];
    }

    // Remove images if specified
    if (req.body.removeImageUrls) {
      const removeUrls = JSON.parse(req.body.removeImageUrls);
      updateData.images = (updateData.images || room.images).filter(
        img => !removeUrls.includes(img.url)
      );
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name phone email');

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: { room: updatedRoom }
    });

  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update room'
    });
  }
});

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Room owner only)
router.delete('/:id', protect, authorize('owner'), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user owns this room
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this room'
      });
    }

    // Delete images from Cloudinary
    if (room.images && room.images.length > 0) {
      for (const image of room.images) {
        try {
          const publicId = image.url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`mess-wallah/rooms/${publicId}`);
        } catch (deleteError) {
          console.error('Image deletion error:', deleteError);
        }
      }
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });

  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete room'
    });
  }
});

// @desc    Toggle room availability
// @route   PATCH /api/rooms/:id/availability
// @access  Private (Room owner only)
router.patch('/:id/availability', protect, authorize('owner'), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user owns this room
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
      message: `Room ${room.isAvailable ? 'activated' : 'deactivated'} successfully`,
      data: { isAvailable: room.isAvailable }
    });

  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update room availability'
    });
  }
});

// @desc    Get rooms by owner
// @route   GET /api/rooms/owner/my-rooms
// @access  Private (Room owner only)
router.get('/owner/my-rooms', protect, authorize('owner'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const searchQuery = { owner: req.user.id };

    if (status) {
      if (status === 'active') {
        searchQuery.isActive = true;
        searchQuery.isAvailable = true;
      } else if (status === 'inactive') {
        searchQuery.$or = [
          { isActive: false },
          { isAvailable: false }
        ];
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [rooms, totalCount] = await Promise.all([
      Room.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Room.countDocuments(searchQuery)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        rooms,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get owner rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your rooms'
    });
  }
});

// @desc    Get room statistics
// @route   GET /api/rooms/stats/overview
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalRooms,
      availableRooms,
      citiesCount,
      avgRent
    ] = await Promise.all([
      Room.countDocuments({ isActive: true }),
      Room.countDocuments({ isActive: true, isAvailable: true, availableRooms: { $gt: 0 } }),
      Room.distinct('location.city', { isActive: true }).then(cities => cities.length),
      Room.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, avgRent: { $avg: '$rent.monthly' } } }
      ]).then(result => result[0]?.avgRent || 0)
    ]);

    const roomTypeStats = await Room.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$roomType', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRooms,
        availableRooms,
        citiesCount,
        avgRent: Math.round(avgRent),
        roomTypeStats
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;
