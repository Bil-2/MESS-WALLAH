import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiSearch, 
  FiHeart, 
  FiUser, 
  FiMenu 
} from 'react-icons/fi';

const MobileNavigation = ({ isVisible = true }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/rooms', icon: FiSearch, label: 'Rooms' },
    { path: '/favorites', icon: FiHeart, label: 'Favorites' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
    { path: '/menu', icon: FiMenu, label: 'Menu' }
  ];

  const isActive = (path) => location.pathname === path;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 touch-target ${
              isActive(path)
                ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400'
            }`}
          >
            <Icon className={`w-5 h-5 mb-1 ${isActive(path) ? 'scale-110' : ''} transition-transform duration-200`} />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
