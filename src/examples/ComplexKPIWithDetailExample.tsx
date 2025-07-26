import React, { useState } from 'react';
import {
  Container,
  Title,
  Grid,
  Stack,
  Card,
  Text,
  Group,
  Progress,
  Badge,
  Table,
  RingProgress,
  Divider,
  Alert
} from '@mantine/core';
import ReactECharts from 'echarts-for-react';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconCurrencyRubel,
  IconPackage,
  IconTruck,
  IconUsers,
  IconShoppingCart,
  IconAlertTriangle,
  IconCheck,
  IconClock
} from '@tabler/icons-react';
import ComplexKPIWithDetail, {
  ComplexKPIWithDetailProps,
  DetailConfig,
  DetailRendererProps,
  DetailData,
  createDetailConfig,
  createKPIWithDetail
} from '../components/ComplexKPIWithDetail';

// Типы данных для различных детализаций
interface SalesDetailData extends DetailData {
  totalSales: number;
  salesByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  salesTrend: Array<{
    date: string;
    amount: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    growth: number;
  }>;
}

interface DeliveryDetailData extends DetailData {
  totalDeliveries: number;
  onTimeDeliveries: number;
  delayedDeliveries: number;
  averageDeliveryTime: number;
  deliveryTrends: Array<{
    date: string;
    onTime: number;
    delayed: number;
  }>;
  deliveryRegions: Array<{
    region: string;
    deliveries: number;
    onTimeRate: number;
  }>;
}

interface CustomerDetailData extends DetailData {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerSatisfaction: number;
  customerSegments: Array<{
    segment: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  satisfactionTrend: Array<{
    month: string;
    score: number;
  }>;
}

// Компоненты детализации
const SalesDetail: React.FC<DetailRendererProps<SalesDetailData>> = ({ data, onClose }) => {
  return (
    <Stack gap="md">
      {/* Основные метрики продаж */}
      <Grid>
        <Grid.Col span={12}>
          <Card padding="md" withBorder>
            <Text size="md" fw={600} mb="md">Структура продаж</Text>
            <Grid>
              <Grid.Col span={6}>
                <Stack gap="sm">
                  {data.salesByCategory.map((category, index) => (
                    <div key={index}>
                      <Group justify="space-between" mb={4}>
                        <Text size="sm">{category.category}</Text>
                        <Group gap="xs">
                          <Text size="sm" fw={600}>{category.amount.toLocaleString()} ₽</Text>
                          <Text size="xs" c="dimmed">({category.percentage}%)</Text>
                        </Group>
                      </Group>
                      <Progress 
                        value={category.percentage} 
                        color={category.color}
                        size="sm" 
                        radius="xs"
                      />
                    </div>
                  ))}
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <RingProgress
                  size={180}
                  thickness={16}
                  sections={data.salesByCategory.map(category => ({
                    value: category.percentage,
                    color: category.color,
                    tooltip: `${category.category}: ${category.amount.toLocaleString()} ₽`
                  }))}
                  label={(
                    <Text size="xs" ta="center">
                      Общие продажи<br/>
                      <Text size="lg" fw={700}>
                        {data.totalSales.toLocaleString()} ₽
                      </Text>
                    </Text>
                  )}
                />
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Топ продукты */}
      <Card padding="md" withBorder>
        <Text size="md" fw={600} mb="md">Топ продукты</Text>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Продукт</Table.Th>
              <Table.Th>Продажи</Table.Th>
              <Table.Th>Рост</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.topProducts.map((product, index) => (
              <Table.Tr key={index}>
                <Table.Td>{product.name}</Table.Td>
                <Table.Td>{product.sales.toLocaleString()} ₽</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    {product.growth > 0 ? (
                      <IconTrendingUp size={16} color="green" />
                    ) : (
                      <IconTrendingDown size={16} color="red" />
                    )}
                    <Text c={product.growth > 0 ? 'green' : 'red'}>
                      {Math.abs(product.growth)}%
                    </Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Тренд продаж */}
      <Card padding="md" withBorder>
        <Text size="md" fw={600} mb="md">Динамика продаж</Text>
        <div style={{ height: 200 }}>
          <ReactECharts
            option={{
              tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                  const data = params[0];
                  return `${data.name}<br/>Продажи: ${data.value.toLocaleString()} ₽`;
                }
              },
              xAxis: {
                type: 'category',
                data: data.salesTrend.map(item => item.date)
              },
              yAxis: {
                type: 'value',
                axisLabel: {
                  formatter: (value: number) => `${(value / 1000000).toFixed(1)}M ₽`
                }
              },
              series: [{
                name: 'Продажи',
                type: 'line',
                data: data.salesTrend.map(item => item.amount),
                smooth: true,
                lineStyle: {
                  color: '#1c7ed6'
                },
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: 'rgba(28, 126, 214, 0.3)' },
                      { offset: 1, color: 'rgba(28, 126, 214, 0)' }
                    ]
                  }
                }
              }]
            }}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </Card>
    </Stack>
  );
};

const DeliveryDetail: React.FC<DetailRendererProps<DeliveryDetailData>> = ({ data, onClose }) => {
  const onTimeRate = (data.onTimeDeliveries / data.totalDeliveries) * 100;
  
  return (
    <Stack gap="md">
      {/* Основные метрики доставки */}
      <Grid>
        <Grid.Col span={4}>
          <Card padding="md" withBorder>
            <Group gap="xs" mb="xs">
              <IconCheck size={20} color="green" />
              <Text size="sm" c="dimmed">Вовремя</Text>
            </Group>
            <Text size="xl" fw={700} c="green">{data.onTimeDeliveries}</Text>
            <Text size="xs" c="dimmed">{onTimeRate.toFixed(1)}% от общего</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card padding="md" withBorder>
            <Group gap="xs" mb="xs">
              <IconClock size={20} color="orange" />
              <Text size="sm" c="dimmed">С задержкой</Text>
            </Group>
            <Text size="xl" fw={700} c="orange">{data.delayedDeliveries}</Text>
            <Text size="xs" c="dimmed">{(100 - onTimeRate).toFixed(1)}% от общего</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card padding="md" withBorder>
            <Group gap="xs" mb="xs">
              <IconTruck size={20} color="blue" />
              <Text size="sm" c="dimmed">Среднее время</Text>
            </Group>
            <Text size="xl" fw={700} c="blue">{data.averageDeliveryTime}</Text>
            <Text size="xs" c="dimmed">часов</Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Доставки по регионам */}
      <Card padding="md" withBorder>
        <Text size="md" fw={600} mb="md">Доставки по регионам</Text>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Регион</Table.Th>
              <Table.Th>Доставки</Table.Th>
              <Table.Th>Вовремя</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.deliveryRegions.map((region, index) => (
              <Table.Tr key={index}>
                <Table.Td>{region.region}</Table.Td>
                <Table.Td>{region.deliveries}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Progress 
                      value={region.onTimeRate} 
                      color={region.onTimeRate > 90 ? 'green' : region.onTimeRate > 70 ? 'yellow' : 'red'}
                      size="sm"
                      style={{ width: 60 }}
                    />
                    <Text size="sm">{region.onTimeRate.toFixed(1)}%</Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Тренд доставок */}
      <Card padding="md" withBorder>
        <Text size="md" fw={600} mb="md">Динамика доставок</Text>
        <div style={{ height: 200 }}>
          <ReactECharts
            option={{
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: ['Вовремя', 'С задержкой']
              },
              xAxis: {
                type: 'category',
                data: data.deliveryTrends.map(item => item.date)
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  name: 'Вовремя',
                  type: 'bar',
                  data: data.deliveryTrends.map(item => item.onTime),
                  color: '#51cf66'
                },
                {
                  name: 'С задержкой',
                  type: 'bar',
                  data: data.deliveryTrends.map(item => item.delayed),
                  color: '#ff8787'
                }
              ]
            }}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </Card>
    </Stack>
  );
};

const CustomerDetail: React.FC<DetailRendererProps<CustomerDetailData>> = ({ data, onClose }) => {
  return (
    <Stack gap="md">
      {/* Основные метрики клиентов */}
      <Grid>
        <Grid.Col span={3}>
          <Card padding="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Всего клиентов</Text>
            <Text size="xl" fw={700}>{data.totalCustomers.toLocaleString()}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card padding="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Новые клиенты</Text>
            <Text size="xl" fw={700} c="blue">{data.newCustomers.toLocaleString()}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card padding="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Возвращающиеся</Text>
            <Text size="xl" fw={700} c="green">{data.returningCustomers.toLocaleString()}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card padding="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Удовлетворенность</Text>
            <Text size="xl" fw={700} c="orange">{data.customerSatisfaction}/5</Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Сегменты клиентов */}
      <Card padding="md" withBorder>
        <Text size="md" fw={600} mb="md">Сегменты клиентов</Text>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Сегмент</Table.Th>
              <Table.Th>Клиенты</Table.Th>
              <Table.Th>Выручка</Table.Th>
              <Table.Th>Доля</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.customerSegments.map((segment, index) => (
              <Table.Tr key={index}>
                <Table.Td>{segment.segment}</Table.Td>
                <Table.Td>{segment.count.toLocaleString()}</Table.Td>
                <Table.Td>{segment.revenue.toLocaleString()} ₽</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Progress 
                      value={segment.percentage} 
                      color="blue"
                      size="sm"
                      style={{ width: 60 }}
                    />
                    <Text size="sm">{segment.percentage}%</Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Тренд удовлетворенности */}
      <Card padding="md" withBorder>
        <Text size="md" fw={600} mb="md">Динамика удовлетворенности</Text>
        <div style={{ height: 200 }}>
          <ReactECharts
            option={{
              tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                  const data = params[0];
                  return `${data.name}<br/>Оценка: ${data.value}/5`;
                }
              },
              xAxis: {
                type: 'category',
                data: data.satisfactionTrend.map(item => item.month)
              },
              yAxis: {
                type: 'value',
                min: 0,
                max: 5,
                axisLabel: {
                  formatter: (value: number) => `${value}/5`
                }
              },
              series: [{
                name: 'Удовлетворенность',
                type: 'line',
                data: data.satisfactionTrend.map(item => item.score),
                smooth: true,
                lineStyle: {
                  color: '#fd7e14'
                },
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: 'rgba(253, 126, 20, 0.3)' },
                      { offset: 1, color: 'rgba(253, 126, 20, 0)' }
                    ]
                  }
                }
              }]
            }}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </Card>
    </Stack>
  );
};

// Конфигурации детализации
const salesDetailConfig = createDetailConfig<SalesDetailData>({
  id: 'sales-detail',
  component: SalesDetail,
  title: 'Детализация продаж',
  height: 'auto'
});

const deliveryDetailConfig = createDetailConfig<DeliveryDetailData>({
  id: 'delivery-detail',
  component: DeliveryDetail,
  title: 'Детализация доставок',
  height: 'auto'
});

const customerDetailConfig = createDetailConfig<CustomerDetailData>({
  id: 'customer-detail',
  component: CustomerDetail,
  title: 'Детализация клиентов',
  height: 'auto'
});

// Тестовые данные
const salesDetailData: SalesDetailData = {
  id: 'sales-detail-data',
  totalSales: 15420000,
  salesByCategory: [
    { category: 'Электроника', amount: 6168000, percentage: 40, color: '#1c7ed6' },
    { category: 'Одежда', amount: 4626000, percentage: 30, color: '#51cf66' },
    { category: 'Дом и сад', amount: 3084000, percentage: 20, color: '#fd7e14' },
    { category: 'Спорт', amount: 1542000, percentage: 10, color: '#f03e3e' }
  ],
  salesTrend: [
    { date: '01.01', amount: 12000000 },
    { date: '01.02', amount: 13500000 },
    { date: '01.03', amount: 14200000 },
    { date: '01.04', amount: 15420000 },
    { date: '01.05', amount: 16100000 },
    { date: '01.06', amount: 15800000 }
  ],
  topProducts: [
    { name: 'iPhone 15', sales: 2500000, growth: 15.2 },
    { name: 'Samsung Galaxy S24', sales: 1800000, growth: 8.7 },
    { name: 'MacBook Pro', sales: 1200000, growth: -2.1 },
    { name: 'AirPods Pro', sales: 950000, growth: 22.5 }
  ]
};

const deliveryDetailData: DeliveryDetailData = {
  id: 'delivery-detail-data',
  totalDeliveries: 1250,
  onTimeDeliveries: 1087,
  delayedDeliveries: 163,
  averageDeliveryTime: 18.5,
  deliveryTrends: [
    { date: 'Пн', onTime: 180, delayed: 20 },
    { date: 'Вт', onTime: 195, delayed: 15 },
    { date: 'Ср', onTime: 210, delayed: 25 },
    { date: 'Чт', onTime: 175, delayed: 30 },
    { date: 'Пт', onTime: 190, delayed: 18 },
    { date: 'Сб', onTime: 137, delayed: 35 },
    { date: 'Вс', onTime: 200, delayed: 20 }
  ],
  deliveryRegions: [
    { region: 'Москва', deliveries: 450, onTimeRate: 92.3 },
    { region: 'СПб', deliveries: 320, onTimeRate: 88.7 },
    { region: 'Екатеринбург', deliveries: 180, onTimeRate: 85.2 },
    { region: 'Новосибирск', deliveries: 150, onTimeRate: 82.1 },
    { region: 'Казань', deliveries: 150, onTimeRate: 89.5 }
  ]
};

const customerDetailData: CustomerDetailData = {
  id: 'customer-detail-data',
  totalCustomers: 45230,
  newCustomers: 3420,
  returningCustomers: 41810,
  customerSatisfaction: 4.2,
  customerSegments: [
    { segment: 'VIP клиенты', count: 2261, revenue: 8500000, percentage: 35 },
    { segment: 'Постоянные', count: 18092, revenue: 12000000, percentage: 45 },
    { segment: 'Новые', count: 13569, revenue: 3500000, percentage: 15 },
    { segment: 'Разовые', count: 11308, revenue: 1200000, percentage: 5 }
  ],
  satisfactionTrend: [
    { month: 'Янв', score: 4.0 },
    { month: 'Фев', score: 4.1 },
    { month: 'Мар', score: 4.0 },
    { month: 'Апр', score: 4.2 },
    { month: 'Май', score: 4.3 },
    { month: 'Июн', score: 4.2 }
  ]
};

// Основной компонент примера
const ComplexKPIWithDetailExample: React.FC = () => {
  const [interactionLog, setInteractionLog] = useState<string[]>([]);

  const logInteraction = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setInteractionLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const handleDetailLoad = (kpiId: string, data: DetailData) => {
    logInteraction(`Загружена детализация для KPI "${kpiId}"`);
  };

  const handleDetailError = (kpiId: string, error: Error) => {
    logInteraction(`Ошибка загрузки детализации для KPI "${kpiId}": ${error.message}`);
  };

  // Данные KPI с детализацией
  const kpiData: ComplexKPIWithDetailProps[] = [
    createKPIWithDetail(
      {
        id: 'sales-revenue',
        title: 'Выручка',
        icon: IconCurrencyRubel,
        value: '15.4M',
        target: '18M',
        progress: 85.6,
        trend: 12.3,
        status: 'success',
        subtitle: 'За текущий месяц',
        chartData: [12.1, 13.5, 14.2, 15.4, 16.1, 15.8, 15.4],
        unit: '₽',
        interactions: {
          onClick: () => logInteraction('Клик по KPI "Выручка"'),
          onHover: () => logInteraction('Наведение на KPI "Выручка"')
        }
      },
      salesDetailConfig,
      salesDetailData
    ),
    
    createKPIWithDetail(
      {
        id: 'delivery-performance',
        title: 'Качество доставки',
        icon: IconTruck,
        value: '87%',
        target: '95%',
        progress: 87,
        trend: -2.1,
        status: 'warning',
        subtitle: 'Доставки вовремя',
        chartData: [89, 91, 88, 87, 85, 86, 87],
        interactions: {
          onClick: () => logInteraction('Клик по KPI "Качество доставки"'),
          onHover: () => logInteraction('Наведение на KPI "Качество доставки"')
        }
      },
      deliveryDetailConfig,
      deliveryDetailData
    ),
    
    createKPIWithDetail(
      {
        id: 'customer-satisfaction',
        title: 'Удовлетворенность клиентов',
        icon: IconUsers,
        value: '4.2',
        target: '4.5',
        progress: 84,
        trend: 5.8,
        status: 'info',
        subtitle: 'Средняя оценка',
        chartData: [4.0, 4.1, 4.0, 4.2, 4.3, 4.2, 4.2],
        unit: '/5',
        interactions: {
          onClick: () => logInteraction('Клик по KPI "Удовлетворенность клиентов"'),
          onHover: () => logInteraction('Наведение на KPI "Удовлетворенность клиентов"')
        }
      },
      customerDetailConfig,
      customerDetailData
    ),
    
    // KPI без детализации для сравнения
    {
      id: 'orders-count',
      title: 'Количество заказов',
      icon: IconShoppingCart,
      value: '1,250',
      target: '1,500',
      progress: 83.3,
      trend: 8.7,
      status: 'success',
      subtitle: 'За неделю',
      chartData: [1100, 1150, 1200, 1250, 1300, 1280, 1250],
      interactions: {
        onClick: () => logInteraction('Клик по KPI "Количество заказов" (без детализации)'),
        onHover: () => logInteraction('Наведение на KPI "Количество заказов"')
      },
      enableDetail: false
    }
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">ComplexKPI с детализацией</Title>
          <Text c="dimmed" size="lg">
            Демонстрация интерактивных KPI карточек с раскрывающейся детализацией.
            Нажмите на карточку с иконкой стрелки для просмотра детальной информации.
          </Text>
        </div>

        {/* KPI карточки */}
        <Grid>
          {kpiData.map((kpi) => (
            <Grid.Col key={kpi.id} span={{ base: 12, sm: 6, lg: 3 }}>
              <ComplexKPIWithDetail
                {...kpi}
                onDetailLoad={(data) => handleDetailLoad(kpi.id, data)}
                onDetailError={(error) => handleDetailError(kpi.id, error)}
              />
            </Grid.Col>
          ))}
        </Grid>

        {/* Лог взаимодействий */}
        <Card withBorder>
          <Text size="lg" fw={600} mb="md">Лог взаимодействий</Text>
          <Stack gap="xs">
            {interactionLog.length === 0 ? (
              <Text c="dimmed" size="sm">Взаимодействий пока нет...</Text>
            ) : (
              interactionLog.map((log, index) => (
                <Text key={index} size="sm" c="dimmed">{log}</Text>
              ))
            )}
          </Stack>
        </Card>

        {/* Инструкции */}
        <Alert title="Как использовать" color="blue" variant="light">
          <Stack gap="xs">
            <Text size="sm">
              • <strong>Клик по карточке:</strong> Раскрывает детализацию (если доступна)
            </Text>
            <Text size="sm">
              • <strong>Наведение мыши:</strong> Показывает интерактивные эффекты
            </Text>
            <Text size="sm">
              • <strong>Иконка стрелки:</strong> Указывает на наличие детализации
            </Text>
            <Text size="sm">
              • <strong>Кнопка X:</strong> Закрывает детализацию
            </Text>
          </Stack>
        </Alert>
      </Stack>
    </Container>
  );
};

export default ComplexKPIWithDetailExample;