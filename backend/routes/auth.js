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
const { register, login } = require('../controllers/authController');

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
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

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

    // Check if user exists in database
    const user = await User.findOne({ email });
    
    if (!user) {
      // Return success message to prevent email enumeration
      // but don't actually send email
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Professional Email content
    const emailContent = {
      to: email,
      subject: '🔐 Reset Your MESS WALLAH Password',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - MESS WALLAH</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 40px 20px; text-align: center;">
              <div style="background: rgba(255,255,255,0.1); border-radius: 50px; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">🏠</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                MESS WALLAH
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
                Your Trusted Accommodation Partner
              </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background: #fef2f2; border-radius: 50px; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 24px;">🔐</span>
                </div>
                <h2 style="color: #1f2937; margin: 0; font-size: 24px; font-weight: 600;">
                  Password Reset Request
                </h2>
              </div>
              
              <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #ff6b35;">
                <p style="color: #374151; line-height: 1.6; margin: 0 0 15px; font-size: 16px;">
                  Hello <strong>${user.name || 'User'}</strong>,
                </p>
                
                <p style="color: #6b7280; line-height: 1.6; margin: 0; font-size: 15px;">
                  We received a request to reset your password for your MESS WALLAH account. 
                  If you made this request, click the button below to create a new password.
                </p>
              </div>
              
              <!-- Reset Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); 
                          color: #ffffff; 
                          padding: 16px 32px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          display: inline-block;
                          font-weight: 600;
                          font-size: 16px;
                          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
                          transition: all 0.3s ease;">
                  🔓 Reset My Password
                </a>
              </div>
              
              <!-- Security Info -->
              <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <div style="display: flex; align-items: flex-start;">
                  <span style="font-size: 20px; margin-right: 12px;">⚠️</span>
                  <div>
                    <h3 style="color: #92400e; margin: 0 0 8px; font-size: 16px; font-weight: 600;">
                      Security Notice
                    </h3>
                    <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
                      This reset link will expire in <strong>15 minutes</strong> for your security. 
                      If you didn't request this reset, please ignore this email.
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Alternative Link -->
              <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="color: #6b7280; margin: 0 0 10px; font-size: 14px;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="color: #3b82f6; word-break: break-all; margin: 0; font-size: 13px; font-family: monospace;">
                  ${resetUrl}
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #1f2937; padding: 30px; text-align: center;">
              <div style="margin-bottom: 20px;">
                <h3 style="color: #ffffff; margin: 0 0 10px; font-size: 18px;">MESS WALLAH</h3>
                <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                  Making accommodation search simple and secure
                </p>
              </div>
              
              <div style="border-top: 1px solid #374151; padding-top: 20px;">
                <p style="color: #6b7280; margin: 0 0 10px; font-size: 12px;">
                  This email was sent by MESS WALLAH
                </p>
                <p style="color: #6b7280; margin: 0; font-size: 12px;">
                  Need help? Contact us at <a href="mailto:${process.env.GMAIL_USER}" style="color: #ff6b35;">${process.env.GMAIL_USER}</a>
                </p>
              </div>
            </div>
            
          </div>
        </body>
        </html>
      `,
      text: `
🏠 MESS WALLAH - Password Reset Request

Hello ${user.name || 'User'},

We received a request to reset your password for your MESS WALLAH account.

To reset your password, please click the following link:
${resetUrl}

⚠️ SECURITY NOTICE:
- This link will expire in 15 minutes for your security
- If you didn't request this reset, please ignore this email
- Your password will remain unchanged if you don't use this link

Need help? Contact us at ${process.env.GMAIL_USER}

Best regards,
MESS WALLAH Team
Your Trusted Accommodation Partner
      `
    };

    // Send email only if user exists
    await sendEmail(emailContent);

    res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
});

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', [
  rateLimiters.general,
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
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

    const { token, password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

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
