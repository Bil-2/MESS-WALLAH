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

    // Get user from token - ensure proper ObjectId conversion
    const userId = decoded.userId || decoded.id;
    console.log('🔍 Auth middleware - userId:', userId, 'type:', typeof userId);
    
    try {
      // Convert string to ObjectId with error handling
      let objectId;
      if (mongoose.Types.ObjectId.isValid(userId)) {
        objectId = new mongoose.Types.ObjectId(userId);
      } else {
        console.error('❌ Auth middleware - Invalid ObjectId format:', userId);
        return res.status(401).json({
          success: false,
          message: 'Invalid user token format'
        });
      }
      
      console.log('🔍 Auth middleware - Finding user with ObjectId:', objectId);
      req.user = await User.findById(objectId);
      console.log('🔍 Auth middleware - User found:', !!req.user);
      
    } catch (objectIdError) {
      console.error('❌ Auth middleware - ObjectId conversion error:', objectIdError.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid user token'
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
      const userId = decoded.userId || decoded.id;
      const objectId = new mongoose.Types.ObjectId(userId);
      req.user = await User.findById(objectId);
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
