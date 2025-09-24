import { useState, useEffect } from 'react';
import api from '../utils/api';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpLoading, setOtpLoading] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Send OTP
  const sendOtp = async (phone) => {
    setOtpLoading(true);
    try {
      const response = await api.post('/auth/send-otp', { phone });

      if (response.data.success) {
        console.log(`OTP sent to +91${phone}`);
        return { 
          success: true, 
          message: response.data.message,
          data: response.data.data 
        };
      } else {
        console.error(response.data.message || 'Failed to send OTP');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      console.error(message);
      return { success: false, message };
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async (phone) => {
    setOtpLoading(true);
    try {
      const response = await api.post('/auth/resend-otp', { phone });

      if (response.data.success) {
        console.log('OTP resent successfully!');
        return { 
          success: true, 
          message: response.data.message,
          data: response.data.data 
        };
      } else {
        console.error(response.data.message || 'Failed to resend OTP');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP';
      console.error(message);
      return { success: false, message };
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP and login
  const verifyOtp = async (phone, otp) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp });

      if (response.data.success) {
        const { token, user: userData } = response.data.data;

        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        console.log('Login successful!');

        return { success: true, user: userData };
      } else {
        console.error(response.data.message || 'Invalid OTP');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid OTP';
      console.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await api.put('/auth/profile', profileData);

      if (response.success) {
        const updatedUser = response.data.user;

        // Update localStorage and state
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        console.log('Profile updated successfully!');
        return { success: true, user: updatedUser };
      } else {
        console.error(response.message || 'Failed to update profile');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      console.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Get fresh user profile
  const refreshProfile = async () => {
    try {
      const response = await api.get('/auth/me');

      if (response.success) {
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      return { success: false };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      console.log('Logged out successfully');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && localStorage.getItem('token'));
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is verified
  const isVerified = () => {
    return user?.verified === true || user?.isVerified === true;
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });

      if (response.data.success) {
        console.log('Password reset link sent to your email!');
        return { success: true, message: response.data.message };
      } else {
        console.error(response.data.message || 'Failed to send reset email');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to send reset email';
      console.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', userData);

      if (response.data.success) {
        console.log('Account created/linked successfully!');
        
        // CRITICAL FIX: Handle account linking
        if (response.data.accountLinked) {
          // Store auth data for linked account
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
          
          return { 
            success: true, 
            message: response.data.message,
            accountLinked: true,
            user: user,
            token: token
          };
        }
        
        return { success: true, message: response.data.message };
      } else {
        console.error(response.data.message || 'Registration failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.message || error.message || 'Registration failed';
      console.error('Registration error:', message);
      
      return { 
        success: false, 
        message,
        accountLinked: errorData?.accountLinked || false
      };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.success) {
        const { token, user: userData } = response.data;

        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        console.log('Login successful!');

        return { success: true, user: userData };
      } else {
        console.error(response.data.message || 'Login failed');
        return { 
          success: false, 
          message: response.data.message,
          attemptsRemaining: response.data.attemptsRemaining,
          hint: response.data.hint
        };
      }
    } catch (error) {
      console.error('Error logging in:', error);
      const errorData = error.response?.data;

      // Handle specific error cases
      if (errorData?.action === 'complete_registration') {
        return {
          success: false,
          message: errorData.message,
          action: 'complete_registration',
          hint: errorData.hint,
          needsPasswordSetup: true
        };
      } else if (errorData?.message?.includes('Invalid')) {
        return {
          success: false,
          message: errorData.message || 'Invalid email or password. Please check your credentials.',
          attemptsRemaining: errorData.attemptsRemaining,
          hint: errorData.hint
        };
      } else {
        return { 
          success: false, 
          message: errorData?.message || error.message || 'Login failed' 
        };
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    otpLoading,
    sendOtp,
    resendOtp,
    verifyOtp,
    login,
    register,
    forgotPassword,
    updateProfile,
    refreshProfile,
    logout,
    isAuthenticated,
    hasRole,
    isVerified
  };
};

export default useAuth;

// Named export for consistency
export { useAuth };
