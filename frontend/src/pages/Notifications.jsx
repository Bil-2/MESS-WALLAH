import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, RefreshCw, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';
import ScrollReveal from '../components/ScrollReveal';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const unreadOnly = filter === 'unread' ? 'true' : 'false';
      const response = await api.get(`/notifications?page=${page}&limit=20&unreadOnly=${unreadOnly}`);
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const clearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all notifications?')) return;
    try {
      await api.delete('/notifications/clear-all');
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch (error) {
      toast.error('Failed to clear notifications');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      booking_request: 'REQ',
      booking_confirmed: 'OK',
      booking_rejected: 'NO',
      booking_cancelled: 'CXL',
      payment_success: 'PAID',
      payment_failed: 'FAIL',
      refund_initiated: 'REF',
      refund_completed: 'DONE',
      message_received: 'MSG',
      review_received: 'REV',
      system: 'SYS'
    };
    return icons[type] || 'INFO';
  };

  const getTypeColor = (type) => {
    const colors = {
      booking_confirmed: 'bg-green-100 border-green-500',
      payment_success: 'bg-green-100 border-green-500',
      booking_rejected: 'bg-red-100 border-red-500',
      booking_cancelled: 'bg-red-100 border-red-500',
      payment_failed: 'bg-red-100 border-red-500',
      booking_request: 'bg-blue-100 border-blue-500',
      refund_initiated: 'bg-yellow-100 border-yellow-500',
      refund_completed: 'bg-green-100 border-green-500'
    };
    return colors[type] || 'bg-gray-100 border-gray-500';
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-down">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Bell className="w-8 h-8 text-orange-500" />
                  Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {pagination.total} notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchNotifications()}
                  className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={0.1}>
          {/* Actions Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
              </select>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
              <div className="animate-spin w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <ScrollReveal animation="zoom">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-500">
                  {filter === 'unread' ? 'All caught up! No unread notifications.' : 'You don\'t have any notifications yet.'}
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <ScrollReveal key={notification._id} animation="fade-up" delay={index * 0.05}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border-l-4 ${getTypeColor(notification.type)} ${!notification.isRead ? 'ring-2 ring-orange-200 dark:ring-orange-800' : ''
                      }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                {notification.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                                <span>•</span>
                                <span>{format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}</span>
                              </div>
                            </div>
                            {!notification.isRead && (
                              <span className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-4">
                            {notification.data?.actionUrl && (
                              <a
                                href={notification.data.actionUrl}
                                className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                              >
                                View Details
                              </a>
                            )}
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification._id)}
                                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification._id)}
                              className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <ScrollReveal animation="fade-up" delay={0.2}>
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => fetchNotifications(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-orange-500 text-white rounded-lg">
                {pagination.currentPage} / {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchNotifications(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};

export default Notifications;
