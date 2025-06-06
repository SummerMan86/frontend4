import React from 'react';
import { CubeProvider } from '@cubejs-client/react';
import cubeApi from './utils/cubeApi';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyAppShell from './components/layout/AppShell';
import SupplierIncomesPage from './pages/SupplierIncomesPage';
import OperationalControlPage from './pages/OperationalControlPage';
import KpiDashboardPage2 from './pages/KpiDashboardPage2';
import TestPage from './pages/TestPage';
import { ThemeProvider } from './theme';

function App() {
  return (
        <ThemeProvider>
          <CubeProvider cubeApi={cubeApi}>
          <BrowserRouter>
            <Routes>
              <Route element={<MyAppShell />}>
                <Route index element={<KpiDashboardPage2 />} />
                <Route path="inventory" element={<OperationalControlPage />} />
                <Route path="sales" element={<SupplierIncomesPage />} />
                {/* остальные страницы */}
                <Route path="*" element={<TestPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          </CubeProvider>
        </ThemeProvider>
  );
}

export default App;