const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomStats,
  toggleAvailability,
  getFeaturedRooms,
  getRoomContact
} = require('../controllers/roomController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 15 // Allow up to 15 photos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Validation rules
const roomValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('rentPerMonth').isNumeric().withMessage('Rent must be a number'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.pincode')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Pincode must be exactly 6 digits')
];

// Public routes (no authentication required)
router.get('/', optionalAuth, getRooms);
router.get('/stats', getRoomStats);
router.get('/featured', optionalAuth, getFeaturedRooms);

// @desc    Get rooms belonging to logged-in owner
// @route   GET /api/rooms/my-rooms
// @access  Private (Owner)
router.get('/my-rooms', protect, authorize('owner'), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const rooms = await require('../models/Room').find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await require('../models/Room').countDocuments({ owner: req.user._id });

    res.json({
      success: true,
      data: { rooms, total },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my-rooms error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve rooms' });
  }
});

router.get('/:id', optionalAuth, getRoomById);

// @desc    Get room owner contact details
// @route   GET /api/rooms/:id/contact
// @access  Private
router.get('/:id/contact', protect, getRoomContact);

// Protected routes (require authentication)
router.post(
  '/',
  protect,
  authorize('owner'),
  upload.fields([{ name: 'photos', maxCount: 15 }, { name: 'aadharDocument', maxCount: 1 }]),
  roomValidation,
  createRoom
);

router.put(
  '/:id',
  protect,
  authorize('owner'),
  upload.fields([{ name: 'photos', maxCount: 15 }, { name: 'aadharDocument', maxCount: 1 }]),
  roomValidation,
  updateRoom
);

router.delete('/:id', protect, authorize('owner'), deleteRoom);
router.patch('/:id/availability', protect, authorize('owner'), toggleAvailability);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB per file.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 15 files allowed.'
      });
    }
  }

  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed.'
    });
  }

  next(error);
});

module.exports = router;
