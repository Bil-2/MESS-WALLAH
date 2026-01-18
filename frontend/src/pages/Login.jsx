import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Phone, Shield, AlertCircle, ArrowRight, Home, Key, BedDouble } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext.jsx';
import GoogleSignInButton from '../components/GoogleSignInButton';
import toast from 'react-hot-toast';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('otp');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { sendOtp, verifyOtp, login, user, loading: authLoading, setAuthUser } = useAuthContext();

  // Redirect if already logged in
  useEffect(() => {
    // Wait for auth to initialize before checking
    if (!authLoading && user) {
      console.log('User already logged in, redirecting to home...', user);
      const userRole = user?.role || 'user';
      if (userRole === 'owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, authLoading, navigate]);

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const cleanedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({
        ...formData,
        [name]: cleanedValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.phone) {
      setErrors({ phone: 'Phone number is required' });
      toast.error('Phone number is required');
      return;
    }

    if (formData.phone.length !== 10) {
      setErrors({ phone: 'Please enter a valid 10-digit phone number' });
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);
      console.log('[OTP] Sending OTP to:', formData.phone);
      const result = await sendOtp(formData.phone);
      console.log('[OTP] OTP Send Result:', result);

      if (result && result.success) {
        console.log('[SUCCESS] OTP sent successfully, showing input field');
        setOtpSent(true);

        toast.success('OTP sent successfully! Check your phone.');
      } else {
        console.error('[ERROR] OTP send failed:', result);
        const errorMsg = result?.message || 'Failed to send OTP';
        setErrors({ phone: errorMsg });
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('[ERROR] Error sending OTP:', error);
      const errorMsg = error.message || 'Failed to send OTP';
      setErrors({ phone: errorMsg });
      toast.error(errorMsg);
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
      const result = await verifyOtp(formData.phone, otp);

      if (result.success) {
        toast.success('Login successful!');

        // Update global auth state immediately
        if (setAuthUser && result.user) {
          setAuthUser(result.user);
        }

        const userRole = result.user?.role || result.role || 'user';
        if (userRole === 'owner') {
          navigate('/owner-dashboard');
        } else {
          // If profile completed, go home, else maybe profile?
          // For now keep standard redirect
          navigate('/');
        }
      } else {
        setErrors({ otp: result.message || 'Invalid OTP' });
        toast.error(result.message || 'Invalid OTP');
        setVerifyingOtp(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrors({ otp: error.message || 'Invalid OTP' });
      toast.error(error.message || 'Invalid OTP');
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

    if (!formData.password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    try {
      setLoading(true);
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success('Login successful!');

        // Update global auth state immediately
        if (setAuthUser && result.user) {
          setAuthUser(result.user);
        }

        const userRole = result.user?.role || result.role || 'user';
        if (userRole === 'owner') {
          navigate('/owner-dashboard');
        } else {
          navigate('/');
        }
      } else {
        // Handle different error scenarios
        setLoading(false);
        if (result.action === 'complete_registration') {
          setErrors({
            email: result.message,
            action: 'complete_registration'
          });
          toast.error('Please complete your registration first');
        } else if (result.attemptsRemaining !== undefined) {
          setErrors({
            email: result.message,
            password: `${result.attemptsRemaining} attempts remaining`
          });
          if (result.hint) {
            toast.error(result.hint);
          }
        } else {
          setErrors({ email: result.message || 'Invalid credentials' });
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setLoading(false);

      // Handle specific error cases
      if (error.message.includes('complete your registration')) {
        toast.error('Please complete your registration first');
        setErrors({
          email: 'You signed up using phone verification. Please complete your profile by registering with a password.',
          action: 'complete_registration'
        });

        // Optionally redirect to register page after a delay
        setTimeout(() => {
          navigate('/register');
        }, 3000);
      } else if (error.message.includes('Invalid credentials')) {
        setErrors({
          email: 'Invalid email or password. Please check your credentials and try again.',
          password: 'Please verify your password is correct'
        });
      } else {
        setErrors({ email: error.message || 'Login failed' });
      }
    }
    // NOTE: No finally block - state reset only on error, not on success
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (errors.otp) {
      setErrors({ ...errors, otp: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center py-6 px-4 relative overflow-hidden fade-in">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-orange-200 opacity-20 pulse">
          <Home className="w-24 h-24" />
        </div>
        <div className="absolute top-40 right-20 text-pink-200 opacity-20 pulse" style={{ animationDelay: '1s' }}>
          <Key className="w-16 h-16" />
        </div>
        <div className="absolute bottom-32 left-20 text-purple-200 opacity-20 pulse" style={{ animationDelay: '2s' }}>
          <BedDouble className="w-20 h-20" />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 slide-in-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-2xl scale-hover">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-800" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 4H5V5h14v2zm0 2H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm0 10H5v-8h14v8z" />
                    <rect x="7" y="11" width="2" height="2" />
                    <rect x="11" y="11" width="2" height="2" />
                    <rect x="15" y="11" width="2" height="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back!
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
            Sign in to your <span className="font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">MessWallah</span> account
          </p>

          {/* Safety Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-green-200 dark:border-green-800 scale-hover">
            <Shield className="w-4 h-4" />
            100% Girls Safety Guaranteed
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-6 card-hover">
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
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all btn-hover ${loginMethod === 'otp'
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
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all btn-hover ${loginMethod === 'password'
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
            <form className="space-y-4" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} autoComplete="off" noValidate>
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
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                      className={`w-full px-4 py-3 pl-10 border ${errors.phone
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                        } rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white input-focus`}
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
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                      value={otp}
                      onChange={handleOtpChange}
                      className={`w-full px-4 py-3 pl-10 border ${errors.otp
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                        } rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white text-center text-lg tracking-widest font-medium input-focus`}
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
                      className="mt-1 text-purple-600 dark:text-purple-400 hover:underline font-medium text-sm hover-lift"
                    >
                      Change number
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || verifyingOtp}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
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
            <form className="space-y-4" onSubmit={handlePasswordLogin} autoComplete="off" noValidate>
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
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-10 border ${errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                      } rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white input-focus`}
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
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-10 pr-10 border ${errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                      } rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white input-focus`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 scale-hover"
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
                    className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 hover-lift"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          )}

          {/* Google Sign-In - Only show for password login */}
          {loginMethod === 'password' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/90 dark:bg-gray-800/90 text-gray-500 dark:text-gray-400 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <GoogleSignInButton />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/90 dark:bg-gray-800/90 text-gray-500 dark:text-gray-400 font-medium">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/register"
                className="inline-flex items-center font-medium text-base text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover-lift"
              >
                Create MessWallah Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
