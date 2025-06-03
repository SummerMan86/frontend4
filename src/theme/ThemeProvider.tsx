/* ============================ ThemeProvider.tsx ============================ */
import React, { PropsWithChildren } from 'react';
import {
  MantineProvider,
  createTheme,
  MantineColorsTuple,
  MantineThemeOverride,
} from '@mantine/core';
import designSystem from './designSystem';
import { components } from './components';

// Convert number → pixel string
const toPx = (v?: number | string) => (typeof v === 'number' ? `${v}px` : v);
const toPxRecord = <T extends Record<string, any>>(rec?: T): Record<string, any> | undefined => {
  if (!rec) return undefined;
  return Object.fromEntries(
    Object.entries(rec).map(([k, v]) => [k, typeof v === 'number' ? `${v}px` : v]),
  );
};

// Создаем полную палитру цветов для Mantine
const createMantineColors = (): Record<string, MantineColorsTuple> => {
  // Основной синий (Microsoft Blue)
  const brand: MantineColorsTuple = [
    designSystem.palette.blue.ultraLight, // 0 - самый светлый
    '#D6ECFF',                            // 1
    designSystem.palette.blue.light,      // 2
    '#A3D0FF',                           // 3
    designSystem.palette.blue.soft,      // 4
    '#2B8FE6',                           // 5
    designSystem.palette.blue.base,      // 6 - основной
    designSystem.palette.blue.dark,      // 7
    '#004A85',                           // 8
    '#003366',                           // 9 - самый темный
  ];

  // Успех (зеленый)
  const success: MantineColorsTuple = [
    '#E8F8F0', '#D1F2E1', '#A3E6C2', '#75D9A4', 
    '#47CD85', designSystem.colors.status.success, // 5 - основной
    '#2A8B5F', '#1F6B48', '#154C32', '#0A2D1C'
  ];

  // Ошибка (красный)
  const error: MantineColorsTuple = [
    '#FEF2F2', '#FEE5E5', '#FECACA', '#FCA5A5', 
    '#F87171', designSystem.colors.status.error, // 5 - основной
    '#B91C1C', '#991B1B', '#7F1D1D', '#5F1D1D'
  ];

  // Предупреждение (оранжевый)
  const warning: MantineColorsTuple = [
    '#FEF8E6', '#FEF0CC', '#FDE199', '#FCD166', 
    '#FBC233', designSystem.colors.status.warning, // 5 - основной
    '#E6951F', '#CC8019', '#B36B13', '#99570D'
  ];

  // Нейтральные оттенки
  const neutral: MantineColorsTuple = [
    designSystem.palette.neutral[50],   // 0
    designSystem.palette.neutral[100],  // 1
    designSystem.palette.neutral[200],  // 2
    designSystem.palette.neutral[300],  // 3
    designSystem.palette.neutral[400],  // 4
    designSystem.palette.neutral[500],  // 5
    designSystem.palette.neutral[600],  // 6
    designSystem.palette.neutral[700],  // 7
    designSystem.palette.neutral[800],  // 8
    designSystem.palette.neutral[900],  // 9
  ];

  // Информационный (голубой)
  const info: MantineColorsTuple = [
    '#E6F7FF', '#CCF0FF', '#99E0FF', '#66D1FF', 
    '#33C1FF', designSystem.colors.status.info, // 5 - основной
    '#2980C7', '#1F6B99', '#14556B', '#0A3F3D'
  ];

  return {
    brand,
    success,
    error,
    warning,
    neutral,
    info,
  };
};

const mantineColors = createMantineColors();

const theme: MantineThemeOverride = createTheme({
  // Цвета как токены
  colors: mantineColors,
  primaryColor: 'brand',

  // Шрифты
  fontFamily: designSystem.typography.fonts.body,
  fontFamilyMonospace: designSystem.typography.fonts.mono,
  
  // Заголовки
  headings: {
    fontFamily: designSystem.typography.fonts.heading,
    fontWeight: '600',
    sizes: {
      h1: { 
        fontSize: toPx(designSystem.typography.fontSizes['4xl']), 
        fontWeight: '700', // Исправлено: строка вместо числа
        lineHeight: String(designSystem.typography.lineHeights.shorter),
      },
      h2: { 
        fontSize: toPx(designSystem.typography.fontSizes['3xl']), 
        fontWeight: '700', // Исправлено: строка вместо числа
        lineHeight: String(designSystem.typography.lineHeights.short),
      },
      h3: { 
        fontSize: toPx(designSystem.typography.fontSizes['2xl']), 
        fontWeight: '600', // Исправлено: строка вместо числа
        lineHeight: String(designSystem.typography.lineHeights.short),
      },
      h4: { 
        fontSize: toPx(designSystem.typography.fontSizes.xl), 
        fontWeight: '600', // Исправлено: строка вместо числа
        lineHeight: String(designSystem.typography.lineHeights.short),
      },
      h5: { 
        fontSize: toPx(designSystem.typography.fontSizes.lg), 
        fontWeight: '600', // Исправлено: строка вместо числа
        lineHeight: String(designSystem.typography.lineHeights.normal),
      },
      h6: { 
        fontSize: toPx(designSystem.typography.fontSizes.md), 
        fontWeight: '600', // Исправлено: строка вместо числа
        lineHeight: String(designSystem.typography.lineHeights.normal),
      },
    },
  },

  // Отступы, радиусы, breakpoints
  spacing: toPxRecord(designSystem.spacing.space) as any,
  radius: toPxRecord(designSystem.borders.radii) as any,
  breakpoints: toPxRecord(designSystem.breakpoints) as any,

  // Тени как токены
  shadows: {
    xs: designSystem.effects.shadows.xs,
    sm: designSystem.effects.shadows.small,
    md: designSystem.effects.shadows.medium,
    lg: designSystem.effects.shadows.large,
    xl: designSystem.effects.shadows.extraLarge,
  },

  // Кастомные CSS переменные для дашборда
  other: {
    // Цвета дашборда
    dashboardCardBackground: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
    dashboardCardBorder: designSystem.colors.element.border,
    dashboardTextPrimary: designSystem.colors.text.primary,
    dashboardTextSecondary: designSystem.colors.text.secondary,
    dashboardTextMuted: designSystem.colors.text.tertiary,
    
    // Размеры шрифтов для дашборда
    dashboardFontTiny: designSystem.typography.fontSizes.xs,
    dashboardFontSmall: designSystem.typography.fontSizes.sm,
    dashboardFontLarge: designSystem.typography.fontSizes['3xl'],
    
    // Веса шрифтов (как строки для совместимости)
    dashboardFontWeightMedium: '500',
    dashboardFontWeightSemibold: '600',
    dashboardFontWeightBold: '700',
    
    // Интервалы
    dashboardLetterSpacingTight: designSystem.typography.letterSpacings.tight,
    dashboardLetterSpacingWider: designSystem.typography.letterSpacings.wider,
    dashboardLineHeightTight: designSystem.typography.lineHeights.tight,
  },

  components,
});

export const ThemeProvider = ({ children }: PropsWithChildren) => (
  <MantineProvider theme={theme}>{children}</MantineProvider>
);