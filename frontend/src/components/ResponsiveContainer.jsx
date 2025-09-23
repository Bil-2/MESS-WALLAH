import React from 'react';

const ResponsiveContainer = ({ 
  children, 
  className = '', 
  maxWidth = '1200px',
  padding = 'responsive' 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
    responsive: 'px-4 sm:px-6 lg:px-8'
  };

  return (
    <div 
      className={`w-full mx-auto ${paddingClasses[padding]} ${className}`}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
