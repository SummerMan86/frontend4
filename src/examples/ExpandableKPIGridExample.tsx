import React from 'react';
import { IconTrendingUp, IconTrendingDown, IconTarget, IconClock, IconChevronRight } from '@tabler/icons-react';
import ExpandableKPIGrid, { CustomCardProps } from '../components/ExpandableKPIGrid';
import KPICard from '../components/KPICard';
import { Text, Stack, Group, Progress, Badge, Card, UnstyledButton } from '@mantine/core';

// Интерфейс для данных KPICard
interface KPICardData {
  id: string;
  title: string;
  value: string;
  unit?: string;
  change: number;
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'red' | 'orange' | 'violet' | 'yellow' | 'pink' | 'cyan' | 'teal' | 'indigo';
  gradient?: string;
  details?: Record<string, any>;
}

// Адаптер для KPICard, чтобы он работал с ExpandableKPIGrid
const KPICardAdapter: React.FC<CustomCardProps<KPICardData>> = ({
  data,
  isExpanded,
  onClick,
  animationDuration = 300,
  animationTimingFunction = 'ease'
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <UnstyledButton onClick={onClick} style={{ width: '100%' }}>
        <Group justify="space-between" mb="xs">
          <KPICard
            title={data.title}
            value={data.value}
            unit={data.unit}
            change={data.change}
            icon={data.icon}
            color={data.color}
            gradient={data.gradient}
            details={data.details}
            size="sm"
          />
          <IconChevronRight 
            size={16} 
            style={{ 
              transform: isExpanded ? 'rotate(90deg)' : 'none', 
              transition: `transform ${animationDuration}ms ${animationTimingFunction}`,
              color: 'var(--mantine-color-gray-6)'
            }}
          />
        </Group>
      </UnstyledButton>
    </Card>
  );
};

// Пример данных для KPICard
const kpiCardData: KPICardData[] = [
  {
    id: 'revenue',
    title: 'Выручка',
    value: '2.5M',
    unit: '₽',
    change: 12.5,
    icon: IconTrendingUp,
    color: 'blue',
    gradient: 'linear-gradient(45deg, #4c6ef5, #228be6)',
    details: { period: 'За последний месяц' }
  },
  {
    id: 'orders',
    title: 'Заказы',
    value: '1,234',
    change: -5.2,
    icon: IconTarget,
    color: 'green',
    gradient: 'linear-gradient(45deg, #51cf66, #40c057)'
  },
  {
    id: 'delivery-time',
    title: 'Время доставки',
    value: '2.3',
    unit: 'дня',
    change: 8.1,
    icon: IconClock,
    color: 'orange',
    gradient: 'linear-gradient(45deg, #ff8c42, #fd7e14)'
  },
  {
    id: 'satisfaction',
    title: 'Удовлетворенность',
    value: '94.2',
    unit: '%',
    change: 2.1,
    icon: IconTrendingUp,
    color: 'teal',
    gradient: 'linear-gradient(45deg, #20c997, #12b886)'
  }
];

// Компонент для рендеринга детализации
const renderDetailContent = (itemId: string, data: KPICardData) => {
  switch (itemId) {
    case 'revenue':
      return (
        <Stack gap="md">
          <Text size="lg" fw={600}>Детализация выручки</Text>
          <Group justify="space-between">
            <Text>Продажи товаров:</Text>
            <Text fw={500}>1.8M ₽</Text>
          </Group>
          <Group justify="space-between">
            <Text>Услуги:</Text>
            <Text fw={500}>0.7M ₽</Text>
          </Group>
          <div>
            <Text size="sm" mb="xs">72% от цели</Text>
            <Progress value={72} size="lg" />
          </div>
        </Stack>
      );
    
    case 'orders':
      return (
        <Stack gap="md">
          <Text size="lg" fw={600}>Анализ заказов</Text>
          <Group justify="space-between">
            <Text>Новые заказы:</Text>
            <Badge color="green">+156</Badge>
          </Group>
          <Group justify="space-between">
            <Text>В обработке:</Text>
            <Badge color="yellow">89</Badge>
          </Group>
          <Group justify="space-between">
            <Text>Выполнено:</Text>
            <Badge color="blue">989</Badge>
          </Group>
        </Stack>
      );
    
    case 'delivery-time':
      return (
        <Stack gap="md">
          <Text size="lg" fw={600}>Статистика доставки</Text>
          <Text>Среднее время доставки улучшилось на 8.1% по сравнению с прошлым месяцем.</Text>
          <Group justify="space-between">
            <Text>Экспресс доставка:</Text>
            <Text fw={500}>1.2 дня</Text>
          </Group>
          <Group justify="space-between">
            <Text>Стандартная доставка:</Text>
            <Text fw={500}>2.8 дня</Text>
          </Group>
        </Stack>
      );
    
    case 'satisfaction':
      return (
        <Stack gap="md">
          <Text size="lg" fw={600}>Удовлетворенность клиентов</Text>
          <div>
            <Text size="sm" mb="xs">94.2%</Text>
            <Progress value={94.2} size="lg" color="teal" />
          </div>
          <Text size="sm" c="dimmed">
            Основано на 2,847 отзывах за последний месяц
          </Text>
          <Group justify="space-between">
            <Text>5 звезд:</Text>
            <Text fw={500}>78%</Text>
          </Group>
          <Group justify="space-between">
            <Text>4 звезды:</Text>
            <Text fw={500}>16%</Text>
          </Group>
        </Stack>
      );
    
    default:
      return <Text>Детализация недоступна</Text>;
  }
};

// Пример использования с KPICard
const ExpandableKPIGridExample: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Text size="xl" fw={700} mb="lg">Пример использования ExpandableKPIGrid с KPICard</Text>
      
      <ExpandableKPIGrid<KPICardData>
        data={kpiCardData}
        CardComponent={KPICardAdapter}
        renderDetailContent={renderDetailContent}
        columnsPerCard={3}
        animationDuration={300}
      />
    </div>
  );
};

export default ExpandableKPIGridExample;