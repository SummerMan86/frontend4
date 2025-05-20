import React from 'react';
import {
  AppShell,  
  NavLink,
  Group,
  Text,
  Box,
  ScrollArea,
} from '@mantine/core';
import {
  IconChartBar,
  IconDatabase,
  IconTruck,
  IconShoppingCart,
  IconReportAnalytics,
  IconSettings,
} from '@tabler/icons-react';
import { Outlet, Link, useLocation } from 'react-router-dom';

/* Маршруты → подписи */
const PATH_LABELS = {
  '/': 'Дашборд',
  '/sales': 'Продажи',
  '/inventory': 'Запасы',
  '/marketplace': 'Маркетплейс',
  '/supplier-incomes': 'Доходы поставщика',
  '/reports': 'Отчёты',
  '/settings': 'Настройки',
} as const;
type PathKey = keyof typeof PATH_LABELS;

/* Список нав-пунктов */
const NAV_ITEMS: { path: PathKey; icon: React.FC<any> }[] = [
  { path: '/', icon: IconChartBar },
  { path: '/sales', icon: IconShoppingCart },
  { path: '/inventory', icon: IconDatabase },
  { path: '/marketplace', icon: IconTruck },
  { path: '/supplier-incomes', icon: IconTruck },
  { path: '/reports', icon: IconReportAnalytics },
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
          {NAV_ITEMS.map(({ path, icon: Icon }) => (
            <NavLink
              key={path}
              component={Link}
              to={path}
              label={PATH_LABELS[path]}
              leftSection={<Icon size={18} />}
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
