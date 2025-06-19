# KPISparklineCard Component

Универсальный компонент для отображения KPI карточек с интегрированными sparkline графиками, созданный на основе карточки "Возвраты" из дашборда.

## Особенности

- 📊 **Sparkline графики** - миниатюрные графики тренда за период
- 📈 **Индикаторы изменений** - стрелки и проценты роста/падения
- 🎨 **Гибкая настройка цветов** - автоматические и кастомные цвета
- 📱 **Адаптивность** - три размера карточек (sm, md, lg)
- 🖱️ **Интерактивность** - поддержка кликов и hover эффектов
- 🔧 **TypeScript** - полная типизация
- 🎯 **Доступность** - семантическая разметка

## Установка

Компонент использует следующие зависимости:
- `@mantine/core` - UI компоненты
- `@tabler/icons-react` - иконки
- `echarts-for-react` - графики

## Основное использование

```tsx
import { KPISparklineCard } from './components/KPISparklineCard';
import { IconTrendingUp } from '@tabler/icons-react';

// Простая карточка с графиком
<KPISparklineCard
  title="Продажи за день"
  value="1 045 000 ₽"
  change={8.5}
  icon={<IconTrendingUp size={20} />}
  sparklineData={[100, 120, 110, 140, 130, 160, 150, 180]}
  unit="₽"
/>
```

## Props

### Основные свойства

| Prop | Тип | Обязательный | По умолчанию | Описание |
|------|-----|--------------|--------------|----------|
| `title` | `string` | ✅ | - | Заголовок карточки |
| `value` | `string \| number` | ✅ | - | Основное значение |
| `change` | `number` | ❌ | - | Процент изменения |
| `icon` | `React.ReactNode` | ❌ | - | Иконка для карточки |
| `sparklineData` | `number[]` | ❌ | - | Данные для графика |
| `unit` | `string` | ❌ | `''` | Единица измерения |

### Настройки внешнего вида

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер карточки |
| `lineColor` | `string` | auto | Цвет линии графика |
| `sparklineHeight` | `number` | `40` | Высота графика |
| `showArea` | `boolean` | `true` | Показывать область под графиком |
| `style` | `React.CSSProperties` | - | Дополнительные стили |

### Интерактивность

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `onClick` | `() => void` | - | Обработчик клика |
| `disableHoverAnimation` | `boolean` | `false` | Отключить анимацию |

### Кастомизация текста

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `comparisonText` | `string` | `'vs среднее'` | Текст сравнения |
| `sparklineTitle` | `string` | `'Тренд за 30 дней'` | Заголовок графика |
| `dates` | `string[]` | auto | Даты для оси X |

## Поддерживаемые единицы измерения

Компонент автоматически форматирует значения в зависимости от единицы:

- `₽` - российские рубли с разделителями тысяч
- `шт` или `шт.` - штуки
- `%` - проценты
- `заказы` - количество заказов
- Любая другая - отображается как есть

## Размеры карточек

### Small (`sm`)
```tsx
<KPISparklineCard
  size="sm"
  title="Компактная карточка"
  value="1,234"
  // ... другие props
/>
```

### Medium (`md`) - по умолчанию
```tsx
<KPISparklineCard
  size="md"
  title="Стандартная карточка"
  value="5,678"
  // ... другие props
/>
```

### Large (`lg`)
```tsx
<KPISparklineCard
  size="lg"
  title="Большая карточка"
  value="9,876"
  sparklineHeight={60}
  // ... другие props
/>
```

## Примеры использования

### Карточка продаж с ростом
```tsx
<KPISparklineCard
  title="Продажи за день"
  value="1 045 000 ₽"
  change={8.5}
  icon={<IconCurrencyDollar size={20} />}
  sparklineData={[950000, 980000, 1020000, 1045000]}
  unit="₽"
  onClick={() => console.log('Переход к детальной аналитике')}
/>
```

### Карточка возвратов с падением
```tsx
<KPISparklineCard
  title="Возвраты"
  value="42 шт."
  change={-3.2}
  icon={<IconTrendingDown size={20} />}
  sparklineData={[50, 48, 45, 42]}
  unit="шт"
  lineColor="#ff6b6b"
/>
```

### Карточка без графика
```tsx
<KPISparklineCard
  title="Активные клиенты"
  value="1,847"
  change={15.6}
  icon={<IconUsers size={20} />}
  unit="чел"
  comparisonText="vs прошлый месяц"
/>
```

### Кастомный график
```tsx
<KPISparklineCard
  title="Конверсия"
  value="12.5%"
  change={2.1}
  icon={<IconChartLine size={20} />}
  sparklineData={[10.2, 11.1, 11.8, 12.5]}
  unit="%"
  lineColor="#9c88ff"
  showArea={false}
  sparklineHeight={50}
  sparklineTitle="Конверсия за неделю"
/>
```

## Сетка карточек

```tsx
import { SimpleGrid } from '@mantine/core';

const kpis = [
  {
    title: 'Продажи',
    value: '1 045 000 ₽',
    change: 8.5,
    sparklineData: [/* данные */],
    // ...
  },
  // ... другие KPI
];

<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
  {kpis.map((kpi, index) => (
    <KPISparklineCard key={index} {...kpi} />
  ))}
</SimpleGrid>
```

## Генерация тестовых данных

```tsx
// Функция для генерации тестовых данных sparkline
const generateSparklineData = (
  baseValue: number, 
  trend: 'up' | 'down' | 'flat' = 'up',
  volatility: number = 0.2
): number[] => {
  const data: number[] = [];
  let value = baseValue;
  
  for (let i = 0; i < 30; i++) {
    const randomVariation = (Math.random() - 0.5) * volatility;
    let trendValue = 0;
    
    if (trend === 'up') {
      trendValue = i * 0.01;
    } else if (trend === 'down') {
      trendValue = -i * 0.01;
    }
    
    value = baseValue * (1 + trendValue + randomVariation);
    data.push(Math.max(0, value));
  }
  
  return data;
};

// Использование
<KPISparklineCard
  title="Тестовые данные"
  value="1,234"
  sparklineData={generateSparklineData(1200, 'up')}
/>
```

## Интеграция с существующим кодом

### Миграция с обычных KPI карточек

**Было:**
```tsx
<StatsCard
  title="Возвраты"
  value="42 шт."
  change={-3}
  sparklineData={data}
  unit="шт"
/>
```

**Стало:**
```tsx
<KPISparklineCard
  title="Возвраты"
  value="42 шт."
  change={-3}
  sparklineData={data}
  unit="шт"
  icon={<IconTrendingDown size={20} />}
/>
```

## Связанные файлы

- `KPISparklineCard.tsx` - основной компонент
- `KPISparklineCard.examples.tsx` - примеры использования
- `KPISparklineCard.README.md` - документация
- `KPICard.tsx` - базовый KPI компонент без графиков
- `KPIGrid.tsx` - сетка для KPI карточек

## Совместимость

Компонент совместим с:
- React 18+
- TypeScript 4.5+
- Mantine 7.x
- ECharts 5.x

## Производительность

- Использует `React.memo` для оптимизации рендеринга
- SVG рендеринг графиков для лучшей производительности
- Ленивая загрузка ECharts компонентов
- Минимальные пересчеты при изменении данных