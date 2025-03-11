import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Colors } from '@/constants/Colors';

// Define theme types
type ThemeColors = typeof Colors.main;

interface ThemeContextType {
  colors: ThemeColors;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  colors: Colors.main,
  isDarkMode: false,
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Define dark mode colors (could be expanded in the future)
  const darkColors: ThemeColors = {
    theme: '#FFB703',
    background: '#121212',
    text: '#FFFFFF',
    border: '#FFFFFF',
    item: '#2C2C2C',
    option: '#333333',
  };

  // Toggle between light and dark mode
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Current theme colors based on mode
  const colors = isDarkMode ? darkColors : Colors.main;

  return (
    <ThemeContext.Provider value={{ colors, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
