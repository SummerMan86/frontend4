import React from 'react';
import { Card, UnstyledButton, Group, Text, ThemeIcon } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

export interface DefaultKPICardData {
  id: string;
  title: string;
  value: string;
  target?: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
}

export interface DefaultKPICardProps {
  data: DefaultKPICardData;
  isExpanded: boolean;
  onClick: () => void;
  animationDuration: number;
  animationTimingFunction: string;
}

export const DefaultKPICard: React.FC<DefaultKPICardProps> = ({
  data,
  isExpanded,
  onClick,
  animationDuration,
  animationTimingFunction
}) => {
  const isPositive = data.trend > 0;
  
  const renderTrendIcon = (trend: number) => {
    const TrendIcon = trend > 0 ? '↗' : '↘';
    return (
      <span style={{ 
        color: trend > 0 ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-red-6)',
        fontSize: '14px'
      }}>
        {TrendIcon}
      </span>
    );
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <UnstyledButton onClick={onClick} style={{ width: '100%' }}>
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed" fw={500}>{data.title}</Text>
          <Group gap="xs">
            <ThemeIcon color={data.color} size="lg" radius="md">
              {data.icon}
            </ThemeIcon>
            <IconChevronRight 
              size={16} 
              style={{ 
                transform: isExpanded ? 'rotate(90deg)' : 'none', 
                transition: `transform ${animationDuration}ms ${animationTimingFunction}`,
                color: 'var(--mantine-color-gray-6)'
              }}
            />
          </Group>
        </Group>
        
        <Text size="xl" fw={700} mb="xs">{data.value}</Text>
        
        {data.target && (
          <Text size="xs" c="dimmed" mb="xs">
            Цель: {data.target}
          </Text>
        )}
        
        <Group gap="xs">
          {renderTrendIcon(data.trend)}
          <Text size="xs" c={isPositive ? 'green' : 'red'}>
            {isPositive ? '+' : ''}{data.trend}%
          </Text>
        </Group>
      </UnstyledButton>
    </Card>
  );
};

export default DefaultKPICard;