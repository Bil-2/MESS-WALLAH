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
      className="relative p-3 rounded-xl bg-glass-medium hover:bg-glass-light border border-white/10 transition-all duration-300 group hover:scale-105 active:scale-95"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <Sun
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${!isDark
            ? 'opacity-100 rotate-0 scale-100 text-neon-orange'
            : 'opacity-0 rotate-180 scale-75 text-gray-400'
            }`}
        />

        {/* Moon Icon */}
        <Moon
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${isDark
            ? 'opacity-100 rotate-0 scale-100 text-neon-cyan'
            : 'opacity-0 -rotate-180 scale-75 text-gray-400'
            }`}
        />
      </div>

      {/* Active indicator */}
      <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${isDark ? 'bg-neon-cyan shadow-neon-cyan' : 'bg-neon-orange shadow-neon'
        }`}></div>
    </button>
  );
};

export default ThemeToggle;
