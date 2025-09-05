import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiSearch, FiUser, FiLogOut, FiMenu, FiX, FiPlus } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      setIsMenuOpen(true);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <FiHome className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold navbar-brand">MESS WALLAH</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/rooms"
              className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <FiSearch className="text-lg" />
              <span>Find Rooms</span>
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'owner' && (
                  <Link
                    to="/dashboard/add-room"
                    className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    <FiPlus className="text-lg" />
                    <span>Add Room</span>
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-orange-600" />
                    </div>
                    <span className="font-medium">{user?.name}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Dashboard
                      </Link>

                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Profile
                      </Link>

                      <Link
                        to="/bookings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        My Bookings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <FiLogOut />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="text-gray-700 hover:text-orange-600 transition-colors touch-target"
            >
              {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className={`md:hidden border-t border-gray-200 py-4 transition-all duration-200 ease-in-out ${isClosing ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
              }`}
          >
            <div className="flex flex-col space-y-4">
              <Link
                to="/rooms"
                onClick={closeMenu}
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 rounded-lg mx-2 active:bg-orange-100 touch-target"
              >
                <FiSearch className="text-lg" />
                <span className="font-medium">Browse Rooms</span>
              </Link>

              {isAuthenticated ? (
                <>
                  {user?.role === 'owner' && (
                    <Link
                      to="/dashboard/add-room"
                      onClick={closeMenu}
                      className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 rounded-lg mx-2 active:bg-orange-100 touch-target"
                    >
                      <FiPlus className="text-lg" />
                      <span className="font-medium">Add Room</span>
                    </Link>
                  )}

                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 rounded-lg mx-2 active:bg-orange-100 touch-target"
                  >
                    <FiUser className="text-lg" />
                    <span className="font-medium">Dashboard</span>
                  </Link>

                  <Link
                    to="/bookings"
                    onClick={closeMenu}
                    className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 rounded-lg mx-2 active:bg-orange-100 touch-target"
                  >
                    <FiHome className="text-lg" />
                    <span className="font-medium">My Bookings</span>
                  </Link>

                  <div className="border-t border-gray-200 mx-2 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2 active:bg-red-100 w-full text-left touch-target"
                  >
                    <FiLogOut className="text-lg" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center px-4 py-3 text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-all duration-200 rounded-lg mx-2 border border-orange-600 font-medium active:bg-orange-100 touch-target"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center px-4 py-3 text-white bg-orange-600 hover:bg-orange-700 transition-all duration-200 rounded-lg mx-2 font-medium active:bg-orange-800 touch-target"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
