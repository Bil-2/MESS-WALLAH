const nodemailer = require('nodemailer');

// Create transporter based on environment
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production: Use SendGrid or other email service
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME || 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else {
    // Development: Use Ethereal Email for testing
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER || 'ethereal.user@ethereal.email',
        pass: process.env.ETHEREAL_PASS || 'ethereal.pass'
      }
    });
  }
};

// Send email function
const sendEmail = async (to, subject, html, options = {}) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@messwallah.com',
      to,
      subject,
      html,
      ...options
    };

    const result = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', {
      messageId: result.messageId,
      to,
      subject
    });

    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Email sending failed:', error);

    return {
      success: false,
      error: error.message
    };
  }
};

// Send OTP email
const sendOTPEmail = async (to, otp, name = 'User') => {
  const subject = 'Your OTP for MESS WALLAH Verification';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: #fff; border: 2px solid #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
        .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 MESS WALLAH</h1>
          <p>Your Trusted Room Booking Platform</p>
        </div>
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>Thank you for choosing MESS WALLAH. To complete your verification, please use the OTP code below:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <p><strong>This OTP is valid for 10 minutes</strong></p>
          </div>
          
          <p>If you didn't request this verification, please ignore this email.</p>
          
          <div class="footer">
            <p>Best regards,<br>The MESS WALLAH Team</p>
            <p><small>This is an automated email. Please do not reply to this message.</small></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(to, subject, html);
};

// Send welcome email
const sendWelcomeEmail = async (to, name, userType = 'user') => {
  const subject = 'Welcome to MESS WALLAH! 🎉';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to MESS WALLAH</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .feature-box { background: #fff; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; border-radius: 5px; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 Welcome to MESS WALLAH!</h1>
          <p>Your journey to finding the perfect room starts here</p>
        </div>
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>We're excited to have you join our community of ${userType === 'owner' ? 'property owners' : 'room seekers'}!</p>
          
          ${userType === 'owner' ? `
            <h3>As a Property Owner, you can:</h3>
            <div class="feature-box">📋 List your rooms with detailed descriptions and photos</div>
            <div class="feature-box">💰 Set competitive pricing and manage bookings</div>
            <div class="feature-box">📊 Track your earnings and booking statistics</div>
            <div class="feature-box">💬 Communicate directly with potential tenants</div>
          ` : `
            <h3>As a Room Seeker, you can:</h3>
            <div class="feature-box">🔍 Search and filter rooms by location, price, and amenities</div>
            <div class="feature-box">❤️ Save your favorite rooms for later</div>
            <div class="feature-box">📱 Book rooms instantly with our easy process</div>
            <div class="feature-box">⭐ Read reviews from previous tenants</div>
          `}
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="cta-button">
              Start Exploring Rooms
            </a>
          </div>
          
          <p>If you have any questions, feel free to reach out to our support team.</p>
          
          <div class="footer">
            <p>Happy room hunting!<br>The MESS WALLAH Team</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(to, subject, html);
};

// Send booking notification email
const sendBookingNotification = async (to, bookingData, type = 'new') => {
  let subject, html;

  switch (type) {
    case 'new':
      subject = `New Booking Request - ${bookingData.bookingId}`;
      html = `
        <h2>New Booking Request Received</h2>
        <p>You have received a new booking request for "${bookingData.roomTitle}".</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>Booking ID: ${bookingData.bookingId}</li>
          <li>Check-in Date: ${bookingData.checkInDate}</li>
          <li>Duration: ${bookingData.duration} months</li>
          <li>Total Amount: ₹${bookingData.totalAmount}</li>
        </ul>
        <p>Please log in to your dashboard to review and respond.</p>
      `;
      break;

    case 'confirmed':
      subject = `Booking Confirmed - ${bookingData.bookingId}`;
      html = `
        <h2>🎉 Your Booking is Confirmed!</h2>
        <p>Great news! Your booking for "${bookingData.roomTitle}" has been confirmed.</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>Booking ID: ${bookingData.bookingId}</li>
          <li>Check-in Date: ${bookingData.checkInDate}</li>
          <li>Duration: ${bookingData.duration} months</li>
          <li>Total Amount: ₹${bookingData.totalAmount}</li>
        </ul>
        <p>Owner will contact you soon with further details.</p>
      `;
      break;

    case 'rejected':
      subject = `Booking Request Update - ${bookingData.bookingId}`;
      html = `
        <h2>Booking Request Update</h2>
        <p>Unfortunately, your booking request for "${bookingData.roomTitle}" could not be confirmed.</p>
        <p>Booking ID: ${bookingData.bookingId}</p>
        ${bookingData.reason ? `<p><strong>Reason:</strong> ${bookingData.reason}</p>` : ''}
        <p>Don't worry! There are many other great rooms available on our platform.</p>
      `;
      break;
  }

  return await sendEmail(to, subject, html);
};

// Send password reset email
const sendPasswordResetEmail = async (to, resetToken, name = 'User') => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  const subject = 'Password Reset Request - MESS WALLAH';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .reset-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Password Reset</h1>
          <p>MESS WALLAH</p>
        </div>
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="reset-button">Reset Password</a>
          </div>
          
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          
          <div class="footer">
            <p>Best regards,<br>The MESS WALLAH Team</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendBookingNotification,
  sendPasswordResetEmail
};
