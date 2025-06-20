import React, { useState, ReactNode } from 'react';
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
  Collapse
} from '@mantine/core';
import { IconChevronRight, IconX } from '@tabler/icons-react';

// Интерфейс для данных KPI карточки
export interface KPICardData {
  id: string;
  title: string;
  value: string;
  target?: string;
  trend: number;
  icon: ReactNode;
  color: string;
}

// Интерфейс для пропсов компонента
export interface ExpandableKPIGridProps {
  /** Массив данных для KPI карточек */
  kpiData: KPICardData[];
  /** Функция для рендеринга детального контента */
  renderDetailContent: (cardId: string) => ReactNode;
  /** Количество колонок в сетке (по умолчанию 4) */
  columnsPerCard?: number;
  /** Длительность анимации в миллисекундах (по умолчанию 500) */
  animationDuration?: number;
  /** Функция анимации (по умолчанию 'ease-in-out') */
  animationTimingFunction?: string;
  /** Дополнительные стили для контейнера */
  containerStyle?: React.CSSProperties;
}

/**
 * Компонент для отображения сетки KPI карточек с раскрывающейся детализацией
 * 
 * Особенности:
 * - Горизонтальное расположение карточек в сетке
 * - Плавная анимация раскрытия детализации на всю ширину
 * - Кнопка закрытия в правом нижнем углу детализации
 * - Анимированная стрелка поворота
 * - Полностью настраиваемый контент детализации
 */
export const ExpandableKPIGrid: React.FC<ExpandableKPIGridProps> = ({
  kpiData,
  renderDetailContent,
  columnsPerCard = 4,
  animationDuration = 500,
  animationTimingFunction = 'ease-in-out',
  containerStyle
}) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCardClick = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const renderTrendIcon = (trend: number) => {
    const isPositive = trend > 0;
    // Импортируем иконки динамически для избежания проблем с зависимостями
    const TrendIcon = isPositive ? '↗' : '↘';
    return (
      <span style={{ 
        color: isPositive ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-red-6)',
        fontSize: '14px'
      }}>
        {TrendIcon}
      </span>
    );
  };

  return (
    <Stack gap="md" style={containerStyle}>
      {/* Карточки в горизонтальной сетке */}
      <Grid>
        {kpiData.map((kpi) => {
          const isPositive = kpi.trend > 0;
          return (
            <Grid.Col key={kpi.id} span={columnsPerCard}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <UnstyledButton 
                  onClick={() => handleCardClick(kpi.id)} 
                  style={{ width: '100%' }}
                >
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed" fw={500}>{kpi.title}</Text>
                    <Group gap="xs">
                      <ThemeIcon color={kpi.color} size="lg" radius="md">
                        {kpi.icon}
                      </ThemeIcon>
                      <ActionIcon variant="subtle" size="sm">
                        <IconChevronRight 
                          size={16} 
                          style={{ 
                            transform: expandedCard === kpi.id ? 'rotate(90deg)' : 'none', 
                            transition: `transform ${animationDuration}ms ${animationTimingFunction}` 
                          }}
                        />
                      </ActionIcon>
                    </Group>
                  </Group>
                  
                  <Text size="xl" fw={700} mb="xs">{kpi.value}</Text>
                  
                  {kpi.target && (
                    <Text size="xs" c="dimmed" mb="xs">
                      Цель: {kpi.target}
                    </Text>
                  )}
                  
                  <Group gap="xs">
                    {renderTrendIcon(kpi.trend)}
                    <Text size="xs" c={isPositive ? 'green' : 'red'}>
                      {isPositive ? '+' : ''}{kpi.trend}%
                    </Text>
                  </Group>
                </UnstyledButton>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
      
      {/* Детализация с увеличенным отступом снизу и ограниченной шириной */}
      <Collapse 
        in={!!expandedCard}
        transitionDuration={animationDuration}
        transitionTimingFunction={animationTimingFunction}
      >
        {expandedCard && (
          <div style={{ marginBottom: '32px' }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: '100%', position: 'relative', margin: '0 auto' }}>
              <Divider mb="md" />
              {renderDetailContent(expandedCard)}
              
              {/* Кнопка свернуть в правом нижнем углу */}
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => setExpandedCard(null)}
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  backgroundColor: 'var(--mantine-color-gray-1)',
                  border: '1px solid var(--mantine-color-gray-3)',
                  transition: 'all 0.2s ease'
                }}
                title="Свернуть"
              >
                <IconX size={14} />
              </ActionIcon>
            </Card>
          </div>
        )}
      </Collapse>
    </Stack>
  );
};

export default ExpandableKPIGrid;