import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query'; // Fix React Query import to use the correct package name that exists in package.json
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Rooms = lazy(() => import('./pages/Rooms'));
const RoomDetails = lazy(() => import('./pages/RoomDetails'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Bookings = lazy(() => import('./pages/Bookings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const AppContent = () => {
  const { isDark, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ease-in-out ${isDark
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
        }`}
      style={{
        '--theme-transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <Navbar />
      <main className="relative">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route
              path="/dashboard"
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
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                  <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
                    <h1 className="text-6xl font-bold text-gray-400 dark:text-gray-500 mb-4">404</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">Page not found</p>
                    <Navigate to="/" replace />
                  </div>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#f3f4f6' : '#1f2937',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            borderRadius: '12px',
            boxShadow: isDark
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: isDark ? '#10b981' : '#059669',
              secondary: isDark ? '#1f2937' : '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: isDark ? '#ef4444' : '#dc2626',
              secondary: isDark ? '#1f2937' : '#ffffff',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AppContent />
          </Router>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
