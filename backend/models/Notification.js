const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'booking_request',      // New booking request (for owner)
      'booking_confirmed',    // Booking confirmed (for customer)
      'booking_rejected',     // Booking rejected (for customer)
      'booking_cancelled',    // Booking cancelled
      'payment_success',      // Payment successful
      'payment_failed',       // Payment failed
      'refund_initiated',     // Refund started
      'refund_completed',     // Refund completed
      'message_received',     // New message in booking
      'review_received',      // New review on property
      'system'                // System notification
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    amount: Number,
    actionUrl: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  // Rich Media Support
  media: {
    imageUrl: String,          // Main image URL
    thumbnailUrl: String,      // Thumbnail for list view
    iconUrl: String,           // Icon for notification badge
    altText: String            // Accessibility text
  },
  // Action Buttons
  actions: [{
    label: {
      type: String,
      maxlength: 50
    },
    action: {
      type: String,
      enum: ['navigate', 'api_call', 'external', 'dismiss'],
      default: 'navigate'
    },
    url: String,               // Deep link or external URL
    style: {
      type: String,
      enum: ['primary', 'secondary', 'danger', 'success'],
      default: 'primary'
    }
  }],
  // Multi-Channel Delivery Tracking
  channels: {
    inApp: {
      enabled: { type: Boolean, default: true },
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    email: {
      enabled: { type: Boolean, default: false },
      sent: { type: Boolean, default: false },
      sentAt: Date,
      opened: { type: Boolean, default: false },
      openedAt: Date
    },
    sms: {
      enabled: { type: Boolean, default: false },
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    push: {
      enabled: { type: Boolean, default: false },
      sent: { type: Boolean, default: false },
      sentAt: Date
    }
  },
  // Analytics
  analytics: {
    delivered: { type: Boolean, default: false },
    deliveredAt: Date,
    opened: { type: Boolean, default: false },
    openedAt: Date,
    clicked: { type: Boolean, default: false },
    clickedAt: Date,
    actionTaken: String        // Which action button was clicked
  },
  // Scheduling
  scheduledFor: Date,          // Send at specific time
  // Personalization
  personalization: {
    userName: String,
    roomName: String,
    ownerName: String,
    customData: mongoose.Schema.Types.Mixed
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
// FIXED: Add TTL index for automatic cleanup of expired notifications
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Add TTL for old notifications (30 days) if no expiresAt is set
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Static method to create notification
NotificationSchema.statics.createNotification = async function (data) {
  const notification = await this.create(data);
  console.log(`[NOTIFICATION] Created for user ${data.userId}: ${data.title}`);
  return notification;
};

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({ userId, isRead: false });
};

// Static method to mark all as read
NotificationSchema.statics.markAllAsRead = async function (userId) {
  return this.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Instance method to mark as read
NotificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  // Track analytics
  if (!this.analytics.opened) {
    this.analytics.opened = true;
    this.analytics.openedAt = new Date();
  }
  return this.save();
};

// Instance method to track click
NotificationSchema.methods.trackClick = function (actionLabel) {
  this.analytics.clicked = true;
  this.analytics.clickedAt = new Date();
  if (actionLabel) {
    this.analytics.actionTaken = actionLabel;
  }
  return this.save();
};

// Instance method to track delivery
NotificationSchema.methods.markDelivered = function () {
  this.analytics.delivered = true;
  this.analytics.deliveredAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Notification', NotificationSchema);
