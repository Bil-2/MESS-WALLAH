// Comprehensive notification service for MESS WALLAH
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// SendGrid email configuration
const emailConfig = {
  from: process.env.FROM_EMAIL || 'biltubag29@gmail.com',
  fromName: 'MESS WALLAH'
};

// Send welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const msg = {
      to: userEmail,
      from: {
        email: emailConfig.from,
        name: emailConfig.fromName
      },
      subject: '🎉 Welcome to MESS WALLAH!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin: 0;">👨‍🍳 MESS WALLAH</h1>
            <p style="color: #666; margin: 10px 0;">Student Accommodation Platform</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f97316, #ec4899); padding: 30px; border-radius: 15px; color: white; text-align: center;">
            <h2 style="margin: 0 0 15px 0;">Welcome ${userName}! 🏠</h2>
            <p style="margin: 0; font-size: 16px;">Thank you for joining our platform. You can now search and book rooms across India.</p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 10px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">What's Next?</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
              <li>🔍 Browse thousands of verified rooms</li>
              <li>💰 Compare prices and amenities</li>
              <li>📱 Book instantly with secure payments</li>
              <li>🛡️ Enjoy complete safety and security</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/rooms" style="background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Start Exploring Rooms</a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              MESS WALLAH - Student Accommodation Platform<br>
              Koramangala, Bangalore, Karnataka, India 560034<br>
              <a href="mailto:support@messwallah.com" style="color: #f97316;">support@messwallah.com</a>
            </p>
          </div>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ Welcome email sent successfully to:', userEmail);
  } catch (error) {
    console.error('❌ Welcome email failed:', error.message);
  }
};

// Send booking confirmation email
const sendBookingConfirmation = async (userEmail, bookingDetails) => {
  try {
    const msg = {
      to: userEmail,
      from: {
        email: emailConfig.from,
        name: emailConfig.fromName
      },
      subject: '✅ Booking Confirmed - MESS WALLAH',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin: 0;">👨‍🍳 MESS WALLAH</h1>
            <p style="color: #666; margin: 10px 0;">Booking Confirmation</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 15px; color: white; text-align: center;">
            <h2 style="margin: 0 0 15px 0;">🎉 Booking Confirmed!</h2>
            <p style="margin: 0; font-size: 16px;">Your accommodation is secured. Get ready for your stay!</p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 10px;">
            <h3 style="color: #374151; margin: 0 0 20px 0;">📋 Booking Details:</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316;">
              <p style="margin: 0 0 10px 0; color: #374151;"><strong>🏠 Property:</strong> ${bookingDetails.roomTitle || 'Room Booking'}</p>
              <p style="margin: 0 0 10px 0; color: #374151;"><strong>📅 Check-in:</strong> ${bookingDetails.checkIn || 'TBD'}</p>
              <p style="margin: 0 0 10px 0; color: #374151;"><strong>📅 Check-out:</strong> ${bookingDetails.checkOut || 'TBD'}</p>
              <p style="margin: 0 0 10px 0; color: #374151;"><strong>💰 Total Amount:</strong> ₹${bookingDetails.totalAmount || '0'}</p>
              <p style="margin: 0; color: #374151;"><strong>🆔 Booking ID:</strong> ${bookingDetails.bookingId || 'MW' + Date.now()}</p>
            </div>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-radius: 10px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0;">📞 Next Steps:</h4>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>Save this confirmation email</li>
              <li>Contact property owner 24 hours before check-in</li>
              <li>Carry valid ID proof during check-in</li>
              <li>For any queries, contact our support team</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/bookings" style="background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin-right: 10px;">View Booking</a>
            <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@messwallah.com'}" style="background: transparent; color: #f97316; padding: 15px 30px; text-decoration: none; border: 2px solid #f97316; border-radius: 25px; font-weight: bold;">Contact Support</a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              MESS WALLAH - Student Accommodation Platform<br>
              Koramangala, Bangalore, Karnataka, India 560034<br>
              <a href="mailto:support@messwallah.com" style="color: #f97316;">support@messwallah.com</a> | <a href="tel:+919946660012" style="color: #f97316;">+91 9946 66 0012</a>
            </p>
          </div>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ Booking confirmation email sent successfully to:', userEmail);
  } catch (error) {
    console.error('❌ Booking confirmation email failed:', error.message);
  }
};

// Send OTP email
const sendOTPEmail = async (userEmail, otp) => {
  try {
    const msg = {
      to: userEmail,
      from: {
        email: emailConfig.from,
        name: emailConfig.fromName
      },
      subject: '🔐 Your OTP Code - MESS WALLAH',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin: 0;">👨‍🍳 MESS WALLAH</h1>
            <p style="color: #666; margin: 10px 0;">Verification Code</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; border-radius: 15px; color: white; text-align: center;">
            <h2 style="margin: 0 0 15px 0;">🔐 Your Verification Code</h2>
            <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">${otp}</span>
            </div>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Enter this code to complete your verification</p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-radius: 10px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0;">⚠️ Important:</h4>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>This code will expire in <strong>10 minutes</strong></li>
              <li>Don't share this code with anyone</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              MESS WALLAH - Student Accommodation Platform<br>
              Koramangala, Bangalore, Karnataka, India 560034<br>
              <a href="mailto:support@messwallah.com" style="color: #f97316;">support@messwallah.com</a>
            </p>
          </div>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ OTP email sent successfully to:', userEmail);
  } catch (error) {
    console.error('❌ OTP email failed:', error.message);
  }
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, resetToken, userName) => {
  try {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const msg = {
      to: userEmail,
      from: {
        email: emailConfig.from,
        name: emailConfig.fromName
      },
      subject: '🔒 Password Reset Request - MESS WALLAH',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin: 0;">👨‍🍳 MESS WALLAH</h1>
            <p style="color: #666; margin: 10px 0;">Password Reset Request</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 30px; border-radius: 15px; color: white; text-align: center;">
            <h2 style="margin: 0 0 15px 0;">🔒 Reset Your Password</h2>
            <p style="margin: 0; font-size: 16px;">Hi ${userName}, we received a request to reset your password.</p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 10px;">
            <h3 style="color: #374151; margin: 0 0 20px 0;">🔐 Reset Instructions:</h3>
            <ol style="color: #6b7280; margin: 0; padding-left: 20px;">
              <li>Click the "Reset Password" button below</li>
              <li>Enter your new password (must be strong)</li>
              <li>Confirm your new password</li>
              <li>Login with your new credentials</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Reset My Password</a>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-radius: 10px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0;">⚠️ Security Notice:</h4>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>This link will expire in <strong>1 hour</strong></li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Never share this link with anyone</li>
              <li>Contact support if you have concerns</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px;">
              If the button doesn't work, copy and paste this link:<br>
              <a href="${resetUrl}" style="color: #f97316; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              MESS WALLAH - Student Accommodation Platform<br>
              Koramangala, Bangalore, Karnataka, India 560034<br>
              <a href="mailto:support@messwallah.com" style="color: #f97316;">support@messwallah.com</a> | <a href="tel:+919946660012" style="color: #f97316;">+91 9946 66 0012</a>
            </p>
          </div>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ Password reset email sent successfully to:', userEmail);
  } catch (error) {
    console.error('❌ Password reset email failed:', error.message);
  }
};

// Send password reset success confirmation email
const sendPasswordResetSuccessEmail = async (userEmail, userName) => {
  try {
    const msg = {
      to: userEmail,
      from: {
        email: emailConfig.from,
        name: emailConfig.fromName
      },
      subject: '✅ Password Reset Successful - MESS WALLAH',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin: 0;">👨‍🍳 MESS WALLAH</h1>
            <p style="color: #666; margin: 10px 0;">Password Reset Confirmation</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 15px; color: white; text-align: center;">
            <h2 style="margin: 0 0 15px 0;">✅ Password Reset Successful!</h2>
            <p style="margin: 0; font-size: 16px;">Hi ${userName}, your password has been successfully updated.</p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 10px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">🔐 Security Summary:</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
              <li>✅ Password successfully changed</li>
              <li>✅ Account security updated</li>
              <li>✅ All devices logged out for security</li>
              <li>✅ Login with your new password</li>
            </ul>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #dbeafe; border-radius: 10px; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e40af; margin: 0 0 10px 0;">💡 Security Tips:</h4>
            <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
              <li>Use a unique password for your MESS WALLAH account</li>
              <li>Enable two-factor authentication if available</li>
              <li>Never share your password with anyone</li>
              <li>Update your password regularly</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login" style="background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Login Now</a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              MESS WALLAH - Student Accommodation Platform<br>
              Koramangala, Bangalore, Karnataka, India 560034<br>
              <a href="mailto:support@messwallah.com" style="color: #f97316;">support@messwallah.com</a> | <a href="tel:+919946660012" style="color: #f97316;">+91 9946 66 0012</a>
            </p>
          </div>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ Password reset success email sent successfully to:', userEmail);
  } catch (error) {
    console.error('❌ Password reset success email failed:', error.message);
  }
};

// Note: SMS functionality moved to twilioVerifyService.js
// This service now focuses on email notifications only

module.exports = {
  sendWelcomeEmail,
  sendBookingConfirmation,
  sendOTPEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail
};
