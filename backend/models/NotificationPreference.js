const mongoose = require('mongoose');

const NotificationPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  // Preferences for each notification type
  preferences: {
    booking_request: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    booking_confirmed: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    booking_rejected: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    booking_cancelled: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    payment_success: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    payment_failed: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    refund_initiated: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    refund_completed: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    message_received: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    review_received: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false }
    },
    system: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false }
    }
  },
  // Quiet hours settings
  quietHours: {
    enabled: {
      type: Boolean,
      default: false
    },
    start: {
      type: String,
      default: '22:00',
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: 'Invalid time format. Use HH:MM (24-hour)'
      }
    },
    end: {
      type: String,
      default: '08:00',
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: 'Invalid time format. Use HH:MM (24-hour)'
      }
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    }
  },
  // Preferred communication channel
  preferredChannel: {
    type: String,
    enum: ['email', 'sms', 'push', 'inApp'],
    default: 'email'
  },
  // Global mute switch
  globalMute: {
    type: Boolean,
    default: false
  },
  // Marketing preferences
  marketing: {
    promotional: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: true },
    recommendations: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Static method to get or create preferences for a user
NotificationPreferenceSchema.statics.getOrCreate = async function (userId) {
  let preferences = await this.findOne({ userId });

  if (!preferences) {
    preferences = await this.create({ userId });
    console.log(`[PREFERENCES] Created default preferences for user ${userId}`);
  }

  return preferences;
};

// Method to check if notification should be sent for a specific channel
NotificationPreferenceSchema.methods.shouldSend = function (notificationType, channel) {
  // Check global mute
  if (this.globalMute) {
    return false;
  }

  // Check if notification type exists
  if (!this.preferences[notificationType]) {
    return true; // Default to sending if type not found
  }

  // Check channel preference
  return this.preferences[notificationType][channel] === true;
};

// Method to check if within quiet hours
NotificationPreferenceSchema.methods.isQuietHours = function () {
  if (!this.quietHours.enabled) {
    return false;
  }

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  const [startHour, startMin] = this.quietHours.start.split(':').map(Number);
  const [endHour, endMin] = this.quietHours.end.split(':').map(Number);

  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  // Handle overnight quiet hours (e.g., 22:00 to 08:00)
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime <= endTime;
  }

  // Handle same-day quiet hours (e.g., 13:00 to 14:00)
  return currentTime >= startTime && currentTime <= endTime;
};

module.exports = mongoose.model('NotificationPreference', NotificationPreferenceSchema);
