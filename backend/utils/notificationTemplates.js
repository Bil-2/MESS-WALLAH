/**
 * Notification Templates Service
 * Provides reusable, personalized notification templates
 */

/**
 * Template rendering function
 * Replaces {{variables}} with actual values
 */
const renderTemplate = (template, data) => {
  let rendered = template;

  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, value || '');
  }

  return rendered;
};

/**
 * Notification Templates
 * Each template includes title, message, and optional media/actions
 */
const templates = {
  // Booking Templates
  booking_request: {
    title: 'New Booking Request',
    message: '{{userName}} has requested to book {{roomName}} from {{checkInDate}}.',
    priority: 'high',
    getActions: (data) => [
      {
        label: 'View Booking',
        action: 'navigate',
        url: `/owner/bookings/${data.bookingId}`,
        style: 'primary'
      },
      {
        label: 'Accept',
        action: 'api_call',
        url: `/api/bookings/${data.bookingId}/status`,
        style: 'success'
      }
    ],
    channels: { inApp: true, email: true, push: true }
  },

  booking_confirmed: {
    title: 'Booking Confirmed! 🎉',
    message: 'Your booking for {{roomName}} has been confirmed. Check-in: {{checkInDate}}',
    priority: 'high',
    getMedia: (data) => ({
      imageUrl: data.roomImageUrl,
      altText: `${data.roomName} room photo`
    }),
    getActions: (data) => [
      {
        label: 'View Booking',
        action: 'navigate',
        url: `/bookings/${data.bookingId}`,
        style: 'primary'
      },
      {
        label: 'Contact Owner',
        action: 'navigate',
        url: `/messages/${data.ownerId}`,
        style: 'secondary'
      }
    ],
    channels: { inApp: true, email: true, sms: true, push: true }
  },

  booking_rejected: {
    title: 'Booking Request Update',
    message: 'Unfortunately, your request for {{roomName}} was not approved. Browse other available rooms.',
    priority: 'normal',
    getActions: (data) => [
      {
        label: 'Browse Rooms',
        action: 'navigate',
        url: '/rooms/search',
        style: 'primary'
      },
      {
        label: 'View Similar',
        action: 'navigate',
        url: `/rooms/similar/${data.roomId}`,
        style: 'secondary'
      }
    ],
    channels: { inApp: true, email: true, push: true }
  },

  booking_cancelled: {
    title: 'Booking Cancelled',
    message: 'Booking for {{roomName}} has been cancelled. {{refundInfo}}',
    priority: 'high',
    getActions: (data) => [
      {
        label: 'View Details',
        action: 'navigate',
        url: `/bookings/${data.bookingId}`,
        style: 'primary'
      }
    ],
    channels: { inApp: true, email: true, push: true }
  },

  // Payment Templates
  payment_success: {
    title: 'Payment Successful ✓',
    message: 'Payment of ₹{{amount}} for {{roomName}} received. Thank you!',
    priority: 'high',
    getActions: (data) => [
      {
        label: 'View Receipt',
        action: 'navigate',
        url: `/payments/${data.paymentId}`,
        style: 'primary'
      },
      {
        label: 'View Booking',
        action: 'navigate',
        url: `/bookings/${data.bookingId}`,
        style: 'secondary'
      }
    ],
    channels: { inApp: true, email: true, sms: true, push: true }
  },

  payment_failed: {
    title: 'Payment Failed',
    message: 'Payment of ₹{{amount}} for {{roomName}} could not be processed. Please retry.',
    priority: 'urgent',
    getActions: (data) => [
      {
        label: 'Retry Payment',
        action: 'navigate',
        url: `/payments/retry/${data.bookingId}`,
        style: 'danger'
      },
      {
        label: 'Contact Support',
        action: 'navigate',
        url: '/support',
        style: 'secondary'
      }
    ],
    channels: { inApp: true, email: true, sms: true, push: true }
  },

  refund_initiated: {
    title: 'Refund Initiated',
    message: 'Refund of ₹{{amount}} for {{roomName}} has been initiated. It will be credited within 5-7 business days.',
    priority: 'normal',
    getActions: (data) => [
      {
        label: 'View Details',
        action: 'navigate',
        url: `/refunds/${data.refundId}`,
        style: 'primary'
      }
    ],
    channels: { inApp: true, email: true, push: true }
  },

  refund_completed: {
    title: 'Refund Completed ✓',
    message: 'Refund of ₹{{amount}} has been credited to your account.',
    priority: 'normal',
    getActions: (data) => [
      {
        label: 'View Transaction',
        action: 'navigate',
        url: `/transactions/${data.transactionId}`,
        style: 'primary'
      }
    ],
    channels: { inApp: true, email: true, push: true }
  },

  // Communication Templates
  message_received: {
    title: 'New Message',
    message: '{{senderName}}: {{messagePreview}}',
    priority: 'normal',
    getActions: (data) => [
      {
        label: 'Reply',
        action: 'navigate',
        url: `/messages/${data.conversationId}`,
        style: 'primary'
      }
    ],
    channels: { inApp: true, push: true }
  },

  review_received: {
    title: 'New Review on Your Property',
    message: '{{reviewerName}} left a {{rating}}-star review for {{roomName}}.',
    priority: 'low',
    getActions: (data) => [
      {
        label: 'View Review',
        action: 'navigate',
        url: `/rooms/${data.roomId}/reviews`,
        style: 'primary'
      },
      {
        label: 'Respond',
        action: 'navigate',
        url: `/reviews/${data.reviewId}/respond`,
        style: 'secondary'
      }
    ],
    channels: { inApp: true, email: true }
  },

  // Check-in Reminders
  checkin_reminder_24h: {
    title: 'Check-in Tomorrow! 📅',
    message: 'Your check-in at {{roomName}} is tomorrow at {{checkInTime}}. Safe travels!',
    priority: 'high',
    getMedia: (data) => ({
      imageUrl: data.roomImageUrl,
      altText: `${data.roomName} room photo`
    }),
    getActions: (data) => [
      {
        label: 'View Directions',
        action: 'external',
        url: data.mapUrl,
        style: 'primary'
      },
      {
        label: 'Contact Owner',
        action: 'navigate',
        url: `/messages/${data.ownerId}`,
        style: 'secondary'
      }
    ],
    channels: { inApp: true, email: true, sms: true, push: true }
  },

  checkin_reminder_1h: {
    title: 'Check-in in 1 Hour ⏰',
    message: 'Your check-in at {{roomName}} is in 1 hour. Here are the details.',
    priority: 'urgent',
    getActions: (data) => [
      {
        label: 'View Details',
        action: 'navigate',
        url: `/bookings/${data.bookingId}`,
        style: 'primary'
      },
      {
        label: 'Call Owner',
        action: 'external',
        url: `tel:${data.ownerPhone}`,
        style: 'success'
      }
    ],
    channels: { inApp: true, sms: true, push: true }
  },

  // Promotional Templates
  special_offer: {
    title: '{{offerTitle}} 🎁',
    message: '{{offerDescription}} Use code: {{promoCode}}',
    priority: 'low',
    getMedia: (data) => ({
      imageUrl: data.offerImageUrl,
      altText: data.offerTitle
    }),
    getActions: (data) => [
      {
        label: 'Browse Rooms',
        action: 'navigate',
        url: '/rooms/search?promo=' + data.promoCode,
        style: 'primary'
      }
    ],
    channels: { inApp: true, email: true }
  },

  // Feedback Templates
  review_request: {
    title: 'How Was Your Stay?',
    message: 'We hope you enjoyed your stay at {{roomName}}! Share your experience.',
    priority: 'low',
    getActions: (data) => [
      {
        label: 'Write Review',
        action: 'navigate',
        url: `/bookings/${data.bookingId}/review`,
        style: 'primary'
      },
      {
        label: 'Maybe Later',
        action: 'dismiss',
        style: 'secondary'
      }
    ],
    channels: { inApp: true, email: true }
  },

  // System Templates
  system: {
    title: '{{title}}',
    message: '{{message}}',
    priority: 'normal',
    channels: { inApp: true }
  }
};

/**
 * Create notification from template
 * @param {String} templateName - Name of the template
 * @param {Object} data - Data to populate the template
 * @param {String} userId - User ID to send notification to
 * @returns {Object} - Notification data ready to be saved
 */
const createFromTemplate = (templateName, data, userId) => {
  const template = templates[templateName];

  if (!template) {
    throw new Error(`Template '${templateName}' not found`);
  }

  // Render title and message
  const title = renderTemplate(template.title, data);
  const message = renderTemplate(template.message, data);

  // Build notification object
  const notification = {
    userId,
    type: templateName,
    title,
    message,
    priority: template.priority || 'normal',
    data: {
      bookingId: data.bookingId,
      roomId: data.roomId,
      amount: data.amount,
      metadata: data
    },
    personalization: {
      userName: data.userName,
      roomName: data.roomName,
      ownerName: data.ownerName,
      customData: data
    }
  };

  // Add media if template provides it
  if (template.getMedia) {
    notification.media = template.getMedia(data);
  }

  // Add actions if template provides them
  if (template.getActions) {
    notification.actions = template.getActions(data);
  }

  // Set channel preferences from template
  if (template.channels) {
    notification.channels = {
      inApp: { enabled: template.channels.inApp || false },
      email: { enabled: template.channels.email || false },
      sms: { enabled: template.channels.sms || false },
      push: { enabled: template.channels.push || false }
    };
  }

  return notification;
};

/**
 * Get available templates
 * @returns {Array} - List of template names
 */
const getAvailableTemplates = () => {
  return Object.keys(templates);
};

module.exports = {
  templates,
  createFromTemplate,
  getAvailableTemplates,
  renderTemplate
};
