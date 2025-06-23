import React, { useState, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Title,
  Group,
  Select,
  Paper,
  Badge,
  Progress,
  Stack,
  Collapse,
  Box,
  SegmentedControl,
  NumberFormatter,
  Divider,
  Button,
  Tabs,
  RingProgress,
  ThemeIcon,
  SimpleGrid,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconShoppingCart,
  IconPackage,
  IconRefresh,
  IconArrowBack,
  IconBan,
  IconChartBar,
  IconMapPin,
  IconCalendar,
  IconInfoCircle,
  IconDownload,
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

// Типы данных
interface KPIData {
  id: string;
  title: string;
  value: number;
  previousValue?: number;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  details?: any;
}

interface OrderData {
  date: string;
  orders: number;
  purchases: number;
  amount: number;
  returns: number;
  rejections: number;
  defects: number;
}

// Генерация демо-данных
const generateDemoData = (startDate: Date, endDate: Date): OrderData[] => {
  const data: OrderData[] = [];
  const days = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
  
  for (let i = 0; i < days; i++) {
    const date = dayjs(startDate).add(i, 'day');
    const orders = Math.floor(Math.random() * 200) + 100;
    const purchases = Math.floor(orders * (0.6 + Math.random() * 0.3));
    const returns = Math.floor(purchases * Math.random() * 0.15);
    const rejections = Math.floor((orders - purchases) * 0.3);
    
    data.push({
      date: date.format('YYYY-MM-DD'),
      orders,
      purchases,
      amount: purchases * (Math.random() * 3000 + 2000),
      returns,
      rejections,
      defects: Math.floor(Math.random() * 5),
    });
  }
  
  return data;
};

// Компонент KPI карточки
const KPICard: React.FC<{
  kpi: KPIData;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ kpi, isExpanded, onToggle }) => {
  const change = kpi.previousValue
    ? ((kpi.value - kpi.previousValue) / kpi.previousValue) * 100
    : 0;
  
  return (
    <Card 
      shadow="sm" 
      radius="md" 
      withBorder 
      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
      onClick={onToggle}
    >
      <Group justify="space-between" mb="xs">
        <ThemeIcon size="lg" variant="light" color={kpi.color}>
          {kpi.icon}
        </ThemeIcon>
        {change !== 0 && (
          <Badge
            color={change > 0 ? 'green' : 'red'}
            variant="light"
            leftSection={change > 0 ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />}
          >
            {Math.abs(change).toFixed(1)}%
          </Badge>
        )}
      </Group>
      
      <Text size="sm" c="dimmed" fw={500}>
        {kpi.title}
      </Text>
      
      <Group align="baseline" gap="xs" mt="xs">
        <Title order={2}>
          <NumberFormatter value={kpi.value} thousandSeparator=" " />
        </Title>
        <Text size="sm" c="dimmed">
          {kpi.unit}
        </Text>
      </Group>
      
      <Text size="xs" c="dimmed" mt="xs">
        {kpi.description}
      </Text>
    </Card>
  );
};

// Основной компонент дашборда
const SalesDashboardPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    dayjs().subtract(30, 'day').toDate(),
    dayjs().toDate(),
  ]);
  const [compareDateRange, setCompareDateRange] = useState<[Date | null, Date | null]>([
    dayjs().subtract(60, 'day').toDate(),
    dayjs().subtract(31, 'day').toDate(),
  ]);
  const [expandedKPI, setExpandedKPI] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('current');
  const [activeTab, setActiveTab] = useState<string | null>('funnel');

  // Генерация данных для выбранных периодов
  const currentData = useMemo(() => {
    if (!dateRange[0] || !dateRange[1]) return [];
    return generateDemoData(dateRange[0], dateRange[1]);
  }, [dateRange]);

  const compareData = useMemo(() => {
    if (!compareDateRange[0] || !compareDateRange[1]) return [];
    return generateDemoData(compareDateRange[0], compareDateRange[1]);
  }, [compareDateRange]);

  // Расчет KPI
  const kpiData: KPIData[] = useMemo(() => {
    const current = currentData.reduce(
      (acc, day) => ({
        orders: acc.orders + day.orders,
        purchases: acc.purchases + day.purchases,
        amount: acc.amount + day.amount,
        returns: acc.returns + day.returns,
        rejections: acc.rejections + day.rejections,
        defects: acc.defects + day.defects,
      }),
      { orders: 0, purchases: 0, amount: 0, returns: 0, rejections: 0, defects: 0 }
    );

    const previous = compareData.reduce(
      (acc, day) => ({
        orders: acc.orders + day.orders,
        purchases: acc.purchases + day.purchases,
        amount: acc.amount + day.amount,
        returns: acc.returns + day.returns,
        rejections: acc.rejections + day.rejections,
        defects: acc.defects + day.defects,
      }),
      { orders: 0, purchases: 0, amount: 0, returns: 0, rejections: 0, defects: 0 }
    );

    return [
      {
        id: 'orders',
        title: 'Заказы',
        value: current.orders,
        previousValue: previous.orders,
        unit: 'шт',
        icon: <IconShoppingCart size={20} />,
        color: 'blue',
        description: 'Общее количество заказов',
        details: { current, previous }
      },
      {
        id: 'purchases',
        title: 'Выкупы',
        value: current.purchases,
        previousValue: previous.purchases,
        unit: 'шт',
        icon: <IconPackage size={20} />,
        color: 'green',
        description: 'Подтвержденные покупки',
        details: { current, previous }
      },
      {
        id: 'conversion',
        title: 'Конверсия',
        value: current.orders > 0 ? (current.purchases / current.orders) * 100 : 0,
        previousValue: previous.orders > 0 ? (previous.purchases / previous.orders) * 100 : 0,
        unit: '%',
        icon: <IconChartBar size={20} />,
        color: 'violet',
        description: 'Выкупы / Заказы',
        details: { current, previous }
      },
      {
        id: 'returns',
        title: 'Возвраты',
        value: current.returns,
        previousValue: previous.returns,
        unit: 'шт',
        icon: <IconArrowBack size={20} />,
        color: 'orange',
        description: 'Возвращенные товары',
        details: { current, previous }
      },
      {
        id: 'rejections',
        title: 'Отказы',
        value: current.rejections,
        previousValue: previous.rejections,
        unit: 'шт',
        icon: <IconBan size={20} />,
        color: 'red',
        description: 'Отмененные заказы',
        details: { current, previous }
      },
      {
        id: 'amount',
        title: 'Сумма продаж',
        value: current.amount,
        previousValue: previous.amount,
        unit: '₽',
        icon: <IconTrendingUp size={20} />,
        color: 'teal',
        description: 'Общая выручка',
        details: { current, previous }
      },
    ];
  }, [currentData, compareData]);

  // Опции для воронки продаж
  const funnelOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    series: [
      {
        name: 'Воронка продаж',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: [
          { value: 100, name: 'Заказы' },
          { value: 70, name: 'Выкупы' },
          { value: 60, name: 'Без возвратов' },
          { value: 55, name: 'Успешные продажи' }
        ]
      }
    ]
  };

  // Опции для линейного графика
  const lineChartOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Заказы', 'Выкупы', 'Возвраты']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: currentData.map(d => dayjs(d.date).format('DD.MM'))
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Заказы',
        type: 'line',
        smooth: true,
        data: currentData.map(d => d.orders),
        itemStyle: { color: '#1c7ed6' }
      },
      {
        name: 'Выкупы',
        type: 'line',
        smooth: true,
        data: currentData.map(d => d.purchases),
        itemStyle: { color: '#37b24d' }
      },
      {
        name: 'Возвраты',
        type: 'line',
        smooth: true,
        data: currentData.map(d => d.returns),
        itemStyle: { color: '#f59f00' }
      }
    ]
  };

  // Детальная панель для KPI
  const renderKPIDetails = (kpiId: string) => {
    const kpi = kpiData.find(k => k.id === kpiId);
    if (!kpi) return null;

    return (
      <Paper p="md" radius="md" withBorder mt="md">
        <Group justify="space-between" mb="md">
          <Title order={4}>Детальная информация: {kpi.title}</Title>
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconDownload size={16} />}
          >
            Экспорт
          </Button>
        </Group>
        
        <Grid>
          <Grid.Col span={6}>
            <Stack>
              <Paper p="sm" radius="sm" bg="gray.0">
                <Text size="sm" c="dimmed">Текущий период</Text>
                <Title order={3}>
                  <NumberFormatter value={kpi.value} thousandSeparator=" " />
                  {' '}{kpi.unit}
                </Title>
              </Paper>
              
              <Paper p="sm" radius="sm" bg="gray.0">
                <Text size="sm" c="dimmed">Предыдущий период</Text>
                <Title order={3}>
                  <NumberFormatter value={kpi.previousValue || 0} thousandSeparator=" " />
                  {' '}{kpi.unit}
                </Title>
              </Paper>
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={6}>
            <ReactECharts
              option={{
                tooltip: { trigger: 'axis' },
                xAxis: {
                  type: 'category',
                  data: ['Предыдущий', 'Текущий']
                },
                yAxis: { type: 'value' },
                series: [{
                  type: 'bar',
                  data: [kpi.previousValue || 0, kpi.value],
                  itemStyle: { color: kpi.color }
                }]
              }}
              style={{ height: '200px' }}
            />
          </Grid.Col>
        </Grid>
      </Paper>
    );
  };

  return (
    <Container size="xl" py="md">
      {/* Заголовок и фильтры */}
      <Group justify="space-between" mb="xl">
        <Title order={2}>Дашборд продаж</Title>
        
        <Group>
          <DatePickerInput
            type="range"
            label="Основной период"
            placeholder="Выберите период"
            value={dateRange}
            onChange={(value) => {
              if (Array.isArray(value) && value.length === 2) {
                setDateRange([value[0] ? new Date(value[0]) : null, value[1] ? new Date(value[1]) : null]);
              } else {
                setDateRange([null, null]);
              }
            }}
            locale="ru"
            clearable
          />
          
          <DatePickerInput
            type="range"
            label="Период для сравнения"
            placeholder="Выберите период"
            value={compareDateRange}
            onChange={(value) => {
              if (Array.isArray(value) && value.length === 2) {
                setCompareDateRange([value[0] ? new Date(value[0]) : null, value[1] ? new Date(value[1]) : null]);
              } else {
                setCompareDateRange([null, null]);
              }
            }}
            locale="ru"
            clearable
          />
          
          <Button variant="default" leftSection={<IconRefresh size={16} />}>
            Обновить
          </Button>
        </Group>
      </Group>

      {/* KPI карточки */}
      <Grid mb="xl">
        {kpiData.map((kpi) => (
          <Grid.Col key={kpi.id} span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
            <KPICard
              kpi={kpi}
              isExpanded={expandedKPI === kpi.id}
              onToggle={() => setExpandedKPI(expandedKPI === kpi.id ? null : kpi.id)}
            />
          </Grid.Col>
        ))}
      </Grid>

      {/* Детальная панель для выбранного KPI */}
      <Collapse in={expandedKPI !== null}>
        {expandedKPI && renderKPIDetails(expandedKPI)}
      </Collapse>

      {/* Основные графики */}
      <Grid mt="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Динамика продаж</Title>
              <SegmentedControl
                value={viewMode}
                onChange={setViewMode}
                data={[
                  { label: 'Текущий', value: 'current' },
                  { label: 'Сравнение', value: 'compare' },
                ]}
              />
            </Group>
            
            <ReactECharts
              option={lineChartOption}
              style={{ height: '400px' }}
            />
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" radius="md" withBorder h="100%">
            <Title order={4} mb="md">Воронка продаж</Title>
            <ReactECharts
              option={funnelOption}
              style={{ height: '350px' }}
            />
          </Card>
        </Grid.Col>
      </Grid>

      {/* Дополнительные вкладки с аналитикой */}
      <Card shadow="sm" radius="md" withBorder mt="xl">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="funnel">Воронка</Tabs.Tab>
            <Tabs.Tab value="sources">Источники</Tabs.Tab>
            <Tabs.Tab value="products">Товары</Tabs.Tab>
            <Tabs.Tab value="regions">География</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="funnel" pt="md">
            <Grid>
              <Grid.Col span={3}>
                <Paper p="md" radius="md" bg="blue.0">
                  <Group>
                    <RingProgress
                      size={80}
                      thickness={8}
                      sections={[{ value: 70, color: 'blue' }]}
                      label={
                        <Text size="sm" ta="center">
                          70%
                        </Text>
                      }
                    />
                    <div>
                      <Text size="sm" c="dimmed">Конверсия в выкуп</Text>
                      <Text fw={500}>Заказ → Выкуп</Text>
                    </div>
                  </Group>
                </Paper>
              </Grid.Col>
              
              <Grid.Col span={3}>
                <Paper p="md" radius="md" bg="green.0">
                  <Group>
                    <RingProgress
                      size={80}
                      thickness={8}
                      sections={[{ value: 85, color: 'green' }]}
                      label={
                        <Text size="sm" ta="center">
                          85%
                        </Text>
                      }
                    />
                    <div>
                      <Text size="sm" c="dimmed">Успешные продажи</Text>
                      <Text fw={500}>Без возвратов</Text>
                    </div>
                  </Group>
                </Paper>
              </Grid.Col>
              
              <Grid.Col span={3}>
                <Paper p="md" radius="md" bg="orange.0">
                  <Group>
                    <RingProgress
                      size={80}
                      thickness={8}
                      sections={[{ value: 15, color: 'orange' }]}
                      label={
                        <Text size="sm" ta="center">
                          15%
                        </Text>
                      }
                    />
                    <div>
                      <Text size="sm" c="dimmed">Возвраты</Text>
                      <Text fw={500}>От выкупов</Text>
                    </div>
                  </Group>
                </Paper>
              </Grid.Col>
              
              <Grid.Col span={3}>
                <Paper p="md" radius="md" bg="red.0">
                  <Group>
                    <RingProgress
                      size={80}
                      thickness={8}
                      sections={[{ value: 30, color: 'red' }]}
                      label={
                        <Text size="sm" ta="center">
                          30%
                        </Text>
                      }
                    />
                    <div>
                      <Text size="sm" c="dimmed">Отказы</Text>
                      <Text fw={500}>От заказов</Text>
                    </div>
                  </Group>
                </Paper>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="sources" pt="md">
            <SimpleGrid cols={3}>
              <Paper p="md" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>Органика</Text>
                  <Badge color="green">+12%</Badge>
                </Group>
                <Title order={3}>2,456</Title>
                <Text size="sm" c="dimmed">заказов</Text>
                <Progress value={65} mt="sm" />
              </Paper>
              
              <Paper p="md" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>АРК</Text>
                  <Badge color="blue">+8%</Badge>
                </Group>
                <Title order={3}>1,234</Title>
                <Text size="sm" c="dimmed">заказов</Text>
                <Progress value={30} mt="sm" color="blue" />
              </Paper>
              
              <Paper p="md" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>Аукцион</Text>
                  <Badge color="violet">+5%</Badge>
                </Group>
                <Title order={3}>567</Title>
                <Text size="sm" c="dimmed">заказов</Text>
                <Progress value={15} mt="sm" color="violet" />
              </Paper>
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="products" pt="md">
            <Text c="dimmed">Аналитика по товарам будет здесь...</Text>
          </Tabs.Panel>

          <Tabs.Panel value="regions" pt="md">
            <Text c="dimmed">География продаж будет здесь...</Text>
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Container>
  );
};

export default SalesDashboardPage;