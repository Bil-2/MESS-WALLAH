const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  type: {
    type: String,
    required: true,
    enum: [
      'booking_request',
      'booking_confirmed',
      'booking_rejected',
      'booking_cancelled',
      'payment_received',
      'payment_failed',
      'room_available',
      'room_unavailable',
      'profile_updated',
      'new_message',
      'system_announcement',
      'reminder',
      'welcome'
    ],
    index: true
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
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  category: {
    type: String,
    enum: ['booking', 'payment', 'room', 'system', 'social', 'reminder'],
    default: 'system',
    index: true
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date,
    default: null
  },
  isArchived: {
    type: Boolean,
    default: false,
    index: true
  },
  archivedAt: {
    type: Date,
    default: null
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed'],
    default: 'pending',
    index: true
  },
  deliveryChannels: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  scheduledFor: {
    type: Date,
    default: null,
    index: true
  },
  expiresAt: {
    type: Date,
    default: null,
    index: true
  },
  actionUrl: {
    type: String,
    maxlength: 200
  },
  actionText: {
    type: String,
    maxlength: 50
  },
  metadata: {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deviceInfo: {
      userAgent: String,
      platform: String,
      ipAddress: String
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add pagination plugin
notificationSchema.plugin(mongoosePaginate);

// Indexes for performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, priority: 1, createdAt: -1 });
notificationSchema.index({ scheduledFor: 1, deliveryStatus: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time ago
notificationSchema.virtual('timeAgo').get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return this.createdAt.toLocaleDateString();
});

// Virtual for formatted date
notificationSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Static method to create notification
notificationSchema.statics.createNotification = async function (data) {
  try {
    const notification = new this(data);
    await notification.save();

    // Populate sender and recipient for real-time emission
    await notification.populate('sender', 'name profile.avatar');
    await notification.populate('recipient', 'name');

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Static method to mark as read
notificationSchema.statics.markAsRead = async function (notificationIds, userId) {
  try {
    const result = await this.updateMany(
      {
        _id: { $in: notificationIds },
        recipient: userId,
        isRead: false
      },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );
    return result;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function (userId) {
  try {
    const count = await this.countDocuments({
      recipient: userId,
      isRead: false,
      isArchived: false
    });
    return count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

// Static method to archive old notifications
notificationSchema.statics.archiveOldNotifications = async function (daysOld = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.updateMany(
      {
        createdAt: { $lt: cutoffDate },
        isArchived: false,
        isRead: true
      },
      {
        $set: {
          isArchived: true,
          archivedAt: new Date()
        }
      }
    );

    return result;
  } catch (error) {
    console.error('Error archiving old notifications:', error);
    throw error;
  }
};

// Static method to clean up expired notifications
notificationSchema.statics.cleanupExpired = async function () {
  try {
    const now = new Date();
    const result = await this.deleteMany({
      expiresAt: { $lt: now }
    });
    return result;
  } catch (error) {
    console.error('Error cleaning up expired notifications:', error);
    throw error;
  }
};

// Instance method to mark as read
notificationSchema.methods.markAsRead = async function () {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

// Instance method to archive
notificationSchema.methods.archive = async function () {
  if (!this.isArchived) {
    this.isArchived = true;
    this.archivedAt = new Date();
    await this.save();
  }
  return this;
};

// Pre-save middleware
notificationSchema.pre('save', function (next) {
  // Set expiration for certain notification types
  if (!this.expiresAt) {
    const expirationDays = {
      'system_announcement': 7,
      'reminder': 1,
      'room_available': 3
    };

    if (expirationDays[this.type]) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + expirationDays[this.type]);
      this.expiresAt = expiry;
    }
  }

  next();
});

// Post-save middleware for real-time notifications
notificationSchema.post('save', async function (doc) {
  try {
    // Emit real-time notification via Socket.IO
    const io = require('../utils/socket').getIO();
    if (io) {
      io.to(`user_${doc.recipient}`).emit('new_notification', {
        notification: doc,
        unreadCount: await this.constructor.getUnreadCount(doc.recipient)
      });
    }
  } catch (error) {
    console.error('Error emitting real-time notification:', error);
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
