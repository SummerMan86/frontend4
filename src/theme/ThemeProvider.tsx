import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";
import designSystem from "./designSystem";

/**
 * В designSystem.ts уже есть объект `chakraTokens`, который
 * содержит все токены в формате Chakra UI v3
 * (каждый primitive обёрнут в `{ value: ... }`, а названия
 * совпадают со стандартными ключами Chakra).
 * Поэтому нам не нужны вспомогательные функции wrap/маппинг —
 * просто передаём эти токены в `defineConfig`.
 */

const customConfig = defineConfig({
  theme: {
    // 👉 включаем все готовые токены из designSystem
    ...designSystem.chakraTokens,

    /**
     * При желании здесь можно дополнить theme
     * (например, своими компонентами или глобальными стилями):
     * components: { ... }, styles: { global: { ... } },
     * но базовые цвета/шрифты/spacing уже внутри chakraTokens.
     */
  },
});

/**
 * Здесь мы собираем итоговую тему через `createSystem` и экспортируем объект `system`, который затем передаётся в `<ChakraProvider value={system}>`.
 * 
 * Параметр `defaultConfig` содержит базовые (дефолтные) токены и настройки Chakra UI.
 * Если вы хотите использовать **только** свои `chakraTokens` без штатных значений Chakra,
 * замените `defaultConfig` на `defaultBaseConfig` — тогда система создаст тему **только** из ваших токенов,
 * без предварительно определённых Палитр, шрифтов и прочих значений.
 */
export const system = createSystem(defaultConfig, customConfig);
