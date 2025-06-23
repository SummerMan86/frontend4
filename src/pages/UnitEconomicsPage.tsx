import React, { useState, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Group,
  Stack,
  Title,
  Badge,
  Button,
  Select,
  TextInput,
  Table,
  ActionIcon,
  Tabs,
  RingProgress,
  Paper,
  ScrollArea,
  Slider,
  Drawer,
  Chip,
  MultiSelect,
  RangeSlider,
  Indicator,
  Menu,
  Tooltip,
  Progress,
  ThemeIcon,
  Box,
  Flex,
  NumberInput,
  SegmentedControl,
  Alert,
  Divider,
  Anchor,
  Skeleton,
  Transition,
  useMantineTheme,
  rem,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import ReactECharts from 'echarts-for-react';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconSearch,
  IconFilter,
  IconBell,
  IconSettings,
  IconChartBar,
  IconChartLine,
  IconChartPie,
  IconDownload,
  IconDots,
  IconCalendar,
  IconPackage,
  IconTruck,
  IconCurrencyRubel,
  IconPercentage,
  IconArrowUpRight,
  IconArrowDownRight,
  IconAlertCircle,
  IconCircleCheck,
  IconRefresh,
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
  IconChevronRight,
  IconChevronDown,
  IconX,
  IconDeviceAnalytics,
  IconBulb,
  IconTarget,
  IconShoppingCart,
  IconBox,
  IconClock,
  IconMapPin,
  IconCategory,
} from '@tabler/icons-react';
import { create } from 'zustand';
import dayjs from 'dayjs';

// Zustand store для управления состоянием
interface UnitEconomicsState {
  dateRange: [Date | null, Date | null];
  selectedCategories: string[];
  selectedWarehouses: string[];
  selectedSKUs: string[];
  viewMode: 'cards' | 'table';
  setDateRange: (range: [Date | null, Date | null]) => void;
  setSelectedCategories: (categories: string[]) => void;
  setSelectedWarehouses: (warehouses: string[]) => void;
  setSelectedSKUs: (skus: string[]) => void;
  setViewMode: (mode: 'cards' | 'table') => void;
}

const useUnitEconomicsStore = create<UnitEconomicsState>((set) => ({
  dateRange: [dayjs().subtract(30, 'days').toDate(), dayjs().toDate()],
  selectedCategories: [],
  selectedWarehouses: [],
  selectedSKUs: [],
  viewMode: 'cards',
  setDateRange: (range) => set({ dateRange: range }),
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  setSelectedWarehouses: (warehouses) => set({ selectedWarehouses: warehouses }),
  setSelectedSKUs: (skus) => set({ selectedSKUs: skus }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));

// Стили удалены, так как в Mantine v8 нет createStyles

// Тестовые данные
const generateTestData = () => {
  const categories = ['Одежда', 'Обувь', 'Аксессуары', 'Косметика', 'Электроника'];
  const warehouses = ['Коледино', 'Электросталь', 'Казань', 'Екатеринбург', 'Краснодар'];
  
  const products = Array.from({ length: 50 }, (_, i) => ({
    id: `SKU${12345678 + i}`,
    wbId: 12345678 + i,
    sellerSku: `ART-${1000 + i}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    name: `Товар ${i + 1}`,
    active: Math.random() > 0.2,
    
    // Финансовые показатели
    price: Math.round(1000 + Math.random() * 5000),
    cogs: Math.round(300 + Math.random() * 2000),
    commission: 7 + Math.random() * 18, // 7-25%
    fulfillment: Math.round(50 + Math.random() * 300),
    marketing: Math.round(50 + Math.random() * 500),
    
    // Операционные показатели
    conversionRate: 50 + Math.random() * 40, // 50-90%
    returnRate: 5 + Math.random() * 20, // 5-25%
    drrOrders: 5 + Math.random() * 20,
    drrSales: 3 + Math.random() * 15,
    
    // Логистика
    warehouse: warehouses[Math.floor(Math.random() * warehouses.length)],
    productionTime: Math.round(1 + Math.random() * 10),
    deliveryTime: Math.round(1 + Math.random() * 7),
    totalLeadTime: Math.round(5 + Math.random() * 20),
    
    // Исторические данные для графиков
    history: Array.from({ length: 30 }, (_, d) => ({
      date: dayjs().subtract(29 - d, 'days').format('YYYY-MM-DD'),
      sales: Math.round(10 + Math.random() * 50),
      revenue: Math.round(10000 + Math.random() * 50000),
      profit: Math.round(-5000 + Math.random() * 15000),
      margin: -10 + Math.random() * 40,
    })),
  }));
  
  return products;
};

const testProducts = generateTestData();

// Расчет метрик
const calculateMetrics = (products: typeof testProducts) => {
  const activeProducts = products.filter(p => p.active);
  
  const totalRevenue = activeProducts.reduce((sum, p) => sum + p.price * p.history[29].sales, 0);
  const totalCosts = activeProducts.reduce((sum, p) => {
    const revenue = p.price * p.history[29].sales;
    const commissionCost = revenue * p.commission / 100;
    const cogsCost = p.cogs * p.history[29].sales;
    const fulfillmentCost = p.fulfillment * p.history[29].sales;
    const marketingCost = p.marketing * p.history[29].sales;
    return sum + commissionCost + cogsCost + fulfillmentCost + marketingCost;
  }, 0);
  
  const totalProfit = totalRevenue - totalCosts;
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const avgOrderValue = activeProducts.length > 0 ? totalRevenue / activeProducts.reduce((sum, p) => sum + p.history[29].sales, 0) : 0;
  const avgConversion = activeProducts.reduce((sum, p) => sum + p.conversionRate, 0) / activeProducts.length;
  const avgDrr = activeProducts.reduce((sum, p) => sum + p.drrOrders, 0) / activeProducts.length;
  const avgLeadTime = activeProducts.reduce((sum, p) => sum + p.totalLeadTime, 0) / activeProducts.length;
  
  return {
    unitMargin: avgMargin,
    avgOrderValue,
    drrTotal: avgDrr,
    conversionRate: avgConversion,
    leadTime: avgLeadTime,
    totalRevenue,
    totalCosts,
    totalProfit,
    productCount: activeProducts.length,
  };
};

// Компонент KPI карточки
const KPICard: React.FC<{
  title: string;
  value: string | number;
  change: number;
  target?: string;
  leftSection: React.ReactNode;
  color: string;
  sparklineData?: number[];
}> = ({ title, value, change, target, leftSection, color, sparklineData }) => {
  const theme = useMantineTheme();
  
  const sparklineOption = {
    grid: { top: 5, right: 0, bottom: 5, left: 0 },
    xAxis: { show: false },
    yAxis: { show: false },
    series: [{
      type: 'line',
      data: sparklineData || Array.from({ length: 7 }, () => Math.random() * 100),
      smooth: true,
      symbol: 'none',
      lineStyle: { color: theme.colors[color][6], width: 2 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: theme.colors[color][3] },
            { offset: 1, color: 'rgba(255,255,255,0)' }
          ]
        }
      }
    }]
  };
  
  return (
    <Card 
      p="lg" 
      radius="md" 
      withBorder
      style={{
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = theme.shadows.md;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <ThemeIcon size="lg" radius="md" variant="light" color={color}>
            {leftSection}
          </ThemeIcon>
          {change !== 0 && (
            <Badge
              style={{ position: 'absolute', top: -10, right: -10 }}
              size="sm"
              radius="sm"
              variant="filled"
              color={change > 0 ? 'green' : 'red'}
              leftSection={change > 0 ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
            >
              {Math.abs(change).toFixed(1)}%
            </Badge>
          )}
        </Group>
        
        <Text size="sm" c="dimmed" fw={500}>{title}</Text>
        <Text size="xl" fw={700}>{value}</Text>
        
        <Box h={40}>
          <ReactECharts option={sparklineOption} style={{ height: '100%' }} />
        </Box>
        
        {target && (
            <Text size="xs" c="dimmed">Цель: {target}</Text>
          )}
      </Stack>
    </Card>
  );
};

// Компонент водопада прибыли
const WaterfallChart: React.FC<{ data: any[] }> = ({ data }) => {
  const theme = useMantineTheme();
  
  const option = {
    title: {
      text: 'Декомпозиция прибыли на единицу товара',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 600 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const param = params[0];
        return `${param.name}<br/>${param.value.toLocaleString('ru-RU')} ₽`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Выручка', 'Комиссия WB', 'Себестоимость', 'Фулфилмент', 'Маркетинг', 'Налоги', 'Прибыль']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `${(value / 1000).toFixed(0)}k`
      }
    },
    series: [{
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
        position: 'top',
        formatter: (params: any) => `${params.value.toLocaleString('ru-RU')} ₽`
      },
      emphasis: { focus: 'series' },
      data: [
        {
          value: 3500,
          itemStyle: { color: theme.colors.green[6] }
        },
        {
          value: -420,
          itemStyle: { color: theme.colors.red[6] }
        },
        {
          value: -1200,
          itemStyle: { color: theme.colors.red[6] }
        },
        {
          value: -280,
          itemStyle: { color: theme.colors.red[6] }
        },
        {
          value: -450,
          itemStyle: { color: theme.colors.red[6] }
        },
        {
          value: -180,
          itemStyle: { color: theme.colors.red[6] }
        },
        {
          value: 970,
          itemStyle: { color: theme.colors.blue[6] }
        }
      ]
    }]
  };
  
  return <ReactECharts option={option} style={{ height: 400 }} />;
};

// Компонент таблицы товаров
const ProductsTable: React.FC<{ products: typeof testProducts }> = ({ products }) => {
  const theme = useMantineTheme();
  const [sortBy, setSortBy] = useState<string | null>('margin');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortBy) {
      sorted.sort((a, b) => {
        const aVal = a[sortBy as keyof typeof a] as number;
        const bVal = b[sortBy as keyof typeof b] as number;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }
    return sorted;
  }, [products, sortBy, sortOrder]);
  
  const getStatusColor = (margin: number) => {
    if (margin > 15) return 'green';
    if (margin > 5) return 'yellow';
    return 'red';
  };
  
  const calculateUnitProfit = (product: typeof testProducts[0]) => {
    const revenue = product.price;
    const commissionCost = revenue * product.commission / 100;
    const totalCosts = product.cogs + commissionCost + product.fulfillment + product.marketing;
    return revenue - totalCosts;
  };
  
  const calculateUnitMargin = (product: typeof testProducts[0]) => {
    const profit = calculateUnitProfit(product);
    return (profit / product.price) * 100;
  };
  
  return (
    <ScrollArea>
      <Table verticalSpacing="sm" highlightOnHover>
        <thead>
          <tr>
            <th>Статус/SKU</th>
            <th>Категория</th>
            <th>Margin</th>
            <th>Profit</th>
            <th>% Выкупа</th>
            <th>ДРР</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.slice(0, 10).map((product) => {
            const margin = calculateUnitMargin(product);
            const profit = calculateUnitProfit(product);
            const statusColor = getStatusColor(margin);
            
            return (
              <tr 
                key={product.id} 
                style={{
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.gray[0];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                }}
              >
                <td>
                  <Group gap="xs">
                    <ThemeIcon
                      size="sm"
                      radius="xl"
                      color={statusColor}
                      variant="light"
                    >
                      <IconCircleCheck size={14} />
                    </ThemeIcon>
                    <Text size="sm" fw={500}>{product.wbId}</Text>
                  </Group>
                </td>
                <td>
                  <Badge variant="dot" color="blue">{product.category}</Badge>
                </td>
                <td>
                  <Group gap={4}>
                    <Text
                      style={{
                        color: margin > 15 ? theme.colors.green[6] :
                               margin > 5 ? theme.colors.yellow[6] :
                               theme.colors.red[6],
                        fontWeight: 600
                      }}
                    >
                      {margin.toFixed(1)}%
                    </Text>
                    {margin > product.history[28].margin ? (
                      <IconArrowUpRight size={16} color={theme.colors.green[6]} />
                    ) : (
                      <IconArrowDownRight size={16} color={theme.colors.red[6]} />
                    )}
                  </Group>
                </td>
                <td>
                  <Text fw={500}>₽{profit.toFixed(0)}</Text>
                </td>
                <td>
                  <Text>{product.conversionRate.toFixed(0)}%</Text>
                </td>
                <td>
                  <Text>{product.drrOrders.toFixed(1)}%</Text>
                </td>
                <td>
                  <Menu position="bottom-end" withinPortal>
                    <Menu.Target>
                      <ActionIcon>
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEye size={14} />}>Подробнее</Menu.Item>
                      <Menu.Item leftSection={<IconEdit size={14} />}>Редактировать</Menu.Item>
                      <Menu.Item leftSection={<IconChartLine size={14} />}>Аналитика</Menu.Item>
                      <Menu.Divider />
                      <Menu.Item color="red" leftSection={<IconTrash size={14} />}>Удалить</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </ScrollArea>
  );
};

// Основной компонент
const UnitEconomicsPage: React.FC = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false);
  const [scenarioOpened, { toggle: toggleScenario }] = useDisclosure(false);
  
  const store = useUnitEconomicsStore();
  const metrics = calculateMetrics(testProducts);
  
  // Scenario modeling state
  const [scenarioValues, setScenarioValues] = useState({
    price: 3500,
    cogs: 1200,
    conversion: 72,
    drr: 14.7,
    commission: 12,
    logistics: 280,
  });
  
  const calculateScenarioProfit = () => {
    const revenue = scenarioValues.price;
    const commissionCost = revenue * scenarioValues.commission / 100;
    const totalCosts = scenarioValues.cogs + commissionCost + scenarioValues.logistics;
    const profit = revenue - totalCosts;
    const margin = (profit / revenue) * 100;
    
    return {
      profit,
      margin,
      profitDelta: profit - 650,
      marginDelta: margin - 18.5,
    };
  };
  
  const scenarioResult = calculateScenarioProfit();
  
  return (
    <Container size="xl" p={isMobile ? 'xs' : 'md'}>
      {/* Header */}
      <Paper p="md" mb="md" withBorder>
        <Group justify="space-between" align="center">
          <Group>
            <Title order={2}>Юнит-экономика</Title>
            <Badge size="lg" variant="dot">Обновлено 5 мин назад</Badge>
          </Group>
          
          <Group>
            <Select
              placeholder="Период"
              data={[
                { value: '7d', label: 'Последние 7 дней' },
                { value: '30d', label: 'Последние 30 дней' },
                { value: '90d', label: 'Последние 90 дней' },
                { value: 'custom', label: 'Произвольный период' },
              ]}
              defaultValue="30d"
              styles={{ input: { width: 180 } }}
              leftSection={<IconCalendar size={16} />}
            />
            
            {!isMobile && (
              <>
                <TextInput
                  placeholder="Поиск по артикулу..."
                  leftSection={<IconSearch size={16} />}
                  styles={{ input: { width: 200 } }}
                />
                
                <Button
                  variant="default"
                  leftSection={<IconFilter size={16} />}
                  onClick={openFilter}
                >
                  Фильтры {store.selectedCategories.length > 0 && `(${store.selectedCategories.length})`}
                </Button>
              </>
            )}
            
            <SegmentedControl
              value={store.viewMode}
              onChange={(value) => store.setViewMode(value as 'cards' | 'table')}
              data={[
                { label: <IconChartBar size={16} />, value: 'cards' },
                { label: <IconChartLine size={16} />, value: 'table' },
              ]}
            />
            
            <Indicator color="red" size={8} processing>
              <ActionIcon variant="default" size="lg">
                <IconBell size={18} />
              </ActionIcon>
            </Indicator>
            
            <ActionIcon variant="default" size="lg">
              <IconSettings size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
      
      {/* KPI Cards */}
      <Grid gutter="md" mb="md">
        <Grid.Col span={{ xs: 12, sm: 6, md: 2.4 }}>
          <KPICard
            title="Unit Margin"
            value={`${metrics.unitMargin.toFixed(1)}%`}
            change={2.3}
            target=">15%"
            leftSection={<IconCurrencyRubel size={20} />}
            color="green"
          />
        </Grid.Col>
        
        <Grid.Col span={{ xs: 12, sm: 6, md: 2.4 }}>
          <KPICard
            title="Средний чек"
            value={`₽${metrics.avgOrderValue.toFixed(0)}`}
            change={-1.2}
            target="с учетом WB %"
            leftSection={<IconShoppingCart size={20} />}
            color="blue"
          />
        </Grid.Col>
        
        <Grid.Col span={{ xs: 12, sm: 6, md: 2.4 }}>
          <KPICard
            title="ДРР общий"
            value={`${metrics.drrTotal.toFixed(1)}%`}
            change={0}
            target="заказы+продажи"
            leftSection={<IconChartLine size={20} />}
            color="violet"
          />
        </Grid.Col>
        
        <Grid.Col span={{ xs: 12, sm: 6, md: 2.4 }}>
          <KPICard
            title="% Выкупа"
            value={`${metrics.conversionRate.toFixed(0)}%`}
            change={5}
            target="vs 67% мес."
            leftSection={<IconTarget size={20} />}
            color="cyan"
          />
        </Grid.Col>
        
        <Grid.Col span={{ xs: 12, sm: 6, md: 2.4 }}>
          <KPICard
            title="Оборачиваемость"
            value={`${metrics.leadTime.toFixed(0)} дней`}
            change={-3}
            target="Цель: <30"
            leftSection={<IconClock size={20} />}
            color="orange"
          />
        </Grid.Col>
      </Grid>
      
      {/* Waterfall Chart */}
      <Card p="lg" radius="md" mb="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={4}>Водопад прибыли</Title>
          <Group>
            <Select
              size="sm"
              placeholder="По категориям"
              data={['Все товары', 'Одежда', 'Обувь', 'Аксессуары']}
              defaultValue="Все товары"
            />
            <Button size="sm" variant="subtle" leftSection={<IconDownload size={16} />}>
              Экспорт
            </Button>
          </Group>
        </Group>
        <WaterfallChart data={[]} />
      </Card>
      
      {/* Products Table / Analytics */}
      <Grid gutter="md" mb="md">
        <Grid.Col span={{ xs: 12, lg: 9 }}>
          <Card p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Товарная аналитика</Title>
              <Group>
                <Select
                  size="sm"
                  placeholder="Показать"
                  data={['25', '50', '100']}
                  defaultValue="25"
                />
                <Button size="sm" variant="subtle" leftSection={<IconPlus size={16} />}>
                  Добавить товар
                </Button>
              </Group>
            </Group>
            <ProductsTable products={testProducts} />
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ xs: 12, lg: 3 }}>
          <Stack gap="md">
            {/* Notifications */}
            <Card p="md" radius="md" withBorder>
              <Group justify="space-between" mb="sm">
                <Title order={5}>Уведомления</Title>
                <Badge size="sm" color="red" variant="filled">3</Badge>
              </Group>
              
              <Stack gap="xs">
                <Alert
                  color="orange"
                  title="Снижение маржи"
                  icon={<IconAlertCircle size={16} />}
                  styles={{ root: { padding: '0.5rem' } }}
                >
                  <Text size="xs">SKU 12345: -5.2%</Text>
                  <Text size="xs" color="dimmed">2 часа назад</Text>
                </Alert>
                
                <Alert
                  color="green"
                  title="Цель достигнута"
                  icon={<IconCircleCheck size={16} />}
                  styles={{ root: { padding: '0.5rem' } }}
                >
                  <Text size="xs">% выкупа {'>'} 70%</Text>
                  <Text size="xs" color="dimmed">5 часов назад</Text>
                </Alert>
              </Stack>
            </Card>
            
            {/* Recommendations */}
            <Card p="md" radius="md" withBorder>
              <Group mb="sm">
                <ThemeIcon size="sm" radius="xl" variant="light" color="yellow">
                  <IconBulb size={16} />
                </ThemeIcon>
                <Title order={5}>Рекомендации</Title>
              </Group>
              
              <Stack gap="xs">
                <Paper p="xs" withBorder>
                  <Text size="sm" fw={500}>Увеличить цену на SKU 23456</Text>
                  <Text size="xs" c="dimmed">Потенциал: +₽120</Text>
                </Paper>
                
                <Paper p="xs" withBorder>
                  <Text size="sm" fw={500}>Оптимизировать ДРР для "Обувь"</Text>
                  <Text size="xs" c="dimmed">Текущий: 18.7%, оптимум: 12%</Text>
                </Paper>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
      
      {/* Operational Efficiency */}
      <Grid gutter="md" mb="md">
        <Grid.Col span={{ xs: 12, sm: 6, lg: 3 }}>
          <Card p="md" radius="md" withBorder>
            <Group mb="sm">
              <ThemeIcon size="sm" radius="xl" variant="light" color="blue">
                <IconMapPin size={16} />
              </ThemeIcon>
              <Title order={5}>Эффективность по складам</Title>
            </Group>
            
            <Stack gap="xs">
              {['Коледино', 'Электросталь', 'Казань'].map((warehouse, index) => (
                <Box key={warehouse}>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm">{warehouse}</Text>
                    <Text size="sm" fw={600} c={index === 0 ? 'green' : index === 1 ? 'blue' : 'red'}>
                      {22.5 - index * 3.8}% {index === 0 ? '↑' : index === 1 ? '→' : '↓'}
                    </Text>
                  </Group>
                  <Progress
                    value={75 - index * 15}
                    color={index === 0 ? 'green' : index === 1 ? 'blue' : 'red'}
                    size="sm"
                  />
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ xs: 12, sm: 6, lg: 3 }}>
          <Card p="md" radius="md" withBorder>
            <Group mb="sm">
              <ThemeIcon size="sm" radius="xl" variant="light" color="violet">
                <IconTruck size={16} />
              </ThemeIcon>
              <Title order={5}>Скорость vs Прибыль</Title>
            </Group>
            
            <Box h={150}>
              <ReactECharts
                option={{
                  xAxis: { type: 'value', name: 'Дни поставки', nameLocation: 'middle', nameGap: 30 },
                  yAxis: { type: 'value', name: 'Margin %', nameLocation: 'middle', nameGap: 40 },
                  series: [{
                    type: 'scatter',
                    data: Array.from({ length: 20 }, () => [
                      Math.random() * 30,
                      Math.random() * 40 - 5
                    ]),
                    symbolSize: 8,
                    itemStyle: { color: theme.colors.violet[6] }
                  }],
                  grid: { left: 50, right: 20, top: 20, bottom: 40 }
                }}
                style={{ height: '100%' }}
              />
            </Box>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ xs: 12, sm: 6, lg: 3 }}>
          <Card p="md" radius="md" withBorder>
            <Group mb="sm">
              <ThemeIcon size="sm" radius="xl" variant="light" color="orange">
                <IconPercentage size={16} />
              </ThemeIcon>
              <Title order={5}>Оптимизация ДРР</Title>
            </Group>
            
            <Stack gap="xs">
              <Box>
                <Text size="sm" c="dimmed">ДРР заказы</Text>
                <Text size="lg" fw={600}>8.2%</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">ДРР продажи</Text>
                <Text size="lg" fw={600}>6.5%</Text>
              </Box>
              <Divider />
              <Box>
                <Text size="sm" c="dimmed">Оптимальный диапазон</Text>
                <Badge color="green" variant="light">10-12%</Badge>
              </Box>
            </Stack>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ xs: 12, sm: 6, lg: 3 }}>
          <Card p="md" radius="md" withBorder>
            <Group mb="sm">
              <ThemeIcon size="sm" radius="xl" variant="light" color="cyan">
                <IconCategory size={16} />
              </ThemeIcon>
              <Title order={5}>Конверсия по категориям</Title>
            </Group>
            
            <Box h={150}>
              <ReactECharts
                option={{
                  series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    data: [
                      { value: 85, name: 'Одежда', itemStyle: { color: theme.colors.cyan[6] } },
                      { value: 78, name: 'Обувь', itemStyle: { color: theme.colors.blue[6] } },
                      { value: 65, name: 'Аксессуары', itemStyle: { color: theme.colors.violet[6] } },
                      { value: 52, name: 'Косметика', itemStyle: { color: theme.colors.grape[6] } },
                    ],
                    label: { show: false },
                    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
                  }],
                  legend: {
                    orient: 'vertical',
                    right: 0,
                    top: 'center',
                    textStyle: { fontSize: 11 }
                  }
                }}
                style={{ height: '100%' }}
              />
            </Box>
          </Card>
        </Grid.Col>
      </Grid>
      
      {/* Scenario Modeling */}
      <Card p="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Group>
            <ActionIcon onClick={toggleScenario} variant="subtle">
              {scenarioOpened ? <IconChevronDown /> : <IconChevronRight />}
            </ActionIcon>
            <Title order={4}>Моделирование сценариев</Title>
          </Group>
          <Button size="sm" variant="light">Сохранить сценарий</Button>
        </Group>
        
        <Transition mounted={scenarioOpened} transition="slide-down" duration={200}>
          {(styles) => (
            <Box style={styles}>
              <Grid gutter="md">
                <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
                  <NumberInput
                    label="Цена"
                    value={scenarioValues.price}
                    onChange={(val) => setScenarioValues(prev => ({ ...prev, price: typeof val === 'number' ? val : 0 }))}
                    min={0}
                    step={100}
                    leftSection={<IconCurrencyRubel size={16} />}
                    rightSection={<Text size="sm" c="dimmed">₽</Text>}
                    thousandSeparator=" "
                  />
                </Grid.Col>
                
                <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
                  <NumberInput
                    label="Себестоимость"
                    value={scenarioValues.cogs}
                    onChange={(val) => setScenarioValues(prev => ({ ...prev, cogs: typeof val === 'number' ? val : 0 }))}
                    min={0}
                    step={50}
                    leftSection={<IconBox size={16} />}
                    rightSection={<Text size="sm" c="dimmed">₽</Text>}
                    thousandSeparator=" "
                  />
                </Grid.Col>
                
                <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
                  <NumberInput
                    label="% Выкупа"
                    value={scenarioValues.conversion}
                    onChange={(val) => setScenarioValues(prev => ({ ...prev, conversion: typeof val === 'number' ? val : 0 }))}
                    min={0}
                    max={100}
                    step={1}
                    leftSection={<IconPercentage size={16} />}
                    rightSection={<Text size="sm" c="dimmed">%</Text>}
                  />
                </Grid.Col>
                
                <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
                  <NumberInput
                    label="ДРР"
                    value={scenarioValues.drr}
                    onChange={(val) => setScenarioValues(prev => ({ ...prev, drr: typeof val === 'number' ? val : 0 }))}
                    min={0}
                    max={50}
                    step={0.1}
                    leftSection={<IconChartLine size={16} />}
                    rightSection={<Text size="sm" c="dimmed">%</Text>}
                    decimalScale={1}
                  />
                </Grid.Col>
                
                <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
                  <NumberInput
                    label="Комиссия WB"
                    value={scenarioValues.commission}
                    onChange={(val) => setScenarioValues(prev => ({ ...prev, commission: typeof val === 'number' ? val : 0 }))}
                    min={7}
                    max={25}
                    step={0.5}
                    leftSection={<IconPercentage size={16} />}
                    rightSection={<Text size="sm" c="dimmed">%</Text>}
                    decimalScale={1}
                  />
                </Grid.Col>
                
                <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
                  <NumberInput
                    label="Логистика"
                    value={scenarioValues.logistics}
                    onChange={(val) => setScenarioValues(prev => ({ ...prev, logistics: typeof val === 'number' ? val : 0 }))}
                    min={0}
                    step={10}
                    leftSection={<IconTruck size={16} />}
                    rightSection={<Text size="sm" c="dimmed">₽</Text>}
                    thousandSeparator=" "
                  />
                </Grid.Col>
              </Grid>
              
              <Divider my="md" />
              
              <Group justify="space-between">
                <Box>
                  <Text size="sm" c="dimmed">Прогноз Unit Margin</Text>
                  <Text size="xl" fw={700} c={scenarioResult.marginDelta > 0 ? 'green' : 'red'}>
                    {scenarioResult.margin.toFixed(1)}% ({scenarioResult.marginDelta > 0 ? '+' : ''}{scenarioResult.marginDelta.toFixed(1)}%)
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" c="dimmed">Прогноз прибыли</Text>
                  <Text size="xl" fw={700} c={scenarioResult.profitDelta > 0 ? 'green' : 'red'}>
                    ₽{scenarioResult.profit.toFixed(0)} ({scenarioResult.profitDelta > 0 ? '+' : ''}₽{scenarioResult.profitDelta.toFixed(0)})
                  </Text>
                </Box>
              </Group>
            </Box>
          )}
        </Transition>
      </Card>
      
      {/* Filter Drawer */}
      <Drawer
        opened={filterOpened}
        onClose={closeFilter}
        title="Фильтры"
        position="right"
        size={isMobile ? '100%' : 'lg'}
      >
        <Stack p="md" gap="md">
          <DatePickerInput
            type="range"
            label="Период"
            placeholder="Выберите период"
            value={store.dateRange}
            onChange={(value) => {
              if (value && Array.isArray(value) && value.length === 2) {
                const [start, end] = value;
                store.setDateRange([
                  start ? new Date(start) : null,
                  end ? new Date(end) : null
                ]);
              } else {
                store.setDateRange([null, null]);
              }
            }}
            clearable
          />
          
          <MultiSelect
            label="Категории товаров"
            placeholder="Выберите категории"
            data={['Одежда', 'Обувь', 'Аксессуары', 'Косметика', 'Электроника']}
            value={store.selectedCategories}
            onChange={store.setSelectedCategories}
            clearable
            searchable
          />
          
          <MultiSelect
            label="Склады WB"
            placeholder="Выберите склады"
            data={['Коледино', 'Электросталь', 'Казань', 'Екатеринбург', 'Краснодар']}
            value={store.selectedWarehouses}
            onChange={store.setSelectedWarehouses}
            clearable
            searchable
          />
          
          <Box>
            <Text size="sm" fw={500} mb="xs">Unit Margin</Text>
            <RangeSlider
              min={-20}
              max={50}
              step={1}
              defaultValue={[0, 100]}
              marks={[
                { value: 0, label: '0%' },
                { value: 25, label: '25%' },
                { value: 50, label: '50%' },
              ]}
              labelAlwaysOn
            />
          </Box>
          
          <Box>
            <Text size="sm" fw={500} mb="xs">% Выкупа</Text>
            <RangeSlider
              min={0}
              max={100}
              step={5}
              defaultValue={[50, 100]}
              marks={[
                { value: 0, label: '0%' },
                { value: 50, label: '50%' },
                { value: 100, label: '100%' },
              ]}
              labelAlwaysOn
            />
          </Box>
          
          <Box>
            <Text size="sm" fw={500} mb="xs">ДРР</Text>
            <RangeSlider
              min={0}
              max={50}
              step={1}
              defaultValue={[0, 25]}
              marks={[
                { value: 0, label: '0%' },
                { value: 25, label: '25%' },
                { value: 50, label: '50%' },
              ]}
              labelAlwaysOn
            />
          </Box>
          
          <Divider my="sm" />
          
          <Title order={6}>Быстрые фильтры</Title>
          <Chip.Group multiple>
            <Group>
              <Chip value="top">Топ товары</Chip>
              <Chip value="problem">Проблемные</Chip>
              <Chip value="new">Новые</Chip>
              <Chip value="seasonal">Сезонные</Chip>
            </Group>
          </Chip.Group>
          
          <Group mt="xl" justify="space-between">
            <Button variant="subtle" onClick={() => {
              store.setSelectedCategories([]);
              store.setSelectedWarehouses([]);
              store.setSelectedSKUs([]);
            }}>
              Сбросить все
            </Button>
            <Button onClick={closeFilter}>Применить</Button>
          </Group>
        </Stack>
      </Drawer>
    </Container>
  );
};

export default UnitEconomicsPage;