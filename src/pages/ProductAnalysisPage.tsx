import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Grid,
  Paper,
  Stack,
  Group,
  TextInput,
  Select,
  Button,
  Table,
  Badge,
  ThemeIcon,
  ActionIcon,
  ScrollArea,
  Tabs,
  Card,
  Progress,
  Box,
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconStar,
  IconShoppingCart,
  IconPackage,
  IconArrowUpRight,
  IconArrowDownRight,
  IconAdjustments,
  IconDownload,
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';

interface ProductMetric {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  margin: number;
  stock: number;
  rating: number;
  sales: number;
  trend: number;
  status: 'good' | 'warning' | 'bad';
}

const generateProductData = (): ProductMetric[] => [
  {
    id: '1',
    name: 'Смартфон Samsung Galaxy S23',
    sku: 'SM-S23-128',
    category: 'Электроника',
    price: 79990,
    margin: 25,
    stock: 45,
    rating: 4.8,
    sales: 156,
    trend: 12,
    status: 'good'
  },
  {
    id: '2',
    name: 'Ноутбук Lenovo ThinkPad X1',
    sku: 'TP-X1-2023',
    category: 'Электроника',
    price: 129990,
    margin: 18,
    stock: 12,
    rating: 4.6,
    sales: 89,
    trend: -5,
    status: 'warning'
  },
  // Добавьте больше товаров по необходимости
];

const ProductAnalysisPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const products = generateProductData();

  const categories = Array.from(new Set(products.map(p => p.category)));

  const getStatusColor = (status: string) => {
    const colors = {
      good: 'green',
      warning: 'yellow',
      bad: 'red'
    } as const;
    return colors[status as keyof typeof colors] || 'gray';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(value);
  };

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Продажи', 'Маржа']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']
    },
    yAxis: [
      {
        type: 'value',
        name: 'Продажи',
        position: 'left'
      },
      {
        type: 'value',
        name: 'Маржа %',
        position: 'right'
      }
    ],
    series: [
      {
        name: 'Продажи',
        type: 'bar',
        data: [120, 132, 101, 134, 90, 230]
      },
      {
        name: 'Маржа',
        type: 'line',
        yAxisIndex: 1,
        data: [22, 25, 23, 24, 21, 26]
      }
    ]
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Заголовок и фильтры */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={2}>Анализ и выбор товара</Title>
            <Text c="dimmed">Анализ товаров и их эффективности</Text>
          </Stack>
          <Group>
            <Button variant="light" leftSection={<IconDownload size={16} />}>
              Экспорт
            </Button>
            <Button leftSection={<IconAdjustments size={16} />}>
              Настройки
            </Button>
          </Group>
        </Group>

        {/* Фильтры */}
        <Paper p="md" radius="md" withBorder>
          <Group>
            <TextInput
              placeholder="Поиск товаров..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Категория"
              data={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              leftSection={<IconFilter size={16} />}
              clearable
            />
            <Select
              placeholder="Статус"
              data={[
                { value: 'good', label: 'Хороший' },
                { value: 'warning', label: 'Требует внимания' },
                { value: 'bad', label: 'Проблемный' }
              ]}
              value={selectedStatus}
              onChange={setSelectedStatus}
              leftSection={<IconFilter size={16} />}
              clearable
            />
          </Group>
        </Paper>

        {/* Основной контент */}
        <Grid>
          {/* График продаж */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={600}>Динамика продаж и маржи</Text>
                <Group gap="xs">
                  <ActionIcon variant="subtle" color="gray">
                    <IconDownload size={16} />
                  </ActionIcon>
                </Group>
              </Group>
              <ReactECharts option={chartOption} style={{ height: '400px' }} />
            </Paper>
          </Grid.Col>

          {/* Статистика */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack>
              <Paper p="md" radius="md" withBorder>
                <Text fw={600} mb="md">Общая статистика</Text>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Всего товаров</Text>
                    <Text fw={600}>{products.length}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Средняя маржа</Text>
                    <Text fw={600} c="green">
                      {products.reduce((acc, p) => acc + p.margin, 0) / products.length}%
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Средний рейтинг</Text>
                    <Text fw={600}>
                      {products.reduce((acc, p) => acc + p.rating, 0) / products.length}
                    </Text>
                  </Group>
                </Stack>
              </Paper>

              <Paper p="md" radius="md" withBorder>
                <Text fw={600} mb="md">Распределение по статусам</Text>
                <Stack gap="md">
                  {['good', 'warning', 'bad'].map((status) => {
                    const count = products.filter(p => p.status === status).length;
                    const percentage = (count / products.length) * 100;
                    return (
                      <Box key={status}>
                        <Group justify="space-between" mb={4}>
                          <Text size="sm" c="dimmed">
                            {status === 'good' ? 'Хорошие' : status === 'warning' ? 'Требуют внимания' : 'Проблемные'}
                          </Text>
                          <Text size="sm" fw={600}>{count}</Text>
                        </Group>
                        <Progress
                          value={percentage}
                          color={getStatusColor(status)}
                          size="sm"
                        />
                      </Box>
                    );
                  })}
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Таблица товаров */}
        <Paper p="md" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Text fw={600}>Список товаров</Text>
            <Group gap="xs">
              <ActionIcon variant="subtle" color="gray">
                <IconDownload size={16} />
              </ActionIcon>
            </Group>
          </Group>
          <ScrollArea>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Товар</Table.Th>
                  <Table.Th>SKU</Table.Th>
                  <Table.Th>Категория</Table.Th>
                  <Table.Th>Цена</Table.Th>
                  <Table.Th>Маржа</Table.Th>
                  <Table.Th>Остаток</Table.Th>
                  <Table.Th>Рейтинг</Table.Th>
                  <Table.Th>Продажи</Table.Th>
                  <Table.Th>Тренд</Table.Th>
                  <Table.Th>Статус</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {products.map((product) => (
                  <Table.Tr key={product.id}>
                    <Table.Td>{product.name}</Table.Td>
                    <Table.Td>{product.sku}</Table.Td>
                    <Table.Td>{product.category}</Table.Td>
                    <Table.Td>{formatCurrency(product.price)}</Table.Td>
                    <Table.Td>{product.margin}%</Table.Td>
                    <Table.Td>{product.stock}</Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <IconStar size={16} style={{ color: '#FFD700' }} />
                        {product.rating}
                      </Group>
                    </Table.Td>
                    <Table.Td>{product.sales}</Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        {product.trend > 0 ? (
                          <IconTrendingUp size={16} style={{ color: '#40C057' }} />
                        ) : (
                          <IconTrendingDown size={16} style={{ color: '#FA5252' }} />
                        )}
                        <Text c={product.trend > 0 ? 'green' : 'red'}>
                          {product.trend > 0 ? '+' : ''}{product.trend}%
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(product.status)}>
                        {product.status === 'good' ? 'Хороший' : 
                         product.status === 'warning' ? 'Требует внимания' : 'Проблемный'}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ProductAnalysisPage; 