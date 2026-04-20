import React, { createContext, useContext, useEffect, useMemo } from 'react';

const ThemeContext = createContext({ theme: 'light' });

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('light');
    root.classList.remove('dark');
  }, []);

  const value = useMemo(() => ({ theme: 'light' }), []);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return value;
};
