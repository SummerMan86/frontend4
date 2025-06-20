import React, { useState } from 'react';
import { Container, Stack, Title, Text, Divider, Group, Button, Paper, Badge, Progress, Table, Grid, Card, UnstyledButton, ThemeIcon, ActionIcon, Collapse, Transition } from '@mantine/core';
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
  IconCurrencyDollar,
  IconCalendar,
  IconMapPin,
  IconPackage,
  IconChevronRight,
  IconX
} from '@tabler/icons-react';
import { KPICard, type KPICardProps } from '../components/KPICard';
import { KPIGrid } from '../components/KPIGrid';
import { KPISparklineCard } from '../components/KPISparklineCard';
import { KPISparklineExamples } from '../components/KPISparklineCard.examples';
import { SimpleKPIExamples } from '../components/SimpleKPISparklineChart.examples';
import KPICardDropDown from '../components/KPICardDropDown';
import ReactECharts from 'echarts-for-react';
import { ExpandableKPIGrid, type KPICardData } from '../components/ExpandableKPIGrid';

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

        {/* KPI карточки с раскрывающимися деталями */}
        <div>
          <Title order={2} mb="md">📋 KPI карточки с детальной информацией</Title>
          <Text mb="lg" c="gray.6">
            Демонстрация KPICardDropDown компонента с различными типами детальной информации
          </Text>
          
          <Group align="start">
            {/* Карточка с графиком */}
            <KPICardDropDown
              title="Выручка за месяц"
              value="2,847,392 ₽"
              target="3,000,000 ₽"
              trend={15.3}
              icon={<IconCoin size={20} />}
              color="green"
              detailComponent={
                <Stack gap="md">
                  <Text size="sm" fw={500}>Динамика выручки за 30 дней</Text>
                  <ReactECharts
                    option={{
                      grid: { top: 10, right: 10, bottom: 30, left: 40 },
                      xAxis: {
                        type: 'category',
                        data: Array.from({length: 30}, (_, i) => `${i+1}`),
                        axisLabel: { fontSize: 10 }
                      },
                      yAxis: {
                        type: 'value',
                        axisLabel: { fontSize: 10, formatter: '{value}к' }
                      },
                      series: [{
                        data: generateSparklineData(95, 'up'),
                        type: 'line',
                        smooth: true,
                        lineStyle: { color: '#51cf66', width: 2 },
                        areaStyle: { color: 'rgba(81, 207, 102, 0.1)' }
                      }]
                    }}
                    style={{ height: '200px' }}
                  />
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Рост к прошлому месяцу: +15.3%</Text>
                    <Badge color="green" size="sm">Цель достигнута</Badge>
                  </Group>
                </Stack>
              }
            />

            {/* Карточка с таблицей */}
            <KPICardDropDown
              title="Остатки на складах"
              value="45,382 шт"
              target="50,000 шт"
              trend={-3.2}
              icon={<IconBuildingWarehouse size={20} />}
              color="blue"
              detailComponent={
                <Stack gap="md">
                  <Text size="sm" fw={500}>Распределение по складам</Text>
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Склад</Table.Th>
                        <Table.Th>Остаток</Table.Th>
                        <Table.Th>Статус</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td>Москва</Table.Td>
                        <Table.Td>18,450 шт</Table.Td>
                        <Table.Td><Badge color="green" size="xs">Норма</Badge></Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>СПб</Table.Td>
                        <Table.Td>12,380 шт</Table.Td>
                        <Table.Td><Badge color="yellow" size="xs">Низкий</Badge></Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>Екатеринбург</Table.Td>
                        <Table.Td>8,920 шт</Table.Td>
                        <Table.Td><Badge color="green" size="xs">Норма</Badge></Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>Казань</Table.Td>
                        <Table.Td>5,632 шт</Table.Td>
                        <Table.Td><Badge color="red" size="xs">Критический</Badge></Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                  <Text size="xs" c="dimmed">Последнее обновление: 2 часа назад</Text>
                </Stack>
              }
            />

            {/* Карточка с прогрессом */}
            <KPICardDropDown
              title="Выполнение плана"
              value="78.4%"
              target="100%"
              trend={2.1}
              icon={<IconPercentage size={20} />}
              color="orange"
              detailComponent={
                <Stack gap="md">
                  <Text size="sm" fw={500}>Детализация по направлениям</Text>
                  
                  <div>
                    <Group justify="space-between" mb={5}>
                      <Text size="sm">Продажи</Text>
                      <Text size="sm" fw={500}>85%</Text>
                    </Group>
                    <Progress value={85} color="green" size="sm" />
                  </div>
                  
                  <div>
                    <Group justify="space-between" mb={5}>
                      <Text size="sm">Маркетинг</Text>
                      <Text size="sm" fw={500}>72%</Text>
                    </Group>
                    <Progress value={72} color="yellow" size="sm" />
                  </div>
                  
                  <div>
                    <Group justify="space-between" mb={5}>
                      <Text size="sm">Логистика</Text>
                      <Text size="sm" fw={500}>91%</Text>
                    </Group>
                    <Progress value={91} color="blue" size="sm" />
                  </div>
                  
                  <div>
                    <Group justify="space-between" mb={5}>
                      <Text size="sm">Закупки</Text>
                      <Text size="sm" fw={500}>65%</Text>
                    </Group>
                    <Progress value={65} color="red" size="sm" />
                  </div>
                  
                  <Group justify="space-between" mt="md">
                    <Text size="xs" c="dimmed">До конца месяца: 8 дней</Text>
                    <Badge color="orange" size="sm">Требует внимания</Badge>
                  </Group>
                </Stack>
              }
            />
          </Group>

          <Group align="start" mt="md">
            {/* Карточка с метриками */}
            <KPICardDropDown
              title="Критические товары"
              value="23 товара"
              trend={8.2}
              icon={<IconAlertTriangle size={20} />}
              color="red"
              detailComponent={
                <Stack gap="md">
                  <Text size="sm" fw={500}>Товары с критическим остатком</Text>
                  
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Group gap="xs">
                        <IconPackage size={16} color="var(--mantine-color-red-6)" />
                        <Text size="sm">Смартфон XYZ</Text>
                      </Group>
                      <Badge color="red" size="xs">2 шт</Badge>
                    </Group>
                    
                    <Group justify="space-between">
                      <Group gap="xs">
                        <IconPackage size={16} color="var(--mantine-color-red-6)" />
                        <Text size="sm">Наушники ABC</Text>
                      </Group>
                      <Badge color="red" size="xs">1 шт</Badge>
                    </Group>
                    
                    <Group justify="space-between">
                      <Group gap="xs">
                        <IconPackage size={16} color="var(--mantine-color-orange-6)" />
                        <Text size="sm">Планшет DEF</Text>
                      </Group>
                      <Badge color="orange" size="xs">5 шт</Badge>
                    </Group>
                    
                    <Group justify="space-between">
                      <Group gap="xs">
                        <IconPackage size={16} color="var(--mantine-color-orange-6)" />
                        <Text size="sm">Зарядка GHI</Text>
                      </Group>
                      <Badge color="orange" size="xs">8 шт</Badge>
                    </Group>
                  </Stack>
                  
                  <Divider />
                  
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Автозаказ настроен для 18 товаров</Text>
                    <Button size="xs" variant="light" color="red">
                      Создать заказ
                    </Button>
                  </Group>
                </Stack>
              }
            />

            {/* Карточка с временной информацией */}
            <KPICardDropDown
              title="Оборачиваемость"
              value="24.7 дней"
              target="≤ 30 дней"
              trend={-5.8}
              icon={<IconRotate size={20} />}
              color="violet"
              detailComponent={
                <Stack gap="md">
                  <Text size="sm" fw={500}>Анализ оборачиваемости</Text>
                  
                  <Group justify="space-between">
                    <Text size="sm">Текущий период:</Text>
                    <Badge color="green" size="sm">24.7 дней</Badge>
                  </Group>
                  
                  <Group justify="space-between">
                    <Text size="sm">Прошлый период:</Text>
                    <Text size="sm" c="dimmed">26.2 дней</Text>
                  </Group>
                  
                  <Group justify="space-between">
                    <Text size="sm">Улучшение:</Text>
                    <Text size="sm" c="green">-1.5 дней (-5.8%)</Text>
                  </Group>
                  
                  <Divider />
                  
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Group gap="xs">
                        <IconCalendar size={16} />
                        <Text size="sm">Быстрые товары:</Text>
                      </Group>
                      <Text size="sm" fw={500}>≤ 15 дней (45%)</Text>
                    </Group>
                    
                    <Group justify="space-between">
                      <Group gap="xs">
                        <IconCalendar size={16} />
                        <Text size="sm">Средние товары:</Text>
                      </Group>
                      <Text size="sm" fw={500}>15-30 дней (38%)</Text>
                    </Group>
                    
                    <Group justify="space-between">
                      <Group gap="xs">
                        <IconCalendar size={16} />
                        <Text size="sm">Медленные товары:</Text>
                      </Group>
                      <Text size="sm" fw={500}>&gt; 30 дней (17%)</Text>
                    </Group>
                  </Stack>
                </Stack>
              }
            />

            {/* Простая карточка без деталей */}
            <KPICardDropDown
              title="Новые клиенты"
              value="156 чел"
              trend={12.1}
              icon={<IconUsers size={20} />}
              color="pink"
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

        {/* Полноширинные KPI карточки */}
        <div>
          <Title order={2} mb="md">📊 Полноширинные KPI карточки</Title>
          <Text mb="lg" c="gray.6">
            Демонстрация KPI карточек с детальной информацией, раскрывающейся на всю ширину блока
          </Text>
          
          <FullWidthKPISection />
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
              <strong>KPICardDropDown</strong> - расширенная версия KPI карточки с раскрывающейся детальной информацией
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
              <strong>Особенности KPICardDropDown:</strong> раскрывающиеся детали, поддержка любого React компонента в детальной секции, анимированные переходы, индикатор раскрытия
            </Text>
            <Text>
              <strong>Общие особенности:</strong> автоматические градиенты, анимации при наведении, адаптивная сетка, поддержка кликов
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

// Компонент для полноширинных KPI карточек
function FullWidthKPISection() {
  const kpiData: KPICardData[] = [
    {
      id: 'revenue',
      title: 'Общая выручка за квартал',
      value: '8,547,392 ₽',
      target: '9,000,000 ₽',
      trend: 18.7,
      icon: <IconCurrencyDollar size={20} />,
      color: 'green'
    },
    {
      id: 'logistics',
      title: 'Логистика и доставка',
      value: '1,247 заказов',
      target: '1,500 заказов',
      trend: -5.3,
      icon: <IconTruck size={20} />,
      color: 'blue'
    },
    {
      id: 'products',
      title: 'Управление товарами',
      value: '2,847 SKU',
      target: '3,000 SKU',
      trend: 12.4,
      icon: <IconShoppingCart size={20} />,
      color: 'violet'
    }
  ];

  const renderDetailContent = (cardId: string) => {
    switch (cardId) {
      case 'revenue':
        return (
          <Stack gap="lg">
            <Group justify="space-between" align="flex-start">
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500} mb="md">Динамика продаж по месяцам</Text>
                <ReactECharts
                  option={{
                    grid: { top: 20, right: 20, bottom: 40, left: 60 },
                    xAxis: {
                      type: 'category',
                      data: ['Январь', 'Февраль', 'Март'],
                      axisLabel: { fontSize: 12 }
                    },
                    yAxis: {
                      type: 'value',
                      axisLabel: { fontSize: 12, formatter: '{value}М ₽' }
                    },
                    series: [{
                      name: 'Выручка',
                      data: [2.4, 2.8, 3.3],
                      type: 'bar',
                      itemStyle: { color: '#51cf66' },
                      label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}М ₽'
                      }
                    }]
                  }}
                  style={{ height: '250px', width: '100%' }}
                />
              </div>
              <div style={{ flex: 1, marginLeft: '2rem' }}>
                <Text size="sm" fw={500} mb="md">Ключевые показатели</Text>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm">Средний чек:</Text>
                    <Text size="sm" fw={600}>2,847 ₽</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Количество заказов:</Text>
                    <Text size="sm" fw={600}>3,002</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Конверсия:</Text>
                    <Text size="sm" fw={600}>4.2%</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Возвраты:</Text>
                    <Text size="sm" fw={600} c="red">2.1%</Text>
                  </Group>
                </Stack>
                <Divider my="md" />
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">До цели осталось:</Text>
                  <Badge color="orange" size="sm">452,608 ₽</Badge>
                </Group>
              </div>
            </Group>
          </Stack>
        );
      case 'logistics':
        return (
          <Stack gap="lg">
            <Group align="flex-start" gap="xl">
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500} mb="md">Статистика доставки</Text>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Регион</Table.Th>
                      <Table.Th>Заказы</Table.Th>
                      <Table.Th>Среднее время</Table.Th>
                      <Table.Th>Статус</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>Москва и МО</Table.Td>
                      <Table.Td>487</Table.Td>
                      <Table.Td>1.2 дня</Table.Td>
                      <Table.Td><Badge color="green" size="xs">Отлично</Badge></Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Санкт-Петербург</Table.Td>
                      <Table.Td>298</Table.Td>
                      <Table.Td>1.8 дня</Table.Td>
                      <Table.Td><Badge color="green" size="xs">Хорошо</Badge></Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Регионы РФ</Table.Td>
                      <Table.Td>462</Table.Td>
                      <Table.Td>3.2 дня</Table.Td>
                      <Table.Td><Badge color="yellow" size="xs">Норма</Badge></Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500} mb="md">Проблемные зоны</Text>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconAlertTriangle size={16} color="orange" />
                      <Text size="sm">Задержки доставки:</Text>
                    </Group>
                    <Text size="sm" fw={500}>23 заказа</Text>
                  </Group>
                  <Progress value={85} color="orange" size="sm" />
                  
                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconMapPin size={16} color="red" />
                      <Text size="sm">Потерянные посылки:</Text>
                    </Group>
                    <Text size="sm" fw={500}>3 заказа</Text>
                  </Group>
                  <Progress value={12} color="red" size="sm" />
                  
                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconPackage size={16} color="blue" />
                      <Text size="sm">Возвраты:</Text>
                    </Group>
                    <Text size="sm" fw={500}>18 заказов</Text>
                  </Group>
                  <Progress value={45} color="blue" size="sm" />
                </Stack>
              </div>
            </Group>
          </Stack>
        );
      case 'products':
        return (
          <Stack gap="lg">
            <Group align="flex-start" gap="xl">
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500} mb="md">Топ категории по продажам</Text>
                <ReactECharts
                  option={{
                    grid: { top: 20, right: 20, bottom: 40, left: 100 },
                    xAxis: {
                      type: 'value',
                      axisLabel: { fontSize: 10 }
                    },
                    yAxis: {
                      type: 'category',
                      data: ['Электроника', 'Одежда', 'Дом и сад', 'Спорт', 'Красота'],
                      axisLabel: { fontSize: 11 }
                    },
                    series: [{
                      data: [850, 720, 580, 420, 380],
                      type: 'bar',
                      itemStyle: { color: '#9775fa' },
                      label: {
                        show: true,
                        position: 'right',
                        formatter: '{c} шт'
                      }
                    }]
                  }}
                  style={{ height: '200px', width: '100%' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500} mb="md">Анализ остатков</Text>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm">Товары в наличии:</Text>
                    <Text size="sm" fw={600} c="green">2,547 SKU</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Заканчиваются:</Text>
                    <Text size="sm" fw={600} c="orange">187 SKU</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Нет в наличии:</Text>
                    <Text size="sm" fw={600} c="red">113 SKU</Text>
                  </Group>
                  <Divider my="xs" />
                  <Group justify="space-between">
                    <Text size="sm">Новые товары:</Text>
                    <Text size="sm" fw={600} c="blue">45 SKU</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Медленные товары:</Text>
                    <Text size="sm" fw={600} c="gray">&gt; 30 дней (17%)</Text>
                  </Group>
                </Stack>
              </div>
            </Group>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <ExpandableKPIGrid
      kpiData={kpiData}
      renderDetailContent={renderDetailContent}
      columnsPerCard={4}
      animationDuration={500}
      animationTimingFunction="ease-in-out"
    />
  );
};

export default KPIDemoPage;