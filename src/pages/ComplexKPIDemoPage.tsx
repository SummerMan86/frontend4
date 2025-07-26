import React from 'react';
import { Container, Stack, Title, Text, Divider, Group, Paper, Badge } from '@mantine/core';
import { IconCash, IconCoins, IconPercentage, IconChartBar, IconTrendingUp, IconUsers, IconShoppingCart } from '@tabler/icons-react';
import ComplexKPI from '../components/ComplexKPI';

/**
 * Демо-страница для демонстрации ComplexKPI компонента
 */
export const ComplexKPIDemoPage: React.FC = () => {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Заголовок страницы */}
        <div>
          <Title order={1} mb="sm">🎯 ComplexKPI - Продвинутые KPI карточки</Title>
          <Text size="lg" c="dimmed">
            Демонстрация возможностей нового ComplexKPI компонента с мини-графиками, целями и прогрессом
          </Text>
        </div>

        <Divider />

        {/* Основные возможности */}
        <Paper p="lg" withBorder>
          <Title order={3} mb="md">✨ Основные возможности</Title>
          <Group>
            <Badge color="blue" variant="light">Мини-графики</Badge>
            <Badge color="green" variant="light">Цели и прогресс</Badge>
            <Badge color="orange" variant="light">Тренды</Badge>
            <Badge color="violet" variant="light">Статусы</Badge>
            <Badge color="red" variant="light">Действия</Badge>
            <Badge color="teal" variant="light">Гибкость</Badge>
          </Group>
        </Paper>

        {/* Финансовые метрики */}
        <div>
          <Title order={2} mb="md">💰 Финансовые метрики</Title>
          <Text mb="lg" c="gray.6">
            Примеры KPI карточек для финансовых показателей с полным функционалом
          </Text>
          
          <Group mb="lg">
            <ComplexKPI
              id="revenue"
              title="Выручка"
              icon={IconCash}
              value="1.34M₽"
              target="1.5M₽"
              progress={89}
              trend={12.5}
              status="success"
              subtitle="+12.5% к прошлому месяцу"
              unit="₽"
              chartData={[120, 132, 101, 134, 90, 230, 210, 145, 167, 189, 201, 234]}
              action={{
                label: "Подробнее",
                onClick: () => alert('Переход к детальной аналитике выручки')
              }}
            />
            
            <ComplexKPI
              id="profit"
              title="Прибыль"
              icon={IconCoins}
              value="340K₽"
              target="400K₽"
              progress={85}
              trend={8.2}
              status="warning"
              subtitle="+8.2% к прошлому месяцу"
              unit="₽"
              chartData={[80, 95, 78, 102, 67, 145, 134, 98, 123, 145, 156, 178]}
              action={{
                label: "Анализ",
                onClick: () => alert('Анализ прибыльности')
              }}
            />
            
            <ComplexKPI
              id="margin"
              title="Маржинальность"
              icon={IconPercentage}
              value="25.4%"
              target="30%"
              progress={75}
              trend={-2.1}
              status="danger"
              subtitle="-2.1% к прошлому месяцу"
              unit="%"
              chartData={[30, 28, 32, 29, 25, 27, 24, 26, 25, 23, 25, 24]}
              action={{
                label: "Оптимизация",
                onClick: () => alert('План оптимизации маржи')
              }}
            />
          </Group>
        </div>

        <Divider />

        {/* Операционные метрики */}
        <div>
          <Title order={2} mb="md">📊 Операционные метрики</Title>
          <Text mb="lg" c="gray.6">
            KPI карточки для операционных показателей с различными статусами
          </Text>
          
          <Group mb="lg">
            <ComplexKPI
              id="orders"
              title="Заказы"
              icon={IconShoppingCart}
              value="1,247"
              target="1,500"
              progress={83}
              trend={15.3}
              status="success"
              subtitle="+15.3% к прошлому месяцу"
              unit="шт"
              chartData={[100, 120, 95, 140, 85, 160, 145, 130, 155, 170, 180, 195]}
              action={{
                label: "Детали",
                onClick: () => alert('Детальная информация по заказам')
              }}
            />
            
            <ComplexKPI
              id="conversion"
              title="Конверсия"
              icon={IconTrendingUp}
              value="4.2%"
              trend={0.8}
              status="info"
              subtitle="+0.8% к прошлому месяцу"
              unit="%"
              chartData={[3.8, 4.1, 3.9, 4.3, 3.7, 4.5, 4.2, 4.0, 4.4, 4.6, 4.3, 4.2]}
            />
            
            <ComplexKPI
              id="customers"
              title="Новые клиенты"
              icon={IconUsers}
              value="156"
              target="200"
              progress={78}
              trend={-5.2}
              status="warning"
              subtitle="-5.2% к прошлому месяцу"
              unit="чел"
              chartData={[180, 165, 190, 175, 160, 145, 170, 155, 140, 150, 165, 156]}
            />
          </Group>
        </div>

        <Divider />

        {/* Простые варианты */}
        <div>
          <Title order={2} mb="md">🎨 Простые варианты</Title>
          <Text mb="lg" c="gray.6">
            Упрощенные версии без графиков или целей для быстрого отображения метрик
          </Text>
          
          <Group mb="lg">
            <ComplexKPI
              id="avg-check"
              title="Средний чек"
              icon={IconCash}
              value="1,075₽"
              trend={-3.2}
              status="warning"
              subtitle="За последние 30 дней"
              unit="₽"
            />
            
            <ComplexKPI
              id="active-users"
              title="Активные пользователи"
              icon={IconUsers}
              value="2,847"
              trend={5.7}
              status="success"
              subtitle="Онлайн сейчас"
              unit="чел"
            />
            
            <ComplexKPI
              id="bounce-rate"
              title="Показатель отказов"
              icon={IconChartBar}
              value="23.4%"
              trend={1.2}
              status="info"
              subtitle="Среднее за неделю"
              unit="%"
            />
          </Group>
        </div>

        <Divider />

        {/* Различные статусы */}
        <div>
          <Title order={2} mb="md">🚦 Различные статусы</Title>
          <Text mb="lg" c="gray.6">
            Демонстрация различных статусов и их цветового кодирования
          </Text>
          
          <Group>
            <ComplexKPI
              id="status-success"
              title="Успех"
              icon={IconTrendingUp}
              value="95.2%"
              trend={8.5}
              status="success"
              subtitle="Отличный результат"
              unit="%"
            />
            
            <ComplexKPI
              id="status-warning"
              title="Предупреждение"
              icon={IconTrendingUp}
              value="67.8%"
              trend={-2.1}
              status="warning"
              subtitle="Требует внимания"
              unit="%"
            />
            
            <ComplexKPI
              id="status-danger"
              title="Критично"
              icon={IconTrendingUp}
              value="45.3%"
              trend={-12.7}
              status="danger"
              subtitle="Срочные меры"
              unit="%"
            />
            
            <ComplexKPI
              id="status-info"
              title="Информация"
              icon={IconTrendingUp}
              value="78.9%"
              trend={0.3}
              status="info"
              subtitle="Стабильно"
              unit="%"
            />
          </Group>
        </div>

        {/* Информация о компоненте */}
        <Paper p="lg" withBorder bg="gray.0">
          <Title order={3} mb="md">📋 О компоненте</Title>
          <Text size="sm" c="dimmed">
            ComplexKPI - это продвинутый компонент для отображения ключевых показателей эффективности.
            Он поддерживает мини-графики на основе ECharts, отображение целей и прогресса, 
            различные статусы с цветовым кодированием, тренды и кнопки действий.
            Компонент полностью типизирован и интегрирован с Mantine UI.
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ComplexKPIDemoPage;