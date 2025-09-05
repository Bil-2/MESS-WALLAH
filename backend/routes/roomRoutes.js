const express = require('express');
const { body } = require('express-validator');
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getMyRooms,
  searchRooms
} = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');
const { ownerOnly } = require('../middleware/roleMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

// Validation rules for room creation
const roomValidation = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5-100 characters'),
  body('description').trim().isLength({ min: 20, max: 1000 }).withMessage('Description must be between 20-1000 characters'),
  body('type').isIn(['single', 'shared', 'family', 'studio', 'apartment']).withMessage('Invalid room type'),
  body('targetAudience').isIn(['students', 'bachelors', 'family', 'any']).withMessage('Invalid target audience'),
  body('rent.monthly').isNumeric().withMessage('Monthly rent must be a number'),
  body('rent.security').isNumeric().withMessage('Security deposit must be a number'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.pincode').matches(/^\d{6}$/).withMessage('Pincode must be 6 digits'),
  body('location.coordinates.lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.coordinates.lng').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('specifications.area').isNumeric().withMessage('Area must be a number'),
  body('specifications.bedrooms').isInt({ min: 1 }).withMessage('Bedrooms must be at least 1'),
  body('specifications.bathrooms').isInt({ min: 1 }).withMessage('Bathrooms must be at least 1'),
  body('specifications.floor').isInt({ min: 0 }).withMessage('Floor must be a valid number'),
  body('specifications.totalFloors').isInt({ min: 1 }).withMessage('Total floors must be at least 1'),
  body('specifications.furnished').isIn(['fully-furnished', 'semi-furnished', 'unfurnished']).withMessage('Invalid furnished type'),
  body('availability.availableFrom').isISO8601().withMessage('Available from date must be valid')
];

// Public routes
router.get('/', getRooms);
router.get('/search', searchRooms);
router.get('/:id', getRoomById);

// Protected routes (require authentication)
router.use(protect);

// Owner-only routes
router.post('/', ownerOnly, upload.array('images', 10), roomValidation, createRoom);
router.put('/:id', ownerOnly, upload.array('images', 10), updateRoom);
router.delete('/:id', ownerOnly, deleteRoom);
router.get('/owner/my-rooms', ownerOnly, getMyRooms);

module.exports = router;
