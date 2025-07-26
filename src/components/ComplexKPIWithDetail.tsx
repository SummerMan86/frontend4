import React, { useMemo, useState, useCallback } from 'react';
import {
  Card,
  Text,
  Group,
  ThemeIcon,
  Button,
  Progress,
  Box,
  useMantineTheme,
  Transition,
  Collapse,
  Stack,
  Divider,
  ActionIcon,
  Loader,
  Alert
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconChevronDown,
  IconChevronUp,
  IconX,
  IconAlertCircle
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import { ComplexKPIProps, KPIStatus, KPIAction, MiniChartProps, KPIInteractionHandlers } from './ComplexKPI';

/**
 * Интерфейс для данных детализации
 */
export interface DetailData {
  id: string;
  [key: string]: any;
}

/**
 * Интерфейс для пропсов компонента детализации
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
 * Конфигурация детализации
 */
export interface DetailConfig<T extends DetailData = DetailData> {
  /** Уникальный идентификатор */
  id: string;
  /** Компонент для рендеринга детализации */
  component: React.ComponentType<DetailRendererProps<T>>;
  /** Селектор данных для детализации */
  dataSelector?: (data: any) => T;
  /** Асинхронная загрузка данных */
  asyncDataLoader?: () => Promise<T>;
  /** Заголовок детализации */
  title?: string;
  /** Высота контейнера детализации */
  height?: number | string;
}

/**
 * Расширенные пропсы ComplexKPI с поддержкой детализации
 */
export interface ComplexKPIWithDetailProps extends ComplexKPIProps {
  /** Конфигурация детализации */
  detailConfig?: DetailConfig<any>;
  /** Данные для детализации */
  detailData?: DetailData;
  /** Включить детализацию */
  enableDetail?: boolean;
  /** Обработчик ошибок детализации */
  onDetailError?: (error: Error) => void;
  /** Обработчик успешной загрузки детализации */
  onDetailLoad?: (data: DetailData) => void;
}

/**
 * Компонент мини-графика (переиспользуем из ComplexKPI)
 */
const MiniChart: React.FC<MiniChartProps> = ({ data, color, title, unit = '' }) => {
  const chartOption = useMemo(() => ({
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    xAxis: {
      type: 'category' as const,
      show: false,
      data: data.map((_, index) => index)
    },
    yAxis: {
      type: 'value' as const,
      show: false
    },
    series: [
      {
        type: 'line' as const,
        data: data,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: color,
          width: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: color
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }
            ]
          }
        }
      }
    ]
  }), [data, color]);

  return (
    <Box 
      style={{ cursor: 'pointer' }}
      title={`${title} ${unit}`.trim()}
    >
      <ReactECharts 
        option={chartOption} 
        style={{ height: '50px', width: '100%' }} 
        opts={{ renderer: 'svg' }}
      />
    </Box>
  );
};

/**
 * Утилитарные функции
 */
const getStatusColor = (theme: any, status?: KPIStatus): string => {
  const colorMap = {
    success: theme.colors.green[6],
    warning: theme.colors.yellow[6],
    danger: theme.colors.red[6],
    info: theme.colors.blue[6]
  };
  
  return status ? colorMap[status] : theme.colors.gray[6];
};

const getChartColor = (theme: any, status?: KPIStatus): string => {
  const colorMap = {
    success: theme.colors.green[6],
    warning: theme.colors.yellow[6],
    danger: theme.colors.red[6],
    info: theme.colors.blue[6]
  };
  
  return status ? colorMap[status] : theme.colors.blue[6];
};

/**
 * Компонент детализации
 */
const DetailRenderer: React.FC<{
  detailConfig: DetailConfig<any>;
  data: DetailData | undefined;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}> = ({ detailConfig, data, loading, error, onClose }) => {
  const renderContent = () => {
    if (loading) {
      return (
        <Group justify="center" p="xl">
          <Loader size="md" />
          <Text size="sm" c="dimmed">Загрузка детализации...</Text>
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
        <Text size="sm" c="dimmed" ta="center" p="xl">
          Нет данных для отображения
        </Text>
      );
    }

    const DetailComponent = detailConfig.component;
    return <DetailComponent data={data} onClose={onClose} loading={loading} error={error} />;
  };

  return (
    <Box
      style={{
        height: detailConfig.height || 'auto',
        maxHeight: '500px',
        overflow: 'auto'
      }}
    >
      {/* Заголовок детализации */}
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>
          {detailConfig.title || 'Детализация'}
        </Text>
        <ActionIcon 
          variant="subtle" 
          size="sm" 
          onClick={onClose}
          aria-label="Закрыть детализацию"
        >
          <IconX size={16} />
        </ActionIcon>
      </Group>
      
      <Divider mb="md" />
      
      {renderContent()}
    </Box>
  );
};

/**
 * Основной компонент ComplexKPI с поддержкой детализации
 */
const ComplexKPIWithDetail: React.FC<ComplexKPIWithDetailProps> = ({
  id,
  title,
  icon: IconComponent,
  value,
  target,
  progress,
  trend,
  status,
  subtitle,
  action,
  chartData,
  unit,
  interactions,
  animated = true,
  hoverable = true,
  detailConfig,
  detailData,
  enableDetail = false,
  onDetailError,
  onDetailLoad
}) => {
  const theme = useMantineTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [loadedDetailData, setLoadedDetailData] = useState<DetailData | undefined>(detailData);
  
  // Мемоизируем цвета для оптимизации
  const statusColor = useMemo(() => getStatusColor(theme, status), [theme, status]);
  const chartColor = useMemo(() => getChartColor(theme, status), [theme, status]);
  
  // Загрузка данных детализации
  const loadDetailData = useCallback(async () => {
    if (!detailConfig || !enableDetail) return;
    
    setDetailLoading(true);
    setDetailError(null);
    
    try {
      let data: DetailData;
      
      if (detailConfig.asyncDataLoader) {
        // Асинхронная загрузка
        data = await detailConfig.asyncDataLoader();
      } else if (detailConfig.dataSelector && detailData) {
        // Селектор данных
        data = detailConfig.dataSelector(detailData);
      } else if (detailData) {
        // Прямые данные
        data = detailData;
      } else {
        throw new Error('Нет данных для детализации');
      }
      
      setLoadedDetailData(data);
      onDetailLoad?.(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      setDetailError(errorMessage);
      onDetailError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setDetailLoading(false);
    }
  }, [detailConfig, detailData, enableDetail, onDetailError, onDetailLoad]);
  
  // Обработчики интерактивности
  const handleMouseEnter = () => {
    if (hoverable) {
      setIsHovered(true);
      interactions?.onHover?.();
    }
  };
  
  const handleMouseLeave = () => {
    if (hoverable) {
      setIsHovered(false);
      setIsPressed(false);
      interactions?.onLeave?.();
    }
  };
  
  const handleMouseDown = () => {
    if (interactions?.onClick || enableDetail) {
      setIsPressed(true);
    }
  };
  
  const handleMouseUp = () => {
    setIsPressed(false);
  };
  
  const handleClick = () => {
    interactions?.onClick?.();
    
    // Если включена детализация, переключаем её состояние
    if (enableDetail && detailConfig) {
      if (!isDetailExpanded) {
        loadDetailData();
      }
      setIsDetailExpanded(!isDetailExpanded);
    }
  };
  
  const handleDetailClose = () => {
    setIsDetailExpanded(false);
  };
  
  // Стили для интерактивности
  const cardStyles = useMemo(() => ({
    cursor: (interactions?.onClick || enableDetail) ? 'pointer' : 'default',
    transition: animated ? 'all 0.2s ease-in-out' : 'none',
    transform: isPressed ? 'scale(0.98)' : isHovered ? 'scale(1.02)' : 'scale(1)',
    boxShadow: isHovered 
      ? `0 8px 25px rgba(0, 0, 0, 0.15), 0 0 0 1px ${statusColor}20`
      : undefined
  }), [interactions?.onClick, enableDetail, animated, isPressed, isHovered, statusColor]);
  
  return (
    <Card 
      withBorder 
      data-testid={`complex-kpi-with-detail-${id}`}
      style={cardStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      {/* Заголовок с иконкой и действием */}
      <Group justify="space-between" mb="xs">
        <Group gap={8}>
          {/* Иконка KPI */}
          <Transition
            mounted={true}
            transition="scale"
            duration={animated ? 200 : 0}
          >
            {(styles) => (
              <ThemeIcon 
                variant={isHovered ? "filled" : "light"} 
                size="lg" 
                radius="md"
                color={status ? statusColor : undefined}
                style={{
                  ...styles,
                  transform: `${styles.transform} ${isHovered ? 'rotate(5deg)' : 'rotate(0deg)'}`,
                  transition: animated ? 'all 0.2s ease-in-out' : 'none'
                }}
              >
                {React.createElement(IconComponent, { size: 20 })}
              </ThemeIcon>
            )}
          </Transition>
          
          {/* Заголовок KPI */}
          <Text fw={500} size="sm" title={title}>
            {title}
          </Text>
        </Group>
        
        <Group gap="xs">
          {/* Индикатор детализации */}
          {enableDetail && detailConfig && (
            <ActionIcon
              variant="subtle"
              size="sm"
              color={statusColor}
              style={{
                transform: isDetailExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: animated ? 'transform 0.2s ease-in-out' : 'none'
              }}
              aria-label={isDetailExpanded ? 'Скрыть детализацию' : 'Показать детализацию'}
            >
              <IconChevronDown size={16} />
            </ActionIcon>
          )}
          
          {/* Кнопка действия (опционально) */}
          {action && (
            <Button 
              variant="subtle" 
              size="xs" 
              px="xs"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              data-testid={`kpi-action-${id}`}
            >
              {action.label}
            </Button>
          )}
        </Group>
      </Group>

      {/* Основное значение KPI */}
      <Text 
        size="xl" 
        fw={700} 
        mb="xs" 
        data-testid={`kpi-value-${id}`}
        style={{
          color: isHovered ? statusColor : undefined,
          transition: animated ? 'color 0.2s ease-in-out' : 'none'
        }}
      >
        {value}{unit && ` ${unit}`}
      </Text>

      {/* Целевое значение и прогресс */}
      {target && (
        <Group gap={8} mb="xs">
          <Text size="sm" c="dimmed">
            Цель: {target}{unit && ` ${unit}`}
          </Text>
          {progress !== undefined && (
            <Text size="sm" style={{ color: statusColor }}>
              {progress}%
            </Text>
          )}
        </Group>
      )}

      {/* Прогресс-бар */}
      {progress !== undefined && (
        <Progress
          value={Math.min(Math.max(progress, 0), 100)}
          color={statusColor}
          size={isHovered ? "md" : "sm"}
          mb="xs"
          data-testid={`kpi-progress-${id}`}
          style={{
            transition: animated ? 'all 0.2s ease-in-out' : 'none'
          }}
        />
      )}

      {/* Подзаголовок */}
      {subtitle && (
        <Text size="sm" c="dimmed" mb="xs">
          {subtitle}
        </Text>
      )}

      {/* Индикатор тренда */}
      {trend !== undefined && (
        <Group gap={4} mt="xs">
          {trend > 0 ? (
            <IconTrendingUp 
              size={16} 
              color={theme.colors.green[6]} 
              aria-label="Положительный тренд"
            />
          ) : (
            <IconTrendingDown 
              size={16} 
              color={theme.colors.red[6]} 
              aria-label="Отрицательный тренд"
            />
          )}
          <Text 
            size="sm" 
            c={trend > 0 ? 'green' : 'red'}
            data-testid={`kpi-trend-${id}`}
          >
            {Math.abs(trend)}%
          </Text>
        </Group>
      )}

      {/* Мини-график */}
      {chartData && chartData.length > 0 && (
        <Box 
          mt="xs"
          style={{
            opacity: isHovered ? 1 : 0.8,
            transition: animated ? 'opacity 0.2s ease-in-out' : 'none'
          }}
        >
          <MiniChart 
            data={chartData} 
            color={isHovered ? statusColor : chartColor} 
            title={title}
            unit={unit}
          />
        </Box>
      )}
      
      {/* Детализация */}
      {enableDetail && detailConfig && (
        <Collapse in={isDetailExpanded} transitionDuration={animated ? 300 : 0}>
          <Divider my="md" />
          <DetailRenderer
            detailConfig={detailConfig}
            data={loadedDetailData}
            loading={detailLoading}
            error={detailError}
            onClose={handleDetailClose}
          />
        </Collapse>
      )}
    </Card>
  );
};

// Экспорты
export default ComplexKPIWithDetail;

/**
 * Утилитарные функции для создания конфигураций
 */
export const createDetailConfig = <T extends DetailData>(
  config: Omit<DetailConfig<T>, 'id'> & { id: string }
): DetailConfig<T> => config;

export const createKPIWithDetail = <T extends DetailData>(
  kpiProps: ComplexKPIProps,
  detailConfig?: DetailConfig<T>,
  detailData?: T
): ComplexKPIWithDetailProps => ({
  ...kpiProps,
  detailConfig,
  detailData,
  enableDetail: !!detailConfig
});