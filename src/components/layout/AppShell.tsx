import React from 'react';
import {
  AppShell,  
  NavLink,
  Group,
  Text,
  Box,
  ScrollArea,
  Indicator,
  ThemeIcon,
  UnstyledButton,
  Stack,
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
  IconBrandWechat,
  IconTarget,
} from '@tabler/icons-react';
import { Outlet, Link, useLocation } from 'react-router-dom';

/* Маршруты → подписи */
const PATH_LABELS = {
  '/': 'Главная',
  '/dashboard': 'Дашборд',
  '/product-analysis': 'Анализ товаров',
  '/sales': 'Продажи',
  '/inventory': 'Инвентарь',
  '/warehouse-logistics': 'ABC анализ остатков',
  '/warehouse-logistics-ext': 'Остатки и ПВЗ',
  '/supply-management': 'Управление поставками',
  '/deliveries': 'Поставки',
  '/marketplace': 'Продажи',
  '/supplier-incomes': 'Доходы поставщика',
  '/reports': 'Доходы',
  '/financial-analysis': 'Финансовый анализ',
  '/operational-control': 'Оперативный контроль',
  '/kpi-demo': 'Демо KPI',
  '/supply-graph-test': 'Карта поставок',
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
  { path: '/warehouse-logistics-ext', icon: IconBuildingWarehouse },
  { path: '/supply-management', icon: IconTruck },
  { path: '/deliveries', icon: IconTruck },
  { path: '/marketplace', icon: IconTruck },
  { path: '/supplier-incomes', icon: IconTruck },
  { path: '/reports', icon: IconReportAnalytics },
  { path: '/financial-analysis', icon: IconReportAnalytics },
  { path: '/operational-control', icon: IconActivity, showIndicator: true },
  { path: '/kpi-demo', icon: IconTarget },
  { path: '/supply-graph-test', icon: IconTruck, showIndicator: true },

];

export default function MyAppShell() {
  const { pathname } = useLocation();
  const active = (p: string) => pathname === p;

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
      }}
      padding="md"
    >
      {/* HEADER */}
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group>
            <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'violet', to: 'grape' }}>
              <IconBrandWechat size={28} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>Sales Dashboard</Text>
              <Text size="xs" c="dimmed">Панель управления</Text>
            </div>
          </Group>
        </Group>
      </AppShell.Header>

      {/* SIDEBAR */}
      <AppShell.Navbar p="md">
        
        <AppShell.Section grow mt="xl" component={ScrollArea}>
          <Stack gap={5}>
            {NAV_ITEMS.map(({ path, icon: Icon, showIndicator }) => (
              <UnstyledButton
                key={path}
                component={Link}
                to={path}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  color: '#000',
                  backgroundColor: active(path) ? '#f3f0ff' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!active(path)) {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active(path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Group>
                  <ThemeIcon 
                    variant={active(path) ? 'filled' : 'light'} 
                    color="violet"
                  >
                    {showIndicator ? (
                      <Indicator
                        size={8}
                        color="red"
                        processing
                        position="top-end"
                        offset={4}
                      >
                        <Icon size={20} />
                      </Indicator>
                    ) : (
                      <Icon size={20} />
                    )}
                  </ThemeIcon>
                  <Text size="sm" fw={500}>{PATH_LABELS[path]}</Text>
                </Group>
              </UnstyledButton>
            ))}
          </Stack>
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
