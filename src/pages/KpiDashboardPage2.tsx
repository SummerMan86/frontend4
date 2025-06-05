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
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon }) => {
  const theme = useMantineTheme();
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
<Card shadow="sm" padding="lg" radius="md" withBorder  className = "hover-lift">
  <Stack gap="sm">
    <Group justify="space-between">
      <Text
        size="xs"
        fw={500}
        c="gray.6"
        tt="uppercase"
        style={{ letterSpacing: '0.05em' }}
      >
        {title}
      </Text>
      {icon && (
        <ThemeIcon variant="light" size="sm" color="gray">
          {icon}
        </ThemeIcon>
      )}
    </Group>

    <Group align="center" gap="xs" wrap="nowrap" style={{ alignItems: 'flex-start' }}>
      <Text
        size="xl"
        fw={700}
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
              size="xs"
              fw={600}
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
            size="xs"
            c="gray.5"
            style={{
              lineHeight: 1,
              marginTop: 0,
              transform: 'translateY(-2px)', // поднимаем текст ближе к процентам
              fontSize: '10px', // еще компактнее
            }}
          >
            vs среднее
          </Text>
        </div>
      )}
    </Group>
  </Stack>
</Card>  
  );
};

function KpiDashboard() {
  const theme = useMantineTheme();

  const kpiData = [
    { title: 'Продажи за день', value: '1 045 000 ₽', change: 8 },
    { title: 'Заказы за день', value: 547, change: 12 },
    { title: 'Прибыль за день', value: '210 400 ₽', change: 5 },
    { title: 'Возвраты', value: '42 шт.', change: -3 },
  ];

  const chartOption: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 40, top: 50, bottom: 40 },
    xAxis: {
      type: 'category',
      data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      axisLabel: { color: theme.colors.gray[6] }, // FIXED: Changed from neutral to gray
    },
    yAxis: { type: 'value', axisLabel: { color: theme.colors.gray[6] } }, // FIXED: Changed from neutral to gray
    color: [theme.colors.primary[5], theme.colors.success[5]], // FIXED: Changed from brand to primary
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

      <Card mb="xl" className = "hover-lift">
        <Text size="lg" fw={600} mb="lg" c="gray.7">
          Динамика продаж и прибыли
        </Text>
        <ReactECharts option={chartOption} style={{ height: 360 }} />
      </Card>

      <Card className = "hover-lift">
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