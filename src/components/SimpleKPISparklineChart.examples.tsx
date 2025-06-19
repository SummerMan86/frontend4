import React from 'react';
import { SimpleKPISparklineChart } from './SimpleKPISparklineChart';

/**
 * Примеры использования SimpleKPISparklineChart для PIX BI
 */
export const SimpleKPIExamples: React.FC = () => {
  // Генерация тестовых данных
  const generateTestData = (count: number, min: number, max: number, trend: 'up' | 'down' | 'mixed' = 'mixed') => {
    const data = [];
    let current = min + (max - min) * 0.5;
    
    for (let i = 0; i < count; i++) {
      const variation = (Math.random() - 0.5) * (max - min) * 0.1;
      
      if (trend === 'up') {
        current += Math.abs(variation) * 0.5 + (max - min) * 0.02;
      } else if (trend === 'down') {
        current -= Math.abs(variation) * 0.5 + (max - min) * 0.02;
      } else {
        current += variation;
      }
      
      current = Math.max(min, Math.min(max, current));
      data.push(Math.round(current));
    }
    
    return data;
  };

  const salesData = generateTestData(30, 50000, 150000, 'up');
  const ordersData = generateTestData(30, 100, 500, 'mixed');
  const conversionData = generateTestData(30, 2.5, 8.5, 'down');
  const profitData = generateTestData(30, 15000, 45000, 'up');

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '30px', color: '#262626' }}>Примеры SimpleKPISparklineChart для PIX BI</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* Продажи */}
        <SimpleKPISparklineChart
          title="Продажи"
          value={salesData[salesData.length - 1]}
          change={12.5}
          sparklineData={salesData}
          unit="₽"
          themeColor="#1890ff"
        />

        {/* Заказы */}
        <SimpleKPISparklineChart
          title="Заказы"
          value={ordersData[ordersData.length - 1]}
          change={-3.2}
          sparklineData={ordersData}
          unit="шт"
          themeColor="#722ed1"
        />

        {/* Конверсия */}
        <SimpleKPISparklineChart
          title="Конверсия"
          value={conversionData[conversionData.length - 1]}
          change={-8.1}
          sparklineData={conversionData}
          unit="%"
          themeColor="#fa8c16"
        />

        {/* Прибыль */}
        <SimpleKPISparklineChart
          title="Прибыль"
          value={profitData[profitData.length - 1]}
          change={15.7}
          sparklineData={profitData}
          unit="₽"
          themeColor="#52c41a"
        />
      </div>

      {/* Разные размеры */}
      <h2 style={{ marginBottom: '20px', color: '#262626' }}>Разные размеры</h2>
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        flexWrap: 'wrap',
        marginBottom: '40px'
      }}>
        {/* Маленький */}
        <SimpleKPISparklineChart
          title="Компактный"
          value={125000}
          change={5.2}
          sparklineData={salesData.slice(-15)}
          unit="₽"
          width={250}
          height={120}
        />

        {/* Средний */}
        <SimpleKPISparklineChart
          title="Стандартный"
          value={125000}
          change={5.2}
          sparklineData={salesData}
          unit="₽"
          width={300}
          height={150}
        />

        {/* Большой */}
        <SimpleKPISparklineChart
          title="Расширенный"
          value={125000}
          change={5.2}
          sparklineData={salesData}
          unit="₽"
          width={400}
          height={200}
        />
      </div>

      {/* Без изменений */}
      <h2 style={{ marginBottom: '20px', color: '#262626' }}>Без процента изменения</h2>
      <div style={{ marginBottom: '40px' }}>
        <SimpleKPISparklineChart
          title="Активные пользователи"
          value={1247}
          sparklineData={generateTestData(30, 1000, 1500)}
          unit="чел"
          themeColor="#13c2c2"
        />
      </div>

      {/* Код для интеграции */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #d9d9d9'
      }}>
        <h2 style={{ marginTop: 0, color: '#262626' }}>Код для интеграции в PIX BI</h2>
        <pre style={{ 
          backgroundColor: '#f6f8fa', 
          padding: '15px', 
          borderRadius: '6px',
          overflow: 'auto',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
{`import { SimpleKPISparklineChart } from './SimpleKPISparklineChart';

// Базовое использование
<SimpleKPISparklineChart
  title="Продажи"
  value={125000}
  change={12.5}
  sparklineData={[100, 120, 110, 130, 125, 140, 135, 150]}
  unit="₽"
  width={300}
  height={150}
  themeColor="#1890ff"
/>

// Без процента изменения
<SimpleKPISparklineChart
  title="Активные пользователи"
  value={1247}
  sparklineData={[1200, 1220, 1210, 1230, 1225, 1240, 1235, 1250]}
  unit="чел"
/>`}
        </pre>
        
        <h3 style={{ color: '#262626' }}>Основные параметры:</h3>
        <ul style={{ color: '#595959' }}>
          <li><strong>title</strong> - заголовок карточки</li>
          <li><strong>value</strong> - основное значение (число или строка)</li>
          <li><strong>change</strong> - процент изменения (опционально)</li>
          <li><strong>sparklineData</strong> - массив чисел для графика</li>
          <li><strong>unit</strong> - единица измерения (₽, %, шт, чел и т.д.)</li>
          <li><strong>width/height</strong> - размеры карточки</li>
          <li><strong>themeColor</strong> - основной цвет темы</li>
        </ul>
        
        <h3 style={{ color: '#262626' }}>Преимущества для PIX BI:</h3>
        <ul style={{ color: '#595959' }}>
          <li>Все в одной функции ECharts - легко интегрировать</li>
          <li>Минимальные зависимости (только echarts-for-react)</li>
          <li>Автоматическое форматирование значений</li>
          <li>Адаптивные цвета на основе изменений</li>
          <li>Настраиваемые размеры</li>
          <li>SVG рендеринг для четкости</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleKPIExamples;