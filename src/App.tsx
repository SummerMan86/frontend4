import React from 'react';
import { CubeProvider } from '@cubejs-client/react';
import cubeApi from './utils/cubeApi';
import { BrowserRouter, Routes, Route, UNSAFE_NavigationContext } from 'react-router-dom';
import MyAppShell from './components/layout/AppShell';
import SupplierIncomesPage from './pages/SupplierIncomesPage';
import OperationalControlPage from './pages/OperationalControlPage';
import KpiDashboardPage2 from './pages/KpiDashboardPage2';
import TestPage from './pages/TestPage';
import MainPage from './pages/MainPage';
import ProductAnalysisPage from './pages/ProductAnalysisPage';
import { ThemeProvider } from './theme';

// Create router with future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <ThemeProvider>
      <CubeProvider cubeApi={cubeApi}>
        <BrowserRouter future={router.future}>
          <Routes>
            <Route element={<MyAppShell />}>
              <Route index element={<MainPage />} />
              <Route path="dashboard" element={<KpiDashboardPage2 />} />
              <Route path="inventory" element={<OperationalControlPage />} />
              <Route path="sales" element={<SupplierIncomesPage />} />
              <Route path="operational-control" element={<OperationalControlPage />} />
              <Route path="product-analysis" element={<ProductAnalysisPage />} />
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