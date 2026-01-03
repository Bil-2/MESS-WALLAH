const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');
const { query, param, validationResult } = require('express-validator');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', [
  protect,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1-50'),
  query('unreadOnly').optional().isBoolean().withMessage('unreadOnly must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { page = 1, limit = 20, unreadOnly } = req.query;
    const skip = (page - 1) * limit;

    const query = { userId: req.user._id };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ userId: req.user._id, isRead: false })
    ]);

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total,
          hasMore: skip + notifications.length < total
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user._id);
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ success: false, message: 'Failed to get count' });
  }
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
router.patch('/:id/read', [
  protect,
  param('id').isMongoId().withMessage('Invalid notification ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await notification.markAsRead();

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/mark-all-read
// @access  Private
router.patch('/mark-all-read', protect, async (req, res) => {
  try {
    const result = await Notification.markAllAsRead(req.user._id);
    res.json({
      success: true,
      message: 'All notifications marked as read',
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all as read' });
  }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', [
  protect,
  param('id').isMongoId().withMessage('Invalid notification ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
});

// @desc    Clear all notifications
// @route   DELETE /api/notifications/clear-all
// @access  Private
router.delete('/clear-all', protect, async (req, res) => {
  try {
    const result = await Notification.deleteMany({ userId: req.user._id });
    res.json({
      success: true,
      message: 'All notifications cleared',
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('Clear all error:', error);
    res.status(500).json({ success: false, message: 'Failed to clear notifications' });
  }
});

// @desc    Get notification preferences
// @route   GET /api/notifications/preferences
// @access  Private
router.get('/preferences', protect, async (req, res) => {
  try {
    const NotificationPreference = require('../models/NotificationPreference');
    const preferences = await NotificationPreference.getOrCreate(req.user._id);

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ success: false, message: 'Failed to get preferences' });
  }
});

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
  try {
    const NotificationPreference = require('../models/NotificationPreference');
    const { preferences, quietHours, preferredChannel, globalMute, marketing } = req.body;

    let userPreferences = await NotificationPreference.findOne({ userId: req.user._id });

    if (!userPreferences) {
      userPreferences = new NotificationPreference({ userId: req.user._id });
    }

    // Update fields if provided
    if (preferences) userPreferences.preferences = { ...userPreferences.preferences, ...preferences };
    if (quietHours) userPreferences.quietHours = { ...userPreferences.quietHours, ...quietHours };
    if (preferredChannel) userPreferences.preferredChannel = preferredChannel;
    if (typeof globalMute === 'boolean') userPreferences.globalMute = globalMute;
    if (marketing) userPreferences.marketing = { ...userPreferences.marketing, ...marketing };

    await userPreferences.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: userPreferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ success: false, message: 'Failed to update preferences' });
  }
});

// @desc    Track notification click
// @route   PATCH /api/notifications/:id/clicked
// @access  Private
router.patch('/:id/clicked', [
  protect,
  param('id').isMongoId().withMessage('Invalid notification ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { actionLabel } = req.body;

    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await notification.trackClick(actionLabel);

    res.json({
      success: true,
      message: 'Click tracked successfully',
      data: { actionLabel }
    });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ success: false, message: 'Failed to track click' });
  }
});

// @desc    Create notification from template
// @route   POST /api/notifications/from-template
// @access  Private (for testing/admin)
router.post('/from-template', protect, async (req, res) => {
  try {
    const { templateName, data, targetUserId } = req.body;

    if (!templateName || !data) {
      return res.status(400).json({
        success: false,
        message: 'Template name and data are required'
      });
    }

    const notificationTemplates = require('../utils/notificationTemplates');
    const userId = targetUserId || req.user._id;

    // Create notification from template
    const notificationData = notificationTemplates.createFromTemplate(
      templateName,
      data,
      userId
    );

    // Check user preferences before creating
    const NotificationPreference = require('../models/NotificationPreference');
    const preferences = await NotificationPreference.getOrCreate(userId);

    // Respect user preferences for channels
    if (notificationData.channels) {
      for (const channel of ['inApp', 'email', 'sms', 'push']) {
        if (notificationData.channels[channel] && notificationData.channels[channel].enabled) {
          // Check if user has enabled this notification type for this channel
          const shouldSend = preferences.shouldSend(templateName, channel);
          notificationData.channels[channel].enabled = shouldSend;
        }
      }
    }

    // Check quiet hours
    if (preferences.isQuietHours() && !['payment_failed', 'booking_cancelled'].includes(templateName)) {
      // Delay non-urgent notifications until quiet hours end
      const quietEnd = preferences.quietHours.end.split(':');
      const scheduledTime = new Date();
      scheduledTime.setHours(parseInt(quietEnd[0]), parseInt(quietEnd[1]), 0);

      // If quiet hours end is earlier than current time, schedule for tomorrow
      if (scheduledTime < new Date()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      notificationData.scheduledFor = scheduledTime;
    }

    const notification = await Notification.createNotification(notificationData);

    res.status(201).json({
      success: true,
      message: 'Notification created from template',
      data: notification
    });
  } catch (error) {
    console.error('Create from template error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create notification'
    });
  }
});

// @desc    Get available notification templates
// @route   GET /api/notifications/templates
// @access  Private
router.get('/templates', protect, async (req, res) => {
  try {
    const notificationTemplates = require('../utils/notificationTemplates');
    const templates = notificationTemplates.getAvailableTemplates();

    res.json({
      success: true,
      data: { templates }
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ success: false, message: 'Failed to get templates' });
  }
});

module.exports = router;


