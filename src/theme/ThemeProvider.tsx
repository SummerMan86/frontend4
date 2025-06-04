// src/theme/ThemeProvider.tsx - Enhanced Theme Provider
import React, { createContext, useContext } from 'react';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { theme as baseTheme } from './theme.tokens';
import componentOverrides from './theme.components';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

// Merge base theme with component overrides
const theme: MantineThemeOverride = {
  ...baseTheme,
  components: componentOverrides,
};

// Theme context for accessing theme utilities
interface ThemeContextType {
  theme: typeof theme;
  tokens: typeof import('./theme.tokens').default.tokens;
  utils: typeof import('./theme.tokens').default.utils;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// Custom hook to access theme utilities
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Theme Provider component
interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Import tokens and utils
  const { tokens, utils } = require('./theme.tokens').default;

  const contextValue: ThemeContextType = {
    theme,
    tokens,
    utils,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MantineProvider theme={theme}>
        <style>{globalStyles}</style>
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};

// Global styles
const globalStyles = `
  /* CSS Reset and Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--mantine-color-gray-1);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--mantine-color-gray-4);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--mantine-color-gray-5);
  }
  
  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  /* Utility classes */
  .animate-fadeIn {
    animation: fadeIn 300ms ease-out;
  }
  
  .animate-slideIn {
    animation: slideIn 200ms ease-out;
  }
  
  .animate-pulse {
    animation: pulse 2s infinite;
  }
  
  /* Focus visible only for keyboard navigation */
  *:focus {
    outline: none;
  }
  
  *:focus-visible {
    outline: 2px solid var(--mantine-color-primary-5);
    outline-offset: 2px;
  }
`;

export default ThemeProvider;