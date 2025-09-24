import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Eye, EyeOff, Lock, CheckCircle, AlertCircle, ArrowLeft 
} from '../utils/iconMappings';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    // Clear form data on component mount to prevent auto-fill issues
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setResetSuccess(false);
    
    if (!token) {
      toast.error('Invalid reset link');
      navigate('/forgot-password');
      return;
    }

    // Validate token format (accept both JWT and crypto tokens)
    try {
      if (!token || token.length < 10) {
        throw new Error('Token too short');
      }
      
      // Accept both JWT tokens (3 parts) and crypto tokens (hex strings)
      const tokenParts = token.split('.');
      const isJWT = tokenParts.length === 3;
      const isCryptoToken = /^[a-f0-9]+$/i.test(token) && token.length >= 32;
      
      if (!isJWT && !isCryptoToken) {
        throw new Error('Invalid token format');
      }
      
      setTokenValid(true);
    } catch (error) {
      setTokenValid(false);
      toast.error('Invalid or expired reset link');
    }
  }, [token, navigate]);

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return errors;
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[@$!%*?&])/.test(password)) score++;

    if (score <= 2) return { strength: 'weak', color: 'bg-red-500', text: 'Weak' };
    if (score <= 4) return { strength: 'medium', color: 'bg-yellow-500', text: 'Medium' };
    return { strength: 'strong', color: 'bg-green-500', text: 'Strong' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const passwordErrors = validatePassword(password);
    const newErrors = {};

    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = ['Passwords do not match'];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      
      const result = await api.post('/auth/reset-password', { token, newPassword: password });
      
      if (result.data.success) {
        setResetSuccess(true);
        toast.success('Password reset successfully!');
      } else {
        toast.error(result.data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reset password';
      toast.error(errorMessage);
      
      if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        setTimeout(() => {
          navigate('/forgot-password');
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Reset Link
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Password Reset Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  const passwordStrength = password ? getPasswordStrength(password) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center pt-24 pb-6 px-4 relative overflow-hidden fade-in">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" noValidate>
          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Password strength:</span>
                  <span className={`font-medium ${
                    passwordStrength.strength === 'weak' ? 'text-red-600' :
                    passwordStrength.strength === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{
                      width: passwordStrength.strength === 'weak' ? '33%' :
                             passwordStrength.strength === 'medium' ? '66%' : '100%'
                    }}
                  ></div>
                </div>
              </div>
            )}

            {errors.password && (
              <div className="mt-2 space-y-1">
                {errors.password.map((error, index) => (
                  <p key={index} className="text-sm text-red-600 dark:text-red-400">
                    • {error}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="mt-2 space-y-1">
                {errors.confirmPassword.map((error, index) => (
                  <p key={index} className="text-sm text-red-600 dark:text-red-400">
                    • {error}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
