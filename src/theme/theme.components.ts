// src/theme/theme.components.ts - Mantine 8 component overrides using tokens
import type { MantineThemeComponents, MantineTheme } from '@mantine/core';
import { 
  spacing, 
  radius, 
  transitions, 
  semantic, 
  fontSizes, 
  fontWeights,
  shadows,
  getColor,
  transition,
  focusStyles,
  hoverStyles,
} from './theme.tokens';

export const componentOverrides: MantineThemeComponents = {
  // ============================================
  // BUTTONS
  // ============================================
  Button: {
    defaultProps: {
      size: 'sm',
      radius: 'md',
    },
    vars: (theme: MantineTheme, params: any) => {
      // Use CSS variables for easy customization
      return {
        root: {
          '--button-height': params.size === 'xs' ? '30px' : 
                           params.size === 'sm' ? '36px' : 
                           params.size === 'md' ? '42px' : 
                           params.size === 'lg' ? '50px' : '60px',
          '--button-padding-x': params.size === 'xs' ? spacing.sm : 
                              params.size === 'sm' ? spacing.md : 
                              params.size === 'md' ? spacing.lg : 
                              params.size === 'lg' ? spacing.xl : spacing['2xl'],
          '--button-fz': params.size === 'xs' ? fontSizes.xs : 
                       params.size === 'sm' ? fontSizes.sm : 
                       params.size === 'md' ? fontSizes.md : 
                       params.size === 'lg' ? fontSizes.lg : fontSizes.xl,
        },
      };
    },
    styles: (theme: MantineTheme, params: any, { variant }: any) => ({
      root: {
        height: 'var(--button-height)',
        paddingLeft: 'var(--button-padding-x)',
        paddingRight: 'var(--button-padding-x)',
        fontSize: 'var(--button-fz)',
        fontWeight: fontWeights.medium,
        transition: transition(['background-color', 'transform', 'box-shadow']),
        
        ...hoverStyles({
          transform: 'translateY(-1px)',
        }),
        
        '&:active': {
          transform: 'translateY(0)',
        },
        
        ...focusStyles(),
      },
    }),
  },

  // ============================================
  // INPUTS
  // ============================================
  TextInput: {
    defaultProps: {
      size: 'sm',
      radius: 'md',
    },
    styles: {
      label: {
        marginBottom: spacing['2xs'],
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        color: semantic.colors.text.primary,
      },
      input: {
        backgroundColor: semantic.colors.background.paper,
        borderColor: semantic.colors.border.default,
        fontSize: fontSizes.sm,
        transition: transition(['border-color', 'box-shadow']),
        
        '&::placeholder': {
          color: semantic.colors.text.disabled,
        },
        
        '&:hover': {
          borderColor: semantic.colors.border.hover,
        },
        
        ...focusStyles(),
      },
      error: {
        marginTop: spacing['2xs'],
        fontSize: fontSizes.xs,
      },
    },
  },

  Select: {
    defaultProps: {
      size: 'sm',
      radius: 'md',
    },
    styles: {
      label: {
        marginBottom: spacing['2xs'],
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        color: semantic.colors.text.primary,
      },
      input: {
        backgroundColor: semantic.colors.background.paper,
        borderColor: semantic.colors.border.default,
        fontSize: fontSizes.sm,
        transition: transition(['border-color', 'box-shadow']),
        
        '&:hover': {
          borderColor: semantic.colors.border.hover,
        },
        
        ...focusStyles(),
      },
      dropdown: {
        borderRadius: radius.md,
        border: `1px solid ${semantic.colors.border.default}`,
        boxShadow: shadows.lg,
      },
      option: {
        fontSize: fontSizes.sm,
        padding: `${spacing.xs} ${spacing.sm}`,
        borderRadius: radius.sm,
        
        ...hoverStyles({
          backgroundColor: semantic.colors.background.hover,
        }),
      },
    },
  },

  MultiSelect: {
    defaultProps: {
      size: 'sm',
      radius: 'md',
    },
    styles: {
      label: {
        marginBottom: spacing['2xs'],
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        color: semantic.colors.text.primary,
      },
      input: {
        backgroundColor: semantic.colors.background.paper,
        borderColor: semantic.colors.border.default,
        minHeight: '38px',
        fontSize: fontSizes.sm,
        transition: transition(['border-color', 'box-shadow']),
        
        '&[data-hovered]': {
          borderColor: semantic.colors.border.hover,
        },
        
        ...focusStyles(),
      },
      value: {
        backgroundColor: getColor('primary', 100),
        color: getColor('primary', 700),
        border: `1px solid ${getColor('primary', 200)}`,
        borderRadius: radius.sm,
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.medium,
      },
      dropdown: {
        borderRadius: radius.md,
        border: `1px solid ${semantic.colors.border.default}`,
        boxShadow: shadows.lg,
      },
    },
  },

  DatePickerInput: {
    defaultProps: {
      size: 'sm',
      radius: 'md',
    },
    styles: {
      label: {
        marginBottom: spacing['2xs'],
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        color: semantic.colors.text.primary,
      },
      input: {
        backgroundColor: semantic.colors.background.paper,
        borderColor: semantic.colors.border.default,
        fontSize: fontSizes.sm,
        transition: transition(['border-color', 'box-shadow']),
        
        '&:hover': {
          borderColor: semantic.colors.border.hover,
        },
        
        ...focusStyles(),
      },
      calendarHeader: {
        marginBottom: spacing.sm,
      },
      day: {
        borderRadius: radius.md,
        fontSize: fontSizes.sm,
        transition: transition('all', 'fast'),
        
        '&[data-selected]': {
          backgroundColor: getColor('primary', 500),
          color: semantic.colors.text.inverse,
        },
        
        ...hoverStyles({
          backgroundColor: semantic.colors.background.hover,
        }),
      },
    },
  },

  // ============================================
  // CARDS & PAPERS
  // ============================================
  Card: {
    defaultProps: {
      padding: 'lg',
      radius: 'lg',
      withBorder: true,
    },
    styles: {
      root: {
        backgroundColor: semantic.colors.background.paper,
        borderColor: semantic.colors.border.default,
        boxShadow: shadows.sm,
        transition: transition(['transform', 'box-shadow']),
        
        ...hoverStyles({
          transform: 'translateY(-2px)',
          boxShadow: shadows.md,
        }),
      },
    },
  },

  Paper: {
    defaultProps: {
      radius: 'md',
      p: 'md',
    },
    styles: (theme: MantineTheme, params: any) => ({
      root: {
        backgroundColor: semantic.colors.background.paper,
        boxShadow: params.shadow ? shadows[params.shadow as keyof typeof shadows] : 'none',
        borderColor: params.withBorder ? semantic.colors.border.default : 'transparent',
      },
    }),
  },

  // ============================================
  // DATA DISPLAY
  // ============================================
  Table: {
    styles: {
      root: {
        fontSize: fontSizes.sm,
      },
      table: {
        borderCollapse: 'separate',
        borderSpacing: 0,
      },
      thead: {
        backgroundColor: semantic.colors.background.hover,
        borderBottom: `2px solid ${semantic.colors.border.default}`,
      },
      th: {
        padding: `${spacing.sm} ${spacing.md}`,
        fontWeight: fontWeights.semibold,
        color: semantic.colors.text.secondary,
        fontSize: fontSizes.xs,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
      },
      td: {
        padding: `${spacing.sm} ${spacing.md}`,
        borderBottom: `1px solid ${semantic.colors.border.default}`,
        color: semantic.colors.text.primary,
      },
      tr: {
        transition: transition('background-color', 'fast'),
        
        '&[data-hover]:hover': {
          backgroundColor: semantic.colors.background.hover,
        },
      },
    },
  },

  Badge: {
    defaultProps: {
      radius: 'sm',
      size: 'sm',
    },
    styles: (theme: MantineTheme, params: any) => {
      const statusColors = semantic.colors.status;
      const colorKey = params.color as keyof typeof statusColors;
      const colorSet = statusColors[colorKey];
      
      if (!colorSet) {
        return {
          root: {
            fontSize: fontSizes.xs,
            fontWeight: fontWeights.medium,
            padding: `${spacing['3xs']} ${spacing.xs}`,
          },
        };
      }
      
      return {
        root: {
          fontSize: fontSizes.xs,
          fontWeight: fontWeights.medium,
          padding: `${spacing['3xs']} ${spacing.xs}`,
          backgroundColor: params.variant === 'filled' ? colorSet.main : colorSet.background,
          color: params.variant === 'filled' ? semantic.colors.text.inverse : colorSet.text,
          borderColor: colorSet.border,
        },
      };
    },
  },

  Progress: {
    defaultProps: {
      radius: 'xl',
      size: 'md',
    },
    styles: {
      root: {
        backgroundColor: semantic.colors.background.hover,
      },
      bar: {
        transition: transition('width', 'slow'),
      },
    },
  },

  // ============================================
  // OVERLAYS
  // ============================================
  Modal: {
    defaultProps: {
      radius: 'lg',
      centered: true,
      overlayProps: {
        blur: 3,
      },
    },
    styles: {
      content: {
        boxShadow: shadows['2xl'],
      },
      header: {
        padding: spacing.lg,
        borderBottom: `1px solid ${semantic.colors.border.default}`,
      },
      title: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.semibold,
      },
      body: {
        padding: spacing.lg,
      },
    },
  },

  Tooltip: {
    defaultProps: {
      radius: 'md',
    },
    styles: {
      tooltip: {
        backgroundColor: getColor('gray', 900),
        color: semantic.colors.text.inverse,
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.medium,
        padding: `${spacing['2xs']} ${spacing.xs}`,
        boxShadow: shadows.lg,
      },
    },
  },

  // ============================================
  // NAVIGATION
  // ============================================
  Tabs: {
    defaultProps: {
      radius: 'md',
    },
    styles: {
      root: {
        fontSize: fontSizes.sm,
      },
      list: {
        borderBottom: `1px solid ${semantic.colors.border.default}`,
      },
      tab: {
        fontWeight: fontWeights.medium,
        color: semantic.colors.text.secondary,
        padding: `${spacing.sm} ${spacing.md}`,
        transition: transition(['color', 'border-color']),
        
        '&[data-active]': {
          color: getColor('primary', 600),
          borderColor: getColor('primary', 500),
        },
        
        ...hoverStyles({
          color: semantic.colors.text.primary,
          backgroundColor: semantic.colors.background.hover,
        }),
      },
    },
  },

  NavLink: {
    defaultProps: {
      radius: 'md',
    },
    styles: {
      root: {
        padding: `${spacing.xs} ${spacing.sm}`,
        borderRadius: radius.md,
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        transition: transition(['background-color', 'color']),
        
        '&[data-active]': {
          backgroundColor: getColor('primary', 100),
          color: getColor('primary', 700),
        },
        
        ...hoverStyles({
          backgroundColor: semantic.colors.background.hover,
        }),
      },
    },
  },

  // ============================================
  // FEEDBACK
  // ============================================
  Alert: {
    defaultProps: {
      radius: 'md',
    },
    styles: (theme: MantineTheme, params: any) => {
      const statusColors = semantic.colors.status;
      const colorKey = params.color as keyof typeof statusColors;
      const colorSet = statusColors[colorKey] || statusColors.info;
      
      return {
        root: {
          backgroundColor: colorSet.background,
          borderColor: colorSet.border,
          color: colorSet.text,
          padding: spacing.md,
        },
        title: {
          fontWeight: fontWeights.semibold,
          marginBottom: spacing['2xs'],
        },
        icon: {
          color: colorSet.main,
        },
      };
    },
  },

  Notification: {
    defaultProps: {
      radius: 'md',
    },
    styles: {
      root: {
        backgroundColor: semantic.colors.background.paper,
        borderColor: semantic.colors.border.default,
        boxShadow: shadows.lg,
        padding: spacing.md,
      },
      title: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.semibold,
        marginBottom: spacing['2xs'],
      },
      description: {
        fontSize: fontSizes.sm,
        color: semantic.colors.text.secondary,
      },
    },
  }

  // ============================================
  // MISC
  // ============================================
  /*ActionIcon: {
    defaultProps: {
      variant: 'subtle',
      radius: 'md',
    },
    styles: {
      root: {
        transition: transition(['background-color', 'transform'*/
}