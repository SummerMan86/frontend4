import React, { useState, useMemo } from 'react';
import {
  Container,
  Paper,
  Title,
  Grid,
  Select,
  SegmentedControl,
  Card,
  Text,
  Group,
  Button,
  Badge,
  Tabs,
  ActionIcon,
  Tooltip,
  Box,
  Stack,
  Flex,
  RingProgress,
  Progress,
  Indicator,
  NumberInput,
  Switch,
  Slider,
  ThemeIcon,
  Overlay,
  Transition,
  Menu,
  Divider,
  Modal,
  ScrollArea,
  Table,
  MultiSelect,
  Breadcrumbs,
  Anchor,
  LoadingOverlay,
  HoverCard,
  Center,
  SimpleGrid,
  Alert,
  useMantineTheme,
  rem
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconArrowRight,
  IconFilter,
  IconChartBar,
  IconChartSankey,
  IconChartTreemap,
  IconChartLine,
  IconSettings,
  IconDownload,
  IconRefresh,
  IconZoomIn,
  IconInfoCircle,
  IconChevronDown,
  IconChevronRight,
  IconAlertCircle,
  IconBulb,
  IconTargetArrow,
  IconShoppingCart,
  IconPackage,
  IconCreditCard,
  IconEye,
  IconArrowUp,
  IconArrowDown,
  IconDots,
  IconChartDots3,
  IconChartInfographic,
  IconTimeline,
  IconAdjustments,
  IconDatabase,
  IconBrandGoogleAnalytics,
  IconCalendarStats,
  IconChartBubble,
  IconChartDots
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';

// Стили для профессионального вида (заменено на inline стили для Mantine v8)
const getStyles = (theme: any) => ({
  root: {
    backgroundColor: theme.colors.gray[0],
    minHeight: '100vh',
    padding: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  levelIndicator: {
    background: 'linear-gradient(45deg, #228be6, #15aabf)',
    color: 'white',
    padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
    borderRadius: theme.radius.md,
    fontWeight: 700,
    fontSize: theme.fontSizes.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  metricCard: {
    background: 'white',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.sm,
    transition: 'all 0.3s ease',
    border: `1px solid ${theme.colors.gray[2]}`,
  },
  chartCard: {
    background: 'white',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.gray[2]}`,
    height: '100%',
  },
  funnelStage: {
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  breadcrumb: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.gray[6],
  },
});

// Генерация тестовых данных
const generateTestData = () => {
  const currentWeek = {
    views: 45320,
    cart: 14729,
    orders: 10078,
    purchases: 7176,
  };
  
  const previousWeek = {
    views: 38450,
    cart: 11535,
    orders: 7615,
    purchases: 5025,
  };
  
  // Данные по категориям
  const categoryData = [
    { name: 'Одежда', views: 18128, cart: 6347, orders: 4183, purchases: 3095, growth: 15.2 },
    { name: 'Обувь', views: 13596, cart: 3825, orders: 2722, purchases: 1879, growth: -8.5 },
    { name: 'Электроника', views: 9064, cart: 3447, orders: 2515, purchases: 1535, growth: 22.3 },
    { name: 'Аксессуары', views: 4532, cart: 1110, orders: 658, purchases: 667, growth: 5.7 },
  ];
  
  // Временные ряды для трендов
  const trendData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    views: Math.floor(35000 + Math.random() * 15000),
    conversion: 12 + Math.random() * 6,
    revenue: Math.floor(1800000 + Math.random() * 800000),
  }));
  
  // Данные для heatmap
  const heatmapData = [
    { hour: 0, day: 0, value: 45 },
    { hour: 1, day: 0, value: 32 },
    { hour: 2, day: 0, value: 28 },
    // ... генерируем полную матрицу
  ];
  
  // SKU данные
  const skuData = [
    { id: 'SKU-123', name: 'Nike Air Max', conversion: 8.5, revenue: 458000, status: 'problem' },
    { id: 'SKU-456', name: 'Adidas Ultraboost', conversion: 18.2, revenue: 892000, status: 'star' },
    { id: 'SKU-789', name: 'Puma RS-X', conversion: 14.1, revenue: 325000, status: 'normal' },
  ];
  
  return {
    current: currentWeek,
    previous: previousWeek,
    categories: categoryData,
    trends: trendData,
    heatmap: heatmapData,
    sku: skuData,
  };
};

const SalesFunnelPage: React.FC = () => {
  const theme = useMantineTheme();
  const styles = getStyles(theme);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('current_week');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous_week');
  const [visualizationType, setVisualizationType] = useState('sankey');
  const [metricType, setMetricType] = useState('both');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [drillDownPath, setDrillDownPath] = useState<string[]>(['Обзор']);
  const [showSettings, setShowSettings] = useState(false);
  
  const data = useMemo(() => generateTestData(), []);
  
  // Расчет метрик
  const metrics = useMemo(() => {
    const current = data.current;
    const previous = data.previous;
    
    return {
      conversionRate: {
        value: ((current.purchases / current.views) * 100).toFixed(1),
        change: ((current.purchases / current.views) * 100) - ((previous.purchases / previous.views) * 100),
      },
      revenue: {
        value: current.purchases * 3250,
        change: ((current.purchases * 3250) - (previous.purchases * 3250)) / (previous.purchases * 3250) * 100,
      },
      aov: {
        value: 3250,
        change: -1.2,
      },
      purchaseRate: {
        value: ((current.purchases / current.orders) * 100).toFixed(1),
        change: 0.8,
      },
    };
  }, [data]);
  
  // Опции для Sankey диаграммы
  const getSankeyOptions = () => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.dataType === 'edge') {
          return `${params.data.source} → ${params.data.target}<br/>Количество: ${params.value.toLocaleString()}<br/>Конверсия: ${((params.value / data.current.views) * 100).toFixed(1)}%`;
        }
        return `${params.name}<br/>Количество: ${params.value.toLocaleString()}`;
      },
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        emphasis: {
          focus: 'adjacency',
        },
        data: [
          { name: 'Просмотры', itemStyle: { color: '#4ECDC4' } },
          { name: 'Корзина', itemStyle: { color: '#52B788' } },
          { name: 'Заказы', itemStyle: { color: '#F3722C' } },
          { name: 'Выкупы', itemStyle: { color: '#F94144' } },
          { name: 'Ушли', itemStyle: { color: '#ADB5BD' } },
          { name: 'Отказы', itemStyle: { color: '#6C757D' } },
          { name: 'Возвраты', itemStyle: { color: '#495057' } },
        ],
        links: [
          { source: 'Просмотры', target: 'Корзина', value: data.current.cart },
          { source: 'Просмотры', target: 'Ушли', value: data.current.views - data.current.cart },
          { source: 'Корзина', target: 'Заказы', value: data.current.orders },
          { source: 'Корзина', target: 'Отказы', value: data.current.cart - data.current.orders },
          { source: 'Заказы', target: 'Выкупы', value: data.current.purchases },
          { source: 'Заказы', target: 'Возвраты', value: data.current.orders - data.current.purchases },
        ],
        lineStyle: {
          color: 'gradient',
          curveness: 0.5,
        },
        animationDuration: 1500,
        animationEasing: 'cubicOut',
      },
    ],
  });
  
  // Опции для Waterfall диаграммы
  const getWaterfallOptions = () => {
    const stages = [
      { name: 'Просмотры', value: data.current.views },
      { name: 'Не добавили\nв корзину', value: -(data.current.views - data.current.cart) },
      { name: 'Корзина', value: data.current.cart, isTotal: true },
      { name: 'Не оформили', value: -(data.current.cart - data.current.orders) },
      { name: 'Заказы', value: data.current.orders, isTotal: true },
      { name: 'Не выкупили', value: -(data.current.orders - data.current.purchases) },
      { name: 'Выкупы', value: data.current.purchases, isTotal: true },
    ];
    
    const seriesData = stages.map((stage, index) => {
      if (index === 0) {
        return [0, stage.value, stage.value];
      }
      const prevTotal = stages.slice(0, index).reduce((sum, s) => sum + (s.isTotal ? 0 : s.value), stages[0].value);
      if (stage.isTotal) {
        return [0, stage.value, stage.value];
      }
      return [prevTotal, prevTotal + stage.value, stage.value];
    });
    
    return {
      title: {
        text: 'Каскад воронки продаж',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const param = params[0];
          const value = Math.abs(param.data[2]);
          const percentage = ((value / data.current.views) * 100).toFixed(1);
          return `${param.name}<br/>Количество: ${value.toLocaleString()}<br/>От общего: ${percentage}%`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: stages.map(s => s.name),
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `${(value / 1000).toFixed(0)}K`,
        },
      },
      series: [
        {
          name: 'Воронка',
          type: 'bar',
          stack: 'Total',
          itemStyle: {
            color: (params: any) => {
              const value = params.data[2];
              return value > 0 ? '#52B788' : '#F94144';
            },
            borderRadius: [4, 4, 0, 0],
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              const value = Math.abs(params.data[2]);
              return value > 1000 ? `${(value / 1000).toFixed(1)}K` : value.toString();
            },
          },
          data: seriesData,
          animationDuration: 1500,
          animationDelay: (idx: number) => idx * 100,
        },
      ],
    };
  };
  
  // Опции для Sunburst диаграммы
  const getSunburstOptions = () => {
    const categoryColors = {
      'Одежда': '#4ECDC4',
      'Обувь': '#52B788',
      'Электроника': '#F3722C',
      'Аксессуары': '#F94144',
    };
    
    return {
      title: {
        text: 'Структура воронки по категориям',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
        },
      },
      tooltip: {
        formatter: (params: any) => {
          return `${params.name}<br/>Количество: ${params.value.toLocaleString()}<br/>Доля: ${params.percent}%`;
        },
      },
      series: [
        {
          type: 'sunburst',
          radius: [0, '90%'],
          center: ['50%', '50%'],
          sort: undefined,
          emphasis: {
            focus: 'ancestor',
          },
          data: data.categories.map(cat => ({
            name: cat.name,
            value: cat.views,
            itemStyle: { color: categoryColors[cat.name as keyof typeof categoryColors] },
            children: [
              { name: `${cat.name} - Корзина`, value: cat.cart },
              { name: `${cat.name} - Заказы`, value: cat.orders },
              { name: `${cat.name} - Выкупы`, value: cat.purchases },
            ],
          })),
          levels: [
            {},
            {
              r0: '15%',
              r: '50%',
              itemStyle: {
                borderRadius: 4,
              },
              label: {
                rotate: 'tangential',
              },
            },
            {
              r0: '50%',
              r: '90%',
              label: {
                align: 'right',
              },
            },
          ],
          animationType: 'scale',
          animationDuration: 1500,
        },
      ],
    };
  };
  
  // Опции для линейного графика трендов
  const getTrendOptions = () => ({
    title: {
      text: 'Динамика ключевых показателей',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['Просмотры', 'Конверсия %', 'Выручка'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.trends.map(d => d.date),
    },
    yAxis: [
      {
        type: 'value',
        name: 'Количество',
        position: 'left',
        axisLabel: {
          formatter: (value: number) => `${(value / 1000).toFixed(0)}K`,
        },
      },
      {
        type: 'value',
        name: 'Конверсия %',
        position: 'right',
        axisLabel: {
          formatter: '{value}%',
        },
      },
    ],
    series: [
      {
        name: 'Просмотры',
        type: 'line',
        data: data.trends.map(d => d.views),
        smooth: true,
        itemStyle: { color: '#4ECDC4' },
        areaStyle: {
          opacity: 0.1,
        },
      },
      {
        name: 'Конверсия %',
        type: 'line',
        yAxisIndex: 1,
        data: data.trends.map(d => d.conversion),
        smooth: true,
        itemStyle: { color: '#F3722C' },
      },
    ],
  });
  
  // Компонент метрики
  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    format?: 'number' | 'currency' | 'percent';
  }> = ({ title, value, change, icon, format = 'number' }) => {
    const isPositive = change > 0;
    const formatValue = () => {
      switch (format) {
        case 'currency':
          return `₽${typeof value === 'number' ? value.toLocaleString() : value}`;
        case 'percent':
          return `${value}%`;
        default:
          return value.toLocaleString();
      }
    };
    
    return (
      <Card style={styles.metricCard}>
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed" fw={500}>
            {title}
          </Text>
          <ThemeIcon
            variant="light"
            size="lg"
            radius="md"
            color={isPositive ? 'teal' : 'red'}
          >
            {icon}
          </ThemeIcon>
        </Group>
        <Text size="xl" fw={700} mb="xs">
          {formatValue()}
        </Text>
        <Group gap="xs">
          <Badge
            color={isPositive ? 'teal' : 'red'}
            variant="light"
            leftSection={isPositive ? <IconArrowUp size={14} /> : <IconArrowDown size={14} />}
          >
            {Math.abs(change).toFixed(1)}%
          </Badge>
          <Text size="xs" color="dimmed">
            vs прошлый период
          </Text>
        </Group>
      </Card>
    );
  };
  
  // Level 0: Executive Dashboard
  const renderLevel0 = () => (
    <Stack gap="xl">
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Общая конверсия"
            value={metrics.conversionRate.value}
            change={metrics.conversionRate.change}
            icon={<IconTargetArrow size={20} />}
            format="percent"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Выручка"
            value={metrics.revenue.value}
            change={metrics.revenue.change}
            icon={<IconCreditCard size={20} />}
            format="currency"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Средний чек"
            value={metrics.aov.value}
            change={metrics.aov.change}
            icon={<IconShoppingCart size={20} />}
            format="currency"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Процент выкупа"
            value={metrics.purchaseRate.value}
            change={metrics.purchaseRate.change}
            icon={<IconPackage size={20} />}
            format="percent"
          />
        </Grid.Col>
      </Grid>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper style={styles.chartCard}>
            <Group justify="space-between" mb="md">
              <Title order={4}>Воронка продаж</Title>
              <SegmentedControl
                value={visualizationType}
                onChange={setVisualizationType}
                data={[
                  { label: 'Sankey', value: 'sankey' },
                  { label: 'Waterfall', value: 'waterfall' },
                  { label: 'Sunburst', value: 'sunburst' },
                ]}
              />
            </Group>
            <Box style={{ height: 400 }}>
              <ReactECharts
                option={
                  visualizationType === 'sankey'
                    ? getSankeyOptions()
                    : visualizationType === 'waterfall'
                    ? getWaterfallOptions()
                    : getSunburstOptions()
                }
                style={{ height: '100%', width: '100%' }}
                onEvents={{
                  click: (params: any) => {
                    if (params.name) {
                      setCurrentLevel(1);
                      setDrillDownPath([...drillDownPath, params.name]);
                    }
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            <Paper style={{ ...styles.chartCard, height: 200 }}>
              <Title order={5} mb="md">Конверсия по этапам</Title>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">Просмотры → Корзина</Text>
                  <Text size="sm" fw={600} c={32.5 > 30 ? 'teal' : 'red'}>
                    32.5%
                  </Text>
                </Group>
                <Progress value={32.5} color="teal" size="lg" radius="md" />
                
                <Group justify="space-between">
                  <Text size="sm">Корзина → Заказы</Text>
                  <Text size="sm" fw={600} c={68.4 > 65 ? 'teal' : 'red'}>
                    68.4%
                  </Text>
                </Group>
                <Progress value={68.4} color="teal" size="lg" radius="md" />
                
                <Group justify="space-between">
                  <Text size="sm">Заказы → Выкупы</Text>
                  <Text size="sm" fw={600} c={71.2 > 70 ? 'teal' : 'red'}>
                    71.2%
                  </Text>
                </Group>
                <Progress value={71.2} color="teal" size="lg" radius="md" />
              </Stack>
            </Paper>
            
            <Paper style={{ ...styles.chartCard, flex: 1 }}>
              <Group justify="space-between" mb="md">
                <Title order={5}>Рекомендации AI</Title>
                <IconBulb size={20} color={theme.colors.yellow[6]} />
              </Group>
              <Stack gap="sm">
                <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                  <Text size="sm">
                    Конверсия "Корзина → Заказы" упала на 8.2% за неделю. Рекомендую проверить процесс оформления.
                  </Text>
                </Alert>
                <Alert icon={<IconTrendingUp size={16} />} color="teal" variant="light">
                  <Text size="sm">
                    Категория "Электроника" показывает рост +22.3%. Увеличьте рекламный бюджет на эту категорию.
                  </Text>
                </Alert>
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
  
  // Level 1: Operational View
  const renderLevel1 = () => (
    <Stack gap="xl">
      <Grid>
        <Grid.Col span={12}>
          <Paper style={styles.chartCard}>
            <Group justify="space-between" mb="md">
              <Title order={4}>Детальная воронка с сравнением периодов</Title>
              <Group gap="sm">
                <Select
                  value={metricType}
                  onChange={(value) => setMetricType(value || 'both')}
                  data={[
                    { value: 'both', label: 'Числа и %' },
                    { value: 'numbers', label: 'Только числа' },
                    { value: 'percent', label: 'Только %' },
                  ]}
                  size="sm"
                  style={{ width: 140 }}
                />
                <Button
                  variant="light"
                  size="sm"
                  leftSection={<IconFilter size={16} />}
                  onClick={() => setCurrentLevel(2)}
                >
                  Фильтры
                </Button>
              </Group>
            </Group>
            
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Paper p="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <Badge size="lg" variant="filled">Текущий период</Badge>
                    <Text size="sm" c="dimmed">{selectedPeriod}</Text>
                  </Group>
                  
                  <Stack gap="lg">
                    {Object.entries(data.current).map(([stage, value], index) => {
                      const prevValue = Object.values(data.current)[index - 1] || value;
                      const conversion = index > 0 ? ((value / prevValue) * 100).toFixed(1) : '100';
                      
                      return (
                        <Box
                          key={stage}
                          style={styles.funnelStage}
                          onClick={() => {
                            setSelectedCategory(stage);
                            setCurrentLevel(2);
                          }}
                        >
                          <Group justify="space-between" mb="xs">
                            <Text fw={600} tt="capitalize">
                              {stage === 'views' ? 'Просмотры' :
                               stage === 'cart' ? 'Корзина' :
                               stage === 'orders' ? 'Заказы' : 'Выкупы'}
                            </Text>
                            <Badge variant="dot" color="teal">
                              +{((value - Object.values(data.previous)[index]) / Object.values(data.previous)[index] * 100).toFixed(0)}%
                            </Badge>
                          </Group>
                          <Progress
                            value={(value / data.current.views) * 100}
                            size="xl"
                            radius="md"
                            color="teal"
                          />
                          <Text size="sm" mt="xs" ta="center">
                            {`${value.toLocaleString()} (${conversion}%)`}
                          </Text>
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Paper p="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <Badge size="lg" variant="light">Предыдущий период</Badge>
                    <Text size="sm" c="dimmed">{comparisonPeriod}</Text>
                  </Group>
                  
                  <Stack gap="lg">
                    {Object.entries(data.previous).map(([stage, value], index) => {
                      const prevValue = Object.values(data.previous)[index - 1] || value;
                      const conversion = index > 0 ? ((value / prevValue) * 100).toFixed(1) : '100';
                      
                      return (
                        <Box key={stage}>
                          <Group justify="space-between" mb="xs">
                            <Text fw={600} tt="capitalize">
                              {stage === 'views' ? 'Просмотры' :
                               stage === 'cart' ? 'Корзина' :
                               stage === 'orders' ? 'Заказы' : 'Выкупы'}
                            </Text>
                          </Group>
                          <Progress
                            value={(value / data.previous.views) * 100}
                            size="xl"
                            radius="md"
                            color="gray"
                          />
                          <Text size="sm" mt="xs" ta="center">
                            {`${value.toLocaleString()} (${conversion}%)`}
                          </Text>
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>
              </Grid.Col>
            </Grid>
          </Paper>
        </Grid.Col>
      </Grid>
      
      <Paper style={styles.chartCard}>
        <Title order={4} mb="md">Тепловая карта узких мест</Title>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Категория</th>
              <th>Просм → Корзина</th>
              <th>Корзина → Заказ</th>
              <th>Заказ → Выкуп</th>
              <th>Общая конверсия</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.categories.map((category) => {
              const viewToCart = ((category.cart / category.views) * 100).toFixed(1);
              const cartToOrder = ((category.orders / category.cart) * 100).toFixed(1);
              const orderToPurchase = ((category.purchases / category.orders) * 100).toFixed(1);
              const totalConversion = ((category.purchases / category.views) * 100).toFixed(1);
              
              return (
                <tr key={category.name}>
                  <td>
                    <Group gap="xs">
                      <Text fw={500}>{category.name}</Text>
                      {category.growth > 0 ? (
                        <IconTrendingUp size={16} color={theme.colors.teal[6]} />
                      ) : (
                        <IconTrendingDown size={16} color={theme.colors.red[6]} />
                      )}
                    </Group>
                  </td>
                  <td>
                    <Badge
                      color={parseFloat(viewToCart) > 35 ? 'teal' : parseFloat(viewToCart) > 30 ? 'yellow' : 'red'}
                      variant="light"
                      size="lg"
                    >
                      {viewToCart}%
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      color={parseFloat(cartToOrder) > 70 ? 'teal' : parseFloat(cartToOrder) > 65 ? 'yellow' : 'red'}
                      variant="light"
                      size="lg"
                    >
                      {cartToOrder}%
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      color={parseFloat(orderToPurchase) > 72 ? 'teal' : parseFloat(orderToPurchase) > 68 ? 'yellow' : 'red'}
                      variant="light"
                      size="lg"
                    >
                      {orderToPurchase}%
                    </Badge>
                  </td>
                  <td>
                    <Text fw={600} c={parseFloat(totalConversion) > 15 ? 'teal' : 'red'}>
                      {totalConversion}%
                    </Text>
                  </td>
                  <td>
                    <ActionIcon
                      variant="light"
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setCurrentLevel(3);
                      }}
                    >
                      <IconZoomIn size={16} />
                    </ActionIcon>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Paper>
    </Stack>
  );
  
  // Level 2: Analytical Deep Dive
  const renderLevel2 = () => (
    <Stack gap="xl">
      <Paper style={styles.chartCard}>
        <Group justify="space-between" mb="md">
          <Title order={4}>Глубокий анализ</Title>
          <Tabs value={visualizationType} onChange={(value) => setVisualizationType(value || 'sankey')}>
            <Tabs.List>
              <Tabs.Tab value="sankey" leftSection={<IconChartSankey size={14} />}>Sankey</Tabs.Tab>
              <Tabs.Tab value="waterfall" leftSection={<IconChartDots size={14} />}>Waterfall</Tabs.Tab>
              <Tabs.Tab value="sunburst" leftSection={<IconChartTreemap size={14} />}>Sunburst</Tabs.Tab>
              <Tabs.Tab value="trends" leftSection={<IconChartLine size={14} />}>Тренды</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Group>
        
        <Box style={{ height: 500 }}>
          <ReactECharts
            option={
              visualizationType === 'trends'
                ? getTrendOptions()
                : visualizationType === 'sankey'
                ? getSankeyOptions()
                : visualizationType === 'waterfall'
                ? getWaterfallOptions()
                : getSunburstOptions()
            }
            style={{ height: '100%', width: '100%' }}
          />
        </Box>
      </Paper>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper style={styles.chartCard}>
            <Title order={5} mb="md">Когортный анализ</Title>
            <Text size="sm" c="dimmed" mb="md">
              Retention по дням с момента первого визита
            </Text>
            <SimpleGrid cols={7} spacing="xs">
              {Array.from({ length: 28 }, (_, i) => {
                const retention = 100 - i * 3 + Math.random() * 10;
                const color = retention > 70 ? 'teal' : retention > 50 ? 'yellow' : 'red';
                return (
                  <Tooltip key={i} label={`День ${i + 1}: ${retention.toFixed(0)}%`}>
                    <Box
                      style={{
                        backgroundColor: theme.colors[color][retention > 70 ? 2 : retention > 50 ? 1 : 0],
                        height: 40,
                        borderRadius: theme.radius.sm,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </Tooltip>
                );
              })}
            </SimpleGrid>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper style={styles.chartCard}>
            <Title order={5} mb="md">Паттерны поведения</Title>
            <Stack gap="sm">
              <Paper p="sm" withBorder>
                <Group justify="space-between">
                  <Text size="sm" fw={500}>Пиковые часы конверсии</Text>
                  <Badge>19:00 - 22:00</Badge>
                </Group>
              </Paper>
              <Paper p="sm" withBorder>
                <Group justify="space-between">
                  <Text size="sm" fw={500}>Лучший день недели</Text>
                  <Badge color="teal">Четверг (+18%)</Badge>
                </Group>
              </Paper>
              <Paper p="sm" withBorder>
                <Group justify="space-between">
                  <Text size="sm" fw={500}>Среднее время до покупки</Text>
                  <Badge>2.4 дня</Badge>
                </Group>
              </Paper>
              <Paper p="sm" withBorder>
                <Group justify="space-between">
                  <Text size="sm" fw={500}>Повторные покупки</Text>
                  <Badge color="yellow">23.5%</Badge>
                </Group>
              </Paper>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
  
  // Level 3: Product Level
  const renderLevel3 = () => (
    <Stack gap="xl">
      <Paper style={styles.chartCard}>
        <Group justify="space-between" mb="md">
          <Title order={4}>Анализ категории: {selectedCategory || 'Все категории'}</Title>
          <Button
            variant="light"
            size="sm"
            leftSection={<IconChartBubble size={16} />}
          >
            Матрица BCG
          </Button>
        </Group>
        
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Box style={{ height: 400 }}>
              <ReactECharts
                option={{
                  title: {
                    text: 'Матрица товаров',
                    subtext: 'Размер = выручка, Цвет = маржинальность',
                    left: 'center',
                  },
                  tooltip: {
                    trigger: 'item',
                    formatter: (params: any) => {
                      return `${params.data.name}<br/>Конверсия: ${params.data.value[0]}%<br/>Продажи: ${params.data.value[1].toLocaleString()}₽<br/>Маржа: ${params.data.margin}%`;
                    },
                  },
                  grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '3%',
                    containLabel: true,
                  },
                  xAxis: {
                    type: 'value',
                    name: 'Конверсия %',
                    nameLocation: 'middle',
                    nameGap: 30,
                  },
                  yAxis: {
                    type: 'value',
                    name: 'Объем продаж',
                    nameLocation: 'middle',
                    nameGap: 50,
                    axisLabel: {
                      formatter: (value: number) => `${(value / 1000).toFixed(0)}K`,
                    },
                  },
                  series: [
                    {
                      type: 'scatter',
                      symbolSize: (data: any) => Math.sqrt(data[2]) / 50,
                      data: data.sku.map(sku => ({
                        name: sku.name,
                        value: [sku.conversion, sku.revenue, sku.revenue],
                        margin: 20 + Math.random() * 30,
                        itemStyle: {
                          color: sku.status === 'star' ? '#52B788' : sku.status === 'problem' ? '#F94144' : '#4ECDC4',
                        },
                      })),
                    },
                  ],
                }}
                style={{ height: '100%', width: '100%' }}
                onEvents={{
                  click: (params: any) => {
                    const sku = data.sku.find(s => s.name === params.data.name);
                    if (sku) {
                      setSelectedCategory(sku.id);
                      setCurrentLevel(4);
                    }
                  },
                }}
              />
            </Box>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Paper p="md" withBorder>
                <Title order={6} mb="sm">Топ проблемных SKU</Title>
                <Stack gap="sm">
                  {data.sku
                    .filter(sku => sku.status === 'problem')
                    .map(sku => (
                      <Paper key={sku.id} p="sm" withBorder>
                        <Group justify="space-between" mb="xs">
                          <Text size="sm" fw={500}>{sku.id}</Text>
                          <Badge color="red" variant="light">-45%</Badge>
                        </Group>
                        <Text size="xs" c="dimmed">{sku.name}</Text>
                        <Text size="xs" c="blue" mt="xs">
                          Рекомендация: Обновить фото товара
                        </Text>
                      </Paper>
                    ))
                  }
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  );
  
  // Level 4: SKU Detective
  const renderLevel4 = () => (
    <Stack gap="xl">
      <Paper style={styles.chartCard}>
        <Group justify="space-between" mb="md">
          <Title order={4}>SKU Анализ: {selectedCategory}</Title>
          <Group gap="sm">
            <Button variant="light" size="sm" leftSection={<IconTimeline size={16} />}>
              История изменений
            </Button>
            <Button variant="light" size="sm" leftSection={<IconChartDots3 size={16} />}>
              Сравнить с аналогами
            </Button>
          </Group>
        </Group>
        
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper p="md" withBorder>
              <Title order={5} mb="md">История оптимизаций</Title>
              <Stack gap="md">
                <Paper p="sm" withBorder>
                  <Group justify="space-between">
                    <Box>
                      <Text size="sm" fw={500}>15.01.2024: Обновление фотографий</Text>
                      <Text size="xs" c="dimmed">Добавлены фото 360°</Text>
                    </Box>
                    <Badge color="teal" size="lg">+12% конверсия</Badge>
                  </Group>
                </Paper>
                <Paper p="sm" withBorder>
                  <Group justify="space-between">
                    <Box>
                      <Text size="sm" fw={500}>22.01.2024: Изменение цены</Text>
                      <Text size="xs" c="dimmed">5,990₽ → 5,490₽</Text>
                    </Box>
                    <Badge color="yellow" size="lg">+8% выкупов</Badge>
                  </Group>
                </Paper>
                <Paper p="sm" withBorder>
                  <Group justify="space-between">
                    <Box>
                      <Text size="sm" fw={500}>01.02.2024: Добавлено видео</Text>
                      <Text size="xs" c="dimmed">Обзор товара 30 сек</Text>
                    </Box>
                    <Badge color="teal" size="lg">+18% в корзину</Badge>
                  </Group>
                </Paper>
              </Stack>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Paper p="md" withBorder>
                <Title order={6} mb="sm">Сравнение с конкурентами</Title>
                <Table>
                  <thead>
                    <tr>
                      <th>Показатель</th>
                      <th>Мы</th>
                      <th>Рынок</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Конверсия</td>
                      <td>
                        <Text c="red" fw={500}>12.3%</Text>
                      </td>
                      <td>15.8%</td>
                    </tr>
                    <tr>
                      <td>Цена</td>
                      <td>
                        <Text c="yellow" fw={500}>5,490₽</Text>
                      </td>
                      <td>5,150₽</td>
                    </tr>
                    <tr>
                      <td>Возвраты</td>
                      <td>
                        <Text c="red" fw={500}>18.5%</Text>
                      </td>
                      <td>15.2%</td>
                    </tr>
                  </tbody>
                </Table>
              </Paper>
              
              <Paper p="md" withBorder>
                <Title order={6} mb="sm">Предиктивная модель</Title>
                <Stack gap="sm">
                  <Alert color="blue" variant="light">
                    <Text size="xs">
                      При снижении цены на 10%: Конверсия +3.2%, Маржа -450₽
                    </Text>
                  </Alert>
                  <Alert color="teal" variant="light">
                    <Text size="xs">
                      При обновлении описания: Конверсия +2.1%, Затраты 5,000₽
                    </Text>
                  </Alert>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  );
  
  const levels = [
    { value: 0, label: 'Executive Dashboard', render: renderLevel0 },
    { value: 1, label: 'Operational View', render: renderLevel1 },
    { value: 2, label: 'Analytical Deep Dive', render: renderLevel2 },
    { value: 3, label: 'Product Level', render: renderLevel3 },
    { value: 4, label: 'SKU Detective', render: renderLevel4 },
  ];
  
  return (
    <Box style={styles.root}>
      <Container size="xl">
        <Box style={styles.header}>
          <Group justify="space-between" mb="md">
            <Group gap="xl">
              <Title order={2}>Воронка продаж</Title>
              <Badge style={styles.levelIndicator}>
                LEVEL {currentLevel}: {levels[currentLevel].label}
              </Badge>
            </Group>
            
            <Group gap="sm">
              <Select
                value={selectedPeriod}
                onChange={(value) => setSelectedPeriod(value || 'current_week')}
                data={[
                  { value: 'current_week', label: 'Текущая неделя' },
                  { value: 'last_week', label: 'Прошлая неделя' },
                  { value: 'current_month', label: 'Текущий месяц' },
                  { value: 'last_month', label: 'Прошлый месяц' },
                ]}
                style={{ width: 160 }}
              />
              
              <Tooltip label="Обновить данные">
                <ActionIcon variant="light" size="lg">
                  <IconRefresh size={20} />
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label="Настройки">
                <ActionIcon variant="light" size="lg" onClick={() => setShowSettings(true)}>
                  <IconSettings size={20} />
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label="Экспорт">
                <ActionIcon variant="light" size="lg">
                  <IconDownload size={20} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
          
          <Group justify="space-between">
            <Breadcrumbs style={styles.breadcrumb}>
              {drillDownPath.map((path, index) => (
                <Anchor
                  key={index}
                  onClick={() => {
                    setCurrentLevel(Math.max(0, index));
                    setDrillDownPath(drillDownPath.slice(0, index + 1));
                  }}
                >
                  {path}
                </Anchor>
              ))}
            </Breadcrumbs>
            
            <SegmentedControl
              value={currentLevel.toString()}
              onChange={(value) => setCurrentLevel(parseInt(value))}
              data={levels.map(level => ({
                value: level.value.toString(),
                label: `L${level.value}`,
              }))}
            />
          </Group>
        </Box>
        
        <Transition
          mounted={true}
          transition="fade"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <div style={styles}>
              {levels[currentLevel].render()}
            </div>
          )}
        </Transition>
        
        <Modal
          opened={showSettings}
          onClose={() => setShowSettings(false)}
          title="Настройки дашборда"
          size="lg"
        >
          <Stack gap="md">
            <Title order={5}>Режим отображения</Title>
            <SegmentedControl
              fullWidth
              data={[
                { label: 'Классический', value: 'classic' },
                { label: 'Современный', value: 'modern' },
                { label: 'Минималистичный', value: 'minimal' },
              ]}
            />
            
            <Divider />
            
            <Title order={5}>Персонализация</Title>
            <Switch label="Автоматический выбор визуализации" defaultChecked />
            <Switch label="Сохранять историю навигации" defaultChecked />
            <Switch label="Показывать подсказки" defaultChecked />
            <Switch label="Анимации переходов" defaultChecked />
            
            <Divider />
            
            <Title order={5}>Сохраненные виды</Title>
            <Stack gap="xs">
              <Paper p="sm" withBorder>
                <Group justify="space-between">
                  <Text size="sm">Утренний обзор</Text>
                  <Button size="xs" variant="light">Загрузить</Button>
                </Group>
              </Paper>
              <Paper p="sm" withBorder>
                <Group justify="space-between">
                  <Text size="sm">Анализ проблем</Text>
                  <Button size="xs" variant="light">Загрузить</Button>
                </Group>
              </Paper>
            </Stack>
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setShowSettings(false)}>
                Отмена
              </Button>
              <Button onClick={() => setShowSettings(false)}>
                Сохранить
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </Box>
  );
};

export default SalesFunnelPage;