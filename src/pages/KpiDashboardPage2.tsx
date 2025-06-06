import React from 'react';
import {
  Card,
  Group,
  Text,
  SimpleGrid,
  Table,
  Badge,
  ThemeIcon,
  Container,
  Title,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import { ThemeProvider } from '../theme';
import '../theme/styles.css';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  sparklineData?: number[];
  unit?: string; // Add unit prop for formatting
}

// Generate dates for last 30 days
const generateLast30Days = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    dates.push(`${day}.${month}.${year}`);
  }
  
  return dates;
};

// Format value with units
const formatValueWithUnit = (value: number, unit: string): string => {
  switch (unit) {
    case '₽':
      return new Intl.NumberFormat('ru-RU').format(Math.round(value)) + ' ₽';
    case 'шт':
      return Math.round(value) + ' шт';
    case 'заказы':
      return Math.round(value).toString();
    default:
      return Math.round(value).toString();
  }
};

// Generate test data for last 30 days trend
const generateSparklineTestData = (baseValue: number, trend: 'up' | 'down' | 'flat' = 'up'): number[] => {
  const data: number[] = [];
  let value = baseValue;
  
  for (let i = 0; i < 30; i++) {
    // Add some random variation
    const randomVariation = (Math.random() - 0.5) * 0.2;
    
    // Apply trend
    let trendValue = 0;
    if (trend === 'up') {
      trendValue = i * 0.01; // Gradual increase
    } else if (trend === 'down') {
      trendValue = -i * 0.01; // Gradual decrease
    }
    
    value = baseValue * (1 + trendValue + randomVariation);
    data.push(Math.max(0, value)); // Ensure no negative values
  }
  
  return data;
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon, sparklineData, unit = '' }) => {
  const theme = useMantineTheme();
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  // Generate dates for the last 30 days
  const dates = generateLast30Days();

  // Create sparkline chart option
  const sparklineOption = sparklineData ? {
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    xAxis: {
      type: 'category',
      show: false,
      data: dates, // Use actual dates instead of numbers
    },
    yAxis: {
      type: 'value',
      show: false,
      scale: true,
    },
    series: [
      {
        type: 'line',
        data: sparklineData,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
          color: isPositive ? theme.colors.green[6] : isNegative ? theme.colors.red[6] : theme.colors.blue[6],
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
                color: isPositive ? 
                  `${theme.colors.green[6]}20` : 
                  isNegative ? 
                  `${theme.colors.red[6]}20` : 
                  `${theme.colors.blue[6]}20`
              },
              {
                offset: 1,
                color: 'transparent'
              }
            ]
          }
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params[0];
        const date = dates[point.dataIndex];
        const formattedValue = formatValueWithUnit(point.value, unit);
        return `<div style="padding: 4px 8px;">
                  <div style="font-weight: 600; margin-bottom: 4px;">${date}</div>
                  <div>${formattedValue}</div>
                </div>`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: theme.colors.gray[3],
      borderWidth: 1,
      textStyle: {
        color: theme.colors.gray[8],
        fontSize: 12
      }
    }
  } : null;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="hover-lift">
      <Stack gap="sm">
        <Text
          size="xs"
          fw={400}
          c="gray.6"
          tt="uppercase"
          style={{ letterSpacing: '0.05em' }}
        >
          {title}
        </Text>

        <Group align="center" gap="xs" wrap="nowrap" style={{ alignItems: 'flex-start' }}>
          <Text
            size="2xl"
            fw={600}
            c="gray.9"
            style={{
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.015em',
              lineHeight: 1.2,
            }}
          >
            {value}
          </Text>

          {change !== undefined && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 38,
                lineHeight: 1,
              }}
            >
              <Group gap={3} align="center" style={{ minHeight: 18 }}>
                <ThemeIcon
                  variant="light"
                  size={16}
                  color={isPositive ? 'success' : isNegative ? 'error' : 'gray'}
                  style={{ verticalAlign: 'middle', padding: 0 }}
                >
                  {isPositive ? <IconArrowUpRight size={10} /> : <IconArrowDownRight size={10} />}
                </ThemeIcon>
                <Text
                  size="sm"
                  fw={500}
                  c={isPositive ? 'success.5' : isNegative ? 'error.5' : 'gray.6'}
                  style={{
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                    verticalAlign: 'middle',
                  }}
                >
                  {Math.abs(change)}%
                </Text>
              </Group>
              <Text
                size="md"
                c="gray.5"
                style={{
                  lineHeight: 1,
                  marginTop: 0,
                  transform: 'translateY(-2px)',
                  fontSize: '11px',
                }}
              >
                vs среднее
              </Text>
            </div>
          )}
        </Group>

        {/* Sparkline Chart */}
        {sparklineData && sparklineOption && (
          <div style={{ marginTop: '8px' }}>
            <Text size="xs" c="gray.5" mb={4}>
              Тренд за 30 дней
            </Text>
            <ReactECharts 
              option={sparklineOption} 
              style={{ height: 40, width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        )}
      </Stack>
    </Card>
  );
};

function KpiDashboard() {
  const theme = useMantineTheme();

  // KPI data with sparkline test data and units
  const kpiData = [
    { 
      title: 'Продажи за день', 
      value: '1 045 000 ₽', 
      change: 8,
      sparklineData: generateSparklineTestData(1000000, 'up'), // Replace with real data later
      unit: '₽'
    },
    { 
      title: 'Заказы за день', 
      value: 547, 
      change: 12,
      sparklineData: generateSparklineTestData(500, 'up'), // Replace with real data later
      unit: 'заказы'
    },
    { 
      title: 'Прибыль за день', 
      value: '210 400 ₽', 
      change: 5,
      sparklineData: generateSparklineTestData(200000, 'up'), // Replace with real data later
      unit: '₽'
    },
    { 
      title: 'Возвраты', 
      value: '42 шт.', 
      change: -3,
      sparklineData: generateSparklineTestData(45, 'down'), // Replace with real data later
      unit: 'шт'
    },
  ];

  const chartOption: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 40, top: 50, bottom: 40 },
    xAxis: {
      type: 'category',
      data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      axisLabel: { color: theme.colors.gray[6] },
    },
    yAxis: { type: 'value', axisLabel: { color: theme.colors.gray[6] } },
    color: [theme.colors.primary[5], theme.colors.success[5]],
    series: [
      { name: 'Продажи, ₽', type: 'bar', data: [120, 200, 150, 80, 70, 110, 130] },
      { name: 'Прибыль, ₽', type: 'line', smooth: true, data: [30, 65, 50, 30, 28, 45, 60] },
    ],
  };

  const problemRows = [
    { sku: 'SKU‑001', stock: 12, daysLeft: 3, rating: 3, avgRating: 3.8, returns: '8% (5 шт.)' },
    { sku: 'SKU‑007', stock: 5, daysLeft: 2, rating: 5, avgRating: 4.9, returns: '1% (1 шт.)' },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xs" mb="xl">
        <Title order={1}>KPI Dashboard</Title>
        <Text size="lg" c="gray.6">
          Мониторинг ключевых показателей эффективности
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl" mb="xl">
        {kpiData.map((item) => (
          <StatsCard key={item.title} {...item} />
        ))}
      </SimpleGrid>

      <Card mb="xl" className="hover-lift">
        <Text size="lg" fw={600} mb="lg" c="gray.7">
          Динамика продаж и прибыли
        </Text>
        <ReactECharts option={chartOption} style={{ height: 360 }} />
      </Card>

      <Card className="hover-lift">
        <Text size="lg" fw={600} mb="lg" c="gray.7">
          Проблемные SKU
        </Text>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>SKU</Table.Th>
              <Table.Th>Остаток</Table.Th>
              <Table.Th>Хватит на</Table.Th>
              <Table.Th>Оценка</Table.Th>
              <Table.Th>Рейтинг</Table.Th>
              <Table.Th>Возвраты</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {problemRows.map((row) => (
              <Table.Tr key={row.sku}>
                <Table.Td>{row.sku}</Table.Td>
                <Table.Td>{row.stock}</Table.Td>
                <Table.Td>{row.daysLeft} дн.</Table.Td>
                <Table.Td><Badge color={row.rating < 4 ? 'error' : 'success'}>{row.rating}</Badge></Table.Td>
                <Table.Td>{row.avgRating}</Table.Td>
                <Table.Td>{row.returns}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Container>
  );
}

export default function KpiDashboardPage2() {
  return (
    <ThemeProvider>
      <KpiDashboard />
    </ThemeProvider>
  );
}