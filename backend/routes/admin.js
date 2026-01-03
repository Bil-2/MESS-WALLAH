const express = require('express');
const router = express.Router();
const { param, body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const Room = require('../models/Room');
const User = require('../models/User');

// @desc    Get room photo metadata (for admin verification)
// @route   GET /api/admin/rooms/:id/photos
// @access  Private (Admin only)
router.get('/rooms/:id/photos', [
  protect,
  authorize('admin'),
  param('id').isMongoId().withMessage('Invalid room ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    const room = await Room.findById(req.params.id)
      .populate('owner', 'name phone email')
      .select('photos title owner');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Return detailed photo metadata
    const photoMetadata = room.photos.map((photo, index) => ({
      photoNumber: index + 1,
      url: photo.url,
      uploadType: photo.uploadType,
      uploadedAt: photo.uploadedAt,
      ipAddress: photo.uploadedFrom?.ipAddress,
      userAgent: photo.uploadedFrom?.userAgent,
      device: photo.uploadedFrom?.device,
      verified: photo.verified,
      isPrimary: photo.isPrimary
    }));

    res.json({
      success: true,
      data: {
        roomId: room._id,
        roomTitle: room.title,
        owner: room.owner,
        totalPhotos: room.photos.length,
        photos: photoMetadata,
        cameraPhotos: photoMetadata.filter(p => p.uploadType === 'camera').length,
        galleryPhotos: photoMetadata.filter(p => p.uploadType === 'gallery').length
      }
    });
  } catch (error) {
    console.error('Error fetching photo metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching photo metadata',
      error: error.message
    });
  }
});

// @desc    Verify room photos
// @route   PATCH /api/admin/rooms/:id/photos/verify
// @access  Private (Admin only)
router.patch('/rooms/:id/photos/verify', [
  protect,
  authorize('admin'),
  param('id').isMongoId().withMessage('Invalid room ID'),
  body('photoIndexes').isArray().withMessage('Photo indexes must be an array'),
  body('verified').isBoolean().withMessage('Verified must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    const { photoIndexes, verified } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Update verification status for specified photos
    photoIndexes.forEach(index => {
      if (room.photos[index]) {
        room.photos[index].verified = verified;
      }
    });

    await room.save();

    res.json({
      success: true,
      message: `Photos ${verified ? 'verified' : 'unverified'} successfully`,
      data: room
    });
  } catch (error) {
    console.error('Error verifying photos:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying photos',
      error: error.message
    });
  }
});

// @desc    Get suspicious uploads (multiple IPs, etc.)
// @route   GET /api/admin/suspicious-uploads
// @access  Private (Admin only)
router.get('/suspicious-uploads', protect, authorize('admin'), async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('owner', 'name phone email')
      .select('title owner photos createdAt');

    const suspicious = [];

    rooms.forEach(room => {
      const ipAddresses = new Set();
      const cameraCount = room.photos.filter(p => p.uploadType === 'camera').length;
      const totalPhotos = room.photos.length;

      room.photos.forEach(photo => {
        if (photo.uploadedFrom?.ipAddress) {
          ipAddresses.add(photo.uploadedFrom.ipAddress);
        }
      });

      // Flag if multiple IPs or no camera photos
      if (ipAddresses.size > 2 || (totalPhotos >= 8 && cameraCount === 0)) {
        suspicious.push({
          roomId: room._id,
          title: room.title,
          owner: room.owner,
          totalPhotos: totalPhotos,
          cameraPhotos: cameraCount,
          uniqueIPs: ipAddresses.size,
          ipAddresses: Array.from(ipAddresses),
          createdAt: room.createdAt,
          suspicionReason: ipAddresses.size > 2
            ? 'Multiple IP addresses detected'
            : 'No live camera photos'
        });
      }
    });

    res.json({
      success: true,
      data: {
        totalSuspicious: suspicious.length,
        suspiciousRooms: suspicious
      }
    });
  } catch (error) {
    console.error('Error fetching suspicious uploads:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching suspicious uploads',
      error: error.message
    });
  }
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const [totalRooms, totalUsers, totalBookings] = await Promise.all([
      Room.countDocuments(),
      User.countDocuments(),
      require('../models/Booking').countDocuments().catch(() => 0)
    ]);

    const stats = {
      totalRooms,
      totalUsers,
      totalBookings,
      activeRooms: await Room.countDocuments({ isAvailable: true }),
      verifiedRooms: await Room.countDocuments({ verified: true }),
      featuredRooms: await Room.countDocuments({ featured: true })
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin stats',
      error: error.message
    });
  }
});

module.exports = router;
