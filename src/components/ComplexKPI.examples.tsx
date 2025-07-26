import React from 'react';
import { Container, Grid, Stack, Title } from '@mantine/core';
import { IconChartBar, IconCash, IconPercentage, IconCoins } from '@tabler/icons-react';
import ComplexKPI from './ComplexKPI';

// Пример использования компонента ComplexKPI
const ComplexKPIExamples: React.FC = () => {
  // Данные для примера выручки (как в MainPage.tsx)
  const revenueKPI = {
    id: 'revenue',
    title: 'Выручка',
    icon: IconChartBar,
    value: '1.34M₽',
    target: '1.5M₽',
    progress: 89,
    trend: 12,
    status: 'warning' as const,
    subtitle: 'Отставание от плана на 11%',
    action: {
      label: 'Детали',
      onClick: () => handleActionClick('revenue')
    },
    chartData: Array.from({ length: 30 }, () => 1000000 + Math.random() * 500000),
    unit: '₽'
  };

  // Дополнительные примеры KPI
  const paymentKPI = {
    id: 'payment',
    title: 'К перечислению',
    icon: IconCash,
    value: '609,772₽',
    subtitle: 'Через 14 дней, в пути: 1.2M₽',
    action: {
      label: 'График CF',
      onClick: () => handleActionClick('payment')
    },
    chartData: Array.from({ length: 30 }, () => 500000 + Math.random() * 300000),
    unit: '₽'
  };

  const marginKPI = {
    id: 'margin',
    title: 'Маржа',
    icon: IconPercentage,
    value: '35%',
    target: '40%',
    progress: 87,
    status: 'danger' as const,
    subtitle: '-5pp от цели',
    trend: -5,
    action: {
      label: 'По SKU',
      onClick: () => handleActionClick('margin')
    },
    chartData: Array.from({ length: 30 }, () => 30 + Math.random() * 10),
    unit: '%'
  };

  const profitKPI = {
    id: 'profit',
    title: 'Прибыль',
    icon: IconCoins,
    value: '189k₽',
    target: '215k₽',
    progress: 88,
    status: 'warning' as const,
    action: {
      label: 'P&L анализ',
      onClick: () => handleActionClick('profit')
    },
    chartData: Array.from({ length: 30 }, () => 150000 + Math.random() * 100000),
    unit: '₽'
  };

  const handleActionClick = (kpiId: string) => {
    console.log(`Действие для KPI: ${kpiId}`);
    // Здесь можно добавить логику для обработки клика по кнопке действия
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Title order={2}>Примеры использования ComplexKPI</Title>
        
        <Title order={3}>Финансовые метрики</Title>
        <Grid>
          <Grid.Col span={3}>
            <ComplexKPI 
              {...revenueKPI}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <ComplexKPI 
              {...paymentKPI}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <ComplexKPI 
              {...marginKPI}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <ComplexKPI 
              {...profitKPI}
            />
          </Grid.Col>
        </Grid>

        <Title order={3}>Пример без графика</Title>
        <Grid>
          <Grid.Col span={3}>
            <ComplexKPI 
              id="simple-kpi"
              title="Простая метрика"
              icon={IconChartBar}
              value="42"
              target="50"
              progress={84}
              status="success"
              subtitle="Хороший результат"
              action={{
                label: "Подробнее",
                onClick: () => handleActionClick('simple-kpi')
              }}
            />
          </Grid.Col>
        </Grid>

        <Title order={3}>Пример только с трендом</Title>
        <Grid>
          <Grid.Col span={3}>
            <ComplexKPI 
              id="trend-kpi"
              title="Метрика с трендом"
              icon={IconChartBar}
              value="125"
              trend={15}
              subtitle="Рост за последний месяц"
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default ComplexKPIExamples;