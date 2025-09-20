const nodemailer = require('nodemailer');
const { logger } = require('./logger');

// Email configuration
const createTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    // Use SendGrid in production
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    // Use Gmail with App Password
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
  } else {
    // Use console logging in development
    return {
      sendMail: async (mailOptions) => {
        logger.info('📧 [DEV EMAIL FALLBACK]', {
          to: mailOptions.to,
          subject: mailOptions.subject,
          text: mailOptions.text || 'No text content',
          html: mailOptions.html || 'No HTML content'
        });
        return { messageId: 'dev-' + Date.now() };
      }
    };
  }
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"MESS WALLAH" <${process.env.GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', {
      to: options.to,
      subject: options.subject,
      messageId: result.messageId
    });
    
    return result;
  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      to: options.to,
      subject: options.subject
    });
    throw error;
  }
};

module.exports = {
  sendEmail
};
