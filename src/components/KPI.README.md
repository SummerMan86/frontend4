# KPI Components

Универсальные компоненты для отображения KPI (ключевых показателей эффективности) в приложении.

## Компоненты

### KPICard

Основной компонент для отображения одной KPI карточки.

#### Пропсы

| Пропс | Тип | Обязательный | По умолчанию | Описание |
|-------|-----|--------------|--------------|----------|
| `title` | `string` | ✅ | - | Заголовок KPI |
| `value` | `string \| number` | ✅ | - | Основное значение |
| `unit` | `string` | ❌ | - | Единица измерения |
| `change` | `number` | ❌ | - | Изменение в процентах |
| `icon` | `TablerIcon` | ✅ | - | Иконка из @tabler/icons-react |
| `color` | `string` | ❌ | `'blue'` | Основной цвет для градиента |
| `gradient` | `string` | ❌ | - | Кастомный градиент |
| `onClick` | `() => void` | ❌ | - | Обработчик клика |
| `size` | `'sm' \| 'md' \| 'lg'` | ❌ | `'md'` | Размер карточки |
| `disableHover` | `boolean` | ❌ | `false` | Отключить анимацию |

#### Доступные цвета

- `blue` - синий градиент
- `green` - зеленый градиент  
- `red` - красный градиент
- `orange` - оранжевый градиент
- `violet` - фиолетовый градиент
- `yellow` - желтый градиент
- `pink` - розовый градиент
- `cyan` - голубой градиент
- `teal` - бирюзовый градиент
- `indigo` - индиго градиент

### KPIGrid

Компонент для отображения сетки KPI карточек с дополнительными возможностями.

#### Пропсы

| Пропс | Тип | Обязательный | По умолчанию | Описание |
|-------|-----|--------------|--------------|----------|
| `kpis` | `KPICardProps[]` | ✅ | - | Массив данных для карточек |
| `title` | `string` | ❌ | - | Заголовок секции |
| `description` | `string` | ❌ | - | Описание секции |
| `showControls` | `boolean` | ❌ | `false` | Показать кнопки управления |
| `onRefresh` | `() => void` | ❌ | - | Обработчик обновления |
| `onExport` | `() => void` | ❌ | - | Обработчик экспорта |
| `columns` | `object` | ❌ | см. ниже | Количество колонок |
| `cardSize` | `'sm' \| 'md' \| 'lg'` | ❌ | `'md'` | Размер карточек |
| `withPaper` | `boolean` | ❌ | `true` | Обернуть в Paper |
| `loading` | `boolean` | ❌ | `false` | Состояние загрузки |

#### Настройка колонок по умолчанию

```typescript
columns: {
  base: 1,    // мобильные устройства
  xs: 2,      // очень маленькие экраны
  sm: 3,      // маленькие экраны
  md: 4,      // средние экраны
  lg: 6,      // большие экраны
  xl: 6,      // очень большие экраны
}
```

## Примеры использования

### Простая KPI карточка

```tsx
import { KPICard } from './components/KPICard';
import { IconBuildingWarehouse } from '@tabler/icons-react';

<KPICard
  title="Остатки на складах WB"
  value="45,382"
  unit="шт"
  change={12.5}
  icon={IconBuildingWarehouse}
  color="blue"
  onClick={() => console.log('Clicked!')}
/>
```

### Сетка KPI карточек

```tsx
import { KPIGrid } from './components/KPIGrid';
import { IconBuildingWarehouse, IconTruck } from '@tabler/icons-react';

const kpis = [
  {
    title: 'Остатки на складах WB',
    value: '45,382',
    unit: 'шт',
    change: 12.5,
    icon: IconBuildingWarehouse,
    color: 'blue' as const,
  },
  {
    title: 'Товары в пути',
    value: '3,847',
    unit: 'шт',
    change: -3.2,
    icon: IconTruck,
    color: 'orange' as const,
  },
];

<KPIGrid
  kpis={kpis}
  title="📈 KPI метрики"
  description="Ключевые показатели эффективности"
  showControls
  onRefresh={() => console.log('Refreshing...')}
  onExport={() => console.log('Exporting...')}
  columns={{
    base: 1,
    sm: 2,
    md: 4,
  }}
/>
```

### Кастомный градиент

```tsx
<KPICard
  title="Прибыль"
  value="847,392"
  unit="₽"
  change={18.5}
  icon={IconChartLine}
  gradient="linear-gradient(135deg, #51cf66 0%, #40c057 100%)"
/>
```

### Разные размеры

```tsx
{/* Маленькая карточка */}
<KPICard size="sm" {...props} />

{/* Средняя карточка (по умолчанию) */}
<KPICard size="md" {...props} />

{/* Большая карточка */}
<KPICard size="lg" {...props} />
```

## Миграция с существующего кода

Если у вас есть существующие KPI карточки, вы можете легко мигрировать на новые компоненты:

### Было (в WarehouseAndLogisticsPageExt.tsx):

```tsx
<Grid>
  {warehouseKPIs.map((kpi, index) => {
    const Icon = kpi.icon;
    return (
      <Grid.Col key={index} span={{ base: 12, xs: 6, sm: 4, md: 2 }}>
        <Paper
          p="md"
          withBorder
          style={{
            background: kpi.gradient,
            color: 'white',
            // ... много кода
          }}
        >
          {/* Сложная разметка */}
        </Paper>
      </Grid.Col>
    );
  })}
</Grid>
```

### Стало:

```tsx
import { KPIGrid } from '../components/KPIGrid';

<KPIGrid
  kpis={warehouseKPIs}
  title="📈 KPI метрики"
  description="Ключевые показатели эффективности"
  showControls
  onRefresh={handleRefresh}
  onExport={handleExport}
  columns={{
    base: 1,
    xs: 2,
    sm: 3,
    md: 6,
  }}
/>
```

## Особенности

1. **Автоматические градиенты**: Каждый цвет имеет предустановленный красивый градиент
2. **Адаптивность**: Компоненты автоматически адаптируются под разные размеры экрана
3. **Анимации**: Плавные анимации при наведении (можно отключить)
4. **Типизация**: Полная поддержка TypeScript
5. **Гибкость**: Можно использовать как отдельные карточки, так и готовую сетку
6. **Совместимость**: Использует Mantine компоненты и Tabler иконки

## Файлы

- `KPICard.tsx` - основной компонент карточки
- `KPIGrid.tsx` - компонент сетки карточек
- `KPICard.examples.tsx` - примеры использования
- `KPI.README.md` - эта документация