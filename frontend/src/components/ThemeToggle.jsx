import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  const handleToggle = () => {
    console.log('ThemeToggle clicked, current theme:', theme);
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      className="relative p-2 rounded-lg bg-white/10 dark:bg-gray-800/50 hover:bg-white/20 dark:hover:bg-gray-700/50 border border-gray-200/20 dark:border-gray-600/20 transition-colors duration-200 scale-hover rotate-hover"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun
          className={`absolute inset-0 w-5 h-5 transition-opacity duration-200 ${!isDark
            ? 'opacity-100 text-amber-500'
            : 'opacity-0 text-gray-400'
            }`}
        />

        {/* Moon Icon */}
        <Moon
          className={`absolute inset-0 w-5 h-5 transition-opacity duration-200 ${isDark
            ? 'opacity-100 text-blue-400'
            : 'opacity-0 text-gray-400'
            }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
