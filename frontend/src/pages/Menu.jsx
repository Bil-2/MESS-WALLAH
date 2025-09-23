import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Home, Search, Heart, Shield, Phone, 
  CheckCircle, X
} from '../utils/iconMappings';
import { useAuthContext } from '../context/AuthContext';

const Menu = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuSections = [
    {
      title: 'Main Navigation',
      items: [
        { icon: Home, label: 'Home', path: '/', color: 'text-blue-600' },
        { icon: Search, label: 'Rooms', path: '/rooms', color: 'text-green-600' },
        { icon: Heart, label: 'My Favorites', path: '/favorites', color: 'text-red-600' },
        { icon: User, label: 'My Profile', path: '/profile', color: 'text-purple-600' }
      ]
    },
    {
      title: 'Information',
      items: [
        { icon: User, label: 'About Us', path: '/about', color: 'text-indigo-600' },
        { icon: CheckCircle, label: 'How It Works', path: '/how-it-works', color: 'text-teal-600' },
        { icon: Shield, label: 'Safety Guidelines', path: '/safety', color: 'text-emerald-600' }
      ]
    },
    {
      title: 'Legal',
      items: [
        { icon: Shield, label: 'Privacy Policy', path: '/privacy', color: 'text-gray-600' },
        { icon: CheckCircle, label: 'Terms & Conditions', path: '/terms', color: 'text-gray-600' },
        { icon: User, label: 'Booking Policy', path: '/booking-policy', color: 'text-gray-600' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: Phone, label: 'Support', path: '/support', color: 'text-orange-600' },
        { icon: Phone, label: 'Contact Us', path: '/contact', color: 'text-cyan-600' },
        { icon: X, label: 'Report Issue', path: '/report', color: 'text-pink-600' }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-8">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Menu</h1>
            <p className="text-gray-600 dark:text-gray-400">MESS WALLAH</p>
          </motion.div>

          {/* User Info */}
          {user && (
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Verified</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-4"
            >
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  {section.title}
                </h3>
              </div>
              <div>
                {section.items.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white flex-1">{item.label}</span>
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Logout Button */}
          {user && (
            <motion.div variants={itemVariants}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              >
                <X className="w-5 h-5" />
                Logout
              </button>
            </motion.div>
          )}

          {/* Complex App Info Section */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-4">
            <div className="px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500">
              <h3 className="font-bold text-white text-center">MESS WALLAH</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your trusted student accommodation partner</p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">Online & Active</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-lg font-bold text-orange-600">970+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Rooms Available</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-600">4.8★</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">User Rating</div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Version 1.2.0</span>
                  <span>Build 2024.09</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Last Updated: Sep 2024</span>
                  <span>Status: Stable</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Menu;
