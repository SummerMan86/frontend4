import React from 'react';
import { Container, Title, Space, Stack } from '@mantine/core';
import { ExpandableKPIGrid } from '../components/ExpandableKPIGrid';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconClock,
  IconShoppingCart,
  IconUsers,
  IconCurrencyRubel
} from '@tabler/icons-react';

const KPITestPage: React.FC = () => {
  // Тестовые данные для KPI
  const testKPIData = [
    {
      id: 'sales',
      title: 'Продажи',
      value: '2,450,000',
      target: '2,500,000',
      trend: 5.2,
      icon: <IconTrendingUp size={20} />,
      color: 'blue'
    },
    {
      id: 'orders',
      title: 'Заказы',
      value: '1,234',
      target: '1,300',
      trend: -2.1,
      icon: <IconShoppingCart size={20} />,
      color: 'green'
    },
    {
      id: 'customers',
      title: 'Клиенты',
      value: '856',
      target: '900',
      trend: 8.7,
      icon: <IconUsers size={20} />,
      color: 'orange'
    },
    {
      id: 'avgTime',
      title: 'Среднее время обработки',
      value: '24',
      target: '20',
      trend: -15.3,
      icon: <IconClock size={20} />,
      color: 'red'
    }
  ];

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        <Title order={1}>Тестовая страница KPI</Title>
        
        <Space h="md" />
        
        <ExpandableKPIGrid
          kpiData={testKPIData}
          renderDetailContent={(kpiId) => {
            const kpi = testKPIData.find(item => item.id === kpiId);
            if (!kpi) return <div>Данные не найдены</div>;
            
            switch (kpiId) {
              case 'sales':
                return (
                  <Stack gap="md">
                    <Title order={3}>Детализация продаж</Title>
                    <div>
                      <p><strong>Общая сумма:</strong> {kpi.value} ₽</p>
                      <p><strong>Цель:</strong> {kpi.target} ₽</p>
                      <p><strong>Тренд:</strong> {kpi.trend > 0 ? '+' : ''}{kpi.trend}%</p>
                      <p><strong>Анализ:</strong> Продажи показывают положительную динамику, но не достигают целевого показателя.</p>
                    </div>
                  </Stack>
                );
              
              case 'orders':
                return (
                  <Stack gap="md">
                    <Title order={3}>Детализация заказов</Title>
                    <div>
                      <p><strong>Количество заказов:</strong> {kpi.value} шт</p>
                      <p><strong>Цель:</strong> {kpi.target} шт</p>
                      <p><strong>Тренд:</strong> {kpi.trend > 0 ? '+' : ''}{kpi.trend}%</p>
                      <p><strong>Анализ:</strong> Небольшое снижение количества заказов требует внимания к маркетинговым активностям.</p>
                    </div>
                  </Stack>
                );
              
              case 'customers':
                return (
                  <Stack gap="md">
                    <Title order={3}>Детализация клиентов</Title>
                    <div>
                      <p><strong>Активные клиенты:</strong> {kpi.value} чел</p>
                      <p><strong>Цель:</strong> {kpi.target} чел</p>
                      <p><strong>Тренд:</strong> {kpi.trend > 0 ? '+' : ''}{kpi.trend}%</p>
                      <p><strong>Анализ:</strong> Хороший рост клиентской базы, приближаемся к целевому показателю.</p>
                    </div>
                  </Stack>
                );
              
              case 'avgTime':
                return (
                  <Stack gap="md">
                    <Title order={3}>Детализация времени обработки</Title>
                    <div>
                      <p><strong>Среднее время:</strong> {kpi.value} ч</p>
                      <p><strong>Цель:</strong> {kpi.target} ч</p>
                      <p><strong>Тренд:</strong> {kpi.trend > 0 ? '+' : ''}{kpi.trend}%</p>
                      <p><strong>Анализ:</strong> Время обработки превышает целевой показатель, необходима оптимизация процессов.</p>
                    </div>
                  </Stack>
                );
              
              default:
                return (
                  <div>
                    <p>Детальная информация для {kpi?.title || 'неизвестного KPI'} недоступна</p>
                  </div>
                );
            }
          }}
          columnsPerCard={2}
          animationDuration={300}
          animationTimingFunction="ease-in-out"
        />
      </Stack>
    </Container>
  );
};

export default KPITestPage;