import React from 'react';

const Logo = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: { width: 32, height: 32, text: 'text-lg' },
    md: { width: 40, height: 40, text: 'text-xl' },
    lg: { width: 48, height: 48, text: 'text-2xl' },
    xl: { width: 64, height: 64, text: 'text-3xl' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <svg
          width={currentSize.width}
          height={currentSize.height}
          viewBox="0 0 48 48"
          className="text-orange-600"
          fill="none"
        >
          {/* Building/Mess Hall Icon */}
          <path 
            d="M6 42V18L24 6L42 18V42H6Z" 
            fill="currentColor" 
            opacity="0.9"
          />
          <path 
            d="M12 42V24H36V42H12Z" 
            fill="white"
          />
          
          {/* Windows */}
          <rect x="16" y="28" width="4" height="6" fill="currentColor" opacity="0.7"/>
          <rect x="28" y="28" width="4" height="6" fill="currentColor" opacity="0.7"/>
          <rect x="22" y="30" width="4" height="4" fill="currentColor" opacity="0.7"/>
          
          {/* Roof detail */}
          <path 
            d="M4 18L24 4L44 18L24 8L4 18Z" 
            fill="#ea580c" 
            opacity="0.8"
          />
          
          {/* Door */}
          <rect x="22" y="36" width="4" height="6" fill="currentColor" opacity="0.8"/>
          
          {/* Chimney smoke */}
          <circle cx="38" cy="14" r="1.5" fill="#9ca3af" opacity="0.6"/>
          <circle cx="40" cy="12" r="1" fill="#9ca3af" opacity="0.4"/>
          <circle cx="36" cy="11" r="0.8" fill="#9ca3af" opacity="0.3"/>
          
          {/* Decorative elements */}
          <circle cx="24" cy="20" r="1" fill="#fbbf24" opacity="0.8"/>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold text-gray-900 ${currentSize.text} leading-none tracking-tight`}>
          MESS
        </span>
        <span className={`font-bold text-orange-600 ${currentSize.text} leading-none -mt-1 tracking-tight`}>
          WALLAAH
        </span>
      </div>
    </div>
  );
};

export default Logo;
