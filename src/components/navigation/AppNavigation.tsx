/**
 * AppNavigation.tsx
 * Main navigation sidebar component with error handling
 * Created by SummerMan86 on 2025-05-14
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppShell,
  Group,
  Text,
  Accordion,
  rem,
  NavLink,
  Avatar,
  UnstyledButton,
  Stack,
  Badge,
  Box,
  Drawer,
  ActionIcon,
  ScrollArea,
  Tooltip,
  Alert,
  Paper,
  Button
} from '@mantine/core';
import {
  IconDashboard,
  IconChartPie,
  IconReportAnalytics,
  IconSettings,
  IconShoppingCart,
  IconBuildingStore,
  IconLogout,
  IconCash,
  IconBell,
  IconMessage,
  IconChevronRight,
  IconAlertCircle,
  IconTruck
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useUiStore } from '../../stores/uiStore';
import { NAVIGATION, NOTIFICATION_BADGE, TYPOGRAPHY } from '../../constants/ui';
import { NavigationErrorBoundary } from '../error/NavigationErrorBoundary';

// Define styles as CSS classes using template literals
// In Mantine v8, we use CSS-in-JS directly instead of createStyles
const useStyles = () => {
  return {
    navbar: {
      backgroundColor: 'var(--mantine-color-white)',
      height: '100%',
    },
    header: {
      padding: 'var(--mantine-spacing-md)',
      borderBottom: '1px solid var(--mantine-color-gray-3)',
    },
    footer: {
      padding: 'var(--mantine-spacing-md)',
      borderTop: '1px solid var(--mantine-color-gray-3)',
    },
    user: {
      display: 'block',
      width: '100%',
      padding: 'var(--mantine-spacing-md)',
      borderRadius: 'var(--mantine-radius-sm)',
      color: 'var(--mantine-color-black)',
      '&:hover': {
        backgroundColor: 'var(--mantine-color-gray-0)',
      },
    },
    activeLink: {
      backgroundColor: 'var(--mantine-primary-color-light)',
      color: 'var(--mantine-primary-color)',
    },
    notification: {
      backgroundColor: NOTIFICATION_BADGE.COLORS.default,
      color: 'white',
      width: rem(NOTIFICATION_BADGE.SIZE),
      height: rem(NOTIFICATION_BADGE.SIZE),
      borderRadius: rem(NOTIFICATION_BADGE.SIZE / 2),
      fontSize: rem(NOTIFICATION_BADGE.FONT_SIZE),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
};

// Safe component to handle icon rendering errors
function SafeIcon({ icon, fallback = '•' }: { icon: React.ReactNode, fallback?: string }) {
  if (!icon) return <span>{fallback}</span>;
  
  try {
    return icon;
  } catch (e) {
    console.error('Icon rendering error:', e);
    return <span>{fallback}</span>;
  }
}

// Navigation item structure
interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  badge?: string;
  notifications?: number;
  children?: { id: string; label: string; path: string; badge?: string; notifications?: number }[];
}

// Component props
interface AppNavigationProps {
  collapsed?: boolean;
  debug?: boolean;
}

export function AppNavigation({ collapsed = false, debug = false }: AppNavigationProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(`(max-width: ${NAVIGATION.MOBILE_BREAKPOINT})`);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation structure
  const navItems: NavItem[] = [
    { 
      id: 'dashboard',
      label: 'Dashboard', 
      path: '/', 
      icon: <IconDashboard size="1.2rem" stroke={1.5} />
    },
    {
      id: 'product-analysis',
      label: 'Анализ товаров',
      path: '/product-analysis',
      icon: <IconShoppingCart size="1.2rem" stroke={1.5} />
    },
    {
      id: 'sales',
      label: 'Sales Analysis',
      path: '/sales',
      icon: <IconChartPie size="1.2rem" stroke={1.5} />,
      children: [
        { id: 'by-product', label: 'Sales by Product', path: '/sales/by-product' },
        { id: 'by-region', label: 'Sales by Region', path: '/sales/by-region', notifications: 3 },
        { id: 'trends', label: 'Sales Trends', path: '/sales/trends' },
      ],
    },
    {
      id: 'inventory',
      label: 'Inventory',
      path: '/inventory',
      icon: <IconShoppingCart size="1.2rem" stroke={1.5} />,
      children: [
        { id: 'stock', label: 'Stock Levels', path: '/inventory/stock' },
        { id: 'forecast', label: 'Restock Forecast', path: '/inventory/forecast' },
      ],
    },
    {
      id: 'warehouse-logistics',
      label: 'Склад и логистика',
      path: '/warehouse-logistics',
      icon: <IconTruck size="1.2rem" stroke={1.5} />,
      children: [
        { id: 'warehouse-management', label: 'Управление складом', path: '/warehouse-logistics/management' },
        { id: 'shipping', label: 'Отгрузки', path: '/warehouse-logistics/shipping' },
        { id: 'delivery-tracking', label: 'Отслеживание доставки', path: '/warehouse-logistics/tracking' },
        { id: 'suppliers', label: 'Поставщики', path: '/warehouse-logistics/suppliers' },
      ],
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      path: '/marketplace',
      icon: <IconBuildingStore size="1.2rem" stroke={1.5} />,
      children: [
        { id: 'competitors', label: 'Competitors', path: '/marketplace/competitors' },
        { id: 'share', label: 'Market Share', path: '/marketplace/share' },
      ],
    },
    { 
      id: 'supplier-incomes', 
      label: 'Supplier Incomes', 
      path: '/supplier-incomes',
      icon: <IconCash size="1.2rem" stroke={1.5} />,
      badge: 'New'
    },
    {
      id: 'reports',
      label: 'Отчеты',
      path: '/reports',
      icon: <IconReportAnalytics size="1.2rem" stroke={1.5} />,
      children: [
        { id: 'monthly', label: 'Отчет по поставкам', path: '/reports/monthly' },
        { id: 'annual', label: 'Annual Summary', path: '/reports/annual' },
        { id: 'custom', label: 'Custom Reports', path: '/reports/custom' },
      ],
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      path: '/settings',
      icon: <IconSettings size="1.2rem" stroke={1.5} />
    },
  ];

  // Check if a path is valid for navigation
  function isValidPath(path: string): boolean {
    const validRootPaths = ['/', '/sales', '/inventory', '/marketplace', 
                          '/supplier-incomes', '/reports', '/settings', '/warehouse-logistics'];
    
    return validRootPaths.some(validPath => 
      path === validPath || path.startsWith(`${validPath}/`)
    );
  }

  // Check if a path is active
  function isPathActive(path: string): boolean {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  // Handle navigation with error handling
  function handleNavigation(path: string) {
    try {
      // Debug logging
      if (debug) {
        console.log(`Navigation attempt: ${path}`);
      }
      
      // Validate path
      if (!path || !isValidPath(path)) {
        throw new Error(`Invalid navigation path: ${path}`);
      }
      
      // Navigate and close mobile drawer if needed
      navigate(path);
      if (isMobile) {
        setMobileDrawerOpen(false);
      }
    } catch (err) {
      console.error('Navigation failed:', err);
      setError(`Navigation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setTimeout(() => setError(null), 5000);
    }
  }

  // User section shown at bottom of navigation
  const userSection = (
    <UnstyledButton style={styles.user} data-testid="user-profile-button">
      <Group>
        <Avatar color="blue" radius="xl">SM</Avatar>
        <Box style={{ flex: 1 }}>
          <Text size="sm" fw={TYPOGRAPHY.FONT_WEIGHTS.medium}>SummerMan86</Text>
          <Text c="dimmed" size="xs">Admin</Text>
        </Box>
        <IconLogout size="1.2rem" stroke={1.5} />
      </Group>
    </UnstyledButton>
  );

  // Navigation content changes based on collapsed state
  const navigationContent = (
    <>
      {/* Header/Title */}
      {!collapsed && (
        <Box p="md" pb={0}>
          <Text fw={TYPOGRAPHY.FONT_WEIGHTS.bold} size="lg">Sales Dashboard</Text>
        </Box>
      )}
      
      {/* Navigation Links */}
      <ScrollArea style={{ flex: 1 }} p="xs">
        {/* Error state */}
        {error && (
          <Alert 
            icon={<IconAlertCircle size="1rem" />}
            title="Navigation Error"
            color="red"
            withCloseButton
            onClose={() => setError(null)}
            mb="md"
          >
            {error}
          </Alert>
        )}
        
        {/* Debug panel for development */}
        {debug && process.env.NODE_ENV === 'development' && (
          <Paper withBorder p="xs" mb="md" style={{ fontSize: '10px' }}>
            <Text size="xs">Current path: {location.pathname}</Text>
            <Text size="xs">Mobile view: {String(isMobile)}</Text>
            <Text size="xs">Collapsed: {String(collapsed)}</Text>
            <Button 
              size="xs" 
              onClick={() => console.log('UI Store:', useUiStore.getState())}
            >
              Log State
            </Button>
          </Paper>
        )}
        
        {collapsed ? (
          // Collapsed view - icons only
          <Stack align="center" gap={NAVIGATION.ITEM_SPACING + 'px'}>
            {navItems.map((item) => (
              <Tooltip key={item.id} label={item.label} position="right">
                <ActionIcon 
                  size="xl" 
                  color={isPathActive(item.path) ? "blue" : "gray"}
                  onClick={() => handleNavigation(item.path)}
                  data-testid={`nav-item-${item.id}`}
                >
                  <SafeIcon icon={item.icon} />
                  {item.notifications && (
                    <Box 
                      style={{
                        ...styles.notification,
                        position: 'absolute', 
                        top: '3px', 
                        right: '3px'
                      }}
                    >
                      {item.notifications}
                    </Box>
                  )}
                </ActionIcon>
              </Tooltip>
            ))}
          </Stack>
        ) : (
          // Expanded view - full navigation
          <Accordion 
            value={activeAccordion} 
            onChange={setActiveAccordion}
          >
            {navItems.map((item) => {
              // Items with children use accordion
              if (item.children && item.children.length > 0) {
                const isActive = isPathActive(item.path) || 
                              item.children.some(child => isPathActive(child.path));
                
                return (
                  <Accordion.Item key={item.id} value={item.id} data-testid={`nav-group-${item.id}`}>
                    <Accordion.Control
                      icon={<SafeIcon icon={item.icon} />}
                      style={isActive ? styles.activeLink : undefined}
                    >
                      <Group justify="space-between">
                        <Text>{item.label}</Text>
                        {item.notifications && (
                          <Box style={styles.notification}>
                            {item.notifications}
                          </Box>
                        )}
                        {item.badge && (
                          <Badge size="sm" variant="filled" color="blue">
                            {item.badge}
                          </Badge>
                        )}
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <NavigationErrorBoundary>
                        <Stack gap={0}>
                          {item.children.map((child) => (
                            <NavLink
                              key={child.id}
                              label={child.label}
                              active={isPathActive(child.path)}
                              onClick={() => handleNavigation(child.path)}
                              data-testid={`nav-item-${item.id}-${child.id}`}
                              rightSection={
                                <>
                                  {child.notifications && (
                                    <Box style={styles.notification}>
                                      {child.notifications}
                                    </Box>
                                  )}
                                  {child.badge && (
                                    <Badge size="sm" variant="filled" color="blue">
                                      {child.badge}
                                    </Badge>
                                  )}
                                </>
                              }
                            />
                          ))}
                        </Stack>
                      </NavigationErrorBoundary>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              }
              
              // Simple items without children
              return (
                <NavLink
                  key={item.id}
                  leftSection={<SafeIcon icon={item.icon} />}
                  label={item.label}
                  active={isPathActive(item.path)}
                  onClick={() => handleNavigation(item.path)}
                  data-testid={`nav-item-${item.id}`}
                  style={isPathActive(item.path) ? styles.activeLink : undefined}
                  rightSection={
                    <>
                      {item.notifications && (
                        <Box style={styles.notification}>
                          {item.notifications}
                        </Box>
                      )}
                      {item.badge && (
                        <Badge size="sm" variant="filled" color="blue">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  }
                />
              );
            })}
          </Accordion>
        )}
      </ScrollArea>
      
      {/* Footer */}
      {!collapsed && (
        <Box style={styles.footer}>
          {userSection}
          
          <Group justify="space-between" mt="md">
            <ActionIcon variant="default" size="lg" aria-label="Messages">
              <IconMessage size="1.1rem" stroke={1.5} />
            </ActionIcon>
            <ActionIcon variant="default" size="lg" aria-label="Notifications">
              <IconBell size="1.1rem" stroke={1.5} />
            </ActionIcon>
            <ActionIcon variant="default" size="lg" aria-label="Settings">
              <IconSettings size="1.1rem" stroke={1.5} />
            </ActionIcon>
            <ActionIcon variant="default" size="lg" aria-label="Logout">
              <IconLogout size="1.1rem" stroke={1.5} />
            </ActionIcon>
          </Group>
        </Box>
      )}
    </>
  );

  // Mobile drawer for small screens
  if (isMobile) {
    return (
      <NavigationErrorBoundary
        onError={(error) => {
          console.error('Navigation error caught by boundary:', error);
          useUiStore.getState().setError(`Navigation error: ${error.message}`);
        }}
      >
        <Drawer
          opened={mobileDrawerOpen}
          onClose={() => {
            try {
              setMobileDrawerOpen(false);
            } catch (err) {
              console.error('Failed to close drawer:', err);
              // Force reload as a last resort
              window.location.reload();
            }
          }}
          size={NAVIGATION.MOBILE_DRAWER_WIDTH}
          title="Navigation"
          data-testid="mobile-navigation"
          withCloseButton
        >
          <Box style={{ display: 'flex', flexDirection: 'column', height: `calc(100vh - ${NAVIGATION.HEADER_HEIGHT}px)` }}>
            {navigationContent}
          </Box>
        </Drawer>
      </NavigationErrorBoundary>
    );
  }

  // Desktop sidebar - Use Box instead of Navbar
  return (
    <NavigationErrorBoundary
      onError={(error) => {
        console.error('Navigation error caught by boundary:', error);
        useUiStore.getState().setError(`Navigation error: ${error.message}`);
      }}
    >
      <Box
        style={{
          width: collapsed ? NAVIGATION.COLLAPSED_WIDTH : NAVIGATION.EXPANDED_WIDTH,
          borderRight: '1px solid #e9ecef',
          ...styles.navbar
        }}
        data-testid="desktop-navigation"
      >
        <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {navigationContent}
        </Box>
      </Box>
    </NavigationErrorBoundary>
  );
}