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
    <Card>
      <Stack gap="sm">
        {/* Заголовок - используем токены темы */}
        <Group justify="space-between">
          <Text 
            size={theme.other.dashboardFontTiny}
            fw={theme.other.dashboardFontWeightMedium}
            c={theme.other.dashboardTextMuted}
            tt="uppercase"
            style={{ letterSpacing: theme.other.dashboardLetterSpacingWider }}
          >
            {title}
          </Text>
          {icon && (
            <ThemeIcon variant="light" size="sm" color="neutral">
              {icon}
            </ThemeIcon>
          )}
        </Group>

        {/* Значение и изменение */}
        <Group align="flex-end" gap="xs">
          <Text 
            size={theme.other.dashboardFontLarge}
            fw={theme.other.dashboardFontWeightBold}
            c={theme.other.dashboardTextPrimary}
            style={{ 
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: theme.other.dashboardLetterSpacingTight,
              lineHeight: theme.other.dashboardLineHeightTight,
            }}
          >
            {value}
          </Text>
          
          {change !== undefined && (
            <Stack gap={2} align="flex-end">
              {/* Стрелка и процент */}
              <Group gap={4} align="center">
                <ThemeIcon 
                  variant="light" 
                  size={20} 
                  color={isPositive ? 'success' : isNegative ? 'error' : 'neutral'}
                >
                  {isPositive ? (
                    <IconArrowUpRight size={12} />
                  ) : (
                    <IconArrowDownRight size={12} />
                  )}
                </ThemeIcon>
                <Text 
                  size="sm"
                  fw={theme.other.dashboardFontWeightSemibold}
                  c={isPositive ? 'success.5' : isNegative ? 'error.5' : 'neutral.6'}
                  style={{ 
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: theme.other.dashboardLineHeightTight,
                  }}
                >
                  {Math.abs(change)}%
                </Text>
              </Group>
              
              {/* Подпись "vs среднее" */}
              <Text 
                size="9px"
                c={theme.other.dashboardTextMuted}
                style={{ lineHeight: theme.other.dashboardLineHeightTight }}
              >
                vs среднее
              </Text>
            </Stack>
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

  // График с токенами темы
  const chartOption: echarts.EChartsOption = {
    tooltip: { 
      trigger: 'axis',
      backgroundColor: theme.colors.neutral[0],
      borderColor: theme.other.dashboardCardBorder,
      borderWidth: 1,
      textStyle: {
        fontFamily: theme.fontFamily,
        fontSize: 13,
        color: theme.other.dashboardTextPrimary,
      },
    },
    
    grid: { left: 60, right: 40, top: 50, bottom: 50 },
    
    xAxis: {
      type: 'category',
      data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: theme.fontFamily,
        fontSize: 12,
        color: theme.other.dashboardTextSecondary,
        fontWeight: 500,
      }
    },
    
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { 
        lineStyle: { 
          color: theme.colors.neutral[1],
          width: 1,
        } 
      },
      axisLabel: {
        fontFamily: theme.fontFamily,
        fontSize: 11,
        color: theme.other.dashboardTextSecondary,
      }
    },
    
    // Используем цвета из токенов
    color: [
      theme.colors.brand[6],    // Основной синий
      theme.colors.success[5]   // Зеленый успеха
    ],
    
    series: [
      {
        name: 'Продажи, ₽',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110, 130],
        barWidth: 20,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          shadowColor: `${theme.colors.brand[6]}40`,
          shadowBlur: 10,
          shadowOffsetY: 4,
        },
      },
      {
        name: 'Прибыль, ₽',
        type: 'line',
        smooth: true,
        data: [30, 65, 50, 30, 28, 45, 60],
        lineStyle: {
          width: 3,
          shadowColor: `${theme.colors.success[5]}40`,
          shadowBlur: 10,
          shadowOffsetY: 4,
        },
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
  };

  const problemRows = [
    {
      sku: 'SKU‑001',
      stock: 12,
      daysLeft: 3,
      rating: 3,
      avgRating: 3.8,
      returns: '8% (5 шт.)',
    },
    {
      sku: 'SKU‑007',
      stock: 5,
      daysLeft: 2,
      rating: 5,
      avgRating: 4.9,
      returns: '1% (1 шт.)',
    },
  ];

  return (
    <Container>
      {/* Заголовок - автоматически использует токены из темы */}
      <Stack gap="xs" mb="xl">
        <Title order={1}>KPI Dashboard</Title>
        <Text size="lg" c="dimmed">
          Мониторинг ключевых показателей эффективности
        </Text>
      </Stack>

      {/* KPI карточки */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl" mb="xl">
        {kpiData.map((item) => (
          <StatsCard key={item.title} {...item} />
        ))}
      </SimpleGrid>

      {/* График */}
      <Card mb="xl">
        <Stack gap="lg">
          <Text size="lg" fw={600} c={theme.other.dashboardTextSecondary}>
            Динамика продаж и прибыли
          </Text>
          <ReactECharts option={chartOption} style={{ height: 360 }} />
        </Stack>
      </Card>

      {/* Таблица - автоматически использует стили из components.ts */}
      <Card>
        <Stack gap="lg">
          <Text size="lg" fw={600} c={theme.other.dashboardTextSecondary}>
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
                  <Table.Td 
                    style={{ 
                      fontFamily: theme.fontFamilyMonospace,
                      fontWeight: 600,
                    }}
                  >
                    {row.sku}
                  </Table.Td>
                  <Table.Td>{row.stock}</Table.Td>
                  <Table.Td>{row.daysLeft} дн.</Table.Td>
                  <Table.Td>
                    <Badge color={row.rating < 4 ? 'error' : 'success'}>
                      {row.rating}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{row.avgRating}</Table.Td>
                  <Table.Td>{row.returns}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
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