/**
 * AppShell.tsx
 * Main application layout with header and navigation
 * Created by SummerMan86 on 2025-05-14
 */

import { useState, useEffect } from 'react';
import { 
  AppShell as MantineAppShell, 
  Burger, 
  Header, 
  Text, 
  useMantineTheme, 
  Group,
  ActionIcon,
  Title,
  Box,
  useMantineColorScheme
} from '@mantine/core';
import { Outlet, useLocation } from 'react-router-dom';
import { AppNavigation } from '../navigation/AppNavigation';
import { useUiStore } from '../../stores/uiStore';
import { IconMoon, IconSun, IconUser } from '@tabler/icons-react';
import { ErrorBoundary } from '../error/ErrorBoundary';
import { NAVIGATION } from '../../constants/ui';

export function AppShell() {
  const theme = useMantineTheme();
  const location = useLocation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { navbarCollapsed, toggleNavbar, setNavbarCollapsed, hasError, error } = useUiStore();
  const [pageTitle, setPageTitle] = useState('Dashboard');
  
  // Update page title based on current route
  useEffect(() => {
    const routeTitles = {
      '/': 'Dashboard',
      '/sales': 'Sales Analysis',
      '/inventory': 'Inventory Management',
      '/marketplace': 'Marketplace Analytics',
      '/supplier-incomes': 'Supplier Incomes',
      '/reports': 'Reports',
      '/settings': 'Settings',
    };
    
    const matchingRoute = Object.keys(routeTitles).find(route => 
      location.pathname === route || 
      (route !== '/' && location.pathname.startsWith(route))
    );
    
    if (matchingRoute) {
      setPageTitle(routeTitles[matchingRoute]);
      document.title = `${routeTitles[matchingRoute]} | Sales Dashboard`;
    } else {
      setPageTitle('Dashboard');
      document.title = 'Sales Dashboard';
    }
  }, [location.pathname]);
  
  // Handle responsive navbar
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < parseInt(NAVIGATION.MOBILE_BREAKPOINT);
      if (isMobile && !navbarCollapsed) {
        setNavbarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [navbarCollapsed, setNavbarCollapsed]);
  
  return (
    <MantineAppShell
      styles={{
        main: {
          background: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      header={{ height: NAVIGATION.HEADER_HEIGHT }}
      navbar={{ 
        width: navbarCollapsed ? NAVIGATION.COLLAPSED_WIDTH : NAVIGATION.EXPANDED_WIDTH, 
        breakpoint: 'sm' 
      }}
    >
      <MantineAppShell.Navbar>
        <ErrorBoundary
          fallback={
            <Box p="md">
              <Text c="red">Navigation error. Please refresh the page.</Text>
            </Box>
          }
        >
          <AppNavigation 
            collapsed={navbarCollapsed} 
            debug={false}//{process.env.NODE_ENV === 'development'}
          />
        </ErrorBoundary>
      </MantineAppShell.Navbar>
      
      <MantineAppShell.Header>
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '0 1rem' }}>
          <Group align="center">
            <Burger
              opened={!navbarCollapsed}
              onClick={toggleNavbar}
              size="sm"
              hiddenFrom="sm"
              aria-label="Toggle navigation"
              data-testid="nav-burger"
            />
            <Title order={3}>{pageTitle}</Title>
            
            {/* Show error notification if there's an error */}
            {hasError && error && (
              <Text c="red" size="sm" ml="md">
                {error}
              </Text>
            )}
          </Group>
          
          <Group>
            <Text size="sm" data-testid="current-date">
              {new Date().toLocaleDateString()}
            </Text>
            
            <ActionIcon
              variant="default"
              onClick={() => toggleColorScheme()}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              data-testid="theme-toggle"
            >
              {isDark ? <IconSun size="1.1rem" /> : <IconMoon size="1.1rem" />}
            </ActionIcon>
            
            <ActionIcon
              variant="default"
              title="User profile"
              data-testid="user-button"
            >
              <IconUser size="1.1rem" />
            </ActionIcon>
          </Group>
        </Box>
      </MantineAppShell.Header>
      
      <MantineAppShell.Main>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}