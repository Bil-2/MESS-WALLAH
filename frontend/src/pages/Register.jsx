import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone, Sparkles, Shield, Heart, UserCheck, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneVerification, setPhoneVerification] = useState({
    sendingOtp: false,
    otpSent: false,
    showOtpInput: false,
    otp: '',
    verifying: false,
    isVerified: false
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { sendOtp, verifyOtp, register } = useAuthContext();

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters long';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!phoneVerification.isVerified) {
      toast.error('Please verify your phone number before creating account');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error);
      toast.error(error.message || 'Registration failed');
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

  const sendOTP = async () => {
    if (!formData.phone) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrors({ phone: 'Please enter a valid 10-digit Indian phone number' });
      return;
    }

    try {
      setPhoneVerification(prev => ({ ...prev, sendingOtp: true }));
      await sendOtp(formData.phone);
      setPhoneVerification(prev => ({
        ...prev,
        otpSent: true,
        showOtpInput: true,
        sendingOtp: false
      }));
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error.message || 'Failed to send OTP');
      setPhoneVerification(prev => ({ ...prev, sendingOtp: false }));
    }
  };

  const verifyOTP = async () => {
    if (!phoneVerification.otp || phoneVerification.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setPhoneVerification(prev => ({ ...prev, verifying: true }));
      await verifyOtp(formData.phone, phoneVerification.otp);
      setPhoneVerification(prev => ({
        ...prev,
        isVerified: true,
        verifying: false,
        showOtpInput: false
      }));
      toast.success('Phone number verified successfully!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || 'Invalid OTP');
      setPhoneVerification(prev => ({ ...prev, verifying: false }));
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPhoneVerification(prev => ({ ...prev, otp: value }));
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
                👩‍🍳
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
            Join MessWallah
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 px-2"
            variants={itemVariants}
          >
            Create your account for <span className="font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">safe accommodation</span>
          </motion.p>

          {/* Enhanced Safety Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold shadow-lg border border-green-200 dark:border-green-800"
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400 }}
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
          <motion.form className="space-y-6" onSubmit={handleSubmit} variants={containerVariants}>
            {/* Name Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Full Name
              </label>
              <InputField icon={User} error={errors.name}>
                <motion.input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 pl-12 border-2 ${errors.name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    } rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700/50 dark:text-white transition-all duration-300 text-lg backdrop-blur-sm`}
                  placeholder="Enter your full name"
                  whileFocus={{ scale: 1.02 }}
                />
              </InputField>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
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
                  className={`w-full px-4 py-4 pl-12 border-2 ${errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    } rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700/50 dark:text-white transition-all duration-300 text-lg backdrop-blur-sm`}
                  placeholder="Enter your email"
                  whileFocus={{ scale: 1.02 }}
                />
              </InputField>
            </motion.div>

            {/* Phone Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Phone Number
                {phoneVerification.isVerified && (
                  <motion.span
                    className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </motion.span>
                )}
              </label>
              <InputField icon={Phone} error={errors.phone}>
                <motion.input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={phoneVerification.isVerified}
                  className={`w-full px-4 py-4 pl-12 border-2 ${errors.phone
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    } rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700/50 dark:text-white transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-600 text-lg backdrop-blur-sm`}
                  placeholder="Enter 10-digit phone number"
                  whileFocus={{ scale: phoneVerification.isVerified ? 1 : 1.02 }}
                />
              </InputField>
            </motion.div>

            {/* Role Selection */}
            <motion.div variants={itemVariants}>
              <label htmlFor="role" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                I am a
              </label>
              <div className="relative">
                <motion.select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-4 pl-12 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 text-lg backdrop-blur-sm"
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="student">Student</option>
                  <option value="owner">Property Owner</option>
                </motion.select>
                <UserCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </motion.div>

            {/* Password Fields */}
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Password
              </label>
              <InputField icon={Lock} error={errors.password}>
                <motion.input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 pl-12 pr-12 border-2 ${errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    } rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700/50 dark:text-white transition-all duration-300 text-lg backdrop-blur-sm`}
                  placeholder="Create a password"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
              </InputField>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Confirm Password
              </label>
              <InputField icon={Lock} error={errors.confirmPassword}>
                <motion.input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 pl-12 pr-12 border-2 ${errors.confirmPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    } rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700/50 dark:text-white transition-all duration-300 text-lg backdrop-blur-sm`}
                  placeholder="Confirm your password"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
              </InputField>
            </motion.div>

            {/* OTP Verification */}
            {!phoneVerification.isVerified && (
              <motion.div variants={itemVariants}>
                <motion.button
                  type="button"
                  onClick={sendOTP}
                  disabled={phoneVerification.sendingOtp || phoneVerification.otpSent}
                  className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {phoneVerification.sendingOtp ? (
                    <motion.div
                      className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : phoneVerification.otpSent ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      OTP Sent
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
            )}

            {/* OTP Input */}
            <AnimatePresence>
              {phoneVerification.showOtpInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div variants={itemVariants} className="space-y-4">
                    <label htmlFor="otp" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                      Enter OTP
                    </label>
                    <div className="relative">
                      <motion.input
                        id="otp"
                        type="text"
                        required
                        value={phoneVerification.otp}
                        onChange={handleOtpChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 text-center text-2xl tracking-widest font-bold backdrop-blur-sm"
                        placeholder="000000"
                        maxLength="6"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>
                    <motion.button
                      type="button"
                      onClick={verifyOTP}
                      disabled={phoneVerification.verifying}
                      className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {phoneVerification.verifying ? (
                        <motion.div
                          className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>
                          <Shield className="w-5 h-5 mr-2" />
                          Verify OTP
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading || !phoneVerification.isVerified}
                className="group w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                whileHover={{ scale: loading || !phoneVerification.isVerified ? 1 : 1.02, y: loading || !phoneVerification.isVerified ? 0 : -2 }}
                whileTap={{ scale: loading || !phoneVerification.isVerified ? 1 : 0.98 }}
              >
                {loading ? (
                  <motion.div
                    className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <UserCheck className="w-5 h-5 mr-2" />
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Enhanced Footer */}
          <motion.div className="mt-8" variants={itemVariants}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/90 dark:bg-gray-800/90 text-gray-500 dark:text-gray-400 font-medium backdrop-blur-sm">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="group inline-flex items-center font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Sign in to MessWallah
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
