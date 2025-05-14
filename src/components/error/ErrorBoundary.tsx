/**
 * ErrorBoundary.tsx
 * Generic error boundary component to catch and display React errors
 * Created by SummerMan86 on 2025-05-14
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Text, Container, Title, Button, Paper, Stack, Group } from '@mantine/core';
import { IconRefresh, IconHome } from '@tabler/icons-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Caught error:', error, errorInfo);
    
    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  
  handleRefresh = () => {
    window.location.reload();
  };
  
  handleGoHome = () => {
    window.location.href = '/';
  };
  
  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <Container size="md" py={40}>
          <Paper p="xl" withBorder>
            <Stack gap="md">
              <Title order={2}>Something went wrong</Title>
              <Text>We apologize, but an error occurred in this component.</Text>
              
              <Text c="red" size="sm">
                Error: {this.state.error?.message}
              </Text>
              
              {process.env.NODE_ENV !== 'production' && (
                <Paper p="xs" withBorder bg="gray.0">
                  <Text size="xs" style={{ whiteSpace: 'pre-wrap' }} ff="monospace">
                    {this.state.error?.stack}
                  </Text>
                </Paper>
              )}
              
              <Group>
                <Button 
                  leftSection={<IconRefresh size="1rem" />}
                  onClick={this.handleRefresh}
                >
                  Refresh Page
                </Button>
                <Button 
                  variant="outline" 
                  leftSection={<IconHome size="1rem" />}
                  onClick={this.handleGoHome}
                >
                  Back to Dashboard
                </Button>
                <Button 
                  variant="subtle"
                  onClick={this.handleReset}
                >
                  Try again
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}