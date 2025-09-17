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
  // Initialize theme immediately from localStorage or system preference
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }

      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark ? 'dark' : 'light';
    }
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  // Apply theme immediately on mount and when theme changes
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Remove both classes first to avoid conflicts
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    // Add the current theme class to both html and body
    root.classList.add(theme);
    body.classList.add(theme);

    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', theme);

    // Save theme preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }

    // Mark as initialized after first render
    if (!isInitialized) {
      setIsInitialized(true);
    }
    
    console.log('Theme applied:', theme, 'Classes:', root.classList.toString());
  }, [theme, isInitialized]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log(`Theme toggled from ${prevTheme} to ${newTheme}`);
      return newTheme;
    });
  };

  const setLightTheme = () => {
    console.log('Setting light theme');
    setTheme('light');
  };

  const setDarkTheme = () => {
    console.log('Setting dark theme');
    setTheme('dark');
  };

  const value = {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isInitialized
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
