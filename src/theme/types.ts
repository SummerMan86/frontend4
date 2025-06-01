import { MantineTheme } from '@mantine/core';

// Расширяем типы Mantine для наших кастомных токенов
declare module '@mantine/core' {
  export interface MantineThemeOther {
    // Цвета дашборда
    dashboardCardBackground: string;
    dashboardCardBorder: string;
    dashboardTextPrimary: string;
    dashboardTextSecondary: string;
    dashboardTextMuted: string;
    
    // Размеры шрифтов
    dashboardFontTiny: string;
    dashboardFontSmall: string;
    dashboardFontLarge: string;
    
    // Веса шрифтов
    dashboardFontWeightMedium: string;
    dashboardFontWeightSemibold: string;
    dashboardFontWeightBold: string;
    
    // Интервалы
    dashboardLetterSpacingTight: string;
    dashboardLetterSpacingWider: string;
    dashboardLineHeightTight: number;
  }
}