const mongoose = require('mongoose');

/**
 * RoomAvailabilityLog — Every time a room's status changes
 * This is the "cycle" — vacant → occupied → vacant → price changed etc.
 * Inspired by: OYO room lifecycle, Booking.com availability tracking
 */
const RoomAvailabilityLogSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },

  // What type of event happened
  eventType: {
    type: String,
    enum: [
      'became_available',        // Room is now free/vacant
      'became_occupied',         // Tenant moved in
      'marked_unavailable',      // Owner manually blocked it
      'marked_available',        // Owner manually unblocked it
      'booking_confirmed',       // Booking confirmed, room reserved
      'booking_cancelled',       // Booking cancelled, room freed
      'price_increased',         // Rent increased
      'price_decreased',         // Rent decreased
      'tenant_checked_in',       // Physical check-in recorded
      'tenant_checked_out',      // Physical check-out recorded
      'room_listed',             // New: room listed for first time
      'room_unlisted',           // Owner removed the listing
      'maintenance_started',     // Room under maintenance
      'maintenance_ended'        // Maintenance over, room available again
    ],
    required: true
  },

  // Before/after values for what changed
  previousValue: mongoose.Schema.Types.Mixed,  // e.g., { isAvailable: true }
  newValue: mongoose.Schema.Types.Mixed,       // e.g., { isAvailable: false }

  // Who/what triggered this change
  triggeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  triggeredBySystem: {
    type: Boolean,
    default: false
  },

  // Related booking (if this event was caused by a booking)
  relatedBookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },

  // Related tenant (who moved in or out)
  relatedTenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Optional note/reason
  reason: String,

  // Metadata
  ipAddress: String,
  userAgent: String,

  occurredAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes for fast lifecycle queries
RoomAvailabilityLogSchema.index({ roomId: 1, occurredAt: -1 });
RoomAvailabilityLogSchema.index({ eventType: 1 });
RoomAvailabilityLogSchema.index({ roomId: 1, eventType: 1 });
RoomAvailabilityLogSchema.index({ relatedBookingId: 1 });
RoomAvailabilityLogSchema.index({ occurredAt: -1 });

// Static: get full history for a room
RoomAvailabilityLogSchema.statics.getRoomHistory = function (roomId) {
  return this.find({ roomId })
    .populate('triggeredBy', 'name email role')
    .populate('relatedTenantId', 'name email')
    .sort({ occurredAt: -1 });
};

// Static: calculate how many days a room was occupied in a given month
RoomAvailabilityLogSchema.statics.getOccupancyForMonth = async function (roomId, year, month) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  const events = await this.find({
    roomId,
    occurredAt: { $gte: start, $lte: end },
    eventType: { $in: ['became_occupied', 'became_available', 'tenant_checked_in', 'tenant_checked_out'] }
  }).sort({ occurredAt: 1 });

  return events;
};

module.exports = mongoose.model('RoomAvailabilityLog', RoomAvailabilityLogSchema);
