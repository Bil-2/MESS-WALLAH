import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, ArrowRight,
  CheckCircle, AlertCircle, UserCheck, Star
} from '../utils/iconMappings';
import { useAuthContext } from '../context/AuthContext.jsx';
import { usePreventAutoFill } from '../hooks/usePreventAutoFill';
import toast from 'react-hot-toast';

const Register = () => {
  const [userIntent, setUserIntent] = useState(''); // 'tenant' or 'owner'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student' // Will be updated based on userIntent
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailVerification, setEmailVerification] = useState({
    sendingOtp: false,
    otpSent: false,
    showOtpInput: false,
    otp: '',
    verifying: false,
    isVerified: false
  });

  // Prevent duplicate registration requests
  const registrationInProgress = useRef(false);

  const navigate = useNavigate();
  const { registerSendOtp, register, user, loading: authLoading, setAuthUser } = useAuthContext();

  // Redirect if already logged in
  useEffect(() => {
    // Wait for auth to initialize before checking
    if (!authLoading && user) {
      console.log('User already logged in, redirecting to home...', user);
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Check for email not found error (from Google Auth or Login redirect)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    if (error === 'email_not_found') {
      toast.error(
        'Email not saved in database, register again',
        {
          duration: 6000,
          style: {
            borderRadius: '12px',
            background: '#fee2e2',
            color: '#b91c1c',
            border: '2px solid #f87171',
            fontSize: '14px',
            fontWeight: '500'
          }
        }
      );

      // Clear the error from URL without reload
      window.history.replaceState({}, document.title, '/register');
    }
  }, []);

  // Anti-autofill protection
  const initialFormData = {
    name: '',
    email: '',
    role: 'student'
  };

  usePreventAutoFill(formData, setFormData, initialFormData);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Check if user has selected their intent
    if (!userIntent) {
      toast.error('Please select whether you want to find a room or rent out a room');
      return false;
    }

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone || formData.phone.length !== 10) newErrors.phone = 'Valid 10-digit number required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const sendOTP = async () => {
    if (!validateForm()) {
      return;
    }

    setEmailVerification(prev => ({ ...prev, sendingOtp: true }));
    try {
      const result = await registerSendOtp(formData.email);
      if (result.success) {
        setEmailVerification(prev => ({
          ...prev,
          sendingOtp: false,
          otpSent: true,
          showOtpInput: true
        }));
        toast.success(result.message || 'OTP sent successfully!');
      } else {
        setEmailVerification(prev => ({ ...prev, sendingOtp: false }));
        toast.error(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      setEmailVerification(prev => ({ ...prev, sendingOtp: false }));
      toast.error(error.message || 'Failed to send OTP');
    }
  };

  const verifyOTPAndRegister = async () => {
    if (!emailVerification.otp || emailVerification.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    // Prevent duplicate registration requests
    if (registrationInProgress.current) {
      console.log('[REGISTER] Registration already in progress');
      return;
    }

    setEmailVerification(prev => ({ ...prev, verifying: true }));
    registrationInProgress.current = true;

    try {
      // Set role based on user intent
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone, // Added phone to registrationData
        role: userIntent === 'owner' ? 'owner' : 'student',
        otp: emailVerification.otp
      };

      const result = await register(registrationData);
      if (result && result.success) {
        setEmailVerification(prev => ({
          ...prev,
          verifying: false,
          isVerified: true,
          showOtpInput: false
        }));

        toast.success('Registration successful! Welcome to MESS WALLAH!');

        // Update global auth state immediately if user data returned
        if (setAuthUser && result.user) {
          setAuthUser(result.user);
        }

        navigate('/');
      } else {
        setEmailVerification(prev => ({ ...prev, verifying: false }));
        toast.error(result?.message || 'Registration or OTP verification failed');
      }
    } catch (error) {
      setEmailVerification(prev => ({ ...prev, verifying: false }));
      toast.error(error.message || 'Registration failed');
    } finally {
      registrationInProgress.current = false;
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setEmailVerification(prev => ({ ...prev, otp: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerification.otpSent) {
      sendOTP();
    } else {
      verifyOTPAndRegister();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
          >
            <UserCheck className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Join MESS WALLAH
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Find your perfect accommodation today
          </p>
        </div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* ROLE SELECTION */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mb-8"
            >
              <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
                What brings you to MESS WALLAH?
              </label>

              <div className="grid grid-cols-1 gap-4">
                {/* Tenant Option */}
                <motion.button
                  type="button"
                  onClick={() => !emailVerification.otpSent && setUserIntent('tenant')}
                  whileHover={{ scale: emailVerification.otpSent ? 1 : 1.02 }}
                  whileTap={{ scale: emailVerification.otpSent ? 1 : 0.98 }}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${userIntent === 'tenant'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800'
                    } ${emailVerification.otpSent ? 'opacity-75 cursor-default' : ''}`}
                >
                  {userIntent === 'tenant' && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-6 h-6 text-blue-500" />
                    </div>
                  )}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        I want to FIND A ROOM
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Student or professional looking to rent accommodation
                      </p>
                    </div>
                  </div>
                </motion.button>

                {/* Owner Option */}
                <motion.button
                  type="button"
                  onClick={() => !emailVerification.otpSent && setUserIntent('owner')}
                  whileHover={{ scale: emailVerification.otpSent ? 1 : 1.02 }}
                  whileTap={{ scale: emailVerification.otpSent ? 1 : 0.98 }}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${userIntent === 'owner'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 bg-white dark:bg-gray-800'
                    } ${emailVerification.otpSent ? 'opacity-75 cursor-default' : ''}`}
                >
                  {userIntent === 'owner' && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        I want to RENT OUT MY ROOM
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Property owner or landlord listing rooms for rent
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Only show rest of form if user has selected their intent */}
            <AnimatePresence>
              {userIntent && (
                <>
                  {/* Name Field */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="off"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        disabled={emailVerification.otpSent}
                        className={`w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white transition-all duration-200 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'} ${emailVerification.otpSent ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm mt-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Mobile Number Field */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.45 }}
                  >
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="off"
                        maxLength={10}
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={emailVerification.otpSent}
                        className={`w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white transition-all duration-200 ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'} ${emailVerification.otpSent ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                        placeholder="10-digit mobile number"
                      />
                    </div>
                    {errors.phone && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm mt-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Email Field with OTP Option */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="off"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          disabled={emailVerification.otpSent}
                          className={`w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white transition-all duration-200 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'} ${emailVerification.otpSent ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                          placeholder="Enter your email address"
                        />
                        {emailVerification.isVerified && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                      </div>
                      {!emailVerification.isVerified && (
                        <button
                          type="button"
                          onClick={sendOTP}
                          disabled={emailVerification.sendingOtp || !formData.email || emailVerification.otpSent}
                          className={`px-4 py-3 text-white rounded-xl font-medium transition-colors whitespace-nowrap ${emailVerification.otpSent ? 'bg-gray-400 cursor-default' : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                        >
                          {emailVerification.sendingOtp ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          ) : emailVerification.otpSent ? (
                            'OTP Sent'
                          ) : (
                            'Send OTP'
                          )}
                        </button>
                      )}
                    </div>
                    {errors.email && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm mt-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </motion.div>
                    )}

                    {/* OTP Input */}
                    <AnimatePresence>
                      {emailVerification.showOtpInput && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3"
                        >
                          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Enter OTP
                          </label>
                          <div className="flex gap-3">
                            <input
                              id="otp"
                              type="text"
                              value={emailVerification.otp}
                              onChange={handleOtpChange}
                              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white text-center text-lg tracking-widest font-medium"
                              placeholder="000000"
                              maxLength="6"
                            />
                            <button
                              type="button"
                              onClick={verifyOTPAndRegister}
                              disabled={emailVerification.verifying || emailVerification.otp.length !== 6 || registrationInProgress.current}
                              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {emailVerification.verifying ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                              ) : (
                                'Verify & Register'
                              )}
                            </button>
                          </div>
                          <div className="mt-2 text-sm text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setEmailVerification(prev => ({ ...prev, otpSent: false, showOtpInput: false, otp: '' }));
                              }}
                              className="text-orange-600 hover:text-orange-700 font-medium"
                            >
                              Edit Email Adddress
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Submit Button (Only visible before OTP is sent) */}
                  {!emailVerification.showOtpInput && (
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      type="submit"
                      disabled={emailVerification.sendingOtp}
                      className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {emailVerification.sendingOtp ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5 mr-2" />
                          Send Verification OTP
                        </>
                      )}
                    </motion.button>
                  )}
                </>
              )}
            </AnimatePresence>

            {/* Sign In Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-center pt-4"
            >
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 font-medium transition-colors group"
              >
                Already have an account? Sign in
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
