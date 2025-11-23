// Comprehensive notification service for MESS WALLAH
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

// Initialize SendGrid with API key (if available)
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Email configuration
const emailConfig = {
  from: process.env.FROM_EMAIL || process.env.GMAIL_USER || 'noreply@messwallah.com',
  fromName: 'MESS WALLAH'
};

// Send welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    // Development mode - log to console
    if (!process.env.SENDGRID_API_KEY) {
      console.log('\n' + '='.repeat(80));
      console.log('[DEVELOPMENT MODE] Welcome Email');
      console.log('='.repeat(80));
      console.log(`To: ${userEmail}`);
      console.log(`User: ${userName}`);
      console.log(`\nWelcome to MESS WALLAH!`);
      console.log(`\nThank you for joining our platform.`);
      console.log(`You can now search and book rooms across India.`);
      console.log('='.repeat(80) + '\n');
      return;
    }

    const msg = {
      to: userEmail,
      from: {
        email: emailConfig.from,
        name: emailConfig.fromName
      },
      subject: 'Welcome to MESS WALLAH - Room Rental Service',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin: 0;">MESS WALLAH</h1>
            <p style="color: #666; margin: 10px 0;">Student Accommodation Platform</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f97316, #ec4899); padding: 30px; border-radius: 15px; color: white; text-align: center;">
            <h2 style="margin: 0 0 15px 0;">Welcome ${userName}!</h2>
            <p style="margin: 0; font-size: 16px;">Thank you for joining our platform. You can now search and book rooms across India.</p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 10px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">What's Next?</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
              <li>Browse thousands of verified rooms</li>
              <li>Compare prices and amenities</li>
              <li>Book instantly with secure payments</li>
              <li>Enjoy complete safety and security</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/rooms" style="background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Start Exploring Rooms</a>
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
    console.log('[SUCCESS] Welcome email sent successfully to:', userEmail);
  } catch (error) {
    console.error('[ERROR] Welcome email failed:', error.message);
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
      subject: 'Booking Confirmed - MESS WALLAH',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin: 0;">MESS WALLAH</h1>
            <p style="color: #666; margin: 10px 0;">Booking Confirmation</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 15px; color: white; text-align: center;">
            <h2 style="margin: 0 0 15px 0;">Booking Confirmed!</h2>
            <p style="margin: 0; font-size: 16px;">Your accommodation is secured. Get ready for your stay!</p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 10px;">
            <h3 style="color: #374151; margin: 0 0 20px 0;">Booking Details:</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316;">
              <p style="margin: 0 0 10px 0; color: #374151;"><strong>Property:</strong> ${bookingDetails.roomTitle || 'Room Booking'}</p>
              <p style="margin: 0 0 10px 0; color: #374151;"><strong>Check-in:</strong> ${bookingDetails.checkIn || 'TBD'}</p>
              <p style="margin: 0 0 10px 0; color: #374151;"><strong>Check-out:</strong> ${bookingDetails.checkOut || 'TBD'}</p>
              <p style="margin: 0 0 10px 0; color: #374151;"><strong>Total Amount:</strong> ₹${bookingDetails.totalAmount || '0'}</p>
              <p style="margin: 0; color: #374151;"><strong>Booking ID:</strong> ${bookingDetails.bookingId || 'MW' + Date.now()}</p>
            </div>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-radius: 10px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0;">Next Steps:</h4>
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
    console.log('[SUCCESS] Booking confirmation email sent successfully to:', userEmail);
  } catch (error) {
    console.error('[ERROR] Booking confirmation email failed:', error.message);
  }
};

// Send OTP email
const sendOTPEmail = async (userEmail, otp) => {
  try {
    // Development mode - log to console
    if (!process.env.SENDGRID_API_KEY) {
      console.log('\n' + '='.repeat(80));
      console.log('[DEVELOPMENT MODE] OTP Email');
      console.log('='.repeat(80));
      console.log(`To: ${userEmail}`);
      console.log(`\nYour OTP Code: ${otp}`);
      console.log(`\nExpires in: 10 minutes`);
      console.log('='.repeat(80) + '\n');
      return;
    }

    const msg = {
      to: userEmail,
      from: {
        email: emailConfig.from,
        name: emailConfig.fromName
      },
      subject: 'Your Verification Code - MESS WALLAH',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin: 0;">MESS WALLAH</h1>
            <p style="color: #666; margin: 10px 0;">Verification Code</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; border-radius: 15px; color: white; text-align: center;">
            <h2 style="margin: 0 0 15px 0;">Your Verification Code</h2>
            <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">${otp}</span>
            </div>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Enter this code to complete your verification</p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-radius: 10px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0;">Important:</h4>
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
    console.log('[SUCCESS] OTP email sent successfully to:', userEmail);
  } catch (error) {
    console.error('[ERROR] OTP email failed:', error.message);
  }
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, resetToken, userName) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 30px 40px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #f97316; letter-spacing: -0.5px;">MESS WALLAH</h1>
                  <p style="margin: 8px 0 0 0; font-size: 14px; color: #6b7280;">Student Accommodation Platform</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 600; color: #1f2937;">Password Reset Request</h2>
                  
                  <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                    Hello${userName ? ' ' + userName : ''},
                  </p>
                  
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                    We received a request to reset your password for your MESS WALLAH account. Click the button below to create a new password.
                  </p>
                  
                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding: 0 0 24px 0;">
                        <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #f97316; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; text-align: center;">Reset Password</a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                    This link will expire in <strong>1 hour</strong> for security reasons.
                  </p>
                  
                  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                  </p>
                  
                  <!-- Alternative Link -->
                  <div style="padding: 20px; background-color: #f9fafb; border-radius: 6px; border-left: 4px solid #f97316;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #1f2937;">
                      Button not working?
                    </p>
                    <p style="margin: 0; font-size: 13px; line-height: 18px; color: #6b7280; word-break: break-all;">
                      Copy and paste this link into your browser:<br>
                      <a href="${resetUrl}" style="color: #f97316; text-decoration: none;">${resetUrl}</a>
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1f2937;">
                    MESS WALLAH
                  </p>
                  <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 18px; color: #6b7280;">
                    Student Accommodation Platform<br>
                    Koramangala, Bangalore, Karnataka, India 560034
                  </p>
                  <p style="margin: 0; font-size: 13px; color: #6b7280;">
                    <a href="mailto:support@messwallah.com" style="color: #f97316; text-decoration: none;">support@messwallah.com</a>
                    <span style="color: #d1d5db; margin: 0 8px;">|</span>
                    <a href="tel:+919946660012" style="color: #f97316; text-decoration: none;">+91 9946 66 0012</a>
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Check if Gmail SMTP is configured
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });

      const mailOptions = {
        from: `"${emailConfig.fromName}" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: 'Reset your MESS WALLAH password',
        html: htmlContent
      };

      await transporter.sendMail(mailOptions);
      console.log('[SUCCESS] Password reset email sent successfully via Gmail to:', userEmail);
      return;
    } catch (error) {
      console.error('[ERROR] Gmail SMTP failed:', error.message);
      // Fall through to try SendGrid or development mode
    }
  }

  // Check if SendGrid is configured
  if (process.env.SENDGRID_API_KEY) {
    try {
      const msg = {
        to: userEmail,
        from: {
          email: emailConfig.from,
          name: emailConfig.fromName
        },
        subject: 'Reset your MESS WALLAH password',
        html: htmlContent
      };

      await sgMail.send(msg);
      console.log('[SUCCESS] Password reset email sent successfully via SendGrid to:', userEmail);
      return;
    } catch (error) {
      console.error('[ERROR] SendGrid failed:', error.message);
      // Fall through to development mode
    }
  }

  // Development mode - no email service configured
  console.log('\n' + '='.repeat(80));
  console.log('[DEVELOPMENT MODE] Password Reset Email');
  console.log('='.repeat(80));
  console.log(`To: ${userEmail}`);
  console.log(`User: ${userName}`);
  console.log(`\nPassword Reset Link:`);
  console.log(`\n   ${resetUrl}\n`);
  console.log('='.repeat(80) + '\n');
};

// Send password reset success confirmation email
const sendPasswordResetSuccessEmail = async (userEmail, userName) => {
  try {
    // Development mode - log to console
    if (!process.env.SENDGRID_API_KEY) {
      console.log('\n' + '='.repeat(80));
      console.log('[DEVELOPMENT MODE] Password Reset Success Email');
      console.log('='.repeat(80));
      console.log(`To: ${userEmail}`);
      console.log(`User: ${userName}`);
      console.log(`\nPassword Reset Successful!`);
      console.log(`\nYour password has been successfully updated.`);
      console.log(`You can now login with your new password.`);
      console.log('='.repeat(80) + '\n');
      return;
    }

    const msg = {
      to: userEmail,
      from: {
        email: emailConfig.from,
        name: emailConfig.fromName
      },
      subject: 'Password Reset Successful - MESS WALLAH',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin: 0;">MESS WALLAH</h1>
            <p style="color: #666; margin: 10px 0;">Password Reset Confirmation</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 15px; color: white; text-align: center;">
            <h2 style="margin: 0 0 15px 0;">Password Reset Successful!</h2>
            <p style="margin: 0; font-size: 16px;">Hi ${userName}, your password has been successfully updated.</p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 10px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">Security Summary:</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
              <li>Password successfully changed</li>
              <li>Account security updated</li>
              <li>All devices logged out for security</li>
              <li>Login with your new password</li>
            </ul>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #dbeafe; border-radius: 10px; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e40af; margin: 0 0 10px 0;">Security Tips:</h4>
            <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
              <li>Use a unique password for your MESS WALLAH account</li>
              <li>Enable two-factor authentication if available</li>
              <li>Never share your password with anyone</li>
              <li>Update your password regularly</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Login Now</a>
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
    console.log('[SUCCESS] Password reset success email sent successfully to:', userEmail);
  } catch (error) {
    console.error('[ERROR] Password reset success email failed:', error.message);
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
