import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Room API calls
export const roomAPI = {
  getAllRooms: (params = {}) => api.get('/rooms', { params }),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  createRoom: (roomData) => api.post('/rooms', roomData),
  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
  getMyRooms: () => api.get('/rooms/my-rooms'),
  uploadRoomImages: (id, formData) => api.post(`/rooms/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Booking API calls
export const bookingAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getBookingRequests: () => api.get('/bookings/requests'),
  updateBookingStatus: (id, status, message = '') => api.put(`/bookings/${id}/status`, { status, message }),
  addMessage: (id, message) => api.post(`/bookings/${id}/messages`, { message }),
  cancelBooking: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
  confirmBooking: (id) => api.put(`/bookings/${id}/confirm`),
};

// Review API calls (placeholder for future implementation)
export const reviewAPI = {
  getReviewsForRoom: (roomId) => api.get(`/reviews/room/${roomId}`),
  createReview: (reviewData) => api.post('/reviews', reviewData),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

// Payment API calls (placeholder for future implementation)
export const paymentAPI = {
  createPaymentIntent: (amount, bookingId) => api.post('/payments/create-intent', { amount, bookingId }),
  confirmPayment: (paymentData) => api.post('/payments/confirm', paymentData),
  getPaymentHistory: () => api.get('/payments/history'),
};

// Dashboard API calls
export const dashboardAPI = {
  getStudentStats: () => api.get('/dashboard/student-stats'),
  getOwnerStats: () => api.get('/dashboard/owner-stats'),
  getAdminStats: () => api.get('/dashboard/admin-stats'),
};

export default api;
