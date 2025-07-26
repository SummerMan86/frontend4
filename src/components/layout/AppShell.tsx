import React, { useState } from 'react';
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
  Collapse,
  Accordion,
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
  IconCalculator,
  IconChartDots,
  IconAd,
  IconChevronDown,
  IconChevronRight,
  IconChartPie,
  IconMenu2,
  IconX,
} from '@tabler/icons-react';
import { Outlet, Link, useLocation } from 'react-router-dom';

/* Маршруты → подписи */
const PATH_LABELS = {
  '/': 'Главная',
  '/dashboard': 'Дашборд',
  '/product-analysis': 'Анализ товаров',
  '/sales': 'Продажи',
  '/sales-dashboard': 'Анализ продаж',
  '/sales-funnel': 'Воронка продаж',
  '/advertising-analysis': 'Анализ рекламы',
  '/inventory': 'Инвентарь',
  '/warehouse-logistics': 'ABC анализ остатков',
  '/warehouse-logistics-ext': 'Остатки и ПВЗ',
  '/supply-management': 'Управление поставками',
  '/deliveries': 'Поставки',
  '/marketplace': 'Продажи',
  '/supplier-incomes': 'Доходы поставщика',
  '/reports': 'Доходы',
  '/financial-analysis': 'Финансовый анализ',
  '/sales-analysis': 'Анализ продаж',
  '/unit-economics': 'Юнит-экономика',
  '/operational-control': 'Оперативный контроль',
  '/kpi-demo': 'Демо KPI',
  '/complex-kpi-demo': 'ComplexKPI Демо',
  '/supply-graph-test': 'Карта поставок',
  '/settings': 'Настройки',
} as const;
type PathKey = keyof typeof PATH_LABELS;

/* Иерархическая структура навигации */
interface NavItem {
  id: string;
  label: string;
  path?: PathKey;
  icon: React.FC<any>;
  showIndicator?: boolean;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Главная', path: '/', icon: IconHome },
  { id: 'dashboard', label: 'Дашборд', path: '/dashboard', icon: IconChartBar },
  {
    id: 'sales',
    label: 'Продажи',
    icon: IconChartPie,
    children: [
      { id: 'sales-funnel', label: 'Воронка продаж', path: '/sales-funnel', icon: IconChartDots },
      { id: 'sales-dashboard', label: 'Анализ продаж', path: '/sales-dashboard', icon: IconChartBar },
      { id: 'sales-analysis', label: 'Детальный анализ', path: '/sales-analysis', icon: IconReportAnalytics },
      { id: 'advertising-analysis', label: 'Анализ рекламы', path: '/advertising-analysis', icon: IconAd },
      { id: 'unit-economics', label: 'Юнит-экономика', path: '/unit-economics', icon: IconCalculator },
    ]
  },
  { id: 'product-analysis', label: 'Анализ товаров', path: '/product-analysis', icon: IconShoppingCart },
  { id: 'inventory', label: 'Инвентарь', path: '/inventory', icon: IconDatabase },
  {
    id: 'warehouse',
    label: 'Склад и логистика',
    icon: IconBuildingWarehouse,
    children: [
      { id: 'warehouse-logistics', label: 'ABC анализ остатков', path: '/warehouse-logistics', icon: IconBuildingWarehouse },
      { id: 'warehouse-logistics-ext', label: 'Остатки и ПВЗ', path: '/warehouse-logistics-ext', icon: IconBuildingWarehouse },
      { id: 'supply-management', label: 'Управление поставками', path: '/supply-management', icon: IconTruck },
      { id: 'deliveries', label: 'Поставки', path: '/deliveries', icon: IconTruck },
    ]
  },
  { id: 'financial-analysis', label: 'Финансовый анализ', path: '/financial-analysis', icon: IconReportAnalytics },
  { id: 'operational-control', label: 'Оперативный контроль', path: '/operational-control', icon: IconActivity, showIndicator: true },
  { id: 'kpi-demo', label: 'Демо KPI', path: '/kpi-demo', icon: IconTarget },
  { id: 'complex-kpi-demo', label: 'ComplexKPI Демо', path: '/complex-kpi-demo', icon: IconChartDots },
  { id: 'supply-graph-test', label: 'Карта поставок', path: '/supply-graph-test', icon: IconTruck, showIndicator: true },
];

export default function MyAppShell() {
  const { pathname } = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['sales']); // По умолчанию группа "Продажи" раскрыта
  const [navbarOpened, setNavbarOpened] = useState(false);
  
  const active = (p: string) => pathname === p;
  
  const toggleNavbar = () => setNavbarOpened(!navbarOpened);
  const closeNavbar = () => setNavbarOpened(false);
  
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };
  
  const isGroupExpanded = (groupId: string) => expandedGroups.includes(groupId);
  
  const isGroupActive = (item: NavItem): boolean => {
    if (item.path && active(item.path)) return true;
    if (item.children) {
      return item.children.some(child => child.path && active(child.path));
    }
    return false;
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !navbarOpened },
      }}
      padding="md"
    >
      {/* HEADER */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <UnstyledButton
              onClick={toggleNavbar}
              hiddenFrom="sm"
              style={{
                padding: '8px',
                borderRadius: '6px',
                color: '#000',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {navbarOpened ? <IconX size={20} /> : <IconMenu2 size={20} />}
            </UnstyledButton>
            
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
            {NAV_ITEMS.map((item) => {
              if (item.children) {
                // Группа с подпунктами
                const isExpanded = isGroupExpanded(item.id);
                const isActive = isGroupActive(item);
                
                return (
                  <Box key={item.id}>
                    <UnstyledButton
                      onClick={() => toggleGroup(item.id)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        color: '#000',
                        backgroundColor: isActive ? '#f3f0ff' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <Group justify="space-between">
                        <Group>
                          <ThemeIcon 
                            variant={isActive ? 'filled' : 'light'} 
                            color="violet"
                          >
                            <item.icon size={20} />
                          </ThemeIcon>
                          <Text size="sm" fw={500}>{item.label}</Text>
                        </Group>
                        {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                      </Group>
                    </UnstyledButton>
                    
                    <Collapse in={isExpanded}>
                      <Stack gap={2} ml={40} mt={5}>
                        {item.children.map((child) => (
                          <UnstyledButton
                             key={child.id}
                             component={Link}
                             to={child.path!}
                             onClick={closeNavbar}
                             style={{
                               display: 'block',
                               width: '100%',
                               padding: '8px 12px',
                               borderRadius: '6px',
                               color: '#000',
                               backgroundColor: active(child.path!) ? '#e7f5ff' : 'transparent',
                               border: 'none',
                               cursor: 'pointer',
                               textDecoration: 'none'
                             }}
                             onMouseEnter={(e) => {
                               if (!active(child.path!)) {
                                 e.currentTarget.style.backgroundColor = '#f8f9fa';
                               }
                             }}
                             onMouseLeave={(e) => {
                               if (!active(child.path!)) {
                                 e.currentTarget.style.backgroundColor = 'transparent';
                               }
                             }}
                           >
                            <Group>
                              <ThemeIcon 
                                size="sm"
                                variant={active(child.path!) ? 'filled' : 'light'} 
                                color="violet"
                              >
                                {child.showIndicator ? (
                                  <Indicator
                                    size={6}
                                    color="red"
                                    processing
                                    position="top-end"
                                    offset={2}
                                  >
                                    <child.icon size={16} />
                                  </Indicator>
                                ) : (
                                  <child.icon size={16} />
                                )}
                              </ThemeIcon>
                              <Text size="sm" fw={400}>{child.label}</Text>
                            </Group>
                          </UnstyledButton>
                        ))}
                      </Stack>
                    </Collapse>
                  </Box>
                );
              } else {
                // Обычный пункт меню
                return (
                  <UnstyledButton
                     key={item.id}
                     component={Link}
                     to={item.path!}
                     onClick={closeNavbar}
                     style={{
                       display: 'block',
                       width: '100%',
                       padding: '12px',
                       borderRadius: '8px',
                       color: '#000',
                       backgroundColor: active(item.path!) ? '#f3f0ff' : 'transparent',
                       border: 'none',
                       cursor: 'pointer',
                       textDecoration: 'none'
                     }}
                     onMouseEnter={(e) => {
                       if (!active(item.path!)) {
                         e.currentTarget.style.backgroundColor = '#f8f9fa';
                       }
                     }}
                     onMouseLeave={(e) => {
                       if (!active(item.path!)) {
                         e.currentTarget.style.backgroundColor = 'transparent';
                       }
                     }}
                   >
                    <Group>
                      <ThemeIcon 
                        variant={active(item.path!) ? 'filled' : 'light'} 
                        color="violet"
                      >
                        {item.showIndicator ? (
                          <Indicator
                            size={8}
                            color="red"
                            processing
                            position="top-end"
                            offset={4}
                          >
                            <item.icon size={20} />
                          </Indicator>
                        ) : (
                          <item.icon size={20} />
                        )}
                      </ThemeIcon>
                      <Text size="sm" fw={500}>{item.label}</Text>
                    </Group>
                  </UnstyledButton>
                );
              }
            })}
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
