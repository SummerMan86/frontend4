import React, { useState } from 'react';
import {
  Card,
  Text,
  Group,
  ThemeIcon,
  ActionIcon,
  UnstyledButton,
  Collapse,
  Divider,
  Stack,
  Box
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconChevronRight
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';

// Типы для KPI карточки
interface KPICardProps {
  title: string;
  value: string;
  target?: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
  detailComponent?: React.ReactNode;
}

// Базовый компонент KPI карточки
export default function KPICard({ 
  title, 
  value, 
  target, 
  trend, 
  icon, 
  color, 
  detailComponent 
}: KPICardProps) {
  const [expanded, setExpanded] = useState(false);
  const isPositive = trend > 0;
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <UnstyledButton onClick={() => setExpanded(!expanded)} style={{ width: '100%' }}>
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed" fw={500}>{title}</Text>
          <Group gap="xs">
            <ThemeIcon color={color} size="lg" radius="md">
              {icon}
            </ThemeIcon>
            {detailComponent && (
              <ActionIcon variant="subtle" size="sm">
                <IconChevronRight 
                  size={16} 
                  style={{ 
                    transform: expanded ? 'rotate(90deg)' : 'none', 
                    transition: 'transform 200ms' 
                  }}
                />
              </ActionIcon>
            )}
          </Group>
        </Group>
        
        <Text size="xl" fw={700} mb="xs">{value}</Text>
        
        {target && (
          <Text size="xs" c="dimmed" mb="xs">
            Цель: {target}
          </Text>
        )}
        
        <Group gap="xs">
          {isPositive ? (
            <IconTrendingUp size={16} color="var(--mantine-color-green-6)" />
          ) : (
            <IconTrendingDown size={16} color="var(--mantine-color-red-6)" />
          )}
          <Text size="xs" c={isPositive ? 'green' : 'red'}>
            {isPositive ? '+' : ''}{trend}%
          </Text>
        </Group>
      </UnstyledButton>
      
      {detailComponent && (
        <Collapse in={expanded}>
          <Divider my="md" />
          {detailComponent}
        </Collapse>
      )}
    </Card>
  );
}
