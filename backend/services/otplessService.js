// OTPless WhatsApp OTP Service — Free, 100 OTPs/day, no credit card
// Sign up at: https://otpless.com → Dashboard → API Keys → copy APP_ID + APP_SECRET

const https = require('https');

const OTPLESS_CLIENT_ID = process.env.OTPLESS_CLIENT_ID;
const OTPLESS_CLIENT_SECRET = process.env.OTPLESS_CLIENT_SECRET;

/**
 * Make a POST request to OTPless API
 */
const otplessRequest = (path, body) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const options = {
      hostname: 'auth.otpless.app',
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'clientId': OTPLESS_CLIENT_ID,
        'clientSecret': OTPLESS_CLIENT_SECRET,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          reject(new Error('Failed to parse OTPless response'));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

/**
 * Send OTP via WhatsApp (falls back to SMS automatically)
 * @param {string} phone - Indian phone in format +91XXXXXXXXXX
 * @returns {Promise<{success, requestId, message}>}
 */
const sendOtpWhatsApp = async (phone) => {
  if (!OTPLESS_CLIENT_ID || !OTPLESS_CLIENT_SECRET) {
    console.warn('[OTPless] Credentials not set, using dev mode (OTP: 123456)');
    return { success: true, requestId: 'DEV_' + Date.now(), dev: true };
  }

  // Ensure phone has +91 prefix
  const phoneNumber = phone.startsWith('+') ? phone : `+91${phone}`;

  try {
    const res = await otplessRequest('/auth/v1/initiate/otp', {
      phoneNumber,
      channel: 'WHATSAPP',
    });

    console.log('[OTPless] Send response:', res.status, res.body);

    if (res.status === 200 && res.body.success !== false) {
      return {
        success: true,
        requestId: res.body.requestId || res.body.orderId,
        message: 'OTP sent via WhatsApp',
      };
    }

    return {
      success: false,
      message: res.body.message || res.body.errorMessage || 'OTPless send failed',
    };
  } catch (err) {
    console.error('[OTPless] Send error:', err.message);
    return { success: false, message: 'Failed to send OTP' };
  }
};

/**
 * Verify the OTP entered by user
 * @param {string} requestId - from sendOtpWhatsApp
 * @param {string} otp - 6-digit code
 * @param {string} phone - user's phone number
 */
const verifyOtpWhatsApp = async (requestId, otp, phone) => {
  // Dev mode bypass
  if (requestId && requestId.startsWith('DEV_')) {
    if (otp === '123456') {
      return { success: true, phone, dev: true };
    }
    return { success: false, message: 'DEV mode: use OTP 123456' };
  }

  if (!OTPLESS_CLIENT_ID || !OTPLESS_CLIENT_SECRET) {
    return { success: false, message: 'OTPless not configured' };
  }

  const phoneNumber = phone.startsWith('+') ? phone : `+91${phone}`;

  try {
    const res = await otplessRequest('/auth/v1/verify/otp', {
      requestId,
      otp,
      phoneNumber,
    });

    console.log('[OTPless] Verify response:', res.status, res.body);

    if (res.status === 200 && res.body.success !== false) {
      return {
        success: true,
        phone: res.body.waId || phoneNumber,
        token: res.body.token,
      };
    }

    return {
      success: false,
      message: res.body.message || res.body.errorMessage || 'Invalid OTP',
    };
  } catch (err) {
    console.error('[OTPless] Verify error:', err.message);
    return { success: false, message: 'Verification failed' };
  }
};

module.exports = { sendOtpWhatsApp, verifyOtpWhatsApp };
