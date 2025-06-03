/**
 * designSystem.ts
 * Professional enterprise dashboard design system for Mantine 8
 * Updated: 2025-06-03
 * Author: SummerMan86
 */

import { MantineTheme, MantineColorsTuple, createTheme, rem } from '@mantine/core';

// === PROFESSIONAL COLOR PALETTE ===
export const palette = {
  // Enterprise-grade primary colors (based on successful dashboard products)
  brand: {
    50: '#F0F7FF',   // Very light blue
    100: '#E0EFFF',  // Light blue
    200: '#BAD7FF',  // Soft blue
    300: '#7AB8FF',  // Medium blue
    400: '#3690FF',  // Vibrant blue
    500: '#0D6EFD',  // Primary (Bootstrap-inspired)
    600: '#0B5ED7',  // Darker blue
    700: '#0A4FB3',  // Dark blue
    800: '#084298',  // Very dark blue
    900: '#05357A',  // Deepest blue
  },
  
  // Professional neutral grays (inspired by Tailwind/GitHub)
  neutral: {
    50: '#FAFBFC',   // Almost white
    100: '#F6F8FA',  // Very light gray
    200: '#E1E4E8',  // Light gray border
    300: '#D1D5DA',  // Medium light gray
    400: '#959DA5',  // Medium gray
    500: '#6A737D',  // Dark gray text
    600: '#586069',  // Darker gray
    700: '#444D56',  // Very dark gray
    800: '#2F363D',  // Almost black
    900: '#24292E',  // GitHub dark
  },
  
  // Professional semantic colors
  semantic: {
    success: '#28A745',  // GitHub green
    warning: '#FFC107',  // Professional amber
    error: '#DC3545',    // Bootstrap red
    info: '#17A2B8',     // Professional teal
  },
  
  // Enterprise accent colors
  accent: {
    purple: '#6F42C1',   // Professional purple
    teal: '#20C997',     // Modern teal
    orange: '#FD7E14',   // Professional orange
    indigo: '#6610F2',   // Deep indigo
  },
} as const;

// === MANTINE COLOR TUPLES ===
const brandColors: MantineColorsTuple = [
  palette.brand[50], 
  palette.brand[100], 
  palette.brand[200], 
  palette.brand[300], 
  palette.brand[400], 
  palette.brand[500], 
  palette.brand[600], 
  palette.brand[700], 
  palette.brand[800], 
  palette.brand[900]
];

const neutralColors: MantineColorsTuple = [
  palette.neutral[50], 
  palette.neutral[100], 
  palette.neutral[200], 
  palette.neutral[300],
  palette.neutral[400], 
  palette.neutral[500], 
  palette.neutral[600], 
  palette.neutral[700],
  palette.neutral[800], 
  palette.neutral[900]
];

const successColors: MantineColorsTuple = [
  '#F8FFF9', 
  '#E6FFED', 
  '#C3F7CB', 
  '#91F5A0', 
  '#51D96A',
  palette.semantic.success, 
  '#22863A', 
  '#176F2C', 
  '#165C26', 
  '#144620'
];

const warningColors: MantineColorsTuple = [
  '#FFFCF0', 
  '#FFF8DB', 
  '#FFECB3', 
  '#FFE082', 
  '#FFD54F',
  palette.semantic.warning, 
  '#FFB300', 
  '#FF8F00', 
  '#FF6F00', 
  '#E65100'
];

const errorColors: MantineColorsTuple = [
  '#FFF5F5', 
  '#FFEBEE', 
  '#FFCDD2', 
  '#EF9A9A', 
  '#E57373',
  palette.semantic.error, 
  '#C62828', 
  '#AD1457', 
  '#880E4F', 
  '#4A148C'
];

const infoColors: MantineColorsTuple = [
  '#F0F9FF',
  '#E0F2FE', 
  '#BAE6FD', 
  '#7DD3FC', 
  '#38BDF8',
  palette.semantic.info, 
  '#0284C7', 
  '#0369A1', 
  '#075985', 
  '#0C4A6E'
];

const purpleColors: MantineColorsTuple = [
  '#F8F4FF', 
  '#F1E8FF', 
  '#E5D1FF', 
  '#D4AFFF', 
  '#C084FC',
  palette.accent.purple, 
  '#5A2C91', 
  '#4C1D95', 
  '#3C1A78', 
  '#2D1B69'
];

const tealColors: MantineColorsTuple = [
  '#F0FDF9', 
  '#E6FFFA', 
  '#B2F5EA', 
  '#81E6D9', 
  '#4FD1C7',
  palette.accent.teal, 
  '#319795', 
  '#2C7A7B', 
  '#285E61', 
  '#234E52'
];

// === PROFESSIONAL MANTINE THEME ===
export const mantineTheme = createTheme({
  // Professional color system
  colors: {
    brand: brandColors,
    neutral: neutralColors,
    success: successColors,
    warning: warningColors,
    error: errorColors,
    info: infoColors,
    purple: purpleColors,
    teal: tealColors,
  },

  primaryColor: 'brand',
  primaryShade: { light: 5, dark: 6 },

  // Professional typography (industry standard)
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Consolas, "Ubuntu Mono", monospace',
  
  headings: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '600',
    textWrap: 'balance',
    sizes: {
      h1: { 
        fontSize: rem(32), 
        lineHeight: '1.25'
      },
      h2: { 
        fontSize: rem(28), 
        lineHeight: '1.3'
      },
      h3: { 
        fontSize: rem(24), 
        lineHeight: '1.35'
      },
      h4: { 
        fontSize: rem(20), 
        lineHeight: '1.4'
      },
      h5: { 
        fontSize: rem(18), 
        lineHeight: '1.45' 
      },
      h6: { 
        fontSize: rem(16), 
        lineHeight: '1.5' 
      },
    },
  },

  // Professional font scale
  fontSizes: {
    xs: rem(12),      // 12px - Small labels
    sm: rem(14),      // 14px - Body text small
    md: rem(16),      // 16px - Default body
    lg: rem(18),      // 18px - Large text
    xl: rem(20),      // 20px - Headings
  },

  // Dashboard-optimized spacing
  spacing: {
    xs: rem(4),       // 4px - Tight spacing
    sm: rem(8),       // 8px - Small spacing
    md: rem(16),      // 16px - Standard spacing
    lg: rem(24),      // 24px - Large spacing
    xl: rem(32),      // 32px - Extra large spacing
  },

  // Professional radius system
  radius: {
    xs: rem(2),       // 2px - Minimal
    sm: rem(4),       // 4px - Small elements
    md: rem(6),       // 6px - Standard (more professional than 8px)
    lg: rem(8),       // 8px - Cards
    xl: rem(12),      // 12px - Large containers
  },

  defaultRadius: 'sm',

  // Professional shadow system
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  breakpoints: {
    xs: '30em',       // 480px
    sm: '48em',       // 768px
    md: '64em',       // 1024px
    lg: '80em',       // 1280px
    xl: '96em',       // 1536px
  },

  lineHeights: {
    xs: '1.3',
    sm: '1.4',
    md: '1.5',
    lg: '1.6',
    xl: '1.7',
  },

  focusRing: 'auto',
  cursorType: 'pointer',
  respectReducedMotion: true,
  
  // Professional component styling
  components: {
    Button: {
      defaultProps: {
        radius: 'sm',
        size: 'sm',
      },
      styles: (theme: MantineTheme) => ({
        root: {
          fontWeight: 500,
          fontSize: rem(14),
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          border: 'none',
          
          '&[data-variant="filled"]': {
            backgroundColor: theme.colors.brand[5],
            color: '#FFFFFF',
            
            '&:hover': {
              backgroundColor: theme.colors.brand[6],
              transform: 'translateY(-1px)',
              boxShadow: `0 4px 8px ${theme.colors.brand[2]}`,
            },
            
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          
          '&[data-variant="light"]': {
            backgroundColor: theme.colors.brand[0],
            color: theme.colors.brand[7],
            border: `1px solid ${theme.colors.brand[1]}`,
            
            '&:hover': {
              backgroundColor: theme.colors.brand[1],
              borderColor: theme.colors.brand[2],
            },
          },
          
          '&[data-variant="outline"]': {
            borderColor: theme.colors.neutral[3],
            color: theme.colors.neutral[7],
            backgroundColor: 'transparent',
            
            '&:hover': {
              backgroundColor: theme.colors.neutral[0],
              borderColor: theme.colors.brand[4],
              color: theme.colors.brand[6],
            },
          },
          
          '&[data-variant="subtle"]': {
            backgroundColor: 'transparent',
            color: theme.colors.neutral[6],
            
            '&:hover': {
              backgroundColor: theme.colors.neutral[1],
              color: theme.colors.neutral[8],
            },
          },
        },
      }),
    },

    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'xs',
        padding: 'lg',
        withBorder: true,
      },
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: '#FFFFFF',
          borderColor: theme.colors.neutral[2],
          transition: 'all 200ms ease',
          
          '&:hover': {
            borderColor: theme.colors.neutral[3],
            boxShadow: theme.shadows.sm,
          },
        },
      }),
    },

    Paper: {
      defaultProps: {
        radius: 'sm',
        p: 'md',
        withBorder: true,
      },
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: '#FFFFFF',
          borderColor: theme.colors.neutral[2],
        },
      }),
    },

    TextInput: {
      defaultProps: {
        radius: 'sm',
        size: 'sm',
      },
      styles: (theme: MantineTheme) => ({
        input: {
          borderColor: theme.colors.neutral[3],
          backgroundColor: '#FFFFFF',
          fontSize: rem(14),
          
          '&:focus': {
            borderColor: theme.colors.brand[4],
            boxShadow: `0 0 0 1px ${theme.colors.brand[4]}`,
          },
          
          '&::placeholder': {
            color: theme.colors.neutral[4],
            fontSize: rem(14),
          },
        },
        label: {
          fontWeight: 500,
          color: theme.colors.neutral[7],
          fontSize: rem(14),
        },
      }),
    },

    Textarea: {
      defaultProps: {
        radius: 'sm',
        size: 'sm',
      },
      styles: (theme: MantineTheme) => ({
        input: {
          borderColor: theme.colors.neutral[3],
          backgroundColor: '#FFFFFF',
          fontSize: rem(14),
          
          '&:focus': {
            borderColor: theme.colors.brand[4],
            boxShadow: `0 0 0 1px ${theme.colors.brand[4]}`,
          },
          
          '&::placeholder': {
            color: theme.colors.neutral[4],
            fontSize: rem(14),
          },
        },
        label: {
          fontWeight: 500,
          color: theme.colors.neutral[7],
          fontSize: rem(14),
        },
      }),
    },

    Select: {
      defaultProps: {
        radius: 'sm',
        size: 'sm',
      },
      styles: (theme: MantineTheme) => ({
        input: {
          borderColor: theme.colors.neutral[3],
          backgroundColor: '#FFFFFF',
          fontSize: rem(14),
          
          '&:focus': {
            borderColor: theme.colors.brand[4],
            boxShadow: `0 0 0 1px ${theme.colors.brand[4]}`,
          },
        },
        label: {
          fontWeight: 500,
          color: theme.colors.neutral[7],
          fontSize: rem(14),
        },
      }),
    },

    NumberInput: {
      defaultProps: {
        radius: 'sm',
        size: 'sm',
      },
      styles: (theme: MantineTheme) => ({
        input: {
          borderColor: theme.colors.neutral[3],
          backgroundColor: '#FFFFFF',
          fontSize: rem(14),
          
          '&:focus': {
            borderColor: theme.colors.brand[4],
            boxShadow: `0 0 0 1px ${theme.colors.brand[4]}`,
          },
        },
        label: {
          fontWeight: 500,
          color: theme.colors.neutral[7],
          fontSize: rem(14),
        },
      }),
    },

    Table: {
      styles: (theme: MantineTheme) => ({
        thead: {
          backgroundColor: theme.colors.neutral[0],
        },
        th: {
          fontWeight: 600,
          color: theme.colors.neutral[7],
          fontSize: rem(12),
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
          borderBottom: `1px solid ${theme.colors.neutral[2]}`,
          padding: `${rem(12)} ${rem(16)}`,
        },
        td: {
          borderBottom: `1px solid ${theme.colors.neutral[1]}`,
          padding: `${rem(12)} ${rem(16)}`,
          fontSize: rem(14),
          color: theme.colors.neutral[8],
        },
        tr: {
          '&:hover': {
            backgroundColor: theme.colors.neutral[0],
          },
        },
      }),
    },

    NavLink: {
      styles: (theme: MantineTheme) => ({
        root: {
          borderRadius: theme.radius.sm,
          padding: `${rem(8)} ${rem(12)}`,
          margin: `${rem(1)} 0`,
          fontSize: rem(14),
          fontWeight: 500,
          
          '&[data-active]': {
            backgroundColor: theme.colors.brand[0],
            color: theme.colors.brand[7],
            fontWeight: 600,
          },
          
          '&:hover:not([data-active])': {
            backgroundColor: theme.colors.neutral[1],
            color: theme.colors.neutral[8],
          },
        },
      }),
    },

    Modal: {
      defaultProps: {
        radius: 'md',
        shadow: 'xl',
        centered: true,
      },
      styles: (theme: MantineTheme) => ({
        content: {
          backgroundColor: '#FFFFFF',
        },
        header: {
          borderBottom: `1px solid ${theme.colors.neutral[2]}`,
          paddingBottom: theme.spacing.md,
        },
        title: {
          fontWeight: 600,
          fontSize: rem(18),
          color: theme.colors.neutral[8],
        },
      }),
    },

    Notification: {
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: '#FFFFFF',
          border: `1px solid ${theme.colors.neutral[2]}`,
          borderRadius: theme.radius.lg,
          boxShadow: theme.shadows.lg,
        },
      }),
    },

    Drawer: {
      defaultProps: {
        radius: 'md',
        shadow: 'xl',
      },
      styles: (theme: MantineTheme) => ({
        content: {
          backgroundColor: '#FFFFFF',
        },
        header: {
          borderBottom: `1px solid ${theme.colors.neutral[2]}`,
          paddingBottom: theme.spacing.md,
        },
        title: {
          fontWeight: 600,
          fontSize: rem(18),
          color: theme.colors.neutral[8],
        },
      }),
    },

    Popover: {
      defaultProps: {
        radius: 'md',
        shadow: 'md',
      },
      styles: (theme: MantineTheme) => ({
        dropdown: {
          backgroundColor: '#FFFFFF',
          border: `1px solid ${theme.colors.neutral[2]}`,
        },
      }),
    },

    Menu: {
      styles: (theme: MantineTheme) => ({
        dropdown: {
          backgroundColor: '#FFFFFF',
          border: `1px solid ${theme.colors.neutral[2]}`,
          borderRadius: theme.radius.md,
          boxShadow: theme.shadows.md,
        },
        item: {
          fontSize: rem(14),
          
          '&:hover': {
            backgroundColor: theme.colors.neutral[0],
          },
          
          '&[data-hovered]': {
            backgroundColor: theme.colors.neutral[0],
          },
        },
      }),
    },

    Tabs: {
      styles: (theme: MantineTheme) => ({
        tab: {
          fontSize: rem(14),
          fontWeight: 500,
          color: theme.colors.neutral[6],
          
          '&[data-active]': {
            color: theme.colors.brand[6],
            borderColor: theme.colors.brand[6],
          },
          
          '&:hover:not([data-active])': {
            color: theme.colors.neutral[8],
            borderColor: theme.colors.neutral[3],
          },
        },
      }),
    },

    Badge: {
      styles: (theme: MantineTheme) => ({
        root: {
          fontSize: rem(12),
          fontWeight: 500,
          textTransform: 'none',
        },
      }),
    },

    Tooltip: {
      styles: (theme: MantineTheme) => ({
        tooltip: {
          backgroundColor: theme.colors.neutral[8],
          color: '#FFFFFF',
          fontSize: rem(12),
          borderRadius: theme.radius.sm,
        },
      }),
    },
  },

  // Custom properties for layout and animations
  other: {
    headerHeight: rem(64),
    sidebarWidth: rem(256),
    sidebarCollapsedWidth: rem(64),
    contentMaxWidth: rem(1400),
    animationDuration: '200ms',
    animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
});

// === PROFESSIONAL TOKENS ===
export const tokens = {
  colors: {
    primary: palette.brand[500],
    primaryHover: palette.brand[600],
    primaryLight: palette.brand[100],
    primaryDark: palette.brand[700],
    
    text: {
      primary: palette.neutral[900],    // Very dark for high contrast
      secondary: palette.neutral[600],  // Medium gray for secondary text
      tertiary: palette.neutral[500],   // Lighter gray for hints
      disabled: palette.neutral[400],   // Light gray for disabled
      inverse: '#FFFFFF',
      link: palette.brand[600],
      linkHover: palette.brand[700],
    },
    
    background: {
      primary: '#FFFFFF',
      secondary: palette.neutral[50],   // Very light gray
      tertiary: palette.neutral[100],   // Light gray for cards
      elevated: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    
    border: {
      light: palette.neutral[200],      // Light borders
      medium: palette.neutral[300],     // Standard borders
      dark: palette.neutral[400],       // Emphasis borders
      focus: palette.brand[400],        // Focus borders
    },
    
    semantic: {
      success: palette.semantic.success,
      successLight: '#F8FFF9',
      successText: '#22863A',
      
      warning: palette.semantic.warning,
      warningLight: '#FFFCF0',
      warningText: '#B45309',
      
      error: palette.semantic.error,
      errorLight: '#FFF5F5',
      errorText: '#C62828',
      
      info: palette.semantic.info,
      infoLight: '#F0F9FF',
      infoText: '#1565C0',
    },
  },
  
  dashboard: {
    sidebar: {
      background: '#FFFFFF',
      border: palette.neutral[200],
      text: palette.neutral[700],
      textHover: palette.neutral[900],
      activeBackground: palette.brand[50],
      activeText: palette.brand[700],
      activeBorder: palette.brand[500],
    },
    header: {
      background: '#FFFFFF',
      border: palette.neutral[200],
      text: palette.neutral[800],
      shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    content: {
      background: palette.neutral[50],
      maxWidth: rem(1400),
    },
  },
  
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
    xxl: rem(48),
  },
  
  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(6),
    lg: rem(8),
    xl: rem(12),
  },
};

// === LAYOUT CONSTANTS ===
export const LAYOUT = {
  HEADER_HEIGHT: rem(64),
  SIDEBAR_WIDTH: rem(256),
  SIDEBAR_COLLAPSED_WIDTH: rem(64),
  CONTENT_MAX_WIDTH: rem(1400),
  MOBILE_BREAKPOINT: mantineTheme.breakpoints?.sm,
  
  Z_INDEX: {
    DROPDOWN: 1000,
    HEADER: 1100,
    SIDEBAR: 1200,
    MODAL: 1300,
    NOTIFICATION: 1400,
    TOOLTIP: 1500,
  },
  
  RESPONSIVE: {
    MOBILE: mantineTheme.breakpoints?.sm,
    TABLET: mantineTheme.breakpoints?.md,
    DESKTOP: mantineTheme.breakpoints?.lg,
    LARGE_DESKTOP: mantineTheme.breakpoints?.xl,
  },
  
  ANIMATION: {
    DURATION: '200ms',
    DURATION_FAST: '150ms',
    DURATION_SLOW: '300ms',
    EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
    EASING_SPRING: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
};

// === STATUS SYSTEM ===
export const STATUS_SYSTEM = {
  success: { 
    color: palette.semantic.success, 
    background: '#F8FFF9', 
    text: '#22863A',
    border: '#C3F7CB'
  },
  warning: { 
    color: palette.semantic.warning, 
    background: '#FFFCF0', 
    text: '#B45309',
    border: '#FFECB3'
  },
  error: { 
    color: palette.semantic.error, 
    background: '#FFF5F5', 
    text: '#C62828',
    border: '#FFCDD2'
  },
  info: { 
    color: palette.semantic.info, 
    background: '#F0F9FF', 
    text: '#1565C0',
    border: '#BAE6FD'
  },
  neutral: { 
    color: palette.neutral[500], 
    background: palette.neutral[100], 
    text: palette.neutral[700],
    border: palette.neutral[200]
  },
};

// === TYPOGRAPHY UTILITIES ===
export const typography = {
  // Letter spacing utilities for custom text
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.015em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Text transform utilities
  textTransform: {
    uppercase: 'uppercase' as const,
    lowercase: 'lowercase' as const,
    capitalize: 'capitalize' as const,
    none: 'none' as const,
  },
  
  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Line heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

// === UTILITY FUNCTIONS ===
export const utils = {
  // Get status color
  getStatusColor: (status: keyof typeof STATUS_SYSTEM) => STATUS_SYSTEM[status],
  
  // Get responsive value
  responsive: {
    mobile: `@media (max-width: ${mantineTheme.breakpoints?.sm})`,
    tablet: `@media (min-width: ${mantineTheme.breakpoints?.sm}) and (max-width: ${mantineTheme.breakpoints?.lg})`,
    desktop: `@media (min-width: ${mantineTheme.breakpoints?.lg})`,
    largeDesktop: `@media (min-width: ${mantineTheme.breakpoints?.xl})`,
  },
  
  // Shadow variations
  shadow: {
    card: `0 2px 8px ${palette.neutral[200]}`,
    cardHover: `0 8px 24px ${palette.neutral[300]}`,
    button: `0 2px 4px ${palette.brand[200]}`,
    modal: `0 20px 40px ${palette.neutral[400]}`,
    tooltip: `0 4px 12px ${palette.neutral[300]}`,
  },
  
  // Gradient utilities
  gradient: {
    primary: `linear-gradient(135deg, ${palette.brand[400]} 0%, ${palette.brand[600]} 100%)`,
    success: `linear-gradient(135deg, ${palette.semantic.success} 0%, #059669 100%)`,
    warning: `linear-gradient(135deg, ${palette.semantic.warning} 0%, #D97706 100%)`,
    surface: `linear-gradient(135deg, ${palette.neutral[50]} 0%, ${palette.neutral[100]} 100%)`,
  },
  
  // Focus utilities
  focus: {
    ring: `0 0 0 2px ${palette.brand[100]}, 0 0 0 4px ${palette.brand[400]}`,
    outline: `2px solid ${palette.brand[400]}`,
  },
};

// === STATUS VARIANTS FOR COMPONENTS ===
export const STATUS_VARIANTS = {
  active: { color: 'success', label: 'Active' },
  pending: { color: 'warning', label: 'Pending' },
  inactive: { color: 'neutral', label: 'Inactive' },
  error: { color: 'error', label: 'Error' },
  draft: { color: 'info', label: 'Draft' },
  archived: { color: 'neutral', label: 'Archived' },
};

// === LEGACY EXPORTS (for backward compatibility) ===
export const colors = tokens.colors;
export const spacing = tokens.spacing;
export const borders = {
  radius: tokens.radius,
  color: tokens.colors.border,
};

// === DEFAULT EXPORT ===
const designSystem = {
  theme: mantineTheme,
  palette,
  tokens,
  LAYOUT,
  STATUS_SYSTEM,
  STATUS_VARIANTS,
  typography,
  utils,
  colors,
  spacing,
  borders,
};

export default designSystem;