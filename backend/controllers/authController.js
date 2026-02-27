const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { createBruteForceProtector, handleFailedAttempt } = require('../middleware/advancedSecurity');
const { sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } = require('../services/notify');
const AccountLinkingService = require('../services/accountLinkingService');

// Password strength validation
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

const calculatePasswordStrength = (password) => {
  let score = 0;

  // Length bonus
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety bonus
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  // Complexity bonus
  if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) score += 1;
  if (/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) score += 1;

  if (score <= 3) return 'weak';
  if (score <= 6) return 'medium';
  return 'strong';
};

const Otp = require('../models/Otp'); // Ensure this is available

// Ensure Otp is required if not at the top
// const Otp = require('../models/Otp'); // Add this to the top of the file manually if it breaks

// Send OTP for registration
const registerSendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered. Please log in.',
        action: 'login'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any existing OTPs for this email to prevent spam
    await Otp.deleteMany({ email: normalizedEmail, method: 'email-register' });

    // Save OTP to database
    const otpRecord = new Otp({
      email: normalizedEmail,
      codeHash: await bcrypt.hash(otp, 10),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0,
      method: 'email-register'
    });
    await otpRecord.save();

    // Log OTP for testing purposes
    console.log(`[TESTING] Generated OTP for ${normalizedEmail}: ${otp}`);

    // Send OTP email
    try {
      const { sendOTPEmail } = require('../services/notify');
      await sendOTPEmail(normalizedEmail, otp);
      console.log(`[SUCCESS] Registration OTP email sent to: ${normalizedEmail}`);
    } catch (emailError) {
      console.error('[ERROR] Failed to send registration OTP email:', emailError.message);
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email address. Please check your inbox.',
      data: { email: normalizedEmail, expiresIn: 10 }
    });

  } catch (error) {
    console.error('Registration send OTP error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Enhanced registration with OTP verification
const register = async (req, res) => {
  try {
    const { name, email, otp, role } = req.body;

    // Input validation
    if (!name || !email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and OTP are required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify OTP first
    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      method: 'email-register',
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.'
      });
    }

    const isValidOTP = await bcrypt.compare(otp, otpRecord.codeHash);

    if (!isValidOTP) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      if (otpRecord.attempts >= 3) {
        await Otp.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({
          success: false,
          message: 'Too many failed attempts. Please request a new OTP.'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
        attemptsLeft: 3 - otpRecord.attempts
      });
    }

    // OTP is valid, clean up
    await Otp.deleteOne({ _id: otpRecord._id });

    // Double check user doesn't exist
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered. Please log in.'
      });
    }

    // Create user without password (passwordless flow)
    const userData = {
      name,
      email: normalizedEmail,
      role: role || 'user',
      isActive: true,
      isEmailVerified: true,
      registrationMethod: 'email-otp',
      accountType: 'email-only',
      loginAttempts: 0
    };

    const user = new User(userData);

    user.securityInfo = {
      registrationIP: req.ip,
      registrationDate: new Date()
    };

    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
      console.log(`Welcome email sent to: ${user.email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError.message);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
        issuer: 'mess-wallah',
        audience: 'mess-wallah-users'
      }
    );

    // Remove internal data from response
    const userResponse = user.toObject();
    delete userResponse.securityInfo;

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

// Enhanced login with brute force protection
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      req.authFailed = true;
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // CRITICAL FIX: Find user by email OR phone (unified account system)
    // SECURITY: Don't log email in production
    console.log(`[DEBUG] LOGIN ATTEMPT: Searching for user...`);

    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        // Also check if email matches a phone number format (in case user enters phone as email)
        { phone: email.trim() },
        { phone: `+91${email.trim()}` }
      ]
    }).select('+password +securityInfo +registrationMethod +accountType');

    // SECURITY: Don't log sensitive user data
    console.log(`[DEBUG] USER SEARCH RESULT: ${user ? 'User found' : 'No user found'}`);

    if (!user) {
      req.authFailed = true;
      console.log(`[WARNING] LOGIN FAILED: No user found`);

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // ENHANCED: Check if user was created via OTP but hasn't set a password
    if (!user.password && (user.registrationMethod === 'otp' || user.accountType === 'otp-only')) {
      console.log(`[INFO] LOGIN ATTEMPT: OTP-only user trying email login`);

      return res.status(400).json({
        success: false,
        message: 'Account found but password not set. Please register with your email to complete your account setup.',
        action: 'complete_registration',
        hint: 'You signed up using phone verification. Please go to Register page and complete your profile with email and password.',
        userExists: true,
        needsPasswordSetup: true
      });
    }

    // Check if account is locked
    if (user.securityInfo?.accountLocked && user.securityInfo.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.securityInfo.lockUntil - new Date()) / 1000 / 60);

      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked. Try again in ${remainingTime} minutes.`
      });
    }

    // Verify password
    console.log(`[AUTH] PASSWORD CHECK: Verifying password...`);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`[AUTH] PASSWORD RESULT: ${isPasswordValid ? 'VALID' : 'INVALID'}`);

    if (!isPasswordValid) {
      req.authFailed = true;

      // Increment failed login attempts
      if (!user.securityInfo) {
        user.securityInfo = {};
      }

      user.securityInfo.failedLoginAttempts = (user.securityInfo.failedLoginAttempts || 0) + 1;
      user.securityInfo.lastFailedLogin = new Date();

      console.log(`[WARNING] LOGIN FAILED: Invalid password. Attempts: ${user.securityInfo.failedLoginAttempts}/5`);

      // Lock account after 5 failed attempts
      if (user.securityInfo.failedLoginAttempts >= 5) {
        user.securityInfo.accountLocked = true;
        user.securityInfo.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        console.log(`[WARNING] ACCOUNT LOCKED due to failed login attempts`);
      }

      await user.save();

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
        attemptsRemaining: Math.max(0, 5 - user.securityInfo.failedLoginAttempts),
        hint: user.securityInfo.failedLoginAttempts >= 3 ? 'If you forgot your password, use the "Forgot Password" link.' : undefined
      });
    }

    // Reset failed attempts on successful login
    if (user.securityInfo) {
      user.securityInfo.failedLoginAttempts = 0;
      user.securityInfo.accountLocked = false;
      user.securityInfo.lockUntil = null;
      user.securityInfo.lastSuccessfulLogin = new Date();
      user.securityInfo.lastLoginIP = req.ip;
      await user.save();
    }

    // Generate JWT token with additional claims
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        loginTime: new Date().toISOString()
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
        issuer: 'mess-wallah',
        audience: 'mess-wallah-users'
      }
    );

    // Log successful login (without sensitive data)
    console.log(`Successful login: ${user._id} (${user.email?.substring(0, 3)}***)`);

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.securityInfo;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

// Enhanced password change with security checks
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Password strength validation
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'New password does not meet security requirements',
        errors: passwordValidation.errors
      });
    }

    // Find user
    const user = await User.findById(userId).select('+password +securityInfo');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    // Check if new password was used in the past
    const isInHistory = await user.isPasswordInHistory(newPassword);
    if (isInHistory) {
      return res.status(400).json({
        success: false,
        message: 'You cannot reuse a previous password. Please choose a new password.'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and security info
    user.password = hashedNewPassword;
    if (!user.securityInfo) {
      user.securityInfo = {};
    }
    user.securityInfo.lastPasswordChange = new Date();
    user.securityInfo.passwordStrength = 'medium';

    await user.save();

    // Log password change (without sensitive data)
    console.log(`Password changed for user: ${user._id}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during password change'
    });
  }
};

// Get user profile with security info
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add security summary (without sensitive details)
    const securitySummary = {
      lastPasswordChange: user.securityInfo?.lastPasswordChange,
      passwordStrength: user.securityInfo?.passwordStrength,
      lastSuccessfulLogin: user.securityInfo?.lastSuccessfulLogin,
      accountStatus: user.securityInfo?.accountLocked ? 'locked' : 'active'
    };

    const userResponse = user.toObject();
    delete userResponse.securityInfo;
    userResponse.securitySummary = securitySummary;

    res.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Logout with token invalidation (if using token blacklist)
const logout = async (req, res) => {
  try {
    // In a production app, you might want to maintain a token blacklist
    // For now, we'll just log the logout (without sensitive data)
    console.log(`User logged out: ${req.user._id}`);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout'
    });
  }
};


// Check if user exists (for frontend to guide user)
const checkUserExists = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone is required'
      });
    }

    let query = {};
    if (email) {
      query.$or = [
        { email: email.toLowerCase().trim() }
      ];
    }
    if (phone) {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      query.$or = query.$or || [];
      query.$or.push(
        { phone: phone },
        { phone: formattedPhone }
      );
    }

    const user = await User.findOne(query).select('email phone registrationMethod accountType');

    if (!user) {
      return res.json({
        success: true,
        exists: false,
        message: 'No account found. You can register a new account.',
        action: 'register'
      });
    }

    // User exists - check their account type
    const isOtpOnlyUser = (
      (!user.password && user.registrationMethod === 'otp') ||
      (user.accountType === 'otp-only') ||
      // CRITICAL FIX: Also check for OTP users without accountType field (legacy users)
      (!user.email && user.phone && user.registrationMethod === 'otp')
    );

    if (isOtpOnlyUser) {
      return res.json({
        success: true,
        exists: true,
        needsLinking: true,
        message: 'Account found with phone verification. Complete your registration by adding email and password.',
        action: 'complete_registration',
        hasEmail: !!user.email,
        hasPhone: !!user.phone
      });
    }

    return res.json({
      success: true,
      exists: true,
      needsLinking: false,
      message: 'Account found. You can login with your credentials.',
      action: 'login',
      hasEmail: !!user.email,
      hasPhone: !!user.phone
    });

  } catch (error) {
    console.error('Check user exists error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  registerSendOtp,
  register,
  login,
  changePassword,
  getProfile,
  logout,
  checkUserExists
};
