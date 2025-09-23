import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  Menu 
} from '../utils/iconMappings';

const MobileNavigation = ({ isVisible = true }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/rooms', icon: Search, label: 'Rooms' },
    { path: '/favorites', icon: Heart, label: 'Favorites' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/menu', icon: Menu, label: 'Menu' }
  ];

  const isActive = (path) => location.pathname === path;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 z-50 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-1 px-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 min-w-[60px] min-h-[56px] ${
              isActive(path)
                ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 active:scale-95'
            }`}
          >
            <Icon className={`w-6 h-6 mb-1 ${isActive(path) ? 'scale-110' : ''} transition-transform duration-200`} />
            <span className="text-xs font-medium leading-tight">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
