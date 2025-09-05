const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  respondToBooking,
  addMessage,
  cancelBooking,
  confirmBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules for booking creation
const bookingValidation = [
  body('roomId').isMongoId().withMessage('Invalid room ID'),
  body('checkIn').isISO8601().withMessage('Check-in date must be valid'),
  body('checkOut').isISO8601().withMessage('Check-out date must be valid'),
  body('duration').isInt({ min: 1, max: 24 }).withMessage('Duration must be between 1-24 months'),
  body('guests').isInt({ min: 1, max: 10 }).withMessage('Guests must be between 1-10'),
  body('message').optional().trim().isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters')
];

const responseValidation = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('message').optional().trim().isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters')
];

const messageValidation = [
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message must be between 1-500 characters')
];

// All routes require authentication
router.use(protect);

// Booking routes
router.post('/', bookingValidation, createBooking);
router.get('/', getMyBookings);
router.get('/:id', getBookingById);
router.put('/:id/respond', responseValidation, respondToBooking);
router.post('/:id/messages', messageValidation, addMessage);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/confirm', confirmBooking);

module.exports = router;
