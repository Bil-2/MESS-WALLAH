const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Get token from cookie
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token - handle multiple token formats
    const userId = decoded.userId || decoded.id || decoded.user;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload'
      });
    }
    
    try {
      // Find user by ID - try multiple approaches
      req.user = await User.findById(userId);
      
      // Fallback approaches if first attempt fails
      if (!req.user) {
        // Try with explicit ObjectId conversion
        if (mongoose.Types.ObjectId.isValid(userId)) {
          req.user = await User.findById(mongoose.Types.ObjectId(userId));
        }
        
        // Try finding by string representation
        if (!req.user && typeof userId === 'object') {
          req.user = await User.findById(userId.toString());
        }
      }
      
    } catch (dbError) {
      console.error('Database error in auth middleware:', dbError.message);
      return res.status(401).json({
        success: false,
        message: 'Database error during authentication'
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is active
    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

// Grant access to specific user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId || decoded.id || decoded.user;
      if (userId) {
        req.user = await User.findById(userId);
      }
    } catch (error) {
      // Token is invalid, but we don't fail the request
      req.user = null;
    }
  }

  next();
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  generateToken
};
