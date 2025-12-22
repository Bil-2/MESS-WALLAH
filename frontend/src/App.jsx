import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/animations.css';
import './styles/preventAutoFill.css';
import './styles/profile-animations.css';
import './styles/scroll-animations.css';
import { AuthProvider, ThemeProvider } from './context';
import { Navbar, Footer, LoadingSpinner, MobileNavigation, ProtectedRoute, RoleBasedRedirect } from './components';
import FaviconGenerator from './components/FaviconGenerator';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const Rooms = lazy(() => import('./pages/Rooms'));
const RoomDetails = lazy(() => import('./pages/RoomDetails'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Bookings = lazy(() => import('./pages/Bookings'));
const About = lazy(() => import('./pages/About'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Safety = lazy(() => import('./pages/Safety'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const BookingPolicy = lazy(() => import('./pages/BookingPolicy'));
const Support = lazy(() => import('./pages/Support'));
const Contact = lazy(() => import('./pages/Contact'));
const Report = lazy(() => import('./pages/Report'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Menu = lazy(() => import('./pages/Menu'));
const Favorites = lazy(() => import('./pages/Favorites'));
const GoogleAuthSuccess = lazy(() => import('./pages/GoogleAuthSuccess'));

// Owner Pages
const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard'));
const AddRoom = lazy(() => import('./pages/owner/AddRoom'));
const ManageRooms = lazy(() => import('./pages/owner/ManageRooms'));
const OwnerBookings = lazy(() => import('./pages/owner/OwnerBookings'));

// Notifications
const Notifications = lazy(() => import('./pages/Notifications'));

// Enhanced loading component for better UX
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
    <div className="text-center">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">
        Loading MESS WALLAH...
      </p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FaviconGenerator />
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <div className="App min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 fade-in">
            <Navbar />
            <main className="smooth-transition pt-16 pb-20 md:pb-8">
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  {/* Homepage with role-based redirect */}
                  <Route path="/" element={
                    <RoleBasedRedirect>
                      <Home />
                    </RoleBasedRedirect>
                  } />

                  {/* Tenant Routes - Block owners from accessing */}
                  <Route path="/rooms" element={
                    <ProtectedRoute allowedRoles={['user', 'student']} requireAuth={false}>
                      <Rooms />
                    </ProtectedRoute>
                  } />
                  <Route path="/rooms/:id" element={
                    <ProtectedRoute allowedRoles={['user', 'student']} requireAuth={false}>
                      <RoomDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/favorites" element={
                    <ProtectedRoute allowedRoles={['user', 'student']} requireAuth={true}>
                      <Favorites />
                    </ProtectedRoute>
                  } />
                  <Route path="/bookings" element={
                    <ProtectedRoute allowedRoles={['user', 'student']} requireAuth={true}>
                      <Bookings />
                    </ProtectedRoute>
                  } />

                  {/* Owner Routes */}
                  <Route path="/owner-dashboard" element={
                    <ProtectedRoute allowedRoles={['owner']} requireAuth={true}>
                      <OwnerDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/owner/rooms/new" element={
                    <ProtectedRoute allowedRoles={['owner']} requireAuth={true}>
                      <AddRoom />
                    </ProtectedRoute>
                  } />
                  <Route path="/owner/rooms" element={
                    <ProtectedRoute allowedRoles={['owner']} requireAuth={true}>
                      <ManageRooms />
                    </ProtectedRoute>
                  } />
                  <Route path="/owner/bookings" element={
                    <ProtectedRoute allowedRoles={['owner']} requireAuth={true}>
                      <OwnerBookings />
                    </ProtectedRoute>
                  } />

                  {/* Public/Shared Routes */}
                  <Route path="/search" element={<Navigate to="/rooms" replace />} />
                  <Route path="/search-results" element={<SearchResults />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
                  <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/safety" element={<Safety />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/booking-policy" element={<BookingPolicy />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/notifications" element={
                    <ProtectedRoute requireAuth={true}>
                      <Notifications />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <MobileNavigation />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
