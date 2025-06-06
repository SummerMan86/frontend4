// utils/operationalUtils.ts
import * as XLSX from 'xlsx';
import { format, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Alert, KPIMetric, ProblemItem, CompetitorData } from '../hooks/useOperationalData';

// Форматирование чисел
export const formatters = {
  // Форматирование валюты
  currency: (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(value);
  },

  // Форматирование процентов
  percent: (value: number, decimals = 1): string => {
    return `${value.toFixed(decimals)}%`;
  },

  // Форматирование больших чисел
  compactNumber: (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  },

  // Форматирование с разделителями
  number: (value: number): string => {
    return new Intl.NumberFormat('ru-RU').format(value);
  },

  // Форматирование даты
  date: (date: Date, formatStr = 'dd.MM.yyyy'): string => {
    return format(date, formatStr, { locale: ru });
  },

  // Форматирование времени
  time: (date: Date): string => {
    return format(date, 'HH:mm', { locale: ru });
  },

  // Форматирование даты и времени
  dateTime: (date: Date): string => {
    return format(date, 'dd.MM.yyyy HH:mm', { locale: ru });
  }
};

// Утилиты для работы со временем
export const timeUtils = {
  // Время назад
  getTimeAgo: (date: Date): string => {
    const now = new Date();
    const minutesAgo = differenceInMinutes(now, date);
    
    if (minutesAgo < 1) return 'только что';
    if (minutesAgo < 60) return `${minutesAgo} мин назад`;
    
    const hoursAgo = differenceInHours(now, date);
    if (hoursAgo < 24) return `${hoursAgo} ч назад`;
    
    const daysAgo = differenceInDays(now, date);
    if (daysAgo < 7) return `${daysAgo} д назад`;
    
    return formatters.date(date);
  },

  // Оставшееся время
  getTimeRemaining: (endDate: Date): string => {
    const now = new Date();
    const hoursRemaining = differenceInHours(endDate, now);
    
    if (hoursRemaining < 0) return 'Просрочено';
    if (hoursRemaining < 24) return `${hoursRemaining} ч`;
    
    const daysRemaining = differenceInDays(endDate, now);
    return `${daysRemaining} дн`;
  },

  // Расчет времени хватит товара
  calculateStockDuration: (currentStock: number, dailySales: number): number => {
    if (dailySales === 0) return Infinity;
    return Math.floor(currentStock / dailySales);
  }
};

// Утилиты для цветов и статусов
export const statusUtils = {
  // Получить цвет для метрики
  getMetricColor: (value: number, threshold: number, inverse = false): string => {
    const ratio = value / threshold;
    
    if (inverse) {
      if (ratio > 1.2) return 'red';
      if (ratio > 1) return 'yellow';
      return 'green';
    }
    
    if (ratio < 0.5) return 'red';
    if (ratio < 0.8) return 'yellow';
    return 'green';
  },

  // Получить статус для KPI
  getKPIStatus: (actual: number, target: number, isPositiveMetric = true): 'good' | 'warning' | 'bad' => {
    const ratio = actual / target;
    
    if (isPositiveMetric) {
      if (ratio >= 1) return 'good';
      if (ratio >= 0.8) return 'warning';
      return 'bad';
    } else {
      if (ratio <= 1) return 'good';
      if (ratio <= 1.2) return 'warning';
      return 'bad';
    }
  },

  // Получить иконку для статуса
  getStatusIcon: (status: 'good' | 'warning' | 'bad'): string => {
    const icons = {
      good: '✅',
      warning: '⚠️',
      bad: '❌'
    };
    return icons[status];
  },

  // Получить цвет для severity
  getSeverityColor: (severity: 'critical' | 'warning' | 'info'): string => {
    const colors = {
      critical: 'red',
      warning: 'yellow',
      info: 'blue'
    };
    return colors[severity];
  }
};

// Экспорт данных в Excel
export const exportToExcel = {
  // Экспорт полного отчета
  exportOperationalReport: (data: {
    date: Date;
    kpis: KPIMetric[];
    alerts: Alert[];
    problems: ProblemItem[];
    competitors?: CompetitorData[];
  }) => {
    const wb = XLSX.utils.book_new();
    
    // Лист KPI
    const kpiData = data.kpis.map(kpi => ({
      'Показатель': kpi.label,
      'Значение': kpi.value,
      'План': kpi.target,
      'Выполнение %': formatters.percent((kpi.value / kpi.target) * 100),
      'Статус': kpi.status === 'good' ? 'Хорошо' : 
                kpi.status === 'warning' ? 'Внимание' : 'Плохо',
      'Тренд': kpi.trend === 'up' ? '↑' : 
               kpi.trend === 'down' ? '↓' : '→'
    }));
    
    const kpiSheet = XLSX.utils.json_to_sheet(kpiData);
    XLSX.utils.book_append_sheet(wb, kpiSheet, 'KPI');
    
    // Лист Алертов
    const alertData = data.alerts.map(alert => ({
      'Тип': alert.type === 'critical' ? 'Критический' :
             alert.type === 'warning' ? 'Предупреждение' : 'Информация',
      'Категория': getCategoryName(alert.category),
      'Заголовок': alert.title,
      'Описание': alert.description,
      'Текущее значение': alert.metric?.current,
      'Пороговое значение': alert.metric?.threshold,
      'Время': formatters.dateTime(alert.timestamp),
      'Прочитано': alert.isRead ? 'Да' : 'Нет'
    }));
    
    const alertSheet = XLSX.utils.json_to_sheet(alertData);
    XLSX.utils.book_append_sheet(wb, alertSheet, 'Алерты');
    
    // Лист Проблем
    const problemData = data.problems.map(problem => ({
      'Товар': problem.product,
      'Артикул': problem.sku,
      'Тип проблемы': getProblemTypeName(problem.type),
      'Важность': problem.severity === 'critical' ? 'Критическая' :
                  problem.severity === 'warning' ? 'Средняя' : 'Низкая',
      'Описание': problem.description,
      'Метрика': problem.metric,
      'Рекомендуемое действие': problem.action
    }));
    
    const problemSheet = XLSX.utils.json_to_sheet(problemData);
    XLSX.utils.book_append_sheet(wb, problemSheet, 'Проблемы');
    
    // Лист Конкурентов
    if (data.competitors) {
      const competitorData = data.competitors.map(comp => ({
        'Конкурент': comp.name,
        'Продажи (шт)': comp.sales,
        'Средняя цена': formatters.currency(comp.avgPrice),
        'Рейтинг': comp.rating,
        'Позиция': comp.position,
        'Изменение цены': comp.changes.priceChange ? 
          `${comp.changes.priceChange > 0 ? '+' : ''}${comp.changes.priceChange}%` : '-',
        'Новые SKU': comp.changes.newSKUs || 0,
        'Расходы на рекламу': comp.changes.adSpend ? 
          `${comp.changes.adSpend > 0 ? '+' : ''}${comp.changes.adSpend}%` : '-'
      }));
      
      const competitorSheet = XLSX.utils.json_to_sheet(competitorData);
      XLSX.utils.book_append_sheet(wb, competitorSheet, 'Конкуренты');
    }
    
    // Сохранение файла
    const fileName = `operational_report_${formatters.date(data.date, 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  },

  // Экспорт алертов
  exportAlerts: (alerts: Alert[]) => {
    const data = alerts.map(alert => ({
      'ID': alert.id,
      'Тип': alert.type,
      'Категория': getCategoryName(alert.category),
      'Заголовок': alert.title,
      'Описание': alert.description,
      'Время': formatters.dateTime(alert.timestamp),
      'Прочитано': alert.isRead ? 'Да' : 'Нет',
      'Затронутые товары': alert.affectedItems.map(item => item.name).join(', ')
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Алерты');
    
    XLSX.writeFile(wb, `alerts_${formatters.date(new Date(), 'yyyy-MM-dd')}.xlsx`);
  }
};

// Вспомогательные функции для названий
function getCategoryName(category: string): string {
  const names = {
    rating: 'Рейтинг',
    stock: 'Склад',
    budget: 'Бюджет',
    position: 'Позиции',
    competitor: 'Конкуренты'
  };
  return names[category] || category;
}

function getProblemTypeName(type: string): string {
  const names = {
    stock: 'Недостаток товара',
    rating: 'Низкий рейтинг',
    price: 'Проблема с ценой',
    position: 'Падение позиций'
  };
  return names[type] || type;
}

// Расчеты для метрик
export const calculations = {
  // Расчет процента выполнения
  calculateCompletion: (actual: number, target: number): number => {
    if (target === 0) return 0;
    return Math.round((actual / target) * 100);
  },

  // Расчет изменения в процентах
  calculatePercentChange: (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  },

  // Расчет скользящего среднего
  calculateMovingAverage: (data: number[], period: number): number[] => {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(data[i]);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        result.push(sum / period);
      }
    }
    return result;
  },

  // Расчет прогноза
  calculateForecast: (historicalData: number[], daysAhead: number): number[] => {
    // Простой линейный прогноз
    const n = historicalData.length;
    const sumX = (n * (n + 1)) / 2;
    const sumY = historicalData.reduce((a, b) => a + b, 0);
    const sumXY = historicalData.reduce((acc, y, x) => acc + (x + 1) * y, 0);
    const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const forecast: number[] = [];
    for (let i = 1; i <= daysAhead; i++) {
      forecast.push(intercept + slope * (n + i));
    }
    
    return forecast;
  }
};

// Валидация данных
export const validation = {
  // Проверка критических значений
  checkCriticalThresholds: (value: number, thresholds: {
    critical: number;
    warning: number;
  }, inverse = false): 'critical' | 'warning' | 'normal' => {
    if (inverse) {
      if (value > thresholds.critical) return 'critical';
      if (value > thresholds.warning) return 'warning';
      return 'normal';
    } else {
      if (value < thresholds.critical) return 'critical';
      if (value < thresholds.warning) return 'warning';
      return 'normal';
    }
  },

  // Проверка аномалий
  detectAnomalies: (data: number[], threshold = 2): number[] => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(
      data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length
    );
    
    return data.map((value, index) => {
      const zScore = Math.abs((value - mean) / stdDev);
      return zScore > threshold ? index : -1;
    }).filter(index => index !== -1);
  }
};

// Группировка и агрегация данных
export const aggregation = {
  // Группировка по категориям
  groupByCategory: <T extends { category: string }>(items: T[]): Record<string, T[]> => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  },

  // Суммирование по полю
  sumByField: <T>(items: T[], field: keyof T): number => {
    return items.reduce((sum, item) => {
      const value = item[field];
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
  },

  // Среднее значение
  averageByField: <T>(items: T[], field: keyof T): number => {
    const sum = aggregation.sumByField(items, field);
    return items.length > 0 ? sum / items.length : 0;
  }
};