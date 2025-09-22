// Offline functionality test utility
export const testOfflineFeatures = () => {
  console.log('🧪 Testing Offline Features...');
  
  // Test 1: Service Worker Registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(registration => {
      if (registration) {
        console.log('✅ Service Worker is registered');
        console.log('📦 Cache Name:', registration.active?.scriptURL);
      } else {
        console.log('❌ Service Worker not registered');
      }
    });
  } else {
    console.log('❌ Service Worker not supported');
  }
  
  // Test 2: Cache Storage
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      console.log('📦 Available Caches:', cacheNames);
      
      cacheNames.forEach(cacheName => {
        caches.open(cacheName).then(cache => {
          cache.keys().then(keys => {
            console.log(`📁 Cache "${cacheName}" contains ${keys.length} items`);
          });
        });
      });
    });
  }
  
  // Test 3: Local Storage Cache
  const cachedData = localStorage.getItem('messWallahCache');
  if (cachedData) {
    const parsed = JSON.parse(cachedData);
    console.log('💾 LocalStorage Cache:', {
      rooms: parsed.rooms?.length || 0,
      favorites: parsed.favorites?.length || 0,
      bookings: parsed.bookings?.length || 0,
      locations: parsed.locations?.length || 0,
      lastUpdated: parsed.lastUpdated
    });
  } else {
    console.log('💾 No LocalStorage cache found');
  }
  
  // Test 4: Network Status
  console.log('🌐 Network Status:', navigator.onLine ? 'Online' : 'Offline');
  
  // Test 5: Background Sync Support
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    console.log('✅ Background Sync supported');
  } else {
    console.log('❌ Background Sync not supported');
  }
  
  console.log('🎉 Offline test complete!');
};

// Simulate offline mode for testing
export const simulateOffline = () => {
  console.log('📴 Simulating offline mode...');
  
  // Override fetch to simulate network failure
  const originalFetch = window.fetch;
  window.fetch = () => Promise.reject(new Error('Simulated offline'));
  
  // Dispatch offline event
  window.dispatchEvent(new Event('offline'));
  
  // Restore after 10 seconds
  setTimeout(() => {
    window.fetch = originalFetch;
    window.dispatchEvent(new Event('online'));
    console.log('🌐 Back online!');
  }, 10000);
};

// Test cache performance
export const testCachePerformance = async () => {
  console.log('⚡ Testing cache performance...');
  
  const testUrls = [
    '/api/rooms',
    '/api/rooms/featured',
    '/api/rooms/stats'
  ];
  
  for (const url of testUrls) {
    const startTime = performance.now();
    
    try {
      const response = await fetch(url);
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`📊 ${url}: ${duration.toFixed(2)}ms (${response.ok ? 'Success' : 'Failed'})`);
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`📊 ${url}: ${duration.toFixed(2)}ms (Cache/Offline)`);
    }
  }
};

// Export all test functions
export default {
  testOfflineFeatures,
  simulateOffline,
  testCachePerformance
};
