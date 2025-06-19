import React from 'react';
import { Paper, Group, Text, Title, ThemeIcon } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

// Define props interface for Tabler Icons
interface IconProps {
  size?: string | number;
  color?: string;
  stroke?: string | number;
  style?: React.CSSProperties;
}

export interface KPICardProps {
  /** Заголовок KPI */
  title: string;
  /** Основное значение */
  value: string | number;
  /** Единица измерения */
  unit?: string;
  /** Изменение в процентах (положительное или отрицательное) */
  change?: number;
  /** Иконка (компонент из @tabler/icons-react) */
  icon: React.ComponentType<IconProps>;
  /** Основной цвет (используется для автоматического создания градиента) */
  color?: 'blue' | 'green' | 'red' | 'orange' | 'violet' | 'yellow' | 'pink' | 'cyan' | 'teal' | 'indigo';
  /** Кастомный градиент (переопределяет автоматический) */
  gradient?: string;
  /** Обработчик клика */
  onClick?: () => void;
  /** Дополнительные детали для расширенного отображения */
  details?: Record<string, any>;
  /** Размер карточки */
  size?: 'sm' | 'md' | 'lg';
  /** Отключить анимацию при наведении */
  disableHover?: boolean;
}

// Предустановленные градиенты для каждого цвета
const colorGradients = {
  blue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  green: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  red: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
  orange: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  violet: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  yellow: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
  pink: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
  cyan: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
  teal: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
  indigo: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
};

// Размеры для разных вариантов
const sizes = {
  sm: {
    padding: 'sm',
    iconSize: 32,
    titleSize: 'xs',
    valueSize: '1.4rem',
    unitSize: 'xs',
    changeSize: 'xs',
  },
  md: {
    padding: 'md',
    iconSize: 42,
    titleSize: 'xs',
    valueSize: '1.8rem',
    unitSize: 'sm',
    changeSize: 'sm',
  },
  lg: {
    padding: 'lg',
    iconSize: 52,
    titleSize: 'sm',
    valueSize: '2.2rem',
    unitSize: 'md',
    changeSize: 'md',
  },
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  change,
  icon: Icon,
  color = 'blue',
  gradient,
  onClick,
  details,
  size = 'md',
  disableHover = false,
}) => {
  const sizeConfig = sizes[size];
  const finalGradient = gradient || colorGradients[color];

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disableHover) {
      e.currentTarget.style.transform = 'translateY(-2px)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disableHover) {
      e.currentTarget.style.transform = 'translateY(0)';
    }
  };

  return (
    <Paper
      p={sizeConfig.padding}
      withBorder
      style={{
        background: finalGradient,
        color: 'white',
        transition: 'transform 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <Group justify="space-between" align="flex-start">
        <div style={{ flex: 1 }}>
          <Text 
            size={sizeConfig.titleSize} 
            fw={500} 
            style={{ opacity: 0.9 }}
            lineClamp={2}
          >
            {title}
          </Text>
          
          <Group gap="xs" align="baseline" mt="xs">
            <Title 
              order={2} 
              style={{ fontSize: sizeConfig.valueSize, lineHeight: 1.2 }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Title>
            {unit && (
              <Text size={sizeConfig.unitSize} fw={600}>
                {unit}
              </Text>
            )}
          </Group>

          {change !== undefined && (
            <Group gap="xs" mt="sm">
              {change > 0 ? (
                <IconTrendingUp size={14} />
              ) : (
                <IconTrendingDown size={14} />
              )}
              <Text size={sizeConfig.changeSize} fw={600}>
                {change > 0 ? '+' : ''}{change}%
              </Text>
            </Group>
          )}
        </div>
        
        <ThemeIcon
          size={sizeConfig.iconSize}
          radius="md"
          variant="light"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            flexShrink: 0,
          }}
        >
          <Icon 
            size={Math.round(sizeConfig.iconSize * 0.6)} 
            style={{ color: 'white' }} 
          />
        </ThemeIcon>
      </Group>
    </Paper>
  );
};

export default KPICard;