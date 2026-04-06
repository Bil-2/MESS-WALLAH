import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  MapPin,
  User,
  Menu,
  X,
  Settings,
  Shield,
  ChevronDown,
  ChevronRight,
  Calendar,
  Heart,
  Star
} from '../utils/iconMappings';
import { useAuthContext } from '../context/AuthContext.jsx';
import AppIcon from './AppIcon';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const _navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Rooms', href: '/rooms', icon: MapPin },
    { name: 'About', href: '/about', icon: Shield }
  ];

  const _isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 navbar-slide transition-all duration-200 navbar-mobile ${scrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
        : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Modern App Icon */}
          <Link to="/" className="flex items-center space-x-3 group hover-lift">
            <AppIcon size={40} className="transform group-hover:scale-110 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                MESS
              </span>
              <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent -mt-1">
                WALLAH
              </span>
            </div>
          </Link>

          {/* Right side items */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Revolutionary 2025 Profile Area */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
              {/* Profile area — owner navigates directly, renter gets dropdown */}
              {user?.role === 'owner' ? (
                /* ── Owner: click goes straight to /profile ── */
                <button
                  onClick={() => navigate('/profile')}
                  className="group relative flex items-center space-x-2 px-3 py-2 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md">
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                        {user?.profilePicture ? (
                          <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (() => {
                          if (!user?.name) return 'U';
                          const words = user.name.trim().split(/\s+/).filter(w => w.length > 0);
                          if (!words.length) return 'U';
                          if (words.length === 1) return words[0][0].toUpperCase();
                          return words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase();
                        })()}
                      </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                  </div>
                  <div className="hidden sm:flex flex-col items-start min-w-0">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-32">{user.name || 'Owner'}</span>
                    <span className="text-xs text-indigo-500 font-bold truncate max-w-32">@owner</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ) : (
                /* ── Renter: click goes straight to /profile ── */
                <button
                  onClick={() => navigate('/profile')}
                  className="group relative flex items-center space-x-2 px-3 py-2 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md">
                      <div className="w-full h-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
                        {user?.profilePicture ? (
                          <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (() => {
                          if (!user?.name) return 'U';
                          const words = user.name.trim().split(/\s+/).filter(w => w.length > 0);
                          if (!words.length) return 'U';
                          if (words.length === 1) return words[0][0].toUpperCase();
                          return words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase();
                        })()}
                      </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                  </div>
                  <div className="hidden sm:flex flex-col items-start min-w-0">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-32">{user.name || 'User'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32">@{user.email?.split('@')[0] || 'user'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              )}</div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md hover:shadow-lg btn-hover"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md hover:shadow-lg btn-hover"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors scale-hover"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 slide-in-up">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile User Menu */}
            <div>
              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors hover-lift"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hover-lift"
                  >
                    <X className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors btn-hover"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors btn-hover"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
