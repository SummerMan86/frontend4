// KPI Dashboard – Mantine 8 + React + echarts-for-react
// ------------------------------------------------------
// • Помещён в один файл для наглядности (KpiDashboardPage.tsx)
// • Используются только публичные библиотеки: @mantine/* и echarts-for-react
// • Данные моковые, хранятся внутри компонента, легко заменить API‑данными
// ------------------------------------------------------

import React from 'react';
import {
  Card,
  Group,
  Text,
  Stack,
  SimpleGrid,
  Table,
  Progress,
  Badge,
  ThemeIcon,
  Divider,
  Container,
  MantineProvider,
} from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';

// ──────────────────────────────────────────────────────────────────────────────
// Вспомогательный компонент KPI‑карточки (в духе StatsCard)
// ──────────────────────────────────────────────────────────────────────────────
interface StatsCardProps {
  title: string;
  value: string | number;
  diff?: number; // динамика в %
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, diff }) => {
  const positive = diff !== undefined && diff > 0;
  const negative = diff !== undefined && diff < 0;

  return (
    <Card radius="md" withBorder padding="md">
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        {title}
      </Text>

      <Group align="flex-end" mt={4} gap={4}>
        <Text fz="xl" fw={700}>
          {value}
        </Text>
        {diff !== undefined && (
          <Group gap={2} align="center" c={positive ? 'teal.6' : negative ? 'red.6' : 'gray.6'}>
            <ThemeIcon variant="light" size="sm" color={positive ? 'teal' : negative ? 'red' : 'gray'}>
              {positive ? <IconArrowUpRight size={14} /> : <IconArrowDownRight size={14} />}
            </ThemeIcon>
            <Text size="xs" fw={700}>
              {diff}%
            </Text>
          </Group>
        )}
      </Group>

      
    </Card>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Основной компонент страницы
// ──────────────────────────────────────────────────────────────────────────────
export default function KpiDashboardPage2() {
  // Мок‑данные для примера
  const kpiData = [
    { title: 'Продажи за день', value: '1 045 000 ₽', diff: 8 },
    { title: 'Заказы за день', value: 547, diff: 12 },
    { title: 'Прибыль за день', value: '210 400 ₽', diff: 5 },
    { title: 'Возвраты', value: '42 шт.', diff: -3 },
  ];

  // Данные для графика (sales & profit)
  const chartOption: echarts.EChartsOption = {
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
        data: [120, 200, 150, 80, 70, 110, 130],
        barWidth: 14,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: 'Прибыль, ₽',
        type: 'line',
        smooth: true,
        data: [30, 65, 50, 30, 28, 45, 60],
      },
    ],
  };

  // Таблица проблемных SKU (мок)
  const problemRows = [
    {
      sku: 'SKU‑001',
      stock: 12,
      daysLeft: 3,
      lastRating: 3,
      ratingAvg: 3.8,
      returns: '8% (5 шт.)',
    },
    {
      sku: 'SKU‑007',
      stock: 5,
      daysLeft: 2,
      lastRating: 5,
      ratingAvg: 4.9,
      returns: '1% (1 шт.)',
    },
  ];

  return (
      <Container size="lg" py="lg">
        {/* KPI grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
          {kpiData.map((k) => (
            <StatsCard key={k.title} {...k} />
          ))}
        </SimpleGrid>

        <Divider my="lg" />

        {/* График продаж/прибыли */}
        <Card withBorder radius="md" p="md" mb="lg">
          <Text size="sm" c="dimmed" fw={600} mb="xs">
            Динамика продаж и прибыли (₽)
          </Text>
          <ReactECharts option={chartOption} style={{ height: 300 }} />
        </Card>

        {/* Таблица проблемных SKU */}
        <Card withBorder radius="md" p="md">
          <Text size="sm" c="dimmed" fw={600} mb="xs">
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
              {problemRows.map((row) => (
                <Table.Tr key={row.sku}>
                  <Table.Td>{row.sku}</Table.Td>
                  <Table.Td>{row.stock}</Table.Td>
                  <Table.Td>{row.daysLeft} дн.</Table.Td>
                  <Table.Td>
                    <Badge color={row.lastRating < 4 ? 'red' : 'green'}>{row.lastRating}</Badge>
                  </Table.Td>
                  <Table.Td>{row.ratingAvg}</Table.Td>
                  <Table.Td>{row.returns}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Container>
  );
}
