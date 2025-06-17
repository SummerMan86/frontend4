import React, { useState, useEffect } from 'react';
import {
  AppShell,
  Text,
  ScrollArea,
  UnstyledButton,
  Group,
  Box,
  ThemeIcon,
  Badge,
  Card,
  Grid,
  Title,
  RingProgress,
  Progress,
  Paper,
  Stack,
  Flex,
  Avatar,
  Indicator,
  Modal,
  Timeline,
  Button,
  ActionIcon,
  Tooltip,
  Transition,
  Alert,
  NumberInput,
  Select,
  TextInput,
  MultiSelect,
  Tabs,
  Table,
  Menu,
  Anchor,
  Skeleton,
  Container,
  Overlay,
  Center,
  Loader,
  Notification,
  SegmentedControl,
  RangeSlider,
  Chip,
  Image,
  Divider,
  Drawer,
  Switch,
  NumberFormatter,
  rem,
  MantineTheme
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconBrandWechat,
  IconChartBar,
  IconPackage,
  IconUsers,
  IconTrendingUp,
  IconAlertTriangle,
  IconBell,
  IconSettings,
  IconSearch,
  IconFilter,
  IconDownload,
  IconRefresh,
  IconArrowUp,
  IconArrowDown,
  IconPoint,
  IconX,
  IconCheck,
  IconExclamationMark,
  IconChartLine,
  IconCoin,
  IconShoppingCart,
  IconEye,
  IconClick,
  IconPercentage,
  IconCalendar,
  IconClock,
  IconDots,
  IconChevronRight,
  IconAlertCircle,
  IconCircleCheck,
  IconInfoCircle,
  IconExternalLink,
  IconDatabase,
  IconBrandGoogle,
  IconBrandYandex,
  IconDeviceAnalytics,
  IconReportAnalytics,
  IconChartDots3,
  IconChartInfographic,
  IconTargetArrow,
  IconRocket,
  IconFlame,
  IconTrophy,
  IconMoneybag,
  IconStar,
  IconPlus,
  IconMinus,
  IconCalculator,
  IconWallet,
  IconTruckDelivery,
  IconBuildingWarehouse,
  IconReceipt,
  IconChartArcs,
  IconBulb,
  IconFileSpreadsheet,
  IconFilterOff,
  IconSortDescending,
  IconColumns,
  IconEdit,
  IconTrash,
  IconCopy,
  IconHistory,
  IconTrendingDown,
  IconChartCandle,
  IconReportMoney,
  IconScale,
  IconPackages,
  IconAlertOctagon,
  IconCirclePlus,
  IconCircleMinus,
  IconWaveSawTool,
  IconChartDonut3,
  IconRobotFace,
  IconSparkles,
  IconTargetOff,
  IconBrain,
  IconPlayerPlay,
  IconFileAnalytics
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import { create } from 'zustand';
import { notifications } from '@mantine/notifications';

// Типы данных
interface Campaign {
  id: string;
  name: string;
  type: 'search' | 'card' | 'catalog';
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  orders: number;
  conversionRate: number;
  cpa: number;
  revenue: number;
  roas: number;
  roi: number;
}

interface Product {
  id: string;
  wbArticle: string;
  sellerArticle: string;
  name: string;
  category: string;
  image: string;
  price: number;
  buyoutRate: number;
  costPrice: number;
  fulfillment: number;
  tax: number;
  vat: number;
  drrOrder: number;
  adSpendOrder: number;
  drrSales: number;
  adSpendSales: number;
  priorityWarehouse: string;
  wbCommission: number;
  acquiring: number;
  productionTime: number;
  deliveryTime: number;
  preparationTime: number;
  shippingTime: number;
  acceptanceTime: number;
  totalDeliveryTime: number;
  totalCommission: number;
  stock: number;
  salesPerDay: number;
  revenue: number;
  grossProfit: number;
  netProfit: number;
  margin: number;
  roi: number;
  status: 'profitable' | 'breakeven' | 'unprofitable';
  trend: 'up' | 'down' | 'stable';
  rating: number;
  reviews: number;
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  campaign?: string;
  action?: string;
}

interface MetricData {
  date: string;
  revenue: number;
  spent: number;
  orders: number;
  roas: number;
}

interface TrafficSource {
  source: string;
  sessions: number;
  percentage: number;
  conversion: number;
  revenue: number;
}

interface FinancialData {
  id: string;
  date: string;
  sku: string;
  productName: string;
  brand: string;
  category: string;
  region: string;
  warehouse: string;
  
  // Доходы
  revenue: number;
  orders: number;
  buyouts: number;
  returns: number;
  returnRate: number;
  
  // Расходы
  fulfillmentCost: number; // ФФ
  advertisingCost: number; // Реклама
  buyoutCost: number; // Затраты на выкупы
  reviewsCost: number; // Затраты на отзывы
  
  // Комиссии и логистика WB
  wbCommission: number;
  logisticsCost: number;
  storageCost: number;
  lastMileCost: number;
  
  // Налоги
  vat: number;
  incomeTax: number;
  
  // Итоговые показатели
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  margin: number;
  roi: number;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  margin: number;
  cashFlow: number;
  previousPeriod?: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
  };
}

interface ExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  subCategories?: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}

interface CashFlowForecast {
  date: string;
  income: number;
  expenses: number;
  balance: number;
  forecast: boolean;
}

interface CompetitorProduct {
  id: string;
  name: string;
  wbArticle: string;
  price: number;
  orders: number;
  buyouts: number;
  buyoutSum: number;
  marketShare: number;
}

interface KeywordPosition {
  keyword: string;
  ourPosition: number;
  competitors: { name: string; position: number }[];
  trend: 'up' | 'down' | 'stable';
  searchVolume: number;
}

interface CompetitorComparison {
  metric: string;
  ourValue: number;
  avgValue: number;
  topValue: number;
  unit: string;
}

interface FunnelStep {
  name: string;
  value: number;
  percentage: number;
}

interface Competitor {
  id: string;
  name: string;
  marketShare: number;
  top10Share: number;
  orders: number;
  orderSum: number;
  buyouts: number;
  buyoutSum: number;
  buyoutRate: number;
  avgPrice: number;
  position: number;
  rating: number;
  reviews: number;
  priceChange: number;
  profit: number;
  roi: number;
  adSpend: number;
  adRate: number;
  costPrice: number;
  salesCost: number;
  products: CompetitorProduct[];
  positionHistory: { date: string; position: number }[];
  trend: 'up' | 'down' | 'stable';
}

// Zustand Store
interface DashboardStore {
  campaigns: Campaign[];
  products: Product[];
  alerts: Alert[];
  metrics: MetricData[];
  trafficSources: TrafficSource[];
  competitors: Competitor[];
  funnelData: FunnelStep[];
  keywordPositions: KeywordPosition[];
  competitorComparisons: CompetitorComparison[];
  financialData: FinancialData[];
  expenseBreakdown: ExpenseBreakdown[];
  cashFlowForecast: CashFlowForecast[];
  loading: boolean;
  selectedPeriod: string;
  comparisonPeriod: string;
  currentPage: 'overview' | 'unit-economics' | 'competitors' | 'finances';
  setSelectedPeriod: (period: string) => void;
  setComparisonPeriod: (period: string) => void;
  dismissAlert: (id: string) => void;
  setCurrentPage: (page: 'overview' | 'unit-economics' | 'competitors' | 'finances') => void;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  campaigns: [
    {
      id: '1',
      name: 'Летняя коллекция - Поиск',
      type: 'search',
      status: 'active',
      budget: 50000,
      spent: 42350,
      impressions: 850000,
      clicks: 12500,
      ctr: 1.47,
      cpc: 3.39,
      cpm: 49.82,
      orders: 425,
      conversionRate: 3.4,
      cpa: 99.65,
      revenue: 187500,
      roas: 4.43,
      roi: 343
    },
    {
      id: '2',
      name: 'Топ товары - Карточка',
      type: 'card',
      status: 'active',
      budget: 30000,
      spent: 28900,
      impressions: 620000,
      clicks: 8900,
      ctr: 1.44,
      cpc: 3.25,
      cpm: 46.61,
      orders: 312,
      conversionRate: 3.51,
      cpa: 92.63,
      revenue: 124800,
      roas: 4.32,
      roi: 332
    },
    {
      id: '3',
      name: 'Каталог - Обувь',
      type: 'catalog',
      status: 'paused',
      budget: 25000,
      spent: 18500,
      impressions: 420000,
      clicks: 5200,
      ctr: 1.24,
      cpc: 3.56,
      cpm: 44.05,
      orders: 156,
      conversionRate: 3.0,
      cpa: 118.59,
      revenue: 54600,
      roas: 2.95,
      roi: 195
    }
  ],
  products: [
    {
      id: '1',
      wbArticle: '123456789',
      sellerArticle: 'SUMMER-001',
      name: 'Платье летнее с цветочным принтом',
      category: 'Женская одежда / Платья',
      image: 'https://via.placeholder.com/150',
      price: 3500,
      buyoutRate: 85,
      costPrice: 800,
      fulfillment: 180,
      tax: 6,
      vat: 20,
      drrOrder: 10,
      adSpendOrder: 350,
      drrSales: 8.5,
      adSpendSales: 297.5,
      priorityWarehouse: 'Коледино',
      wbCommission: 14,
      acquiring: 2,
      productionTime: 7,
      deliveryTime: 3,
      preparationTime: 1,
      shippingTime: 2,
      acceptanceTime: 1,
      totalDeliveryTime: 14,
      totalCommission: 16,
      stock: 250,
      salesPerDay: 12,
      revenue: 42000,
      grossProfit: 2200,
      netProfit: 1103,
      margin: 31.5,
      roi: 287,
      status: 'profitable',
      trend: 'up',
      rating: 4.7,
      reviews: 234
    },
    {
      id: '2',
      wbArticle: '987654321',
      sellerArticle: 'SHOES-042',
      name: 'Кроссовки мужские спортивные',
      category: 'Обувь / Кроссовки',
      image: 'https://via.placeholder.com/150',
      price: 5200,
      buyoutRate: 78,
      costPrice: 2100,
      fulfillment: 250,
      tax: 6,
      vat: 20,
      drrOrder: 15,
      adSpendOrder: 780,
      drrSales: 11.7,
      adSpendSales: 608.4,
      priorityWarehouse: 'Казань',
      wbCommission: 15,
      acquiring: 2,
      productionTime: 14,
      deliveryTime: 5,
      preparationTime: 2,
      shippingTime: 3,
      acceptanceTime: 2,
      totalDeliveryTime: 26,
      totalCommission: 17,
      stock: 89,
      salesPerDay: 8,
      revenue: 41600,
      grossProfit: 1820,
      netProfit: 546,
      margin: 10.5,
      roi: 156,
      status: 'breakeven',
      trend: 'stable',
      rating: 4.3,
      reviews: 156
    },
    {
      id: '3',
      wbArticle: '456789123',
      sellerArticle: 'BAG-017',
      name: 'Сумка женская через плечо',
      category: 'Аксессуары / Сумки',
      image: 'https://via.placeholder.com/150',
      price: 2800,
      buyoutRate: 72,
      costPrice: 1500,
      fulfillment: 150,
      tax: 6,
      vat: 20,
      drrOrder: 20,
      adSpendOrder: 560,
      drrSales: 14.4,
      adSpendSales: 403.2,
      priorityWarehouse: 'Электросталь',
      wbCommission: 18,
      acquiring: 2,
      productionTime: 10,
      deliveryTime: 4,
      preparationTime: 1,
      shippingTime: 2,
      acceptanceTime: 1,
      totalDeliveryTime: 18,
      totalCommission: 20,
      stock: 34,
      salesPerDay: 3,
      revenue: 8400,
      grossProfit: 520,
      netProfit: -180,
      margin: -2.1,
      roi: -12,
      status: 'unprofitable',
      trend: 'down',
      rating: 3.9,
      reviews: 45
    },
    {
      id: '4',
      wbArticle: '789123456',
      sellerArticle: 'TECH-089',
      name: 'Чехол для iPhone силиконовый',
      category: 'Электроника / Аксессуары',
      image: 'https://via.placeholder.com/150',
      price: 890,
      buyoutRate: 92,
      costPrice: 120,
      fulfillment: 50,
      tax: 6,
      vat: 20,
      drrOrder: 8,
      adSpendOrder: 71.2,
      drrSales: 7.36,
      adSpendSales: 65.5,
      priorityWarehouse: 'Коледино',
      wbCommission: 12,
      acquiring: 2,
      productionTime: 3,
      deliveryTime: 2,
      preparationTime: 1,
      shippingTime: 1,
      acceptanceTime: 1,
      totalDeliveryTime: 8,
      totalCommission: 14,
      stock: 1250,
      salesPerDay: 45,
      revenue: 40050,
      grossProfit: 550,
      netProfit: 412,
      margin: 46.3,
      roi: 385,
      status: 'profitable',
      trend: 'up',
      rating: 4.8,
      reviews: 892
    }
  ],
  alerts: [
    {
      id: '1',
      type: 'critical',
      title: 'Конкурент снизил цену',
      message: 'TrendSetter снизил цену на "Платье летнее" на 15%',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      action: 'analyze'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Потеря позиций',
      message: 'Упали на 3 позиции по запросу "кроссовки мужские"',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      action: 'optimize'
    },
    {
      id: '3',
      type: 'info',
      title: 'Новый конкурент',
      message: 'NewBrand вошел в топ-10 в вашей категории',
      timestamp: new Date(Date.now() - 1000 * 60 * 120)
    }
  ],
  metrics: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
    revenue: Math.floor(Math.random() * 50000) + 150000,
    spent: Math.floor(Math.random() * 15000) + 35000,
    orders: Math.floor(Math.random() * 150) + 350,
    roas: Math.round((Math.random() * 2 + 3) * 100) / 100
  })),
  trafficSources: [
    { source: 'Поисковая реклама WB', sessions: 45000, percentage: 35, conversion: 3.8, revenue: 156000 },
    { source: 'Органический поиск', sessions: 32000, percentage: 25, conversion: 2.9, revenue: 98000 },
    { source: 'Прямые заходы', sessions: 20000, percentage: 15.5, conversion: 4.2, revenue: 89000 },
    { source: 'Push-уведомления', sessions: 18000, percentage: 14, conversion: 5.1, revenue: 95000 },
    { source: 'Внешние источники', sessions: 13500, percentage: 10.5, conversion: 2.1, revenue: 32000 }
  ],
  competitors: [
    {
      id: '1',
      name: 'TrendSetter',
      marketShare: 14.0,
      top10Share: 15.8,
      orders: 3200,
      orderSum: 10240000,
      buyouts: 2560,
      buyoutSum: 8192000,
      buyoutRate: 80,
      avgPrice: 3200,
      position: 1,
      rating: 4.8,
      reviews: 15600,
      priceChange: -8.7,
      profit: 1800000,
      roi: 220,
      adSpend: 820000,
      adRate: 10,
      costPrice: 1200,
      salesCost: 3072000,
      products: [
        { id: '1', name: 'Платье вечернее', wbArticle: '111222333', price: 3500, orders: 1200, buyouts: 960, buyoutSum: 3360000, marketShare: 5.2 },
        { id: '2', name: 'Юбка миди', wbArticle: '222333444', price: 2800, orders: 800, buyouts: 640, buyoutSum: 1792000, marketShare: 3.5 }
      ],
      positionHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
        position: Math.min(5, Math.max(1, 2 + Math.floor(Math.random() * 3) - 1))
      })),
      trend: 'up'
    },
    {
      id: '2',
      name: 'StylePro',
      marketShare: 12.7,
      top10Share: 14.3,
      orders: 2900,
      orderSum: 10730000,
      buyouts: 2320,
      buyoutSum: 8584000,
      buyoutRate: 80,
      avgPrice: 3700,
      position: 2,
      rating: 4.7,
      reviews: 12500,
      priceChange: -5.2,
      profit: 1600000,
      roi: 195,
      adSpend: 858000,
      adRate: 10,
      costPrice: 1500,
      salesCost: 3480000,
      products: [
        { id: '1', name: 'Блузка шелковая', wbArticle: '333444555', price: 4200, orders: 900, buyouts: 720, buyoutSum: 3024000, marketShare: 3.9 },
        { id: '2', name: 'Брюки классические', wbArticle: '444555666', price: 3800, orders: 700, buyouts: 560, buyoutSum: 2128000, marketShare: 2.7 }
      ],
      positionHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
        position: Math.min(5, Math.max(1, 3 + Math.floor(Math.random() * 3) - 1))
      })),
      trend: 'stable'
    },
    {
      id: '3',
      name: 'FashionHub',
      marketShare: 11.5,
      top10Share: 13.0,
      orders: 2650,
      orderSum: 8480000,
      buyouts: 2120,
      buyoutSum: 6784000,
      buyoutRate: 80,
      avgPrice: 3200,
      position: 3,
      rating: 4.5,
      reviews: 8900,
      priceChange: 2.1,
      profit: 1450000,
      roi: 185,
      adSpend: 678000,
      adRate: 10,
      costPrice: 1100,
      salesCost: 2332000,
      products: [],
      positionHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
        position: Math.min(6, Math.max(2, 4 + Math.floor(Math.random() * 3) - 1))
      })),
      trend: 'down'
    },
    {
      id: 'our',
      name: 'Мы',
      marketShare: 12.5,
      top10Share: 14.1,
      orders: 2450,
      orderSum: 8575000,
      buyouts: 2083,
      buyoutSum: 7290500,
      buyoutRate: 85,
      avgPrice: 3500,
      position: 4,
      rating: 4.7,
      reviews: 1527,
      priceChange: 0,
      profit: 2100000,
      roi: 287,
      adSpend: 729000,
      adRate: 10,
      costPrice: 950,
      salesCost: 1978850,
      products: [],
      positionHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
        position: Math.min(6, Math.max(3, 5 + Math.floor(Math.random() * 3) - 1))
      })),
      trend: 'up'
    }
  ],
  funnelData: [
    { name: 'Показы рекламы', value: 1890000, percentage: 100 },
    { name: 'Клики', value: 26600, percentage: 1.41 },
    { name: 'Просмотры карточки', value: 24000, percentage: 90.2 },
    { name: 'Добавление в корзину', value: 5800, percentage: 24.2 },
    { name: 'Оформление заказа', value: 2100, percentage: 36.2 },
    { name: 'Выкуп', value: 893, percentage: 42.5 }
  ],
  keywordPositions: [
    {
      keyword: 'платье летнее',
      ourPosition: 3,
      competitors: [
        { name: 'TrendSetter', position: 1 },
        { name: 'StylePro', position: 2 },
        { name: 'FashionHub', position: 5 }
      ],
      trend: 'up',
      searchVolume: 45000
    },
    {
      keyword: 'платье с принтом',
      ourPosition: 7,
      competitors: [
        { name: 'TrendSetter', position: 4 },
        { name: 'StylePro', position: 2 },
        { name: 'FashionHub', position: 8 }
      ],
      trend: 'stable',
      searchVolume: 28000
    },
    {
      keyword: 'женское платье',
      ourPosition: 2,
      competitors: [
        { name: 'TrendSetter', position: 5 },
        { name: 'StylePro', position: 3 },
        { name: 'FashionHub', position: 1 }
      ],
      trend: 'up',
      searchVolume: 67000
    }
  ],
  competitorComparisons: [
    { metric: 'Конверсия в выкуп', ourValue: 85, avgValue: 72, topValue: 85, unit: '%' },
    { metric: 'Средний чек', ourValue: 3500, avgValue: 3850, topValue: 4200, unit: '₽' },
    { metric: 'ROI рекламы', ourValue: 287, avgValue: 195, topValue: 287, unit: '%' },
    { metric: 'Маржинальность', ourValue: 31.5, avgValue: 24.3, topValue: 31.5, unit: '%' },
    { metric: 'Рейтинг', ourValue: 4.7, avgValue: 4.5, topValue: 4.8, unit: '★' }
  ],
  financialData: [
    {
      id: '1',
      date: '2024-03-15',
      sku: '123456789',
      productName: 'Платье летнее с цветочным принтом',
      brand: 'MyBrand',
      category: 'Женская одежда / Платья',
      region: 'Москва',
      warehouse: 'Коледино',
      revenue: 175000,
      orders: 50,
      buyouts: 42,
      returns: 8,
      returnRate: 16,
      fulfillmentCost: 7560,
      advertisingCost: 17500,
      buyoutCost: 1260,
      reviewsCost: 2100,
      wbCommission: 24500,
      logisticsCost: 4200,
      storageCost: 1680,
      lastMileCost: 2520,
      vat: 29167,
      incomeTax: 15750,
      totalExpenses: 106237,
      grossProfit: 68763,
      netProfit: 53013,
      margin: 30.3,
      roi: 287
    }
  ],
  expenseBreakdown: [
    {
      category: 'Комиссии WB',
      amount: 245000,
      percentage: 23.1,
      trend: 'up',
      changePercent: 5.2,
      subCategories: [
        { name: 'Комиссия за продажу', amount: 196000, percentage: 80 },
        { name: 'Эквайринг', amount: 49000, percentage: 20 }
      ]
    },
    {
      category: 'Реклама и маркетинг',
      amount: 185000,
      percentage: 17.4,
      trend: 'up',
      changePercent: 12.3,
      subCategories: [
        { name: 'Продвижение в поиске', amount: 111000, percentage: 60 },
        { name: 'Карточка товара', amount: 55500, percentage: 30 },
        { name: 'Внешняя реклама', amount: 18500, percentage: 10 }
      ]
    },
    {
      category: 'Логистика',
      amount: 168000,
      percentage: 15.8,
      trend: 'stable',
      changePercent: 0.8,
      subCategories: [
        { name: 'Доставка до склада WB', amount: 50400, percentage: 30 },
        { name: 'Хранение', amount: 33600, percentage: 20 },
        { name: 'Последняя миля', amount: 84000, percentage: 50 }
      ]
    },
    {
      category: 'Налоги',
      amount: 158000,
      percentage: 14.9,
      trend: 'down',
      changePercent: -2.1,
      subCategories: [
        { name: 'НДС', amount: 94800, percentage: 60 },
        { name: 'Налог на прибыль', amount: 63200, percentage: 40 }
      ]
    },
    {
      category: 'ФФ и операции',
      amount: 126000,
      percentage: 11.9,
      trend: 'up',
      changePercent: 3.5,
      subCategories: [
        { name: 'Упаковка', amount: 37800, percentage: 30 },
        { name: 'Обработка', amount: 50400, percentage: 40 },
        { name: 'Возвраты', amount: 37800, percentage: 30 }
      ]
    },
    {
      category: 'Прочие расходы',
      amount: 95000,
      percentage: 8.9,
      trend: 'down',
      changePercent: -5.7,
      subCategories: [
        { name: 'Отзывы', amount: 28500, percentage: 30 },
        { name: 'Выкупы', amount: 47500, percentage: 50 },
        { name: 'Другое', amount: 19000, percentage: 20 }
      ]
    }
  ],
  cashFlowForecast: Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    const isHistory = i < 30;
    const baseIncome = 180000 + Math.random() * 40000;
    const baseExpenses = 120000 + Math.random() * 30000;
    
    return {
      date: date.toLocaleDateString('ru-RU'),
      income: isHistory ? baseIncome : baseIncome * (1 + Math.random() * 0.2),
      expenses: isHistory ? baseExpenses : baseExpenses * (1 + Math.random() * 0.15),
      balance: 0, // Будет рассчитан накопительным итогом
      forecast: !isHistory
    };
  }).map((item, index, array) => {
    const previousBalance = index > 0 ? array[index - 1].balance : 500000;
    item.balance = previousBalance + item.income - item.expenses;
    return item;
  }),
  loading: false,
  selectedPeriod: '7d',
  comparisonPeriod: 'previous',
  currentPage: 'overview',
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
  setComparisonPeriod: (period) => set({ comparisonPeriod: period }),
  dismissAlert: (id) => set((state) => ({
    alerts: state.alerts.filter(alert => alert.id !== id)
  })),
  setCurrentPage: (page) => set({ currentPage: page })
}));

// Компонент метрики с анимацией
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  progress?: number;
  subtitle?: string;
  onClick?: () => void;
}> = ({ title, value, change, icon, color, progress, subtitle, onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Card
      shadow={hovered ? 'xl' : 'sm'}
      p="lg"
      radius="md"
      withBorder
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        borderColor: hovered ? color : 'transparent'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <Group justify="space-between" mb="xs">
        <Box>
          <Text size="xs" c="dimmed" fw={500} tt="uppercase">
            {title}
          </Text>
          <Text size="xl" fw={700} mt={5}>
            {value}
          </Text>
          {subtitle && (
            <Text size="xs" c="dimmed" mt={5}>
              {subtitle}
            </Text>
          )}
        </Box>
        <ThemeIcon
          size="xl"
          radius="xl"
          variant="gradient"
          gradient={{ from: color, to: color, deg: 135 }}
        >
          {icon}
        </ThemeIcon>
      </Group>
      
      {change !== undefined && (
        <Group gap={5} mt="md">
          <IconArrowUp size={16} color={change > 0 ? '#40c057' : '#fa5252'} 
            style={{ transform: change < 0 ? 'rotate(180deg)' : 'none' }} />
          <Text size="sm" c={change > 0 ? 'green' : 'red'} fw={600}>
            {Math.abs(change)}%
          </Text>
          <Text size="xs" c="dimmed">vs прошлый период</Text>
        </Group>
      )}
      
      {progress !== undefined && (
        <Progress
          value={progress}
          color={color}
          size="sm"
          radius="xl"
          mt="md"
          animated
        />
      )}
    </Card>
  );
};

// Компонент страницы финансов
const FinancesPage: React.FC = () => {
  const { 
    financialData, 
    expenseBreakdown, 
    cashFlowForecast, 
    products, 
    selectedPeriod, 
    comparisonPeriod,
    setComparisonPeriod
  } = useDashboardStore();
  
  const [selectedFilters, setSelectedFilters] = useState({
    sku: [] as string[],
    brand: [] as string[],
    category: [] as string[],
    region: [] as string[],
    warehouse: [] as string[]
  });
  
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseBreakdown | null>(null);
  const [showForecast, setShowForecast] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('chart');
  
  // Расчет сводных показателей
  const summary: FinancialSummary = {
    totalRevenue: financialData.reduce((acc, d) => acc + d.revenue, 0),
    totalExpenses: financialData.reduce((acc, d) => acc + d.totalExpenses, 0),
    netProfit: financialData.reduce((acc, d) => acc + d.netProfit, 0),
    margin: 0,
    cashFlow: cashFlowForecast[cashFlowForecast.length - 1]?.balance || 0,
    previousPeriod: {
      totalRevenue: 5800000,
      totalExpenses: 3900000,
      netProfit: 1900000
    }
  };
  summary.margin = (summary.netProfit / summary.totalRevenue * 100);
  
  // Данные для водопадной диаграммы
  const waterfallData = [
    { name: 'Выручка', value: summary.totalRevenue },
    { name: 'Комиссии WB', value: -expenseBreakdown[0].amount },
    { name: 'Реклама', value: -expenseBreakdown[1].amount },
    { name: 'Логистика', value: -expenseBreakdown[2].amount },
    { name: 'Налоги', value: -expenseBreakdown[3].amount },
    { name: 'ФФ', value: -expenseBreakdown[4].amount },
    { name: 'Прочее', value: -expenseBreakdown[5].amount },
    { name: 'Чистая прибыль', value: 0 } // Будет рассчитан
  ];
  
  // Расчет накопительного итога для водопада
  let cumulative = 0;
  const waterfallSeries = waterfallData.map((item, index) => {
    if (index === waterfallData.length - 1) {
      item.value = cumulative;
    } else {
      cumulative += item.value;
    }
    return {
      name: item.name,
      value: Math.abs(item.value),
      itemStyle: {
        color: item.value > 0 ? '#40c057' : '#fa5252'
      }
    };
  });
  
  // Опции для водопадной диаграммы
  const waterfallOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const value = params[0].value;
        const isPositive = params[0].data.itemStyle.color === '#40c057';
        return `${params[0].name}: ${isPositive ? '+' : '-'}₽${value.toLocaleString('ru-RU')}`;
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
      data: waterfallSeries.map(d => d.name),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `₽${(value / 1000000).toFixed(1)}M`
      }
    },
    series: [{
      type: 'bar',
      data: waterfallSeries,
      barWidth: '60%'
    }]
  };
  
  // Опции для графика расходов
  const expensesPieOptions = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ₽{c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 'right',
      top: 'center'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
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
      data: expenseBreakdown.map(expense => ({
        value: expense.amount,
        name: expense.category,
        itemStyle: {
          color: {
            'Комиссии WB': '#fa5252',
            'Реклама и маркетинг': '#fd7e14',
            'Логистика': '#fab005',
            'Налоги': '#51cf66',
            'ФФ и операции': '#339af0',
            'Прочие расходы': '#845ef7'
          }[expense.category]
        }
      }))
    }]
  };
  
  // Опции для графика Cash Flow
  const cashFlowOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Доходы', 'Расходы', 'Баланс'],
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
      data: cashFlowForecast.map(d => d.date),
      axisLabel: {
        formatter: (value: string, index: number) => {
          if (index % 7 === 0) return value;
          return '';
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `₽${(value / 1000).toFixed(0)}K`
      }
    },
    visualMap: {
      show: false,
      dimension: 0,
      pieces: [{
        lte: 29,
        color: '#339af0'
      }, {
        gt: 29,
        color: '#94d0ff'
      }]
    },
    series: [
      {
        name: 'Доходы',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
          color: '#40c057'
        },
        areaStyle: {
          color: 'rgba(64, 192, 87, 0.1)'
        },
        data: cashFlowForecast.map(d => d.income)
      },
      {
        name: 'Расходы',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
          color: '#fa5252'
        },
        areaStyle: {
          color: 'rgba(250, 82, 82, 0.1)'
        },
        data: cashFlowForecast.map(d => d.expenses)
      },
      {
        name: 'Баланс',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 3
        },
        markLine: {
          data: [{
            yAxis: 0,
            lineStyle: {
              color: '#868e96',
              type: 'dashed'
            }
          }],
          label: {
            formatter: 'Нулевой баланс'
          }
        },
        markArea: {
          data: [[{
            xAxis: cashFlowForecast[29].date,
            itemStyle: {
              color: 'rgba(148, 208, 255, 0.1)'
            }
          }, {
            xAxis: cashFlowForecast[cashFlowForecast.length - 1].date
          }]],
          label: {
            position: 'insideTopRight',
            color: '#339af0',
            formatter: 'Прогноз'
          }
        },
        data: cashFlowForecast.map(d => d.balance)
      }
    ]
  };
  
  // Группировка данных по товарам для таблицы
  const groupedByProduct = products.map(product => {
    const productFinancials = financialData.filter(f => f.sku === product.wbArticle);
    const totalRevenue = productFinancials.reduce((acc, f) => acc + f.revenue, 0) || product.revenue;
    const totalExpenses = productFinancials.reduce((acc, f) => acc + f.totalExpenses, 0) || 
      (product.costPrice + product.fulfillment + product.adSpendSales) * product.salesPerDay * 30;
    const netProfit = productFinancials.reduce((acc, f) => acc + f.netProfit, 0) || product.netProfit;
    
    return {
      ...product,
      financialSummary: {
        revenue: totalRevenue,
        expenses: totalExpenses,
        netProfit: netProfit,
        margin: (netProfit / totalRevenue * 100) || 0,
        roi: product.roi
      }
    };
  });
  
  // Точка безубыточности
  const breakEvenAnalysis = products.map(product => ({
    name: product.name,
    currentSales: product.salesPerDay * 30,
    breakEvenPoint: Math.ceil((product.costPrice + product.fulfillment) / (product.price * 0.85 - product.costPrice - product.fulfillment - product.adSpendSales)),
    margin: ((product.salesPerDay * 30) - Math.ceil((product.costPrice + product.fulfillment) / (product.price * 0.85 - product.costPrice - product.fulfillment - product.adSpendSales))) * 100 / (product.salesPerDay * 30)
  }));
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const handleExpenseClick = (expense: ExpenseBreakdown) => {
    setSelectedExpense(expense);
    setDetailsOpened(true);
  };
  
  return (
    <Container fluid p="xl">
      {/* Панель фильтров */}
      <Card shadow="sm" radius="md" withBorder mb="xl">
        <Group justify="space-between" mb="md">
          <Title order={4}>Фильтры и период</Title>
          <Group>
            <SegmentedControl
              value={selectedPeriod}
              data={[
                { label: 'Сегодня', value: '1d' },
                { label: '7 дней', value: '7d' },
                { label: '30 дней', value: '30d' },
                { label: '90 дней', value: '90d' },
                { label: 'Год', value: '1y' }
              ]}
            />
            <Select
              placeholder="Сравнить с..."
              value={comparisonPeriod}
              onChange={(value) => setComparisonPeriod(value || 'previous')}
              data={[
                { value: 'previous', label: 'Предыдущий период' },
                { value: 'yoy', label: 'Год к году' },
                { value: 'mom', label: 'Месяц к месяцу' }
              ]}
              clearable
              size="sm"
            />
          </Group>
        </Group>
        
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
            <MultiSelect
              label="SKU"
              placeholder="Выберите товары"
              data={products.map(p => ({ value: p.wbArticle, label: `${p.sellerArticle} - ${p.name}` }))}
              value={selectedFilters.sku}
              onChange={(value) => setSelectedFilters(prev => ({ ...prev, sku: value }))}
              searchable
              clearable
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, lg: 2 }}>
            <MultiSelect
              label="Бренд"
              placeholder="Выберите бренды"
              data={['MyBrand', 'SecondBrand', 'ThirdBrand']}
              value={selectedFilters.brand}
              onChange={(value) => setSelectedFilters(prev => ({ ...prev, brand: value }))}
              clearable
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, lg: 2 }}>
            <MultiSelect
              label="Категория"
              placeholder="Выберите категории"
              data={Array.from(new Set(products.map(p => p.category)))}
              value={selectedFilters.category}
              onChange={(value) => setSelectedFilters(prev => ({ ...prev, category: value }))}
              clearable
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, lg: 2 }}>
            <MultiSelect
              label="Регион"
              placeholder="Выберите регионы"
              data={['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Новосибирск', 'Казань']}
              value={selectedFilters.region}
              onChange={(value) => setSelectedFilters(prev => ({ ...prev, region: value }))}
              clearable
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, lg: 2 }}>
            <MultiSelect
              label="Склад"
              placeholder="Выберите склады"
              data={['Коледино', 'Электросталь', 'Казань', 'Екатеринбург']}
              value={selectedFilters.warehouse}
              onChange={(value) => setSelectedFilters(prev => ({ ...prev, warehouse: value }))}
              clearable
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
            <Select
              label="Период"
              placeholder="Выберите период"
              value={selectedPeriod}
              data={[
                { value: '1d', label: 'Сегодня' },
                { value: '7d', label: '7 дней' },
                { value: '30d', label: '30 дней' },
                { value: '90d', label: '90 дней' },
                { value: '1y', label: 'Год' },
                { value: 'custom', label: 'Свой период' }
              ]}
              clearable
            />
          </Grid.Col>
        </Grid>
        
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" size="sm" onClick={() => setSelectedFilters({
            sku: [],
            brand: [],
            category: [],
            region: [],
            warehouse: []
          })}>
            Сбросить фильтры
          </Button>
          <Button size="sm" leftSection={<IconFilter size={16} />}>
            Применить
          </Button>
        </Group>
      </Card>
      
      {/* Сводные KPI */}
      <Grid gutter="md" mb="xl">
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{
              background: 'linear-gradient(105deg, var(--mantine-color-teal-6), var(--mantine-color-lime-6))',
              color: 'white'
            }}
          >
            <Group justify="space-between" mb="xs">
              <Text size="xs" fw={500} tt="uppercase" c="white">
                Общая выручка
              </Text>
              <ThemeIcon variant="white" color="teal" size="lg">
                <IconCoin size={20} />
              </ThemeIcon>
            </Group>
            <Text size="xl" fw={700} c="white">
              ₽{(summary.totalRevenue / 1000000).toFixed(1)}M
            </Text>
            {summary.previousPeriod && (
              <Group gap={5} mt="xs">
                <IconArrowUp size={16} />
                <Text size="sm" fw={600}>
                  {((summary.totalRevenue - summary.previousPeriod.totalRevenue) / summary.previousPeriod.totalRevenue * 100).toFixed(1)}%
                </Text>
              </Group>
            )}
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-orange-6), var(--mantine-color-red-6))',
              color: 'white'
            }}
          >
            <Group justify="space-between" mb="xs">
              <Text size="xs" fw={500} tt="uppercase" c="white">
                Общие расходы
              </Text>
              <ThemeIcon variant="white" color="orange" size="lg">
                <IconReceipt size={20} />
              </ThemeIcon>
            </Group>
            <Text size="xl" fw={700} c="white">
              ₽{(summary.totalExpenses / 1000000).toFixed(1)}M
            </Text>
            {summary.previousPeriod && (
              <Group gap={5} mt="xs">
                <IconArrowUp size={16} />
                <Text size="sm" fw={600}>
                  {((summary.totalExpenses - summary.previousPeriod.totalExpenses) / summary.previousPeriod.totalExpenses * 100).toFixed(1)}%
                </Text>
              </Group>
            )}
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-grape-6), var(--mantine-color-violet-6))',
              color: 'white'
            }}
          >
            <Group justify="space-between" mb="xs">
              <Text size="xs" fw={500} tt="uppercase" c="white">
                Чистая прибыль
              </Text>
              <ThemeIcon variant="white" color="grape" size="lg">
                <IconWallet size={20} />
              </ThemeIcon>
            </Group>
            <Text size="xl" fw={700} c="white">
              ₽{(summary.netProfit / 1000000).toFixed(1)}M
            </Text>
            <Badge size="lg" variant="white" color="grape" mt="xs">
              Маржа: {summary.margin.toFixed(1)}%
            </Badge>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card
              shadow="sm"
              p="lg"
              radius="md"
              withBorder
              style={{
                background: 'linear-gradient(135deg, #339af0 0%, #22b8cf 100%)',
                color: 'white'
              }}>
            <Group justify="space-between" mb="xs">
              <Text size="xs" fw={500} tt="uppercase" c="white">
                Cash Flow
              </Text>
              <ThemeIcon variant="white" color="blue" size="lg">
                <IconCoin size={20} />
              </ThemeIcon>
            </Group>
            <Text size="xl" fw={700} c="white">
              ₽{(summary.cashFlow / 1000000).toFixed(1)}M
            </Text>
            <Progress
              value={Math.min(100, (summary.cashFlow / 10000000) * 100)}
              size="sm"
              radius="xl"
              color="white"
              mt="xs"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
            />
          </Card>
        </Grid.Col>
      </Grid>
      
      {/* Водопадная диаграмма и структура расходов */}
      <Grid gutter="md" mb="xl">
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Формирование прибыли</Title>
              <ActionIcon onClick={() => {/* экспорт */}}>
                <IconDownload size={18} />
              </ActionIcon>
            </Group>
            <ReactECharts option={waterfallOptions} style={{ height: 400 }} />
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Структура расходов</Title>
              <SegmentedControl
                size="xs"
                value={viewMode}
                onChange={(value) => setViewMode(value as 'table' | 'chart')}
                data={[
                  { label: 'График', value: 'chart' },
                  { label: 'Таблица', value: 'table' }
                ]}
              />
            </Group>
            
            {viewMode === 'chart' ? (
              <ReactECharts option={expensesPieOptions} style={{ height: 350 }} />
            ) : (
              <ScrollArea h={350}>
                <Table highlightOnHover>
                  <thead>
                    <tr>
                      <th>Категория</th>
                      <th>Сумма</th>
                      <th>%</th>
                      <th>Тренд</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseBreakdown.map((expense) => (
                      <React.Fragment key={expense.category}>
                        <tr 
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleCategory(expense.category)}
                        >
                          <td>
                            <Group gap="xs">
                              <ActionIcon size="xs">
                                <IconChevronRight 
                                  size={14} 
                                  style={{ 
                                    transform: expandedCategories.includes(expense.category) ? 'rotate(90deg)' : 'none',
                                    transition: 'transform 0.2s'
                                  }}
                                />
                              </ActionIcon>
                              <Text size="sm" fw={500}>{expense.category}</Text>
                            </Group>
                          </td>
                          <td>
                            <Text size="sm">₽{(expense.amount / 1000).toFixed(0)}K</Text>
                          </td>
                          <td>
                            <Badge variant="light" color="gray">
                              {expense.percentage}%
                            </Badge>
                          </td>
                          <td>
                            <Group gap={5}>
                              {expense.trend === 'up' && <IconArrowUp size={14} color="#fa5252" />}
                              {expense.trend === 'down' && <IconArrowDown size={14} color="#40c057" />}
                              {expense.trend === 'stable' && <IconMinus size={14} color="#868e96" />}
                              <Text size="xs" c={expense.trend === 'up' ? 'red' : expense.trend === 'down' ? 'green' : 'dimmed'}>
                                {expense.changePercent > 0 ? '+' : ''}{expense.changePercent}%
                              </Text>
                            </Group>
                          </td>
                        </tr>
                        {expandedCategories.includes(expense.category) && expense.subCategories?.map((sub) => (
                          <tr key={sub.name} style={{ backgroundColor: '#f8f9fa' }}>
                            <td style={{ paddingLeft: 40 }}>
                              <Text size="sm" c="dimmed">{sub.name}</Text>
                            </td>
                            <td>
                              <Text size="sm" c="dimmed">₽{(sub.amount / 1000).toFixed(0)}K</Text>
                            </td>
                            <td>
                              <Text size="xs" c="dimmed">{sub.percentage}%</Text>
                            </td>
                            <td></td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </Table>
              </ScrollArea>
            )}
          </Card>
        </Grid.Col>
      </Grid>
      
      {/* Cash Flow прогноз */}
      <Card shadow="sm" radius="md" withBorder mb="xl">
        <Group justify="space-between" mb="md">
          <Title order={4}>Cash Flow и прогноз</Title>
          <Group>
            <Switch
              label="Показать прогноз"
              checked={showForecast}
              onChange={(e) => setShowForecast(e.currentTarget.checked)}
            />
            <Button variant="light" size="sm" leftSection={<IconCalculator size={16} />}>
              Сценарии
            </Button>
          </Group>
        </Group>
        <ReactECharts option={cashFlowOptions} style={{ height: 350 }} />
        
        <Grid gutter="md" mt="md">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">Прогноз на 30 дней</Text>
                <ThemeIcon variant="light" color="blue">
                  <IconTargetArrow size={16} />
                </ThemeIcon>
              </Group>
              <Text size="lg" fw={600}>
                ₽{(cashFlowForecast[59]?.balance / 1000000).toFixed(1)}M
              </Text>
              <Text size="xs" c={cashFlowForecast[59]?.balance > cashFlowForecast[29]?.balance ? 'green' : 'red'}>
                {cashFlowForecast[59]?.balance > cashFlowForecast[29]?.balance ? '+' : ''}
                {((cashFlowForecast[59]?.balance - cashFlowForecast[29]?.balance) / 1000000).toFixed(1)}M к текущему
              </Text>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">Точка безубыточности</Text>
                <ThemeIcon variant="light" color="green">
                  <IconChartLine size={16} />
                </ThemeIcon>
              </Group>
              <Text size="lg" fw={600}>42 дня</Text>
              <Text size="xs" c="dimmed">
                При текущих показателях
              </Text>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">Резерв ликвидности</Text>
                <ThemeIcon variant="light" color="violet">
                  <IconWallet size={16} />
                </ThemeIcon>
              </Group>
              <Text size="lg" fw={600}>3.2 месяца</Text>
              <Progress value={80} size="sm" color="violet" mt="xs" />
            </Paper>
          </Grid.Col>
        </Grid>
      </Card>
      
      {/* Детальная таблица по товарам */}
      <Card shadow="sm" radius="md" withBorder mb="xl">
        <Group justify="space-between" mb="md">
          <Title order={4}>Финансовые показатели по товарам</Title>
          <Group>
            <Button variant="subtle" size="sm" leftSection={<IconColumns size={16} />}>
              Настроить колонки
            </Button>
            <Button variant="subtle" size="sm" leftSection={<IconDownload size={16} />}>
              Экспорт
            </Button>
          </Group>
        </Group>
        
        <ScrollArea>
          <Table highlightOnHover style={{ minWidth: 1400 }}>
            <thead>
              <tr>
                <th style={{ minWidth: 250 }}>Товар</th>
                <th>Выручка</th>
                <th>Расходы</th>
                <th>Комиссии WB</th>
                <th>Логистика</th>
                <th>Реклама</th>
                <th>ФФ</th>
                <th>Налоги</th>
                <th>Прибыль</th>
                <th>Маржа</th>
                <th>ROI</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {groupedByProduct.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Group gap="sm">
                      <Avatar src={product.image} size="sm" radius="md" />
                      <div>
                        <Text size="sm" fw={500}>{product.name}</Text>
                        <Text size="xs" c="dimmed">{product.sellerArticle} • {product.wbArticle}</Text>
                      </div>
                    </Group>
                  </td>
                  <td>
                    <Text size="sm" fw={600} c="green">
                      ₽{(product.financialSummary.revenue / 1000).toFixed(0)}K
                    </Text>
                  </td>
                  <td>
                    <Text size="sm" fw={600} c="red">
                      ₽{(product.financialSummary.expenses / 1000).toFixed(0)}K
                    </Text>
                  </td>
                  <td>
                    <Text size="sm">
                      ₽{((product.financialSummary.revenue * product.wbCommission / 100) / 1000).toFixed(0)}K
                    </Text>
                  </td>
                  <td>
                    <Text size="sm">
                      ₽{(product.fulfillment * product.salesPerDay * 30 / 1000).toFixed(0)}K
                    </Text>
                  </td>
                  <td>
                    <Text size="sm">
                      ₽{(product.adSpendSales * product.salesPerDay * 30 / 1000).toFixed(0)}K
                    </Text>
                  </td>
                  <td>
                    <Text size="sm">
                      ₽{(product.fulfillment * product.salesPerDay * 30 * 0.7 / 1000).toFixed(0)}K
                    </Text>
                  </td>
                  <td>
                    <Text size="sm">
                      ₽{(product.financialSummary.revenue * 0.2 / 1000).toFixed(0)}K
                    </Text>
                  </td>
                  <td>
                    <Text size="sm" fw={600} c={product.financialSummary.netProfit > 0 ? 'green' : 'red'}>
                      ₽{(product.financialSummary.netProfit / 1000).toFixed(0)}K
                    </Text>
                  </td>
                  <td>
                    <Badge 
                      color={product.financialSummary.margin > 20 ? 'green' : product.financialSummary.margin > 10 ? 'yellow' : 'red'}
                      variant="light"
                    >
                      {product.financialSummary.margin.toFixed(1)}%
                    </Badge>
                  </td>
                  <td>
                    <Badge 
                      color={product.financialSummary.roi > 200 ? 'green' : product.financialSummary.roi > 100 ? 'yellow' : 'red'}
                      variant="filled"
                    >
                      {product.financialSummary.roi}%
                    </Badge>
                  </td>
                  <td>
                    <ActionIcon onClick={() => {/* показать детали */}}>
                      <IconChevronRight size={16} />
                    </ActionIcon>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      </Card>
      
      {/* Анализ точки безубыточности */}
      <Card shadow="sm" radius="md" withBorder>
        <Title order={4} mb="md">Анализ точки безубыточности</Title>
        <Grid gutter="md">
          {breakEvenAnalysis.slice(0, 4).map((item, index) => (
            <Grid.Col key={index} span={{ base: 12, md: 6, lg: 3 }}>
              <Paper p="md" radius="md" withBorder>
                <Text size="sm" fw={500} mb="sm" truncate>{item.name}</Text>
                <RingProgress
                  size={120}
                  thickness={12}
                  sections={[
                    { value: Math.min(100, item.margin), color: item.margin > 0 ? '#40c057' : '#fa5252' }
                  ]}
                  label={
                    <Text ta="center" size="xl" fw={700}>
                      {item.margin > 0 ? '+' : ''}{item.margin.toFixed(0)}%
                    </Text>
                  }
                />
                <Stack gap={5} mt="sm">
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Текущие продажи:</Text>
                    <Text size="xs" fw={500}>{item.currentSales} шт</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Точка БУ:</Text>
                    <Text size="xs" fw={500}>{item.breakEvenPoint} шт</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Запас прочности:</Text>
                    <Text size="xs" fw={500} c={item.margin > 0 ? 'green' : 'red'}>
                      {Math.abs(item.currentSales - item.breakEvenPoint)} шт
                    </Text>
                  </Group>
                </Stack>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Card>
      
      {/* Модальное окно с деталями расхода */}
      <Modal
        opened={detailsOpened}
        onClose={() => setDetailsOpened(false)}
        title={selectedExpense?.category}
        size="lg"
      >
        {selectedExpense && (
          <Stack>
            <Group justify="space-between">
              <Text>Общая сумма:</Text>
              <Text fw={600}>₽{selectedExpense.amount.toLocaleString('ru-RU')}</Text>
            </Group>
            <Divider />
            {selectedExpense.subCategories?.map((sub) => (
              <Group key={sub.name} justify="space-between">
                <Text size="sm">{sub.name}</Text>
                <Group gap="xs">
                  <Text size="sm">₽{sub.amount.toLocaleString('ru-RU')}</Text>
                  <Badge size="sm" variant="light">{sub.percentage}%</Badge>
                </Group>
              </Group>
            ))}
          </Stack>
        )}
      </Modal>
    </Container>
  );
};

// Компонент алерта
const AlertItem: React.FC<{ alert: Alert; onDismiss: () => void }> = ({ alert, onDismiss }) => {
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'critical': return <IconAlertCircle />;
      case 'warning': return <IconExclamationMark />;
      case 'info': return <IconInfoCircle />;
    }
  };
  
  const getAlertColor = () => {
    switch (alert.type) {
      case 'critical': return 'red';
      case 'warning': return 'yellow';
      case 'info': return 'blue';
    }
  };
  
  return (
    <Alert
      icon={getAlertIcon()}
      title={alert.title}
      color={getAlertColor()}
      withCloseButton
      onClose={onDismiss}
      radius="md"
      variant="filled"
      styles={{
        root: {
          background: alert.type === 'critical' 
            ? 'linear-gradient(135deg, #fa5252 0%, #e03131 100%)'
            : alert.type === 'warning'
            ? 'linear-gradient(135deg, #fab005 0%, #f59f00 100%)'
            : 'linear-gradient(135deg, #339af0 0%, #228be6 100%)'
        }
      }}
    >
      <Stack gap={5}>
        <Text size="sm" c="white">{alert.message}</Text>
        {alert.campaign && (
          <Badge color="white" variant="outline" size="sm">
            {alert.campaign}
          </Badge>
        )}
        <Text size="xs" c="white" opacity={0.8}>
          {new Date(alert.timestamp).toLocaleString('ru-RU')}
        </Text>
        {alert.action && (
          <Button size="xs" variant="white" mt={5}>
            {alert.action === 'analyze' ? 'Анализировать' : 'Оптимизировать'}
          </Button>
        )}
      </Stack>
    </Alert>
  );
};

// Компонент страницы анализа конкурентов
const CompetitorsPage: React.FC = () => {
  const { competitors, keywordPositions, competitorComparisons, alerts, dismissAlert, selectedPeriod, comparisonPeriod, setComparisonPeriod } = useDashboardStore();
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [hoveredCompetitor, setHoveredCompetitor] = useState<string | null>(null);
  
  // Находим наши данные
  const ourData = competitors.find(c => c.id === 'our')!;
  const competitorsWithoutUs = competitors.filter(c => c.id !== 'our');
  const top10Competitors = [...competitorsWithoutUs].sort((a, b) => b.marketShare - a.marketShare).slice(0, 10);
  
  // Расчеты для KPI
  const totalMarketShare = competitors.reduce((acc, c) => acc + c.marketShare, 0);
  const top10TotalShare = top10Competitors.reduce((acc, c) => acc + c.marketShare, 0) + ourData.marketShare;
  const ourTop10Share = (ourData.marketShare / top10TotalShare * 100).toFixed(1);
  const positionChange = ourData.positionHistory[ourData.positionHistory.length - 1].position - 
                        ourData.positionHistory[ourData.positionHistory.length - 8].position;
  
  // Опции для радарной диаграммы
  const radarOptions = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: ['Мы', 'Топ-1', 'Топ-3', 'Среднее по топ-10'],
      bottom: 0
    },
    radar: {
      indicator: [
        { name: 'Цена', max: 5000 },
        { name: 'Рейтинг', max: 5 },
        { name: 'Ассортимент', max: 50 },
        { name: 'Продажи/день', max: 150 },
        { name: 'SEO позиции', max: 10 },
        { name: 'Реклама %', max: 20 }
      ]
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [ourData.avgPrice, ourData.rating, 4, ourData.orders / 30, 5, ourData.adRate],
          name: 'Мы',
          lineStyle: { color: '#339af0', width: 3 },
          areaStyle: { color: 'rgba(51, 154, 240, 0.3)' },
          itemStyle: { color: '#339af0' }
        },
        {
          value: [top10Competitors[0].avgPrice, top10Competitors[0].rating, 12, top10Competitors[0].orders / 30, 3, top10Competitors[0].adRate],
          name: 'Топ-1',
          lineStyle: { color: '#fa5252', width: 2 },
          areaStyle: { color: 'rgba(250, 82, 82, 0.2)' }
        },
        {
          value: [
            top10Competitors.slice(0, 3).reduce((acc, c) => acc + c.avgPrice, 0) / 3,
            top10Competitors.slice(0, 3).reduce((acc, c) => acc + c.rating, 0) / 3,
            8,
            top10Competitors.slice(0, 3).reduce((acc, c) => acc + c.orders, 0) / 3 / 30,
            4,
            top10Competitors.slice(0, 3).reduce((acc, c) => acc + c.adRate, 0) / 3
          ],
          name: 'Топ-3',
          lineStyle: { color: '#fab005', width: 2 },
          areaStyle: { color: 'rgba(250, 176, 5, 0.2)' }
        }
      ]
    }]
  };
  
  // Опции для bubble chart
  const bubbleOptions = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const comp = competitors.find(c => c.name === params.name);
        return `
          <div style="padding: 10px;">
            <strong>${params.name}</strong><br/>
            Цена: ₽${params.value[0].toLocaleString('ru-RU')}<br/>
            Продажи: ${params.value[1]} шт/день<br/>
            Прибыль: ₽${(params.value[2] * 1000).toLocaleString('ru-RU')}<br/>
            Рекламная ставка: ${comp?.adRate}%<br/>
            Себестоимость: ₽${comp?.costPrice.toLocaleString('ru-RU')}
          </div>
        `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: 'Объем продаж (шт/день)',
      splitLine: { show: true }
    },
    yAxis: {
      type: 'value',
      name: 'Средняя цена (₽)',
      splitLine: { show: true }
    },
    visualMap: {
      show: false,
      min: 5,
      max: 15,
      dimension: 3,
      inRange: {
        color: ['#40c057', '#fab005', '#fa5252']
      }
    },
    series: [{
      type: 'scatter',
      data: competitors.map(c => ({
        name: c.name,
        value: [c.orders / 30, c.avgPrice, c.profit / 1000, c.adRate],
        symbolSize: Math.sqrt(c.profit / 10000),
        itemStyle: {
          color: c.id === 'our' ? '#339af0' : undefined,
          borderColor: c.id === 'our' ? '#1c7ed6' : undefined,
          borderWidth: c.id === 'our' ? 3 : 0
        }
      })),
      markLine: {
        data: [
          { type: 'average', name: 'Средняя цена' },
          { 
            xAxis: ourData.orders / 30,
            lineStyle: { color: '#339af0', type: 'dashed' }
          },
          {
            yAxis: ourData.avgPrice,
            lineStyle: { color: '#339af0', type: 'dashed' }
          }
        ]
      },
      markArea: {
        data: [
          [{
            name: 'Премиум\nлидеры',
            xAxis: 50,
            yAxis: 3500
          }, {
            xAxis: 150,
            yAxis: 5000
          }],
          [{
            name: 'Массовый\nрынок',
            xAxis: 50,
            yAxis: 0
          }, {
            xAxis: 150,
            yAxis: 3500
          }]
        ],
        itemStyle: {
          color: 'rgba(0, 0, 0, 0.02)'
        }
      }
    }]
  };
  
  // Опции для динамики долей рынка
  const marketShareOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Наша доля'] .concat(top10Competitors.slice(0, 5).map(c => c.name)),
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
      data: ourData.positionHistory.map(h => h.date)
    },
    yAxis: {
      type: 'value',
      name: 'Доля рынка (%)'
    },
    series: [
      {
        name: 'Наша доля',
        type: 'line',
        smooth: true,
        lineStyle: { width: 3, color: '#339af0' },
        areaStyle: { color: 'rgba(51, 154, 240, 0.3)' },
        data: ourData.positionHistory.map(() => ourData.marketShare + Math.random() * 2 - 1)
      },
      ...top10Competitors.slice(0, 5).map((comp, index) => ({
        name: comp.name,
        type: 'line',
        smooth: true,
        stack: 'competitors',
        areaStyle: {},
        data: comp.positionHistory.map(() => comp.marketShare + Math.random() * 2 - 1)
      }))
    ]
  };
  
  // Функция для раскрытия/скрытия строк
  const toggleRowExpansion = (competitorId: string) => {
    setExpandedRows(prev => 
      prev.includes(competitorId) 
        ? prev.filter(id => id !== competitorId)
        : [...prev, competitorId]
    );
  };
  
  return (
    <Container fluid p="xl">
      {/* Критические алерты */}
      <Transition mounted={alerts.some(a => a.type === 'critical' && a.action === 'analyze')} transition="slide-down" duration={400}>
        {(styles) => (
          <div style={styles}>
            <Stack gap="md" mb="xl">
              {alerts.filter(a => a.type === 'critical' && a.action === 'analyze').map(alert => (
                <AlertItem 
                  key={alert.id} 
                  alert={alert} 
                  onDismiss={() => dismissAlert(alert.id)}
                />
              ))}
            </Stack>
          </div>
        )}
      </Transition>
      
      {/* Панель управления */}
      <Card shadow="sm" radius="md" withBorder mb="xl">
        <Group justify="space-between">
          <Group>
            <SegmentedControl
              value={selectedPeriod}
              data={[
                { label: 'Сегодня', value: '1d' },
                { label: '7 дней', value: '7d' },
                { label: '30 дней', value: '30d' },
                { label: '90 дней', value: '90d' }
              ]}
            />
            <Switch
              label="Сравнить периоды"
              checked={showComparison}
              onChange={(e) => setShowComparison(e.currentTarget.checked)}
            />
            {showComparison && (
              <Select
                value={comparisonPeriod}
                onChange={(value) => setComparisonPeriod(value || 'previous')}
                data={[
                  { value: 'previous', label: 'С предыдущим' },
                  { value: 'yoy', label: 'Год к году' },
                  { value: 'mom', label: 'Месяц к месяцу' },
                  { value: 'wow', label: 'Неделя к неделе' }
                ]}
                size="sm"
              />
            )}
          </Group>
          <Group>
            <Button variant="light" size="sm" leftSection={<IconFilter size={16} />}>
              Фильтры
            </Button>
            <Button variant="light" size="sm" leftSection={<IconFileAnalytics size={16} />}>
              Экспорт отчета
            </Button>
          </Group>
        </Group>
      </Card>
      
      {/* KPI панель */}
      <Grid gutter="md" mb="xl">
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                Наша доля рынка
              </Text>
              <ThemeIcon variant="light" color="blue" size="lg">
                <IconChartDonut3 size={20} />
              </ThemeIcon>
            </Group>
            <Group align="baseline" gap="xs">
              <Text size="xl" fw={700}>{ourData.marketShare}%</Text>
              {showComparison && (
                <Group gap={5}>
                  <IconArrowUp size={16} color="#40c057" />
                  <Text size="sm" c="green" fw={600}>2.3%</Text>
                </Group>
              )}
            </Group>
            <ReactECharts
              option={{
                series: [{
                  type: 'pie',
                  radius: ['70%', '90%'],
                  center: ['50%', '50%'],
                  silent: true,
                  label: { show: false },
                  data: [
                    { value: ourData.marketShare, itemStyle: { color: '#339af0' } },
                    { value: 100 - ourData.marketShare, itemStyle: { color: '#f1f3f5' } }
                  ]
                }]
              }}
              style={{ height: 80, marginTop: 10 }}
            />
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                Доля в топ-10
              </Text>
              <ThemeIcon variant="light" color="green" size="lg">
                <IconTrophy size={20} />
              </ThemeIcon>
            </Group>
            <Group align="baseline" gap="xs">
              <Text size="xl" fw={700}>{ourTop10Share}%</Text>
              {showComparison && (
                <Group gap={5}>
                  <IconArrowUp size={16} color="#40c057" />
                  <Text size="sm" c="green" fw={600}>5.1%</Text>
                </Group>
              )}
            </Group>
            <Progress
              value={parseFloat(ourTop10Share)}
              color="green"
              size="sm"
              radius="xl"
              mt="md"
              animated
            />
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                Позиция в нише
              </Text>
              <ThemeIcon variant="light" color="violet" size="lg">
                <IconChartArcs size={20} />
              </ThemeIcon>
            </Group>
            <Group align="baseline" gap="xs">
              <Text size="xl" fw={700}>#{ourData.position}</Text>
              <Text size="sm" c="dimmed">из 156</Text>
              {showComparison && positionChange < 0 && (
                <Group gap={5}>
                  <IconArrowUp size={16} color="#40c057" />
                  <Text size="sm" c="green" fw={600}>{Math.abs(positionChange)}</Text>
                </Group>
              )}
            </Group>
            <ReactECharts
              option={{
                series: [{
                  type: 'gauge',
                  center: ['50%', '60%'],
                  radius: '90%',
                  startAngle: 180,
                  endAngle: 0,
                  min: 0,
                  max: 10,
                  splitNumber: 10,
                  axisLine: {
                    lineStyle: {
                      width: 6,
                      color: [[0.3, '#40c057'], [0.7, '#fab005'], [1, '#fa5252']]
                    }
                  },
                  pointer: { length: '60%', width: 5 },
                  axisTick: { show: false },
                  splitLine: { show: false },
                  axisLabel: { show: false },
                  detail: { show: false },
                  data: [{ value: 10 - ourData.position }]
                }]
              }}
              style={{ height: 60, marginTop: 10 }}
            />
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                Общая прибыль
              </Text>
              <ThemeIcon variant="light" color="orange" size="lg">
                <IconWallet size={20} />
              </ThemeIcon>
            </Group>
            <Group align="baseline" gap="xs">
              <Text size="xl" fw={700}>₽{(ourData.profit / 1000000).toFixed(1)}M</Text>
              {showComparison && (
                <Group gap={5}>
                  <IconArrowUp size={16} color="#40c057" />
                  <Text size="sm" c="green" fw={600}>15%</Text>
                </Group>
              )}
            </Group>
            <ReactECharts
              option={{
                grid: { left: 0, right: 0, top: 0, bottom: 0 },
                xAxis: { show: false, data: Array(20).fill('') },
                yAxis: { show: false },
                series: [{
                  type: 'line',
                  smooth: true,
                  symbol: 'none',
                  lineStyle: { color: '#fd7e14', width: 2 },
                  areaStyle: {
                    color: {
                      type: 'linear',
                      x: 0, y: 0, x2: 0, y2: 1,
                      colorStops: [
                        { offset: 0, color: 'rgba(253, 126, 20, 0.3)' },
                        { offset: 1, color: 'rgba(253, 126, 20, 0.05)' }
                      ]
                    }
                  },
                  data: Array(20).fill(0).map(() => Math.random() * 100 + 50)
                }]
              }}
              style={{ height: 50, marginTop: 10 }}
            />
          </Card>
        </Grid.Col>
      </Grid>
      
      {/* Радарная диаграмма и позиционирование */}
      <Grid gutter="md" mb="xl">
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Card shadow="sm" radius="md" withBorder>
            <Title order={4} mb="md">Конкурентный профиль</Title>
            <ReactECharts option={radarOptions} style={{ height: 350 }} />
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Card shadow="sm" radius="md" withBorder h="100%">
            <Title order={4} mb="md">Позиционирование на рынке</Title>
            <ReactECharts option={bubbleOptions} style={{ height: 350 }} />
          </Card>
        </Grid.Col>
      </Grid>
      
      {/* Таблица сравнения */}
      <Card shadow="sm" radius="md" withBorder mb="xl">
        <Group justify="space-between" mb="md">
          <Title order={4}>Детальное сравнение с топ-10</Title>
          <Group gap="xs">
            <Button variant="subtle" size="xs" leftSection={<IconColumns size={16} />}>
              Настроить колонки
            </Button>
            <Button variant="subtle" size="xs" leftSection={<IconDownload size={16} />}>
              Экспорт
            </Button>
          </Group>
        </Group>
        
        <ScrollArea>
          <Table highlightOnHover style={{ minWidth: 1200 }}>
            <thead>
              <tr>
                <th style={{ minWidth: 200 }}>Конкурент</th>
                <th>Заказы (шт)</th>
                <th>Сумма заказов</th>
                <th>Выкупы (шт)</th>
                <th>Сумма выкупов</th>
                <th>% выкупа</th>
                <th>Доля рынка</th>
                <th>Прибыль</th>
                <th>ROI</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {[ourData, ...top10Competitors].map((competitor, index) => (
                <React.Fragment key={competitor.id}>
                  <tr 
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: competitor.id === 'our' ? 'rgba(51, 154, 240, 0.05)' : undefined,
                      fontWeight: competitor.id === 'our' ? 600 : undefined
                    }}
                    onMouseEnter={() => setHoveredCompetitor(competitor.id)}
                    onMouseLeave={() => setHoveredCompetitor(null)}
                    onClick={() => toggleRowExpansion(competitor.id)}
                  >
                    <td>
                      <Group gap="sm">
                        {index === 0 && <ThemeIcon variant="filled" color="blue"><IconTrophy size={16} /></ThemeIcon>}
                        {index === 1 && <Badge color="yellow" variant="filled">1</Badge>}
                        {index === 2 && <Badge color="gray" variant="filled">2</Badge>}
                        {index === 3 && <Badge color="orange" variant="filled">3</Badge>}
                        {index > 3 && <Badge variant="outline">{index}</Badge>}
                        <div>
                          <Text size="sm" fw={500}>{competitor.name}</Text>
                          <Group gap={5}>
                            <Text size="xs" color="dimmed">⭐ {competitor.rating}</Text>
                            <Text size="xs" color="dimmed">• {competitor.reviews.toLocaleString('ru-RU')} отзывов</Text>
                          </Group>
                        </div>
                      </Group>
                    </td>
                    <td>
                      <Stack gap={2}>
                        <Text size="sm">{competitor.orders.toLocaleString('ru-RU')}</Text>
                        {showComparison && (
                          <Group gap={3}>
                            <IconArrowUp size={12} color="#40c057" />
                            <Text size="xs" color="green">+15%</Text>
                          </Group>
                        )}
                      </Stack>
                    </td>
                    <td>
                      <Text size="sm">₽{(competitor.orderSum / 1000000).toFixed(1)}M</Text>
                    </td>
                    <td>
                      <Stack gap={2}>
                        <Text size="sm">{competitor.buyouts.toLocaleString('ru-RU')}</Text>
                        {showComparison && (
                          <Group gap={3}>
                            <IconArrowUp size={12} color="#40c057" />
                            <Text size="xs" color="green">+18%</Text>
                          </Group>
                        )}
                      </Stack>
                    </td>
                    <td>
                      <Text size="sm">₽{(competitor.buyoutSum / 1000000).toFixed(1)}M</Text>
                    </td>
                    <td>
                      <Stack gap={2}>
                        <Text size="sm">{competitor.buyoutRate}%</Text>
                        <Progress value={competitor.buyoutRate} size="xs" color={competitor.id === 'our' ? 'blue' : 'gray'} />
                      </Stack>
                    </td>
                    <td>
                      <Badge 
                        size="lg" 
                        color={competitor.id === 'our' ? 'blue' : index === 1 ? 'green' : 'gray'}
                        variant="light"
                      >
                        {competitor.marketShare}%
                      </Badge>
                    </td>
                    <td>
                      <Text size="sm" fw={600} color="green">
                        ₽{(competitor.profit / 1000000).toFixed(1)}M
                      </Text>
                    </td>
                    <td>
                      <Text size="sm" fw={600} color={competitor.roi > 200 ? 'green' : 'yellow'}>
                        {competitor.roi}%
                      </Text>
                    </td>
                    <td>
                      <ActionIcon size="sm">
                        <IconChevronRight 
                          size={16} 
                          style={{ 
                            transform: expandedRows.includes(competitor.id) ? 'rotate(90deg)' : 'none',
                            transition: 'transform 0.2s'
                          }}
                        />
                      </ActionIcon>
                    </td>
                  </tr>
                  {expandedRows.includes(competitor.id) && competitor.products.length > 0 && (
                    <tr>
                      <td colSpan={10} style={{ padding: 0, backgroundColor: '#f8f9fa' }}>
                        <Box p="md">
                          <Table>
                            <thead>
                              <tr>
                                <th>Товар</th>
                                <th>Артикул WB</th>
                                <th>Цена</th>
                                <th>Заказы</th>
                                <th>Выкупы</th>
                                <th>Сумма выкупов</th>
                                <th>Доля рынка</th>
                              </tr>
                            </thead>
                            <tbody>
                              {competitor.products.map(product => (
                                <tr key={product.id}>
                                  <td>{product.name}</td>
                                  <td>{product.wbArticle}</td>
                                  <td>₽{product.price.toLocaleString('ru-RU')}</td>
                                  <td>{product.orders.toLocaleString('ru-RU')}</td>
                                  <td>{product.buyouts.toLocaleString('ru-RU')}</td>
                                  <td>₽{(product.buyoutSum / 1000000).toFixed(1)}M</td>
                                  <td>{product.marketShare}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Box>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      </Card>
      
      {/* Динамика долей рынка и позиций */}
      <Grid gutter="md" mb="xl">
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Card shadow="sm" radius="md" withBorder>
            <Title order={4} mb="md">Динамика долей рынка</Title>
            <ReactECharts option={marketShareOptions} style={{ height: 300 }} />
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Card shadow="sm" radius="md" withBorder>
            <Title order={4} mb="md">Позиции по ключевым запросам</Title>
            <Stack gap="md">
              {keywordPositions.map((kw, index) => (
                <Paper key={index} p="md" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <div>
                      <Text size="sm" fw={500}>{kw.keyword}</Text>
                      <Text size="xs" color="dimmed">{kw.searchVolume.toLocaleString('ru-RU')} запросов/мес</Text>
                    </div>
                    <Badge 
                      size="lg" 
                      color={kw.ourPosition <= 3 ? 'green' : kw.ourPosition <= 10 ? 'yellow' : 'red'}
                      variant="filled"
                    >
                      #{kw.ourPosition}
                    </Badge>
                  </Group>
                  <Group gap="xs" mt="sm">
                    {kw.competitors.map((comp, i) => (
                      <Badge key={i} variant="light" size="sm">
                        {comp.name}: #{comp.position}
                      </Badge>
                    ))}
                  </Group>
                  {kw.trend !== 'stable' && (
                    <Group gap={5} mt="xs">
                      {kw.trend === 'up' ? 
                        <IconTrendingUp size={14} color="#40c057" /> :
                        <IconTrendingDown size={14} color="#fa5252" />
                      }
                      <Text size="xs" color={kw.trend === 'up' ? 'green' : 'red'}>
                        {kw.trend === 'up' ? 'Растем' : 'Падаем'}
                      </Text>
                    </Group>
                  )}
                </Paper>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
      
      {/* Сравнительный анализ эффективности */}
      <Card shadow="sm" radius="md" withBorder mb="xl">
        <Title order={4} mb="md">Сравнение с топ-10 конкурентами</Title>
        <Grid gutter="md">
          {competitorComparisons.map((comparison, index) => (
            <Grid.Col key={index} span={{ base: 12, md: 6 }}>
              <Box mb="lg">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>{comparison.metric}</Text>
                  <Group gap="xs">
                    <Badge color="blue" variant="light">
                      Мы: {comparison.ourValue}{comparison.unit}
                    </Badge>
                    <Badge color="gray" variant="light">
                      Среднее: {comparison.avgValue}{comparison.unit}
                    </Badge>
                  </Group>
                </Group>
                <Box style={{ position: 'relative' }}>
                  <Progress
                    value={(comparison.ourValue / comparison.topValue) * 100}
                    color="blue"
                    size="lg"
                    radius="xl"
                    animated
                  />
                  <Progress
                    value={(comparison.avgValue / comparison.topValue) * 100}
                    color="gray"
                    size="lg"
                    radius="xl"
                    animated
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity: 0.5 }}
                  />
                </Box>
              </Box>
            </Grid.Col>
          ))}
        </Grid>
      </Card>
      
      {/* AI рекомендации */}
      <Card shadow="sm" radius="md" withBorder p="xl" style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
      }}>
        <Group gap="md" mb="lg">
          <ThemeIcon size="xl" variant="white" color="violet">
            <IconBrain size={28} />
          </ThemeIcon>
          <Title order={4} c="white">AI-инсайты и рекомендации</Title>
        </Group>
        
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper p="md" radius="md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Group gap="xs" mb="sm">
                <ThemeIcon size="sm" variant="white" color="green">
                  <IconTargetArrow size={16} />
                </ThemeIcon>
                <Text size="sm" fw={600} color="white">Возможности для роста</Text>
              </Group>
              <Stack gap="sm">
                  <Group gap="xs">
                  <IconSparkles size={16} color="white" />
                  <Text size="xs" color="white">
                    Конкурент TrendSetter снизил активность на ключе "платье с принтом" - займите его позицию (потенциал: +450 заказов/мес)
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconCoin size={16} color="white" />
                  <Text size="xs" color="white">
                    Оптимальная цена для основного товара: ₽3,350 (прогноз: +₽850K прибыли/мес)
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconPackages size={16} color="white" />
                  <Text size="xs" color="white">
                    Запустите SKU в категории "Юбки" - у топ-5 она приносит 35% прибыли
                  </Text>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper p="md" radius="md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Group gap="xs" mb="sm">
                <ThemeIcon size="sm" variant="white" color="red">
                  <IconAlertOctagon size={16} />
                </ThemeIcon>
                <Text size="sm" fw={600} color="white">Угрозы</Text>
              </Group>
              <Stack gap="sm">
                <Group gap="xs">
                  <IconUsers size={16} color="white" />
                  <Text size="xs" color="white">
                    Новый игрок NewBrand с агрессивным ценообразованием (-20% от рынка)
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconRocket size={16} color="white" />
                  <Text size="xs" color="white">
                    StylePro увеличил рекламный бюджет на 40% - ожидается рост его доли
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconTrendingDown size={16} color="white" />
                  <Text size="xs" color="white">
                    Падение позиций по 3 ключевым запросам за последнюю неделю
                  </Text>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
};

// Компонент анализа товаров
const ProductAnalysisComponent: React.FC = () => {
  const { products, alerts, dismissAlert } = useDashboardStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [marginFilter, setMarginFilter] = useState<[number, number]>([-50, 100]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [quickFilter, setQuickFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Расчет общих метрик
  const avgMargin = products.reduce((acc, p) => acc + p.margin, 0) / products.length;
  const totalProfit = products.reduce((acc, p) => acc + p.netProfit * p.salesPerDay * 30, 0);
  const avgROI = products.reduce((acc, p) => acc + p.roi, 0) / products.length;
  const unprofitableCount = products.filter(p => p.status === 'unprofitable').length;
  
  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesMargin = product.margin >= marginFilter[0] && product.margin <= marginFilter[1];
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(product.status);
    const matchesQuickFilter = 
      quickFilter === 'all' ||
      (quickFilter === 'unprofitable' && product.status === 'unprofitable') ||
      (quickFilter === 'low-margin' && product.margin < 15 && product.margin > 0) ||
      (quickFilter === 'top' && product.margin > 30) ||
      (quickFilter === 'attention' && product.trend === 'down') ||
      (quickFilter === 'falling' && product.salesPerDay < 5) ||
      (quickFilter === 'growing' && product.trend === 'up');
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.wbArticle.includes(searchQuery) ||
      product.sellerArticle.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesMargin && matchesStatus && matchesQuickFilter && matchesSearch;
  });
  
  // Опции для waterfall chart
  const waterfallOptions = selectedProduct ? {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const value = params[0].value;
        return `${params[0].name}: ₽${Math.abs(value).toLocaleString('ru-RU')}`;
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
      data: ['Цена\nпродажи', 'Выкуп\n(-15%)', 'Комиссия\nWB', 'Себе-\nстоимость', 'Логистика', 'Маркетинг', 'Налоги', 'Чистая\nприбыль'],
      axisLabel: {
        interval: 0,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `₽${value}`
      }
    },
    series: [{
      type: 'bar',
      stack: 'Total',
      itemStyle: {
        borderColor: 'transparent',
        color: 'transparent'
      },
      emphasis: {
        itemStyle: {
          borderColor: 'transparent',
          color: 'transparent'
        }
      },
      data: [0, selectedProduct.price * 0.15, selectedProduct.price * (1 - selectedProduct.buyoutRate / 100) + selectedProduct.price * selectedProduct.totalCommission / 100, 
             selectedProduct.price * (1 - selectedProduct.buyoutRate / 100) + selectedProduct.price * selectedProduct.totalCommission / 100 + selectedProduct.costPrice,
             selectedProduct.price * (1 - selectedProduct.buyoutRate / 100) + selectedProduct.price * selectedProduct.totalCommission / 100 + selectedProduct.costPrice + selectedProduct.fulfillment,
             selectedProduct.price * (1 - selectedProduct.buyoutRate / 100) + selectedProduct.price * selectedProduct.totalCommission / 100 + selectedProduct.costPrice + selectedProduct.fulfillment + selectedProduct.adSpendSales,
             selectedProduct.price * (1 - selectedProduct.buyoutRate / 100) + selectedProduct.price * selectedProduct.totalCommission / 100 + selectedProduct.costPrice + selectedProduct.fulfillment + selectedProduct.adSpendSales + selectedProduct.price * selectedProduct.tax / 100,
             0]
    }, {
      type: 'bar',
      stack: 'Total',
      data: [
        {
          value: selectedProduct.price,
          itemStyle: { color: '#339af0' }
        },
        {
          value: -selectedProduct.price * 0.15,
          itemStyle: { color: '#fa5252' }
        },
        {
          value: -selectedProduct.price * selectedProduct.totalCommission / 100,
          itemStyle: { color: '#ff6b6b' }
        },
        {
          value: -selectedProduct.costPrice,
          itemStyle: { color: '#ff8787' }
        },
        {
          value: -selectedProduct.fulfillment,
          itemStyle: { color: '#ffa94d' }
        },
        {
          value: -selectedProduct.adSpendSales,
          itemStyle: { color: '#fab005' }
        },
        {
          value: -selectedProduct.price * selectedProduct.tax / 100,
          itemStyle: { color: '#fd7e14' }
        },
        {
          value: selectedProduct.netProfit,
          itemStyle: { color: selectedProduct.netProfit > 0 ? '#40c057' : '#fa5252' }
        }
      ]
    }]
  } : {};
  
  // Heat map для ABC-XYZ анализа
  const abcXyzData = [
    [0, 0, products.filter(p => p.margin > 30 && p.trend === 'stable').length],
    [0, 1, products.filter(p => p.margin > 30 && p.trend === 'up').length],
    [0, 2, products.filter(p => p.margin > 30 && p.trend === 'down').length],
    [1, 0, products.filter(p => p.margin >= 15 && p.margin <= 30 && p.trend === 'stable').length],
    [1, 1, products.filter(p => p.margin >= 15 && p.margin <= 30 && p.trend === 'up').length],
    [1, 2, products.filter(p => p.margin >= 15 && p.margin <= 30 && p.trend === 'down').length],
    [2, 0, products.filter(p => p.margin < 15 && p.trend === 'stable').length],
    [2, 1, products.filter(p => p.margin < 15 && p.trend === 'up').length],
    [2, 2, products.filter(p => p.margin < 15 && p.trend === 'down').length],
  ];
  
  const heatMapOptions = {
    tooltip: {
      position: 'top'
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: ['X: Стабильные', 'Y: Растущие', 'Z: Падающие'],
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: ['C: Низкая прибыль', 'B: Средняя прибыль', 'A: Высокая прибыль'],
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      inRange: {
        color: ['#f1f3f5', '#339af0', '#1c7ed6']
      }
    },
    series: [{
      name: 'ABC-XYZ',
      type: 'heatmap',
      data: abcXyzData.map(item => [item[1], item[0], item[2]]),
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  
  return (
    <Container fluid p="xl">
      {/* Критические алерты */}
      <Transition mounted={alerts.some(a => a.type === 'critical' && a.action === 'analyze')} transition="slide-down" duration={400}>
        {(styles) => (
          <div style={styles}>
            <Stack gap="md" mb="xl">
              {alerts.filter(a => a.type === 'critical' && a.action === 'analyze').map(alert => (
                <AlertItem 
                  key={alert.id} 
                  alert={alert} 
                  onDismiss={() => dismissAlert(alert.id)}
                />
              ))}
            </Stack>
          </div>
        )}
      </Transition>
      
      {/* KPI панель */}
      <Grid gutter="md" mb="xl">
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <MetricCard
            title="Средняя маржинальность"
            value={`${avgMargin.toFixed(1)}%`}
            change={2.3}
            icon={<IconChartArcs size={24} />}
            color="blue"
            progress={avgMargin > 0 ? avgMargin : 0}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <MetricCard
            title="Общая прибыль"
            value={`₽${(totalProfit / 1000000).toFixed(1)}M`}
            change={15}
            icon={<IconWallet size={24} />}
            color="green"
            subtitle="За месяц"
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <MetricCard
            title="Средний ROI"
            value={`${avgROI.toFixed(0)}%`}
            change={23}
            icon={<IconTrendingUp size={24} />}
            color="violet"
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <MetricCard
            title="Убыточные товары"
            value={`${unprofitableCount} SKU`}
            change={-25}
            icon={<IconAlertOctagon size={24} />}
            color="red"
            subtitle="Требуют внимания"
            onClick={() => setQuickFilter('unprofitable')}
          />
        </Grid.Col>
      </Grid>
      
      {/* Фильтры */}
      <Card shadow="sm" radius="md" withBorder mb="xl">
        <Stack gap="md">
          {/* Быстрые фильтры */}
          <Group>
            <Text size="sm" fw={600}>Быстрые фильтры:</Text>
            <Group gap="xs">
              <Chip 
                checked={quickFilter === 'all'} 
                onChange={() => setQuickFilter('all')}
                color="blue"
                variant="filled"
              >
                Все товары
              </Chip>
              <Chip 
                checked={quickFilter === 'unprofitable'} 
                onChange={() => setQuickFilter('unprofitable')}
                color="red"
                variant="filled"
              >
                🔴 Убыточные
              </Chip>
              <Chip 
                checked={quickFilter === 'low-margin'} 
                onChange={() => setQuickFilter('low-margin')}
                color="yellow"
                variant="filled"
              >
                🟡 Низкая маржа
              </Chip>
              <Chip 
                checked={quickFilter === 'top'} 
                onChange={() => setQuickFilter('top')}
                color="green"
                variant="filled"
              >
                🟢 Топ товары
              </Chip>
              <Chip 
                checked={quickFilter === 'attention'} 
                onChange={() => setQuickFilter('attention')}
                color="orange"
                variant="filled"
              >
                ⚠️ Требуют внимания
              </Chip>
              <Chip 
                checked={quickFilter === 'falling'} 
                onChange={() => setQuickFilter('falling')}
                color="gray"
                variant="filled"
              >
                📉 Падение продаж
              </Chip>
              <Chip 
                checked={quickFilter === 'growing'} 
                onChange={() => setQuickFilter('growing')}
                color="teal"
                variant="filled"
              >
                🚀 Растущие
              </Chip>
            </Group>
          </Group>
          
          {/* Детальные фильтры */}
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Text size="sm" fw={500} mb={5}>Маржинальность</Text>
              <RangeSlider
                min={-50}
                max={100}
                value={marginFilter}
                onChange={setMarginFilter}
                marks={[
                  { value: -50, label: '-50%' },
                  { value: 0, label: '0%' },
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' }
                ]}
                labelAlwaysOn
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <MultiSelect
                label="Статус товара"
                placeholder="Выберите статусы"
                data={[
                  { value: 'profitable', label: '✅ Прибыльные' },
                  { value: 'breakeven', label: '⚡ На грани' },
                  { value: 'unprofitable', label: '❌ Убыточные' }
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                clearable
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Поиск"
                placeholder="Артикул или название..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                rightSection={
                  searchQuery && (
                    <ActionIcon size="sm" onClick={() => setSearchQuery('')}>
                      <IconX size={14} />
                    </ActionIcon>
                  )
                }
              />
            </Grid.Col>
          </Grid>
          
          <Group justify="space-between">
            <Text size="sm" color="dimmed">
              Найдено товаров: {filteredProducts.length}
            </Text>
            <Group gap="xs">
              <Button 
                variant="subtle" 
                size="xs" 
                leftSection={<IconFilterOff size={16} />}
                onClick={() => {
                  setMarginFilter([-50, 100]);
                  setStatusFilter([]);
                  setQuickFilter('all');
                  setSearchQuery('');
                }}
              >
                Сбросить фильтры
              </Button>
              <Button variant="light" size="xs" leftSection={<IconFileSpreadsheet size={16} />}>
                Экспорт в Excel
              </Button>
            </Group>
          </Group>
        </Stack>
      </Card>
      
      {/* Визуализации */}
      <Grid gutter="md" mb="xl">
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card shadow="sm" radius="md" withBorder>
            <Title order={5} mb="md">ABC-XYZ анализ товаров</Title>
            <ReactECharts option={heatMapOptions} style={{ height: 300 }} />
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card shadow="sm" radius="md" withBorder h="100%">
            <Title order={5} mb="md">Анализ убыточных товаров</Title>
            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>Найдено убыточных товаров:</Text>
                <Badge color="red" size="lg" variant="filled">{unprofitableCount}</Badge>
              </Group>
              
              <Divider my="sm" />
              
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm">Высокая себестоимость:</Text>
                  <Group gap={5}>
                    <Text size="sm" fw={600}>12 товаров</Text>
                    <Text size="xs" color="dimmed">(52%)</Text>
                  </Group>
                </Group>
                <Progress value={52} color="red" size="sm" />
                
                <Group justify="space-between">
                  <Text size="sm">Низкий % выкупа:</Text>
                  <Group gap={5}>
                    <Text size="sm" fw={600}>7 товаров</Text>
                    <Text size="xs" color="dimmed">(30%)</Text>
                  </Group>
                </Group>
                <Progress value={30} color="orange" size="sm" />
                
                <Group justify="space-between">
                  <Text size="sm">Высокие расходы на рекламу:</Text>
                  <Group gap={5}>
                    <Text size="sm" fw={600}>4 товара</Text>
                    <Text size="xs" color="dimmed">(18%)</Text>
                  </Group>
                </Group>
                <Progress value={18} color="yellow" size="sm" />
              </Stack>
              
              <Divider my="sm" />
              
              <Paper p="md" radius="md" style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
              }}>
                <Group justify="space-between">
                  <div>
                    <Text size="xs" color="white" opacity={0.8}>Потенциал оптимизации</Text>
                    <Text size="lg" fw={700} color="white">+₽850,000/мес</Text>
                  </div>
                  <Button variant="white" size="xs" rightSection={<IconBulb size={16} />}>
                    План действий
                  </Button>
                </Group>
              </Paper>
            </Paper>
          </Card>
        </Grid.Col>
      </Grid>
      
      {/* Таблица товаров */}
      <Card shadow="sm" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={5}>Юнит-экономика товаров</Title>
          <Group gap="xs">
            <Button variant="light" size="xs" leftSection={<IconCalculator size={16} />}>
              Калькулятор
            </Button>
            <Button variant="light" size="xs" leftSection={<IconColumns size={16} />}>
              Настроить колонки
            </Button>
          </Group>
        </Group>
        
        <ScrollArea>
          <Table highlightOnHover style={{ minWidth: 1500 }}>
            <thead>
              <tr>
                <th style={{ position: 'sticky', left: 0, background: 'white', zIndex: 1 }}>Товар</th>
                <th>Артикул WB</th>
                <th>Цена</th>
                <th>% выкупа</th>
                <th>Себестоимость</th>
                <th>Комиссии</th>
                <th>Логистика</th>
                <th>Маркетинг</th>
                <th>Маржа</th>
                <th>ROI</th>
                <th>Остатки</th>
                <th>Продажи/день</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} style={{ cursor: 'pointer' }} onClick={() => {
                  setSelectedProduct(product);
                  setDetailsOpened(true);
                }}>
                  <td style={{ position: 'sticky', left: 0, background: 'white' }}>
                    <Group gap="sm">
                      <Image
                        src={product.image}
                        width={40}
                        height={40}
                        radius="md"
                        fallbackSrc="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%3e%3crect%20width='40'%20height='40'%20fill='%23f1f3f4'/%3e%3c/svg%3e"
                      />
                      <div>
                        <Text size="sm" fw={500} lineClamp={1}>{product.name}</Text>
                        <Group gap={5}>
                          <Text size="xs" color="dimmed">{product.sellerArticle}</Text>
                          <Badge 
                            size="xs" 
                            variant="dot"
                            color={
                              product.status === 'profitable' ? 'green' :
                              product.status === 'breakeven' ? 'yellow' : 'red'
                            }
                          >
                            {product.status === 'profitable' ? 'Прибыльный' :
                             product.status === 'breakeven' ? 'На грани' : 'Убыточный'}
                          </Badge>
                        </Group>
                      </div>
                    </Group>
                  </td>
                  <td>
                    <Text size="sm">{product.wbArticle}</Text>
                  </td>
                  <td>
                    <Stack gap={2}>
                      <Text size="sm" fw={500}>₽{product.price.toLocaleString('ru-RU')}</Text>
                      {product.trend !== 'stable' && (
                        <Group gap={3}>
                          {product.trend === 'up' ? 
                            <IconTrendingUp size={14} color="#40c057" /> :
                            <IconTrendingDown size={14} color="#fa5252" />
                          }
                          <Text size="xs" color={product.trend === 'up' ? 'green' : 'red'}>
                            {product.trend === 'up' ? '+12%' : '-8%'}
                          </Text>
                        </Group>
                      )}
                    </Stack>
                  </td>
                  <td>
                    <Stack gap={2}>
                      <Text size="sm">{product.buyoutRate}%</Text>
                      <Progress value={product.buyoutRate} size="xs" color="blue" />
                    </Stack>
                  </td>
                  <td>
                    <Text size="sm">₽{product.costPrice.toLocaleString('ru-RU')}</Text>
                    <Text size="xs" color="dimmed">
                      {((product.costPrice / product.price) * 100).toFixed(0)}% от цены
                    </Text>
                  </td>
                  <td>
                    <Text size="sm">₽{(product.price * product.totalCommission / 100).toFixed(0)}</Text>
                    <Text size="xs" color="dimmed">{product.totalCommission}%</Text>
                  </td>
                  <td>
                    <Text size="sm">₽{product.fulfillment}</Text>
                    <Text size="xs" color="dimmed">{product.totalDeliveryTime} дн.</Text>
                  </td>
                  <td>
                    <Text size="sm">₽{product.adSpendSales.toFixed(0)}</Text>
                    <Text size="xs" color="dimmed">ДРР {product.drrSales}%</Text>
                  </td>
                  <td>
                    <Badge
                      size="lg"
                      variant="filled"
                      color={
                        product.margin > 30 ? 'green' :
                        product.margin > 15 ? 'yellow' :
                        product.margin > 0 ? 'orange' : 'red'
                      }
                    >
                      {product.margin.toFixed(1)}%
                    </Badge>
                  </td>
                  <td>
                    <Text 
                      size="sm" 
                      fw={600}
                      color={product.roi > 200 ? 'green' : product.roi > 100 ? 'yellow' : 'red'}
                    >
                      {product.roi}%
                    </Text>
                  </td>
                  <td>
                    <Stack gap={2}>
                      <Text size="sm">{product.stock} шт</Text>
                      <Text size="xs" color={product.stock / product.salesPerDay < 14 ? 'red' : 'dimmed'}>
                        {(product.stock / product.salesPerDay).toFixed(0)} дн.
                      </Text>
                    </Stack>
                  </td>
                  <td>
                    <Text size="sm">{product.salesPerDay} шт</Text>
                    <Text size="xs" color="dimmed">
                      ₽{(product.salesPerDay * product.price).toLocaleString('ru-RU')}
                    </Text>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <Group gap={4}>
                      <Tooltip label="Оптимизировать">
                        <ActionIcon size="sm" variant="subtle" color="blue">
                          <IconBulb size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="История">
                        <ActionIcon size="sm" variant="subtle">
                          <IconHistory size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon size="sm" variant="subtle">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<IconEdit size={14} />}>
                            Редактировать
                          </Menu.Item>
                          <Menu.Item leftSection={<IconCopy size={14} />}>
                            Дублировать
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
                            Удалить
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      </Card>
      
      {/* Детальная информация о товаре */}
      <Drawer
        opened={detailsOpened}
        onClose={() => setDetailsOpened(false)}
        title={
          selectedProduct && (
            <Group>
              <Image
                src={selectedProduct.image}
                width={50}
                height={50}
                radius="md"
                fallbackSrc="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='50'%20height='50'%20viewBox='0%200%2050%2050'%3e%3crect%20width='50'%20height='50'%20fill='%23f1f3f4'/%3e%3c/svg%3e"
              />
              <div>
                <Text fw={600}>{selectedProduct.name}</Text>
                <Text size="sm" color="dimmed">{selectedProduct.wbArticle}</Text>
              </div>
            </Group>
          )
        }
        padding="xl"
        size="xl"
        position="right"
      >
        {selectedProduct && (
          <Tabs defaultValue="finance">
            <Tabs.List>
              <Tabs.Tab value="finance" leftSection={<IconChartCandle size={14} />}>
                Финансовая воронка
              </Tabs.Tab>
              <Tabs.Tab value="history" leftSection={<IconHistory size={14} />}>
                История
              </Tabs.Tab>
              <Tabs.Tab value="competitors" leftSection={<IconUsers size={14} />}>
                Конкуренты
              </Tabs.Tab>
              <Tabs.Tab value="forecast" leftSection={<IconChartLine size={14} />}>
                Прогнозы
              </Tabs.Tab>
            </Tabs.List>
            
            <Tabs.Panel value="finance" pt="xl">
              <Stack gap="xl">
                <Card shadow="sm" radius="md" withBorder>
                  <Title order={6} mb="md">Финансовая воронка</Title>
                  <ReactECharts option={waterfallOptions} style={{ height: 300 }} />
                </Card>
                
                <Card shadow="sm" radius="md" withBorder>
                  <Title order={6} mb="md">Детализация расходов</Title>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm">Цена продажи:</Text>
                      <Text size="sm" fw={600}>₽{selectedProduct.price.toLocaleString('ru-RU')}</Text>
                    </Group>
                    <Divider />
                    <Group justify="space-between">
                      <Text size="sm" color="dimmed">После выкупа ({selectedProduct.buyoutRate}%):</Text>
                      <Text size="sm">₽{(selectedProduct.price * selectedProduct.buyoutRate / 100).toFixed(0)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" color="dimmed">Комиссия WB ({selectedProduct.totalCommission}%):</Text>
                      <Text size="sm" color="red">-₽{(selectedProduct.price * selectedProduct.totalCommission / 100).toFixed(0)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" color="dimmed">Себестоимость:</Text>
                      <Text size="sm" color="red">-₽{selectedProduct.costPrice}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" color="dimmed">Логистика:</Text>
                      <Text size="sm" color="red">-₽{selectedProduct.fulfillment}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" color="dimmed">Маркетинг (ДРР {selectedProduct.drrSales}%):</Text>
                      <Text size="sm" color="red">-₽{selectedProduct.adSpendSales.toFixed(0)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" color="dimmed">Налоги:</Text>
                      <Text size="sm" color="red">-₽{(selectedProduct.price * selectedProduct.tax / 100).toFixed(0)}</Text>
                    </Group>
                    <Divider />
                    <Group justify="space-between">
                      <Text size="sm" fw={600}>Чистая прибыль:</Text>
                      <Text 
                        size="lg" 
                        fw={700}
                        color={selectedProduct.netProfit > 0 ? 'green' : 'red'}
                      >
                        ₽{selectedProduct.netProfit} ({selectedProduct.margin.toFixed(1)}%)
                      </Text>
                    </Group>
                  </Stack>
                </Card>
                
                <Paper p="md" radius="md" style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                }}>
                  <Group gap="xs" style={{ marginBottom: '0.5rem' }}>
                    <ThemeIcon size="md" variant="white" color="violet">
                      <IconRobotFace size={20} />
                    </ThemeIcon>
                    <Text size="sm" fw={600} color="white">AI рекомендации</Text>
                  </Group>
                  <Stack gap="xs">
                    <Group gap="xs">
                      <IconSparkles size={16} color="white" />
                      <Text size="xs" color="white">
                        Поднимите цену на 200₽ - спрос упадет на 5%, но прибыль вырастет на 15%
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <IconBuildingWarehouse size={16} color="white" />
                      <Text size="xs" color="white">
                        Переведите на склад Казань - сэкономите 50₽ на единицу
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <IconTargetArrow size={16} color="white" />
                      <Text size="xs" color="white">
                        Снизьте ДРР до 5% - органика уже составляет 70%
                      </Text>
                    </Group>
                  </Stack>
                </Paper>
              </Stack>
            </Tabs.Panel>
            
            <Tabs.Panel value="history" pt="xl">
              <Text color="dimmed" size="sm">История изменений в разработке...</Text>
            </Tabs.Panel>
            
            <Tabs.Panel value="competitors" pt="xl">
              <Text color="dimmed" size="sm">Анализ конкурентов в разработке...</Text>
            </Tabs.Panel>
            
            <Tabs.Panel value="forecast" pt="xl">
              <Text color="dimmed" size="sm">Прогнозы и сценарии в разработке...</Text>
            </Tabs.Panel>
          </Tabs>
        )}
      </Drawer>
    </Container>
  );
};

// Основной компонент приложения
const WildberriesApp: React.FC = () => {
  const { currentPage, setCurrentPage } = useDashboardStore();
  const [activeNav, setActiveNav] = useState('overview');
  
  // Навигационные пункты
  const navItems = [
    { id: 'overview', icon: IconChartBar, label: 'Обзор', page: 'overview' as const },
    { id: 'unit-economics', icon: IconCalculator, label: 'Юнит-экономика', page: 'unit-economics' as const },
    { id: 'competitors', icon: IconUsers, label: 'Конкуренты', page: 'competitors' as const },
    { id: 'finances', icon: IconCoin, label: 'Финансы', page: 'finances' as const },
    { id: 'campaigns', icon: IconRocket, label: 'Кампании' },
    { id: 'products', icon: IconPackage, label: 'Товары' },
    { id: 'analytics', icon: IconChartInfographic, label: 'Аналитика' },
    { id: 'ab-tests', icon: IconTargetArrow, label: 'A/B тесты' },
    { id: 'traffic', icon: IconDeviceAnalytics, label: 'Трафик' },
    { id: 'reports', icon: IconReportAnalytics, label: 'Отчеты' }
  ];
  
  const handleNavClick = (item: any) => {
    setActiveNav(item.id);
    if (item.page) {
      setCurrentPage(item.page);
    }
  };
  
  return (
    <AppShell
      navbar={{ width: 280, breakpoint: 'sm' }}
      header={{ height: 70 }}
    >
      <AppShell.Navbar p="md">
        <AppShell.Section>
            <Group>
              <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'violet', to: 'grape' }}>
                <IconBrandWechat size={28} />
              </ThemeIcon>
              <div>
                <Text size="lg" fw={700}>WB Analytics</Text>
                <Text size="xs" color="dimmed">Панель управления</Text>
              </div>
            </Group>
        </AppShell.Section>
        
        <AppShell.Section grow mt="xl" component={ScrollArea}>
            <Stack gap={5}>
              {navItems.map((item) => (
                <UnstyledButton
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    color: '#000',
                    backgroundColor: activeNav === item.id ? '#f3f0ff' : 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (activeNav !== item.id) {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeNav !== item.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Group>
                    <ThemeIcon 
                      variant={activeNav === item.id ? 'filled' : 'light'} 
                      color="violet"
                    >
                      <item.icon size={20} />
                    </ThemeIcon>
                    <Text size="sm" fw={500}>{item.label}</Text>
                  </Group>
                </UnstyledButton>
              ))}
            </Stack>
        </AppShell.Section>
        
        <AppShell.Section>
            <UnstyledButton
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                color: '#000',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Group>
                <ThemeIcon variant="light" color="gray">
                  <IconSettings size={20} />
                </ThemeIcon>
                <Text size="sm" fw={500}>Настройки</Text>
              </Group>
            </UnstyledButton>
        </AppShell.Section>
      </AppShell.Navbar>
      
      <AppShell.Header p="md">
          <Group justify="space-between" style={{ height: '100%' }}>
            <Group>
              <Select
                defaultValue="7d"
                data={[
                  { value: '1d', label: 'Сегодня' },
                  { value: '7d', label: '7 дней' },
                  { value: '30d', label: '30 дней' },
                  { value: '90d', label: '90 дней' }
                ]}
                size="sm"
                leftSection={<IconCalendar size={16} />}
                styles={{
                  root: { width: 140 }
                }}
              />
              <TextInput
                placeholder="Поиск..."
                leftSection={<IconSearch size={16} />}
                size="sm"
                styles={{
                  root: { width: 300 }
                }}
              />
            </Group>
            
            <Group>
              <Tooltip label="Обновить данные">
                <ActionIcon 
                  variant="light" 
                  color="blue" 
                  size="lg"
                  onClick={() => {
                    notifications.show({
                      title: 'Данные обновлены',
                      message: 'Все метрики актуализированы',
                      color: 'green',
                      icon: <IconCheck />
                    });
                  }}
                >
                  <IconRefresh size={20} />
                </ActionIcon>
              </Tooltip>
              
              <Indicator color="red" size={8} processing>
                <ActionIcon variant="light" color="gray" size="lg">
                  <IconBell size={20} />
                </ActionIcon>
              </Indicator>
              
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="light" color="gray" size="lg">
                    <IconDots size={20} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Действия</Menu.Label>
                  <Menu.Item leftSection={<IconDownload size={14} />}>
                    Экспорт отчета
                  </Menu.Item>
                  <Menu.Item leftSection={<IconFilter size={14} />}>
                    Настроить фильтры
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item leftSection={<IconSettings size={14} />}>
                    Параметры
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              
              <Avatar color="violet" radius="xl">МК</Avatar>
            </Group>
          </Group>
      </AppShell.Header>
      
      <AppShell.Main>
      {currentPage === 'overview' ? <WildberriesDashboard /> : 
       currentPage === 'unit-economics' ? <UnitEconomicsPage /> :
       currentPage === 'competitors' ? <CompetitorsPage /> :
       currentPage === 'finances' ? <FinancesPage /> : null}
      </AppShell.Main>
    </AppShell>
  );
};

// Компонент страницы обзора (из предыдущего кода)
const WildberriesDashboard: React.FC = () => {
  const { campaigns, alerts, metrics, trafficSources, competitors, funnelData, selectedPeriod, setSelectedPeriod, dismissAlert } = useDashboardStore();
  const [alertsModalOpened, setAlertsModalOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0);
  const totalOrders = campaigns.reduce((acc, c) => acc + c.orders, 0);
  const averageROAS = totalRevenue / totalSpent;
  const averageCPC = totalSpent / campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  
  const chartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        animation: true
      }
    },
    legend: {
      data: ['Выручка', 'Расходы', 'Заказы', 'ROAS'],
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
      data: metrics.slice(-7).map(m => m.date),
      axisLine: {
        lineStyle: {
          color: '#e9ecef'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Руб.',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#339af0'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f1f3f5'
          }
        }
      },
      {
        type: 'value',
        name: 'ROAS',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#40c057'
          }
        }
      }
    ],
    series: [
      {
        name: 'Выручка',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        lineStyle: {
          width: 3,
          color: '#339af0'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(51, 154, 240, 0.3)'
            }, {
              offset: 1, color: 'rgba(51, 154, 240, 0.05)'
            }]
          }
        },
        data: metrics.slice(-7).map(m => m.revenue)
      },
      {
        name: 'Расходы',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        lineStyle: {
          width: 2,
          color: '#fa5252'
        },
        data: metrics.slice(-7).map(m => m.spent)
      },
      {
        name: 'Заказы',
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: '#fab005',
          borderRadius: [4, 4, 0, 0]
        },
        data: metrics.slice(-7).map(m => m.orders * 100)
      },
      {
        name: 'ROAS',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        lineStyle: {
          width: 2,
          color: '#40c057',
          type: 'dashed'
        },
        data: metrics.slice(-7).map(m => m.roas)
      }
    ]
  };
  
  return (
    <Container fluid p="xl">
      <Transition mounted={alerts.some(a => a.type === 'critical')} transition="slide-down" duration={400}>
        {(styles) => (
          <div style={styles}>
            <Stack gap="md" mb="xl">
              {alerts.filter(a => a.type === 'critical').map(alert => (
                <AlertItem 
                  key={alert.id} 
                  alert={alert} 
                  onDismiss={() => dismissAlert(alert.id)}
                />
              ))}
            </Stack>
          </div>
        )}
      </Transition>
      
      <Grid gutter="md" mb="xl">
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          {loading ? (
            <Skeleton height={140} radius="md" />
          ) : (
            <MetricCard
              title="Общая выручка"
              value={`₽${totalRevenue.toLocaleString('ru-RU')}`}
              change={15.3}
              icon={<IconMoneybag size={24} />}
              color="blue"
              subtitle="За последние 7 дней"
              onClick={() => console.log('Revenue clicked')}
            />
          )}
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          {loading ? (
            <Skeleton height={140} radius="md" />
          ) : (
            <MetricCard
              title="ROAS"
              value={averageROAS.toFixed(2)}
              change={8.7}
              icon={<IconTrendingUp size={24} />}
              color="green"
              progress={averageROAS / 5 * 100}
              subtitle="Цель: 5.0"
            />
          )}
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          {loading ? (
            <Skeleton height={140} radius="md" />
          ) : (
            <MetricCard
              title="Заказы"
              value={totalOrders.toLocaleString('ru-RU')}
              change={-5.2}
              icon={<IconShoppingCart size={24} />}
              color="orange"
              subtitle="Конверсия: 3.4%"
            />
          )}
        </Grid.Col>
      </Grid>
      
      <Grid gutter="md" mb="xl">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card shadow="sm" radius="md" withBorder p="xl">
            <Group justify="space-between" mb="md">
              <Title order={4}>Динамика показателей</Title>
              <Group gap={5}>
                <Badge variant="dot" color="blue">Выручка</Badge>
                <Badge variant="dot" color="red">Расходы</Badge>
                <Badge variant="dot" color="yellow">Заказы</Badge>
                <Badge variant="dot" color="green">ROAS</Badge>
              </Group>
            </Group>
            {loading ? (
              <Skeleton height={300} />
            ) : (
              <ReactECharts option={chartOptions} style={{ height: 300 }} />
            )}
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card shadow="sm" radius="md" withBorder p="xl" h="100%">
            <Title order={4} mb="md">Топ кампании по ROAS</Title>
            <Stack gap="md">
              {campaigns
                .sort((a, b) => b.roas - a.roas)
                .slice(0, 3)
                .map((campaign, index) => (
                  <Paper key={campaign.id} p="md" radius="md" withBorder>
                    <Group justify="space-between" mb="xs">
                      <Group gap="xs">
                        <ThemeIcon
                          size="lg"
                          radius="xl"
                          variant="gradient"
                          gradient={{ 
                            from: index === 0 ? 'yellow' : index === 1 ? 'gray' : 'orange',
                            to: index === 0 ? 'orange' : index === 1 ? 'dark' : 'red'
                          }}
                        >
                          {index === 0 ? <IconTrophy size={20} /> : <IconFlame size={20} />}
                        </ThemeIcon>
                        <div>
                          <Text size="sm" fw={600}>{campaign.name}</Text>
                          <Badge size="xs" variant="light" color={
                            campaign.type === 'search' ? 'blue' : 
                            campaign.type === 'card' ? 'green' : 'orange'
                          }>
                            {campaign.type === 'search' ? 'Поиск' :
                             campaign.type === 'card' ? 'Карточка' : 'Каталог'}
                          </Badge>
                        </div>
                      </Group>
                      <div style={{ textAlign: 'right' }}>
                        <Text size="lg" fw={700} color="green">
                          {campaign.roas.toFixed(2)}
                        </Text>
                        <Text size="xs" color="dimmed">ROAS</Text>
                      </div>
                    </Group>
                    <Progress
                      value={campaign.roas / 6 * 100}
                      color={index === 0 ? 'yellow' : index === 1 ? 'gray' : 'orange'}
                      size="sm"
                      radius="xl"
                      animated
                    />
                  </Paper>
                ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
      
      <Modal
        opened={alertsModalOpened}
        onClose={() => setAlertsModalOpened(false)}
        title="История уведомлений"
        size="lg"
      >
        <Stack>
          {alerts.map(alert => (
            <AlertItem 
              key={alert.id} 
              alert={alert} 
              onDismiss={() => dismissAlert(alert.id)}
            />
          ))}
        </Stack>
      </Modal>
    </Container>
  );
};

// Компонент юнит-экономики (заглушка)
const UnitEconomicsPage: React.FC = () => {
  return (
    <Container size="xl" py="md">
      <Title order={2} mb="lg">Юнит-экономика</Title>
      <Text color="dimmed">Страница юнит-экономики в разработке...</Text>
    </Container>
  );
};

export default WildberriesApp;