import React, { useState } from 'react';
import {
  Stack,
  Grid,
  Card,
  Group,
  Text,
  Progress,
  Badge,
  Table,
  RingProgress,
  Container,
  Title,
  Divider
} from '@mantine/core';
import ReactECharts from 'echarts-for-react';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconCheck,
  IconClock,
  IconCurrencyRubel,
  IconPackage,
  IconBox,
  IconAlertTriangle,
  IconUsers,
  IconShoppingCart
} from '@tabler/icons-react';
import {
  EnhancedKPIDetailRenderer,
  EnhancedKPIData,
  DetailConfig,
  DetailRendererProps,
  DetailData,
  createDetailConfig,
  createKPIWithDetail
} from '../components/EnhancedKPIDetailRenderer';

// Типы данных для различных детализаций
interface PerfectOrderDetailData extends DetailData {
  totalOrders: number;
  successfulOrders: number;
  problemOrders: number;
  ordersByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  trends: Array<{
    date: string;
    value: number;
  }>;
}

interface DeliveryTimeDetailData extends DetailData {
  averageTime: number;
  timeDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  byTransportType: Array<{
    type: string;
    avgTime: number;
    count: number;
  }>;
}

interface CostAnalysisDetailData extends DetailData {
  totalCost: number;
  costBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  trends: Array<{
    month: string;
    cost: number;
    percentage: number;
  }>;
}

// Компоненты детализации
const PerfectOrderDetail: React.FC<DetailRendererProps<PerfectOrderDetailData>> = ({ data, onClose }) => {
  return (
    <Stack gap="md">
      <Text size="lg" fw={600}>Детализация безупречных поставок</Text>
      
      {/* Основные метрики */}
      <Grid>
        <Grid.Col span={4}>
          <Card padding="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Всего заказов</Text>
            <Text size="xl" fw={700}>{data.totalOrders.toLocaleString()}</Text>
            <Text size="xs" c="dimmed">за период</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card padding="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Успешные заказы</Text>
            <Text size="xl" fw={700} c="green">{data.successfulOrders.toLocaleString()}</Text>
            <Progress 
              value={(data.successfulOrders / data.totalOrders) * 100} 
              color="green" 
              size="xs" 
              mt="xs" 
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card padding="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Проблемные заказы</Text>
            <Text size="xl" fw={700} c="red">{data.problemOrders.toLocaleString()}</Text>
            <Progress 
              value={(data.problemOrders / data.totalOrders) * 100} 
              color="red" 
              size="xs" 
              mt="xs" 
            />
          </Card>
        </Grid.Col>
      </Grid>

      {/* Распределение по статусам */}
      <Card padding="md" withBorder>
        <Text size="md" fw={600} mb="md">Распределение заказов по статусам</Text>
        <Grid>
          <Grid.Col span={6}>
            <Stack gap="sm">
              {data.ordersByStatus.map((status, index) => (
                <div key={index}>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm">{status.status}</Text>
                    <Group gap="xs">
                      <Text size="sm" fw={600}>{status.count}</Text>
                      <Text size="xs" c="dimmed">({status.percentage}%)</Text>
                    </Group>
                  </Group>
                  <Progress 
                    value={status.percentage} 
                    color={status.percentage > 80 ? 'green' : status.percentage > 60 ? 'yellow' : 'red'} 
                    size="sm" 
                    radius="xs"
                  />
                </div>
              ))}
            </Stack>
          </Grid.Col>
          <Grid.Col span={6}>
            <RingProgress
              size={200}
              thickness={20}
              sections={data.ordersByStatus.map((status, index) => ({
                value: status.percentage,
                color: status.percentage > 80 ? 'green' : status.percentage > 60 ? 'yellow' : 'red',
                tooltip: `${status.status}: ${status.count} (${status.percentage}%)`
              }))}
              label={
                <Text size="xs" ta="center">
                  Общий показатель<br/>
                  <Text size="lg" fw={700}>
                    {((data.successfulOrders / data.totalOrders) * 100).toFixed(1)}%
                  </Text>
                </Text>
              }
            />
          </Grid.Col>
        </Grid>
      </Card>

      {/* Тренд */}
      <Card padding="md" withBorder>
        <Text size="md" fw={600} mb="md">Динамика показателя</Text>
        <div style={{ height: 200 }}>
          <ReactECharts
            option={{
              tooltip: {
                trigger: 'axis'
              },
              xAxis: {
                type: 'category',
                data: data.trends.map(item => item.date)
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                name: 'Значение',
                type: 'line',
                data: data.trends.map(item => item.value),
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
                    colorStops: [{
                      offset: 0,
                      color: 'rgba(28, 126, 214, 0.3)'
                    }, {
                      offset: 1,
                      color: 'rgba(28, 126, 214, 0)'
                    }]
                  }
                }
              }]
            }}
            style={{ height: '200px', width: '100%' }}
          />
        </div>
      </Card>
    </Stack>
  );
};

const DeliveryTimeDetail: React.FC<DetailRendererProps<DeliveryTimeDetailData>> = ({ data }) => {
  return (
    <Stack gap="md">
      <Text size="lg" fw={600}>Анализ сроков доставки</Text>
      
      {/* Распределение по времени */}
      <Grid>
        {data.timeDistribution.map((item, index) => (
          <Grid.Col key={index} span={3}>
            <Card padding="md" withBorder>
              <Text size="sm" c="dimmed" mb="xs">{item.range}</Text>
              <Text size="xl" fw={700} c={item.color}>{item.count}</Text>
              <Progress value={item.percentage} color={item.color} size="xs" mt="xs" />
              <Text size="xs" c="dimmed">{item.percentage}% от общего</Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Анализ по типам транспорта */}
      <Card padding="md" withBorder>
        <Text size="md" fw={600} mb="md">Среднее время по типам транспорта</Text>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Тип транспорта</Table.Th>
              <Table.Th>Среднее время</Table.Th>
              <Table.Th>Количество поставок</Table.Th>
              <Table.Th>Эффективность</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.byTransportType.map((transport, index) => {
              const efficiency = transport.avgTime <= 20 ? 'high' : transport.avgTime <= 30 ? 'medium' : 'low';
              const efficiencyColor = efficiency === 'high' ? 'green' : efficiency === 'medium' ? 'yellow' : 'red';
              
              return (
                <Table.Tr key={index}>
                  <Table.Td>{transport.type}</Table.Td>
                  <Table.Td>{transport.avgTime} дней</Table.Td>
                  <Table.Td>{transport.count}</Table.Td>
                  <Table.Td>
                    <Badge color={efficiencyColor} variant="light">
                      {efficiency === 'high' ? 'Высокая' : efficiency === 'medium' ? 'Средняя' : 'Низкая'}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
};

const CostAnalysisDetail: React.FC<DetailRendererProps<CostAnalysisDetailData>> = ({ data }) => {
  return (
    <Stack gap="md">
      <Text size="lg" fw={600}>Анализ логистических затрат</Text>
      
      {/* Общая сумма */}
      <Card padding="md" withBorder>
        <Group justify="space-between">
          <div>
            <Text size="sm" c="dimmed">Общие логистические затраты</Text>
            <Text size="xl" fw={700}>{(data.totalCost / 1000000).toFixed(1)} млн ₽</Text>
          </div>
          <RingProgress
            size={80}
            thickness={8}
            sections={[{ value: 75, color: 'blue' }]}
            label={<Text size="xs" ta="center">75%</Text>}
          />
        </Group>
      </Card>

      {/* Структура затрат */}
      <Grid>
        {data.costBreakdown.map((item, index) => (
          <Grid.Col key={index} span={3}>
            <Card padding="md" withBorder>
              <Text size="sm" c="dimmed" mb="xs">{item.category}</Text>
              <Text size="lg" fw={700} c={item.color}>
                {(item.amount / 1000000).toFixed(1)} млн ₽
              </Text>
              <Text size="xs" c="dimmed">{item.percentage}% от общих</Text>
              <Progress value={item.percentage} color={item.color} size="xs" mt="xs" />
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Динамика затрат */}
      <Card padding="md" withBorder>
        <Text size="md" fw={600} mb="md">Динамика затрат по месяцам</Text>
        <div style={{ height: 200 }}>
          <ReactECharts
            option={{
              tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                  const data = params[0];
                  return `${data.axisValue}<br/>Затраты: ${data.value} млн ₽<br/>Доля: ${data.data.percentage}%`;
                }
              },
              xAxis: {
                type: 'category',
                data: data.trends.map(item => item.month)
              },
              yAxis: {
                type: 'value',
                name: 'млн ₽'
              },
              series: [{
                name: 'Затраты',
                type: 'bar',
                data: data.trends.map(item => ({
                  value: item.cost,
                  percentage: item.percentage
                })),
                itemStyle: {
                  color: '#1c7ed6'
                }
              }]
            }}
            style={{ height: '200px', width: '100%' }}
          />
        </div>
      </Card>
    </Stack>
  );
};

// Конфигурации детализации
const perfectOrderDetailConfig = createDetailConfig<PerfectOrderDetailData>({
  id: 'perfect-order-detail',
  component: PerfectOrderDetail,
  title: 'Детализация безупречных поставок',
  description: 'Подробный анализ качества выполнения заказов',
  dataSelector: () => ({
    id: 'perfect-order-data',
    totalOrders: 1250,
    successfulOrders: 1138,
    problemOrders: 112,
    ordersByStatus: [
      { status: 'Выполнено без замечаний', count: 1138, percentage: 91.0 },
      { status: 'Выполнено с замечаниями', count: 67, percentage: 5.4 },
      { status: 'Частично выполнено', count: 28, percentage: 2.2 },
      { status: 'Не выполнено', count: 17, percentage: 1.4 }
    ],
    trends: [
      { date: 'Янв', value: 89.2 },
      { date: 'Фев', value: 90.1 },
      { date: 'Мар', value: 88.7 },
      { date: 'Апр', value: 91.3 },
      { date: 'Май', value: 92.1 },
      { date: 'Июн', value: 91.0 }
    ]
  })
});

const deliveryTimeDetailConfig = createDetailConfig<DeliveryTimeDetailData>({
  id: 'delivery-time-detail',
  component: DeliveryTimeDetail,
  title: 'Анализ сроков доставки',
  description: 'Детальный анализ времени выполнения поставок',
  dataLoader: async () => {
    // Имитация асинхронной загрузки
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: 'delivery-time-data',
      averageTime: 28,
      timeDistribution: [
        { range: 'Быстрые (≤20 дней)', count: 312, percentage: 25, color: 'green' },
        { range: 'Средние (21-35 дней)', count: 750, percentage: 60, color: 'blue' },
        { range: 'Медленные (36-50 дней)', count: 150, percentage: 12, color: 'orange' },
        { range: 'Критичные (>50 дней)', count: 38, percentage: 3, color: 'red' }
      ],
      byTransportType: [
        { type: 'Авиа', avgTime: 15, count: 125 },
        { type: 'Автомобильный', avgTime: 22, count: 450 },
        { type: 'Железнодорожный', avgTime: 28, count: 380 },
        { type: 'Морской', avgTime: 45, count: 295 }
      ]
    };
  }
});

const costAnalysisDetailConfig = createDetailConfig<CostAnalysisDetailData>({
  id: 'cost-analysis-detail',
  component: CostAnalysisDetail,
  title: 'Анализ логистических затрат',
  description: 'Структура и динамика логистических расходов',
  dataSelector: () => ({
    id: 'cost-analysis-data',
    totalCost: 45600000, // 45.6 млн рублей
    costBreakdown: [
      { category: 'Транспорт', amount: 27360000, percentage: 60, color: 'blue' },
      { category: 'Таможня', amount: 11400000, percentage: 25, color: 'orange' },
      { category: 'Склад', amount: 4560000, percentage: 10, color: 'green' },
      { category: 'Прочее', amount: 2280000, percentage: 5, color: 'gray' }
    ],
    trends: [
      { month: 'Янв', cost: 42.1, percentage: 18.2 },
      { month: 'Фев', cost: 38.7, percentage: 16.8 },
      { month: 'Мар', cost: 44.3, percentage: 19.1 },
      { month: 'Апр', cost: 41.9, percentage: 18.0 },
      { month: 'Май', cost: 46.8, percentage: 20.1 },
      { month: 'Июн', cost: 45.6, percentage: 19.6 }
    ]
  })
});

// Данные KPI
const enhancedKpiData: (EnhancedKPIData<PerfectOrderDetailData> | EnhancedKPIData<DeliveryTimeDetailData> | EnhancedKPIData<CostAnalysisDetailData>)[] = [
  createKPIWithDetail(
    {
      id: 'perfect-order-kpi',
      title: 'Безупречные поставки',
      value: '91.0%',
      target: '85-95%',
      trend: 3.2,
      icon: IconCheck,
      status: 'success',
      progress: 91,
      chartData: [85, 87, 89, 88, 90, 91]
    },
    perfectOrderDetailConfig,
    { id: 'perfect-order', enableDetail: true }
  ),
  
  createKPIWithDetail(
    {
      id: 'delivery-time-kpi',
      title: 'Средний срок доставки',
      value: '28 дней',
      target: '25-30 дней',
      trend: -5.1,
      icon: IconClock,
      status: 'warning',
      progress: 75,
      chartData: [32, 30, 29, 28, 27, 28]
    },
    deliveryTimeDetailConfig,
    { id: 'delivery-time', enableDetail: true }
  ),
  
  createKPIWithDetail(
    {
      id: 'logistics-cost-kpi',
      title: 'Логистические затраты',
      value: '19.6%',
      target: '15-20%',
      trend: -2.3,
      icon: IconCurrencyRubel,
      status: 'info',
      progress: 80,
      chartData: [22, 21, 20, 19, 18, 19.6]
    },
    costAnalysisDetailConfig,
    { id: 'logistics-cost', enableDetail: true }
  ),
  
  // KPI без детализации
  createKPIWithDetail(
    {
      id: 'quality-kpi',
      title: 'Качество поставок',
      value: '96.2%',
      target: '>95%',
      trend: 1.5,
      icon: IconPackage,
      status: 'success',
      progress: 96,
      chartData: [94, 95, 95.5, 96, 96.1, 96.2]
    },
    perfectOrderDetailConfig, // Используем ту же конфигурацию для примера
    { id: 'quality', enableDetail: false } // Отключаем детализацию
  )
];

/**
 * Пример использования EnhancedKPIDetailRenderer
 */
const EnhancedKPIDetailRendererExample: React.FC = () => {
  const [errorLog, setErrorLog] = useState<string[]>([]);
  const [loadLog, setLoadLog] = useState<string[]>([]);

  const handleError = (error: Error, kpiId: string) => {
    const errorMessage = `[${new Date().toLocaleTimeString()}] Ошибка в KPI "${kpiId}": ${error.message}`;
    setErrorLog(prev => [...prev, errorMessage]);
    console.error('KPI Error:', error, 'KPI ID:', kpiId);
  };

  const handleDetailLoad = (kpiId: string, data: any) => {
    const loadMessage = `[${new Date().toLocaleTimeString()}] Загружены данные для KPI "${kpiId}"`;
    setLoadLog(prev => [...prev, loadMessage]);
    console.log('KPI Detail Loaded:', kpiId, data);
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        <div>
          <Title order={2} mb="md">Улучшенный механизм детализации KPI</Title>
          <Text c="dimmed" mb="lg">
            Демонстрация нового компонента EnhancedKPIDetailRenderer с поддержкой различных типов детализации,
            асинхронной загрузки данных и обработки ошибок.
          </Text>
        </div>

        <EnhancedKPIDetailRenderer
          kpiData={enhancedKpiData}
          cardsPerRow={4}
          animationSettings={{
            duration: 400,
            timingFunction: 'ease-out'
          }}
          onError={handleError}
          onDetailLoad={handleDetailLoad}
        />

        {/* Логи для демонстрации */}
        {(errorLog.length > 0 || loadLog.length > 0) && (
          <>
            <Divider />
            <Grid>
              {loadLog.length > 0 && (
                <Grid.Col span={6}>
                  <Card padding="md" withBorder>
                    <Text size="md" fw={600} mb="md" c="green">Лог загрузок</Text>
                    <Stack gap="xs">
                      {loadLog.slice(-5).map((log, index) => (
                        <Text key={index} size="sm" c="dimmed">{log}</Text>
                      ))}
                    </Stack>
                  </Card>
                </Grid.Col>
              )}
              
              {errorLog.length > 0 && (
                <Grid.Col span={6}>
                  <Card padding="md" withBorder>
                    <Text size="md" fw={600} mb="md" c="red">Лог ошибок</Text>
                    <Stack gap="xs">
                      {errorLog.slice(-5).map((log, index) => (
                        <Text key={index} size="sm" c="red">{log}</Text>
                      ))}
                    </Stack>
                  </Card>
                </Grid.Col>
              )}
            </Grid>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default EnhancedKPIDetailRendererExample;