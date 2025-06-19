/**
 * SupplyManagementPage.tsx
 * Страница управления поставками
 * Created on 2025-01-16
 */
import React, { useState, useMemo } from 'react';
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
  rem
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import ReactECharts from 'echarts-for-react';
import { create } from 'zustand';

// Типы данных
interface Delivery {
  id: string;
  supplier: string;
  supplierCountry: string;
  sendDate: string;
  plannedDate: string;
  status: 'in_transit' | 'delayed' | 'delivered' | 'customs';
  progress: number;
  warehouse: string;
  quantity: number;
  weight: number;
  volume: number;
  productCost: number;
  logisticsCost: number;
  trackNumber: string;
  transportType: 'sea' | 'rail' | 'air' | 'truck';
  currentLocation: string;
  daysInTransit: number;
  qualityRate: number;
}

interface Supplier {
  id: string;
  name: string;
  rating: number;
  deliveries: number;
  onTimeRate: number;
  defectRate: number;
  avgDeliveryCost: number;
  leadTime: number;
}

interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info';
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

interface KPICardProps {
  title: string;
  value: string;
  target?: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
}
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
  IconAdjustments
} from '@tabler/icons-react';

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
      qualityRate: 98.5
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
      qualityRate: 97.2
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
      qualityRate: 99.1
    }
  ],
  
  suppliers: [
    {
      id: 'SUP-001',
      name: 'Shanghai Trading Co.',
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
  
  setDeliveries: (deliveries: Delivery[]) => set({ deliveries }),
  addDelivery: (delivery: Delivery) => set((state) => ({ 
    deliveries: [...state.deliveries, delivery] 
  })),
  updateDelivery: (id: string, updates: Partial<Delivery>) => set((state) => ({
    deliveries: state.deliveries.map(d => d.id === id ? { ...d, ...updates } : d)
  }))
}));

// Компонент KPI карточки
const KPICard: React.FC<KPICardProps> = ({ title, value, target, trend, icon, color }) => {
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

// Компонент карты маршрутов
const RoutesMap = () => {
  const mapOption = {
    backgroundColor: '#f8f9fa',
    geo: {
      map: 'world',
      roam: true,
      zoom: 2,
      center: [80, 45],
      itemStyle: {
        areaColor: '#e9ecef',
        borderColor: '#dee2e6'
      },
      emphasis: {
        itemStyle: {
          areaColor: '#ced4da'
        }
      }
    },
    series: [
      {
        type: 'lines',
        coordinateSystem: 'geo',
        data: [
          {
            coords: [[121.4737, 31.2304], [131.8613, 43.2918]], // Shanghai to Vladivostok
            lineStyle: { color: '#339af0', width: 3, curveness: 0.3 }
          },
          {
            coords: [[113.2644, 23.1291], [76.9129, 43.2380]], // Guangzhou to Almaty
            lineStyle: { color: '#f59f00', width: 3, curveness: 0.3 }
          },
          {
            coords: [[114.0579, 22.5431], [37.6173, 55.7558]], // Shenzhen to Moscow
            lineStyle: { color: '#51cf66', width: 3, curveness: 0.3 }
          }
        ],
        effect: {
          show: true,
          period: 6,
          trailLength: 0.1,
          symbolSize: 8
        }
      },
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        data: [
          { name: 'Shanghai', value: [121.4737, 31.2304] },
          { name: 'Vladivostok', value: [131.8613, 43.2918] },
          { name: 'Guangzhou', value: [113.2644, 23.1291] },
          { name: 'Almaty', value: [76.9129, 43.2380] },
          { name: 'Shenzhen', value: [114.0579, 22.5431] },
          { name: 'Moscow', value: [37.6173, 55.7558] }
        ],
        symbolSize: 12,
        itemStyle: {
          color: '#228be6'
        }
      }
    ]
  };
  
  // Упрощенная версия без реальной карты
  const simplifiedMapOption = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        symbolSize: 50,
        roam: true,
        label: {
          show: true
        },
        force: {
          repulsion: 1000,
          edgeLength: 200
        },
        data: [
          { name: 'Шанхай', x: 100, y: 200 },
          { name: 'Гуанчжоу', x: 150, y: 250 },
          { name: 'Шэньчжэнь', x: 200, y: 230 },
          { name: 'Владивосток', x: 400, y: 150 },
          { name: 'Алматы', x: 350, y: 300 },
          { name: 'Москва', x: 500, y: 200 }
        ],
        links: [
          { source: 'Шанхай', target: 'Владивосток' },
          { source: 'Гуанчжоу', target: 'Алматы' },
          { source: 'Шэньчжэнь', target: 'Москва' }
        ]
      }
    ]
  };
  
  return <ReactECharts option={simplifiedMapOption} style={{ height: '400px' }} />;
};

// Компонент Timeline поставок
const DeliveryTimeline = () => {
  const deliveries = useDeliveriesStore((state) => state.deliveries);
  
  const ganttOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '10%',
      right: '4%',
      top: '10%',
      bottom: '3%'
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: deliveries.map(d => d.id)
    },
    series: [
      {
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const categoryIndex = api.value(0);
          const start = api.coord([api.value(1), categoryIndex]);
          const end = api.coord([api.value(2), categoryIndex]);
          const height = api.size([0, 1])[1] * 0.6;
          const delivery = deliveries[categoryIndex];
          
          return {
            type: 'rect',
            shape: {
              x: start[0],
              y: start[1] - height / 2,
              width: end[0] - start[0],
              height: height
            },
            style: {
              fill: delivery.status === 'delayed' ? '#fa5252' : 
                    delivery.status === 'delivered' ? '#51cf66' : '#339af0'
            }
          };
        },
        data: deliveries.map((d: Delivery, idx: number) => [
          idx,
          new Date(d.sendDate).getTime(),
          new Date(d.plannedDate).getTime()
        ])
      }
    ]
  };
  
  return <ReactECharts option={ganttOption} style={{ height: '300px' }} />;
};

// Компонент анализа поставщиков
const SupplierAnalysis = () => {
  const suppliers = useDeliveriesStore((state) => state.suppliers);
  
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
        data: suppliers.map((s: Supplier) => ({
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
        <ReactECharts option={radarOption} style={{ height: '300px' }} />
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

// Компонент финансовой аналитики
const FinancialAnalytics = () => {
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
  
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="md" fw={500} mb="md">Структура затрат</Text>
          <ReactECharts option={costStructureOption} style={{ height: '300px' }} />
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="md" fw={500} mb="md">Динамика Landed Cost Per Unit</Text>
          <ReactECharts option={landedCostOption} style={{ height: '300px' }} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

// Главный компонент страницы
export default function SupplyManagementPage() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(2024, 0, 1), new Date()]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('suppliers');
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [alertsOpened, setAlertsOpened] = useState(true);
  
  const { deliveries, suppliers, alerts } = useDeliveriesStore();
  
  // Расчет KPI
  const kpiData = useMemo(() => {
    const totalDeliveries = deliveries.length;
    const delayedDeliveries = deliveries.filter(d => d.status === 'delayed').length;
    const totalLogisticsCost = deliveries.reduce((sum, d) => sum + d.logisticsCost, 0);
    const totalProductCost = deliveries.reduce((sum, d) => sum + d.productCost, 0);
    const avgQualityRate = deliveries.reduce((sum, d) => sum + d.qualityRate, 0) / totalDeliveries;
    
    return {
      perfectOrderRate: ((totalDeliveries - delayedDeliveries) / totalDeliveries * 100).toFixed(1),
      avgDeliveryTime: 28,
      logisticsCostPercentage: (totalLogisticsCost / totalProductCost * 100).toFixed(1),
      avgQualityRate: avgQualityRate.toFixed(1)
    };
  }, [deliveries]);
  
  const getStatusBadge = (status: Delivery['status']) => {
    const statusConfig = {
      in_transit: { color: 'blue', label: 'В пути' },
      delayed: { color: 'red', label: 'Задержка' },
      delivered: { color: 'green', label: 'Доставлено' },
      customs: { color: 'orange', label: 'Таможня' }
    };
    
    const config = statusConfig[status] || { color: 'gray', label: 'Неизвестно' };
    return <Badge color={config.color}>{config.label}</Badge>;
  };
  
  const getTransportIcon = (type: Delivery['transportType']) => {
    const icons = {
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
              onChange={(value: string) => {
                const date = value ? new Date(value) : new Date();
                setDateRange([date, dateRange[1] || new Date()]);
              }}
              placeholder="Выберите период"
              style={{ width: 250 }}
            />
            <Button leftSection={<IconPlus size={16} />} color="blue">
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
            onChange={(value: string[]) => setSelectedStatuses(value)}
            clearable
            style={{ width: 200 }}
          />
          <MultiSelect
            placeholder="Поставщик"
            data={suppliers.map(s => ({ value: s.id, label: s.name }))}
            value={selectedSuppliers}
            onChange={(value: string[]) => setSelectedSuppliers(value)}
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
            onChange={(value: string[]) => setSelectedWarehouses(value)}
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
      
      {/* KPI карточки */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="md">
        <KPICard
          title="Perfect Order Rate"
          value={`${kpiData.perfectOrderRate}%`}
          target="85-95%"
          trend={3.2}
          icon={<IconCheck size={20} />}
          color="green"
        />
        <KPICard
          title="Средний срок доставки"
          value={`${kpiData.avgDeliveryTime} дней`}
          target="25-30 дней"
          trend={-5.1}
          icon={<IconClock size={20} />}
          color="blue"
        />
        <KPICard
          title="Логистические затраты"
          value={`${kpiData.logisticsCostPercentage}%`}
          target="15-20%"
          trend={-2.3}
          icon={<IconCurrencyRubel size={20} />}
          color="orange"
        />
        <KPICard
          title="Качество поставок"
          value={`${kpiData.avgQualityRate}%`}
          target=">95%"
          trend={1.5}
          icon={<IconPackage size={20} />}
          color="teal"
        />
      </SimpleGrid>
      
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
        <Tabs value={activeTab} onChange={(value: string | null) => setActiveTab(value || 'suppliers')}>
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
            <Text c="dimmed">Операционные метрики в разработке...</Text>
          </Tabs.Panel>
          
          <Tabs.Panel value="inventory" pt="md">
            <Text c="dimmed">Склады и остатки в разработке...</Text>
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
                <Table.Th>Отправка / План</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th>Прогресс</Table.Th>
                <Table.Th>Склад</Table.Th>
                <Table.Th>Кол-во</Table.Th>
                <Table.Th>Стоимость</Table.Th>
                <Table.Th>Трек-номер</Table.Th>
                <Table.Th>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {deliveries.map((delivery) => (
                <Table.Tr key={delivery.id}>
                  <Table.Td fw={500}>{delivery.id}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {getTransportIcon(delivery.transportType)}
                      {delivery.supplier}
                    </Group>
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
                  <Table.Td>{delivery.quantity} шт</Table.Td>
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
            {alerts.map((alert) => (
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
          processing
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
    </Container>
  );
}