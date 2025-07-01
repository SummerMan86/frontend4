import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Title,
  Group,
  Stack,
  Tabs,
  Select,
  MultiSelect,
  Button,
  Badge,
  Progress,
  Paper,
  Box,
  Indicator,
  RingProgress,
  ThemeIcon,
  Menu,
  ActionIcon,
  Switch,
  SegmentedControl,
  Tooltip,
  Skeleton,
  Alert,
  Modal,
  Table,
  TextInput,
  NumberInput,
  Divider,
  Anchor,
  Timeline,
  Avatar,
  UnstyledButton,
  useMantineTheme,
  useMantineColorScheme,
  Loader,
  Notification,
  ScrollArea,
  Accordion,
  Checkbox,
  Slider,
} from '@mantine/core';
import { DatePicker, DatesProvider } from '@mantine/dates';
import { useDisclosure, useHover } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconRefresh,
  IconFilter,
  IconDownload,
  IconChartBar,
  IconChartLine,
  IconChartPie,
  IconChartDots,
  IconCopy,
  IconEye,
  IconShoppingCart,
  IconCurrencyRubel,
  IconPercentage,
  IconClick,
  IconTargetArrow,
  IconPackage,
  IconCalendar,
  IconAlertCircle,
  IconBulb,
  IconAdjustments,
  IconDatabase,
  IconBrandGoogle,
  IconAd,
  IconTestPipe,
  IconArrowUpRight,
  IconArrowDownRight,
  IconDots,
  IconChevronRight,
  IconChevronDown,
  IconZoomIn,
  IconSettings,
  IconDeviceAnalytics,
  IconInfoCircle,
  IconChecks,
  IconX,
  IconPlus,
  IconMinus,
  IconEqual,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconFileExport,
  IconReload,
  IconBell,
  IconMoon,
  IconSun,
  IconBrandWechat,
  IconChartArea,
  IconChartHistogram,
  IconChartCandle,
  IconChartBubble,
  IconChartRadar,
  IconChartTreemap,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

// Типы данных
interface CampaignData {
  id: string;
  name: string;
  type: 'search' | 'auto' | 'card' | 'banner' | 'media';
  status: 'active' | 'paused' | 'completed';
  impressions: number;
  clicks: number;
  orders: number;
  purchases: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpc: number;
  conversionRate: number;
  purchaseRate: number;
  roas: number;
  acos: number;
  avgOrderValue: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

interface KeywordData {
  id: string;
  keyword: string;
  campaignId: string;
  impressions: number;
  clicks: number;
  orders: number;
  spend: number;
  revenue: number;
  position: number;
  bid: number;
  quality: 'high' | 'medium' | 'low';
}

interface ProductData {
  id: string;
  sku: string;
  name: string;
  category: string;
  impressions: number;
  clicks: number;
  orders: number;
  revenue: number;
  adSpend: number;
  roas: number;
  stock: number;
  rating: number;
  reviews: number;
}

interface TimeSeriesData {
  date: string;
  impressions: number;
  clicks: number;
  orders: number;
  purchases: number;
  spend: number;
  revenue: number;
}

interface MetricCard {
  title: string;
  value: string | number;
  trend: number;
  trendDirection: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
  description?: string;
  sparklineData?: number[];
}

// Генерация моковых данных
const generateMockData = () => {
  const campaigns: CampaignData[] = Array.from({ length: 25 }, (_, i) => ({
    id: `camp-${i}`,
    name: `Кампания ${i + 1}`,
    type: ['search', 'auto', 'card', 'banner', 'media'][Math.floor(Math.random() * 5)] as any,
    status: ['active', 'paused', 'completed'][Math.floor(Math.random() * 3)] as any,
    impressions: Math.floor(Math.random() * 500000) + 10000,
    clicks: Math.floor(Math.random() * 10000) + 500,
    orders: Math.floor(Math.random() * 1000) + 50,
    purchases: Math.floor(Math.random() * 800) + 40,
    spend: Math.floor(Math.random() * 100000) + 5000,
    revenue: Math.floor(Math.random() * 500000) + 20000,
    ctr: Math.random() * 5 + 0.5,
    cpc: Math.random() * 5 + 0.5,
    conversionRate: Math.random() * 10 + 1,
    purchaseRate: Math.random() * 90 + 50,
    roas: Math.random() * 8 + 2,
    acos: Math.random() * 40 + 10,
    avgOrderValue: Math.floor(Math.random() * 5000) + 1000,
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any,
    trendValue: Math.random() * 50 - 25,
  }));

  const timeSeries: TimeSeriesData[] = Array.from({ length: 30 }, (_, i) => ({
    date: dayjs().subtract(30 - i, 'day').format('YYYY-MM-DD'),
    impressions: Math.floor(Math.random() * 500000) + 100000,
    clicks: Math.floor(Math.random() * 10000) + 2000,
    orders: Math.floor(Math.random() * 1000) + 200,
    purchases: Math.floor(Math.random() * 800) + 150,
    spend: Math.floor(Math.random() * 50000) + 10000,
    revenue: Math.floor(Math.random() * 200000) + 50000,
  }));

  return { campaigns, timeSeries };
};

export const AdvertisingAnalysisPage: React.FC = () => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    dayjs().subtract(30, 'days').toDate(),
    dayjs().toDate(),
  ]);
  const [compareRange, setCompareRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedCampaignTypes, setSelectedCampaignTypes] = useState<string[]>(['all']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [showDrillDownModal, { open: openDrillDown, close: closeDrillDown }] = useDisclosure(false);

  // Загрузка данных
  const { campaigns, timeSeries } = useMemo(() => generateMockData(), []);

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // Обновление данных
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    notifications.show({
      title: 'Обновление данных',
      message: 'Получение последних данных из Wildberries...',
      loading: true,
      id: 'data-refresh',
    });

    setTimeout(() => {
      setRefreshing(false);
      notifications.update({
        id: 'data-refresh',
        title: 'Данные обновлены',
        message: 'Все метрики актуализированы',
        color: 'green',
        icon: <IconChecks />,
        loading: false,
      });
    }, 2000);
  }, []);

  // Расчёт ключевых метрик
  const kpiMetrics: MetricCard[] = useMemo(() => {
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const totalOrders = campaigns.reduce((sum, c) => sum + c.orders, 0);
    const totalPurchases = campaigns.reduce((sum, c) => sum + c.purchases, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);

    return [
      {
        title: 'ROAS',
        value: (totalRevenue / totalSpend).toFixed(2) + 'x',
        trend: 12.5,
        trendDirection: 'up',
        icon: <IconTargetArrow size={24} />,
        color: 'green',
        description: 'Return on Ad Spend',
        sparklineData: timeSeries.map(d => d.revenue / d.spend),
      },
      {
        title: 'ACOS',
        value: ((totalSpend / totalRevenue) * 100).toFixed(1) + '%',
        trend: -5.3,
        trendDirection: 'down',
        icon: <IconPercentage size={24} />,
        color: 'orange',
        description: 'Advertising Cost of Sales',
        sparklineData: timeSeries.map(d => (d.spend / d.revenue) * 100),
      },
      {
        title: 'Конверсия',
        value: ((totalOrders / totalClicks) * 100).toFixed(2) + '%',
        trend: 8.7,
        trendDirection: 'up',
        icon: <IconShoppingCart size={24} />,
        color: 'blue',
        description: 'Conversion Rate',
        sparklineData: timeSeries.map(d => (d.orders / d.clicks) * 100),
      },
      {
        title: 'CTR',
        value: ((totalClicks / totalImpressions) * 100).toFixed(2) + '%',
        trend: 3.2,
        trendDirection: 'up',
        icon: <IconClick size={24} />,
        color: 'cyan',
        description: 'Click-Through Rate',
        sparklineData: timeSeries.map(d => (d.clicks / d.impressions) * 100),
      },
      {
        title: 'Выкуп',
        value: ((totalPurchases / totalOrders) * 100).toFixed(1) + '%',
        trend: -2.1,
        trendDirection: 'down',
        icon: <IconPackage size={24} />,
        color: 'grape',
        description: 'Purchase Rate',
        sparklineData: timeSeries.map(d => (d.purchases / d.orders) * 100),
      },
      {
        title: 'Расходы',
        value: `₽${(totalSpend / 1000).toFixed(1)}K`,
        trend: 15.8,
        trendDirection: 'up',
        icon: <IconCurrencyRubel size={24} />,
        color: 'red',
        description: 'Total Ad Spend',
        sparklineData: timeSeries.map(d => d.spend),
      },
    ];
  }, [campaigns, timeSeries]);

  // Функция для создания опций графика временных рядов
  const getTimeSeriesChartOptions = useCallback((): EChartsOption => {
    const isDark = colorScheme === 'dark';
    
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: isDark ? '#6a7985' : '#6a7985',
          },
        },
        backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)',
        borderColor: isDark ? '#333' : '#ddd',
        textStyle: {
          color: isDark ? '#fff' : '#000',
        },
      },
      legend: {
        data: ['Показы', 'Клики', 'Заказы', 'Выкупы', 'Расходы', 'Доход'],
        textStyle: {
          color: isDark ? '#ccc' : '#333',
        },
        top: 0,
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
            title: { zoom: 'Zoom', back: 'Reset' },
          },
          dataView: { readOnly: false, title: 'Данные' },
          magicType: { type: ['line', 'bar', 'stack'], title: { line: 'Линия', bar: 'Столбцы', stack: 'Стек' } },
          restore: { title: 'Сброс' },
          saveAsImage: { title: 'Сохранить' },
        },
        iconStyle: {
          borderColor: isDark ? '#ccc' : '#333',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: timeSeries.map(d => dayjs(d.date).format('DD.MM')),
          axisLine: {
            lineStyle: {
              color: isDark ? '#666' : '#ccc',
            },
          },
          axisLabel: {
            color: isDark ? '#ccc' : '#666',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Количество',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: isDark ? '#666' : '#ccc',
            },
          },
          axisLabel: {
            color: isDark ? '#ccc' : '#666',
            formatter: (value: number) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
              return value.toString();
            },
          },
          splitLine: {
            lineStyle: {
              color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            },
          },
        },
        {
          type: 'value',
          name: 'Сумма (₽)',
          position: 'right',
          axisLine: {
            lineStyle: {
              color: isDark ? '#666' : '#ccc',
            },
          },
          axisLabel: {
            color: isDark ? '#ccc' : '#666',
            formatter: (value: number) => `₽${(value / 1000).toFixed(0)}K`,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: 'Показы',
          type: 'line',
          stack: 'impressions',
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: theme.colors?.blue?.[6] || '#228be6',
          },
          emphasis: {
            focus: 'series',
          },
          data: timeSeries.map(d => d.impressions),
        },
        {
          name: 'Клики',
          type: 'line',
          stack: 'clicks',
          smooth: true,
          lineStyle: {
            width: 2,
            color: theme.colors?.cyan?.[6] || '#15aabf',
          },
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          data: timeSeries.map(d => d.clicks),
        },
        {
          name: 'Заказы',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 2,
            color: theme.colors?.green?.[6] || '#40c057',
          },
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          data: timeSeries.map(d => d.orders),
        },
        {
          name: 'Выкупы',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 2,
            color: theme.colors?.teal?.[6] || '#12b886',
            type: 'dashed',
          },
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          data: timeSeries.map(d => d.purchases),
        },
        {
          name: 'Расходы',
          type: 'bar',
          yAxisIndex: 1,
          itemStyle: {
            color: theme.colors?.red?.[6] || '#fa5252',
            opacity: 0.7,
          },
          emphasis: {
            focus: 'series',
          },
          data: timeSeries.map(d => d.spend),
        },
        {
          name: 'Доход',
          type: 'bar',
          yAxisIndex: 1,
          itemStyle: {
            color: theme.colors?.green?.[6] || '#40c057',
            opacity: 0.7,
          },
          emphasis: {
            focus: 'series',
          },
          data: timeSeries.map(d => d.revenue),
        },
      ],
    };
  }, [timeSeries, theme, colorScheme]);

  // Функция для создания опций графика воронки
  const getFunnelChartOptions = useCallback((): EChartsOption => {
    const isDark = colorScheme === 'dark';
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalOrders = campaigns.reduce((sum, c) => sum + c.orders, 0);
    const totalPurchases = campaigns.reduce((sum, c) => sum + c.purchases, 0);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)',
        borderColor: isDark ? '#333' : '#ddd',
        textStyle: {
          color: isDark ? '#fff' : '#000',
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Показы', 'Клики', 'Заказы', 'Выкупы'],
        textStyle: {
          color: isDark ? '#ccc' : '#333',
        },
      },
      series: [
        {
          name: 'Воронка',
          type: 'funnel',
          left: '20%',
          width: '60%',
          label: {
            formatter: '{b}\n{c} ({d}%)',
            position: 'inside',
            fontSize: 14,
            fontWeight: 'bold',
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid',
            },
          },
          itemStyle: {
            borderColor: isDark ? '#1a1b1e' : '#fff',
            borderWidth: 2,
          },
          emphasis: {
            label: {
              fontSize: 20,
            },
          },
          data: [
            { value: totalImpressions, name: 'Показы', itemStyle: { color: theme.colors?.blue?.[6] || '#228be6' } },
            { value: totalClicks, name: 'Клики', itemStyle: { color: theme.colors?.cyan?.[6] || '#15aabf' } },
            { value: totalOrders, name: 'Заказы', itemStyle: { color: theme.colors?.green?.[6] || '#40c057' } },
            { value: totalPurchases, name: 'Выкупы', itemStyle: { color: theme.colors?.teal?.[6] || '#12b886' } },
          ],
        },
      ],
    };
  }, [campaigns, theme, colorScheme]);

  // Функция для создания опций тепловой карты
  const getHeatmapChartOptions = useCallback((): EChartsOption => {
    const isDark = colorScheme === 'dark';
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    // Генерация данных для тепловой карты
    const heatmapData: any[] = [];
    days.forEach((day, dayIndex) => {
      hours.forEach((hour, hourIndex) => {
        const value = Math.random() * 100;
        heatmapData.push([hourIndex, dayIndex, value.toFixed(1)]);
      });
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          return `${days[params.data[1]]}, ${hours[params.data[0]]}<br/>Эффективность: ${params.data[2]}%`;
        },
        backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)',
        borderColor: isDark ? '#333' : '#ddd',
        textStyle: {
          color: isDark ? '#fff' : '#000',
        },
      },
      grid: {
        height: '80%',
        top: '10%',
      },
      xAxis: {
        type: 'category',
        data: hours,
        splitArea: {
          show: true,
          areaStyle: {
            color: isDark ? ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)'] : ['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.05)'],
          },
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#666' : '#ccc',
          },
        },
        axisLabel: {
          color: isDark ? '#ccc' : '#666',
          interval: 2,
        },
      },
      yAxis: {
        type: 'category',
        data: days,
        splitArea: {
          show: true,
          areaStyle: {
            color: isDark ? ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)'] : ['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.05)'],
          },
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#666' : '#ccc',
          },
        },
        axisLabel: {
          color: isDark ? '#ccc' : '#666',
        },
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        textStyle: {
          color: isDark ? '#ccc' : '#666',
        },
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
        },
      },
      series: [{
        name: 'Эффективность',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true,
          fontSize: 10,
          color: '#000',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }],
    };
  }, [colorScheme]);

  // Функция для создания опций scatter plot для кампаний
  const getCampaignScatterOptions = useCallback((): EChartsOption => {
    const isDark = colorScheme === 'dark';
    
    const scatterData = campaigns.map(campaign => ({
      name: campaign.name,
      value: [campaign.roas, campaign.revenue, campaign.spend, campaign.type],
      itemStyle: {
        color: {
          search: theme.colors?.blue?.[6] || '#228be6',
          auto: theme.colors?.green?.[6] || '#40c057',
          card: theme.colors?.orange?.[6] || '#fd7e14',
          banner: theme.colors?.purple?.[6] || '#9775fa',
          media: theme.colors?.pink?.[6] || '#f06595',
        }[campaign.type] || '#228be6',
      },
    }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const campaign = campaigns.find(c => c.name === params.name);
          if (!campaign) return '';
          return `
            <strong>${params.name}</strong><br/>
            ROAS: ${campaign.roas.toFixed(2)}x<br/>
            Доход: ₽${(campaign.revenue / 1000).toFixed(1)}K<br/>
            Расход: ₽${(campaign.spend / 1000).toFixed(1)}K<br/>
            CTR: ${campaign.ctr.toFixed(2)}%<br/>
            Конверсия: ${campaign.conversionRate.toFixed(2)}%
          `;
        },
        backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)',
        borderColor: isDark ? '#333' : '#ddd',
        textStyle: {
          color: isDark ? '#fff' : '#000',
        },
      },
      legend: {
        data: ['Поиск', 'Авто', 'Карточка', 'Баннеры', 'Медиа'],
        textStyle: {
          color: isDark ? '#ccc' : '#333',
        },
        top: 0,
      },
      grid: {
        left: '3%',
        right: '7%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: 'ROAS',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          color: isDark ? '#ccc' : '#666',
          fontSize: 14,
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#666' : '#ccc',
          },
        },
        axisLabel: {
          color: isDark ? '#ccc' : '#666',
          formatter: (value: number) => `${value}x`,
        },
        splitLine: {
          lineStyle: {
            color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: 'Доход (₽)',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          color: isDark ? '#ccc' : '#666',
          fontSize: 14,
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#666' : '#ccc',
          },
        },
        axisLabel: {
          color: isDark ? '#ccc' : '#666',
          formatter: (value: number) => `${(value / 1000).toFixed(0)}K`,
        },
        splitLine: {
          lineStyle: {
            color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          },
        },
      },
      series: [
        {
          name: 'Поиск',
          type: 'scatter',
          data: scatterData.filter(d => campaigns.find(c => c.name === d.name)?.type === 'search'),
          symbolSize: (data: any) => Math.sqrt(data[2]) / 50,
          emphasis: {
            focus: 'series',
            label: {
              show: true,
              formatter: '{b}',
              position: 'top',
            },
          },
        },
        {
          name: 'Авто',
          type: 'scatter',
          data: scatterData.filter(d => campaigns.find(c => c.name === d.name)?.type === 'auto'),
          symbolSize: (data: any) => Math.sqrt(data[2]) / 50,
          emphasis: {
            focus: 'series',
            label: {
              show: true,
              formatter: '{b}',
              position: 'top',
            },
          },
        },
        {
          name: 'Карточка',
          type: 'scatter',
          data: scatterData.filter(d => campaigns.find(c => c.name === d.name)?.type === 'card'),
          symbolSize: (data: any) => Math.sqrt(data[2]) / 50,
          emphasis: {
            focus: 'series',
            label: {
              show: true,
              formatter: '{b}',
              position: 'top',
            },
          },
        },
        {
          name: 'Баннеры',
          type: 'scatter',
          data: scatterData.filter(d => campaigns.find(c => c.name === d.name)?.type === 'banner'),
          symbolSize: (data: any) => Math.sqrt(data[2]) / 50,
          emphasis: {
            focus: 'series',
            label: {
              show: true,
              formatter: '{b}',
              position: 'top',
            },
          },
        },
        {
          name: 'Медиа',
          type: 'scatter',
          data: scatterData.filter(d => campaigns.find(c => c.name === d.name)?.type === 'media'),
          symbolSize: (data: any) => Math.sqrt(data[2]) / 50,
          emphasis: {
            focus: 'series',
            label: {
              show: true,
              formatter: '{b}',
              position: 'top',
            },
          },
        },
      ],
    };
  }, [campaigns, theme, colorScheme]);

  // Обработчик клика для drill-down
  const handleChartClick = useCallback((params: any, chartType: string) => {
    setDrillDownData({ params, chartType });
    openDrillDown();
  }, [openDrillDown]);

  // Компонент метрической карточки
  const MetricCardComponent: React.FC<{ metric: MetricCard }> = ({ metric }) => {
    const { hovered, ref } = useHover();
    
    return (
      <UnstyledButton ref={ref} style={{ width: '100%' }}>
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
            borderColor: hovered ? theme.colors?.[metric.color]?.[5] : undefined,
          }}
        >
          <Group justify="space-between" mb="xs">
            <ThemeIcon color={metric.color} size="lg" radius="md" variant="light">
              {metric.icon}
            </ThemeIcon>
            <Menu withinPortal position="bottom-end" shadow="sm">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" size="sm">
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconChartLine size={14} />}>
                  Детальный анализ
                </Menu.Item>
                <Menu.Item leftSection={<IconDownload size={14} />}>
                  Экспорт данных
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Настройки
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
          
          <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb={5}>
            {metric.title}
          </Text>
          
          <Group justify="space-between" align="flex-end" gap={0}>
            <div>
              <Text size="xl" fw={700} lh={1}>
                {metric.value}
              </Text>
              <Group gap={5} mt={5}>
                <ThemeIcon
                  color={metric.trendDirection === 'up' ? 'green' : 'red'}
                  size="xs"
                  radius="sm"
                  variant="light"
                >
                  {metric.trendDirection === 'up' ? (
                    <IconArrowUpRight size={12} />
                  ) : (
                    <IconArrowDownRight size={12} />
                  )}
                </ThemeIcon>
                <Text
                  size="xs"
                  c={metric.trendDirection === 'up' ? 'green' : 'red'}
                  fw={600}
                >
                  {Math.abs(metric.trend)}%
                </Text>
              </Group>
            </div>
            
            {metric.sparklineData && (
              <Box style={{ width: 80, height: 30 }}>
                <ReactECharts
                  option={{
                    grid: { left: 0, right: 0, top: 0, bottom: 0 },
                    xAxis: { show: false, type: 'category' },
                    yAxis: { show: false, type: 'value' },
                    series: [{
                      type: 'line',
                      data: metric.sparklineData.slice(-7),
                      smooth: true,
                      showSymbol: false,
                      lineStyle: {
                        color: theme.colors?.[metric.color]?.[6] || '#228be6',
                        width: 2,
                      },
                      areaStyle: {
                        color: theme.colors?.[metric.color]?.[2] || '#e7f5ff',
                        opacity: 0.3,
                      },
                    }],
                  }}
                  style={{ height: '100%', width: '100%' }}
                  opts={{ renderer: 'svg' }}
                />
              </Box>
            )}
          </Group>
          
          {metric.description && (
            <Text size="xs" c="dimmed" mt="xs">
              {metric.description}
            </Text>
          )}
        </Card>
      </UnstyledButton>
    );
  };

  // Компонент таблицы кампаний
  const CampaignsTable: React.FC = () => {
    const [sortBy, setSortBy] = useState<keyof CampaignData>('revenue');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState('');

    const sortedCampaigns = useMemo(() => {
      let filtered = campaigns;
      
      if (searchQuery) {
        filtered = campaigns.filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return [...filtered].sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        const modifier = sortOrder === 'asc' ? 1 : -1;
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * modifier;
        }
        
        return String(aVal).localeCompare(String(bVal)) * modifier;
      });
    }, [campaigns, sortBy, sortOrder, searchQuery]);

    const handleSort = (column: keyof CampaignData) => {
      if (sortBy === column) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(column);
        setSortOrder('desc');
      }
    };

    return (
      <Stack>
        <Group justify="space-between">
          <TextInput
            placeholder="Поиск кампаний..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ width: 300 }}
          />
          <Group>
            <Button
              variant="light"
              leftSection={<IconFileExport size={16} />}
              size="sm"
            >
              Экспорт
            </Button>
            <Button
              variant="light"
              leftSection={<IconFilter size={16} />}
              size="sm"
            >
              Фильтры
            </Button>
          </Group>
        </Group>

        <ScrollArea>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <UnstyledButton onClick={() => handleSort('name')}>
                    <Group gap={5}>
                      Название
                      {sortBy === 'name' && (
                        sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />
                      )}
                    </Group>
                  </UnstyledButton>
                </Table.Th>
                <Table.Th>Тип</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>
                  <UnstyledButton onClick={() => handleSort('impressions')}>
                    <Group gap={5} justify="flex-end">
                      Показы
                      {sortBy === 'impressions' && (
                        sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />
                      )}
                    </Group>
                  </UnstyledButton>
                </Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>
                  <UnstyledButton onClick={() => handleSort('clicks')}>
                    <Group gap={5} justify="flex-end">
                      Клики
                      {sortBy === 'clicks' && (
                        sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />
                      )}
                    </Group>
                  </UnstyledButton>
                </Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>
                  <UnstyledButton onClick={() => handleSort('ctr')}>
                    <Group gap={5} justify="flex-end">
                      CTR
                      {sortBy === 'ctr' && (
                        sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />
                      )}
                    </Group>
                  </UnstyledButton>
                </Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>
                  <UnstyledButton onClick={() => handleSort('orders')}>
                    <Group gap={5} justify="flex-end">
                      Заказы
                      {sortBy === 'orders' && (
                        sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />
                      )}
                    </Group>
                  </UnstyledButton>
                </Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>
                  <UnstyledButton onClick={() => handleSort('conversionRate')}>
                    <Group gap={5} justify="flex-end">
                      CR
                      {sortBy === 'conversionRate' && (
                        sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />
                      )}
                    </Group>
                  </UnstyledButton>
                </Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>
                  <UnstyledButton onClick={() => handleSort('spend')}>
                    <Group gap={5} justify="flex-end">
                      Расход
                      {sortBy === 'spend' && (
                        sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />
                      )}
                    </Group>
                  </UnstyledButton>
                </Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>
                  <UnstyledButton onClick={() => handleSort('revenue')}>
                    <Group gap={5} justify="flex-end">
                      Доход
                      {sortBy === 'revenue' && (
                        sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />
                      )}
                    </Group>
                  </UnstyledButton>
                </Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>
                  <UnstyledButton onClick={() => handleSort('roas')}>
                    <Group gap={5} justify="flex-end">
                      ROAS
                      {sortBy === 'roas' && (
                        sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />
                      )}
                    </Group>
                  </UnstyledButton>
                </Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>
                  <UnstyledButton onClick={() => handleSort('acos')}>
                    <Group gap={5} justify="flex-end">
                      ACOS
                      {sortBy === 'acos' && (
                        sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />
                      )}
                    </Group>
                  </UnstyledButton>
                </Table.Th>
                <Table.Th>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedCampaigns.map((campaign) => (
                <Table.Tr key={campaign.id}>
                  <Table.Td>
                    <Anchor size="sm" fw={500}>
                      {campaign.name}
                    </Anchor>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={{
                        search: 'blue',
                        auto: 'green',
                        card: 'orange',
                        banner: 'purple',
                        media: 'pink',
                      }[campaign.type]}
                      variant="light"
                      size="sm"
                    >
                      {{
                        search: 'Поиск',
                        auto: 'Авто',
                        card: 'Карточка',
                        banner: 'Баннеры',
                        media: 'Медиа',
                      }[campaign.type]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={{
                        active: 'green',
                        paused: 'yellow',
                        completed: 'gray',
                      }[campaign.status]}
                      variant="dot"
                      size="sm"
                    >
                      {{
                        active: 'Активна',
                        paused: 'Пауза',
                        completed: 'Завершена',
                      }[campaign.status]}
                    </Badge>
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    {campaign.impressions.toLocaleString()}
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    {campaign.clicks.toLocaleString()}
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    <Text size="sm" fw={500} c={campaign.ctr > 2 ? 'green' : 'red'}>
                      {campaign.ctr.toFixed(2)}%
                    </Text>
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    {campaign.orders.toLocaleString()}
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    <Text size="sm" fw={500} c={campaign.conversionRate > 5 ? 'green' : 'red'}>
                      {campaign.conversionRate.toFixed(2)}%
                    </Text>
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    ₽{campaign.spend.toLocaleString()}
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    ₽{campaign.revenue.toLocaleString()}
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    <Text size="sm" fw={700} c={campaign.roas > 4 ? 'green' : campaign.roas > 2 ? 'yellow' : 'red'}>
                      {campaign.roas.toFixed(2)}x
                    </Text>
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    <Text size="sm" fw={500} c={campaign.acos < 25 ? 'green' : campaign.acos < 40 ? 'yellow' : 'red'}>
                      {campaign.acos.toFixed(1)}%
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={5} wrap="nowrap">
                      <Tooltip label="Редактировать">
                        <ActionIcon variant="subtle" size="sm">
                          <IconAdjustments size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Статистика">
                        <ActionIcon variant="subtle" size="sm">
                          <IconChartBar size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Дублировать">
                        <ActionIcon variant="subtle" size="sm">
                          <IconCopy size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Stack>
    );
  };

  // Если загрузка - показываем скелетоны
  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Stack>
          <Skeleton height={60} radius="md" />
          <Grid>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
                <Skeleton height={120} radius="md" />
              </Grid.Col>
            ))}
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Skeleton height={400} radius="md" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Skeleton height={400} radius="md" />
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack>
        {/* Заголовок и управление */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <Group justify="space-between" align="center" wrap="nowrap">
            <div>
              <Title order={2} fw={700}>
                Аналитика рекламы Wildberries
              </Title>
              <Text size="sm" c="dimmed">
                Последнее обновление: {dayjs().format('DD.MM.YYYY HH:mm')}
              </Text>
            </div>
            
            <Group>
              <DatePicker
                type="range"
                value={dateRange}
                onChange={(value) => {
                  if (Array.isArray(value) && value.length === 2) {
                    setDateRange([
                      value[0] ? new Date(value[0]) : null,
                      value[1] ? new Date(value[1]) : null
                    ]);
                  }
                }}
                maxDate={new Date()}
                style={{ width: 260 }}
              />
              
              <Tooltip label="Сравнить с периодом">
                <ActionIcon variant="light" size="lg">
                  <IconCalendar size={20} />
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label={refreshing ? 'Обновление...' : 'Обновить данные'}>
                <ActionIcon
                  variant="filled"
                  size="lg"
                  onClick={handleRefresh}
                  loading={refreshing}
                >
                  <IconRefresh size={20} />
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label="Настройки">
                <ActionIcon variant="light" size="lg">
                  <IconSettings size={20} />
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label={colorScheme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}>
                <ActionIcon
                  variant="light"
                  size="lg"
                  onClick={() => toggleColorScheme()}
                >
                  {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Paper>

        {/* KPI метрики */}
        <Grid>
          {kpiMetrics.map((metric, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
              <MetricCardComponent metric={metric} />
            </Grid.Col>
          ))}
        </Grid>

        {/* Основной контент с табами */}
        <Card shadow="sm" padding={0} radius="md" withBorder>
          <Grid gutter={0}>
            {/* Вертикальные табы */}
            <Grid.Col span={{ base: 12, md: 2 }} style={{ borderRight: `1px solid ${theme.colors.gray[3]}` }}>
              <Tabs
                value={activeTab}
                onChange={setActiveTab}
                orientation="vertical"
                variant="pills"
                styles={{
                  root: { height: '100%' },
                  panel: { padding: 0 },
                  tab: {
                    padding: '12px 16px',
                    fontWeight: 500,
                  },
                }}
              >
                <Tabs.List p="md">
                  <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
                    Обзор
                  </Tabs.Tab>
                  <Tabs.Tab value="campaigns" leftSection={<IconAd size={16} />}>
                    Кампании
                  </Tabs.Tab>
                  <Tabs.Tab value="keywords" leftSection={<IconSearch size={16} />}>
                    Ключевые слова
                  </Tabs.Tab>
                  <Tabs.Tab value="products" leftSection={<IconPackage size={16} />}>
                    Товары
                  </Tabs.Tab>
                  <Tabs.Tab value="competitors" leftSection={<IconEye size={16} />}>
                    Конкуренты
                  </Tabs.Tab>
                  <Tabs.Tab value="ab-testing" leftSection={<IconTestPipe size={16} />}>
                    A/B тесты
                  </Tabs.Tab>
                </Tabs.List>

                {/* Панель Обзор */}
                <Tabs.Panel value="overview" p="lg">
                  <Stack>
                    <Title order={4} mb="md">Общая динамика</Title>
                    
                    {/* Временной график */}
                    <Card shadow="xs" radius="md" withBorder>
                      <Group justify="space-between" mb="md">
                        <Title order={5}>Динамика показателей</Title>
                        <SegmentedControl
                          size="xs"
                          data={[
                            { label: 'День', value: 'day' },
                            { label: 'Неделя', value: 'week' },
                            { label: 'Месяц', value: 'month' },
                          ]}
                          defaultValue="day"
                        />
                      </Group>
                      <Box h={400}>
                        <ReactECharts
                          option={getTimeSeriesChartOptions()}
                          style={{ height: '100%', width: '100%' }}
                          onEvents={{
                            click: (params: any) => handleChartClick(params, 'timeseries'),
                          }}
                        />
                      </Box>
                    </Card>

                    <Grid>
                      {/* Воронка конверсий */}
                      <Grid.Col span={{ base: 12, lg: 6 }}>
                        <Card shadow="xs" radius="md" withBorder h={400}>
                          <Title order={5} mb="md">Воронка конверсий</Title>
                          <ReactECharts
                            option={getFunnelChartOptions()}
                            style={{ height: '90%', width: '100%' }}
                            onEvents={{
                              click: (params: any) => handleChartClick(params, 'funnel'),
                            }}
                          />
                        </Card>
                      </Grid.Col>

                      {/* Тепловая карта активности */}
                      <Grid.Col span={{ base: 12, lg: 6 }}>
                        <Card shadow="xs" radius="md" withBorder h={400}>
                          <Title order={5} mb="md">Активность по часам</Title>
                          <ReactECharts
                            option={getHeatmapChartOptions()}
                            style={{ height: '90%', width: '100%' }}
                            onEvents={{
                              click: (params: any) => handleChartClick(params, 'heatmap'),
                            }}
                          />
                        </Card>
                      </Grid.Col>
                    </Grid>

                    {/* Insights и рекомендации */}
                    <Card shadow="xs" radius="md" withBorder>
                      <Title order={5} mb="md">
                        <Group gap="xs">
                          <IconBulb size={20} />
                          Ключевые инсайты
                        </Group>
                      </Title>
                      <Timeline active={2} bulletSize={24} lineWidth={2}>
                        <Timeline.Item
                          bullet={<IconTrendingUp size={12} />}
                          title="Рост эффективности"
                        >
                          <Text c="dimmed" size="sm">
                            Кампании в поиске показывают рост ROAS на 23% за последнюю неделю
                          </Text>
                        </Timeline.Item>
                        <Timeline.Item
                          bullet={<IconAlertCircle size={12} />}
                          title="Требует внимания"
                          lineVariant="dashed"
                        >
                          <Text c="dimmed" size="sm">
                            Автокампании имеют высокий ACOS (&gt;40%). Рекомендуется оптимизация ставок
                          </Text>
                        </Timeline.Item>
                        <Timeline.Item
                          bullet={<IconBulb size={12} />}
                          title="Возможность"
                        >
                          <Text c="dimmed" size="sm">
                            Обнаружены неиспользуемые ключевые слова с высоким потенциалом конверсии
                          </Text>
                        </Timeline.Item>
                      </Timeline>
                    </Card>
                  </Stack>
                </Tabs.Panel>

                {/* Панель Кампании */}
                <Tabs.Panel value="campaigns" p="lg">
                  <Stack>
                    <Group justify="space-between" mb="md">
                      <Title order={4}>Управление кампаниями</Title>
                      <Group>
                        <SegmentedControl
                          value={viewMode}
                          onChange={(value: any) => setViewMode(value)}
                          data={[
                            { label: 'Карточки', value: 'cards' },
                            { label: 'Таблица', value: 'table' },
                          ]}
                        />
                        <Button leftSection={<IconPlus size={16} />}>
                          Новая кампания
                        </Button>
                      </Group>
                    </Group>

                    <Grid mb="lg">
                      <Grid.Col span={{ base: 12, lg: 8 }}>
                        <Card shadow="xs" radius="md" withBorder h={400}>
                          <Title order={5} mb="md">Анализ эффективности кампаний</Title>
                          <ReactECharts
                            option={getCampaignScatterOptions()}
                            style={{ height: '90%', width: '100%' }}
                            onEvents={{
                              click: (params: any) => handleChartClick(params, 'scatter'),
                            }}
                          />
                        </Card>
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, lg: 4 }}>
                        <Stack>
                          <Card shadow="xs" radius="md" withBorder>
                            <Title order={6} mb="sm">Распределение бюджета</Title>
                            <Stack gap="xs">
                              {['search', 'auto', 'card', 'banner', 'media'].map((type) => {
                                const typeData = campaigns.filter(c => c.type === type);
                                const totalSpend = typeData.reduce((sum, c) => sum + c.spend, 0);
                                const allSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
                                const percentage = (totalSpend / allSpend) * 100;
                                
                                return (
                                  <div key={type}>
                                    <Group justify="space-between" mb={5}>
                                      <Text size="sm" fw={500}>
                                        {{
                                          search: 'Поиск',
                                          auto: 'Авто',
                                          card: 'Карточка',
                                          banner: 'Баннеры',
                                          media: 'Медиа',
                                        }[type]}
                                      </Text>
                                      <Text size="sm" c="dimmed">
                                        {percentage.toFixed(1)}%
                                      </Text>
                                    </Group>
                                    <Progress
                                      value={percentage}
                                      color={{
                                        search: 'blue',
                                        auto: 'green',
                                        card: 'orange',
                                        banner: 'purple',
                                        media: 'pink',
                                      }[type]}
                                      size="sm"
                                      radius="sm"
                                    />
                                  </div>
                                );
                              })}
                            </Stack>
                          </Card>
                          
                          <Card shadow="xs" radius="md" withBorder>
                            <Title order={6} mb="sm">Топ кампании по ROAS</Title>
                            <Stack gap="xs">
                              {[...campaigns]
                                .sort((a, b) => b.roas - a.roas)
                                .slice(0, 5)
                                .map((campaign, index) => (
                                  <Group key={campaign.id} justify="space-between">
                                    <Group gap="xs">
                                      <Avatar size="sm" radius="xl">
                                        {index + 1}
                                      </Avatar>
                                      <Text size="sm" lineClamp={1}>
                                        {campaign.name}
                                      </Text>
                                    </Group>
                                    <Badge color="green" variant="light" size="sm">
                                      {campaign.roas.toFixed(2)}x
                                    </Badge>
                                  </Group>
                                ))}
                            </Stack>
                          </Card>
                        </Stack>
                      </Grid.Col>
                    </Grid>

                    {viewMode === 'table' && <CampaignsTable />}
                  </Stack>
                </Tabs.Panel>

                {/* Остальные панели */}
                <Tabs.Panel value="keywords" p="lg">
                  <Stack>
                    <Title order={4}>Анализ ключевых слов</Title>
                    <Alert icon={<IconInfoCircle />} color="blue">
                      Раздел находится в разработке. Здесь будет детальный анализ эффективности ключевых слов.
                    </Alert>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="products" p="lg">
                  <Stack>
                    <Title order={4}>Анализ товаров</Title>
                    <Alert icon={<IconInfoCircle />} color="blue">
                      Раздел находится в разработке. Здесь будет анализ эффективности рекламы по товарам.
                    </Alert>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="competitors" p="lg">
                  <Stack>
                    <Title order={4}>Конкурентный анализ</Title>
                    <Alert icon={<IconInfoCircle />} color="blue">
                      Раздел находится в разработке. Здесь будет мониторинг конкурентов.
                    </Alert>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="ab-testing" p="lg">
                  <Stack>
                    <Title order={4}>A/B тестирование</Title>
                    <Alert icon={<IconInfoCircle />} color="blue">
                      Раздел находится в разработке. Здесь будет управление A/B тестами.
                    </Alert>
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Модальное окно для drill-down */}
        <Modal
          opened={showDrillDownModal}
          onClose={closeDrillDown}
          title="Детальный анализ"
          size="xl"
        >
          {drillDownData && (
            <Stack>
              <Text>Детальная информация по выбранному элементу</Text>
              <pre>{JSON.stringify(drillDownData, null, 2)}</pre>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};

export default AdvertisingAnalysisPage;