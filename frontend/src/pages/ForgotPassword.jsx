import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, ArrowLeft, Shield, CheckCircle, AlertCircle 
} from '../utils/iconMappings';
import { useAuthContext } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { forgotPassword } = useAuthContext();

  // Clear form data on component mount to prevent auto-fill issues
  useEffect(() => {
    setEmail('');
    setErrors({});
    setEmailSent(false);
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    try {
      setLoading(true);
      
      const result = await forgotPassword(email);
      
      if (result.success) {
        setEmailSent(true);
      } else {
        setErrors({ email: result.message || 'Failed to send reset email' });
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      const message = error.message || 'Failed to send reset email';
      setErrors({ email: message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ ...errors, email: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center pt-24 pb-6 px-4 relative overflow-hidden fade-in">
      <div className="w-full max-w-md slide-in-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
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

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No worries! Enter your email and we'll send you a reset link.
          </p>

          {/* Safety Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4" />
            Secure Password Recovery
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          {!emailSent ? (
            <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off" noValidate>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
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
                    value={email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-10 border ${errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                      } rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Success Message */
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Email Sent Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We've sent a password reset link to <span className="font-medium text-orange-600">{email}</span>
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                >
                  Try different email
                </button>
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
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Remember your password?
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center font-medium text-base text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact our support team at{' '}
            <a 
              href="mailto:support@messwallah.com" 
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              support@messwallah.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
