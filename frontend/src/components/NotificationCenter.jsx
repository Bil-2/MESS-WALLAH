import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Filter,
  MoreVertical,
  Calendar,
  User,
  Home,
  CreditCard,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

const NotificationCenter = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markNotificationAsRead } = useSocket();
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return notification.category === filter;
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  // Get notification icon based on category
  const getNotificationIcon = (category, priority) => {
    const iconProps = {
      size: 20,
      className: `${priority === 'urgent' ? 'text-red-500' :
        priority === 'high' ? 'text-orange-500' :
          'text-blue-500'}`
    };

    switch (category) {
      case 'booking':
        return <Calendar {...iconProps} />;
      case 'payment':
        return <CreditCard {...iconProps} />;
      case 'room':
        return <Home {...iconProps} />;
      case 'user':
        return <User {...iconProps} />;
      case 'system':
        return priority === 'urgent' ? <AlertTriangle {...iconProps} /> : <Info {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification._id);
    }

    // Handle notification action if present
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  // Handle bulk actions
  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach(id => {
      const notification = notifications.find(n => n._id === id);
      if (notification && !notification.isRead) {
        markNotificationAsRead(id);
      }
    });
    setSelectedNotifications([]);
  };

  // Format relative time
  const formatRelativeTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return notificationDate.toLocaleDateString();
  };

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'booking', label: 'Bookings', count: notifications.filter(n => n.category === 'booking').length },
    { value: 'payment', label: 'Payments', count: notifications.filter(n => n.category === 'payment').length },
    { value: 'system', label: 'System', count: notifications.filter(n => n.category === 'system').length }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Notification Panel */}
      <div className={`fixed right-0 top-0 h-full w-full lg:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {option.label}
                {option.count > 0 && (
                  <span className="ml-1 text-xs opacity-75">
                    ({option.count})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="mt-3 flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {selectedNotifications.length} selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkMarkAsRead}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedNotifications([])}
                  className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {Object.keys(groupedNotifications).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <Bell className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm text-center">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          ) : (
            Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
              <div key={date} className="mb-4">
                <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {date === new Date().toDateString() ? 'Today' :
                    date === new Date(Date.now() - 86400000).toDateString() ? 'Yesterday' :
                      new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>

                {dateNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification._id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            setSelectedNotifications(prev => [...prev, notification._id]);
                          } else {
                            setSelectedNotifications(prev => prev.filter(id => id !== notification._id));
                          }
                        }}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />

                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.category, notification.priority)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${!notification.isRead
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-700 dark:text-gray-300'
                              }`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-2 space-x-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                              {notification.priority === 'urgent' && (
                                <span className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                                  Urgent
                                </span>
                              )}
                              {notification.priority === 'high' && (
                                <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 text-xs px-2 py-1 rounded-full">
                                  High
                                </span>
                              )}
                            </div>
                          </div>

                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              // Mark all as read
              notifications.forEach(notification => {
                if (!notification.isRead) {
                  markNotificationAsRead(notification._id);
                }
              });
            }}
            disabled={unreadCount === 0}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            Mark All as Read
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;
