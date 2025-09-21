/**
 * Production Logger Utility
 * Provides structured logging for production environment
 */

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Log levels
 */
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN', 
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * Format log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} meta - Additional metadata
 * @returns {string} - Formatted log message
 */
const formatLogMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta
  };
  return JSON.stringify(logEntry);
};

/**
 * Write log to file
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} meta - Additional metadata
 */
const writeLog = (level, message, meta = {}) => {
  const formattedMessage = formatLogMessage(level, message, meta);
  
  // Console output for development
  if (process.env.NODE_ENV !== 'production') {
    console.log(formattedMessage);
  }
  
  // File output for production
  const logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, formattedMessage + '\n');
};

/**
 * Logger object with different log levels
 */
const logger = {
  error: (message, meta = {}) => {
    writeLog(LOG_LEVELS.ERROR, message, meta);
  },
  
  warn: (message, meta = {}) => {
    writeLog(LOG_LEVELS.WARN, message, meta);
  },
  
  info: (message, meta = {}) => {
    writeLog(LOG_LEVELS.INFO, message, meta);
  },
  
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      writeLog(LOG_LEVELS.DEBUG, message, meta);
    }
  },
  
  // Log API requests
  logRequest: (req, res, responseTime) => {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    };
    
    if (res.statusCode >= 400) {
      logger.error('API Request Error', logData);
    } else {
      logger.info('API Request', logData);
    }
  },
  
  // Log database operations
  logDB: (operation, collection, meta = {}) => {
    logger.info(`Database ${operation}`, {
      collection,
      ...meta
    });
  }
};

module.exports = logger;
