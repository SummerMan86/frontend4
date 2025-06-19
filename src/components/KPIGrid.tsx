import React from 'react';
import { Grid, Paper, Text, Group, Button } from '@mantine/core';
import { IconRefresh, IconDownload } from '@tabler/icons-react';
import { KPICard, type KPICardProps } from './KPICard';

export interface KPIGridProps {
  /** Массив данных для KPI карточек */
  kpis: KPICardProps[];
  /** Заголовок секции */
  title?: string;
  /** Описание секции */
  description?: string;
  /** Показать кнопки управления (обновить, экспорт) */
  showControls?: boolean;
  /** Обработчик обновления данных */
  onRefresh?: () => void;
  /** Обработчик экспорта данных */
  onExport?: () => void;
  /** Количество колонок в сетке для разных размеров экрана */
  columns?: {
    base?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Размер карточек */
  cardSize?: 'sm' | 'md' | 'lg';
  /** Обернуть в Paper */
  withPaper?: boolean;
  /** Загрузка */
  loading?: boolean;
}

export const KPIGrid: React.FC<KPIGridProps> = ({
  kpis,
  title,
  description,
  showControls = false,
  onRefresh,
  onExport,
  columns = {
    base: 1,
    xs: 2,
    sm: 3,
    md: 4,
    lg: 6,
    xl: 6,
  },
  cardSize = 'md',
  withPaper = true,
  loading = false,
}) => {
  const gridContent = (
    <>
      {(title || description || showControls) && (
        <Group justify="space-between" mb="md">
          {(title || description) && (
            <div>
              {title && (
                <Text fw={600} size="lg">
                  {title}
                </Text>
              )}
              {description && (
                <Text size="sm" c="dimmed">
                  {description}
                </Text>
              )}
            </div>
          )}
          
          {showControls && (
            <Group>
              {onRefresh && (
                <Button 
                  leftSection={<IconRefresh size={16} />} 
                  variant="light" 
                  size="sm"
                  onClick={onRefresh}
                  loading={loading}
                >
                  Обновить
                </Button>
              )}
              {onExport && (
                <Button 
                  leftSection={<IconDownload size={16} />} 
                  variant="light" 
                  size="sm"
                  onClick={onExport}
                >
                  Экспорт
                </Button>
              )}
            </Group>
          )}
        </Group>
      )}

      <Grid>
        {kpis.map((kpi, index) => {
          // Вычисляем span для каждой карточки
          const span = {
            base: Math.floor(12 / (columns.base || 1)),
            xs: columns.xs ? Math.floor(12 / columns.xs) : undefined,
            sm: columns.sm ? Math.floor(12 / columns.sm) : undefined,
            md: columns.md ? Math.floor(12 / columns.md) : undefined,
            lg: columns.lg ? Math.floor(12 / columns.lg) : undefined,
            xl: columns.xl ? Math.floor(12 / columns.xl) : undefined,
          };

          return (
            <Grid.Col key={index} span={span}>
              <KPICard
                {...kpi}
                size={cardSize}
              />
            </Grid.Col>
          );
        })}
      </Grid>
    </>
  );

  if (withPaper) {
    return (
      <Paper p="md" withBorder>
        {gridContent}
      </Paper>
    );
  }

  return <div>{gridContent}</div>;
};

export default KPIGrid;