import React from 'react';
import {
  MantineProvider,
  Container,
  SimpleGrid,
  Card,
  Text,
  Group,
  Progress,
  ThemeIcon,
  Divider,
  Table,
  Badge,
} from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';

// KPI-карточка
interface StatsCardProps {
  title: string;
  value: string | number;
  diff?: number;
}
const StatsCard: React.FC<StatsCardProps> = ({ title, value, diff }) => {
  const positive = diff !== undefined && diff > 0;
  const negative = diff !== undefined && diff < 0;
  return (
    <Card radius="md" withBorder p="md">
      <Text size="xs" c="gray.6" tt="uppercase" fw={600}>
        {title}
      </Text>
      <Group align="flex-end" mt={4} gap={4}>
        <Text fz="xl" fw={700}>
          {value}
        </Text>
        {diff !== undefined && (
          <Group gap={4} align="center" c={positive ? 'green.5' : negative ? 'red.5' : 'gray.6'}>
            <ThemeIcon size="xs" variant="light" color={positive ? 'green' : negative ? 'red' : 'gray'}>
              {positive ? <IconArrowUpRight size={12} /> : <IconArrowDownRight size={12} />}
            </ThemeIcon>
            <Text size="xs" fw={700}>
              {positive ? `+${diff}%` : `${diff}%`}
            </Text>
          </Group>
        )}
      </Group>
      {diff !== undefined && (
        <Progress
          mt={4}
          size="xs"
          value={Math.min(Math.abs(diff), 100)}
          color={positive ? 'green' : negative ? 'red' : 'gray'}
          radius="xl"
        />
      )}
    </Card>
  );
};

// Основная страница KPI Dashboard
const KpiDashboardPage3: React.FC = () => {
  const kpis = [
    { title: 'Продажи за день', value: '1 045 000 ₽', diff: 8 },
    { title: 'Заказы за день', value: '547', diff: 12 },
    { title: 'Прибыль за день', value: '210 400 ₽', diff: 5 },
    { title: 'Возвраты', value: '42 шт.', diff: -3 },
  ];

  const chartOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    xAxis: {
      type: 'category',
      data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#efefef' } },
    },
    color: ['#1c7ed6', '#0ca678'],
    series: [
      {
        name: 'Продажи, ₽',
        type: 'bar',
        data: ['120', '200', '150', '80', '70', '110', '130'],
        barWidth: 14,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
      {
        name: 'Прибыль, ₽',
        type: 'line',
        smooth: true,
        data: ['30', '65', '50', '30', '28', '45', '60'],
      },
    ],
  };

  // Все значения — строки!
  const problems = [
    { sku: 'SKU-001', stock: '12', daysLeft: '3', lastRating: '3', ratingAvg: '3.8', returns: '8% (5 шт.)' },
    { sku: 'SKU-007', stock: '5', daysLeft: '2', lastRating: '5', ratingAvg: '4.9', returns: '1% (1 шт.)' },
  ];

  return (
    <MantineProvider
      theme={{
        fontFamily: 'SBSans Text, Inter, sans-serif',
        headings: { fontFamily: 'SBSans Text, sans-serif' },
        colors: {},
        radius: { xs: '2px', sm: '4px', md: '6px', lg: '8px' },
        spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
      }}
    >
      <Container size="lg" py="md">
        {/* Фильтры сверху (по необходимости добавь сюда компоненты фильтра) */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
          {kpis.map((k) => (
            <StatsCard key={k.title} {...k} />
          ))}
        </SimpleGrid>
        <Divider my="lg" />
        <Card withBorder radius="md" p="md" mb="lg">
          <Text size="sm" c="gray.6" fw={600} mb={4}>
            Динамика продаж и прибыли (₽)
          </Text>
          <ReactECharts option={chartOption} style={{ height: 300 }} />
        </Card>
        <Card withBorder radius="md" p="md">
          <Text size="sm" c="gray.6" fw={600} mb={4}>
            Проблемные SKU (остаток, рейтинг, возвраты)
          </Text>
          <Table striped highlightOnHover withColumnBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>SKU</Table.Th>
                <Table.Th>Остаток</Table.Th>
                <Table.Th>Хватит на</Table.Th>
                <Table.Th>Последняя оценка</Table.Th>
                <Table.Th>Средний рейтинг</Table.Th>
                <Table.Th>Возвраты</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {problems.map((r) => (
                <Table.Tr key={r.sku}>
                  <Table.Td>{r.sku}</Table.Td>
                  <Table.Td>{r.stock}</Table.Td>
                  <Table.Td>{r.daysLeft} дн.</Table.Td>
                  <Table.Td>
                    <Badge color={parseFloat(r.lastRating) < 4 ? 'red' : 'green'}>
                      {r.lastRating}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{r.ratingAvg}</Table.Td>
                  <Table.Td>{r.returns}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Container>
    </MantineProvider>
  );
}

export default KpiDashboardPage3;
