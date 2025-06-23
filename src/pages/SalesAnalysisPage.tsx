import React, { useState, useEffect, useMemo } from 'react';
import { create } from 'zustand';

// Типы данных
interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface MetricData {
  value: number;
  count?: number;
  change?: number;
  percent?: number;
}

interface StoreState {
  dateRange: [Date | null, Date | null];
  comparisonPeriod: string;
  selectedCategories: string[];
  selectedSources: string[];
  selectedStatuses: string[];
  priceRange: [number, number];
  conversionRange: [number, number];
  sppRange: [number, number];
  metrics: {
    totalOrders: MetricData;
    actualSales: MetricData;
    lostRevenue: MetricData;
    potentialRevenue: MetricData;
    toTransfer: MetricData;
  };
  [key: string]: any;
}
import { 
  Container, 
  Grid, 
  Card, 
  Text, 
  Group, 
  Stack, 
  Select,
  Button,
  Badge,
  Progress,
  Tooltip,
  ActionIcon,
  Drawer,
  TextInput,
  MultiSelect,
  RangeSlider,
  Switch,
  Tabs,
  Avatar,
  Indicator,
  Paper,
  ThemeIcon,
  RingProgress,
  ScrollArea,
  Skeleton,
  Transition,
  Alert,
  Divider,
  Menu,
  Collapse,
  SegmentedControl
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import ReactECharts from 'echarts-for-react';
import {
  IconSearch,
  IconFilter,
  IconDownload,
  IconSettings,
  IconBell,
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertCircle,
  IconX,
  IconCash,
  IconShoppingCart,
  IconPercentage,
  IconPackage,
  IconRefresh,
  IconChevronDown,
  IconChevronUp,
  IconDots,
  IconEye,
  IconMessage,
  IconRobot,
  IconBulb,
  IconExclamationCircle,
  IconCircleCheck,
  IconArrowRight,
  IconCalendar,
  IconClock,
  IconCurrencyRubel
} from '@tabler/icons-react';

// Zustand Store
const useStore = create<StoreState>((set) => ({
  // Период данных
  dateRange: [new Date(2024, 10, 1), new Date(2024, 10, 30)] as [Date | null, Date | null],
  comparisonPeriod: 'previousMonth',
  
  // Фильтры
  selectedCategories: ['all'],
  selectedSources: ['all'],
  selectedStatuses: ['all'],
  priceRange: [0, 10000000],
  conversionRange: [0, 100],
  sppRange: [0, 50],
  
  // Основные метрики
  metrics: {
    totalOrders: { value: 2049609, count: 1254, change: 12 },
    actualSales: { value: 1037982, count: 810, change: 8 },
    lostRevenue: { value: 1229765, count: 179, change: -5 },
    potentialRevenue: { value: 3279374, percent: 60 },
    toTransfer: { value: 1086132, change: 3 }
  },
  
  // Данные воронки
  funnelData: {
    orders: { total: 1254, organic: 273, ark: 465, auction: 628 },
    redemptions: { count: 645, percent: 51.4 },
    beforeSPP: 1414302,
    afterSPP: 1037982,
    sppDiscount: 376320,
    commission: 238736,
    toTransfer: 1086132,
    refusals: { count: 487, amount: 863581 },
    returns: { count: 122, amount: 366184 }
  },
  
  // Источники трафика
  trafficSources: [
    { name: 'Аукцион', value: 50, roi: 312, cpm: 145, ctr: 2.8, cvr: 82, trend: 'up' },
    { name: 'АРК', value: 39, roi: 245, cpm: 178, ctr: 2.1, cvr: 74, trend: 'stable' },
    { name: 'Органика', value: 23, roi: 0, cpm: 0, ctr: 0, cvr: 82, trend: 'up' }
  ],
  
  // Данные по товарам
  products: generateMockProducts(),
  
  // AI инсайты
  aiInsights: [
    {
      type: 'critical',
      title: '8 SKU без остатков',
      description: 'Потери: ₽458K/день',
      time: '2 часа назад',
      action: 'Заказать товар'
    },
    {
      type: 'warning',
      title: 'АРК CTR упал на 15%',
      description: 'Категория: Обувь',
      time: '5 часов назад',
      action: 'Оптимизировать'
    },
    {
      type: 'opportunity',
      title: 'Тренд на платья +45%',
      description: 'Увеличить закупку',
      time: 'Вчера',
      action: 'Анализ тренда'
    }
  ],
  
  // Действия
  setDateRange: (range: [Date | null, Date | null]) => set({ dateRange: range }),
  setComparisonPeriod: (period: string) => set({ comparisonPeriod: period }),
  setFilters: (filters: Partial<StoreState>) => set(filters),
  refreshData: () => {
    // Имитация обновления данных
    notifications.show({
      title: 'Данные обновлены',
      message: 'Все метрики актуализированы',
      color: 'teal'
    });
  }
}));

// Генерация мок данных для товаров
function generateMockProducts() {
  const categories = ['Платье', 'Обувь', 'Сумка', 'Аксессуары', 'Косметика'];
  const products = [];
  
  for (let i = 0; i < 50; i++) {
    products.push({
      id: `${12345678 + i}`,
      name: categories[i % categories.length],
      orders: Math.floor(Math.random() * 200) + 50,
      orderAmount: Math.floor(Math.random() * 500000) + 100000,
      redemptions: Math.floor(Math.random() * 150) + 30,
      conversionRate: Math.floor(Math.random() * 30) + 60,
      refusals: Math.floor(Math.random() * 50) + 10,
      refusalRate: Math.floor(Math.random() * 20) + 10,
      returns: Math.floor(Math.random() * 20) + 5,
      returnRate: Math.floor(Math.random() * 10) + 3,
      beforeSPP: Math.floor(Math.random() * 300000) + 100000,
      sppPercent: Math.floor(Math.random() * 20) + 20,
      afterSPP: 0,
      roi: Math.floor(Math.random() * 200) + 150,
      profit: 0,
      profitMargin: Math.floor(Math.random() * 20) + 10,
      status: Math.random() > 0.7 ? 'top' : Math.random() > 0.4 ? 'normal' : 'low'
    });
    
    products[i].afterSPP = products[i].beforeSPP * (1 - products[i].sppPercent / 100);
    products[i].profit = products[i].afterSPP * products[i].profitMargin / 100;
  }
  
  return products;
}

// Форматирование чисел
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `₽${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `₽${(num / 1000).toFixed(0)}K`;
  }
  return `₽${num.toFixed(0)}`;
};

// Интерфейс для MetricCard
interface MetricCardProps {
  title: string;
  value: number;
  count?: number;
  change?: number;
  subtitle?: string;
  sparklineData?: number[];
  icon: React.ReactNode;
  progress?: number;
}

// Компонент метрики
const MetricCard: React.FC<MetricCardProps> = ({ title, value, count, change, subtitle, sparklineData, icon, progress }) => {
  const isPositive = change ? change > 0 : false;
  
  return (
    <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 hover:border-violet-500/30 transition-all duration-300 group">
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="xs">
              <ThemeIcon size="sm" variant="light" color={isPositive ? 'teal' : 'red'}>
                {icon}
              </ThemeIcon>
              <Text size="sm" className="text-gray-400">{title}</Text>
            </Group>
            <Text size="xl" fw={700} className="text-white mt-2">
              {formatNumber(value)}
            </Text>
            {count && (
              <Text size="sm" className="text-gray-400 mt-1">
                {count.toLocaleString()} ед.
              </Text>
            )}
          </div>
          {sparklineData && (
            <div className="w-24 h-12 opacity-60 group-hover:opacity-100 transition-opacity">
              <ReactECharts
                option={{
                  grid: { left: 0, right: 0, top: 0, bottom: 0 },
                  xAxis: { show: false },
                  yAxis: { show: false },
                  series: [{
                    data: sparklineData,
                    type: 'line',
                    smooth: true,
                    lineStyle: { color: isPositive ? '#10b981' : '#ef4444', width: 2 },
                    areaStyle: { 
                      color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                          { offset: 0, color: isPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)' },
                          { offset: 1, color: 'rgba(16, 185, 129, 0)' }
                        ]
                      }
                    },
                    showSymbol: false
                  }]
                }}
                style={{ height: '100%' }}
                opts={{ renderer: 'svg' }}
              />
            </div>
          )}
        </Group>
        
        <Group justify="space-between" align="center">
          {change !== undefined ? (
            <Badge
              size="sm"
              variant="light"
              color={isPositive ? 'teal' : 'red'}
              leftSection={isPositive ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
            >
              {isPositive ? '+' : ''}{change}% vs окт
            </Badge>
          ) : progress !== undefined ? (
            <Progress
              value={progress}
              color="violet"
              size="sm"
              className="flex-1"

            />
          ) : null}
          {subtitle && (
            <Text size="xs" className="text-gray-500">{subtitle}</Text>
          )}
        </Group>
      </Stack>
    </Card>
  );
};

// Интерфейс для SalesFunnel
interface SalesFunnelData {
  orders: {
    total: number;
    organic: number;
    ark: number;
    auction: number;
  };
  redemptions: {
    count: number;
    percent: number;
  };
  beforeSPP: number;
  afterSPP: number;
  sppDiscount: number;
  refusals: {
    count: number;
    amount: number;
  };
  returns: {
    count: number;
    amount: number;
  };
  commission: number;
  toTransfer: number;
}

interface SalesFunnelProps {
  data: SalesFunnelData;
}

// Компонент воронки продаж
const SalesFunnel: React.FC<SalesFunnelProps> = ({ data }) => {
  const funnelOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ₽{c} ({d}%)',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(139, 92, 246, 0.2)',
      borderWidth: 1,
      textStyle: { color: '#fff' }
    },
    series: [
      {
        type: 'funnel',
        left: '10%',
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}',
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold'
        },
        labelLine: { show: false },
        itemStyle: {
          borderColor: 'transparent',
          borderWidth: 0
        },
        emphasis: {
          label: { fontSize: 16 }
        },
        data: [
          {
            value: 100,
            name: `Заказы: ${formatNumber(data.orders.total * 1634)} (${data.orders.total} ед.)`,
            itemStyle: { color: '#8b5cf6' }
          },
          {
            value: data.redemptions.percent,
            name: `Выкупы: ${formatNumber(data.beforeSPP)} (${data.redemptions.count} ед.)`,
            itemStyle: { color: '#6366f1' }
          },
          {
            value: data.redemptions.percent * 0.73,
            name: `После СПП: ${formatNumber(data.afterSPP)}`,
            itemStyle: { color: '#3b82f6' }
          },
          {
            value: data.redemptions.percent * 0.53,
            name: `К перечислению: ${formatNumber(data.toTransfer)}`,
            itemStyle: { color: '#10b981' }
          }
        ]
      }
    ]
  };

  const sourcesOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(139, 92, 246, 0.2)',
      borderWidth: 1,
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['Органика', 'АРК', 'Аукцион'],
      textStyle: { color: '#9ca3af' },
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
      data: ['Заказы', 'Выкупы', 'После СПП', 'К выплате'],
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af', formatter: (value: number) => formatNumber(value) },
      splitLine: { lineStyle: { color: '#1f2937' } }
    },
    series: [
      {
        name: 'Органика',
        type: 'bar',
        stack: 'total',
        barWidth: '60%',
        itemStyle: { color: '#a855f7' },
        data: [477300, 390066, 285348, 298614]
      },
      {
        name: 'АРК',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#22c55e' },
        data: [791115, 580150, 424310, 444145]
      },
      {
        name: 'Аукцион',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#3b82f6' },
        data: [1020955, 844086, 617324, 646250]
      }
    ]
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6">
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600} className="text-white">Воронка продаж</Text>
        <Group gap="xs">
          <SegmentedControl
            size="xs"
            data={[
              { label: 'Общая', value: 'total' },
              { label: 'По источникам', value: 'sources' }
            ]}
            defaultValue="total"
            className="bg-slate-700/50"
          />
          <ActionIcon variant="subtle" color="gray">
            <IconRefresh size={16} />
          </ActionIcon>
        </Group>
      </Group>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          <ReactECharts option={funnelOption} style={{ height: '100%' }} opts={{ renderer: 'svg' }} />
        </div>
        <div className="h-80">
          <ReactECharts option={sourcesOption} style={{ height: '100%' }} opts={{ renderer: 'svg' }} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
          <Text size="sm" className="text-red-400">Отказы</Text>
          <Text size="lg" fw={600} className="text-white">{data.refusals.count} ед.</Text>
          <Text size="sm" className="text-gray-400">{formatNumber(data.refusals.amount)}</Text>
        </div>
        <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
          <Text size="sm" className="text-orange-400">Возвраты</Text>
          <Text size="lg" fw={600} className="text-white">{data.returns.count} ед.</Text>
          <Text size="sm" className="text-gray-400">{formatNumber(data.returns.amount)}</Text>
        </div>
        <div className="bg-violet-500/10 rounded-lg p-4 border border-violet-500/20">
          <Text size="sm" className="text-violet-400">СПП скидка</Text>
          <Text size="lg" fw={600} className="text-white">27%</Text>
          <Text size="sm" className="text-gray-400">{formatNumber(data.sppDiscount)}</Text>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
          <Text size="sm" className="text-blue-400">Комиссия WB</Text>
          <Text size="lg" fw={600} className="text-white">23%</Text>
          <Text size="sm" className="text-gray-400">{formatNumber(data.commission)}</Text>
        </div>
      </div>
    </Card>
  );
};

// Интерфейс для источников трафика
interface TrafficSource {
  name: string;
  value: number;
  roi: number;
  cpm: number;
  ctr: number;
  cvr: number;
  trend: string;
}

interface TrafficSourcesProps {
  sources: TrafficSource[];
}

// Компонент источников трафика
const TrafficSources: React.FC<TrafficSourcesProps> = ({ sources }) => {
  const pieOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}% ({d}%)',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(139, 92, 246, 0.2)',
      borderWidth: 1,
      textStyle: { color: '#fff' }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: 'transparent',
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
            fontWeight: 'bold',
            color: '#fff'
          }
        },
        labelLine: { show: false },
        data: sources.map(source => ({
          value: source.value,
          name: source.name,
          itemStyle: {
            color: source.name === 'Аукцион' ? '#3b82f6' : 
                  source.name === 'АРК' ? '#22c55e' : '#a855f7'
          }
        }))
      }
    ]
  };

  const conversionOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(139, 92, 246, 0.2)',
      borderWidth: 1,
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['Органика', 'АРК', 'Аукцион'],
      textStyle: { color: '#9ca3af' },
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 30 }, (_, i) => i + 1),
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af', interval: 4 }
    },
    yAxis: {
      type: 'value',
      min: 30,
      max: 90,
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af', formatter: '{value}%' },
      splitLine: { lineStyle: { color: '#1f2937' } }
    },
    series: [
      {
        name: 'Органика',
        type: 'line',
        smooth: true,
        lineStyle: { color: '#a855f7', width: 2 },
        areaStyle: { 
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(168, 85, 247, 0.3)' },
              { offset: 1, color: 'rgba(168, 85, 247, 0)' }
            ]
          }
        },
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 75)
      },
      {
        name: 'АРК',
        type: 'line',
        smooth: true,
        lineStyle: { color: '#22c55e', width: 2 },
        areaStyle: { 
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(34, 197, 94, 0.3)' },
              { offset: 1, color: 'rgba(34, 197, 94, 0)' }
            ]
          }
        },
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 65)
      },
      {
        name: 'Аукцион',
        type: 'line',
        smooth: true,
        lineStyle: { color: '#3b82f6', width: 2 },
        areaStyle: { 
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0)' }
            ]
          }
        },
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 70)
      }
    ]
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6">
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600} className="text-white">Эффективность источников трафика</Text>
        <Select
          size="xs"
          defaultValue="roi"
          data={[
            { value: 'roi', label: 'ROI' },
            { value: 'ctr', label: 'CTR' },
            { value: 'cvr', label: 'CVR' },
            { value: 'cpm', label: 'CPM' }
          ]}
          className="w-32"
        />
      </Group>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="h-64">
            <ReactECharts option={pieOption} style={{ height: '100%' }} opts={{ renderer: 'svg' }} />
          </div>
          <Stack gap="xs" mt="md">
            {sources.map((source: TrafficSource) => (
              <div key={source.name} className="bg-slate-700/30 rounded-lg p-3">
                <Group justify="space-between">
                  <Group gap="xs">
                    <div className={`w-3 h-3 rounded-full ${
                      source.name === 'Аукцион' ? 'bg-blue-500' : 
                      source.name === 'АРК' ? 'bg-green-500' : 'bg-violet-500'
                    }`} />
                    <Text size="sm" fw={500} className="text-white">{source.name} ({source.value}%)</Text>
                  </Group>
                  <Group gap="xl">
                    <div>
                      <Text size="xs" className="text-gray-400">ROI</Text>
                      <Text size="sm" fw={600} className="text-white">{source.roi}%</Text>
                    </div>
                    <div>
                      <Text size="xs" className="text-gray-400">CPM</Text>
                      <Text size="sm" fw={600} className="text-white">₽{source.cpm}</Text>
                    </div>
                    <div>
                      <Text size="xs" className="text-gray-400">CTR</Text>
                      <Text size="sm" fw={600} className="text-white">{source.ctr}%</Text>
                    </div>
                    <div>
                      <Text size="xs" className="text-gray-400">CVR</Text>
                      <Text size="sm" fw={600} className="text-white">{source.cvr}%</Text>
                    </div>
                  </Group>
                </Group>
              </div>
            ))}
          </Stack>
        </div>
        
        <div>
          <Text size="sm" fw={500} className="text-gray-300 mb-2">Динамика конверсии по источникам</Text>
          <div className="h-80">
            <ReactECharts option={conversionOption} style={{ height: '100%' }} opts={{ renderer: 'svg' }} />
          </div>
          <Alert
            variant="light"
            color="blue"
            className="mt-4"
            icon={<IconBulb size={16} />}
          >
            Аукцион показывает лучшую конверсию в выходные дни (+15% к буднам)
          </Alert>
        </div>
      </div>
    </Card>
  );
};

// Компонент анализа СПП
const SPPAnalysis = () => {
  const distributionOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(139, 92, 246, 0.2)',
      borderWidth: 1,
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%'],
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af', formatter: '{value}%' },
      splitLine: { lineStyle: { color: '#1f2937' } }
    },
    series: [{
      type: 'bar',
      barWidth: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#8b5cf6' },
            { offset: 1, color: '#6366f1' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      },
      data: [15, 25, 35, 20, 5]
    }]
  };

  const correlationOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(139, 92, 246, 0.2)',
      borderWidth: 1,
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: 'СПП %',
      nameLocation: 'middle',
      nameGap: 30,
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af', formatter: '{value}%' },
      splitLine: { lineStyle: { color: '#1f2937' } }
    },
    yAxis: {
      type: 'value',
      name: 'Конверсия %',
      nameLocation: 'middle',
      nameGap: 40,
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af', formatter: '{value}%' },
      splitLine: { lineStyle: { color: '#1f2937' } }
    },
    series: [{
      type: 'scatter',
      symbolSize: 8,
      itemStyle: {
        color: '#10b981'
      },
      data: Array.from({ length: 50 }, () => {
        const spp = Math.random() * 40 + 10;
        const cvr = 90 - spp * 0.5 + Math.random() * 10 - 5;
        return [spp.toFixed(1), cvr.toFixed(1)];
      })
    }]
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6">
      <Text size="lg" fw={600} className="text-white mb-4">Анализ влияния СПП</Text>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-violet-500/10 rounded-lg p-4 border border-violet-500/20">
          <Text size="sm" className="text-violet-400">Средний размер СПП</Text>
          <Text size="xl" fw={700} className="text-white">27%</Text>
          <Text size="xs" className="text-gray-400">↓2% vs октябрь</Text>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
          <Text size="sm" className="text-blue-400">Доля товаров с СПП</Text>
          <Text size="xl" fw={700} className="text-white">73%</Text>
          <Text size="xs" className="text-gray-400">↑5% vs октябрь</Text>
        </div>
        <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
          <Text size="sm" className="text-orange-400">Потери от СПП</Text>
          <Text size="xl" fw={700} className="text-white">₽376K</Text>
          <Text size="xs" className="text-gray-400">Компенсация WB: 50%</Text>
        </div>
        <div className="bg-teal-500/10 rounded-lg p-4 border border-teal-500/20">
          <Text size="sm" className="text-teal-400">Чистые потери</Text>
          <Text size="xl" fw={700} className="text-white">₽188K</Text>
          <Text size="xs" className="text-gray-400">13.3% от выручки</Text>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Text size="sm" fw={500} className="text-gray-300 mb-2">Распределение СПП</Text>
          <div className="h-64">
            <ReactECharts option={distributionOption} style={{ height: '100%' }} opts={{ renderer: 'svg' }} />
          </div>
        </div>
        <div>
          <Text size="sm" fw={500} className="text-gray-300 mb-2">СПП vs Конверсия</Text>
          <div className="h-64">
            <ReactECharts option={correlationOption} style={{ height: '100%' }} opts={{ renderer: 'svg' }} />
          </div>
        </div>
      </div>
    </Card>
  );
};

// Интерфейс для товара
interface Product {
  id: string;
  name: string;
  orders: number;
  orderAmount: number;
  redemptions: number;
  conversionRate: number;
  refusals: number;
  refusalRate: number;
  returns: number;
  returnRate: number;
  beforeSPP: number;
  sppPercent: number;
  afterSPP: number;
  roi: number;
  profit: number;
  profitMargin: number;
  status: string;
}

interface ProductsTableProps {
  products: Product[];
}

// Компонент таблицы товаров
const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('orders');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aVal = a[sortBy as keyof Product] as number;
      const bVal = b[sortBy as keyof Product] as number;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [products, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'top':
        return <div className="w-3 h-3 rounded-full bg-green-500" />;
      case 'normal':
        return <div className="w-3 h-3 rounded-full bg-blue-500" />;
      case 'low':
        return <div className="w-3 h-3 rounded-full bg-orange-500" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-500" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6">
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600} className="text-white">Детальная аналитика по товарам</Text>
        <Group gap="xs">
          <Button size="xs" variant="subtle" leftSection={<IconEye size={14} />}>
            Колонки
          </Button>
          <Select
            size="xs"
            defaultValue="25"
            data={[
              { value: '25', label: '25 записей' },
              { value: '50', label: '50 записей' },
              { value: '100', label: '100 записей' }
            ]}
            className="w-32"
          />
          <Button size="xs" variant="subtle" leftSection={<IconDownload size={14} />}>
            Экспорт
          </Button>
        </Group>
      </Group>
      
      <ScrollArea>
        <div className="min-w-[1200px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left py-3 px-4">Статус</th>
                <th className="text-left py-3 px-4 cursor-pointer hover:bg-slate-700/30" onClick={() => handleSort('id')}>
                  <Group gap="xs" justify="space-between">
                    SKU/Артикул
                    <IconChevronDown size={14} className={sortBy === 'id' ? 'text-violet-400' : 'text-gray-500'} />
                  </Group>
                </th>
                <th className="text-left py-3 px-4 cursor-pointer hover:bg-slate-700/30" onClick={() => handleSort('orders')}>
                  <Group gap="xs" justify="space-between">
                    Заказы
                    <IconChevronDown size={14} className={sortBy === 'orders' ? 'text-violet-400' : 'text-gray-500'} />
                  </Group>
                </th>
                <th className="text-left py-3 px-4 cursor-pointer hover:bg-slate-700/30" onClick={() => handleSort('conversionRate')}>
                  <Group gap="xs" justify="space-between">
                    Выкупы
                    <IconChevronDown size={14} className={sortBy === 'conversionRate' ? 'text-violet-400' : 'text-gray-500'} />
                  </Group>
                </th>
                <th className="text-left py-3 px-4">Отказы</th>
                <th className="text-left py-3 px-4">Возвраты</th>
                <th className="text-left py-3 px-4 cursor-pointer hover:bg-slate-700/30" onClick={() => handleSort('sppPercent')}>
                  <Group gap="xs" justify="space-between">
                    СПП
                    <IconChevronDown size={14} className={sortBy === 'sppPercent' ? 'text-violet-400' : 'text-gray-500'} />
                  </Group>
                </th>
                <th className="text-left py-3 px-4 cursor-pointer hover:bg-slate-700/30" onClick={() => handleSort('roi')}>
                  <Group gap="xs" justify="space-between">
                    ROI
                    <IconChevronDown size={14} className={sortBy === 'roi' ? 'text-violet-400' : 'text-gray-500'} />
                  </Group>
                </th>
                <th className="text-left py-3 px-4 cursor-pointer hover:bg-slate-700/30" onClick={() => handleSort('profitMargin')}>
                  <Group gap="xs" justify="space-between">
                    Прибыль
                    <IconChevronDown size={14} className={sortBy === 'profitMargin' ? 'text-violet-400' : 'text-gray-500'} />
                  </Group>
                </th>
                <th className="text-left py-3 px-4">Действия</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.slice(0, 10).map((product: Product) => (
                <tr key={product.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="py-3 px-4">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product.id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter((id) => id !== product.id));
                        }
                      }}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <Tooltip label={product.status === 'top' ? 'Высокомаржинальный' : product.status === 'normal' ? 'Средний' : 'Низкомаржинальный'}>
                      {getStatusIcon(product.status)}
                    </Tooltip>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <Text size="sm" fw={500} className="text-white">{product.id}</Text>
                      <Text size="xs" className="text-gray-400">{product.name}</Text>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <Text size="sm" fw={500} className="text-white">{product.orders} ед.</Text>
                      <Text size="xs" className="text-gray-400">{formatNumber(product.orderAmount)}</Text>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <Text size="sm" fw={500} className="text-white">{product.redemptions} ед.</Text>
                      <Badge size="xs" color={product.conversionRate > 70 ? 'teal' : 'orange'}>
                        {product.conversionRate}%
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <Text size="sm" fw={500} className="text-white">{product.refusals} ед.</Text>
                      <Text size="xs" className="text-gray-400">{product.refusalRate}%</Text>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <Text size="sm" fw={500} className="text-white">{product.returns} ед.</Text>
                      <Text size="xs" className="text-gray-400">{product.returnRate}%</Text>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge size="sm" variant="filled" color="violet">
                      {product.sppPercent}%
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <Text size="sm" fw={600} className={product.roi > 200 ? 'text-green-400' : 'text-white'}>
                        {product.roi}%
                      </Text>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <Text size="sm" fw={600} className="text-white">
                        {formatNumber(product.profit)}
                      </Text>
                      <Badge size="xs" color={product.profitMargin > 15 ? 'teal' : 'orange'}>
                        {product.profitMargin}%
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconEye size={14} />}>Детали</Menu.Item>
                        <Menu.Item leftSection={<IconChartBar size={14} />}>Аналитика</Menu.Item>
                        <Menu.Item leftSection={<IconSettings size={14} />}>Настройки</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
      
      <Group justify="space-between" mt="md">
        <Text size="sm" className="text-gray-400">
          Показано 10 из {products.length} товаров
        </Text>
        <Group gap="xs">
          <Button size="xs" variant="subtle" disabled>←</Button>
          <Button size="xs" variant="filled">1</Button>
          <Button size="xs" variant="subtle">2</Button>
          <Button size="xs" variant="subtle">3</Button>
          <Text size="sm" className="text-gray-400">...</Text>
          <Button size="xs" variant="subtle">10</Button>
          <Button size="xs" variant="subtle">→</Button>
        </Group>
      </Group>
    </Card>
  );
};

// Компонент операционных инсайтов
const OperationalInsights = () => {
  const turnoverData = {
    current: 28,
    target: 30,
    status: 'good'
  };

  const categoryConversion = [
    { name: 'Одежда', value: 82, trend: 'up' },
    { name: 'Обувь', value: 73, trend: 'stable' },
    { name: 'Аксессуары', value: 62, trend: 'down' },
    { name: 'Косметика', value: 58, trend: 'down' }
  ];

  const priceElasticity = {
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(139, 92, 246, 0.2)',
      borderWidth: 1,
      textStyle: { color: '#fff' }
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: ['Платья', 'Обувь', 'Сумки', 'Косметика'],
      splitArea: { show: true },
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af' }
    },
    yAxis: {
      type: 'category',
      data: ['-20%', '-10%', '0%', '+10%', '+20%'],
      splitArea: { show: true },
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af' }
    },
    visualMap: {
      min: -20,
      max: 20,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      textStyle: { color: '#9ca3af' },
      inRange: {
        color: ['#ef4444', '#f59e0b', '#10b981']
      }
    },
    series: [{
      type: 'heatmap',
      data: [
        [0, 0, -5], [0, 1, -2], [0, 2, 0], [0, 3, 8], [0, 4, 12],
        [1, 0, -8], [1, 1, -3], [1, 2, 0], [1, 3, 5], [1, 4, 10],
        [2, 0, -15], [2, 1, -8], [2, 2, 0], [2, 3, 3], [2, 4, 7],
        [3, 0, -12], [3, 1, -5], [3, 2, 0], [3, 3, 4], [3, 4, 8]
      ],
      label: { show: true },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-4">
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500} className="text-red-400">🚨 SKU с нулевыми остатками</Text>
          <Badge size="xs" color="red">Критично</Badge>
        </Group>
        <Text size="xl" fw={700} className="text-white mb-2">8 SKU</Text>
        <Text size="sm" className="text-gray-400 mb-3">₽458,000 упущено</Text>
        <Stack gap={4}>
          <Text size="xs" className="text-gray-300">• Арт. 12345 (234 зак.)</Text>
          <Text size="xs" className="text-gray-300">• Арт. 23456 (189 зак.)</Text>
          <Text size="xs" className="text-gray-300">• Арт. 34567 (156 зак.)</Text>
        </Stack>
        <Button size="xs" color="red" variant="light" fullWidth mt="md">
          Заказать товар
        </Button>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-4">
        <Text size="sm" fw={500} className="text-orange-400 mb-2">📦 Оборачиваемость</Text>
        <div className="relative h-32 flex items-center justify-center">
          <RingProgress
            size={120}
            thickness={12}
            sections={[
              { value: (turnoverData.current / turnoverData.target) * 100, color: 'teal' }
            ]}
            label={
              <div className="text-center">
                <Text size="xl" fw={700} className="text-white">{turnoverData.current}</Text>
                <Text size="xs" className="text-gray-400">дней</Text>
              </div>
            }
          />
        </div>
        <Text ta="center" size="sm" className="text-gray-400 mt-2">
          Цель: &lt;{turnoverData.target} дней
        </Text>
        <Badge color="teal" variant="light" fullWidth size="sm" mt="xs">
          В норме ✓
        </Badge>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-4">
        <Text size="sm" fw={500} className="text-blue-400 mb-3">🎯 Конверсия по категориям</Text>
        <Stack gap="xs">
          {categoryConversion.map(cat => (
            <div key={cat.name}>
              <Group justify="space-between" mb={4}>
                <Text size="xs" className="text-gray-300">{cat.name}</Text>
                <Group gap={4}>
                  <Text size="xs" fw={500} className="text-white">{cat.value}%</Text>
                  {cat.trend === 'up' && <IconTrendingUp size={12} className="text-green-400" />}
                  {cat.trend === 'down' && <IconTrendingDown size={12} className="text-red-400" />}
                  {cat.trend === 'stable' && <Text size="xs" className="text-gray-400">→</Text>}
                </Group>
              </Group>
              <Progress value={cat.value} size="xs" color={cat.value > 70 ? 'teal' : cat.value > 60 ? 'blue' : 'orange'} />
            </div>
          ))}
        </Stack>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-4">
        <Text size="sm" fw={500} className="text-violet-400 mb-2">🏷️ Ценовая эластичность</Text>
        <div className="h-48">
          <ReactECharts option={priceElasticity} style={{ height: '100%' }} opts={{ renderer: 'svg' }} />
        </div>
        <Text size="xs" className="text-gray-400 mt-2">Оптимальные цены:</Text>
        <Stack gap={2}>
          <Text size="xs" className="text-gray-300">• Платья: ₽2,450</Text>
          <Text size="xs" className="text-gray-300">• Обувь: ₽3,890</Text>
        </Stack>
      </Card>
    </div>
  );
};

// Компонент AI инсайтов
interface AIInsight {
  type: string;
  title: string;
  description: string;
  action: string;
  time: string;
}

interface AIInsightsProps {
  insights: AIInsight[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <IconExclamationCircle size={20} className="text-red-400" />;
      case 'warning':
        return <IconAlertCircle size={20} className="text-orange-400" />;
      case 'opportunity':
        return <IconBulb size={20} className="text-green-400" />;
      default:
        return <IconCircleCheck size={20} className="text-blue-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'critical': return 'red';
      case 'warning': return 'orange';
      case 'opportunity': return 'teal';
      default: return 'blue';
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 h-full">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconRobot size={20} className="text-violet-400" />
          <Text size="lg" fw={600} className="text-white">AI Инсайты</Text>
        </Group>
        <Indicator processing color="violet" size={8}>
          <ActionIcon variant="subtle" color="gray">
            <IconMessage size={16} />
          </ActionIcon>
        </Indicator>
      </Group>
      
      <ScrollArea className="h-[calc(100vh-300px)]">
        <Stack gap="md">
          <div className="bg-violet-500/10 rounded-lg p-4 border border-violet-500/20">
            <Text size="sm" className="text-violet-300 mb-2">💡 Главная рекомендация</Text>
            <Text size="sm" fw={500} className="text-white">
              Обнаружено снижение конверсии на 8% в категории 'Обувь' за последние 7 дней. 
              Рекомендую увеличить ставки АРК на 15% для компенсации.
            </Text>
            <Button size="xs" variant="light" color="violet" fullWidth mt="sm">
              Применить рекомендацию
            </Button>
          </div>

          {insights.map((insight: AIInsight, index: number) => (
            <Paper
              key={index}
              className="bg-slate-700/30 p-4 hover:bg-slate-700/50 transition-colors cursor-pointer"
              radius="md"
            >
              <Group justify="space-between" mb="xs">
                <Group gap="xs">
                  {getInsightIcon(insight.type)}
                  <Badge size="xs" color={getInsightColor(insight.type)} variant="light">
                    {insight.type === 'critical' ? 'Критично' : 
                     insight.type === 'warning' ? 'Важно' : 'Возможность'}
                  </Badge>
                </Group>
                <Text size="xs" className="text-gray-400">{insight.time}</Text>
              </Group>
              
              <Text size="sm" fw={500} className="text-white mb-1">
                {insight.title}
              </Text>
              <Text size="xs" className="text-gray-400 mb-2">
                {insight.description}
              </Text>
              
              <Button 
                size="xs" 
                variant="subtle" 
                color={getInsightColor(insight.type)}
                rightSection={<IconArrowRight size={14} />}
                fullWidth
              >
                {insight.action}
              </Button>
            </Paper>
          ))}

          <Divider className="my-2" />
          
          <Text size="sm" fw={500} className="text-gray-300 mb-2">📊 Прогнозы и рекомендации</Text>
          
          <Paper className="bg-blue-500/10 p-4 border border-blue-500/20" radius="md">
            <Group gap="xs" mb="xs">
              <IconTrendingUp size={16} className="text-blue-400" />
              <Text size="sm" fw={500} className="text-blue-300">Поднять цену на SKU 23456</Text>
            </Group>
            <Text size="xs" className="text-gray-300 mb-2">
              Анализ эластичности показывает возможность повышения на 8%
            </Text>
            <Group justify="space-between">
              <Text size="xs" className="text-gray-400">Прогноз: +₽125K/мес</Text>
              <Badge size="xs" color="blue">Confidence: 87%</Badge>
            </Group>
            <Button size="xs" variant="light" color="blue" fullWidth mt="sm">
              Запустить A/B тест
            </Button>
          </Paper>

          <Paper className="bg-teal-500/10 p-4 border border-teal-500/20" radius="md">
            <Group gap="xs" mb="xs">
              <IconChartBar size={16} className="text-teal-400" />
              <Text size="sm" fw={500} className="text-teal-300">Сезонный прогноз</Text>
            </Group>
            <Text size="xs" className="text-gray-300 mb-2">
              Декабрь: ожидается рост спроса на 180%
            </Text>
            <Text size="xs" className="text-gray-400 mb-2">
              Рекомендуемый запас: 3,500 единиц
            </Text>
            <Button size="xs" variant="light" color="teal" fullWidth>
              План закупок
            </Button>
          </Paper>
        </Stack>
      </ScrollArea>
    </Card>
  );
};

// Основной компонент дашборда
export default function WildberriesDashboard() {
  const store = useStore();
  const [filtersOpened, { open: openFilters, close: closeFilters }] = useDisclosure(false);
  const [aiChatOpened, { open: openAIChat, close: closeAIChat }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <Stack gap="md">
          <Skeleton height={80} radius="md" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} height={120} radius="md" />
            ))}
          </div>
          <Skeleton height={400} radius="md" />
          <Skeleton height={300} radius="md" />
        </Stack>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur border-b border-slate-700/50 sticky top-0 z-50">
        <Container size="fluid" className="p-4">
          <Group justify="space-between">
            <Group gap="md">
              <Text size="xl" fw={700} className="text-white">Аналитика продаж</Text>
              <DatePickerInput
                type="range"
                value={store.dateRange}
                onChange={store.setDateRange}
                size="sm"
                className="w-64"
                placeholder="Выберите период"
              />
              <Select
                size="sm"
                value={store.comparisonPeriod}
                onChange={store.setComparisonPeriod}
                data={[
                  { value: 'previousMonth', label: 'vs Предыдущий месяц' },
                  { value: 'previousYear', label: 'vs Прошлый год' },
                  { value: 'custom', label: 'vs Произвольный' }
                ]}
                className="w-48"
              />
              <Button
                size="sm"
                variant="subtle"
                color="violet"
                leftSection={<IconMessage size={16} />}
                onClick={openAIChat}
              >
                AI Chat
              </Button>
            </Group>
            
            <Group gap="xs">
              <TextInput
                size="sm"
                placeholder="Поиск по SKU/артикул..."
                leftSection={<IconSearch size={16} />}
                className="w-64"
              />
              <Button
                size="sm"
                variant="subtle"
                leftSection={<IconFilter size={16} />}
                onClick={openFilters}
              >
                Фильтры {store.selectedCategories.length > 1 && `(${store.selectedCategories.length - 1})`}
              </Button>
              <ActionIcon variant="subtle" color="gray">
                <IconChartBar size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray">
                <IconDownload size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray">
                <IconSettings size={20} />
              </ActionIcon>
              <Indicator label="12" size={16} offset={4} color="red">
                <ActionIcon variant="subtle" color="gray">
                  <IconBell size={20} />
                </ActionIcon>
              </Indicator>
            </Group>
          </Group>
        </Container>
      </header>

      {/* Main Content */}
      <Container size="fluid" className="p-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Left Content Area */}
          <div className={isMobile ? "col-span-12" : "col-span-10"}>
            {/* Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <MetricCard
                title="Общие заказы"
                value={store.metrics.totalOrders.value}
                count={store.metrics.totalOrders.count}
                change={store.metrics.totalOrders.change}
                sparklineData={[20, 35, 40, 35, 50, 60, 55, 70, 65, 80]}
                icon={<IconShoppingCart size={16} />}
              />
              <MetricCard
                title="Фактические продажи"
                value={store.metrics.actualSales.value}
                count={store.metrics.actualSales.count}
                change={store.metrics.actualSales.change}
                sparklineData={[30, 40, 35, 50, 45, 60, 65, 70, 75, 85]}
                icon={<IconCash size={16} />}
              />
              <MetricCard
                title="Упущенная выручка"
                value={store.metrics.lostRevenue.value}
                count={store.metrics.lostRevenue.count}
                change={store.metrics.lostRevenue.change}
                sparklineData={[80, 75, 70, 65, 60, 55, 50, 45, 40, 35]}
                icon={<IconX size={16} />}
              />
              <MetricCard
                title="Потенциальная выручка"
                value={store.metrics.potentialRevenue.value}
                subtitle="+60% к факту"
                progress={32}
                icon={<IconTrendingUp size={16} />}
              />
              <MetricCard
                title="К перечислению"
                value={store.metrics.toTransfer.value}
                change={store.metrics.toTransfer.change}
                subtitle="После всех вычетов"
                sparklineData={[40, 45, 50, 55, 60, 65, 70, 75, 80, 85]}
                icon={<IconCurrencyRubel size={16} />}
              />
            </div>

            {/* AI Summary Alert */}
            <Alert
              variant="light"
              color="violet"
              className="mb-4"
              icon={<IconRobot size={20} />}
              withCloseButton
            >
              <Text size="sm" fw={500}>
                🤖 AI Инсайт: Обнаружено снижение конверсии на 8% в категории 'Обувь' за последние 7 дней. 
                Рекомендую увеличить ставки АРК на 15% для компенсации.
              </Text>
              <Button size="xs" variant="light" color="violet" mt="xs">
                Подробнее →
              </Button>
            </Alert>

            {/* Sales Funnel */}
            <div className="mb-4">
              <SalesFunnel data={store.funnelData} />
            </div>

            {/* Traffic Sources */}
            <div className="mb-4">
              <TrafficSources sources={store.trafficSources} />
            </div>

            {/* SPP Analysis */}
            <div className="mb-4">
              <SPPAnalysis />
            </div>

            {/* Products Table */}
            <div className="mb-4">
              <ProductsTable products={store.products} />
            </div>

            {/* Operational Insights */}
            <div className="mb-4">
              <OperationalInsights />
            </div>
          </div>

          {/* Right Sidebar - AI Insights */}
          {!isMobile && (
            <div className="col-span-2">
              <AIInsights insights={store.aiInsights} />
            </div>
          )}
        </div>
      </Container>

      {/* Filters Drawer */}
      <Drawer
        opened={filtersOpened}
        onClose={closeFilters}
        title="Фильтры"
        position="right"
        size="sm"
        classNames={{
          header: 'bg-slate-800 border-b border-slate-700',
          title: 'text-white'
        }}
      >
        <Stack gap="md">
          <div>
            <Text size="sm" fw={500} className="text-gray-300 mb-2">Период</Text>
            <DatePickerInput
              type="range"
              value={store.dateRange}
              onChange={store.setDateRange}
              w="100%"
            />
          </div>
          
          <div>
            <Text size="sm" fw={500} className="text-gray-300 mb-2">Категории</Text>
            <MultiSelect
              data={[
                { value: 'all', label: 'Все категории' },
                { value: 'clothes', label: 'Одежда' },
                { value: 'shoes', label: 'Обувь' },
                { value: 'accessories', label: 'Аксессуары' },
                { value: 'cosmetics', label: 'Косметика' }
              ]}
              value={store.selectedCategories}
              onChange={(value) => store.setFilters({ selectedCategories: value })}
              placeholder="Выберите категории"
            />
          </div>
          
          <div>
            <Text size="sm" fw={500} className="text-gray-300 mb-2">Источники</Text>
            <MultiSelect
              data={[
                { value: 'all', label: 'Все источники' },
                { value: 'organic', label: 'Органика' },
                { value: 'ark', label: 'АРК' },
                { value: 'auction', label: 'Аукцион' }
              ]}
              value={store.selectedSources}
              onChange={(value) => store.setFilters({ selectedSources: value })}
              placeholder="Выберите источники"
            />
          </div>
          
          <div>
            <Text size="sm" fw={500} className="text-gray-300 mb-2">Выручка</Text>
            <RangeSlider
              min={0}
              max={10000000}
              step={100000}
              value={store.priceRange}
              onChange={(value) => store.setFilters({ priceRange: value })}
              marks={[
                { value: 0, label: '₽0' },
                { value: 5000000, label: '₽5M' },
                { value: 10000000, label: '₽10M' }
              ]}
            />
          </div>
          
          <div>
            <Text size="sm" fw={500} className="text-gray-300 mb-2">Конверсия</Text>
            <RangeSlider
              min={0}
              max={100}
              step={5}
              value={store.conversionRange}
              onChange={(value) => store.setFilters({ conversionRange: value })}
              marks={[
                { value: 0, label: '0%' },
                { value: 50, label: '50%' },
                { value: 100, label: '100%' }
              ]}
            />
          </div>
          
          <div>
            <Text size="sm" fw={500} className="text-gray-300 mb-2">СПП</Text>
            <RangeSlider
              min={0}
              max={50}
              step={5}
              value={store.sppRange}
              onChange={(value) => store.setFilters({ sppRange: value })}
              marks={[
                { value: 0, label: '0%' },
                { value: 25, label: '25%' },
                { value: 50, label: '50%' }
              ]}
            />
          </div>
          
          <Group justify="space-between" mt="xl">
            <Button variant="subtle" onClick={closeFilters}>
              Сбросить
            </Button>
            <Button onClick={closeFilters}>
              Применить
            </Button>
          </Group>
        </Stack>
      </Drawer>

      {/* AI Chat Drawer */}
      <Drawer
        opened={aiChatOpened}
        onClose={closeAIChat}
        title="AI Ассистент"
        position="right"
        size="md"
        classNames={{
          header: 'bg-slate-800 border-b border-slate-700',
          title: 'text-white'
        }}
      >
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 p-4">
            <Stack gap="md">
              <div className="bg-violet-500/10 rounded-lg p-3 max-w-[80%]">
                <Text size="sm" className="text-white">
                  Привет! Я ваш AI-ассистент по анализу продаж. Могу помочь с инсайтами, 
                  прогнозами и рекомендациями по оптимизации.
                </Text>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 max-w-[80%] ml-auto">
                <Text size="sm" className="text-white">
                  Какие товары показывают лучшую динамику за последнюю неделю?
                </Text>
              </div>
              <div className="bg-violet-500/10 rounded-lg p-3 max-w-[80%]">
                <Text size="sm" className="text-white mb-2">
                  По данным за последние 7 дней, лучшую динамику показывают:
                </Text>
                <Stack gap={4}>
                  <Text size="xs" className="text-gray-300">
                    1. Платья (SKU 12345678) - рост продаж на 45%
                  </Text>
                  <Text size="xs" className="text-gray-300">
                    2. Сумки (SKU 34567890) - рост на 32%
                  </Text>
                  <Text size="xs" className="text-gray-300">
                    3. Косметика (SKU 45678901) - рост на 28%
                  </Text>
                </Stack>
              </div>
            </Stack>
          </ScrollArea>
          
          <div className="p-4 border-t border-slate-700">
            <TextInput
              placeholder="Задайте вопрос..."
              rightSection={
                <ActionIcon color="violet" variant="filled">
                  <IconArrowRight size={16} />
                </ActionIcon>
              }
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
}