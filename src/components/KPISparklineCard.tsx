import React from 'react';
import {
  Card,
  Group,
  Text,
  ThemeIcon,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';

export interface KPISparklineCardProps {
  /** Заголовок карточки */
  title: string;
  /** Основное значение */
  value: string | number;
  /** Процент изменения (положительный/отрицательный) */
  change?: number;
  /** Иконка для карточки */
  icon?: React.ReactNode;
  /** Данные для sparkline графика (массив чисел) */
  sparklineData?: number[];
  /** Единица измерения для форматирования значений */
  unit?: string;
  /** Цвет линии графика (по умолчанию зависит от change) */
  lineColor?: string;
  /** Высота sparkline графика */
  sparklineHeight?: number;
  /** Показывать ли область под графиком */
  showArea?: boolean;
  /** Обработчик клика по карточке */
  onClick?: () => void;
  /** Дополнительные стили для карточки */
  style?: React.CSSProperties;
  /** Размер карточки */
  size?: 'sm' | 'md' | 'lg';
  /** Отключить анимацию при наведении */
  disableHoverAnimation?: boolean;
  /** Кастомный текст для сравнения (по умолчанию "vs среднее") */
  comparisonText?: string;
  /** Заголовок для sparkline графика */
  sparklineTitle?: string;
  /** Даты для оси X (если не указаны, генерируются автоматически) */
  dates?: string[];
  /** Градиентный фон карточки */
  gradientBackground?: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'none' | 'auto';
  /** Цвет иконки (по умолчанию зависит от change) */
  iconColor?: string;
  /** Инвертировать логику цвета для отрицательной динамики (когда снижение - это хорошо) */
  invertNegativeLogic?: boolean;
}

// Генерация дат для последних 30 дней
const generateLast30Days = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    dates.push(`${day}.${month}`);
  }
  
  return dates;
};

// Форматирование значения с единицами измерения
const formatValueWithUnit = (value: number, unit: string): string => {
  switch (unit) {
    case '₽':
      return new Intl.NumberFormat('ru-RU').format(Math.round(value)) + ' ₽';
    case 'шт':
    case 'шт.':
      return Math.round(value) + ' шт';
    case 'заказы':
      return Math.round(value).toString();
    case '%':
      return Math.round(value * 100) / 100 + '%';
    default:
      return Math.round(value).toString();
  }
};

// Получение размеров в зависимости от size
const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return {
        padding: 'sm',
        titleSize: 'xs',
        valueSize: 'xl',
        changeSize: 'xs',
      };
    case 'lg':
      return {
        padding: 'xl',
        titleSize: 'sm',
        valueSize: '3xl',
        changeSize: 'md',
      };
    default: // md
      return {
        padding: 'lg',
        titleSize: 'xs',
        valueSize: '2xl',
        changeSize: 'sm',
      };
  }
};

export const KPISparklineCard: React.FC<KPISparklineCardProps> = ({
  title,
  value,
  change,
  icon,
  sparklineData,
  unit = '',
  lineColor,
  sparklineHeight = 40,
  showArea = true,
  onClick,
  style,
  size = 'md',
  disableHoverAnimation = false,
  comparisonText = 'vs среднее',
  sparklineTitle = 'Тренд за 30 дней',
  dates,
  gradientBackground = 'none',
  iconColor,
  invertNegativeLogic = false,
}) => {
  const theme = useMantineTheme();
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const sizeStyles = getSizeStyles(size);

  // Определяем эффективную позитивность с учетом инверсии логики
  const isEffectivelyPositive = invertNegativeLogic ? 
    (change !== undefined && change < 0) : 
    (change !== undefined && change > 0);
  const isEffectivelyNegative = invertNegativeLogic ? 
    (change !== undefined && change > 0) : 
    (change !== undefined && change < 0);

  // Используем переданные даты или генерируем автоматически
  const chartDates = dates || generateLast30Days();

  // Определяем цвет линии
  const getLineColor = () => {
    if (lineColor) return lineColor;
    if (isPositive) return theme.colors.green[6];
    if (isNegative) return theme.colors.red[6];
    return theme.colors.blue[6];
  };

  // Создаем градиентные стили для фона карточки
  const getGradientStyles = (): React.CSSProperties => {
    // Автоматический выбор цвета на основе динамики, если gradientBackground не задан
    let effectiveGradient = gradientBackground;
    if (!gradientBackground || gradientBackground === 'auto') {
      if (change !== undefined) {
        effectiveGradient = change >= 0 ? 'green' : 'red';
      } else {
        effectiveGradient = 'none';
      }
    }
    
    if (effectiveGradient === 'none') return {};
    
    const gradients: Record<string, string> = {
      green: 'linear-gradient(135deg, rgba(64, 192, 87, 0.1) 0%, rgba(64, 192, 87, 0.05) 50%, rgba(255, 255, 255, 0) 100%)',
      red: 'linear-gradient(135deg, rgba(250, 82, 82, 0.1) 0%, rgba(250, 82, 82, 0.05) 50%, rgba(255, 255, 255, 0) 100%)',
      yellow: 'linear-gradient(135deg, rgba(255, 212, 59, 0.1) 0%, rgba(255, 212, 59, 0.05) 50%, rgba(255, 255, 255, 0) 100%)',
      blue: 'linear-gradient(135deg, rgba(34, 139, 230, 0.1) 0%, rgba(34, 139, 230, 0.05) 50%, rgba(255, 255, 255, 0) 100%)',
      purple: 'linear-gradient(135deg, rgba(174, 62, 201, 0.1) 0%, rgba(174, 62, 201, 0.05) 50%, rgba(255, 255, 255, 0) 100%)',
    };
    
    return {
      background: gradients[effectiveGradient as string],
      borderColor: effectiveGradient === 'green' ? 'rgba(64, 192, 87, 0.2)' :
                   effectiveGradient === 'red' ? 'rgba(250, 82, 82, 0.2)' :
                   effectiveGradient === 'yellow' ? 'rgba(255, 212, 59, 0.2)' :
                   effectiveGradient === 'blue' ? 'rgba(34, 139, 230, 0.2)' :
                   effectiveGradient === 'purple' ? 'rgba(174, 62, 201, 0.2)' : undefined,
    };
  };

  // Создание настроек для sparkline графика
  const sparklineOption = sparklineData ? {
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    xAxis: {
      type: 'category',
      show: false,
      data: chartDates,
    },
    yAxis: {
      type: 'value',
      show: false,
      scale: true,
    },
    series: [
      {
        type: 'line',
        data: sparklineData,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
          color: getLineColor(),
        },
        ...(showArea && {
          areaStyle: {
            color: 'transparent'
          }
        })
      }
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params[0];
        const date = chartDates[point.dataIndex];
        const formattedValue = formatValueWithUnit(point.value, unit);
        return `<div style="padding: 4px 8px;">
                  <div style="font-weight: 600; margin-bottom: 4px;">${date}</div>
                  <div>${formattedValue}</div>
                </div>`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: theme.colors.gray[3],
      borderWidth: 1,
      textStyle: {
        color: theme.colors.gray[8],
        fontSize: 12
      }
    }
  } : null;

  const cardContent = (
    <Card 
      shadow="sm" 
      padding={sizeStyles.padding} 
      radius="md" 
      withBorder 
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: disableHoverAnimation ? 'none' : 'transform 0.2s ease, box-shadow 0.2s ease',
        ...getGradientStyles(),
        ...style
      }}
      className={!disableHoverAnimation ? 'hover-lift' : undefined}
    >
      <Stack gap="sm">
        {/* Заголовок с иконкой */}
        <Group gap="xs" align="center">
          {icon && (
            <ThemeIcon
              variant="light"
              size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
              color={iconColor || (isEffectivelyPositive ? 'green' : isEffectivelyNegative ? 'red' : 'blue')}
            >
              {icon}
            </ThemeIcon>
          )}
          <Text
            size={sizeStyles.titleSize}
            fw={400}
            c="gray.6"
            tt="uppercase"
            style={{ letterSpacing: '0.05em' }}
          >
            {title}
          </Text>
        </Group>

        {/* Значение и изменение */}
        <Group align="center" gap="xs" wrap="nowrap" style={{ alignItems: 'flex-start' }}>
          <Text
            size={sizeStyles.valueSize}
            fw={600}
            c="gray.9"
            style={{
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.015em',
              lineHeight: 1.2,
            }}
          >
            {value}
          </Text>

          {change !== undefined && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: size === 'sm' ? 32 : 38,
                lineHeight: 1,
              }}
            >
              <Group gap={3} align="center" style={{ minHeight: size === 'sm' ? 16 : 18 }}>
                <ThemeIcon
                  variant="light"
                  size={size === 'sm' ? 14 : 16}
                  color={isEffectivelyPositive ? 'green' : isEffectivelyNegative ? 'red' : 'gray'}
                  style={{ verticalAlign: 'middle', padding: 0 }}
                >
                  {isPositive ? 
                    <IconArrowUpRight size={size === 'sm' ? 8 : 10} /> : 
                    <IconArrowDownRight size={size === 'sm' ? 8 : 10} />
                  }
                </ThemeIcon>
                <Text
                  size={sizeStyles.changeSize}
                  fw={500}
                  c={isEffectivelyPositive ? 'green.6' : isEffectivelyNegative ? 'red.6' : 'gray.6'}
                  style={{
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                    verticalAlign: 'middle',
                  }}
                >
                  {Math.abs(change)}%
                </Text>
              </Group>
              <Text
                size={size === 'sm' ? 'xs' : 'sm'}
                c="gray.5"
                style={{
                  lineHeight: 1,
                  marginTop: 0,
                  transform: 'translateY(-2px)',
                  fontSize: size === 'sm' ? '10px' : '11px',
                }}
              >
                {comparisonText}
              </Text>
            </div>
          )}
        </Group>

        {/* Sparkline График */}
        {sparklineData && sparklineOption && (
          <div style={{ marginTop: '8px' }}>
            <Text size="xs" c="gray.5" mb={4}>
              {sparklineTitle}
            </Text>
            <ReactECharts 
              option={sparklineOption} 
              style={{ height: sparklineHeight, width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        )}
      </Stack>
    </Card>
  );

  return onClick ? (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      {cardContent}
    </div>
  ) : (
    cardContent
  );
};

export default KPISparklineCard;