const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { rateLimiters } = require('../middleware/advancedSecurity');

const router = express.Router();

// Apply rate limiting and authentication to all routes
router.use(rateLimiters.general);
router.use(protect);

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
router.get('/dashboard', async (req, res) => {
  try {
    // Mock analytics data
    const analytics = {
      totalRooms: 150,
      totalBookings: 89,
      totalRevenue: 45000,
      occupancyRate: 78,
      recentBookings: [],
      popularLocations: ['Delhi', 'Mumbai', 'Bangalore'],
      monthlyStats: {
        bookings: [12, 19, 15, 25, 22, 18, 30],
        revenue: [15000, 22000, 18000, 28000, 25000, 20000, 35000]
      }
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get property analytics
// @route   GET /api/analytics/property/:id
// @access  Private
router.get('/property/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Mock property analytics
    const analytics = {
      propertyId: id,
      views: 245,
      bookings: 12,
      revenue: 18000,
      rating: 4.5,
      occupancyRate: 85,
      monthlyViews: [45, 52, 38, 67, 59, 48, 72],
      bookingTrends: [2, 3, 1, 4, 2, 3, 5]
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching property analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Generate analytics report
// @route   POST /api/analytics/reports/generate
// @access  Private (Admin only)
router.post('/reports/generate', [
  rateLimiters.reports,
  authorize('admin'),
  body('reportType').isIn(['monthly', 'quarterly', 'yearly']),
  body('format').optional().isIn(['pdf', 'csv', 'json'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { reportType, format = 'json' } = req.body;

    // Mock report generation
    const report = {
      id: Date.now().toString(),
      type: reportType,
      format,
      generatedAt: new Date(),
      status: 'completed',
      downloadUrl: `/api/analytics/reports/download/${Date.now()}`
    };

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
