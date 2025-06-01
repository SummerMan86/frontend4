import React from 'react';
import {
  Card,
  Stack,
  Group,
  Text,
  Title,
  Progress,
  ThemeIcon,
  Divider,
  rem, Tooltip, Badge, Button
} from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight, IconCircleFilled } from '@tabler/icons-react';



type RowKpi = {
    label: string;
    value: string | number;
    diff: number;
    positive: boolean;
    unit?: string;
    progress?: number;
    subLabel?: string; // ← новое поле для подписи
  };
  
  type MultiKpiCardProps = {
    title: string;
    rows: RowKpi[];
  };
  
  function MultiKpiCard({ title, rows }: MultiKpiCardProps) {
    return (
      <Card shadow="xs" radius="md" p="md" style={{ minWidth: 300, background: "#fff" }}>
        <Text size="xs" c="dimmed" fw={600} tt="uppercase" mb={8}>
          {title}
        </Text>
        <Stack gap={10}>
          {rows.map((row, idx) => (
            <Group key={idx} justify="space-between" align="flex-start">
              <Text size="sm" c="dimmed">{row.label}</Text>
              <Stack gap={0} align="end">
                <Group gap={6} align="center">
                  <Text size="sm" fw={700}>
                    {row.value}
                    {row.unit && <Text component="span" size="xs" c="dimmed">{row.unit}</Text>}
                  </Text>
                  <Group gap={2}>
                    <Text size="xs" fw={600} c={row.positive ? 'green' : 'red'}>
                      {row.positive ? '+' : ''}
                      {row.diff}%
                    </Text>
                    <ThemeIcon color={row.positive ? 'green' : 'red'} variant="light" size="xs">
                      {row.positive ? <IconArrowUpRight size={14} /> : <IconArrowDownRight size={14} />}
                    </ThemeIcon>
                  </Group>
                </Group>
                {row.subLabel && (
                  <Text size="xs" c="dimmed" lh={1} mt={2}>
                    {row.subLabel}
                  </Text>
                )}
                {row.progress !== undefined && (
                  <Progress value={row.progress} size="xs" w={48} radius="xl" color={row.positive ? 'green' : 'red'} />
                )}
              </Stack>
            </Group>
          ))}
        </Stack>
      </Card>
    );
  }
  




  type KpiCardProps = {
    label: string;
    value: string | number;
    diff: number;
    unit?: string;
    period?: string;
    btnLabel?: string;
    positive?: boolean;
  };
  
  export function KpiCard({
    label,
    value,
    diff,
    unit,
    period = 'Compared to previous month',
    btnLabel = 'TODAY',
    positive = true,
  }: KpiCardProps) {
    return (
      <Card
        shadow="xs"
        radius="md"
        p="md"
        withBorder={false}
        style={{
          background: '#fff',
          minWidth: rem(280),
          minHeight: rem(120),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Group justify="space-between" align="flex-start" mb={8}>
          <Text size="xs" c="dimmed" fw={600} tt="uppercase" lh={1}>
            {label}
          </Text>
          <Button variant="light" color="blue" size="xs" radius="sm" fw={700}>
            {btnLabel}
          </Button>
        </Group>
        <Group align="flex-end" gap={8} mb={2}>
          <Text size="2xl" fw={700} lh={1}>
            {value}
          </Text>
          <Group gap={2}>
            <Text
              size="sm"
              c={positive ? 'green' : 'red'}
              fw={600}
              lh={1}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {diff}%
              <IconArrowUpRight
                size={16}
                style={{
                  marginLeft: 2,
                  color: positive ? 'green' : 'red',
                  transform: positive ? 'none' : 'rotate(180deg)',
                }}
              />
            </Text>
          </Group>
        </Group>
        <Text size="xs" c="dimmed" mt={2}>
          {period}
        </Text>
      </Card>
    );
  }
  



const Trend = ({ value }: { value: number }) => (
  <Group gap={2} align="center">
    <ThemeIcon
      color={value > 0 ? 'teal' : 'red'}
      size="sm"
      radius="xl"
      variant="light"
    >
      {value > 0 ? <IconArrowUpRight size={14} /> : <IconArrowDownRight size={14} />}
    </ThemeIcon>
    <Text c={value > 0 ? 'teal' : 'red'} size="xs" fw={700}>
      {value > 0 ? `+${value}%` : `${value}%`}
    </Text>
  </Group>
);

export default function KpiDashboardPage() {
    const data = {
      total: 540254,
      totalTrend: 12,
      organic: { sum: 455403, percent: 84 },
      fromAd: { sum: 121551, percent: 22 },
      fromAuction: { sum: 15600, percent: 3 },
      lost: 40019,
      lostTrend: -7,
      potential: 580273,
      zeroSku: 7,
    };
  
    return (
      <Group align="flex-start" gap="lg">
        {/* Левая основная карточка */}
        <Card
          withBorder
          radius="md"
          p="md"
          style={{ borderColor: '#e6e6f2', background: '#fff', width: 340 }}
          shadow="sm"
        >
          <Title
            order={5}
            mb="xs"
            style={{
              color: '#5f3dc4',
              display: 'flex',
              alignItems: 'center',
              gap: rem(6),
              fontWeight: 700,
            }}
          >
            <IconCircleFilled size={16} /> ЗАКАЗЫ
          </Title>
          <KpiCard label="Orders" value="54,000" diff={12} unit="₽" />
          <Stack gap={6}>
            {/* Multi KPI style: Заказы за период */}
            {/* ...оставьте остальной ваш код... */}
          </Stack>
        </Card>
  
        {/* Правая новая карточка с KPI построчно */}
        <MultiKpiCard
          title="Выполнение KPI"
          rows={[
            { label: "Заказов сегоднял", value: 13456, diff: 34, positive: true, unit: "₽", progress: 76, subLabel: "vs в среднем за день"},
            { label: "Органика", value: "8,500", diff: 22, positive: true, unit: "₽", progress: 60, subLabel: "vs в среднем за день" },
            { label: "Реклама", value: "4,000", diff: -4, positive: false, unit: "₽", progress: 45, subLabel: "vs в среднем за день" },
            { label: "SKU с нулем", value: 7, diff: 0, positive: false, unit: "шт.", subLabel: "vs в среднем за день" }
          ]}
        />
      </Group>
    );
  }
