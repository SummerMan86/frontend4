// hooks/useOperationalData.ts
import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { useCubeQuery } from '@cubejs-client/react';

// Типы данных
export interface OperationalData {
  healthScore: number;
  alerts: Alert[];
  kpis: KPIMetric[];
  aiInsights: AIInsight[];
  charts: ChartData[];
  problems: ProblemItem[];
  competitors: CompetitorData[];
  planVsActual: PlanVsActualData[];
}

export interface Alert {
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
  actions: AlertAction[];
  timestamp: Date;
  isRead: boolean;
  affectedItems: AffectedItem[];
}

export interface AlertAction {
  label: string;
  action: () => void;
  variant: 'filled' | 'light' | 'subtle';
}

export interface AffectedItem {
  id: string;
  name: string;
  sku: string;
  rating?: number;
  stock?: number;
  price?: number;
}

export interface KPIMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  target: number;
  format: 'currency' | 'percent' | 'number';
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'bad';
}

export interface AIInsight {
  id: string;
  type: 'prediction' | 'anomaly' | 'trend' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  suggestedAction?: string;
}

export interface ChartData {
  time: string;
  sales: number;
  orders: number;
  returns: number;
  conversion?: number;
}

export interface ProblemItem {
  id: string;
  type: 'stock' | 'rating' | 'price' | 'position';
  severity: 'critical' | 'warning' | 'info';
  product: string;
  sku: string;
  description: string;
  metric: string;
  action: string;
}

export interface CompetitorData {
  id: string;
  name: string;
  sales: number;
  avgPrice: number;
  rating: number;
  position: number;
  changes: {
    priceChange?: number;
    newSKUs?: number;
    adSpend?: number;
  };
}

export interface PlanVsActualData {
  metric: string;
  plan: number;
  actual: number;
  completion: number;
  status: 'good' | 'warning' | 'bad';
}

// Основной хук для получения данных оперативного контроля
export const useOperationalData = (dateRange?: [Date, Date]) => {
  const [data, setData] = useState<OperationalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Для реального приложения - использовать Cube.js
  const { resultSet, isLoading, error: cubeError } = useCubeQuery({
    measures: [
      'Orders.totalAmount',
      'Orders.count',
      'Products.averageRating',
      'Inventory.daysRemaining',
      'Advertising.spend',
      'Advertising.roas'
    ],
    timeDimensions: [
      {
        dimension: 'Orders.createdAt',
        dateRange: dateRange?.map(d => d?.toISOString().split('T')[0]) || ['2025-01-01', '2025-01-31'],
        granularity: 'hour'
      }
    ],
    filters: [
      {
        member: 'Products.rating',
        operator: 'lt',
        values: ['4.0']
      }
    ]
  });

  // Имитация загрузки данных (для демо)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Имитация задержки API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // В реальном приложении здесь будут вызовы API
        const mockData: OperationalData = {
          healthScore: calculateHealthScore(),
          alerts: await fetchAlerts(),
          kpis: await fetchKPIs(),
          aiInsights: await fetchAIInsights(),
          charts: await fetchChartData(),
          problems: await fetchProblems(),
          competitors: await fetchCompetitors(),
          planVsActual: await fetchPlanVsActual()
        };
        
        setData(mockData);
      } catch (err) {
        setError(err as Error);
        notifications.show({
          title: 'Ошибка загрузки данных',
          message: 'Не удалось загрузить данные оперативного контроля',
          color: 'red'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const refetch = useCallback(() => {
    const fetchData = async () => {
      // Реализация обновления данных
    };
    fetchData();
  }, [dateRange]);

  return { data, loading, error, refetch };
};

// Хук для работы с алертами и уведомлениями
export const useAlertNotifications = (alerts: Alert[]) => {
  useEffect(() => {
    // Показываем уведомления для новых критических алертов
    alerts
      .filter(alert => alert.type === 'critical' && !alert.isRead)
      .forEach(alert => {
        notifications.show({
          id: alert.id,
          withCloseButton: true,
          autoClose: false,
          title: alert.title,
          message: alert.description,
          color: 'red',
          withBorder: true,
        });
      });
  }, [alerts]);
};

// Хук для WebSocket подключения
export const useOperationalWebSocket = (onUpdate: (data: any) => void) => {
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Обработка различных типов сообщений
        switch (data.type) {
          case 'alert':
            handleAlertUpdate(data.payload);
            break;
          case 'metric_update':
            handleMetricUpdate(data.payload);
            break;
          case 'critical_event':
            handleCriticalEvent(data.payload);
            break;
          default:
            onUpdate(data);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      notifications.show({
        title: 'Ошибка подключения',
        message: 'Потеряно соединение с сервером обновлений',
        color: 'red'
      });
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Попытка переподключения через 5 секунд
      setTimeout(() => {
        useOperationalWebSocket(onUpdate);
      }, 5000);
    };
    
    return () => {
      ws.close();
    };
  }, [onUpdate]);
};

// Вспомогательные функции для имитации данных
async function fetchAlerts(): Promise<Alert[]> {
  return [
    {
      id: '1',
      type: 'critical',
      category: 'rating',
      title: 'Критически низкий рейтинг',
      description: 'Рейтинг товара "Кроссовки Nike Air Max" упал до 3.2',
      metric: {
        current: 3.2,
        threshold: 4.0,
        trend: 'down'
      },
      actions: [
        { label: 'Ответить на отзыв', action: () => console.log('Открыть форму ответа'), variant: 'filled' },
        { label: 'Все отзывы', action: () => console.log('Перейти к отзывам'), variant: 'light' }
      ],
      timestamp: new Date(),
      isRead: false,
      affectedItems: [
        { id: '12345678', name: 'Кроссовки Nike Air Max', sku: 'NK-AM-001', rating: 3.2 }
      ]
    }
  ];
}

async function fetchKPIs(): Promise<KPIMetric[]> {
  return [
    {
      id: 'sales',
      label: 'Продажи сегодня',
      value: 1344657,
      previousValue: 1200000,
      target: 1300000,
      format: 'currency',
      trend: 'up',
      status: 'good'
    },
    {
      id: 'revenue',
      label: 'К перечислению',
      value: 609772,
      previousValue: 640000,
      target: 650000,
      format: 'currency',
      trend: 'down',
      status: 'warning'
    }
  ];
}

async function fetchAIInsights(): Promise<AIInsight[]> {
  return [
    {
      id: '1',
      type: 'prediction',
      title: 'Прогноз выручки на конец дня',
      description: '1 520 000 ₽ (+13% к плану)',
      confidence: 0.87,
      impact: 'high',
      suggestedAction: 'Увеличить лимиты на рекламу'
    }
  ];
}

async function fetchChartData(): Promise<ChartData[]> {
  const data: ChartData[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 3600000);
    data.push({
      time: hour.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      sales: Math.floor(Math.random() * 100000 + 50000),
      orders: Math.floor(Math.random() * 50 + 20),
      returns: Math.floor(Math.random() * 5),
      conversion: 2.5 + Math.random() * 0.5
    });
  }
  
  return data;
}

async function fetchProblems(): Promise<ProblemItem[]> {
  return [
    {
      id: '1',
      type: 'stock',
      severity: 'critical',
      product: 'Кроссовки Nike Air Max',
      sku: 'NK-AM-001',
      description: 'Осталось 5 шт на складе Казань',
      metric: 'Хватит на 2 дня',
      action: 'Создать поставку'
    }
  ];
}

async function fetchCompetitors(): Promise<CompetitorData[]> {
  return [
    {
      id: '1',
      name: 'SportMaster',
      sales: 250,
      avgPrice: 1750,
      rating: 4.9,
      position: 1,
      changes: {
        priceChange: -5,
        newSKUs: 3,
        adSpend: 15
      }
    }
  ];
}

async function fetchPlanVsActual(): Promise<PlanVsActualData[]> {
  return [
    {
      metric: 'Продажи (₽)',
      plan: 1200000,
      actual: 1344657,
      completion: 112,
      status: 'good'
    }
  ];
}

function calculateHealthScore(): number {
  // Логика расчета общего показателя здоровья бизнеса
  return 78;
}

// Обработчики событий WebSocket
function handleAlertUpdate(payload: any) {
  notifications.show({
    title: 'Новое предупреждение',
    message: payload.message,
    color: payload.severity === 'critical' ? 'red' : 'yellow'
  });
}

function handleMetricUpdate(payload: any) {
  // Обновление метрик в реальном времени
  console.log('Metric update:', payload);
}

function handleCriticalEvent(payload: any) {
  notifications.show({
    title: '⚠️ Критическое событие',
    message: payload.message,
    color: 'red',
    autoClose: false,
    withBorder: true
  });
}