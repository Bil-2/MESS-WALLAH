import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Get auth data from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!user || !token) return;

    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('[Socket] Connected to server');
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
      setIsConnected(false);
      reconnectAttempts.current++;

      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('[Socket] Max reconnection attempts reached');
      }
    });

    // Notification event handlers
    newSocket.on('new_notification', (data) => {
      console.log('[Socket] New notification received:', data);

      // Add to notifications list
      setNotifications(prev => [data.notification, ...prev.slice(0, 49)]); // Keep last 50
      setUnreadCount(data.unreadCount);

      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(data.notification.title, {
          body: data.notification.message,
          icon: '/icons/icon-192x192.png',
          tag: data.notification._id,
          requireInteraction: data.notification.priority === 'urgent'
        });
      }
    });

    newSocket.on('unread_count', (count) => {
      setUnreadCount(count);
    });

    newSocket.on('unread_count_updated', (count) => {
      setUnreadCount(count);
    });

    // Booking event handlers
    newSocket.on('booking_update', (data) => {
      console.log('[Socket] Booking update:', data);
      // Handle booking updates - could trigger notifications or UI updates
    });

    newSocket.on('booking_status_changed', (data) => {
      console.log('[Socket] Booking status changed:', data);
      // Handle booking status changes
    });

    // Room event handlers
    newSocket.on('room_update', (data) => {
      console.log('[Socket] Room update:', data);
      // Handle room updates
    });

    newSocket.on('room_viewed', (data) => {
      console.log('[Socket] Room viewed:', data);
      // Handle room view tracking
    });

    // User presence handlers
    newSocket.on('user_online', (data) => {
      console.log('[Socket] User online:', data);
    });

    newSocket.on('user_offline', (data) => {
      console.log('[Socket] User offline:', data);
    });

    // Typing indicators
    newSocket.on('user_typing', (data) => {
      console.log('[Socket] User typing:', data);
    });

    newSocket.on('user_stopped_typing', (data) => {
      console.log('[Socket] User stopped typing:', data);
    });

    // Connection confirmation
    newSocket.on('connected', (data) => {
      console.log('[Socket] Connection confirmed:', data);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user, token]);

  // Socket utility functions
  const joinRoom = (roomId) => {
    if (socket && isConnected) {
      socket.emit('join_room', roomId);
    }
  };

  const leaveRoom = (roomId) => {
    if (socket && isConnected) {
      socket.emit('leave_room', roomId);
    }
  };

  const markNotificationAsRead = (notificationId) => {
    if (socket && isConnected) {
      socket.emit('notification_read', notificationId);

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId
            ? { ...notif, isRead: true, readAt: new Date() }
            : notif
        )
      );
    }
  };

  const trackRoomView = (roomId) => {
    if (socket && isConnected) {
      socket.emit('room_view', roomId);
    }
  };

  const sendBookingUpdate = (bookingData) => {
    if (socket && isConnected) {
      socket.emit('booking_update', bookingData);
    }
  };

  const startTyping = (roomId) => {
    if (socket && isConnected) {
      socket.emit('typing_start', { roomId });
    }
  };

  const stopTyping = (roomId) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { roomId });
    }
  };

  const setUserActive = () => {
    if (socket && isConnected) {
      socket.emit('user_active');
    }
  };

  // Auto-activity tracking
  useEffect(() => {
    const handleActivity = () => {
      setUserActive();
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Throttle activity updates to once per minute
    let lastActivity = 0;
    const throttledActivity = () => {
      const now = Date.now();
      if (now - lastActivity > 60000) { // 1 minute
        lastActivity = now;
        handleActivity();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, throttledActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledActivity, true);
      });
    };
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    notifications,
    unreadCount,
    joinRoom,
    leaveRoom,
    markNotificationAsRead,
    trackRoomView,
    sendBookingUpdate,
    startTyping,
    stopTyping,
    setUserActive
  };
};
