# ComplexKPI Component

Компонент `ComplexKPI` создан на основе элемента выручки с главной страницы и предназначен для отображения ключевых показателей эффективности (KPI) с расширенной функциональностью.

## Особенности

- 📊 **Мини-график**: Встроенный график для визуализации динамики показателя
- 🎯 **Цель и прогресс**: Отображение целевого значения и прогресса его достижения
- 📈 **Тренд**: Показ направления изменения показателя
- 🎨 **Статусы**: Цветовая индикация состояния (success, warning, danger)
- ⚡ **Действия**: Кнопка для выполнения связанных действий
- 🎭 **Гибкость**: Все элементы опциональны и настраиваются

## Интерфейс

```typescript
interface ComplexKPIProps {
  id: string;                    // Уникальный идентификатор
  title: string;                 // Название показателя
  icon: React.ReactNode;         // Иконка
  value: string | number;        // Текущее значение
  target?: string | number;      // Целевое значение (опционально)
  progress?: number;             // Прогресс в процентах (0-100)
  trend?: number;                // Тренд в процентах (может быть отрицательным)
  status?: 'success' | 'warning' | 'danger'; // Статус для цветовой индикации
  subtitle?: string;             // Дополнительная информация
  action?: string;               // Текст кнопки действия
  chartData?: number[];          // Данные для мини-графика
  unit?: string;                 // Единица измерения
  onActionClick?: () => void;    // Обработчик клика по кнопке действия
}
```

## Примеры использования

### Базовый пример (как элемент выручки)

```tsx
import ComplexKPI from './ComplexKPI';
import { IconChartBar } from '@tabler/icons-react';

const revenueKPI = {
  id: 'revenue',
  title: 'Выручка',
  icon: <IconChartBar size={20} />,
  value: '1.34M₽',
  target: '1.5M₽',
  progress: 89,
  trend: 12,
  status: 'warning' as const,
  subtitle: 'Отставание от плана на 11%',
  action: 'Детали',
  chartData: Array.from({ length: 30 }, () => 1000000 + Math.random() * 500000),
  unit: '₽'
};

<ComplexKPI 
  {...revenueKPI}
  onActionClick={() => console.log('Открыть детали выручки')}
/>
```

### Простой KPI без графика

```tsx
<ComplexKPI 
  id="simple-metric"
  title="Конверсия"
  icon={<IconTargetArrow size={20} />}
  value="2.4%"
  target="3.0%"
  progress={80}
  status="warning"
  subtitle="Ниже целевого значения"
/>
```

### KPI только с трендом

```tsx
<ComplexKPI 
  id="trend-metric"
  title="Продажи"
  icon={<IconShoppingCart size={20} />}
  value="342 шт"
  trend={15}
  subtitle="Рост за последний месяц"
/>
```

## Цветовая схема статусов

- **success** (зеленый): Показатель в норме или превышает ожидания
- **warning** (желтый): Показатель требует внимания
- **danger** (красный): Критическое состояние показателя
- **default** (серый): Нейтральное состояние

## Мини-график

Мини-график автоматически отображается при передаче массива `chartData`. График показывает:
- Линейную диаграмму с плавными переходами
- Градиентную заливку области под графиком
- Цвет соответствует статусу KPI
- Интерактивность при наведении

## Интеграция

Компонент полностью совместим с существующей системой дизайна и использует:
- Mantine UI компоненты
- Tabler Icons для иконок
- ECharts для графиков
- Цветовую схему из темы Mantine

## Файлы

- `ComplexKPI.tsx` - Основной компонент
- `ComplexKPI.examples.tsx` - Примеры использования
- `ComplexKPI.README.md` - Документация

## Использование в сетке

Рекомендуется использовать в Grid с колонками span={3} для отображения 4 KPI в ряд:

```tsx
<Grid>
  <Grid.Col span={3}>
    <ComplexKPI {...kpi1} />
  </Grid.Col>
  <Grid.Col span={3}>
    <ComplexKPI {...kpi2} />
  </Grid.Col>
  <Grid.Col span={3}>
    <ComplexKPI {...kpi3} />
  </Grid.Col>
  <Grid.Col span={3}>
    <ComplexKPI {...kpi4} />
  </Grid.Col>
</Grid>
```