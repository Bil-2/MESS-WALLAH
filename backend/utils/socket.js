const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handling
  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.user.name} (${socket.userId})`);

    // Join user-specific room
    socket.join(`user_${socket.userId}`);

    // Update user online status
    updateUserOnlineStatus(socket.userId, true);

    // Handle joining room-specific channels
    socket.on('join_room', (roomId) => {
      socket.join(`room_${roomId}`);
      console.log(`[Socket] User ${socket.userId} joined room ${roomId}`);
    });

    // Handle leaving room-specific channels
    socket.on('leave_room', (roomId) => {
      socket.leave(`room_${roomId}`);
      console.log(`[Socket] User ${socket.userId} left room ${roomId}`);
    });

    // Handle notification acknowledgment
    socket.on('notification_read', async (notificationId) => {
      try {
        const Notification = require('../models/Notification');
        await Notification.findByIdAndUpdate(notificationId, {
          isRead: true,
          readAt: new Date()
        });

        const unreadCount = await Notification.getUnreadCount(socket.userId);
        socket.emit('unread_count_updated', unreadCount);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(`room_${data.roomId}`).emit('user_typing', {
        userId: socket.userId,
        userName: socket.user.name,
        roomId: data.roomId
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(`room_${data.roomId}`).emit('user_stopped_typing', {
        userId: socket.userId,
        roomId: data.roomId
      });
    });

    // Handle real-time room updates
    socket.on('room_view', (roomId) => {
      // Track room views for analytics
      socket.to(`room_${roomId}`).emit('room_viewed', {
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    // Handle booking status updates
    socket.on('booking_update', (data) => {
      // Emit to relevant users (owner and seeker)
      if (data.ownerId) {
        io.to(`user_${data.ownerId}`).emit('booking_status_changed', data);
      }
      if (data.seekerId) {
        io.to(`user_${data.seekerId}`).emit('booking_status_changed', data);
      }
    });

    // Handle user presence
    socket.on('user_active', () => {
      updateUserOnlineStatus(socket.userId, true);
      socket.broadcast.emit('user_online', {
        userId: socket.userId,
        userName: socket.user.name
      });
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`[Socket] User disconnected: ${socket.user.name} (${socket.userId}) - Reason: ${reason}`);

      // Update user offline status after a delay
      setTimeout(() => {
        updateUserOnlineStatus(socket.userId, false);
        socket.broadcast.emit('user_offline', {
          userId: socket.userId,
          userName: socket.user.name
        });
      }, 30000); // 30 second delay to handle quick reconnections
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`[Socket] Error for user ${socket.userId}:`, error);
    });

    // Send initial data
    socket.emit('connected', {
      message: 'Connected to MESS WALLAH real-time service',
      userId: socket.userId,
      timestamp: new Date()
    });

    // Send unread notification count
    sendUnreadCount(socket);
  });

  return io;
};

// Helper function to update user online status
const updateUserOnlineStatus = async (userId, isOnline) => {
  try {
    await User.findByIdAndUpdate(userId, {
      'profile.isOnline': isOnline,
      'profile.lastSeen': new Date()
    });
  } catch (error) {
    console.error('Error updating user online status:', error);
  }
};

// Helper function to send unread notification count
const sendUnreadCount = async (socket) => {
  try {
    const Notification = require('../models/Notification');
    const unreadCount = await Notification.getUnreadCount(socket.userId);
    socket.emit('unread_count', unreadCount);
  } catch (error) {
    console.error('Error sending unread count:', error);
  }
};

// Utility functions for external use
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
};

const emitToRoom = (roomId, event, data) => {
  if (io) {
    io.to(`room_${roomId}`).emit(event, data);
  }
};

const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

const getUsersInRoom = (roomId) => {
  if (io) {
    const room = io.sockets.adapter.rooms.get(`room_${roomId}`);
    return room ? Array.from(room) : [];
  }
  return [];
};

const getOnlineUsers = () => {
  if (io) {
    const users = [];
    for (const [socketId, socket] of io.sockets.sockets) {
      if (socket.userId) {
        users.push({
          userId: socket.userId,
          userName: socket.user.name,
          socketId: socketId
        });
      }
    }
    return users;
  }
  return [];
};

// Notification helpers
const sendNotificationToUser = async (userId, notification) => {
  try {
    const Notification = require('../models/Notification');
    const unreadCount = await Notification.getUnreadCount(userId);

    emitToUser(userId, 'new_notification', {
      notification,
      unreadCount
    });
  } catch (error) {
    console.error('Error sending notification to user:', error);
  }
};

const sendBookingUpdate = (bookingData) => {
  const { ownerId, seekerId, ...data } = bookingData;

  if (ownerId) {
    emitToUser(ownerId, 'booking_update', data);
  }
  if (seekerId) {
    emitToUser(seekerId, 'booking_update', data);
  }
};

const sendRoomUpdate = (roomId, updateData) => {
  emitToRoom(roomId, 'room_update', updateData);
};

module.exports = {
  initializeSocket,
  getIO,
  emitToUser,
  emitToRoom,
  emitToAll,
  getUsersInRoom,
  getOnlineUsers,
  sendNotificationToUser,
  sendBookingUpdate,
  sendRoomUpdate
};
