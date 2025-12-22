const fs = require('fs');
const path = require('path');

/**
 * Security Audit Tool
 * Checks and reports security status
 */

class SecurityAudit {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];
  }

  // Check environment variables
  checkEnvironmentVariables() {
    const requiredEnvVars = [
      'JWT_SECRET',
      'MONGODB_URI',
      'SESSION_SECRET',
      'ENCRYPTION_KEY'
    ];

    const recommendedEnvVars = [
      'TWILIO_ACCOUNT_SID',
      'TWILIO_AUTH_TOKEN',
      'SENDGRID_API_KEY',
      'RAZORPAY_KEY_ID',
      'RAZORPAY_KEY_SECRET'
    ];

    requiredEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        this.issues.push(`Missing required environment variable: ${envVar}`);
      } else if (process.env[envVar].includes('your-') || process.env[envVar].length < 20) {
        this.warnings.push(`Weak ${envVar} detected. Use a strong random value.`);
      } else {
        this.passed.push(`${envVar} is properly configured`);
      }
    });

    recommendedEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        this.warnings.push(`Missing recommended environment variable: ${envVar}`);
      } else {
        this.passed.push(`${envVar} is configured`);
      }
    });
  }

  // Check file permissions
  checkFilePermissions() {
    const sensitiveFiles = [
      '.env',
      'config/security.js',
      'uploads/'
    ];

    sensitiveFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', file);
      if (fs.existsSync(filePath)) {
        try {
          const stats = fs.statSync(filePath);
          const mode = stats.mode.toString(8).slice(-3);
          
          if (mode === '777' || mode === '666') {
            this.issues.push(`Insecure permissions on ${file}: ${mode}`);
          } else {
            this.passed.push(`${file} has secure permissions`);
          }
        } catch (error) {
          this.warnings.push(`Could not check permissions for ${file}`);
        }
      }
    });
  }

  // Check dependencies
  checkDependencies() {
    try {
      const packageJson = require('../package.json');
      const securityPackages = [
        'helmet',
        'express-rate-limit',
        'express-mongo-sanitize',
        'xss-clean',
        'hpp',
        'bcryptjs',
        'jsonwebtoken'
      ];

      securityPackages.forEach(pkg => {
        if (packageJson.dependencies[pkg]) {
          this.passed.push(`Security package installed: ${pkg}`);
        } else {
          this.warnings.push(`Missing security package: ${pkg}`);
        }
      });
    } catch (error) {
      this.warnings.push('Could not check dependencies');
    }
  }

  // Check database security
  checkDatabaseSecurity() {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      this.issues.push('MongoDB URI not configured');
      return;
    }

    // Check if using default credentials
    if (mongoUri.includes('admin:admin') || mongoUri.includes('root:root')) {
      this.issues.push('Using default database credentials');
    } else {
      this.passed.push('Database credentials appear secure');
    }

    // Check if using localhost in production
    if (process.env.NODE_ENV === 'production' && mongoUri.includes('localhost')) {
      this.warnings.push('Using localhost database in production');
    }

    // Check if using SSL
    if (process.env.NODE_ENV === 'production' && !mongoUri.includes('ssl=true')) {
      this.warnings.push('Database connection not using SSL in production');
    }
  }

  // Check JWT configuration
  checkJWTSecurity() {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      this.issues.push('JWT_SECRET not configured');
      return;
    }

    if (jwtSecret.length < 32) {
      this.issues.push('JWT_SECRET is too short (minimum 32 characters)');
    } else {
      this.passed.push('JWT_SECRET length is adequate');
    }

    if (jwtSecret.includes('your-') || jwtSecret === 'secret') {
      this.issues.push('JWT_SECRET is using default/weak value');
    }
  }

  // Check HTTPS configuration
  checkHTTPS() {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.FORCE_HTTPS !== 'true') {
        this.warnings.push('HTTPS not enforced in production');
      } else {
        this.passed.push('HTTPS is enforced');
      }
    }
  }

  // Check CORS configuration
  checkCORS() {
    const allowedOrigins = process.env.ALLOWED_ORIGINS;
    
    if (!allowedOrigins) {
      this.warnings.push('ALLOWED_ORIGINS not configured');
    } else if (allowedOrigins.includes('*')) {
      this.issues.push('CORS allows all origins (*)');
    } else {
      this.passed.push('CORS is properly configured');
    }
  }

  // Check rate limiting
  checkRateLimiting() {
    const rateLimitMax = process.env.RATE_LIMIT_MAX_REQUESTS;
    
    if (!rateLimitMax) {
      this.warnings.push('Rate limiting not configured');
    } else if (parseInt(rateLimitMax) > 1000) {
      this.warnings.push('Rate limit is very high');
    } else {
      this.passed.push('Rate limiting is configured');
    }
  }

  // Run all checks
  async runAudit() {
    console.log('[SECURITY] Running Security Audit...\n');

    this.checkEnvironmentVariables();
    this.checkFilePermissions();
    this.checkDependencies();
    this.checkDatabaseSecurity();
    this.checkJWTSecurity();
    this.checkHTTPS();
    this.checkCORS();
    this.checkRateLimiting();

    return this.generateReport();
  }

  // Generate report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        critical: this.issues.length,
        warnings: this.warnings.length,
        passed: this.passed.length,
        total: this.issues.length + this.warnings.length + this.passed.length
      },
      issues: this.issues,
      warnings: this.warnings,
      passed: this.passed,
      score: this.calculateScore(),
      recommendation: this.getRecommendation()
    };

    this.printReport(report);
    return report;
  }

  // Calculate security score
  calculateScore() {
    const total = this.issues.length + this.warnings.length + this.passed.length;
    if (total === 0) return 0;

    const score = ((this.passed.length - (this.issues.length * 2) - (this.warnings.length * 0.5)) / total) * 100;
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // Get recommendation
  getRecommendation() {
    const score = this.calculateScore();
    
    if (score >= 90) return 'Excellent! Your security is production-ready.';
    if (score >= 75) return 'Good security, but address warnings before production.';
    if (score >= 50) return 'Moderate security. Fix critical issues immediately.';
    return 'Poor security. Do NOT deploy to production!';
  }

  // Print report
  printReport(report) {
    console.log('═'.repeat(60));
    console.log('[SECURITY] SECURITY AUDIT REPORT');
    console.log('═'.repeat(60));
    console.log(`\n[SCORE] Security Score: ${report.score}/100`);
    console.log(`[TIP] Recommendation: ${report.recommendation}\n`);

    console.log('[SUMMARY]:');
    console.log(`   [CRITICAL] Critical Issues: ${report.summary.critical}`);
    console.log(`   [WARNING] Warnings: ${report.summary.warnings}`);
    console.log(`   [PASSED] Passed: ${report.summary.passed}\n`);

    if (report.issues.length > 0) {
      console.log('[CRITICAL] CRITICAL ISSUES:');
      report.issues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue}`);
      });
      console.log('');
    }

    if (report.warnings.length > 0) {
      console.log('[WARNING] WARNINGS:');
      report.warnings.forEach((warning, i) => {
        console.log(`   ${i + 1}. ${warning}`);
      });
      console.log('');
    }

    if (report.passed.length > 0 && report.passed.length <= 5) {
      console.log('[PASSED] PASSED CHECKS:');
      report.passed.forEach((pass, i) => {
        console.log(`   ${i + 1}. ${pass}`);
      });
      console.log('');
    } else if (report.passed.length > 5) {
      console.log(`[PASSED] ${report.passed.length} checks passed\n`);
    }

    console.log('═'.repeat(60));
  }
}

module.exports = SecurityAudit;
