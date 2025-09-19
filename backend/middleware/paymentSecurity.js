const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const encryptionService = require('../utils/encryption');
const crypto = require('crypto');

// Payment-specific rate limiting
const paymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 payment attempts per 15 minutes
  message: {
    error: 'Too many payment attempts. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip + ':' + (req.user?.id || 'anonymous');
  }
});

// Payment session validation
const validatePaymentSession = async (req, res, next) => {
  try {
    const { sessionId, sessionData } = req.body;
    
    if (!sessionId || !sessionData) {
      return res.status(400).json({
        error: 'Payment session required',
        code: 'INVALID_SESSION'
      });
    }
    
    // Verify session integrity
    const sessionInfo = encryptionService.verifyPaymentSession(sessionData);
    
    // Ensure session belongs to authenticated user
    if (sessionInfo.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Unauthorized payment session',
        code: 'UNAUTHORIZED_SESSION'
      });
    }
    
    req.paymentSession = sessionInfo;
    next();
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      code: 'SESSION_VALIDATION_FAILED'
    });
  }
};

// Payment data validation rules
const paymentValidationRules = [
  body('amount')
    .isFloat({ min: 1, max: 100000 })
    .withMessage('Amount must be between ₹1 and ₹100,000'),
  
  body('currency')
    .isIn(['INR', 'USD'])
    .withMessage('Currency must be INR or USD'),
  
  body('paymentMethod')
    .isIn(['card', 'upi', 'netbanking', 'wallet'])
    .withMessage('Invalid payment method'),
  
  body('cardNumber')
    .optional()
    .isLength({ min: 13, max: 19 })
    .isNumeric()
    .withMessage('Invalid card number'),
  
  body('cvv')
    .optional()
    .isLength({ min: 3, max: 4 })
    .isNumeric()
    .withMessage('Invalid CVV'),
  
  body('expiryMonth')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Invalid expiry month'),
  
  body('expiryYear')
    .optional()
    .isInt({ min: new Date().getFullYear(), max: new Date().getFullYear() + 10 })
    .withMessage('Invalid expiry year'),
  
  body('upiId')
    .optional()
    .matches(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/)
    .withMessage('Invalid UPI ID format'),
  
  body('bankCode')
    .optional()
    .isLength({ min: 2, max: 10 })
    .isAlphanumeric()
    .withMessage('Invalid bank code')
];

// Validate payment data
const validatePaymentData = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Invalid payment data',
      details: errors.array(),
      code: 'VALIDATION_FAILED'
    });
  }
  
  // Sanitize payment data
  req.body = encryptionService.sanitizePaymentData(req.body);
  next();
};

// Encrypt sensitive payment data
const encryptPaymentData = (req, res, next) => {
  try {
    if (req.body.cardNumber || req.body.cvv || req.body.bankAccount) {
      req.body = encryptionService.encryptPaymentData(req.body);
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: 'Payment data processing failed',
      code: 'ENCRYPTION_FAILED'
    });
  }
};

// Payment fraud detection
const fraudDetection = async (req, res, next) => {
  try {
    const { amount, paymentMethod } = req.body;
    const userId = req.user.id;
    const userAgent = req.get('User-Agent');
    const ip = req.ip;
    
    // Check for suspicious patterns
    const suspiciousPatterns = [];
    
    // Large amount transactions
    if (amount > 50000) {
      suspiciousPatterns.push('LARGE_AMOUNT');
    }
    
    // Multiple payment methods in short time
    // This would typically check against a database of recent transactions
    
    // Unusual user agent or IP
    if (!userAgent || userAgent.length < 10) {
      suspiciousPatterns.push('SUSPICIOUS_USER_AGENT');
    }
    
    // If suspicious patterns detected, require additional verification
    if (suspiciousPatterns.length > 0) {
      return res.status(202).json({
        message: 'Additional verification required',
        verificationRequired: true,
        patterns: suspiciousPatterns,
        code: 'ADDITIONAL_VERIFICATION_REQUIRED'
      });
    }
    
    next();
  } catch (error) {
    next();
  }
};

// Payment logging (with masked sensitive data)
const paymentLogger = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log payment attempt with masked data
    const logData = {
      timestamp: new Date().toISOString(),
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      paymentData: encryptionService.maskSensitiveData(req.body),
      response: typeof data === 'string' ? JSON.parse(data) : data
    };
    
    console.log('[PAYMENT_LOG]', JSON.stringify(logData));
    
    originalSend.call(this, data);
  };
  
  next();
};

// Generate secure payment nonce
const generatePaymentNonce = (req, res, next) => {
  req.paymentNonce = crypto.randomBytes(32).toString('hex');
  next();
};

// CSRF protection for payments
const paymentCSRFProtection = (req, res, next) => {
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

// Payment timeout protection
const paymentTimeout = (req, res, next) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({
        error: 'Payment request timeout',
        code: 'PAYMENT_TIMEOUT'
      });
    }
  }, 30000); // 30 seconds timeout
  
  res.on('finish', () => {
    clearTimeout(timeout);
  });
  
  next();
};

module.exports = {
  paymentRateLimit,
  validatePaymentSession,
  paymentValidationRules,
  validatePaymentData,
  encryptPaymentData,
  fraudDetection,
  paymentLogger,
  generatePaymentNonce,
  paymentCSRFProtection,
  paymentTimeout
};
