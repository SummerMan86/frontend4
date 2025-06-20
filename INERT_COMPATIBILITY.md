# Совместимость с атрибутом `inert` в React 18 + Mantine 8

## Проблема

При использовании Mantine 8 с React 18 в консоли браузера появляются предупреждения:

```
Warning: Received `true` for a non-boolean attribute `inert`.
If you want to write it to the DOM, pass a string instead: inert="true" or inert={value.toString()}.
```

## Причина

React 18 не поддерживает атрибут `inert` как boolean нативно. Mantine 8 использует этот атрибут для управления интерактивностью компонентов (модальные окна, выпадающие списки, коллапсы и т.д.).

## Решения

### 1. CSS правила (реализовано)

В файле `src/index.css` добавлены правила для корректной обработки `inert` атрибута:

```css
/* Базовые стили для inert элементов */
[inert] {
  pointer-events: none !important;
  user-select: none !important;
  opacity: 0.6;
  filter: grayscale(0.3);
}

/* Обработка строковых значений inert (React 18 workaround) */
[inert="true"] {
  pointer-events: none !important;
  user-select: none !important;
  opacity: 0.6;
  filter: grayscale(0.3);
}

[inert="false"] {
  pointer-events: auto !important;
  user-select: auto !important;
  opacity: 1;
  filter: none;
}
```

### 2. Подавление предупреждений (реализовано)

В файле `src/utils/react-warnings-suppressor.ts` создана утилита для подавления известных предупреждений о `inert` атрибуте в режиме разработки.

Использование в `src/main.tsx`:

```typescript
import { suppressInertWarnings } from './utils/react-warnings-suppressor';

// Подавление предупреждений React 18 о inert для совместимости с Mantine
suppressInertWarnings();
```

## Долгосрочное решение

### Обновление до React 19

React 19 добавляет нативную поддержку атрибута `inert` как boolean:

```bash
npm install react@19 react-dom@19
```

После обновления:
1. Удалите вызов `suppressInertWarnings()` из `main.tsx`
2. CSS правила можно оставить для обратной совместимости
3. Файл `react-warnings-suppressor.ts` можно удалить

## Проверка совместимости

Используйте утилиту для проверки поддержки:

```typescript
import { isInertNativelySupported, INERT_INFO } from './utils/react-warnings-suppressor';

if (isInertNativelySupported()) {
  console.log('✅ React поддерживает inert нативно');
} else {
  console.log('⚠️ Используется workaround для inert:', INERT_INFO);
}
```

## Затронутые компоненты

- `Modal` - модальные окна
- `Drawer` - боковые панели
- `Menu` - выпадающие меню
- `Popover` - всплывающие окна
- `Collapse` - сворачиваемые блоки
- `ExpandableKPIGrid` - наш кастомный компонент

## Ссылки

- [React Issue #17157](https://github.com/facebook/react/issues/17157) - официальный issue о поддержке inert
- [MDN: inert attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert) - документация по inert
- [Mantine 8 Changelog](https://mantine.dev/changelog/8-0-0/) - изменения в Mantine 8

## Статус

- ✅ CSS правила реализованы
- ✅ Подавление предупреждений реализовано
- ✅ Функциональность работает корректно
- ⏳ Ожидается обновление до React 19