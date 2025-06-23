import React, { useState, useCallback, useMemo, memo, ReactNode } from 'react';
import {
  Stack,
  Grid,
  Card,
  UnstyledButton,
  Group,
  Text,
  ThemeIcon,
  ActionIcon,
  Divider,
  Collapse,
  Box,
  useMantineTheme
} from '@mantine/core';
import { 
  IconChevronRight, 
  IconX, 
  IconTrendingUp, 
  IconTrendingDown 
} from '@tabler/icons-react';
import '../styles/gradientAnimations.css';

// Интерфейс для данных KPI карточки
export interface KPICardData {
  id: string;
  title: string;
  value: string;
  target?: string;
  trend: number;
  icon: ReactNode;
  color: string;
  /** Кастомный градиент */
  gradient?: string;
  /** Направление градиента */
  gradientDirection?: 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl' | 'to-t' | 'to-tr';
  /** Анимированный градиент */
  animated?: boolean;
  /** Тематический градиент */
  theme?: 'ocean' | 'sunset' | 'forest' | 'cosmic' | 'warm' | 'cool';
}

// Интерфейс для пропсов компонента
export interface ExpandableKPIGridProps {
  /** Массив данных для KPI карточек */
  kpiData: KPICardData[];
  /** Функция для рендеринга детального контента */
  renderDetailContent: (cardId: string) => ReactNode;
  /** Количество карточек в ряду (по умолчанию 4) */
  cardsPerRow?: number;
  /** Длительность анимации в мс (по умолчанию 300) */
  animationDuration?: number;
  /** Дополнительные стили для контейнера */
  containerStyle?: React.CSSProperties;
  /** Глобальные настройки градиентов для всех карточек */
  globalGradientSettings?: {
    animated?: boolean;
    theme?: 'ocean' | 'sunset' | 'forest' | 'cosmic' | 'warm' | 'cool';
    gradientDirection?: 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl' | 'to-t' | 'to-tr';
  };
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

// Направления градиентов
const gradientDirections = {
  'to-r': 'to right',
  'to-br': 'to bottom right', 
  'to-b': 'to bottom',
  'to-bl': 'to bottom left',
  'to-l': 'to left',
  'to-tl': 'to top left',
  'to-t': 'to top',
  'to-tr': 'to top right'
};

// Тематические градиенты
const themeGradients = {
  ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  sunset: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  forest: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
  cosmic: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
  warm: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
  cool: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
};

// Компонент отдельной KPI карточки
const KPICard = memo<{
  kpi: KPICardData;
  isExpanded: boolean;
  onClick: () => void;
  animationDuration: number;
  globalGradientSettings?: {
    animated?: boolean;
    theme?: 'ocean' | 'sunset' | 'forest' | 'cosmic' | 'warm' | 'cool';
    gradientDirection?: 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl' | 'to-t' | 'to-tr';
  };
}>(({ kpi, isExpanded, onClick, animationDuration, globalGradientSettings }) => {
  const theme = useMantineTheme();
  const isPositiveTrend = kpi.trend > 0;
  
  const TrendIcon = isPositiveTrend ? IconTrendingUp : IconTrendingDown;
  const trendColor = isPositiveTrend ? theme.colors.green[6] : theme.colors.red[6];
  
  // Определяем финальный градиент с учетом приоритетов
  const finalGradient = useMemo(() => {
    // Приоритет: кастомный градиент > тематический > глобальный тематический > цветовой
    if (kpi.gradient) return kpi.gradient;
    if (kpi.theme) return themeGradients[kpi.theme];
    if (globalGradientSettings?.theme) return themeGradients[globalGradientSettings.theme];
    return colorGradients[kpi.color as keyof typeof colorGradients] || colorGradients.blue;
  }, [kpi.gradient, kpi.theme, kpi.color, globalGradientSettings?.theme]);
  
  // Определяем направление градиента
  const gradientDirection = kpi.gradientDirection || globalGradientSettings?.gradientDirection || 'to-br';
  
  // Определяем анимацию
  const isAnimated = kpi.animated ?? globalGradientSettings?.animated ?? false;
  
  // Создаем финальный стиль градиента
  const gradientStyle = useMemo(() => {
    const direction = gradientDirections[gradientDirection];
    return finalGradient.replace(/linear-gradient\([^,]+,/, `linear-gradient(${direction},`);
  }, [finalGradient, gradientDirection]);
  
  // Определяем CSS классы
  const cardClasses = useMemo(() => {
    const classes = [];
    if (isAnimated) classes.push('gradient-shift');
    if (kpi.theme) classes.push(`gradient-theme-${kpi.theme}`);
    else if (globalGradientSettings?.theme) classes.push(`gradient-theme-${globalGradientSettings.theme}`);
    return classes.join(' ');
  }, [isAnimated, kpi.theme, globalGradientSettings?.theme]);

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      className={cardClasses}
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: gradientStyle,
        color: 'white',
        border: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = theme.shadows.md;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <UnstyledButton 
        onClick={onClick}
        aria-expanded={isExpanded}
        aria-label={`${kpi.title}: ${kpi.value}. Нажмите для просмотра деталей`}
        style={{ width: '100%' }}
      >
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500} style={{ color: 'white', opacity: 0.9 }}>{kpi.title}</Text>
          <Group gap="xs">
            <ThemeIcon 
              size={42}
              radius="md"
              variant="light"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              {React.cloneElement(kpi.icon as React.ReactElement, { size: 24, style: { color: 'white' } })}
            </ThemeIcon>
            <IconChevronRight 
              size={16} 
              style={{ 
                transform: isExpanded ? 'rotate(90deg)' : 'none', 
                transition: `transform ${animationDuration}ms ease-in-out`,
                color: 'white'
              }}
            />
          </Group>
        </Group>
        
        <Group gap="xs" align="baseline" mt="xs">
          <Text size="xl" fw={700} style={{ color: 'white' }}>{kpi.value}</Text>
          {kpi.target && (
            <Text size="sm" fw={600} style={{ color: 'white' }}>
              / {kpi.target}
            </Text>
          )}
        </Group>
        
        <Group gap={4} mt="sm">
          <TrendIcon size={16} color="white" />
          <Text 
            size="xs" 
            style={{
              color: 'white',
              backgroundColor: isPositiveTrend ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}
          >
            {isPositiveTrend ? '+' : ''}{kpi.trend}%
          </Text>
        </Group>
      </UnstyledButton>
    </Card>
  );
});

KPICard.displayName = 'KPICard';

/**
 * Компонент для отображения сетки KPI карточек с раскрывающейся детализацией
 */
export const ExpandableKPIGrid: React.FC<ExpandableKPIGridProps> = ({
  kpiData,
  renderDetailContent,
  cardsPerRow = 4,
  animationDuration = 300,
  containerStyle,
  globalGradientSettings
}) => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const theme = useMantineTheme();

  // Правильный расчет span для Grid
  const gridSpan = useMemo(() => {
    const validCardsPerRow = [1, 2, 3, 4, 6].includes(cardsPerRow) ? cardsPerRow : 4;
    return 12 / validCardsPerRow;
  }, [cardsPerRow]);

  const handleCardClick = useCallback((cardId: string) => {
    setExpandedCardId(prev => prev === cardId ? null : cardId);
  }, []);

  const handleClose = useCallback(() => {
    setExpandedCardId(null);
  }, []);

  // Мемоизируем контент детализации
  const detailContent = useMemo(() => {
    if (!expandedCardId) return null;
    return renderDetailContent(expandedCardId);
  }, [expandedCardId, renderDetailContent]);

  return (
    <Stack gap="md" style={containerStyle}>
      {/* Сетка карточек */}
      <Grid>
        {kpiData.map((kpi) => (
          <Grid.Col key={kpi.id} span={gridSpan}>
            <KPICard
              kpi={kpi}
              isExpanded={expandedCardId === kpi.id}
              onClick={() => handleCardClick(kpi.id)}
              animationDuration={animationDuration}
              globalGradientSettings={globalGradientSettings}
            />
          </Grid.Col>
        ))}
      </Grid>
      
      {/* Детализация */}
      <Collapse 
        in={!!expandedCardId}
        transitionDuration={animationDuration}
        transitionTimingFunction="ease-in-out"
      >
        <Box mb="xl">
          <Card 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            withBorder 
            style={{ position: 'relative' }}
          >
            <Divider mb="md" />
            
            {detailContent}
            
            {/* Кнопка закрытия */}
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={handleClose}
              aria-label="Закрыть детализацию"
              style={{
                position: 'absolute',
                bottom: theme.spacing.md,
                right: theme.spacing.md,
                backgroundColor: theme.colors.gray[1],
                border: `1px solid ${theme.colors.gray[3]}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.gray[2];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.gray[1];
              }}
            >
              <IconX size={14} />
            </ActionIcon>
          </Card>
        </Box>
      </Collapse>
    </Stack>
  );
 };

// Интерфейс для обратной совместимости
export interface LegacyExpandableKPIGridProps {
  /** Массив данных для KPI карточек */
  kpiData: KPICardData[];
  /** Функция для рендеринга детального контента */
  renderDetailContent: (cardId: string) => ReactNode;
  /** Количество карточек в ряду (по умолчанию 4) */
  columnsPerCard?: number;
  /** Длительность анимации в мс (по умолчанию 300) */
  animationDuration?: number;
  /** Дополнительные стили для контейнера */
  containerStyle?: React.CSSProperties;
  /** Глобальные настройки градиентов для всех карточек */
  globalGradientSettings?: {
    animated?: boolean;
    theme?: 'ocean' | 'sunset' | 'forest' | 'cosmic' | 'warm' | 'cool';
    gradientDirection?: 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl' | 'to-t' | 'to-tr';
  };
}

// Компонент для обратной совместимости
export const LegacyExpandableKPIGrid: React.FC<LegacyExpandableKPIGridProps> = ({
  kpiData,
  renderDetailContent,
  columnsPerCard,
  animationDuration,
  containerStyle,
  globalGradientSettings
}) => {
  return (
    <ExpandableKPIGrid
      kpiData={kpiData}
      renderDetailContent={renderDetailContent}
      cardsPerRow={columnsPerCard}
      animationDuration={animationDuration}
      containerStyle={containerStyle}
      globalGradientSettings={globalGradientSettings}
    />
  );
};

// Экспорт по умолчанию
 export default ExpandableKPIGrid;