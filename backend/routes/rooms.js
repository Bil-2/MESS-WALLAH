const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const advancedSecurity = require('../middleware/advancedSecurity');
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
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Validation middleware
const roomValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  body('roomType')
    .isIn(['single', 'shared', 'studio', 'apartment'])
    .withMessage('Invalid room type'),
  body('rentPerMonth')
    .isInt({ min: 1000, max: 100000 })
    .withMessage('Rent must be between ₹1,000 and ₹1,00,000'),
  body('securityDeposit')
    .isInt({ min: 0, max: 200000 })
    .withMessage('Security deposit must be between ₹0 and ₹2,00,000'),
  body('address.street')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),
  body('address.area')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Area must be between 2 and 100 characters'),
  body('address.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('address.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('address.pincode')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Pincode must be exactly 6 digits')
];

// Public routes
router.get('/', optionalAuth, getRooms);
router.get('/stats', getRoomStats);
router.get('/featured', getFeaturedRooms);
router.get('/:id', optionalAuth, getRoomById);

// Protected routes (require authentication)
router.post(
  '/',
  protect,
  authorize('owner'),
  upload.array('photos', 10),
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

router.delete(
  '/:id',
  protect,
  authorize('owner'),
  deleteRoom
);

router.patch(
  '/:id/availability',
  protect,
  authorize('owner'),
  toggleAvailability
);

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
