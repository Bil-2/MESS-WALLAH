// Comprehensive notification service for MESS WALLAH
const nodemailer = require('nodemailer');

// Create email transporter (using Gmail for development)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'noreply@messwallah.com',
      pass: process.env.GMAIL_PASS || 'defaultpass'
    }
  });
};

// Send welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@messwallah.com',
      to: userEmail,
      subject: 'Welcome to MESS WALLAH!',
      html: `
        <h2>Welcome to MESS WALLAH, ${userName}!</h2>
        <p>Thank you for joining our platform. You can now search and book rooms across India.</p>
        <p>Happy room hunting!</p>
        <p>Best regards,<br>MESS WALLAH Team</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.log('Email sending failed (development mode):', error.message);
  }
};

// Send booking confirmation email
const sendBookingConfirmation = async (userEmail, bookingDetails) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@messwallah.com',
      to: userEmail,
      subject: 'Booking Confirmation - MESS WALLAH',
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Your booking has been confirmed for ${bookingDetails.roomTitle}</p>
        <p>Check-in: ${bookingDetails.checkIn}</p>
        <p>Check-out: ${bookingDetails.checkOut}</p>
        <p>Total Amount: ₹${bookingDetails.totalAmount}</p>
        <p>Best regards,<br>MESS WALLAH Team</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent successfully');
  } catch (error) {
    console.log('Email sending failed (development mode):', error.message);
  }
};

// Send OTP email
const sendOTPEmail = async (userEmail, otp) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@messwallah.com',
      to: userEmail,
      subject: 'Your OTP - MESS WALLAH',
      html: `
        <h2>Your OTP Code</h2>
        <p>Your OTP code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>Best regards,<br>MESS WALLAH Team</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.log('Email sending failed (development mode):', error.message);
  }
};

// Note: SMS functionality moved to twilioVerifyService.js
// This service now focuses on email notifications only

module.exports = {
  sendWelcomeEmail,
  sendBookingConfirmation,
  sendOTPEmail
};
