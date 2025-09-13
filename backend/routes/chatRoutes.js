const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const { rateLimiters } = require('../middleware/advancedSecurity');

const router = express.Router();

// Apply rate limiting and authentication to all routes
router.use(rateLimiters.general);
router.use(protect);

// @desc    Get chat messages for a room
// @route   GET /api/chat/:roomId
// @access  Private
router.get('/:roomId', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
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

    const { roomId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Mock chat messages for now
    const messages = [];

    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Send a message to a room
// @route   POST /api/chat/:roomId
// @access  Private
router.post('/:roomId', [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters')
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

    const { roomId } = req.params;
    const { message } = req.body;

    // Mock message creation for now
    const newMessage = {
      id: Date.now().toString(),
      roomId,
      userId: req.user.id,
      userName: req.user.name,
      message,
      timestamp: new Date()
    };

    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
