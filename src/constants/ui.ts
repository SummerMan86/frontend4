/**
 * ui.ts
 * Central configuration for UI constants and theme settings
 * Created by SummerMan86 on 2025-05-14
 */

import { MantineThemeOverride } from '@mantine/core';

// Company/Brand colors
export const BRAND_COLORS = {
  primary: '#1c7ed6',   // Main brand color
  secondary: '#228be6', // Secondary brand color
  accent: '#339af0',    // Accent color
  success: '#40c057',   // Success state
  warning: '#fab005',   // Warning state
  error: '#fa5252',     // Error state
  info: '#228be6',      // Information state
};

// Navigation layout constants
export const NAVIGATION = {
  // Widths
  COLLAPSED_WIDTH: 80,
  EXPANDED_WIDTH: 280,
  MOBILE_DRAWER_WIDTH: '80%',
  
  // Heights and spacing
  HEADER_HEIGHT: 60,
  FOOTER_HEIGHT: 60,
  ITEM_SPACING: 8,
  SECTION_SPACING: 16,
  
  // Animation durations (in ms)
  COLLAPSE_ANIMATION: 200,
  HOVER_ANIMATION: 150,
  
  // Border radius
  BORDER_RADIUS: 8,
  
  // Breakpoints
  MOBILE_BREAKPOINT: '768px',
  TABLET_BREAKPOINT: '992px',
  DESKTOP_BREAKPOINT: '1200px',
};

// Typography settings
export const TYPOGRAPHY = {
  FONT_FAMILY: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    monospace: "'Roboto Mono', monospace",
  },
  FONT_SIZES: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  FONT_WEIGHTS: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  LINE_HEIGHTS: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
};

// Shadows
export const SHADOWS = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
};

// Z-index values
export const Z_INDEX = {
  dropdown: 100,
  modal: 200,
  tooltip: 300,
  notification: 400,
};

// Complete Mantine theme override updated for v8
export const THEME_CONFIG: MantineThemeOverride = {
  colors: {
    // Custom color for your brand
    brand: [
      '#e0f2ff', // 0: Lightest
      '#bae0ff', // 1
      '#91caff', // 2
      '#69b1ff', // 3
      '#4096ff', // 4
      '#1677ff', // 5: Primary
      '#0958d9', // 6
      '#003eb3', // 7
      '#002c8c', // 8
      '#001d66', // 9: Darkest
    ],
  },
  primaryColor: 'blue',
  fontFamily: TYPOGRAPHY.FONT_FAMILY.primary,
  fontSizes: {
    xs: `${TYPOGRAPHY.FONT_SIZES.xs}px`,
    sm: `${TYPOGRAPHY.FONT_SIZES.sm}px`,
    md: `${TYPOGRAPHY.FONT_SIZES.md}px`,
    lg: `${TYPOGRAPHY.FONT_SIZES.lg}px`,
    xl: `${TYPOGRAPHY.FONT_SIZES.xl}px`,
  },
  radius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '32px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    xs: SHADOWS.sm,
    sm: SHADOWS.sm,
    md: SHADOWS.md,
    lg: SHADOWS.lg,
    xl: SHADOWS.xl,
  },
  headings: {
    fontFamily: TYPOGRAPHY.FONT_FAMILY.primary,
    fontWeight: String(TYPOGRAPHY.FONT_WEIGHTS.bold),
    sizes: {
      h1: { fontSize: '30px', lineHeight: '1.3' },
      h2: { fontSize: '24px', lineHeight: '1.35' },
      h3: { fontSize: '20px', lineHeight: '1.4' },
      h4: { fontSize: '18px', lineHeight: '1.45' },
      h5: { fontSize: '16px', lineHeight: '1.5' },
      h6: { fontSize: '14px', lineHeight: '1.5' },
    },
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    NavLink: {
      styles: {
        root: {
          borderRadius: '4px',
        },
      },
    },
    Accordion: {
      styles: {
        item: {
          borderBottom: 'none',
        },
        control: {
          padding: '4px 16px',
        },
      },
    },
  },
};

// Dashboard-specific constants
export const DASHBOARD = {
  CHART_HEIGHTS: {
    small: 200,
    medium: 300,
    large: 400,
  },
  GRID_BREAKPOINTS: {
    xs: 540,
    sm: 720,
    md: 960,
    lg: 1140,
    xl: 1320,
  },
  CARD_SPACING: 16,
};

// Notification badge styles
export const NOTIFICATION_BADGE = {
  SIZE: 16,
  FONT_SIZE: 10,
  COLORS: {
    default: BRAND_COLORS.error,
    info: BRAND_COLORS.info,
    warning: BRAND_COLORS.warning,
  },
};