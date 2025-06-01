/* ============================ components.ts ============================ */
import type { MantineThemeComponents, MantineTheme } from '@mantine/core';

export const components: MantineThemeComponents = {
  Button: {
    defaultProps: { 
      radius: 'md', 
      variant: 'filled',
    },
    styles: (theme: MantineTheme) => ({ 
      root: { 
        fontWeight: 600,
        transition: 'all 200ms ease',
      } 
    }),
  },
  
  Card: {
    defaultProps: {
      shadow: 'sm',
      withBorder: true,
      radius: 'lg',
      padding: 'lg',
    },
    styles: (theme: MantineTheme) => ({
      root: {
        background: theme.other.dashboardCardBackground,
        border: `1px solid ${theme.other.dashboardCardBorder}`,
        transition: 'all 200ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.md,
        },
      },
    }),
  },
  
  Text: {
    styles: (theme: MantineTheme) => ({
      root: {
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum" 1, "kern" 1',
      },
    }),
  },
  
  Title: {
    styles: (theme: MantineTheme) => ({
      root: {
        color: theme.other.dashboardTextPrimary,
        letterSpacing: theme.other.dashboardLetterSpacingTight,
      },
    }),
  },
  
  Table: {
    defaultProps: {
      striped: true,
      highlightOnHover: true,
      withColumnBorders: false,
    },
    styles: (theme: MantineTheme) => ({
      table: {
        fontVariantNumeric: 'tabular-nums',
        '--table-border-color': theme.other.dashboardCardBorder,
      },
      th: {
        fontWeight: 600,
        color: theme.other.dashboardTextSecondary,
        backgroundColor: theme.colors.neutral[0],
        fontSize: theme.other.dashboardFontSmall,
      },
      td: {
        fontWeight: 500,
        color: theme.other.dashboardTextPrimary,
      },
    }),
  },
  
  Badge: {
    defaultProps: {
      variant: 'light',
    },
    styles: (theme: MantineTheme) => ({
      root: {
        fontWeight: theme.other.dashboardFontWeightSemibold,
      },
    }),
  },
  
  Container: {
    defaultProps: {
      size: 'xl',
      py: 'xl',
    },
  },

  ThemeIcon: {
    styles: (theme: MantineTheme) => ({
      root: {
        borderRadius: '50%',
      },
    }),
  },
};