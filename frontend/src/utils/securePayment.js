import axios from 'axios';
import CryptoJS from 'crypto-js';

class SecurePaymentService {
  constructor() {
    this.api = axios.create({
      baseURL: '/api/payments',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for security
    this.api.interceptors.request.use(
      (config) => {
        // Add CSRF token
        const csrfToken = this.getCSRFToken();
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }

        // Add timestamp for request validation
        config.headers['X-Timestamp'] = Date.now();

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 429) {
          throw new Error('Too many payment attempts. Please try again later.');
        }
        if (error.response?.status === 403) {
          throw new Error('Payment session expired. Please refresh and try again.');
        }
        throw error;
      }
    );
  }

  // Get CSRF token from meta tag or cookie
  getCSRFToken() {
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) return metaToken;

    // Fallback to cookie
    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrf-token='));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
  }

  // Generate secure payment session
  async createPaymentSession(bookingData) {
    try {
      // Validate booking data
      this.validateBookingData(bookingData);

      // Create payment session
      const response = await this.api.post('/session', {
        bookingId: bookingData.bookingId,
        amount: bookingData.amount,
        currency: bookingData.currency || 'INR',
        paymentMethod: bookingData.paymentMethod
      });

      return response.data;
    } catch (error) {
      console.error('[PAYMENT_SESSION_ERROR]', error);
      throw this.handlePaymentError(error);
    }
  }

  // Process secure payment with Razorpay
  async processPayment(paymentData) {
    try {
      // Load Razorpay script dynamically
      await this.loadRazorpayScript();

      return new Promise((resolve, reject) => {
        const options = {
          key: paymentData.razorpayKeyId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          order_id: paymentData.razorpayOrderId,
          name: 'MESS WALLAH',
          description: 'Room Booking Payment',
          image: '/logo192.png',
          handler: async (response) => {
            try {
              // Verify payment on backend
              const verification = await this.verifyPayment({
                ...response,
                bookingId: paymentData.bookingId,
                sessionId: paymentData.sessionId
              });
              resolve(verification);
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name: paymentData.userDetails?.name || '',
            email: paymentData.userDetails?.email || '',
            contact: paymentData.userDetails?.phone || ''
          },
          notes: {
            bookingId: paymentData.bookingId,
            sessionId: paymentData.sessionId
          },
          theme: {
            color: '#f97316'
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled by user'));
            }
          },
          retry: {
            enabled: true,
            max_count: 3
          }
        };

        const razorpay = new window.Razorpay(options);
        
        // Handle payment failures
        razorpay.on('payment.failed', (response) => {
          reject(new Error(`Payment failed: ${response.error.description}`));
        });

        razorpay.open();
      });
    } catch (error) {
      console.error('[PAYMENT_PROCESSING_ERROR]', error);
      throw this.handlePaymentError(error);
    }
  }

  // Verify payment with backend
  async verifyPayment(paymentResponse) {
    try {
      const response = await this.api.post('/process', paymentResponse);
      return response.data;
    } catch (error) {
      console.error('[PAYMENT_VERIFICATION_ERROR]', error);
      throw this.handlePaymentError(error);
    }
  }

  // Check payment status
  async checkPaymentStatus(bookingId) {
    try {
      const response = await this.api.get(`/verify/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('[PAYMENT_STATUS_ERROR]', error);
      throw this.handlePaymentError(error);
    }
  }

  // Request refund
  async requestRefund(refundData) {
    try {
      this.validateRefundData(refundData);

      const response = await this.api.post('/refund', {
        bookingId: refundData.bookingId,
        reason: refundData.reason,
        amount: refundData.amount
      });

      return response.data;
    } catch (error) {
      console.error('[REFUND_REQUEST_ERROR]', error);
      throw this.handlePaymentError(error);
    }
  }

  // Load Razorpay script securely
  loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      // Add integrity check for security
      script.integrity = 'sha384-...'; // Add actual integrity hash
      
      script.onload = () => {
        if (window.Razorpay) {
          resolve();
        } else {
          reject(new Error('Razorpay script failed to load'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load payment gateway'));
      };

      document.head.appendChild(script);
    });
  }

  // Validate booking data
  validateBookingData(data) {
    const required = ['bookingId', 'amount'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    if (data.amount <= 0 || data.amount > 100000) {
      throw new Error('Invalid payment amount');
    }

    if (data.currency && !['INR', 'USD'].includes(data.currency)) {
      throw new Error('Unsupported currency');
    }
  }

  // Validate refund data
  validateRefundData(data) {
    const required = ['bookingId', 'reason'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    if (data.amount && (data.amount <= 0 || data.amount > 100000)) {
      throw new Error('Invalid refund amount');
    }
  }

  // Handle payment errors
  handlePaymentError(error) {
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }
    
    if (error.message) {
      return new Error(error.message);
    }
    
    return new Error('Payment processing failed. Please try again.');
  }

  // Encrypt sensitive data before sending
  encryptSensitiveData(data, key) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    } catch (error) {
      console.error('[ENCRYPTION_ERROR]', error);
      throw new Error('Data encryption failed');
    }
  }

  // Decrypt sensitive data
  decryptSensitiveData(encryptedData, key) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('[DECRYPTION_ERROR]', error);
      throw new Error('Data decryption failed');
    }
  }

  // Generate secure payment fingerprint
  generatePaymentFingerprint(paymentData) {
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${screen.width}x${screen.height}`,
      timestamp: Date.now()
    };

    return CryptoJS.SHA256(JSON.stringify(fingerprint)).toString();
  }

  // Validate payment environment
  validatePaymentEnvironment() {
    // Check if running in secure context
    if (!window.isSecureContext) {
      throw new Error('Payments require a secure connection (HTTPS)');
    }

    // Check for required browser features
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Browser does not support required security features');
    }

    // Check if third-party cookies are enabled (required for payment gateways)
    if (navigator.cookieEnabled === false) {
      throw new Error('Cookies must be enabled for payments');
    }
  }

  // Clear sensitive data from memory
  clearSensitiveData() {
    // Clear any cached payment data
    if (this.paymentCache) {
      this.paymentCache.clear();
    }

    // Clear form data
    const paymentForms = document.querySelectorAll('form[data-payment-form]');
    paymentForms.forEach(form => form.reset());
  }

  // Log security events
  logSecurityEvent(event, details) {
    const logData = {
      event,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Send to security monitoring endpoint
    fetch('/api/security/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logData)
    }).catch(error => {
      console.warn('[SECURITY_LOG_ERROR]', error);
    });
  }
}

// Export singleton instance
export default new SecurePaymentService();
