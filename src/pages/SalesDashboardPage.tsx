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
  Table,
  ScrollArea,
  Avatar,
  Indicator,
  Menu,
  UnstyledButton,
  Center,
  rem,
  useMantineTheme,
  Skeleton,
  Transition,
  HoverCard,
  Anchor,
  BackgroundImage,
  Overlay,
} from '@mantine/core';
import { DatePickerInput, DateInput } from '@mantine/dates';
import { useDisclosure, useHover } from '@mantine/hooks';
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
  IconFilter,
  IconDots,
  IconChevronRight,
  IconChevronDown,
  IconAlertCircle,
  IconCircleCheck,
  IconClock,
  IconTruck,
  IconBuildingStore,
  IconUsers,
  IconCoin,
  IconReceipt,
  IconPercentage,
  IconArrowUpRight,
  IconArrowDownRight,
  IconDatabase,
  IconChartDots,
  IconChartPie,
  IconMap,
  IconCalendarStats,
  IconTarget,
  IconEye,
  IconShoppingBag,
  IconBox,
  IconTags,
  IconBarcode,
  IconCurrencyRubel,
  IconBrandGoogleAnalytics,
  IconAd,
  IconGavel,
  IconLeaf,
  IconChartAreaLine,
  IconChartHistogram,
  IconChartInfographic,
  IconReportAnalytics,
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

// Расширенные типы данных
interface DetailedOrderData {
  orderId: string;
  date: string;
  barcode: string;
  sku: string;
  productName: string;
  size: string;
  region: string;
  priceBeforeSPP: number;
  priceAfterSPP: number;
  commission: number;
  spp: number;
  status: 'order' | 'purchase' | 'return' | 'rejection' | 'defect';
  source: 'organic' | 'ark' | 'auction';
  selfPurchase: boolean;
}

interface ProductAnalytics {
  sku: string;
  name: string;
  activeSKU: number;
  zeroStock: number;
  turnoverLess14: number;
  turnoverMore60: number;
  costMore60: number;
  abcCategory: 'A' | 'B' | 'C';
  sales: number;
  revenue: number;
}

interface SourceMetrics {
  source: string;
  orders: number;
  purchases: number;
  revenue: number;
  conversion: number;
  cpa?: number;
  avgBid?: number;
}

interface RegionData {
  region: string;
  orders: number;
  revenue: number;
  avgCheck: number;
}

// Генерация расширенных демо-данных
const generateDetailedDemoData = (startDate: Date, endDate: Date): DetailedOrderData[] => {
  const data: DetailedOrderData[] = [];
  const days = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
  const regions = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Краснодар'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const sources: ('organic' | 'ark' | 'auction')[] = ['organic', 'ark', 'auction'];
  const statuses: DetailedOrderData['status'][] = ['order', 'purchase', 'return', 'rejection', 'defect'];
  
  for (let i = 0; i < days * 150; i++) {
    const date = dayjs(startDate).add(Math.floor(Math.random() * days), 'day');
    const priceBeforeSPP = Math.floor(Math.random() * 5000) + 1000;
    const sppPercent = Math.random() * 0.3; // до 30% скидка
    const priceAfterSPP = priceBeforeSPP * (1 - sppPercent);
    const commission = priceAfterSPP * 0.15; // 15% комиссия WB
    
    data.push({
      orderId: `WB${100000 + i}`,
      date: date.format('YYYY-MM-DD'),
      barcode: `460${Math.floor(Math.random() * 1000000)}`,
      sku: `SKU-${Math.floor(Math.random() * 100)}`,
      productName: `Товар ${Math.floor(Math.random() * 100)}`,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      priceBeforeSPP,
      priceAfterSPP,
      commission,
      spp: priceBeforeSPP - priceAfterSPP,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      selfPurchase: Math.random() < 0.05, // 5% самовыкупов
    });
  }
  
  return data;
};

// Компонент метрики с анимацией
const MetricCard: React.FC<{
  title: string;
  value: number | string;
  previousValue?: number | string;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  onClick?: () => void;
  isLoading?: boolean;
  hint?: string;
}> = ({ title, value, previousValue, unit, icon, color, trend, subtitle, onClick, isLoading, hint }) => {
  const theme = useMantineTheme();
  const { hovered, ref } = useHover();
  
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^\d.-]/g, ''));
  const numericPreviousValue = typeof previousValue === 'number' 
    ? previousValue 
    : previousValue 
    ? parseFloat(previousValue.toString().replace(/[^\d.-]/g, '')) 
    : 0;
  
  const change = previousValue && numericPreviousValue !== 0
    ? ((numericValue - numericPreviousValue) / Math.abs(numericPreviousValue)) * 100
    : 0;

  const getTrendIcon = () => {
    if (change > 0) return <IconArrowUpRight size={16} />;
    if (change < 0) return <IconArrowDownRight size={16} />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'neutral') return 'gray';
    if (change > 0) return trend === 'down' ? 'red' : 'green';
    if (change < 0) return trend === 'down' ? 'green' : 'red';
    return 'gray';
  };

  return (
    <Card
      ref={ref}
      shadow={hovered ? 'md' : 'sm'}
      radius="lg"
      withBorder
      p="lg"
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        borderColor: hovered ? theme.colors[color][3] : undefined,
      }}
      onClick={onClick}
    >
      <Group justify="space-between" mb="sm">
        <ThemeIcon
          size="xl"
          radius="xl"
          variant="light"
          color={color}
          style={{ transition: 'all 0.2s ease' }}
        >
          {icon}
        </ThemeIcon>
        
        {hint && (
          <Tooltip label={hint} position="top" withArrow>
            <ActionIcon variant="subtle" color="gray" size="sm">
              <IconInfoCircle size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>

      <Text size="sm" c="dimmed" fw={600} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
        {title}
      </Text>

      {isLoading ? (
        <Skeleton height={40} mt="sm" radius="sm" />
      ) : (
        <>
          <Group align="baseline" gap={4} mt="xs">
            <Title order={2} style={{ fontSize: rem(28), fontWeight: 700 }}>
              {typeof value === 'number' ? (
                <NumberFormatter value={value} thousandSeparator=" " decimalScale={2} />
              ) : (
                value
              )}
            </Title>
            {unit && (
              <Text size="lg" c="dimmed" fw={500}>
                {unit}
              </Text>
            )}
          </Group>

          {subtitle && (
            <Text size="xs" c="dimmed" mt={4}>
              {subtitle}
            </Text>
          )}

          {change !== 0 && (
            <Group gap={4} mt="sm">
              <Badge
                size="lg"
                variant="light"
                color={getTrendColor()}
                leftSection={getTrendIcon()}
                style={{ paddingLeft: 8, paddingRight: 12 }}
              >
                {Math.abs(change).toFixed(1)}%
              </Badge>
              {previousValue && (
                <Text size="xs" c="dimmed">
                  было: {typeof previousValue === 'number' 
                    ? previousValue.toLocaleString('ru-RU') 
                    : previousValue} {unit}
                </Text>
              )}
            </Group>
          )}
        </>
      )}
    </Card>
  );
};

// Компонент воронки продаж
const SalesFunnel: React.FC<{ data: any }> = ({ data }) => {
  const funnelData = [
    { 
      name: 'Заказы', 
      value: data.totalOrders, 
      icon: <IconShoppingCart size={20} />,
      color: 'blue',
      details: {
        beforeSPP: data.ordersAmountBeforeSPP,
        afterSPP: data.ordersAmountAfterSPP,
        avgCheck: data.avgOrderValue,
      }
    },
    { 
      name: 'Выкупы', 
      value: data.totalPurchases,
      icon: <IconPackage size={20} />,
      color: 'green',
      details: {
        beforeSPP: data.purchasesAmountBeforeSPP,
        afterSPP: data.purchasesAmountAfterSPP,
        conversion: (data.totalPurchases / data.totalOrders * 100).toFixed(1),
        selfPurchases: data.selfPurchases,
      }
    },
    { 
      name: 'Без возвратов', 
      value: data.totalPurchases - data.totalReturns,
      icon: <IconCircleCheck size={20} />,
      color: 'teal',
      details: {
        returns: data.totalReturns,
        returnRate: (data.totalReturns / data.totalPurchases * 100).toFixed(1),
      }
    },
    { 
      name: 'Успешные', 
      value: data.totalPurchases - data.totalReturns - data.totalDefects,
      icon: <IconTrendingUp size={20} />,
      color: 'violet',
      details: {
        defects: data.totalDefects,
        rejections: data.totalRejections,
      }
    },
  ];

  return (
    <Card shadow="sm" radius="lg" withBorder h="100%">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={4}>Воронка продаж</Title>
          <Text size="sm" c="dimmed">Конверсия на каждом этапе</Text>
        </div>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconDownload size={16} />}>
              Экспорт данных
            </Menu.Item>
            <Menu.Item leftSection={<IconChartBar size={16} />}>
              Детальный отчет
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Stack gap="md">
        {funnelData.map((stage, index) => {
          const percentage = index === 0 ? 100 : (stage.value / funnelData[0].value) * 100;
          const previousPercentage = index === 0 ? 100 : (funnelData[index - 1].value / funnelData[0].value) * 100;
          const conversion = index > 0 ? (stage.value / funnelData[index - 1].value) * 100 : 100;

          return (
            <Paper key={stage.name} p="md" radius="md" withBorder bg="gray.0">
              <Group justify="space-between" mb="xs">
                <Group gap="sm">
                  <ThemeIcon size="lg" radius="md" variant="light" color={stage.color}>
                    {stage.icon}
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>{stage.name}</Text>
                    <Group gap="xs">
                      <Text size="xl" fw={700}>
                        <NumberFormatter value={stage.value} thousandSeparator=" " />
                      </Text>
                      {index > 0 && (
                        <Badge variant="light" color={stage.color}>
                          {conversion.toFixed(1)}% конверсия
                        </Badge>
                      )}
                    </Group>
                  </div>
                </Group>
                
                <Text size="lg" fw={700} c={stage.color}>
                  {percentage.toFixed(1)}%
                </Text>
              </Group>

              <Progress
                value={percentage}
                color={stage.color}
                size="xl"
                radius="md"
                style={{ marginTop: 12 }}
              />

              {stage.details && (
                <Group gap="xs" mt="sm">
                  {stage.details.beforeSPP && (
                    <Text size="xs" c="dimmed">
                      До СПП: <Text span fw={600}>{stage.details.beforeSPP.toLocaleString('ru-RU')} ₽</Text>
                    </Text>
                  )}
                  {stage.details.afterSPP && (
                    <Text size="xs" c="dimmed">
                      После СПП: <Text span fw={600}>{stage.details.afterSPP.toLocaleString('ru-RU')} ₽</Text>
                    </Text>
                  )}
                  {stage.details.selfPurchases !== undefined && (
                    <Badge size="sm" variant="dot" color="orange">
                      Самовыкупы: {stage.details.selfPurchases}
                    </Badge>
                  )}
                </Group>
              )}
            </Paper>
          );
        })}
      </Stack>

      <Divider my="lg" />
      
      <SimpleGrid cols={2} spacing="sm">
        <Paper p="sm" radius="md" bg="red.0">
          <Group gap="xs">
            <IconBan size={16} color="red" />
            <Text size="sm" fw={500}>Отказы</Text>
          </Group>
          <Text size="lg" fw={700}>{data.totalRejections}</Text>
          <Text size="xs" c="dimmed">{(data.totalRejections / data.totalOrders * 100).toFixed(1)}% от заказов</Text>
        </Paper>
        
        <Paper p="sm" radius="md" bg="orange.0">
          <Group gap="xs">
            <IconAlertCircle size={16} color="orange" />
            <Text size="sm" fw={500}>Брак</Text>
          </Group>
          <Text size="lg" fw={700}>{data.totalDefects}</Text>
          <Text size="xs" c="dimmed">{(data.totalDefects / data.totalPurchases * 100).toFixed(1)}% от выкупов</Text>
        </Paper>
      </SimpleGrid>
    </Card>
  );
};

// Компонент источников трафика
const TrafficSources: React.FC<{ data: SourceMetrics[] }> = ({ data }) => {
  const totalOrders = data.reduce((sum, source) => sum + source.orders, 0);
  
  const chartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Заказы', 'Выкупы'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.source)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Заказы',
        type: 'bar',
        data: data.map(d => d.orders),
        itemStyle: { color: '#1c7ed6' }
      },
      {
        name: 'Выкупы',
        type: 'bar',
        data: data.map(d => d.purchases),
        itemStyle: { color: '#37b24d' }
      }
    ]
  };

  return (
    <Card shadow="sm" radius="lg" withBorder h="100%">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={4}>Источники трафика</Title>
          <Text size="sm" c="dimmed">Эффективность каналов привлечения</Text>
        </div>
      </Group>

      <ReactECharts option={chartOption} style={{ height: '250px' }} />

      <Stack gap="sm" mt="lg">
        {data.map((source) => {
          const percentage = (source.orders / totalOrders) * 100;
          const icon = source.source === 'Органика' ? <IconLeaf /> 
            : source.source === 'АРК' ? <IconAd /> 
            : <IconGavel />;
          const color = source.source === 'Органика' ? 'green' 
            : source.source === 'АРК' ? 'blue' 
            : 'violet';

          return (
            <Paper key={source.source} p="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Group gap="sm">
                  <ThemeIcon size="md" radius="md" variant="light" color={color}>
                    {icon}
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>{source.source}</Text>
                    <Text size="xs" c="dimmed">
                      {source.orders} заказов • {source.purchases} выкупов
                    </Text>
                  </div>
                </Group>
                <Badge size="lg" variant="light" color={color}>
                  {source.conversion.toFixed(1)}%
                </Badge>
              </Group>

              <Progress value={percentage} color={color} size="sm" radius="md" />
              
              <Group gap="xl" mt="sm">
                <div>
                  <Text size="xs" c="dimmed">Выручка</Text>
                  <Text fw={600}>{source.revenue.toLocaleString('ru-RU')} ₽</Text>
                </div>
                {source.cpa && (
                  <div>
                    <Text size="xs" c="dimmed">CPA</Text>
                    <Text fw={600}>{source.cpa.toFixed(0)} ₽</Text>
                  </div>
                )}
                {source.avgBid && (
                  <div>
                    <Text size="xs" c="dimmed">Ср. ставка</Text>
                    <Text fw={600}>{source.avgBid.toFixed(2)} ₽</Text>
                  </div>
                )}
              </Group>
            </Paper>
          );
        })}
      </Stack>
    </Card>
  );
};

// Главный компонент дашборда
const SalesDashboardPage: React.FC = () => {
  const theme = useMantineTheme();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    dayjs().subtract(30, 'day').toDate(),
    dayjs().toDate(),
  ]);
  const [compareDateRange, setCompareDateRange] = useState<[Date | null, Date | null]>([
    dayjs().subtract(60, 'day').toDate(),
    dayjs().subtract(31, 'day').toDate(),
  ]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Генерация детальных данных
  const detailedData = useMemo(() => {
    if (!dateRange[0] || !dateRange[1]) return [];
    return generateDetailedDemoData(dateRange[0], dateRange[1]);
  }, [dateRange]);

  const compareDetailedData = useMemo(() => {
    if (!compareDateRange[0] || !compareDateRange[1]) return [];
    return generateDetailedDemoData(compareDateRange[0], compareDateRange[1]);
  }, [compareDateRange]);

  // Расчет всех метрик
  const metrics = useMemo(() => {
    const calculateMetrics = (data: DetailedOrderData[]) => {
      const orders = data.filter(d => d.status === 'order' || d.status === 'purchase');
      const purchases = data.filter(d => d.status === 'purchase');
      const returns = data.filter(d => d.status === 'return');
      const rejections = data.filter(d => d.status === 'rejection');
      const defects = data.filter(d => d.status === 'defect');
      const selfPurchases = purchases.filter(d => d.selfPurchase);

      const ordersAmountBeforeSPP = orders.reduce((sum, d) => sum + d.priceBeforeSPP, 0);
      const ordersAmountAfterSPP = orders.reduce((sum, d) => sum + d.priceAfterSPP, 0);
      const purchasesAmountBeforeSPP = purchases.reduce((sum, d) => sum + d.priceBeforeSPP, 0);
      const purchasesAmountAfterSPP = purchases.reduce((sum, d) => sum + d.priceAfterSPP, 0);
      const totalCommission = purchases.reduce((sum, d) => sum + d.commission, 0);
      const totalSPP = orders.reduce((sum, d) => sum + d.spp, 0);

      // Источники трафика
      const sourceMetrics: SourceMetrics[] = ['organic', 'ark', 'auction'].map(source => {
        const sourceOrders = orders.filter(d => d.source === source);
        const sourcePurchases = purchases.filter(d => d.source === source);
        const sourceRevenue = sourcePurchases.reduce((sum, d) => sum + d.priceAfterSPP, 0);
        
        return {
          source: source === 'organic' ? 'Органика' : source === 'ark' ? 'АРК' : 'Аукцион',
          orders: sourceOrders.length,
          purchases: sourcePurchases.length,
          revenue: sourceRevenue,
          conversion: sourceOrders.length > 0 ? (sourcePurchases.length / sourceOrders.length) * 100 : 0,
          cpa: source !== 'organic' ? Math.random() * 500 + 100 : undefined,
          avgBid: source === 'auction' ? Math.random() * 50 + 10 : undefined,
        };
      });

      // География
      const regionData: RegionData[] = Array.from(new Set(data.map(d => d.region))).map(region => {
        const regionOrders = orders.filter(d => d.region === region);
        const regionRevenue = regionOrders.reduce((sum, d) => sum + d.priceAfterSPP, 0);
        
        return {
          region,
          orders: regionOrders.length,
          revenue: regionRevenue,
          avgCheck: regionOrders.length > 0 ? regionRevenue / regionOrders.length : 0,
        };
      });

      // SKU аналитика
      const skuMap = new Map<string, ProductAnalytics>();
      data.forEach(d => {
        if (!skuMap.has(d.sku)) {
          skuMap.set(d.sku, {
            sku: d.sku,
            name: d.productName,
            activeSKU: Math.floor(Math.random() * 100),
            zeroStock: Math.floor(Math.random() * 10),
            turnoverLess14: Math.floor(Math.random() * 20),
            turnoverMore60: Math.floor(Math.random() * 5),
            costMore60: Math.floor(Math.random() * 100000),
            abcCategory: Math.random() < 0.2 ? 'A' : Math.random() < 0.5 ? 'B' : 'C',
            sales: 0,
            revenue: 0,
          });
        }
        const product = skuMap.get(d.sku)!;
        if (d.status === 'purchase') {
          product.sales++;
          product.revenue += d.priceAfterSPP;
        }
      });

      return {
        totalOrders: orders.length,
        totalPurchases: purchases.length,
        totalReturns: returns.length,
        totalRejections: rejections.length,
        totalDefects: defects.length,
        selfPurchases: selfPurchases.length,
        ordersAmountBeforeSPP,
        ordersAmountAfterSPP,
        purchasesAmountBeforeSPP,
        purchasesAmountAfterSPP,
        totalCommission,
        totalSPP,
        avgOrderValue: orders.length > 0 ? ordersAmountAfterSPP / orders.length : 0,
        avgPurchaseValue: purchases.length > 0 ? purchasesAmountAfterSPP / purchases.length : 0,
        conversionRate: orders.length > 0 ? (purchases.length / orders.length) * 100 : 0,
        returnRate: purchases.length > 0 ? (returns.length / purchases.length) * 100 : 0,
        rejectionRate: orders.length > 0 ? (rejections.length / orders.length) * 100 : 0,
        defectRate: purchases.length > 0 ? (defects.length / purchases.length) * 100 : 0,
        netRevenue: purchasesAmountAfterSPP - totalCommission - returns.reduce((sum, d) => sum + d.priceAfterSPP, 0),
        sourceMetrics,
        regionData,
        productAnalytics: Array.from(skuMap.values()),
      };
    };

    return {
      current: calculateMetrics(detailedData),
      previous: calculateMetrics(compareDetailedData),
    };
  }, [detailedData, compareDetailedData]);

  // Данные для графиков динамики
  const timeSeriesData = useMemo(() => {
    const groupByDate = (data: DetailedOrderData[]) => {
      const grouped = new Map<string, {
        orders: number;
        purchases: number;
        returns: number;
        revenue: number;
      }>();

      data.forEach(d => {
        if (!grouped.has(d.date)) {
          grouped.set(d.date, { orders: 0, purchases: 0, returns: 0, revenue: 0 });
        }
        const day = grouped.get(d.date)!;
        
        if (d.status === 'order' || d.status === 'purchase') day.orders++;
        if (d.status === 'purchase') {
          day.purchases++;
          day.revenue += d.priceAfterSPP;
        }
        if (d.status === 'return') day.returns++;
      });

      return Array.from(grouped.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, data]) => ({ date, ...data }));
    };

    return {
      current: groupByDate(detailedData),
      previous: groupByDate(compareDetailedData),
    };
  }, [detailedData, compareDetailedData]);

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Шапка дашборда */}
      <Paper shadow="sm" p="lg" radius={0} style={{ borderBottom: `1px solid ${theme.colors.gray[2]}` }}>
        <Container size="xl">
          <Group justify="space-between">
            <div>
              <Title order={2} fw={700}>Аналитика продаж Wildberries</Title>
              <Group gap="xs" mt={4}>
                <Badge size="lg" variant="dot" color="green">
                  Обновлено {dayjs().format('HH:mm')}
                </Badge>
                <Text size="sm" c="dimmed">
                  {dateRange[0] && dateRange[1] && 
                    `${dayjs(dateRange[0]).format('D MMM')} — ${dayjs(dateRange[1]).format('D MMM YYYY')}`
                  }
                </Text>
              </Group>
            </div>

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
                style={{ width: 280 }}
              />
              
              <DatePickerInput
                type="range"
                label="Сравнить с"
                placeholder="Период для сравнения"
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
                style={{ width: 280 }}
              />

              <Button
                leftSection={<IconFilter size={16} />}
                variant="default"
                mt="xl"
              >
                Фильтры
              </Button>

              <Button
                leftSection={<IconRefresh size={16} />}
                variant="light"
                mt="xl"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 1000);
                }}
                loading={isLoading}
              >
                Обновить
              </Button>
            </Group>
          </Group>
        </Container>
      </Paper>

      <Container size="xl" py="xl">
        {/* Навигация по разделам */}
        <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconChartInfographic size={16} />}>
              Обзор
            </Tabs.Tab>
            <Tabs.Tab value="funnel" leftSection={<IconChartBar size={16} />}>
              Воронка продаж
            </Tabs.Tab>
            <Tabs.Tab value="sources" leftSection={<IconBrandGoogleAnalytics size={16} />}>
              Источники
            </Tabs.Tab>
            <Tabs.Tab value="products" leftSection={<IconBox size={16} />}>
              Товары
            </Tabs.Tab>
            <Tabs.Tab value="geography" leftSection={<IconMap size={16} />}>
              География
            </Tabs.Tab>
            <Tabs.Tab value="dynamics" leftSection={<IconChartAreaLine size={16} />}>
              Динамика
            </Tabs.Tab>
            <Tabs.Tab value="plan-fact" leftSection={<IconTarget size={16} />}>
              План-факт
            </Tabs.Tab>
          </Tabs.List>

          {/* Вкладка: Обзор */}
          <Tabs.Panel value="overview" pt="xl">
            {/* Основные KPI метрики */}
            <Title order={4} mb="md">Ключевые показатели</Title>
            <Grid mb="xl">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Заказы"
                  value={metrics.current.totalOrders}
                  previousValue={metrics.previous.totalOrders}
                  unit="шт"
                  icon={<IconShoppingCart size={24} />}
                  color="blue"
                  subtitle={`${metrics.current.ordersAmountAfterSPP.toLocaleString('ru-RU')} ₽`}
                  hint="Общее количество оформленных заказов"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Выкупы"
                  value={metrics.current.totalPurchases}
                  previousValue={metrics.previous.totalPurchases}
                  unit="шт"
                  icon={<IconPackage size={24} />}
                  color="green"
                  subtitle={`${metrics.current.purchasesAmountAfterSPP.toLocaleString('ru-RU')} ₽`}
                  hint="Подтвержденные покупки"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Конверсия"
                  value={`${metrics.current.conversionRate.toFixed(1)}%`}
                  previousValue={`${metrics.previous.conversionRate.toFixed(1)}%`}
                  icon={<IconChartBar size={24} />}
                  color="violet"
                  hint="Процент выкупов от заказов"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Средний чек"
                  value={metrics.current.avgPurchaseValue}
                  previousValue={metrics.previous.avgPurchaseValue}
                  unit="₽"
                  icon={<IconReceipt size={24} />}
                  color="teal"
                  hint="Средняя сумма выкупа"
                />
              </Grid.Col>
            </Grid>

            {/* Финансовые показатели */}
            <Title order={4} mb="md">Финансовые показатели</Title>
            <Grid mb="xl">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Сумма до СПП"
                  value={metrics.current.purchasesAmountBeforeSPP}
                  previousValue={metrics.previous.purchasesAmountBeforeSPP}
                  unit="₽"
                  icon={<IconCoin size={24} />}
                  color="yellow"
                  hint="Сумма выкупов до применения СПП"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Сумма после СПП"
                  value={metrics.current.purchasesAmountAfterSPP}
                  previousValue={metrics.previous.purchasesAmountAfterSPP}
                  unit="₽"
                  icon={<IconCurrencyRubel size={24} />}
                  color="orange"
                  hint="Сумма выкупов после скидки СПП"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Комиссия WB"
                  value={metrics.current.totalCommission}
                  previousValue={metrics.previous.totalCommission}
                  unit="₽"
                  icon={<IconPercentage size={24} />}
                  color="red"
                  trend="down"
                  hint="Общая сумма комиссии маркетплейса"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="К получению"
                  value={metrics.current.netRevenue}
                  previousValue={metrics.previous.netRevenue}
                  unit="₽"
                  icon={<IconTrendingUp size={24} />}
                  color="green"
                  hint="Фактическая сумма к перечислению"
                />
              </Grid.Col>
            </Grid>

            {/* Проблемные показатели */}
            <Title order={4} mb="md">Проблемные показатели</Title>
            <Grid mb="xl">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Возвраты"
                  value={metrics.current.totalReturns}
                  previousValue={metrics.previous.totalReturns}
                  unit="шт"
                  icon={<IconArrowBack size={24} />}
                  color="orange"
                  trend="down"
                  subtitle={`${metrics.current.returnRate.toFixed(1)}% от выкупов`}
                  hint="Количество возвращенных товаров"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Отказы"
                  value={metrics.current.totalRejections}
                  previousValue={metrics.previous.totalRejections}
                  unit="шт"
                  icon={<IconBan size={24} />}
                  color="red"
                  trend="down"
                  subtitle={`${metrics.current.rejectionRate.toFixed(1)}% от заказов`}
                  hint="Количество отмененных заказов"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Брак"
                  value={metrics.current.totalDefects}
                  previousValue={metrics.previous.totalDefects}
                  unit="шт"
                  icon={<IconAlertCircle size={24} />}
                  color="red"
                  trend="down"
                  subtitle={`${metrics.current.defectRate.toFixed(1)}% от выкупов`}
                  hint="Товары с дефектами"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Самовыкупы"
                  value={metrics.current.selfPurchases}
                  previousValue={metrics.previous.selfPurchases}
                  unit="шт"
                  icon={<IconUsers size={24} />}
                  color="gray"
                  trend="neutral"
                  subtitle={`${(metrics.current.selfPurchases / metrics.current.totalPurchases * 100).toFixed(1)}% от выкупов`}
                  hint="Покупки для поддержания рейтинга"
                />
              </Grid.Col>
            </Grid>

            {/* Сводные графики */}
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" radius="lg" withBorder>
                  <Title order={4} mb="lg">Динамика основных показателей</Title>
                  <ReactECharts
                    option={{
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'cross'
                        }
                      },
                      legend: {
                        data: ['Заказы', 'Выкупы', 'Выручка'],
                        bottom: 0
                      },
                      grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '15%',
                        containLabel: true
                      },
                      xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: timeSeriesData.current.map(d => dayjs(d.date).format('DD.MM'))
                      },
                      yAxis: [
                        {
                          type: 'value',
                          name: 'Количество',
                          position: 'left'
                        },
                        {
                          type: 'value',
                          name: 'Выручка (₽)',
                          position: 'right',
                          axisLabel: {
                            formatter: (value: number) => `${(value / 1000).toFixed(0)}к`
                          }
                        }
                      ],
                      series: [
                        {
                          name: 'Заказы',
                          type: 'line',
                          smooth: true,
                          data: timeSeriesData.current.map(d => d.orders),
                          itemStyle: { color: '#1c7ed6' }
                        },
                        {
                          name: 'Выкупы',
                          type: 'line',
                          smooth: true,
                          data: timeSeriesData.current.map(d => d.purchases),
                          itemStyle: { color: '#37b24d' }
                        },
                        {
                          name: 'Выручка',
                          type: 'line',
                          smooth: true,
                          yAxisIndex: 1,
                          data: timeSeriesData.current.map(d => d.revenue),
                          itemStyle: { color: '#f59f00' },
                          areaStyle: {
                            opacity: 0.1
                          }
                        }
                      ]
                    }}
                    style={{ height: '400px' }}
                  />
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" radius="lg" withBorder>
                  <Title order={4} mb="lg">Топ-5 регионов</Title>
                  <Stack gap="sm">
                    {metrics.current.regionData
                      .sort((a, b) => b.revenue - a.revenue)
                      .slice(0, 5)
                      .map((region, index) => (
                        <Paper key={region.region} p="sm" radius="md" withBorder>
                          <Group justify="space-between">
                            <Group gap="sm">
                              <Avatar color="blue" radius="xl">
                                {index + 1}
                              </Avatar>
                              <div>
                                <Text fw={600}>{region.region}</Text>
                                <Text size="xs" c="dimmed">
                                  {region.orders} заказов • {region.avgCheck.toFixed(0)} ₽ ср.чек
                                </Text>
                              </div>
                            </Group>
                            <Text fw={700} size="lg">
                              {(region.revenue / 1000).toFixed(0)}к ₽
                            </Text>
                          </Group>
                        </Paper>
                      ))}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* Вкладка: Воронка продаж */}
          <Tabs.Panel value="funnel" pt="xl">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <SalesFunnel data={metrics.current} />
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" radius="lg" withBorder h="100%">
                  <Title order={4} mb="lg">Детализация воронки</Title>
                  
                  <Stack gap="lg">
                    <Paper p="lg" radius="md" bg="blue.0">
                      <Group justify="space-between" mb="md">
                        <Text fw={600} size="lg">Заказы → Выкупы</Text>
                        <Badge size="xl" variant="filled" color="blue">
                          {metrics.current.conversionRate.toFixed(1)}%
                        </Badge>
                      </Group>
                      <Progress
                        value={metrics.current.conversionRate}
                        size="xl"
                        radius="md"
                        color="blue"
                        style={{ marginBottom: 8 }}
                      />
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          {metrics.current.totalOrders} заказов
                        </Text>
                        <Text size="sm" c="dimmed">
                          {metrics.current.totalPurchases} выкупов
                        </Text>
                      </Group>
                    </Paper>

                    <Paper p="lg" radius="md" bg="orange.0">
                      <Group justify="space-between" mb="md">
                        <Text fw={600} size="lg">Возвраты от выкупов</Text>
                        <Badge size="xl" variant="filled" color="orange">
                          {metrics.current.returnRate.toFixed(1)}%
                        </Badge>
                      </Group>
                      <Progress
                        value={metrics.current.returnRate}
                        size="xl"
                        radius="md"
                        color="orange"
                        style={{ marginBottom: 8 }}
                      />
                      <Text size="sm" c="dimmed">
                        {metrics.current.totalReturns} из {metrics.current.totalPurchases} выкупов
                      </Text>
                    </Paper>

                    <Paper p="lg" radius="md" bg="red.0">
                      <Group justify="space-between" mb="md">
                        <Text fw={600} size="lg">Отказы от заказов</Text>
                        <Badge size="xl" variant="filled" color="red">
                          {metrics.current.rejectionRate.toFixed(1)}%
                        </Badge>
                      </Group>
                      <Progress
                        value={metrics.current.rejectionRate}
                        size="xl"
                        radius="md"
                        color="red"
                        style={{ marginBottom: 8 }}
                      />
                      <Text size="sm" c="dimmed">
                        {metrics.current.totalRejections} из {metrics.current.totalOrders} заказов
                      </Text>
                    </Paper>

                    <Divider />

                    <div>
                      <Text fw={600} mb="sm">Финансовая воронка</Text>
                      <Stack gap="xs">
                        <Group justify="space-between">
                          <Text size="sm">Сумма заказов до СПП:</Text>
                          <Text fw={600}>{metrics.current.ordersAmountBeforeSPP.toLocaleString('ru-RU')} ₽</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">↓ Скидка СПП:</Text>
                          <Text c="orange" fw={600}>-{metrics.current.totalSPP.toLocaleString('ru-RU')} ₽</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm">Сумма после СПП:</Text>
                          <Text fw={600}>{metrics.current.ordersAmountAfterSPP.toLocaleString('ru-RU')} ₽</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">↓ Невыкупленные:</Text>
                          <Text c="red" fw={600}>
                            -{(metrics.current.ordersAmountAfterSPP - metrics.current.purchasesAmountAfterSPP).toLocaleString('ru-RU')} ₽
                          </Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm">Сумма выкупов:</Text>
                          <Text fw={600}>{metrics.current.purchasesAmountAfterSPP.toLocaleString('ru-RU')} ₽</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">↓ Комиссия WB:</Text>
                          <Text c="red" fw={600}>-{metrics.current.totalCommission.toLocaleString('ru-RU')} ₽</Text>
                        </Group>
                        <Divider my="xs" />
                        <Group justify="space-between">
                          <Text fw={600}>К получению:</Text>
                          <Text fw={700} size="lg" c="green">
                            {metrics.current.netRevenue.toLocaleString('ru-RU')} ₽
                          </Text>
                        </Group>
                      </Stack>
                    </div>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* Вкладка: Источники */}
          <Tabs.Panel value="sources" pt="xl">
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <TrafficSources data={metrics.current.sourceMetrics} />
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" radius="lg" withBorder h="100%">
                  <Title order={4} mb="lg">ROAS по каналам</Title>
                  
                  <Stack gap="md">
                    {metrics.current.sourceMetrics.map(source => {
                      const roas = source.cpa ? source.revenue / (source.orders * source.cpa) : 0;
                      const isGood = roas > 3;
                      
                      return (
                        <Paper key={source.source} p="md" radius="md" withBorder>
                          <Group justify="space-between" mb="xs">
                            <Text fw={600}>{source.source}</Text>
                            <Badge
                              size="lg"
                              color={isGood ? 'green' : roas > 2 ? 'yellow' : 'red'}
                              variant="light"
                            >
                              ROAS: {roas.toFixed(2)}
                            </Badge>
                          </Group>
                          
                          {source.cpa && (
                            <Group gap="xs" wrap="nowrap">
                              <Text size="xs" c="dimmed">
                                Расходы: {(source.orders * source.cpa).toLocaleString('ru-RU')} ₽
                              </Text>
                              <Text size="xs" c="dimmed">•</Text>
                              <Text size="xs" c="dimmed">
                                Доход: {source.revenue.toLocaleString('ru-RU')} ₽
                              </Text>
                            </Group>
                          )}
                        </Paper>
                      );
                    })}
                    
                    <Divider />
                    
                    <Paper p="md" radius="md" bg="gray.0">
                      <Text size="sm" c="dimmed" mb="xs">Общая эффективность рекламы</Text>
                      <Group justify="space-between">
                        <Text fw={600}>Средний ROAS:</Text>
                        <Text fw={700} size="lg" c="green">3.45</Text>
                      </Group>
                    </Paper>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* Вкладка: Товары */}
          <Tabs.Panel value="products" pt="xl">
            <Grid mb="xl">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Активные SKU"
                  value={new Set(detailedData.map(d => d.sku)).size}
                  icon={<IconBox size={24} />}
                  color="blue"
                  hint="Уникальные товары с продажами"
                />
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Обнуленные SKU"
                  value={Math.floor(Math.random() * 10) + 5}
                  icon={<IconDatabase size={24} />}
                  color="orange"
                  trend="down"
                  hint="Товары без остатков"
                />
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Критичная оборачиваемость"
                  value={Math.floor(Math.random() * 15) + 10}
                  icon={<IconClock size={24} />}
                  color="red"
                  trend="down"
                  subtitle="< 14 дней"
                  hint="Товары с низкими остатками"
                />
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Залежалые товары"
                  value={Math.floor(Math.random() * 20) + 10}
                  icon={<IconAlertCircle size={24} />}
                  color="red"
                  trend="down"
                  subtitle="> 60 дней"
                  hint="Товары с избыточными остатками"
                />
              </Grid.Col>
            </Grid>

            <Card shadow="sm" radius="lg" withBorder>
              <Group justify="space-between" mb="lg">
                <Title order={4}>ABC-анализ товаров</Title>
                <Group>
                  <SegmentedControl
                    data={[
                      { label: 'По выручке', value: 'revenue' },
                      { label: 'По количеству', value: 'quantity' },
                    ]}
                  />
                  <Button variant="subtle" leftSection={<IconDownload size={16} />}>
                    Экспорт
                  </Button>
                </Group>
              </Group>

              <ScrollArea h={400}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>SKU</Table.Th>
                      <Table.Th>Наименование</Table.Th>
                      <Table.Th>Категория</Table.Th>
                      <Table.Th>Продажи</Table.Th>
                      <Table.Th>Выручка</Table.Th>
                      <Table.Th>Оборачиваемость</Table.Th>
                      <Table.Th>Действия</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {metrics.current.productAnalytics
                      .sort((a, b) => b.revenue - a.revenue)
                      .slice(0, 20)
                      .map((product) => (
                        <Table.Tr key={product.sku}>
                          <Table.Td>
                            <Text size="sm" fw={500}>{product.sku}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{product.name}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              color={product.abcCategory === 'A' ? 'green' : product.abcCategory === 'B' ? 'yellow' : 'red'}
                              variant="filled"
                            >
                              {product.abcCategory}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{product.sales}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" fw={600}>
                              {product.revenue.toLocaleString('ru-RU')} ₽
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              variant="light"
                              color={
                                product.turnoverLess14 > 0 ? 'red' :
                                product.turnoverMore60 > 0 ? 'orange' : 'green'
                              }
                            >
                              {product.turnoverLess14 > 0 ? '< 14 дней' :
                               product.turnoverMore60 > 0 ? '> 60 дней' : 'Норма'}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <ActionIcon variant="subtle" color="gray">
                              <IconChevronRight size={16} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Tabs.Panel>

          {/* Вкладка: География */}
          <Tabs.Panel value="geography" pt="xl">
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" radius="lg" withBorder>
                  <Title order={4} mb="lg">Распределение продаж по регионам</Title>
                  <ReactECharts
                    option={{
                      tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c} ({d}%)'
                      },
                      series: [
                        {
                          type: 'pie',
                          radius: ['40%', '70%'],
                          avoidLabelOverlap: false,
                          itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                          },
                          label: {
                            show: false,
                            position: 'center'
                          },
                          emphasis: {
                            label: {
                              show: true,
                              fontSize: 20,
                              fontWeight: 'bold'
                            }
                          },
                          labelLine: {
                            show: false
                          },
                          data: metrics.current.regionData.map(r => ({
                            value: r.revenue,
                            name: r.region
                          }))
                        }
                      ]
                    }}
                    style={{ height: '400px' }}
                  />
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" radius="lg" withBorder>
                  <Title order={4} mb="lg">Топ регионы</Title>
                  <Stack gap="sm">
                    {metrics.current.regionData
                      .sort((a, b) => b.revenue - a.revenue)
                      .map((region, index) => (
                        <Paper key={region.region} p="md" radius="md" withBorder>
                          <Group justify="space-between" mb="xs">
                            <Group gap="sm">
                              <ThemeIcon size="md" radius="md" variant="light" color="blue">
                                <IconMapPin size={16} />
                              </ThemeIcon>
                              <Text fw={600}>{region.region}</Text>
                            </Group>
                            <Badge variant="light" color="blue">
                              #{index + 1}
                            </Badge>
                          </Group>
                          
                          <SimpleGrid cols={3} mt="sm">
                            <div>
                              <Text size="xs" c="dimmed">Заказы</Text>
                              <Text fw={600}>{region.orders}</Text>
                            </div>
                            <div>
                              <Text size="xs" c="dimmed">Выручка</Text>
                              <Text fw={600}>{(region.revenue / 1000).toFixed(0)}к ₽</Text>
                            </div>
                            <div>
                              <Text size="xs" c="dimmed">Ср. чек</Text>
                              <Text fw={600}>{region.avgCheck.toFixed(0)} ₽</Text>
                            </div>
                          </SimpleGrid>
                          
                          <Progress
                            value={(region.revenue / metrics.current.regionData[0].revenue) * 100}
                            color="blue"
                            size="sm"
                            radius="md"
                            mt="sm"
                          />
                        </Paper>
                      ))}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* Вкладка: Динамика */}
          <Tabs.Panel value="dynamics" pt="xl">
            <Grid>
              <Grid.Col span={12}>
                <Card shadow="sm" radius="lg" withBorder>
                  <Group justify="space-between" mb="lg">
                    <Title order={4}>Динамика продаж</Title>
                    <SegmentedControl
                      data={[
                        { label: 'День', value: 'day' },
                        { label: 'Неделя', value: 'week' },
                        { label: 'Месяц', value: 'month' },
                      ]}
                    />
                  </Group>
                  
                  <ReactECharts
                    option={{
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
                        data: ['Текущий период', 'Прошлый период'],
                        bottom: 0
                      },
                      toolbox: {
                        feature: {
                          saveAsImage: {}
                        }
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
                        data: timeSeriesData.current.map(d => dayjs(d.date).format('DD.MM'))
                      },
                      yAxis: {
                        type: 'value',
                        axisLabel: {
                          formatter: (value: number) => `${(value / 1000).toFixed(0)}к ₽`
                        }
                      },
                      series: [
                        {
                          name: 'Текущий период',
                          type: 'line',
                          smooth: true,
                          symbol: 'none',
                          areaStyle: {
                            opacity: 0.8,
                            color: {
                              type: 'linear',
                              x: 0,
                              y: 0,
                              x2: 0,
                              y2: 1,
                              colorStops: [{
                                offset: 0,
                                color: 'rgba(28, 126, 214, 0.8)'
                              }, {
                                offset: 1,
                                color: 'rgba(28, 126, 214, 0.1)'
                              }]
                            }
                          },
                          emphasis: {
                            focus: 'series'
                          },
                          data: timeSeriesData.current.map(d => d.revenue),
                          itemStyle: { color: '#1c7ed6' }
                        },
                        {
                          name: 'Прошлый период',
                          type: 'line',
                          smooth: true,
                          symbol: 'none',
                          lineStyle: {
                            type: 'dashed',
                            width: 2
                          },
                          emphasis: {
                            focus: 'series'
                          },
                          data: timeSeriesData.previous.map(d => d.revenue),
                          itemStyle: { color: '#868e96' }
                        }
                      ]
                    }}
                    style={{ height: '400px' }}
                  />
                </Card>
              </Grid.Col>
            </Grid>

            <Grid mt="xl">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" radius="lg" withBorder>
                  <Title order={4} mb="lg">Сравнение периодов</Title>
                  
                  <Stack gap="md">
                    <Paper p="md" radius="md" bg="gray.0">
                      <Group justify="space-between">
                        <Text fw={600}>Общая выручка</Text>
                        <Badge
                          size="lg"
                          color={metrics.current.netRevenue > metrics.previous.netRevenue ? 'green' : 'red'}
                          variant="light"
                        >
                          {((metrics.current.netRevenue - metrics.previous.netRevenue) / metrics.previous.netRevenue * 100).toFixed(1)}%
                        </Badge>
                      </Group>
                      <Group mt="xs">
                        <div>
                          <Text size="xs" c="dimmed">Текущий</Text>
                          <Text fw={700} size="lg">{metrics.current.netRevenue.toLocaleString('ru-RU')} ₽</Text>
                        </div>
                        <Divider orientation="vertical" />
                        <div>
                          <Text size="xs" c="dimmed">Прошлый</Text>
                          <Text fw={700} size="lg">{metrics.previous.netRevenue.toLocaleString('ru-RU')} ₽</Text>
                        </div>
                      </Group>
                    </Paper>

                    <Paper p="md" radius="md" bg="gray.0">
                      <Group justify="space-between">
                        <Text fw={600}>Средний чек</Text>
                        <Badge
                          size="lg"
                          color={metrics.current.avgPurchaseValue > metrics.previous.avgPurchaseValue ? 'green' : 'red'}
                          variant="light"
                        >
                          {((metrics.current.avgPurchaseValue - metrics.previous.avgPurchaseValue) / metrics.previous.avgPurchaseValue * 100).toFixed(1)}%
                        </Badge>
                      </Group>
                      <Group mt="xs">
                        <div>
                          <Text size="xs" c="dimmed">Текущий</Text>
                          <Text fw={700} size="lg">{metrics.current.avgPurchaseValue.toFixed(0)} ₽</Text>
                        </div>
                        <Divider orientation="vertical" />
                        <div>
                          <Text size="xs" c="dimmed">Прошлый</Text>
                          <Text fw={700} size="lg">{metrics.previous.avgPurchaseValue.toFixed(0)} ₽</Text>
                        </div>
                      </Group>
                    </Paper>

                    <Paper p="md" radius="md" bg="gray.0">
                      <Group justify="space-between">
                        <Text fw={600}>Конверсия</Text>
                        <Badge
                          size="lg"
                          color={metrics.current.conversionRate > metrics.previous.conversionRate ? 'green' : 'red'}
                          variant="light"
                        >
                          {(metrics.current.conversionRate - metrics.previous.conversionRate).toFixed(1)} п.п.
                        </Badge>
                      </Group>
                      <Group mt="xs">
                        <div>
                          <Text size="xs" c="dimmed">Текущий</Text>
                          <Text fw={700} size="lg">{metrics.current.conversionRate.toFixed(1)}%</Text>
                        </div>
                        <Divider orientation="vertical" />
                        <div>
                          <Text size="xs" c="dimmed">Прошлый</Text>
                          <Text fw={700} size="lg">{metrics.previous.conversionRate.toFixed(1)}%</Text>
                        </div>
                      </Group>
                    </Paper>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" radius="lg" withBorder>
                  <Title order={4} mb="lg">Тренды и прогнозы</Title>
                  
                  <Stack gap="md">
                    <Paper p="md" radius="md" withBorder>
                      <Group gap="sm" mb="xs">
                        <ThemeIcon size="md" radius="md" variant="light" color="blue">
                          <IconChartAreaLine size={16} />
                        </ThemeIcon>
                        <Text fw={600}>Тренд продаж</Text>
                      </Group>
                      <Text size="sm" c="dimmed" mb="sm">
                        На основе последних 7 дней
                      </Text>
                      <Group>
                        <RingProgress
                          size={80}
                          thickness={8}
                          sections={[{ value: 73, color: 'green' }]}
                          label={
                            <Center>
                              <IconTrendingUp size={20} />
                            </Center>
                          }
                        />
                        <div>
                          <Text size="xl" fw={700} c="green">+12.5%</Text>
                          <Text size="sm" c="dimmed">Рост выручки</Text>
                        </div>
                      </Group>
                    </Paper>

                    <Paper p="md" radius="md" withBorder>
                      <Group gap="sm" mb="xs">
                        <ThemeIcon size="md" radius="md" variant="light" color="violet">
                          <IconCalendarStats size={16} />
                        </ThemeIcon>
                        <Text fw={600}>Прогноз на месяц</Text>
                      </Group>
                      <Text size="sm" c="dimmed" mb="sm">
                        При сохранении текущего тренда
                      </Text>
                      <Stack gap="xs">
                        <Group justify="space-between">
                          <Text size="sm">Ожидаемая выручка:</Text>
                          <Text fw={600}>3.2M ₽</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm">Ожидаемые заказы:</Text>
                          <Text fw={600}>4,500</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm">Целевая конверсия:</Text>
                          <Text fw={600}>72%</Text>
                        </Group>
                      </Stack>
                    </Paper>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* Вкладка: План-факт */}
          <Tabs.Panel value="plan-fact" pt="xl">
            <Grid mb="xl">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Выполнение плана"
                  value="87%"
                  icon={<IconTarget size={24} />}
                  color="blue"
                  hint="Процент выполнения месячного плана"
                />
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="До цели осталось"
                  value={450000}
                  unit="₽"
                  icon={<IconChartDots size={24} />}
                  color="orange"
                  hint="Сумма для достижения плана"
                />
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Дней до конца"
                  value={8}
                  unit="дней"
                  icon={<IconCalendar size={24} />}
                  color="violet"
                  hint="До конца планового периода"
                />
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Необходимо в день"
                  value={56250}
                  unit="₽"
                  icon={<IconCalendarStats size={24} />}
                  color="teal"
                  hint="Для выполнения плана"
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" radius="lg" withBorder>
                  <Title order={4} mb="lg">Выполнение плана по дням</Title>
                  
                  <ReactECharts
                    option={{
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                        }
                      },
                      legend: {
                        data: ['План', 'Факт', 'Прогноз'],
                        bottom: 0
                      },
                      grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '15%',
                        containLabel: true
                      },
                      xAxis: {
                        type: 'category',
                        data: Array.from({ length: 30 }, (_, i) => `${i + 1}`)
                      },
                      yAxis: {
                        type: 'value',
                        axisLabel: {
                          formatter: (value: number) => `${(value / 1000).toFixed(0)}к`
                        }
                      },
                      series: [
                        {
                          name: 'План',
                          type: 'line',
                          data: Array.from({ length: 30 }, () => 100000),
                          lineStyle: {
                            type: 'dashed',
                            color: '#868e96'
                          },
                          symbol: 'none'
                        },
                        {
                          name: 'Факт',
                          type: 'bar',
                          data: Array.from({ length: 22 }, () => Math.random() * 120000 + 60000).concat(Array(8).fill(0)),
                          itemStyle: {
                            color: (params: any) => params.value > 100000 ? '#37b24d' : '#f59f00'
                          }
                        },
                        {
                          name: 'Прогноз',
                          type: 'bar',
                          data: Array(22).fill(0).concat(Array.from({ length: 8 }, () => 85000)),
                          itemStyle: {
                            color: '#7950f2',
                            opacity: 0.5
                          }
                        }
                      ]
                    }}
                    style={{ height: '400px' }}
                  />
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" radius="lg" withBorder>
                  <Title order={4} mb="lg">План по категориям</Title>
                  
                  <Stack gap="md">
                    {['Одежда', 'Обувь', 'Аксессуары', 'Электроника'].map((category, index) => {
                      const plan = (index + 1) * 250000;
                      const fact = plan * (0.7 + Math.random() * 0.4);
                      const percentage = (fact / plan) * 100;
                      
                      return (
                        <Paper key={category} p="md" radius="md" withBorder>
                          <Group justify="space-between" mb="xs">
                            <Text fw={600}>{category}</Text>
                            <Badge
                              color={percentage >= 100 ? 'green' : percentage >= 80 ? 'yellow' : 'red'}
                              variant="light"
                            >
                              {percentage.toFixed(0)}%
                            </Badge>
                          </Group>
                          
                          <Progress
                            value={percentage}
                            color={percentage >= 100 ? 'green' : percentage >= 80 ? 'yellow' : 'red'}
                            size="xl"
                            radius="md"
                            style={{ marginBottom: 8 }}
                          />
                          
                          <Group justify="space-between">
                            <Text size="xs" c="dimmed">
                              Факт: {(fact / 1000).toFixed(0)}к ₽
                            </Text>
                            <Text size="xs" c="dimmed">
                              План: {(plan / 1000).toFixed(0)}к ₽
                            </Text>
                          </Group>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Box>
  );
};

export default SalesDashboardPage;