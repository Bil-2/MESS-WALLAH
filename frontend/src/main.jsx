import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

// Performance monitoring
if (typeof window !== 'undefined') {
  // Register service worker for PWA functionality
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registered successfully:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  if (confirm('A new version of MESS WALLAH is available. Would you like to update?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('[SW] Service Worker registration failed:', error);
        });
    });
  }

  // Performance monitoring with Web Vitals
  const reportWebVitals = (metric) => {
    console.log('[Performance]', metric);
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // You can send metrics to your analytics service here
      // Example: gtag('event', metric.name, { value: metric.value });
    }
  };

  // Load Web Vitals dynamically to avoid blocking
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getFCP(reportWebVitals);
    getLCP(reportWebVitals);
    getTTFB(reportWebVitals);
  }).catch(() => {
    console.log('[Performance] Web Vitals not available');
  });

  // Network status monitoring
  const updateNetworkStatus = () => {
    const status = navigator.onLine ? 'online' : 'offline';
    document.body.setAttribute('data-network-status', status);
    
    if (!navigator.onLine) {
      console.log('[Network] Application is offline');
    } else {
      console.log('[Network] Application is online');
    }
  };

  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  updateNetworkStatus(); // Initial check

  // Preload critical resources
  const preloadCriticalResources = () => {
    const criticalRoutes = ['/rooms', '/login', '/register'];
    
    criticalRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  };

  // Preload after initial load
  setTimeout(preloadCriticalResources, 2000);

  // Memory usage monitoring (development only)
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    setInterval(() => {
      const memInfo = performance.memory;
      const memoryUsage = {
        used: Math.round(memInfo.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memInfo.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memInfo.jsHeapSizeLimit / 1024 / 1024)
      };
      
      if (memoryUsage.used > 100) { // Alert if using more than 100MB
        console.warn('[Memory] High memory usage detected:', memoryUsage);
      }
    }, 30000); // Check every 30 seconds
  }
}

// Error boundary for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Error] Unhandled promise rejection:', event.reason);
  
  // Prevent the default browser behavior
  event.preventDefault();
  
  // You can send error reports to your logging service here
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(event.reason);
  }
});

// Global error handler
window.addEventListener('error', (event) => {
  console.error('[Error] Global error:', event.error);
  
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(event.error);
  }
});

// Optimize React rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Enable concurrent features in React 18
root.render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          theme: {
            primary: 'green',
            secondary: 'black',
          },
        },
      }}
    />
  </React.StrictMode>,
)
