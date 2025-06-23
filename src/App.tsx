import React, { lazy, Suspense } from 'react';
import { CubeProvider } from '@cubejs-client/react';
import cubeApi from './utils/cubeApi';
import { BrowserRouter, Routes, Route, UNSAFE_NavigationContext } from 'react-router-dom';
import MyAppShell from './components/layout/AppShell';
import { ThemeProvider } from './theme';
import { Loader, Center, Text, Stack } from '@mantine/core';

// Lazy load all pages
const MainPage = lazy(() => import('./pages/MainPage'));
const KpiDashboardPage2 = lazy(() => import('./pages/KpiDashboardPage2'));
const OperationalControlPage = lazy(() => import('./pages/OperationalControlPage'));
const SupplierIncomesPage = lazy(() => import('./pages/SupplierIncomesPage'));
const WarehouseAndLogisticsPage = lazy(() => import('./pages/WarehouseAndLogisticsPage'));
const WarehouseAndLogisticsPageExt = lazy(() => import('./pages/WarehouseAndLogisticsPageExt'));
const SupplyManagementPage = lazy(() => import('./pages/SupplyManagementPage'));
const ProductAnalysisPage = lazy(() => import('./pages/ProductAnalysisPage'));
const FinancialAnalysisPage = lazy(() => import('./pages/FinancialAnalysisPage'));
const SalesAnalysisPage = lazy(() => import('./pages/SalesAnalysisPage'));
const SalesDashboardPage = lazy(() => import('./pages/SalesDashboardPage'));
const UnitEconomicsPage = lazy(() => import('./pages/UnitEconomicsPage'));
const KPIDemoPage = lazy(() => import('./pages/KPIDemoPage'));
const KPITestPage = lazy(() => import('./pages/KPITestPage'));
const DeliveriesPage = lazy(() => import('./pages/DeliveriesPage'));
const RoutesMapTestPage = lazy(() => import('./pages/RoutesMapTestPage'));
const SupplyGraphTestPage = lazy(() => import('./pages/SupplyGraphTestPage'));
const TestPage = lazy(() => import('./pages/TestPage'));

// Loading component
const LoadingFallback = () => (
  <Center style={{ height: '50vh' }}>
    <Stack align="center" gap="md">
      <Loader size="lg" />
      <Text size="sm" c="dimmed">Загрузка страницы...</Text>
    </Stack>
  </Center>
);

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
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route element={<MyAppShell />}>
                <Route index element={<MainPage />} />
                <Route path="dashboard" element={<KpiDashboardPage2 />} />
                <Route path="inventory" element={<OperationalControlPage />} />
                <Route path="sales" element={<SupplierIncomesPage />} />
                <Route path="sales-dashboard" element={<SalesDashboardPage />} />
                <Route path="warehouse-logistics" element={<WarehouseAndLogisticsPage />} />
                <Route path="warehouse-logistics-ext" element={<WarehouseAndLogisticsPageExt />} />
                <Route path="supply-management" element={<SupplyManagementPage />} />
                <Route path="operational-control" element={<OperationalControlPage />} />
                <Route path="product-analysis" element={<ProductAnalysisPage />} />
                <Route path="financial-analysis" element={<FinancialAnalysisPage />} />
                <Route path="sales-analysis" element={<SalesAnalysisPage />} />
                <Route path="unit-economics" element={<UnitEconomicsPage />} />
                <Route path="kpi-demo" element={<KPIDemoPage />} />
                <Route path="kpi-test" element={<KPITestPage />} />
                <Route path="deliveries" element={<DeliveriesPage />} />
                <Route path="/routes-map-test" element={<RoutesMapTestPage />} />
            <Route path="/supply-graph-test" element={<SupplyGraphTestPage />} />
                {/* остальные страницы */}
                <Route path="*" element={<TestPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CubeProvider>
    </ThemeProvider>
  );
}

export default App;