import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const OtpInput = ({ 
  length = 6, 
  onComplete, 
  loading = false, 
  error = false, 
  success = false,
  disabled = false,
  autoFocus = true,
  className = ""
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== '' && index < length - 1) {
      inputRefs.current[index + 1].focus();
      setFocusedIndex(index + 1);
    }

    // Call onComplete when all fields are filled
    if (newOtp.every(digit => digit !== '') && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      
      if (otp[index] !== '') {
        // Clear current field
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous field and clear it
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
        setFocusedIndex(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1].focus();
      setFocusedIndex(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, ''); // Remove non-digits
    const pasteArray = pasteData.split('').slice(0, length);
    
    if (pasteArray.length > 0) {
      const newOtp = [...otp];
      pasteArray.forEach((char, index) => {
        if (index < length) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex(val => val === '');
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(pasteArray.length, length - 1);
      inputRefs.current[focusIndex].focus();
      setFocusedIndex(focusIndex);

      // Call onComplete if all fields are filled
      if (newOtp.every(digit => digit !== '') && onComplete) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const handleFocus = (index) => {
    setFocusedIndex(index);
  };

  const clearOtp = () => {
    setOtp(new Array(length).fill(''));
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
      setFocusedIndex(0);
    }
  };

  // Expose clearOtp method
  useEffect(() => {
    if (error) {
      // Auto-clear on error after a delay
      const timer = setTimeout(clearOtp, 1500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getInputStyle = (index) => {
    let baseStyle = `
      w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold 
      border-2 rounded-xl transition-all duration-300 focus:outline-none
      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
    `;

    if (disabled || loading) {
      baseStyle += ' opacity-50 cursor-not-allowed';
    } else if (error) {
      baseStyle += ' border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 animate-pulse';
    } else if (success) {
      baseStyle += ' border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
    } else if (focusedIndex === index) {
      baseStyle += ' border-orange-500 ring-2 ring-orange-200 dark:ring-orange-800 scale-105 shadow-lg';
    } else if (otp[index] !== '') {
      baseStyle += ' border-orange-400 bg-orange-50 dark:bg-orange-900/20';
    } else {
      baseStyle += ' border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500';
    }

    return baseStyle;
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* OTP Input Fields */}
      <div className="flex justify-center space-x-2 sm:space-x-3">
        {otp.map((data, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.input
              ref={(ref) => inputRefs.current[index] = ref}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              onFocus={() => handleFocus(index)}
              disabled={disabled || loading}
              className={getInputStyle(index)}
              whileFocus={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              autoComplete="one-time-code"
            />
          </motion.div>
        ))}
      </div>

      {/* Status Indicators */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-2 text-orange-600 dark:text-orange-400"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Verifying...</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-2 text-red-600 dark:text-red-400"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Invalid OTP</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-2 text-green-600 dark:text-green-400"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">OTP Verified!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter the {length}-digit code sent to your phone
        </p>
        {!disabled && !loading && (
          <button
            onClick={clearOtp}
            className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mt-1 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpInput;
