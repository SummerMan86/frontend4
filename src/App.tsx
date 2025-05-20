import React from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyAppShell from './components/layout/AppShell';
import SupplierIncomesPage from './pages/SupplierIncomesPage';

export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MyAppShell />}>
            <Route index element={<SupplierIncomesPage />} />
            <Route path="sales" element={<SupplierIncomesPage />} />
            {/* остальные страницы */}
            <Route path="*" element={<SupplierIncomesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}