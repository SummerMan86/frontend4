import React, { useState } from 'react';
import { Container, Title, Grid, Text, Group, Badge, Stack } from '@mantine/core';
import {
  IconShoppingCart,
  IconTrendingUp,
  IconUsers,
  IconCurrencyRubel,
  IconTarget,
  IconAlertTriangle
} from '@tabler/icons-react';
import ComplexKPI from '../components/ComplexKPI';

/**
 * Пример интерактивного использования ComplexKPI компонента
 * Демонстрирует новые возможности интерактивности:
 * - Hover эффекты
 * - Анимации
 * - Обработчики событий
 * - Клики по карточкам
 */
const InteractiveComplexKPIExample: React.FC = () => {
  const [lastInteraction, setLastInteraction] = useState<string>('');
  const [hoverCount, setHoverCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  // Обработчики для демонстрации интерактивности
  const handleKPIClick = (kpiName: string) => {
    setClickCount(prev => prev + 1);
    setLastInteraction(`Клик по KPI: ${kpiName}`);
    console.log(`KPI clicked: ${kpiName}`);
  };

  const handleKPIHover = (kpiName: string) => {
    setHoverCount(prev => prev + 1);
    setLastInteraction(`Наведение на KPI: ${kpiName}`);
  };

  const handleKPILeave = (kpiName: string) => {
    setLastInteraction(`Уход с KPI: ${kpiName}`);
  };

  // Данные для графиков
  const salesData = [120, 135, 125, 150, 165, 155, 180, 175, 190, 185];
  const conversionData = [2.1, 2.3, 2.0, 2.5, 2.8, 2.6, 3.1, 2.9, 3.2, 3.0];
  const usersData = [1200, 1350, 1280, 1450, 1520, 1480, 1650, 1580, 1720, 1690];
  const revenueData = [85000, 92000, 88000, 95000, 102000, 98000, 108000, 105000, 112000, 110000];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Заголовок */}
        <div>
          <Title order={1} mb="md">
            Интерактивные KPI Карточки
          </Title>
          <Text c="dimmed" size="lg">
            Демонстрация интерактивных возможностей ComplexKPI компонента
          </Text>
        </div>

        {/* Статистика взаимодействий */}
        <Group gap="md">
          <Badge variant="light" color="blue" size="lg">
            Наведений: {hoverCount}
          </Badge>
          <Badge variant="light" color="green" size="lg">
            Кликов: {clickCount}
          </Badge>
          <Text size="sm" c="dimmed">
            Последнее действие: {lastInteraction || 'Нет взаимодействий'}
          </Text>
        </Group>

        {/* Интерактивные KPI карточки */}
        <Grid>
          {/* Продажи - с полной интерактивностью */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <ComplexKPI
              id="interactive-sales"
              title="Продажи"
              icon={IconShoppingCart}
              value="1,847"
              target="2,000"
              progress={92}
              trend={15.3}
              status="success"
              unit="шт"
              subtitle="За текущий месяц"
              chartData={salesData}
              interactions={{
                onClick: () => handleKPIClick('Продажи'),
                onHover: () => handleKPIHover('Продажи'),
                onLeave: () => handleKPILeave('Продажи')
              }}
              action={{
                label: "Детали",
                onClick: () => alert('Открытие деталей продаж')
              }}
              animated={true}
              hoverable={true}
            />
          </Grid.Col>

          {/* Конверсия - только hover эффекты */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <ComplexKPI
              id="interactive-conversion"
              title="Конверсия"
              icon={IconTarget}
              value="3.2"
              trend={8.7}
              status="success"
              unit="%"
              subtitle="Средняя за период"
              chartData={conversionData}
              interactions={{
                onHover: () => handleKPIHover('Конверсия'),
                onLeave: () => handleKPILeave('Конверсия')
              }}
              animated={true}
              hoverable={true}
            />
          </Grid.Col>

          {/* Пользователи - с кликом и предупреждением */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <ComplexKPI
              id="interactive-users"
              title="Активные пользователи"
              icon={IconUsers}
              value="1,690"
              target="1,800"
              progress={94}
              trend={-2.1}
              status="warning"
              subtitle="Снижение активности"
              chartData={usersData}
              interactions={{
                onClick: () => handleKPIClick('Пользователи'),
                onHover: () => handleKPIHover('Пользователи'),
                onLeave: () => handleKPILeave('Пользователи')
              }}
              animated={true}
              hoverable={true}
            />
          </Grid.Col>

          {/* Выручка - критический статус */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <ComplexKPI
              id="interactive-revenue"
              title="Выручка"
              icon={IconCurrencyRubel}
              value="110,000"
              target="120,000"
              progress={92}
              trend={-5.2}
              status="danger"
              unit="₽"
              subtitle="Требует внимания"
              chartData={revenueData}
              interactions={{
                onClick: () => handleKPIClick('Выручка'),
                onHover: () => handleKPIHover('Выручка'),
                onLeave: () => handleKPILeave('Выручка')
              }}
              action={{
                label: "Анализ",
                onClick: () => alert('Открытие анализа выручки')
              }}
              animated={true}
              hoverable={true}
            />
          </Grid.Col>

          {/* Без анимаций - для сравнения */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <ComplexKPI
              id="static-kpi"
              title="Статичная карточка"
              icon={IconAlertTriangle}
              value="42"
              status="info"
              subtitle="Без анимаций"
              interactions={{
                onClick: () => handleKPIClick('Статичная'),
                onHover: () => handleKPIHover('Статичная'),
                onLeave: () => handleKPILeave('Статичная')
              }}
              animated={false}
              hoverable={true}
            />
          </Grid.Col>

          {/* Без hover эффектов */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <ComplexKPI
              id="non-hoverable-kpi"
              title="Без hover"
              icon={IconTrendingUp}
              value="123"
              status="success"
              subtitle="Hover отключен"
              interactions={{
                onClick: () => handleKPIClick('Без hover'),
              }}
              animated={true}
              hoverable={false}
            />
          </Grid.Col>
        </Grid>

        {/* Инструкции */}
        <div>
          <Title order={3} mb="md">
            Возможности интерактивности:
          </Title>
          <Stack gap="xs">
            <Text>🖱️ <strong>Наведение мыши:</strong> Hover эффекты, изменение цветов, масштабирование</Text>
            <Text>👆 <strong>Клик:</strong> Обработчики событий, анимация нажатия</Text>
            <Text>🎨 <strong>Анимации:</strong> Плавные переходы, вращение иконок</Text>
            <Text>📊 <strong>Динамические графики:</strong> Изменение цветов при взаимодействии</Text>
            <Text>⚙️ <strong>Настройки:</strong> Включение/отключение анимаций и hover эффектов</Text>
          </Stack>
        </div>
      </Stack>
    </Container>
  );
};

export default InteractiveComplexKPIExample;