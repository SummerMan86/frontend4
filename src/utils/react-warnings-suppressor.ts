/**
 * Утилита для подавления известных предупреждений React 18 о inert атрибуте
 * 
 * Проблема: React 18 не поддерживает inert как boolean атрибут нативно.
 * Mantine 8 использует inert для управления интерактивностью компонентов,
 * что вызывает предупреждения в консоли.
 * 
 * Решение будет доступно в React 19, где inert станет нативно поддерживаемым
 * boolean атрибутом.
 */

// Сохраняем оригинальные методы консоли
const originalWarn = console.warn;
const originalError = console.error;

// Список предупреждений, которые нужно подавить
const SUPPRESSED_WARNINGS = [
  'Warning: Received `true` for a non-boolean attribute `inert`',
  'Warning: Received `false` for a non-boolean attribute `inert`',
  'Warning: React does not recognize the `inert` prop on a DOM element',
  'Received `false` for a non-boolean attribute `inert`',
  'Received `true` for a non-boolean attribute `inert`'
];

/**
 * Инициализирует подавление предупреждений о inert атрибуте
 * Вызывайте эту функцию в начале приложения (например, в main.tsx)
 */
export const suppressInertWarnings = () => {
  if (process.env.NODE_ENV === 'development') {
    const checkAndSuppressMessage = (message: any) => {
      return SUPPRESSED_WARNINGS.some(warning => 
        typeof message === 'string' && (
          message.includes(warning) ||
          message.includes('non-boolean attribute `inert`') ||
          message.includes('inert="false"') ||
          message.includes('inert="true"')
        )
      );
    };

    console.warn = (...args: any[]) => {
      const message = args[0];
      if (!checkAndSuppressMessage(message)) {
        originalWarn.apply(console, args);
      }
    };

    console.error = (...args: any[]) => {
      const message = args[0];
      if (!checkAndSuppressMessage(message)) {
        originalError.apply(console, args);
      }
    };
    
    console.info('🔇 React inert warnings suppressed (React 18 compatibility)');
  }
};

/**
 * Восстанавливает оригинальное поведение консоли
 */
export const restoreWarnings = () => {
  console.warn = originalWarn;
  console.error = originalError;
};

/**
 * Проверяет, поддерживает ли текущая версия React inert нативно
 */
export const isInertNativelySupported = (): boolean => {
  // React 19+ поддерживает inert нативно
  try {
    const reactVersion = require('react/package.json').version;
    const majorVersion = parseInt(reactVersion.split('.')[0], 10);
    return majorVersion >= 19;
  } catch {
    return false;
  }
};

/**
 * Информация о проблеме для разработчиков
 */
export const INERT_INFO = {
  problem: 'React 18 не поддерживает inert как boolean атрибут',
  solution: 'Обновление до React 19 или использование строковых значений',
  workaround: 'CSS правила в index.css обрабатывают inert корректно',
  moreInfo: 'https://github.com/facebook/react/issues/17157'
} as const;