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

// Mock authentication functions for demo
const mockAuth = {
  async sendOtp(phone) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!phone || phone.length !== 10) {
      throw new Error('Please enter a valid 10-digit phone number');
    }
    
    return {
      success: true,
      message: 'OTP sent successfully',
      data: { 
        phone,
        expiresIn: 5,
        method: 'SMS',
        canResendAfter: 60
      }
    };
  },

  async resendOtp(phone) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!phone || phone.length !== 10) {
      throw new Error('Please enter a valid 10-digit phone number');
    }
    
    return {
      success: true,
      message: 'OTP resent successfully',
      data: { 
        phone,
        expiresIn: 5,
        method: 'SMS',
        canResendAfter: 60
      }
    };
  },

  async verifyOtp(phone, otp) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!otp || otp.length !== 6) {
      throw new Error('Please enter a valid 6-digit OTP');
    }
    
    // Accept any 6-digit OTP for demo
    const mockUser = {
      _id: 'demo-user-' + Date.now(),
      name: 'Demo User',
      phone: phone,
      email: `user${phone}@demo.com`,
      role: 'student',
      verified: true
    };
    
    const mockToken = 'demo-token-' + Date.now();
    
    // Store in localStorage
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return {
      success: true,
      message: 'OTP verified successfully',
      data: {
        user: mockUser,
        token: mockToken
      }
    };
  },

  async login(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    const mockUser = {
      _id: 'demo-user-' + Date.now(),
      name: 'Demo User',
      email: email,
      phone: '9876543210',
      role: 'student',
      verified: true
    };
    
    const mockToken = 'demo-token-' + Date.now();
    
    // Store in localStorage
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return {
      success: true,
      message: 'Login successful',
      data: {
        user: mockUser,
        token: mockToken
      }
    };
  },

  async register(userData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { name, email, phone, password, role } = userData;
    
    if (!name || !email || !phone || !password) {
      throw new Error('All fields are required');
    }
    
    const mockUser = {
      _id: 'demo-user-' + Date.now(),
      name: name,
      email: email,
      phone: phone,
      role: role || 'student',
      verified: true
    };
    
    return {
      success: true,
      message: 'Account created successfully',
      data: {
        user: mockUser
      }
    };
  },

  async forgotPassword(email) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (!email) {
      throw new Error('Email is required');
    }
    
    // Simulate email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    // 🚨 DEMO MODE: This is a simulation
    // To send real emails, replace this with actual backend API call:
    // const response = await api.post('/auth/forgot-password', { email });
    // return response.data;
    
    console.log(`📧 DEMO: Would send password reset email to: ${email}`);
    
    return {
      success: true,
      message: 'Password reset link sent to your email (Demo Mode)',
      data: {
        email: email,
        resetToken: 'demo-reset-token-' + Date.now(),
        expiresIn: 15 // minutes
      }
    };
  }
};

// API helper functions
export const apiHelpers = {
  // Auth helpers - use mock 
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
