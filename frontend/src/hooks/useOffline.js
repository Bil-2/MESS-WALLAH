import { useState, useEffect } from 'react';

const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedData, setCachedData] = useState({
    rooms: [],
    favorites: [],
    bookings: [],
    locations: [],
    lastUpdated: null
  });

  useEffect(() => {
    // Load cached data from localStorage
    const loadCachedData = () => {
      try {
        const cached = localStorage.getItem('messWallahCache');
        if (cached) {
          setCachedData(JSON.parse(cached));
        }
      } catch (error) {
        console.error('Error loading cached data:', error);
      }
    };

    loadCachedData();

    // Online/Offline event listeners
    const handleOnline = () => {
      setIsOnline(true);
      localStorage.setItem('lastOnlineTime', new Date().toISOString());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache data function
  const cacheData = (type, data) => {
    setCachedData(prev => {
      const updated = {
        ...prev,
        [type]: data,
        lastUpdated: new Date().toISOString()
      };
      
      try {
        localStorage.setItem('messWallahCache', JSON.stringify(updated));
      } catch (error) {
        console.error('Error caching data:', error);
      }
      
      return updated;
    });
  };

  // Get cached data by type
  const getCachedData = (type) => {
    return cachedData[type] || [];
  };

  // Clear cache
  const clearCache = () => {
    setCachedData({
      rooms: [],
      favorites: [],
      bookings: [],
      locations: [],
      lastUpdated: null
    });
    localStorage.removeItem('messWallahCache');
  };

  // Retry connection
  const retryConnection = async () => {
    return new Promise((resolve) => {
      // Simulate network check
      setTimeout(() => {
        const online = navigator.onLine;
        setIsOnline(online);
        resolve(online);
      }, 1000);
    });
  };

  return {
    isOnline,
    cachedData,
    cacheData,
    getCachedData,
    clearCache,
    retryConnection
  };
};

export default useOffline;
