import * as React from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import {
  AppShell,
  Container,
  Group,
  Title,
  Card,
  Text,
  SimpleGrid,
  Tabs,
  Table,
  Badge,
  Progress,
  ActionIcon,
  Button,
  MultiSelect,
  Paper,
  Stack,
  Grid,
  ThemeIcon,
  RingProgress,
  Timeline,
  Alert,
  Drawer,
  TextInput,
  NumberInput,
  Select,
  Modal,
  Tooltip,
  ScrollArea,
  Box,
  Divider,
  Avatar,
  Menu,
  Indicator,
  SegmentedControl,
  Collapse,
  UnstyledButton,
  Loader,
  rem
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import ReactECharts from 'echarts-for-react';
import { create } from 'zustand';
import ExpandableKPIGrid, { LegacyExpandableKPIGrid, type KPICardData } from '../components/ExpandableKPIGrid';
import YandexSupplyGraphMap from '../components/YandexSupplyGraphMap';
import { supplyNodes, supplyEdges } from '../data/supplyTestData';
import {
  IconTruck,
  IconPackage,
  IconClock,
  IconCurrencyRubel,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconFilter,
  IconDownload,
  IconSettings,
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconChevronRight,
  IconMapPin,
  IconShip,
  IconTrain,
  IconPlane,
  IconBell,
  IconChartBar,
  IconChartLine,
  IconChartPie,
  IconChartDots,
  IconRefresh,
  IconDots,
  IconCalendar,
  IconWorld,
  IconBuilding,
  IconFileInvoice,
  IconPhoto,
  IconMessage,
  IconHistory,
  IconCalculator,
  IconAdjustments,
  IconBox,
  IconAlertTriangle
} from '@tabler/icons-react';

// Компонент финансовой аналитики
const FinancialAnalytics = () => {
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
  const chartRef3 = useRef<HTMLDivElement>(null);
  const [chartReady1, setChartReady1] = useState(false);
  const [chartReady2, setChartReady2] = useState(false);
  const [chartReady3, setChartReady3] = useState(false);

  useEffect(() => {
    const checkDimensions = (ref: React.RefObject<HTMLDivElement>, setReady: (ready: boolean) => void) => {
      if (ref.current) {
        const { clientWidth, clientHeight } = ref.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setReady(true);
        }
      }
    };

    const timer1 = setTimeout(() => checkDimensions(chartRef1, setChartReady1), 100);
    const timer2 = setTimeout(() => checkDimensions(chartRef2, setChartReady2), 150);
    const timer3 = setTimeout(() => checkDimensions(chartRef3, setChartReady3), 200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  const costStructureOption = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
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
        data: [
          { value: 65, name: 'Стоимость товара' },
          { value: 15, name: 'Доставка до границы' },
          { value: 10, name: 'Таможня и пошлины' },
          { value: 7, name: 'Внутренняя логистика' },
          { value: 3, name: 'Страхование' }
        ]
      }
    ]
  };
  
  const landedCostOption = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']
    },
    yAxis: {
      type: 'value',
      name: '₽ за единицу'
    },
    series: [
      {
        data: [150, 145, 148, 143, 140, 138],
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.2
        }
      }
    ]
  };
  
  // ABC-анализ
  const abcOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: {
      type: 'category',
      data: ['SKU-001', 'SKU-002', 'SKU-003', 'SKU-004', 'SKU-005', 'SKU-006', 'SKU-007', 'SKU-008']
    },
    yAxis: [
      {
        type: 'value',
        name: 'Выручка (млн ₽)',
        position: 'left'
      },
      {
        type: 'value',
        name: 'Накопленный %',
        position: 'right',
        max: 100
      }
    ],
    series: [
      {
        name: 'Выручка',
        type: 'bar',
        data: [4.5, 3.2, 2.8, 1.5, 0.8, 0.5, 0.3, 0.2],
        itemStyle: {
          color: function(params: any) {
            const colors = ['#51cf66', '#51cf66', '#51cf66', '#f59f00', '#f59f00', '#fa5252', '#fa5252', '#fa5252'];
            return colors[params.dataIndex];
          }
        }
      },
      {
        name: 'Накопленный %',
        type: 'line',
        yAxisIndex: 1,
        data: [35, 60, 82, 93, 96, 98, 99, 100],
        smooth: true
      }
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  };
  
  // Сравнение маршрутов
  const routeComparisonData = [
    { route: 'Море', days: 40, cost: 15, reliability: 85 },
    { route: 'Ж/д', days: 30, cost: 20, reliability: 90 },
    { route: 'Авиа', days: 10, cost: 45, reliability: 95 },
    { route: 'Авто', days: 20, cost: 25, reliability: 88 }
  ];
  
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="md" fw={500} mb="md">Структура затрат</Text>
          <div ref={chartRef1} style={{ height: '300px', width: '100%' }}>
            {chartReady1 && (
              <ReactECharts 
                option={costStructureOption} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            )}
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="md" fw={500} mb="md">Динамика Landed Cost Per Unit</Text>
          <div ref={chartRef2} style={{ height: '300px', width: '100%' }}>
            {chartReady2 && (
              <ReactECharts 
                option={landedCostOption} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            )}
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Text size="md" fw={500}>ABC-анализ товаров</Text>
            <Group gap="xs">
              <Badge color="green">A: 70% выручки</Badge>
              <Badge color="yellow">B: 20% выручки</Badge>
              <Badge color="red">C: 10% выручки</Badge>
            </Group>
          </Group>
          <div ref={chartRef3} style={{ height: '300px', width: '100%' }}>
            {chartReady3 && (
              <ReactECharts 
                option={abcOption} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            )}
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="md" fw={500} mb="md">Сравнение маршрутов</Text>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Способ</Table.Th>
                <Table.Th>Дни</Table.Th>
                <Table.Th>Цена</Table.Th>
                <Table.Th>Надежность</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {routeComparisonData.map((route) => (
                <Table.Tr key={route.route}>
                  <Table.Td>{route.route}</Table.Td>
                  <Table.Td>{route.days}</Table.Td>
                  <Table.Td>{route.cost}%</Table.Td>
                  <Table.Td>
                    <Badge color={route.reliability >= 90 ? 'green' : 'yellow'}>
                      {route.reliability}%
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Grid.Col>
    </Grid>
  );
};// Компонент операционных метрик
const OperationalMetrics = () => {
  const deliveries = useDeliveriesStore((state) => state.deliveries);
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
  const chartRef3 = useRef<HTMLDivElement>(null);
  const [chartReady1, setChartReady1] = useState(false);
  const [chartReady2, setChartReady2] = useState(false);
  const [chartReady3, setChartReady3] = useState(false);

  useEffect(() => {
    const checkDimensions = (ref: React.RefObject<HTMLDivElement>, setReady: (ready: boolean) => void) => {
      if (ref.current) {
        const { clientWidth, clientHeight } = ref.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setReady(true);
        }
      }
    };

    const timer1 = setTimeout(() => checkDimensions(chartRef1, setChartReady1), 100);
    const timer2 = setTimeout(() => checkDimensions(chartRef2, setChartReady2), 150);
    const timer3 = setTimeout(() => checkDimensions(chartRef3, setChartReady3), 200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  
  // Control Chart для качества процессов
  const controlChartOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    },
    yAxis: {
      type: 'value',
      min: 90,
      max: 100,
      axisLabel: { formatter: '{value}%' }
    },
    series: [
      {
        name: 'Качество',
        type: 'line',
        data: [96, 97, 95, 98, 97, 96, 98],
        markLine: {
          data: [
            { yAxis: 98, name: 'UCL', lineStyle: { color: '#fa5252' } },
            { yAxis: 95, name: 'LCL', lineStyle: { color: '#fa5252' } },
            { type: 'average', name: 'Среднее' }
          ]
        }
      }
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  };
  
  // Pareto Chart причин задержек
  const paretoOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Таможня', 'Транспорт', 'Документы', 'Погода', 'Склад', 'Прочее']
    },
    yAxis: [
      { type: 'value', name: 'Количество' },
      { type: 'value', name: 'Накопленный %', max: 100 }
    ],
    series: [
      {
        name: 'Задержки',
        type: 'bar',
        data: [45, 32, 18, 12, 8, 5],
        itemStyle: { color: '#339af0' }
      },
      {
        name: 'Накопленный %',
        type: 'line',
        yAxisIndex: 1,
        data: [37.5, 64.2, 79.2, 89.2, 95.8, 100],
        itemStyle: { color: '#fa5252' }
      }
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  };
  
  // Forecast Accuracy
  const forecastOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Прогноз', 'Факт'] },
    xAxis: {
      type: 'category',
      data: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']
    },
    yAxis: { type: 'value', name: 'Единиц' },
    series: [
      {
        name: 'Прогноз',
        type: 'line',
        data: [5000, 5200, 5500, 5300, 5600, 5800],
        lineStyle: { type: 'dashed' }
      },
      {
        name: 'Факт',
        type: 'line',
        data: [4800, 5300, 5100, 5400, 5200, 5500]
      }
    ]
  };

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="md" fw={500} mb="md">Control Chart - Качество процессов</Text>
          <div ref={chartRef1} style={{ height: '300px', width: '100%' }}>
            {chartReady1 && (
              <ReactECharts 
                option={controlChartOption} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            )}
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="md" fw={500} mb="md">Pareto - Причины задержек</Text>
          <div ref={chartRef2} style={{ height: '300px', width: '100%' }}>
            {chartReady2 && (
              <ReactECharts 
                option={paretoOption} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            )}
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="md" fw={500} mb="md">Точность прогнозирования</Text>
          <div ref={chartRef3} style={{ height: '300px', width: '100%' }}>
            {chartReady3 && (
              <ReactECharts 
                option={forecastOption} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            )}
          </div>
        </Card>
      </Grid.Col>
    </Grid>
  );
};



// Типы для данных
interface Delivery {
  id: string;
  supplier: string;
  supplierCountry: string;
  sendDate: string;
  plannedDate: string;
  status: string;
  progress: number;
  warehouse: string;
  quantity: number;
  weight: number;
  volume: number;
  productCost: number;
  logisticsCost: number;
  trackNumber: string;
  transportType: string;
  currentLocation: string;
  daysInTransit: number;
  qualityRate: number;
  // Новые поля
  category: string;
  sellerArticle: string;
  quantityPacked: number;
  quantityAccepted: number;
  quantityInSale: number;
  plannedAcceptanceDate: string;
  actualAcceptanceDate: string;
}

interface Supplier {
  id: string;
  name: string;
  country: string;
  rating: number;
  deliveries: number;
  onTimeRate: number;
  defectRate: number;
  avgDeliveryCost: number;
  leadTime: number;
}

interface Alert {
  id: string | number;
  type: string;
  message: string;
  timestamp: string;
}

interface DeliveriesStore {
  deliveries: Delivery[];
  suppliers: Supplier[];
  alerts: Alert[];
  setDeliveries: (deliveries: Delivery[]) => void;
  addDelivery: (delivery: Delivery) => void;
  updateDelivery: (id: string, updates: Partial<Delivery>) => void;
}

// Zustand store для управления состоянием
const useDeliveriesStore = create<DeliveriesStore>((set) => ({
  deliveries: [
    {
      id: 'DEL-001',
      supplier: 'Shanghai Trading Co.',
      supplierCountry: 'Китай',
      sendDate: '2024-01-15',
      plannedDate: '2024-02-20',
      status: 'in_transit',
      progress: 65,
      warehouse: 'Коледино',
      quantity: 5000,
      weight: 1200,
      volume: 8.5,
      productCost: 850000,
      logisticsCost: 127500,
      trackNumber: 'SF6043877825CN',
      transportType: 'sea',
      currentLocation: 'Владивосток',
      daysInTransit: 18,
      qualityRate: 98.5,
      category: 'Электроника',
      sellerArticle: 'SH-EL-001',
      quantityPacked: 5000,
      quantityAccepted: 0,
      quantityInSale: 0,
      plannedAcceptanceDate: '2024-02-22',
      actualAcceptanceDate: ''
    },
    {
      id: 'DEL-002',
      supplier: 'Guangzhou Electronics',
      supplierCountry: 'Китай',
      sendDate: '2024-01-20',
      plannedDate: '2024-02-15',
      status: 'delayed',
      progress: 45,
      warehouse: 'Электросталь',
      quantity: 3000,
      weight: 800,
      volume: 5.2,
      productCost: 620000,
      logisticsCost: 93000,
      trackNumber: 'YT2156789345CN',
      transportType: 'rail',
      currentLocation: 'Алматы',
      daysInTransit: 15,
      qualityRate: 97.2,
      category: 'Компьютеры',
      sellerArticle: 'GZ-COMP-002',
      quantityPacked: 3000,
      quantityAccepted: 0,
      quantityInSale: 0,
      plannedAcceptanceDate: '2024-02-17',
      actualAcceptanceDate: ''
    },
    {
      id: 'DEL-003',
      supplier: 'Shenzhen Textiles',
      supplierCountry: 'Китай',
      sendDate: '2024-01-25',
      plannedDate: '2024-02-05',
      status: 'delivered',
      progress: 100,
      warehouse: 'Подольск',
      quantity: 8000,
      weight: 2400,
      volume: 15.0,
      productCost: 1200000,
      logisticsCost: 180000,
      trackNumber: 'ZTO7823456912CN',
      transportType: 'air',
      currentLocation: 'Подольск',
      daysInTransit: 10,
      qualityRate: 99.1,
      category: 'Текстиль',
      sellerArticle: 'SZ-TEX-003',
      quantityPacked: 8000,
      quantityAccepted: 7850,
      quantityInSale: 7650,
      plannedAcceptanceDate: '2024-02-07',
      actualAcceptanceDate: '2024-02-06'
    },
    {
      id: 'DEL-004',
      supplier: 'Beijing Manufacturing',
      supplierCountry: 'Китай',
      sendDate: '2024-02-01',
      plannedDate: '2024-02-25',
      status: 'in_transit',
      progress: 30,
      warehouse: 'Коледино',
      quantity: 2500,
      weight: 600,
      volume: 4.2,
      productCost: 450000,
      logisticsCost: 67500,
      trackNumber: 'BJ9876543210CN',
      transportType: 'rail',
      currentLocation: 'Новосибирск',
      daysInTransit: 8,
      qualityRate: 96.8,
      category: 'Бытовая техника',
      sellerArticle: 'BJ-TECH-004',
      quantityPacked: 2500,
      quantityAccepted: 0,
      quantityInSale: 0,
      plannedAcceptanceDate: '2024-02-27',
      actualAcceptanceDate: ''
    },
    {
      id: 'DEL-005',
      supplier: 'Dongguan Sports',
      supplierCountry: 'Китай',
      sendDate: '2024-01-28',
      plannedDate: '2024-02-18',
      status: 'delayed',
      progress: 75,
      warehouse: 'Электросталь',
      quantity: 4200,
      weight: 950,
      volume: 6.8,
      productCost: 680000,
      logisticsCost: 102000,
      trackNumber: 'DG5432167890CN',
      transportType: 'sea',
      currentLocation: 'Владивосток',
      daysInTransit: 12,
      qualityRate: 94.5,
      category: 'Спорттовары',
      sellerArticle: 'DG-SPORT-005',
      quantityPacked: 4200,
      quantityAccepted: 0,
      quantityInSale: 0,
      plannedAcceptanceDate: '2024-02-20',
      actualAcceptanceDate: ''
    },
    {
      id: 'DEL-006',
      supplier: 'Hangzhou Fashion',
      supplierCountry: 'Китай',
      sendDate: '2024-02-05',
      plannedDate: '2024-03-01',
      status: 'in_transit',
      progress: 15,
      warehouse: 'Подольск',
      quantity: 6500,
      weight: 1800,
      volume: 12.5,
      productCost: 920000,
      logisticsCost: 138000,
      trackNumber: 'HZ1234567890CN',
      transportType: 'air',
      currentLocation: 'Алматы',
      daysInTransit: 4,
      qualityRate: 98.2,
      category: 'Одежда',
      sellerArticle: 'HZ-FASH-006',
      quantityPacked: 6500,
      quantityAccepted: 0,
      quantityInSale: 0,
      plannedAcceptanceDate: '2024-03-03',
      actualAcceptanceDate: ''
    },
    {
      id: 'DEL-007',
      supplier: 'Tianjin Tools',
      supplierCountry: 'Китай',
      sendDate: '2024-01-18',
      plannedDate: '2024-02-08',
      status: 'delivered',
      progress: 100,
      warehouse: 'Коледино',
      quantity: 1800,
      weight: 420,
      volume: 2.8,
      productCost: 320000,
      logisticsCost: 48000,
      trackNumber: 'TJ0987654321CN',
      transportType: 'rail',
      currentLocation: 'Коледино',
      daysInTransit: 21,
      qualityRate: 97.8,
      category: 'Инструменты',
      sellerArticle: 'TJ-TOOL-007',
      quantityPacked: 1800,
      quantityAccepted: 1750,
      quantityInSale: 1680,
      plannedAcceptanceDate: '2024-02-10',
      actualAcceptanceDate: '2024-02-09'
    },
    {
      id: 'DEL-008',
      supplier: 'Qingdao Marine',
      supplierCountry: 'Китай',
      sendDate: '2024-02-08',
      plannedDate: '2024-03-05',
      status: 'in_transit',
      progress: 8,
      warehouse: 'Электросталь',
      quantity: 3200,
      weight: 850,
      volume: 7.2,
      productCost: 580000,
      logisticsCost: 87000,
      trackNumber: 'QD2468135790CN',
      transportType: 'sea',
      currentLocation: 'Шанхай',
      daysInTransit: 1,
      qualityRate: 95.6,
      category: 'Морские товары',
      sellerArticle: 'QD-MAR-008',
      quantityPacked: 3200,
      quantityAccepted: 0,
      quantityInSale: 0,
      plannedAcceptanceDate: '2024-03-07',
      actualAcceptanceDate: ''
    }
  ],
  
  suppliers: [
    {
      id: 'SUP-001',
      name: 'Shanghai Trading Co.',
      country: 'Китай',
      rating: 4.8,
      deliveries: 45,
      onTimeRate: 92,
      defectRate: 1.5,
      avgDeliveryCost: 28500,
      leadTime: 35
    },
    {
      id: 'SUP-002',
      name: 'Guangzhou Electronics',
      country: 'Китай',
      rating: 4.5,
      deliveries: 32,
      onTimeRate: 85,
      defectRate: 2.8,
      avgDeliveryCost: 31000,
      leadTime: 30
    },
    {
      id: 'SUP-003',
      name: 'Shenzhen Textiles',
      country: 'Китай',
      rating: 4.9,
      deliveries: 58,
      onTimeRate: 95,
      defectRate: 0.9,
      avgDeliveryCost: 22500,
      leadTime: 25
    }
  ],
  
  alerts: [
    {
      id: 1,
      type: 'critical',
      message: 'Поставка DEL-002 задерживается на 5 дней',
      timestamp: '2024-02-01 14:30'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Приближается reorder point для SKU-1234',
      timestamp: '2024-02-01 12:15'
    },
    {
      id: 3,
      type: 'info',
      message: 'Поставка DEL-003 прибыла на склад Подольск',
      timestamp: '2024-02-01 10:45'
    }
  ],
  

  
  setDeliveries: (deliveries) => set({ deliveries }),
  addDelivery: (delivery) => set((state) => ({ 
    deliveries: [...state.deliveries, delivery] 
  })),
  updateDelivery: (id, updates) => set((state) => ({
    deliveries: state.deliveries.map(d => d.id === id ? { ...d, ...updates } : d)
  }))
}));

// Компонент KPI карточки
interface KPICardProps {
  title: string;
  value: string;
  target?: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
  type?: string;
}

const KPICard = ({ title, value, target, trend, icon, color }: KPICardProps) => {
  const isPositive = trend > 0;
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text size="sm" c="dimmed" fw={500}>{title}</Text>
        <ThemeIcon color={color} size="lg" radius="md">
          {icon}
        </ThemeIcon>
      </Group>
      
      <Text size="xl" fw={700} mb="xs">{value}</Text>
      
      {target && (
        <Text size="xs" c="dimmed" mb="xs">
          Цель: {target}
        </Text>
      )}
      
      <Group gap="xs">
        {isPositive ? (
          <IconTrendingUp size={16} color="var(--mantine-color-green-6)" />
        ) : (
          <IconTrendingDown size={16} color="var(--mantine-color-red-6)" />
        )}
        <Text size="xs" c={isPositive ? 'green' : 'red'}>
          {isPositive ? '+' : ''}{trend}%
        </Text>
      </Group>
    </Card>
  );
};



// Компонент складов и остатков
const InventoryAnalytics = () => {
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
  const [chartReady1, setChartReady1] = useState(false);
  const [chartReady2, setChartReady2] = useState(false);

  useEffect(() => {
    const checkDimensions = (ref: React.RefObject<HTMLDivElement>, setReady: (ready: boolean) => void) => {
      if (ref.current) {
        const { clientWidth, clientHeight } = ref.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setReady(true);
        }
      }
    };

    const timer1 = setTimeout(() => checkDimensions(chartRef1, setChartReady1), 100);
    const timer2 = setTimeout(() => checkDimensions(chartRef2, setChartReady2), 150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  // Распределение по складам
  const warehouseDistributionOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Коледино', 'Электросталь', 'Подольск', 'Казань', 'Екатеринбург']
    },
    yAxis: { type: 'value', name: 'Единиц' },
    series: [
      {
        name: 'Текущий остаток',
        type: 'bar',
        data: [15000, 12000, 8000, 6000, 4500],
        itemStyle: { color: '#339af0' }
      },
      {
        name: 'Оптимальный уровень',
        type: 'line',
        data: [14000, 13000, 7500, 7000, 5000],
        lineStyle: { type: 'dashed', color: '#51cf66' }
      }
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  };
  
  // Дни запаса по SKU
  const stockDaysOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value', name: 'Дни запаса' },
    yAxis: {
      type: 'category',
      data: ['SKU-001', 'SKU-002', 'SKU-003', 'SKU-004', 'SKU-005']
    },
    series: [{
      type: 'bar',
      data: [
        { value: 45, itemStyle: { color: '#51cf66' } },
        { value: 12, itemStyle: { color: '#fa5252' } },
        { value: 30, itemStyle: { color: '#339af0' } },
        { value: 8, itemStyle: { color: '#fa5252' } },
        { value: 25, itemStyle: { color: '#f59f00' } }
      ],
      markLine: {
        data: [{ xAxis: 30, label: { formatter: 'Оптимум' } }]
      }
    }],
    grid: { left: '10%', right: '4%', bottom: '3%', containLabel: true }
  };
  
  // Reorder Points
  const reorderData = [
    { sku: 'SKU-001', current: 1200, reorderPoint: 1500, orderQty: 5000, status: 'warning' },
    { sku: 'SKU-002', current: 800, reorderPoint: 1000, orderQty: 3000, status: 'critical' },
    { sku: 'SKU-003', current: 2500, reorderPoint: 2000, orderQty: 4000, status: 'ok' },
    { sku: 'SKU-004', current: 500, reorderPoint: 800, orderQty: 2000, status: 'critical' },
    { sku: 'SKU-005', current: 1800, reorderPoint: 1600, orderQty: 3500, status: 'ok' }
  ];
  
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="md" fw={500} mb="md">Распределение по складам</Text>
          <div ref={chartRef1} style={{ height: '250px', width: '100%' }}>
            {chartReady1 && (
              <ReactECharts 
                option={warehouseDistributionOption} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            )}
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="md" fw={500} mb="md">Дни запаса по SKU</Text>
          <div ref={chartRef2} style={{ height: '250px', width: '100%' }}>
            {chartReady2 && (
              <ReactECharts 
                option={stockDaysOption} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            )}
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Text size="md" fw={500}>Reorder Points</Text>
          </Group>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>SKU</Table.Th>
                <Table.Th>Текущий остаток</Table.Th>
                <Table.Th>Reorder Point</Table.Th>
                <Table.Th>Рекомендуемый заказ</Table.Th>
                <Table.Th style={{ width: '200px', minWidth: '200px' }}>Статус</Table.Th>
                <Table.Th>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {reorderData.map((item) => (
                <Table.Tr key={item.sku}>
                  <Table.Td fw={500}>{item.sku}</Table.Td>
                  <Table.Td>{item.current}</Table.Td>
                  <Table.Td>{item.reorderPoint}</Table.Td>
                  <Table.Td>{item.orderQty}</Table.Td>
                  <Table.Td>
                    <Badge 
                      color={
                        item.status === 'critical' ? 'red' : 
                        item.status === 'warning' ? 'yellow' : 'green'
                      }
                    >
                      {item.status === 'critical' ? 'Критично' : 
                       item.status === 'warning' ? 'Внимание' : 'В норме'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Button size="xs" variant="light">Заказать</Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

// Типы для Yandex Maps API
declare global {
  interface Window {
    ymaps: any;
  }
}



// Типы для данных маршрутов
interface RouteData {
  id: string;
  name: string;
  origin: string;
  destination: string;
  coordinates: [number, number][];
  status: 'active' | 'completed' | 'delayed' | 'planned';
  deliveryId: string;
  transportType: 'truck' | 'train' | 'ship' | 'plane';
  progress: number;
}

// Данные маршрутов поставок
const routesData: RouteData[] = [
  {
    id: 'route-001',
    name: 'Шанхай → Владивосток',
    origin: 'Шанхай',
    destination: 'Владивосток',
    coordinates: [[121.4737, 31.2304], [131.8613, 43.2918]],
    status: 'active',
    deliveryId: 'DEL-2024-001',
    transportType: 'ship',
    progress: 65
  },
  {
    id: 'route-002',
    name: 'Гуанчжоу → Алматы',
    origin: 'Гуанчжоу',
    destination: 'Алматы',
    coordinates: [[113.2644, 23.1291], [76.9129, 43.2380]],
    status: 'active',
    deliveryId: 'DEL-2024-002',
    transportType: 'train',
    progress: 45
  },
  {
    id: 'route-003',
    name: 'Шэньчжэнь → Москва',
    origin: 'Шэньчжэнь',
    destination: 'Москва',
    coordinates: [[114.0579, 22.5431], [55.7558, 37.6176]],
    status: 'delayed',
    deliveryId: 'DEL-2024-003',
    transportType: 'plane',
    progress: 30
  },
  {
    id: 'route-004',
    name: 'Пекин → Екатеринбург',
    origin: 'Пекин',
    destination: 'Екатеринбург',
    coordinates: [[116.4074, 39.9042], [60.6454, 56.8431]],
    status: 'planned',
    deliveryId: 'DEL-2024-004',
    transportType: 'train',
    progress: 0
  }
];

// Компонент карты маршрутов поставок из Китая
const RoutesMap = () => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedEdge, setSelectedEdge] = useState<any>(null);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <YandexSupplyGraphMap
        nodes={supplyNodes}
        edges={supplyEdges}
        onNodeClick={setSelectedNode}
        onEdgeClick={setSelectedEdge}
      />
    </div>
  );
};

// Компонент Timeline поставок
const DeliveryTimeline = () => {
  const deliveries = useDeliveriesStore((state) => state.deliveries);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    const checkDimensions = () => {
      if (chartRef.current) {
        const { clientWidth, clientHeight } = chartRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setChartReady(true);
        }
      }
    };

    checkDimensions();
    const timer = setTimeout(checkDimensions, 100);
    window.addEventListener('resize', checkDimensions);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkDimensions);
    };
  }, []);
  
  const ganttOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const delivery = deliveries[params.dataIndex];
        return `
          <div style="padding: 8px;">
            <strong>${delivery.id}</strong><br/>
            Поставщик: ${delivery.supplier}<br/>
            Отправка: ${delivery.sendDate}<br/>
            План доставки: ${delivery.plannedDate}<br/>
            Статус: ${delivery.status === 'delivered' ? 'Доставлено' : 
                      delivery.status === 'delayed' ? 'Задержка' : 'В пути'}<br/>
            Прогресс: ${delivery.progress}%
          </div>
        `;
      }
    },
    grid: {
      left: '15%',
      right: '10%',
      top: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#e9ecef',
          type: 'dashed'
        }
      },
      axisLabel: {
        formatter: (value: number) => {
          const date = new Date(value);
          return `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        }
      }
    },
    yAxis: {
      type: 'category',
      data: deliveries.map(d => d.id),
      axisLabel: {
        fontSize: 11
      }
    },
    series: [
      {
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const categoryIndex = params.dataIndex;
          const startTime = api.value(0);
          const endTime = api.value(1);
          const start = api.coord([startTime, categoryIndex]);
          const end = api.coord([endTime, categoryIndex]);
          const height = api.size([0, 1])[1] * 0.6;
          const delivery = deliveries[categoryIndex];
          
          if (!delivery || start[0] === end[0]) {
            return null;
          }
          
          // Основная полоса (план)
          const mainRect = {
            type: 'rect',
            shape: {
              x: start[0],
              y: start[1] - height / 2,
              width: Math.max(end[0] - start[0], 2),
              height: height
            },
            style: {
              fill: delivery.status === 'delayed' ? '#fa5252' : 
                    delivery.status === 'delivered' ? '#51cf66' : '#339af0',
              opacity: 0.8,
              stroke: '#fff',
              lineWidth: 1
            }
          };
          
          // Полоса прогресса
          const progressWidth = Math.max((end[0] - start[0]) * (delivery.progress / 100), 1);
          const progressRect = {
            type: 'rect',
            shape: {
              x: start[0],
              y: start[1] - height / 2,
              width: progressWidth,
              height: height
            },
            style: {
              fill: delivery.status === 'delayed' ? '#c92a2a' : 
                    delivery.status === 'delivered' ? '#37b24d' : '#1971c2'
            }
          };
          
          return {
            type: 'group',
            children: [mainRect, progressRect]
          };
        },
        data: deliveries.map((d, idx) => [
          new Date(d.sendDate).getTime(),
          new Date(d.plannedDate).getTime(),
          idx
        ])
      }
    ]
  };
  
  return (
    <div ref={chartRef} style={{ height: '300px', width: '100%' }}>
      {chartReady && (
        <ReactECharts 
          option={ganttOption} 
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      )}
    </div>
  );
};

// Компонент анализа поставщиков
const SupplierAnalysis = () => {
  const suppliers = useDeliveriesStore((state) => state.suppliers);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    const checkDimensions = () => {
      if (chartRef.current) {
        const { clientWidth, clientHeight } = chartRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setChartReady(true);
        }
      }
    };

    const timer = setTimeout(checkDimensions, 100);
    return () => clearTimeout(timer);
  }, []);
  
  const radarOption = {
    tooltip: {},
    radar: {
      indicator: [
        { name: 'Цена', max: 100 },
        { name: 'Качество', max: 100 },
        { name: 'Сроки', max: 100 },
        { name: 'Надежность', max: 100 },
        { name: 'Гибкость', max: 100 }
      ]
    },
    series: [
      {
        type: 'radar',
        data: suppliers.map(s => ({
          value: [
            85,
            100 - s.defectRate * 10,
            s.onTimeRate,
            s.rating * 20,
            80
          ],
          name: s.name
        }))
      }
    ]
  };
  
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <div ref={chartRef} style={{ height: '300px', width: '100%' }}>
          {chartReady && (
            <ReactECharts 
              option={radarOption} 
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          )}
        </div>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Поставщик</Table.Th>
              <Table.Th>Рейтинг</Table.Th>
              <Table.Th>On-time</Table.Th>
              <Table.Th>Брак</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {suppliers.map((supplier) => (
              <Table.Tr key={supplier.id}>
                <Table.Td>{supplier.name}</Table.Td>
                <Table.Td>
                  <Badge color="blue">{supplier.rating}</Badge>
                </Table.Td>
                <Table.Td>{supplier.onTimeRate}%</Table.Td>
                <Table.Td>{supplier.defectRate}%</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Grid.Col>
    </Grid>
  );
};



// Главный компонент страницы
export default function DeliveriesControlPage() {
  const [dateRange, setDateRange] = useState<[any, any]>([new Date(2024, 0, 1), new Date()]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('suppliers');
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [alertsOpened, setAlertsOpened] = useState(true);
  const [newDeliveryOpened, setNewDeliveryOpened] = useState(false);
  const [calcOpened, setCalcOpened] = useState(false);

  const closeNewDelivery = () => setNewDeliveryOpened(false);
  const closeCalc = () => setCalcOpened(false);
  
  const { deliveries, suppliers, alerts } = useDeliveriesStore();
  
  // Расчет KPI
  const kpiData = useMemo(() => {
    const totalDeliveries = deliveries.length;
    const delayedDeliveries = deliveries.filter(d => d.status === 'delayed').length;
    const totalLogisticsCost = deliveries.reduce((sum, d) => sum + d.logisticsCost, 0);
    const totalProductCost = deliveries.reduce((sum, d) => sum + d.productCost, 0);
    const avgQualityRate = deliveries.reduce((sum, d) => sum + d.qualityRate, 0) / totalDeliveries;
    const totalVolume = deliveries.reduce((sum, d) => sum + d.volume, 0);
    const avgVolume = totalVolume / totalDeliveries;
    
    return {
      perfectOrderRate: ((totalDeliveries - delayedDeliveries) / totalDeliveries * 100).toFixed(1),
      avgDeliveryTime: 28,
      logisticsCostPercentage: (totalLogisticsCost / totalProductCost * 100).toFixed(1),
      avgQualityRate: avgQualityRate.toFixed(1),
      avgVolume: avgVolume.toFixed(1),
      totalVolume: totalVolume.toFixed(1),
      totalQuantity: deliveries.reduce((sum, d) => sum + d.quantity, 0),
      totalValue: totalProductCost
    };
  }, [deliveries]);
  
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      in_transit: { color: 'blue', label: 'В пути' },
      delayed: { color: 'red', label: 'Задержка' },
      delivered: { color: 'green', label: 'Доставлено' },
      customs: { color: 'orange', label: 'Таможня' }
    };
    
    const config = statusConfig[status] || { color: 'gray', label: 'Неизвестно' };
    return <Badge color={config.color}>{config.label}</Badge>;
  };
  
  const getTransportIcon = (type: string) => {
    const icons: Record<string, React.ReactElement> = {
      sea: <IconShip size={16} />,
      rail: <IconTrain size={16} />,
      air: <IconPlane size={16} />,
      truck: <IconTruck size={16} />
    };
    return icons[type] || <IconTruck size={16} />;
  };
  
  const openDeliveryDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    openDetails();
  };
  
  return (
    <Container size="xl" fluid>
      {/* Шапка страницы */}
      <Paper shadow="xs" p="md" mb="md">
        <Group justify="space-between" align="center">
          <Group>
            <Title order={2}>Поставки</Title>
            <Badge size="lg" variant="dot" color="green">
              Обновлено 5 мин назад
            </Badge>
          </Group>
          
          <Group>
            <DatePickerInput
              value={dateRange[0]}
              onChange={(date) => setDateRange([date, dateRange[1]])}
              placeholder="Выберите дату"
              style={{ width: 250 }}
            />
            <Button leftSection={<IconPlus size={16} />} color="blue" onClick={() => setNewDeliveryOpened(true)}>
              Новая поставка
            </Button>
            <ActionIcon variant="light" size="lg">
              <IconDownload size={18} />
            </ActionIcon>
            <ActionIcon variant="light" size="lg">
              <IconSettings size={18} />
            </ActionIcon>
          </Group>
        </Group>
        
        {/* Быстрые фильтры */}
        <Group mt="md" gap="sm">
          <MultiSelect
            placeholder="Статус"
            data={[
              { value: 'in_transit', label: 'В пути' },
              { value: 'delayed', label: 'Задержка' },
              { value: 'delivered', label: 'Доставлено' },
              { value: 'customs', label: 'Таможня' }
            ]}
            value={selectedStatuses}
            onChange={(value) => setSelectedStatuses(value)}
            clearable
            style={{ width: 200 }}
          />
          <MultiSelect
            placeholder="Поставщик"
            data={suppliers.map(s => ({ value: s.id, label: s.name }))}
            value={selectedSuppliers}
            onChange={(value) => setSelectedSuppliers(value)}
            clearable
            searchable
            style={{ width: 250 }}
          />
          <MultiSelect
            placeholder="Склад WB"
            data={[
              { value: 'koledino', label: 'Коледино' },
              { value: 'elektrostal', label: 'Электросталь' },
              { value: 'podolsk', label: 'Подольск' }
            ]}
            value={selectedWarehouses}
            onChange={(value) => setSelectedWarehouses(value)}
            clearable
            style={{ width: 200 }}
          />
          <Select
            placeholder="Страна"
            data={[
              { value: 'china', label: 'Китай' },
              { value: 'turkey', label: 'Турция' },
              { value: 'vietnam', label: 'Вьетнам' }
            ]}
            clearable
            style={{ width: 150 }}
          />
        </Group>
      </Paper>
      
      {/* KPI карточки с раскрывающейся детализацией */}
      <LegacyExpandableKPIGrid
        kpiData={[
          {
            id: 'perfect-order',
            title: 'Безупречные поставки',
            value: `${kpiData.perfectOrderRate}%`,
            target: '85-95%',
            trend: 3.2,
            icon: <IconCheck size={20} />,
            color: 'green'
          },
          {
            id: 'delivery-time',
            title: 'Средний срок доставки',
            value: `${kpiData.avgDeliveryTime} дней`,
            target: '25-30 дней',
            trend: -5.1,
            icon: <IconClock size={20} />,
            color: 'blue'
          },
          {
            id: 'logistics-cost',
            title: 'Логистические затраты',
            value: `${kpiData.logisticsCostPercentage}%`,
            target: '15-20%',
            trend: -2.3,
            icon: <IconCurrencyRubel size={20} />,
            color: 'orange'
          },
          {
            id: 'quality',
            title: 'Качество поставок',
            value: `${kpiData.avgQualityRate}%`,
            target: '>95%',
            trend: 1.5,
            icon: <IconPackage size={20} />,
            color: 'teal'
          },
          {
            id: 'avg-volume',
            title: 'Средний объем поставки',
            value: `${kpiData.avgVolume} м³`,
            target: '8-12 м³',
            trend: 2.1,
            icon: <IconBox size={20} />,
            color: 'violet'
          },
          {
            id: 'errors-incidents',
            title: 'Ошибки и инциденты',
            value: `${(100 - parseFloat(kpiData.perfectOrderRate)).toFixed(1)}%`,
            target: '<5%',
            trend: -1.2,
            icon: <IconAlertTriangle size={20} />,
            color: 'red'
          }
        ]}
        renderDetailContent={(cardId) => {
          switch (cardId) {
            case 'perfect-order':
              return (
                <Stack gap="md">
                  <Text size="lg" fw={600}>Детализация безупречных поставок</Text>
                  <Grid>
                    <Grid.Col span={6}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Успешные заказы</Text>
                        <Text size="xl" fw={700} c="green">{Math.round(deliveries.length * parseFloat(kpiData.perfectOrderRate) / 100)}</Text>
                        <Text size="xs" c="dimmed">из {deliveries.length} общих</Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Проблемные заказы</Text>
                        <Text size="xl" fw={700} c="red">{deliveries.filter(d => d.status === 'delayed').length}</Text>
                        <Text size="xs" c="dimmed">задержки и проблемы</Text>
                      </Card>
                    </Grid.Col>
                  </Grid>
                  <Text size="sm" c="dimmed">
                    Безупречные поставки показывают долю заказов, выполненных без ошибок, задержек и повреждений. 
                    Текущий показатель {kpiData.perfectOrderRate}% находится в целевом диапазоне 85-95%.
                  </Text>
                </Stack>
              );
            case 'delivery-time':
              return (
                <Stack gap="md">
                  <Text size="lg" fw={600}>Анализ сроков доставки</Text>
                  <Grid>
                    <Grid.Col span={4}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Быстрые (≤20 дней)</Text>
                        <Text size="xl" fw={700} c="green">{Math.round(deliveries.length * 0.25)}</Text>
                        <Progress value={25} color="green" size="xs" mt="xs" />
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Средние (21-35 дней)</Text>
                        <Text size="xl" fw={700} c="blue">{Math.round(deliveries.length * 0.60)}</Text>
                        <Progress value={60} color="blue" size="xs" mt="xs" />
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Медленные ({'>'}35 дней)</Text>
                        <Text size="xl" fw={700} c="orange">{Math.round(deliveries.length * 0.15)}</Text>
                        <Progress value={15} color="orange" size="xs" mt="xs" />
                      </Card>
                    </Grid.Col>
                  </Grid>
                  <Text size="sm" c="dimmed">
                    Средний срок доставки составляет {kpiData.avgDeliveryTime} дней. Основные факторы влияния: 
                    таможенное оформление, выбор транспорта, географическое расположение поставщика.
                  </Text>
                </Stack>
              );
            case 'logistics-cost':
              return (
                <Stack gap="md">
                  <Text size="lg" fw={600}>Структура логистических затрат</Text>
                  <Grid>
                    <Grid.Col span={3}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Транспорт</Text>
                        <Text size="xl" fw={700}>{(parseFloat(kpiData.logisticsCostPercentage) * 0.6).toFixed(1)}%</Text>
                        <Text size="xs" c="dimmed">от общих затрат</Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Таможня</Text>
                        <Text size="xl" fw={700}>{(parseFloat(kpiData.logisticsCostPercentage) * 0.25).toFixed(1)}%</Text>
                        <Text size="xs" c="dimmed">пошлины и сборы</Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Склад</Text>
                        <Text size="xl" fw={700}>{(parseFloat(kpiData.logisticsCostPercentage) * 0.10).toFixed(1)}%</Text>
                        <Text size="xs" c="dimmed">хранение и обработка</Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Прочее</Text>
                        <Text size="xl" fw={700}>{(parseFloat(kpiData.logisticsCostPercentage) * 0.05).toFixed(1)}%</Text>
                        <Text size="xs" c="dimmed">страхование, документы</Text>
                      </Card>
                    </Grid.Col>
                  </Grid>
                  <Text size="sm" c="dimmed">
                    Логистические затраты составляют {kpiData.logisticsCostPercentage}% от стоимости товара. 
                    Целевой показатель: 15-20%. Основные возможности оптимизации: консолидация грузов, выбор оптимальных маршрутов.
                  </Text>
                </Stack>
              );
            case 'quality':
              return (
                <Stack gap="md">
                  <Text size="lg" fw={600}>Показатели качества поставок</Text>
                  <Grid>
                    <Grid.Col span={6}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Соответствие спецификации</Text>
                        <Text size="xl" fw={700} c="green">{(parseFloat(kpiData.avgQualityRate) + 2).toFixed(1)}%</Text>
                        <Progress value={parseFloat(kpiData.avgQualityRate) + 2} color="green" size="xs" mt="xs" />
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Сохранность груза</Text>
                        <Text size="xl" fw={700} c="blue">{(parseFloat(kpiData.avgQualityRate) - 1).toFixed(1)}%</Text>
                        <Progress value={parseFloat(kpiData.avgQualityRate) - 1} color="blue" size="xs" mt="xs" />
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Документооборот</Text>
                        <Text size="xl" fw={700} c="teal">{(parseFloat(kpiData.avgQualityRate) + 1).toFixed(1)}%</Text>
                        <Progress value={parseFloat(kpiData.avgQualityRate) + 1} color="teal" size="xs" mt="xs" />
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Соблюдение сроков</Text>
                        <Text size="xl" fw={700} c="violet">{parseFloat(kpiData.avgQualityRate).toFixed(1)}%</Text>
                        <Progress value={parseFloat(kpiData.avgQualityRate)} color="violet" size="xs" mt="xs" />
                      </Card>
                    </Grid.Col>
                  </Grid>
                  
                  {/* Диаграмма процента брака по поставщикам */}
                  <Card padding="md" withBorder mt="md">
                    <Text size="md" fw={600} mb="md">Процент брака по поставщикам</Text>
                    <Stack gap="sm">
                      {[
                        { name: 'ООО "Альфа-Логистик"', defectRate: 2.1, color: 'red' },
                        { name: 'ТК "Быстрая доставка"', defectRate: 1.8, color: 'orange' },
                        { name: 'Логистик Центр', defectRate: 1.2, color: 'yellow' },
                        { name: 'ПЭК', defectRate: 0.9, color: 'lime' },
                        { name: 'Деловые Линии', defectRate: 0.7, color: 'green' },
                        { name: 'СДЭК', defectRate: 0.5, color: 'teal' }
                      ].map((supplier, index) => (
                        <div key={index}>
                          <Group justify="space-between" mb={4}>
                            <Text size="sm">{supplier.name}</Text>
                            <Text size="sm" fw={600} c={supplier.color}>{supplier.defectRate}%</Text>
                          </Group>
                          <Progress 
                            value={supplier.defectRate * 20} // масштабируем для визуализации
                            color={supplier.color} 
                            size="sm" 
                            radius="xs"
                          />
                        </div>
                      ))}
                    </Stack>
                    <Text size="xs" c="dimmed" mt="md">
                      Средний процент брака по всем поставщикам: 1.2%. 
                      Целевой показатель: менее 1.0%. Данные за последние 3 месяца.
                    </Text>
                  </Card>

                  <Text size="sm" c="dimmed" mt="md">
                    Общий показатель качества поставок: {kpiData.avgQualityRate}%. Цель: {'>'}95%. 
                    Включает оценку соответствия товара спецификации, сохранности при транспортировке, 
                    качества документооборота и соблюдения сроков поставки.
                  </Text>
                </Stack>
              );
            case 'avg-volume':
              return (
                <Stack gap="md">
                  <Text size="lg" fw={600}>Анализ объемов поставок</Text>
                  <Grid>
                    <Grid.Col span={4}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Общий объем</Text>
                        <Text size="xl" fw={700} c="violet">{kpiData.totalVolume} м³</Text>
                        <Text size="xs" c="dimmed">за период</Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Общее количество</Text>
                        <Text size="xl" fw={700} c="blue">{kpiData.totalQuantity.toLocaleString()} шт</Text>
                        <Text size="xs" c="dimmed">единиц товара</Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Общая стоимость</Text>
                        <Text size="xl" fw={700} c="green">{(kpiData.totalValue / 1000000).toFixed(1)} млн ₽</Text>
                        <Text size="xs" c="dimmed">стоимость товаров</Text>
                      </Card>
                    </Grid.Col>
                  </Grid>
                  
                  <Grid>
                    <Grid.Col span={6}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Малые поставки ({'<'}5 м³)</Text>
                        <Text size="xl" fw={700} c="orange">{Math.round(deliveries.filter(d => d.volume < 5).length)}</Text>
                        <Progress value={(deliveries.filter(d => d.volume < 5).length / deliveries.length) * 100} color="orange" size="xs" mt="xs" />
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Крупные поставки ({'>'}15 м³)</Text>
                        <Text size="xl" fw={700} c="green">{Math.round(deliveries.filter(d => d.volume > 15).length)}</Text>
                        <Progress value={(deliveries.filter(d => d.volume > 15).length / deliveries.length) * 100} color="green" size="xs" mt="xs" />
                      </Card>
                    </Grid.Col>
                  </Grid>
                  
                  <Text size="sm" c="dimmed">
                    Средний объем поставки составляет {kpiData.avgVolume} м³. Целевой диапазон: 8-12 м³. 
                    Оптимизация объемов поставок позволяет снизить логистические затраты и улучшить эффективность складских операций.
                    Рекомендуется консолидировать малые поставки и планировать крупные партии для снижения удельных затрат.
                  </Text>
                </Stack>
              );
            case 'errors-incidents':
              return (
                <Stack gap="md">
                  <Text size="lg" fw={600}>Анализ ошибок и инцидентов</Text>
                  
                  {/* Основные метрики */}
                  <Grid>
                    <Grid.Col span={4}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Общее количество инцидентов</Text>
                        <Text size="xl" fw={700} c="red">{Math.round(deliveries.length * (100 - parseFloat(kpiData.perfectOrderRate)) / 100)}</Text>
                        <Text size="xs" c="dimmed">за период</Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Среднее время решения</Text>
                        <Text size="xl" fw={700} c="orange">4.2 часа</Text>
                        <Text size="xs" c="dimmed">цель: {'<'}3 часа</Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Card padding="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">"Чистые" поставки</Text>
                        <Text size="xl" fw={700} c="green">{kpiData.perfectOrderRate}%</Text>
                        <Text size="xs" c="dimmed">без ошибок</Text>
                      </Card>
                    </Grid.Col>
                  </Grid>

                  {/* Распределение по типам ошибок */}
                  <Card padding="md" withBorder>
                    <Text size="md" fw={600} mb="md">Распределение по типам ошибок</Text>
                    <Grid>
                      <Grid.Col span={6}>
                        <Stack gap="sm">
                          {[
                            { type: 'Недостача', count: 12, percentage: 35, color: 'red' },
                            { type: 'Повреждение', count: 8, percentage: 24, color: 'orange' },
                            { type: 'Несоответствие маркировки', count: 6, percentage: 18, color: 'yellow' },
                            { type: 'Проблемы с документами', count: 5, percentage: 15, color: 'blue' },
                            { type: 'Излишек', count: 3, percentage: 8, color: 'green' }
                          ].map((error, index) => (
                            <div key={index}>
                              <Group justify="space-between" mb={4}>
                                <Text size="sm">{error.type}</Text>
                                <Group gap="xs">
                                  <Text size="sm" fw={600}>{error.count}</Text>
                                  <Text size="xs" c="dimmed">({error.percentage}%)</Text>
                                </Group>
                              </Group>
                              <Progress 
                                value={error.percentage * 2} 
                                color={error.color} 
                                size="sm" 
                                radius="xs"
                              />
                            </div>
                          ))}
                        </Stack>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc', borderRadius: '8px' }}>
                          <Stack align="center" gap="xs">
                            <Text size="sm" c="dimmed">Круговая диаграмма</Text>
                            <Text size="xs" c="dimmed">Визуализация распределения ошибок</Text>
                          </Stack>
                        </div>
                      </Grid.Col>
                    </Grid>
                  </Card>

                  {/* Heatmap по типам ошибок и поставщикам */}
                  <Card padding="md" withBorder>
                    <Text size="md" fw={600} mb="md">Карта ошибок по поставщикам</Text>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Поставщик</th>
                            <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #eee' }}>Недостача</th>
                            <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #eee' }}>Повреждение</th>
                            <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #eee' }}>Маркировка</th>
                            <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #eee' }}>Документы</th>
                            <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #eee' }}>Излишек</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'ООО "Альфа-Логистик"', errors: [3, 2, 1, 2, 0] },
                            { name: 'ТК "Быстрая доставка"', errors: [2, 3, 2, 1, 1] },
                            { name: 'Логистик Центр', errors: [4, 1, 2, 1, 1] },
                            { name: 'ПЭК', errors: [1, 1, 0, 1, 0] },
                            { name: 'Деловые Линии', errors: [2, 1, 1, 0, 1] }
                          ].map((supplier, index) => (
                            <tr key={index}>
                              <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                                <Text size="sm">{supplier.name}</Text>
                              </td>
                              {supplier.errors.map((errorCount, errorIndex) => {
                                const intensity = errorCount / 4; // нормализация для цвета
                                const bgColor = errorCount === 0 ? '#f8f9fa' : 
                                  errorCount === 1 ? '#fff3cd' :
                                  errorCount === 2 ? '#ffeaa7' :
                                  errorCount === 3 ? '#fdcb6e' : '#e17055';
                                return (
                                  <td key={errorIndex} style={{ 
                                    padding: '8px', 
                                    textAlign: 'center', 
                                    backgroundColor: bgColor,
                                    borderBottom: '1px solid #f0f0f0'
                                  }}>
                                    <Text size="sm" fw={errorCount > 0 ? 600 : 400}>{errorCount}</Text>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Text size="xs" c="dimmed" mt="md">
                      Интенсивность цвета показывает количество ошибок: светлый = мало ошибок, темный = много ошибок
                    </Text>
                  </Card>

                  {/* Bar chart по причинам ошибок */}
                  <Card padding="md" withBorder>
                    <Text size="md" fw={600} mb="md">Основные причины ошибок</Text>
                    <Stack gap="sm">
                      {[
                        { cause: 'Неправильная упаковка', count: 15, color: 'red' },
                        { cause: 'Ошибки при комплектации', count: 12, color: 'orange' },
                        { cause: 'Повреждения при транспортировке', count: 8, color: 'yellow' },
                        { cause: 'Неточности в документах', count: 7, color: 'blue' },
                        { cause: 'Проблемы с маркировкой', count: 6, color: 'purple' },
                        { cause: 'Ошибки поставщика', count: 4, color: 'teal' }
                      ].map((cause, index) => (
                        <div key={index}>
                          <Group justify="space-between" mb={4}>
                            <Text size="sm">{cause.cause}</Text>
                            <Text size="sm" fw={600}>{cause.count} случаев</Text>
                          </Group>
                          <Progress 
                            value={(cause.count / 15) * 100} 
                            color={cause.color} 
                            size="md" 
                            radius="xs"
                          />
                        </div>
                      ))}
                    </Stack>
                  </Card>

                  <Text size="sm" c="dimmed">
                    Общий уровень ошибок составляет {(100 - parseFloat(kpiData.perfectOrderRate)).toFixed(1)}% от всех поставок. 
                    Цель: менее 5%. Основные направления для улучшения: усиление контроля качества упаковки, 
                    обучение персонала, улучшение процедур приемки и документооборота.
                  </Text>
                </Stack>
              );
            default:
              return <Text>Детальная информация недоступна</Text>;
          }
        }}
        columnsPerCard={2}
        animationDuration={500}
        animationTimingFunction="ease-in-out"
      />
      
      {/* Визуализация маршрутов и статусов */}
      <Grid mb="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={500}>Маршруты поставок</Text>
              <SegmentedControl
                size="xs"
                data={[
                  { label: 'Карта', value: 'map' },
                  { label: 'Timeline', value: 'timeline' }
                ]}
                defaultValue="map"
              />
            </Group>
            <RoutesMap />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Text size="lg" fw={500} mb="md">Timeline поставок</Text>
            <DeliveryTimeline />
          </Card>
        </Grid.Col>
      </Grid>
      
      {/* Аналитический блок */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
          <Tabs.List>
            <Tabs.Tab value="suppliers" leftSection={<IconChartDots size={16} />}>
              Анализ поставщиков
            </Tabs.Tab>
            <Tabs.Tab value="financial" leftSection={<IconChartPie size={16} />}>
              Финансовая аналитика
            </Tabs.Tab>
            <Tabs.Tab value="operations" leftSection={<IconChartBar size={16} />}>
              Операционные метрики
            </Tabs.Tab>
            <Tabs.Tab value="inventory" leftSection={<IconChartLine size={16} />}>
              Склады и остатки
            </Tabs.Tab>
          </Tabs.List>
          
          <Tabs.Panel value="suppliers" pt="md">
            <SupplierAnalysis />
          </Tabs.Panel>
          
          <Tabs.Panel value="financial" pt="md">
            <FinancialAnalytics />
          </Tabs.Panel>
          
          <Tabs.Panel value="operations" pt="md">
            <OperationalMetrics />
          </Tabs.Panel>
          
          <Tabs.Panel value="inventory" pt="md">
            <InventoryAnalytics />
          </Tabs.Panel>
        </Tabs>
      </Card>
      
      {/* Таблица поставок */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Text size="lg" fw={500}>Детальная таблица поставок</Text>
          <Group>
            <Button variant="light" size="xs" leftSection={<IconRefresh size={14} />}>
              Обновить
            </Button>
          </Group>
        </Group>
        
        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Номер</Table.Th>
                <Table.Th>Поставщик</Table.Th>
                <Table.Th style={{ width: '200px', minWidth: '200px' }}>Категория</Table.Th>
                <Table.Th>Артикул продавца</Table.Th>
                <Table.Th>Отправка / План</Table.Th>
                <Table.Th style={{ width: '200px', minWidth: '200px' }}>Статус</Table.Th>
                <Table.Th>Прогресс</Table.Th>
                <Table.Th>Склад</Table.Th>
                <Table.Th>Кол-во упаковано</Table.Th>
                <Table.Th>Кол-во принято</Table.Th>
                <Table.Th>Кол-во в продаже</Table.Th>
                <Table.Th>Дата приемки план</Table.Th>
                <Table.Th>Дата приемки факт</Table.Th>
                <Table.Th>Стоимость</Table.Th>
                <Table.Th>Трек-номер</Table.Th>
                <Table.Th>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {deliveries.map((delivery: Delivery) => (
                <Table.Tr key={delivery.id}>
                  <Table.Td fw={500}>{delivery.id}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {getTransportIcon(delivery.transportType)}
                      {delivery.supplier}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" size="sm">{delivery.category}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>{delivery.sellerArticle}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={0}>
                      <Text size="sm">{delivery.sendDate}</Text>
                      <Text size="xs" c="dimmed">{delivery.plannedDate}</Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>{getStatusBadge(delivery.status)}</Table.Td>
                  <Table.Td>
                    <Progress value={delivery.progress} size="sm" />
                  </Table.Td>
                  <Table.Td>{delivery.warehouse}</Table.Td>
                  <Table.Td>
                    <Text size="sm">{delivery.quantityPacked.toLocaleString()} шт</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c={delivery.quantityAccepted > 0 ? 'green' : 'dimmed'}>
                      {delivery.quantityAccepted.toLocaleString()} шт
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c={delivery.quantityInSale > 0 ? 'blue' : 'dimmed'}>
                      {delivery.quantityInSale.toLocaleString()} шт
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{delivery.plannedAcceptanceDate}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c={delivery.actualAcceptanceDate ? 'green' : 'dimmed'}>
                      {delivery.actualAcceptanceDate || 'Ожидается'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={0}>
                      <Text size="sm">₽{delivery.productCost.toLocaleString()}</Text>
                      <Text size="xs" c="dimmed">+₽{delivery.logisticsCost.toLocaleString()}</Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Tooltip label="Отследить">
                      <Text size="sm" c="blue" style={{ cursor: 'pointer' }}>
                        {delivery.trackNumber}
                      </Text>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon 
                        variant="subtle" 
                        size="sm"
                        onClick={() => openDeliveryDetails(delivery)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" size="sm">
                        <IconEdit size={16} />
                      </ActionIcon>
                      <Menu>
                        <Menu.Target>
                          <ActionIcon variant="subtle" size="sm">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<IconFileInvoice size={14} />}>
                            Документы
                          </Menu.Item>
                          <Menu.Item leftSection={<IconHistory size={14} />}>
                            История
                          </Menu.Item>
                          <Menu.Item leftSection={<IconMessage size={14} />}>
                            Комментарии
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
                            Удалить
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
      
      {/* Боковая панель уведомлений */}
      <Drawer
        opened={alertsOpened}
        onClose={() => setAlertsOpened(false)}
        position="right"
        size="sm"
        withCloseButton={false}
        styles={{
          body: { padding: 0 }
        }}
      >
        <Box p="md">
          <Group justify="space-between" mb="md">
            <Group>
              <IconBell size={20} />
              <Text fw={500}>Уведомления</Text>
            </Group>
            <ActionIcon
              variant="subtle"
              onClick={() => setAlertsOpened(false)}
            >
              <IconX size={16} />
            </ActionIcon>
          </Group>
          
          <Stack gap="sm">
            {alerts.map((alert: Alert) => (
              <Alert
                key={alert.id}
                color={
                  alert.type === 'critical' ? 'red' :
                  alert.type === 'warning' ? 'yellow' : 'blue'
                }
                icon={<IconAlertCircle size={16} />}
              >
                <Text size="sm" fw={500} mb={4}>{alert.message}</Text>
                <Text size="xs" c="dimmed">{alert.timestamp}</Text>
              </Alert>
            ))}
          </Stack>
        </Box>
      </Drawer>
      
      {/* Модальное окно деталей поставки */}
      <Modal
        opened={detailsOpened}
        onClose={closeDetails}
        title={selectedDelivery ? `Поставка ${selectedDelivery.id}` : ''}
        size="lg"
      >
        {selectedDelivery && (
          <Stack>
            <Timeline active={2} bulletSize={24}>
              <Timeline.Item bullet={<IconPackage size={12} />} title="Отправлено">
                <Text c="dimmed" size="sm">{selectedDelivery.sendDate}</Text>
                <Text size="xs">{selectedDelivery.supplier}</Text>
              </Timeline.Item>
              
              <Timeline.Item bullet={<IconMapPin size={12} />} title="В пути">
                <Text c="dimmed" size="sm">Текущее местоположение: {selectedDelivery.currentLocation}</Text>
                <Text size="xs">Дней в пути: {selectedDelivery.daysInTransit}</Text>
              </Timeline.Item>
              
              <Timeline.Item bullet={<IconBuilding size={12} />} title="Ожидается">
                <Text c="dimmed" size="sm">{selectedDelivery.plannedDate}</Text>
                <Text size="xs">Склад: {selectedDelivery.warehouse}</Text>
              </Timeline.Item>
            </Timeline>
            
            <Divider />
            
            <SimpleGrid cols={2}>
              <Box>
                <Text size="sm" c="dimmed">Количество</Text>
                <Text fw={500}>{selectedDelivery.quantity} шт</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Вес</Text>
                <Text fw={500}>{selectedDelivery.weight} кг</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Объем</Text>
                <Text fw={500}>{selectedDelivery.volume} м³</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Качество</Text>
                <Text fw={500}>{selectedDelivery.qualityRate}%</Text>
              </Box>
            </SimpleGrid>
            
            <Divider />
            
            <Box>
              <Text size="sm" fw={500} mb="xs">Финансовая сводка</Text>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">Стоимость товара:</Text>
                  <Text size="sm">₽{selectedDelivery.productCost.toLocaleString()}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Логистика:</Text>
                  <Text size="sm">₽{selectedDelivery.logisticsCost.toLocaleString()}</Text>
                </Group>
                <Divider size="xs" />
                <Group justify="space-between">
                  <Text size="sm" fw={500}>Итого:</Text>
                  <Text size="sm" fw={500}>
                    ₽{(selectedDelivery.productCost + selectedDelivery.logisticsCost).toLocaleString()}
                  </Text>
                </Group>
              </Stack>
            </Box>
          </Stack>
        )}
      </Modal>
      
      {/* Кнопка уведомлений */}
      {!alertsOpened && (
        <Indicator
          position="top-start"
          color="red"
          size={10}
          styles={{
            indicator: {
              right: rem(18),
              top: rem(18)
            }
          }}
        >
          <ActionIcon
            variant="filled"
            size="xl"
            radius="xl"
            color="blue"
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 100
            }}
            onClick={() => setAlertsOpened(true)}
          >
            <IconBell size={24} />
          </ActionIcon>
        </Indicator>
      )}
      
      {/* Модальное окно новой поставки */}
      <Modal
        opened={newDeliveryOpened}
        onClose={closeNewDelivery}
        title="Создание новой поставки"
        size="xl"
      >
        <Stack>
          <SimpleGrid cols={2}>
            <Select
              label="Поставщик"
              placeholder="Выберите поставщика"
              data={suppliers.map(s => ({ value: s.id, label: s.name }))}
              required
            />
            <Select
              label="Склад назначения"
              placeholder="Выберите склад"
              data={[
                { value: 'koledino', label: 'Коледино' },
                { value: 'elektrostal', label: 'Электросталь' },
                { value: 'podolsk', label: 'Подольск' }
              ]}
              required
            />
            <DatePickerInput
              label="Дата поставки"
              placeholder="Выберите дату"
              required
            />
            <DatePickerInput
              label="Планируемая дата доставки"
              placeholder="Выберите дату"
              required
            />
            <NumberInput
              label="Количество единиц"
              placeholder="0"
              min={1}
              required
            />
            <NumberInput
              label="Вес (кг)"
              placeholder="0"
              min={0.1}
              required
            />
            <NumberInput
              label="Объем (м³)"
              placeholder="0"
              min={0.01}
              required
            />
            <Select
              label="Способ доставки"
              placeholder="Выберите способ"
              data={[
                { value: 'sea', label: 'Море (35-45 дней)' },
                { value: 'rail', label: 'Ж/д (25-35 дней)' },
                { value: 'air', label: 'Авиа (7-15 дней)' },
                { value: 'truck', label: 'Авто (15-25 дней)' }
              ]}
              required
            />
          </SimpleGrid>
          
          <Divider my="md" />
          
          <SimpleGrid cols={2}>
            <NumberInput
              label="Стоимость товара (₽)"
              placeholder="0"
              min={0}
              required
            />
            <NumberInput
              label="Прогноз логистических затрат (₽)"
              placeholder="Рассчитается автоматически"
              readOnly
            />
          </SimpleGrid>
          
          <Group justify="flex-end" mt="xl">
            <Button variant="light" onClick={closeNewDelivery}>Отмена</Button>
            <Button>Создать поставку</Button>
          </Group>
        </Stack>
      </Modal>
      
      {/* Модальное окно калькулятора оптимальной партии */}
      <Modal
        opened={calcOpened}
        onClose={closeCalc}
        title="Калькулятор оптимальной партии (EOQ)"
        size="lg"
      >
        <Stack>
          <Alert icon={<IconCalculator size={16} />} color="blue">
            Economic Order Quantity (EOQ) = √(2DS/H), где D - годовой спрос, S - стоимость заказа, H - стоимость хранения
          </Alert>
          
          <NumberInput
            label="Годовой спрос (единиц)"
            placeholder="0"
            min={1}
          />
          <NumberInput
            label="Стоимость одного заказа (₽)"
            placeholder="0"
            min={0}
          />
          <NumberInput
            label="Стоимость хранения единицы в год (₽)"
            placeholder="0"
            min={0}
          />
          
          <Divider my="md" />
          
          <Card withBorder>
            <Text size="sm" c="dimmed" mb="xs">Оптимальный размер заказа:</Text>
            <Text size="xl" fw={700} c="blue">0 единиц</Text>
            <Group mt="md" gap="xl">
              <Box>
                <Text size="xs" c="dimmed">Количество заказов в год:</Text>
                <Text fw={500}>0</Text>
              </Box>
              <Box>
                <Text size="xs" c="dimmed">Общие затраты:</Text>
                <Text fw={500}>₽0</Text>
              </Box>
            </Group>
          </Card>
          
          <Group justify="flex-end">
             <Button variant="light" onClick={closeCalc}>Закрыть</Button>
             <Button>Применить к заказу</Button>
           </Group>
         </Stack>
       </Modal>
    </Container>
  );
}