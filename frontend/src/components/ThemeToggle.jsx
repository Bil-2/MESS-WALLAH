import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  const toggleVariants = {
    light: {
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    dark: {
      rotate: 180,
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const iconVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      rotate: -90
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 touch-target ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      variants={toggleVariants}
      animate={isDark ? 'dark' : 'light'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        className="w-5 h-5 flex items-center justify-center"
        style={{ willChange: 'transform, opacity' }}
      >
        {isDark ? (
          <motion.div
            key="moon"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <FiMoon className="w-5 h-5 text-blue-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <FiSun className="w-5 h-5 text-yellow-500" />
          </motion.div>
        )}
      </motion.div>

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        animate={{
          boxShadow: isDark
            ? '0 0 10px rgba(59, 130, 246, 0.3)'
            : '0 0 10px rgba(234, 179, 8, 0.3)'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
