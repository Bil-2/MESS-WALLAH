/**
 * PRODUCTION-GRADE PAYMENT SECURITY MIDDLEWARE
 * Real security for Razorpay payment integration
 * 
 * Features:
 * - Request signature verification
 * - Webhook signature validation
 * - Payment amount validation
 * - Idempotency key handling
 * - Fraud detection
 * - Rate limiting for payments
 * - Secure logging
 */

const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

// ============================================
// 1. RAZORPAY WEBHOOK SIGNATURE VERIFICATION
// ============================================
const verifyRazorpayWebhook = (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('[SECURITY] Razorpay webhook secret not configured');
      return res.status(500).json({
        success: false,
        message: 'Payment webhook not configured'
      });
    }

    const signature = req.headers['x-razorpay-signature'];
    
    if (!signature) {
      console.error('[SECURITY] Missing Razorpay signature header');
      return res.status(401).json({
        success: false,
        message: 'Missing webhook signature'
      });
    }

    // Get raw body for signature verification
    const rawBody = JSON.stringify(req.body);
    
    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      console.error('[SECURITY] Invalid Razorpay webhook signature');
      return res.status(401).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    console.log('[SECURITY] Razorpay webhook signature verified');
    next();
  } catch (error) {
    console.error('[SECURITY] Webhook verification error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Webhook verification failed'
    });
  }
};

// ============================================
// 2. RAZORPAY PAYMENT SIGNATURE VERIFICATION
// ============================================
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keySecret) {
      throw new Error('Razorpay key secret not configured');
    }

    const body = orderId + '|' + paymentId;
    
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    // Constant-time comparison
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('[SECURITY] Payment signature verification error:', error.message);
    return false;
  }
};

// ============================================
// 3. PAYMENT AMOUNT VALIDATION
// ============================================
const validatePaymentAmount = (req, res, next) => {
  try {
    const { amount } = req.body;
    
    // Minimum amount: ₹1 (100 paise)
    const MIN_AMOUNT = 100;
    // Maximum amount: ₹1,00,000 (10000000 paise)
    const MAX_AMOUNT = 10000000;

    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Valid payment amount is required'
      });
    }

    if (amount < MIN_AMOUNT) {
      return res.status(400).json({
        success: false,
        message: `Minimum payment amount is ₹${MIN_AMOUNT / 100}`
      });
    }

    if (amount > MAX_AMOUNT) {
      return res.status(400).json({
        success: false,
        message: `Maximum payment amount is ₹${MAX_AMOUNT / 100}`
      });
    }

    // Check for suspicious amounts (e.g., very round numbers might indicate testing)
    if (process.env.NODE_ENV === 'production') {
      const amountInRupees = amount / 100;
      if (amountInRupees === 1 || amountInRupees === 100 || amountInRupees === 1000) {
        console.log('[SECURITY] Suspicious round amount detected:', amountInRupees);
        // Log but don't block - could be legitimate
      }
    }

    next();
  } catch (error) {
    console.error('[SECURITY] Amount validation error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Payment validation failed'
    });
  }
};

// ============================================
// 4. IDEMPOTENCY KEY HANDLING
// ============================================
const idempotencyStore = new Map();
const IDEMPOTENCY_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Clean up old idempotency keys periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of idempotencyStore.entries()) {
    if (now - data.timestamp > IDEMPOTENCY_TTL) {
      idempotencyStore.delete(key);
    }
  }
}, 60 * 60 * 1000); // Clean every hour

const handleIdempotency = (req, res, next) => {
  const idempotencyKey = req.headers['x-idempotency-key'];
  
  if (!idempotencyKey) {
    // Generate one if not provided
    req.idempotencyKey = crypto.randomBytes(16).toString('hex');
    return next();
  }

  // Check if we've seen this key before
  const existingResponse = idempotencyStore.get(idempotencyKey);
  
  if (existingResponse) {
    console.log('[SECURITY] Idempotent request detected, returning cached response');
    return res.status(existingResponse.status).json(existingResponse.body);
  }

  req.idempotencyKey = idempotencyKey;
  
  // Store response after processing
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    idempotencyStore.set(idempotencyKey, {
      status: res.statusCode,
      body,
      timestamp: Date.now()
    });
    return originalJson(body);
  };

  next();
};

// ============================================
// 5. FRAUD DETECTION
// ============================================
const fraudDetectionStore = new Map();

const detectFraud = (req, res, next) => {
  try {
    const userId = req.user?._id?.toString() || req.ip;
    const now = Date.now();
    const WINDOW = 60 * 60 * 1000; // 1 hour
    const MAX_PAYMENTS_PER_HOUR = 10;
    const MAX_FAILED_PAYMENTS = 5;

    // Get user's payment history
    let userHistory = fraudDetectionStore.get(userId);
    
    if (!userHistory) {
      userHistory = {
        payments: [],
        failedPayments: 0,
        lastReset: now
      };
      fraudDetectionStore.set(userId, userHistory);
    }

    // Reset if window expired
    if (now - userHistory.lastReset > WINDOW) {
      userHistory.payments = [];
      userHistory.failedPayments = 0;
      userHistory.lastReset = now;
    }

    // Check for too many payments
    if (userHistory.payments.length >= MAX_PAYMENTS_PER_HOUR) {
      console.error('[FRAUD] Too many payment attempts from user:', userId);
      return res.status(429).json({
        success: false,
        message: 'Too many payment attempts. Please try again later.',
        retryAfter: Math.ceil((WINDOW - (now - userHistory.lastReset)) / 1000)
      });
    }

    // Check for too many failed payments
    if (userHistory.failedPayments >= MAX_FAILED_PAYMENTS) {
      console.error('[FRAUD] Too many failed payments from user:', userId);
      return res.status(429).json({
        success: false,
        message: 'Payment temporarily blocked due to multiple failures. Please contact support.',
        blocked: true
      });
    }

    // Store reference for updating after payment
    req.fraudHistory = userHistory;
    
    next();
  } catch (error) {
    console.error('[SECURITY] Fraud detection error:', error.message);
    next(); // Don't block on error
  }
};

// Update fraud history after payment
const updateFraudHistory = (userId, success) => {
  const userHistory = fraudDetectionStore.get(userId);
  if (userHistory) {
    userHistory.payments.push(Date.now());
    if (!success) {
      userHistory.failedPayments++;
    }
  }
};

// ============================================
// 6. PAYMENT-SPECIFIC RATE LIMITING
// ============================================
const paymentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 payment attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many payment requests. Please try again later.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return req.user?._id?.toString() || req.ip;
  }
});

// Stricter rate limit for payment creation
const createPaymentRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 payment creations per hour
  message: {
    success: false,
    message: 'Payment creation limit reached. Please try again later.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?._id?.toString() || req.ip;
  }
});

// ============================================
// 7. SECURE PAYMENT LOGGING
// ============================================
const securePaymentLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request (without sensitive data)
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    userId: req.user?._id?.toString() || 'anonymous',
    ip: req.ip,
    userAgent: req.headers['user-agent']?.substring(0, 100),
    idempotencyKey: req.idempotencyKey
  };

  // Mask sensitive data in body
  if (req.body) {
    logData.body = {
      ...req.body,
      // Mask card details if present
      card: req.body.card ? '***MASKED***' : undefined,
      cvv: undefined,
      // Keep amount for audit
      amount: req.body.amount
    };
  }

  console.log('[PAYMENT_LOG] Request:', JSON.stringify(logData));

  // Log response
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    const duration = Date.now() - startTime;
    
    console.log('[PAYMENT_LOG] Response:', JSON.stringify({
      timestamp: new Date().toISOString(),
      userId: logData.userId,
      path: logData.path,
      status: res.statusCode,
      success: body?.success,
      duration: `${duration}ms`,
      // Don't log sensitive response data
      orderId: body?.data?.orderId,
      paymentId: body?.data?.paymentId
    }));

    return originalJson(body);
  };

  next();
};

// ============================================
// 8. PAYMENT DATA ENCRYPTION
// ============================================
const encryptSensitiveData = (data) => {
  try {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  } catch (error) {
    console.error('[SECURITY] Encryption error:', error.message);
    throw new Error('Data encryption failed');
  }
};

const decryptSensitiveData = (encryptedData) => {
  try {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const authTag = Buffer.from(encryptedData.authTag, 'hex');
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('[SECURITY] Decryption error:', error.message);
    throw new Error('Data decryption failed');
  }
};

// ============================================
// 9. BOOKING AMOUNT VERIFICATION
// ============================================
const verifyBookingAmount = async (req, res, next) => {
  try {
    const { bookingId, amount } = req.body;
    
    if (!bookingId) {
      return next(); // Skip if no booking ID
    }

    const Booking = require('../models/Booking');
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify amount matches booking
    const expectedAmount = booking.pricing.totalAmount * 100; // Convert to paise
    
    if (amount !== expectedAmount) {
      console.error('[SECURITY] Amount mismatch:', {
        expected: expectedAmount,
        received: amount,
        bookingId
      });
      
      return res.status(400).json({
        success: false,
        message: 'Payment amount does not match booking amount'
      });
    }

    // Verify booking belongs to user
    if (booking.userId.toString() !== req.user._id.toString()) {
      console.error('[SECURITY] Unauthorized booking payment attempt');
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this booking'
      });
    }

    // Verify booking status allows payment
    if (!['requested', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot pay for booking with status: ${booking.status}`
      });
    }

    req.booking = booking;
    next();
  } catch (error) {
    console.error('[SECURITY] Booking verification error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Booking verification failed'
    });
  }
};

// ============================================
// 10. IP GEOLOCATION CHECK (Optional)
// ============================================
const checkPaymentLocation = (req, res, next) => {
  // In production, integrate with IP geolocation service
  // to detect suspicious payment locations
  
  const suspiciousCountries = process.env.BLOCKED_COUNTRIES?.split(',') || [];
  
  // This is a placeholder - integrate with actual geolocation service
  // const country = getCountryFromIP(req.ip);
  // if (suspiciousCountries.includes(country)) {
  //   return res.status(403).json({
  //     success: false,
  //     message: 'Payment not available in your region'
  //   });
  // }
  
  next();
};

module.exports = {
  verifyRazorpayWebhook,
  verifyPaymentSignature,
  validatePaymentAmount,
  handleIdempotency,
  detectFraud,
  updateFraudHistory,
  paymentRateLimiter,
  createPaymentRateLimiter,
  securePaymentLogger,
  encryptSensitiveData,
  decryptSensitiveData,
  verifyBookingAmount,
  checkPaymentLocation
};
