const express = require('express');
const { body, query } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  rateLimiters,
  csrfProtection
} = require('../middleware/advancedSecurity');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  archiveNotifications,
  deleteNotifications,
  createNotification,
  getNotificationStats,
  updateNotificationPreferences
} = require('../controllers/notificationController');

const router = express.Router();

// Apply rate limiting to all notification routes
router.use(rateLimiters.general);

// All routes require authentication
router.use(protect);

// @desc    Get user notifications with pagination and filtering
// @route   GET /api/notifications
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),
  query('type').optional().isIn([
    'booking_request', 'booking_confirmed', 'booking_rejected', 'booking_cancelled',
    'payment_received', 'payment_failed', 'room_available', 'room_unavailable',
    'profile_updated', 'new_message', 'system_announcement', 'reminder', 'welcome'
  ]).withMessage('Invalid notification type'),
  query('category').optional().isIn(['booking', 'payment', 'room', 'system', 'social', 'reminder']).withMessage('Invalid category'),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  query('isRead').optional().isBoolean().withMessage('isRead must be a boolean'),
  query('isArchived').optional().isBoolean().withMessage('isArchived must be a boolean')
], getNotifications);

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', getUnreadCount);

// @desc    Get notification statistics
// @route   GET /api/notifications/stats
// @access  Private
router.get('/stats', getNotificationStats);

// @desc    Mark notifications as read
// @route   PATCH /api/notifications/mark-read
// @access  Private
router.patch('/mark-read', [
  csrfProtection,
  body('notificationIds')
    .isArray({ min: 1 })
    .withMessage('Notification IDs array is required')
    .custom((value) => {
      if (!value.every(id => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/))) {
        throw new Error('All notification IDs must be valid MongoDB ObjectIds');
      }
      return true;
    })
], markAsRead);

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/mark-all-read
// @access  Private
router.patch('/mark-all-read', csrfProtection, markAllAsRead);

// @desc    Archive notifications
// @route   PATCH /api/notifications/archive
// @access  Private
router.patch('/archive', [
  csrfProtection,
  body('notificationIds')
    .isArray({ min: 1 })
    .withMessage('Notification IDs array is required')
    .custom((value) => {
      if (!value.every(id => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/))) {
        throw new Error('All notification IDs must be valid MongoDB ObjectIds');
      }
      return true;
    })
], archiveNotifications);

// @desc    Delete notifications
// @route   DELETE /api/notifications
// @access  Private
router.delete('/', [
  csrfProtection,
  body('notificationIds')
    .isArray({ min: 1 })
    .withMessage('Notification IDs array is required')
    .custom((value) => {
      if (!value.every(id => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/))) {
        throw new Error('All notification IDs must be valid MongoDB ObjectIds');
      }
      return true;
    })
], deleteNotifications);

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
router.put('/preferences', [
  csrfProtection,
  body('preferences').isObject().withMessage('Preferences must be an object'),
  body('preferences.email').optional().isBoolean().withMessage('Email preference must be boolean'),
  body('preferences.sms').optional().isBoolean().withMessage('SMS preference must be boolean'),
  body('preferences.push').optional().isBoolean().withMessage('Push preference must be boolean'),
  body('preferences.inApp').optional().isBoolean().withMessage('In-app preference must be boolean'),
  body('preferences.bookingUpdates').optional().isBoolean().withMessage('Booking updates preference must be boolean'),
  body('preferences.paymentAlerts').optional().isBoolean().withMessage('Payment alerts preference must be boolean'),
  body('preferences.roomAlerts').optional().isBoolean().withMessage('Room alerts preference must be boolean'),
  body('preferences.systemAnnouncements').optional().isBoolean().withMessage('System announcements preference must be boolean'),
  body('preferences.marketingEmails').optional().isBoolean().withMessage('Marketing emails preference must be boolean')
], updateNotificationPreferences);

// Admin-only routes
// @desc    Create notification (Admin/System use)
// @route   POST /api/notifications
// @access  Private (Admin only)
router.post('/', [
  authorize('admin'),
  csrfProtection,
  body('recipient').isMongoId().withMessage('Valid recipient ID is required'),
  body('type').isIn([
    'booking_request', 'booking_confirmed', 'booking_rejected', 'booking_cancelled',
    'payment_received', 'payment_failed', 'room_available', 'room_unavailable',
    'profile_updated', 'new_message', 'system_announcement', 'reminder', 'welcome'
  ]).withMessage('Invalid notification type'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1-100 characters'),
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message must be between 1-500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('category').optional().isIn(['booking', 'payment', 'room', 'system', 'social', 'reminder']).withMessage('Invalid category'),
  body('actionUrl').optional().isURL().withMessage('Action URL must be valid'),
  body('actionText').optional().trim().isLength({ max: 50 }).withMessage('Action text cannot exceed 50 characters'),
  body('scheduledFor').optional().isISO8601().withMessage('Scheduled date must be valid ISO8601 format'),
  body('expiresAt').optional().isISO8601().withMessage('Expiry date must be valid ISO8601 format'),
  body('deliveryChannels').optional().isObject().withMessage('Delivery channels must be an object'),
  body('deliveryChannels.inApp').optional().isBoolean().withMessage('In-app delivery must be boolean'),
  body('deliveryChannels.email').optional().isBoolean().withMessage('Email delivery must be boolean'),
  body('deliveryChannels.sms').optional().isBoolean().withMessage('SMS delivery must be boolean'),
  body('deliveryChannels.push').optional().isBoolean().withMessage('Push delivery must be boolean'),
  body('data').optional().isObject().withMessage('Data must be an object'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object'),
  body('metadata.roomId').optional().isMongoId().withMessage('Room ID must be valid'),
  body('metadata.bookingId').optional().isMongoId().withMessage('Booking ID must be valid'),
  body('metadata.userId').optional().isMongoId().withMessage('User ID must be valid')
], createNotification);

module.exports = router;
