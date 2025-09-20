const express = require('express');
const { sendMessWallahOTP, verifyMessWallahOTP, getVerifyServiceStatus, formatPhoneNumber } = require('../services/twilioVerifyService');
const router = express.Router();

// Test Twilio Verify OTP endpoint
router.post('/send-test-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Send OTP using Twilio Verify
    const result = await sendMessWallahOTP(formattedPhone);

    res.json({
      success: result.success,
      message: result.success ? 'Test OTP sent successfully' : 'OTP SMS failed to send',
      data: result
    });

  } catch (error) {
    console.error('Test OTP SMS error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test OTP SMS',
      error: error.message
    });
  }
});

// Test Twilio Verify OTP
router.post('/send-verify-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Send OTP using Twilio Verify
    const result = await sendMessWallahOTP(phoneNumber);

    res.json({
      success: result.success,
      message: result.success ? 'Verify OTP sent successfully' : 'Failed to send Verify OTP',
      data: result
    });

  } catch (error) {
    console.error('Test Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send Verify OTP',
      error: error.message
    });
  }
});

// Test Twilio Verify OTP verification
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and code are required'
      });
    }

    // Verify OTP using Twilio Verify
    const result = await verifyMessWallahOTP(phoneNumber, code);

    res.json({
      success: result.success,
      message: result.message,
      data: result
    });

  } catch (error) {
    console.error('Test Verify OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
});

// Get Twilio Verify service status
router.get('/verify-status', (req, res) => {
  const status = getVerifyServiceStatus();
  res.json({
    success: true,
    data: status
  });
});

// Get Twilio configuration status
router.get('/twilio-status', (req, res) => {
  const isConfigured = !!(
    process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_PHONE_NUMBER
  );

  res.json({
    success: true,
    data: {
      configured: isConfigured,
      accountSid: process.env.TWILIO_ACCOUNT_SID ? 'Set' : 'Not set',
      authToken: process.env.TWILIO_AUTH_TOKEN ? 'Set' : 'Not set',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER ? 'Set' : 'Not set',
      message: isConfigured ? 
        'Twilio is configured and ready to send SMS' : 
        'Twilio configuration incomplete. SMS will be simulated.'
    }
  });
});

module.exports = router;
