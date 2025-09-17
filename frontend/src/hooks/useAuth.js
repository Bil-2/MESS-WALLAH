import { useState, useEffect } from 'react';
import { apiHelpers } from '../utils/api';
import toast from 'react-hot-toast';

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
      const response = await apiHelpers.sendOtp(phone);

      if (response.success) {
        toast.success(`OTP sent to +91${phone}`, {
          icon: '📱',
          duration: 4000
        });
        return { 
          success: true, 
          message: response.message,
          data: response.data 
        };
      } else {
        toast.error(response.message || 'Failed to send OTP');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
      return { success: false, message };
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async (phone) => {
    setOtpLoading(true);
    try {
      const response = await apiHelpers.resendOtp(phone);

      if (response.success) {
        toast.success('OTP resent successfully!', {
          icon: '🔄',
          duration: 4000
        });
        return { 
          success: true, 
          message: response.message,
          data: response.data 
        };
      } else {
        toast.error(response.message || 'Failed to resend OTP');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(message);
      return { success: false, message };
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP and login
  const verifyOtp = async (phone, otp) => {
    setLoading(true);
    try {
      const response = await apiHelpers.verifyOtp(phone, otp);

      if (response.success) {
        const { token, user: userData } = response.data;

        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        toast.success('Login successful!');

        return { success: true, user: userData };
      } else {
        toast.error(response.message || 'Invalid OTP');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid OTP';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await apiHelpers.updateProfile(profileData);

      if (response.success) {
        const updatedUser = response.data.user;

        // Update localStorage and state
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        toast.success('Profile updated successfully!');
        return { success: true, user: updatedUser };
      } else {
        toast.error(response.message || 'Failed to update profile');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Get fresh user profile
  const refreshProfile = async () => {
    try {
      const response = await apiHelpers.getProfile();

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
      await apiHelpers.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
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
      const response = await apiHelpers.forgotPassword(email);

      if (response.success) {
        toast.success('Password reset link sent to your email!', {
          icon: '📧',
          duration: 5000
        });
        return { success: true, message: response.message };
      } else {
        toast.error(response.message || 'Failed to send reset email');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await apiHelpers.register(userData);

      if (response.success) {
        toast.success('Account created successfully!');
        return { success: true, message: response.message };
      } else {
        toast.error(response.message || 'Registration failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiHelpers.login(email, password);

      if (response.success) {
        const { token, user: userData } = response.data;

        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        toast.success('Login successful!');

        return { success: true, user: userData };
      } else {
        toast.error(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
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
