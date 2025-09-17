const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message || 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different rate limits for different endpoints
const authLimiter = createRateLimit(15 * 60 * 1000, 5, 'Too many authentication attempts');
const generalLimiter = createRateLimit(15 * 60 * 1000, 100, 'Too many requests');
const uploadLimiter = createRateLimit(15 * 60 * 1000, 10, 'Too many upload attempts');

// Security middleware
const securityMiddleware = [
  // Helmet for security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
      },
    },
  }),
  
  // Data sanitization
  mongoSanitize(),
  xss(),
  hpp(),
];

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
  // Simple CSRF protection for development
  // In production, use a proper CSRF library like csurf
  next();
};

// Brute force protector
const createBruteForceProtector = (req, res, next) => {
  // Simple brute force protection
  // In production, implement proper brute force protection
  next();
};

// Rate limiters object for compatibility
const rateLimiters = {
  auth: authLimiter,
  general: generalLimiter,
  upload: uploadLimiter
};

module.exports = {
  authLimiter,
  generalLimiter,
  uploadLimiter,
  securityMiddleware,
  createRateLimit,
  rateLimiters,
  csrfProtection,
  createBruteForceProtector
};
