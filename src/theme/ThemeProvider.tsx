/* ============================ ThemeProvider.tsx ============================ */
import React, { PropsWithChildren } from 'react';
import {
  MantineProvider,
  createTheme,
  MantineColorsTuple,
  MantineThemeOverride,
} from '@mantine/core';
import designSystem from './designSystem';
import { components } from './components';

// Convert number → pixel string
const toPx = (v?: number | string) => (typeof v === 'number' ? `${v}px` : v);
const toPxRecord = <T extends Record<string, any>>(rec?: T): Record<string, any> | undefined => {
  if (!rec) return undefined;
  return Object.fromEntries(
    Object.entries(rec).map(([k, v]) => [k, typeof v === 'number' ? `${v}px` : v]),
  );
};

// Palette ↦ Mantine 10‑tuple
const toMantineColors = (
  palette: Record<string, any> | undefined | null,
): Record<string, MantineColorsTuple> => {
  const res: Record<string, MantineColorsTuple> = {};
  if (!palette) return res;
  for (const [name, value] of Object.entries(palette)) {
    const shades = Array.isArray(value)
      ? value
      : typeof value === 'object'
      ? Object.keys(value)
          .filter((k) => /^(\d+)$/.test(k))
          .sort((a, b) => +a - +b)
          .map((k) => (value as any)[k])
      : [];
    if (shades.length === 10) res[name] = shades as unknown as MantineColorsTuple;
  }
  return res;
};

const mantineColors = toMantineColors((designSystem as any).palette);

const theme: MantineThemeOverride = createTheme({
  colors: mantineColors,
  primaryColor: (designSystem as any).primaryColor ?? 'blue',

  fontFamily: (designSystem as any).typography?.fonts?.body,
  fontFamilyMonospace: (designSystem as any).typography?.fonts?.mono,
  headings: {
    fontFamily: (designSystem as any).typography?.fonts?.heading,
    sizes: {
      h1: { fontSize: toPx((designSystem as any).typography?.fontSizes?.['4xl']), fontWeight: "700" },
      h2: { fontSize: toPx((designSystem as any).typography?.fontSizes?.['3xl']), fontWeight: "700" },
      h3: { fontSize: toPx((designSystem as any).typography?.fontSizes?.['2xl']), fontWeight: "600" },
      h4: { fontSize: toPx((designSystem as any).typography?.fontSizes?.xl), fontWeight: "600" },
      h5: { fontSize: toPx((designSystem as any).typography?.fontSizes?.lg), fontWeight: "600" },
      h6: { fontSize: toPx((designSystem as any).typography?.fontSizes?.md), fontWeight: "600" },
    },
  },

  spacing: toPxRecord((designSystem as any).spacing?.space) as any,
  radius: toPxRecord((designSystem as any).borders?.radii) as any,
  breakpoints: toPxRecord((designSystem as any).breakpoints) as any,

  components,
});

export const ThemeProvider = ({ children }: PropsWithChildren) => (
  <MantineProvider theme={theme}>{children}</MantineProvider>
);