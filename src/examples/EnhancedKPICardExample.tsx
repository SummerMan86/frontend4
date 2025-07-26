import React from 'react';
import { Container, Title, SimpleGrid, Stack, Text, Group, Badge } from '@mantine/core';
import {
  IconTruck,
  IconClock,
  IconCurrencyRubel,
  IconShield,
  IconPackage,
  IconAlertTriangle,
} from '@tabler/icons-react';

// Импортируем улучшенный KPICard из SupplyManagementPage
// В реальном проекте лучше вынести его в отдельный компонент

const EnhancedKPICardExample = () => {
  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        <div>
          <Title order={2} mb="md">Улучшенные KPI карточки с градиентами</Title>
          <Text c="dimmed" mb="xl">
            Демонстрация новых возможностей: тематические градиенты, направления, анимации и пользовательские градиенты
          </Text>
        </div>

        {/* Тематические градиенты */}
        <div>
          <Title order={3} mb="md">Тематические градиенты</Title>
          <SimpleGrid cols={3} spacing="md">
            {/* Ocean Theme */}
            <div>
              <Badge mb="sm" color="blue">Ocean Theme</Badge>
              <SimpleGrid cols={2} spacing="sm">
                <KPICard
                  title="Идеальный заказ"
                  value="94.2%"
                  target="95%"
                  trend={2.1}
                  icon={<IconTruck size={20} />}
                  color="green"
                  theme="ocean"
                  size="sm"
                />
                <KPICard
                  title="Время доставки"
                  value="2.3 дня"
                  target="2 дня"
                  trend={-0.5}
                  icon={<IconClock size={20} />}
                  color="blue"
                  theme="ocean"
                  size="sm"
                />
              </SimpleGrid>
            </div>

            {/* Sunset Theme */}
            <div>
              <Badge mb="sm" color="orange">Sunset Theme</Badge>
              <SimpleGrid cols={2} spacing="sm">
                <KPICard
                  title="Логистические затраты"
                  value="12.8%"
                  target="12%"
                  trend={0.8}
                  icon={<IconCurrencyRubel size={20} />}
                  color="orange"
                  theme="sunset"
                  size="sm"
                />
                <KPICard
                  title="Качество поставок"
                  value="98.7%"
                  target="99%"
                  trend={1.2}
                  icon={<IconShield size={20} />}
                  color="red"
                  theme="sunset"
                  size="sm"
                />
              </SimpleGrid>
            </div>

            {/* Forest Theme */}
            <div>
              <Badge mb="sm" color="green">Forest Theme</Badge>
              <SimpleGrid cols={2} spacing="sm">
                <KPICard
                  title="Объем поставок"
                  value="1,247 ед."
                  target="1,200 ед."
                  trend={3.9}
                  icon={<IconPackage size={20} />}
                  color="green"
                  theme="forest"
                  size="sm"
                />
                <KPICard
                  title="Ошибки"
                  value="0.3%"
                  target="0.5%"
                  trend={-0.2}
                  icon={<IconAlertTriangle size={20} />}
                  color="red"
                  theme="forest"
                  size="sm"
                />
              </SimpleGrid>
            </div>
          </SimpleGrid>
        </div>

        {/* Направления градиентов */}
        <div>
          <Title order={3} mb="md">Направления градиентов</Title>
          <SimpleGrid cols={4} spacing="md">
            <KPICard
              title="Вправо"
              value="94.2%"
              trend={2.1}
              icon={<IconTruck size={20} />}
              color="blue"
              gradientDirection="to-r"
              size="sm"
            />
            <KPICard
              title="Вниз-вправо"
              value="94.2%"
              trend={2.1}
              icon={<IconTruck size={20} />}
              color="green"
              gradientDirection="to-br"
              size="sm"
            />
            <KPICard
              title="Вниз"
              value="94.2%"
              trend={2.1}
              icon={<IconTruck size={20} />}
              color="orange"
              gradientDirection="to-b"
              size="sm"
            />
            <KPICard
              title="Вверх"
              value="94.2%"
              trend={2.1}
              icon={<IconTruck size={20} />}
              color="violet"
              gradientDirection="to-t"
              size="sm"
            />
          </SimpleGrid>
        </div>

        {/* Анимированные градиенты */}
        <div>
          <Title order={3} mb="md">Анимированные градиенты</Title>
          <SimpleGrid cols={3} spacing="md">
            <KPICard
              title="Анимированный градиент"
              value="94.2%"
              target="95%"
              trend={2.1}
              icon={<IconTruck size={24} />}
              color="blue"
              animated={true}
            />
            <KPICard
              title="Статичный градиент"
              value="94.2%"
              target="95%"
              trend={2.1}
              icon={<IconTruck size={24} />}
              color="green"
              animated={false}
            />
            <KPICard
              title="Анимированный + тема"
              value="94.2%"
              target="95%"
              trend={2.1}
              icon={<IconTruck size={24} />}
              color="orange"
              theme="cosmic"
              animated={true}
            />
          </SimpleGrid>
        </div>

        {/* Пользовательские градиенты */}
        <div>
          <Title order={3} mb="md">Пользовательские градиенты</Title>
          <SimpleGrid cols={3} spacing="md">
            <KPICard
              title="Радужный градиент"
              value="94.2%"
              target="95%"
              trend={2.1}
              icon={<IconTruck size={24} />}
              color="blue" // Игнорируется при customGradient
              customGradient="linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)"
              animated={true}
            />
            <KPICard
              title="Металлический"
              value="94.2%"
              target="95%"
              trend={2.1}
              icon={<IconShield size={24} />}
              color="blue"
              customGradient="linear-gradient(135deg, #667db6 0%, #0082c8 25%, #0082c8 75%, #667db6 100%)"
            />
            <KPICard
              title="Неоновый"
              value="94.2%"
              target="95%"
              trend={2.1}
              icon={<IconPackage size={24} />}
              color="blue"
              customGradient="linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)"
              animated={true}
            />
          </SimpleGrid>
        </div>

        {/* Размеры карточек */}
        <div>
          <Title order={3} mb="md">Размеры карточек</Title>
          <Group align="flex-start" gap="md">
            <KPICard
              title="Маленькая"
              value="94.2%"
              trend={2.1}
              icon={<IconTruck size={16} />}
              color="blue"
              size="sm"
            />
            <KPICard
              title="Средняя"
              value="94.2%"
              trend={2.1}
              icon={<IconTruck size={20} />}
              color="green"
              size="md"
            />
            <KPICard
              title="Большая"
              value="94.2%"
              trend={2.1}
              icon={<IconTruck size={24} />}
              color="orange"
              size="lg"
            />
          </Group>
        </div>
      </Stack>
    </Container>
  );
};

export default EnhancedKPICardExample;

// Заглушка для KPICard - в реальном проекте импортировать из SupplyManagementPage
const KPICard = ({ title, value, target, trend, icon, color, theme, gradientDirection, animated, customGradient, size }: any) => {
  return (
    <div style={{ 
      padding: '16px', 
      background: customGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '8px',
      color: 'white',
      minHeight: '120px'
    }}>
      <div style={{ fontSize: '14px', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{value}</div>
      {target && <div style={{ fontSize: '12px', opacity: 0.8 }}>Цель: {target}</div>}
      <div style={{ fontSize: '12px', marginTop: '8px' }}>
        {trend > 0 ? '↗' : '↘'} {trend}%
      </div>
    </div>
  );
};