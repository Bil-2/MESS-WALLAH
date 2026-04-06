const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('[AUTH] Google OAuth: Processing authentication for:', profile.emails[0].value);

        // Extract user information from Google profile
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;
        const profilePicture = profile.photos[0]?.value;

        // Check if user already exists
        let user = await User.findOne({
          $or: [
            { email: email },
            { 'socialAuth.googleId': googleId }
          ]
        });

        if (user) {
          // User exists - update Google info if not already set
          console.log('[SUCCESS] Existing user found:', user.email);

          if (!user.socialAuth) {
            user.socialAuth = {};
          }

          if (!user.socialAuth.googleId) {
            user.socialAuth.googleId = googleId;
            user.socialAuth.provider = 'google';
          }

          if (!user.profilePicture && profilePicture) {
            user.profilePicture = profilePicture;
          }

          user.verified = true; // Google accounts are pre-verified
          user.isVerified = true;
          user.isEmailVerified = true;
          user.lastLogin = new Date();

          await user.save();

          return done(null, user);
        }

        // Auto-register new users who sign in with Google
        console.log('[AUTH] Google OAuth: Creating new user from Google profile:', email);
        user = await User.create({
          name,
          email,
          password: Math.random().toString(36) + Math.random().toString(36), // random — they'll use Google to login
          phone: '',
          role: 'user',
          socialAuth: { googleId, provider: 'google' },
          profilePicture: profilePicture || '',
          verified: true,
          isVerified: true,
          isEmailVerified: true,
          accountType: 'social',
          registrationMethod: 'google',
          lastLogin: new Date()
        });
        console.log('[SUCCESS] New Google user created:', user.email);
        return done(null, user);

      } catch (error) {
        console.error('[ERROR] Google OAuth Error:', error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
