const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Enhanced security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
      ],
      scriptSrc: [
        "'self'",
        "https://checkout.razorpay.com",
        "https://polyfill.io",
        "'unsafe-eval'" // Only for development
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:"
      ],
      connectSrc: [
        "'self'",
        "https://api.razorpay.com",
        "wss:",
        "ws:"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: [
        "'self'",
        "https://api.razorpay.com"
      ]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin"
  }
});

// Rate limiting for different endpoints
const createRateLimit = (windowMs, max, message, skipSuccessfulRequests = false) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000 / 60) + ' minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    keyGenerator: (req) => {
      return req.ip + ':' + (req.user?.id || 'anonymous');
    }
  });
};

// Different rate limits for different operations
const rateLimits = {
  // General API rate limit
  general: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100, // 100 requests per 15 minutes
    'Too many requests from this IP'
  ),

  // Authentication rate limit
  auth: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts per 15 minutes
    'Too many authentication attempts'
  ),

  // Registration rate limit
  register: createRateLimit(
    60 * 60 * 1000, // 1 hour
    3, // 3 registrations per hour
    'Too many registration attempts'
  ),

  // Password reset rate limit
  passwordReset: createRateLimit(
    60 * 60 * 1000, // 1 hour
    3, // 3 password reset attempts per hour
    'Too many password reset attempts'
  ),

  // Search rate limit
  search: createRateLimit(
    1 * 60 * 1000, // 1 minute
    30, // 30 searches per minute
    'Too many search requests'
  ),

  // Upload rate limit
  upload: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    10, // 10 uploads per 15 minutes
    'Too many upload attempts'
  ),

  // Booking rate limit
  booking: createRateLimit(
    60 * 60 * 1000, // 1 hour
    10, // 10 booking attempts per hour
    'Too many booking attempts'
  )
};

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET requests and webhooks
  if (req.method === 'GET' || req.path.includes('/webhook')) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({
      error: 'CSRF token validation failed',
      code: 'CSRF_VALIDATION_FAILED'
    });
  }

  next();
};

// Generate CSRF token
const generateCSRFToken = (req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
  }
  next();
};

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove potential XSS attacks
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};

// Request size limiting
const requestSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength > maxSize) {
    return res.status(413).json({
      error: 'Request entity too large',
      maxSize: '10MB',
      code: 'REQUEST_TOO_LARGE'
    });
  }

  next();
};

// Security logging middleware
const securityLogger = (req, res, next) => {
  const securityLog = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    method: req.method,
    path: req.path,
    userId: req.user?.id,
    suspicious: false
  };

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//,  // Directory traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /javascript:/i, // JavaScript injection
    /eval\(/i, // Code injection
    /exec\(/i  // Command injection
  ];

  const checkSuspicious = (value) => {
    return suspiciousPatterns.some(pattern => pattern.test(value));
  };

  // Check URL and parameters for suspicious content
  if (checkSuspicious(req.url) || 
      Object.values(req.query || {}).some(checkSuspicious) ||
      Object.values(req.body || {}).some(val => 
        typeof val === 'string' && checkSuspicious(val)
      )) {
    securityLog.suspicious = true;
    console.warn('[SECURITY_ALERT]', JSON.stringify(securityLog));
  }

  next();
};

// Brute force protection
const bruteForceProtection = new Map();

const checkBruteForce = (identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const key = identifier(req);
    const now = Date.now();
    
    if (!bruteForceProtection.has(key)) {
      bruteForceProtection.set(key, { attempts: 0, resetTime: now + windowMs });
    }

    const record = bruteForceProtection.get(key);

    // Reset if window has passed
    if (now > record.resetTime) {
      record.attempts = 0;
      record.resetTime = now + windowMs;
    }

    // Check if max attempts exceeded
    if (record.attempts >= maxAttempts) {
      return res.status(429).json({
        error: 'Too many failed attempts. Please try again later.',
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
        code: 'BRUTE_FORCE_PROTECTION'
      });
    }

    // Increment attempts on failed requests
    res.on('finish', () => {
      if (res.statusCode >= 400) {
        record.attempts++;
      } else if (res.statusCode < 400) {
        // Reset on successful request
        record.attempts = 0;
      }
    });

    next();
  };
};

module.exports = {
  securityHeaders,
  rateLimits,
  csrfProtection,
  generateCSRFToken,
  sanitizeInput,
  requestSizeLimit,
  securityLogger,
  checkBruteForce
};
