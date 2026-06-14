import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const temas = {
  light: {
    background: '#F5F5F7',
    card: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#636366',
    border: '#E5E5EA',
    input: '#E9E9EB',
    button: '#004a8d', // Azul Senac
    accent: '#f39200', // Laranja Senac
    tabBar: '#FFFFFF',
    statusBar: 'dark'
  },
  dark: {
    background: '#121212',
    card: '#1e1e1e',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    border: '#333333',
    input: '#2a2a2a',
    button: '#004a8d', // Azul Senac
    accent: '#f39200', // Laranja Senac
    tabBar: '#1e1e1e',
    statusBar: 'light'
  }
};

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false); // Mudado para false (Modo Claro padrão Senac)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? temas.dark : temas.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}