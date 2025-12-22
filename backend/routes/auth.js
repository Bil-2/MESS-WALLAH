const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Otp = require('../models/Otp');
const User = require('../models/User');
const { sendSms } = require('../services/notify');
const { sendEmail } = require('../utils/email');
const { protect, blacklistToken } = require('../middleware/auth');
const {
  rateLimiters,
  createBruteForceProtector,
  csrfProtection,
  handleFailedAttempt,
  handleSuccessfulAttempt,
  sanitizeInput
} = require('../middleware/advancedSecurity');

// Import enhanced OTP controller
const { sendOtp, verifyOtp, resendOtp } = require('../controllers/otpController');

// Import auth controller
const { register, login, forgotPassword, resetPassword, changePassword, getProfile, logout, checkUserExists } = require('../controllers/authController');

const router = express.Router();

// Apply security middleware to all auth routes
router.use(sanitizeInput);

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
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
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

// Alias routes for SMS OTP (for API test compatibility)
router.post('/send-otp-sms', [
  rateLimiters.general,
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number')
], sendOtp);

router.post('/verify-otp-sms', [
  createBruteForceProtector,
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
], verifyOtp);

// @desc    Send OTP to email address
// @route   POST /api/auth/send-otp-email
// @access  Public
router.post('/send-otp-email', [
  rateLimiters.general,
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
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

    const { email } = req.body;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    const otpRecord = new Otp({
      email: email.toLowerCase(),
      codeHash: await bcrypt.hash(otp, 10),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0,
      method: 'email'
    });
    await otpRecord.save();

    // Send OTP email using notify service
    const { sendOTPEmail } = require('../services/notify');
    await sendOTPEmail(email, otp);

    console.log(`[SUCCESS] OTP email sent to: ${email}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email address. Please check your inbox.',
      data: {
        email: email,
        expiresIn: 10, // minutes
        method: 'email',
        canResendAfter: 60 // seconds
      }
    });

  } catch (error) {
    console.error('[ERROR] Send OTP Email Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP email. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Verify OTP from email
// @route   POST /api/auth/verify-otp-email
// @access  Public
router.post('/verify-otp-email', [
  rateLimiters.general,
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
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

    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase();

    // Find OTP record
    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      method: 'email',
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.',
        error: 'OTP not found or expired'
      });
    }

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, otpRecord.codeHash);

    if (!isValidOTP) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();

      if (otpRecord.attempts >= 3) {
        await Otp.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({
          success: false,
          message: 'Too many failed attempts. Please request a new OTP.',
          error: 'Max attempts exceeded'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
        error: 'OTP verification failed',
        attemptsLeft: 3 - otpRecord.attempts
      });
    }

    // OTP verified successfully - clean up
    await Otp.deleteOne({ _id: otpRecord._id });

    // Find or create user
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new user with email
      user = new User({
        email: normalizedEmail,
        name: `User${Date.now()}`, // Default name
        role: 'user',
        isEmailVerified: true,
        registrationMethod: 'email-otp',
        isActive: true
      });
      await user.save();
      console.log(`[SUCCESS] NEW USER CREATED via Email OTP: ${normalizedEmail}`);
    } else {
      // Update existing user
      user.isEmailVerified = true;
      user.lastLogin = new Date();
      await user.save();
      console.log(`[SUCCESS] EXISTING USER VERIFIED via Email OTP: ${normalizedEmail}`);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Email OTP verified successfully! Welcome to MESS WALLAH!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isNewUser: !user.phone // If no phone, likely new user
        },
        token,
        loginMethod: 'Email OTP',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[ERROR] Verify Email OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getProfile);

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', [
  protect,
  rateLimiters.general,
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
], changePassword);

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
], changePassword);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', [protect, csrfProtection], (req, res) => {
  // Blacklist the current token
  if (req.token) {
    blacklistToken(req.token);
  }

  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0)
  });

  console.log(`[AUTH] User logged out: ${req.user?.email}`);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Check if user exists
// @route   POST /api/auth/check-user
// @access  Public
router.post('/check-user', [
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
], checkUserExists);

module.exports = router;
