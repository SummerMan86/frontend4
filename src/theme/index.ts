// src/theme/index.ts - Main theme export file
export { ThemeProvider, useTheme } from './ThemeProvider';
export { default as themeConfig } from './theme.tokens';
export { componentOverrides } from './theme.components';

// Re-export commonly used utilities and tokens
export {
  // Color utilities
  colors,
  getColor,
  chartColors,
  
  // Spacing
  spacing,
  
  // Typography
  fontSizes,
  fontWeights,
  lineHeights,
  
  // Layout
  radius,
  shadows,
  breakpoints,
  zIndex,
  
  // Transitions
  transitions,
  transition,
  
  // Semantic tokens
  semantic,
  
  // Utility functions
  focusStyles,
  hoverStyles,
  responsive,
  
  // Component tokens
  components,
} from './theme.tokens';

// Type exports
export type { default as ThemeTokens } from './theme.tokens';