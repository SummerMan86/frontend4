import React, { useState } from 'react';
import { Container, Stack, Title, Text, Divider, Group, Button, Paper } from '@mantine/core';
import { 
  IconBuildingWarehouse, 
  IconTruck, 
  IconPercentage, 
  IconRotate, 
  IconAlertTriangle, 
  IconTrendingUp,
  IconShoppingCart,
  IconCoin,
  IconUsers,
  IconChartLine,
  IconRefresh,
  IconDownload,
  IconTrendingDown,
  IconCurrencyDollar
} from '@tabler/icons-react';
import { KPICard, type KPICardProps } from '../components/KPICard';
import { KPIGrid } from '../components/KPIGrid';
import { KPISparklineCard } from '../components/KPISparklineCard';
import { KPISparklineExamples } from '../components/KPISparklineCard.examples';
import { SimpleKPIExamples } from '../components/SimpleKPISparklineChart.examples';

/**
 * Демо-страница для демонстрации возможностей KPI компонентов
 */
export const KPIDemoPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Генерация тестовых данных для sparkline
  const generateSparklineData = (baseValue: number, trend: 'up' | 'down' | 'flat' = 'up'): number[] => {
    const data: number[] = [];
    let value = baseValue;
    
    for (let i = 0; i < 30; i++) {
      const randomVariation = (Math.random() - 0.5) * 0.2;
      let trendValue = 0;
      if (trend === 'up') {
        trendValue = i * 0.01;
      } else if (trend === 'down') {
        trendValue = -i * 0.01;
      }
      
      value = baseValue * (1 + trendValue + randomVariation);
      data.push(Math.max(0, value));
    }
    
    return data;
  };

  // Данные для складских KPI
  const warehouseKPIs: KPICardProps[] = [
    {
      title: 'Остатки на складах WB',
      value: '45,382',
      unit: 'шт',
      change: 12.5,
      icon: IconBuildingWarehouse,
      color: 'blue',
      onClick: () => alert('Клик по остаткам на складах'),
    },
    {
      title: 'Товары в пути',
      value: '3,847',
      unit: 'шт',
      change: -3.2,
      icon: IconTruck,
      color: 'orange',
    },
    {
      title: '% выкупа (общий)',
      value: '78.4',
      unit: '%',
      change: 2.1,
      icon: IconPercentage,
      color: 'green',
    },
    {
      title: 'Оборачиваемость',
      value: '24.7',
      unit: 'дней',
      change: -5.8,
      icon: IconRotate,
      color: 'violet',
    },
    {
      title: 'Критический запас',
      value: '23',
      unit: 'товаров',
      change: 8.2,
      icon: IconAlertTriangle,
      color: 'red',
    },
  ];

  // Данные для продажных KPI
  const salesKPIs: KPICardProps[] = [
    {
      title: 'Выручка за день',
      value: '2,847,392',
      unit: '₽',
      change: 15.3,
      icon: IconCoin,
      color: 'green',
    },
    {
      title: 'Заказы',
      value: '1,247',
      unit: 'шт',
      change: 8.7,
      icon: IconShoppingCart,
      color: 'blue',
    },
    {
      title: 'Конверсия',
      value: '3.2',
      unit: '%',
      change: 0.5,
      icon: IconTrendingUp,
      color: 'cyan',
    },
    {
      title: 'Новые клиенты',
      value: '156',
      unit: 'чел',
      change: 12.1,
      icon: IconUsers,
      color: 'pink',
    },
  ];

  // Данные для финансовых KPI
  const financialKPIs: KPICardProps[] = [
    {
      title: 'Прибыль',
      value: '847,392',
      unit: '₽',
      change: 18.5,
      icon: IconChartLine,
      color: 'green',
      gradient: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
    },
    {
      title: 'Маржинальность',
      value: '29.8',
      unit: '%',
      change: 2.3,
      icon: IconPercentage,
      color: 'teal',
    },
    {
      title: 'ROI',
      value: '156.7',
      unit: '%',
      change: 5.2,
      icon: IconTrendingUp,
      color: 'indigo',
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Данные обновлены!');
    }, 2000);
  };

  const handleExport = () => {
    alert('Экспорт данных...');
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Заголовок страницы */}
        <div>
          <Title order={1} mb="sm">🎯 Демо KPI компонентов</Title>
          <Text size="lg" c="dimmed">
            Демонстрация возможностей универсальных KPI карточек и сеток
          </Text>
        </div>

        <Divider />

        {/* Складские KPI с полным функционалом */}
        <div>
          <Title order={2} mb="md">📦 Складские KPI (с управлением)</Title>
          <KPIGrid
            kpis={warehouseKPIs}
            title="📈 KPI метрики склада"
            description="Ключевые показатели эффективности складских операций"
            showControls
            onRefresh={handleRefresh}
            onExport={handleExport}
            loading={loading}
            columns={{
              base: 1,
              xs: 2,
              sm: 3,
              md: 5,
              lg: 5,
            }}
          />
        </div>

        <Divider />

        {/* Продажные KPI - большие карточки */}
        <div>
          <Title order={2} mb="md">💰 Продажные KPI (большие карточки)</Title>
          <KPIGrid
            kpis={salesKPIs}
            cardSize="lg"
            columns={{
              base: 1,
              sm: 2,
              md: 4,
            }}
            withPaper={false}
          />
        </div>

        <Divider />

        {/* Финансовые KPI - компактные */}
        <div>
          <Title order={2} mb="md">📊 Финансовые KPI (компактные)</Title>
          <KPIGrid
            kpis={financialKPIs}
            cardSize="sm"
            columns={{
              base: 1,
              xs: 3,
              sm: 3,
            }}
          />
        </div>

        <Divider />

        {/* KPI карточки с графиками Sparkline */}
        <div>
          <Title order={2} mb="md">📈 KPI карточки с графиками Sparkline</Title>
          <Text size="sm" c="dimmed" mb="lg">
            Карточки с интегрированными миниатюрными графиками тренда
          </Text>

          <Group mb="lg">
            <KPISparklineCard
              title="Продажи за день"
              value="1,045,000"
              unit="₽"
              change={8.5}
              icon={<IconCurrencyDollar />}
              sparklineData={generateSparklineData(1000000, 'up')}
              gradientBackground="auto"
              onClick={() => alert('Клик по продажам')}
            />
            <KPISparklineCard
              title="Заказы за день"
              value="547"
              unit="шт"
              change={12.3}
              icon={<IconShoppingCart />}
              sparklineData={generateSparklineData(500, 'up')}
              gradientBackground="auto"
              onClick={() => alert('Клик по заказам')}
            />
            <KPISparklineCard
              title="Прибыль за день"
              value="210,400"
              unit="₽"
              change={5.7}
              icon={<IconTrendingUp />}
              sparklineData={generateSparklineData(200000, 'up')}
              lineColor="#51cf66"
              onClick={() => alert('Клик по прибыли')}
            />
            <KPISparklineCard
              title="Возвраты"
              value="42"
              unit="шт"
              change={-3.2}
              icon={<IconTrendingDown />}
              sparklineData={generateSparklineData(45, 'down')}
              lineColor="#ff6b6b"
              gradientBackground="auto"
              onClick={() => alert('Клик по возвратам')}
            />
          </Group>

          <Text fw={600} mb="sm">Разные размеры Sparkline карточек</Text>
          <Group mb="lg">
            <KPISparklineCard
              title="Маленькая карточка"
              value="1,234"
              unit="шт"
              change={5.2}
              icon={<IconTrendingUp />}
              sparklineData={generateSparklineData(1200, 'up')}
              size="sm"
              onClick={() => alert('Маленькая карточка')}
            />
            <KPISparklineCard
              title="Средняя карточка"
              value="5,678"
              unit="₽"
              change={-2.1}
              icon={<IconTrendingDown />}
              sparklineData={generateSparklineData(5600, 'down')}
              size="md"
              onClick={() => alert('Средняя карточка')}
            />
            <KPISparklineCard
              title="Большая карточка"
              value="9,876"
              unit="%"
              change={12.8}
              icon={<IconChartLine />}
              sparklineData={generateSparklineData(9800, 'up')}
              size="lg"
              sparklineHeight={60}
              onClick={() => alert('Большая карточка')}
            />
          </Group>

          <Text fw={600} mb="sm">Кастомные настройки Sparkline</Text>
          <Group>
            <KPISparklineCard
              title="Без области под графиком"
              value="3,456"
              unit="шт"
              change={7.3}
              icon={<IconChartLine />}
              sparklineData={generateSparklineData(3400, 'up')}
              showArea={false}
              lineColor="#9c88ff"
              onClick={() => alert('Без области')}
            />
            <KPISparklineCard
              title="Кастомный текст сравнения"
              value="2,789"
              unit="чел"
              change={-4.5}
              icon={<IconUsers />}
              sparklineData={generateSparklineData(2800, 'down')}
              comparisonText="vs прошлая неделя"
              sparklineTitle="Активность за неделю"
              onClick={() => alert('Кастомный текст')}
            />
          </Group>

          {/* Дополнительные примеры Sparkline карточек */}
          <KPISparklineExamples />
        </div>

        <Divider />

        {/* Отдельные карточки разных размеров */}
        <div>
          <Title order={2} mb="md">🎨 Разные размеры карточек</Title>
          <Stack gap="lg">
            <div>
              <Text fw={600} mb="sm">Маленькие (sm)</Text>
              <Group>
                <KPICard
                  title="Компактная метрика"
                  value="1,234"
                  unit="шт"
                  change={5.2}
                  icon={IconShoppingCart}
                  color="blue"
                  size="sm"
                />
                <KPICard
                  title="Еще одна"
                  value="567"
                  unit="₽"
                  change={-2.1}
                  icon={IconCoin}
                  color="green"
                  size="sm"
                />
              </Group>
            </div>

            <div>
              <Text fw={600} mb="sm">Средние (md) - по умолчанию</Text>
              <Group>
                <KPICard
                  title="Стандартная метрика"
                  value="12,345"
                  unit="шт"
                  change={8.7}
                  icon={IconTrendingUp}
                  color="cyan"
                />
                <KPICard
                  title="Без изменений"
                  value="98,765"
                  unit="₽"
                  icon={IconChartLine}
                  color="violet"
                />
              </Group>
            </div>

            <div>
              <Text fw={600} mb="sm">Большие (lg)</Text>
              <Group>
                <KPICard
                  title="Крупная метрика"
                  value="1,234,567"
                  unit="₽"
                  change={15.3}
                  icon={IconCoin}
                  color="green"
                  size="lg"
                />
              </Group>
            </div>
          </Stack>
        </div>

        <Divider />

        {/* Кастомные градиенты */}
        <div>
          <Title order={2} mb="md">🌈 Кастомные градиенты</Title>
          <Group>
            <KPICard
              title="Кастомный градиент 1"
              value="42,000"
              unit="₽"
              change={7.5}
              icon={IconChartLine}
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
            <KPICard
              title="Кастомный градиент 2"
              value="15,678"
              unit="шт"
              change={-1.2}
              icon={IconBuildingWarehouse}
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
            <KPICard
              title="Кастомный градиент 3"
              value="89.5"
              unit="%"
              change={3.8}
              icon={IconPercentage}
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            />
          </Group>
        </div>

        <Divider />

        {/* Простые KPI карточки для PIX BI */}
        <div>
          <Title order={2} mb="md">📊 Простые KPI карточки для PIX BI</Title>
          <Text mb="lg" c="gray.6">
            Упрощенные карточки с миниграфиками в одной функции ECharts, идеально подходящие для интеграции в PIX BI дашборды
          </Text>
          <SimpleKPIExamples />
        </div>

        <Divider />

        {/* Информация о компонентах */}
        <Paper p="lg" withBorder>
          <Title order={3} mb="md">ℹ️ Информация о компонентах</Title>
          <Stack gap="sm">
            <Text>
              <strong>KPICard</strong> - основной компонент для отображения одной KPI метрики
            </Text>
            <Text>
              <strong>KPIGrid</strong> - компонент для отображения сетки KPI карточек с дополнительными возможностями
            </Text>
            <Text>
              <strong>Доступные цвета:</strong> blue, green, red, orange, violet, yellow, pink, cyan, teal, indigo
            </Text>
            <Text>
              <strong>Размеры:</strong> sm (маленький), md (средний), lg (большой)
            </Text>
            <Text>
              <strong>Особенности:</strong> автоматические градиенты, анимации при наведении, адаптивная сетка, поддержка кликов
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default KPIDemoPage;