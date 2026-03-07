const mongoose = require('mongoose');

/**
 * AnalyticsEvent — Every user action on the platform
 * Like having your own Google Analytics inside your database
 * Inspired by: Booking.com, Airbnb, OYO conversion tracking
 */
const AnalyticsEventSchema = new mongoose.Schema({
  // What happened
  event: {
    type: String,
    enum: [
      // Discovery
      'page_viewed',            // Any page visited
      'room_searched',          // Search executed
      'room_viewed',            // Room detail page opened
      'room_image_viewed',      // Images scrolled in lightbox
      'city_filter_applied',    // City filter used
      'price_filter_applied',   // Budget filter used
      'amenity_filter_applied', // Amenity filter used
      'available_now_filter',   // "Available Now" chip used
      'verified_filter_applied',// "Verified Only" filter used

      // Interest
      'favorite_added',         // Room saved to favorites
      'favorite_removed',       // Room removed from favorites
      'whatsapp_clicked',       // WhatsApp button tapped
      'phone_clicked',          // Call owner tapped
      'share_clicked',          // Share button tapped
      'similar_room_clicked',   // Clicked a similar room

      // Conversion funnel
      'booking_started',        // Book Now clicked
      'booking_form_submitted', // Booking form filled and submitted
      'booking_completed',      // Booking confirmed by system
      'booking_cancelled',      // Booking cancelled

      // Owner actions
      'room_listed',            // Owner added a new room
      'room_updated',           // Owner edited a room
      'room_deleted',           // Owner deleted a room
      'booking_accepted',       // Owner confirmed a request
      'booking_rejected',       // Owner rejected a request

      // Auth
      'user_registered',        // New user signed up
      'user_logged_in',         // Login
      'user_logged_out',        // Logout
    ],
    required: true
  },

  // Session (anonymous or logged-in)
  sessionId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userRole: {
    type: String,
    enum: ['user', 'student', 'owner', 'admin', 'anonymous']
  },

  // What room was this about (if applicable)
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },

  // Search metadata (for room_searched events)
  searchQuery: {
    city: String,
    area: String,
    minRent: Number,
    maxRent: Number,
    roomType: String,
    amenities: [String],
    resultsCount: Number
  },

  // Page info
  page: String,       // e.g., '/rooms', '/rooms/abc123'
  referrer: String,   // Where they came from

  // Device info
  device: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop', 'unknown'],
    default: 'unknown'
  },
  os: String,         // iOS, Android, Windows, macOS
  browser: String,    // Chrome, Safari, Firefox

  // Location
  ipAddress: String,
  city: String,       // Derived from IP
  country: String,

  // Related booking (for booking events)
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },

  // Extra context
  metadata: mongoose.Schema.Types.Mixed,

  occurredAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: false }); // No auto timestamps, we use occurredAt

// Indexes for analytics queries
AnalyticsEventSchema.index({ event: 1, occurredAt: -1 });
AnalyticsEventSchema.index({ userId: 1, occurredAt: -1 });
AnalyticsEventSchema.index({ roomId: 1, event: 1 });
AnalyticsEventSchema.index({ sessionId: 1 });
AnalyticsEventSchema.index({ 'searchQuery.city': 1 });
// TTL: automatically delete analytics events older than 2 years
AnalyticsEventSchema.index({ occurredAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 * 2 });

// Static: get most popular rooms by views
AnalyticsEventSchema.statics.getTopRooms = function (limit = 10) {
  return this.aggregate([
    { $match: { event: 'room_viewed' } },
    { $group: { _id: '$roomId', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: limit }
  ]);
};

// Static: get top searched cities
AnalyticsEventSchema.statics.getTopSearchCities = function () {
  return this.aggregate([
    { $match: { event: 'room_searched', 'searchQuery.city': { $exists: true } } },
    { $group: { _id: '$searchQuery.city', searches: { $sum: 1 } } },
    { $sort: { searches: -1 } },
    { $limit: 10 }
  ]);
};

module.exports = mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
