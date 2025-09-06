import React, { memo } from 'react';

const LoadingSpinner = memo(({
  size = 'md',
  color = 'orange',
  className = '',
  text = 'Loading...',
  fullScreen = false,
  overlay = true
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    orange: 'border-orange-500 dark:border-orange-400',
    blue: 'border-blue-500 dark:border-blue-400',
    green: 'border-green-500 dark:border-green-400',
    red: 'border-red-500 dark:border-red-400',
    gray: 'border-gray-500 dark:border-gray-400',
    white: 'border-white dark:border-gray-200'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div
          className={`animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700 ${colorClasses[color]} ${sizeClasses[size]} transition-colors duration-200`}
          style={{ borderTopColor: 'transparent' }}
        />
        {/* Gradient ring for enhanced visual appeal */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-400 dark:to-red-500 opacity-20 ${sizeClasses[size]} transition-colors duration-200`}
          style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        />
      </div>
      {text && (
        <p className={`mt-3 ${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium animate-pulse transition-colors duration-200`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-200 ${overlay ? 'bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm' : ''
        }`}>
        <div className="text-center">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
