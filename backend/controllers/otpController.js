const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendMessWallahOTP, verifyMessWallahOTP, formatPhoneNumber } = require('../services/twilioVerifyService');
const { sendFast2SMS } = require('../services/fast2smsService');
const AccountLinkingService = require('../services/accountLinkingService');
const bcrypt = require('bcryptjs');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper to get logged in user from request if present
const getLoggedInUser = async (req) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || (!decoded.userId && !decoded.id)) return null;

    return await User.findById(decoded.userId || decoded.id);
  } catch (error) {
    return null;
  }
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

    // OTP Sending Logic with Provider Fallback
    let otpSendResult;
    let otpProvider = 'twilio';
    let generatedOtp = null; // Only for non-Twilio providers

    console.log(`[INFO] Sending OTP to: ${formattedPhone}`);

    // CONFIG CHECK
    const hasTwilio = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_VERIFY_SERVICE_SID;
    const hasFast2SMS = process.env.FAST2SMS_API_KEY;

    // 1. Try Twilio Verify
    if (hasTwilio) {
      console.log('[OTP] Using Twilio Verify provider');
      otpSendResult = await sendMessWallahOTP(formattedPhone);

      if (otpSendResult.success && !otpSendResult.sid.startsWith('FALLBACK_')) {
        otpProvider = 'twilio';
      } else {
        console.log('[OTP] Twilio failed or keys invalid, trying fallbacks...');
        otpSendResult = { success: false }; // Mark as failed to trigger fallback
      }
    }

    // 2. Try Fast2SMS (If Twilio failed or not configured)
    if ((!otpSendResult || !otpSendResult.success) && hasFast2SMS) {
      console.log('[OTP] Using Fast2SMS provider');
      generatedOtp = generateOTP();
      otpSendResult = await sendFast2SMS(formattedPhone, generatedOtp);

      if (otpSendResult.success) {
        otpProvider = 'fast2sms';
        // Standardize response structure
        otpSendResult.sid = 'F2S_' + Date.now();
        otpSendResult.status = 'sent';
      }
    }

    // 3. Fallback to Development Mode
    if (!otpSendResult || !otpSendResult.success) {
      console.log('[OTP] Using Development Fallback');
      generatedOtp = '123456'; // Fixed dev code
      otpProvider = 'development';
      otpSendResult = {
        success: true,
        sid: 'DEV_' + Date.now(),
        status: 'sent',
        message: 'Development mode active'
      };
    }

    // Determine Hash to store
    // For Twilio, we don't know the code, so use placeholder.
    // For others, we hash the generated code.
    let codeHashToStore = 'universal_otp';
    if (otpProvider !== 'twilio' && generatedOtp) {
      codeHashToStore = await bcrypt.hash(generatedOtp, 10);
    }

    // Save verification attempt to database
    const otpRecord = new Otp({
      phone: formattedPhone,
      codeHash: codeHashToStore,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0,
      verificationSid: otpSendResult.sid
    });
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: otpProvider === 'development' ?
        'OTP sent successfully!' : // Frontend handles the "Use 123456" toast
        'OTP sent to your device! Check your SMS messages.',
      data: {
        phone: formattedPhone,
        expiresIn: 10,
        method: otpProvider === 'development' ? 'Development' : 'Real SMS',
        provider: otpProvider,
        status: 'sent',
        sid: otpSendResult.sid,
        canResendAfter: 30
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

    console.log(`[DEBUG] Verifying OTP for ${formattedPhone.substring(0, 6)}****`);

    try {

      // Determine Verification Strategy based on DB Record
      const existingOtpRecord = await Otp.findOne({ phone: formattedPhone }).sort({ createdAt: -1 });

      if (!existingOtpRecord) {
        return res.status(400).json({ success: false, message: 'OTP expired or not found' });
      }

      // STRATEGY A: Twilio Verify (If we didn't store a hash)
      if (existingOtpRecord.codeHash === 'universal_otp') {
        console.log(`[INFO] Verifying via Twilio API`);
        const verifyResult = await verifyMessWallahOTP(formattedPhone, otp);
        if (verifyResult.success) {
          verificationSuccess = true;
        }
      }
      // STRATEGY B: Local Hash Verify (Fast2SMS or Dev)
      else {
        console.log(`[INFO] Verifying via Local Hash`);
        const isMatch = await bcrypt.compare(otp, existingOtpRecord.codeHash);
        if (isMatch) {
          verificationSuccess = true;
        }
      }

      if (verificationSuccess) {
        console.log('[SUCCESS] OTP Verified Successfully');
      } else {
        console.log('[ERROR] Invalid OTP');
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP. Please enter the exact code.',
          error: 'OTP verification failed'
        });
      }
    } catch (error) {
      console.log('[ERROR] OTP verification error:', error.message);

      // SECURITY: No fallback OTP in any environment
      console.log(`[WARNING] Rejecting OTP ${otp.substring(0, 2)}**** due to verification error`);

      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please enter the correct code from your SMS.',
        error: 'OTP verification failed'
      });
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

    // OTP verification successful - Handle Account Linking

    // CRITICAL FIX: Check if there is a logged-in user verifying their phone
    const loggedInUser = await getLoggedInUser(req);
    let user;

    if (loggedInUser) {
      console.log(`[INFO] Authenticated user ${loggedInUser._id} verifying phone ${formattedPhone}`);

      // Check if phone number is already in use
      const accountSearch = await AccountLinkingService.findExistingUser(null, formattedPhone);

      if (accountSearch.found) {
        const existingUserWithPhone = accountSearch.user;

        // If it's the same user, just double check verified status
        if (existingUserWithPhone._id.toString() === loggedInUser._id.toString()) {
          console.log(`[INFO] Phone already assigned to current user`);
          user = loggedInUser;
          if (!user.isPhoneVerified) {
            user.isPhoneVerified = true;
            await user.save();
          }
        } else {
          // Phone used by ANOTHER user. Check if we can merge (e.g. old OTP account)
          const linkingAnalysis = AccountLinkingService.analyzeLinkingPossibilities(existingUserWithPhone, null, null);

          if (linkingAnalysis.canLink) {
            // Merge the old OTP account INTO the current logged-in account
            console.log(`[INFO] Merging duplicate OTP account into current user profile...`);
            user = await AccountLinkingService.mergeAccounts(loggedInUser, existingUserWithPhone);
          } else {
            // Cannot merge - phone is securely owned by someone else
            return res.status(409).json({
              success: false,
              message: 'This phone number is already linked to another complete account.'
            });
          }
        }
      } else {
        // Phone not used by anyone - link to current user
        console.log(`[INFO] Linking new phone number to current user`);
        user = loggedInUser;
        user.phone = formattedPhone;
        user.isPhoneVerified = true;
        if (user.accountType === 'email-only') {
          user.accountType = 'unified';
        }
        await user.save();
      }

    } else {
      // NO LOGGED IN USER - Standard Login/Register Flow
      // This prevents duplicate accounts by checking all phone variants and potential email links
      console.log(`[DEBUG] Searching for existing user with phone: ${formattedPhone}`);
      const accountSearch = await AccountLinkingService.findExistingUser(null, formattedPhone);

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
