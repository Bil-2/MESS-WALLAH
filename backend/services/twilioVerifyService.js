const twilio = require('twilio');

// Initialize Twilio client
let client = null;
let verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  console.log('[TWILIO] Client initialized');
}

// Format phone number to E.164 format
const formatPhoneNumber = (phone) => {
  if (!phone) return null;

  // Remove all non-digit characters
  let cleaned = phone.toString().replace(/\D/g, '');

  // If it starts with 0, remove it
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // If it doesn't start with 91 (India code) and length is 10, add 91
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }

  return '+' + cleaned;
};

// Send OTP via Twilio Verify
const sendMessWallahOTP = async (phoneNumber) => {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Development fallback if no credentials
    if (!client || !verifyServiceSid) {
      console.log('[TWILIO] Missing credentials, using DEV mode');
      // In a real implementation, we might generate a code here if not using Verify API
      // But based on controller logic, we just return a success/dev response
      return {
        success: true,
        sid: 'FALLBACK_DEV_' + Date.now(),
        status: 'pending'
      };
    }

    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: formattedPhone, channel: 'sms' });

    return {
      success: true,
      sid: verification.sid,
      status: verification.status
    };

  } catch (error) {
    console.error('[TWILIO] Send OTP Error:', error.message);
    // Return error but allow controller to handle fallback
    return {
      success: false,
      error: error.message,
      sid: 'FALLBACK_ERROR_' + Date.now()
    };
  }
};

// Verify OTP via Twilio Verify
const verifyMessWallahOTP = async (phoneNumber, code) => {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Development fallback
    if (!client || !verifyServiceSid) {
      // In dev mode, we might want to accept a specific test code like '123456'
      // or if the controller handles verification itself. 
      // Checking otpController.js, it seems to rely on this service for the actual check.

      // For dev/testing purposes, let's allow a magic code
      if (code === '123456') {
        return { success: true, status: 'approved' };
      }
      return { success: false, status: 'failed', error: 'Dev mode: Use 123456' };
    }

    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({ to: formattedPhone, code });

    if (verificationCheck.status === 'approved') {
      return { success: true, status: 'approved' };
    } else {
      return { success: false, status: 'pending' };
    }

  } catch (error) {
    console.error('[TWILIO] Verify OTP Error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  formatPhoneNumber,
  sendMessWallahOTP,
  verifyMessWallahOTP
};
