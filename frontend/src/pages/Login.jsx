import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Phone, Sparkles, Shield, Heart, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext.jsx';
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

  const navigate = useNavigate();
  const { sendOtp, verifyOtp, login } = useAuthContext();

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
      await sendOtp(formData.phone);
      setOtpSent(true);
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error.message || 'Failed to send OTP');
      setErrors({ phone: error.message || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    try {
      setVerifyingOtp(true);
      await verifyOtp(formData.phone, otp);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || 'Invalid OTP');
      setErrors({ otp: error.message || 'Invalid OTP' });
    } finally {
      setVerifyingOtp(false);
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
      navigate('/dashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
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
          <motion.div className="mb-8" variants={itemVariants}>
            <div className="flex rounded-2xl bg-gray-100 dark:bg-gray-700/50 p-1.5 shadow-inner">
              <motion.button
                type="button"
                onClick={() => {
                  setLoginMethod('otp');
                  setOtpSent(false);
                  setOtp('');
                  setErrors({});
                }}
                className={`flex-1 py-3 px-6 text-sm font-bold rounded-xl transition-all duration-300 ${loginMethod === 'otp'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                whileHover={{ scale: loginMethod !== 'otp' ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Login with OTP
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  setLoginMethod('password');
                  setErrors({});
                }}
                className={`flex-1 py-3 px-6 text-sm font-bold rounded-xl transition-all duration-300 ${loginMethod === 'password'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                whileHover={{ scale: loginMethod !== 'password' ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Lock className="w-4 h-4 inline mr-2" />
                Login with Password
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {loginMethod === 'otp' ? (
              /* Enhanced OTP Login Form */
              <motion.form
                key="otp-form"
                className="space-y-5 sm:space-y-6"
                onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {!otpSent ? (
                  <motion.div variants={itemVariants}>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                      Phone Number
                    </label>
                    <InputField icon={Phone} error={errors.phone}>
                      <motion.input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength="10"
                        className={`w-full px-3 sm:px-4 py-3 sm:py-4 pl-10 sm:pl-12 border-2 ${errors.phone
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                          } rounded-xl sm:rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700/50 dark:text-white transition-all duration-300 text-base sm:text-lg backdrop-blur-sm`}
                        placeholder="Enter your phone number"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </InputField>
                  </motion.div>
                ) : (
                  <motion.div variants={itemVariants}>
                    <label htmlFor="otp" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                      Enter OTP
                    </label>
                    <InputField icon={Shield} error={errors.otp}>
                      <motion.input
                        id="otp"
                        type="text"
                        required
                        value={otp}
                        onChange={handleOtpChange}
                        className={`w-full px-3 sm:px-4 py-3 sm:py-4 border-2 ${errors.otp
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                          } rounded-xl sm:rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700/50 dark:text-white transition-all duration-300 text-center text-xl sm:text-2xl tracking-widest font-bold backdrop-blur-sm`}
                        placeholder="000000"
                        maxLength="6"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </InputField>
                    <motion.div
                      className="mt-4 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        OTP sent to <span className="font-bold text-orange-600">+91 {formData.phone}</span>
                      </p>
                      <motion.button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                          setErrors({});
                        }}
                        className="mt-2 text-purple-600 dark:text-purple-400 hover:underline font-bold text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Change number
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={loading || verifyingOtp}
                    className="group relative w-full flex justify-center items-center py-3 sm:py-4 px-4 sm:px-6 border border-transparent text-lg font-bold rounded-xl sm:rounded-2xl text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading || verifyingOtp ? (
                      <motion.div
                        className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : otpSent ? (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Verify OTP
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        <Phone className="w-5 h-5 mr-2" />
                        Send OTP
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>
            ) : (
              /* Enhanced Password Login Form */
              <motion.form
                key="password-form"
                className="space-y-5 sm:space-y-6"
                onSubmit={handlePasswordLogin}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div variants={itemVariants}>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                    Email address
                  </label>
                  <InputField icon={Mail} error={errors.email}>
                    <motion.input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-3 sm:py-4 pl-10 sm:pl-12 border-2 ${errors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                        } rounded-xl sm:rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700/50 dark:text-white transition-all duration-300 text-base sm:text-lg backdrop-blur-sm`}
                      placeholder="Enter your email"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </InputField>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                    Password
                  </label>
                  <InputField icon={Lock} error={errors.password}>
                    <motion.input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-3 sm:py-4 pl-10 sm:pl-12 pr-10 sm:pr-12 border-2 ${errors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                        } rounded-xl sm:rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700/50 dark:text-white transition-all duration-300 text-base sm:text-lg backdrop-blur-sm`}
                      placeholder="Enter your password"
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </motion.button>
                  </InputField>
                </motion.div>

                <motion.div className="flex items-center justify-between" variants={itemVariants}>
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300 font-medium">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-bold text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center items-center py-3 sm:py-4 px-4 sm:px-6 border border-transparent text-lg font-bold rounded-xl sm:rounded-2xl text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <motion.div
                        className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        <Heart className="w-5 h-5 mr-2" />
                        Sign in
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Enhanced Footer */}
          <motion.div className="mt-6 sm:mt-8" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 sm:px-4 bg-white/90 dark:bg-gray-800/90 text-gray-500 dark:text-gray-400 font-medium backdrop-blur-sm">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <Link
                to="/register"
                className="group inline-flex items-center font-bold text-base sm:text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Create MessWallah Account
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
