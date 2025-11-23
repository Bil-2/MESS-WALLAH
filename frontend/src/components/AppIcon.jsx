import React from 'react';

const AppIcon = ({ size = 64, className = "" }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Modern App Icon with Gradient Background */}
      <div
        className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #ff1744 50%, #e91e63 75%, #9c27b0 100%)',
          borderRadius: size * 0.22 // 22% border radius for modern app icon look
        }}
      >
        {/* Inner glow effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%)'
          }}
        />

        {/* Main Icon Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Building/Room Icon */}
          <svg
            width={size * 0.5}
            height={size * 0.5}
            viewBox="0 0 24 24"
            fill="none"
            className="text-white drop-shadow-lg"
          >
            {/* Building structure */}
            <rect x="4" y="6" width="16" height="16" rx="2" fill="currentColor" fillOpacity="0.9" />
            <rect x="6" y="8" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.3)" />
            <rect x="10" y="8" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.3)" />
            <rect x="15" y="8" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.3)" />
            <rect x="6" y="12" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.3)" />
            <rect x="10" y="12" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.3)" />
            <rect x="15" y="12" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.3)" />
            <rect x="8" y="17" width="8" height="4" rx="1" fill="rgba(255,255,255,0.9)" />

            {/* Roof/Top accent */}
            <path d="M4 6 L12 2 L20 6" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8" />
          </svg>
        </div>

        {/* Bottom highlight */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 opacity-10"
          style={{
            background: 'linear-gradient(to top, rgba(255,255,255,0.3) 0%, transparent 100%)'
          }}
        />
      </div>

      {/* Outer glow for premium effect */}
      <div
        className="absolute inset-0 rounded-3xl opacity-20 blur-xl"
        style={{
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #ff1744 50%, #e91e63 75%, #9c27b0 100%)',
          borderRadius: size * 0.22,
          transform: 'scale(1.1)'
        }}
      />
    </div>
  );
};

export default AppIcon;
