/* ============================ components.ts ============================ */
import type { MantineThemeComponents } from '@mantine/core';
import designSystem from './designSystem';
const toPxLocal = (v?: number | string) => (typeof v === 'number' ? `${v}px` : v);

export const components: MantineThemeComponents = {
  Button: {
    defaultProps: { radius: 'md', variant: 'filled' },
    styles: () => ({ root: { fontWeight: 600 } }),
  },
  Card: {
    styles: () => ({
      root: {
        borderRadius: toPxLocal((designSystem as any).borders?.radii?.medium),
        boxShadow:
          (designSystem as any).effects?.shadows?.small || 'var(--mantine-shadow-sm)',
      },
    }),
  },
  Modal: {
    defaultProps: {
      radius: toPxLocal((designSystem as any).borders?.radii?.large),
      size: 'lg',
      centered: true,
    },
  },
};
