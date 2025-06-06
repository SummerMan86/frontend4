// stores/operationalStore.ts
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  Alert, 
  KPIMetric, 
  ProblemItem, 
  AIInsight,
  ChartData,
  CompetitorData 
} from '../hooks/useOperationalData';

// Интерфейс состояния
interface OperationalState {
  // Данные
  alerts: Alert[];
  kpis: KPIMetric[];
  problems: ProblemItem[];
  aiInsights: AIInsight[];
  chartData: ChartData[];
  competitors: CompetitorData[];
  
  // Фильтры и настройки
  filters: {
    dateRange: [Date, Date];
    categories: string[];
    severity: ('critical' | 'warning' | 'info')[];
    showMuted: boolean;
  };
  
  // UI состояние
  mutedAlerts: Set<string>;
  expandedAlerts: Set<string>;
  selectedPeriod: 'today' | 'yesterday' | 'week' | 'month';
  refreshInterval: number;
  
  // Настройки пользователя
  preferences: {
    pushNotifications: boolean;
    emailDigest: boolean;
    soundAlerts: 'none' | 'critical' | 'all';
    dashboardLayout: string[];
  };
}

// Интерфейс действий
interface OperationalActions {
  // Управление алертами
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  markAlertAsRead: (id: string) => void;
  muteAlert: (id: string) => void;
  unmuteAlert: (id: string) => void;
  clearMutedAlerts: () => void;
  
  // Управление состоянием UI
  toggleAlertExpanded: (id: string) => void;
  expandAllAlerts: () => void;
  collapseAllAlerts: () => void;
  
  // Управление данными
  updateKPIs: (kpis: KPIMetric[]) => void;
  updateProblems: (problems: ProblemItem[]) => void;
  updateAIInsights: (insights: AIInsight[]) => void;
  updateChartData: (data: ChartData[]) => void;
  updateCompetitors: (competitors: CompetitorData[]) => void;
  
  // Управление фильтрами
  setDateRange: (range: [Date, Date]) => void;
  toggleCategory: (category: string) => void;
  toggleSeverity: (severity: 'critical' | 'warning' | 'info') => void;
  setFilter: <K extends keyof OperationalState['filters']>(
    key: K, 
    value: OperationalState['filters'][K]
  ) => void;
  resetFilters: () => void;
  
  // Управление настройками
  updatePreference: <K extends keyof OperationalState['preferences']>(
    key: K,
    value: OperationalState['preferences'][K]
  ) => void;
  setPeriod: (period: OperationalState['selectedPeriod']) => void;
  setRefreshInterval: (interval: number) => void;
  
  // Утилиты
  getFilteredAlerts: () => Alert[];
  getCriticalCount: () => number;
  getHealthScore: () => number;
  getPerformanceScore: () => number;
}

// Тип полного store
type OperationalStore = OperationalState & OperationalActions;

// Начальное состояние
const initialState: OperationalState = {
  alerts: [],
  kpis: [],
  problems: [],
  aiInsights: [],
  chartData: [],
  competitors: [],
  
  filters: {
    dateRange: [new Date(), new Date()],
    categories: [],
    severity: [],
    showMuted: false
  },
  
  mutedAlerts: new Set(),
  expandedAlerts: new Set(),
  selectedPeriod: 'today',
  refreshInterval: 30000, // 30 секунд
  
  preferences: {
    pushNotifications: true,
    emailDigest: false,
    soundAlerts: 'critical',
    dashboardLayout: ['alerts', 'kpis', 'charts', 'problems']
  }
};

// Создание store
export const useOperationalStore = create<OperationalStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          ...initialState,
          
          // Управление алертами
          setAlerts: (alerts) => set((state) => {
            state.alerts = alerts;
          }),
          
          addAlert: (alert) => set((state) => {
            state.alerts.unshift(alert);
          }),
          updateAlert: (id: string, updates: Partial<Alert>) => set((state) => {
            const index = state.alerts.findIndex((alert: Alert) => alert.id === id);
            if (index !== -1) {
              state.alerts[index] = { ...state.alerts[index], ...updates };
            }
          }),
          markAlertAsRead: (id: string) => set((state) => {
            const alert = state.alerts.find((alert: Alert) => alert.id === id);
            if (alert) {
              alert.isRead = true;
            }
          }),
          
          muteAlert: (id) => set((state) => {
            state.mutedAlerts.add(id);
          }),
          
          unmuteAlert: (id) => set((state) => {
            state.mutedAlerts.delete(id);
          }),
          
          clearMutedAlerts: () => set((state) => {
            state.mutedAlerts.clear();
          }),
          
          // Управление UI
          toggleAlertExpanded: (id) => set((state) => {
            if (state.expandedAlerts.has(id)) {
              state.expandedAlerts.delete(id);
            } else {
              state.expandedAlerts.add(id);
            }
          }),
          
          expandAllAlerts: () => set((state) => {
            state.expandedAlerts = new Set(state.alerts.map((alert: Alert) => alert.id));
          }),
          
          collapseAllAlerts: () => set((state) => {
            state.expandedAlerts.clear();
          }),
          
          // Управление данными
          updateKPIs: (kpis) => set((state) => {
            state.kpis = kpis;
          }),
          
          updateProblems: (problems) => set((state) => {
            state.problems = problems;
          }),
          
          updateAIInsights: (insights) => set((state) => {
            state.aiInsights = insights;
          }),
          
          updateChartData: (data) => set((state) => {
            state.chartData = data;
          }),
          
          updateCompetitors: (competitors) => set((state) => {
            state.competitors = competitors;
          }),
          
          // Управление фильтрами
          setDateRange: (range) => set((state) => {
            state.filters.dateRange = range;
          }),
          
          toggleCategory: (category) => set((state) => {
            const index = state.filters.categories.indexOf(category);
            if (index === -1) {
              state.filters.categories.push(category);
            } else {
              state.filters.categories.splice(index, 1);
            }
          }),
          
          toggleSeverity: (severity) => set((state) => {
            const index = state.filters.severity.indexOf(severity);
            if (index === -1) {
              state.filters.severity.push(severity);
            } else {
              state.filters.severity.splice(index, 1);
            }
          }),
          
          setFilter: (key, value) => set((state) => {
            state.filters[key] = value as any;
          }),
          
          resetFilters: () => set((state) => {
            state.filters = initialState.filters;
          }),
          
          // Управление настройками
          updatePreference: (key, value) => set((state) => {
            state.preferences[key] = value as any;
          }),
          
          setPeriod: (period) => set((state) => {
            state.selectedPeriod = period;
          }),
          
          setRefreshInterval: (interval) => set((state) => {
            state.refreshInterval = interval;
          }),
          
          // Утилиты
          getFilteredAlerts: () => {
            const state = get();
            return state.alerts.filter(alert => {
              // Фильтр по muted
              if (!state.filters.showMuted && state.mutedAlerts.has(alert.id)) {
                return false;
              }
              
              // Фильтр по категориям
              if (state.filters.categories.length > 0 && 
                  !state.filters.categories.includes(alert.category)) {
                return false;
              }
              
              // Фильтр по severity
              if (state.filters.severity.length > 0 && 
                  !state.filters.severity.includes(alert.type)) {
                return false;
              }
              
              return true;
            });
          },
          
          getCriticalCount: () => {
            const state = get();
            return state.alerts.filter(a => 
              a.type === 'critical' && 
              !a.isRead && 
              !state.mutedAlerts.has(a.id)
            ).length;
          },
          
          getHealthScore: () => {
            const state = get();
            if (!state.kpis.length) return 0;
            
            // Расчет общего показателя здоровья на основе KPI
            const scores = state.kpis.map(kpi => {
              const completion = (kpi.value / kpi.target) * 100;
              return Math.min(completion, 100);
            });
            
            return Math.round(
              scores.reduce((a, b) => a + b, 0) / scores.length
            );
          },
          
          getPerformanceScore: () => {
            const state = get();
            const healthScore = get().getHealthScore();
            const criticalAlerts = get().getCriticalCount();
            const problemsCount = state.problems.filter(p => p.severity === 'critical').length;
            
            // Формула для расчета общей производительности
            let score = healthScore;
            score -= criticalAlerts * 5; // -5 баллов за каждый критический алерт
            score -= problemsCount * 3; // -3 балла за каждую критическую проблему
            
            return Math.max(0, Math.min(100, score));
          }
        }))
      ),
      {
        name: 'operational-storage',
        // Сохраняем только настройки и фильтры
        partialize: (state) => ({
          filters: state.filters,
          preferences: state.preferences,
          mutedAlerts: Array.from(state.mutedAlerts),
          selectedPeriod: state.selectedPeriod,
          refreshInterval: state.refreshInterval
        }),
        // Восстанавливаем Set из массива
        onRehydrateStorage: () => (state) => {
          if (state && state.mutedAlerts) {
            state.mutedAlerts = new Set(state.mutedAlerts as any);
          }
        }
      }
    ),
    {
      name: 'operational-store'
    }
  )
);

// Селекторы для оптимизации производительности
export const useAlerts = () => useOperationalStore((state) => state.alerts);
export const useKPIs = () => useOperationalStore((state) => state.kpis);
export const useProblems = () => useOperationalStore((state) => state.problems);
export const useAIInsights = () => useOperationalStore((state) => state.aiInsights);
export const useFilters = () => useOperationalStore((state) => state.filters);
export const usePreferences = () => useOperationalStore((state) => state.preferences);

// Селекторы для вычисляемых значений
export const useFilteredAlerts = () => useOperationalStore((state) => state.getFilteredAlerts());
export const useCriticalCount = () => useOperationalStore((state) => state.getCriticalCount());
export const useHealthScore = () => useOperationalStore((state) => state.getHealthScore());
export const usePerformanceScore = () => useOperationalStore((state) => state.getPerformanceScore());

// Подписка на критические изменения
export const subscribeToAlerts = (callback: (alerts: Alert[]) => void) => {
  return useOperationalStore.subscribe(
    (state) => state.alerts,
    callback
  );
};

// Подписка на изменения KPI
export const subscribeToKPIs = (callback: (kpis: KPIMetric[]) => void) => {
  return useOperationalStore.subscribe(
    (state) => state.kpis,
    callback
  );
};