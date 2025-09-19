const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class SecurityAuditLogger {
  constructor() {
    this.auditLogPath = path.join(__dirname, '../logs/security-audit.log');
    this.maxLogSize = 10 * 1024 * 1024; // 10MB
    this.maxLogFiles = 5;
  }

  // Log security events
  async logSecurityEvent(event, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      eventId: crypto.randomUUID(),
      event,
      severity: this.getSeverity(event),
      details: this.sanitizeLogData(details),
      source: 'MESS_WALLAH_API'
    };

    try {
      await this.writeLogEntry(logEntry);
      
      // Alert on critical events
      if (logEntry.severity === 'CRITICAL') {
        await this.sendSecurityAlert(logEntry);
      }
    } catch (error) {
      console.error('[AUDIT_LOG_ERROR]', error);
    }
  }

  // Determine event severity
  getSeverity(event) {
    const severityMap = {
      // Critical events
      'PAYMENT_FRAUD_DETECTED': 'CRITICAL',
      'MULTIPLE_FAILED_PAYMENTS': 'CRITICAL',
      'SUSPICIOUS_LOGIN_PATTERN': 'CRITICAL',
      'BRUTE_FORCE_ATTACK': 'CRITICAL',
      'SQL_INJECTION_ATTEMPT': 'CRITICAL',
      'XSS_ATTEMPT': 'CRITICAL',
      'UNAUTHORIZED_ADMIN_ACCESS': 'CRITICAL',
      
      // High severity
      'FAILED_LOGIN_ATTEMPT': 'HIGH',
      'PAYMENT_FAILURE': 'HIGH',
      'UNAUTHORIZED_API_ACCESS': 'HIGH',
      'SUSPICIOUS_FILE_UPLOAD': 'HIGH',
      'RATE_LIMIT_EXCEEDED': 'HIGH',
      
      // Medium severity
      'USER_REGISTRATION': 'MEDIUM',
      'PASSWORD_RESET_REQUEST': 'MEDIUM',
      'PROFILE_UPDATE': 'MEDIUM',
      'BOOKING_CREATED': 'MEDIUM',
      
      // Low severity
      'USER_LOGIN': 'LOW',
      'USER_LOGOUT': 'LOW',
      'SEARCH_QUERY': 'LOW'
    };

    return severityMap[event] || 'MEDIUM';
  }

  // Sanitize sensitive data in logs
  sanitizeLogData(data) {
    const sanitized = JSON.parse(JSON.stringify(data));
    
    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'cardNumber', 
      'cvv', 'pin', 'otp', 'ssn', 'aadhaar', 'pan'
    ];

    const sanitizeObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        } else if (typeof obj[key] === 'string') {
          const lowerKey = key.toLowerCase();
          if (sensitiveFields.some(field => lowerKey.includes(field))) {
            obj[key] = '***REDACTED***';
          }
        }
      }
    };

    sanitizeObject(sanitized);
    return sanitized;
  }

  // Write log entry to file
  async writeLogEntry(logEntry) {
    try {
      // Ensure log directory exists
      const logDir = path.dirname(this.auditLogPath);
      await fs.mkdir(logDir, { recursive: true });

      // Check log file size and rotate if necessary
      await this.rotateLogIfNeeded();

      // Write log entry
      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(this.auditLogPath, logLine, 'utf8');
    } catch (error) {
      console.error('[LOG_WRITE_ERROR]', error);
    }
  }

  // Rotate log files when they get too large
  async rotateLogIfNeeded() {
    try {
      const stats = await fs.stat(this.auditLogPath);
      
      if (stats.size > this.maxLogSize) {
        // Move current log to backup
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = `${this.auditLogPath}.${timestamp}`;
        
        await fs.rename(this.auditLogPath, backupPath);
        
        // Clean up old log files
        await this.cleanupOldLogs();
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('[LOG_ROTATION_ERROR]', error);
      }
    }
  }

  // Clean up old log files
  async cleanupOldLogs() {
    try {
      const logDir = path.dirname(this.auditLogPath);
      const files = await fs.readdir(logDir);
      
      const logFiles = files
        .filter(file => file.startsWith('security-audit.log.'))
        .map(file => ({
          name: file,
          path: path.join(logDir, file),
          time: fs.stat(path.join(logDir, file)).then(stats => stats.mtime)
        }));

      // Sort by modification time (newest first)
      const sortedFiles = await Promise.all(
        logFiles.map(async file => ({
          ...file,
          time: await file.time
        }))
      );
      
      sortedFiles.sort((a, b) => b.time - a.time);

      // Remove excess files
      if (sortedFiles.length > this.maxLogFiles) {
        const filesToDelete = sortedFiles.slice(this.maxLogFiles);
        
        for (const file of filesToDelete) {
          await fs.unlink(file.path);
        }
      }
    } catch (error) {
      console.error('[LOG_CLEANUP_ERROR]', error);
    }
  }

  // Send security alerts for critical events
  async sendSecurityAlert(logEntry) {
    try {
      // In production, this would send alerts via email, SMS, or monitoring service
      console.warn('[SECURITY_ALERT]', {
        event: logEntry.event,
        severity: logEntry.severity,
        timestamp: logEntry.timestamp,
        eventId: logEntry.eventId
      });

      // You could integrate with services like:
      // - SendGrid for email alerts
      // - Twilio for SMS alerts
      // - Slack webhooks
      // - PagerDuty for incident management
      // - Datadog/New Relic for monitoring
      
    } catch (error) {
      console.error('[SECURITY_ALERT_ERROR]', error);
    }
  }

  // Generate security report
  async generateSecurityReport(startDate, endDate) {
    try {
      const logs = await this.readLogEntries(startDate, endDate);
      
      const report = {
        period: {
          start: startDate,
          end: endDate
        },
        summary: {
          totalEvents: logs.length,
          criticalEvents: logs.filter(log => log.severity === 'CRITICAL').length,
          highEvents: logs.filter(log => log.severity === 'HIGH').length,
          mediumEvents: logs.filter(log => log.severity === 'MEDIUM').length,
          lowEvents: logs.filter(log => log.severity === 'LOW').length
        },
        topEvents: this.getTopEvents(logs),
        suspiciousIPs: this.getSuspiciousIPs(logs),
        failedLogins: this.getFailedLogins(logs),
        paymentIssues: this.getPaymentIssues(logs)
      };

      return report;
    } catch (error) {
      console.error('[SECURITY_REPORT_ERROR]', error);
      throw error;
    }
  }

  // Read log entries within date range
  async readLogEntries(startDate, endDate) {
    try {
      const logContent = await fs.readFile(this.auditLogPath, 'utf8');
      const lines = logContent.split('\n').filter(line => line.trim());
      
      const logs = lines
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(log => log !== null)
        .filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate >= startDate && logDate <= endDate;
        });

      return logs;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  // Get top security events
  getTopEvents(logs) {
    const eventCounts = {};
    
    logs.forEach(log => {
      eventCounts[log.event] = (eventCounts[log.event] || 0) + 1;
    });

    return Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([event, count]) => ({ event, count }));
  }

  // Get suspicious IP addresses
  getSuspiciousIPs(logs) {
    const ipCounts = {};
    
    logs
      .filter(log => log.severity === 'HIGH' || log.severity === 'CRITICAL')
      .forEach(log => {
        const ip = log.details.ip;
        if (ip) {
          ipCounts[ip] = (ipCounts[ip] || 0) + 1;
        }
      });

    return Object.entries(ipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));
  }

  // Get failed login attempts
  getFailedLogins(logs) {
    return logs
      .filter(log => log.event === 'FAILED_LOGIN_ATTEMPT')
      .map(log => ({
        timestamp: log.timestamp,
        ip: log.details.ip,
        email: log.details.email,
        reason: log.details.reason
      }));
  }

  // Get payment issues
  getPaymentIssues(logs) {
    return logs
      .filter(log => log.event.includes('PAYMENT'))
      .map(log => ({
        timestamp: log.timestamp,
        event: log.event,
        severity: log.severity,
        details: log.details
      }));
  }
}

module.exports = new SecurityAuditLogger();
