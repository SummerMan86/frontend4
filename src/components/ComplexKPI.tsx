import React, { useMemo, useState } from 'react';
import {
  Card,
  Text,
  Group,
  ThemeIcon,
  Button,
  Progress,
  Box,
  useMantineTheme,
  Transition
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';

/**
 * Типы статусов для KPI компонента
 * - success: успешное выполнение (зеленый цвет)
 * - warning: предупреждение (желтый цвет)
 * - danger: критическое состояние (красный цвет)
 * - info: информационный статус (синий цвет)
 */
type KPIStatus = 'success' | 'warning' | 'danger' | 'info';

/**
 * Интерфейс для действия (кнопки) в KPI карточке
 */
interface KPIAction {
  /** Текст кнопки */
  label: string;
  /** Обработчик клика по кнопке */
  onClick: () => void;
}

/**
 * Интерфейс для обработчиков интерактивности
 */
interface KPIInteractionHandlers {
  /** Обработчик клика по карточке */
  onClick?: () => void;
  /** Обработчик наведения мыши */
  onHover?: () => void;
  /** Обработчик ухода мыши */
  onLeave?: () => void;
}

/**
 * Основной интерфейс для ComplexKPI компонента
 * Представляет собой расширенную KPI карточку с графиком, прогрессом и дополнительной информацией
 */
interface ComplexKPIProps {
  /** Уникальный идентификатор KPI */
  id: string;
  /** Заголовок KPI */
  title: string;
  /** Иконка компонента (React компонент) */
  icon: React.ComponentType<any>;
  /** Основное значение KPI */
  value: string | number;
  /** Целевое значение (опционально) */
  target?: string | number;
  /** Прогресс в процентах (0-100) */
  progress?: number;
  /** Тренд в процентах (положительный/отрицательный) */
  trend?: number;
  /** Статус KPI для цветовой индикации */
  status?: KPIStatus;
  /** Дополнительный подзаголовок */
  subtitle?: string;
  /** Действие (кнопка) в правом верхнем углу */
  action?: KPIAction;
  /** Данные для мини-графика */
  chartData?: number[];
  /** Единица измерения */
  unit?: string;
  /** Обработчики интерактивности */
  interactions?: KPIInteractionHandlers;
  /** Включить анимации (по умолчанию true) */
  animated?: boolean;
  /** Включить hover эффекты (по умолчанию true) */
  hoverable?: boolean;
}

/**
 * Интерфейс для пропсов компонента MiniChart
 */
interface MiniChartProps {
  /** Массив числовых данных для отображения на графике */
  data: number[];
  /** Цвет линии и градиента графика */
  color: string;
  /** Заголовок графика (для accessibility) */
  title: string;
  /** Единица измерения (опционально) */
  unit?: string;
}

/**
 * Компонент мини-графика для отображения трендов в KPI карточке
 * Использует ECharts для рендеринга линейного графика с градиентной заливкой
 */
const MiniChart: React.FC<MiniChartProps> = ({ data, color, title, unit = '' }) => {
  // Мемоизируем конфигурацию графика для оптимизации производительности
  const chartOption = useMemo(() => ({
    // Убираем отступы для компактного отображения
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    // Настройка оси X (скрытая)
    xAxis: {
      type: 'category' as const,
      show: false,
      data: data.map((_, index) => index)
    },
    // Настройка оси Y (скрытая)
    yAxis: {
      type: 'value' as const,
      show: false
    },
    // Конфигурация серии данных
    series: [
      {
        type: 'line' as const,
        data: data,
        smooth: true, // Сглаженная линия
        symbol: 'none', // Без точек на линии
        lineStyle: {
          color: color,
          width: 2
        },
        // Градиентная заливка под линией
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: color
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)' // Прозрачный внизу
              }
            ]
          }
        }
      }
    ]
  }), [data, color]);

  return (
    <Box 
      style={{ cursor: 'pointer' }}
      title={`${title} ${unit}`.trim()} // Tooltip для accessibility
    >
      <ReactECharts 
        option={chartOption} 
        style={{ height: '50px', width: '100%' }} 
        opts={{ renderer: 'svg' }} // SVG для лучшего качества
      />
    </Box>
  );
};

/**
 * Утилитарные функции для работы с цветами статусов
 */
const getStatusColor = (theme: any, status?: KPIStatus): string => {
  const colorMap = {
    success: theme.colors.green[6],
    warning: theme.colors.yellow[6],
    danger: theme.colors.red[6],
    info: theme.colors.blue[6]
  };
  
  return status ? colorMap[status] : theme.colors.gray[6];
};

/**
 * Получает цвет для графика на основе статуса
 * По умолчанию использует синий цвет для графиков
 */
const getChartColor = (theme: any, status?: KPIStatus): string => {
  const colorMap = {
    success: theme.colors.green[6],
    warning: theme.colors.yellow[6],
    danger: theme.colors.red[6],
    info: theme.colors.blue[6]
  };
  
  return status ? colorMap[status] : theme.colors.blue[6];
};

/**
 * Основной компонент ComplexKPI
 * 
 * Представляет собой расширенную KPI карточку с поддержкой:
 * - Иконки и заголовка
 * - Основного значения и целевого показателя
 * - Прогресс-бара с цветовой индикацией
 * - Тренда (положительный/отрицательный)
 * - Мини-графика для визуализации данных
 * - Действия (кнопки) для взаимодействия
 * 
 * @example
 * ```tsx
 * <ComplexKPI
 *   id="sales-kpi"
 *   title="Продажи"
 *   icon={IconShoppingCart}
 *   value="1,234,567 ₽"
 *   target="1,500,000 ₽"
 *   progress={82}
 *   trend={12.5}
 *   status="success"
 *   chartData={[100, 120, 110, 140, 160, 150, 180]}
 *   action={{
 *     label: "Подробнее",
 *     onClick: () => console.log("Открыть детали")
 *   }}
 * />
 * ```
 */
const ComplexKPI: React.FC<ComplexKPIProps> = ({
  id,
  title,
  icon: IconComponent,
  value,
  target,
  progress,
  trend,
  status,
  subtitle,
  action,
  chartData,
  unit,
  interactions,
  animated = true,
  hoverable = true
}) => {
  const theme = useMantineTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Мемоизируем цвета для оптимизации
  const statusColor = useMemo(() => getStatusColor(theme, status), [theme, status]);
  const chartColor = useMemo(() => getChartColor(theme, status), [theme, status]);
  
  // Обработчики интерактивности
  const handleMouseEnter = () => {
    if (hoverable) {
      setIsHovered(true);
      interactions?.onHover?.();
    }
  };
  
  const handleMouseLeave = () => {
    if (hoverable) {
      setIsHovered(false);
      setIsPressed(false);
      interactions?.onLeave?.();
    }
  };
  
  const handleMouseDown = () => {
    if (interactions?.onClick) {
      setIsPressed(true);
    }
  };
  
  const handleMouseUp = () => {
    setIsPressed(false);
  };
  
  const handleClick = () => {
    interactions?.onClick?.();
  };
  
  // Стили для интерактивности
  const cardStyles = useMemo(() => ({
    cursor: interactions?.onClick ? 'pointer' : 'default',
    transition: animated ? 'all 0.2s ease-in-out' : 'none',
    transform: isPressed ? 'scale(0.98)' : isHovered ? 'scale(1.02)' : 'scale(1)',
    boxShadow: isHovered 
      ? `0 8px 25px rgba(0, 0, 0, 0.15), 0 0 0 1px ${statusColor}20`
      : undefined
  }), [interactions?.onClick, animated, isPressed, isHovered, statusColor]);
  
  return (
    <Card 
      withBorder 
      data-testid={`complex-kpi-${id}`}
      style={cardStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      {/* Заголовок с иконкой и действием */}
      <Group justify="space-between" mb="xs">
        <Group gap={8}>
          {/* Иконка KPI */}
          <Transition
            mounted={true}
            transition="scale"
            duration={animated ? 200 : 0}
          >
            {(styles) => (
              <ThemeIcon 
                variant={isHovered ? "filled" : "light"} 
                size="lg" 
                radius="md"
                color={status ? statusColor : undefined}
                style={{
                  ...styles,
                  transform: `${styles.transform} ${isHovered ? 'rotate(5deg)' : 'rotate(0deg)'}`,
                  transition: animated ? 'all 0.2s ease-in-out' : 'none'
                }}
              >
                {React.createElement(IconComponent, { size: 20 })}
              </ThemeIcon>
            )}
          </Transition>
          
          {/* Заголовок KPI */}
          <Text fw={500} size="sm" title={title}>
            {title}
          </Text>
        </Group>
        
        {/* Кнопка действия (опционально) */}
        {action && (
          <Button 
            variant="subtle" 
            size="xs" 
            px="xs"
            onClick={action.onClick}
            data-testid={`kpi-action-${id}`}
          >
            {action.label}
          </Button>
        )}
      </Group>

      {/* Основное значение KPI */}
      <Text 
        size="xl" 
        fw={700} 
        mb="xs" 
        data-testid={`kpi-value-${id}`}
        style={{
          color: isHovered ? statusColor : undefined,
          transition: animated ? 'color 0.2s ease-in-out' : 'none'
        }}
      >
        {value}{unit && ` ${unit}`}
      </Text>

      {/* Целевое значение и прогресс */}
      {target && (
        <Group gap={8} mb="xs">
          <Text size="sm" c="dimmed">
            Цель: {target}{unit && ` ${unit}`}
          </Text>
          {progress !== undefined && (
            <Text size="sm" style={{ color: statusColor }}>
              {progress}%
            </Text>
          )}
        </Group>
      )}

      {/* Прогресс-бар */}
      {progress !== undefined && (
        <Progress
          value={Math.min(Math.max(progress, 0), 100)} // Ограничиваем значение 0-100
          color={statusColor}
          size={isHovered ? "md" : "sm"}
          mb="xs"
          data-testid={`kpi-progress-${id}`}
          style={{
            transition: animated ? 'all 0.2s ease-in-out' : 'none'
          }}
        />
      )}

      {/* Подзаголовок */}
      {subtitle && (
        <Text size="sm" c="dimmed" mb="xs">
          {subtitle}
        </Text>
      )}

      {/* Индикатор тренда */}
      {trend !== undefined && (
        <Group gap={4} mt="xs">
          {trend > 0 ? (
            <IconTrendingUp 
              size={16} 
              color={theme.colors.green[6]} 
              aria-label="Положительный тренд"
            />
          ) : (
            <IconTrendingDown 
              size={16} 
              color={theme.colors.red[6]} 
              aria-label="Отрицательный тренд"
            />
          )}
          <Text 
            size="sm" 
            c={trend > 0 ? 'green' : 'red'}
            data-testid={`kpi-trend-${id}`}
          >
            {Math.abs(trend)}%
          </Text>
        </Group>
      )}

      {/* Мини-график */}
      {chartData && chartData.length > 0 && (
        <Box 
          mt="xs"
          style={{
            opacity: isHovered ? 1 : 0.8,
            transition: animated ? 'opacity 0.2s ease-in-out' : 'none'
          }}
        >
          <MiniChart 
            data={chartData} 
            color={isHovered ? statusColor : chartColor} 
            title={title}
            unit={unit}
          />
        </Box>
      )}
    </Card>
  );
};

// Экспорты компонента и типов
export default ComplexKPI;
export type { ComplexKPIProps, KPIStatus, KPIAction, MiniChartProps, KPIInteractionHandlers };

/**
 * РУКОВОДСТВО ПО ИСПОЛЬЗОВАНИЮ ComplexKPI
 * 
 * ComplexKPI - это расширенный компонент для отображения ключевых показателей эффективности (KPI)
 * с поддержкой графиков, трендов, прогресса и интерактивных элементов.
 * 
 * ОСНОВНЫЕ ВОЗМОЖНОСТИ:
 * ✅ Отображение основного значения и целевого показателя
 * ✅ Визуальный индикатор прогресса с цветовой кодировкой
 * ✅ Индикатор тренда (рост/падение) с иконками
 * ✅ Мини-график для визуализации динамики
 * ✅ Настраиваемые иконки и действия
 * ✅ Поддержка различных статусов (success, warning, danger, info)
 * ✅ Accessibility и тестируемость
 * 
 * ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:
 * 
 * 1. Базовый KPI:
 * ```tsx
 * <ComplexKPI
 *   id="revenue"
 *   title="Выручка"
 *   icon={IconCurrencyRubel}
 *   value="2,450,000"
 *   unit="₽"
 *   status="success"
 * />
 * ```
 * 
 * 2. KPI с целью и прогрессом:
 * ```tsx
 * <ComplexKPI
 *   id="sales-target"
 *   title="Продажи"
 *   icon={IconShoppingCart}
 *   value="850"
 *   target="1000"
 *   progress={85}
 *   unit="шт"
 *   status="warning"
 *   subtitle="До конца месяца осталось 5 дней"
 * />
 * ```
 * 
 * 3. KPI с трендом и графиком:
 * ```tsx
 * <ComplexKPI
 *   id="conversion"
 *   title="Конверсия"
 *   icon={IconTrendingUp}
 *   value="12.5"
 *   unit="%"
 *   trend={2.3}
 *   status="success"
 *   chartData={[10.2, 11.1, 10.8, 12.0, 12.5, 11.9, 12.5]}
 *   action={{
 *     label: "Анализ",
 *     onClick: () => openAnalysis()
 *   }}
 * />
 * ```
 * 
 * 4. KPI с критическим статусом:
 * ```tsx
 * <ComplexKPI
 *   id="errors"
 *   title="Ошибки системы"
 *   icon={IconAlertTriangle}
 *   value="23"
 *   trend={-15.2}
 *   status="danger"
 *   subtitle="За последние 24 часа"
 *   action={{
 *     label: "Исправить",
 *     onClick: () => handleErrors()
 *   }}
 * />
 * ```
 * 
 * ПАРАМЕТРЫ:
 * 
 * @param id - Уникальный идентификатор (обязательный)
 * @param title - Заголовок KPI (обязательный)
 * @param icon - React компонент иконки (обязательный)
 * @param value - Основное значение (обязательный)
 * @param target - Целевое значение (опционально)
 * @param progress - Прогресс в % от 0 до 100 (опционально)
 * @param trend - Тренд в % (положительный/отрицательный) (опционально)
 * @param status - Статус: 'success' | 'warning' | 'danger' | 'info' (опционально)
 * @param subtitle - Дополнительная информация (опционально)
 * @param action - Объект с кнопкой действия (опционально)
 * @param chartData - Массив данных для графика (опционально)
 * @param unit - Единица измерения (опционально)
 * 
 * ЦВЕТОВАЯ СХЕМА:
 * 🟢 success - Зеленый (успешное выполнение)
 * 🟡 warning - Желтый (предупреждение)
 * 🔴 danger - Красный (критическое состояние)
 * 🔵 info - Синий (информационный)
 * ⚪ default - Серый (нейтральный)
 * 
 * РЕКОМЕНДАЦИИ:
 * 
 * 1. Используйте осмысленные id для тестирования
 * 2. Выбирайте подходящие иконки из @tabler/icons-react
 * 3. Ограничивайте длину заголовков (до 20 символов)
 * 4. Используйте единицы измерения для ясности
 * 5. Предоставляйте данные графика в хронологическом порядке
 * 6. Используйте статусы для быстрой визуальной оценки
 * 7. Добавляйте действия только для интерактивных KPI
 * 
 * ПРОИЗВОДИТЕЛЬНОСТЬ:
 * 
 * - Компонент оптимизирован с помощью useMemo
 * - Графики рендерятся в SVG для лучшего качества
 * - Цвета кэшируются для избежания пересчетов
 * - Поддерживается ленивая загрузка графиков
 * 
 * ТЕСТИРОВАНИЕ:
 * 
 * Компонент предоставляет data-testid атрибуты:
 * - `complex-kpi-${id}` - основной контейнер
 * - `kpi-value-${id}` - значение KPI
 * - `kpi-progress-${id}` - прогресс-бар
 * - `kpi-trend-${id}` - индикатор тренда
 * - `kpi-action-${id}` - кнопка действия
 */