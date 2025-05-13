import React, { useMemo, useEffect } from 'react';
import { useCubeQuery } from '@cubejs-client/react';
import ReactECharts from 'echarts-for-react';
import cubeApi from '../utils/cubeApi';

const SupplierIncomesDashboard: React.FC = () => {
  // 1️⃣ Запрашиваем данные через Cube.js
  const { resultSet, isLoading, error } = useCubeQuery(
    {
      measures: [
        'SupplierIncomes.count',
        'SupplierIncomes.totalQuantity',
        'SupplierIncomes.totalRevenue',
      ],
      dimensions: ['SupplierIncomes.warehouseName'],
      order: { 'SupplierIncomes.totalRevenue': 'desc' },
      limit: 100,
    },
    { cubeApi }
  );

  console.log('step1');
  // 1.1 Логируем «сырые» строки при каждом обновлении данных
  useEffect(() => {
    if (resultSet) {
      // rawData() — массив строк, как приходит от Cube
      console.log('Cube rawData:', resultSet.rawData());
      console.log('Cube pivot:', resultSet.chartPivot());
    }
  }, [resultSet]);
  console.log('step2');

  // 2️⃣ Формируем конфиг ECharts, когда придут данные
  const chartOption = useMemo(() => {
    if (!resultSet) return {};
    const pivot = resultSet.chartPivot();
    return {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: pivot.map((r) => r['SupplierIncomes.warehouseName']),
        axisLabel: { rotate: 45 },
      },
      yAxis: { type: 'value', name: 'Сумма, ₽' },
      series: [
        {
          name: 'Выручка',
          type: 'bar',
          data: pivot.map((r) => r['SupplierIncomes.totalRevenue']),
          barMaxWidth: '40%',
        },
      ],
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    } as echarts.EChartsOption;
  }, [resultSet]);

  // 3️⃣ Состояния загрузки / ошибки / отсутствие данных
  if (isLoading) return <div>Загрузка…</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error.message}</div>;
  if (resultSet && resultSet.rawData().length === 0) return <div>Нет данных</div>;

  // 4️⃣ Сам график
  return (
    <div style={{ height: 400, width: '100%' }}>
      <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
    </div>
  );
  
};

export default SupplierIncomesDashboard;