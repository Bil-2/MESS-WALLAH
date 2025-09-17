import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Phone, Sparkles, Shield, Heart, ArrowRight, CheckCircle2, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext.jsx';
import OtpInput from '../components/OtpInput';
import toast from 'react-hot-toast';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' or 'password'
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);

  const navigate = useNavigate();
  const { sendOtp, verifyOtp, resendOtp, login } = useAuthContext();

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (otpSent && countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, otpSent]);

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.phone) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrors({ phone: 'Please enter a valid 10-digit Indian phone number' });
      return;
    }

    try {
      setLoading(true);
      const result = await sendOtp(formData.phone);
      
      if (result.success) {
        setOtpSent(true);
        setCountdown(60); // 60 seconds countdown
        setCanResend(false);
        setOtpError(false);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrors({ phone: error.message || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      setLoading(true);
      const result = await resendOtp(formData.phone);
      
      if (result.success) {
        setCountdown(60);
        setCanResend(false);
        setOtpError(false);
        setOtp(''); // Clear previous OTP
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpComplete = async (otpValue) => {
    setOtp(otpValue);
    setOtpError(false);
    
    try {
      setVerifyingOtp(true);
      const result = await verifyOtp(formData.phone, otpValue);
      
      if (result.success) {
        setOtpSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError(true);
      setOtp(''); // Clear OTP on error
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp && otp.length === 6) {
      await handleOtpComplete(otp);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    if (!formData.password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    if (formData.password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters long' });
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error(error.message || 'Login failed');
      setErrors({ password: error.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (errors.otp) {
      setErrors({ ...errors, otp: '' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const InputField = ({ icon: Icon, error, children, ...props }) => (
    <div className="space-y-2">
      <div className="relative">
        {children}
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-500 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center py-6 px-4 relative overflow-hidden fade-in">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 pulse">
          🏠
        </div>
        <div className="absolute top-40 right-20 text-4xl opacity-10 pulse" style={{animationDelay: '1s'}}>
          🔑
        </div>
        <div className="absolute bottom-32 left-20 text-5xl opacity-10 pulse" style={{animationDelay: '2s'}}>
          🛏️
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 slide-in-up">
        {/* Header */}
        <motion.div className="text-center mb-6 sm:mb-8" variants={itemVariants}>
          <motion.div
            className="flex justify-center mb-4 sm:mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl shadow-2xl"
                animate={{
                  boxShadow: [
                    "0 20px 40px rgba(251, 146, 60, 0.3)",
                    "0 25px 50px rgba(236, 72, 153, 0.4)",
                    "0 20px 40px rgba(251, 146, 60, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-gray-800"
                    fill="currentColor"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 4H5V5h14v2zm0 2H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm0 10H5v-8h14v8z" />
                    <rect x="7" y="11" width="2" height="2" />
                    <rect x="11" y="11" width="2" height="2" />
                    <rect x="15" y="11" width="2" height="2" />
                  </svg>
                </div>
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-3 sm:mb-4"
            variants={itemVariants}
          >
            Welcome Back!
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 px-2"
            variants={itemVariants}
          >
            Sign in to your <span className="font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">MessWallah</span> account
          </motion.p>

          {/* Enhanced Safety Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold shadow-lg border border-green-200 dark:border-green-800"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            100% Girls Safety Guaranteed
          </motion.div>
        </motion.div>

        {/* Main Form Container */}
        <motion.div
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-6 sm:p-8"
          variants={itemVariants}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Login Method Toggle */}
          <div className="mb-6">
            <div className="flex rounded-xl bg-gray-100 dark:bg-gray-700/50 p-1">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('otp');
                  setOtpSent(false);
                  setOtp('');
                  setErrors({});
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg ${loginMethod === 'otp'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Login with OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('password');
                  setErrors({});
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg ${loginMethod === 'password'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
              >
                <Lock className="w-4 h-4 inline mr-2" />
                Login with Password
              </button>
            </div>
          </div>

          {loginMethod === 'otp' ? (
            /* OTP Login Form */
            <form className="space-y-4" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
              {!otpSent ? (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                      className={`w-full px-4 py-3 pl-10 border ${errors.phone
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                        } rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={handleOtpChange}
                      className={`w-full px-4 py-3 pl-10 border ${errors.otp
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                        } rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white text-center text-lg tracking-widest font-medium`}
                      placeholder="000000"
                      maxLength="6"
                    />
                  </div>
                  {errors.otp && (
                    <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.otp}
                    </div>
                  )}
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      OTP sent to <span className="font-medium text-orange-600">+91 {formData.phone}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                        setErrors({});
                      }}
                      className="mt-1 text-purple-600 dark:text-purple-400 hover:underline font-medium text-sm"
                    >
                      Change number
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || verifyingOtp}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading || verifyingOtp ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : otpSent ? (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Verify OTP
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5 mr-2" />
                    Send OTP
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Password Login Form */
            <form className="space-y-4" onSubmit={handlePasswordLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-10 border ${errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                      } rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-10 pr-10 border ${errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                      } rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/register"
                className="inline-flex items-center font-medium text-base text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Create MessWallah Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
