import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Stack,
  Paper,
  Group,
  Text,
  Badge,
  ThemeIcon,
  Progress,
  Select,
  SegmentedControl,
  Button,
  Loader,
  Center,
  NumberFormatter,
  Box,
  ScrollArea,
  Table,
  ActionIcon,
  Tooltip,
  Menu,
  Divider,
  Indicator,
  UnstyledButton,
  Collapse,
  Transition,
  rem,
  Tabs,
  Modal,
  RingProgress,
  SimpleGrid,
  Card,
  Slider,
  NumberInput,
  Alert,
  List,
  Avatar,
  Anchor,
  Title
} from '@mantine/core';
import {
  IconRefresh,
  IconFilter,
  IconDownload,
  IconCalendar,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconAlertTriangle,
  IconPackage,
  IconCash,
  IconStar,
  IconShoppingCart,
  IconArrowUpRight,
  IconArrowDownRight,
  IconDots,
  IconEye,
  IconEyeOff,
  IconBell,
  IconBellOff,
  IconChevronDown,
  IconChevronUp,
  IconArrowRight,
  IconMessage,
  IconUsers,
  IconClock,
  IconChartLine,
  IconTarget,
  IconCurrencyRubel,
  IconTruck,
  IconBuildingWarehouse,
  IconAd,
  IconBrandGoogle,
  IconChartPie,
  IconUsersGroup,
  IconChevronRight,
  IconCalculator,
  IconPercentage,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconStarFilled,
  IconStarHalf,
  IconAdjustments,
  IconListDetails,
  IconChartBar,
  IconCoins,
  IconHeartbeat
} from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useDisclosure, useHover } from '@mantine/hooks';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';
import AdsAnalytics from '../components/AdsAnalytics';

// ============================================
// TYPES & INTERFACES
// ============================================

// Enhanced KPI Types
interface EnhancedKPIMetric {
  id: string;
  category: 'pricing' | 'sales' | 'finance' | 'logistics' | 'advertising' | 'reviews' | 'market';
  label: string;
  value: number;
  previousValue?: number;
  target: number;
  format: 'currency' | 'percent' | 'number';
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'bad';
  icon: React.ComponentType<any>;
  details?: any;
  subMetrics?: SubMetric[];
}

interface SubMetric {
  label: string;
  value: number;
  format: 'currency' | 'percent' | 'number';
  status?: 'good' | 'warning' | 'bad';
}

interface CompetitorInfo {
  id: string;
  name: string;
  logo?: string;
  orders: number;
  sales: number;
  avgPrice: number;
  marketShare: number;
  adSpend: number;
  position: number;
  keywords: string[];
}

interface AdKeywordMetric {
  keyword: string;
  position: number;
  spend: number;
  planSpend: number;
  clicks: number;
  conversions: number;
  cpc: number;
  roi: number;
}

interface ReviewDistribution {
  rating: number;
  count: number;
  percentage: number;
}

interface PieDataItem {
  name: string;
  value: number;
  percentage: number;
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'rating' | 'stock' | 'budget' | 'position' | 'competitor';
  title: string;
  description: string;
  metric?: {
    current: number;
    threshold: number;
    unit?: string;
    trend: 'up' | 'down' | 'stable';
  };
  actions: {
    label: string;
    action: () => void;
    variant: 'filled' | 'light' | 'subtle';
  }[];
  timestamp: Date;
  isRead: boolean;
  affectedItems: {
    id: string;
    name: string;
    sku: string;
    rating?: number;
    stock?: number;
    price?: number;
  }[];
}

interface AIInsight {
  id: string;
  type: 'prediction' | 'anomaly' | 'trend' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  suggestedAction?: string;
}

interface ProblemItem {
  id: string;
  type: 'stock' | 'rating' | 'price' | 'position';
  severity: 'critical' | 'warning' | 'info';
  product: string;
  sku: string;
  description: string;
  metric: string;
  action: string;
}

// Data fetching hooks interfaces
interface OperationalData {
  kpis: EnhancedKPIMetric[];
  competitors: CompetitorInfo[];
  adKeywords: AdKeywordMetric[];
  reviewDistribution: ReviewDistribution[];
  loading: boolean;
  error: Error | null;
}

// Data Service Type
interface DataService {
  fetchKPIs: () => Promise<EnhancedKPIMetric[]>;
  fetchCompetitors: () => Promise<CompetitorInfo[]>;
  fetchAdKeywords: () => Promise<AdKeywordMetric[]>;
  fetchReviewDistribution: () => Promise<ReviewDistribution[]>;
}

// ============================================
// DATA HOOKS (for easy transition to real data)
// ============================================

// Mock data service
const dataService: DataService = {
  fetchKPIs: async (): Promise<EnhancedKPIMetric[]> => {
    return generateEnhancedKPIData();
  },
  fetchCompetitors: async (): Promise<CompetitorInfo[]> => {
    return generateCompetitorsData();
  },
  fetchAdKeywords: async (): Promise<AdKeywordMetric[]> => {
    return generateAdKeywordsData();
  },
  fetchReviewDistribution: async (): Promise<ReviewDistribution[]> => {
    return generateReviewDistribution();
  }
};

// Custom hook for operational data
const useOperationalData = () => {
  const [data, setData] = useState<OperationalData>({
    kpis: [],
    competitors: [],
    adKeywords: [],
    reviewDistribution: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true }));
        
        const [kpis, competitors, adKeywords, reviewDistribution] = await Promise.all([
          dataService.fetchKPIs(),
          dataService.fetchCompetitors(),
          dataService.fetchAdKeywords(),
          dataService.fetchReviewDistribution()
        ]);
        
        setData({
          kpis,
          competitors,
          adKeywords,
          reviewDistribution,
          loading: false,
          error: null
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: error as Error
        }));
      }
    };

    fetchData();
  }, []);

  return data;
};

// ============================================
// DATA GENERATION (temporary - remove in production)
// ============================================

const generateEnhancedKPIData = (): EnhancedKPIMetric[] => [
  // Pricing metrics
  {
    id: 'price',
    category: 'pricing',
    label: 'Средняя цена',
    value: 2450,
    previousValue: 2300,
    target: 2400,
    format: 'currency',
    trend: 'up',
    status: 'good',
    icon: IconCurrencyRubel,
    subMetrics: [
      { label: 'Мин. допустимая', value: 1900, format: 'currency', status: 'warning' },
      { label: 'Макс. цена', value: 3200, format: 'currency' },
      { label: 'Цена конкурентов', value: 2380, format: 'currency' }
    ]
  },
  {
    id: 'margin',
    category: 'pricing',
    label: 'Маржа',
    value: 35.2,
    previousValue: 32.1,
    target: 40,
    format: 'percent',
    trend: 'up',
    status: 'warning',
    icon: IconPercentage,
    subMetrics: [
      { label: 'Валовая маржа', value: 45.5, format: 'percent' },
      { label: 'Чистая маржа', value: 18.3, format: 'percent' }
    ]
  },
  {
    id: 'daily-profit',
    category: 'pricing',
    label: 'Прибыль за день',
    value: 125430,
    previousValue: 98200,
    target: 120000,
    format: 'currency',
    trend: 'up',
    status: 'good',
    icon: IconChartLine
  },
  
  // Sales metrics
  {
    id: 'units-sold',
    category: 'sales',
    label: 'Продано штук',
    value: 324,
    previousValue: 287,
    target: 350,
    format: 'number',
    trend: 'up',
    status: 'warning',
    icon: IconPackage,
    subMetrics: [
      { label: 'План продаж', value: 350, format: 'number' },
      { label: 'Выполнение', value: 92.6, format: 'percent', status: 'warning' },
      { label: 'Выкуп', value: 84.2, format: 'percent', status: 'good' }
    ]
  },
  {
    id: 'conversion',
    category: 'sales',
    label: 'Конверсия',
    value: 2.8,
    previousValue: 3.1,
    target: 3.5,
    format: 'percent',
    trend: 'down',
    status: 'warning',
    icon: IconTarget,
    subMetrics: [
      { label: 'Клики → Корзина', value: 12.5, format: 'percent' },
      { label: 'Корзина → Заказ', value: 68.3, format: 'percent' },
      { label: 'Заказ → Выкуп', value: 84.2, format: 'percent' }
    ]
  },
  
  // Finance metrics
  {
    id: 'payment',
    category: 'finance',
    label: 'К перечислению',
    value: 1234560,
    previousValue: 1100000,
    target: 1300000,
    format: 'currency',
    trend: 'up',
    status: 'warning',
    icon: IconCash,
    subMetrics: [
      { label: 'Комиссия WB (15%)', value: 185184, format: 'currency', status: 'warning' },
      { label: 'Штрафы', value: 12500, format: 'currency', status: 'bad' },
      { label: 'Контроль качества', value: 3200, format: 'currency' }
    ]
  },
  
  // Logistics metrics
  {
    id: 'logistics',
    category: 'logistics',
    label: 'Логистика',
    value: 8.5,
    previousValue: 9.2,
    target: 7,
    format: 'percent',
    trend: 'down',
    status: 'warning',
    icon: IconTruck,
    subMetrics: [
      { label: 'Макс. допустимо', value: 10, format: 'percent', status: 'warning' },
      { label: 'Стоимость', value: 104850, format: 'currency' },
      { label: 'За единицу', value: 324, format: 'currency' }
    ]
  },
  {
    id: 'storage',
    category: 'logistics',
    label: 'Хранение',
    value: 23450,
    previousValue: 19800,
    target: 20000,
    format: 'currency',
    trend: 'up',
    status: 'bad',
    icon: IconBuildingWarehouse,
    subMetrics: [
      { label: 'Дней на складе', value: 12.3, format: 'number' },
      { label: 'Объем (м³)', value: 234, format: 'number' },
      { label: 'За единицу/день', value: 100, format: 'currency' }
    ]
  },
  
  // Advertising metrics
  {
    id: 'advertising',
    category: 'advertising',
    label: 'Реклама',
    value: 145000,
    previousValue: 120000,
    target: 130000,
    format: 'currency',
    trend: 'up',
    status: 'bad',
    icon: IconAd,
    subMetrics: [
      { label: 'Превышение', value: 11.5, format: 'percent', status: 'bad' },
      { label: 'ROAS', value: 3.2, format: 'number', status: 'warning' },
      { label: 'CPC', value: 45, format: 'currency' }
    ]
  },
  
  // Review metrics
  {
    id: 'rating',
    category: 'reviews',
    label: 'Рейтинг',
    value: 4.6,
    previousValue: 4.7,
    target: 4.8,
    format: 'number',
    trend: 'down',
    status: 'warning',
    icon: IconStar,
    subMetrics: [
      { label: 'Мин. допустимый', value: 4.8, format: 'number', status: 'bad' },
      { label: 'Всего отзывов', value: 1234, format: 'number' },
      { label: 'Нужно 5★', value: 23, format: 'number', status: 'warning' }
    ]
  },
  
  // Market share metrics
  {
    id: 'market-share',
    category: 'market',
    label: 'Доля в нише',
    value: 12.3,
    previousValue: 11.8,
    target: 15,
    format: 'percent',
    trend: 'up',
    status: 'warning',
    icon: IconChartPie,
    subMetrics: [
      { label: 'План', value: 15, format: 'percent' },
      { label: 'Позиция', value: 3, format: 'number' },
      { label: 'Всего продавцов', value: 127, format: 'number' }
    ]
  },
  {
    id: 'competitor-share',
    category: 'market',
    label: 'Доля vs ТОП-10',
    value: 8.7,
    previousValue: 8.2,
    target: 10,
    format: 'percent',
    trend: 'up',
    status: 'warning',
    icon: IconUsersGroup,
    subMetrics: [
      { label: 'План', value: 10, format: 'percent' },
      { label: 'Лидер рынка', value: 18.5, format: 'percent' },
      { label: 'Отставание', value: 9.8, format: 'percent', status: 'warning' }
    ]
  }
];

const generateAdKeywordsData = (): AdKeywordMetric[] => [
  {
    keyword: 'кроссовки nike',
    position: 3,
    spend: 15000,
    planSpend: 12000,
    clicks: 324,
    conversions: 28,
    cpc: 46.3,
    roi: 2.8
  },
  {
    keyword: 'nike air max',
    position: 2,
    spend: 22000,
    planSpend: 20000,
    clicks: 456,
    conversions: 42,
    cpc: 48.2,
    roi: 3.2
  },
  {
    keyword: 'спортивная обувь',
    position: 5,
    spend: 8500,
    planSpend: 10000,
    clicks: 198,
    conversions: 12,
    cpc: 42.9,
    roi: 2.1
  },
  {
    keyword: 'кроссовки для бега',
    position: 4,
    spend: 12300,
    planSpend: 11000,
    clicks: 267,
    conversions: 19,
    cpc: 46.1,
    roi: 2.5
  }
];

const generateCompetitorsData = (): CompetitorInfo[] => [
  {
    id: '1',
    name: 'SportMaster',
    orders: 892,
    sales: 756,
    avgPrice: 2380,
    marketShare: 18.5,
    adSpend: 280000,
    position: 1,
    keywords: ['спорт', 'nike', 'adidas']
  },
  {
    id: '2',
    name: 'Lamoda',
    orders: 678,
    sales: 589,
    avgPrice: 2450,
    marketShare: 14.2,
    adSpend: 195000,
    position: 2,
    keywords: ['обувь', 'кроссовки', 'мода']
  },
  {
    id: '3',
    name: 'Наш магазин',
    orders: 385,
    sales: 324,
    avgPrice: 2450,
    marketShare: 8.7,
    adSpend: 145000,
    position: 3,
    keywords: ['nike', 'air max', 'спорт']
  },
  {
    id: '4',
    name: 'SneakerHead',
    orders: 342,
    sales: 298,
    avgPrice: 2890,
    marketShare: 7.8,
    adSpend: 125000,
    position: 4,
    keywords: ['премиум', 'оригинал', 'nike']
  }
];

const generateReviewDistribution = (): ReviewDistribution[] => [
  { rating: 5, count: 567, percentage: 45.9 },
  { rating: 4, count: 345, percentage: 28.0 },
  { rating: 3, count: 189, percentage: 15.3 },
  { rating: 2, count: 78, percentage: 6.3 },
  { rating: 1, count: 55, percentage: 4.5 }
];

// Generate test alerts
const generateAlerts = (): Alert[] => [
  {
    id: '1',
    type: 'critical',
    category: 'rating',
    title: 'Критически низкий рейтинг',
    description: 'Рейтинг товара "Кроссовки Nike Air Max" упал до 3.2. Минимально допустимый рейтинг: 4.8',
    metric: {
      current: 3.2,
      threshold: 4.8,
      trend: 'down'
    },
    actions: [
      { label: 'Ответить на отзывы', action: () => console.log('Открыть форму ответа'), variant: 'filled' },
      { label: 'Запустить выкупы', action: () => console.log('Запустить выкупы'), variant: 'light' }
    ],
    timestamp: new Date(),
    isRead: false,
    affectedItems: [
      { id: '12345678', name: 'Кроссовки Nike Air Max', sku: 'NK-AM-001', rating: 3.2 }
    ]
  },
  {
    id: '2',
    type: 'critical',
    category: 'stock',
    title: 'Товар заканчивается',
    description: 'На складе Казань осталось всего 5 единиц товара. При текущем темпе продаж хватит на 2 дня',
    metric: {
      current: 5,
      threshold: 50,
      unit: 'шт',
      trend: 'down'
    },
    actions: [
      { label: 'Создать поставку', action: () => console.log('Создать заказ'), variant: 'filled' },
      { label: 'Прогноз', action: () => console.log('Показать прогноз'), variant: 'light' }
    ],
    timestamp: new Date(Date.now() - 3600000),
    isRead: false,
    affectedItems: [
      { id: '23456789', name: 'Футболка базовая черная', sku: 'TB-BL-M', stock: 5 }
    ]
  },
  {
    id: '3',
    type: 'warning',
    category: 'budget',
    title: 'Превышение рекламного бюджета',
    description: 'Расходы на рекламу превысили план на 11.5%. Лимит: 130 000 ₽, потрачено: 145 000 ₽',
    metric: {
      current: 145000,
      threshold: 130000,
      unit: '₽',
      trend: 'up'
    },
    actions: [
      { label: 'Снизить ставки', action: () => console.log('Управление ставками'), variant: 'filled' },
      { label: 'Анализ ROI', action: () => console.log('Анализ расходов'), variant: 'light' }
    ],
    timestamp: new Date(Date.now() - 7200000),
    isRead: true,
    affectedItems: []
  },
  {
    id: '4',
    type: 'critical',
    category: 'budget',
    title: 'Логистика превышает лимит',
    description: 'Расходы на логистику составляют 8.5% от продаж. Максимально допустимо: 7%',
    metric: {
      current: 8.5,
      threshold: 7,
      unit: '%',
      trend: 'up'
    },
    actions: [
      { label: 'Оптимизировать', action: () => console.log('Оптимизация логистики'), variant: 'filled' },
      { label: 'Детали', action: () => console.log('Показать детали'), variant: 'light' }
    ],
    timestamp: new Date(Date.now() - 10800000),
    isRead: false,
    affectedItems: []
  },
  {
    id: '5',
    type: 'warning',
    category: 'position',
    title: 'Падение доли рынка',
    description: 'Доля в нише снизилась до 12.3%. План: 15%. Отставание от лидера: 9.8%',
    metric: {
      current: 12.3,
      threshold: 15,
      unit: '%',
      trend: 'down'
    },
    actions: [
      { label: 'Анализ конкурентов', action: () => console.log('Анализ'), variant: 'filled' },
      { label: 'Стратегия', action: () => console.log('Стратегия'), variant: 'light' }
    ],
    timestamp: new Date(Date.now() - 14400000),
    isRead: false,
    affectedItems: []
  }
];

// Generate AI insights
const generateAIInsights = (): AIInsight[] => [
  {
    id: '1',
    type: 'prediction',
    title: 'Прогноз выручки на конец дня',
    description: '1 520 000 ₽ (+13% к плану)',
    confidence: 0.87,
    impact: 'high',
    suggestedAction: 'Увеличить лимиты на рекламу'
  },
  {
    id: '2',
    type: 'anomaly',
    title: 'Аномальный рост возвратов',
    description: 'Артикул 45678901: +300% возвратов',
    confidence: 0.95,
    impact: 'high',
    suggestedAction: 'Проверить качество последней партии'
  },
  {
    id: '3',
    type: 'trend',
    title: 'Снижение конверсии',
    description: 'Категория "Обувь": -2.5% за 3 дня',
    confidence: 0.78,
    impact: 'medium',
    suggestedAction: 'Оптимизировать карточки товаров'
  }
];

// Generate problem items
const generateProblems = (): ProblemItem[] => [
  {
    id: '1',
    type: 'stock',
    severity: 'critical',
    product: 'Кроссовки Nike Air Max',
    sku: 'NK-AM-001',
    description: 'Осталось 5 шт',
    metric: 'Хватит на 2 дня',
    action: 'Создать поставку'
  },
  {
    id: '2',
    type: 'rating',
    severity: 'warning',
    product: 'Футболка базовая',
    sku: 'TB-BL-M',
    description: 'Рейтинг упал до 4.2',
    metric: '15 негативных отзывов',
    action: 'Ответить на отзывы'
  },
  {
    id: '3',
    type: 'price',
    severity: 'info',
    product: 'Джинсы классические',
    sku: 'JN-CL-32',
    description: 'Конкурент снизил цену',
    metric: 'Наша цена выше на 500₽',
    action: 'Пересмотреть цену'
  }
];

// Get alert icon
const getAlertIcon = (category: string) => {
  switch (category) {
    case 'rating': return <IconStar size={16} />;
    case 'stock': return <IconPackage size={16} />;
    case 'budget': return <IconCash size={16} />;
    case 'position': return <IconTrendingDown size={16} />;
    default: return <IconAlertTriangle size={16} />;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatValue = (value: number, format: string) => {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
      }).format(value);
    case 'percent':
      return `${value.toFixed(1)}%`;
    default:
      return value.toLocaleString('ru-RU');
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'good': return 'green';
    case 'warning': return 'yellow';
    case 'bad': return 'red';
    default: return 'gray';
  }
};

const getTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'только что';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} мин назад`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч назад`;
  return `${Math.floor(seconds / 86400)} д назад`;
};

// Calculate health score from KPIs
const calculateHealthScore = (kpis: EnhancedKPIMetric[]): number => {
  if (!kpis.length) return 0;
  
  const scores = kpis.map(kpi => {
    const completion = (kpi.value / kpi.target) * 100;
    if (kpi.format === 'percent' && kpi.id === 'returns') {
      // For returns, lower is better
      return completion > 100 ? 100 - (completion - 100) : 100;
    }
    return Math.min(completion, 100);
  });
  
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

// Get top KPIs for compact display
const getTopKPIs = (kpis: EnhancedKPIMetric[]): EnhancedKPIMetric[] => {
  return kpis.filter(kpi => 
    ['units-sold', 'payment', 'price', 'rating', 'logistics', 'advertising'].includes(kpi.id)
  );
};

// ============================================
// COMPONENTS
// ============================================

// Detailed Compact Card - more info but smaller size
const DetailedCompactCard = ({ 
  metric, 
  onClick 
}: { 
  metric: EnhancedKPIMetric;
  onClick: () => void;
}) => {
  const { hovered, ref } = useHover();
  const percentChange = metric.previousValue 
    ? ((metric.value - metric.previousValue) / metric.previousValue * 100).toFixed(1)
    : '0';
    
  const completion = ((metric.value / metric.target) * 100).toFixed(0);
  
  // Check for critical thresholds
  const isCritical = (metric.id === 'price' && metric.value < 1900) ||
                    (metric.id === 'logistics' && metric.value > 10) ||
                    (metric.id === 'rating' && metric.value < 4.8) ||
                    (metric.id === 'storage' && metric.value > metric.target);

  return (
    <UnstyledButton ref={ref} onClick={onClick} style={{ width: '100%' }}>
      <Paper
        p="sm"
        radius="md"
        withBorder
        style={{
          borderColor: isCritical 
            ? 'var(--mantine-color-red-5)' 
            : hovered 
              ? `var(--mantine-color-${getStatusColor(metric.status)}-3)` 
              : undefined,
          backgroundColor: isCritical 
            ? 'var(--mantine-color-red-0)' 
            : hovered 
              ? `var(--mantine-color-${getStatusColor(metric.status)}-0)` 
              : undefined,
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        {isCritical && (
          <Indicator 
            color="red" 
            position="top-end" 
            size={8} 
            processing
            style={{ position: 'absolute', top: 8, right: 8 }}
          />
        )}
        
        <Stack gap={8}>
          {/* Header */}
          <Group justify="space-between" gap={4}>
            <Group gap={6}>
              <ThemeIcon size={24} variant="light" color={getStatusColor(metric.status)}>
                <metric.icon size={14} />
              </ThemeIcon>
              <Text size="xs" c="dimmed" fw={500}>{metric.label}</Text>
            </Group>
            <Badge 
              size="xs" 
              variant="light"
              color={metric.trend === 'up' ? 'green' : metric.trend === 'down' ? 'red' : 'gray'}
            >
              {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {percentChange}%
            </Badge>
          </Group>
          
          {/* Main Value */}
          <Group justify="space-between" align="flex-end" gap={4}>
            <div>
              <Text size="lg" fw={700} lh={1}>
                {formatValue(metric.value, metric.format)}
              </Text>
              <Text size="xs" c="dimmed">
                План: {formatValue(metric.target, metric.format)}
              </Text>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Progress 
                value={Number(completion)} 
                color={getStatusColor(metric.status)} 
                size={4} 
                style={{ width: 50, marginBottom: 2 }}
              />
              <Text size="xs" fw={500} c={getStatusColor(metric.status)}>
                {completion}%
              </Text>
            </div>
          </Group>
          
          {/* Sub Metrics */}
          {metric.subMetrics && metric.subMetrics.length > 0 && (
            <Box pt={4} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
              {metric.subMetrics.slice(0, 2).map((sub, index) => (
                <Group key={index} justify="space-between" gap={4}>
                  <Text size="xs" c="dimmed" lineClamp={1}>{sub.label}</Text>
                  <Text size="xs" fw={500} c={sub.status ? getStatusColor(sub.status) : undefined}>
                    {formatValue(sub.value, sub.format)}
                  </Text>
                </Group>
              ))}
            </Box>
          )}
          
          {/* Critical Alerts */}
          {isCritical && (
            <Alert 
              icon={<IconAlertCircle size={14} />} 
              color="red" 
              p={4}
              styles={{ message: { fontSize: '11px' } }}
            >
              {metric.id === 'price' && 'Ниже минимальной цены!'}
              {metric.id === 'logistics' && 'Превышен лимит логистики!'}
              {metric.id === 'rating' && 'Рейтинг ниже целевого!'}
              {metric.id === 'storage' && 'Превышены расходы на хранение!'}
            </Alert>
          )}
        </Stack>
      </Paper>
    </UnstyledButton>
  );
};

// Top Competitors Panel
const TopCompetitorsPanel = ({ competitors }: { competitors: CompetitorInfo[] }) => {
  return (
    <Paper p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Text fw={600}>ТОП-3 конкурента</Text>
        <Button size="xs" variant="subtle" rightSection={<IconChevronRight size={14} />}>
          Все конкуренты
        </Button>
      </Group>
      
      <Stack gap="sm">
        {competitors.map((comp, index) => (
          <Paper key={comp.id} p="xs" radius="md" withBorder bg={comp.name === 'Наш магазин' ? 'blue.0' : undefined}>
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs">
                <Badge size="lg" variant="filled" color={index === 0 ? 'gold' : index === 1 ? 'gray' : 'orange'}>
                  #{comp.position}
                </Badge>
                <div>
                  <Text size="sm" fw={500}>{comp.name}</Text>
                  <Group gap={4}>
                    <Text size="xs" c="dimmed">Продаж: {comp.sales}</Text>
                    <Text size="xs" c="dimmed">•</Text>
                    <Text size="xs" c="dimmed">{comp.marketShare}%</Text>
                  </Group>
                </div>
              </Group>
              <Group gap="xs">
                <Tooltip label={`Средняя цена: ${formatValue(comp.avgPrice, 'currency')}`}>
                  <ThemeIcon size="sm" variant="light" color="blue">
                    <IconCurrencyRubel size={14} />
                  </ThemeIcon>
                </Tooltip>
                <Tooltip label={`Расходы на рекламу: ${formatValue(comp.adSpend, 'currency')}`}>
                  <ThemeIcon size="sm" variant="light" color="green">
                    <IconAd size={14} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
};

// Compact KPI Card for overview
const CompactKPICard = ({ 
  metric, 
  onClick 
}: { 
  metric: EnhancedKPIMetric;
  onClick: () => void;
}) => {
  const { hovered, ref } = useHover();
  const percentChange = metric.previousValue 
    ? ((metric.value - metric.previousValue) / metric.previousValue * 100).toFixed(1)
    : '0';

  return (
    <UnstyledButton ref={ref} onClick={onClick} style={{ width: '100%' }}>
      <Paper
        p="xs"
        radius="md"
        withBorder
        style={{
          borderColor: hovered ? `var(--mantine-color-${getStatusColor(metric.status)}-3)` : undefined,
          backgroundColor: hovered ? `var(--mantine-color-${getStatusColor(metric.status)}-0)` : undefined,
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
      >
        <Group justify="space-between" mb={4}>
          <ThemeIcon size="sm" variant="light" color={getStatusColor(metric.status)}>
            <metric.icon size={14} />
          </ThemeIcon>
          <Badge size="xs" color={metric.trend === 'up' ? 'green' : 'red'}>
            {metric.trend === 'up' ? '+' : ''}{percentChange}%
          </Badge>
        </Group>
        <Text size="xs" c="dimmed" mb={2}>{metric.label}</Text>
        <Text size="md" fw={700}>{formatValue(metric.value, metric.format)}</Text>
        <Progress 
          value={(metric.value / metric.target) * 100} 
          color={getStatusColor(metric.status)} 
          size={3} 
          mt={4}
        />
      </Paper>
    </UnstyledButton>
  );
};

// Enhanced Alert Panel
const EnhancedAlertPanel = ({ alerts }: { alerts: Alert[] }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'critical' | 'unread'>('critical');
  
  const alertCounts = alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    if (!alert.isRead) acc.unread++;
    return acc;
  }, { critical: 0, warning: 0, info: 0, unread: 0 } as any);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'critical') return alert.type === 'critical';
    if (filter === 'unread') return !alert.isRead;
    return true;
  });

  const toggleExpanded = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Group>
          <Indicator 
            size={12} 
            color="red" 
            processing
            disabled={alertCounts.critical === 0}
          >
            <ThemeIcon size="lg" variant="light" color="red">
              <IconAlertTriangle size={20} />
            </ThemeIcon>
          </Indicator>
          <div>
            <Text fw={600}>Предупреждения</Text>
            <Text size="xs" c="dimmed">
              {alertCounts.critical} критических, {alertCounts.unread} непрочитанных
            </Text>
          </div>
        </Group>
        
        <SegmentedControl
          size="xs"
          value={filter}
          onChange={(value) => setFilter(value as any)}
          data={[
            { label: 'Критические', value: 'critical' },
            { label: 'Непрочитанные', value: 'unread' },
            { label: 'Все', value: 'all' }
          ]}
        />
      </Group>

      <ScrollArea h={300} offsetScrollbars>
        <Stack gap="xs">
          {filteredAlerts.length === 0 ? (
            <Text ta="center" c="dimmed" py="xl">
              Нет предупреждений
            </Text>
          ) : (
            filteredAlerts.map(alert => (
              <Paper
                key={alert.id}
                p="sm"
                radius="md"
                withBorder
                style={{
                  borderWidth: '2px',
                  borderColor: !alert.isRead 
                    ? alert.type === 'critical' 
                      ? 'var(--mantine-color-red-6)'
                      : `var(--mantine-color-${getStatusColor(alert.type)}-6)`
                    : undefined,
                  backgroundColor: !alert.isRead 
                    ? alert.type === 'critical'
                      ? 'var(--mantine-color-red-0)'
                      : `var(--mantine-color-${getStatusColor(alert.type)}-0)`
                    : undefined
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group wrap="nowrap" style={{ flex: 1 }}>
                    <ThemeIcon 
                      size="md" 
                      variant="light" 
                      color={getStatusColor(alert.type)}
                    >
                      {getAlertIcon(alert.category)}
                    </ThemeIcon>
                    
                    <div style={{ flex: 1 }}>
                      <Group justify="space-between" wrap="nowrap">
                        <Text size="sm" fw={600}>{alert.title}</Text>
                        <Text size="xs" c="dimmed">{getTimeAgo(alert.timestamp)}</Text>
                      </Group>
                      
                      <Text size="xs" c={!alert.isRead ? getStatusColor(alert.type) : 'dimmed'} lineClamp={expanded.has(alert.id) ? undefined : 1}>
                        {alert.description}
                      </Text>

                      {alert.metric && (
                        <Group gap="xs" mt={4}>
                          <Text size="xs" c={getStatusColor(alert.type)} fw={500}>
                            {alert.metric.current}{alert.metric.unit || ''} / {alert.metric.threshold}{alert.metric.unit || ''}
                          </Text>
                        </Group>
                      )}
                    </div>
                  </Group>

                  <ActionIcon 
                    variant="subtle" 
                    size="sm"
                    onClick={() => toggleExpanded(alert.id)}
                  >
                    {expanded.has(alert.id) ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                  </ActionIcon>
                </Group>

                <Collapse in={expanded.has(alert.id)}>
                  <Group gap="xs" mt="xs">
                    {alert.actions.map((action, index) => (
                      <Button
                        key={index}
                        size="xs"
                        variant={action.variant}
                        onClick={() => action.action()}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </Group>
                </Collapse>
              </Paper>
            ))
          )}
        </Stack>
      </ScrollArea>
    </Paper>
  );
};

// Health Score Panel
const HealthScorePanel = ({ score, kpis }: { score: number; kpis: EnhancedKPIMetric[] }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  const categoryScores = {
    pricing: { name: 'Ценообразование', score: 85, icon: IconCurrencyRubel },
    sales: { name: 'Продажи', score: 72, icon: IconShoppingCart },
    logistics: { name: 'Логистика', score: 65, icon: IconTruck },
    advertising: { name: 'Реклама', score: 58, icon: IconAd },
    reviews: { name: 'Отзывы', score: 92, icon: IconStar },
    market: { name: 'Рынок', score: 78, icon: IconChartPie }
  };

  return (
    <Paper p="md" radius="md" withBorder style={{ height: '100%' }}>
      <Stack gap="md" style={{ height: '100%' }}>
        <Group justify="space-between" align="flex-start">
          <Group>
            <ThemeIcon size="lg" variant="light" color="blue">
              <IconHeartbeat size={20} />
            </ThemeIcon>
            <div>
              <Text fw={600} size="md" mt={-2}>Здоровье бизнеса</Text>
              <Text size="xs" c="dimmed">Общий показатель эффективности</Text>
            </div>
          </Group>
          <RingProgress
            size={100}
            thickness={10}
            sections={[{ value: score, color: getScoreColor(score) }]}
            label={
              <Center>
                <Text size="xl" fw={700}>{score}</Text>
              </Center>
            }
          />
        </Group>
        
        <Stack gap="md" style={{ flex: 1 }}>
          {Object.entries(categoryScores).map(([key, data]) => (
            <Group key={key} justify="space-between">
              <Group gap="xs">
                <ThemeIcon size="md" variant="light" color={getScoreColor(data.score)}>
                  <data.icon size={16} />
                </ThemeIcon>
                <Text size="sm" fw={500}>{data.name}</Text>
              </Group>
              <Group gap="xs">
                <Progress 
                  value={data.score} 
                  color={getScoreColor(data.score)} 
                  style={{ width: 100 }} 
                  size="md"
                />
                <Text size="sm" fw={600}>{data.score}</Text>
              </Group>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

// AI Insights Panel
const AIInsightsPanel = ({ insights }: { insights: AIInsight[] }) => {
  const getImpactColor = (impact: string) => {
    const colors = {
      high: 'red',
      medium: 'yellow',
      low: 'blue'
    } as const;
    return colors[impact as keyof typeof colors] || 'gray';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      prediction: IconChartLine,
      anomaly: IconAlertTriangle,
      trend: IconTrendingUp,
      risk: IconAlertTriangle
    } as const;
    return icons[type as keyof typeof icons] || IconAlertTriangle;
  };

  return (
    <Paper p="md" radius="md" withBorder style={{ height: '100%' }}>
      <Stack gap="md" style={{ height: '100%' }}>
        <Group justify="space-between">
          <Group>
            <ThemeIcon size="lg" variant="light" color="violet">
              <IconChartLine size={20} />
            </ThemeIcon>
            <div>
              <Text fw={600} size="md" mt={-2}>AI Инсайты</Text>
              <Text size="xs" c="dimmed">Прогнозы и аномалии</Text>
            </div>
          </Group>
        </Group>

        <Stack gap="md" style={{ flex: 1 }}>
          {insights.map((insight) => {
            const Icon = getTypeIcon(insight.type);
            return (
              <Paper
                key={insight.id}
                p="md"
                radius="md"
                withBorder
                style={{ borderStyle: 'dashed' }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group wrap="nowrap" gap="xs">
                    <ThemeIcon
                      size="md"
                      variant="light"
                      color={getImpactColor(insight.impact)}
                    >
                      <Icon size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="sm" fw={500}>{insight.title}</Text>
                      <Text size="xs" c="dimmed" mt={4}>{insight.description}</Text>
                      {insight.suggestedAction && (
                        <Text size="xs" c="blue" mt={8}>
                          💡 {insight.suggestedAction}
                        </Text>
                      )}
                    </div>
                  </Group>
                  <Text size="sm" fw={600} c="dimmed">
                    {Math.round(insight.confidence * 100)}%
                  </Text>
                </Group>
              </Paper>
            );
          })}
        </Stack>
      </Stack>
    </Paper>
  );
};

// Problem Items Panel
const ProblemItemsPanel = ({ problems }: { problems: ProblemItem[] }) => {
  const getProblemIcon = (type: string) => {
    const icons = {
      stock: IconPackage,
      rating: IconStar,
      price: IconCurrencyRubel,
      position: IconTrendingDown
    };
    return icons[type as keyof typeof icons] || IconAlertTriangle;
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Text fw={600}>Проблемные товары</Text>
        <Badge color="red" variant="light">{problems.length}</Badge>
      </Group>

      <ScrollArea h={250}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Товар</Table.Th>
              <Table.Th>Проблема</Table.Th>
              <Table.Th>Метрика</Table.Th>
              <Table.Th>Действие</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {problems.map((problem) => {
              const Icon = getProblemIcon(problem.type);
              return (
                <Table.Tr key={problem.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>{problem.product}</Text>
                    <Text size="xs" c="dimmed">{problem.sku}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ThemeIcon size="sm" variant="light" color={getStatusColor(problem.severity)}>
                        <Icon size={14} />
                      </ThemeIcon>
                      <Text size="sm">{problem.description}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge size="sm" variant="light" color={getStatusColor(problem.severity)}>
                      {problem.metric}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Button size="xs" variant="light">
                      {problem.action}
                    </Button>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
};

// Quick Actions Panel
const QuickActionsPanel = () => {
  const actions = [
    { label: 'Обновить цены', icon: IconCurrencyRubel, color: 'blue', count: 12 },
    { label: 'Ответить на отзывы', icon: IconMessage, color: 'yellow', count: 8 },
    { label: 'Пополнить склад', icon: IconPackage, color: 'red', count: 5 },
    { label: 'Оптимизировать рекламу', icon: IconAd, color: 'green', count: 3 }
  ];

  return (
    <Paper p="md" radius="md" withBorder>
      <Text fw={600} mb="md">Быстрые действия</Text>
      <SimpleGrid cols={2} spacing="sm">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="light"
            color={action.color}
            leftSection={<action.icon size={16} />}
            rightSection={
              <Badge size="sm" color={action.color} variant="filled" circle>
                {action.count}
              </Badge>
            }
            fullWidth
          >
            {action.label}
          </Button>
        ))}
      </SimpleGrid>
    </Paper>
  );
};

// Performance Overview
const PerformanceOverview = ({ kpis }: { kpis: EnhancedKPIMetric[] }) => {
  const performanceData = [
    { hour: '00:00', sales: 45000, orders: 23, conversion: 2.3 },
    { hour: '04:00', sales: 38000, orders: 19, conversion: 2.1 },
    { hour: '08:00', sales: 72000, orders: 42, conversion: 2.8 },
    { hour: '12:00', sales: 124000, orders: 78, conversion: 3.2 },
    { hour: '16:00', sales: 156000, orders: 92, conversion: 3.5 },
    { hour: '20:00', sales: 98000, orders: 56, conversion: 2.9 }
  ];

  const chartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
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
      data: performanceData.map(d => d.hour)
    },
    yAxis: [
      {
        type: 'value',
        name: 'Продажи (₽)',
        position: 'left'
      },
      {
        type: 'value',
        name: 'Конверсия (%)',
        position: 'right'
      }
    ],
    series: [
      {
        name: 'Продажи',
        type: 'bar',
        data: performanceData.map(d => d.sales),
        itemStyle: {
          color: '#3b82f6'
        }
      },
      {
        name: 'Конверсия',
        type: 'line',
        yAxisIndex: 1,
        data: performanceData.map(d => d.conversion),
        itemStyle: {
          color: '#10b981'
        }
      }
    ]
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Text fw={600} mb="md">Динамика дня</Text>
      <ReactECharts option={chartOption} style={{ height: '200px' }} />
    </Paper>
  );
};

// Metric Card for detailed view
const MetricCard = ({ 
  metric, 
  onClick 
}: { 
  metric: EnhancedKPIMetric;
  onClick: () => void;
}) => {
  const { hovered, ref } = useHover();
  const percentChange = metric.previousValue 
    ? ((metric.value - metric.previousValue) / metric.previousValue * 100).toFixed(1)
    : '0';
    
  const completion = ((metric.value / metric.target) * 100).toFixed(0);

  return (
    <UnstyledButton ref={ref} onClick={onClick} style={{ width: '100%' }}>
      <Paper
        p="sm"
        radius="md"
        withBorder
        style={{
          borderColor: hovered 
            ? `var(--mantine-color-${getStatusColor(metric.status)}-3)` 
            : undefined,
          backgroundColor: hovered 
            ? `var(--mantine-color-${getStatusColor(metric.status)}-0)` 
            : undefined,
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
      >
        <Group justify="space-between" mb="xs">
          <Group gap="xs">
            <ThemeIcon size="sm" variant="light" color={getStatusColor(metric.status)}>
              <metric.icon size={14} />
            </ThemeIcon>
            <Text size="sm" fw={500}>{metric.label}</Text>
          </Group>
          <Badge size="sm" color={metric.trend === 'up' ? 'green' : 'red'}>
            {metric.trend === 'up' ? '+' : ''}{percentChange}%
          </Badge>
        </Group>
        
        <Text size="lg" fw={700} mb={4}>
          {formatValue(metric.value, metric.format)}
        </Text>
        
        <Group justify="space-between" align="center">
          <Text size="xs" c="dimmed">
            План: {formatValue(metric.target, metric.format)}
          </Text>
          <Progress 
            value={Number(completion)} 
            color={getStatusColor(metric.status)} 
            size={4} 
            style={{ width: 80 }}
          />
          <Text size="xs" fw={500}>
            {completion}%
          </Text>
        </Group>
        
        {metric.subMetrics && metric.subMetrics.length > 0 && (
          <Group gap={4} mt="xs">
            {metric.subMetrics.slice(0, 1).map((sub, index) => (
              <Text key={index} size="xs" c="dimmed">
                {sub.label}: {formatValue(sub.value, sub.format)}
              </Text>
            ))}
            {metric.subMetrics.length > 1 && (
              <Text size="xs" c="blue">
                +{metric.subMetrics.length - 1}
              </Text>
            )}
          </Group>
        )}
      </Paper>
    </UnstyledButton>
  );
};

// Analytics Charts
const ConversionFunnelChart = () => {
  const funnelData = [
    { value: 10000, name: 'Просмотры' },
    { value: 1500, name: 'В корзину' },
    { value: 800, name: 'Заказы' },
    { value: 640, name: 'Выкупы' }
  ];

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const conversion = params.dataIndex > 0 
          ? ((params.value / funnelData[params.dataIndex - 1].value) * 100).toFixed(1)
          : '100';
        return `${params.name}<br/>Количество: ${params.value}<br/>Конверсия: ${conversion}%`;
      }
    },
    series: [
      {
        name: 'Воронка',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 10000,
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
        data: funnelData
      }
    ]
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Text fw={600} mb="md">Воронка конверсии</Text>
      <ReactECharts option={option} style={{ height: '300px' }} />
    </Paper>
  );
};

const CategoryDistributionChart = () => {
  const data = [
    { value: 450000, name: 'Обувь' },
    { value: 380000, name: 'Одежда' },
    { value: 250000, name: 'Аксессуары' },
    { value: 190000, name: 'Прочее' }
  ];

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Категории',
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Text fw={600} mb="md">Распределение по категориям</Text>
      <ReactECharts option={option} style={{ height: '300px' }} />
    </Paper>
  );
};

const CompetitorComparisonChart = ({ competitors }: { competitors: CompetitorInfo[] }) => {
  const option: EChartsOption = {
    tooltip: {},
    legend: {
      data: competitors.map(c => c.name)
    },
    radar: {
      indicator: [
        { name: 'Заказы', max: 1000, min: 0, interval: 200 },
        { name: 'Цена', max: 3000, min: 0, interval: 500 },
        { name: 'Рейтинг', max: 5, min: 0, interval: 1 },
        { name: 'Доля рынка', max: 20, min: 0, interval: 4 },
        { name: 'ROI рекламы', max: 5, min: 0, interval: 1 }
      ],
      splitNumber: 5,
      axisName: {
        color: '#333'
      }
    },
    series: [{
      name: 'Сравнение',
      type: 'radar',
      data: competitors.map(c => ({
        value: [c.orders, c.avgPrice, 4.6, c.marketShare, 3.2],
        name: c.name,
        areaStyle: {
          opacity: 0.3
        }
      }))
    }]
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Text fw={600} mb="md">Сравнение с конкурентами</Text>
      <ReactECharts 
        option={option} 
        style={{ height: '400px', width: '100%', minWidth: '300px' }}
        opts={{ renderer: 'svg' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </Paper>
  );
};

const TrendAnalysisChart = () => {
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  });

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Продажи', 'План', 'Прогноз']
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
      data: dates,
      axisLabel: {
        interval: 'auto',
        hideOverlap: true
      }
    },
    yAxis: {
      type: 'value',
      splitNumber: 5,
      minInterval: 1,
      axisLabel: {
        formatter: (value: number) => {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
          }
          if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'K';
          }
          return value;
        }
      }
    },
    series: [
      {
        name: 'Продажи',
        type: 'line',
        data: dates.map((_, i) => 100000 + Math.random() * 50000),
        smooth: true,
        itemStyle: {
          color: '#3b82f6'
        }
      },
      {
        name: 'План',
        type: 'line',
        data: dates.map(() => 120000),
        lineStyle: {
          type: 'dashed',
          color: '#94a3b8'
        }
      },
      {
        name: 'Прогноз',
        type: 'line',
        data: dates.map((_, i) => i < 25 ? null : 130000 + Math.random() * 20000),
        smooth: true,
        lineStyle: {
          type: 'dotted',
          color: '#10b981'
        }
      }
    ]
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Text fw={600} mb="md">Анализ трендов (30 дней)</Text>
      <ReactECharts 
        option={option} 
        style={{ height: '300px', width: '100%', minWidth: '300px' }}
        opts={{ renderer: 'svg' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </Paper>
  );
};

// Component for KPI Card with details
const EnhancedKPICard = ({ 
  metric, 
  onClick 
}: { 
  metric: EnhancedKPIMetric;
  onClick: () => void;
}) => {
  const { hovered, ref } = useHover();
  const percentChange = metric.previousValue 
    ? ((metric.value - metric.previousValue) / metric.previousValue * 100).toFixed(1)
    : '0';
    
  const completion = ((metric.value / metric.target) * 100).toFixed(0);

  return (
    <UnstyledButton ref={ref} onClick={onClick} style={{ width: '100%' }}>
      <Paper
        p="md"
        radius="md"
        withBorder
        style={{
          borderColor: hovered 
            ? `var(--mantine-color-${getStatusColor(metric.status)}-5)` 
            : undefined,
          transform: hovered ? 'translateY(-2px)' : 'none',
          transition: 'all 0.2s ease',
          boxShadow: hovered ? 'var(--mantine-shadow-md)' : 'var(--mantine-shadow-xs)',
          cursor: 'pointer'
        }}
      >
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              {metric.label}
            </Text>
            <Group gap="xs">
              <ThemeIcon size="sm" variant="light" color={getStatusColor(metric.status)}>
                <metric.icon size={16} />
              </ThemeIcon>
              {hovered && (
                <ThemeIcon size="sm" variant="subtle" color="gray">
                  <IconChevronRight size={16} />
                </ThemeIcon>
              )}
            </Group>
          </Group>
          
          <Group justify="space-between" align="flex-end">
            <div>
              <Text size="xl" fw={700}>
                {formatValue(metric.value, metric.format)}
              </Text>
              {metric.previousValue && (
                <Group gap={4}>
                  <Text size="xs" c="dimmed">
                    от {formatValue(metric.previousValue, metric.format)}
                  </Text>
                  <Badge
                    variant="light"
                    color={metric.trend === 'up' ? 'green' : 'red'}
                    size="xs"
                  >
                    {metric.trend === 'up' ? '+' : ''}{percentChange}%
                  </Badge>
                </Group>
              )}
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <Text size="xs" c="dimmed">
                План: {formatValue(metric.target, metric.format)}
              </Text>
              <Progress
                value={Number(completion)}
                color={getStatusColor(metric.status)}
                size="xs"
                radius="xl"
                style={{ width: 60 }}
                mt={4}
              />
              <Text size="xs" c="dimmed" mt={2}>
                {completion}%
              </Text>
            </div>
          </Group>
          
          {metric.subMetrics && metric.subMetrics.length > 0 && (
            <>
              <Divider />
              <Stack gap={4}>
                {metric.subMetrics.slice(0, 2).map((sub, index) => (
                  <Group key={index} justify="space-between">
                    <Text size="xs" c="dimmed">{sub.label}</Text>
                    <Text size="xs" fw={500} c={sub.status ? getStatusColor(sub.status) : undefined}>
                      {formatValue(sub.value, sub.format)}
                    </Text>
                  </Group>
                ))}
                {metric.subMetrics.length > 2 && (
                  <Text size="xs" c="blue" ta="center">
                    +{metric.subMetrics.length - 2} показателей →
                  </Text>
                )}
              </Stack>
            </>
          )}
        </Stack>
      </Paper>
    </UnstyledButton>
  );
};

// Pricing Detail Panel
const PricingDetailPanel = ({ metrics }: { metrics: EnhancedKPIMetric[] }) => {
  const pricingMetrics = metrics.filter(m => m.category === 'pricing');
  const [minPrice, setMinPrice] = useState(1900);
  
  // ECharts option for price and margin dynamics
  const chartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Цена (₽)', 'Маржа (%)']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
    },
    yAxis: [
      {
        type: 'value',
        name: 'Цена (₽)',
        position: 'left',
        axisLabel: {
          formatter: '{value} ₽'
        }
      },
      {
        type: 'value',
        name: 'Маржа (%)',
        position: 'right',
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: 'Цена (₽)',
        type: 'bar',
        data: [2350, 2400, 2450, 2420, 2480, 2450],
        itemStyle: {
          color: '#3b82f6'
        }
      },
      {
        name: 'Маржа (%)',
        type: 'line',
        yAxisIndex: 1,
        data: [32.1, 33.5, 35.2, 34.8, 36.1, 35.2],
        itemStyle: {
          color: '#10b981'
        },
        lineStyle: {
          width: 2
        }
      }
    ]
  };

  return (
    <Stack gap="md">
      <Grid>
        {pricingMetrics.map(metric => (
          <Grid.Col key={metric.id} span={{ base: 12, sm: 6, lg: 4 }}>
            <Paper p="md" radius="md" withBorder>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fw={600}>{metric.label}</Text>
                  <ThemeIcon variant="light" color={getStatusColor(metric.status)}>
                    <metric.icon size={20} />
                  </ThemeIcon>
                </Group>
                <Text size="2xl" fw={700}>
                  {formatValue(metric.value, metric.format)}
                </Text>
                {metric.subMetrics && (
                  <Stack gap={4} mt="xs">
                    {metric.subMetrics.map((sub, index) => (
                      <Group key={index} justify="space-between">
                        <Text size="sm" c="dimmed">{sub.label}</Text>
                        <Text size="sm" fw={500}>
                          {formatValue(sub.value, sub.format)}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>

      <Paper p="md" radius="md" withBorder>
        <Text fw={600} mb="md">Динамика цены и маржи</Text>
        <ReactECharts option={chartOption} style={{ height: '300px' }} />
      </Paper>

      <Paper p="md" radius="md" withBorder>
        <Stack gap="md">
          <Text fw={600}>Контроль минимальной цены</Text>
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            color={minPrice < 1900 ? 'red' : 'blue'}
          >
            Минимальная допустимая цена: {formatValue(1900, 'currency')}
          </Alert>
          <NumberInput
            label="Установить минимальную цену"
            value={minPrice}
            onChange={(value) => setMinPrice(Number(value))}
            prefix="₽"
            thousandSeparator=" "
            min={1500}
            max={3000}
            step={50}
          />
          <Button 
            variant="filled" 
            disabled={minPrice < 1900}
            color={minPrice < 1900 ? 'red' : 'blue'}
          >
            Применить цену
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

// Advertising Detail Panel
const AdvertisingDetailPanel = ({ keywords }: { keywords: AdKeywordMetric[] }) => {
  
  // ECharts option for advertising keywords
  const chartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['План', 'Факт']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: keywords.map(k => k.keyword),
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} ₽'
      }
    },
    series: [
      {
        name: 'План',
        type: 'bar',
        data: keywords.map(k => k.planSpend),
        itemStyle: {
          color: '#94a3b8'
        }
      },
      {
        name: 'Факт',
        type: 'bar',
        data: keywords.map(k => k.spend),
        itemStyle: {
          color: '#3b82f6'
        }
      }
    ]
  };

  return (
    <Stack gap="md">
      <Paper p="md" radius="md" withBorder>
        <Text fw={600} mb="md">Расходы по ключевым словам</Text>
        <ReactECharts option={chartOption} style={{ height: '300px' }} />
      </Paper>

      <Paper p="md" radius="md" withBorder>
        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Ключевое слово</Table.Th>
                <Table.Th>Позиция</Table.Th>
                <Table.Th>Расход</Table.Th>
                <Table.Th>План</Table.Th>
                <Table.Th>% от плана</Table.Th>
                <Table.Th>Клики</Table.Th>
                <Table.Th>Конверсии</Table.Th>
                <Table.Th>CPC</Table.Th>
                <Table.Th>ROI</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {keywords.map((keyword) => (
                <Table.Tr key={keyword.keyword}>
                  <Table.Td fw={500}>{keyword.keyword}</Table.Td>
                  <Table.Td>
                    <Badge color={keyword.position <= 3 ? 'green' : 'yellow'}>
                      {keyword.position}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{formatValue(keyword.spend, 'currency')}</Table.Td>
                  <Table.Td>{formatValue(keyword.planSpend, 'currency')}</Table.Td>
                  <Table.Td>
                    <Text c={keyword.spend > keyword.planSpend ? 'red' : 'green'}>
                      {((keyword.spend / keyword.planSpend) * 100).toFixed(0)}%
                    </Text>
                  </Table.Td>
                  <Table.Td>{keyword.clicks}</Table.Td>
                  <Table.Td>{keyword.conversions}</Table.Td>
                  <Table.Td>{formatValue(keyword.cpc, 'currency')}</Table.Td>
                  <Table.Td>
                    <Badge color={keyword.roi >= 3 ? 'green' : 'yellow'}>
                      {keyword.roi.toFixed(1)}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </Stack>
  );
};

// Reviews Detail Panel
const ReviewsDetailPanel = ({ distribution }: { distribution: ReviewDistribution[] }) => {
  const totalReviews = distribution.reduce((sum, d) => sum + d.count, 0);
  const currentRating = 4.6;
  const targetRating = 4.8;
  
  // Calculate how many 5-star reviews needed
  const currentSum = distribution.reduce((sum, d) => sum + d.rating * d.count, 0);
  const fiveStarsNeeded = Math.ceil(
    (targetRating * (totalReviews + 1) - currentSum) / (5 - targetRating)
  );

  const pieData: PieDataItem[] = distribution.map(d => ({
    name: `${d.rating}★`,
    value: d.count,
    percentage: d.percentage
  }));

  const COLORS = ['#10b981', '#84cc16', '#eab308', '#f97316', '#ef4444'];

  // ECharts option for review distribution
  const pieOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Оценки',
        type: 'pie',
        radius: '50%',
        data: pieData.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: COLORS[index % COLORS.length]
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <Stack gap="md">
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Paper p="md" radius="md" withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600}>Текущий рейтинг</Text>
                <Badge size="lg" color={currentRating >= 4.8 ? 'green' : 'yellow'}>
                  {currentRating} ★
                </Badge>
              </Group>
              
              <Alert 
                icon={<IconAlertTriangle size={16} />} 
                color="yellow"
              >
                Для достижения рейтинга {targetRating} необходимо получить еще{' '}
                <Text component="span" fw={700}>{fiveStarsNeeded}</Text> отзывов с оценкой 5★
              </Alert>

              <Stack gap="xs">
                {distribution.map((item, index) => (
                  <Group key={item.rating} justify="space-between">
                    <Group gap="xs">
                      <Text fw={500}>{item.rating}★</Text>
                      <Progress 
                        value={item.percentage} 
                        color={COLORS[index]}
                        style={{ width: 200 }}
                      />
                    </Group>
                    <Text size="sm" c="dimmed">
                      {item.count} ({item.percentage}%)
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Paper p="md" radius="md" withBorder h="100%">
            <Text fw={600} mb="md">Распределение оценок</Text>
            <ReactECharts option={pieOption} style={{ height: '250px' }} />
          </Paper>
        </Grid.Col>
      </Grid>

      <Paper p="md" radius="md" withBorder>
        <Text fw={600} mb="md">Последние отзывы</Text>
        <Stack gap="md">
          {[
            { rating: 3, text: 'Качество среднее, подошва жестковата', date: '2 часа назад' },
            { rating: 5, text: 'Отличные кроссовки! Рекомендую', date: '5 часов назад' },
            { rating: 4, text: 'Хорошее качество, но размер маломерит', date: '1 день назад' }
          ].map((review, index) => (
            <Paper key={index} p="sm" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Group>
                  {[...Array(5)].map((_, i) => (
                    <IconStarFilled
                      key={i}
                      size={16}
                      style={{ 
                        color: i < review.rating ? '#fbbf24' : '#e5e7eb' 
                      }}
                    />
                  ))}
                </Group>
                <Text size="xs" c="dimmed">{review.date}</Text>
              </Group>
              <Text size="sm">{review.text}</Text>
              <Button size="xs" variant="light" mt="xs">
                Ответить на отзыв
              </Button>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};

// Competitors Detail Panel
const CompetitorsDetailPanel = ({ competitors }: { competitors: CompetitorInfo[] }) => {
  
  // ECharts option for radar chart
  const radarOption: EChartsOption = {
    tooltip: {},
    legend: {
      data: competitors.map(c => c.name)
    },
    radar: {
      indicator: [
        { name: 'Заказы', max: 1000 },
        { name: 'Цена', max: 3000 },
        { name: 'Реклама', max: 300000 },
        { name: 'Доля рынка', max: 20 }
      ]
    },
    series: [{
      name: 'Сравнение конкурентов',
      type: 'radar',
      data: competitors.map(c => ({
        value: [c.orders, c.avgPrice, c.adSpend / 100, c.marketShare],
        name: c.name,
        areaStyle: {
          opacity: 0.3
        }
      }))
    }]
  };

  return (
    <Stack gap="md">
      <Paper p="md" radius="md" withBorder>
        <Text fw={600} mb="md">Сравнение с конкурентами</Text>
        <ReactECharts option={radarOption} style={{ height: '400px' }} />
      </Paper>

      <Paper p="md" radius="md" withBorder>
        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Конкурент</Table.Th>
                <Table.Th>Позиция</Table.Th>
                <Table.Th>Заказов</Table.Th>
                <Table.Th>Продаж</Table.Th>
                <Table.Th>Ср. цена</Table.Th>
                <Table.Th>Доля рынка</Table.Th>
                <Table.Th>Расходы на рекламу</Table.Th>
                <Table.Th>Ключевые слова</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {competitors.map((comp) => (
                <Table.Tr 
                  key={comp.id}
                  style={{ 
                    backgroundColor: comp.name === 'Наш магазин' 
                      ? 'var(--mantine-color-blue-0)' 
                      : undefined 
                  }}
                >
                  <Table.Td fw={500}>{comp.name}</Table.Td>
                  <Table.Td>
                    <Badge 
                      color={comp.position === 1 ? 'green' : 
                             comp.position <= 3 ? 'yellow' : 'gray'}
                    >
                      #{comp.position}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{comp.orders}</Table.Td>
                  <Table.Td>{comp.sales}</Table.Td>
                  <Table.Td>{formatValue(comp.avgPrice, 'currency')}</Table.Td>
                  <Table.Td>
                    <Text fw={500}>{comp.marketShare}%</Text>
                  </Table.Td>
                  <Table.Td>{formatValue(comp.adSpend, 'currency')}</Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {comp.keywords.slice(0, 2).map(k => (
                        <Badge key={k} size="xs" variant="light">
                          {k}
                        </Badge>
                      ))}
                      {comp.keywords.length > 2 && (
                        <Text size="xs" c="dimmed">
                          +{comp.keywords.length - 2}
                        </Text>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </Stack>
  );
};

// Новый компонент финансовых показателей
const financialMetrics: EnhancedKPIMetric[] = [
  {
    id: 'revenue',
    category: 'finance',
    label: 'Выручка',
    value: 1340000,
    previousValue: 1500000,
    target: 1500000,
    format: 'currency',
    trend: 'down',
    status: 'warning',
    icon: IconChartBar,
    subMetrics: [
      { label: 'План', value: 1500000, format: 'currency' },
      { label: 'Факт', value: 1340000, format: 'currency' }
    ]
  },
  {
    id: 'payment',
    category: 'finance',
    label: 'К перечислению',
    value: 609772,
    previousValue: 1200000,
    target: 1300000,
    format: 'currency',
    trend: 'up',
    status: 'good',
    icon: IconCash,
    subMetrics: [
      { label: 'В пути', value: 1200000, format: 'currency' },
      { label: 'Через', value: 14, format: 'number' }
    ]
  },
  {
    id: 'margin',
    category: 'finance',
    label: 'Маржа',
    value: 35,
    previousValue: 40,
    target: 40,
    format: 'percent',
    trend: 'down',
    status: 'warning',
    icon: IconPercentage,
    subMetrics: [
      { label: 'Цель', value: 40, format: 'percent' },
      { label: 'Отклонение', value: -5, format: 'percent', status: 'warning' }
    ]
  },
  {
    id: 'profit',
    category: 'finance',
    label: 'Прибыль',
    value: 189000,
    previousValue: 215000,
    target: 215000,
    format: 'currency',
    trend: 'down',
    status: 'warning',
    icon: IconCoins,
    subMetrics: [
      { label: 'План', value: 215000, format: 'currency' }
    ]
  }
];

const FinancialPanel = () => {
  const today = new Date();
  const formatDate = (date: Date) =>
    date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  return (
    <Paper p="md" radius="md" withBorder mt="md">
      <Group justify="space-between" mb="xs">
        <Text fw={700} size="lg" span>
          <span role="img" aria-label="money">💰</span> ФИНАНСОВЫЕ ПОКАЗАТЕЛИ
        </Text>
        <Group gap="xs">
          <IconCalendar size={16} />
          <Text size="sm" c="dimmed">Сегодня, {formatDate(today)}</Text>
        </Group>
      </Group>
      <Grid gutter="xs">
        {financialMetrics.map((metric) => (
          <Grid.Col key={metric.id} span={{ base: 12, md: 3 }}>
            <DetailedCompactCard metric={metric} onClick={() => {}} />
          </Grid.Col>
        ))}
      </Grid>
    </Paper>
  );
};

// Main Page Component
const OperationalControlPage = () => {
  const [view, setView] = useState<'summary' | 'detailed' | 'analytics' | 'ads'>('summary');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [opened, { open, close }] = useDisclosure(false);
  const { hovered, ref } = useHover();
  const { kpis, competitors, adKeywords, reviewDistribution, loading, error } = useOperationalData();

  const handleMetricClick = (category: string) => {
    setSelectedCategory(category);
    open();
  };

  const toggleCategoryExpanded = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleRefresh = async () => {
    // Implement refresh logic
  };

  const getCategoryTitle = (category: string) => {
    const titles: Record<string, string> = {
      pricing: 'Ценообразование',
      sales: 'Продажи',
      finance: 'Финансы',
      logistics: 'Логистика',
      advertising: 'Реклама',
      reviews: 'Отзывы',
      market: 'Рынок'
    };
    return titles[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      pricing: IconCurrencyRubel,
      sales: IconChartLine,
      finance: IconCash,
      logistics: IconTruck,
      advertising: IconAd,
      reviews: IconStarFilled,
      market: IconChartPie
    };
    return icons[category] || IconChartLine;
  };

  // Group metrics by category
  const metricsByCategory = kpis.reduce((acc: Record<string, EnhancedKPIMetric[]>, metric: EnhancedKPIMetric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {});

  const getCategorySummary = (metrics: EnhancedKPIMetric[]): string => {
    const goodCount = metrics.filter(m => m.status === 'good').length;
    const warningCount = metrics.filter(m => m.status === 'warning').length;
    const badCount = metrics.filter(m => m.status === 'bad').length;
    
    const parts = [];
    if (goodCount > 0) parts.push(`${goodCount} в норме`);
    if (warningCount > 0) parts.push(`${warningCount} требуют внимания`);
    if (badCount > 0) parts.push(`${badCount} критических`);
    
    return parts.join(', ');
  };

  return (
    <Container size="xl" py="md">
      {/* Main content */}
      {!loading && (
        <Tabs value={view} onChange={(value: string | null) => value && setView(value as 'summary' | 'detailed' | 'analytics' | 'ads')}>
          <Tabs.List>
            <Tabs.Tab value="summary" leftSection={<IconChartLine size={16} />}>
              Обзор
            </Tabs.Tab>
            <Tabs.Tab value="detailed" leftSection={<IconListDetails size={16} />}>
              Детально
            </Tabs.Tab>
            <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
              Аналитика
            </Tabs.Tab>
            <Tabs.Tab value="ads" leftSection={<IconAd size={16} />}>
              Реклама
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="summary" pt="md">
            <Stack gap="md">
              {/* View Mode Controls */}
              <Group justify="space-between">
                <Group>
                  <DatePickerInput
                    type="range"
                    placeholder="Выберите период"
                    value={dateRange}
                    onChange={(value) => {
                      if (Array.isArray(value) && value.length === 2) {
                        setDateRange([
                          typeof value[0] === 'string' ? (value[0] ? new Date(value[0]) : null) : value[0],
                          typeof value[1] === 'string' ? (value[1] ? new Date(value[1]) : null) : value[1],
                        ]);
                      }
                    }}
                    clearable
                  />
                  <Button
                    variant="light"
                    leftSection={<IconRefresh size={16} />}
                    onClick={handleRefresh}
                  >
                    Обновить
                  </Button>
                </Group>
              </Group>

              {/* Summary View Content */}
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={3}>Ключевые показатели</Title>
                </Group>
                <Grid>
                  {getTopKPIs(kpis).map((metric: EnhancedKPIMetric) => (
                    <Grid.Col key={metric.id} span={{ base: 6, sm: 4, md: 2 }}>
                      <CompactKPICard 
                        metric={metric} 
                        onClick={() => handleMetricClick(metric.category)}
                      />
                    </Grid.Col>
                  ))}
                </Grid>

                {/* Two Column Layout for Alerts and Pricing */}
                <Grid>
                  {/* Pricing Overview Panel */}
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper p="md" radius="md" withBorder>
                      <Group justify="space-between" mb="md">
                        <Group>
                          <ThemeIcon size="lg" variant="light" color="blue">
                            <IconCurrencyRubel size={20} />
                          </ThemeIcon>
                          <div>
                            <Text fw={600}>Ценообразование</Text>
                            <Text size="xs" c="dimmed">Анализ цен и маржинальности</Text>
                          </div>
                        </Group>
                      </Group>

                      <Stack gap="md">
                        {/* Average Price */}
                        <div>
                          <Text size="sm" c="dimmed">Средняя цена</Text>
                          <Group align="flex-end" gap="xs">
                            <Text size="xl" fw={700}>2 450 ₽</Text>
                            <Text size="sm" c="green" fw={500}>+5.2%</Text>
                          </Group>
                        </div>

                        {/* Margin */}
                        <div>
                          <Text size="sm" c="dimmed">Маржинальность</Text>
                          <Group align="flex-end" gap="xs">
                            <Text size="xl" fw={700}>32.5%</Text>
                            <Text size="sm" c="red" fw={500}>-1.8%</Text>
                          </Group>
                        </div>

                        {/* Price Competitiveness */}
                        <div>
                          <Text size="sm" c="dimmed">Конкурентоспособность цен</Text>
                          <Progress 
                            value={78} 
                            color="green" 
                            size="sm" 
                            mt={4}
                          />
                          <Group justify="space-between" mt={4}>
                            <Text size="xs" c="dimmed">78% товаров</Text>
                            <Text size="xs" c="dimmed">ниже рынка</Text>
                          </Group>
                        </div>

                        {/* Quick Actions */}
                        <Button 
                          variant="light" 
                          leftSection={<IconAdjustments size={16} />}
                          fullWidth
                        >
                          Настроить цены
                        </Button>
                      </Stack>
                    </Paper>
                  </Grid.Col>

                  {/* Alerts Panel */}
                  <Grid.Col span={{ base: 12, md: 8 }}>
                    <EnhancedAlertPanel alerts={generateAlerts()} />
                  </Grid.Col>
                </Grid>

                <FinancialPanel />

                {/* Health Score and AI Insights in a Grid */}
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <HealthScorePanel score={calculateHealthScore(kpis)} kpis={kpis} />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <AIInsightsPanel insights={generateAIInsights()} />
                  </Grid.Col>
                </Grid>

                {/* Performance Overview */}
                <PerformanceOverview kpis={kpis} />

                {/* Top Competitors */}
                <TopCompetitorsPanel competitors={competitors} />

                {/* Problem Items */}
                <ProblemItemsPanel problems={generateProblems()} />

                {/* Quick Actions */}
                <QuickActionsPanel />
              </Stack>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="detailed" pt="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={3}>Детальный анализ</Title>
                <Group>
                  <DatePickerInput
                    type="range"
                    placeholder="Выберите период"
                    value={dateRange}
                    onChange={(value) => {
                      if (Array.isArray(value) && value.length === 2) {
                        setDateRange([
                          typeof value[0] === 'string' ? (value[0] ? new Date(value[0]) : null) : value[0],
                          typeof value[1] === 'string' ? (value[1] ? new Date(value[1]) : null) : value[1],
                        ]);
                      }
                    }}
                    clearable
                  />
                  <Button
                    variant="light"
                    leftSection={<IconRefresh size={16} />}
                    onClick={handleRefresh}
                  >
                    Обновить
                  </Button>
                </Group>
              </Group>

              {/* Detailed View Content */}
              <Stack gap="md">
                {Object.entries(metricsByCategory).map(([category, metrics]) => (
                  <Paper key={category} p="md" radius="md" withBorder>
                    <Group justify="space-between" mb="md">
                      <Group>
                        <ThemeIcon size="lg" variant="light" color="blue">
                          {React.createElement(getCategoryIcon(category), { size: 20 })}
                        </ThemeIcon>
                        <div>
                          <Text fw={600}>{getCategoryTitle(category)}</Text>
                          <Text size="xs" c="dimmed">{getCategorySummary(metrics)}</Text>
                        </div>
                      </Group>
                      <ActionIcon
                        variant="subtle"
                        onClick={() => toggleCategoryExpanded(category)}
                      >
                        {expandedCategories.has(category) ? (
                          <IconChevronUp size={16} />
                        ) : (
                          <IconChevronDown size={16} />
                        )}
                      </ActionIcon>
                    </Group>

                    <Collapse in={expandedCategories.has(category)}>
                      <Grid>
                        {metrics.map((metric) => (
                          <Grid.Col key={metric.id} span={{ base: 12, sm: 6, md: 4 }}>
                            <DetailedCompactCard
                              metric={metric}
                              onClick={() => handleMetricClick(category)}
                            />
                          </Grid.Col>
                        ))}
                      </Grid>
                    </Collapse>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="analytics" pt="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={3}>Аналитика</Title>
                <Group>
                  <DatePickerInput
                    type="range"
                    placeholder="Выберите период"
                    value={dateRange}
                    onChange={(value) => {
                      if (Array.isArray(value) && value.length === 2) {
                        setDateRange([
                          typeof value[0] === 'string' ? (value[0] ? new Date(value[0]) : null) : value[0],
                          typeof value[1] === 'string' ? (value[1] ? new Date(value[1]) : null) : value[1],
                        ]);
                      }
                    }}
                    clearable
                  />
                  <Button
                    variant="light"
                    leftSection={<IconRefresh size={16} />}
                    onClick={handleRefresh}
                  >
                    Обновить
                  </Button>
                </Group>
              </Group>

              {/* Analytics View Content */}
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper p="md" radius="md" withBorder>
                    <Text fw={600} mb="md">Воронка конверсии</Text>
                    <ConversionFunnelChart />
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper p="md" radius="md" withBorder>
                    <Text fw={600} mb="md">Распределение по категориям</Text>
                    <CategoryDistributionChart />
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper p="md" radius="md" withBorder>
                    <Text fw={600} mb="md">Сравнение с конкурентами</Text>
                    <CompetitorComparisonChart competitors={competitors} />
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper p="md" radius="md" withBorder>
                    <Text fw={600} mb="md">Анализ трендов</Text>
                    <TrendAnalysisChart />
                  </Paper>
                </Grid.Col>
              </Grid>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="ads" pt="md">
            <AdsAnalytics />
          </Tabs.Panel>
        </Tabs>
      )}

      {/* Loading state */}
      {loading && (
        <Center h={400}>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text>Загрузка данных...</Text>
          </Stack>
        </Center>
      )}

      {/* Error state */}
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Ошибка" color="red">
          {error.message}
        </Alert>
      )}

      {/* Metric Details Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={selectedCategory ? getCategoryTitle(selectedCategory) : ''}
        size="xl"
      >
        {selectedCategory && (
          <Stack gap="md">
            {selectedCategory === 'pricing' && (
              <PricingDetailPanel metrics={metricsByCategory[selectedCategory] || []} />
            )}
            {selectedCategory === 'advertising' && (
              <AdvertisingDetailPanel keywords={adKeywords} />
            )}
            {selectedCategory === 'reviews' && (
              <ReviewsDetailPanel distribution={reviewDistribution} />
            )}
            {selectedCategory === 'competitors' && (
              <CompetitorsDetailPanel competitors={competitors} />
            )}
          </Stack>
        )}
      </Modal>
    </Container>
  );
};

export default OperationalControlPage;