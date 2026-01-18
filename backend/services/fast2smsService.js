const axios = require('axios');

/**
 * Send OTP via Fast2SMS (Indian SMS Provider)
 * @param {string} phone - Phone number (must be 10 digits for Fast2SMS usually, or handled automatically)
 * @param {string} otp - The 6-digit OTP code to send
 * @returns {Promise<Object>} - Result of the operation
 */
const sendFast2SMS = async (phone, otp) => {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey) {
      console.log('[Fast2SMS] API Key missing');
      return { success: false, error: 'API Configuration Missing' };
    }

    // Clean phone number (ensure 10 digits for Fast2SMS)
    const cleanPhone = phone.toString().replace(/\D/g, '').slice(-10);

    const options = {
      method: 'GET',
      url: 'https://www.fast2sms.com/dev/bulkV2',
      params: {
        authorization: apiKey,
        variables_values: otp,
        route: 'otp',
        numbers: cleanPhone
      }
    };

    console.log(`[Fast2SMS] Sending OTP ${otp} to ${cleanPhone}...`);
    const response = await axios.request(options);

    console.log('[Fast2SMS] Response:', response.data);

    if (response.data && response.data.return) {
      return {
        success: true,
        message: 'OTP sent via Fast2SMS',
        provider: 'Fast2SMS'
      };
    } else {
      return {
        success: false,
        error: response.data.message || 'Fast2SMS Failed',
        provider: 'Fast2SMS'
      };
    }

  } catch (error) {
    console.error('[Fast2SMS] Error:', error.message);
    return {
      success: false,
      error: error.message,
      provider: 'Fast2SMS'
    };
  }
};

module.exports = { sendFast2SMS };
