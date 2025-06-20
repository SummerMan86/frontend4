import React from 'react';
import { Container, Title, Space, Grid, Paper, Text, Group, ThemeIcon } from '@mantine/core';
import { IconRoute, IconTestPipe } from '@tabler/icons-react';
import YandexRoutesMap, { RouteData } from '../components/YandexRoutesMap';

/**
 * Тестовая страница для компонента YandexRoutesMap
 * Используется для проверки функциональности карты маршрутов
 */

const RoutesMapTestPage: React.FC = () => {
  const handleRouteClick = (route: RouteData) => {
    console.log('Выбран маршрут:', route);
    alert(`Выбран маршрут: ${route.name}\nВодитель: ${route.driver}\nСтатус: ${route.status}`);
  };

  return (
    <Container size="xl" py="md">
      {/* Заголовок страницы */}
      <Group mb="xl">
        <ThemeIcon size={40} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
          <IconTestPipe size={24} />
        </ThemeIcon>
        <div>
          <Title order={1}>Тестирование карты маршрутов</Title>
          <Text size="lg" c="dimmed">Проверка функциональности компонента YandexRoutesMap</Text>
        </div>
      </Group>

      {/* Информационная панель */}
      <Paper p="md" mb="xl" withBorder style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
        <Group>
          <ThemeIcon size={32} color="blue" variant="light">
            <IconRoute size={18} />
          </ThemeIcon>
          <div>
            <Text fw={600} c="blue">Тестовый компонент карты маршрутов</Text>
            <Text size="sm" c="dimmed">
              Этот компонент создан для тестирования функциональности карты маршрутов доставки.
              Нажмите на точки маршрутов для получения дополнительной информации.
            </Text>
          </div>
        </Group>
      </Paper>

      {/* Основная карта */}
      <Grid>
        <Grid.Col span={12}>
          <YandexRoutesMap 
            onRouteClick={handleRouteClick}
            height={500}
          />
        </Grid.Col>
      </Grid>

      <Space h="xl" />

      {/* Дополнительная информация */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" withBorder>
            <Title order={3} mb="md">Функциональность</Title>
            <Text size="sm" mb="xs">✅ Отображение маршрутов на карте</Text>
            <Text size="sm" mb="xs">✅ Интерактивные маркеры точек</Text>
            <Text size="sm" mb="xs">✅ Информационные балуны</Text>
            <Text size="sm" mb="xs">✅ Статусы маршрутов</Text>
            <Text size="sm" mb="xs">✅ Легенда и статистика</Text>
            <Text size="sm" mb="xs">✅ Обработка ошибок</Text>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" withBorder>
            <Title order={3} mb="md">Тестовые данные</Title>
            <Text size="sm" mb="xs">🚛 4 тестовых маршрута</Text>
            <Text size="sm" mb="xs">📍 Различные города России</Text>
            <Text size="sm" mb="xs">🎯 Промежуточные точки</Text>
            <Text size="sm" mb="xs">📊 Разные статусы доставки</Text>
            <Text size="sm" mb="xs">⏱️ Время и расстояние</Text>
            <Text size="sm" mb="xs">👨‍💼 Информация о водителях</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      <Space h="xl" />

      {/* Инструкции */}
      <Paper p="md" withBorder style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
        <Title order={4} mb="md">Инструкции по тестированию</Title>
        <Text size="sm" mb="xs">1. Дождитесь загрузки карты (появится спиннер)</Text>
        <Text size="sm" mb="xs">2. Нажмите на любую точку маршрута для просмотра информации</Text>
        <Text size="sm" mb="xs">3. Используйте элементы управления картой для навигации</Text>
        <Text size="sm" mb="xs">4. Проверьте легенду и статистику внизу карты</Text>
        <Text size="sm" mb="xs">5. Нажмите кнопку обновления для перезагрузки карты</Text>
        <Text size="sm" mt="md" c="dimmed" fs="italic">
          Примечание: Для полной функциональности требуется API ключ Яндекс.Карт в файле .env.local
        </Text>
      </Paper>
    </Container>
  );
};

export default RoutesMapTestPage;