import React from 'react';
import { AnimatePresence } from 'framer-motion';
import OfflinePage from './OfflinePage';
import useOffline from '../hooks/useOffline';

const OfflineWrapper = ({ children, showOfflinePageWhenOffline = true }) => {
  const { isOnline, cachedData, retryConnection } = useOffline();

  if (!isOnline && showOfflinePageWhenOffline) {
    return (
      <AnimatePresence>
        <OfflinePage 
          onRetry={retryConnection}
          cachedData={cachedData}
        />
      </AnimatePresence>
    );
  }

  return (
    <>
      {children}
      {/* Offline Banner for partial offline experience */}
      {!isOnline && !showOfflinePageWhenOffline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">You're currently offline</span>
          </div>
        </div>
      )}
    </>
  );
};

export default OfflineWrapper;
