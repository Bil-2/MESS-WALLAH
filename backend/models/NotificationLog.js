const mongoose = require('mongoose');

/**
 * NotificationLog — Every message sent by the platform
 * Full audit trail of all emails, SMS, WhatsApp notifications
 * Inspired by: Booking.com, OYO communication tracking
 */
const NotificationLogSchema = new mongoose.Schema({
  // What kind of notification
  type: {
    type: String,
    enum: [
      // Booking lifecycle
      'booking_request_to_owner',      // Owner gets new booking request
      'booking_confirmation_to_tenant',// Tenant's booking confirmed
      'booking_rejection_to_tenant',   // Tenant's booking rejected
      'booking_cancellation',          // Either side cancelled

      // Check-in / Check-out
      'check_in_reminder',             // Reminder 1 day before
      'check_out_reminder',            // Reminder before lease ends
      'welcome_message',               // First day of stay message

      // Payments
      'rent_due_reminder',             // Monthly rent due soon
      'rent_received',                 // Rent payment confirmed
      'deposit_received',              // Security deposit received
      'deposit_refund_sent',           // Deposit returned

      // Reviews
      'review_request_tenant',         // "Please rate your stay"
      'review_request_owner',          // "Rate your tenant"
      'review_received',               // You got a new review

      // Account
      'welcome_new_user',              // Registration welcome
      'otp_verification',              // OTP for login
      'password_reset',                // Reset password link

      // Listing performance
      'low_occupancy_alert',           // Owner's room hasn't been booked
      'new_view_milestone',            // Room reached 100 views etc.
    ],
    required: true
  },

  // Channel
  channel: {
    type: String,
    enum: ['email', 'sms', 'whatsapp', 'in_app', 'push'],
    required: true
  },

  // Recipients
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  toEmail: String,
  toPhone: String,

  // Message content
  subject: String,        // Email subject
  body: String,           // Message body (text)
  htmlBody: String,       // Email HTML body

  // References
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },

  // Delivery status
  status: {
    type: String,
    enum: ['queued', 'sent', 'delivered', 'failed', 'bounced', 'opened'],
    default: 'queued'
  },
  externalMessageId: String,  // ID from email/SMS provider
  failureReason: String,

  sentAt: Date,
  deliveredAt: Date,
  openedAt: Date,         // If email was opened (tracking pixel)
  failedAt: Date,

  // Retry info
  retryCount: {
    type: Number,
    default: 0
  },
  nextRetryAt: Date

}, { timestamps: true });

// Indexes for notification history
NotificationLogSchema.index({ toUserId: 1, createdAt: -1 });
NotificationLogSchema.index({ status: 1 });
NotificationLogSchema.index({ type: 1, createdAt: -1 });
NotificationLogSchema.index({ bookingId: 1 });
NotificationLogSchema.index({ channel: 1, status: 1 });

// TTL: auto-delete notification logs older than 1 year
NotificationLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 });

module.exports = mongoose.model('NotificationLog', NotificationLogSchema);
