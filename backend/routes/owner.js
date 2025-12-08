const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getOwnerAnalytics, getPricingSuggestions } = require('../controllers/ownerController');

// Protect all routes - must be logged in
router.use(protect);

// Authorize only owners
router.use(authorize('owner'));

// @route   GET /api/owner/analytics
// @desc    Get owner analytics dashboard data
// @access  Private (Owner only)
router.get('/analytics', getOwnerAnalytics);

// @route   GET /api/owner/pricing-suggestions/:roomId
// @desc    Get smart pricing suggestions for a room
// @access  Private (Owner only)
router.get('/pricing-suggestions/:roomId', getPricingSuggestions);

module.exports = router;
