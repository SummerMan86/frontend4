import React from 'react';
import { Container, Title, Text, Space, Grid, Paper, Badge, Group } from '@mantine/core';
import YandexSupplyGraphMap from '../components/YandexSupplyGraphMap';
import { supplyNodes, supplyEdges, SupplyNode, SupplyEdge } from '../data/supplyTestData';

/**
 * Тестовая страница для компонента YandexSupplyGraphMap
 * Демонстрирует функциональность графа поставок из Китая
 */
const SupplyGraphTestPage: React.FC = () => {
  const handleNodeClick = (node: SupplyNode) => {
    console.log('Clicked node:', node);
  };

  const handleEdgeClick = (edge: SupplyEdge) => {
    console.log('Clicked edge:', edge);
  };

  return (
    <Container size="xl" py="md">
      <Title order={1} mb="md">Тест графа поставок из Китая</Title>
      
      <Text size="lg" mb="xl">
        Интерактивная карта цепочки поставок с поставщиками из Китая, 
        складами и распределительными центрами в России.
      </Text>

      {/* Основной компонент карты */}
      <YandexSupplyGraphMap 
        nodes={supplyNodes}
        edges={supplyEdges}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        height={700}
      />

      <Space h="xl" />

      {/* Дополнительная информация */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" withBorder>
            <Title order={3} mb="md">Функциональность</Title>
            <Text size="sm" mb="xs">✅ Граф поставок из Китая в Россию</Text>
            <Text size="sm" mb="xs">✅ Интерактивные узлы (поставщики, склады, РЦ)</Text>
            <Text size="sm" mb="xs">✅ Связи с информацией о поставках</Text>
            <Text size="sm" mb="xs">✅ Разные типы транспорта</Text>
            <Text size="sm" mb="xs">✅ Статусы поставок</Text>
            <Text size="sm" mb="xs">✅ Легенда и статистика</Text>
            <Text size="sm" mb="xs">✅ Обработка ошибок</Text>
            <Text size="sm" mb="xs">✅ Толщина линий по объему</Text>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" withBorder>
            <Title order={3} mb="md">Тестовые данные</Title>
            <Text size="sm" mb="xs">🏭 4 поставщика в Китае</Text>
            <Text size="sm" mb="xs">🏢 4 склада в России</Text>
            <Text size="sm" mb="xs">📦 2 распределительных центра</Text>
            <Text size="sm" mb="xs">🚛 9 маршрутов поставок</Text>
            <Text size="sm" mb="xs">🚢 Морские, ж/д, автомобильные перевозки</Text>
            <Text size="sm" mb="xs">📊 Статистика объемов и стоимости</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      <Space h="xl" />

      {/* Информация о данных */}
      <Paper p="md" withBorder>
        <Title order={3} mb="md">Структура данных</Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Title order={4} mb="sm">Узлы (SupplyNode)</Title>
            <Text size="xs" mb="xs">• id, name, type</Text>
            <Text size="xs" mb="xs">• country, city, coordinates</Text>
            <Text size="xs" mb="xs">• capacity, currentStock</Text>
            <Text size="xs" mb="xs">• status</Text>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Title order={4} mb="sm">Связи (SupplyEdge)</Title>
            <Text size="xs" mb="xs">• from, to (ID узлов)</Text>
            <Text size="xs" mb="xs">• type (sea/air/rail/road)</Text>
            <Text size="xs" mb="xs">• volume, cost, duration</Text>
            <Text size="xs" mb="xs">• frequency, dates</Text>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Title order={4} mb="sm">Файл данных</Title>
            <Text size="xs" mb="xs">📁 src/data/supplyTestData.ts</Text>
            <Text size="xs" mb="xs">🔧 Легко заменить на API</Text>
            <Text size="xs" mb="xs">📊 Экспорт типов и данных</Text>
            <Text size="xs" mb="xs">🎨 Настройка цветов</Text>
          </Grid.Col>
        </Grid>
      </Paper>

      <Space h="xl" />



      {/* Статистика по данным */}
      <Paper p="md" withBorder>
        <Title order={3} mb="md">Статистика тестовых данных</Title>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Group>
              <Badge color="red" size="lg">{supplyNodes.filter(n => n.type === 'supplier').length}</Badge>
              <Text size="sm">Поставщиков в Китае</Text>
            </Group>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Group>
              <Badge color="blue" size="lg">{supplyNodes.filter(n => n.type === 'warehouse').length}</Badge>
              <Text size="sm">Складов в России</Text>
            </Group>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Group>
              <Badge color="green" size="lg">{supplyNodes.filter(n => n.type === 'distribution').length}</Badge>
              <Text size="sm">Распред. центров</Text>
            </Group>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Group>
              <Badge color="yellow" size="lg">{supplyEdges.length}</Badge>
              <Text size="sm">Маршрутов поставок</Text>
            </Group>
          </Grid.Col>
        </Grid>
        
        <Space h="md" />
        
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm">📦 Общий объем поставок: <strong>{supplyEdges.reduce((sum, e) => sum + e.volume, 0).toLocaleString()} тонн</strong></Text>
            <Text size="sm">💰 Общая стоимость: <strong>${supplyEdges.reduce((sum, e) => sum + e.cost, 0).toLocaleString()}</strong></Text>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm">🚢 Морских маршрутов: <strong>{supplyEdges.filter(e => e.type === 'sea').length}</strong></Text>
            <Text size="sm">🚂 Железнодорожных: <strong>{supplyEdges.filter(e => e.type === 'rail').length}</strong></Text>
            <Text size="sm">🚛 Автомобильных: <strong>{supplyEdges.filter(e => e.type === 'road').length}</strong></Text>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SupplyGraphTestPage;