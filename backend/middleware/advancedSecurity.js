const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// Advanced Rate Limiting
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Different rate limits for different endpoints
const rateLimiters = {
  // General API rate limit
  general: createRateLimiter(15 * 60 * 1000, 100, 'Too many requests, please try again later'),

  // Authentication endpoints (stricter)
  auth: createRateLimiter(15 * 60 * 1000, 5, 'Too many authentication attempts, please try again later'),

  // Registration (very strict)
  register: createRateLimiter(60 * 60 * 1000, 3, 'Too many registration attempts, please try again in an hour'),

  // Password reset (strict)
  passwordReset: createRateLimiter(60 * 60 * 1000, 3, 'Too many password reset attempts, please try again in an hour'),

  // File uploads
  upload: createRateLimiter(15 * 60 * 1000, 10, 'Too many upload attempts, please try again later'),

  // Search endpoints
  search: createRateLimiter(15 * 60 * 1000, 50, 'Too many search requests, please try again later'),

  // Reports generation (admin only)
  reports: createRateLimiter(60 * 60 * 1000, 5, 'Too many report generation requests, please try again in an hour')
};

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://mess-wallah.netlify.app',
      'https://mess-wallah.vercel.app'
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-CSRF-Token'
  ],
  exposedHeaders: ['X-CSRF-Token'],
  maxAge: 86400 // 24 hours
};

// Enhanced Helmet configuration
const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.cloudinary.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
};

// Input validation middleware
const validateInput = (req, res, next) => {
  // Remove any null bytes
  const cleanObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/\0/g, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        cleanObject(obj[key]);
      }
    }
  };

  if (req.body) cleanObject(req.body);
  if (req.query) cleanObject(req.query);
  if (req.params) cleanObject(req.params);

  next();
};

// Request size limiter
const requestSizeLimiter = (req, res, next) => {
  const contentLength = parseInt(req.get('Content-Length'));
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength && contentLength > maxSize) {
    return res.status(413).json({
      error: 'Request entity too large',
      maxSize: '10MB'
    });
  }

  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Remove server information
  res.removeHeader('X-Powered-By');

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  next();
};

// Brute force protection for specific routes
const bruteForceProtection = new Map();

const createBruteForceProtector = (maxAttempts = 5, blockDuration = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const key = req.ip + (req.body.email || req.body.username || '');
    const now = Date.now();

    if (!bruteForceProtection.has(key)) {
      bruteForceProtection.set(key, { attempts: 0, blockedUntil: 0 });
    }

    const record = bruteForceProtection.get(key);

    // Check if still blocked
    if (record.blockedUntil > now) {
      const remainingTime = Math.ceil((record.blockedUntil - now) / 1000);
      return res.status(429).json({
        error: 'Too many failed attempts. Account temporarily blocked.',
        retryAfter: remainingTime
      });
    }

    // Reset if block period has passed
    if (record.blockedUntil > 0 && record.blockedUntil <= now) {
      record.attempts = 0;
      record.blockedUntil = 0;
    }

    // Add attempt tracking to request
    req.bruteForceRecord = record;
    req.bruteForceKey = key;

    next();
  };
};

// Middleware to handle failed login attempts
const handleFailedAttempt = (req, res, next) => {
  if (req.bruteForceRecord && req.authFailed) {
    req.bruteForceRecord.attempts += 1;

    if (req.bruteForceRecord.attempts >= 5) {
      req.bruteForceRecord.blockedUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
      console.log(`IP ${req.ip} blocked due to too many failed attempts`);
    }
  }

  next();
};

// Clean up old brute force records
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of bruteForceProtection.entries()) {
    if (record.blockedUntil > 0 && record.blockedUntil < now - (60 * 60 * 1000)) {
      bruteForceProtection.delete(key);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour

// CSRF Protection
const csrfTokens = new Map();

const generateCSRFToken = () => {
  return require('crypto').randomBytes(32).toString('hex');
};

const csrfProtection = (req, res, next) => {
  if (req.method === 'GET') {
    // Generate and send CSRF token for GET requests
    const token = generateCSRFToken();
    csrfTokens.set(req.sessionID || req.ip, token);
    res.setHeader('X-CSRF-Token', token);
    return next();
  }

  // Validate CSRF token for state-changing requests
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const storedToken = csrfTokens.get(req.sessionID || req.ip);

  if (!token || !storedToken || token !== storedToken) {
    return res.status(403).json({
      error: 'Invalid CSRF token'
    });
  }

  next();
};

// Apply all security middleware
const applySecurityMiddleware = (app) => {
  // Trust proxy (for production deployment)
  app.set('trust proxy', 1);

  // Basic security headers
  app.use(helmet(helmetOptions));

  // CORS
  app.use(cors(corsOptions));

  // Request size limiting
  app.use(requestSizeLimiter);

  // Input sanitization
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp());
  app.use(validateInput);

  // Additional security headers
  app.use(securityHeaders);

  // General rate limiting
  app.use('/api/', rateLimiters.general);

  // Specific rate limits
  app.use('/api/auth/login', rateLimiters.auth);
  app.use('/api/auth/register', rateLimiters.register);
  app.use('/api/auth/forgot-password', rateLimiters.passwordReset);
  app.use('/api/auth/reset-password', rateLimiters.passwordReset);
  app.use('/api/upload', rateLimiters.upload);
  app.use('/api/search', rateLimiters.search);
  app.use('/api/rooms/search', rateLimiters.search);
  app.use('/api/reports', rateLimiters.reports);

  // CSRF protection for state-changing operations
  app.use('/api/auth/login', csrfProtection);
  app.use('/api/auth/register', csrfProtection);
  app.use('/api/rooms', csrfProtection);
  app.use('/api/bookings', csrfProtection);
};

module.exports = {
  applySecurityMiddleware,
  rateLimiters,
  createBruteForceProtector,
  handleFailedAttempt,
  csrfProtection,
  corsOptions,
  helmetOptions
};
