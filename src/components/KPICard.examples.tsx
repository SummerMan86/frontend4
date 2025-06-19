import React from 'react';
import { Stack, Title, Divider } from '@mantine/core';
import { 
  IconBuildingWarehouse, 
  IconTruck, 
  IconPercentage, 
  IconRotate, 
  IconAlertTriangle, 
  IconTrendingUp,
  IconShoppingCart,
  IconCoin,
  IconUsers,
  IconChartLine
} from '@tabler/icons-react';
import { KPICard, type KPICardProps } from './KPICard';
import { KPIGrid } from './KPIGrid';

/**
 * Примеры использования KPICard и KPIGrid компонентов
 * 
 * Этот файл содержит готовые примеры для быстрого старта
 * и демонстрации возможностей компонентов.
 */

// Пример данных для складских KPI
export const warehouseKPIs: KPICardProps[] = [
  {
    title: 'Остатки на складах WB',
    value: '45,382',
    unit: 'шт',
    change: 12.5,
    icon: IconBuildingWarehouse,
    color: 'blue',
    onClick: () => console.log('Clicked: Остатки на складах'),
  },
  {
    title: 'Товары в пути',
    value: '3,847',
    unit: 'шт',
    change: -3.2,
    icon: IconTruck,
    color: 'orange',
  },
  {
    title: '% выкупа (общий)',
    value: '78.4',
    unit: '%',
    change: 2.1,
    icon: IconPercentage,
    color: 'green',
  },
  {
    title: 'Оборачиваемость',
    value: '24.7',
    unit: 'дней',
    change: -5.8,
    icon: IconRotate,
    color: 'violet',
  },
  {
    title: 'Критический запас',
    value: '23',
    unit: 'товаров',
    change: 8.2,
    icon: IconAlertTriangle,
    color: 'red',
  },
];

// Пример данных для продажных KPI
export const salesKPIs: KPICardProps[] = [
  {
    title: 'Выручка за день',
    value: '2,847,392',
    unit: '₽',
    change: 15.3,
    icon: IconCoin,
    color: 'green',
    size: 'lg',
  },
  {
    title: 'Заказы',
    value: '1,247',
    unit: 'шт',
    change: 8.7,
    icon: IconShoppingCart,
    color: 'blue',
  },
  {
    title: 'Конверсия',
    value: '3.2',
    unit: '%',
    change: 0.5,
    icon: IconTrendingUp,
    color: 'cyan',
  },
  {
    title: 'Новые клиенты',
    value: '156',
    unit: 'чел',
    change: 12.1,
    icon: IconUsers,
    color: 'pink',
  },
];

// Пример данных для финансовых KPI
export const financialKPIs: KPICardProps[] = [
  {
    title: 'Прибыль',
    value: '847,392',
    unit: '₽',
    change: 18.5,
    icon: IconChartLine,
    color: 'green',
    gradient: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
  },
  {
    title: 'Маржинальность',
    value: '29.8',
    unit: '%',
    change: 2.3,
    icon: IconPercentage,
    color: 'teal',
  },
  {
    title: 'ROI',
    value: '156.7',
    unit: '%',
    change: 5.2,
    icon: IconTrendingUp,
    color: 'indigo',
  },
];

// Компонент с примерами
export const KPIExamples: React.FC = () => {
  return (
    <Stack gap="xl">
      <div>
        <Title order={2} mb="md">Складские KPI</Title>
        <KPIGrid
          kpis={warehouseKPIs}
          title="📈 KPI метрики"
          description="Ключевые показатели эффективности склада"
          showControls
          onRefresh={() => console.log('Refreshing...')}
          onExport={() => console.log('Exporting...')}
          columns={{
            base: 1,
            xs: 2,
            sm: 3,
            md: 5,
            lg: 5,
          }}
        />
      </div>

      <Divider />

      <div>
        <Title order={2} mb="md">Продажные KPI (большие карточки)</Title>
        <KPIGrid
          kpis={salesKPIs}
          cardSize="lg"
          columns={{
            base: 1,
            sm: 2,
            md: 4,
          }}
          withPaper={false}
        />
      </div>

      <Divider />

      <div>
        <Title order={2} mb="md">Финансовые KPI (компактные)</Title>
        <KPIGrid
          kpis={financialKPIs}
          cardSize="sm"
          columns={{
            base: 1,
            xs: 3,
            sm: 3,
          }}
        />
      </div>
    </Stack>
  );
};

export default KPIExamples;