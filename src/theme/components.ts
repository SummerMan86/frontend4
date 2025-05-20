/**
 * components.ts
 * Настройка компонентов Chakra UI 3.19.0 с семантическими именами
 */
import { ComponentStyleConfig } from '@chakra-ui/theme';
import designSystem, { colors, typography, spacing, borders } from './designSystem';

// Настройки кнопки
export const Button: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: typography.fontWeights.medium,
    borderRadius: borders.radii.medium,
    _focus: {
      boxShadow: `0 0 0 2px ${colors.state.focus}`,
    },
  },
  variants: {
    solid: {
      bg: colors.primary[600],
      color: colors.text.inverse,
      _hover: { bg: colors.primary[700] },
      _active: { bg: colors.primary[600] },
    },
    outline: {
      borderColor: colors.primary[600],
      color: colors.primary[600],
    },
    ghost: {
      color: colors.text.primary,
      _hover: {
        bg: colors.state.hover,
      },
    },
    secondary: {
      bg: colors.background.secondary,
      color: colors.text.primary,
      _hover: { bg: colors.background.tertiary },
    },
    danger: {
      bg: colors.status.error,
      color: colors.text.inverse,
      _hover: { filter: 'brightness(110%)' },
    },
  },
  sizes: {
    sm: {
      fontSize: typography.fontSizes.xs,
      paddingLeft: 3,
      paddingRight: 3,
      paddingTop: 1,
      paddingBottom: 1,
    },
    md: {
      fontSize: typography.fontSizes.sm,
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 2,
      paddingBottom: 2,
    },
    lg: {
      fontSize: typography.fontSizes.md,
      paddingLeft: 6,
      paddingRight: 6,
      paddingTop: 3,
      paddingBottom: 3,
    },
  },
  defaultProps: {
    variant: 'solid',
    size: 'md',
  },
};

// Настройки карточки
export const Card: ComponentStyleConfig = {
  baseStyle: {
    container: {
      background: colors.background.primary,
      borderRadius: borders.radii.large,
      boxShadow: designSystem.effects.shadows.small,
      overflow: 'hidden',
    },
    header: {
      paddingLeft: spacing.space.medium,
      paddingRight: spacing.space.medium,
      paddingTop: spacing.space.small,
      paddingBottom: spacing.space.small,
      borderBottomWidth: '1px',
      borderColor: colors.element.border,
    },
    body: {
      paddingLeft: spacing.space.medium,
      paddingRight: spacing.space.medium,
      paddingTop: spacing.space.medium,
      paddingBottom: spacing.space.medium,
    },
    footer: {
      paddingLeft: spacing.space.medium,
      paddingRight: spacing.space.medium,
      paddingTop: spacing.space.small,
      paddingBottom: spacing.space.small,
      borderTopWidth: '1px',
      borderColor: colors.element.border,
    },
  },
};

// Настройки полей ввода
export const Input: ComponentStyleConfig = {
  variants: {
    outline: {
      field: {
        background: colors.background.secondary,
        borderColor: colors.element.border,
        _hover: {
          borderColor: designSystem.palette.neutral[300],
        },
        _focus: {
          borderColor: colors.primary[600],
          boxShadow: `0 0 0 1px ${colors.primary[600]}`,
        },
      },
    },
  },
  defaultProps: {
    variant: 'outline',
  },
};

// Настройки бейджей
export const Badge: ComponentStyleConfig = {
  baseStyle: {
    paddingLeft: 2,
    paddingRight: 2,
    paddingTop: 1,
    paddingBottom: 1,
    textTransform: 'none',
    fontWeight: typography.fontWeights.medium,
  },
  variants: {
    solid: {
      background: colors.primary[600],
      color: colors.text.inverse,
    },
    subtle: {
      background: colors.primary[100],
      color: colors.primary[600],
    },
    outline: {
      borderColor: colors.primary[600],
      color: colors.primary[600],
    },
    success: {
      background: colors.status.success,
      color: colors.text.inverse,
    },
    error: {
      background: colors.status.error,
      color: colors.text.inverse,
    },
    warning: {
      background: colors.status.warning,
      color: colors.text.primary,
    },
    info: {
      background: colors.status.info,
      color: colors.text.inverse,
    },
  },
  defaultProps: {
    variant: 'subtle',
  },
};

// Настройки панели инструментов
export const Toolbar: ComponentStyleConfig = {
  baseStyle: {
    paddingLeft: spacing.space.medium,
    paddingRight: spacing.space.medium,
    paddingTop: spacing.space.small,
    paddingBottom: spacing.space.small,
    background: colors.background.secondary,
    borderRadius: borders.radii.medium,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.space.small,
  },
};

// Настройки заголовков
export const Heading: ComponentStyleConfig = {
  baseStyle: {
    fontFamily: typography.fonts.heading,
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.lineHeights.tight,
  },
  sizes: {
    h1: {
      fontSize: typography.fontSizes['4xl'],
      marginBottom: spacing.space.large,
    },
    h2: {
      fontSize: typography.fontSizes['3xl'],
      marginBottom: spacing.space.medium,
    },
    h3: {
      fontSize: typography.fontSizes['2xl'],
      marginBottom: spacing.space.small,
    },
    h4: {
      fontSize: typography.fontSizes.xl,
      marginBottom: spacing.space.small,
    },
  },
  defaultProps: {
    size: 'h3',
  },
};

// Объединение всех компонентов
export const components = {
  Button,
  Card,
  Input,
  Badge,
  Toolbar,
  Heading,
};