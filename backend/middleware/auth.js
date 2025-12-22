const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const crypto = require('crypto');

// Token blacklist (in production, use Redis)
const tokenBlacklist = new Set();

// Clean blacklist every hour
setInterval(() => {
  // In production, tokens would have expiry tracked
  if (tokenBlacklist.size > 10000) {
    tokenBlacklist.clear();
  }
}, 60 * 60 * 1000);

// Protect routes - verify JWT token with enhanced security
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'NO_TOKEN'
    });
  }

  // Check if token is blacklisted
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  if (tokenBlacklist.has(tokenHash)) {
    return res.status(401).json({
      success: false,
      message: 'Token has been revoked',
      code: 'TOKEN_REVOKED'
    });
  }

  try {
    // Verify token with flexible options (support existing tokens)
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });

    // Validate token structure
    const userId = decoded.userId || decoded.id || decoded.user;
    
    if (!userId) {
      console.log('[AUTH] Invalid token payload - no user ID');
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    // Check token age (force re-login after 7 days even if token valid)
    if (decoded.iat) {
      const tokenAge = Date.now() / 1000 - decoded.iat;
      const maxAge = 7 * 24 * 60 * 60; // 7 days
      if (tokenAge > maxAge) {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.',
          code: 'TOKEN_EXPIRED'
        });
      }
    }
    
    // Find user
    let user;
    try {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        user = await User.findById(userId).select('-password');
      }
      
      if (!user && typeof userId === 'string') {
        user = await User.findById(userId).select('-password');
      }
    } catch (dbError) {
      console.error('[AUTH] Database error:', dbError.message);
      return res.status(500).json({
        success: false,
        message: 'Authentication service error',
        code: 'DB_ERROR'
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Check if user is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(401).json({
        success: false,
        message: 'Account is temporarily locked',
        code: 'ACCOUNT_LOCKED'
      });
    }

    // Check if password was changed after token issued
    if (user.securityInfo?.lastPasswordChange && decoded.iat) {
      const passwordChangedAt = Math.floor(user.securityInfo.lastPasswordChange.getTime() / 1000);
      if (passwordChangedAt > decoded.iat) {
        return res.status(401).json({
          success: false,
          message: 'Password changed. Please login again.',
          code: 'PASSWORD_CHANGED'
        });
      }
    }

    // Attach user and token info to request
    req.user = user;
    req.token = token;
    req.tokenHash = tokenHash;

    next();
  } catch (error) {
    console.error('[AUTH] Token verification error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

// Blacklist token on logout
const blacklistToken = (token) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  tokenBlacklist.add(tokenHash);
};

// Grant access to specific user roles with enhanced security
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(`[AUTH] Unauthorized access attempt: ${req.user.email} tried to access ${req.path} (required: ${roles.join(', ')})`);
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
        code: 'FORBIDDEN'
      });
    }
    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256']
      });
      const userId = decoded.userId || decoded.id || decoded.user;
      if (userId) {
        req.user = await User.findById(userId).select('-password');
      }
    } catch (error) {
      // Token is invalid, but we don't fail the request
      req.user = null;
    }
  }

  next();
};

// Generate JWT Token with enhanced security
const generateToken = (user, options = {}) => {
  const payload = {
    userId: user._id,
    email: user.email,
    phone: user.phone,
    role: user.role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: options.expiresIn || process.env.JWT_EXPIRE || '7d',
    issuer: 'mess-wallah',
    audience: 'mess-wallah-users',
    algorithm: 'HS256'
  });
};

// Verify ownership of resource
const verifyOwnership = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    const resourceUserId = req.resource?.[resourceUserIdField]?.toString();
    const currentUserId = req.user?._id?.toString();

    if (!resourceUserId || !currentUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot verify ownership'
      });
    }

    // Allow if user owns resource or is admin
    if (resourceUserId !== currentUserId && req.user.role !== 'admin') {
      console.log(`[AUTH] Ownership violation: ${req.user.email} tried to access resource owned by ${resourceUserId}`);
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
};

// Rate limit by user
const userRateLimit = new Map();

const perUserRateLimit = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const userId = req.user?._id?.toString() || req.ip;
    const now = Date.now();
    
    let userData = userRateLimit.get(userId);
    
    if (!userData || now - userData.windowStart > windowMs) {
      userData = { count: 1, windowStart: now };
      userRateLimit.set(userId, userData);
      return next();
    }

    userData.count++;
    
    if (userData.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please slow down.',
        retryAfter: Math.ceil((windowMs - (now - userData.windowStart)) / 1000)
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  generateToken,
  blacklistToken,
  verifyOwnership,
  perUserRateLimit
};
