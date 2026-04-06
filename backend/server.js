const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env in two steps:
// 1) Load `.env` (shared defaults / secrets)
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// Import production-ready error handling and monitoring
const {
  gracefulErrorRecovery,
  asyncErrorHandler,
  databaseHealthCheck,
  requestTimeout,
  memoryMonitor
} = require('./middleware/productionErrorHandler');

const healthMonitor = require('./utils/healthMonitor');

const app = express();

// Performance optimizations
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Trust proxy for production deployment
app.set('trust proxy', 1);

// Import security middleware
const {
  securityMiddleware,
  rateLimiters,
  csrfProtection,
  createBruteForceProtector,
  sanitizeInput,
  preventInjection,
  validateRequest,
  securityAuditLog,
  sessionSecurity
} = require('./middleware/advancedSecurity');

// CORS configuration - PRODUCTION GRADE
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      process.env.FRONTEND_URL,
      process.env.CLIENT_URL
    ].filter(Boolean);

    // Check if origin matches allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any Netlify deployment URL (*.netlify.app)
    if (origin.endsWith('.netlify.app')) {
      console.log(`[CORS] Allowing Netlify deployment: ${origin}`);
      return callback(null, true);
    }

    // In production, be strict about origins
    if (process.env.NODE_ENV === 'production') {
      console.log(`[SECURITY] CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    } else {
      // In development, allow all origins but log
      console.log(`[SECURITY] Non-whitelisted origin in dev: ${origin}`);
      callback(null, true);
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
    'Cache-Control',
    'X-CSRF-Token',
    'X-Idempotency-Key',
    'X-Request-ID'
  ],
  exposedHeaders: ['set-cookie', 'X-CSRF-Token'],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Enhanced security middleware - ORDER MATTERS
app.use(securityMiddleware);

// Request validation and sanitization
app.use(validateRequest);
app.use(sanitizeInput);
app.use(preventInjection);

// Security audit logging
app.use(securityAuditLog);

// Session security
app.use(sessionSecurity);

// Production-ready middleware
app.use(requestTimeout(30000)); // 30 second timeout
app.use(memoryMonitor);
app.use(databaseHealthCheck);

// Apply general rate limiting
app.use(rateLimiters.general);

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// ────────────────────────────────────────────────────────────────
// SMART DUAL DATABASE CONNECTION
// Tries Local MongoDB first → falls back to Atlas automatically
// ────────────────────────────────────────────────────────────────
const net = require('net');

const checkLocalMongoDB = () => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000); // Fast fail

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(27017, '127.0.0.1');
  });
};

const connectDB = async () => {
  const LOCAL_URI  = 'mongodb://127.0.0.1:27017/mess-wallah';
  const ATLAS_URI  = process.env.MONGODB_URI; // Cloud Atlas from .env

  console.log('[DB] Checking for local MongoDB server...');
  const isLocalAvailable = await checkLocalMongoDB();

  // Decide which URI to use
  let activeURI = '';
  let label = '';
  let options = {
    retryWrites: true,
  };

  if (isLocalAvailable) {
    activeURI = LOCAL_URI;
    label = 'Local MongoDB (localhost:27017)';
    options.serverSelectionTimeoutMS = 5000;
  } else if (ATLAS_URI) {
    console.log('[DB] Local DB not available. Falling back to MongoDB Atlas...');
    activeURI = ATLAS_URI;
    label = 'MongoDB Atlas';
    options.serverSelectionTimeoutMS = 30000;
    options.socketTimeoutMS = 60000;
    options.connectTimeoutMS = 30000;
  } else {
    console.error('[ERROR] No MongoDB URI available (Local failed, ATLAS not set).');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(activeURI, options);
    
    const displayURI = conn.connection.host.includes('127.0.0.1') || conn.connection.host.includes('localhost') ? '🏠 LOCAL' : '☁️  ATLAS';
    console.log(`\n[SUCCESS] ✅ MongoDB Connected via ${displayURI}`);
    console.log(`[INFO]    Host: ${conn.connection.host}`);
    console.log(`[INFO]    DB:   ${conn.connection.name}\n`);

    const Room = require('./models/Room');
    const roomCount = await Room.countDocuments().catch(() => '?');
    console.log(`[INFO]    Rooms in database: ${roomCount}`);

    return conn;
  } catch (err) {
    console.error(`[ERROR] Failed to connect to ${label}:`, err.message);
    console.log('[INFO] Retrying connection in 10s...');
    setTimeout(() => connectDB(), 10000);
  }
};

// Connect to database
connectDB().catch(err => console.error('DB connect error:', err));


// OPTIMIZED: Lightweight health check endpoint for Render (< 100ms response)
app.get('/health', asyncErrorHandler(async (req, res) => {
  // Skip expensive checks - just return basic status
  const dbConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    status: 'OK',
    message: 'MESS WALLAH API is running',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbConnected ? 'Connected' : 'Disconnected'
  });
}));

// Detailed health monitoring endpoint (for manual checks only)
app.get('/health/detailed', asyncErrorHandler(async (req, res) => {
  const startTime = Date.now();
  const healthReport = healthMonitor.getHealthReport();
  const healthMetrics = healthMonitor.getHealthMetrics();
  const duration = Date.now() - startTime;

  res.status(200).json({
    status: 'OK',
    message: 'MESS WALLAH API - Detailed Health Report',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    health: healthReport,
    metrics: healthMetrics,
    uptime: Math.floor(process.uptime()),
    version: '1.0.0',
    checkDuration: duration + 'ms'
  });
}));

// Health metrics endpoint for monitoring tools
app.get('/health/metrics', asyncErrorHandler(async (req, res) => {
  const metrics = healthMonitor.getHealthMetrics();
  res.status(200).json(metrics);
}));

// Warmup endpoint to prevent cold starts
app.get('/api/warmup', asyncErrorHandler(async (req, res) => {
  const startTime = Date.now();

  try {
    // Check database connection
    const dbConnected = mongoose.connection.readyState === 1;

    // Perform lightweight database query to warm connection pool
    let dbQueryTime = 0;
    let roomCount = 0;
    if (dbConnected) {
      const queryStart = Date.now();
      const Room = require('./models/Room');
      roomCount = await Room.countDocuments();
      dbQueryTime = Date.now() - queryStart;
    }

    const totalTime = Date.now() - startTime;

    res.status(200).json({
      status: 'warmed',
      message: 'Server and database connections are warm',
      timestamp: new Date().toISOString(),
      metrics: {
        totalResponseTime: totalTime + 'ms',
        databaseQueryTime: dbQueryTime + 'ms',
        databaseConnected: dbConnected,
        roomsInDatabase: roomCount,
        serverUptime: Math.floor(process.uptime()) + 's'
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('[WARMUP] Error during warmup:', error.message);
    res.status(200).json({
      status: 'partial',
      message: 'Server is warm but database warmup failed',
      timestamp: new Date().toISOString(),
      error: error.message,
      metrics: {
        totalResponseTime: (Date.now() - startTime) + 'ms',
        serverUptime: Math.floor(process.uptime()) + 's'
      }
    });
  }
}));

// Enhanced test endpoint with error recovery
app.get('/api/test', asyncErrorHandler(async (req, res) => {
  // Test database connectivity
  const dbStatus = mongoose.connection.readyState === 1;

  // Test memory usage
  const memUsage = process.memoryUsage();
  const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);

  res.json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    system: {
      database: dbStatus ? 'Connected' : 'Disconnected',
      memory: memUsageMB + 'MB',
      uptime: Math.floor(process.uptime()) + 's',
      nodeVersion: process.version,
      platform: process.platform
    },
    environment: process.env.NODE_ENV || 'development'
  });
}));

// Register API routes
console.log('[INIT] Registering API routes...');

try {
  const authRoutes = require('./routes/auth');
  const googleAuthRoutes = require('./routes/googleAuth');
  app.use('/api/auth', authRoutes);
  app.use('/api/auth', googleAuthRoutes);
  console.log('   [OK] /api/auth routes registered');
  console.log('   [OK] /api/auth/google routes registered');
} catch (error) {
  console.error('   [ERROR] Failed to register /api/auth routes:', error.message);
  // Create fallback auth routes to prevent 404 errors
  app.use('/api/auth/*', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Authentication service temporarily unavailable',
      error: 'Service initialization failed',
      type: 'ServiceError',
      retryAfter: 60
    });
  });
}

try {
  app.use('/api/users', require('./routes/users'));
  console.log('   [OK] /api/users routes registered');
} catch (error) {
  console.error('   [ERROR] Failed to register /api/users routes:', error.message);
}

try {
  app.use('/api/rooms', require('./routes/rooms'));
  console.log('   [OK] /api/rooms routes registered');
} catch (error) {
  console.error('   [ERROR] Failed to register /api/rooms routes:', error.message);
}

try {
  app.use('/api/bookings', require('./routes/bookings'));
  console.log('   [OK] /api/bookings routes registered');
  app.use('/api/search', require('./routes/search'));
  app.use('/api/payments', require('./routes/payments'));

  console.log('   [OK] All core API routes registered');
} catch (error) {
  console.error('   [ERROR] Failed to register core API routes:', error.message);
  // Create fallback auth routes to prevent 404 errors if auth fails
  app.use('/api/auth/*', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Authentication service temporarily unavailable',
      error: 'Service initialization failed',
      type: 'ServiceError',
      retryAfter: 60
    });
  });
  // Fallback for other API routes
  app.use('/api/*', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'API service temporarily unavailable',
      error: 'Service initialization failed',
      type: 'ServiceError',
      retryAfter: 60
    });
  });
}

// Removed unused routes: analytics, owner, admin, notifications

// Test routes for health/status (development only)
if (process.env.NODE_ENV !== 'production') {
  const testRouter = express.Router();
  testRouter.get('/status', (req, res) => {
    res.json({ success: true, message: 'Test services route active (dev only)', env: process.env.NODE_ENV });
  });
  app.use('/api/test-services', testRouter);
  console.log('   [OK] /api/test-services routes registered (DEV ONLY)');
}


// Start health monitoring system
healthMonitor.startMonitoring(30000); // Check every 30 seconds
console.log('[SUCCESS] Health monitoring system started');

// Keep-alive to prevent cold starts
if (process.env.SELF_PING_ENABLED === 'true') {
  healthMonitor.startSelfPing();
  console.log('[SUCCESS] Self-ping keep-alive system started');
}

// Production-ready global error handling middleware
app.use(gracefulErrorRecovery);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('[ERROR] Global Error Handler:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
      type: 'ValidationError'
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return res.status(400).json({
      success: false,
      message: `${field} '${value}' already exists`,
      error: 'Duplicate field value',
      type: 'DuplicateError',
      field
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
      error: 'Invalid ID format',
      type: 'CastError'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
      error: 'Authentication failed',
      type: 'AuthenticationError'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication token has expired',
      error: 'Token expired - please login again',
      type: 'TokenExpiredError'
    });
  }

  // Rate limiting error
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later',
      error: 'Rate limit exceeded',
      type: 'RateLimitError',
      retryAfter: err.retryAfter
    });
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large',
      error: 'Maximum file size exceeded',
      type: 'FileUploadError'
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal Server Error' : message,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    type: err.name || 'ServerError',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Start server — always listen (Render requires this in production too)
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SUCCESS] MESS WALLAH Server running on port ${PORT}`);
  console.log(`[INFO] Environment: ${process.env.NODE_ENV}`);
  console.log(`[INFO] Client URL: ${process.env.CLIENT_URL}`);
  console.log(`[INFO] Health check: ${process.env.BASE_URL || `http://localhost:${PORT}`}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

process.on('unhandledRejection', (err) => {
  console.error('[CRITICAL] Unhandled Promise Rejection:', err);
  // Do NOT crash the server for unhandled rejections (e.g. DB timeouts, email failures)
  // Let the request fail but keep the server alive for other users.
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});


// Export the app for testing
module.exports = app;

