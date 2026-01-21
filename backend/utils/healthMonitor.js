/**
 * PRODUCTION HEALTH MONITORING SYSTEM
 * Real-time monitoring and auto-recovery for 100% API reliability
 */

const mongoose = require('mongoose');
const axios = require('axios');

class HealthMonitor {
  constructor() {
    this.healthStatus = {
      database: 'unknown',
      api: 'unknown',
      memory: 'unknown',
      lastCheck: null,
      uptime: process.uptime(),
      errors: [],
      warnings: []
    };

    this.isMonitoring = false;
    this.checkInterval = null;
    this.alertThresholds = {
      memoryUsage: 80, // percentage
      responseTime: 5000, // milliseconds
      errorRate: 10 // percentage
    };
  }

  /**
   * Start health monitoring
   */
  startMonitoring(intervalMs = 30000) {
    if (this.isMonitoring) {
      console.warn('Health monitoring is already running');
      return;
    }

    this.isMonitoring = true;
    console.log('Starting health monitoring system', { interval: intervalMs });

    // Initial health check
    this.performHealthCheck();

    // Set up periodic monitoring
    this.checkInterval = setInterval(() => {
      this.performHealthCheck();
    }, intervalMs);

    // Monitor process events
    this.setupProcessMonitoring();
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isMonitoring = false;
    console.log('Health monitoring stopped');
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck() {
    const startTime = Date.now();

    try {
      // Reset status
      this.healthStatus.errors = [];
      this.healthStatus.warnings = [];
      this.healthStatus.lastCheck = new Date().toISOString();
      this.healthStatus.uptime = process.uptime();

      // Check database health
      await this.checkDatabaseHealth();

      // Check API health
      await this.checkAPIHealth();

      // Check memory usage
      this.checkMemoryHealth();

      // Check disk space (if needed)
      this.checkSystemHealth();

      const duration = Date.now() - startTime;
      console.log('Health check completed', {
        duration: duration + 'ms',
        status: this.getOverallHealth()
      });

      // Auto-recovery if needed
      await this.performAutoRecovery();

    } catch (error) {
      console.error('Health check failed', { error: error.message });
      this.healthStatus.errors.push({
        type: 'HealthCheckError',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Check database connectivity and performance
   */
  async checkDatabaseHealth() {
    try {
      const startTime = Date.now();

      // Check connection state
      if (mongoose.connection.readyState !== 1) {
        this.healthStatus.database = 'disconnected';
        this.healthStatus.errors.push({
          type: 'DatabaseError',
          message: 'Database connection is not active',
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Test database query performance
      const Room = require('../models/Room');
      await Room.findOne().lean().limit(1);

      const responseTime = Date.now() - startTime;

      if (responseTime > 1000) {
        this.healthStatus.database = 'slow';
        this.healthStatus.warnings.push({
          type: 'DatabasePerformance',
          message: `Database response time is slow: ${responseTime}ms`,
          timestamp: new Date().toISOString()
        });
      } else {
        this.healthStatus.database = 'healthy';
      }

      console.log('Database health check passed', { responseTime: responseTime + 'ms' });

    } catch (error) {
      this.healthStatus.database = 'error';
      this.healthStatus.errors.push({
        type: 'DatabaseError',
        message: error.message,
        timestamp: new Date().toISOString()
      });
      console.error('Database health check failed', { error: error.message });
    }
  }

  /**
   * Check API endpoint health
   */
  async checkAPIHealth() {
    try {
      const startTime = Date.now();
      const port = process.env.PORT || 5001;

      // Test critical endpoints
      const endpoints = [
        `http://localhost:${port}/health`,
        `http://localhost:${port}/api/test`,
        `http://localhost:${port}/api/rooms?limit=1`
      ];

      const results = await Promise.allSettled(
        endpoints.map(url =>
          axios.get(url, { timeout: 5000 })
        )
      );

      const failedEndpoints = results.filter(result => result.status === 'rejected');
      const responseTime = Date.now() - startTime;

      if (failedEndpoints.length === 0) {
        this.healthStatus.api = responseTime > this.alertThresholds.responseTime ? 'slow' : 'healthy';
      } else {
        this.healthStatus.api = 'error';
        this.healthStatus.errors.push({
          type: 'APIError',
          message: `${failedEndpoints.length} API endpoints failed`,
          timestamp: new Date().toISOString()
        });
      }

      if (responseTime > this.alertThresholds.responseTime) {
        this.healthStatus.warnings.push({
          type: 'APIPerformance',
          message: `API response time is slow: ${responseTime}ms`,
          timestamp: new Date().toISOString()
        });
      }

      console.log('API health check completed', {
        responseTime: responseTime + 'ms',
        failedEndpoints: failedEndpoints.length
      });

    } catch (error) {
      this.healthStatus.api = 'error';
      this.healthStatus.errors.push({
        type: 'APIError',
        message: error.message,
        timestamp: new Date().toISOString()
      });
      console.error('API health check failed', { error: error.message });
    }
  }

  /**
   * Check memory usage and performance
   */
  checkMemoryHealth() {
    try {
      const memUsage = process.memoryUsage();
      const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      const memTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
      const memUsagePercent = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);

      if (memUsagePercent > this.alertThresholds.memoryUsage) {
        this.healthStatus.memory = 'high';
        this.healthStatus.warnings.push({
          type: 'MemoryUsage',
          message: `High memory usage: ${memUsageMB}MB (${memUsagePercent}%)`,
          timestamp: new Date().toISOString()
        });
      } else {
        this.healthStatus.memory = 'healthy';
      }

      console.log('Memory health check completed', {
        heapUsed: memUsageMB + 'MB',
        heapTotal: memTotalMB + 'MB',
        percentage: memUsagePercent + '%'
      });

    } catch (error) {
      this.healthStatus.memory = 'error';
      this.healthStatus.errors.push({
        type: 'MemoryError',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Check system health (CPU, disk, etc.)
   */
  checkSystemHealth() {
    try {
      // Check CPU usage (simplified)
      const cpuUsage = process.cpuUsage();

      // Check if process has been running for a long time without restart
      const uptimeHours = Math.floor(process.uptime() / 3600);
      if (uptimeHours > 24) {
        this.healthStatus.warnings.push({
          type: 'SystemHealth',
          message: `Process has been running for ${uptimeHours} hours. Consider restart.`,
          timestamp: new Date().toISOString()
        });
      }

      console.log('System health check completed', {
        uptime: uptimeHours + ' hours',
        pid: process.pid
      });

    } catch (error) {
      console.error('System health check failed', { error: error.message });
    }
  }

  /**
   * Perform automatic recovery actions
   */
  async performAutoRecovery() {
    // Database recovery
    if (this.healthStatus.database === 'disconnected') {
      console.log('Attempting database auto-recovery...');
      try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mess-wallah', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('Database auto-recovery successful');
        this.healthStatus.database = 'healthy';
      } catch (error) {
        console.error('Database auto-recovery failed', { error: error.message });
      }
    }

    // Memory recovery
    if (this.healthStatus.memory === 'high' && global.gc) {
      console.log('Triggering garbage collection for memory recovery...');
      global.gc();

      // Re-check memory after GC
      setTimeout(() => {
        this.checkMemoryHealth();
      }, 1000);
    }
  }

  /**
   * Setup process monitoring for crashes and exits
   */
  setupProcessMonitoring() {
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception detected', {
        error: error.message,
        stack: error.stack
      });

      this.healthStatus.errors.push({
        type: 'UncaughtException',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Promise Rejection detected', {
        reason: reason.toString(),
        promise: promise.toString()
      });

      this.healthStatus.errors.push({
        type: 'UnhandledRejection',
        message: reason.toString(),
        timestamp: new Date().toISOString()
      });
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Graceful shutdown initiated.');
      this.stopMonitoring();
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received. Graceful shutdown initiated.');
      this.stopMonitoring();
    });
  }

  /**
   * Get overall health status
   */
  getOverallHealth() {
    if (this.healthStatus.errors.length > 0) {
      return 'unhealthy';
    } else if (this.healthStatus.warnings.length > 0) {
      return 'warning';
    } else {
      return 'healthy';
    }
  }

  /**
   * Get detailed health report
   */
  getHealthReport() {
    return {
      status: this.getOverallHealth(),
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      components: {
        database: this.healthStatus.database,
        api: this.healthStatus.api,
        memory: this.healthStatus.memory
      },
      errors: this.healthStatus.errors,
      warnings: this.healthStatus.warnings,
      lastCheck: this.healthStatus.lastCheck,
      monitoring: this.isMonitoring
    };
  }

  /**
   * Generate health metrics for monitoring tools
   */
  getHealthMetrics() {
    const memUsage = process.memoryUsage();

    return {
      timestamp: Date.now(),
      uptime: process.uptime(),
      memory: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss
      },
      database: {
        status: this.healthStatus.database,
        readyState: mongoose.connection.readyState
      },
      api: {
        status: this.healthStatus.api
      },
      errors: this.healthStatus.errors.length,
      warnings: this.healthStatus.warnings.length
    };
  }
}

// Create singleton instance
const healthMonitor = new HealthMonitor();

module.exports = healthMonitor;
