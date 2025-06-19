import React from 'react';
import ReactECharts from 'echarts-for-react';

export interface SimpleKPISparklineProps {
  /** Заголовок KPI */
  title: string;
  /** Основное значение */
  value: string | number;
  /** Процент изменения */
  change?: number;
  /** Данные для sparkline (массив чисел) */
  sparklineData: number[];
  /** Единица измерения */
  unit?: string;
  /** Ширина карточки */
  width?: number;
  /** Высота карточки */
  height?: number;
  /** Цвет темы */
  themeColor?: string;
}

/**
 * Простая карточка KPI с миниграфиком в одной функции ECharts
 * Подходит для использования в PIX BI дашбордах
 */
export const SimpleKPISparklineChart: React.FC<SimpleKPISparklineProps> = ({
  title,
  value,
  change,
  sparklineData,
  unit = '',
  width = 300,
  height = 150,
  themeColor = '#1890ff'
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  
  // Определяем цвет на основе изменения
  const getColor = () => {
    if (isPositive) return '#52c41a';
    if (isNegative) return '#ff4d4f';
    return themeColor;
  };

  // Форматирование значения
  const formatValue = (val: number) => {
    if (unit === '₽') {
      return new Intl.NumberFormat('ru-RU').format(Math.round(val)) + ' ₽';
    }
    if (unit === '%') {
      return (Math.round(val * 100) / 100) + '%';
    }
    if (unit === 'шт' || unit === 'шт.') {
      return Math.round(val) + ' шт';
    }
    return val.toString();
  };

  // Генерация дат для последних дней
  const generateDates = (count: number) => {
    const dates = [];
    const today = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }));
    }
    return dates;
  };

  const option = {
    backgroundColor: '#ffffff',
    title: {
      text: title,
      left: 20,
      top: 15,
      textStyle: {
        fontSize: 14,
        fontWeight: 400,
        color: '#666666'
      }
    },
    graphic: [
      // Основное значение
      {
        type: 'text',
        left: 20,
        top: 45,
        style: {
          text: typeof value === 'number' ? formatValue(value) : value,
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#262626'
        }
      },
      // Процент изменения (если есть)
      ...(change !== undefined ? [
        {
          type: 'text',
          left: 20,
          top: 75,
          style: {
            text: `${isPositive ? '↗' : '↘'} ${Math.abs(change)}%`,
            fontSize: 12,
            fill: getColor(),
            fontWeight: 500
          }
        }
      ] : []),
      // Заголовок графика
      {
        type: 'text',
        left: 20,
        top: height - 65,
        style: {
          text: 'Тренд',
          fontSize: 11,
          fill: '#999999'
        }
      }
    ],
    grid: {
      left: 20,
      right: 20,
      top: height - 50,
      bottom: 15,
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: generateDates(sparklineData.length),
      show: false,
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      show: false,
      scale: true
    },
    series: [
      {
        type: 'line',
        data: sparklineData,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
          color: getColor()
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: getColor() + '30'
              },
              {
                offset: 1,
                color: 'transparent'
              }
            ]
          }
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params[0];
        const date = generateDates(sparklineData.length)[point.dataIndex];
        const formattedValue = typeof point.value === 'number' ? formatValue(point.value) : point.value;
        return `<div style="padding: 8px;">
                  <div style="font-weight: 600; margin-bottom: 4px;">${date}</div>
                  <div>${formattedValue}</div>
                </div>`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#d9d9d9',
      borderWidth: 1,
      textStyle: {
        color: '#262626',
        fontSize: 12
      }
    }
  };

  return (
    <div style={{ 
      width: width, 
      height: height, 
      border: '1px solid #f0f0f0',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <ReactECharts 
        option={option} 
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};

export default SimpleKPISparklineChart;