import React from 'react';
import { Paper, Text } from '@mantine/core';
import ReactECharts from 'echarts-for-react';

// Генерация данных за последние 30 дней
const generateData = () => {
  const data = [];
  const today = new Date();
  const baseSales = 1200000;
  const baseProfit = 500000;
  const growthRate = 0.02; // 2% рост в день

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Добавляем случайные колебания ±10%
    const randomFactor = 0.9 + Math.random() * 0.2;
    
    // Рассчитываем значения с учетом тренда роста
    const sales = Math.round(baseSales * Math.pow(1 + growthRate, 29 - i) * randomFactor);
    const profit = Math.round(baseProfit * Math.pow(1 + growthRate, 29 - i) * randomFactor);
    
    data.push({
      date: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      sales,
      profit
    });
  }
  
  return data;
};

const data = generateData();

export const SalesAndProfitChart: React.FC = () => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: (params: any) => {
        const date = params[0].axisValue;
        let result = `<div style="font-weight: bold; margin-bottom: 5px;">${date}</div>`;
        params.forEach((param: any) => {
          const value = param.value.toLocaleString('ru-RU');
          result += `<div style="margin: 3px 0;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color}; margin-right: 5px;"></span>
            <span style="font-weight: bold;">${param.seriesName}:</span> 
            <span style="float: right; margin-left: 20px;">₽ ${value}</span>
          </div>`;
        });
        return result;
      }
    },
    legend: {
      data: ['Продажи', 'Прибыль'],
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '40px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.date),
      axisLabel: {
        rotate: 45,
        formatter: (value: string) => value
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
          }
          if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'K';
          }
          return value;
        }
      }
    },
    series: [
      {
        name: 'Продажи',
        type: 'line',
        smooth: true,
        data: data.map(item => item.sales),
        itemStyle: {
          color: '#228be6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(34, 139, 230, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(34, 139, 230, 0.1)'
            }]
          }
        }
      },
      {
        name: 'Прибыль',
        type: 'line',
        smooth: true,
        data: data.map(item => item.profit),
        itemStyle: {
          color: '#40c057'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(64, 192, 87, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(64, 192, 87, 0.1)'
            }]
          }
        }
      }
    ]
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Text fw={600} mb="md">Динамика продаж и прибыли</Text>
      <ReactECharts 
        option={option}
        style={{ height: '400px' }}
        opts={{ renderer: 'svg' }}
      />
    </Paper>
  );
}; 