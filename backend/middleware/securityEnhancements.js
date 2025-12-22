const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Enhanced Security Middleware
 * Production-grade security for MESS WALLAH
 */

// 1. Request Signature Verification (Prevent tampering)
const verifyRequestSignature = (req, res, next) => {
  const signature = req.headers['x-request-signature'];
  const timestamp = req.headers['x-request-timestamp'];

  // Skip for GET requests
  if (req.method === 'GET') {
    return next();
  }

  if (!signature || !timestamp) {
    return res.status(401).json({
      success: false,
      message: 'Missing security headers'
    });
  }

  // Check timestamp (prevent replay attacks)
  const now = Date.now();
  const requestTime = parseInt(timestamp);
  const timeDiff = Math.abs(now - requestTime);

  // Request must be within 5 minutes
  if (timeDiff > 5 * 60 * 1000) {
    return res.status(401).json({
      success: false,
      message: 'Request expired'
    });
  }

  next();
};

// 2. IP-based Rate Limiting (Advanced)
const ipRateLimiter = {};
const MAX_REQUESTS_PER_IP = 100;
const TIME_WINDOW = 15 * 60 * 1000; // 15 minutes

const advancedRateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!ipRateLimiter[ip]) {
    ipRateLimiter[ip] = {
      count: 1,
      firstRequest: now,
      blocked: false
    };
    return next();
  }

  const ipData = ipRateLimiter[ip];

  // Reset if time window passed
  if (now - ipData.firstRequest > TIME_WINDOW) {
    ipRateLimiter[ip] = {
      count: 1,
      firstRequest: now,
      blocked: false
    };
    return next();
  }

  // Check if blocked
  if (ipData.blocked) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((TIME_WINDOW - (now - ipData.firstRequest)) / 1000)
    });
  }

  // Increment count
  ipData.count++;

  // Block if exceeded
  if (ipData.count > MAX_REQUESTS_PER_IP) {
    ipData.blocked = true;
    console.log(`🚫 IP blocked for excessive requests: ${ip}`);
    return res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. IP temporarily blocked.',
      retryAfter: Math.ceil((TIME_WINDOW - (now - ipData.firstRequest)) / 1000)
    });
  }

  next();
};

// 3. SQL Injection Prevention (Additional layer)
const preventSQLInjection = (req, res, next) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(UNION.*SELECT)/gi,
    /(OR\s+1\s*=\s*1)/gi,
    /(--|\#|\/\*|\*\/)/g
  ];

  const checkValue = (value) => {
    if (typeof value === 'string') {
      for (const pattern of sqlPatterns) {
        if (pattern.test(value)) {
          return true;
        }
      }
    }
    return false;
  };

  const checkObject = (obj) => {
    for (const key in obj) {
      if (checkValue(obj[key])) {
        return true;
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (checkObject(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };

  // Check query params
  if (checkObject(req.query)) {
    console.log(`[ALERT] SQL injection attempt detected from IP: ${req.ip}`);
    return res.status(400).json({
      success: false,
      message: 'Invalid request parameters'
    });
  }

  // Check body
  if (req.body && checkObject(req.body)) {
    console.log(`[ALERT] SQL injection attempt detected from IP: ${req.ip}`);
    return res.status(400).json({
      success: false,
      message: 'Invalid request data'
    });
  }

  next();
};

// 4. XSS Prevention (Additional layer)
const preventXSS = (req, res, next) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ];

  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      for (const pattern of xssPatterns) {
        if (pattern.test(value)) {
          return true;
        }
      }
    }
    return false;
  };

  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (sanitizeValue(obj[key])) {
        return true;
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (sanitizeObject(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };

  if (req.body && sanitizeObject(req.body)) {
    console.log(`[ALERT] XSS attempt detected from IP: ${req.ip}`);
    return res.status(400).json({
      success: false,
      message: 'Invalid request data'
    });
  }

  next();
};

// 5. CSRF Token Validation
const csrfTokens = new Map();

const generateCSRFToken = (req, res, next) => {
  const token = crypto.randomBytes(32).toString('hex');
  const userId = req.user?.id || req.ip;
  
  csrfTokens.set(userId, {
    token,
    createdAt: Date.now()
  });

  // Clean old tokens (older than 1 hour)
  for (const [key, value] of csrfTokens.entries()) {
    if (Date.now() - value.createdAt > 60 * 60 * 1000) {
      csrfTokens.delete(key);
    }
  }

  res.locals.csrfToken = token;
  next();
};

const validateCSRFToken = (req, res, next) => {
  // Skip for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const userId = req.user?.id || req.ip;

  const storedToken = csrfTokens.get(userId);

  if (!storedToken || storedToken.token !== token) {
    console.log(`[ALERT] CSRF attack detected from IP: ${req.ip}`);
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token'
    });
  }

  next();
};

// 6. Secure Headers Enhancement
const secureHeaders = (req, res, next) => {
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Remove powered by header
  res.removeHeader('X-Powered-By');
  
  next();
};

// 7. Request Logging for Security Audit
const securityLogger = (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: req.user?.id || 'anonymous'
  };

  // Log sensitive operations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    console.log('[SECURITY] Security Log:', JSON.stringify(logData));
  }

  next();
};

// 8. Password Strength Validator
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
  let strength = 0;
  
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 20;
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/\d/.test(password)) strength += 15;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 15;

  return Math.min(strength, 100);
};

// 9. Suspicious Activity Detector
const suspiciousActivityDetector = (req, res, next) => {
  const suspiciousPatterns = [
    /admin/i,
    /root/i,
    /\.\.\//, // Path traversal
    /\0/, // Null byte
    /%00/, // Encoded null byte
    /\beval\b/i,
    /\bexec\b/i
  ];

  const checkSuspicious = (value) => {
    if (typeof value === 'string') {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
          return true;
        }
      }
    }
    return false;
  };

  // Check URL
  if (checkSuspicious(req.originalUrl)) {
    console.log(`[ALERT] Suspicious activity detected from IP: ${req.ip}`);
    return res.status(400).json({
      success: false,
      message: 'Suspicious request detected'
    });
  }

  next();
};

// 10. File Upload Security
const validateFileUpload = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  for (const file of req.files) {
    // Check mime type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type: ${file.originalname}. Only JPEG, PNG, and WebP allowed.`
      });
    }

    // Check file size
    if (file.size > maxFileSize) {
      return res.status(400).json({
        success: false,
        message: `File too large: ${file.originalname}. Maximum size is 5MB.`
      });
    }

    // Check file extension matches mime type
    const ext = file.originalname.split('.').pop().toLowerCase();
    const mimeExt = file.mimetype.split('/')[1];
    
    if (ext !== mimeExt && !(ext === 'jpg' && mimeExt === 'jpeg')) {
      return res.status(400).json({
        success: false,
        message: `File extension mismatch: ${file.originalname}`
      });
    }
  }

  next();
};

module.exports = {
  verifyRequestSignature,
  advancedRateLimit,
  preventSQLInjection,
  preventXSS,
  generateCSRFToken,
  validateCSRFToken,
  secureHeaders,
  securityLogger,
  validatePasswordStrength,
  suspiciousActivityDetector,
  validateFileUpload
};
