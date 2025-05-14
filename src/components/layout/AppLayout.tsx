import { useState, useEffect } from 'react';
import { 
  AppShell, 
  useMantineTheme,
  Burger,
  Group,
  Text,
  Title,
  ActionIcon,
  Tooltip,
  rem,
  Box,
  useMantineColorScheme   // Use this hook instead
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  IconDashboard, 
  IconMoneybag, 
  IconChartBar, 
  IconSettings,
  IconSun,
  IconMoon
} from '@tabler/icons-react';
import { NavigationMenu } from './NavigationMenu';

export default function AppLayout() {
  const theme = useMantineTheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme(); // Get from hook
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [opened, setOpened] = useState(!isMobile);
  const location = useLocation();

  // Adjust navbar opened state based on screen size
  useEffect(() => {
    setOpened(!isMobile);
  }, [isMobile]);

  const navItems = [
    { 
      label: 'Dashboard', 
      path: '/', 
      icon: <IconDashboard size={18} stroke={1.5} />,
      description: 'Main dashboard overview'
    },
    { 
      label: 'Supplier Incomes', 
      path: '/supplier-incomes', 
      icon: <IconMoneybag size={18} stroke={1.5} />,
      description: 'Supplier income tables and charts'
    },
    { 
      label: 'Sales Analysis', 
      path: '/sales-analysis', 
      icon: <IconChartBar size={18} stroke={1.5} />,
      description: 'Sales performance metrics'
    },
    { 
      label: 'Settings', 
      path: '/settings', 
      icon: <IconSettings size={18} stroke={1.5} />,
      description: 'Application configuration'
    }
  ];

  const currentPath = location.pathname;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { desktop: !opened, mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
            />
            <Title order={3} size="h4" visibleFrom="xs">Sales Dashboard</Title>
          </Group>
          
          <Group>
            <Text size="sm" c="dimmed">{new Date().toLocaleDateString()}</Text>
            
            <Tooltip label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}>
              <ActionIcon 
                variant="default" 
                onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')} 
                size={30}
              >
                {colorScheme === 'dark' ? (
                  <IconSun size={16} />
                ) : (
                  <IconMoon size={16} />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>
      
      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          <NavigationMenu 
            items={navItems} 
            activePath={currentPath} 
          />
        </AppShell.Section>
        
        <AppShell.Section>
          <Box 
            p="xs" 
            style={{
              borderTop: `${rem(1)} solid ${
                colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
              }`
            }}
          >
            <Text size="xs" c="dimmed" ta="center">
              © 2025 Sales Dashboard
            </Text>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>
      
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}