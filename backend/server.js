const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

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
  createBruteForceProtector
} = require('./middleware/advancedSecurity');

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
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

    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
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
    'Cache-Control',
    'X-Requested-With'
  ],
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));

// Enhanced security middleware
app.use(securityMiddleware);

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

// Database connection
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mess-wallah';
    console.log(`📍 MongoDB URI: ${mongoURI}`);

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);

    // Check if database has rooms
    const Room = require('./models/Room');
    const roomCount = await Room.countDocuments();
    console.log(`📊 Total rooms in database: ${roomCount}`);

    // Auto-seed if database is empty
    if (roomCount === 0) {
      console.log('🌱 Database is empty. Running auto-seeding...');
      try {
        const { seedSampleRooms } = require('./controllers/roomController');
        await seedSampleRooms();
        console.log('✅ Auto-seeding completed successfully');
      } catch (seedError) {
        console.error('❌ Auto-seeding failed:', seedError.message);
      }
    }

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('🔧 Troubleshooting steps:');
    console.error('   1. Make sure MongoDB is running: npm run mongo:start');
    console.error('   2. Check MongoDB status: npm run mongo:status');
    console.error('   3. Verify connection string in .env file');
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Enhanced health check endpoint with monitoring
    app.get('/health', asyncErrorHandler(async (req, res) => {
      const healthReport = healthMonitor.getHealthReport();
      const healthMetrics = healthMonitor.getHealthMetrics();
      
      res.status(200).json({
        status: 'OK',
        message: 'MESS WALLAH API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        health: healthReport,
        metrics: healthMetrics,
        uptime: Math.floor(process.uptime()),
        version: '1.0.0'
      });
    }));
    
    // Detailed health monitoring endpoint
    app.get('/health/detailed', asyncErrorHandler(async (req, res) => {
      const healthReport = healthMonitor.getHealthReport();
      res.status(200).json(healthReport);
    }));
    
    // Health metrics endpoint for monitoring tools
    app.get('/health/metrics', asyncErrorHandler(async (req, res) => {
      const metrics = healthMonitor.getHealthMetrics();
      res.status(200).json(metrics);
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
    console.log('📋 Registering API routes...');

    try {
      const authRoutes = require('./routes/auth');
      app.use('/api/auth', authRoutes);
      console.log('   ✓ /api/auth routes registered');
    } catch (error) {
      console.error('   ❌ Failed to register /api/auth routes:', error.message);
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
      console.log('   ✓ /api/users routes registered');
    } catch (error) {
      console.error('   ❌ Failed to register /api/users routes:', error.message);
    }

    try {
      app.use('/api/rooms', require('./routes/rooms'));
      console.log('   ✓ /api/rooms routes registered');
    } catch (error) {
      console.error('   ❌ Failed to register /api/rooms routes:', error.message);
    }

    try {
      app.use('/api/bookings', require('./routes/bookings'));
      console.log('   ✓ /api/bookings routes registered');
    } catch (error) {
      console.error('   ❌ Failed to register /api/bookings routes:', error.message);
    }

    try {
      app.use('/api/search', require('./routes/search'));
      console.log('   ✓ /api/search routes registered');
    } catch (error) {
      console.error('   ❌ Failed to register /api/search routes:', error.message);
    }

    try {
      app.use('/api/payments', require('./routes/simplePaymentRoutes'));
      console.log('   ✓ /api/payments routes registered');
    } catch (error) {
      console.error('   ❌ Failed to register /api/payments routes:', error.message);
    }

    try {
      app.use('/api/test-sms', require('./routes/testSMS'));
      console.log('   ✓ /api/test-sms routes registered');
    } catch (error) {
      console.error('   ❌ Failed to register /api/test-sms routes:', error.message);
    }

    try {
      app.use('/api/analytics', require('./routes/analytics'));
      console.log('   ✓ /api/analytics routes registered');
    } catch (error) {
      console.error('   ❌ Failed to register /api/analytics routes:', error.message);
    }

    // Start health monitoring system
    healthMonitor.startMonitoring(30000); // Check every 30 seconds
    console.log('✅ Health monitoring system started');
    
    // Production-ready global error handling middleware
    app.use(gracefulErrorRecovery);
    
    // Fallback error handler
    app.use((err, req, res, next) => {
      console.error('🚨 Global Error Handler:', {
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

    const PORT = process.env.PORT || 5001;

    const server = app.listen(PORT, () => {
      console.log(`🚀 MESS WALLAH Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`📅 Started at: ${new Date().toISOString()}`);
      console.log(`🔗 Health check: ${process.env.BASE_URL || `http://localhost:${PORT}`}/health`);
      console.log(`🧪 Test endpoint: ${process.env.BASE_URL || `http://localhost:${PORT}`}/api/test`);
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
      console.error('Unhandled Promise Rejection:', err);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Server initialization failed:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
