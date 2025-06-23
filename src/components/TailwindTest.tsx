import React from 'react';
import { Card, Text, Button, Group, Badge, Alert, Box } from '@mantine/core';
import { useState } from 'react';

export const MantineTest: React.FC = () => {
  const [isTestActive, setIsTestActive] = useState(false);
  const [testStep, setTestStep] = useState(0);

  const testStyles = [
    {
      title: "Анимации и переходы",
      description: "Демонстрация плавных анимаций",
      style: { transform: 'scale(1.1) rotate(3deg)', transition: 'all 0.5s' }
    },
    {
      title: "Градиенты и тени",
      description: "Красивые градиенты и глубокие тени",
      style: { background: 'linear-gradient(135deg, #22d3ee, #3b82f6, #8b5cf6)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }
    },
    {
      title: "Адаптивность",
      description: "Responsive дизайн в действии",
      style: { background: 'linear-gradient(90deg, #4ade80, #3b82f6)', transform: 'skewY(3deg)' }
    },
    {
      title: "Интерактивность",
      description: "Hover эффекты и состояния",
      style: { background: 'linear-gradient(90deg, #ec4899, #eab308)', cursor: 'pointer', border: '4px dashed #a855f7' }
    }
  ];

  const handleTestStyles = () => {
    if (!isTestActive) {
      setIsTestActive(true);
      setTestStep(0);
      
      // Автоматическое переключение между стилями
      const interval = setInterval(() => {
        setTestStep(prev => {
          if (prev >= testStyles.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setIsTestActive(false);
              setTestStep(0);
            }, 2000);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    } else {
      setIsTestActive(false);
      setTestStep(0);
    }
  };

  const currentTest = testStyles[testStep];

  return (
    <Box p="xl" maw={400} mx="auto">
      <Card 
        shadow="lg" 
        style={{
          transition: 'all 0.5s',
          ...(isTestActive ? currentTest?.style : {})
        }}
      >
        <Group justify="space-between" align="center" mb="md">
          <Text size="lg" fw={600} c="gray.8">
            Mantine Components
          </Text>
          <Box 
            w={12} 
            h={12} 
            style={{
              borderRadius: '50%',
              backgroundColor: isTestActive ? '#ef4444' : '#22c55e',
              animation: isTestActive ? 'bounce 1s infinite' : 'pulse 2s infinite'
            }}
          />
        </Group>
        
        {isTestActive && (
          <Alert color="yellow" mb="md">
            <Group justify="space-between">
              <Box>
                <Text size="sm" fw={600} c="yellow.8">
                  {currentTest.title}
                </Text>
                <Text size="xs" c="yellow.6">
                  {currentTest.description}
                </Text>
              </Box>
              <Badge color="yellow" size="sm">
                {testStep + 1}/{testStyles.length}
              </Badge>
            </Group>
          </Alert>
        )}
        
        <Box>
          <Box 
            p="md" 
            style={{
              borderRadius: '8px',
              borderLeft: '4px solid',
              borderLeftColor: isTestActive ? '#8b5cf6' : '#3b82f6',
              background: isTestActive 
                ? 'linear-gradient(90deg, #faf5ff, #fdf2f8)' 
                : 'linear-gradient(90deg, #eff6ff, #eef2ff)',
              transition: 'all 0.3s',
              transform: isTestActive ? 'translateX(8px)' : 'none'
            }}
            mb="md"
          >
            <Text size="sm" fw={500} c={isTestActive ? 'violet.7' : 'blue.7'}>
              {isTestActive ? '🎨 Тестирование стилей...' : '✅ Mantine успешно работает!'}
            </Text>
          </Box>
          
          <Group grow>
            <Box 
              p="sm" 
              ta="center"
              style={{
                borderRadius: '8px',
                background: isTestActive 
                  ? 'linear-gradient(135deg, #bfdbfe, #c4b5fd)' 
                  : '#f3f4f6',
                transition: 'all 0.3s',
                transform: isTestActive ? 'rotate(2deg)' : 'none'
              }}
            >
              <Text size="xs" c="gray.6">Mantine Styles</Text>
            </Box>
            <Box 
              p="sm" 
              ta="center"
              style={{
                borderRadius: '8px',
                background: isTestActive 
                  ? 'linear-gradient(135deg, #bbf7d0, #bfdbfe)' 
                  : '#f3f4f6',
                transition: 'all 0.3s',
                transform: isTestActive ? 'rotate(-2deg)' : 'none'
              }}
            >
              <Text size="xs" c="gray.6">Responsive Design</Text>
            </Box>
          </Group>
        </Box>
        
        <Button 
          fullWidth
          mt="md"
          style={{
            background: isTestActive 
              ? 'linear-gradient(90deg, #ef4444, #f97316)' 
              : 'linear-gradient(90deg, #8b5cf6, #ec4899)',
            transition: 'all 0.3s',
            animation: isTestActive ? 'pulse 1s infinite' : 'none'
          }}
          variant="filled"
          onClick={handleTestStyles}
        >
          {isTestActive ? 'Остановить тест' : 'Протестировать стили'}
        </Button>
      </Card>
    </Box>
  );
};

export default MantineTest;