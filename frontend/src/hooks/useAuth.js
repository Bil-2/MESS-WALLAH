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
        toast.success('OTP sent successfully!');
        return { success: true, message: response.message };
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

  return {
    user,
    loading,
    otpLoading,
    sendOtp,
    verifyOtp,
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
