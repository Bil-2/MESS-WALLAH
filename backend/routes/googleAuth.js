const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get('/google', (req, res, next) => {
  // Capture the frontend URL from the request origin or query param
  const frontendUrl = req.query.redirect_url || req.headers.origin || req.headers.referer || process.env.FRONTEND_URL || 'http://localhost:5173';
  const frontendBase = frontendUrl.replace(/\/$/, '').split('?')[0]; // Remove trailing slash and query params

  // Pass frontend URL through OAuth state parameter (base64 encoded for safety)
  const state = Buffer.from(JSON.stringify({ frontend: frontendBase })).toString('base64');

  console.log(`[AUTH] Initiating Google OAuth from frontend: ${frontendBase}`);

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: state
  })(req, res, next);
});

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=registration_required`
  }),
  async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        console.error('[ERROR] No user found after Google authentication');
        const frontendUrl = req.headers.referer || req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';
        const frontendBase = frontendUrl.replace(/\/$/, '');
        return res.redirect(`${frontendBase}/login?error=auth_failed`);
      }

      console.log('[SUCCESS] Google authentication successful for:', user.email);

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

      // SECURITY: Don't pass sensitive data in URL - use secure cookie instead
      // Set token in HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Allow redirect
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Store minimal user data in a separate cookie (non-sensitive only)
      const publicUserData = {
        id: user._id,
        name: user.name,
        role: user.role
      };

      res.cookie('user_data', JSON.stringify(publicUserData), {
        httpOnly: false, // Readable by JS
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Detect frontend URL from OAuth state parameter (passed from initiation)
      let frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';

      try {
        if (req.query.state) {
          const stateData = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
          if (stateData.frontend) {
            frontendBase = stateData.frontend;
            console.log(`[AUTH] Using frontend from state: ${frontendBase}`);
          }
        }
      } catch (e) {
        console.log('[AUTH] Could not decode state, using fallback frontend URL');
      }

      // Redirect to frontend success page with token and user data in URL
      // (Frontend expects these as query parameters)
      const userDataString = encodeURIComponent(JSON.stringify(publicUserData));
      const redirectUrl = `${frontendBase}/auth/google/success?token=${token}&user=${userDataString}`;

      res.redirect(redirectUrl);

    } catch (error) {
      console.error('[ERROR] Error in Google callback:', error);
      const frontendUrl = req.headers.referer || req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';
      const frontendBase = frontendUrl.replace(/\/$/, '');
      res.redirect(`${frontendBase}/login?error=server_error`);
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
