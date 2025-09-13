import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import NotificationCenter from './NotificationCenter';

const NotificationBell = () => {
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const { unreadCount, isConnected } = useSocket();

  return (
    <>
      <button
        onClick={() => setIsNotificationCenterOpen(true)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors transform hover:scale-105 active:scale-95"
      >
        <Bell className="w-6 h-6" />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />

        {/* Pulse Animation for New Notifications */}
        {unreadCount > 0 && (
          <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping" />
        )}
      </button>

      {isNotificationCenterOpen && (
        <NotificationCenter
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
        />
      )}
    </>
  );
};

export default NotificationBell;
