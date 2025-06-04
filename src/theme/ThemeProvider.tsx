// src/theme/ThemeProvider.tsx
import React, { ReactNode, FC } from 'react';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import designSystem from './designSystem';
import { components } from './components';

// Merge components into the theme
const themeWithComponents: MantineThemeOverride = {
  ...designSystem.theme,
  components,
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => (
  <MantineProvider theme={themeWithComponents}>
    {children}
  </MantineProvider>
);

export default ThemeProvider;
