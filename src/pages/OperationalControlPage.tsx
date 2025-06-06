// OperationalControlPage.tsx
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
  rem
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
  IconTarget
} from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useDisclosure, useHover } from '@mantine/hooks';

// Импортируем токены темы
import { operationalTokens, operationalUtils, animations } from '../theme/theme.tokens.extended';

// Типы данных
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
  actions: AlertAction[];
  timestamp: Date;
  isRead: boolean;
  affectedItems: AffectedItem[];
}

interface AlertAction {
  label: string;
  action: () => void;
  variant: 'filled' | 'light' | 'subtle';
}

interface AffectedItem {
  id: string;
  name: string;
  sku: string;
  rating?: number;
  stock?: number;
  price?: number;
}

interface KPIMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  target: number;
  format: 'currency' | 'percent' | 'number';
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'bad';
  icon: React.ComponentType<any>;
}

interface ChartData {
  time: string;
  sales: number;
  orders: number;
  returns: number;
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

interface AIInsight {
  id: string;
  type: 'prediction' | 'anomaly' | 'trend' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  suggestedAction?: string;
}

// Генерация тестовых данных
const generateTestAlerts = (): Alert[] => [
  {
    id: '1',
    type: 'critical',
    category: 'rating',
    title: 'Критически низкий рейтинг',
    description: 'Рейтинг товара "Кроссовки Nike Air Max" упал до 3.2. Последний отзыв: "Качество ужасное, подошва отклеилась через неделю"',
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
    description: 'Расходы на АРК превысили дневной лимит на 25%. Текущий ДРР: 18%',
    metric: {
      current: 125,
      threshold: 100,
      unit: '%',
      trend: 'up'
    },
    actions: [
      { label: 'Снизить ставки', action: () => console.log('Управление ставками'), variant: 'filled' },
      { label: 'Анализ', action: () => console.log('Анализ расходов'), variant: 'light' }
    ],
    timestamp: new Date(Date.now() - 7200000),
    isRead: true,
    affectedItems: []
  }
];

const generateKPIData = (): KPIMetric[] => [
  {
    id: 'sales',
    label: 'Продажи сегодня',
    value: 1344657,
    previousValue: 1200000,
    target: 1300000,
    format: 'currency',
    trend: 'up',
    status: 'good',
    icon: IconShoppingCart
  },
  {
    id: 'revenue',
    label: 'К перечислению',
    value: 609772,
    previousValue: 640000,
    target: 650000,
    format: 'currency',
    trend: 'down',
    status: 'warning',
    icon: IconCash
  },
  {
    id: 'profit',
    label: 'Прибыль',
    value: 525418,
    previousValue: 480000,
    target: 500000,
    format: 'currency',
    trend: 'up',
    status: 'good',
    icon: IconChartLine
  },
  {
    id: 'conversion',
    label: 'Конверсия',
    value: 2.51,
    previousValue: 2.81,
    target: 3.0,
    format: 'percent',
    trend: 'down',
    status: 'bad',
    icon: IconTarget
  },
  {
    id: 'orders',
    label: 'Заказов',
    value: 740,
    previousValue: 650,
    target: 700,
    format: 'number',
    trend: 'up',
    status: 'good',
    icon: IconPackage
  },
  {
    id: 'returns',
    label: 'Возвраты',
    value: 1.2,
    previousValue: 2.1,
    target: 2.0,
    format: 'percent',
    trend: 'down',
    status: 'good',
    icon: IconArrowDownRight
  }
];

const generateAIInsights = (): AIInsight[] => [
  {
    id: '1',
    type: 'prediction',
    title: 'Прогноз выручки на конец дня',
    description: '1 520 000 ₽ (+13% к плану)',
    confidence: 0.87,
    impact: 'high',
    suggestedAction: 'Увеличить лимиты на рекламу для максимизации выручки'
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
  },
  {
    id: '4',
    type: 'risk',
    title: 'Риск дефицита товара',
    description: 'Товар 12345678 закончится через 36 часов',
    confidence: 0.92,
    impact: 'high',
    suggestedAction: 'Срочно создать заказ поставщику'
  }
];

const generateProblems = (): ProblemItem[] => [
  {
    id: '1',
    type: 'stock',
    severity: 'critical',
    product: 'Кроссовки Nike Air Max',
    sku: 'NK-AM-001',
    description: 'Осталось 5 шт на складе Казань',
    metric: 'Хватит на 2 дня',
    action: 'Создать поставку'
  },
  {
    id: '2',
    type: 'rating',
    severity: 'warning',
    product: 'Футболка базовая черная',
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
    description: 'Конкурент снизил цену на 15%',
    metric: 'Наша цена выше на 500₽',
    action: 'Пересмотреть цену'
  }
];

// Утилита для времени
const getTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'только что';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} мин назад`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч назад`;
  return `${Math.floor(seconds / 86400)} д назад`;
};

// Компонент Health Score
const HealthScorePanel = ({ score = 78 }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  const metrics = [
    { name: 'Продажи', score: 95, icon: IconShoppingCart },
    { name: 'Маржа', score: 85, icon: IconCash },
    { name: 'Склад', score: 65, icon: IconPackage },
    { name: 'Реклама', score: 45, icon: IconChartLine },
    { name: 'Рейтинг', score: 92, icon: IconStar },
    { name: 'Позиции', score: 70, icon: IconTrendingUp }
  ];

  return (
    <Paper p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Здоровье бизнеса</Text>
        <Badge size="xl" variant="filled" color={getScoreColor(score)}>
          {score}/100
        </Badge>
      </Group>
      
      <Grid>
        {metrics.map((metric) => (
          <Grid.Col key={metric.name} span={2}>
            <Stack gap="xs" align="center">
              <ThemeIcon
                size="lg"
                variant="light"
                color={getScoreColor(metric.score)}
              >
                <metric.icon size={20} />
              </ThemeIcon>
              <Text size="xs" ta="center">{metric.name}</Text>
              <Badge
                size="sm"
                variant="light"
                color={getScoreColor(metric.score)}
              >
                {metric.score}
              </Badge>
            </Stack>
          </Grid.Col>
        ))}
      </Grid>
    </Paper>
  );
};

// Компонент AI Insights
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
    <Paper p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Group>
          <ThemeIcon size="lg" variant="light" color="violet">
            <IconChartLine size={20} />
          </ThemeIcon>
          <div>
            <Text fw={600}>AI Инсайты</Text>
            <Text size="xs" c="dimmed">Прогнозы и аномалии</Text>
          </div>
        </Group>
      </Group>

      <Stack gap="sm">
        {insights.map((insight) => {
          const Icon = getTypeIcon(insight.type);
          return (
            <Paper
              key={insight.id}
              p="sm"
              radius="md"
              withBorder
              className="hover-lift"
            >
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap">
                  <ThemeIcon
                    size="md"
                    variant="light"
                    color={getImpactColor(insight.impact)}
                  >
                    <Icon size={18} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" fw={500}>{insight.title}</Text>
                    <Text size="xs" c="dimmed">{insight.description}</Text>
                    {insight.suggestedAction && (
                      <Text size="xs" c="blue" mt={4}>
                        💡 {insight.suggestedAction}
                      </Text>
                    )}
                  </div>
                </Group>
                <Stack gap={2} align="flex-end">
                  <Badge
                    size="xs"
                    variant="light"
                    color={getImpactColor(insight.impact)}
                  >
                    {insight.impact === 'high' ? 'Высокий' :
                     insight.impact === 'medium' ? 'Средний' : 'Низкий'}
                  </Badge>
                  <Text size="xs" c="dimmed">
                    {Math.round(insight.confidence * 100)}% точность
                  </Text>
                </Stack>
              </Group>
            </Paper>
          );
        })}
      </Stack>
    </Paper>
  );
};

// Компонент Alert Panel
const AlertPanel = ({ alerts }: { alerts: Alert[] }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [muted, setMuted] = useState<Set<string>>(new Set());

  const alertCounts = alerts.reduce((acc, alert) => {
    if (!muted.has(alert.id)) {
      const category = alert.category as keyof typeof acc;
      acc[category] = (acc[category] || 0) + 1;
      if (alert.type === 'critical') acc.critical++;
    }
    return acc;
  }, { rating: 0, stock: 0, budget: 0, position: 0, critical: 0 });

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

  const filteredAlerts = alerts
    .filter(alert => !muted.has(alert.id))
    .filter(alert => filter === 'all' || !alert.isRead)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Alert Summary Card Component
  const AlertSummaryCard = ({ 
    icon: Icon, 
    color, 
    title, 
    count, 
    subtitle, 
    onClick, 
    pulse = false 
  }: {
    icon: React.ComponentType<any>;
    color: string;
    title: string;
    count: number;
    subtitle: string;
    onClick: () => void;
    pulse?: boolean;
  }) => {
    const { hovered, ref } = useHover();
    
    return (
      <UnstyledButton
        ref={ref}
        onClick={onClick}
        style={{ width: '100%' }}
      >
        <Paper
          p="md"
          radius="md"
          withBorder
          style={{
            borderColor: hovered 
              ? `var(--mantine-color-${color}-5)` 
              : 'var(--mantine-color-gray-3)',
            backgroundColor: hovered 
              ? `var(--mantine-color-${color}-0)` 
              : undefined,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            transform: hovered ? 'translateY(-2px)' : 'none',
            boxShadow: hovered ? 'var(--mantine-shadow-md)' : 'var(--mantine-shadow-xs)'
          }}
        >
          {pulse && count > 0 && (
            <Box
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                backgroundColor: `var(--mantine-color-${color}-5)`,
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}
            />
          )}
          
          <Group justify="space-between" wrap="nowrap">
            <ThemeIcon 
              size="lg" 
              variant="light" 
              color={color}
              style={{ flexShrink: 0 }}
            >
              <Icon size={20} />
            </ThemeIcon>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text size="lg" fw={700} c={color}>
                {count}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {title}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {subtitle}
              </Text>
            </div>
          </Group>
        </Paper>
      </UnstyledButton>
    );
  };

  return (
    <Paper 
      shadow="sm" 
      p="md" 
      radius="md"
      withBorder
      style={{ 
        borderColor: alertCounts.critical > 0 
          ? 'var(--mantine-color-red-2)' 
          : 'var(--mantine-color-gray-2)'
      }}
    >
      {/* CSS для анимаций */}
      <style>
        {animations.pulse.keyframes}
        {animations.slideInRight.keyframes}
      </style>

      {/* Заголовок панели */}
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
            <Text fw={600} size="lg">Критические предупреждения</Text>
            <Text size="sm" c="dimmed">
              {alertCounts.critical} требуют немедленного внимания
            </Text>
          </div>
        </Group>

        <Group>
          <Tooltip label="Обновить данные">
            <ActionIcon 
              variant="subtle" 
              onClick={() => console.log('Refresh')}
            >
              <IconRefresh size={18} />
            </ActionIcon>
          </Tooltip>
          
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDots size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item 
                leftSection={<IconEye size={16} />}
                onClick={() => setFilter('all')}
              >
                Показать все
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconEyeOff size={16} />}
                onClick={() => setFilter('unread')}
              >
                Только непрочитанные
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                leftSection={<IconBell size={16} />}
                onClick={() => notifications.show({
                  title: 'Push-уведомления включены',
                  message: 'Вы будете получать уведомления о критических событиях',
                  color: 'green'
                })}
              >
                Включить push-уведомления
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      {/* Сводные карточки по категориям */}
      <Grid mb="md">
        <Grid.Col span={{ base: 6, sm: 3 }}>
          <AlertSummaryCard
            icon={(props) => <IconStar {...props} />}
            color="red"
            title="Низкий рейтинг"
            count={alertCounts.rating}
            subtitle="товара < 4.0"
            onClick={() => console.log('Filter by rating')}
            pulse
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 3 }}>
          <AlertSummaryCard
            icon={IconPackage}
            color="orange"
            title="Заканчивается"
            count={alertCounts.stock}
            subtitle="SKU < 3 дней"
            onClick={() => console.log('Filter by stock')}
            pulse
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 3 }}>
          <AlertSummaryCard
            icon={IconCash}
            color="yellow"
            title="Превышение"
            count={alertCounts.budget}
            subtitle="лимитов"
            onClick={() => console.log('Filter by budget')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 3 }}>
          <AlertSummaryCard
            icon={IconTrendingDown}
            color="blue"
            title="Падение"
            count={alertCounts.position}
            subtitle="позиций"
            onClick={() => console.log('Filter by position')}
          />
        </Grid.Col>
      </Grid>

      {/* Детальный список алертов */}
      <ScrollArea h={300} offsetScrollbars>
        <Stack gap="xs">
          {filteredAlerts.length === 0 ? (
            <Text ta="center" c="dimmed" py="xl">
              {filter === 'unread' 
                ? 'Нет непрочитанных предупреждений' 
                : 'Нет активных предупреждений'}
            </Text>
          ) : (
            filteredAlerts.map(alert => (
              <AlertItem 
                key={alert.id}
                alert={alert}
                expanded={expanded.has(alert.id)}
                onToggle={() => toggleExpanded(alert.id)}
              />
            ))
          )}
        </Stack>
      </ScrollArea>
    </Paper>
  );
};

// Alert Item Component
const AlertItem = ({ 
  alert, 
  expanded, 
  onToggle 
}: { 
  alert: Alert;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const getIcon = () => {
    const icons = {
      rating: IconStar,
      stock: IconPackage,
      budget: IconCash,
      position: IconTrendingDown,
      competitor: IconAlertTriangle
    };
    return icons[alert.category] || IconAlertTriangle;
  };
  
  const getColor = () => {
    const colors = {
      critical: 'red',
      warning: 'yellow',
      info: 'blue'
    };
    return colors[alert.type];
  };
  
  const Icon = getIcon();
  const color = getColor();
  const timeAgo = getTimeAgo(alert.timestamp);
  
  return (
    <Paper
      p="sm"
      radius="md"
      withBorder
      style={{
        borderColor: !alert.isRead 
          ? `var(--mantine-color-${color}-3)` 
          : 'var(--mantine-color-gray-2)',
        backgroundColor: !alert.isRead 
          ? `var(--mantine-color-${color}-0)` 
          : undefined
      }}
      className={alert.isRead ? 'disabled' : undefined}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group wrap="nowrap" style={{ flex: 1 }}>
          <ThemeIcon 
            size="md" 
            variant="light" 
            color={color}
          >
            <Icon size={18} />
          </ThemeIcon>
          
          <div style={{ flex: 1 }}>
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm" fw={600}>{alert.title}</Text>
              <Group gap="xs">
                <Text size="xs" c="dimmed">{timeAgo}</Text>
                <Badge 
                  size="xs" 
                  variant="light" 
                  color={color}
                >
                  {alert.type === 'critical' ? 'Критично' : 
                   alert.type === 'warning' ? 'Важно' : 'Инфо'}
                </Badge>
              </Group>
            </Group>
            
            <Text size="xs" c="dimmed" lineClamp={expanded ? undefined : 1}>
              {alert.description}
            </Text>

            {alert.metric && (
              <Group gap="xs" mt={4}>
                <Text size="xs" c={color} fw={500}>
                  {alert.metric.current}{alert.metric.unit || ''} / {alert.metric.threshold}{alert.metric.unit || ''}
                </Text>
                <Progress 
                  value={(alert.metric.current / alert.metric.threshold) * 100} 
                  size="xs" 
                  color={color}
                  style={{ flex: 1, maxWidth: 100 }}
                />
              </Group>
            )}
          </div>
        </Group>

        <ActionIcon 
          variant="subtle" 
          size="sm"
          onClick={onToggle}
        >
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded}>
        <Divider my="sm" />
        
        {alert.affectedItems.length > 0 && (
          <Box mb="sm">
            <Text size="xs" fw={500} mb={4}>Затронутые товары:</Text>
            <Stack gap={4}>
              {alert.affectedItems.map(item => (
                <Group key={item.id} gap="xs">
                  <Badge size="xs" variant="outline">
                    {item.sku}
                  </Badge>
                  <Text size="xs">{item.name}</Text>
                </Group>
              ))}
            </Stack>
          </Box>
        )}

        <Group gap="xs">
          {alert.actions.map((action, index) => (
            <Button
              key={index}
              size="xs"
              variant={action.variant}
              onClick={() => action.action()}
              rightSection={action.variant === 'filled' ? <IconArrowRight size={14} /> : null}
            >
              {action.label}
            </Button>
          ))}
        </Group>
      </Collapse>
    </Paper>
  );
};

// Компонент KPI карточки
const KPICard = ({ metric }: { metric: KPIMetric }) => {
  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return (
          <NumberFormatter
            value={value}
            prefix="₽ "
            thousandSeparator=" "
            decimalScale={0}
          />
        );
      case 'percent':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString('ru-RU');
    }
  };

  const getTrendIcon = () => {
    if (metric.trend === 'up') return <IconTrendingUp size={16} />;
    if (metric.trend === 'down') return <IconTrendingDown size={16} />;
    return <IconMinus size={16} />;
  };

  const getStatusColor = () => {
    if (metric.status === 'good') return 'green';
    if (metric.status === 'warning') return 'yellow';
    return 'red';
  };

  const percentChange = ((metric.value - metric.previousValue) / metric.previousValue * 100).toFixed(1);

  return (
    <Paper p="md" radius="md" withBorder className="hover-lift">
      <Stack gap="xs">
        <Group justify="space-between">
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            {metric.label}
          </Text>
          <ThemeIcon size="sm" variant="light" color={getStatusColor()}>
            <metric.icon size={16} />
          </ThemeIcon>
        </Group>
        
        <Group justify="space-between" align="flex-end">
          <Text size="xl" fw={700}>
            {formatValue(metric.value, metric.format)}
          </Text>
          
          <Badge
            variant="light"
            color={getStatusColor()}
            leftSection={getTrendIcon()}
            size="sm"
          >
            {percentChange}%
          </Badge>
        </Group>
        
        <Progress
          value={(metric.value / metric.target) * 100}
          color={getStatusColor()}
          size="xs"
          radius="xl"
        />
        
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            План: {formatValue(metric.target, metric.format)}
          </Text>
          <Text size="xs" c="dimmed">
            {((metric.value / metric.target) * 100).toFixed(0)}% выполнения
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
};

// Основная страница
const OperationalControlPage = () => {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('today');
  
  const alerts = generateTestAlerts();
  const kpiData = generateKPIData();
  const aiInsights = generateAIInsights();
  const problems = generateProblems();

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    notifications.show({
      title: 'Данные обновлены',
      message: 'Все метрики актуализированы',
      color: 'green'
    });
  };

  return (
    <Container fluid p="md">
      <Stack gap="lg">
        {/* Заголовок и управление */}
        <Paper p="md" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xl" fw={700}>Оперативный контроль</Text>
              <Text size="sm" c="dimmed">
                Последнее обновление: {new Date().toLocaleString('ru-RU')}
              </Text>
            </div>
            
            <Group>
              <SegmentedControl
                value={period}
                onChange={setPeriod}
                data={[
                  { label: 'Сегодня', value: 'today' },
                  { label: 'Вчера', value: 'yesterday' },
                  { label: 'Неделя', value: 'week' },
                  { label: 'Месяц', value: 'month' }
                ]}
              />
              
              <Tooltip label="Обновить данные">
                <ActionIcon
                  variant="subtle"
                  onClick={handleRefresh}
                  loading={loading}
                >
                  <IconRefresh size={18} />
                </ActionIcon>
              </Tooltip>
              
              <Menu position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="subtle">
                    <IconDots size={18} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconDownload size={16} />}>
                    Экспорт в Excel
                  </Menu.Item>
                  <Menu.Item leftSection={<IconFilter size={16} />}>
                    Настройки фильтров
                  </Menu.Item>
                  <Menu.Item leftSection={<IconEye size={16} />}>
                    Настроить виджеты
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Paper>

        {/* Здоровье бизнеса */}
        <HealthScorePanel />

        {/* Критические алерты и AI инсайты */}
        <Grid>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <AlertPanel alerts={alerts} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <AIInsightsPanel insights={aiInsights} />
          </Grid.Col>
        </Grid>

        {/* KPI метрики */}
        <div>
          <Text fw={600} mb="md">Ключевые показатели</Text>
          <Grid>
            {kpiData.map((metric) => (
              <Grid.Col key={metric.id} span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
                <KPICard metric={metric} />
              </Grid.Col>
            ))}
          </Grid>
        </div>
      </Stack>
    </Container>
  );
};

export default OperationalControlPage;