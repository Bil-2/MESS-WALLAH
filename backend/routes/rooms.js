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
  getFeaturedRooms
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
router.get('/:id', optionalAuth, getRoomById);

// Protected routes (require authentication)
router.post(
  '/',
  protect,
  authorize('owner'),
  upload.array('photos', 15), // Allow up to 15 photos
  roomValidation,
  createRoom
);

router.put(
  '/:id',
  protect,
  authorize('owner'),
  upload.array('photos', 10),
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
        message: 'Too many files. Maximum 10 files allowed.'
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
