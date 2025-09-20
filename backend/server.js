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
  securityHeaders,
  rateLimits,
  csrfProtection,
  generateCSRFToken,
  sanitizeInput,
  requestSizeLimit,
  securityLogger,
  checkBruteForce
} = require('./middleware/securityHeaders');

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
app.use(securityHeaders);
app.use(securityLogger);
app.use(requestSizeLimit);
app.use(sanitizeInput);

// Compression middleware
app.use(compression());

// Apply general rate limiting
app.use(rateLimits.general);

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

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        message: 'MESS WALLAH API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
      });
    });

    // Test endpoint
    app.get('/api/test', (req, res) => {
      res.json({
        success: true,
        message: 'API is working correctly',
        timestamp: new Date().toISOString()
      });
    });

    // Register API routes
    console.log('📋 Registering API routes...');

    try {
      app.use('/api/auth', require('./routes/auth'));
      console.log('   ✓ /api/auth routes registered');
    } catch (error) {
      console.error('   ❌ Failed to register /api/auth routes:', error.message);
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
      app.use('/api/search', require('./routes/searchRoutes'));
      console.log('   ✓ /api/search routes registered');
    } catch (error) {
      console.error('   ❌ Failed to register /api/search routes:', error.message);
    }

    try {
      app.use('/api/payments', require('./routes/securePaymentRoutes'));
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

    // Global error handling middleware
    app.use((err, req, res, next) => {
      console.error('Global Error Handler:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
      });

      // Mongoose validation error
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors
        });
      }

      // Mongoose cast error
      if (err.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid ID format'
        });
      }

      // JWT errors
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }

      // Default error
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && {
          stack: err.stack
        })
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
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📅 Started at: ${new Date().toISOString()}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
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
