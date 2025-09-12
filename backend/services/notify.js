const twilio = require('twilio');

// Initialize Twilio client only if credentials are provided and valid
const client = (process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_ACCOUNT_SID.startsWith('AC'))
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const sendSms = async (to, body) => {
  if (client && process.env.TWILIO_PHONE) {
    try {
      await client.messages.create({
        body,
        from: process.env.TWILIO_PHONE,
        to
      });
      console.log(`✅ SMS sent to ${to}`);
    } catch (err) {
      console.error('❌ Twilio error:', err);
      throw err;
    }
  } else {
    // DEV fallback: log OTP to console for demo
    console.log('\n🔔 [DEV SMS FALLBACK]');
    console.log(`📱 To: ${to}`);
    console.log(`💬 Message: ${body}`);
    console.log('─'.repeat(50));
  }
};

const sendEmail = async (to, subject, html) => {
  if (process.env.SENDGRID_API_KEY) {
    try {
      // Use @sendgrid/mail in production
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send({
        to,
        from: 'noreply@messwalla.app',
        subject,
        html
      });
      console.log(`✅ Email sent to ${to}`);
    } catch (err) {
      console.error('❌ SendGrid error:', err);
      throw err;
    }
  } else {
    // DEV fallback: log email to console for demo
    console.log('\n📧 [DEV EMAIL FALLBACK]');
    console.log(`📮 To: ${to}`);
    console.log(`📋 Subject: ${subject}`);
    console.log(`📄 Content: ${html}`);
    console.log('─'.repeat(50));
  }
};

module.exports = { sendSms, sendEmail };
