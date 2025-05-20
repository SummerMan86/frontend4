/**
 * designSystem.ts
 * Полная централизованная дизайн-система с поддержкой всех токенов Chakra UI 3.19.0
 */

// === ЦВЕТА: ОПИСАТЕЛЬНЫЕ (RAW) ===
export const palette = {
  // Синие оттенки
  blue: {
    base: '#0078D4',          // Microsoft синий
    soft: '#4A9CF2',          // Более мягкий синий
    light: '#C2E1FF',         // Светлый синий для фонов
    ultraLight: '#EBF6FF',    // Очень светлый синий
    dark: '#0063B1',          // Темный синий для hover
  },
  
  // Нейтральные оттенки
  neutral: {
    50: '#F9F9F9',
    100: '#F2F2F2',
    200: '#E6E6E6',
    300: '#C9C9C9',
    400: '#ACACAC',
    500: '#8E8E8E',
    600: '#666666',
    700: '#444444',
    800: '#2D2D2D',
    900: '#1D1D1D',
  },
  
  // Семантические цвета
  success: '#35AA75',         // Зеленый - успех
  warning: '#F9A825',         // Оранжевый - предупреждение
  error: '#DC3D43',           // Красный - ошибка
  info: '#3B93DA',            // Информационный синий
  
  // Акцентные цвета
  accent1: '#6B69D6',         // Пурпурно-синий
  accent2: '#18A0A0',         // Бирюзовый
  accent3: '#E17052',         // Терракотовый
  
  // Базовые
  white: '#FFFFFF',           // Чистый белый
  black: '#000000',           // Чистый черный
  
  // Фоновые цвета
  grayBackground: {
    light: '#F5F5F5',         // Светлый фон
    medium: '#EFEFEF',        // Средний фон
    dark: '#E8E8E8',          // Более темный фон
  },
};

// === ЦВЕТА: СЕМАНТИЧЕСКИЕ ===
export const colors = {
  // Основные цвета действий
  primary: {
    50: palette.blue.ultraLight,
    100: palette.blue.light,
    500: palette.blue.soft,
    600: palette.blue.base,
    700: palette.blue.dark,
  },
  
  // Нейтральные цвета (для текста, фона, границ)
  neutral: palette.neutral,
  
  // Акцентные цвета
  accent: {
    primary: palette.accent1,
    secondary: palette.accent2,
    tertiary: palette.accent3,
  },
  
  // Статусные цвета
  status: {
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
  },
  
  // Цвета текста
  text: {
    primary: palette.neutral[900],
    secondary: palette.neutral[600],
    tertiary: palette.neutral[500],
    disabled: palette.neutral[400],
    inverse: palette.white,
  },
  
  // Фоны и поверхности
  background: {
    primary: palette.white,
    secondary: palette.neutral[50],
    tertiary: palette.neutral[100],
  },
  
  // Элементы интерфейса
  element: {
    border: palette.neutral[200],
    divider: palette.neutral[100],
  },
  
  // Состояния взаимодействия
  state: {
    hover: palette.neutral[100],
    selected: palette.blue.light,
    focus: 'rgba(0, 120, 212, 0.3)',
    pressed: palette.grayBackground.medium,
  },
};

// === ТИПОГРАФИКА ===
export const typography = {
  // Кросс-платформенный стек шрифтов
  fonts: {
    body: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'SFMono-Regular, Menlo, Consolas, "Liberation Mono", Monaco, "Courier New", monospace',
  },
  
  // Размеры шрифтов
  fontSizes: {
    xs: '0.75rem',    // 12px - Мелкий вспомогательный текст
    sm: '0.875rem',   // 14px - Текст второстепенной важности 
    md: '1rem',       // 16px - Основной текст
    lg: '1.125rem',   // 18px - Важный текст
    xl: '1.25rem',    // 20px - Подзаголовки
    '2xl': '1.5rem',  // 24px - Заголовки секций
    '3xl': '1.75rem', // 28px - Заголовки страниц
    '4xl': '2rem',    // 32px - Главные заголовки
    '5xl': '2.5rem',  // 40px - Очень большие заголовки
    '6xl': '3rem',    // 48px - Заголовки героев
    '7xl': '3.75rem', // 60px - Огромные заголовки
    '8xl': '4.5rem',  // 72px - Самые крупные заголовки
    '9xl': '6rem',    // 96px - Экстремально большие 
  },
  
  // Веса шрифтов
  fontWeights: {
    hairline: 100,    // Тончайший
    thin: 200,        // Тонкий
    light: 300,       // Легкий
    normal: 400,      // Обычный текст
    medium: 500,      // Средний вес
    semibold: 600,    // Полужирный
    bold: 700,        // Жирный
    extrabold: 800,   // Очень жирный
    black: 900,       // Самый жирный
  },
  
  // Высота строк
  lineHeights: {
    none: 1,          // Нет дополнительной высоты
    shorter: 1.1,     // Очень тесно
    tight: 1.2,
    short: 1.25,      // Для заголовков
    normal: 1.5,      // Для основного текста
    tall: 1.75,       // Для длинных параграфов
    taller: 2,        // Для очень разреженного текста
  },
  
  // Межбуквенные интервалы
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Текстовые стили
  textStyles: {
    h1: {
      fontSize: ['3xl', '4xl'],
      fontWeight: 'bold',
      lineHeight: 'shorter',
      letterSpacing: 'tight',
    },
    h2: {
      fontSize: ['2xl', '3xl'],
      fontWeight: 'semibold',
      lineHeight: 'short',
      letterSpacing: 'tight',
    },
    h3: {
      fontSize: ['xl', '2xl'],
      fontWeight: 'semibold',
      lineHeight: 'short',
    },
    h4: {
      fontSize: ['lg', 'xl'],
      fontWeight: 'semibold',
      lineHeight: 'short',
    },
    body: {
      fontSize: 'md',
      fontWeight: 'normal',
      lineHeight: 'normal',
    },
    bodySmall: {
      fontSize: 'sm',
      fontWeight: 'normal',
      lineHeight: 'normal',
    },
    caption: {
      fontSize: 'xs',
      lineHeight: 'normal',
    },
  },
  
  // Трансформации текста
  textTransforms: {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
    normal: 'none',
  },
  
  // Переносы текста
  textOverflows: {
    truncate: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    wrap: {
      whiteSpace: 'normal',
    },
    nowrap: {
      whiteSpace: 'nowrap',
    },
  },
};

// === РАЗМЕРЫ И ОТСТУПЫ ===
export const spacing = {
  // Система отступов
  space: {
    extraExtraSmall: '0.125rem',  // 2px - Минимальный отступ
    extraSmall: '0.25rem',        // 4px - Очень малый отступ
    small: '0.5rem',              // 8px - Малый отступ
    medium: '1rem',               // 16px - Стандартный отступ
    large: '1.5rem',              // 24px - Большой отступ
    extraLarge: '2rem',           // 32px - Очень большой отступ
    extraExtraLarge: '3rem',      // 48px - Максимальный отступ
    // Дополнительные значения для Chakra UI
    0: '0',
    px: '1px',
    1: '0.25rem',                 // 4px
    2: '0.5rem',                  // 8px
    3: '0.75rem',                 // 12px
    4: '1rem',                    // 16px
    5: '1.25rem',                 // 20px
    6: '1.5rem',                  // 24px
    7: '1.75rem',                 // 28px
    8: '2rem',                    // 32px
    9: '2.25rem',                 // 36px
    10: '2.5rem',                 // 40px
    12: '3rem',                   // 48px
    14: '3.5rem',                 // 56px
    16: '4rem',                   // 64px
    20: '5rem',                   // 80px
    24: '6rem',                   // 96px
    28: '7rem',                   // 112px
    32: '8rem',                   // 128px
    36: '9rem',                   // 144px
    40: '10rem',                  // 160px
    44: '11rem',                  // 176px
    48: '12rem',                  // 192px
    52: '13rem',                  // 208px
    56: '14rem',                  // 224px
    60: '15rem',                  // 240px
    64: '16rem',                  // 256px
    72: '18rem',                  // 288px
    80: '20rem',                  // 320px
    96: '24rem',                  // 384px
  },
  
  // Система для отрицательных отступов
  negativeSpace: {
    px: '-1px',
    1: '-0.25rem',
    2: '-0.5rem',
    3: '-0.75rem',
    4: '-1rem',
    5: '-1.25rem',
    6: '-1.5rem',
    8: '-2rem',
    10: '-2.5rem',
    12: '-3rem',
    16: '-4rem',
    20: '-5rem',
    24: '-6rem',
    32: '-8rem',
    40: '-10rem',
    48: '-12rem',
    56: '-14rem',
    64: '-16rem',
  },
  
  // Размеры элементов
  sizes: {
    // Размеры контейнеров
    container: {
      xs: '20rem',     // 320px
      sm: '30rem',     // 480px
      md: '48rem',     // 768px
      lg: '62rem',     // 992px
      xl: '80rem',     // 1280px
      '2xl': '90rem',  // 1440px
      'max': '120rem', // 1920px
    },
    // Размеры кнопок
    button: {
      xs: '1.25rem',   // 20px
      sm: '1.5rem',    // 24px
      md: '2rem',      // 32px
      lg: '2.5rem',    // 40px
      xl: '3rem',      // 48px
    },
    // Иконки
    icon: {
      xs: '0.75rem',   // 12px
      sm: '1rem',      // 16px
      md: '1.25rem',   // 20px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
      '2xl': '2.5rem', // 40px
    },
    // Аватары
    avatar: {
      xs: '1.5rem',    // 24px
      sm: '2rem',      // 32px
      md: '2.5rem',    // 40px
      lg: '3rem',      // 48px
      xl: '3.5rem',    // 56px
      '2xl': '4rem',   // 64px
    },
    // Стандартизированные размеры - для Chakra
    max: 'max-content',
    min: 'min-content',
    full: '100%',
    '3xs': '14rem',    // 224px
    '2xs': '16rem',    // 256px
    xs: '20rem',       // 320px
    sm: '24rem',       // 384px
    md: '28rem',       // 448px
    lg: '32rem',       // 512px
    xl: '36rem',       // 576px
    '2xl': '42rem',    // 672px
    '3xl': '48rem',    // 768px
    '4xl': '56rem',    // 896px
    '5xl': '64rem',    // 1024px
    '6xl': '72rem',    // 1152px
    '7xl': '80rem',    // 1280px
    '8xl': '90rem',    // 1440px
    '9xl': '100rem',   // 1600px
  },
  
  // Динамические значения для макета
  layout: {
    headerHeight: '3rem',                // Высота шапки
    sidebarCollapsedWidth: '4rem',       // Ширина свернутой боковой панели
    sidebarExpandedWidth: '16rem',       // Ширина развернутой боковой панели
    sidebarMobileWidth: '85%',           // Ширина мобильной боковой панели (% от экрана)
    contentMaxWidth: '80rem',            // Максимальная ширина контента
  }
};

// === ГРАНИЦЫ И СКРУГЛЕНИЯ ===
export const borders = {
  // Радиусы скруглений
  radii: {
    none: '0',
    extraSmall: '0.125rem',   // 2px - для минимальных скруглений
    small: '0.25rem',    // 4px - для мелких элементов
    medium: '0.5rem',     // 8px - для кнопок и полей
    large: '0.75rem',    // 12px - для карточек
    extraLarge: '1rem',       // 16px - для больших элементов (iOS-стиль)
    '2extraLarge': '1.5rem',  // 24px - для крупных контейнеров
    full: '9999px',   // Для круглых кнопок и бейджей
    // Дополнительно для Chakra
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    circle: '50%',
  },
  
  // Толщина границ
  borderWidths: {
    none: 0,
    thin: '1px',
    hair: '0.5px',
    medium: '2px',
    thick: '4px',
    heavy: '8px',
    // Числовые версии для Chakra
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
  
  // Стили границ
  borderStyles: {
    none: 'none',
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    double: 'double',
    groove: 'groove',
    ridge: 'ridge',
    inset: 'inset',
    outset: 'outset',
  },
  
  // Готовые комбинации для общих границ
  borders: {
    none: 'none',
    thin: '1px solid',
    normal: '2px solid',
    thick: '4px solid',
    highlight: '2px dashed',
    accent: '2px solid',
    divider: '1px solid',
    focus: '2px solid',
  },
};

// === ВИЗУАЛЬНЫЕ ЭФФЕКТЫ ===
export const effects = {
  // Система теней
  shadows: {
    none: 'none',
    extraSmall: '0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05)', // 0 1px 2px - Едва заметная тень
    small: '0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.12), 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.08)', // Тень с лучшей видимостью
    medium: '0 0.1875rem 0.375rem rgba(0, 0, 0, 0.15), 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)', // Стандартная тень
    large: '0 0.3125rem 0.75rem rgba(0, 0, 0, 0.15), 0 0.1875rem 0.375rem rgba(0, 0, 0, 0.1)', // Заметная тень
    extraLarge: '0 0.5rem 1rem rgba(0, 0, 0, 0.15), 0 0.375rem 0.5rem rgba(0, 0, 0, 0.1)', // Глубокая тень
    
    // Специальные тени
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',        // Внутренняя тень
    outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',          // Контурная тень (для фокуса)
    elevated: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',  // Приподнятая карточка
    
    // Дополнительно для Chakra
    xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    dark: '0 0 15px 2px rgba(0, 0, 0, 0.5)', // Для темного режима
  },
  
  // Система размытия (для Chakra UI 3)
  blurs: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
    '3xl': '64px',
  },
  
  // Система анимаций и переходов
  transitions: {
    property: {
      common: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      colors: 'background-color, border-color, color, fill, stroke',
      dimensions: 'width, height',
      position: 'left, right, top, bottom',
      background: 'background-color, background-image, background-position',
      transform: 'transform',
      all: 'all',
    },
    easing: {
      'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      'ease-out': 'cubic-bezier(0, 0, 0.2, 1)', 
      'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'ease-bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      'ease-elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    duration: {
      'ultra-fast': '50ms',
      faster: '100ms',
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '400ms',
      'ultra-slow': '500ms',
    },
    // Готовые комбинации
    default: 'all 0.2s ease',
    fast: 'all 0.1s ease',
    slow: 'all 0.3s ease',
  },
  
  // Полупрозрачность
  opacity: {
    0: '0',
    5: '0.05',
    10: '0.1',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    90: '0.9',
    95: '0.95',
    100: '1',
    // Именованные варианты для удобства
    invisible: '0',
    visible: '1',
    semiTransparent: '0.5',
    mostlyTransparent: '0.25',
    barelyVisible: '0.1',
    mostlyOpaque: '0.8',
  },
  
  // Трансформации
  transforms: {
    translateX: {
      small: 'translateX(4px)',
      medium: 'translateX(8px)',
      large: 'translateX(16px)',
    },
    translateY: {
      small: 'translateY(4px)',
      medium: 'translateY(8px)',
      large: 'translateY(16px)',
    },
    scale: {
      small: 'scale(1.02)',
      medium: 'scale(1.05)', 
      large: 'scale(1.1)',
    },
    rotate: {
      45: 'rotate(45deg)',
      90: 'rotate(90deg)',
      180: 'rotate(180deg)',
    },
  }
};

// === ТОЧКИ ИЗМЕНЕНИЯ АДАПТИВНОГО ДИЗАЙНА (BREAKPOINTS) ===
export const breakpoints = {
  sm: '30em',     // 480px
  md: '48em',     // 768px
  lg: '64em',     // 1024px
  xl: '80em',     // 1280px
  '2xl': '96em',  // 1536px
};

// === КОНСТАНТЫ ДЛЯ ИНТЕРФЕЙСА ===
export const userInterface = {
  // Z-индексы
  zIndex: {
    hide: -1,          // Спрятать элемент
    auto: 'auto',      // Авто (для корректного наложения)
    base: 0,           // Базовый уровень
    dropdown: 1000,    // Выпадающие меню
    sticky: 1100,      // Липкие элементы
    fixed: 1200,       // Фиксированные элементы
    overlay: 1300,     // Затемнение фона
    drawer: 1400,      // Боковая панель
    modal: 1500,       // Модальные окна
    popover: 1600,     // Всплывающие подсказки
    skipLink: 1700,    // Ссылки для пропуска навигации
    toast: 1800,       // Уведомления
    tooltip: 1900,     // Тултипы (самый верхний слой)
    // Значения для лейаута
    header: 100,       // Шапка
    sidebar: 90,       // Боковая панель
  },
  
  // Медиа-запросы (используем em для лучшей поддержки масштабирования)
  media: {
    mobile: '(max-width: 48em)', // 768px
    tablet: '(min-width: 48.0625em) and (max-width: 64em)', // 769px - 1024px
    desktop: '(min-width: 64.0625em)', // > 1024px
    largeDesktop: '(min-width: 90.0625em)', // > 1440px
    // Для удобства использования с Chakra
    sm: '(min-width: 30em)',
    md: '(min-width: 48em)',
    lg: '(min-width: 64em)',
    xl: '(min-width: 80em)',
    '2xl': '(min-width: 96em)',
  },
  
  // Анимации и переходы
  animations: {
    transitionDuration: 0.2, // в секундах
    defaultTiming: 'ease',
    // Доступные анимации
    keyframes: {
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 }
      },
      fadeOut: {
        from: { opacity: 1 },
        to: { opacity: 0 }
      },
      slideInTop: {
        from: { transform: 'translateY(-20px)', opacity: 0 },
        to: { transform: 'translateY(0)', opacity: 1 }
      },
      slideInRight: {
        from: { transform: 'translateX(20px)', opacity: 0 },
        to: { transform: 'translateX(0)', opacity: 1 }
      },
      pulse: {
        '0%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.05)' },
        '100%': { transform: 'scale(1)' }
      },
      spin: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' }
      }
    }
  },
  
  // Доступность и фокус
  a11y: {
    focusRingColor: 'rgba(66, 153, 225, 0.6)',
    focusRingWidth: '3px',
    outlineOffset: '2px',
    reducedMotion: {
      transform: 'none',
      animation: 'none',
      transition: 'none'
    }
  }
};

// Экспорт констант макета (замена layoutConstants.ts)
export const LAYOUT = {
  HEADER_HEIGHT: spacing.layout.headerHeight,
  SIDEBAR_COLLAPSED_WIDTH: spacing.layout.sidebarCollapsedWidth,
  SIDEBAR_EXPANDED_WIDTH: spacing.layout.sidebarExpandedWidth,
  SIDEBAR_MOBILE_WIDTH: spacing.layout.sidebarMobileWidth,
  CONTENT_MAX_WIDTH: spacing.layout.contentMaxWidth,
  Z_INDEX: {
    HEADER: userInterface.zIndex.header,
    SIDEBAR: userInterface.zIndex.sidebar,
    OVERLAY: userInterface.zIndex.overlay,
  },
  MEDIA: userInterface.media,
  TRANSITION_DURATION: userInterface.animations.transitionDuration,
};

// === ТОКЕНЫ CHAKRA UI ===
// Все токены для Chakra UI преобразованные из нашей системы дизайна
export const chakraTokens = {
  // Размеры
  sizes: {
    // Контейнеры
    container: spacing.sizes.container,
    
    // Кнопки
    button: {
      xs: spacing.sizes.button.xs,
      sm: spacing.sizes.button.sm,
      md: spacing.sizes.button.md,
      lg: spacing.sizes.button.lg,
      xl: spacing.sizes.button.xl,
    },
    
    // Иконки
    icon: {
      xs: spacing.sizes.icon.xs,
      sm: spacing.sizes.icon.sm,
      md: spacing.sizes.icon.md,
      lg: spacing.sizes.icon.lg,
      xl: spacing.sizes.icon.xl,
      '2xl': spacing.sizes.icon['2xl'],
    },
    
    // Аватары
    avatar: {
      xs: spacing.sizes.avatar.xs,
      sm: spacing.sizes.avatar.sm,
      md: spacing.sizes.avatar.md,
      lg: spacing.sizes.avatar.lg,
      xl: spacing.sizes.avatar.xl,
      '2xl': spacing.sizes.avatar['2xl'],
    },
    
    // Фиксированные размеры
    max: spacing.sizes.max,
    min: spacing.sizes.min,
    full: spacing.sizes.full,
    '3xs': spacing.sizes['3xs'],
    '2xs': spacing.sizes['2xs'],
    xs: spacing.sizes.xs,
    sm: spacing.sizes.sm,
    md: spacing.sizes.md,
    lg: spacing.sizes.lg,
    xl: spacing.sizes.xl,
    '2xl': spacing.sizes['2xl'],
    '3xl': spacing.sizes['3xl'],
    '4xl': spacing.sizes['4xl'],
    '5xl': spacing.sizes['5xl'],
    '6xl': spacing.sizes['6xl'],
    '7xl': spacing.sizes['7xl'],
    '8xl': spacing.sizes['8xl'],
    '9xl': spacing.sizes['9xl'],
    
    // Макетные размеры
    header: spacing.layout.headerHeight,
    sidebar: {
      collapsed: spacing.layout.sidebarCollapsedWidth,
      expanded: spacing.layout.sidebarExpandedWidth,
      mobile: spacing.layout.sidebarMobileWidth,
    },
    content: spacing.layout.contentMaxWidth,
  },
  
  // Пространства (отступы)
  space: {
    // Именованные отступы
    xxs: spacing.space.extraExtraSmall,
    xs: spacing.space.extraSmall,
    sm: spacing.space.small,
    md: spacing.space.medium,
    lg: spacing.space.large,
    xl: spacing.space.extraLarge,
    xxl: spacing.space.extraExtraLarge,
    
    // Числовые отступы для Chakra
    ...spacing.space,
    
    // Отрицательные отступы
    ...spacing.negativeSpace,
  },
  
  // Радиусы скруглений
  radii: {
    // Именованные радиусы
    none: borders.radii.none,
    xs: borders.radii.extraSmall,
    sm: borders.radii.small,
    md: borders.radii.medium,
    lg: borders.radii.large,
    xl: borders.radii.extraLarge,
    '2xl': borders.radii['2extraLarge'],
    full: borders.radii.full,
    
    // Дополнительные для Chakra
    base: borders.radii.base,
    '3xl': borders.radii['3xl'],
    circle: borders.radii.circle,
  },
  
  // Толщины границ
  borderWidths: borders.borderWidths,
  
  // Стили границ
  borderStyles: borders.borderStyles,
  
  // Готовые границы
  borders: borders.borders,
  
  // Тени
  shadows: {
    // Наша семантическая система
    none: effects.shadows.none,
    xs: effects.shadows.extraSmall,
    sm: effects.shadows.small,
    md: effects.shadows.medium,
    lg: effects.shadows.large,
    xl: effects.shadows.extraLarge,
    
    // Стандартные для Chakra
    base: effects.shadows.base,
    '2xl': effects.shadows['2xl'],
    
    // Специальные тени
    inner: effects.shadows.inner,
    outline: effects.shadows.outline,
    dark: effects.shadows.dark,
  },
  
  // Размытия
  blurs: effects.blurs,
  
  // Z-индексы
  zIndices: {
    hide: userInterface.zIndex.hide,
    auto: userInterface.zIndex.auto,
    base: userInterface.zIndex.base,
    docked: userInterface.zIndex.sticky,
    dropdown: userInterface.zIndex.dropdown,
    sticky: userInterface.zIndex.sticky,
    banner: userInterface.zIndex.fixed,
    overlay: userInterface.zIndex.overlay,
    modal: userInterface.zIndex.modal,
    popover: userInterface.zIndex.popover,
    skipLink: userInterface.zIndex.skipLink,
    toast: userInterface.zIndex.toast,
    tooltip: userInterface.zIndex.tooltip,
  },
  
  // Точки изменения адаптивного дизайна
  breakpoints,
  
  // Непрозрачность
  opacity: effects.opacity,
  
  // Переходы
  transition: {
    property: effects.transitions.property,
    easing: effects.transitions.easing,
    duration: effects.transitions.duration,
  },
  
  // Типографика
  textStyles: typography.textStyles,
  
  // Для темы/светлый-темный режим
  config: {
    cssVarPrefix: 'sales-dashboard',
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
};

// Хелперы для стилей
export const styleUtils = {
  // Стили для навигационных элементов
  navigationItem: (isActive: boolean, isChildItem = false) => ({
    display: "flex",
    alignItems: "center", 
    paddingLeft: spacing.space.medium,
    paddingRight: spacing.space.medium,
    paddingTop: isChildItem ? spacing.space.small : spacing.space.medium,
    paddingBottom: isChildItem ? spacing.space.small : spacing.space.medium,
    borderRadius: borders.radii.medium,
    color: isActive ? colors.primary[600] : colors.text.primary,
    background: isActive ? colors.state.selected : 'transparent',
    _hover: {
      background: !isActive ? colors.state.hover : colors.state.selected,
      textDecoration: 'none',
    },
    _focus: {
      boxShadow: `0 0 0 2px ${colors.state.focus}`,
      outline: 'none',
    },
    fontSize: isChildItem ? typography.fontSizes.sm : typography.fontSizes.md,
    transition: effects.transitions.default,
  }),
  
  // Стили для кнопок
  button: (variant = 'default', size = 'md') => {
    const variants = {
      default: {
        bg: colors.primary[600],
        color: colors.text.inverse,
        _hover: { bg: colors.primary[700] },
        _active: { bg: colors.primary[600] },
      },
      outline: {
        bg: 'transparent',
        borderWidth: '1px',
        borderColor: colors.primary[600],
        color: colors.primary[600],
        _hover: { bg: colors.state.hover },
      },
      ghost: {
        bg: 'transparent',
        color: colors.text.primary,
        _hover: { bg: colors.state.hover },
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
    };
    
    const sizes = {
      sm: {
        fontSize: typography.fontSizes.xs,
        padding: `${spacing.space[1]} ${spacing.space[3]}`,
        height: spacing.sizes.button.sm,
      },
      md: {
        fontSize: typography.fontSizes.sm,
        padding: `${spacing.space[2]} ${spacing.space[4]}`,
        height: spacing.sizes.button.md,
      },
      lg: {
        fontSize: typography.fontSizes.md,
        padding: `${spacing.space[3]} ${spacing.space[6]}`,
        height: spacing.sizes.button.lg,
      },
    };
    
    return {
      borderRadius: borders.radii.medium,
      fontWeight: typography.fontWeights.medium,
      transition: effects.transitions.default,
      _focus: {
        boxShadow: `0 0 0 2px ${colors.state.focus}`,
        outline: 'none',
      },
      ...(variants[variant as keyof typeof variants] || variants.default),
      ...(sizes[size as keyof typeof sizes] || sizes.md),
    };
  },
  
  // Стили для карточек
  card: (variant = 'default') => {
    const variants = {
      default: {
        bg: colors.background.primary,
        borderRadius: borders.radii.large,
        boxShadow: effects.shadows.small,
        overflow: 'hidden',
      },
      outline: {
        bg: colors.background.primary,
        borderRadius: borders.radii.large,
        borderWidth: '1px',
        borderColor: colors.element.border,
      },
      flat: {
        bg: colors.background.secondary,
        borderRadius: borders.radii.medium,
        border: 'none',
      },
      elevated: {
        bg: colors.background.primary,
        borderRadius: borders.radii.large,
        boxShadow: effects.shadows.large,
        overflow: 'hidden',
      },
    };
    
    return variants[variant as keyof typeof variants] || variants.default;
  },

  // Анимации
  animations: {
    fadeIn: (duration = 0.3) => ({
      css: {
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        animation: `fadeIn ${duration}s ease`
      }
    }),
    slideIn: (direction = 'right', duration = 0.3) => {
      const directions = {
        top: {
          from: { transform: 'translateY(-20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 }
        },
        right: {
          from: { transform: 'translateX(20px)', opacity: 0 },
          to: { transform: 'translateX(0)', opacity: 1 }
        },
        bottom: {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 }
        },
        left: {
          from: { transform: 'translateX(-20px)', opacity: 0 },
          to: { transform: 'translateX(0)', opacity: 1 }
        }
      };
      
      const dir = directions[direction as keyof typeof directions] || directions.right;
      
      return {
        css: {
          '@keyframes slideIn': {
            from: { ...dir.from },
            to: { ...dir.to }
          },
          animation: `slideIn ${duration}s ease`
        }
      };
    },
    pulse: (duration = 1.5) => ({
      css: {
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        },
        animation: `pulse ${duration}s infinite ease-in-out`
      }
    }),
    spin: (duration = 1) => ({
      css: {
        '@keyframes spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        animation: `spin ${duration}s linear infinite`
      }
    })
  }
};

export const STATUS_COLORS = {
  active: 'green',
  pending: 'yellow',
  inactive: 'gray',
};

// Экспорт всей дизайн-системы как единого объекта
const designSystem = {
  palette,
  colors,
  typography,
  spacing,
  borders,
  effects,  
  userInterface,
  LAYOUT,
  styleUtils,
  breakpoints,
  chakraTokens
};

export default designSystem;