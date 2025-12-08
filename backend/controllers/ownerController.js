const Room = require('../models/Room');
const Booking = require('../models/Booking');

/**
 * @desc    Get owner analytics
 * @route   GET /api/owner/analytics
 * @access  Private (Owner only)
 */
exports.getOwnerAnalytics = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // 1. Get all owner's rooms
    const rooms = await Room.find({ owner: ownerId });

    if (rooms.length === 0) {
      return res.json({
        success: true,
        data: {
          overview: {
            totalRooms: 0,
            occupiedRooms: 0,
            occupancyRate: 0,
            avgRent: 0,
            totalViews: 0,
            conversionRate: 0
          },
          trends: {
            revenueByMonth: []
          }
        }
      });
    }

    // 2. Get all bookings for these rooms
    const roomIds = rooms.map(r => r._id);
    const bookings = await Booking.find({
      room: { $in: roomIds }
    });

    // 3. Calculate metrics
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.isOccupied || false).length;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    // 4. Calculate total views (sum of all room views)
    const totalViews = rooms.reduce((sum, room) => sum + (room.views || 0), 0);

    // 5. Calculate conversion rate
    const totalBookings = bookings.length;
    const conversionRate = totalViews > 0 ? (totalBookings / totalViews) * 100 : 0;

    // 6. Calculate average rent
    const avgRent = totalRooms > 0
      ? rooms.reduce((sum, r) => sum + (r.rentPerMonth || 0), 0) / totalRooms
      : 0;

    // 7. Calculate revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueByMonth = await Booking.aggregate([
      {
        $match: {
          room: { $in: roomIds },
          createdAt: { $gte: sixMonthsAgo },
          status: { $in: ['confirmed', 'active', 'completed'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // 8. Calculate period comparison (for trend indicators)
    const lastMonthBookings = bookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return bookingDate >= lastMonth;
    }).length;

    const previousMonthBookings = bookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return bookingDate >= twoMonthsAgo && bookingDate < lastMonth;
    }).length;

    const bookingTrend = previousMonthBookings > 0
      ? ((lastMonthBookings - previousMonthBookings) / previousMonthBookings) * 100
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalRooms,
          occupiedRooms,
          occupancyRate: parseFloat(occupancyRate.toFixed(1)),
          avgRent: Math.round(avgRent),
          totalViews,
          totalBookings,
          conversionRate: parseFloat(conversionRate.toFixed(1)),
          bookingTrend: parseFloat(bookingTrend.toFixed(1))
        },
        trends: {
          revenueByMonth
        }
      }
    });
  } catch (error) {
    console.error('Error in getOwnerAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

/**
 * @desc    Get pricing suggestions for a specific room
 * @route   GET /api/owner/pricing-suggestions/:roomId
 * @access  Private (Owner only)
 */
exports.getPricingSuggestions = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Verify owner
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this room'
      });
    }

    // 1. Find similar rooms in same city and type
    const similarRooms = await Room.find({
      city: room.city,
      roomType: room.roomType,
      _id: { $ne: roomId }, // Exclude current room
      isAvailable: true,
      isActive: true
    }).select('rentPerMonth');

    if (similarRooms.length === 0) {
      return res.json({
        success: true,
        data: {
          currentPrice: room.rentPerMonth,
          suggestedPrice: room.rentPerMonth,
          priceDiff: 0,
          reason: 'No similar rooms found for comparison in your city',
          marketRange: null,
          similarRoomsCount: 0
        }
      });
    }

    // 2. Calculate market statistics
    const prices = similarRooms.map(r => r.rentPerMonth);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Calculate median (more robust than average)
    const sortedPrices = [...prices].sort((a, b) => a - b);
    const medianPrice = sortedPrices.length % 2 === 0
      ? (sortedPrices[sortedPrices.length / 2 - 1] + sortedPrices[sortedPrices.length / 2]) / 2
      : sortedPrices[Math.floor(sortedPrices.length / 2)];

    // 3. Apply seasonal adjustments (India-specific)
    const currentMonth = new Date().getMonth(); // 0-11
    let seasonalAdjustment = 1.0;
    let seasonReason = '';

    // June-July (College/University starts) = +10%
    if (currentMonth >= 5 && currentMonth <= 6) {
      seasonalAdjustment = 1.1;
      seasonReason = 'College semester starting - high demand period';
    }
    // December-January (Exam season + New year) = +5%
    else if (currentMonth === 11 || currentMonth === 0) {
      seasonalAdjustment = 1.05;
      seasonReason = 'Exam season and new year - moderate demand';
    }
    // March-April (Academic year end) = -5%
    else if (currentMonth >= 2 && currentMonth <= 3) {
      seasonalAdjustment = 0.95;
      seasonReason = 'Academic year ending - lower demand';
    }

    // 4. Calculate suggested price
    const baseSuggestion = medianPrice * seasonalAdjustment;
    const suggestedPrice = Math.round(baseSuggestion / 100) * 100; // Round to nearest 100

    const priceDiff = suggestedPrice - room.rentPerMonth;
    const percentDiff = ((priceDiff / room.rentPerMonth) * 100).toFixed(1);

    // 5. Generate intelligent reason
    let reason = '';
    let recommendation = '';

    if (Math.abs(priceDiff) < 500) {
      reason = 'Your pricing is competitive with the market';
      recommendation = 'maintain';
    } else if (priceDiff > 500) {
      reason = `Similar rooms are priced ${percentDiff}% higher (₹${Math.abs(priceDiff).toLocaleString()} more)`;
      if (seasonalAdjustment > 1) {
        reason += `. ${seasonReason} - perfect time to increase!`;
      }
      recommendation = 'increase';
    } else {
      reason = `Your price is ${Math.abs(percentDiff)}% above market average`;
      recommendation = 'decrease';
    }

    // 6. Estimate potential revenue impact
    const potentialRevenue = priceDiff > 0
      ? `+₹${(priceDiff * 12).toLocaleString()} per year`
      : null;

    res.json({
      success: true,
      data: {
        currentPrice: room.rentPerMonth,
        suggestedPrice,
        priceDiff,
        percentDiff: parseFloat(percentDiff),
        reason,
        recommendation,
        marketRange: {
          min: minPrice,
          max: maxPrice,
          median: Math.round(medianPrice)
        },
        similarRoomsCount: similarRooms.length,
        seasonalFactor: seasonalAdjustment,
        seasonReason: seasonReason || 'Normal demand period',
        potentialRevenue
      }
    });
  } catch (error) {
    console.error('Error in getPricingSuggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating pricing suggestions',
      error: error.message
    });
  }
};
