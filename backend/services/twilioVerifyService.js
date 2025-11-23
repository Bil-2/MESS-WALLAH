const twilio = require('twilio');
require('dotenv').config();

// Initialize Twilio client with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
let verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

let twilioClient = null;

const initializeTwilioVerify = async () => {
  try {
    if (!accountSid || !authToken) {
      console.log('[WARNING] Twilio credentials missing, using fallback');
      return false;
    }

    twilioClient = twilio(accountSid, authToken);

    // Try to find or create a Verify service
    try {
      // First, try to list existing services
      const services = await twilioClient.verify.v2.services.list({ limit: 10 });

      if (services.length > 0) {
        // Use the first available service
        verifyServiceSid = services[0].sid;
        console.log('[SUCCESS] Using existing Verify service:', verifyServiceSid);
      } else {
        // Create a new Verify service
        const service = await twilioClient.verify.v2.services.create({
          friendlyName: 'MESS WALLAH Verification',
          codeLength: 6
        });
        verifyServiceSid = service.sid;
        console.log('[SUCCESS] Created new Verify service:', verifyServiceSid);
      }
    } catch (serviceError) {
      console.log('[WARNING] Verify service error, trying direct SMS:', serviceError.message);
      // If Verify service fails, we'll use direct SMS
      verifyServiceSid = null;
    }

    console.log('[SUCCESS] Twilio service initialized');
    return true;
  } catch (error) {
    console.error('[ERROR] Failed to initialize Twilio:', error.message);
    return false;
  }
};

// Initialize on module load
let isInitialized = false;
initializeTwilioVerify().then(result => {
  isInitialized = result;
  if (result) {
    console.log('[SUCCESS] Twilio Verify service ready for real SMS');
  }
}).catch(error => {
  console.error('Failed to initialize Twilio Verify on startup:', error);
  isInitialized = false;
});

/**
 * Send OTP verification using Twilio Verify API
 * @param {string} phoneNumber - Phone number with country code (+919064789125)
 * @param {string} channel - Verification channel ('sms' or 'call')
 * @returns {Promise<Object>} - Verification result
 */
const sendVerificationOTP = async (phoneNumber, channel = 'sms') => {
  try {
    if (!isInitialized || !twilioClient) {
      console.log('[INFO] Twilio not initialized, using development OTP');
      return {
        success: true,
        sid: 'DEV_' + Date.now(),
        status: 'pending',
        to: phoneNumber,
        channel: channel,
        message: 'Development OTP: Use 123456'
      };
    }

    // Try Verify service first
    if (verifyServiceSid) {
      try {
        const verification = await twilioClient.verify.v2
          .services(verifyServiceSid)
          .verifications
          .create({
            to: phoneNumber,
            channel: channel
          });

        console.log('[SUCCESS] Verification OTP sent via Verify service:', {
          sid: verification.sid,
          to: phoneNumber,
          status: verification.status
        });

        return {
          success: true,
          sid: verification.sid,
          status: verification.status,
          to: verification.to,
          channel: verification.channel,
          dateCreated: verification.dateCreated,
          message: 'OTP sent successfully via Verify service'
        };
      } catch (verifyError) {
        console.log('[WARNING] Verify service failed, trying direct SMS:', verifyError.message);
      }
    }

    // Fallback to direct SMS
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const message = await twilioClient.messages.create({
      body: `Your MESS WALLAH verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`,
      from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
      to: phoneNumber
    });

    console.log('[SUCCESS] Direct SMS sent successfully:', {
      sid: message.sid,
      to: phoneNumber,
      otp: otp
    });

    // Store OTP for verification (in production, use encrypted storage)
    global.otpStore = global.otpStore || {};
    global.otpStore[phoneNumber] = {
      otp: otp,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    return {
      success: true,
      sid: message.sid,
      status: 'sent',
      to: phoneNumber,
      channel: 'sms',
      message: 'OTP sent successfully via direct SMS',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    };

  } catch (error) {
    console.error('[ERROR] All OTP methods failed:', {
      error: error.message,
      code: error.code,
      to: phoneNumber
    });

    return {
      success: false,
      error: error.message,
      code: error.code,
      to: phoneNumber
    };
  }
};

/**
 * Verify OTP code using Twilio Verify API
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} code - OTP code entered by user
 * @returns {Promise<Object>} - Verification check result
 */
const verifyOTPCode = async (phoneNumber, code) => {
  try {
    if (!isInitialized || !twilioClient) {
      console.log('[INFO] Twilio not initialized - STRICT MODE: No fallback OTP');
      console.log('🚫 Rejecting all OTP codes when Twilio is not available');
      return {
        success: false,
        status: 'failed',
        to: phoneNumber,
        message: 'OTP verification service unavailable. Only real SMS OTP codes are accepted.'
      };
    }

    // Try Verify service first
    if (verifyServiceSid) {
      try {
        const verificationCheck = await twilioClient.verify.v2
          .services(verifyServiceSid)
          .verificationChecks
          .create({
            to: phoneNumber,
            code: code
          });

        console.log('[SUCCESS] Verify service verification result:', {
          sid: verificationCheck.sid,
          to: phoneNumber,
          status: verificationCheck.status,
          valid: verificationCheck.valid
        });

        return {
          success: verificationCheck.status === 'approved',
          sid: verificationCheck.sid,
          status: verificationCheck.status,
          valid: verificationCheck.valid,
          to: verificationCheck.to,
          channel: verificationCheck.channel,
          dateCreated: verificationCheck.dateCreated,
          message: verificationCheck.status === 'approved' ?
            'Code verified successfully' : 'Invalid or expired code'
        };
      } catch (verifyError) {
        console.log('[WARNING] Verify service check failed, trying direct verification:', verifyError.message);
      }
    }

    // STRICT MODE: No fallback OTP verification
    console.log('🚫 STRICT MODE: No fallback OTP verification allowed');
    console.log('[INFO] Only Twilio Verify service OTP codes are accepted');

    return {
      success: false,
      status: 'failed',
      to: phoneNumber,
      message: 'Only real SMS OTP codes from Twilio Verify service are accepted'
    };

  } catch (error) {
    console.error('[ERROR] OTP verification failed:', {
      error: error.message,
      code: error.code,
      to: phoneNumber
    });

    return {
      success: false,
      error: error.message,
      code: error.code,
      to: phoneNumber,
      message: 'Verification failed'
    };
  }
};

/**
 * Send OTP for MESS WALLAH authentication
 * @param {string} phoneNumber - Phone number with country code
 * @returns {Promise<Object>} - Send result
 */
const sendMessWallahOTP = async (phoneNumber) => {
  console.log(`🔐 Sending MESS WALLAH OTP to: ${phoneNumber}`);

  // Try to create a custom verification with better message
  try {
    if (!isInitialized || !twilioClient) {
      console.log('[INFO] Twilio Verify not initialized, using fallback');
      return {
        success: true,
        sid: 'FALLBACK_' + Date.now(),
        status: 'pending',
        to: phoneNumber,
        channel: 'sms',
        message: 'OTP sent via fallback method'
      };
    }

    // Send verification using Twilio Verify
    const verification = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verifications
      .create({
        to: phoneNumber,
        channel: 'sms'
      });

    console.log('[SUCCESS] MESS WALLAH OTP sent successfully:', {
      sid: verification.sid,
      to: phoneNumber,
      status: verification.status,
      channel: verification.channel
    });

    return {
      success: true,
      sid: verification.sid,
      status: verification.status,
      to: verification.to,
      channel: verification.channel,
      dateCreated: verification.dateCreated,
      message: 'Professional OTP sent successfully'
    };

  } catch (error) {
    console.error(`[ERROR] Failed to send MESS WALLAH OTP to ${phoneNumber}:`, error.message);
    return {
      success: false,
      error: error.message,
      to: phoneNumber
    };
  }
};

/**
 * Verify OTP for MESS WALLAH authentication
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} otpCode - OTP code entered by user
 * @returns {Promise<Object>} - Verification result
 */
const verifyMessWallahOTP = async (phoneNumber, otpCode) => {
  console.log(`[DEBUG] Verifying MESS WALLAH OTP for: ${phoneNumber}`);

  const result = await verifyOTPCode(phoneNumber, otpCode);

  if (result.success) {
    console.log(`[SUCCESS] MESS WALLAH OTP verified for ${phoneNumber}`);
  } else {
    console.error(`[ERROR] MESS WALLAH OTP verification failed for ${phoneNumber}:`, result.error);
  }

  return result;
};

/**
 * Format phone number to international format
 * @param {string} phoneNumber - Phone number
 * @param {string} countryCode - Country code (default: +91 for India)
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phoneNumber, countryCode = '+91') => {
  // Remove any non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');

  // If number already starts with country code, return as is
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }

  // For Indian numbers, remove leading 0 if present
  if (countryCode === '+91' && cleanNumber.startsWith('0')) {
    return countryCode + cleanNumber.substring(1);
  }

  // Add country code
  return countryCode + cleanNumber;
};

/**
 * Get verification service status
 * @returns {Object} - Service status
 */
const getVerifyServiceStatus = () => {
  return {
    initialized: isInitialized,
    accountSid: accountSid ? 'Set' : 'Not set',
    authToken: authToken ? 'Set' : 'Not set',
    verifyServiceSid: verifyServiceSid ? 'Set' : 'Not set',
    message: isInitialized ?
      'Twilio Verify service is ready' :
      'Twilio Verify service not initialized'
  };
};

module.exports = {
  sendVerificationOTP,
  verifyOTPCode,
  sendMessWallahOTP,
  verifyMessWallahOTP,
  formatPhoneNumber,
  getVerifyServiceStatus,
  initializeTwilioVerify
};
