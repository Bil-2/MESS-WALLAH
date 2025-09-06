import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      } else {
        setIsDark(systemPrefersDark);
      }
      setIsLoading(false);
    };

    initializeTheme();
  }, []);

  // Apply theme to document with enhanced refresh
  useEffect(() => {
    if (isLoading) return;

    const applyTheme = () => {
      const root = document.documentElement;

      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
        localStorage.setItem('theme', 'light');
      }

      // Force refresh of CSS custom properties
      root.style.setProperty('--theme-transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');

      // Trigger a repaint to ensure smooth transitions
      requestAnimationFrame(() => {
        document.body.style.transform = 'translateZ(0)';
        setTimeout(() => {
          document.body.style.transform = '';
        }, 0);
      });
    };

    applyTheme();
  }, [isDark, isLoading]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newTheme = !prev;

      // Add smooth transition class
      document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';

      // Remove transition after animation completes
      setTimeout(() => {
        document.documentElement.style.transition = '';
      }, 300);

      return newTheme;
    });
  };

  const setTheme = (theme) => {
    setIsDark(theme === 'dark');
  };

  const value = {
    isDark,
    isLoading,
    toggleTheme,
    setTheme,
    theme: isDark ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
