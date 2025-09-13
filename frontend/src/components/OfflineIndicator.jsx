import React, { useState, useEffect } from 'react';
import { FiWifiOff, FiWifi, FiRefreshCw } from 'react-icons/fi';
import { usePWA } from '../hooks/usePWA';

const OfflineIndicator = () => {
  const { isOnline } = usePWA();
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      setShowOnlineMessage(true);
      const timer = setTimeout(() => {
        setShowOnlineMessage(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="animate-pulse">
                <FiWifiOff size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm">You're offline</p>
                <p className="text-white/80 text-xs">Some features may be limited</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
            >
              <FiRefreshCw size={14} className="animate-spin" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showOnlineMessage) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center space-x-2">
            <FiWifi size={16} />
            <span className="text-sm font-medium">Back online!</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OfflineIndicator;
