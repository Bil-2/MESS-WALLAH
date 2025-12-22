/**
 * Security Configuration
 * Production-grade security settings for MESS WALLAH
 */

module.exports = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-min-32-characters',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256',
    issuer: 'mess-wallah',
    audience: 'mess-wallah-users'
  },

  // Password Policy
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
    saltRounds: 12
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    authMaxRequests: 5,
    paymentMaxRequests: 3,
    skipSuccessfulRequests: false
  },

  // Session Configuration
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    }
  },

  // CORS Configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL]
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Request-Signature', 'X-Request-Timestamp'],
    exposedHeaders: ['X-CSRF-Token'],
    maxAge: 86400 // 24 hours
  },

  // File Upload Security
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 15,
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    uploadDir: 'uploads/',
    tempDir: 'uploads/temp/'
  },

  // IP Security
  ipSecurity: {
    trustProxy: true,
    maxRequestsPerIP: 100,
    blockDuration: 15 * 60 * 1000, // 15 minutes
    whitelist: [],
    blacklist: []
  },

  // OTP Configuration
  otp: {
    length: 6,
    expiryMinutes: 10,
    maxAttempts: 3,
    resendDelay: 60, // seconds
    type: 'numeric'
  },

  // Account Security
  account: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    passwordResetExpiry: 60 * 60 * 1000, // 1 hour
    emailVerificationExpiry: 24 * 60 * 60 * 1000, // 24 hours
    sessionTimeout: 30 * 60 * 1000 // 30 minutes
  },

  // Payment Security
  payment: {
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID,
      keySecret: process.env.RAZORPAY_KEY_SECRET,
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
    },
    maxAmount: 100000, // ₹1,00,000
    minAmount: 100, // ₹100
    currency: 'INR',
    timeout: 30000 // 30 seconds
  },

  // Encryption
  encryption: {
    algorithm: 'aes-256-gcm',
    key: process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'),
    ivLength: 16
  },

  // Security Headers
  headers: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    logFile: process.env.LOG_FILE_PATH || './logs/app.log',
    logSensitiveData: false,
    logFailedLogins: true,
    logSuspiciousActivity: true
  },

  // Monitoring
  monitoring: {
    enabled: true,
    healthCheckInterval: 30000, // 30 seconds
    alertOnFailure: true,
    alertEmail: process.env.ALERT_EMAIL || 'security@messwallah.com'
  },

  // Backup
  backup: {
    enabled: true,
    schedule: '0 2 * * *', // Daily at 2 AM
    retention: 30, // days
    encryptBackups: true
  }
};
