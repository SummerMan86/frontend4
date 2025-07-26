import React, { useState, useCallback, useMemo, ReactNode } from 'react';
import {
  Stack,
  Grid,
  Card,
  Group,
  Text,
  Collapse,
  ActionIcon,
  Divider,
  Box,
  ThemeIcon,
  Progress,
  Badge,
  Loader,
  Alert
} from '@mantine/core';
import {
  IconChevronRight,
  IconX,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertCircle
} from '@tabler/icons-react';
import ComplexKPI, { ComplexKPIProps } from './ComplexKPI';

/**
 * Базовый интерфейс для данных детализации
 */
export interface DetailData {
  id: string;
  [key: string]: any;
}

/**
 * Интерфейс для конфигурации детализации
 */
export interface DetailConfig<T extends DetailData = DetailData> {
  /** Уникальный идентификатор */
  id: string;
  /** Компонент для рендеринга детализации */
  component: React.ComponentType<DetailRendererProps<T>>;
  /** Селектор данных для детализации */
  dataSelector?: (data: any) => T;
  /** Асинхронная загрузка данных */
  dataLoader?: () => Promise<T>;
  /** Заголовок детализации */
  title?: string;
  /** Описание детализации */
  description?: string;
  /** Настройки анимации */
  animation?: {
    duration?: number;
    timingFunction?: string;
  };
}

/**
 * Пропсы для компонента детализации
 */
export interface DetailRendererProps<T extends DetailData = DetailData> {
  /** Данные для отображения */
  data: T;
  /** Функция закрытия детализации */
  onClose: () => void;
  /** Состояние загрузки */
  loading?: boolean;
  /** Ошибка загрузки */
  error?: string | null;
}

/**
 * Интерфейс для расширенного KPI с детализацией
 */
export interface EnhancedKPIData<T extends DetailData = DetailData> extends ComplexKPIProps {
  /** Уникальный идентификатор */
  id: string;
  /** Конфигурация детализации */
  detailConfig?: DetailConfig<T>;
  /** Данные для детализации */
  detailData?: T;
  /** Включить детализацию */
  enableDetail?: boolean;
}

/**
 * Пропсы для основного компонента
 */
export interface EnhancedKPIDetailRendererProps {
  /** Массив KPI данных */
  kpiData: EnhancedKPIData<any>[];
  /** Количество карточек в ряду */
  cardsPerRow?: number;
  /** Глобальные настройки анимации */
  animationSettings?: {
    duration?: number;
    timingFunction?: string;
  };
  /** Дополнительные стили */
  containerStyle?: React.CSSProperties;
  /** Обработчик ошибок */
  onError?: (error: Error, kpiId: string) => void;
  /** Обработчик успешной загрузки */
  onDetailLoad?: (kpiId: string, data: DetailData) => void;
}

/**
 * Хук для управления состоянием детализации
 */
const useDetailState = () => {
  const [expandedKpiId, setExpandedKpiId] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, string | null>>({});
  const [detailDataCache, setDetailDataCache] = useState<Record<string, DetailData>>({});

  const toggleExpanded = useCallback((kpiId: string) => {
    setExpandedKpiId(prev => prev === kpiId ? null : kpiId);
  }, []);

  const closeDetail = useCallback(() => {
    setExpandedKpiId(null);
  }, []);

  const setLoading = useCallback((kpiId: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [kpiId]: loading }));
  }, []);

  const setError = useCallback((kpiId: string, error: string | null) => {
    setErrorStates(prev => ({ ...prev, [kpiId]: error }));
  }, []);

  const setCachedData = useCallback((kpiId: string, data: DetailData) => {
    setDetailDataCache(prev => ({ ...prev, [kpiId]: data }));
  }, []);

  return {
    expandedKpiId,
    loadingStates,
    errorStates,
    detailDataCache,
    toggleExpanded,
    closeDetail,
    setLoading,
    setError,
    setCachedData
  };
};

/**
 * Компонент KPI карточки с поддержкой детализации
 */
const EnhancedKPICard: React.FC<{
  kpi: EnhancedKPIData<any>;
  isExpanded: boolean;
  onToggle: () => void;
  animationDuration: number;
}> = ({ kpi, isExpanded, onToggle, animationDuration }) => {
  const handleAction = useCallback(() => {
    if (kpi.enableDetail) {
      onToggle();
    }
  }, [kpi.enableDetail, onToggle]);

  const action = useMemo(() => {
    if (!kpi.enableDetail) return kpi.action;
    
    return {
      label: 'Детали',
      onClick: handleAction,
      icon: (
        <IconChevronRight 
          size={16} 
          style={{ 
            transform: isExpanded ? 'rotate(90deg)' : 'none',
            transition: `transform ${animationDuration}ms ease-in-out`
          }}
        />
      )
    };
  }, [kpi.enableDetail, kpi.action, handleAction, isExpanded, animationDuration]);

  return (
    <ComplexKPI
      {...kpi}
      action={action}
      data-testid={`enhanced-kpi-card-${kpi.id}`}
    />
  );
};

/**
 * Компонент для отображения детализации
 */
const DetailRenderer: React.FC<{
  kpi: EnhancedKPIData<any>;
  data: DetailData | undefined;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  animationDuration: number;
}> = ({ kpi, data, loading, error, onClose, animationDuration }) => {
  const { detailConfig } = kpi;
  
  if (!detailConfig) return null;

  const renderContent = () => {
    if (loading) {
      return (
        <Group justify="center" p="xl">
          <Loader size="md" />
          <Text>Загрузка данных...</Text>
        </Group>
      );
    }

    if (error) {
      return (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Ошибка загрузки" 
          color="red"
          variant="light"
        >
          {error}
        </Alert>
      );
    }

    if (!data) {
      return (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Нет данных" 
          color="yellow"
          variant="light"
        >
          Данные для детализации недоступны
        </Alert>
      );
    }

    const DetailComponent = detailConfig.component;
    return (
      <DetailComponent 
        data={data} 
        onClose={onClose}
        loading={loading}
        error={error}
      />
    );
  };

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      style={{ position: 'relative' }}
      data-testid={`detail-renderer-${kpi.id}`}
    >
      {detailConfig.title && (
        <>
          <Group justify="space-between" mb="md">
            <div>
              <Text size="lg" fw={600}>{detailConfig.title}</Text>
              {detailConfig.description && (
                <Text size="sm" c="dimmed">{detailConfig.description}</Text>
              )}
            </div>
          </Group>
          <Divider mb="md" />
        </>
      )}
      
      {renderContent()}
      
      <ActionIcon
        variant="subtle"
        size="sm"
        onClick={onClose}
        aria-label="Закрыть детализацию"
        style={{
          position: 'absolute',
          top: 16,
          right: 16
        }}
        data-testid={`close-detail-${kpi.id}`}
      >
        <IconX size={14} />
      </ActionIcon>
    </Card>
  );
};

/**
 * Основной компонент для отображения KPI с детализацией
 */
export const EnhancedKPIDetailRenderer: React.FC<EnhancedKPIDetailRendererProps> = ({
  kpiData,
  cardsPerRow = 4,
  animationSettings = { duration: 300, timingFunction: 'ease-in-out' },
  containerStyle,
  onError,
  onDetailLoad
}) => {
  const {
    expandedKpiId,
    loadingStates,
    errorStates,
    detailDataCache,
    toggleExpanded,
    closeDetail,
    setLoading,
    setError,
    setCachedData
  } = useDetailState();

  // Вычисляем span для Grid
  const gridSpan = useMemo(() => {
    const validCardsPerRow = [1, 2, 3, 4, 6].includes(cardsPerRow) ? cardsPerRow : 4;
    return 12 / validCardsPerRow;
  }, [cardsPerRow]);

  // Обработчик переключения детализации
  const handleToggleDetail = useCallback(async (kpiId: string) => {
    const kpi = kpiData.find(k => k.id === kpiId);
    if (!kpi?.detailConfig) return;

    // Если уже раскрыто, закрываем
    if (expandedKpiId === kpiId) {
      closeDetail();
      return;
    }

    // Открываем детализацию
    toggleExpanded(kpiId);

    // Если данные уже есть в кэше, не загружаем заново
    if (detailDataCache[kpiId]) {
      return;
    }

    // Если есть статические данные, используем их
    if (kpi.detailData) {
      setCachedData(kpiId, kpi.detailData);
      return;
    }

    // Если есть селектор данных, используем его
    if (kpi.detailConfig.dataSelector) {
      try {
        const data = kpi.detailConfig.dataSelector(kpi);
        setCachedData(kpiId, data);
        onDetailLoad?.(kpiId, data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка обработки данных';
        setError(kpiId, errorMessage);
        onError?.(error instanceof Error ? error : new Error(errorMessage), kpiId);
      }
      return;
    }

    // Если есть асинхронный загрузчик, используем его
    if (kpi.detailConfig.dataLoader) {
      try {
        setLoading(kpiId, true);
        setError(kpiId, null);
        
        const data = await kpi.detailConfig.dataLoader();
        setCachedData(kpiId, data);
        onDetailLoad?.(kpiId, data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки данных';
        setError(kpiId, errorMessage);
        onError?.(error instanceof Error ? error : new Error(errorMessage), kpiId);
      } finally {
        setLoading(kpiId, false);
      }
    }
  }, [kpiData, expandedKpiId, detailDataCache, toggleExpanded, closeDetail, setCachedData, setLoading, setError, onDetailLoad, onError]);

  // Находим раскрытую KPI
  const expandedKpi = useMemo(() => {
    return expandedKpiId ? kpiData.find(k => k.id === expandedKpiId) : null;
  }, [expandedKpiId, kpiData]);

  return (
    <Stack gap="md" style={containerStyle} data-testid="enhanced-kpi-detail-renderer">
      {/* Сетка KPI карточек */}
      <Grid>
        {kpiData.map((kpi) => (
          <Grid.Col key={kpi.id} span={gridSpan}>
            <EnhancedKPICard
              kpi={kpi}
              isExpanded={expandedKpiId === kpi.id}
              onToggle={() => handleToggleDetail(kpi.id)}
              animationDuration={animationSettings.duration || 300}
            />
          </Grid.Col>
        ))}
      </Grid>
      
      {/* Детализация */}
      <Collapse 
        in={!!expandedKpiId && !!expandedKpi}
        transitionDuration={animationSettings.duration || 300}
        transitionTimingFunction={animationSettings.timingFunction || 'ease-in-out'}
      >
        {expandedKpi && (
          <Box mb="xl">
            <DetailRenderer
              kpi={expandedKpi}
              data={detailDataCache[expandedKpi.id]}
              loading={loadingStates[expandedKpi.id] || false}
              error={errorStates[expandedKpi.id] || null}
              onClose={closeDetail}
              animationDuration={animationSettings.duration || 300}
            />
          </Box>
        )}
      </Collapse>
    </Stack>
  );
};

// Экспорт по умолчанию
export default EnhancedKPIDetailRenderer;

/**
 * Утилиты для создания конфигураций детализации
 */
export const createDetailConfig = <T extends DetailData = DetailData>(
  config: DetailConfig<T>
): DetailConfig<T> => config;

export const createKPIWithDetail = <T extends DetailData = DetailData>(
  kpiProps: Omit<ComplexKPIProps, 'action'>,
  detailConfig: DetailConfig<T>,
  options: {
    id: string;
    detailData?: T;
    enableDetail?: boolean;
  }
): EnhancedKPIData<T> => ({
  ...kpiProps,
  id: options.id,
  detailConfig,
  detailData: options.detailData,
  enableDetail: options.enableDetail ?? true
});