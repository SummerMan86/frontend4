import React, { useState, useEffect } from 'react';
import {
  Text,
  Button,
  Group,
  Stack,
  Grid,
  Card,
  Badge,
  Progress,
  ThemeIcon,
  Paper,
  RingProgress,
  Container,
  Tabs,
  ActionIcon,
  Menu,
  Avatar,
  Indicator,
  NumberInput,
  Select,
  MultiSelect,
  SegmentedControl,
  Tooltip,
  Modal,
  Alert,
  Timeline,
  Skeleton,
  Slider,
  Switch,
  Notification,
  Anchor,
  Divider,
  Box,
  Flex,
  Title,
  rem,
  useMantineTheme
} from '@mantine/core';
import {
  IconHome,
  IconSearch,
  IconChartBar,
  IconCalendar,
  IconPackage,
  IconAd,
  IconStar,
  IconBrain,
  IconBell,
  IconSettings,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertCircle,
  IconCash,
  IconShoppingCart,
  IconTruck,
  IconArrowUpRight,
  IconArrowDownRight,
  IconRefresh,
  IconDownload,
  IconFilter,
  IconChevronRight,
  IconDots,
  IconExternalLink,
  IconInfoCircle,
  IconCheck,
  IconX,
  IconClockHour4,
  IconCalendarStats,
  IconCoins,
  IconPercentage,
  IconBoxMultiple,
  IconRotate,
  IconTargetArrow,
  IconBrandGoogle,
  IconMessageCircle,
  IconThumbUp,
  IconThumbDown,
  IconEye,
  IconChartLine,
  IconChartArea,
  IconChartDots,
  IconReportAnalytics,
  IconRocket,
  IconBulb,
  IconAutomation,
  IconWand,
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconClipboardList,
  IconTrendingUp3,
  IconArrowRight,
  IconPlus,
  IconMinus,
  IconEqual
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import { notifications } from '@mantine/notifications';

// Типы данных
interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  value?: string;
  action?: string;
  timestamp: Date;
}

interface MetricCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  value: string | number;
  target?: string | number;
  progress?: number;
  trend?: number;
  status?: 'success' | 'warning' | 'danger';
  subtitle?: string;
  action?: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  sales: number;
  revenue: number;
  margin: number;
  stock: number;
  stockDays: number;
  rating: number;
  reviews: number;
  returnRate: number;
}

// Утилиты для форматирования
const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M₽`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k₽`;
  }
  return `${value.toFixed(0)}₽`;
};

const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return value.toString();
};

const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Генерация тестовых данных
const generateAlerts = (): Alert[] => [
  {
    id: '1',
    type: 'critical',
    title: 'Товар закончился',
    message: 'SKU-12345 - Платье летнее, склад Коледино',
    value: '0 шт',
    action: 'Заказать',
    timestamp: new Date()
  },
  {
    id: '2',
    type: 'critical',
    title: 'Маржа упала ниже 40%',
    message: '3 товара с критической маржинальностью',
    value: '35%',
    action: 'Анализ',
    timestamp: new Date()
  },
  {
    id: '3',
    type: 'critical',
    title: 'Рейтинг снизился',
    message: 'SKU-67890 - рейтинг 3.2 (было 4.5)',
    value: '3.2★',
    action: 'Отзывы',
    timestamp: new Date()
  },
  {
    id: '4',
    type: 'warning',
    title: 'Остаток менее 5 дней',
    message: '8 товаров требуют пополнения',
    value: '< 5д',
    action: 'Заказать',
    timestamp: new Date()
  },
  {
    id: '5',
    type: 'warning',
    title: 'ДРР превышает лимит',
    message: 'Реклама неэффективна для 5 ключей',
    value: '15.2%',
    action: 'Оптимизировать',
    timestamp: new Date()
  }
];

const generateProducts = (): Product[] => {
  const products = [];
  for (let i = 1; i <= 20; i++) {
    products.push({
      id: `prod-${i}`,
      sku: `SKU-${10000 + i}`,
      name: `Товар ${i}`,
      price: 1500 + Math.random() * 2000,
      sales: Math.floor(100 + Math.random() * 500),
      revenue: Math.floor(100000 + Math.random() * 900000),
      margin: 25 + Math.random() * 30,
      stock: Math.floor(Math.random() * 1000),
      stockDays: Math.floor(Math.random() * 30),
      rating: 3.5 + Math.random() * 1.5,
      reviews: Math.floor(10 + Math.random() * 490),
      returnRate: 5 + Math.random() * 15
    });
  }
  return products;
};

// Компоненты
const AlertsPanel: React.FC<{ alerts: Alert[] }> = ({ alerts }) => {
  const theme = useMantineTheme();
  
  return (
    <Card withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={500}>Алерты</Text>
          <ActionIcon variant="subtle" color="gray">
            <IconBell size={16} />
          </ActionIcon>
        </Group>
      </Card.Section>
      <Card.Section p="md">
        <Stack gap="xs">
          {alerts.map((alert) => (
            <Paper 
              key={alert.id} 
              p="xs" 
              radius="md" 
              style={{ 
                backgroundColor: alert.type === 'critical' ? theme.colors.red[0] : theme.colors.yellow[0],
                borderLeft: `4px solid ${alert.type === 'critical' ? theme.colors.red[6] : theme.colors.yellow[6]}`
              }}
            >
              <Group justify="space-between">
                <Text fw={500} c={alert.type === 'critical' ? 'red' : 'yellow.7'}>
                  {alert.title}
                </Text>
                <Text size="xs" c="dimmed">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </Text>
              </Group>
              <Text size="sm" mt="xs">
                {alert.message}
              </Text>
              {alert.value && (
                <Group gap={8} mt="xs">
                  <Text size="sm" fw={500}>
                    {alert.value}
                  </Text>
                  {alert.action && (
                    <Button variant="subtle" size="xs" px="xs">
                      {alert.action}
                    </Button>
                  )}
                </Group>
              )}
            </Paper>
          ))}
        </Stack>
      </Card.Section>
    </Card>
  );
};

const MetricCardComponent: React.FC<{ metric: MetricCard }> = ({ metric }) => {
  const theme = useMantineTheme();
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return theme.colors.green[6];
      case 'warning':
        return theme.colors.yellow[6];
      case 'danger':
        return theme.colors.red[6];
      default:
        return theme.colors.gray[6];
    }
  };
  
  return (
    <Card withBorder>
      <Group justify="space-between" mb="xs">
        <Group gap={8}>
          <ThemeIcon variant="light" size="lg" radius="md">
            {metric.icon}
          </ThemeIcon>
          <Text fw={500} size="sm">
            {metric.title}
          </Text>
        </Group>
        {metric.action && (
          <Button variant="subtle" size="xs" px="xs">
            {metric.action}
          </Button>
        )}
      </Group>

      <Text size="xl" fw={700} mb="xs">
        {metric.value}
      </Text>

      {metric.target && (
        <Group gap={8} mb="xs">
          <Text size="sm" c="dimmed">
            Цель: {metric.target}
          </Text>
          {metric.progress !== undefined && (
            <Text size="sm" c={getStatusColor(metric.status)}>
              {metric.progress}%
            </Text>
          )}
        </Group>
      )}

      {metric.progress !== undefined && (
        <Progress
          value={metric.progress}
          color={getStatusColor(metric.status)}
          size="sm"
          mb="xs"
        />
      )}

      {metric.subtitle && (
        <Text size="sm" c="dimmed">
          {metric.subtitle}
        </Text>
      )}

      {metric.trend !== undefined && (
        <Group gap={4} mt="xs">
          {metric.trend > 0 ? (
            <IconTrendingUp size={16} color={theme.colors.green[6]} />
          ) : (
            <IconTrendingDown size={16} color={theme.colors.red[6]} />
          )}
          <Text size="sm" c={metric.trend > 0 ? 'green' : 'red'}>
            {Math.abs(metric.trend)}%
          </Text>
        </Group>
      )}
    </Card>
  );
};

const RevenueChart: React.FC = () => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['Выручка', 'Продажи', 'Конверсия', 'ДРР'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      })
    },
    yAxis: [
      {
        type: 'value',
        name: 'Выручка (₽)',
        axisLabel: {
          formatter: (value: number) => formatCurrency(value)
        }
      },
      {
        type: 'value',
        name: 'Конверсия (%)',
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: 'Выручка',
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.1
        },
        data: Array.from({ length: 30 }, () => 1000000 + Math.random() * 500000),
        itemStyle: {
          color: '#339af0'
        }
      },
      {
        name: 'Продажи',
        type: 'bar',
        data: Array.from({ length: 30 }, () => 300 + Math.random() * 100),
        itemStyle: {
          color: '#51cf66'
        }
      },
      {
        name: 'Конверсия',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: Array.from({ length: 30 }, () => 2 + Math.random() * 1.5),
        itemStyle: {
          color: '#fab005'
        }
      },
      {
        name: 'ДРР',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: Array.from({ length: 30 }, () => 10 + Math.random() * 5),
        itemStyle: {
          color: '#ff6b6b'
        }
      }
    ]
  };
  
  return <ReactECharts option={option} style={{ height: '300px' }} />;
};

// Главный компонент дашборда
export default function MainPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useMantineTheme();
  
  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setAlerts(generateAlerts());
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const financialMetrics: MetricCard[] = [
    {
      id: 'revenue',
      title: 'ВЫРУЧКА',
      icon: <IconChartBar size={20} />,
      value: '1.34M₽',
      target: '1.5M₽',
      progress: 89,
      trend: 12,
      status: 'warning',
      subtitle: 'Отставание от плана на 11%',
      action: 'Детали'
    },
    {
      id: 'payment',
      title: 'К ПЕРЕЧИСЛЕНИЮ',
      icon: <IconCash size={20} />,
      value: '609,772₽',
      subtitle: 'Через 14 дней, в пути: 1.2M₽',
      action: 'График CF'
    },
    {
      id: 'margin',
      title: 'МАРЖА',
      icon: <IconPercentage size={20} />,
      value: '35%',
      target: '40%',
      progress: 87,
      status: 'danger',
      subtitle: '-5pp от цели',
      trend: -5,
      action: 'По SKU'
    },
    {
      id: 'profit',
      title: 'ПРИБЫЛЬ',
      icon: <IconCoins size={20} />,
      value: '189k₽',
      target: '215k₽',
      progress: 88,
      status: 'warning',
      action: 'P&L анализ'
    }
  ];
  
  const operationalMetrics: MetricCard[] = [
    {
      id: 'sales',
      title: 'ПРОДАЖИ',
      icon: <IconShoppingCart size={20} />,
      value: '342 шт',
      target: '385 шт',
      progress: 89,
      status: 'warning',
      action: 'Анализ'
    },
    {
      id: 'logistics',
      title: 'ЛОГИСТИКА',
      icon: <IconTruck size={20} />,
      value: '15.2%',
      target: '13%',
      status: 'danger',
      subtitle: '+234k₽ перерасход',
      trend: 2.2,
      action: 'Оптимизация'
    },
    {
      id: 'warehouse',
      title: 'СКЛАД',
      icon: <IconPackage size={20} />,
      value: '3 SKU',
      subtitle: 'Критично: 3, Внимание: 8',
      action: 'Детали'
    },
    {
      id: 'returns',
      title: 'ВОЗВРАТЫ',
      icon: <IconRotate size={20} />,
      value: '12%',
      target: '< 10%',
      status: 'warning',
      subtitle: 'Причины: размер 45%',
      trend: 2,
      action: 'Аналитика'
    }
  ];
  
  const marketingMetrics: MetricCard[] = [
    {
      id: 'ads',
      title: 'РЕКЛАМА',
      icon: <IconAd size={20} />,
      value: '145k₽',
      target: '120k₽',
      status: 'danger',
      subtitle: 'ДРР: 15.2%',
      trend: 20,
      action: 'По ключам'
    },
    {
      id: 'conversion',
      title: 'КОНВЕРСИЯ',
      icon: <IconTargetArrow size={20} />,
      value: '2.4%',
      target: '3.0%',
      progress: 80,
      status: 'warning',
      subtitle: 'CTR: 1.8%',
      action: 'Воронка'
    },
    {
      id: 'rating',
      title: 'РЕЙТИНГ',
      icon: <IconStar size={20} />,
      value: '4.3',
      subtitle: 'Нужно 5★: 45 для 4.8',
      action: 'Отзывы'
    },
    {
      id: 'marketShare',
      title: 'ДОЛЯ РЫНКА',
      icon: <IconChartDots size={20} />,
      value: '4.2%',
      subtitle: 'В нише, у ТОП-10: 2.6%',
      target: '5%',
      progress: 84,
      action: 'Конкуренты'
    }
  ];
  
  const navItems = [
    { value: 'home', label: 'Главная', icon: <IconHome size={16} /> },
    { value: 'analysis', label: 'Анализ товара', icon: <IconSearch size={16} /> },
    { value: 'competitors', label: 'Конкуренты', icon: <IconChartBar size={16} /> },
    { value: 'planning', label: 'Планирование', icon: <IconCalendar size={16} /> },
    { value: 'warehouse', label: 'Склад', icon: <IconPackage size={16} /> },
    { value: 'marketing', label: 'Маркетинг', icon: <IconAd size={16} /> },
    { value: 'reputation', label: 'Репутация', icon: <IconStar size={16} /> },
    { value: 'ai', label: 'AI-инсайты', icon: <IconBrain size={16} /> }
  ];
  
  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        {/* Заголовок и навигация */}
        <Group justify="space-between" mb="md">
          <Title order={2}>Главная</Title>
          <SegmentedControl
            value={activeTab}
            onChange={handleTabChange}
            data={navItems.map(item => ({
              value: item.value,
              label: (
                <Group gap={8}>
                  {item.icon}
                  <Text size="sm">{item.label}</Text>
                </Group>
              )
            }))}
          />
        </Group>

        {/* Основной контент */}
        <Grid>
          {/* Финансовые метрики */}
          <Grid.Col span={12}>
            <Grid>
              {financialMetrics.map((metric) => (
                <Grid.Col key={metric.id} span={3}>
                  <MetricCardComponent metric={metric} />
                </Grid.Col>
              ))}
            </Grid>
          </Grid.Col>

          {/* Операционные метрики */}
          <Grid.Col span={12}>
            <Grid>
              {operationalMetrics.map((metric) => (
                <Grid.Col key={metric.id} span={3}>
                  <MetricCardComponent metric={metric} />
                </Grid.Col>
              ))}
            </Grid>
          </Grid.Col>

          {/* Маркетинговые метрики */}
          <Grid.Col span={12}>
            <Grid>
              {marketingMetrics.map((metric) => (
                <Grid.Col key={metric.id} span={3}>
                  <MetricCardComponent metric={metric} />
                </Grid.Col>
              ))}
            </Grid>
          </Grid.Col>

          {/* График выручки */}
          <Grid.Col span={8}>
            <Card withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Text fw={500}>Динамика выручки</Text>
                  <Group gap={8}>
                    <ActionIcon variant="subtle" color="gray">
                      <IconRefresh size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="gray">
                      <IconDownload size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card.Section>
              <Card.Section p="md">
                <RevenueChart />
              </Card.Section>
            </Card>
          </Grid.Col>

          {/* Панель алертов */}
          <Grid.Col span={4}>
            <AlertsPanel alerts={alerts} />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}