// theme.tokens.extended.ts
// Расширение существующих токенов темы для оперативного контроля

import { colors, spacing, fontSizes, fontWeights, shadows, radius } from './theme.tokens';

// Семантические токены для алертов и оперативного контроля
export const operationalTokens = {
  // Токены для алертов
  alerts: {
    critical: {
      background: colors.error[50],
      border: colors.error[300],
      text: colors.error[700],
      icon: colors.error[500],
      pulse: colors.error[400],
    },
    warning: {
      background: colors.warning[50],
      border: colors.warning[300],
      text: colors.warning[700],
      icon: colors.warning[500],
      pulse: colors.warning[400],
    },
    info: {
      background: colors.info[50],
      border: colors.info[300],
      text: colors.info[700],
      icon: colors.info[500],
      pulse: colors.info[400],
    },
    success: {
      background: colors.success[50],
      border: colors.success[300],
      text: colors.success[700],
      icon: colors.success[500],
      pulse: colors.success[400],
    },
  },
  
  // Метрики и индикаторы
  metrics: {
    positive: colors.success[500],
    negative: colors.error[500],
    neutral: colors.gray[500],
    trend: {
      up: colors.success[500],
      down: colors.error[500],
      stable: colors.gray[500],
    },
  },
  
  // Приоритеты
  priority: {
    critical: colors.error[500],
    high: colors.warning[500],
    medium: colors.info[500],
    low: colors.gray[500],
  },
  
  // Статусы
  status: {
    online: colors.success[500],
    offline: colors.gray[500],
    busy: colors.warning[500],
    error: colors.error[500],
  },
} as const;

// Анимации для алертов и оперативных элементов
export const animations = {
  pulse: {
    keyframes: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `,
    value: 'pulse 2s infinite',
  },
  pulseRing: {
    keyframes: `
      @keyframes pulseRing {
        0% {
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
        }
      }
    `,
    value: 'pulseRing 2s infinite',
  },
  shake: {
    keyframes: `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
      }
    `,
    value: 'shake 0.5s',
  },
  slideInRight: {
    keyframes: `
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
    value: 'slideInRight 0.3s ease-out',
  },
  slideInTop: {
    keyframes: `
      @keyframes slideInTop {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
    value: 'slideInTop 0.3s ease-out',
  },
  fadeIn: {
    keyframes: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    value: 'fadeIn 0.2s ease-out',
  },
  spin: {
    keyframes: `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,
    value: 'spin 1s linear infinite',
  },
} as const;

// Классы для оперативного контроля
export const operationalClasses = {
  // Классы для алертов
  alertCritical: {
    backgroundColor: operationalTokens.alerts.critical.background,
    borderColor: operationalTokens.alerts.critical.border,
    color: operationalTokens.alerts.critical.text,
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '4px',
      backgroundColor: operationalTokens.alerts.critical.icon,
    },
  },
  
  // Классы для метрик
  metricPositive: {
    color: operationalTokens.metrics.positive,
    '&::before': {
      content: '+',
    },
  },
  
  metricNegative: {
    color: operationalTokens.metrics.negative,
  },
  
  // Hover эффект для карточек
  hoverLift: {
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: shadows.md,
    },
  },
  
  // Пульсирующий индикатор
  pulseIndicator: {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '8px',
      height: '8px',
      backgroundColor: operationalTokens.alerts.critical.icon,
      borderRadius: '50%',
      animation: animations.pulse.value,
    },
  },
};

// Утилиты для работы с темой в оперативном контроле
export const operationalUtils = {
  // Получить цвет для значения метрики
  getMetricColor: (value: number, threshold: number, inverse = false): string => {
    const ratio = value / threshold;
    
    if (inverse) {
      if (ratio > 1.2) return operationalTokens.metrics.negative;
      if (ratio > 1) return operationalTokens.metrics.trend.down;
      return operationalTokens.metrics.positive;
    }
    
    if (ratio < 0.5) return operationalTokens.metrics.negative;
    if (ratio < 0.8) return operationalTokens.metrics.trend.down;
    return operationalTokens.metrics.positive;
  },
  
  // Получить цвет для статуса
  getStatusColor: (status: 'good' | 'warning' | 'bad'): string => {
    const colors = {
      good: operationalTokens.metrics.positive,
      warning: operationalTokens.alerts.warning.icon,
      bad: operationalTokens.metrics.negative,
    };
    return colors[status];
  },
  
  // Получить цвет алерта
  getAlertColor: (type: 'critical' | 'warning' | 'info'): {
    bg: string;
    border: string;
    text: string;
    icon: string;
  } => {
    const alert = operationalTokens.alerts[type] || operationalTokens.alerts.info;
    return {
      bg: alert.background,
      border: alert.border,
      text: alert.text,
      icon: alert.icon,
    };
  },
};