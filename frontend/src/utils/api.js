import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Important for cookie-based auth
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
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    toast.error(message);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  sendOtp: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOtp: (phone, code) => api.post('/auth/verify-otp', { phone, code }),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
};

// Rooms API
export const roomsAPI = {
  getRooms: (params) => api.get('/rooms', { params }),
  getRoom: (id) => api.get(`/rooms/${id}`),
  createRoom: (data) => api.post('/rooms', data),
  updateRoom: (id, data) => api.put(`/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
};

// Bookings API
export const bookingsAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getUserBookings: (userId) => api.get(`/users/${userId}/bookings`),
  confirmBooking: (id) => api.put(`/bookings/${id}/confirm`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
};

// Users API
export const usersAPI = {
  getDashboardStats: () => api.get('/users/dashboard/stats'),
  getActivity: () => api.get('/users/dashboard/activity'),
  getPlatformStats: () => api.get('/users/stats/platform'),
  deactivateAccount: () => api.patch('/users/deactivate'),
  reactivateAccount: () => api.patch('/users/reactivate'),
};

export default api;
