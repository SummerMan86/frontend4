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
  chartData?: number[];
  unit?: string;
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
                borderLeft: `4px solid ${alert.type === 'critical' ? theme.colors.red[5] : theme.colors.yellow[6]}`
              }}
            >
              <Group justify="space-between">
                <Text fw={500} c={alert.type === 'critical' ? 'red.7' : 'yellow.7'}>
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

const MiniChart: React.FC<{ 
  data: number[]; 
  color: string;
  title: string;
  unit?: string;
}> = ({ data, color, title, unit }) => {
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date;
  });

  const formatValue = (value: number) => {
    if (unit === '₽') {
      return formatCurrency(value).replace('₽', '').trim();
    } else if (unit === '%') {
      return value.toFixed(1);
    } else if (unit === '★') {
      return value.toFixed(1);
    } else {
      return value.toLocaleString('ru-RU', { maximumFractionDigits: 1 });
    }
  };

  const option = {
    grid: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.1)',
          width: 1,
          type: 'solid'
        }
      },
      formatter: (params: any) => {
        const value = params[0].value;
        const date = dates[params[0].dataIndex];
        const formattedDate = date.toLocaleDateString('ru-RU', { 
          day: 'numeric', 
          month: 'short'
        });
        return [
          `<div style="font-weight: 500; margin-bottom: 4px;">${title}</div>`,
          `<div style="display: flex; justify-content: space-between; align-items: center;">`,
          `<span style="color: #666;">${formattedDate}</span>`,
          `<span style="font-weight: 500; margin-left: 16px;">${formatValue(value)}${unit || ''}</span>`,
          `</div>`
        ].join('');
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      textStyle: {
        color: '#333'
      },
      padding: [8, 12],
      extraCssText: 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);'
    },
    xAxis: {
      type: 'category',
      show: false,
      boundaryGap: false,
      data: dates.map(date => date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }))
    },
    yAxis: {
      type: 'value',
      show: false,
      min: 'dataMin',
      max: 'dataMax'
    },
    series: [
      {
        data: data,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        showSymbol: false,
        lineStyle: {
          color: color,
          width: 2
        },
        itemStyle: {
          color: color,
          borderWidth: 2,
          borderColor: '#fff'
        },
        emphasis: {
          scale: true,
          focus: 'series',
          itemStyle: {
            color: color,
            borderWidth: 2,
            borderColor: '#fff'
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: color
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }
            ]
          }
        }
      }
    ]
  };

  return (
    <Box 
      onMouseEnter={(e) => {
        const chart = e.currentTarget.querySelector('div');
        if (chart) {
          chart.style.cursor = 'pointer';
        }
      }}
    >
      <ReactECharts 
        option={option} 
        style={{ height: '50px', width: '100%' }} 
        opts={{ renderer: 'svg' }}
      />
    </Box>
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

  const getChartColor = (status?: string) => {
    switch (status) {
      case 'success':
        return theme.colors.green[6];
      case 'warning':
        return theme.colors.yellow[6];
      case 'danger':
        return theme.colors.red[6];
      default:
        return theme.colors.blue[6];
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

      {metric.chartData && (
        <Box mt="xs">
          <MiniChart 
            data={metric.chartData} 
            color={getChartColor(metric.status)} 
            title={metric.title}
            unit={metric.unit}
          />
        </Box>
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

  const financialMetrics: MetricCard[] = [
    {
      id: 'revenue',
      title: 'Выручка',
      icon: <IconChartBar size={20} />,
      value: '1.34M₽',
      target: '1.5M₽',
      progress: 89,
      trend: 12,
      status: 'warning',
      subtitle: 'Отставание от плана на 11%',
      action: 'Детали',
      chartData: Array.from({ length: 30 }, () => 1000000 + Math.random() * 500000),
      unit: '₽'
    },
    {
      id: 'payment',
      title: 'К перечислению',
      icon: <IconCash size={20} />,
      value: '609,772₽',
      subtitle: 'Через 14 дней, в пути: 1.2M₽',
      action: 'График CF',
      chartData: Array.from({ length: 30 }, () => 500000 + Math.random() * 300000),
      unit: '₽'
    },
    {
      id: 'margin',
      title: 'Маржа',
      icon: <IconPercentage size={20} />,
      value: '35%',
      target: '40%',
      progress: 87,
      status: 'danger',
      subtitle: '-5pp от цели',
      trend: -5,
      action: 'По SKU',
      chartData: Array.from({ length: 30 }, () => 30 + Math.random() * 10),
      unit: '%'
    },
    {
      id: 'profit',
      title: 'Прибыль',
      icon: <IconCoins size={20} />,
      value: '189k₽',
      target: '215k₽',
      progress: 88,
      status: 'warning',
      action: 'P&L анализ',
      chartData: Array.from({ length: 30 }, () => 150000 + Math.random() * 100000),
      unit: '₽'
    }
  ];
  
  const operationalMetrics: MetricCard[] = [
    {
      id: 'sales',
      title: 'Продажи',
      icon: <IconShoppingCart size={20} />,
      value: '342 шт',
      target: '385 шт',
      progress: 89,
      status: 'warning',
      action: 'Анализ',
      chartData: Array.from({ length: 30 }, () => 300 + Math.random() * 100),
      unit: ' шт'
    },
    {
      id: 'logistics',
      title: 'Логистика',
      icon: <IconTruck size={20} />,
      value: '15.2%',
      target: '13%',
      status: 'danger',
      subtitle: '+234k₽ перерасход',
      trend: 2.2,
      action: 'Оптимизация',
      chartData: Array.from({ length: 30 }, () => 12 + Math.random() * 5),
      unit: '%'
    },
    {
      id: 'warehouse',
      title: 'Склад',
      icon: <IconPackage size={20} />,
      value: '3 SKU',
      subtitle: 'Критично: 3, Внимание: 8',
      action: 'Детали',
      chartData: Array.from({ length: 30 }, () => 2 + Math.random() * 5),
      unit: ' SKU'
    },
    {
      id: 'returns',
      title: 'Возвраты',
      icon: <IconRotate size={20} />,
      value: '12%',
      target: '< 10%',
      status: 'warning',
      subtitle: 'Причины: размер 45%',
      trend: 2,
      action: 'Аналитика',
      chartData: Array.from({ length: 30 }, () => 8 + Math.random() * 6),
      unit: '%'
    }
  ];
  
  const marketingMetrics: MetricCard[] = [
    {
      id: 'ads',
      title: 'Реклама',
      icon: <IconAd size={20} />,
      value: '145k₽',
      target: '120k₽',
      status: 'danger',
      subtitle: 'ДРР: 15.2%',
      trend: 20,
      action: 'По ключам',
      chartData: Array.from({ length: 30 }, () => 100000 + Math.random() * 50000),
      unit: '₽'
    },
    {
      id: 'conversion',
      title: 'Конверсия',
      icon: <IconTargetArrow size={20} />,
      value: '2.4%',
      target: '3.0%',
      progress: 80,
      status: 'warning',
      subtitle: 'CTR: 1.8%',
      action: 'Воронка',
      chartData: Array.from({ length: 30 }, () => 2 + Math.random() * 1),
      unit: '%'
    },
    {
      id: 'rating',
      title: 'Рейтинг',
      icon: <IconStar size={20} />,
      value: '4.3',
      subtitle: 'Нужно 5★: 45 для 4.8',
      action: 'Отзывы',
      chartData: Array.from({ length: 30 }, () => 4 + Math.random() * 0.5),
      unit: '★'
    },
    {
      id: 'marketShare',
      title: 'Доля рынка',
      icon: <IconChartDots size={20} />,
      value: '4.2%',
      subtitle: 'В нише, у ТОП-10: 2.6%',
      target: '5%',
      progress: 84,
      action: 'Конкуренты',
      chartData: Array.from({ length: 30 }, () => 3.5 + Math.random() * 1),
      unit: '%'
    }
  ];
  
  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        {/* Заголовок */}
        <Title order={2}>Главная</Title>

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