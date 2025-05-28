// src/pages/KpiDashboardPage.tsx
import React from 'react';
import {
  Card,
  Grid,
  Stack,
  Text,
  ThemeIcon,
  Group,
  DefaultMantineColor,
} from '@mantine/core';
import { createStyles } from '@mantine/styles';
import type { MantineTheme } from '@mantine/styles';
import {
  IconTrendingUp,
  IconCurrencyRubel,
  IconPackage,
} from '@tabler/icons-react';

const useStyles = createStyles((theme: MantineTheme) => ({
  rootCard: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.gray[0],
    boxShadow: theme.shadows.sm,
  },

  header: {
    background: theme.colors.violet[6],
    color: theme.white,
    padding: '6px 10px',
    fontWeight: 600,
    fontSize: theme.fontSizes.sm,
  },

  inner: {
    border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.sm,
    background: theme.white,
  },

  kpiValue: {
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1,
  },

  kpiUnit: {
    marginLeft: 4,
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },

  footRow: {
    borderTop: `1px solid ${theme.colors.gray[3]}`,
    padding: '4px 8px',
    fontSize: theme.fontSizes.xs,
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

type KpiFootnote = { label: string; value: string };
type KpiCardData = {
  title: string;
  value: string;
  unit?: string;
  color: DefaultMantineColor;
  icon: React.ReactNode;
  subtitle?: string;
  footnotes?: KpiFootnote[];
};

const kpiData: KpiCardData[] = [
  {
    title: 'Заказы за период',
    value: '540 254',
    unit: '₽',
    color: 'violet',
    icon: <IconPackage size={24} />,
    subtitle: '274 ед.',
    footnotes: [
      { label: 'Органика', value: '455 403 ₽' },
      { label: 'Заказы из АРК', value: '121 551 ₽' },
      { label: 'Упущенная выручка', value: '40 019 ₽' },
    ],
  },
  {
    title: 'Продажи до СПП',
    value: '55 799',
    unit: '₽',
    color: 'blue',
    icon: <IconTrendingUp size={24} />,
    subtitle: '21 ед.',
    footnotes: [
      { label: 'Продажи после СПП', value: '42 270 ₽' },
      { label: 'Упущенная выручка', value: '4 467 ₽' },
    ],
  },
  {
    title: 'Расходы',
    value: '17 601',
    unit: '₽',
    color: 'red',
    icon: <IconCurrencyRubel size={24} />,
    subtitle: '32 %',
    footnotes: [
      { label: 'Платная комиссия', value: '11 573 ₽' },
      { label: 'Логистика WB', value: '5 948 ₽' },
      { label: 'Штрафы', value: '80 ₽' },
    ],
  },
  // и т. д.
];

const KPICard: React.FC<KpiCardData> = ({
  title,
  value,
  unit,
  color,
  icon,
  subtitle,
  footnotes,
}) => {
  const { classes } = useStyles();
  return (
    <Card withBorder p={0} className={classes.rootCard}>
      <div className={classes.header}>{title}</div>
      <Stack p="sm" gap={4}>
        <Group align="center" gap={4}>
          <ThemeIcon color={color} radius="md" variant="filled" size={32}>
            {icon}
          </ThemeIcon>
          <Text className={classes.kpiValue} c={`${color}.9`}>
            {value}
            {unit && <span className={classes.kpiUnit}>{unit}</span>}
          </Text>
        </Group>
        {subtitle && (
          <Text size="xs" c="dimmed" ml={40}>
            {subtitle}
          </Text>
        )}
      </Stack>
      {footnotes?.map((fn, idx) => (
        <div key={idx} className={classes.footRow}>
          <span>{fn.label}</span>
          <span>{fn.value}</span>
        </div>
      ))}
    </Card>
  );
};

const KpiDashboardPage: React.FC = () => (
  <Grid gutter="md">
    {kpiData.map((card, idx) => (
      <Grid.Col key={idx} span={{ base: 12, sm: 6, lg: 3 }}>
        <KPICard {...card} />
      </Grid.Col>
    ))}
  </Grid>
);

export default KpiDashboardPage;
