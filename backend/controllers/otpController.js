const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendMessWallahOTP, verifyMessWallahOTP, formatPhoneNumber } = require('../services/twilioVerifyService');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to mobile number
const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate phone number
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    // Check rate limiting - max 3 OTPs per phone per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOtps = await Otp.countDocuments({
      phone,
      createdAt: { $gte: oneHourAgo }
    });

    if (recentOtps >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after 1 hour.',
        retryAfter: 3600
      });
    }

    // Use Twilio Verify service (more reliable)
    const verifyResult = await sendMessWallahOTP(formattedPhone);

    if (!verifyResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.',
        error: verifyResult.error
      });
    }

    // Save verification attempt to database for tracking
    const otpRecord = new Otp({
      phone: formattedPhone,
      codeHash: 'twilio_verify', // Using Twilio Verify, no need to store hash
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0,
      verificationSid: verifyResult.sid
    });
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully via Twilio Verify',
      data: {
        phone: formattedPhone,
        expiresIn: 10, // minutes
        method: 'SMS',
        status: verifyResult.status,
        sid: verifyResult.sid,
        canResendAfter: 60 // seconds
      }
    });

  } catch (error) {
    console.error('❌ Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify OTP and login user
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Validate input
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    // Verify OTP using Twilio Verify service
    const verifyResult = await verifyMessWallahOTP(formattedPhone, otp);

    if (!verifyResult.success) {
      return res.status(400).json({
        success: false,
        message: verifyResult.message || 'Invalid or expired OTP',
        error: verifyResult.error
      });
    }

    // Find and clean up OTP record
    const existingOtp = await Otp.findOne({ phone: formattedPhone });
    if (existingOtp) {
      await Otp.deleteOne({ _id: existingOtp._id });
    }

    // OTP verification successful - find or create user
    let user = await User.findOne({ phone: formattedPhone });
    
    if (!user) {
      // Create new user with phone number
      user = new User({
        phone: formattedPhone,
        name: `User${formattedPhone.slice(-4)}`, // Default name
        role: 'user',
        isPhoneVerified: true,
        registrationMethod: 'otp'
      });
      await user.save();
      console.log(`✅ New user created via OTP: ${formattedPhone}`);
    } else {
      // Update existing user
      user.isPhoneVerified = true;
      user.lastLogin = new Date();
      await user.save();
    }

    // OTP record already cleaned up above

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        phone: user.phone,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          isPhoneVerified: user.isPhoneVerified,
          isNewUser: !user.email // If no email, likely new user
        },
        token
      }
    });

  } catch (error) {
    console.error('❌ Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Check if user can resend (60 seconds cooldown)
    const existingOtp = await Otp.findOne({ phone });
    if (existingOtp) {
      const timeSinceCreated = Date.now() - existingOtp.createdAt.getTime();
      const cooldownPeriod = 60 * 1000; // 60 seconds

      if (timeSinceCreated < cooldownPeriod) {
        const remainingTime = Math.ceil((cooldownPeriod - timeSinceCreated) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingTime} seconds before requesting a new OTP`,
          retryAfter: remainingTime
        });
      }
    }

    // Use the same sendOtp logic
    return sendOtp(req, res);

  } catch (error) {
    console.error('❌ Resend OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  resendOtp
};
