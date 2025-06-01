import designSystem from './designSystem';

// Простые константы для дашборда (дополнительно к токенам темы)
export const dashboardStyles = {
  // Готовые стили для особых случаев
  animations: {
    cardHover: {
      transition: 'all 200ms ease',
      '&:hover': {
        transform: 'translateY(-2px)',
      },
    },
    fadeIn: {
      animation: 'fadeIn 300ms ease',
    },
  },
  
  // Готовые комбинации для ECharts
  chartColors: {
    primary: designSystem.palette.blue.base,
    success: designSystem.colors.status.success,
    warning: designSystem.colors.status.warning,
    error: designSystem.colors.status.error,
    neutral: designSystem.colors.text.secondary,
  },
  
  // Дополнительные утилиты
  utils: {
    tabularNums: {
      fontVariantNumeric: 'tabular-nums',
      fontFeatureSettings: '"tnum" 1, "kern" 1',
    },
  },
} as const;