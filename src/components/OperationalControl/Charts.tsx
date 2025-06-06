// components/OperationalControl/Charts.tsx
import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Paper, Text, Group, SegmentedControl, Loader, Center } from '@mantine/core';
import { formatters } from '../../utils/operationalUtils';
import type { ChartData } from '../../hooks/useOperationalData';

// Базовый компонент для графиков
interface BaseChartProps {
  title?: string;
  loading?: boolean;
  height?: number;
  options: any;
}

const BaseChart: React.FC<BaseChartProps> = ({ 
  title, 
  loading = false, 
  height = 300,
  options 
}) => {
  return (
    <Paper p="md" radius="md" withBorder>
      {title && (
        <Text fw={600} mb="md">{title}</Text>
      )}
      
      {loading ? (
        <Center h={height}>
          <Loader />
        </Center>
      ) : (
        <ReactECharts
          option={options}
          style={{ height, width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      )}
    </Paper>
  );
};

// График продаж (линейный)
interface SalesChartProps {
  data: ChartData[];
  period?: 'hour' | 'day' | 'week';
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, period = 'hour' }) => {
  const options = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        animation: false
      },
      formatter: (params: any) => {
        const date = params[0].axisValue;
        let html = `<div style="font-weight: 600">${date}</div>`;
        
        params.forEach((param: any) => {
          const value = param.seriesName === 'Продажи' 
            ? formatters.currency(param.value)
            : formatters.number(param.value);
          
          html += `
            <div style="display: flex; justify-content: space-between; gap: 16px; margin-top: 4px">
              <span>
                <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 4px"></span>
                ${param.seriesName}
              </span>
              <strong>${value}</strong>
            </div>
          `;
        });
        
        return html;
      }
    },
    legend: {
      data: ['Продажи', 'Заказы', 'Возвраты'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.time),
      axisLabel: {
        rotate: period === 'hour' ? 45 : 0
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Продажи (₽)',
        position: 'left',
        axisLabel: {
          formatter: (value: number) => formatters.compactNumber(value)
        }
      },
      {
        type: 'value',
        name: 'Количество',
        position: 'right'
      }
    ],
    series: [
      {
        name: 'Продажи',
        type: 'line',
        data: data.map(d => d.sales),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#2563eb'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(37, 99, 235, 0.3)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0)' }
            ]
          }
        }
      },
      {
        name: 'Заказы',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.orders),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#10b981'
        }
      },
      {
        name: 'Возвраты',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.returns),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#ef4444'
        }
      }
    ]
  }), [data, period]);

  return <BaseChart title="Динамика продаж" options={options} height={350} />;
};

// График воронки конверсии
interface ConversionFunnelProps {
  data: {
    clicks: number;
    addToCart: number;
    orders: number;
    purchases: number;
  };
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ data }) => {
  const funnelData = [
    { value: data.clicks, name: 'Клики' },
    { value: data.addToCart, name: 'В корзину' },
    { value: data.orders, name: 'Заказы' },
    { value: data.purchases, name: 'Выкупы' }
  ];

  const options = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const conversion = params.dataIndex > 0 
          ? ((params.value / funnelData[params.dataIndex - 1].value) * 100).toFixed(1)
          : '100';
        
        return `
          <div>
            <div style="font-weight: 600">${params.name}</div>
            <div style="margin-top: 4px">
              Количество: <strong>${formatters.number(params.value)}</strong>
            </div>
            <div>
              Конверсия: <strong>${conversion}%</strong>
            </div>
          </div>
        `;
      }
    },
    series: [
      {
        name: 'Воронка',
        type: 'funnel',
        left: '10%',
        top: 20,
        bottom: 20,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => {
            const conversion = params.dataIndex > 0 
              ? ((params.value / funnelData[params.dataIndex - 1].value) * 100).toFixed(1)
              : '100';
            return `${params.name}\n${formatters.number(params.value)}\n${conversion}%`;
          }
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: funnelData
      }
    ],
    color: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981']
  }), [data]);

  return <BaseChart title="Воронка конверсии" options={options} height={300} />;
};

// График распределения продаж по категориям
interface CategoryDistributionProps {
  data: Array<{
    category: string;
    value: number;
    percentage: number;
  }>;
}

export const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ data }) => {
  const options = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `
          <div>
            <div style="font-weight: 600">${params.name}</div>
            <div style="margin-top: 4px">
              Продажи: <strong>${formatters.currency(params.value)}</strong>
            </div>
            <div>
              Доля: <strong>${params.percent}%</strong>
            </div>
          </div>
        `;
      }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20
    },
    series: [
      {
        name: 'Категории',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            formatter: (params: any) => {
              return `${params.percent}%`;
            }
          }
        },
        labelLine: {
          show: false
        },
        data: data.map(item => ({
          value: item.value,
          name: item.category
        }))
      }
    ]
  }), [data]);

  return <BaseChart title="Распределение по категориям" options={options} height={300} />;
};

// График сравнения план/факт
interface PlanVsActualChartProps {
  data: Array<{
    metric: string;
    plan: number;
    actual: number;
  }>;
}

export const PlanVsActualChart: React.FC<PlanVsActualChartProps> = ({ data }) => {
  const options = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const metric = params[0].axisValue;
        return `
          <div>
            <div style="font-weight: 600">${metric}</div>
            ${params.map((param: any) => `
              <div style="display: flex; justify-content: space-between; gap: 16px; margin-top: 4px">
                <span>
                  <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 4px"></span>
                  ${param.seriesName}
                </span>
                <strong>${formatters.currency(param.value)}</strong>
              </div>
            `).join('')}
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee">
              Выполнение: <strong>${((params[1].value / params[0].value) * 100).toFixed(1)}%</strong>
            </div>
          </div>
        `;
      }
    },
    legend: {
      data: ['План', 'Факт']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.metric),
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => formatters.compactNumber(value)
      }
    },
    series: [
      {
        name: 'План',
        type: 'bar',
        data: data.map(d => d.plan),
        itemStyle: {
          color: '#94a3b8'
        }
      },
      {
        name: 'Факт',
        type: 'bar',
        data: data.map(d => d.actual),
        itemStyle: {
          color: (params: any) => {
            const ratio = params.value / data[params.dataIndex].plan;
            if (ratio >= 1) return '#10b981';
            if (ratio >= 0.8) return '#f59e0b';
            return '#ef4444';
          }
        }
      }
    ]
  }), [data]);

  return <BaseChart title="План vs Факт" options={options} height={300} />;
};

// График остатков на складах
interface StockLevelsChartProps {
  data: Array<{
    warehouse: string;
    stock: number;
    daysRemaining: number;
  }>;
}

export const StockLevelsChart: React.FC<StockLevelsChartProps> = ({ data }) => {
  const options = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const warehouse = params[0].axisValue;
        const stockData = data.find(d => d.warehouse === warehouse);
        
        return `
          <div>
            <div style="font-weight: 600">${warehouse}</div>
            <div style="margin-top: 4px">
              Остаток: <strong>${formatters.number(params[0].value)} шт</strong>
            </div>
            <div>
              Хватит на: <strong>${stockData?.daysRemaining || 0} дней</strong>
            </div>
          </div>
        `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.warehouse)
    },
    yAxis: {
      type: 'value',
      name: 'Остаток (шт)'
    },
    series: [
      {
        type: 'bar',
        data: data.map(d => ({
          value: d.stock,
          itemStyle: {
            color: d.daysRemaining < 3 ? '#ef4444' :
                   d.daysRemaining < 7 ? '#f59e0b' : '#10b981'
          }
        })),
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            const stockData = data[params.dataIndex];
            return `${stockData.daysRemaining}д`;
          }
        }
      }
    ]
  }), [data]);

  return <BaseChart title="Остатки по складам" options={options} height={300} />;
};

// Компонент для отображения всех графиков
export const ChartsPanel: React.FC = () => {
  const [period, setPeriod] = React.useState('day');
  
  // Здесь должны быть реальные данные из store или API
  const mockData = {
    sales: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      sales: Math.random() * 100000 + 50000,
      orders: Math.floor(Math.random() * 50 + 20),
      returns: Math.floor(Math.random() * 5),
      conversion: 2.5 + Math.random() * 0.5
    })),
    conversion: {
      clicks: 10000,
      addToCart: 1500,
      orders: 800,
      purchases: 640
    },
    categories: [
      { category: 'Обувь', value: 450000, percentage: 35 },
      { category: 'Одежда', value: 380000, percentage: 30 },
      { category: 'Аксессуары', value: 250000, percentage: 20 },
      { category: 'Прочее', value: 190000, percentage: 15 }
    ],
    planVsActual: [
      { metric: 'Продажи', plan: 1200000, actual: 1344657 },
      { metric: 'Заказы', plan: 700, actual: 740 },
      { metric: 'Выручка', plan: 650000, actual: 609772 },
      { metric: 'Конверсия %', plan: 3, actual: 2.51 }
    ],
    stocks: [
      { warehouse: 'Москва', stock: 234, daysRemaining: 10 },
      { warehouse: 'Казань', stock: 45, daysRemaining: 2 },
      { warehouse: 'Екатеринбург', stock: 120, daysRemaining: 5 },
      { warehouse: 'Новосибирск', stock: 89, daysRemaining: 4 }
    ]
  };

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Аналитика</Text>
        <SegmentedControl
          value={period}
          onChange={setPeriod}
          data={[
            { label: 'Час', value: 'hour' },
            { label: 'День', value: 'day' },
            { label: 'Неделя', value: 'week' }
          ]}
        />
      </Group>
      
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <SalesChart data={mockData.sales} period={period as any} />
        </div>
        <ConversionFunnel data={mockData.conversion} />
        <CategoryDistribution data={mockData.categories} />
        <PlanVsActualChart data={mockData.planVsActual} />
        <StockLevelsChart data={mockData.stocks} />
      </div>
    </div>
  );
};

export default ChartsPanel;