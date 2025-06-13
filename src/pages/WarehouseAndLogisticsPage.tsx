import React, { useState, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Title,
  Group,
  Stack,
  Badge,
  Progress,
  Table,
  ActionIcon,
  Tooltip,
  Select,
  MultiSelect,
  Button,
  Modal,
  Tabs,
  RingProgress,
  ThemeIcon,
  Paper,
  NumberInput,
  Alert,
  SegmentedControl,
  Indicator,
  Timeline,
  Skeleton,
  ColorSwatch,
  HoverCard,
  Box,
  Center,
  Divider,
  ScrollArea,
  LoadingOverlay
} from '@mantine/core';
import {
  IconTruck,
  IconPackage,
  IconClock,
  IconTrendingUp,
  IconAlertTriangle,
  IconRefresh,
  IconFilter,
  IconDownload,
  IconInfoCircle,
  IconChartBar,
  IconCalendar,
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight,
  IconAlertCircle,
  IconCircleCheck,
  IconBuildingWarehouse,
  IconRoute,
  IconCube,
  IconRotate,
  IconX,
  IconFlame,
  IconSkull,
  IconTarget,
  IconTrendingDown,
  IconCalculator,
  IconBan,
  IconShoppingCart,
  IconReportAnalytics,
  IconDatabaseOff
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import { DatePickerInput } from '@mantine/dates';

// Расширенные моковые данные с ABC-XYZ классификацией
const warehouseData = {
  kpi: {
    totalStock: 125340,
    stockDays: 42,
    turnoverRate: 8.7,
    deliveryTime: 3.2,
    deliveryCost: 185,
    returnRate: 5.2,
    warehouseUtilization: 78,
    frozenStock: 3450,
    stockAccuracy: 98.5,
    czProductsCount: 421,
    czStockValue: 2150000,
    czStorageCost: 145000,
    stockoutRate: 2.1
  },
  
  // Матрица ABC-XYZ с нормативами
  abcxyzMatrix: {
    AX: { count: 85, revenue: 45, stockDays: 12, norm: '10-15', turnover: 28, status: 'optimal' },
    AY: { count: 45, revenue: 20, stockDays: 25, norm: '20-30', turnover: 14.5, status: 'good' },
    AZ: { count: 25, revenue: 10, stockDays: 38, norm: '30-45', turnover: 9.5, status: 'attention' },
    BX: { count: 156, revenue: 12, stockDays: 18, norm: '15-25', turnover: 20, status: 'optimal' },
    BY: { count: 89, revenue: 6, stockDays: 32, norm: '25-40', turnover: 11.2, status: 'good' },
    BZ: { count: 67, revenue: 2, stockDays: 48, norm: '40-60', turnover: 7.6, status: 'good' },
    CX: { count: 234, revenue: 3, stockDays: 28, norm: '20-35', turnover: 13, status: 'good' },
    CY: { count: 178, revenue: 1.5, stockDays: 45, norm: '30-60', turnover: 8.1, status: 'good' },
    CZ: { count: 421, revenue: 0.5, stockDays: 125, norm: '0-30', turnover: 2.9, status: 'critical' }
  },
  
  products: [
    { 
      sku: 'ART-001', 
      name: 'Футболка базовая',
      group: 'AX',
      stock: 4500,
      stockValue: 1350000,
      dailySales: 120,
      monthlyRevenue: 432000,
      storageCostMonthly: 8100,
      daysLeft: 37,
      turnover: 28.5,
      variationCoeff: 5.2,
      serviceLevel: 99,
      reorderPoint: 1200,
      safetyStock: 480
    },
    { 
      sku: 'ART-002', 
      name: 'Джинсы классические',
      group: 'AY',
      stock: 2300,
      stockValue: 1610000,
      dailySales: 45,
      monthlyRevenue: 315000,
      storageCostMonthly: 12880,
      daysLeft: 51,
      turnover: 14.2,
      variationCoeff: 18.7,
      serviceLevel: 96,
      reorderPoint: 900,
      safetyStock: 450
    },
    { 
      sku: 'ART-003', 
      name: 'Платье летнее',
      group: 'BZ',
      stock: 890,
      stockValue: 356000,
      dailySales: 8,
      monthlyRevenue: 64000,
      storageCostMonthly: 4272,
      daysLeft: 111,
      turnover: 3.3,
      variationCoeff: 45.2,
      serviceLevel: 88,
      reorderPoint: 240,
      safetyStock: 160
    },
    { 
      sku: 'ART-004', 
      name: 'Рубашка офисная (устаревшая)',
      group: 'CZ',
      stock: 450,
      stockValue: 225000,
      dailySales: 2,
      monthlyRevenue: 12000,
      storageCostMonthly: 4500,
      daysLeft: 225,
      turnover: 0.8,
      variationCoeff: 78.5,
      serviceLevel: 72,
      reorderPoint: 0,
      safetyStock: 0,
      liquidationPrice: 250,
      storageLoss: -2500
    },
    { 
      sku: 'ART-005', 
      name: 'Кроссовки спортивные',
      group: 'AX',
      stock: 1200,
      stockValue: 2400000,
      dailySales: 85,
      monthlyRevenue: 680000,
      storageCostMonthly: 14400,
      daysLeft: 14,
      turnover: 26.1,
      variationCoeff: 7.3,
      serviceLevel: 98,
      reorderPoint: 850,
      safetyStock: 340
    }
  ],
  
  // Проблемные CZ товары для ликвидации
  czProducts: [
    { 
      sku: 'CZ-001', 
      name: 'Сумка кожаная (старая коллекция)', 
      stock: 120, 
      stockValue: 480000,
      monthlyLoss: 8500,
      liquidationDiscount: 60,
      daysSinceLastSale: 142 
    },
    { 
      sku: 'CZ-002', 
      name: 'Пальто зимнее (прошлый сезон)', 
      stock: 45, 
      stockValue: 360000,
      monthlyLoss: 6200,
      liquidationDiscount: 70,
      daysSinceLastSale: 98 
    },
    { 
      sku: 'CZ-003', 
      name: 'Аксессуары декоративные', 
      stock: 380, 
      stockValue: 114000,
      monthlyLoss: 2850,
      liquidationDiscount: 80,
      daysSinceLastSale: 215 
    }
  ]
};

// Функция расчета статуса группы
const getGroupStatus = (group: string, data: any): string => {
  const groupData = data.abcxyzMatrix[group];
  const [minNorm, maxNorm] = groupData.norm.split('-').map((n: string) => parseInt(n));
  
  if (group === 'CZ') {
    return groupData.stockDays > 30 ? 'critical' : 'warning';
  }
  
  if (groupData.stockDays < minNorm * 0.8) {
    return 'low';
  } else if (groupData.stockDays > maxNorm * 1.5) {
    return 'excess';
  } else if (groupData.stockDays > maxNorm * 1.2) {
    return 'warning';
  }
  return 'optimal';
};

// Функция получения цвета статуса
const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    optimal: 'green',
    good: 'blue',
    warning: 'yellow',
    attention: 'orange',
    critical: 'red',
    low: 'grape',
    excess: 'pink'
  };
  return colors[status] || 'gray';
};

// Компонент ABC-XYZ матрицы
function ABCXYZMatrix({ data, onCellClick }: { data: any; onCellClick: (group: string) => void }) {
  const getTooltipContent = (group: string) => {
    const info = data.abcxyzMatrix[group];
    return (
      <Stack gap={4}>
        <Text size="sm" fw={600}>{group}</Text>
        <Text size="xs">Товаров: {info.count}</Text>
        <Text size="xs">Выручка: {info.revenue}%</Text>
        <Text size="xs">Запас: {info.stockDays} дней</Text>
        <Text size="xs">Норматив: {info.norm} дней</Text>
        <Text size="xs">Оборот: {info.turnover} раз/год</Text>
      </Stack>
    );
  };
  
  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="md">Матрица ABC-XYZ</Title>
      
      <Grid gutter="xs">
        {/* Заголовки */}
        <Grid.Col span={3}></Grid.Col>
        <Grid.Col span={3}>
          <Text size="sm" fw={600} ta="center">X (стабильный)</Text>
          <Text size="xs" c="dimmed" ta="center">КВ ≤ 10%</Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Text size="sm" fw={600} ta="center">Y (умеренный)</Text>
          <Text size="xs" c="dimmed" ta="center">КВ 10-25%</Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Text size="sm" fw={600} ta="center">Z (нестабильный)</Text>
          <Text size="xs" c="dimmed" ta="center">КВ {'>'}25%</Text>
        </Grid.Col>
        
        {/* Строка A */}
        <Grid.Col span={3}>
          <Box>
            <Text size="sm" fw={600}>A (70-80%)</Text>
            <Text size="xs" c="dimmed">Основная выручка</Text>
          </Box>
        </Grid.Col>
        {['AX', 'AY', 'AZ'].map(group => (
          <Grid.Col key={group} span={3}>
            <HoverCard width={280} shadow="md">
              <HoverCard.Target>
                <Card
                  padding="sm"
                  withBorder
                  style={{ cursor: 'pointer', borderColor: `var(--mantine-color-${getStatusColor(getGroupStatus(group, data))}-4)` }}
                  onClick={() => onCellClick(group)}
                >
                  <Stack gap={4}>
                    <Group justify="space-between">
                      <Badge color={getStatusColor(getGroupStatus(group, data))} size="lg">
                        {group}
                      </Badge>
                      {group === 'AX' && <IconTarget size={16} />}
                      {group === 'AY' && <IconChartBar size={16} />}
                      {group === 'AZ' && <IconAlertTriangle size={16} />}
                    </Group>
                    <Text size="xs" c="dimmed">{data.abcxyzMatrix[group].count} товаров</Text>
                    <Text size="xs" fw={600}>{data.abcxyzMatrix[group].revenue}% выручки</Text>
                    <Progress value={(data.abcxyzMatrix[group].stockDays / 150) * 100} size="xs" />
                    <Text size="xs">{data.abcxyzMatrix[group].stockDays} дн. запас</Text>
                  </Stack>
                </Card>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                {getTooltipContent(group)}
              </HoverCard.Dropdown>
            </HoverCard>
          </Grid.Col>
        ))}
        
        {/* Строка B */}
        <Grid.Col span={3}>
          <Box>
            <Text size="sm" fw={600}>B (15-20%)</Text>
            <Text size="xs" c="dimmed">Средняя выручка</Text>
          </Box>
        </Grid.Col>
        {['BX', 'BY', 'BZ'].map(group => (
          <Grid.Col key={group} span={3}>
            <HoverCard width={280} shadow="md">
              <HoverCard.Target>
                <Card
                  padding="sm"
                  withBorder
                  style={{ cursor: 'pointer', borderColor: `var(--mantine-color-${getStatusColor(getGroupStatus(group, data))}-4)` }}
                  onClick={() => onCellClick(group)}
                >
                  <Stack gap={4}>
                    <Badge color={getStatusColor(getGroupStatus(group, data))} size="lg">
                      {group}
                    </Badge>
                    <Text size="xs" c="dimmed">{data.abcxyzMatrix[group].count} товаров</Text>
                    <Text size="xs" fw={600}>{data.abcxyzMatrix[group].revenue}% выручки</Text>
                    <Progress value={(data.abcxyzMatrix[group].stockDays / 150) * 100} size="xs" />
                    <Text size="xs">{data.abcxyzMatrix[group].stockDays} дн. запас</Text>
                  </Stack>
                </Card>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                {getTooltipContent(group)}
              </HoverCard.Dropdown>
            </HoverCard>
          </Grid.Col>
        ))}
        
        {/* Строка C */}
        <Grid.Col span={3}>
          <Box>
            <Text size="sm" fw={600}>C (5-10%)</Text>
            <Text size="xs" c="dimmed">Низкая выручка</Text>
          </Box>
        </Grid.Col>
        {['CX', 'CY', 'CZ'].map(group => (
          <Grid.Col key={group} span={3}>
            <HoverCard width={280} shadow="md">
              <HoverCard.Target>
                <Card
                  padding="sm"
                  withBorder
                  style={{ 
                    cursor: 'pointer', 
                    borderColor: group === 'CZ' ? 'var(--mantine-color-red-6)' : `var(--mantine-color-${getStatusColor(getGroupStatus(group, data))}-4)`,
                    backgroundColor: group === 'CZ' ? 'var(--mantine-color-red-0)' : undefined
                  }}
                  onClick={() => onCellClick(group)}
                >
                  <Stack gap={4}>
                    <Group justify="space-between">
                      <Badge color={getStatusColor(getGroupStatus(group, data))} size="lg">
                        {group}
                      </Badge>
                      {group === 'CZ' && (
                        <Group gap={4}>
                          <IconFlame size={16} color="red" />
                          <IconSkull size={16} color="red" />
                        </Group>
                      )}
                    </Group>
                    <Text size="xs" c="dimmed">{data.abcxyzMatrix[group].count} товаров</Text>
                    <Text size="xs" fw={600}>{data.abcxyzMatrix[group].revenue}% выручки</Text>
                    <Progress value={(data.abcxyzMatrix[group].stockDays / 150) * 100} size="xs" color={group === 'CZ' ? 'red' : undefined} />
                    <Text size="xs" c={group === 'CZ' ? 'red' : undefined} fw={group === 'CZ' ? 700 : 400}>
                      {data.abcxyzMatrix[group].stockDays} дн. запас
                    </Text>
                    {group === 'CZ' && <Text size="xs" c="red" fw={700}>УБЫТОЧНО!</Text>}
                  </Stack>
                </Card>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                {getTooltipContent(group)}
              </HoverCard.Dropdown>
            </HoverCard>
          </Grid.Col>
        ))}
      </Grid>
      
      {/* Легенда */}
      <Group mt="md" gap="xs">
        <Badge color="green" variant="light" leftSection={<ColorSwatch color="green" size={8} />}>Оптимально</Badge>
        <Badge color="yellow" variant="light" leftSection={<ColorSwatch color="yellow" size={8} />}>Внимание</Badge>
        <Badge color="red" variant="light" leftSection={<ColorSwatch color="red" size={8} />}>Критично</Badge>
      </Group>
    </Paper>
  );
}

export default function WarehouseLogistics() {
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groupModalOpened, setGroupModalOpened] = useState(false);
  const [liquidationModalOpened, setLiquidationModalOpened] = useState(false);
  const [viewMode, setViewMode] = useState('overview');
  
  // KPI карточки с учетом ABC-XYZ
  const kpiCards = [
    {
      title: 'Товары CZ',
      value: warehouseData.kpi.czProductsCount,
      unit: 'шт',
      trend: 15.2,
      icon: IconSkull,
      color: 'red',
      description: 'Критические товары для ликвидации',
      alert: true
    },
    {
      title: 'Убытки от CZ',
      value: `${(warehouseData.kpi.czStorageCost / 1000).toFixed(0)}к`,
      unit: '₽/мес',
      trend: 8.5,
      icon: IconFlame,
      color: 'red',
      description: 'Ежемесячные потери на хранении'
    },
    {
      title: 'Оборачиваемость',
      value: warehouseData.kpi.turnoverRate.toFixed(1),
      unit: 'раз/мес',
      trend: -5.2,
      icon: IconRotate,
      color: 'cyan',
      description: 'Скорость оборота запасов'
    },
    {
      title: 'Точность учета',
      value: `${warehouseData.kpi.stockAccuracy}%`,
      unit: '',
      trend: 0.5,
      icon: IconTarget,
      color: 'green',
      description: 'Соответствие факта и учета'
    },
    {
      title: 'Дефициты',
      value: `${warehouseData.kpi.stockoutRate}%`,
      unit: '',
      trend: -2.1,
      icon: IconDatabaseOff,
      color: 'orange',
      description: 'Процент товаров Out-of-Stock'
    },
    {
      title: 'Загрузка складов',
      value: `${warehouseData.kpi.warehouseUtilization}%`,
      unit: '',
      trend: 3.2,
      icon: IconBuildingWarehouse,
      color: 'blue',
      description: 'Использование складских площадей'
    }
  ];

  // График ABC кривой Парето
  const abcParetoOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['A товары', 'B товары', 'C товары']
    },
    yAxis: [
      { type: 'value', name: 'Выручка (%)', max: 100 },
      { type: 'value', name: 'Накопленная доля (%)', max: 100 }
    ],
    series: [
      {
        name: 'Выручка',
        type: 'bar',
        data: [75, 20, 5],
        itemStyle: { color: '#339af0' }
      },
      {
        name: 'Накопленная доля',
        type: 'line',
        yAxisIndex: 1,
        data: [75, 95, 100],
        itemStyle: { color: '#fa5252' },
        markLine: {
          data: [{ yAxis: 80 }],
          label: { formatter: '80%' }
        }
      }
    ]
  };

  // График коэффициента вариации
  const variationCoefficientOption = {
    tooltip: { trigger: 'item' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      name: 'Доля в выручке (%)',
      max: 100
    },
    yAxis: {
      type: 'value',
      name: 'Коэффициент вариации (%)',
      max: 100
    },
    series: [
      {
        type: 'scatter',
        symbolSize: function(data: any) {
          return Math.sqrt(data[2]) * 2;
        },
        data: [
          [45, 5, 4500, 'AX'],
          [20, 18, 2300, 'AY'],
          [10, 35, 1100, 'AZ'],
          [12, 8, 3200, 'BX'],
          [6, 22, 1800, 'BY'],
          [2, 48, 800, 'BZ'],
          [3, 12, 2100, 'CX'],
          [1.5, 28, 1400, 'CY'],
          [0.5, 65, 3800, 'CZ']
        ],
        itemStyle: {
          color: function(params: any) {
            const group = params.data[3];
            if (group.endsWith('X')) return '#51cf66';
            if (group.endsWith('Y')) return '#ffd43b';
            return '#fa5252';
          }
        },
        markArea: {
          data: [
            [{ yAxis: 0 }, { yAxis: 10 }],
            [{ yAxis: 10 }, { yAxis: 25 }],
            [{ yAxis: 25 }, { yAxis: 100 }]
          ],
          itemStyle: { opacity: 0.1 }
        }
      }
    ]
  };

  // График экономики хранения
  const storageCostOption = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}%'
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ']
    },
    yAxis: {
      type: 'value',
      name: 'Затраты на хранение / Выручка (%)',
      axisLabel: { formatter: '{value}%' }
    },
    series: [
      {
        name: 'Затраты/Выручка',
        type: 'bar',
        data: [1.8, 3.2, 5.5, 2.5, 4.1, 6.8, 4.5, 7.2, 37.5],
        itemStyle: {
          color: function(params: any) {
            if (params.value < 3) return '#51cf66';
            if (params.value < 8) return '#ffd43b';
            return '#fa5252';
          }
        },
        markLine: {
          data: [{ yAxis: 8, label: { formatter: 'Критический уровень' } }],
          lineStyle: { color: '#fa5252' }
        }
      }
    ]
  };

  // График оборачиваемости по группам
  const turnoverByGroupOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ']
    },
    yAxis: {
      type: 'value',
      name: 'Оборачиваемость (раз/год)'
    },
    series: [
      {
        name: 'Фактическая',
        type: 'bar',
        data: [28, 14.5, 9.5, 20, 11.2, 7.6, 13, 8.1, 2.9],
        itemStyle: { color: '#339af0' }
      },
      {
        name: 'Норматив мин',
        type: 'line',
        data: [24, 12, 8, 15, 9, 6, 10, 6, 0],
        lineStyle: { type: 'dashed' },
        itemStyle: { color: '#51cf66' }
      }
    ]
  };

  const handleCellClick = (group: string) => {
    setSelectedGroup(group);
    setGroupModalOpened(true);
  };

  return (
    <Container size="xl" p="md">
      <Stack gap="lg">
        {/* Заголовок и управление */}
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={2}>Склад и логистика</Title>
            <Text c="dimmed" size="sm">Многофакторный ABC-XYZ анализ и управление запасами</Text>
          </div>
          
          <Group>
            <Button 
              color="red" 
              leftSection={<IconFlame size={16} />}
              onClick={() => setLiquidationModalOpened(true)}
            >
              Ликвидация CZ ({warehouseData.kpi.czProductsCount})
            </Button>
            <SegmentedControl
              value={viewMode}
              onChange={setViewMode}
              data={[
                { label: 'Обзор', value: 'overview' },
                { label: 'ABC-XYZ', value: 'abcxyz' },
                { label: 'Аналитика', value: 'analytics' }
              ]}
            />
            <Button leftSection={<IconDownload size={16} />} variant="light">
              Экспорт
            </Button>
          </Group>
        </Group>

        {/* Критические алерты */}
        <Alert 
          icon={<IconSkull size={16} />} 
          title="Критическая ситуация с товарами CZ" 
          color="red"
          variant="filled"
        >
          <Stack gap="xs">
            <Text size="sm">
              {warehouseData.kpi.czProductsCount} товаров группы CZ создают убытки {(warehouseData.kpi.czStorageCost / 1000).toFixed(0)}к ₽/мес
            </Text>
            <Group gap="xs">
              <Button size="xs" color="white" variant="white" onClick={() => setLiquidationModalOpened(true)}>
                План ликвидации
              </Button>
              <Text size="xs" c="white">
                Потенциальная экономия: {((warehouseData.kpi.czStorageCost * 12 + warehouseData.kpi.czStockValue * 0.15) / 1000000).toFixed(1)}М ₽/год
              </Text>
            </Group>
          </Stack>
        </Alert>

        {/* KPI карточки */}
        <Grid>
          {kpiCards.map((kpi, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
              <Card 
                shadow="sm" 
                radius="md" 
                withBorder
                style={{ 
                  borderColor: kpi.alert ? 'var(--mantine-color-red-6)' : undefined,
                  backgroundColor: kpi.alert ? 'var(--mantine-color-red-0)' : undefined
                }}
              >
                <Stack gap="xs">
                  <Group justify="space-between">
                    <ThemeIcon color={kpi.color} variant="light" size="lg">
                      <kpi.icon size={20} />
                    </ThemeIcon>
                    {kpi.alert && (
                      <Indicator color="red" processing>
                        <div />
                      </Indicator>
                    )}
                  </Group>
                  
                  <Text size="xs" c="dimmed" fw={500}>{kpi.title}</Text>
                  
                  <Group gap="xs" align="baseline">
                    <Text size="xl" fw={700}>{kpi.value}</Text>
                    <Text size="sm" c="dimmed">{kpi.unit}</Text>
                  </Group>
                  
                  <Group gap="xs">
                    <ThemeIcon
                      size="xs"
                      variant="light"
                      color={kpi.trend > 0 ? (kpi.alert ? 'red' : 'green') : (kpi.alert ? 'green' : 'red')}
                    >
                      {kpi.trend > 0 ? <IconArrowUpRight size={12} /> : <IconArrowDownRight size={12} />}
                    </ThemeIcon>
                    <Text size="xs" c={kpi.trend > 0 ? (kpi.alert ? 'red' : 'green') : (kpi.alert ? 'green' : 'red')}>
                      {Math.abs(kpi.trend)}%
                    </Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* ABC-XYZ матрица */}
        {viewMode === 'overview' && (
          <ABCXYZMatrix data={warehouseData} onCellClick={handleCellClick} />
        )}

        {/* Визуализации */}
        {(viewMode === 'overview' || viewMode === 'analytics') && (
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" radius="md" withBorder p="md">
                <Title order={4} mb="md">ABC анализ (кривая Парето)</Title>
                <ReactECharts option={abcParetoOption} style={{ height: 300 }} />
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" radius="md" withBorder p="md">
                <Title order={4} mb="md">XYZ анализ (волатильность спроса)</Title>
                <ReactECharts option={variationCoefficientOption} style={{ height: 300 }} />
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" radius="md" withBorder p="md">
                <Title order={4} mb="md">Экономика хранения по группам</Title>
                <ReactECharts option={storageCostOption} style={{ height: 300 }} />
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" radius="md" withBorder p="md">
                <Title order={4} mb="md">Оборачиваемость vs Нормативы</Title>
                <ReactECharts option={turnoverByGroupOption} style={{ height: 300 }} />
              </Card>
            </Grid.Col>
          </Grid>
        )}

        {/* Таблица товаров с расширенными метриками */}
        {viewMode === 'abcxyz' && (
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Детальный анализ товаров</Title>
              <Group>
                <Select
                  placeholder="Группа ABC-XYZ"
                  data={[
                    { value: 'all', label: 'Все группы' },
                    { value: 'AX', label: 'AX - Золотые' },
                    { value: 'AY', label: 'AY - Звезды' },
                    { value: 'AZ', label: 'AZ - Проблемные хиты' },
                    { value: 'BX', label: 'BX - Рабочие' },
                    { value: 'BY', label: 'BY - Контролируемые' },
                    { value: 'BZ', label: 'BZ - Эпизодические' },
                    { value: 'CX', label: 'CX - Дополнительные' },
                    { value: 'CY', label: 'CY - Сезонные' },
                    { value: 'CZ', label: 'CZ - Балласт' }
                  ]}
                  w={200}
                />
                <Button variant="light" size="sm" leftSection={<IconCalculator size={16} />}>
                  Пересчитать ABC-XYZ
                </Button>
              </Group>
            </Group>
            
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>SKU</Table.Th>
                    <Table.Th>Название</Table.Th>
                    <Table.Th>Группа</Table.Th>
                    <Table.Th>Остаток</Table.Th>
                    <Table.Th>Стоимость остатка</Table.Th>
                    <Table.Th>Дней запаса</Table.Th>
                    <Table.Th>КВ спроса</Table.Th>
                    <Table.Th>Оборот</Table.Th>
                    <Table.Th>Хранение/Выручка</Table.Th>
                    <Table.Th>Статус</Table.Th>
                    <Table.Th>Действия</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {warehouseData.products.map((product) => {
                    const storageCostRatio = ((product.storageCostMonthly / product.monthlyRevenue) * 100).toFixed(1);
                    const isProblematic = product.group === 'CZ' || parseFloat(storageCostRatio) > 10;
                    
                    return (
                      <Table.Tr key={product.sku} style={{ backgroundColor: isProblematic ? 'var(--mantine-color-red-0)' : undefined }}>
                        <Table.Td>{product.sku}</Table.Td>
                        <Table.Td>{product.name}</Table.Td>
                        <Table.Td>
                          <Badge 
                            color={product.group === 'CZ' ? 'red' : product.group.startsWith('A') ? 'blue' : product.group.startsWith('B') ? 'green' : 'gray'}
                            variant={product.group === 'CZ' ? 'filled' : 'light'}
                          >
                            {product.group}
                          </Badge>
                        </Table.Td>
                        <Table.Td>{product.stock.toLocaleString()}</Table.Td>
                        <Table.Td>{(product.stockValue / 1000).toFixed(0)}к ₽</Table.Td>
                        <Table.Td>
                          <Badge color={product.daysLeft > 60 ? 'red' : product.daysLeft > 30 ? 'yellow' : 'green'}>
                            {product.daysLeft} дней
                          </Badge>
                        </Table.Td>
                        <Table.Td>{product.variationCoeff.toFixed(1)}%</Table.Td>
                        <Table.Td>{product.turnover.toFixed(1)}</Table.Td>
                        <Table.Td>
                          <Text c={parseFloat(storageCostRatio) > 10 ? 'red' : parseFloat(storageCostRatio) > 5 ? 'orange' : undefined} fw={parseFloat(storageCostRatio) > 10 ? 700 : 400}>
                            {storageCostRatio}%
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          {product.storageLoss ? (
                            <Badge color="red" leftSection={<IconFlame size={12} />}>
                              Убыток {(product.storageLoss / 1000).toFixed(1)}к/мес
                            </Badge>
                          ) : (
                            <Badge color="green" leftSection={<IconCircleCheck size={12} />}>
                              Норма
                            </Badge>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            {product.group === 'CZ' && (
                              <Tooltip label="Ликвидировать">
                                <ActionIcon color="red" variant="filled" size="sm">
                                  <IconX size={16} />
                                </ActionIcon>
                              </Tooltip>
                            )}
                            <Tooltip label="Аналитика">
                              <ActionIcon variant="subtle" size="sm">
                                <IconChartBar size={16} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Заказать">
                              <ActionIcon variant="subtle" size="sm" disabled={product.group === 'CZ'}>
                                <IconShoppingCart size={16} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Card>
        )}

        {/* Нормативы по группам */}
        <Card shadow="sm" radius="md" withBorder>
          <Title order={4} mb="md">Нормативы управления запасами по группам ABC-XYZ</Title>
          
          <ScrollArea>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Группа</Table.Th>
                  <Table.Th>Норматив запаса</Table.Th>
                  <Table.Th>Страховой запас</Table.Th>
                  <Table.Th>Частота контроля</Table.Th>
                  <Table.Th>Сервисный уровень</Table.Th>
                  <Table.Th>Макс. хранение/выручка</Table.Th>
                  <Table.Th>Стратегия</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td><Badge color="blue">AX</Badge></Table.Td>
                  <Table.Td>10-15 дней</Table.Td>
                  <Table.Td>3-5 дней</Table.Td>
                  <Table.Td>Ежедневно</Table.Td>
                  <Table.Td>98-99%</Table.Td>
                  <Table.Td>&lt;2%</Table.Td>
                  <Table.Td>Just-in-Time</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td><Badge color="blue">AY</Badge></Table.Td>
                  <Table.Td>20-30 дней</Table.Td>
                  <Table.Td>7-12 дней</Table.Td>
                  <Table.Td>Через день</Table.Td>
                  <Table.Td>95-97%</Table.Td>
                  <Table.Td>2-4%</Table.Td>
                  <Table.Td>Адаптивное планирование</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td><Badge color="orange">AZ</Badge></Table.Td>
                  <Table.Td>30-45 дней</Table.Td>
                  <Table.Td>15-25 дней</Table.Td>
                  <Table.Td>Ежедневно</Table.Td>
                  <Table.Td>90-95%</Table.Td>
                  <Table.Td>4-6%</Table.Td>
                  <Table.Td>Гибкие поставки</Table.Td>
                </Table.Tr>
                <Table.Tr style={{ backgroundColor: 'var(--mantine-color-red-0)' }}>
                  <Table.Td><Badge color="red" variant="filled">CZ</Badge></Table.Td>
                  <Table.Td>0-30 дней (цель: 0)</Table.Td>
                  <Table.Td>0 дней</Table.Td>
                  <Table.Td>Еженедельно</Table.Td>
                  <Table.Td>70-80%</Table.Td>
                  <Table.Td>&gt;10% (УБЫТОК)</Table.Td>
                  <Table.Td><Text c="red" fw={700}>ЛИКВИДАЦИЯ</Text></Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>

        {/* Модальное окно группы */}
        <Modal
          opened={groupModalOpened}
          onClose={() => setGroupModalOpened(false)}
          title={`Группа ${selectedGroup} - Детальный анализ`}
          size="xl"
        >
          {selectedGroup && warehouseData.abcxyzMatrix[selectedGroup as keyof typeof warehouseData.abcxyzMatrix] && (
            <Stack>
              <Alert 
                color={selectedGroup === 'CZ' ? 'red' : selectedGroup.startsWith('A') ? 'blue' : 'green'} 
                variant="light"
                icon={selectedGroup === 'CZ' ? <IconSkull size={16} /> : <IconInfoCircle size={16} />}
              >
                <Stack gap="xs">
                  <Text fw={600}>Характеристики группы {selectedGroup}:</Text>
                  <Text size="sm">
                    {selectedGroup === 'AX' && 'Золотые товары - основа бизнеса. Стабильный спрос, высокая выручка.'}
                    {selectedGroup === 'AY' && 'Звезды с умеренной волатильностью. Требуют буферных запасов.'}
                    {selectedGroup === 'AZ' && 'Проблемные хиты. Высокая выручка, но нестабильный спрос.'}
                    {selectedGroup === 'CZ' && 'КРИТИЧЕСКАЯ ГРУППА! Низкая выручка + нестабильный спрос = убытки.'}
                  </Text>
                </Stack>
              </Alert>
              
              <Grid>
                <Grid.Col span={6}>
                  <Paper p="md" radius="md" withBorder>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed">Параметры управления</Text>
                      <Text size="sm">• Норматив запаса: <Text span fw={600}>{warehouseData.abcxyzMatrix[selectedGroup as keyof typeof warehouseData.abcxyzMatrix].norm} дней</Text></Text>
                      <Text size="sm">• Оборачиваемость: <Text span fw={600}>{warehouseData.abcxyzMatrix[selectedGroup as keyof typeof warehouseData.abcxyzMatrix].turnover} раз/год</Text></Text>
                      <Text size="sm">• Текущий запас: <Text span fw={600} c={selectedGroup === 'CZ' ? 'red' : undefined}>{warehouseData.abcxyzMatrix[selectedGroup as keyof typeof warehouseData.abcxyzMatrix].stockDays} дней</Text></Text>
                    </Stack>
                  </Paper>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <Paper p="md" radius="md" withBorder>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed">Экономика</Text>
                      <Text size="sm">• Товаров: <Text span fw={600}>{warehouseData.abcxyzMatrix[selectedGroup as keyof typeof warehouseData.abcxyzMatrix].count}</Text></Text>
                      <Text size="sm">• Доля выручки: <Text span fw={600}>{warehouseData.abcxyzMatrix[selectedGroup as keyof typeof warehouseData.abcxyzMatrix].revenue}%</Text></Text>
                      {selectedGroup === 'CZ' && (
                        <Text size="sm" c="red">• Убытки: <Text span fw={700}>{(warehouseData.kpi.czStorageCost / 1000).toFixed(0)}к ₽/мес</Text></Text>
                      )}
                    </Stack>
                  </Paper>
                </Grid.Col>
              </Grid>
              
              {selectedGroup === 'CZ' && (
                <Alert color="red" icon={<IconFlame size={16} />}>
                  <Stack gap="xs">
                    <Text fw={600}>План действий:</Text>
                    <Text size="sm">1. Немедленно остановить все закупки товаров CZ</Text>
                    <Text size="sm">2. Запустить агрессивные скидки 50-90%</Text>
                    <Text size="sm">3. Рассмотреть возврат поставщику или списание</Text>
                    <Text size="sm">4. Целевой срок ликвидации: 30-60 дней</Text>
                  </Stack>
                </Alert>
              )}
            </Stack>
          )}
        </Modal>

        {/* Модальное окно ликвидации CZ */}
        <Modal
          opened={liquidationModalOpened}
          onClose={() => setLiquidationModalOpened(false)}
          title="План ликвидации товаров CZ"
          size="xl"
        >
          <Stack>
            <Alert color="red" icon={<IconSkull size={16} />}>
              <Text fw={600}>Критическая ситуация: {warehouseData.kpi.czProductsCount} товаров создают убытки</Text>
            </Alert>
            
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={600}>Топ товаров для немедленной ликвидации</Text>
                <Badge color="red" size="lg">Убыток: {(warehouseData.kpi.czStorageCost / 1000).toFixed(0)}к ₽/мес</Badge>
              </Group>
              
              <Stack gap="xs">
                {warehouseData.czProducts.map((product) => (
                  <Paper key={product.sku} p="sm" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text fw={600}>{product.name}</Text>
                        <Text size="sm" c="dimmed">SKU: {product.sku}</Text>
                      </div>
                      <Group>
                        <Stack gap={0} align="end">
                          <Text size="sm">Остаток: {product.stock} шт</Text>
                          <Text size="sm" c="red">Убыток: {(product.monthlyLoss / 1000).toFixed(1)}к/мес</Text>
                        </Stack>
                        <Button color="red" size="sm">
                          Скидка {product.liquidationDiscount}%
                        </Button>
                      </Group>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Paper>
            
            <Grid>
              <Grid.Col span={6}>
                <Paper p="md" withBorder>
                  <Text fw={600} mb="xs">Экономический эффект ликвидации</Text>
                  <Stack gap="xs">
                    <Text size="sm">• Высвобождение капитала: <Text span fw={600}>{(warehouseData.kpi.czStockValue / 1000000).toFixed(1)}М ₽</Text></Text>
                    <Text size="sm">• Экономия на хранении: <Text span fw={600}>{(warehouseData.kpi.czStorageCost * 12 / 1000000).toFixed(1)}М ₽/год</Text></Text>
                    <Text size="sm">• Освобождение склада: <Text span fw={600}>~15% площади</Text></Text>
                    <Text size="sm" c="green" fw={600}>• Общая выгода: {((warehouseData.kpi.czStorageCost * 12 + warehouseData.kpi.czStockValue * 0.15) / 1000000).toFixed(1)}М ₽</Text>
                  </Stack>
                </Paper>
              </Grid.Col>
              
              <Grid.Col span={6}>
                <Paper p="md" withBorder>
                  <Text fw={600} mb="xs">План ликвидации</Text>
                  <Timeline bulletSize={20} lineWidth={2}>
                    <Timeline.Item bullet={<IconBan size={12} />} title="Неделя 1-2">
                      <Text size="xs" c="dimmed">Остановка закупок CZ</Text>
                    </Timeline.Item>
                    <Timeline.Item bullet={<IconCoin size={12} />} title="Неделя 3-4">
                      <Text size="xs" c="dimmed">Скидки 30-50%</Text>
                    </Timeline.Item>
                    <Timeline.Item bullet={<IconFlame size={12} />} title="Месяц 2">
                      <Text size="xs" c="dimmed">Скидки 50-70%</Text>
                    </Timeline.Item>
                    <Timeline.Item bullet={<IconX size={12} />} title="Месяц 3">
                      <Text size="xs" c="dimmed">Списание остатков</Text>
                    </Timeline.Item>
                  </Timeline>
                </Paper>
              </Grid.Col>
            </Grid>
            
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setLiquidationModalOpened(false)}>
                Отмена
              </Button>
              <Button color="red" leftSection={<IconFlame size={16} />}>
                Запустить ликвидацию
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}