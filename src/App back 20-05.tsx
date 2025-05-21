import React from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyAppShell from './components/layout/AppShell';
import SupplierIncomesPage from './pages/SupplierIncomesPage';
import CubeTestPage from './pages/TestPage';
import { ThemeProvider } from './theme';

export default function App1() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MyAppShell />}>
            <Route index element={<CubeTestPage />} />
            <Route path="sales" element={<SupplierIncomesPage />} />
            {/* остальные страницы */}
            <Route path="*" element={<SupplierIncomesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}