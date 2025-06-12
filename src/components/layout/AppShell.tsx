import React from 'react';
import {
  AppShell,  
  NavLink,
  Group,
  Text,
  Box,
  ScrollArea,
  Indicator,
} from '@mantine/core';
import {
  IconChartBar,
  IconDatabase,
  IconTruck,
  IconShoppingCart,
  IconReportAnalytics,
  IconSettings,
  IconActivity,
  IconHome,
  IconBuildingWarehouse,
} from '@tabler/icons-react';
import { Outlet, Link, useLocation } from 'react-router-dom';

/* Маршруты → подписи */
const PATH_LABELS = {
  '/': 'Главное',
  '/dashboard': 'Дашборд',
  '/product-analysis': 'Анализ товаров',
  '/sales': 'Поставки',
  '/inventory': 'Запасы',
  '/warehouse-logistics': 'Склад и логистика',
  '/marketplace': 'Продажи',
  '/supplier-incomes': 'Доходы поставщика',
  '/reports': 'Доходы',
  '/operational-control': 'Оперативный контроль',
  '/settings': 'Настройки',
} as const;
type PathKey = keyof typeof PATH_LABELS;

/* Список нав-пунктов */
const NAV_ITEMS: { path: PathKey; icon: React.FC<any>; showIndicator?: boolean }[] = [
  { path: '/', icon: IconHome },
  { path: '/dashboard', icon: IconChartBar },
  { path: '/product-analysis', icon: IconShoppingCart },
  { path: '/sales', icon: IconShoppingCart },
  { path: '/inventory', icon: IconDatabase },
  { path: '/warehouse-logistics', icon: IconBuildingWarehouse },
  { path: '/marketplace', icon: IconTruck },
  { path: '/supplier-incomes', icon: IconTruck },
  { path: '/reports', icon: IconReportAnalytics },
  { path: '/operational-control', icon: IconActivity, showIndicator: true },
  { path: '/settings', icon: IconSettings },
];

export default function MyAppShell() {
  const { pathname } = useLocation();
  const active = (p: string) => pathname === p;

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 240,
        breakpoint: 'sm',
      }}
      padding="md"
    >
      {/* HEADER */}
      <AppShell.Header>
        <Group h="100%" px="md">
          <Text fw={700}>Моя Панель</Text>
        </Group>
      </AppShell.Header>

      {/* SIDEBAR */}
      <AppShell.Navbar>
        <AppShell.Section grow component={ScrollArea}>
          {NAV_ITEMS.map(({ path, icon: Icon, showIndicator }) => (
            <NavLink
              key={path}
              component={Link}
              to={path}
              label={PATH_LABELS[path]}
              leftSection={
                showIndicator ? (
                  <Indicator
                    size={8}
                    color="red"
                    processing
                    position="top-end"
                    offset={4}
                  >
                    <Icon size={18} />
                  </Indicator>
                ) : (
                  <Icon size={18} />
                )
              }
              active={active(path)}
            />
          ))}
        </AppShell.Section>
      </AppShell.Navbar>

      {/* КОНТЕНТ */}
      <AppShell.Main>
        <Box mih="100vh">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
