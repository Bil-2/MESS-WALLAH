import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Home, 
  Heart, 
  Calendar,
  MapPin,
  Star,
  Clock,
  Download,
  Smartphone,
  Globe
} from 'lucide-react';

const OfflinePage = ({ onRetry, cachedData = {} }) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('offline');
  const [lastOnline, setLastOnline] = useState(null);

  useEffect(() => {
    // Set last online time
    const lastOnlineTime = localStorage.getItem('lastOnlineTime');
    if (lastOnlineTime) {
      setLastOnline(new Date(lastOnlineTime));
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setConnectionStatus('online');
      localStorage.setItem('lastOnlineTime', new Date().toISOString());
    };

    const handleOffline = () => {
      setConnectionStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate retry delay
      if (onRetry) {
        await onRetry();
      }
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const cachedFeatures = [
    {
      icon: Home,
      title: 'Browse cached room listings',
      description: 'View previously loaded rooms and their details',
      available: cachedData.rooms?.length > 0,
      count: cachedData.rooms?.length || 0
    },
    {
      icon: Heart,
      title: 'View your saved favorites',
      description: 'Access your bookmarked rooms offline',
      available: cachedData.favorites?.length > 0,
      count: cachedData.favorites?.length || 0
    },
    {
      icon: Calendar,
      title: 'Access booking information',
      description: 'Review your current and past bookings',
      available: cachedData.bookings?.length > 0,
      count: cachedData.bookings?.length || 0
    },
    {
      icon: MapPin,
      title: 'Explore saved locations',
      description: 'Browse rooms in your preferred cities',
      available: cachedData.locations?.length > 0,
      count: cachedData.locations?.length || 0
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center text-white shadow-2xl"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">MW</span>
          </div>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative">
            <WifiOff className="w-16 h-16 mx-auto text-white/80 mb-4" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
            >
              <span className="text-xs font-bold">!</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            It looks like you've lost your internet connection. Don't worry, 
            you can still browse some content from your cache!
          </p>
          
          {lastOnline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/60 text-sm mt-4 flex items-center justify-center"
            >
              <Clock className="w-4 h-4 mr-2" />
              Last online: {lastOnline.toLocaleString()}
            </motion.p>
          )}
        </motion.div>

        {/* Retry Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleRetry}
          disabled={isRetrying}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-2xl mb-8 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <div className="flex items-center justify-center">
            {isRetrying ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Checking Connection...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </>
            )}
          </div>
        </motion.button>

        {/* Cached Features */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          {cachedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                  feature.available 
                    ? 'bg-white/20 hover:bg-white/30 cursor-pointer' 
                    : 'bg-white/10 opacity-50'
                }`}
              >
                <div className={`p-2 rounded-lg mr-4 ${
                  feature.available ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{feature.title}</h3>
                    {feature.available && feature.count > 0 && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        {feature.count}
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 text-xs mt-1">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Connection Tips */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-white/10 rounded-xl"
        >
          <h4 className="font-semibold text-sm mb-3 flex items-center justify-center">
            <Globe className="w-4 h-4 mr-2" />
            Connection Tips
          </h4>
          <div className="space-y-2 text-xs text-white/70">
            <div className="flex items-center">
              <Wifi className="w-3 h-3 mr-2" />
              Check your WiFi connection
            </div>
            <div className="flex items-center">
              <Smartphone className="w-3 h-3 mr-2" />
              Try switching to mobile data
            </div>
            <div className="flex items-center">
              <RefreshCw className="w-3 h-3 mr-2" />
              Restart your router if needed
            </div>
          </div>
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 flex items-center justify-center"
        >
          <div className={`w-3 h-3 rounded-full mr-2 ${
            connectionStatus === 'online' ? 'bg-green-400' : 'bg-red-400'
          }`}></div>
          <span className="text-xs text-white/60">
            {connectionStatus === 'online' ? 'Back Online!' : 'Currently Offline'}
          </span>
        </motion.div>
      </motion.div>

      {/* Background Animation */}
      <div className="fixed inset-0 -z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default OfflinePage;
