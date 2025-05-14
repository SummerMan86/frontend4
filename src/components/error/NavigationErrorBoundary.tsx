/**
 * NavigationErrorBoundary.tsx
 * Specialized error boundary for navigation components
 * Created by SummerMan86 on 2025-05-14
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Text, Button, Stack, Group, Paper } from '@mantine/core';
import { IconRefresh, IconMenu2 } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class NavigationErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details to monitoring service
    console.error('Navigation error:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Paper withBorder p="md" m="md">
          <Stack gap="sm">
            <Text fw={700} c="red">Navigation Error</Text>
            <Text size="sm">The navigation menu encountered an error.</Text>
            
            {process.env.NODE_ENV !== 'production' && (
              <Text size="xs" ff="monospace" style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error?.message}
              </Text>
            )}
            
            <Group>
              <Button 
                leftSection={<IconRefresh size="1rem" />}
                size="xs" 
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
              <Button
                leftSection={<IconMenu2 size="1rem" />}
                size="xs"
                variant="outline"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Retry
              </Button>
            </Group>
          </Stack>
        </Paper>
      );
    }

    return this.props.children;
  }
}