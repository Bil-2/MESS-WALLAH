import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    sendOtp: '/auth/send-otp',
    verifyOtp: '/auth/verify-otp',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
  },

  // User endpoints
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    changePassword: '/users/change-password',
    dashboard: '/users/dashboard',
    activity: '/users/activity',
    favourites: '/users/favourites',
    toggleFavourite: (roomId) => `/users/favourites/${roomId}`,
    deactivate: '/users/deactivate',
    platformStats: '/users/platform-stats',
  },

  // Room endpoints
  rooms: {
    list: '/rooms',
    create: '/rooms',
    getById: (id) => `/rooms/${id}`,
    update: (id) => `/rooms/${id}`,
    delete: (id) => `/rooms/${id}`,
    toggleAvailability: (id) => `/rooms/${id}/availability`,
    stats: '/rooms/stats',
    featured: '/rooms/featured',
  },

  // Booking endpoints
  bookings: {
    create: '/bookings',
    myBookings: '/bookings/my-bookings',
    getById: (id) => `/bookings/${id}`,
    updateStatus: (id) => `/bookings/${id}/status`,
    cancel: (id) => `/bookings/${id}/cancel`,
    addMessage: (id) => `/bookings/${id}/messages`,
    stats: '/bookings/stats/overview',
  },

  // Notification endpoints
  notifications: {
    list: '/notifications',
    markRead: (id) => `/notifications/${id}/read`,
    markAllRead: '/notifications/mark-all-read',
    delete: (id) => `/notifications/${id}`,
    preferences: '/notifications/preferences',
  },

  // Chat endpoints
  chat: {
    messages: (bookingId) => `/chat/${bookingId}/messages`,
    send: (bookingId) => `/chat/${bookingId}/send`,
  },

  // Analytics endpoints
  analytics: {
    dashboard: '/analytics/dashboard',
    property: (roomId) => `/analytics/property/${roomId}`,
    reports: '/analytics/reports',
  },

  // Language endpoints
  languages: {
    list: '/languages',
    translations: (lang) => `/languages/${lang}/translations`,
    setPreference: '/languages/preference',
  },
};

// API helper functions
export const apiHelpers = {
  // Auth helpers
  async sendOtp(phone) {
    const response = await api.post(endpoints.auth.sendOtp, { phone });
    return response.data;
  },

  async verifyOtp(phone, otp) {
    const response = await api.post(endpoints.auth.verifyOtp, { phone, otp });
    return response.data;
  },

  async logout() {
    const response = await api.post(endpoints.auth.logout);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  },

  // User helpers
  async getUserProfile() {
    const response = await api.get(endpoints.users.profile);
    return response.data;
  },

  async updateUserProfile(profileData) {
    const response = await api.put(endpoints.users.updateProfile, profileData);
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get(endpoints.users.dashboard);
    return response.data;
  },

  async toggleFavourite(roomId) {
    const response = await api.post(endpoints.users.toggleFavourite(roomId));
    return response.data;
  },

  async getFavourites(params = {}) {
    const response = await api.get(endpoints.users.favourites, { params });
    return response.data;
  },

  // Room helpers
  async getRooms(params = {}) {
    const response = await api.get(endpoints.rooms.list, { params });
    return response.data;
  },

  async getRoomById(id) {
    const response = await api.get(endpoints.rooms.getById(id));
    return response.data;
  },

  async createRoom(roomData) {
    const response = await api.post(endpoints.rooms.create, roomData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateRoom(id, roomData) {
    const response = await api.put(endpoints.rooms.update(id), roomData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteRoom(id) {
    const response = await api.delete(endpoints.rooms.delete(id));
    return response.data;
  },

  async getFeaturedRooms() {
    const response = await api.get(endpoints.rooms.featured);
    return response.data;
  },

  async getRoomStats() {
    const response = await api.get(endpoints.rooms.stats);
    return response.data;
  },

  // Booking helpers
  async createBooking(bookingData) {
    const response = await api.post(endpoints.bookings.create, bookingData);
    return response.data;
  },

  async getMyBookings(params = {}) {
    const response = await api.get(endpoints.bookings.myBookings, { params });
    return response.data;
  },

  async getBookingById(id) {
    const response = await api.get(endpoints.bookings.getById(id));
    return response.data;
  },

  async updateBookingStatus(id, status, reason) {
    const response = await api.patch(endpoints.bookings.updateStatus(id), { status, reason });
    return response.data;
  },

  async cancelBooking(id, reason) {
    const response = await api.patch(endpoints.bookings.cancel(id), { reason });
    return response.data;
  },

  async addBookingMessage(id, message) {
    const response = await api.post(endpoints.bookings.addMessage(id), { message });
    return response.data;
  },

  async getBookingStats() {
    const response = await api.get(endpoints.bookings.stats);
    return response.data;
  },

  // Notification helpers
  async getNotifications(params = {}) {
    const response = await api.get(endpoints.notifications.list, { params });
    return response.data;
  },

  async markNotificationRead(id) {
    const response = await api.patch(endpoints.notifications.markRead(id));
    return response.data;
  },

  async markAllNotificationsRead() {
    const response = await api.patch(endpoints.notifications.markAllRead);
    return response.data;
  },

  async deleteNotification(id) {
    const response = await api.delete(endpoints.notifications.delete(id));
    return response.data;
  },
};

export default api;

// Named exports for backward compatibility
export const roomsAPI = {
  getRooms: apiHelpers.getRooms,
  getRoomById: apiHelpers.getRoomById,
  createRoom: apiHelpers.createRoom,
  updateRoom: apiHelpers.updateRoom,
  deleteRoom: apiHelpers.deleteRoom,
  getFeaturedRooms: apiHelpers.getFeaturedRooms,
  getRoomStats: apiHelpers.getRoomStats,
};

export const bookingsAPI = {
  createBooking: apiHelpers.createBooking,
  getMyBookings: apiHelpers.getMyBookings,
  getBookingById: apiHelpers.getBookingById,
  updateBookingStatus: apiHelpers.updateBookingStatus,
  cancelBooking: apiHelpers.cancelBooking,
  addBookingMessage: apiHelpers.addBookingMessage,
  getBookingStats: apiHelpers.getBookingStats,
};

export const usersAPI = {
  getUserProfile: apiHelpers.getUserProfile,
  updateUserProfile: apiHelpers.updateUserProfile,
  getDashboardStats: apiHelpers.getDashboardStats,
  toggleFavourite: apiHelpers.toggleFavourite,
  getFavourites: apiHelpers.getFavourites,
};
