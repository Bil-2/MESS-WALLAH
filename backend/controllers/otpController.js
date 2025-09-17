const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// SMS Service Integration
const sendSMS = async (phone, message) => {
  try {
    // Check if Twilio is configured
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE,
        to: `+91${phone}`
      });
      
      console.log(`✅ SMS sent to +91${phone}`);
      return { success: true, method: 'SMS' };
    } else {
      // Development mode - log to console
      console.log(`📱 DEV MODE - OTP for +91${phone}: ${message}`);
      return { success: true, method: 'CONSOLE' };
    }
  } catch (error) {
    console.error('❌ SMS sending failed:', error.message);
    // Fallback to console in case of SMS failure
    console.log(`📱 FALLBACK - OTP for +91${phone}: ${message}`);
    return { success: true, method: 'FALLBACK' };
  }
};

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

    // Validate Indian phone number format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit Indian phone number'
      });
    }

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

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRE_MINUTES) || 5) * 60 * 1000);

    // Delete any existing OTPs for this phone
    await Otp.deleteMany({ phone });

    // Hash the OTP for security
    const codeHash = crypto.createHash('sha256').update(otpCode).digest('hex');

    // Save OTP to database
    const otpRecord = new Otp({
      phone,
      codeHash,
      expiresAt,
      attempts: 0
    });
    await otpRecord.save();

    // Send SMS
    const smsMessage = `Your MESS WALLAH login OTP is: ${otpCode}. Valid for ${process.env.OTP_EXPIRE_MINUTES || 5} minutes. Do not share with anyone.`;
    const smsResult = await sendSMS(phone, smsMessage);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phone,
        expiresIn: parseInt(process.env.OTP_EXPIRE_MINUTES) || 5,
        method: smsResult.method,
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

    // Find OTP record
    const otpRecord = await Otp.findOne({ phone });
    
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found for this phone number. Please request a new OTP.'
      });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.',
        expired: true
      });
    }

    // Check attempt limit (max 3 attempts)
    if (otpRecord.attempts >= 3) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new OTP.',
        maxAttemptsReached: true
      });
    }

    // Verify OTP by comparing hashes
    const inputOtpHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (otpRecord.codeHash !== inputOtpHash) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: `Incorrect OTP. ${3 - otpRecord.attempts} attempts remaining.`,
        attemptsRemaining: 3 - otpRecord.attempts
      });
    }

    // OTP is correct - find or create user
    let user = await User.findOne({ phone });
    
    if (!user) {
      // Create new user with phone number
      user = new User({
        phone,
        name: `User${phone.slice(-4)}`, // Default name
        role: 'user',
        isPhoneVerified: true,
        registrationMethod: 'otp'
      });
      await user.save();
      console.log(`✅ New user created via OTP: ${phone}`);
    } else {
      // Update existing user
      user.isPhoneVerified = true;
      user.lastLogin = new Date();
      await user.save();
    }

    // Delete used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

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
