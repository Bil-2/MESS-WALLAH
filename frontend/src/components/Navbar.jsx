import React, { useState, useEffect } from 'react';
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
import AppIcon from './AppIcon';
import { useAuthContext } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

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

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Rooms', href: '/rooms', icon: MapPin },
    { name: 'About', href: '/about', icon: Shield }
  ];

  const isActive = (path) => location.pathname === path;

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

            {/* Notification Bell - Only show when logged in */}
            {user && <NotificationBell />}

            {/* Revolutionary 2025 Profile Area */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                {/* Ultra-Modern Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Profile dropdown clicked, current state:', isProfileDropdownOpen);
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    }}
                    className="group relative flex items-center space-x-2 px-3 py-2 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {/* Compact Profile Avatar */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md">
                        <div
                          className="w-full h-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm"
                        >
                          {(() => {
                            if (!user?.name) return 'U';
                            const fullName = user.name.trim();
                            const words = fullName.split(/\s+/).filter(word => word.length > 0);
                            
                            if (words.length === 0) return 'U';
                            if (words.length === 1) return words[0].charAt(0).toUpperCase();
                            
                            // Get first letter of first word and first letter of last word
                            const firstInitial = words[0].charAt(0).toUpperCase();
                            const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
                            return firstInitial + lastInitial;
                          })()}
                        </div>

                        {/* Compact Status Indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      </div>
                    </div>

                    {/* Compact User Info */}
                    <div className="hidden sm:flex flex-col items-start min-w-0">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-32">
                        {user.name || 'User'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32">
                        @{user.email?.split('@')[0] || 'user'}
                      </span>
                    </div>

                    {/* Compact Dropdown Arrow */}
                    <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Compact Modern Dropdown */}
                  {isProfileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border-2 border-orange-500 z-[9999] overflow-hidden bg-white dark:bg-gray-800"
                      style={{ 
                        position: 'absolute', 
                        top: '100%', 
                        right: 0,
                        marginTop: '8px'
                      }}
                    >
                      {/* Compact Profile Header */}
                      <div className="relative p-6 bg-gradient-to-br from-orange-500 to-pink-500">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center font-bold text-lg shadow-lg">
                            {(() => {
                              if (!user?.name) return 'U';
                              const fullName = user.name.trim();
                              const words = fullName.split(/\s+/).filter(word => word.length > 0);
                              
                              if (words.length === 0) return 'U';
                              if (words.length === 1) return words[0].charAt(0).toUpperCase();
                              
                              const firstInitial = words[0].charAt(0).toUpperCase();
                              const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
                              return firstInitial + lastInitial;
                            })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-lg truncate">{user.name || 'User Name'}</h3>
                            <p className="text-white/90 text-sm truncate">{user.email}</p>
                            <div className="flex items-center mt-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                              <span className="text-white/90 text-xs">Online</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Compact Stats */}
                      <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-800/80">
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: '8', label: 'Bookings', icon: Home },
                            { value: '12', label: 'Favorites', icon: Heart },
                            { value: '4.8', label: 'Rating', icon: Star }
                          ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                              <div key={index} className="text-center">
                                <div className="flex justify-center mb-1">
                                  <Icon className="w-5 h-5 text-orange-500" />
                                </div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Compact Menu Items */}
                      <div className="p-3 space-y-1">
                        {[
                          { to: '/profile', icon: User, label: 'My Profile', color: 'orange' },
                          { to: '/bookings', icon: Calendar, label: 'My Bookings', color: 'blue' },
                          { to: '/favorites', icon: Heart, label: 'Favorites', color: 'pink' },
                          { to: '/settings', icon: Settings, label: 'Settings', color: 'purple' }
                        ].map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={index}
                              to={item.to}
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="group flex items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
                            >
                              <div className={`w-8 h-8 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg flex items-center justify-center mr-3`}>
                                <Icon className={`w-4 h-4 text-${item.color}-600 dark:text-${item.color}-400`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white text-sm">
                                  {item.label}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                            </Link>
                          );
                        })}
                      </div>

                      {/* Compact Logout */}
                      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="group w-full flex items-center p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                        >
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3">
                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-red-700 dark:text-red-400 text-sm">Sign Out</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
