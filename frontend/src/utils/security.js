/**
 * FRONTEND SECURITY UTILITIES
 * Production-grade security for MESS WALLAH frontend
 */

// ============================================
// CSRF TOKEN MANAGEMENT
// ============================================
let csrfToken = null;

export const getCSRFToken = () => {
  // Try to get from cookie first
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrf-token') {
      csrfToken = value;
      return value;
    }
  }
  return csrfToken;
};

export const setCSRFToken = (token) => {
  csrfToken = token;
};

// ============================================
// INPUT SANITIZATION
// ============================================
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potential XSS vectors
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe/gi, '')
    .replace(/<object/gi, '')
    .replace(/<embed/gi, '')
    .trim();
};

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

// ============================================
// SECURE STORAGE
// ============================================
const STORAGE_PREFIX = 'mw_';

export const secureStorage = {
  set: (key, value, encrypt = false) => {
    try {
      const data = JSON.stringify({
        value,
        timestamp: Date.now(),
        encrypted: encrypt
      });
      localStorage.setItem(STORAGE_PREFIX + key, data);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  get: (key, maxAge = null) => {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      if (!data) return null;

      const parsed = JSON.parse(data);
      
      // Check if expired
      if (maxAge && Date.now() - parsed.timestamp > maxAge) {
        localStorage.removeItem(STORAGE_PREFIX + key);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.error('Storage retrieval error:', error);
      return null;
    }
  },

  remove: (key) => {
    localStorage.removeItem(STORAGE_PREFIX + key);
  },

  clear: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};

// ============================================
// TOKEN VALIDATION
// ============================================
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Decode JWT without verification (verification happens server-side)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

export const getTokenExpiry = (token) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch (error) {
    return null;
  }
};

// ============================================
// REQUEST SECURITY
// ============================================
export const generateIdempotencyKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const secureHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };

  const csrf = getCSRFToken();
  if (csrf) {
    headers['X-CSRF-Token'] = csrf;
  }

  return headers;
};

// ============================================
// PAYMENT SECURITY
// ============================================
export const validatePaymentAmount = (amount) => {
  const MIN_AMOUNT = 1; // ₹1
  const MAX_AMOUNT = 100000; // ₹1,00,000

  if (typeof amount !== 'number' || isNaN(amount)) {
    return { valid: false, error: 'Invalid amount' };
  }

  if (amount < MIN_AMOUNT) {
    return { valid: false, error: `Minimum amount is ₹${MIN_AMOUNT}` };
  }

  if (amount > MAX_AMOUNT) {
    return { valid: false, error: `Maximum amount is ₹${MAX_AMOUNT}` };
  }

  return { valid: true };
};

export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 4) return cleaned;
  return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
};

export const maskPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return cleaned;
  return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
};

// ============================================
// SESSION SECURITY
// ============================================
let lastActivity = Date.now();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const updateActivity = () => {
  lastActivity = Date.now();
};

export const checkSessionTimeout = () => {
  return Date.now() - lastActivity > SESSION_TIMEOUT;
};

export const setupActivityTracking = (onTimeout) => {
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  
  events.forEach(event => {
    document.addEventListener(event, updateActivity, { passive: true });
  });

  // Check for timeout every minute
  const intervalId = setInterval(() => {
    if (checkSessionTimeout()) {
      onTimeout?.();
    }
  }, 60000);

  return () => {
    events.forEach(event => {
      document.removeEventListener(event, updateActivity);
    });
    clearInterval(intervalId);
  };
};

// ============================================
// FORM VALIDATION
// ============================================
export const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  phone: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]/.test(cleaned);
  },

  password: (password) => {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/\d/.test(password)) errors.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('One special character');
    return { valid: errors.length === 0, errors };
  },

  otp: (otp) => {
    return /^\d{6}$/.test(otp);
  },

  name: (name) => {
    return name.trim().length >= 2 && name.trim().length <= 50;
  }
};

// ============================================
// ERROR HANDLING
// ============================================
export const handleSecurityError = (error) => {
  const errorCode = error?.response?.data?.code || error?.code;
  
  switch (errorCode) {
    case 'TOKEN_EXPIRED':
    case 'TOKEN_REVOKED':
    case 'INVALID_TOKEN':
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return 'Session expired. Please login again.';
    
    case 'ACCOUNT_LOCKED':
      return 'Account temporarily locked. Please try again later.';
    
    case 'FORBIDDEN':
      return 'You do not have permission to perform this action.';
    
    case 'RATE_LIMITED':
      return 'Too many requests. Please slow down.';
    
    default:
      return error?.response?.data?.message || 'An error occurred';
  }
};

export default {
  getCSRFToken,
  setCSRFToken,
  sanitizeInput,
  sanitizeObject,
  secureStorage,
  isTokenValid,
  getTokenExpiry,
  generateIdempotencyKey,
  secureHeaders,
  validatePaymentAmount,
  maskCardNumber,
  maskPhone,
  updateActivity,
  checkSessionTimeout,
  setupActivityTracking,
  validators,
  handleSecurityError
};
