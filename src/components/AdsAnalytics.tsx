import React, { useState, useMemo } from 'react';
import {
  Card,
  Grid,
  Group,
  Text,
  Title,
  Badge,
  Table,
  Progress,
  ActionIcon,
  Select,
  Paper,
  Stack,
  Collapse,
  Box,
  Divider,
  Tooltip,
  NumberFormatter,
  Container,
  ScrollArea,
  Indicator,
  RingProgress,
  ThemeIcon
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconEye,
  IconClick,
  IconCoin,
  IconChartBar,
  IconCalendar,
  IconFilter,
  IconX,
  IconChevronRight
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import { useDisclosure } from '@mantine/hooks';

// Типы данных
interface KeywordData {
  id: string;
  keyword: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cost: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  roas: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

interface KPIData {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
  prefix?: string;
  suffix?: string;
  description: string;
}

// Тестовые данные
const generateTestData = (): KeywordData[] => {
  const keywords = [
    'беспроводные наушники', 'bluetooth наушники', 'наушники tws', 'airpods аналог',
    'наушники с шумоподавлением', 'спортивные наушники', 'наушники для бега',
    'игровые наушники', 'наушники с микрофоном', 'детские наушники'
  ];
  
  return keywords.map((keyword, index) => ({
    id: `kw-${index}`,
    keyword,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    ctr: Number((Math.random() * 5 + 1).toFixed(2)),
    cpc: Number((Math.random() * 50 + 10).toFixed(2)),
    cost: Number((Math.random() * 5000 + 1000).toFixed(2)),
    conversions: Math.floor(Math.random() * 100) + 10,
    conversionRate: Number((Math.random() * 10 + 1).toFixed(2)),
    revenue: Number((Math.random() * 20000 + 5000).toFixed(2)),
    roas: Number((Math.random() * 5 + 1).toFixed(2)),
    trend: Math.random() > 0.5 ? 'up' : 'down',
    trendValue: Number((Math.random() * 30 - 15).toFixed(1))
  }));
};

const AdsAnalytics: React.FC = () => {
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date()
  ]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const [opened, { toggle }] = useDisclosure(false);
  
  const data = useMemo(() => generateTestData(), []);
  
  // Расчет KPI
  const kpiData: Record<string, KPIData> = {
    impressions: {
      title: 'Показы',
      value: data.reduce((sum, item) => sum + item.impressions, 0),
      change: 15.3,
      trend: 'up',
      icon: <IconEye size={20} />,
      color: 'blue',
      suffix: '',
      description: 'Общее количество показов объявлений'
    },
    clicks: {
      title: 'Клики',
      value: data.reduce((sum, item) => sum + item.clicks, 0),
      change: -5.2,
      trend: 'down',
      icon: <IconClick size={20} />,
      color: 'cyan',
      suffix: '',
      description: 'Количество переходов по объявлениям'
    },
    cost: {
      title: 'Расход',
      value: data.reduce((sum, item) => sum + item.cost, 0),
      change: 8.7,
      trend: 'up',
      icon: <IconCoin size={20} />,
      color: 'orange',
      prefix: '₽',
      description: 'Общие затраты на рекламу'
    },
    roas: {
      title: 'ROAS',
      value: Number((data.reduce((sum, item) => sum + item.revenue, 0) / data.reduce((sum, item) => sum + item.cost, 0)).toFixed(2)),
      change: 12.5,
      trend: 'up',
      icon: <IconChartBar size={20} />,
      color: 'green',
      suffix: 'x',
      description: 'Возврат на рекламные расходы'
    }
  };

  // Данные для графика трендов
  const getTrendData = () => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Клики', 'Конверсии'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: days
      },
      yAxis: [
        {
          type: 'value',
          name: 'Клики',
          position: 'left'
        },
        {
          type: 'value',
          name: 'Конверсии',
          position: 'right'
        }
      ],
      series: [
        {
          name: 'Клики',
          type: 'line',
          smooth: true,
          data: days.map(() => Math.floor(Math.random() * 1000) + 500),
          itemStyle: { color: '#1890ff' }
        },
        {
          name: 'Конверсии',
          type: 'bar',
          yAxisIndex: 1,
          data: days.map(() => Math.floor(Math.random() * 100) + 20),
          itemStyle: { color: '#52c41a' }
        }
      ]
    };
  };

  // Данные для графика эффективности ключевых слов
  const getKeywordPerformance = () => {
    const topKeywords = data
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Доход', 'Расход'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: topKeywords.map(k => k.keyword.split(' ').slice(0, 2).join(' '))
      },
      series: [
        {
          name: 'Доход',
          type: 'bar',
          stack: 'total',
          data: topKeywords.map(k => k.revenue),
          itemStyle: { color: '#52c41a' }
        },
        {
          name: 'Расход',
          type: 'bar',
          stack: 'total',
          data: topKeywords.map(k => -k.cost),
          itemStyle: { color: '#ff4d4f' }
        }
      ]
    };
  };

  const handleKPIClick = (kpiKey: string) => {
    setSelectedKPI(kpiKey === selectedKPI ? null : kpiKey);
    if (!opened && kpiKey !== selectedKPI) {
      toggle();
    } else if (opened && kpiKey === selectedKPI) {
      toggle();
    }
  };

  const getDetailedStats = (kpiKey: string) => {
    const relevantKeywords = data.sort((a, b) => {
      switch(kpiKey) {
        case 'impressions': return b.impressions - a.impressions;
        case 'clicks': return b.clicks - a.clicks;
        case 'cost': return b.cost - a.cost;
        case 'roas': return b.roas - a.roas;
        default: return 0;
      }
    }).slice(0, 5);

    return relevantKeywords;
  };

  return (
    <Container size="xl" px="md">
      <Stack gap="lg">
        {/* Заголовок и фильтры */}
        <Group justify="space-between" mb="md">
          <Title order={2}>Анализ рекламы Wildberries</Title>
          <Group gap="md">
            <Select
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value || '7d')}
              data={[
                { value: '1d', label: 'Сегодня' },
                { value: '7d', label: 'Последние 7 дней' },
                { value: '30d', label: 'Последние 30 дней' },
                { value: 'custom', label: 'Выбрать период' }
              ]}
              leftSection={<IconCalendar size={16} />}
              w={200}
            />
          </Group>
        </Group>

        {/* KPI карточки */}
        <Grid>
          {Object.entries(kpiData).map(([key, kpi]) => (
            <Grid.Col key={key} span={{ base: 12, sm: 6, md: 3 }}>
              <Card
                shadow="sm"
                radius="md"
                withBorder
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => handleKPIClick(key)}
                className={selectedKPI === key ? 'selected-kpi' : ''}
              >
                <Group justify="space-between" mb="xs">
                  <ThemeIcon color={kpi.color} variant="light" size="lg" radius="md">
                    {kpi.icon}
                  </ThemeIcon>
                  <Badge
                    color={kpi.trend === 'up' ? 'green' : 'red'}
                    variant="light"
                    leftSection={kpi.trend === 'up' ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />}
                  >
                    {kpi.trend === 'up' ? '+' : ''}{kpi.change}%
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                  {kpi.title}
                </Text>
                <Group gap="xs" align="baseline">
                  <Text size="xl" fw={700}>
                    {kpi.prefix}
                    <NumberFormatter value={kpi.value} thousandSeparator=" " />
                    {kpi.suffix}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed" mt="xs">
                  {kpi.description}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* Детальная панель */}
        <Collapse in={opened}>
          <Paper shadow="sm" radius="md" p="lg" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>
                Детализация: {selectedKPI && kpiData[selectedKPI].title}
              </Title>
              <ActionIcon onClick={toggle} variant="subtle">
                <IconX size={18} />
              </ActionIcon>
            </Group>
            
            {selectedKPI && (
              <Grid>
                <Grid.Col span={{ base: 12, md: 7 }}>
                  <Table striped highlightOnHover>
                    <thead>
                      <tr>
                        <th>Ключевое слово</th>
                        <th>Значение</th>
                        <th>Доля</th>
                        <th>Тренд</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getDetailedStats(selectedKPI).map((item) => {
                        const value = item[selectedKPI as keyof KeywordData] as number;
                        const total = kpiData[selectedKPI].value;
                        const percentage = (value / total) * 100;
                        
                        return (
                          <tr key={item.id}>
                            <td>{item.keyword}</td>
                            <td>
                              <Text fw={500}>
                                {kpiData[selectedKPI].prefix}
                                <NumberFormatter value={value} thousandSeparator=" " />
                                {kpiData[selectedKPI].suffix}
                              </Text>
                            </td>
                            <td>
                              <Progress value={percentage} size="sm" color={kpiData[selectedKPI].color} />
                              <Text size="xs" c="dimmed">{percentage.toFixed(1)}%</Text>
                            </td>
                            <td>
                              <Badge
                                color={item.trend === 'up' ? 'green' : 'red'}
                                variant="light"
                                size="sm"
                              >
                                {item.trend === 'up' ? '+' : ''}{item.trendValue}%
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 5 }}>
                  <Card shadow="xs" radius="md" p="md">
                    <Title order={5} mb="md">Динамика за период</Title>
                    <ReactECharts
                      option={{
                        xAxis: {
                          type: 'category',
                          data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
                        },
                        yAxis: {
                          type: 'value'
                        },
                        series: [{
                          data: [820, 932, 901, 934, 1290, 1330, 1320],
                          type: 'line',
                          smooth: true,
                          areaStyle: {
                            opacity: 0.3
                          },
                          itemStyle: {
                            color: kpiData[selectedKPI].color
                          }
                        }],
                        tooltip: {
                          trigger: 'axis'
                        },
                        grid: {
                          left: '3%',
                          right: '4%',
                          bottom: '3%',
                          containLabel: true
                        }
                      }}
                      style={{ height: '200px' }}
                    />
                  </Card>
                </Grid.Col>
              </Grid>
            )}
          </Paper>
        </Collapse>

        {/* Графики */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" radius="md" p="lg" withBorder>
              <Title order={4} mb="md">Динамика кликов и конверсий</Title>
              <ReactECharts
                option={getTrendData()}
                style={{ height: '300px' }}
              />
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" radius="md" p="lg" withBorder>
              <Title order={4} mb="md">Топ-5 ключевых слов по доходности</Title>
              <ReactECharts
                option={getKeywordPerformance()}
                style={{ height: '300px' }}
              />
            </Card>
          </Grid.Col>
        </Grid>

        {/* Таблица ключевых слов */}
        <Card shadow="sm" radius="md" p="lg" withBorder>
          <Group justify="space-between" mb="md">
            <Title order={4}>Детализация по ключевым словам</Title>
            <Badge size="lg" variant="light">
              {data.length} ключей
            </Badge>
          </Group>
          
          <ScrollArea>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>Ключевое слово</th>
                  <th>Показы</th>
                  <th>Клики</th>
                  <th>CTR</th>
                  <th>CPC</th>
                  <th>Расход</th>
                  <th>Конверсии</th>
                  <th>CR</th>
                  <th>Доход</th>
                  <th>ROAS</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Group gap="xs">
                        <Text fw={500}>{item.keyword}</Text>
                        {item.trend === 'up' ? (
                          <IconTrendingUp size={16} color="green" />
                        ) : (
                          <IconTrendingDown size={16} color="red" />
                        )}
                      </Group>
                    </td>
                    <td><NumberFormatter value={item.impressions} thousandSeparator=" " /></td>
                    <td><NumberFormatter value={item.clicks} thousandSeparator=" " /></td>
                    <td>
                      <Badge color="blue" variant="light">
                        {item.ctr}%
                      </Badge>
                    </td>
                    <td>₽{item.cpc}</td>
                    <td>
                      <Text c="orange" fw={500}>
                        ₽<NumberFormatter value={item.cost} thousandSeparator=" " />
                      </Text>
                    </td>
                    <td>{item.conversions}</td>
                    <td>
                      <Badge color="grape" variant="light">
                        {item.conversionRate}%
                      </Badge>
                    </td>
                    <td>
                      <Text c="green" fw={500}>
                        ₽<NumberFormatter value={item.revenue} thousandSeparator=" " />
                      </Text>
                    </td>
                    <td>
                      <Badge
                        color={item.roas >= 3 ? 'green' : item.roas >= 1.5 ? 'yellow' : 'red'}
                        variant="filled"
                      >
                        {item.roas}x
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>
        </Card>
      </Stack>

      <style>{`
        .selected-kpi {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }
      `}</style>
    </Container>
  );
};

export default AdsAnalytics;