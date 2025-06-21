import React, { useState, ReactNode } from 'react';
import {
  Stack,
  Grid,
  ActionIcon,
  Divider,
  Collapse,
  Card,
  Text
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { DefaultKPICard, DefaultKPICardData } from './DefaultKPICard';

// Базовый интерфейс для любого элемента в сетке
export interface ExpandableGridItem {
  id: string;
  [key: string]: any; // Позволяет любые дополнительные свойства
}

// Пропсы для кастомного компонента карточки
export interface CustomCardProps<T extends ExpandableGridItem> {
  data: T;
  isExpanded: boolean;
  onClick: () => void;
  animationDuration: number;
  animationTimingFunction: string;
}

// Основные пропсы компонента
export interface ExpandableKPIGridProps<T extends ExpandableGridItem = DefaultKPICardData> {
  /** Массив данных для карточек */
  data: T[];
  /** Функция для рендеринга детального контента */
  renderDetailContent: (itemId: string, item: T) => ReactNode;
  /** Кастомный компонент карточки (опционально) */
  CardComponent?: React.ComponentType<CustomCardProps<T>>;
  /** Количество колонок в сетке (по умолчанию 4) */
  columnsPerCard?: number;
  /** Длительность анимации в миллисекундах (по умолчанию 500) */
  animationDuration?: number;
  /** Функция анимации (по умолчанию 'ease-in-out') */
  animationTimingFunction?: string;
  /** Дополнительные стили для контейнера */
  containerStyle?: React.CSSProperties;
}

// Экспортируем старые интерфейсы для обратной совместимости
export interface KPICardData extends DefaultKPICardData {}
export interface LegacyExpandableKPIGridProps {
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
 * Универсальный компонент для отображения сетки карточек с раскрывающейся детализацией
 * 
 * Особенности:
 * - Поддержка любых типов карточек через generic типы
 * - Дефолтная KPI карточка или кастомная через пропс
 * - Плавная анимация раскрытия детализации
 * - Полностью настраиваемый контент детализации
 * - Обратная совместимость с существующим API
 */
export const ExpandableKPIGrid = <T extends ExpandableGridItem = DefaultKPICardData>({
  data,
  renderDetailContent,
  CardComponent,
  columnsPerCard = 4,
  animationDuration = 500,
  animationTimingFunction = 'ease-in-out',
  containerStyle
}: ExpandableKPIGridProps<T>) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleCardClick = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  // Функция для рендеринга карточки
  const renderCard = (item: T, isExpanded: boolean, onClick: () => void) => {
    if (CardComponent) {
      return (
        <CardComponent
          data={item}
          isExpanded={isExpanded}
          onClick={onClick}
          animationDuration={animationDuration}
          animationTimingFunction={animationTimingFunction}
        />
      );
    }
    
    // Проверяем, что данные совместимы с DefaultKPICardData
    const isDefaultKPIData = (data: any): data is DefaultKPICardData => {
      return data && 
        typeof data.title === 'string' &&
        typeof data.value === 'string' &&
        typeof data.trend === 'number' &&
        data.icon &&
        typeof data.color === 'string';
    };
    
    if (isDefaultKPIData(item)) {
      return (
        <DefaultKPICard
          data={item}
          isExpanded={isExpanded}
          onClick={onClick}
          animationDuration={animationDuration}
          animationTimingFunction={animationTimingFunction}
        />
      );
    }
    
    // Fallback для несовместимых данных
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text>Unsupported data format</Text>
      </Card>
    );
  };

  return (
    <Stack gap="md" style={containerStyle}>
      {/* Карточки в горизонтальной сетке */}
      <Grid>
        {data.map((item) => (
          <Grid.Col key={item.id} span={columnsPerCard}>
            {renderCard(
              item,
              expandedItem === item.id,
              () => handleCardClick(item.id)
            )}
          </Grid.Col>
        ))}
      </Grid>
      
      {/* Детализация */}
      <Collapse 
        in={!!expandedItem}
        transitionDuration={animationDuration}
        transitionTimingFunction={animationTimingFunction}
      >
        {expandedItem && (
          <div style={{ marginBottom: '32px' }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: '100%', position: 'relative', margin: '0 auto' }}>
              <Divider mb="md" />
              {renderDetailContent(expandedItem, data.find(item => item.id === expandedItem)!)}
              
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => setExpandedItem(null)}
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

// Функция-обертка для обратной совместимости
export const LegacyExpandableKPIGrid: React.FC<LegacyExpandableKPIGridProps> = ({
  kpiData,
  renderDetailContent,
  columnsPerCard,
  animationDuration,
  animationTimingFunction,
  containerStyle
}) => {
  return (
    <ExpandableKPIGrid
      data={kpiData}
      renderDetailContent={(itemId) => renderDetailContent(itemId)}
      columnsPerCard={columnsPerCard}
      animationDuration={animationDuration}
      animationTimingFunction={animationTimingFunction}
      containerStyle={containerStyle}
    />
  );
};

export default ExpandableKPIGrid;