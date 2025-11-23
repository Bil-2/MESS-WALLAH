const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`
  }),
  async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        console.error('❌ No user found after Google authentication');
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
      }

      console.log('✅ Google authentication successful for:', user.email);

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );

      // Prepare user data (remove sensitive fields)
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verified: user.verified,
        profilePicture: user.profilePicture,
        accountType: user.accountType || 'social',
        registrationMethod: user.registrationMethod || 'google'
      };

      // Redirect to frontend with token and user data
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      
      res.redirect(redirectUrl);

    } catch (error) {
      console.error('❌ Error in Google callback:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=server_error`);
    }
  }
);

/**
 * @route   GET /api/auth/google/status
 * @desc    Check Google OAuth configuration status
 * @access  Public
 */
router.get('/google/status', (req, res) => {
  const isConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  
  res.json({
    success: true,
    configured: isConfigured,
    message: isConfigured 
      ? 'Google OAuth is configured and ready' 
      : 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file'
  });
});

module.exports = router;
