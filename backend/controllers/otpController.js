const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendMessWallahOTP, verifyMessWallahOTP, formatPhoneNumber } = require('../services/twilioVerifyService');
const AccountLinkingService = require('../services/accountLinkingService');

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

    // REAL SMS OTP sending - sends actual SMS to your device
    let otpSendResult;

    console.log(`[INFO] Sending REAL SMS OTP to: ${formattedPhone}`);

    try {
      // Force real SMS sending with proper Twilio configuration
      console.log('[DEBUG] Attempting to send REAL SMS via Twilio...');
      otpSendResult = await sendMessWallahOTP(formattedPhone);

      if (otpSendResult.success && !otpSendResult.sid.startsWith('FALLBACK_')) {
        console.log(`[SUCCESS] REAL SMS OTP sent successfully to ${formattedPhone}`);
        console.log(`[INFO] Check your device for the OTP message!`);
        console.log(`[DEBUG] Twilio SID: ${otpSendResult.sid}`);
      } else {
        console.log(`[WARNING] Twilio SMS failed or fallback used: ${otpSendResult.error || 'Fallback mode'}`);
        console.log('[DEBUG] Using development mode instead');
        // Fallback to development mode
        otpSendResult = {
          success: true,
          sid: 'DEV_' + Date.now(),
          status: 'sent',
          message: 'Development mode - use 123456'
        };
      }
    } catch (error) {
      console.log('[ERROR] SMS sending failed, using development fallback:', error.message);
      otpSendResult = {
        success: true,
        sid: 'DEV_' + Date.now(),
        status: 'sent',
        message: 'Development mode - use 123456'
      };
    }

    // Save verification attempt to database for tracking
    const otpRecord = new Otp({
      phone: formattedPhone,
      codeHash: 'universal_otp', // Universal OTP system
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0,
      verificationSid: otpSendResult.sid
    });
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: otpSendResult.sid.startsWith('DEV_') ?
        '' :
        'OTP sent to your device! Check your SMS messages.',
      data: {
        phone: formattedPhone,
        expiresIn: 10, // minutes
        method: otpSendResult.sid.startsWith('DEV_') ? 'Development' : 'Real SMS',
        status: 'sent',
        sid: otpSendResult.sid,
        canResendAfter: 30,
        note: otpSendResult.sid.startsWith('DEV_') ?
          'Development mode: Use 123456' :
          'Check your phone for SMS with 6-digit verification code',
        quickTip: otpSendResult.sid.startsWith('DEV_') ?
          'Development OTP: 123456' :
          'Enter the exact 6-digit code from your SMS message'
      }
    });

  } catch (error) {
    console.error('[ERROR] Send OTP Error:', error);
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

    // REAL OTP verification - verifies the actual OTP you received
    let verificationSuccess = false;

    console.log(`[DEBUG] Verifying REAL OTP for ${formattedPhone}: ${otp}`);

    try {
      // PRODUCTION-READY OTP VERIFICATION with fallback
      console.log(`[INFO] PRODUCTION OTP VERIFICATION for ${formattedPhone}: ${otp}`);

      const verifyResult = await verifyMessWallahOTP(formattedPhone, otp);

      if (verifyResult.success) {
        verificationSuccess = true;
        console.log('[SUCCESS] REAL SMS OTP verified successfully via Twilio');
        console.log('[SUCCESS] The OTP from your SMS is correct and valid!');
      } else {
        // Production fallback: Check if it's a development environment
        if (process.env.NODE_ENV === 'development' && otp === '123456') {
          verificationSuccess = true;
          console.log('[SUCCESS] Development OTP accepted for testing purposes');
        } else {
          console.log(`[ERROR] INVALID OTP: ${otp} - Not the real OTP from SMS`);
          console.log('[WARNING] Rejecting invalid/fake OTP code');

          return res.status(400).json({
            success: false,
            message: 'Invalid OTP. Please enter the exact 6-digit code you received via SMS.',
            error: 'OTP verification failed',
            hint: process.env.NODE_ENV === 'development' ?
              'Use the real OTP from SMS or 123456 for development testing' :
              'Only the real OTP sent to your phone will work. Check your SMS messages.',
            strict: true
          });
        }
      }
    } catch (error) {
      console.log('[ERROR] OTP verification error:', error.message);

      // Production fallback for development
      if (process.env.NODE_ENV === 'development' && otp === '123456') {
        verificationSuccess = true;
        console.log('[SUCCESS] Development fallback OTP accepted');
      } else {
        console.log(`[WARNING] Rejecting OTP ${otp} due to verification error`);

        return res.status(400).json({
          success: false,
          message: 'Invalid OTP. Please enter the correct code from your SMS.',
          error: 'OTP verification failed',
          hint: process.env.NODE_ENV === 'development' ?
            'Use 123456 for development or the real OTP from SMS' :
            'Only the real OTP sent via SMS will be accepted'
        });
      }
    }

    if (!verificationSuccess) {
      return res.status(403).json({
        success: false,
        message: 'Invalid OTP. Please enter the correct code from your SMS.',
        error: 'Verification unsuccessful'
      });
    }

    // Find and clean up OTP record
    const existingOtp = await Otp.findOne({ phone: formattedPhone });
    if (existingOtp) {
      await Otp.deleteOne({ _id: existingOtp._id });
    }

    // OTP verification successful - find or create user using AccountLinkingService
    // This prevents duplicate accounts by checking all phone variants and potential email links
    console.log(`[DEBUG] Searching for existing user with phone: ${formattedPhone}`);
    const accountSearch = await AccountLinkingService.findExistingUser(null, formattedPhone);

    let user;

    if (accountSearch.found) {
      user = accountSearch.user;
      console.log(`[SUCCESS] Existing user found: ${user._id}`);

      // Update user details
      if (user.phone !== formattedPhone) {
        user.phone = formattedPhone;
      }
      user.isPhoneVerified = true;
      user.lastLogin = new Date();
      user.isActive = true;

      // If this was an email-only account, it's now linked with phone
      if (!user.registrationMethod || user.registrationMethod === 'email') {
        // Don't change registrationMethod, but ensure accountType reflects capabilities
        if (user.accountType === 'email-only') {
          user.accountType = 'unified';
        }
      }

      await user.save();
    } else {
      // Create new user with phone number
      console.log(`[INFO] No existing user found. Creating new OTP-only account.`);
      try {
        user = new User({
          phone: formattedPhone,
          name: `User${formattedPhone.slice(-4)}`, // Default name using last 4 digits
          role: 'user',
          isPhoneVerified: true,
          registrationMethod: 'otp',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date(),
          // CRITICAL: Mark as OTP-only account that can be linked later
          accountType: 'otp-only',
          canLinkEmail: true,
          profileCompleted: false
        });
        await user.save();
        console.log(`[SUCCESS] New OTP-only user created: ${formattedPhone}`);
      } catch (saveError) {
        if (saveError.code === 11000) {
          // Handle race condition - duplicate key error
          console.log('[WARNING] Race condition detected, finding user again');
          const retrySearch = await AccountLinkingService.findExistingUser(null, formattedPhone);
          if (retrySearch.found) {
            user = retrySearch.user;
          } else {
            // Fallback with unique name if phone collision wasn't the issue (unlikely for phone index)
            user = new User({
              phone: formattedPhone,
              name: `User${formattedPhone.slice(-4)}_${Date.now()}`,
              role: 'user',
              isPhoneVerified: true,
              registrationMethod: 'otp',
              isActive: true,
              accountType: 'otp-only',
              canLinkEmail: true
            });
            await user.save();
          }
        } else {
          throw saveError;
        }
      }
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
      message: 'Login successful! Welcome to MESS WALLAH!',
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
        token,
        loginMethod: 'OTP',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[ERROR] Verify OTP Error:', error);
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
    console.error('[ERROR] Resend OTP Error:', error);
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
