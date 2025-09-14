import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);

    const message = error.response?.data?.message || 'Something went wrong';

    // Handle specific error cases
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied');
    } else if (error.response?.status === 404) {
      console.log('404 Error for:', error.config?.url);
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Connection refused - backend server may not be running');
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const apiHelpers = {
  // Auth helpers
  async sendOtp(phone) {
    const response = await api.post('/auth/send-otp', { phone });
    return response.data;
  },

  async verifyOtp(phone, otp) {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Room helpers
  async getRooms(params = {}) {
    const response = await api.get('/rooms', { params });
    return response.data;
  },

  async getRoomById(id) {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  async createRoom(roomData) {
    const response = await api.post('/rooms', roomData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateRoom(id, roomData) {
    const response = await api.put(`/rooms/${id}`, roomData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteRoom(id) {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },

  async getFeaturedRooms() {
    const response = await api.get('/rooms/featured');
    return response.data;
  },

  async getRoomStats() {
    const response = await api.get('/rooms/stats');
    return response.data;
  },

  // Booking helpers
  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async getMyBookings(params = {}) {
    const response = await api.get('/bookings/my-bookings', { params });
    return response.data;
  },

  async getBookingById(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  async updateBookingStatus(id, status, reason) {
    const response = await api.patch(`/bookings/${id}/status`, { status, reason });
    return response.data;
  },

  async cancelBooking(id, reason) {
    const response = await api.patch(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  // User helpers
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  async changePassword(passwordData) {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  },

  async getDashboard() {
    const response = await api.get('/users/dashboard');
    return response.data;
  },

  // Health check
  async healthCheck() {
    const response = await api.get('/test');
    return response.data;
  }
};

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

export const authAPI = {
  sendOtp: apiHelpers.sendOtp,
  verifyOtp: apiHelpers.verifyOtp,
  logout: apiHelpers.logout,
};

export const bookingsAPI = {
  createBooking: apiHelpers.createBooking,
  getMyBookings: apiHelpers.getMyBookings,
  getBookingById: apiHelpers.getBookingById,
  updateBookingStatus: apiHelpers.updateBookingStatus,
  cancelBooking: apiHelpers.cancelBooking,
};

export const userAPI = {
  getProfile: apiHelpers.getProfile,
  updateProfile: apiHelpers.updateProfile,
  changePassword: apiHelpers.changePassword,
  getDashboard: apiHelpers.getDashboard,
};

// Backward compatibility export
export const usersAPI = userAPI;

export default api;
