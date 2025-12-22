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

  // ENHANCED: OTP verification with account linking awareness
  const verifyOtp = async (phone, otp) => {
    // Don't set loading here - let the component handle its own loading state
    // This prevents race conditions with redirects
    try {
      console.log('OTP VERIFICATION: Verifying OTP for phone:', phone);

      const response = await api.post('/auth/verify-otp', { phone, otp });

      if (response.data.success) {
        const { token, user: userData } = response.data.data;

        console.log('OTP VERIFICATION SUCCESSFUL:', {
          userId: userData.id,
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
          accountType: userData.accountType || 'otp-only',
          isNewUser: userData.isNewUser,
          canLinkEmail: !userData.email
        });

        // Store OTP account data (may be linkable later)
        // CRITICAL: Store in localStorage BEFORE setting state to ensure persistence
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Don't call setUser here - let the redirect happen first
        // The new page will read from localStorage on mount

        return {
          success: true,
          user: userData,
          role: userData.role,
          accountType: userData.accountType || 'otp-only',
          canLinkEmail: !userData.email,
          isNewUser: userData.isNewUser
        };
      } else {
        console.error('OTP verification failed:', response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid OTP';
      console.error('OTP verification error:', message);
      return { success: false, message };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await api.put('/auth/profile', profileData);

      if (response.data.success) {
        const updatedUser = response.data.user;

        // Update localStorage and state
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        console.log('Profile updated successfully!');
        return { success: true, user: updatedUser };
      } else {
        console.error(response.data.message || 'Failed to update profile');
        return { success: false, message: response.data.message };
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

      if (response.data.success) {
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

  // ENHANCED: Unified registration with account linking support
  const register = async (userData) => {
    setLoading(true);
    try {
      console.log('UNIFIED REGISTRATION: Starting registration process...', {
        hasEmail: !!userData.email,
        hasPhone: !!userData.phone,
        hasPassword: !!userData.password
      });

      const response = await api.post('/auth/register', userData);

      if (response.data.success) {
        console.log('Registration API call successful');

        // CRITICAL: Handle unified account linking
        if (response.data.accountLinked) {
          console.log('ACCOUNT LINKING DETECTED: Unifying existing OTP account with email');
          console.log('Linking details:', response.data.linkingDetails);

          // Store unified account data
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);

          console.log('UNIFIED ACCOUNT CREATED:', {
            userId: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            accountType: response.data.accountType,
            hasUnifiedAuth: true
          });

          return {
            success: true,
            message: response.data.message || 'Account successfully linked! Your phone and email are now unified.',
            accountLinked: true,
            accountType: 'unified',
            user: user,
            token: token,
            linkingDetails: response.data.linkingDetails
          };
        } else {
          // New account created (not linked)
          console.log('NEW ACCOUNT CREATED: Fresh registration');

          // Check if we got token and user data for immediate login
          if (response.data.token && response.data.user) {
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return {
              success: true,
              message: response.data.message || 'Account created successfully!',
              accountLinked: false,
              user: user,
              token: token
            };
          }
        }

        return {
          success: true,
          message: response.data.message || 'Registration successful!'
        };
      } else {
        console.error('Registration failed:', response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.message || error.message || 'Registration failed';
      console.error('Registration error:', message, errorData);

      return {
        success: false,
        message,
        accountLinked: errorData?.accountLinked || false,
        hint: errorData?.hint
      };
    } finally {
      setLoading(false);
    }
  };

  // ENHANCED: Unified login with account linking detection
  // FIXED: Don't call setUser before redirect to prevent race condition
  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('UNIFIED LOGIN: Attempting login for:', email);

      const response = await api.post('/auth/login', { email, password });

      if (response.data.success) {
        const { token, user: userData } = response.data;

        console.log('LOGIN SUCCESSFUL:', {
          userId: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          accountType: userData.accountType,
          registrationMethod: userData.registrationMethod
        });

        // Store unified account data in localStorage
        // CRITICAL: Don't call setUser here - let redirect happen first
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        return {
          success: true,
          user: userData,
          role: userData.role,
          accountType: userData.accountType || 'unified'
        };
      } else {
        console.error('Login failed:', response.data.message);
        setLoading(false);
        return {
          success: false,
          message: response.data.message,
          attemptsRemaining: response.data.attemptsRemaining,
          hint: response.data.hint
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      const errorData = error.response?.data;

      // ENHANCED: Handle account linking scenarios
      if (errorData?.action === 'complete_registration') {
        console.log('ACCOUNT LINKING REQUIRED: OTP account needs email completion');
        return {
          success: false,
          message: errorData.message || 'Account found but needs completion. Please register to link your accounts.',
          action: 'complete_registration',
          hint: errorData.hint || 'Go to Register page to complete your profile with email and password.',
          needsPasswordSetup: true,
          phone: errorData.phone,
          userId: errorData.userId,
          canLink: true
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
    }
    // NOTE: No finally block - loading state managed explicitly above
    // On success, we don't reset loading because redirect will happen
  };

  // ENHANCED: Check if current user can link accounts
  const canLinkAccounts = () => {
    if (!user) return false;

    // Can link if user has phone but no email (OTP-only account)
    const hasPhoneOnly = user.phone && !user.email;
    const isOtpOnly = user.accountType === 'otp-only';
    const canLink = user.canLinkEmail !== false;

    return hasPhoneOnly || isOtpOnly || canLink;
  };

  // ENHANCED: Get account status for UI display
  const getAccountStatus = () => {
    if (!user) return { type: 'none', message: 'Not logged in' };

    if (user.accountType === 'unified') {
      return {
        type: 'unified',
        message: 'Complete account with phone and email',
        hasPhone: !!user.phone,
        hasEmail: !!user.email
      };
    } else if (user.accountType === 'otp-only' || (user.phone && !user.email)) {
      return {
        type: 'otp-only',
        message: 'Phone-only account. Add email to complete profile.',
        hasPhone: !!user.phone,
        hasEmail: false,
        canLink: true
      };
    } else if (user.email && !user.phone) {
      return {
        type: 'email-only',
        message: 'Email-only account. Add phone for better security.',
        hasPhone: false,
        hasEmail: !!user.email,
        canLink: true
      };
    }

    return {
      type: 'unknown',
      message: 'Account status unclear',
      hasPhone: !!user.phone,
      hasEmail: !!user.email
    };
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
    isVerified,
    // ENHANCED: Account linking utilities
    canLinkAccounts,
    getAccountStatus
  };
};

export default useAuth;

// Named export for consistency
export { useAuth };
