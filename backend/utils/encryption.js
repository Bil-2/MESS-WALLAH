const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

class EncryptionService {
  constructor() {
    this.secretKey = process.env.ENCRYPTION_KEY || this.generateKey();
  }

  // Generate a secure encryption key
  generateKey() {
    return crypto.randomBytes(KEY_LENGTH);
  }

  // Encrypt sensitive data (payment info, personal data)
  encrypt(text) {
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipher(ALGORITHM, this.secretKey);
      cipher.setAAD(Buffer.from('MESS_WALLAH_SECURE', 'utf8'));
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      throw new Error('Encryption failed');
    }
  }

  // Decrypt sensitive data
  decrypt(encryptedData) {
    try {
      const { encrypted, iv, authTag } = encryptedData;
      const decipher = crypto.createDecipher(ALGORITHM, this.secretKey);
      
      decipher.setAAD(Buffer.from('MESS_WALLAH_SECURE', 'utf8'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  }

  // Hash passwords securely
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  // Verify password
  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Generate secure random tokens
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Create HMAC for data integrity
  createHMAC(data, secret = this.secretKey) {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  // Verify HMAC
  verifyHMAC(data, signature, secret = this.secretKey) {
    const expectedSignature = this.createHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  // Encrypt payment data specifically
  encryptPaymentData(paymentInfo) {
    const sensitiveFields = ['cardNumber', 'cvv', 'bankAccount'];
    const encrypted = { ...paymentInfo };
    
    sensitiveFields.forEach(field => {
      if (encrypted[field]) {
        encrypted[field] = this.encrypt(encrypted[field].toString());
      }
    });
    
    return encrypted;
  }

  // Decrypt payment data
  decryptPaymentData(encryptedPaymentInfo) {
    const sensitiveFields = ['cardNumber', 'cvv', 'bankAccount'];
    const decrypted = { ...encryptedPaymentInfo };
    
    sensitiveFields.forEach(field => {
      if (decrypted[field] && typeof decrypted[field] === 'object') {
        decrypted[field] = this.decrypt(decrypted[field]);
      }
    });
    
    return decrypted;
  }

  // Generate secure payment session
  generatePaymentSession(userId, amount, currency = 'INR') {
    const sessionData = {
      userId,
      amount,
      currency,
      timestamp: Date.now(),
      nonce: this.generateSecureToken(16)
    };
    
    const sessionString = JSON.stringify(sessionData);
    const signature = this.createHMAC(sessionString);
    
    return {
      sessionId: this.generateSecureToken(32),
      data: this.encrypt(sessionString),
      signature,
      expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
    };
  }

  // Verify payment session
  verifyPaymentSession(session) {
    try {
      // Check expiration
      if (Date.now() > session.expiresAt) {
        throw new Error('Payment session expired');
      }
      
      // Decrypt and verify data
      const decryptedData = this.decrypt(session.data);
      const isValid = this.verifyHMAC(decryptedData, session.signature);
      
      if (!isValid) {
        throw new Error('Payment session tampered');
      }
      
      return JSON.parse(decryptedData);
    } catch (error) {
      throw new Error('Invalid payment session');
    }
  }

  // Sanitize and validate payment data
  sanitizePaymentData(paymentData) {
    const sanitized = {};
    
    // Remove any script tags or malicious content
    Object.keys(paymentData).forEach(key => {
      if (typeof paymentData[key] === 'string') {
        sanitized[key] = paymentData[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/[<>]/g, '')
          .trim();
      } else {
        sanitized[key] = paymentData[key];
      }
    });
    
    return sanitized;
  }

  // Mask sensitive data for logging
  maskSensitiveData(data) {
    const masked = { ...data };
    const sensitiveFields = ['cardNumber', 'cvv', 'password', 'bankAccount', 'aadhaar', 'pan'];
    
    sensitiveFields.forEach(field => {
      if (masked[field]) {
        const value = masked[field].toString();
        if (field === 'cardNumber') {
          masked[field] = value.replace(/\d(?=\d{4})/g, '*');
        } else if (field === 'cvv') {
          masked[field] = '***';
        } else {
          masked[field] = '*'.repeat(value.length);
        }
      }
    });
    
    return masked;
  }
}

module.exports = new EncryptionService();
