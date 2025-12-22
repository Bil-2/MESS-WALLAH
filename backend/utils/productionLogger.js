/**
 * PRODUCTION LOGGER
 * Comprehensive logging system for production monitoring
 */

const winston = require('winston');
const path = require('path');

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN', 
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mess-wallah-api' },
  transports: [
    // Error log file
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Combined log file
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Custom log writer for direct file writing
const writeLog = (level, message, meta = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  };

  // Write to appropriate log file
  const logLine = JSON.stringify(logEntry) + '\n';
  const logFile = level === 'ERROR' ? 'error.log' : 'combined.log';
  const logPath = path.join(logsDir, logFile);

  fs.appendFileSync(logPath, logLine);
};

// Enhanced logger with additional methods
const productionLogger = {
  error: (message, meta = {}) => {
    logger.error(message, meta);
    writeLog(LOG_LEVELS.ERROR, message, meta);
  },
  
  warn: (message, meta = {}) => {
    logger.warn(message, meta);
    writeLog(LOG_LEVELS.WARN, message, meta);
  },
  
  info: (message, meta = {}) => {
    logger.info(message, meta);
    writeLog(LOG_LEVELS.INFO, message, meta);
  },
  
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      writeLog(LOG_LEVELS.DEBUG, message, meta);
    }
  },

  // Security audit logging
  security: (message, meta = {}) => {
    const securityLog = {
      type: 'SECURITY',
      message,
      ...meta,
      timestamp: new Date().toISOString()
    };
    
    logger.warn(`[SECURITY] ${message}`, meta);
    writeLog('SECURITY', message, securityLog);
  },

  // Performance logging
  performance: (message, meta = {}) => {
    const perfLog = {
      type: 'PERFORMANCE',
      message,
      ...meta,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`[PERFORMANCE] ${message}`, meta);
    writeLog('PERFORMANCE', message, perfLog);
  },

  // API request logging
  request: (req, res, duration) => {
    const requestLog = {
      type: 'REQUEST',
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: duration + 'ms',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user?.id || 'anonymous',
      timestamp: new Date().toISOString()
    };

    logger.info('API Request', requestLog);
    writeLog('REQUEST', 'API Request', requestLog);
  }
};

module.exports = productionLogger;