const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Otp = require('../models/Otp');
const User = require('../models/User');
const { sendSms } = require('../services/notify');
const { sendEmail } = require('../utils/email');
const { protect } = require('../middleware/auth');
const {
  rateLimiters,
  createBruteForceProtector,
  csrfProtection
} = require('../middleware/advancedSecurity');

// Import enhanced OTP controller
const { sendOtp, verifyOtp, resendOtp } = require('../controllers/otpController');

// Import auth controller
const { register, login, forgotPassword, resetPassword, changePassword, getProfile, logout } = require('../controllers/authController');

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(rateLimiters.auth);

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  rateLimiters.general,
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2-50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number')
], register);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  createBruteForceProtector,
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], login);

// @desc    Send OTP to phone number
// @route   POST /api/auth/send-otp
// @access  Public
router.post('/send-otp', [
  rateLimiters.general,
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number')
], sendOtp);

// @desc    Verify OTP and authenticate user
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', [
  createBruteForceProtector,
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
], verifyOtp);

// @desc    Resend OTP to phone number
// @route   POST /api/auth/resend-otp
// @access  Public
router.post('/resend-otp', [
  rateLimiters.general,
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number')
], resendOtp);

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getProfile);

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', [
  protect,
  csrfProtection,
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('profile.age').optional().isInt({ min: 18, max: 100 }).withMessage('Age must be between 18-100'),
  body('profile.city').optional().trim().isLength({ max: 50 }).withMessage('City cannot exceed 50 characters'),
  body('profile.state').optional().trim().isLength({ max: 50 }).withMessage('State cannot exceed 50 characters'),
  body('profile.occupation').optional().trim().isLength({ max: 100 }).withMessage('Occupation cannot exceed 100 characters'),
  body('profile.bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters')
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

    const allowedUpdates = ['name', 'email', 'role', 'profile', 'preferences', 'ownerDetails'];
    const updates = {};

    // Filter allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Check if email is already taken by another user
    if (updates.email) {
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: req.user.id }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Profile update failed'
    });
  }
});

// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', [
  rateLimiters.general,
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
], forgotPassword);

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', [
  rateLimiters.general,
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
], resetPassword);

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
router.post('/change-password', [
  protect,
  rateLimiters.general,
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
], changePassword);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', [protect, csrfProtection], (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
