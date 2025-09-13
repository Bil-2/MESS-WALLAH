const { body, validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const { sendNotificationToUser } = require('../utils/socket');

// @desc    Get user notifications with pagination and filtering
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      category,
      priority,
      isRead,
      isArchived = false
    } = req.query;

    const query = {
      recipient: req.user.id,
      isArchived: isArchived === 'true'
    };

    // Add filters
    if (type) query.type = type;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'sender', select: 'name profile.avatar' },
        { path: 'metadata.roomId', select: 'title location.city photos' },
        { path: 'metadata.bookingId', select: 'checkInDate checkOutDate status' }
      ]
    };

    const notifications = await Notification.paginate(query, options);

    res.status(200).json({
      success: true,
      data: notifications,
      message: 'Notifications retrieved successfully'
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications'
    });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.id);

    res.status(200).json({
      success: true,
      data: { count },
      message: 'Unread count retrieved successfully'
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
};

// @desc    Mark notifications as read
// @route   PATCH /api/notifications/mark-read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { notificationIds } = req.body;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Notification IDs array is required'
      });
    }

    const result = await Notification.markAsRead(notificationIds, req.user.id);
    const unreadCount = await Notification.getUnreadCount(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        unreadCount
      },
      message: 'Notifications marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read'
    });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        recipient: req.user.id,
        isRead: false,
        isArchived: false
      },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );

    const unreadCount = await Notification.getUnreadCount(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        unreadCount
      },
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
};

// @desc    Archive notifications
// @route   PATCH /api/notifications/archive
// @access  Private
const archiveNotifications = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { notificationIds } = req.body;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Notification IDs array is required'
      });
    }

    const result = await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        recipient: req.user.id,
        isArchived: false
      },
      {
        $set: {
          isArchived: true,
          archivedAt: new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      data: { modifiedCount: result.modifiedCount },
      message: 'Notifications archived successfully'
    });
  } catch (error) {
    console.error('Archive notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to archive notifications'
    });
  }
};

// @desc    Delete notifications
// @route   DELETE /api/notifications
// @access  Private
const deleteNotifications = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { notificationIds } = req.body;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Notification IDs array is required'
      });
    }

    const result = await Notification.deleteMany({
      _id: { $in: notificationIds },
      recipient: req.user.id
    });

    res.status(200).json({
      success: true,
      data: { deletedCount: result.deletedCount },
      message: 'Notifications deleted successfully'
    });
  } catch (error) {
    console.error('Delete notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notifications'
    });
  }
};

// @desc    Create notification (Admin/System use)
// @route   POST /api/notifications
// @access  Private (Admin only)
const createNotification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const notificationData = {
      ...req.body,
      sender: req.user.id
    };

    const notification = await Notification.createNotification(notificationData);

    // Send real-time notification
    if (notification.deliveryChannels.inApp) {
      await sendNotificationToUser(notification.recipient, notification);
    }

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
};

// @desc    Get notification statistics
// @route   GET /api/notifications/stats
// @access  Private
const getNotificationStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Notification.aggregate([
      { $match: { recipient: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: {
            $sum: {
              $cond: [{ $eq: ['$isRead', false] }, 1, 0]
            }
          },
          archived: {
            $sum: {
              $cond: [{ $eq: ['$isArchived', true] }, 1, 0]
            }
          },
          byType: {
            $push: {
              type: '$type',
              isRead: '$isRead'
            }
          },
          byPriority: {
            $push: {
              priority: '$priority',
              isRead: '$isRead'
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      unread: 0,
      archived: 0,
      byType: [],
      byPriority: []
    };

    // Process type and priority statistics
    const typeStats = {};
    const priorityStats = {};

    result.byType.forEach(item => {
      if (!typeStats[item.type]) {
        typeStats[item.type] = { total: 0, unread: 0 };
      }
      typeStats[item.type].total++;
      if (!item.isRead) typeStats[item.type].unread++;
    });

    result.byPriority.forEach(item => {
      if (!priorityStats[item.priority]) {
        priorityStats[item.priority] = { total: 0, unread: 0 };
      }
      priorityStats[item.priority].total++;
      if (!item.isRead) priorityStats[item.priority].unread++;
    });

    res.status(200).json({
      success: true,
      data: {
        total: result.total,
        unread: result.unread,
        read: result.total - result.unread,
        archived: result.archived,
        typeStats,
        priorityStats
      },
      message: 'Notification statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notification statistics'
    });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
const updateNotificationPreferences = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { preferences } = req.body;
    const User = require('../models/User');

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 'preferences.notifications': preferences },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user.preferences.notifications,
      message: 'Notification preferences updated successfully'
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences'
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  archiveNotifications,
  deleteNotifications,
  createNotification,
  getNotificationStats,
  updateNotificationPreferences
};
