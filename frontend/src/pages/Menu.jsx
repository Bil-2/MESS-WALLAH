import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiSearch, 
  FiHeart, 
  FiUser, 
  FiSettings,
  FiHelpCircle,
  FiShield,
  FiPhone,
  FiMail,
  FiInfo,
  FiBook,
  FiLogOut,
  FiChevronRight
} from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext';
import ResponsiveContainer from '../components/ResponsiveContainer';

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
        { icon: FiHome, label: 'Home', path: '/', color: 'text-blue-600' },
        { icon: FiSearch, label: 'Find Rooms', path: '/rooms', color: 'text-green-600' },
        { icon: FiHeart, label: 'Favorites', path: '/favorites', color: 'text-red-600' },
        { icon: FiUser, label: 'Profile', path: '/profile', color: 'text-purple-600' }
      ]
    },
    {
      title: 'Information',
      items: [
        { icon: FiInfo, label: 'About Us', path: '/about', color: 'text-indigo-600' },
        { icon: FiBook, label: 'How It Works', path: '/how-it-works', color: 'text-teal-600' },
        { icon: FiShield, label: 'Safety', path: '/safety', color: 'text-emerald-600' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: FiHelpCircle, label: 'Support', path: '/support', color: 'text-orange-600' },
        { icon: FiPhone, label: 'Contact Us', path: '/contact', color: 'text-cyan-600' },
        { icon: FiMail, label: 'Report Issue', path: '/report', color: 'text-pink-600' }
      ]
    },
    {
      title: 'Legal',
      items: [
        { icon: FiBook, label: 'Privacy Policy', path: '/privacy', color: 'text-gray-600' },
        { icon: FiBook, label: 'Terms of Service', path: '/terms', color: 'text-gray-600' },
        { icon: FiBook, label: 'Booking Policy', path: '/booking-policy', color: 'text-gray-600' }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <ResponsiveContainer>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Menu</h1>
              <p className="text-gray-600 dark:text-gray-400">Navigate through MESS WALLAH</p>
            </motion.div>

          {/* User Info */}
          {user && (
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
              <div className="space-y-2">
                {section.items.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                    </div>
                    <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
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
                className="w-full flex items-center justify-center gap-3 p-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FiLogOut className="w-5 h-5" />
                Logout
              </button>
            </motion.div>
          )}

          {/* App Info */}
          <motion.div variants={itemVariants} className="text-center mt-8 p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">MESS WALLAH</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your trusted student accommodation partner</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Version 1.0.0</p>
          </motion.div>
          </motion.div>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Menu;
