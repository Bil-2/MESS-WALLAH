/**
 * Notification Service
 * Handles multi-channel notification delivery
 */

const Notification = require('../models/Notification');
const NotificationPreference = require('../models/NotificationPreference');
const notificationTemplates = require('../utils/notificationTemplates');
const sendEmail = require('./emailService');
const sendSMS = require('./twilioVerifyService');

/**
 * Send notification via all enabled channels
 * @param {Object} notificationData - Notification data
 * @returns {Object} - Saved notification with delivery status
 */
const sendMultiChannelNotification = async (notificationData) => {
  try {
    // Get user preferences
    const preferences = await NotificationPreference.getOrCreate(notificationData.userId);

    // Check if user has globally muted notifications
    if (preferences.globalMute) {
      console.log(`[NOTIFICATION] User ${notificationData.userId} has globally muted notifications`);
      return null;
    }

    // Check quiet hours for non-urgent notifications
    if (notificationData.priority !== 'urgent' && preferences.isQuietHours()) {
      console.log(`[NOTIFICATION] Delayed due to quiet hours for user ${notificationData.userId}`);

      // Calculate when to send (after quiet hours end)
      const quietEnd = preferences.quietHours.end.split(':');
      const scheduledTime = new Date();
      scheduledTime.setHours(parseInt(quietEnd[0]), parseInt(quietEnd[1]), 0);

      if (scheduledTime < new Date()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      notificationData.scheduledFor = scheduledTime;
    }

    // Apply user channel preferences
    if (notificationData.channels) {
      for (const channel of ['inApp', 'email', 'sms', 'push']) {
        if (notificationData.channels[channel]?.enabled) {
          const shouldSend = preferences.shouldSend(notificationData.type, channel);
          notificationData.channels[channel].enabled = shouldSend;
        }
      }
    }

    // Create the notification in database (always create for in-app)
    const notification = await Notification.create(notificationData);
    console.log(`[NOTIFICATION] Created: ${notification.title} (ID: ${notification._id})`);

    // Send via email if enabled
    if (notification.channels?.email?.enabled && !notification.scheduledFor) {
      try {
        await sendEmailNotification(notification);
        notification.channels.email.sent = true;
        notification.channels.email.sentAt = new Date();
      } catch (error) {
        console.error('[EMAIL] Failed to send:', error.message);
      }
    }

    // Send via SMS if enabled
    if (notification.channels?.sms?.enabled && !notification.scheduledFor) {
      try {
        await sendSMSNotification(notification);
        notification.channels.sms.sent = true;
        notification.channels.sms.sentAt = new Date();
      } catch (error) {
        console.error('[SMS] Failed to send:', error.message);
      }
    }

    // Mark in-app as sent
    if (notification.channels?.inApp?.enabled) {
      notification.channels.inApp.sent = true;
      notification.channels.inApp.sentAt = new Date();
    }

    // Mark as delivered
    notification.analytics.delivered = true;
    notification.analytics.deliveredAt = new Date();

    await notification.save();

    return notification;
  } catch (error) {
    console.error('[NOTIFICATION SERVICE] Error:', error);
    throw error;
  }
};

/**
 * Send email notification
 * @param {Object} notification - Notification document
 */
const sendEmailNotification = async (notification) => {
  // Get user details
  const User = require('../models/User');
  const user = await User.findById(notification.userId);

  if (!user || !user.email) {
    throw new Error('User email not found');
  }

  // Build email content
  const emailData = {
    to: user.email,
    subject: notification.title,
    html: buildEmailHTML(notification),
    text: notification.message
  };

  // Send email using existing SendGrid service
  await sendEmail(emailData);

  console.log(`[EMAIL] Sent to ${user.email}: ${notification.title}`);
};

/**
 * Send SMS notification
 * @param {Object} notification - Notification document
 */
const sendSMSNotification = async (notification) => {
  // Get user details
  const User = require('../models/User');
  const user = await User.findById(notification.userId);

  if (!user || !user.phone) {
    throw new Error('User phone not found');
  }

  // SMS should be concise
  const smsText = `${notification.title}\n${notification.message}`;

  // Send SMS using existing Twilio service
  await sendSMS.sendSMS(user.phone, smsText);

  console.log(`[SMS] Sent to ${user.phone}: ${notification.title}`);
};

/**
 * Build HTML email from notification
 * @param {Object} notification - Notification document
 * @returns {String} - HTML email content
 */
const buildEmailHTML = (notification) => {
  let actionsHTML = '';

  if (notification.actions && notification.actions.length > 0) {
    actionsHTML = notification.actions.map(action => {
      const buttonColor = {
        primary: '#FF6B35',
        secondary: '#6B7280',
        danger: '#DC2626',
        success: '#10B981'
      }[action.style] || '#FF6B35';

      return `
        <a href="${action.url}" 
           style="display: inline-block; 
                  padding: 12px 24px; 
                  margin: 8px 4px;
                  background-color: ${buttonColor}; 
                  color: white; 
                  text-decoration: none; 
                  border-radius: 6px;
                  font-weight: 600;">
          ${action.label}
        </a>
      `;
    }).join('');
  }

  let imageHTML = '';
  if (notification.media?.imageUrl) {
    imageHTML = `
      <img src="${notification.media.imageUrl}" 
           alt="${notification.media.altText || 'Notification image'}"
           style="max-width: 100%; 
                  height: auto; 
                  border-radius: 8px; 
                  margin: 16px 0;">
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${notification.title}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                 line-height: 1.6; 
                 color: #333; 
                 max-width: 600px; 
                 margin: 0 auto; 
                 padding: 20px;">
      
      <div style="background-color: #f9fafb; 
                  border-radius: 8px; 
                  padding: 24px; 
                  margin-bottom: 20px;">
        
        <h1 style="color: #FF6B35; 
                   font-size: 24px; 
                   margin-bottom: 16px;">
          ${notification.title}
        </h1>
        
        ${imageHTML}
        
        <p style="font-size: 16px; 
                  color: #4B5563; 
                  margin-bottom: 20px;">
          ${notification.message}
        </p>
        
        ${actionsHTML ? `<div style="margin-top: 24px;">${actionsHTML}</div>` : ''}
        
      </div>
      
      <div style="text-align: center; 
                  color: #9CA3AF; 
                  font-size: 12px; 
                  margin-top: 24px;">
        <p>MESS WALLAH - Your Trusted Accommodation Platform</p>
        <p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings/notifications" 
             style="color: #FF6B35; text-decoration: none;">
            Manage Notification Preferences
          </a>
        </p>
      </div>
      
    </body>
    </html>
  `;
};

/**
 * Send notification using template
 * @param {String} templateName - Template name
 * @param {Object} data - Template data
 * @param {String} userId - Target user ID
 * @returns {Object} - Created notification
 */
const sendTemplateNotification = async (templateName, data, userId) => {
  // Create notification from template
  const notificationData = notificationTemplates.createFromTemplate(templateName, data, userId);

  // Send via all channels
  return await sendMultiChannelNotification(notificationData);
};

module.exports = {
  sendMultiChannelNotification,
  sendTemplateNotification,
  sendEmailNotification,
  sendSMSNotification
};
