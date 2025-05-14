import { NavLink as RouterNavLink } from 'react-router-dom';
import { Tooltip, UnstyledButton, Stack, rem, useMantineColorScheme, Box, MantineTheme } from '@mantine/core';

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface NavigationMenuProps {
  items: NavigationItem[];
  activePath: string;
}

export function NavigationMenu({ items, activePath }: NavigationMenuProps) {
  const { colorScheme } = useMantineColorScheme();
  
  return (
    <Stack gap={8}>
      {items.map((item) => {
        const isActive = activePath === item.path;
        
        return (
          <Tooltip 
            key={item.label} 
            label={item.description || item.label} 
            position="right" 
            withArrow
          >
            <UnstyledButton
              component={RouterNavLink}
              to={item.path}
              styles={(theme) => ({
                root: {
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  textDecoration: 'none',
                  borderRadius: theme.radius.sm,
                  fontWeight: 500,
                  color: isActive 
                    ? theme.colors.blue[7] 
                    : colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
                  backgroundColor: isActive 
                    ? theme.colors.blue[0]
                    : 'transparent',
                
                  '&:hover': {
                    backgroundColor: isActive 
                      ? theme.colors.blue[0]
                      : colorScheme === 'dark' 
                        ? theme.colors.dark[6] 
                        : theme.colors.gray[0],
                  },
                }
              })}
            >
              {/* Use Box instead of span with styles */}
              <Box 
                component="span"
                mr="sm"
                c={isActive 
                  ? "blue.7" 
                  : colorScheme === 'dark' ? "dark.2" : "gray.6"
                }
              >
                {item.icon}
              </Box>
              {item.label}
            </UnstyledButton>
          </Tooltip>
        );
      })}
    </Stack>
  );
}