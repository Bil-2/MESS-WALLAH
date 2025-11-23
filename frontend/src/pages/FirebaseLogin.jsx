import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Phone, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext.jsx';
import firebasePhoneAuth from '../services/firebasePhoneAuth';
import toast from 'react-hot-toast';

const FirebaseLogin = () => {
  const [loginMethod, setLoginMethod] = useState('firebase-otp');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuthContext();

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      firebasePhoneAuth.clearRecaptcha();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const cleanedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: cleanedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Send OTP using Firebase
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.phone || formData.phone.length !== 10) {
      setErrors({ phone: 'Please enter a valid 10-digit phone number' });
      return;
    }

    try {
      setLoading(true);
      console.log('🔥 Sending Firebase OTP to:', formData.phone);
      
      const result = await firebasePhoneAuth.sendOTP(formData.phone);
      console.log('📱 Firebase OTP Result:', result);

      if (result.success) {
        setOtpSent(true);
        toast.success('OTP sent successfully via Firebase!');
      } else {
        setErrors({ phone: result.message });
        toast.error(result.message);
      }
    } catch (error) {
      console.error('💥 Firebase OTP Error:', error);
      setErrors({ phone: error.message });
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP using Firebase
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    try {
      setLoading(true);
      console.log('🔥 Verifying Firebase OTP:', otp);
      
      const result = await firebasePhoneAuth.verifyOTP(otp);
      console.log('✅ Firebase Verification Result:', result);

      if (result.success) {
        toast.success('Phone verified successfully!');
        
        // Here you can send the Firebase token to your backend
        // to create/login the user in your database
        console.log('Firebase User:', result.user);
        console.log('Firebase Token:', result.user.idToken);
        
        // Navigate to home or dashboard
        navigate('/');
      } else {
        setErrors({ otp: result.message });
        toast.error(result.message);
      }
    } catch (error) {
      console.error('💥 Firebase Verification Error:', error);
      setErrors({ otp: error.message });
      toast.error('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const result = await firebasePhoneAuth.resendOTP(formData.phone);
      
      if (result.success) {
        toast.success('OTP resent successfully!');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.email || !formData.password) {
      setErrors({ 
        email: !formData.email ? 'Email is required' : '',
        password: !formData.password ? 'Password is required' : ''
      });
      return;
    }

    try {
      setLoading(true);
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        setErrors({ email: result.message });
        toast.error(result.message);
      }
    } catch (error) {
      setErrors({ email: error.message });
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4 pt-20">
      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container"></div>

      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to continue to MESS WALLAH
            </p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginMethod('firebase-otp')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                loginMethod === 'firebase-otp'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Firebase OTP
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
          </div>

          {/* Firebase OTP Login */}
          {loginMethod === 'firebase-otp' && (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
              {!otpSent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter 10-digit mobile number"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white ${
                          errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        maxLength="10"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Send OTP via Firebase
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800 dark:text-green-200 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      OTP sent to +91{formData.phone} via Firebase
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(value);
                        if (errors.otp) setErrors({ ...errors, otp: '' });
                      }}
                      placeholder="Enter 6-digit OTP"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white text-center text-2xl tracking-widest ${
                        errors.otp ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      maxLength="6"
                    />
                    {errors.otp && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.otp}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>

                  <div className="flex justify-between items-center text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                        setErrors({});
                      }}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Change Number
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* Email/Password Login */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white ${
                      errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-600 hover:text-orange-700 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            <strong>Firebase Phone Auth:</strong> Free 10,000 verifications/month
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseLogin;
