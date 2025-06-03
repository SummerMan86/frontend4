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
    slideIn: {
      animation: 'slideIn 200ms ease',
    },
    pulse: {
      animation: 'pulse 2s infinite',
    },
  },
  
  // Готовые комбинации для ECharts
  chartColors: {
    primary: designSystem.palette.brand[500],
    success: designSystem.tokens.colors.semantic.success,
    warning: designSystem.tokens.colors.semantic.warning,
    error: designSystem.tokens.colors.semantic.error,
    info: designSystem.tokens.colors.semantic.info,
    neutral: designSystem.tokens.colors.text.secondary,
    // Дополнительные цвета для графиков
    series: [
      designSystem.palette.brand[500],
      designSystem.palette.accent.teal,
      designSystem.palette.accent.purple,
      designSystem.palette.accent.orange,
      designSystem.palette.semantic.success,
      designSystem.palette.semantic.warning,
      designSystem.palette.semantic.error,
      designSystem.palette.accent.indigo,
    ],
    gradient: [
      designSystem.utils.gradient.primary,
      designSystem.utils.gradient.success,
      designSystem.utils.gradient.warning,
      designSystem.utils.gradient.surface,
    ],
  },
  
  // Готовые стили для карточек статусов
  statusCards: {
    success: {
      backgroundColor: designSystem.STATUS_SYSTEM.success.background,
      borderColor: designSystem.STATUS_SYSTEM.success.border,
      color: designSystem.STATUS_SYSTEM.success.text,
    },
    warning: {
      backgroundColor: designSystem.STATUS_SYSTEM.warning.background,
      borderColor: designSystem.STATUS_SYSTEM.warning.border,
      color: designSystem.STATUS_SYSTEM.warning.text,
    },
    error: {
      backgroundColor: designSystem.STATUS_SYSTEM.error.background,
      borderColor: designSystem.STATUS_SYSTEM.error.border,
      color: designSystem.STATUS_SYSTEM.error.text,
    },
    info: {
      backgroundColor: designSystem.STATUS_SYSTEM.info.background,
      borderColor: designSystem.STATUS_SYSTEM.info.border,
      color: designSystem.STATUS_SYSTEM.info.text,
    },
    neutral: {
      backgroundColor: designSystem.STATUS_SYSTEM.neutral.background,
      borderColor: designSystem.STATUS_SYSTEM.neutral.border,
      color: designSystem.STATUS_SYSTEM.neutral.text,
    },
  },
  
  // Готовые стили для навигации
  navigation: {
    sidebar: {
      background: designSystem.tokens.dashboard.sidebar.background,
      border: designSystem.tokens.dashboard.sidebar.border,
      text: designSystem.tokens.dashboard.sidebar.text,
      textHover: designSystem.tokens.dashboard.sidebar.textHover,
      activeBackground: designSystem.tokens.dashboard.sidebar.activeBackground,
      activeText: designSystem.tokens.dashboard.sidebar.activeText,
      activeBorder: designSystem.tokens.dashboard.sidebar.activeBorder,
      width: designSystem.LAYOUT.SIDEBAR_WIDTH,
      collapsedWidth: designSystem.LAYOUT.SIDEBAR_COLLAPSED_WIDTH,
    },
    header: {
      background: designSystem.tokens.dashboard.header.background,
      border: designSystem.tokens.dashboard.header.border,
      text: designSystem.tokens.dashboard.header.text,
      shadow: designSystem.tokens.dashboard.header.shadow,
      height: designSystem.LAYOUT.HEADER_HEIGHT,
    },
  },
  
  // Готовые стили для таблиц и данных
  dataDisplay: {
    table: {
      headerBackground: designSystem.palette.neutral[50],
      headerText: designSystem.palette.neutral[700],
      borderColor: designSystem.palette.neutral[200],
      hoverBackground: designSystem.palette.neutral[50],
      stripedBackground: designSystem.palette.neutral[25] || '#FEFEFE',
    },
    metrics: {
      primary: {
        value: designSystem.palette.brand[600],
        label: designSystem.palette.neutral[600],
        background: designSystem.palette.brand[50],
      },
      success: {
        value: designSystem.palette.semantic.success,
        label: designSystem.palette.neutral[600],
        background: designSystem.STATUS_SYSTEM.success.background,
      },
      warning: {
        value: designSystem.palette.semantic.warning,
        label: designSystem.palette.neutral[600],
        background: designSystem.STATUS_SYSTEM.warning.background,
      },
      error: {
        value: designSystem.palette.semantic.error,
        label: designSystem.palette.neutral[600],
        background: designSystem.STATUS_SYSTEM.error.background,
      },
    },
  },
  
  // Дополнительные утилиты
  utils: {
    tabularNums: {
      fontVariantNumeric: 'tabular-nums',
      fontFeatureSettings: '"tnum" 1, "kern" 1',
    },
    truncateText: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    visuallyHidden: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    },
    centerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fullWidth: {
      width: '100%',
    },
    fullHeight: {
      height: '100%',
    },
    scrollable: {
      overflow: 'auto',
      '-webkit-overflow-scrolling': 'touch',
    },
  },
  
  // Стили для форм
  forms: {
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: designSystem.tokens.spacing.sm,
    },
    fieldRow: {
      display: 'flex',
      gap: designSystem.tokens.spacing.md,
      alignItems: 'end',
    },
    fieldLabel: {
      fontWeight: designSystem.typography.fontWeight.medium,
      color: designSystem.tokens.colors.text.primary,
      fontSize: designSystem.mantineTheme.fontSizes?.sm,
      marginBottom: designSystem.tokens.spacing.xs,
    },
    fieldHelp: {
      fontSize: designSystem.mantineTheme.fontSizes?.xs,
      color: designSystem.tokens.colors.text.tertiary,
      marginTop: designSystem.tokens.spacing.xs,
    },
    fieldError: {
      fontSize: designSystem.mantineTheme.fontSizes?.xs,
      color: designSystem.tokens.colors.semantic.error,
      marginTop: designSystem.tokens.spacing.xs,
    },
  },
  
  // Готовые CSS-in-JS стили для компонентов
  components: {
    dashboardCard: {
      backgroundColor: designSystem.tokens.colors.background.primary,
      border: `1px solid ${designSystem.tokens.colors.border.light}`,
      borderRadius: designSystem.tokens.radius.lg,
      padding: designSystem.tokens.spacing.lg,
      boxShadow: designSystem.utils.shadow.card,
      transition: designSystem.LAYOUT.ANIMATION.DURATION,
      
      '&:hover': {
        borderColor: designSystem.tokens.colors.border.medium,
        boxShadow: designSystem.utils.shadow.cardHover,
      },
    },
    
    metricCard: {
      backgroundColor: designSystem.tokens.colors.background.primary,
      border: `1px solid ${designSystem.tokens.colors.border.light}`,
      borderRadius: designSystem.tokens.radius.md,
      padding: designSystem.tokens.spacing.md,
      textAlign: 'center',
      
      '& .metric-value': {
        fontSize: designSystem.mantineTheme.fontSizes?.xl,
        fontWeight: designSystem.typography.fontWeight.bold,
        color: designSystem.tokens.colors.text.primary,
        lineHeight: designSystem.typography.lineHeight.tight,
      },
      
      '& .metric-label': {
        fontSize: designSystem.mantineTheme.fontSizes?.sm,
        color: designSystem.tokens.colors.text.secondary,
        marginTop: designSystem.tokens.spacing.xs,
      },
      
      '& .metric-change': {
        fontSize: designSystem.mantineTheme.fontSizes?.xs,
        fontWeight: designSystem.typography.fontWeight.medium,
        marginTop: designSystem.tokens.spacing.xs,
      },
    },
    
    actionButton: {
      backgroundColor: designSystem.tokens.colors.primary,
      color: designSystem.tokens.colors.text.inverse,
      border: 'none',
      borderRadius: designSystem.tokens.radius.sm,
      padding: `${designSystem.tokens.spacing.sm} ${designSystem.tokens.spacing.md}`,
      fontSize: designSystem.mantineTheme.fontSizes?.sm,
      fontWeight: designSystem.typography.fontWeight.medium,
      cursor: 'pointer',
      transition: designSystem.LAYOUT.ANIMATION.DURATION,
      
      '&:hover': {
        backgroundColor: designSystem.tokens.colors.primaryHover,
        transform: 'translateY(-1px)',
        boxShadow: designSystem.utils.shadow.button,
      },
      
      '&:active': {
        transform: 'translateY(0)',
      },
      
      '&:disabled': {
        backgroundColor: designSystem.tokens.colors.text.disabled,
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none',
      },
    },
  },
  
  // Медиа-запросы
  breakpoints: {
    mobile: designSystem.utils.responsive.mobile,
    tablet: designSystem.utils.responsive.tablet,
    desktop: designSystem.utils.responsive.desktop,
    largeDesktop: designSystem.utils.responsive.largeDesktop,
  },
  
  // Z-index константы
  zIndex: designSystem.LAYOUT.Z_INDEX,
  
  // Анимации
  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    slideIn: {
      from: { transform: 'translateX(-100%)' },
      to: { transform: 'translateX(0)' },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  },
} as const;

// Экспорт отдельных разделов для удобства
export const {
  animations,
  chartColors,
  statusCards,
  navigation,
  dataDisplay,
  utils,
  forms,
  components,
  breakpoints,
  zIndex,
  keyframes,
} = dashboardStyles;

// Экспорт по умолчанию
export default dashboardStyles;