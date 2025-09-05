import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for code splitting with preloading
const Home = React.lazy(() =>
  import('./pages/Home').then(module => ({ default: module.default }))
);
const Login = React.lazy(() =>
  import('./pages/Login').then(module => ({ default: module.default }))
);
const Register = React.lazy(() =>
  import('./pages/Register').then(module => ({ default: module.default }))
);
const Rooms = React.lazy(() =>
  import('./pages/Rooms').then(module => ({ default: module.default }))
);
const RoomDetails = React.lazy(() =>
  import('./pages/RoomDetails').then(module => ({ default: module.default }))
);
const Dashboard = React.lazy(() =>
  import('./pages/Dashboard').then(module => ({ default: module.default }))
);
const Bookings = React.lazy(() =>
  import('./pages/Bookings').then(module => ({ default: module.default }))
);

// Enhanced QueryClient configuration for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnReconnect: 'always',
      refetchOnMount: true,
      suspense: false,
      useErrorBoundary: false,
    },
    mutations: {
      retry: 1,
      useErrorBoundary: false,
    },
  },
});

// Enhanced 404 Page Component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="text-center max-w-md mx-auto">
      <div className="mb-8">
        <div className="text-8xl mb-4">🏠</div>
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      </div>
      <div className="space-y-4">
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          🏠 Go Home
        </a>
        <div className="text-sm text-gray-500">
          <button
            onClick={() => window.history.back()}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Performance monitoring hook
const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }

    // Monitor memory usage
    if ('memory' in performance) {
      const logMemoryUsage = () => {
        const memory = performance.memory;
        console.log('Memory Usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
        });
      };

      // Log memory usage every 30 seconds in development
      if (process.env.NODE_ENV === 'development') {
        const interval = setInterval(logMemoryUsage, 30000);
        return () => clearInterval(interval);
      }
    }
  }, []);
};

// Network status hook for offline handling
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Main App Component
function App() {
  usePerformanceMonitoring();
  const isOnline = useNetworkStatus();

  // Preload critical routes on app mount
  useEffect(() => {
    const preloadRoutes = () => {
      // Preload most commonly accessed routes
      import('./pages/Rooms');
      import('./pages/Login');
    };

    // Preload after initial render
    const timer = setTimeout(preloadRoutes, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <div className="min-h-screen bg-gray-50">
              {/* Offline Banner */}
              {!isOnline && (
                <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-medium">
                  📶 You're offline. Some features may not work properly.
                </div>
              )}

              <Navbar />

              <main className="relative">
                <Suspense
                  fallback={
                    <LoadingSpinner
                      fullScreen
                      size="lg"
                      text="Loading MESS WALLAH..."
                      overlay={true}
                    />
                  }
                >
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/rooms/:id" element={<RoomDetails />} />

                    {/* Protected Routes */}
                    <Route
                      path="/dashboard/*"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/bookings"
                      element={
                        <ProtectedRoute>
                          <Bookings />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch all route for 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>

              {/* Enhanced Toast notifications with mobile optimization */}
              <Toaster
                position="top-center"
                containerClassName="!top-16 sm:!top-4 !left-4 !right-4 sm:!left-auto sm:!right-4 sm:!w-auto"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1f2937',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    maxWidth: '90vw',
                    wordBreak: 'break-word',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                    style: {
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                    style: {
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    },
                  },
                  loading: {
                    duration: Infinity,
                    style: {
                      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    },
                  },
                }}
              />

              {/* React Query Devtools (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
              )}
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
