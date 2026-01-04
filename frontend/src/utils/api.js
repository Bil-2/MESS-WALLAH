import axios from 'axios';
import toast from 'react-hot-toast';
import {
  getCSRFToken,
  setCSRFToken,
  sanitizeObject,
  generateIdempotencyKey,
  handleSecurityError,
  isTokenValid
} from './security';

// Create axios instance with base configuration
// Helper to determine the correct base URL
const getBaseUrl = () => {
  // First priority: VITE_API_URL environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Second priority: Production mode fallback (Hardcoded Render Backend)
  if (import.meta.env.PROD) {
    return 'https://mess-wallah.onrender.com/api';
  }
  // Third priority: Local development fallback
  return 'http://localhost:5001/api';
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor with enhanced security
api.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token before sending
      if (!isTokenValid(token)) {
        console.log('[SECURITY] Token invalid or expired, clearing...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Don't add invalid token to request
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add CSRF token for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase())) {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }

      // Add idempotency key for payment/booking requests
      if (config.url?.includes('/payment') || config.url?.includes('/booking')) {
        config.headers['X-Idempotency-Key'] = generateIdempotencyKey();
      }

      // Sanitize request body
      if (config.data && typeof config.data === 'object') {
        config.data = sanitizeObject(config.data);
      }
    }

    console.log('[API] Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => {
    console.log('[API] Response:', response.status, response.config.url);

    // Store CSRF token if provided
    const csrfToken = response.headers['x-csrf-token'];
    if (csrfToken) {
      setCSRFToken(csrfToken);
    }

    return response;
  },
  (error) => {
    console.error('[API] Error:', error.response?.status, error.response?.data || error.message);

    const status = error.response?.status;
    const errorCode = error.response?.data?.code;

    // Handle security-related errors
    if (status === 401) {
      const message = handleSecurityError(error);

      // Only show toast and redirect for actual auth failures, not missing tokens
      if (errorCode !== 'NO_TOKEN') {
        toast.error(message);

        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
        }
      }
    } else if (status === 403) {
      toast.error('Access denied');
    } else if (status === 429) {
      const retryAfter = error.response?.data?.retryAfter || 60;
      toast.error(`Too many requests. Please wait ${retryAfter} seconds.`);
    } else if (status === 404) {
      console.log('[API] 404 Error for:', error.config?.url);
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('[API] Connection refused - backend server may not be running');
      toast.error('Cannot connect to server. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const apiHelpers = {
  // Get user favorites
  async getFavorites() {
    try {
      const response = await api.get('/users/my-favorites');
      return response.data;
    } catch (error) {
      console.error('Get favorites error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get favorites');
    }
  },

  async sendOtp(phone) {
    try {
      const response = await api.post('/auth/send-otp', { phone });
      return response.data;
    } catch (error) {
      console.error('Send OTP API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  async verifyOtp(phone, otp) {
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp });

      // Store token and user data if verification successful
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Verify OTP API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    }
  },

  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });

      // Store token and user data
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to register user');
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to send password reset email');
    }
  },

  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      console.error('Reset password API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      success: true,
      message: 'Logged out successfully'
    };
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
    const response = await api.put('/auth/profile', profileData);
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

  async addFavorite(roomId) {
    const response = await api.post('/users/my-favorites', { roomId });
    return response.data;
  },

  async removeFavorite(roomId) {
    const response = await api.delete(`/users/my-favorites/${roomId}`);
    return response.data;
  },

  // Search helpers
  async advancedSearch(params = {}) {
    const response = await api.get('/search/advanced', { params });
    return response.data;
  },

  async getSearchSuggestions(query, limit = 10) {
    const response = await api.get('/search/suggestions', {
      params: { query, limit }
    });
    return response.data;
  },

  async getNearbyProperties(latitude, longitude, radius = 5, limit = 20) {
    const response = await api.get('/search/nearby', {
      params: { latitude, longitude, radius, limit }
    });
    return response.data;
  },

  async getFilterOptions() {
    const response = await api.get('/search/filters');
    return response.data;
  },

  async saveSearch(name, searchParams) {
    const response = await api.post('/search/save', { name, searchParams });
    return response.data;
  },

  async getSavedSearches() {
    const response = await api.get('/search/saved');
    return response.data;
  },

  async deleteSavedSearch(searchId) {
    const response = await api.delete(`/search/saved/${searchId}`);
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
  addFavorite: apiHelpers.addFavorite,
  removeFavorite: apiHelpers.removeFavorite,
  getFavorites: apiHelpers.getFavorites,
};

// Backward compatibility export
export const usersAPI = userAPI;

export default api;
