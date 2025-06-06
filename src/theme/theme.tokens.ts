// src/theme/theme.tokens.ts - Single source of truth for all theme values
import { rem } from '@mantine/core';

// ============================================
// DESIGN TOKENS - Single Source of Truth
// ============================================

// Color Primitives
export const colors = {
  // Base colors with semantic meaning
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
} as const;

// Spacing Scale
export const spacing = {
  '3xs': rem(2),
  '2xs': rem(4),
  xs: rem(8),
  sm: rem(12),
  md: rem(16),
  lg: rem(20),
  xl: rem(24),
  '2xl': rem(32),
  '3xl': rem(40),
  '4xl': rem(48),
  '5xl': rem(64),
  '6xl': rem(80),
  '7xl': rem(96),
} as const;

// Font Sizes
export const fontSizes = {
  '2xs': rem(10),
  xs: rem(12),
  sm: rem(14),
  md: rem(16),
  lg: rem(18),
  xl: rem(20),
  '2xl': rem(24),
  '3xl': rem(30),
  '4xl': rem(36),
  '5xl': rem(48),
  '6xl': rem(60),
} as const;

// Line Heights
export const lineHeights = {
  xs: '1.25',
  sm: '1.375',
  md: '1.5',
  lg: '1.625',
  xl: '1.75',
  '2xl': '2',
} as const;

// Font Weights
export const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// Border Radius
export const radius = {
  none: '0',
  sm: rem(2),
  md: rem(4),
  lg: rem(8),
  xl: rem(12),
  '2xl': rem(16),
  '3xl': rem(24),
  full: '9999px',
} as const;

// Shadows
export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

// Transitions
export const transitions = {
  timing: {
    instant: '0ms',
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '400ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const;

// Z-Index Scale
export const zIndex = {
  base: 1,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;

// Breakpoints
export const breakpoints = {
  xs: '36em',   // 576px
  sm: '48em',   // 768px
  md: '62em',   // 992px
  lg: '75em',   // 1200px
  xl: '88em',   // 1408px
  '2xl': '96em', // 1536px
} as const;

// Component-specific tokens
export const components = {
  button: {
    height: {
      xs: rem(30),
      sm: rem(36),
      md: rem(42),
      lg: rem(50),
      xl: rem(60),
    },
    padding: {
      xs: `0 ${spacing.sm}`,
      sm: `0 ${spacing.md}`,
      md: `0 ${spacing.lg}`,
      lg: `0 ${spacing.xl}`,
      xl: `0 ${spacing['2xl']}`,
    },
  },
  input: {
    height: {
      xs: rem(30),
      sm: rem(36),
      md: rem(42),
      lg: rem(50),
      xl: rem(60),
    },
  },
  card: {
    padding: {
      xs: spacing.sm,
      sm: spacing.md,
      md: spacing.lg,
      lg: spacing.xl,
      xl: spacing['2xl'],
    },
  },
} as const;

// Semantic Tokens
export const semantic = {
  colors: {
    // Background colors
    background: {
      body: colors.gray[50],
      paper: '#ffffff',
      hover: colors.gray[100],
      selected: colors.primary[50],
    },
    // Text colors
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
      disabled: colors.gray[400],
      inverse: '#ffffff',
    },
    // Border colors
    border: {
      default: colors.gray[200],
      hover: colors.gray[300],
      focus: colors.primary[500],
    },
    // Status colors
    status: {
      success: {
        background: colors.success[50],
        border: colors.success[200],
        text: colors.success[700],
        main: colors.success[500],
      },
      warning: {
        background: colors.warning[50],
        border: colors.warning[200],
        text: colors.warning[700],
        main: colors.warning[500],
      },
      error: {
        background: colors.error[50],
        border: colors.error[200],
        text: colors.error[700],
        main: colors.error[500],
      },
      info: {
        background: colors.info[50],
        border: colors.info[200],
        text: colors.info[700],
        main: colors.info[500],
      },
    },
  },
  // Layout tokens
  layout: {
    header: {
      height: rem(64),
      background: '#ffffff',
      borderColor: colors.gray[200],
    },
    sidebar: {
      width: rem(280),
      collapsedWidth: rem(64),
      background: '#ffffff',
      borderColor: colors.gray[200],
    },
    content: {
      maxWidth: rem(1440),
      padding: spacing.xl,
    },
  },
  // Focus styles
  focus: {
    ring: `0 0 0 ${rem(2)} ${colors.primary[200]}, 0 0 0 ${rem(4)} ${colors.primary[500]}`,
    outline: `${rem(2)} solid ${colors.primary[500]}`,
  },
} as const;

// Chart color palette
export const chartColors = [
  colors.primary[500],
  colors.success[500],
  colors.warning[500],
  colors.error[500],
  colors.info[600],
  colors.primary[300],
  colors.success[300],
  colors.warning[300],
] as const;

// ============================================
// MANTINE THEME CONFIGURATION
// ============================================

import { createTheme, MantineColorsTuple, MantineThemeOverride } from '@mantine/core';

// Convert color scale to Mantine tuple
const createColorTuple = (colorScale: Record<string, string>): MantineColorsTuple => {
  return [
    colorScale[50],
    colorScale[100],
    colorScale[200],
    colorScale[300],
    colorScale[400],
    colorScale[500],
    colorScale[600],
    colorScale[700],
    colorScale[800],
    colorScale[900],
  ] as MantineColorsTuple;
};

// Create Mantine theme
export const theme: MantineThemeOverride = createTheme({
  // Colors
  colors: {
    primary: createColorTuple(colors.primary),
    gray: createColorTuple(colors.gray),
    success: createColorTuple(colors.success),
    warning: createColorTuple(colors.warning),
    error: createColorTuple(colors.error),
    info: createColorTuple(colors.info),
  },
  
  // Primary color
  primaryColor: 'primary',
  primaryShade: { light: 5, dark: 7 },
  
  // Typography
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyMonospace: 'ui-monospace, "Cascadia Code", "Roboto Mono", monospace',
  fontSizes,
  lineHeights,
  
  // Spacing
  spacing,
  
  // Radius
  radius,
  
  // Shadows
  shadows,
  
  // Breakpoints
  breakpoints,
  
  // Headings
  headings: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: fontWeights.semibold,
    sizes: {
      h1: { fontSize: fontSizes['4xl'], lineHeight: lineHeights.xs },
      h2: { fontSize: fontSizes['3xl'], lineHeight: lineHeights.xs },
      h3: { fontSize: fontSizes['2xl'], lineHeight: lineHeights.sm },
      h4: { fontSize: fontSizes.xl, lineHeight: lineHeights.sm },
      h5: { fontSize: fontSizes.lg, lineHeight: lineHeights.md },
      h6: { fontSize: fontSizes.md, lineHeight: lineHeights.md },
    },
  },
  
  // Other theme values
  other: {
    transitions,
    zIndex,
    semantic,
    chartColors,
    components,
  },
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get color value by shade
export const getColor = (color: keyof typeof colors, shade: number = 500) => {
  return colors[color][shade as keyof typeof colors[typeof color]];
};

// Create transition string
export const transition = (
  property: string | string[] = 'all',
  duration: keyof typeof transitions.timing = 'base',
  easing: keyof typeof transitions.easing = 'inOut'
) => {
  const props = Array.isArray(property) ? property.join(', ') : property;
  return `${props} ${transitions.timing[duration]} ${transitions.easing[easing]}`;
};

// Create focus styles
export const focusStyles = () => ({
  '&:focusVisible': {
    outline: `2px solid ${getColor('primary', 500)}`,
    outlineOffset: '2px',
  }
});

// Create hover styles - FIXED for Mantine 8
export const hoverStyles = (styles: Record<string, any>) => ({
  [`@media (hover: hover)`]: {
    '&:hover': styles,
  },
});


// Responsive value helper
export const responsive = <T,>(values: {
  base?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}) => values;



// Export everything as default
export default {
  theme,
  tokens: {
    colors,
    spacing,
    fontSizes,
    lineHeights,
    fontWeights,
    radius,
    shadows,
    transitions,
    zIndex,
    breakpoints,
    components,
    semantic,
    chartColors,
  },
  utils: {
    getColor,
    transition,
    focusStyles,
    hoverStyles,
    responsive,
  },
};