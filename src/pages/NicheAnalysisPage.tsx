import React, { useState, useMemo } from 'react';
import {
  Container,
  Card,
  TextInput,
  Button,
  Group,
  Text,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Select,
  Table,
  Badge,
  ActionIcon,
  Tooltip,
  Progress,
  Radio,
  NumberInput,
  Slider,
  Switch,
  Divider,
  Modal,
  Tabs,
  Alert,
  Checkbox,
  RangeSlider,
  SegmentedControl,
  Accordion,
  Paper,
  Image,
  Avatar,
  Anchor,
  Mark,
  Highlight,
  Code,
  Blockquote,
  Title,
  Popover,
  Grid,
  Tooltip as MantineTooltip
} from '@mantine/core';
import {
  IconSearch,
  IconRefresh,
  IconAnalyze,
  IconEye,
  IconCopy,
  IconTrendingUp,
  IconTrendingDown,
  IconInfoCircle,
  IconBell,
  IconSettings,
  IconFilter,
  IconDownload,
  IconShare,
  IconBookmark,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconExternalLink,
  IconCrown,
  IconBuilding,
  IconUser,
  IconCalendar,
  IconTarget,
  IconCalculator,
  IconChartBar,
  IconCompass,
  IconBrandTelegram,
  IconMail,
  IconDeviceMobile,
  IconPlus,
  IconMinus,
  IconStar,
  IconHeart,
  IconChartDots,
  IconArrowUp,
  IconArrowDown,
  IconUsers,
  IconChartLine,
  IconArrowsRightLeft,
  IconCalendarEvent,
  IconPackage,
  IconNetwork
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Product {
  id: string;
  sku: string;
  name: string;
  revenue: number;
  marketShare: number;
  price: number;
  sales: number;
  rating: number;
  reviews: number;
  seller: string;
  sellerType: 'brand' | 'ip' | 'ooo';
  monthsOnPlatform: number;
  trend: number;
  country: string;
  imageUrl: string;
  category: string;
  isNew: boolean;
  lastPriceChange: number;
  averageRating: number;
  photosCount: number;
  hasVideo: boolean;
  deliveryDays: number;
  inStock: boolean;
}

interface NicheData {
  id: string;
  name: string;
  marketVolume: number;
  totalSellers: number;
  activeSellers: number;
  averagePrice: number;
  averageCheck: number;
  yearOverYearGrowth: number;
  competition: number;
  opportunityScore: number;
  barrierToEntry: 'low' | 'medium' | 'high';
  seasonality: Array<{ month: string; volume: number; sales: number }>;
  products: Product[];
  keyWords: string[];
  avgPhotosQuality: number;
  avgSellerAge: number;
  brandsPercentage: number;
  newComersInTop10: number;
  reviewsThresholdForTop10: number;
  priceRange: { min: number; max: number };
  mainCategories: string[];
  riskFactors: Array<{ factor: string; impact: number; description: string }>;
  opportunities: Array<{ opportunity: string; impact: number; description: string }>;
}

interface ComparisonNiche {
  name: string;
  marketVolume: number;
  competition: number;
  opportunityScore: number;
  seasonality: 'low' | 'medium' | 'high';
  color: string;
}

interface Alert {
  id: string;
  type: 'competitor' | 'price' | 'trend' | 'keyword' | 'rating' | 'newProduct';
  message: string;
  active: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface CostBreakdown {
  costPrice: number;
  shipping: number;
  advertising: number;
  buyouts: number;
  packaging: number;
  photoshoot: number;
  firstBatch: number;
}

interface NicheAnalysisState {
  currentNiche: NicheData | null;
  selectedProducts: string[];
  comparisonNiches: ComparisonNiche[];
  alerts: Alert[];
  loading: boolean;
  searchQuery: string;
  savedSearches: string[];
  favorites: string[];
  watchList: string[];
  costBreakdown: CostBreakdown;
  goalType: 'budget' | 'profit' | 'marketShare' | 'margin';
  goalValues: {
    budget: number;
    profit: number;
    marketShare: number;
    margin: number;
  };
  notifications: {
    telegram: boolean;
    email: boolean;
    push: boolean;
  };
  
  setCurrentNiche: (niche: NicheData) => void;
  toggleProductSelection: (productId: string) => void;
  addComparisonNiche: (niche: ComparisonNiche) => void;
  removeComparisonNiche: (nicheId: string) => void;
  setSearchQuery: (query: string) => void;
  analyzeNiche: (query: string) => Promise<void>;
  toggleAlert: (alertId: string) => void;
  updateCostBreakdown: (costs: Partial<CostBreakdown>) => void;
  setGoalType: (type: 'budget' | 'profit' | 'marketShare' | 'margin') => void;
  updateGoalValues: (values: Partial<{ budget: number; profit: number; marketShare: number; margin: number }>) => void;
  addToFavorites: (nicheId: string) => void;
  addToWatchList: (productId: string) => void;
  saveSearch: (query: string) => void;
}

// Добавляем новые типы для матрицы продуктов
interface ProductMatrixData {
  id: string;
  name: string;
  category: string;
  revenue: number;
  monthlySales: number;
  averagePrice: number;
  margin: number;
  marketGrowth: number;
  marketShare: number;
  profit: number;
  lifecycleStage: 'introduction' | 'growth' | 'maturity' | 'decline';
  cannibalizationRisk: number;
  cannibalizationTargets: string[];
  salesTrend: number;
  rating: number;
  reviewsCount: number;
  sellersCount: number;
  topSellers: Array<{
    name: string;
    marketShare: number;
    rating: number;
  }>;
  keyFeatures: string[];
  competitiveAdvantages: string[];
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
  abcxyzCategory: string;
  priceElasticity: number;
  crossSellOpportunities: Array<{
    relatedProduct: string;
    potentialRevenue: number;
  }>;
  seasonalPatterns: Array<{
    month: number;
    demand: number;
    price: number;
  }>;
  inventoryMetrics: {
    optimalStock: number;
    currentStock: number;
    reorderPoint: number;
    turnoverRate: number;
  };
  productAffinity: Array<{
    relatedProduct: string;
    affinityScore: number;
  }>;
}

// Mock data
const mockNicheData: NicheData = {
  id: 'summer-dresses-2024',
  name: 'Платья летние',
  marketVolume: 450_000_000,
  totalSellers: 2345,
  activeSellers: 1234,
  averagePrice: 2150,
  averageCheck: 2890,
  yearOverYearGrowth: 35,
  competition: 8.7,
  opportunityScore: 7.8,
  barrierToEntry: 'medium',
  keyWords: ['платье', 'летнее', 'сарафан', 'легкое', 'хлопок', 'лен'],
  avgPhotosQuality: 4.3,
  avgSellerAge: 8,
  brandsPercentage: 60,
  newComersInTop10: 2,
  reviewsThresholdForTop10: 500,
  priceRange: { min: 890, max: 4500 },
  mainCategories: ['Платья', 'Сарафаны', 'Туники'],
  riskFactors: [
    { factor: 'Высокая конкуренция', impact: -1.5, description: '8.7/10 - много игроков' },
    { factor: 'Сезонность', impact: -0.8, description: 'Падение до -60% зимой' },
    { factor: 'Много брендов', impact: -1.2, description: '60% товаров от брендов' }
  ],
  opportunities: [
    { opportunity: 'Растущий тренд', impact: 1.5, description: '+35% рост YoY' },
    { opportunity: 'Средний рейтинг', impact: 1.2, description: 'Возможность выделиться качеством' },
    { opportunity: 'Хорошая маржа', impact: 1.8, description: '26%+ средняя прибыльность' }
  ],
  seasonality: [
    { month: 'Янв', volume: 180_000_000, sales: 95000 },
    { month: 'Фев', volume: 200_000_000, sales: 105000 },
    { month: 'Мар', volume: 280_000_000, sales: 147000 },
    { month: 'Апр', volume: 350_000_000, sales: 184000 },
    { month: 'Май', volume: 420_000_000, sales: 221000 },
    { month: 'Июн', volume: 480_000_000, sales: 253000 },
    { month: 'Июл', volume: 450_000_000, sales: 237000 },
    { month: 'Авг', volume: 430_000_000, sales: 226000 },
    { month: 'Сен', volume: 380_000_000, sales: 200000 },
    { month: 'Окт', volume: 320_000_000, sales: 168000 },
    { month: 'Ноя', volume: 250_000_000, sales: 132000 },
    { month: 'Дек', volume: 220_000_000, sales: 116000 },
  ],
  products: [
    {
      id: '1', sku: '123456789', name: 'Платье летнее Premium',
      revenue: 45_000_000, marketShare: 10.0, price: 1899, sales: 23700,
      rating: 4.8, reviews: 1890, seller: 'PREMIUM_DRESS', sellerType: 'brand',
      monthsOnPlatform: 14, trend: 23, country: 'РФ',
      imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300',
      category: 'Платья', isNew: false, lastPriceChange: -5, averageRating: 4.8,
      photosCount: 12, hasVideo: true, deliveryDays: 2, inStock: true
    },
    {
      id: '2', sku: '234567890', name: 'Сарафан модный 2024',
      revenue: 38_000_000, marketShare: 8.4, price: 2299, sales: 16500,
      rating: 4.7, reviews: 2100, seller: 'Fashion_Store', sellerType: 'ip',
      monthsOnPlatform: 8, trend: 45, country: 'Китай',
      imageUrl: 'https://images.unsplash.com/photo-1566479179817-6eb3b4e1f8c0?w=300',
      category: 'Сарафаны', isNew: true, lastPriceChange: 12, averageRating: 4.7,
      photosCount: 8, hasVideo: false, deliveryDays: 5, inStock: true
    },
    {
      id: '3', sku: '345678901', name: 'Туника beach style',
      revenue: 32_000_000, marketShare: 7.1, price: 1799, sales: 17800,
      rating: 4.6, reviews: 1456, seller: 'StyleHub', sellerType: 'ooo',
      monthsOnPlatform: 11, trend: 12, country: 'РФ',
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300',
      category: 'Туники', isNew: false, lastPriceChange: 0, averageRating: 4.6,
      photosCount: 10, hasVideo: true, deliveryDays: 3, inStock: false
    }
  ]
};

const mockComparisonNiches: ComparisonNiche[] = [
  { name: 'Блузки офисные', marketVolume: 280_000_000, competition: 6.2, opportunityScore: 8.4, seasonality: 'low', color: '#228be6' },
  { name: 'Джинсы женские', marketVolume: 720_000_000, competition: 9.1, opportunityScore: 5.2, seasonality: 'medium', color: '#fa5252' }
];

// Добавляем моковые данные для матрицы
const mockMatrixData: ProductMatrixData[] = [
  {
    id: '1',
    name: 'Умные часы Galaxy Watch',
    category: 'Электроника',
    revenue: 30000000,
    monthlySales: 6000,
    averagePrice: 29990,
    margin: 12000000,
    marketGrowth: 30,
    marketShare: 10,
    profit: 10000000,
    lifecycleStage: 'growth',
    cannibalizationRisk: 20,
    cannibalizationTargets: ['Смартфон Galaxy S', 'Планшет Galaxy Tab'],
    salesTrend: 15,
    rating: 4.8,
    reviewsCount: 12500,
    sellersCount: 8,
    topSellers: [
      { name: 'Samsung Galaxy Watch', marketShare: 50, rating: 4.9 },
      { name: 'Apple Watch', marketShare: 30, rating: 4.8 },
      { name: 'Fitbit Versa', marketShare: 20, rating: 4.7 }
    ],
    keyFeatures: ['Смартфон', 'Сенсорный экран', 'Пульсометр'],
    competitiveAdvantages: ['Качество', 'Дизайн', 'Продолжительность работы'],
    priceHistory: [
      { date: '2023-01-01', price: 29990 },
      { date: '2023-02-01', price: 30990 },
      { date: '2023-03-01', price: 31990 }
    ],
    abcxyzCategory: 'AX',
    priceElasticity: 1.2,
    crossSellOpportunities: [
      { relatedProduct: 'Смартфон Galaxy S', potentialRevenue: 1500000 },
      { relatedProduct: 'Планшет Galaxy Tab', potentialRevenue: 1200000 }
    ],
    seasonalPatterns: [
      { month: 1, demand: 100000, price: 30000 },
      { month: 2, demand: 110000, price: 31000 },
      { month: 3, demand: 120000, price: 32000 },
      { month: 4, demand: 130000, price: 33000 },
      { month: 5, demand: 140000, price: 34000 },
      { month: 6, demand: 150000, price: 35000 },
      { month: 7, demand: 160000, price: 36000 },
      { month: 8, demand: 170000, price: 37000 },
      { month: 9, demand: 180000, price: 38000 },
      { month: 10, demand: 190000, price: 39000 },
      { month: 11, demand: 200000, price: 40000 },
      { month: 12, demand: 210000, price: 41000 }
    ],
    inventoryMetrics: {
      optimalStock: 100000,
      currentStock: 90000,
      reorderPoint: 50000,
      turnoverRate: 3.0
    },
    productAffinity: [
      { relatedProduct: 'Смартфон Galaxy S', affinityScore: 90 },
      { relatedProduct: 'Планшет Galaxy Tab', affinityScore: 80 }
    ]
  },
  {
    id: '2',
    name: 'Беспроводные наушники Galaxy Buds',
    category: 'Электроника',
    revenue: 25000000,
    monthlySales: 5000,
    averagePrice: 14990,
    margin: 10000000,
    marketGrowth: 25,
    marketShare: 8,
    profit: 8000000,
    lifecycleStage: 'growth',
    cannibalizationRisk: 15,
    cannibalizationTargets: ['Умные часы Galaxy Watch'],
    salesTrend: 12,
    rating: 4.7,
    reviewsCount: 8500,
    sellersCount: 12,
    topSellers: [
      { name: 'Samsung Galaxy Buds', marketShare: 40, rating: 4.8 },
      { name: 'Apple AirPods', marketShare: 30, rating: 4.7 },
      { name: 'Sony WF-1000XM4', marketShare: 30, rating: 4.6 }
    ],
    keyFeatures: ['Беспроводной', 'Высокое качество звука', 'Активное шумоподавление'],
    competitiveAdvantages: ['Дизайн', 'Качество звука', 'Функциональность'],
    priceHistory: [
      { date: '2023-01-01', price: 14990 },
      { date: '2023-02-01', price: 15990 },
      { date: '2023-03-01', price: 16990 }
    ],
    abcxyzCategory: 'AY',
    priceElasticity: 1.1,
    crossSellOpportunities: [
      { relatedProduct: 'Умные часы Galaxy Watch', potentialRevenue: 1200000 },
      { relatedProduct: 'Смартфон Galaxy S', potentialRevenue: 1000000 }
    ],
    seasonalPatterns: [
      { month: 1, demand: 110000, price: 35000 },
      { month: 2, demand: 120000, price: 36000 },
      { month: 3, demand: 130000, price: 37000 },
      { month: 4, demand: 140000, price: 38000 },
      { month: 5, demand: 150000, price: 39000 },
      { month: 6, demand: 160000, price: 40000 },
      { month: 7, demand: 170000, price: 41000 },
      { month: 8, demand: 180000, price: 42000 },
      { month: 9, demand: 190000, price: 43000 },
      { month: 10, demand: 200000, price: 44000 },
      { month: 11, demand: 210000, price: 45000 },
      { month: 12, demand: 220000, price: 46000 }
    ],
    inventoryMetrics: {
      optimalStock: 90000,
      currentStock: 80000,
      reorderPoint: 45000,
      turnoverRate: 3.2
    },
    productAffinity: [
      { relatedProduct: 'Умные часы Galaxy Watch', affinityScore: 80 },
      { relatedProduct: 'Смартфон Galaxy S', affinityScore: 70 }
    ]
  },
  {
    id: '3',
    name: 'Электросамокат Ninebot',
    category: 'Электроника',
    revenue: 20000000,
    monthlySales: 4000,
    averagePrice: 45990,
    margin: 8000000,
    marketGrowth: 20,
    marketShare: 6,
    profit: 6000000,
    lifecycleStage: 'growth',
    cannibalizationRisk: 10,
    cannibalizationTargets: [],
    salesTrend: 55,
    rating: 4.6,
    reviewsCount: 6200,
    sellersCount: 6,
    topSellers: [
      { name: 'Ninebot', marketShare: 60, rating: 4.7 },
      { name: 'Segway', marketShare: 40, rating: 4.5 }
    ],
    keyFeatures: ['Электромобиль', 'Легкий', 'Дальность хода'],
    competitiveAdvantages: ['Технология', 'Дизайн', 'Удобство'],
    priceHistory: [
      { date: '2023-01-01', price: 45990 },
      { date: '2023-02-01', price: 46990 },
      { date: '2023-03-01', price: 47990 }
    ],
    abcxyzCategory: 'AZ',
    priceElasticity: 1.3,
    crossSellOpportunities: [
      { relatedProduct: 'Умные часы Galaxy Watch', potentialRevenue: 1200000 },
      { relatedProduct: 'Смартфон Galaxy S', potentialRevenue: 1000000 }
    ],
    seasonalPatterns: [
      { month: 1, demand: 110000, price: 35000 },
      { month: 2, demand: 120000, price: 36000 },
      { month: 3, demand: 130000, price: 37000 },
      { month: 4, demand: 140000, price: 38000 },
      { month: 5, demand: 150000, price: 39000 },
      { month: 6, demand: 160000, price: 40000 },
      { month: 7, demand: 170000, price: 41000 },
      { month: 8, demand: 180000, price: 42000 },
      { month: 9, demand: 190000, price: 43000 },
      { month: 10, demand: 200000, price: 44000 },
      { month: 11, demand: 210000, price: 45000 },
      { month: 12, demand: 220000, price: 46000 }
    ],
    inventoryMetrics: {
      optimalStock: 90000,
      currentStock: 80000,
      reorderPoint: 45000,
      turnoverRate: 3.2
    },
    productAffinity: [
      { relatedProduct: 'Умные часы Galaxy Watch', affinityScore: 80 },
      { relatedProduct: 'Смартфон Galaxy S', affinityScore: 70 }
    ]
  },
  {
    id: '4',
    name: 'Смартфон iPhone',
    category: 'Электроника',
    revenue: 15000000,
    monthlySales: 3000,
    averagePrice: 89990,
    margin: 6000000,
    marketGrowth: 15,
    marketShare: 5,
    profit: 4000000,
    lifecycleStage: 'maturity',
    cannibalizationRisk: 25,
    cannibalizationTargets: ['Умные часы Apple Watch'],
    salesTrend: 8,
    rating: 4.9,
    reviewsCount: 15000,
    sellersCount: 10,
    topSellers: [
      { name: 'Apple iPhone', marketShare: 45, rating: 4.9 },
      { name: 'Samsung Galaxy', marketShare: 35, rating: 4.8 },
      { name: 'Xiaomi', marketShare: 20, rating: 4.7 }
    ],
    keyFeatures: ['Смартфон', 'Камера', 'Процессор'],
    competitiveAdvantages: ['Качество', 'Дизайн', 'Экосистема'],
    priceHistory: [
      { date: '2023-01-01', price: 89990 },
      { date: '2023-02-01', price: 90990 },
      { date: '2023-03-01', price: 91990 }
    ],
    abcxyzCategory: 'BX',
    priceElasticity: 1.0,
    crossSellOpportunities: [
      { relatedProduct: 'Умные часы Apple Watch', potentialRevenue: 1000000 },
      { relatedProduct: 'Ноутбук MacBook', potentialRevenue: 900000 }
    ],
    seasonalPatterns: [
      { month: 1, demand: 100000, price: 30000 },
      { month: 2, demand: 110000, price: 31000 },
      { month: 3, demand: 120000, price: 32000 },
      { month: 4, demand: 130000, price: 33000 },
      { month: 5, demand: 140000, price: 34000 },
      { month: 6, demand: 150000, price: 35000 },
      { month: 7, demand: 160000, price: 36000 },
      { month: 8, demand: 170000, price: 37000 },
      { month: 9, demand: 180000, price: 38000 },
      { month: 10, demand: 190000, price: 39000 },
      { month: 11, demand: 200000, price: 40000 },
      { month: 12, demand: 210000, price: 41000 }
    ],
    inventoryMetrics: {
      optimalStock: 80000,
      currentStock: 70000,
      reorderPoint: 40000,
      turnoverRate: 3.0
    },
    productAffinity: [
      { relatedProduct: 'Умные часы Apple Watch', affinityScore: 85 },
      { relatedProduct: 'Ноутбук MacBook', affinityScore: 75 }
    ]
  },
  {
    id: '5',
    name: 'Ноутбук MacBook',
    category: 'Электроника',
    revenue: 12000000,
    monthlySales: 2400,
    averagePrice: 129990,
    margin: 4800000,
    marketGrowth: 12,
    marketShare: 4,
    profit: 3200000,
    lifecycleStage: 'maturity',
    cannibalizationRisk: 20,
    cannibalizationTargets: ['Смартфон iPhone'],
    salesTrend: 5,
    rating: 4.8,
    reviewsCount: 12000,
    sellersCount: 8,
    topSellers: [
      { name: 'Apple MacBook', marketShare: 40, rating: 4.8 },
      { name: 'Dell XPS', marketShare: 30, rating: 4.7 },
      { name: 'Lenovo ThinkPad', marketShare: 30, rating: 4.6 }
    ],
    keyFeatures: ['Ноутбук', 'Процессор', 'Экран'],
    competitiveAdvantages: ['Качество', 'Дизайн', 'Производительность'],
    priceHistory: [
      { date: '2023-01-01', price: 129990 },
      { date: '2023-02-01', price: 130990 },
      { date: '2023-03-01', price: 131990 }
    ],
    abcxyzCategory: 'BY',
    priceElasticity: 0.9,
    crossSellOpportunities: [
      { relatedProduct: 'Смартфон iPhone', potentialRevenue: 900000 },
      { relatedProduct: 'Умные часы Apple Watch', potentialRevenue: 800000 }
    ],
    seasonalPatterns: [
      { month: 1, demand: 100000, price: 30000 },
      { month: 2, demand: 110000, price: 31000 },
      { month: 3, demand: 120000, price: 32000 },
      { month: 4, demand: 130000, price: 33000 },
      { month: 5, demand: 140000, price: 34000 },
      { month: 6, demand: 150000, price: 35000 },
      { month: 7, demand: 160000, price: 36000 },
      { month: 8, demand: 170000, price: 37000 },
      { month: 9, demand: 180000, price: 38000 },
      { month: 10, demand: 190000, price: 39000 },
      { month: 11, demand: 200000, price: 40000 },
      { month: 12, demand: 210000, price: 41000 }
    ],
    inventoryMetrics: {
      optimalStock: 80000,
      currentStock: 70000,
      reorderPoint: 40000,
      turnoverRate: 3.0
    },
    productAffinity: [
      { relatedProduct: 'Смартфон iPhone', affinityScore: 85 },
      { relatedProduct: 'Умные часы Apple Watch', affinityScore: 75 }
    ]
  },
  {
    id: '6',
    name: 'Умный дом Яндекс',
    category: 'Электроника',
    revenue: 8000000,
    monthlySales: 1600,
    averagePrice: 39990,
    margin: 3200000,
    marketGrowth: 8,
    marketShare: 3,
    profit: 2400000,
    lifecycleStage: 'introduction',
    cannibalizationRisk: 15,
    cannibalizationTargets: [],
    salesTrend: 40,
    rating: 4.5,
    reviewsCount: 5000,
    sellersCount: 6,
    topSellers: [
      { name: 'Яндекс Станция', marketShare: 50, rating: 4.5 },
      { name: 'Google Home', marketShare: 30, rating: 4.4 },
      { name: 'Amazon Echo', marketShare: 20, rating: 4.3 }
    ],
    keyFeatures: ['Умный дом', 'Голосовой помощник', 'Управление'],
    competitiveAdvantages: ['Интеграция', 'Функциональность', 'Цена'],
    priceHistory: [
      { date: '2023-01-01', price: 39990 },
      { date: '2023-02-01', price: 40990 },
      { date: '2023-03-01', price: 41990 }
    ],
    abcxyzCategory: 'BZ',
    priceElasticity: 1.2,
    crossSellOpportunities: [
      { relatedProduct: 'Умные часы Galaxy Watch', potentialRevenue: 800000 },
      { relatedProduct: 'Смартфон Galaxy S', potentialRevenue: 700000 }
    ],
    seasonalPatterns: [
      { month: 1, demand: 100000, price: 30000 },
      { month: 2, demand: 110000, price: 31000 },
      { month: 3, demand: 120000, price: 32000 },
      { month: 4, demand: 130000, price: 33000 },
      { month: 5, demand: 140000, price: 34000 },
      { month: 6, demand: 150000, price: 35000 },
      { month: 7, demand: 160000, price: 36000 },
      { month: 8, demand: 170000, price: 37000 },
      { month: 9, demand: 180000, price: 38000 },
      { month: 10, demand: 190000, price: 39000 },
      { month: 11, demand: 200000, price: 40000 },
      { month: 12, demand: 210000, price: 41000 }
    ],
    inventoryMetrics: {
      optimalStock: 80000,
      currentStock: 70000,
      reorderPoint: 40000,
      turnoverRate: 3.0
    },
    productAffinity: [
      { relatedProduct: 'Умные часы Galaxy Watch', affinityScore: 75 },
      { relatedProduct: 'Смартфон Galaxy S', affinityScore: 65 }
    ]
  }
];

// Store
const useNicheAnalysisStore = create<NicheAnalysisState>()(
  devtools(
    (set, get) => ({
      currentNiche: null,
      selectedProducts: [],
      comparisonNiches: [],
      alerts: [
        { id: '1', type: 'competitor', message: 'Новый конкурент в ТОП-10', active: true, priority: 'high' },
        { id: '2', type: 'price', message: 'Изменение цен лидеров > 10%', active: true, priority: 'medium' },
        { id: '3', type: 'trend', message: 'Рост ниши > 20%', active: true, priority: 'high' }
      ],
      loading: false,
      searchQuery: '',
      savedSearches: ['Платья летние', 'Блузки офисные', 'Джинсы женские'],
      favorites: [],
      watchList: [],
      costBreakdown: {
        costPrice: 500,
        shipping: 50,
        advertising: 12,
        buyouts: 5,
        packaging: 25,
        photoshoot: 15000,
        firstBatch: 100
      },
      goalType: 'profit',
      goalValues: {
        budget: 500000,
        profit: 100000,
        marketShare: 2,
        margin: 40
      },
      notifications: {
        telegram: true,
        email: true,
        push: false
      },

      setCurrentNiche: (niche) => set({ currentNiche: niche }),
      toggleProductSelection: (productId) =>
        set((state) => ({
          selectedProducts: state.selectedProducts.includes(productId)
            ? state.selectedProducts.filter(id => id !== productId)
            : [...state.selectedProducts, productId]
        })),
      addComparisonNiche: (niche) =>
        set((state) => ({
          comparisonNiches: [...state.comparisonNiches, niche]
        })),
      removeComparisonNiche: (nicheId) =>
        set((state) => ({
          comparisonNiches: state.comparisonNiches.filter(n => n.name !== nicheId)
        })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      analyzeNiche: async (query) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
        set({ 
          currentNiche: { ...mockNicheData, name: query },
          comparisonNiches: mockComparisonNiches,
          loading: false 
        });
      },
      toggleAlert: (alertId) =>
        set((state) => ({
          alerts: state.alerts.map(alert =>
            alert.id === alertId ? { ...alert, active: !alert.active } : alert
          )
        })),
      updateCostBreakdown: (costs) =>
        set((state) => ({
          costBreakdown: { ...state.costBreakdown, ...costs }
        })),
      setGoalType: (type) => set({ goalType: type }),
      updateGoalValues: (values) =>
        set((state) => ({
          goalValues: { ...state.goalValues, ...values }
        })),
      addToFavorites: (nicheId) =>
        set((state) => ({
          favorites: state.favorites.includes(nicheId)
            ? state.favorites.filter(id => id !== nicheId)
            : [...state.favorites, nicheId]
        })),
      addToWatchList: (productId) =>
        set((state) => ({
          watchList: state.watchList.includes(productId)
            ? state.watchList.filter(id => id !== productId)
            : [...state.watchList, productId]
        })),
      saveSearch: (query) =>
        set((state) => ({
          savedSearches: state.savedSearches.includes(query)
            ? state.savedSearches
            : [...state.savedSearches, query]
        }))
    }),
    { name: 'niche-analysis-store' }
  )
);

// Utility functions
const formatCurrency = (amount: number): string => {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M₽`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K₽`;
  return `${amount.toFixed(0)}₽`;
};

const getCompetitionColor = (level: number): string => {
  if (level >= 8) return 'red';
  if (level >= 6) return 'yellow';
  return 'green';
};

const getCompetitionText = (level: number): string => {
  if (level >= 8) return 'Высокая 🔴';
  if (level >= 6) return 'Средняя 🟡';
  return 'Низкая 🟢';
};

const getOpportunityColor = (score: number): string => {
  if (score >= 8) return 'green';
  if (score >= 6) return 'yellow';
  return 'red';
};

const getOpportunityEmoji = (score: number): string => {
  if (score >= 8) return '🚀';
  if (score >= 6) return '⚠️';
  return '❌';
};

const getSellerTypeIcon = (type: Product['sellerType']): string => {
  switch (type) {
    case 'brand': return '👑';
    case 'ip': return '🏪';
    case 'ooo': return '🏢';
  }
};

const getSellerTypeText = (type: Product['sellerType']): string => {
  switch (type) {
    case 'brand': return 'Бренд';
    case 'ip': return 'ИП';
    case 'ooo': return 'ООО';
  }
};

// Components
const SearchHeader: React.FC = () => {
  const { analyzeNiche, loading, savedSearches, saveSearch } = useNicheAnalysisStore();
  const [searchInput, setSearchInput] = useState('Платья летние');
  const [searchType, setSearchType] = useState('keyword');
  const [showSavedSearches, setShowSavedSearches] = useState(false);

  const handleAnalyze = async () => {
    await analyzeNiche(searchInput);
    saveSearch(searchInput);
  };

  const handleNewSearch = () => {
    setSearchInput('');
    useNicheAnalysisStore.setState({ currentNiche: null });
  };

  return (
    <Card withBorder mb="md">
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>🔍 АНАЛИЗ НИШИ И ВЫБОР ТОВАРА</Text>
        <Group>
          <Button variant="light" leftSection={<IconRefresh size={16} />} onClick={handleNewSearch}>
            Новый поиск
          </Button>
          <Button variant="subtle" leftSection={<IconBookmark size={16} />}
            onClick={() => setShowSavedSearches(!showSavedSearches)}>
            Сохраненные ({savedSearches.length})
          </Button>
        </Group>
      </Group>
      
      {showSavedSearches && (
        <Group mb="md">
          {savedSearches.map((search, index) => (
            <Badge key={index} variant="light" style={{ cursor: 'pointer' }}
              onClick={() => setSearchInput(search)}>
              {search}
            </Badge>
          ))}
        </Group>
      )}
      
      <Group>
        <TextInput
          placeholder="Платья летние"
          value={searchInput}
          onChange={(event) => setSearchInput(event.currentTarget.value)}
          style={{ flex: 1 }}
          leftSection={<IconSearch size={16} />}
        />
        <Select
          value={searchType}
          onChange={(value) => setSearchType(value || 'keyword')}
          data={[
            { value: 'keyword', label: 'По ключевым словам' },
            { value: 'category', label: 'По категории' },
            { value: 'competitor', label: 'По конкуренту' },
            { value: 'sku', label: 'По артикулу' }
          ]}
          w={200}
        />
        <Button onClick={handleAnalyze} disabled={!searchInput.trim() || loading} loading={loading}>
          Анализировать
        </Button>
      </Group>
    </Card>
  );
};

// Main component
const NicheAnalysisPage: React.FC = () => {
  const { currentNiche, loading } = useNicheAnalysisStore();

  return (
    <Container size="xl" py="md">
      <LoadingOverlay visible={loading} />
      
      <SearchHeader />

      {currentNiche && (
        <Stack gap="md">
          <Card withBorder>
            <Text size="lg" fw={600}>📊 Анализ ниши готов!</Text>
          </Card>
        </Stack>
      )}
    </Container>
  );
};

export default NicheAnalysisPage;
