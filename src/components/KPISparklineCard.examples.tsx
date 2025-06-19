import React, { useState } from 'react';
import { SimpleGrid, Container, Title, Stack, Button, Group, Text } from '@mantine/core';
import { 
  IconTrendingUp, 
  IconTrendingDown, 
  IconShoppingCart, 
  IconCurrencyDollar, 
  IconPackage, 
  IconUsers,
  IconChartLine,
  IconRefresh
} from '@tabler/icons-react';
import { KPISparklineCard, KPISparklineCardProps } from './KPISparklineCard';

// Генерация тестовых данных для sparkline
const generateSparklineData = (baseValue: number, trend: 'up' | 'down' | 'flat' = 'up', volatility: number = 0.2): number[] => {
  const data: number[] = [];
  let value = baseValue;
  
  for (let i = 0; i < 30; i++) {
    // Добавляем случайные колебания
    const randomVariation = (Math.random() - 0.5) * volatility;
    
    // Применяем тренд
    let trendValue = 0;
    if (trend === 'up') {
      trendValue = i * 0.01; // Постепенный рост
    } else if (trend === 'down') {
      trendValue = -i * 0.01; // Постепенное снижение
    }
    
    value = baseValue * (1 + trendValue + randomVariation);
    data.push(Math.max(0, value)); // Не допускаем отрицательных значений
  }
  
  return data;
};

// Примеры данных для разных типов KPI
export const salesKPIs: KPISparklineCardProps[] = [
  {
    title: 'Продажи за день',
    value: '1 045 000 ₽',
    change: 8.5,
    icon: <IconCurrencyDollar size={20} />,
    sparklineData: generateSparklineData(1000000, 'up'),
    unit: '₽',
    sparklineTitle: 'Динамика продаж за 30 дней',
    gradientBackground: 'green'
  },
  {
    title: 'Заказы за день',
    value: 547,
    change: 12.3,
    icon: <IconShoppingCart size={20} />,
    sparklineData: generateSparklineData(500, 'up'),
    unit: 'заказы',
    sparklineTitle: 'Количество заказов за 30 дней',
    gradientBackground: 'blue'
  },
  {
    title: 'Прибыль за день',
    value: '210 400 ₽',
    change: 5.7,
    icon: <IconTrendingUp size={20} />,
    sparklineData: generateSparklineData(200000, 'up'),
    unit: '₽',
    lineColor: '#51cf66',
    gradientBackground: 'yellow'
  },
  {
    title: 'Возвраты',
    value: '42 шт.',
    change: -3.2,
    icon: <IconTrendingDown size={20} />,
    sparklineData: generateSparklineData(45, 'down'),
    unit: 'шт',
    lineColor: '#ff6b6b',
    gradientBackground: 'red'
  }
];

export const warehouseKPIs: KPISparklineCardProps[] = [
  {
    title: 'Остатки на складах',
    value: '15,234',
    change: 2.1,
    icon: <IconPackage size={20} />,
    sparklineData: generateSparklineData(15000, 'flat', 0.1),
    unit: 'шт',
    sparklineHeight: 50,
    size: 'lg',
    gradientBackground: 'purple'
  },
  {
    title: 'Оборачиваемость',
    value: '12.5',
    change: 8.9,
    icon: <IconChartLine size={20} />,
    sparklineData: generateSparklineData(12, 'up', 0.15),
    unit: 'дней',
    showArea: false,
    gradientBackground: 'green'
  },
  {
    title: 'Активные клиенты',
    value: '1,847',
    change: 15.6,
    icon: <IconUsers size={20} />,
    sparklineData: generateSparklineData(1800, 'up'),
    unit: 'чел',
    comparisonText: 'vs прошлый месяц',
    gradientBackground: 'blue'
  }
];

// Компонент с примерами использования
export const KPISparklineExamples: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleKPIClick = (title: string) => {
    alert(`Клик по KPI: ${title}`);
  };

  // Обновляем данные при изменении refreshKey
  const refreshedSalesKPIs = salesKPIs.map(kpi => ({
    ...kpi,
    sparklineData: generateSparklineData(
      typeof kpi.value === 'string' ? 
        parseInt(kpi.value.replace(/[^0-9]/g, '')) : 
        kpi.value as number,
      kpi.change && kpi.change > 0 ? 'up' : kpi.change && kpi.change < 0 ? 'down' : 'flat'
    ),
    onClick: () => handleKPIClick(kpi.title)
  }));

  const refreshedWarehouseKPIs = warehouseKPIs.map(kpi => ({
    ...kpi,
    sparklineData: generateSparklineData(
      typeof kpi.value === 'string' ? 
        parseInt(kpi.value.replace(/[^0-9]/g, '')) : 
        kpi.value as number,
      kpi.change && kpi.change > 0 ? 'up' : kpi.change && kpi.change < 0 ? 'down' : 'flat'
    ),
    onClick: () => handleKPIClick(kpi.title)
  }));

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={2}>Примеры KPI Sparkline карточек</Title>
          <Button 
            leftSection={<IconRefresh size={16} />}
            variant="light"
            onClick={handleRefresh}
          >
            Обновить данные
          </Button>
        </Group>

        {/* Градиентные варианты */}
        <div>
          <Title order={3} mb="md">Градиентные варианты фонов</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }} spacing="md">
            <KPISparklineCard
              title="Зеленый градиент"
              value="1,234"
              change={8.5}
              icon={<IconTrendingUp size={20} />}
              sparklineData={generateSparklineData(1200, 'up')}
              unit="шт"
              gradientBackground="green"
              onClick={() => handleKPIClick('Зеленый градиент')}
            />
            <KPISparklineCard
              title="Красный градиент"
              value="987"
              change={-3.2}
              icon={<IconTrendingDown size={20} />}
              sparklineData={generateSparklineData(1000, 'down')}
              unit="шт"
              gradientBackground="red"
              onClick={() => handleKPIClick('Красный градиент')}
            />
            <KPISparklineCard
              title="Желтый градиент"
              value="2,456"
              change={12.7}
              icon={<IconCurrencyDollar size={20} />}
              sparklineData={generateSparklineData(2400, 'up')}
              unit="₽"
              gradientBackground="yellow"
              onClick={() => handleKPIClick('Желтый градиент')}
            />
            <KPISparklineCard
              title="Синий градиент"
              value="3,789"
              change={5.4}
              icon={<IconChartLine size={20} />}
              sparklineData={generateSparklineData(3700, 'up')}
              unit="шт"
              gradientBackground="blue"
              onClick={() => handleKPIClick('Синий градиент')}
            />
            <KPISparklineCard
              title="Фиолетовый градиент"
              value="1,567"
              change={7.8}
              icon={<IconPackage size={20} />}
              sparklineData={generateSparklineData(1500, 'up')}
              unit="шт"
              gradientBackground="purple"
              onClick={() => handleKPIClick('Фиолетовый градиент')}
            />
          </SimpleGrid>
        </div>

        {/* Продажи */}
        <div key={`sales-${refreshKey}`}>
          <Title order={3} mb="md">Продажи и заказы</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
            {refreshedSalesKPIs.map((kpi, index) => (
              <KPISparklineCard key={index} {...kpi} />
            ))}
          </SimpleGrid>
        </div>

        {/* Склад */}
        <div key={`warehouse-${refreshKey}`}>
          <Title order={3} mb="md">ABC анализ остатков</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {refreshedWarehouseKPIs.map((kpi, index) => (
              <KPISparklineCard key={index} {...kpi} />
            ))}
          </SimpleGrid>
        </div>

        {/* Разные размеры */}
        <div>
          <Title order={3} mb="md">Разные размеры карточек</Title>
          <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
            <KPISparklineCard
              title="Маленькая карточка"
              value="1,234"
              change={5.2}
              icon={<IconTrendingUp size={16} />}
              sparklineData={generateSparklineData(1200, 'up')}
              unit="шт"
              size="sm"
              onClick={() => handleKPIClick('Маленькая карточка')}
            />
            <KPISparklineCard
              title="Средняя карточка"
              value="5,678"
              change={-2.1}
              icon={<IconTrendingDown size={20} />}
              sparklineData={generateSparklineData(5600, 'down')}
              unit="₽"
              size="md"
              onClick={() => handleKPIClick('Средняя карточка')}
            />
            <KPISparklineCard
              title="Большая карточка"
              value="9,876"
              change={12.8}
              icon={<IconChartLine size={24} />}
              sparklineData={generateSparklineData(9800, 'up')}
              unit="%"
              size="lg"
              sparklineHeight={60}
              onClick={() => handleKPIClick('Большая карточка')}
            />
          </SimpleGrid>
        </div>

        {/* Автоматический выбор градиента по динамике */}
        <div>
          <Title order={3} mb="md">Автоматический выбор градиента по динамике</Title>
          <Text size="sm" c="dimmed" mb="md">
            Градиент автоматически выбирается на основе динамики: зеленый для положительной, красный для отрицательной
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            <KPISparklineCard
              title="Рост продаж"
              value="1,245"
              change={8.5}
              icon={<IconTrendingUp size={20} />}
              sparklineData={generateSparklineData(1200, 'up')}
              unit="₽"
              gradientBackground="auto"
              onClick={() => handleKPIClick('Автоматический градиент - рост')}
            />
            <KPISparklineCard
              title="Снижение заказов"
              value="892"
              change={-5.2}
              icon={<IconTrendingDown size={20} />}
              sparklineData={generateSparklineData(900, 'down')}
              unit="шт"
              gradientBackground="auto"
              onClick={() => handleKPIClick('Автоматический градиент - снижение')}
            />
            <KPISparklineCard
              title="Стабильная прибыль"
              value="567"
              change={0.1}
              icon={<IconChartLine size={20} />}
              sparklineData={generateSparklineData(560, 'flat')}
              unit="₽"
              gradientBackground="auto"
              onClick={() => handleKPIClick('Автоматический градиент - стабильность')}
            />
          </SimpleGrid>
        </div>

        {/* Примеры с градиентными фонами */}
        <div>
          <Title order={3} mb="md">Примеры с фиксированными градиентными фонами</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            <KPISparklineCard
              title="Успешные продажи"
              value="2,847"
              change={15.3}
              icon={<IconTrendingUp size={20} />}
              sparklineData={generateSparklineData(2800, 'up')}
              unit="шт"
              gradientBackground="green"
              onClick={() => handleKPIClick('Зеленый градиент')}
            />
            <KPISparklineCard
              title="Критические показатели"
              value="1,234"
              change={-8.7}
              icon={<IconTrendingDown size={20} />}
              sparklineData={generateSparklineData(1300, 'down')}
              unit="шт"
              gradientBackground="red"
              onClick={() => handleKPIClick('Красный градиент')}
            />
            <KPISparklineCard
              title="Предупреждения"
              value="567"
              change={3.2}
              icon={<IconChartLine size={20} />}
              sparklineData={generateSparklineData(550, 'up')}
              unit="шт"
              gradientBackground="yellow"
              onClick={() => handleKPIClick('Желтый градиент')}
            />
          </SimpleGrid>
        </div>

        {/* Кастомные настройки */}
        <div>
          <Title order={3} mb="md">Кастомные настройки</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <KPISparklineCard
              title="Без области под графиком"
              value="3,456"
              change={7.3}
              icon={<IconChartLine size={20} />}
              sparklineData={generateSparklineData(3400, 'up')}
              unit="шт"
              showArea={false}
              lineColor="#9c88ff"
              onClick={() => handleKPIClick('Без области')}
            />
            <KPISparklineCard
              title="Кастомный текст сравнения"
              value="2,789"
              change={-4.5}
              icon={<IconUsers size={20} />}
              sparklineData={generateSparklineData(2800, 'down')}
              unit="чел"
              comparisonText="vs прошлая неделя"
              sparklineTitle="Активность за неделю"
              onClick={() => handleKPIClick('Кастомный текст')}
            />
          </SimpleGrid>
        </div>
      </Stack>
    </Container>
  );
};

export default KPISparklineExamples;