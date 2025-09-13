import React, { useState, useEffect } from 'react';
import { FiDownload, FiX, FiBell, FiSmartphone } from 'react-icons/fi';
import { usePWA } from '../hooks/usePWA';

const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, installApp, requestNotificationPermission, showNotification } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await installApp();
      if (success) {
        setShowPrompt(false);
        setTimeout(() => {
          setShowNotificationPrompt(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleNotificationPermission = async () => {
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      showNotification('Welcome to MESS WALLAH!', {
        body: 'You\'ll now receive updates about your bookings and new properties.',
        tag: 'welcome'
      });
    }
    setShowNotificationPrompt(false);
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  const dismissNotificationPrompt = () => {
    setShowNotificationPrompt(false);
  };

  if (showPrompt) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <FiSmartphone className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Install MESS WALLAH
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get the app experience
                  </p>
                </div>
              </div>
              <button
                onClick={dismissPrompt}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Faster access to your bookings</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Offline browsing capability</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Push notifications for updates</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={dismissPrompt}
                className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInstalling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Installing...</span>
                  </>
                ) : (
                  <>
                    <FiDownload />
                    <span>Install App</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showNotificationPrompt) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <FiBell className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Stay Updated
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable notifications
                  </p>
                </div>
              </div>
              <button
                onClick={dismissNotificationPrompt}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get notified about booking confirmations, payment updates, and new properties in your area.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={dismissNotificationPrompt}
                className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Not Now
              </button>
              <button
                onClick={handleNotificationPermission}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center space-x-2"
              >
                <FiBell />
                <span>Enable</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;
