const crypto = require('crypto');
const validator = require('validator');
const rateLimit = require('express-rate-limit');

class SecurityUtils {
  // Generate secure random strings
  static generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate secure session ID
  static generateSessionId() {
    return crypto.randomBytes(32).toString('base64url');
  }

  // Validate and sanitize email
  static validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email is required' };
    }

    const sanitized = validator.normalizeEmail(email, {
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false
    });

    if (!sanitized || !validator.isEmail(sanitized)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\+.*script/i,
      /javascript:/i,
      /<.*>/,
      /\.\./
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(sanitized))) {
      return { isValid: false, error: 'Email contains suspicious content' };
    }

    return { isValid: true, email: sanitized };
  }

  // Validate phone number (Indian format)
  static validatePhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') {
      return { isValid: false, error: 'Phone number is required' };
    }

    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');

    // Indian mobile number validation
    const indianMobileRegex = /^[6-9]\d{9}$/;
    const indianMobileWithCountryCode = /^91[6-9]\d{9}$/;

    let validNumber = null;

    if (indianMobileRegex.test(cleaned)) {
      validNumber = cleaned;
    } else if (indianMobileWithCountryCode.test(cleaned)) {
      validNumber = cleaned.substring(2); // Remove country code
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      const withoutCountryCode = cleaned.substring(2);
      if (indianMobileRegex.test(withoutCountryCode)) {
        validNumber = withoutCountryCode;
      }
    }

    if (!validNumber) {
      return { isValid: false, error: 'Invalid Indian mobile number' };
    }

    return { isValid: true, phone: validNumber };
  }

  // Validate password strength
  static validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return { isValid: false, error: 'Password is required' };
    }

    const minLength = 8;
    const maxLength = 128;

    if (password.length < minLength) {
      return { isValid: false, error: `Password must be at least ${minLength} characters` };
    }

    if (password.length > maxLength) {
      return { isValid: false, error: `Password must be less than ${maxLength} characters` };
    }

    // Check for required character types
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const requirements = [];
    if (!hasLowercase) requirements.push('lowercase letter');
    if (!hasUppercase) requirements.push('uppercase letter');
    if (!hasNumbers) requirements.push('number');
    if (!hasSpecialChar) requirements.push('special character');

    if (requirements.length > 0) {
      return {
        isValid: false,
        error: `Password must contain at least one ${requirements.join(', ')}`
      };
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      return { isValid: false, error: 'Password is too common' };
    }

    // Check for sequential characters
    const hasSequential = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789)/i.test(password);
    
    if (hasSequential) {
      return { isValid: false, error: 'Password should not contain sequential characters' };
    }

    return { isValid: true, strength: this.calculatePasswordStrength(password) };
  }

  // Calculate password strength score
  static calculatePasswordStrength(password) {
    let score = 0;

    // Length bonus
    score += Math.min(password.length * 2, 20);

    // Character variety bonus
    if (/[a-z]/.test(password)) score += 5;
    if (/[A-Z]/.test(password)) score += 5;
    if (/\d/.test(password)) score += 5;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;

    // Penalty for common patterns
    if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
    if (/(?:abc|123|qwe)/i.test(password)) score -= 10; // Common sequences

    score = Math.max(0, Math.min(100, score));

    if (score < 30) return 'weak';
    if (score < 60) return 'medium';
    if (score < 80) return 'strong';
    return 'very-strong';
  }

  // Sanitize user input
  static sanitizeInput(input, options = {}) {
    if (typeof input !== 'string') return input;

    let sanitized = input;

    // Remove HTML tags unless explicitly allowed
    if (!options.allowHTML) {
      sanitized = sanitized.replace(/<[^>]*>/g, '');
    }

    // Remove script tags always
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    // Limit length if specified
    if (options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
    }

    return sanitized;
  }

  // Validate Indian Aadhaar number
  static validateAadhaar(aadhaar) {
    if (!aadhaar || typeof aadhaar !== 'string') {
      return { isValid: false, error: 'Aadhaar number is required' };
    }

    // Remove spaces and hyphens
    const cleaned = aadhaar.replace(/[\s-]/g, '');

    // Check if it's 12 digits
    if (!/^\d{12}$/.test(cleaned)) {
      return { isValid: false, error: 'Aadhaar must be 12 digits' };
    }

    // Verify checksum using Verhoeff algorithm
    const verhoeffTable = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    const permutationTable = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    let checksum = 0;
    for (let i = 0; i < cleaned.length; i++) {
      checksum = verhoeffTable[checksum][permutationTable[i % 8][parseInt(cleaned[i])]];
    }

    if (checksum !== 0) {
      return { isValid: false, error: 'Invalid Aadhaar number' };
    }

    return { isValid: true, aadhaar: cleaned };
  }

  // Validate Indian PAN number
  static validatePAN(pan) {
    if (!pan || typeof pan !== 'string') {
      return { isValid: false, error: 'PAN number is required' };
    }

    const cleaned = pan.toUpperCase().trim();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!panRegex.test(cleaned)) {
      return { isValid: false, error: 'Invalid PAN format' };
    }

    return { isValid: true, pan: cleaned };
  }

  // Generate secure OTP
  static generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < length; i++) {
      otp += digits[crypto.randomInt(0, digits.length)];
    }
    
    return otp;
  }

  // Hash sensitive data for logging
  static hashForLogging(data) {
    return crypto.createHash('sha256').update(data.toString()).digest('hex').substring(0, 8);
  }

  // Check if IP is suspicious
  static isSuspiciousIP(ip) {
    // This would typically check against a database of known malicious IPs
    // For now, we'll do basic checks
    
    // Check for private IP ranges (shouldn't be suspicious in most cases)
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[01])\./,
      /^192\.168\./,
      /^127\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/
    ];

    // These are generally not suspicious
    if (privateRanges.some(range => range.test(ip))) {
      return false;
    }

    // Add more sophisticated IP reputation checking here
    return false;
  }

  // Rate limit key generator
  static generateRateLimitKey(req, identifier = 'ip') {
    switch (identifier) {
      case 'ip':
        return req.ip;
      case 'user':
        return req.user?.id || req.ip;
      case 'session':
        return req.sessionID || req.ip;
      default:
        return req.ip;
    }
  }

  // Validate file upload
  static validateFileUpload(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
    } = options;

    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    // Check file size
    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit` 
      };
    }

    // Check MIME type
    if (!allowedTypes.includes(file.mimetype)) {
      return { 
        isValid: false, 
        error: `File type ${file.mimetype} is not allowed` 
      };
    }

    // Check file extension
    const ext = '.' + file.originalname.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return { 
        isValid: false, 
        error: `File extension ${ext} is not allowed` 
      };
    }

    // Check for suspicious file names
    const suspiciousPatterns = [
      /\.\./,
      /[<>:"|?*]/,
      /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(file.originalname))) {
      return { isValid: false, error: 'Suspicious file name detected' };
    }

    return { isValid: true };
  }
}

module.exports = SecurityUtils;
