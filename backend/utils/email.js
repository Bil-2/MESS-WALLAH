const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  welcome: (data) => ({
    subject: 'Welcome to MESS WALLAH - Verify Your Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to MESS WALLAH</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0;">Find Your Perfect Room</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${data.name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thank you for joining MESS WALLAH! We're excited to help you find the perfect accommodation.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            To get started, please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationUrl}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; line-height: 1.6;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${data.verificationUrl}" style="color: #667eea;">${data.verificationUrl}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            The MESS WALLAH Team
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>© 2024 MESS WALLAH. All rights reserved.</p>
          <p>This email was sent to ${data.email}. If you didn't create an account, please ignore this email.</p>
        </div>
      </div>
    `
  }),

  'reset-password': (data) => ({
    subject: 'MESS WALLAH - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0;">MESS WALLAH</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${data.name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            We received a request to reset your password for your MESS WALLAH account.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Click the button below to reset your password. This link will expire in 10 minutes.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" 
               style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; line-height: 1.6;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${data.resetUrl}" style="color: #dc3545;">${data.resetUrl}</a>
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-top: 25px;">
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            The MESS WALLAH Team
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>© 2024 MESS WALLAH. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  'booking-confirmation': (data) => ({
    subject: `Booking Confirmation - ${data.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0;">MESS WALLAH</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${data.seekerName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Great news! Your booking request has been confirmed by the room owner.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #333; margin-top: 0;">Booking Details</h3>
            <p><strong>Booking ID:</strong> ${data.bookingId}</p>
            <p><strong>Room:</strong> ${data.roomTitle}</p>
            <p><strong>Address:</strong> ${data.roomAddress}</p>
            <p><strong>Check-in Date:</strong> ${data.checkInDate}</p>
            <p><strong>Duration:</strong> ${data.duration} months</p>
            <p><strong>Monthly Rent:</strong> ₹${data.monthlyRent}</p>
            <p><strong>Security Deposit:</strong> ₹${data.securityDeposit}</p>
            <p><strong>Total Amount:</strong> ₹${data.totalAmount}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Please contact the room owner for further arrangements:
          </p>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 25px 0;">
            <p><strong>Owner:</strong> ${data.ownerName}</p>
            <p><strong>Phone:</strong> ${data.ownerPhone}</p>
            <p><strong>Email:</strong> ${data.ownerEmail}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            The MESS WALLAH Team
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>© 2024 MESS WALLAH. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  'booking-request': (data) => ({
    subject: `New Booking Request - ${data.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ffc107 0%, #ff8f00 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Booking Request</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0;">MESS WALLAH</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${data.ownerName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            You have received a new booking request for your room listing.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #333; margin-top: 0;">Booking Details</h3>
            <p><strong>Booking ID:</strong> ${data.bookingId}</p>
            <p><strong>Room:</strong> ${data.roomTitle}</p>
            <p><strong>Check-in Date:</strong> ${data.checkInDate}</p>
            <p><strong>Duration:</strong> ${data.duration} months</p>
            <p><strong>Total Amount:</strong> ₹${data.totalAmount}</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #333; margin-top: 0;">Seeker Information</h4>
            <p><strong>Name:</strong> ${data.seekerName}</p>
            <p><strong>Phone:</strong> ${data.seekerPhone}</p>
            <p><strong>Email:</strong> ${data.seekerEmail}</p>
            <p><strong>Occupation:</strong> ${data.seekerOccupation || 'Not specified'}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; margin-bottom: 15px;">Please log in to your account to review and respond to this booking request.</p>
            <a href="${process.env.FRONTEND_URL}/dashboard" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              View Dashboard
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            The MESS WALLAH Team
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>© 2024 MESS WALLAH. All rights reserved.</p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter();

    let emailContent = {};

    if (template && emailTemplates[template]) {
      const templateContent = emailTemplates[template](data);
      emailContent = {
        subject: templateContent.subject,
        html: templateContent.html
      };
    } else {
      emailContent = {
        subject: subject || 'MESS WALLAH Notification',
        html: html,
        text: text
      };
    }

    const mailOptions = {
      from: `"MESS WALLAH" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;

  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Send bulk emails
const sendBulkEmails = async (emails) => {
  const results = [];

  for (const email of emails) {
    try {
      const result = await sendEmail(email);
      results.push({ success: true, messageId: result.messageId, to: email.to });
    } catch (error) {
      results.push({ success: false, error: error.message, to: email.to });
    }
  }

  return results;
};

module.exports = {
  sendEmail,
  sendBulkEmails
};
