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

// Enhanced registration with security features
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, college, course, year } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Simplified password validation for testing - SECURITY: Minimum 8 characters
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // ENHANCED: Use comprehensive account linking service
    console.log(`[INFO] UNIFIED REGISTRATION: Starting comprehensive account search...`);
    const accountSearch = await AccountLinkingService.findExistingUser(email, phone);

    // SECURITY: Don't log sensitive account details
    console.log(`[INFO] ACCOUNT SEARCH RESULT: found=${accountSearch.found}, canLink=${accountSearch.canLink}`);

    // ENHANCED: Handle account linking using comprehensive service
    if (accountSearch.found) {
      const existingUser = accountSearch.user;

      if (accountSearch.shouldLink && accountSearch.canLink) {
        console.log(`[INFO] ACCOUNT LINKING: ${accountSearch.linkingType} - ${accountSearch.reason}`);
        console.log(`[INFO] Confidence Level: ${accountSearch.confidence}`);

        // Use the account linking service to perform the linking
        const linkedUser = await AccountLinkingService.linkAccounts(existingUser, {
          name, email, password, phone, role, college, course, year
        });

        // Generate JWT token for linked account
        const token = jwt.sign(
          {
            userId: linkedUser._id,
            email: linkedUser.email,
            phone: linkedUser.phone,
            role: linkedUser.role
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE || '30d' }
        );

        // Remove password from response
        const userResponse = linkedUser.toObject();
        delete userResponse.password;

        return res.status(200).json({
          success: true,
          message: 'Account successfully linked! Your phone and email are now unified in one account.',
          token,
          user: userResponse,
          accountLinked: true,
          accountType: 'unified',
          linkingDetails: {
            previousAccountType: accountSearch.linkingType.split('-')[0],
            newAccountType: 'unified',
            linkedAt: new Date().toISOString(),
            hasPhone: !!userResponse.phone,
            hasEmail: !!userResponse.email,
            isComplete: true,
            confidence: accountSearch.confidence,
            method: 'comprehensive-service'
          }
        });
      } else {
        // User already exists with complete registration - cannot link
        console.log(`[WARNING] REGISTRATION BLOCKED: User already exists`);

        return res.status(409).json({
          success: false,
          message: 'User already exists with this email or phone number',
          hint: 'An account already exists. Try logging in instead.',
          cannotLink: true
        });
      }
    }

    // Create user with additional security fields
    // Note: Password will be hashed by the User model's pre-save hook
    const userData = {
      name,
      email,
      password: password, // Plain password - model will hash it
      role: role || 'user',
      isActive: true,
      loginAttempts: 0,
      accountLockUntil: undefined,
      profile: {
        college,
        course,
        year
      }
    };

    // Only add phone if it's provided to avoid null constraint issues
    if (phone) {
      // Format phone number to international format if it's not already
      let formattedPhone = phone;
      if (phone && !phone.startsWith('+')) {
        // Assume Indian number if no country code provided
        formattedPhone = `+91${phone}`;
      }
      userData.phone = formattedPhone;
    }

    const user = new User(userData);

    user.securityInfo = {
      registrationIP: req.ip,
      registrationDate: new Date(),
      passwordStrength: 'medium',
      lastPasswordChange: new Date()
    };

    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
      console.log(`Welcome email sent to: ${user.email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError.message);
      // Don't fail registration if email fails
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

    // Log successful registration (without sensitive data)
    console.log(`New user registered: ${user._id} (${user.email?.substring(0, 3)}***)`);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.securityInfo;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        details: error.stack
      })
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

// Forgot password - send reset email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Input validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      console.log(`Password reset requested for non-existent email`);
      return res.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set reset token and expiry (1 hour)
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);
      console.log(`Password reset email sent to user: ${user._id}`);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Clear reset token if email fails
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'Password reset link has been sent to your email address.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during password reset request'
    });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Input validation
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      });
    }

    // Simplified password validation
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: new Date() }
    }).select('+password +securityInfo');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Check if new password is same as current (only if user has a password)
    if (user.password) {
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
          message: 'You cannot reuse a previous password. Please choose a new password that you haven\'t used before.'
        });
      }
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    user.password = hashedNewPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Update security info
    if (!user.securityInfo) {
      user.securityInfo = {};
    }
    user.securityInfo.lastPasswordChange = new Date();
    user.securityInfo.passwordStrength = 'medium';
    user.securityInfo.failedLoginAttempts = 0; // Reset failed attempts
    user.securityInfo.accountLocked = false;
    user.securityInfo.lockUntil = null;

    await user.save();

    // Send confirmation email
    try {
      await sendPasswordResetSuccessEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send password reset success email:', emailError);
      // Don't fail the request if email fails
    }

    // Log password reset (without sensitive data)
    console.log(`Password reset successful for user: ${user._id}`);

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during password reset'
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
  register,
  login,
  changePassword,
  getProfile,
  logout,
  forgotPassword,
  resetPassword,
  validatePasswordStrength,
  checkUserExists
};
