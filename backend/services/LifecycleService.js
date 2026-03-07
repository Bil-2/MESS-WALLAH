const RevenueEvent = require('../models/RevenueEvent');
const RoomAvailabilityLog = require('../models/RoomAvailabilityLog');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const GuestHistory = require('../models/GuestHistory');
const Room = require('../models/Room');

class LifecycleService {
  /**
   * Room Lifecycle Events
   */
  static async recordRoomStatusChange({ roomId, eventType, previousValue, newValue, triggeredBy, relatedBookingId, relatedTenantId, reason, req }) {
    try {
      await RoomAvailabilityLog.create({
        roomId,
        eventType,
        previousValue,
        newValue,
        triggeredBy,
        relatedBookingId,
        relatedTenantId,
        reason,
        ipAddress: req ? req.ip : null,
        userAgent: req ? req.get('User-Agent') : null
      });

      // If price changed, update room history
      if (eventType === 'price_increased' || eventType === 'price_decreased') {
        await Room.findByIdAndUpdate(roomId, {
          $push: {
            priceHistory: { price: newValue, changedBy: triggeredBy, reason }
          }
        });
      }
    } catch (error) {
      console.error('LifecycleService Error (RoomStatus):', error);
    }
  }

  /**
   * Revenue Events
   */
  static async recordIncome({ type, amount, roomId, bookingId, ownerId, tenantId, paymentMethod, transactionId, description, recordedBy }) {
    try {
      await RevenueEvent.create({
        type,
        amount,
        roomId,
        bookingId,
        ownerId,
        tenantId,
        paymentMethod,
        transactionId,
        description,
        recordedBy,
        status: 'completed'
      });
    } catch (error) {
      console.error('LifecycleService Error (Revenue):', error);
    }
  }

  /**
   * Analytics Events
   */
  static async trackEvent({ event, userId, userRole, roomId, searchQuery, page, req }) {
    try {
      await AnalyticsEvent.create({
        event,
        userId,
        userRole,
        roomId,
        searchQuery,
        page,
        device: req ? (req.useragent?.isMobile ? 'mobile' : req.useragent?.isTablet ? 'tablet' : 'desktop') : 'unknown',
        browser: req ? req.useragent?.browser : null,
        os: req ? req.useragent?.os : null,
        ipAddress: req ? req.ip : null,
        referrer: req ? req.get('Referrer') : null
      });
    } catch (error) {
      // Don't crash on analytics failure
      console.error('LifecycleService Error (Analytics):', error);
    }
  }

  /**
   * Guest History
   */
  static async startGuestStay({ roomId, ownerId, tenantId, bookingId, contractStartDate, rentPerMonth, depositPaid }) {
    try {
      await GuestHistory.create({
        roomId,
        ownerId,
        tenantId,
        bookingId,
        contractStartDate,
        rentPerMonth,
        depositPaid,
        status: 'active'
      });

      // Update room occupancy stats
      await Room.findByIdAndUpdate(roomId, {
        lastOccupiedAt: new Date(),
        $inc: { totalGuestsHosted: 1 }
      });
    } catch (error) {
      console.error('LifecycleService Error (StartGuestStay):', error);
    }
  }

  static async endGuestStay({ bookingId, actualCheckOut, exitReason, exitNotes }) {
    try {
      const stay = await GuestHistory.findOneAndUpdate(
        { bookingId },
        {
          actualCheckOut,
          exitReason,
          exitNotes,
          status: exitReason === 'contract_ended' ? 'completed' : 'early_exit'
        },
        { new: true }
      );

      if (stay) {
        // Calculate total duration in months (roughly)
        const durationMonths = (actualCheckOut - stay.contractStartDate) / (1000 * 60 * 60 * 24 * 30);
        stay.durationMonths = Math.max(0, parseFloat(durationMonths.toFixed(1)));
        await stay.save();

        // Update room stats
        await Room.findByIdAndUpdate(stay.roomId, {
          lastVacantAt: new Date()
        });
      }
    } catch (error) {
      console.error('LifecycleService Error (EndGuestStay):', error);
    }
  }
}

module.exports = LifecycleService;
