import React, { useState } from 'react';
import {
  Container,
  Title,
  Stack,
  Grid,
  Text,
  Tabs,
  Paper,
  Group,
  ThemeIcon,
} from '@mantine/core';
import {
  IconPackage,
  IconDashboard,
  IconListDetails,
  IconTruck,
  IconClock,
  IconCircleCheck,
  IconCurrencyRubel,
} from '@tabler/icons-react';
import { KPISparklineCard } from '../components/KPISparklineCard';
import GlobalFilterBar from '../components/GlobalFilterBar';
import DeliveriesTableTanStack from '../components/DeliveriesTableTanStack';

// Генерация тестовых данных для эффективности поставок
const generateDeliveryEfficiencyData = (): number[] => {
  const data: number[] = [];
  let baseValue = 85; // Базовая эффективность 85%
  
  for (let i = 0; i < 30; i++) {
    // Добавляем случайные колебания от -5 до +5
    const variation = (Math.random() - 0.5) * 10;
    baseValue = Math.max(70, Math.min(100, baseValue + variation));
    data.push(baseValue);
  }
  
  return data;
};

// Интерфейс для данных поставки
interface Delivery {
  id: number;
  sku: string;
  orderNumber: string;
  vendorCode: string;
  category: string;
  barcodeWB: string;
  items: number;
  totalQuantity: number;
  packed: number;
  accepted: number;
  inSale: number;
  plannedDate: string;
  actualDate: string | null;
  warehouse: string;
  status: string;
}

// Генерация тестовых данных для таблицы поставок
const generateDeliveriesData = (): Delivery[] => {
  const warehouses = ['Коледино', 'Электросталь', 'Казань', 'Екатеринбург', 'Новосибирск', 'Краснодар', 'СПб', 'Ростов'];
  const categories = ['Одежда', 'Обувь', 'Электроника', 'Косметика', 'Товары для дома', 'Спорттовары'];
  const statuses = ['В пути', 'Доставлено', 'Обрабатывается', 'Задержано', 'Отменено'];
  
  return Array.from({ length: 50 }, (_, i) => {
    const plannedDate = new Date();
    plannedDate.setDate(plannedDate.getDate() - Math.floor(Math.random() * 30));
    
    const actualDate = Math.random() > 0.3 ? new Date(plannedDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000) : null;
    
    const totalQuantity = Math.floor(Math.random() * 100) + 10;
    const packed = Math.floor(totalQuantity * (0.7 + Math.random() * 0.3));
    const accepted = Math.floor(packed * (0.8 + Math.random() * 0.2));
    const inSale = Math.floor(accepted * (0.6 + Math.random() * 0.4));
    
    return {
      id: i + 1,
      sku: `WB${String(i + 1).padStart(8, '0')}`,
      orderNumber: `ORD-${String(i + 1).padStart(6, '0')}`,
      vendorCode: `VC${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      barcodeWB: `${Math.floor(Math.random() * 900000000) + 100000000}`,
      items: Math.floor(Math.random() * 5) + 1,
      totalQuantity,
      packed,
      accepted,
      inSale,
      plannedDate: plannedDate.toISOString().split('T')[0],
      actualDate: actualDate ? actualDate.toISOString().split('T')[0] : null,
      warehouse: warehouses[Math.floor(Math.random() * warehouses.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)]
    };
  });
};

const DeliveriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Генерируем данные для sparkline
  const deliveryData = generateDeliveryEfficiencyData();
  
  // Генерируем данные для таблицы поставок
  const deliveriesTableData = generateDeliveriesData();
  
  // Вычисляем текущее значение и изменение
  const currentValue = deliveryData[deliveryData.length - 1];
  const previousValue = deliveryData[deliveryData.length - 7]; // Значение неделю назад
  const change = ((currentValue - previousValue) / previousValue) * 100;
  
  // Функция для рендеринга обзора (KPI показатели)
  const renderOverview = () => (
    <Stack gap="lg">
      <GlobalFilterBar />
      
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
          <KPISparklineCard
            title="Эффективность поставок"
            value={`${currentValue.toFixed(1)}%`}
            change={parseFloat(change.toFixed(2))}
            icon={<IconTruck size={20} />}
            sparklineData={deliveryData}
            unit="%"
            sparklineHeight={50}
            showArea={true}
            gradientBackground="auto" // Автоматический выбор градиента на основе динамики
            comparisonText="vs прошлая неделя"
            sparklineTitle="Динамика за 30 дней"
            size="md"
          />
        </Grid.Col>
        
        {/* Можно добавить дополнительные KPI карточки */}
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
          <KPISparklineCard
            title="Время доставки"
            value="2.3"
            change={-8.5}
            icon={<IconClock size={20} />}
            sparklineData={[3.2, 3.1, 2.9, 2.8, 2.7, 2.5, 2.4, 2.3, 2.2, 2.3, 2.4, 2.3, 2.2, 2.1, 2.3, 2.4, 2.3, 2.2, 2.3, 2.4, 2.3, 2.2, 2.1, 2.2, 2.3, 2.4, 2.3, 2.2, 2.3, 2.3]}
            unit="дня"
            lineColor="#40c057" // Зеленый цвет для графика (улучшение времени доставки)
            sparklineHeight={50}
            showArea={true}
            gradientBackground="blue" // Синий градиент для карточки
            comparisonText="vs среднее"
            sparklineTitle="Среднее время доставки"
            size="md"
            invertNegativeLogic={true} // Отрицательная динамика позитивна (меньше время = лучше)
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
          <KPISparklineCard
            title="Успешные поставки"
            value="94.2"
            change={2.1}
            icon={<IconCircleCheck size={20} />}
            sparklineData={[92, 93, 94, 93, 95, 94, 96, 95, 94, 95, 96, 94, 93, 94, 95, 96, 94, 95, 94, 93, 94, 95, 96, 94, 95, 94, 93, 94, 95, 94.2]}
            unit="%"
            sparklineHeight={50}
            showArea={true}
            gradientBackground="auto"
            comparisonText="vs месяц назад"
            sparklineTitle="Процент успешных поставок"
            size="md"
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
          <KPISparklineCard
            title="Стоимость доставки"
            value="1,250"
            change={-3.2}
            icon={<IconCurrencyRubel size={20} />}
            sparklineData={[1400, 1380, 1350, 1320, 1300, 1280, 1260, 1250, 1240, 1250, 1260, 1250, 1240, 1230, 1250, 1260, 1250, 1240, 1250, 1260, 1250, 1240, 1230, 1240, 1250, 1260, 1250, 1240, 1250, 1250]}
            unit="₽"
            lineColor="#40c057" // Зеленый цвет для графика (снижение стоимости - это хорошо)
            sparklineHeight={50}
            showArea={true}
            gradientBackground="blue" // Синий градиент для карточки
            comparisonText="vs среднее"
            sparklineTitle="Средняя стоимость доставки"
            size="md"
            invertNegativeLogic={true} // Отрицательная динамика позитивна (меньше стоимость = лучше)
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );

  // Функция для рендеринга детальных данных (таблица)
  const renderDetailedData = () => (
    <Stack gap="lg">
      <DeliveriesTableTanStack data={deliveriesTableData} />
    </Stack>
  );

  return (
    <div>
      <Container size="xl" py="md">
        <Stack gap="lg">
          {/* Заголовок страницы */}
          <Paper withBorder p="md" mb="md">
            <Group justify="space-between">
              <Group>
                <ThemeIcon size={32} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'violet' }}>
                  <IconPackage size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={600}>Система управления поставками</Text>
                  <Text size="sm" c="dimmed">Остатки и ПВЗ</Text>
                </div>
              </Group>
            </Group>
          </Paper>

          {/* Вкладки */}
          <Tabs value={activeTab} onChange={(value) => value && setActiveTab(value)}>
            <Tabs.List>
              <Tabs.Tab value="overview" leftSection={<IconDashboard size={16} />}>
                Показатели KPI
              </Tabs.Tab>
              <Tabs.Tab value="detailed" leftSection={<IconListDetails size={16} />}>
                Детальные данные
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="overview" pt="md">
              {renderOverview()}
            </Tabs.Panel>

            <Tabs.Panel value="detailed" pt="md">
              {renderDetailedData()}
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </div>
  );
};

export default DeliveriesPage;