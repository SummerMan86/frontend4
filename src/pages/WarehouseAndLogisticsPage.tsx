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
  Skeleton
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
  IconX
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import { DatePickerInput as DatePicker } from '@mantine/dates';

// Типы данных
interface KpiCard {
  title: string;
  value: string | number;
  unit: string;
  trend: number;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

// Моковые данные
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
    stockAccuracy: 98.5
  },
  warehouses: [
    { id: 'msk', name: 'Москва (Коледино)', stock: 45230, capacity: 50000, utilization: 90.5 },
    { id: 'spb', name: 'Санкт-Петербург', stock: 28100, capacity: 35000, utilization: 80.3 },
    { id: 'kzn', name: 'Казань', stock: 18900, capacity: 25000, utilization: 75.6 },
    { id: 'ekb', name: 'Екатеринбург', stock: 22350, capacity: 30000, utilization: 74.5 },
    { id: 'nsk', name: 'Новосибирск', stock: 10760, capacity: 20000, utilization: 53.8 }
  ],
  shipments: [
    { date: '2024-03-15', warehouse: 'msk', quantity: 1200, status: 'delivered' },
    { date: '2024-03-18', warehouse: 'spb', quantity: 800, status: 'delivered' },
    { date: '2024-03-20', warehouse: 'kzn', quantity: 600, status: 'in_transit' },
    { date: '2024-03-22', warehouse: 'ekb', quantity: 900, status: 'planned' }
  ],
  products: [
    { 
      sku: 'ART-001', 
      name: 'Футболка базовая', 
      stock: 4500, 
      dailySales: 120, 
      daysLeft: 37,
      category: 'A',
      turnover: 12.5,
      frozenDays: 0
    },
    { 
      sku: 'ART-002', 
      name: 'Джинсы классические', 
      stock: 2300, 
      dailySales: 45, 
      daysLeft: 51,
      category: 'A',
      turnover: 8.2,
      frozenDays: 0
    },
    { 
      sku: 'ART-003', 
      name: 'Платье летнее', 
      stock: 890, 
      dailySales: 8, 
      daysLeft: 111,
      category: 'B',
      turnover: 4.1,
      frozenDays: 45
    },
    { 
      sku: 'ART-004', 
      name: 'Рубашка офисная', 
      stock: 450, 
      dailySales: 2, 
      daysLeft: 225,
      category: 'C',
      turnover: 1.8,
      frozenDays: 120
    }
  ]
};

export default function WarehouseAndLogisticsPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
  const [kpiModalOpened, setKpiModalOpened] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KpiCard | null>(null);
  const [viewMode, setViewMode] = useState('overview');
  
  // KPI карточки
  const kpiCards: KpiCard[] = [
    {
      title: 'Общий остаток',
      value: warehouseData.kpi.totalStock.toLocaleString(),
      unit: 'шт',
      trend: 5.2,
      icon: IconPackage,
      color: 'blue',
      description: 'Суммарный остаток по всем складам'
    },
    {
      title: 'Дней хватит',
      value: warehouseData.kpi.stockDays,
      unit: 'дней',
      trend: -2.1,
      icon: IconCalendar,
      color: 'green',
      description: 'При текущем темпе продаж'
    },
    {
      title: 'Оборачиваемость',
      value: warehouseData.kpi.turnoverRate.toFixed(1),
      unit: 'раз/мес',
      trend: 8.5,
      icon: IconRotate,
      color: 'cyan',
      description: 'Скорость оборота товарных запасов'
    },
    {
      title: 'Время доставки',
      value: warehouseData.kpi.deliveryTime.toFixed(1),
      unit: 'дней',
      trend: -5.3,
      icon: IconTruck,
      color: 'orange',
      description: 'Среднее время доставки на склад'
    },
    {
      title: 'Стоимость доставки',
      value: `${warehouseData.kpi.deliveryCost}₽`,
      unit: '/шт',
      trend: 3.2,
      icon: IconCoin,
      color: 'pink',
      description: 'Средняя стоимость доставки единицы'
    },
    {
      title: 'Процент возвратов',
      value: `${warehouseData.kpi.returnRate}%`,
      unit: '',
      trend: -1.2,
      icon: IconRefresh,
      color: 'red',
      description: 'Доля возвращенных товаров'
    }
  ];

  // График распределения по складам
  const warehouseDistributionOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: warehouseData.warehouses.map(w => w.name)
    },
    yAxis: [
      { type: 'value', name: 'Остаток (шт)' },
      { type: 'value', name: 'Загрузка (%)', max: 100 }
    ],
    series: [
      {
        name: 'Остаток',
        type: 'bar',
        data: warehouseData.warehouses.map(w => w.stock),
        itemStyle: { color: '#339af0' }
      },
      {
        name: 'Загрузка',
        type: 'line',
        yAxisIndex: 1,
        data: warehouseData.warehouses.map(w => w.utilization),
        itemStyle: { color: '#fa5252' }
      }
    ]
  };

  // График оборачиваемости по времени
  const turnoverTrendOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']
    },
    yAxis: { type: 'value', name: 'Оборачиваемость' },
    series: [
      {
        name: 'Оборачиваемость',
        type: 'line',
        data: [7.2, 7.8, 8.1, 8.5, 8.3, 8.7],
        smooth: true,
        itemStyle: { color: '#51cf66' }
      }
    ]
  };

  // ABC анализ
  const abcAnalysisOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'ABC анализ',
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 65, name: 'Категория A (65%)', itemStyle: { color: '#339af0' } },
          { value: 25, name: 'Категория B (25%)', itemStyle: { color: '#51cf66' } },
          { value: 10, name: 'Категория C (10%)', itemStyle: { color: '#ffd43b' } }
        ]
      }
    ]
  };

  // График поставок
  const shipmentsTimelineOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'time',
      boundaryGap: false
    },
    yAxis: { type: 'value', name: 'Количество (шт)' },
    series: [
      {
        name: 'Поставки',
        type: 'line',
        step: 'end',
        data: warehouseData.shipments.map(s => [s.date, s.quantity]),
        itemStyle: { color: '#845ef7' }
      }
    ]
  };

  const handleKpiClick = (kpi: KpiCard) => {
    setSelectedKpi(kpi);
    setKpiModalOpened(true);
  };

  return (
    <Container size="xl" p="md">
      <Stack gap="lg">
        {/* Заголовок и управление */}
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={2}>Склад и логистика</Title>
            <Text c="dimmed" size="sm">Управление запасами и логистикой</Text>
          </div>
          
          <Group>
            <SegmentedControl
              value={viewMode}
              onChange={setViewMode}
              data={[
                { label: 'Обзор', value: 'overview' },
                { label: 'Аналитика', value: 'analytics' },
                { label: 'Планирование', value: 'planning' }
              ]}
            />
            <Button leftSection={<IconDownload size={16} />} variant="light">
              Экспорт
            </Button>
          </Group>
        </Group>

        {/* KPI карточки */}
        <Grid>
          {kpiCards.map((kpi, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
              <Card 
                shadow="sm" 
                radius="md" 
                withBorder 
                style={{ cursor: 'pointer' }}
                onClick={() => handleKpiClick(kpi)}
              >
                <Stack gap="xs">
                  <Group justify="space-between">
                    <ThemeIcon color={kpi.color} variant="light" size="lg">
                      <kpi.icon size={20} />
                    </ThemeIcon>
                    <ActionIcon variant="subtle" size="sm">
                      <IconInfoCircle size={16} />
                    </ActionIcon>
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
                      color={kpi.trend > 0 ? 'green' : 'red'}
                    >
                      {kpi.trend > 0 ? <IconArrowUpRight size={12} /> : <IconArrowDownRight size={12} />}
                    </ThemeIcon>
                    <Text size="xs" c={kpi.trend > 0 ? 'green' : 'red'}>
                      {Math.abs(kpi.trend)}%
                    </Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* Фильтры */}
        <Paper shadow="xs" p="md" radius="md">
          <Group>
            <Select
              label="Склад"
              placeholder="Выберите склад"
              data={[
                { value: 'all', label: 'Все склады' },
                ...warehouseData.warehouses.map(w => ({ value: w.id, label: w.name }))
              ]}
              value={selectedWarehouse}
              onChange={(value) => setSelectedWarehouse(value || 'all')}
              w={200}
            />
            
            <MultiSelect
              label="Товары"
              placeholder="Выберите товары"
              data={warehouseData.products.map(p => ({ value: p.sku, label: p.name }))}
              value={selectedProducts}
              onChange={(value) => setSelectedProducts(value)}
              w={300}
            />
            
            <DatePicker
              type="range"
              label="Период"
              placeholder="Выберите период"
              value={dateRange}
              onChange={(value) => setDateRange(value)}
              w={250}
            />
            
            <Button variant="subtle" leftSection={<IconFilter size={16} />} mt="xl">
              Больше фильтров
            </Button>
          </Group>
        </Paper>

        {/* Визуализации */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" radius="md" withBorder p="md">
              <Title order={4} mb="md">Распределение по складам</Title>
              <ReactECharts option={warehouseDistributionOption} style={{ height: 300 }} />
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" radius="md" withBorder p="md">
              <Title order={4} mb="md">Динамика оборачиваемости</Title>
              <ReactECharts option={turnoverTrendOption} style={{ height: 300 }} />
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" radius="md" withBorder p="md">
              <Title order={4} mb="md">ABC-анализ остатков</Title>
              <ReactECharts option={abcAnalysisOption} style={{ height: 300 }} />
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" radius="md" withBorder p="md">
              <Title order={4} mb="md">График поставок</Title>
              <ReactECharts option={shipmentsTimelineOption} style={{ height: 300 }} />
            </Card>
          </Grid.Col>
        </Grid>

        {/* Складские метрики */}
        <Card shadow="sm" radius="md" withBorder>
          <Title order={4} mb="md">Складские метрики</Title>
          
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper p="md" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Text fw={500}>Использование складов</Text>
                  <Badge color="blue">{warehouseData.kpi.warehouseUtilization}%</Badge>
                </Group>
                <Progress
                  value={warehouseData.kpi.warehouseUtilization}
                  color="blue"
                  size="xl"
                  radius="md"
                />
                <Text size="xs" c="dimmed" mt="xs">
                  Оптимальный уровень: 75-85%
                </Text>
              </Paper>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper p="md" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Text fw={500}>Точность учета</Text>
                  <Badge color="green">{warehouseData.kpi.stockAccuracy}%</Badge>
                </Group>
                <RingProgress
                  sections={[{ value: warehouseData.kpi.stockAccuracy, color: 'green' }]}
                  label={
                    <Text size="xl" fw={700} ta="center">
                      {warehouseData.kpi.stockAccuracy}%
                    </Text>
                  }
                />
              </Paper>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper p="md" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Text fw={500}>Замороженный сток</Text>
                  <Badge color="red">{warehouseData.kpi.frozenStock} шт</Badge>
                </Group>
                <Stack gap="xs">
                  <Text size="sm">Товары без движения &gt; 90 дней</Text>
                  <Alert color="red" variant="light">
                    Требуется распродажа или возврат поставщику
                  </Alert>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Таблица товаров */}
        <Card shadow="sm" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Title order={4}>Детальная информация по товарам</Title>
            <Group>
              <Select
                placeholder="Сортировка"
                data={[
                  { value: 'stock', label: 'По остатку' },
                  { value: 'days', label: 'По дням' },
                  { value: 'turnover', label: 'По обороту' }
                ]}
                w={150}
              />
              <Button variant="light" size="sm">
                Настроить пополнение
              </Button>
            </Group>
          </Group>
          
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>SKU</Table.Th>
                <Table.Th>Название</Table.Th>
                <Table.Th>Остаток</Table.Th>
                <Table.Th>Продаж/день</Table.Th>
                <Table.Th>Дней хватит</Table.Th>
                <Table.Th>Категория</Table.Th>
                <Table.Th>Оборот</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {warehouseData.products.map((product) => (
                <Table.Tr key={product.sku}>
                  <Table.Td>{product.sku}</Table.Td>
                  <Table.Td>{product.name}</Table.Td>
                  <Table.Td>{product.stock.toLocaleString()}</Table.Td>
                  <Table.Td>{product.dailySales}</Table.Td>
                  <Table.Td>
                    <Badge color={product.daysLeft < 30 ? 'red' : product.daysLeft < 60 ? 'yellow' : 'green'}>
                      {product.daysLeft} дней
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={product.category === 'A' ? 'blue' : product.category === 'B' ? 'green' : 'gray'}>
                      {product.category}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{product.turnover}</Table.Td>
                  <Table.Td>
                    {product.frozenDays > 0 ? (
                      <Badge color="red" leftSection={<IconAlertTriangle size={12} />}>
                        Завис {product.frozenDays}д
                      </Badge>
                    ) : (
                      <Badge color="green" leftSection={<IconCircleCheck size={12} />}>
                        Активный
                      </Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" size="sm">
                        <IconChartBar size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" size="sm">
                        <IconTruck size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {/* Рекомендации */}
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Рекомендации по оптимизации"
          color="blue"
        >
          <Stack gap="sm">
            <Text size="sm">
              • Товар ART-004 не продается 120 дней - рекомендуется распродажа со скидкой 50%
            </Text>
            <Text size="sm">
              • Склад "Москва" загружен на 90.5% - требуется перераспределение на другие склады
            </Text>
            <Text size="sm">
              • Прогнозируется дефицит товара ART-001 через 37 дней - необходимо оформить поставку
            </Text>
          </Stack>
        </Alert>

        {/* Модальное окно KPI */}
        <Modal
          opened={kpiModalOpened}
          onClose={() => setKpiModalOpened(false)}
          title={selectedKpi?.title}
          size="lg"
        >
          {selectedKpi && (
            <Stack>
              <Alert color={selectedKpi.color} variant="light">
                {selectedKpi.description}
              </Alert>
              
              <Group>
                <Paper p="md" radius="md" withBorder flex={1}>
                  <Text size="sm" c="dimmed">Текущее значение</Text>
                  <Text size="xl" fw={700}>{selectedKpi.value} {selectedKpi.unit}</Text>
                </Paper>
                
                <Paper p="md" radius="md" withBorder flex={1}>
                  <Text size="sm" c="dimmed">Изменение</Text>
                  <Group gap="xs">
                    <ThemeIcon
                      size="sm"
                      variant="light"
                      color={selectedKpi.trend > 0 ? 'green' : 'red'}
                    >
                      {selectedKpi.trend > 0 ? <IconArrowUpRight size={16} /> : <IconArrowDownRight size={16} />}
                    </ThemeIcon>
                    <Text size="xl" fw={700} c={selectedKpi.trend > 0 ? 'green' : 'red'}>
                      {Math.abs(selectedKpi.trend)}%
                    </Text>
                  </Group>
                </Paper>
              </Group>
              
              <ReactECharts
                option={{
                  tooltip: { trigger: 'axis' },
                  xAxis: {
                    type: 'category',
                    data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
                  },
                  yAxis: { type: 'value' },
                  series: [{
                    data: [120, 132, 101, 134, 90, 230, 210],
                    type: 'line',
                    smooth: true
                  }]
                }}
                style={{ height: 200 }}
              />
              
              <Stack gap="xs">
                <Text fw={500}>Факторы влияния:</Text>
                <Text size="sm">• Увеличение объема поставок на 15%</Text>
                <Text size="sm">• Оптимизация маршрутов доставки</Text>
                <Text size="sm">• Сезонный спрос на категорию товаров</Text>
              </Stack>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
}