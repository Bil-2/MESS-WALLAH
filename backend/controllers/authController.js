const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createBruteForceProtector, handleFailedAttempt } = require('../middleware/advancedSecurity');

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

    // Password strength validation
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors,
        passwordStrength: passwordValidation.strength
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      // Log potential security issue
      console.log(`Registration attempt with existing credentials: ${email} from IP: ${req.ip}`);

      return res.status(409).json({
        success: false,
        message: 'User already exists with this email or phone number'
      });
    }

    // Hash password with higher salt rounds for security
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with additional security fields
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'student',
      phone: phone?.trim(),
      college: college?.trim(),
      course: course?.trim(),
      year: year,
      securityInfo: {
        registrationIP: req.ip,
        registrationDate: new Date(),
        passwordStrength: passwordValidation.strength,
        lastPasswordChange: new Date()
      }
    });

    await user.save();

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

    // Log successful registration
    console.log(`New user registered: ${email} from IP: ${req.ip}`);

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
    console.error('Registration error:', error);
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

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim()
    }).select('+password +securityInfo');

    if (!user) {
      req.authFailed = true;
      console.log(`Login attempt with non-existent email: ${email} from IP: ${req.ip}`);

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      req.authFailed = true;

      // Increment failed login attempts
      if (!user.securityInfo) {
        user.securityInfo = {};
      }

      user.securityInfo.failedLoginAttempts = (user.securityInfo.failedLoginAttempts || 0) + 1;
      user.securityInfo.lastFailedLogin = new Date();

      // Lock account after 5 failed attempts
      if (user.securityInfo.failedLoginAttempts >= 5) {
        user.securityInfo.accountLocked = true;
        user.securityInfo.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        console.log(`Account locked for user: ${email} due to failed login attempts from IP: ${req.ip}`);
      }

      await user.save();

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        attemptsRemaining: Math.max(0, 5 - user.securityInfo.failedLoginAttempts)
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

    // Log successful login
    console.log(`Successful login: ${email} from IP: ${req.ip}`);

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
    const userId = req.user.userId;

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

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and security info
    user.password = hashedNewPassword;
    if (!user.securityInfo) {
      user.securityInfo = {};
    }
    user.securityInfo.lastPasswordChange = new Date();
    user.securityInfo.passwordStrength = passwordValidation.strength;

    await user.save();

    // Log password change
    console.log(`Password changed for user: ${user.email} from IP: ${req.ip}`);

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
    const userId = req.user.userId;

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
    // For now, we'll just log the logout
    console.log(`User logged out: ${req.user.email} from IP: ${req.ip}`);

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

module.exports = {
  register,
  login,
  changePassword,
  getProfile,
  logout,
  validatePasswordStrength
};
