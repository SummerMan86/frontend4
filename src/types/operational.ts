// types/operational.ts
// Общие типы для оперативного контроля Wildberries

// Базовые типы
export type DateRange = [Date, Date];
export type Period = 'today' | 'yesterday' | 'week' | 'month' | 'custom';
export type Severity = 'critical' | 'warning' | 'info';
export type Status = 'good' | 'warning' | 'bad';
export type Trend = 'up' | 'down' | 'stable';
export type MetricFormat = 'currency' | 'percent' | 'number';

// Типы для алертов
export interface Alert {
  id: string;
  type: Severity;
  category: AlertCategory;
  title: string;
  description: string;
  metric?: AlertMetric;
  actions: AlertAction[];
  timestamp: Date;
  isRead: boolean;
  isMuted?: boolean;
  affectedItems: AffectedItem[];
  priority?: number;
}

export type AlertCategory = 
  | 'rating'      // Проблемы с рейтингом
  | 'stock'       // Проблемы со складом
  | 'budget'      // Превышение бюджета
  | 'position'    // Падение позиций
  | 'competitor'  // Активность конкурентов
  | 'price'       // Проблемы с ценой
  | 'quality'     // Проблемы с качеством
  | 'delivery';   // Проблемы с доставкой

export interface AlertMetric {
  current: number;
  threshold: number;
  unit?: string;
  trend: Trend;
  changePercent?: number;
}

export interface AlertAction {
  id?: string;
  label: string;
  action: () => void | Promise<void>;
  variant: 'filled' | 'light' | 'subtle';
  icon?: string;
  confirmRequired?: boolean;
  confirmMessage?: string;
}

export interface AffectedItem {
  id: string;
  name: string;
  sku: string;
  nmId?: number;
  category?: string;
  brand?: string;
  rating?: number;
  stock?: number;
  price?: number;
  image?: string;
}

// Типы для KPI
export interface KPIMetric {
  id: string;
  label: string;
  description?: string;
  value: number;
  previousValue: number;
  target: number;
  format: MetricFormat;
  trend: Trend;
  status: Status;
  icon?: React.ComponentType<any>;
  sparklineData?: number[];
  lastUpdated?: Date;
}

export interface KPIGroup {
  id: string;
  title: string;
  metrics: KPIMetric[];
  priority: number;
}

// Типы для AI инсайтов
export interface AIInsight {
  id: string;
  type: AIInsightType;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  suggestedAction?: string;
  relatedData?: any;
  createdAt: Date;
}

export type AIInsightType = 
  | 'prediction'  // Прогноз
  | 'anomaly'     // Аномалия
  | 'trend'       // Тренд
  | 'risk'        // Риск
  | 'opportunity' // Возможность
  | 'recommendation'; // Рекомендация

// Типы для графиков
export interface ChartData {
  time: string;
  sales: number;
  orders: number;
  returns: number;
  conversion?: number;
  revenue?: number;
  profit?: number;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'funnel' | 'scatter' | 'heatmap';
  title: string;
  metrics: string[];
  period: Period;
  aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
}

// Типы для проблем
export interface ProblemItem {
  id: string;
  type: ProblemType;
  severity: Severity;
  product: string;
  sku: string;
  nmId?: number;
  description: string;
  metric: string;
  action: string;
  detectedAt: Date;
  resolvedAt?: Date;
  assignedTo?: string;
}

export type ProblemType = 
  | 'stock'       // Недостаток товара
  | 'rating'      // Низкий рейтинг
  | 'price'       // Проблема с ценой
  | 'position'    // Падение позиций
  | 'quality'     // Качество товара
  | 'delivery'    // Доставка
  | 'returns';    // Возвраты

// Типы для конкурентов
export interface CompetitorData {
  id: string;
  name: string;
  logo?: string;
  sales: number;
  avgPrice: number;
  rating: number;
  position: number;
  marketShare?: number;
  changes: CompetitorChanges;
  products?: CompetitorProduct[];
  lastUpdated: Date;
}

export interface CompetitorChanges {
  priceChange?: number;
  salesChange?: number;
  positionChange?: number;
  newSKUs?: number;
  removedSKUs?: number;
  adSpend?: number;
}

export interface CompetitorProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  rating: number;
  sales: number;
  position: number;
}

// Типы для планирования
export interface PlanVsActualData {
  id?: string;
  metric: string;
  plan: number;
  actual: number;
  completion: number;
  status: Status;
  period: Period;
  department?: string;
}

// Типы для складов
export interface WarehouseStock {
  warehouseId: string;
  warehouseName: string;
  region: string;
  products: WarehouseProduct[];
  totalValue: number;
  utilizationPercent: number;
  lastUpdated: Date;
}

export interface WarehouseProduct {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  reserved: number;
  available: number;
  daysRemaining: number;
  turnoverRate: number;
}

// Типы для рекламы
export interface AdvertisingMetrics {
  campaignId: string;
  campaignName: string;
  type: 'auto' | 'manual' | 'auction';
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
  conversions: number;
  period: DateRange;
}

// Типы для отзывов
export interface ProductFeedback {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  rating: number;
  text: string;
  photos?: string[];
  createdAt: Date;
  isAnswered: boolean;
  answer?: FeedbackAnswer;
  sentiment?: 'positive' | 'negative' | 'neutral';
  keywords?: string[];
}

export interface FeedbackAnswer {
  text: string;
  createdAt: Date;
  author: string;
}

// Типы для финансов
export interface FinancialMetrics {
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  commission: number;
  logistics: number;
  advertising: number;
  returns: number;
  penalties: number;
  period: Period;
}

// Типы для заказов
export interface OrderMetrics {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  avgOrderValue: number;
  conversionRate: number;
  fulfillmentRate: number;
  returnRate: number;
}

// Типы для настроек
export interface UserPreferences {
  dashboardLayout: string[];
  defaultPeriod: Period;
  notifications: NotificationSettings;
  display: DisplaySettings;
  alerts: AlertSettings;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  soundEnabled: boolean;
  criticalOnly: boolean;
  quietHours?: {
    start: string;
    end: string;
  };
}

export interface DisplaySettings {
  theme: 'light' | 'dark' | 'auto';
  compactMode: boolean;
  showTrends: boolean;
  showSparklines: boolean;
  animationsEnabled: boolean;
  language: string;
}

export interface AlertSettings {
  autoMuteAfter?: number;
  groupSimilar: boolean;
  showResolved: boolean;
  priorities: {
    [key in AlertCategory]?: number;
  };
}

// Типы для фильтров
export interface FilterState {
  dateRange: DateRange;
  categories: string[];
  brands: string[];
  warehouses: string[];
  severity: Severity[];
  status: Status[];
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Типы для экспорта
export interface ExportConfig {
  format: 'xlsx' | 'csv' | 'pdf';
  includeCharts: boolean;
  dateRange: DateRange;
  sections: ExportSection[];
  language: 'ru' | 'en';
}

export interface ExportSection {
  id: string;
  title: string;
  included: boolean;
  filters?: FilterState;
}

// Типы для WebSocket
export interface WSMessage {
  type: WSMessageType;
  payload: any;
  timestamp: Date;
  source?: string;
}

export type WSMessageType = 
  | 'alert'
  | 'metric_update'
  | 'critical_event'
  | 'competitor_update'
  | 'stock_update'
  | 'order_created'
  | 'feedback_received';

// Типы для API ответов
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  metadata?: {
    page?: number;
    pageSize?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Утилитарные типы
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ValueOf<T> = T[keyof T];

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

// Типы для действий
export interface Action<T = any> {
  type: string;
  payload?: T;
  meta?: any;
  error?: boolean;
}

// Типы для валидации
export interface ValidationRule {
  field: string;
  rules: Array<{
    type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
    value?: any;
    message: string;
    validator?: (value: any) => boolean;
  }>;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string[]>;
}