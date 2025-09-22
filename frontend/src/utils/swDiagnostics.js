// Service Worker Diagnostics Tool
export const diagnoseSWIssues = async () => {
  console.log('🔍 Diagnosing Service Worker Issues...');
  
  // URLs that the service worker tries to cache
  const urlsToTest = [
    '/',
    '/manifest.json',
    '/prevent-autofill.js',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
  ];
  
  const apiUrlsToTest = [
    '/api/rooms',
    '/api/rooms/featured',
    '/api/rooms/stats',
    '/api/search',
    '/api/analytics/summary'
  ];
  
  console.log('📋 Testing Static Assets:');
  for (const url of urlsToTest) {
    try {
      const response = await fetch(url);
      const status = response.ok ? '✅' : '❌';
      console.log(`${status} ${url} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error.message}`);
    }
  }
  
  console.log('\n📋 Testing API Endpoints:');
  for (const url of apiUrlsToTest) {
    try {
      const response = await fetch(url);
      const status = response.ok ? '✅' : '❌';
      console.log(`${status} ${url} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error.message}`);
    }
  }
  
  // Check service worker registration
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log('✅ Service Worker registered');
        console.log('📦 SW State:', registration.active?.state);
        console.log('📄 SW Script:', registration.active?.scriptURL);
      } else {
        console.log('❌ Service Worker not registered');
      }
    } catch (error) {
      console.log('❌ SW Registration Error:', error.message);
    }
  }
  
  // Check cache storage
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      console.log('📦 Available Caches:', cacheNames);
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        console.log(`📁 Cache "${cacheName}": ${keys.length} items`);
      }
    } catch (error) {
      console.log('❌ Cache Error:', error.message);
    }
  }
  
  console.log('🎉 Diagnosis complete!');
};

// Fix common service worker issues
export const fixSWIssues = async () => {
  console.log('🔧 Attempting to fix Service Worker issues...');
  
  try {
    // Unregister existing service worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('🗑️ Unregistered old service worker');
      }
    }
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log('🗑️ Deleted cache:', cacheName);
      }
    }
    
    // Register new service worker
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Registered new service worker');
      
      // Wait for it to be ready
      await navigator.serviceWorker.ready;
      console.log('✅ Service worker is ready');
    }
    
    console.log('🎉 Service Worker issues fixed! Refresh the page.');
    
  } catch (error) {
    console.error('❌ Failed to fix SW issues:', error);
  }
};

// Test offline functionality
export const testOfflineMode = () => {
  console.log('📴 Testing offline mode...');
  
  // Simulate offline
  const originalFetch = window.fetch;
  let offlineCount = 0;
  
  window.fetch = (url, options) => {
    offlineCount++;
    console.log(`📴 Offline request #${offlineCount}: ${url}`);
    return Promise.reject(new Error('Simulated offline'));
  };
  
  // Trigger offline event
  window.dispatchEvent(new Event('offline'));
  console.log('📴 Offline mode activated');
  
  // Restore after 5 seconds
  setTimeout(() => {
    window.fetch = originalFetch;
    window.dispatchEvent(new Event('online'));
    console.log('🌐 Online mode restored');
  }, 5000);
};

export default {
  diagnoseSWIssues,
  fixSWIssues,
  testOfflineMode
};
