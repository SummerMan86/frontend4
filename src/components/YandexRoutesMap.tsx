import React, { useRef, useEffect, useState } from 'react';
import { Paper, Text, Group, ThemeIcon, ActionIcon, Badge, Loader, Stack } from '@mantine/core';
import { IconRoute, IconRefresh, IconTruck, IconMapPin } from '@tabler/icons-react';

// Типы для Yandex Maps API
declare global {
  interface Window {
    ymaps: any;
  }
}

// Расширяем HTMLScriptElement для поддержки onload
interface HTMLScriptElementWithOnload extends HTMLScriptElement {
  onload: (() => void) | null;
}

/**
 * Компонент интерактивной карты маршрутов доставки с использованием Yandex Maps API
 * 
 * ВАЖНО: Для продакшена необходимо:
 * 1. Получить API ключ на https://developer.tech.yandex.ru/
 * 2. Добавить ключ в переменную окружения VITE_YANDEX_MAPS_API_KEY
 * 3. Заменить строку загрузки API на: 
 *    `https://api-maps.yandex.ru/2.1/?apikey=${import.meta.env.VITE_YANDEX_MAPS_API_KEY}&lang=ru_RU`
 */

// Типы для данных маршрутов
interface RouteData {
  id: string;
  name: string;
  driver: string;
  vehicle: string;
  status: 'active' | 'completed' | 'delayed' | 'pending';
  startPoint: {
    name: string;
    coordinates: [number, number]; // [latitude, longitude]
  };
  endPoint: {
    name: string;
    coordinates: [number, number];
  };
  waypoints?: {
    name: string;
    coordinates: [number, number];
    completed: boolean;
  }[];
  distance: number; // в км
  estimatedTime: number; // в минутах
  deliveryTime?: string;
}

// Тестовые данные маршрутов
const routesData: RouteData[] = [
  {
    id: 'route-001',
    name: 'Маршрут Москва - СПб',
    driver: 'Иванов И.И.',
    vehicle: 'ГАЗель Next А123БВ',
    status: 'active',
    startPoint: {
      name: 'Склад Москва Центр',
      coordinates: [55.7558, 37.6176]
    },
    endPoint: {
      name: 'Склад СПб Север',
      coordinates: [59.9311, 30.3609]
    },
    waypoints: [
      {
        name: 'Пункт выдачи Тверь',
        coordinates: [56.8587, 35.9176],
        completed: true
      },
      {
        name: 'Пункт выдачи Великий Новгород',
        coordinates: [58.5287, 31.2759],
        completed: false
      }
    ],
    distance: 635,
    estimatedTime: 480,
    deliveryTime: '14:30'
  },
  {
    id: 'route-002',
    name: 'Маршрут Москва - Казань',
    driver: 'Петров П.П.',
    vehicle: 'Mercedes Sprinter В456ГД',
    status: 'completed',
    startPoint: {
      name: 'Склад Москва Центр',
      coordinates: [55.7558, 37.6176]
    },
    endPoint: {
      name: 'Склад Казань',
      coordinates: [55.8304, 49.0661]
    },
    waypoints: [
      {
        name: 'Пункт выдачи Владимир',
        coordinates: [56.1366, 40.3966],
        completed: true
      },
      {
        name: 'Пункт выдачи Нижний Новгород',
        coordinates: [56.2965, 43.9361],
        completed: true
      }
    ],
    distance: 815,
    estimatedTime: 600,
    deliveryTime: '16:45'
  },
  {
    id: 'route-003',
    name: 'Маршрут СПб - Новосибирск',
    driver: 'Сидоров С.С.',
    vehicle: 'Volvo FH Е789ЖЗ',
    status: 'delayed',
    startPoint: {
      name: 'Склад СПб Север',
      coordinates: [59.9311, 30.3609]
    },
    endPoint: {
      name: 'Склад Новосибирск',
      coordinates: [55.0084, 82.9357]
    },
    waypoints: [
      {
        name: 'Пункт выдачи Екатеринбург',
        coordinates: [56.8431, 60.6454],
        completed: true
      },
      {
        name: 'Пункт выдачи Тюмень',
        coordinates: [57.1522, 65.5272],
        completed: false
      }
    ],
    distance: 2765,
    estimatedTime: 1980,
    deliveryTime: '10:15'
  },
  {
    id: 'route-004',
    name: 'Маршрут Москва - Краснодар',
    driver: 'Козлов К.К.',
    vehicle: 'МАЗ И012КЛ',
    status: 'pending',
    startPoint: {
      name: 'Склад Москва Центр',
      coordinates: [55.7558, 37.6176]
    },
    endPoint: {
      name: 'Склад Краснодар',
      coordinates: [45.0355, 38.9753]
    },
    waypoints: [
      {
        name: 'Пункт выдачи Воронеж',
        coordinates: [51.6720, 39.1843],
        completed: false
      },
      {
        name: 'Пункт выдачи Ростов-на-Дону',
        coordinates: [47.2357, 39.7015],
        completed: false
      }
    ],
    distance: 1235,
    estimatedTime: 900,
    deliveryTime: '09:00'
  }
];

// Цвета для разных статусов маршрутов
const statusColors = {
  active: '#51cf66',
  completed: '#339af0',
  delayed: '#e03131',
  pending: '#fab005'
};

// Иконки для разных типов точек
const getPointIcon = (type: 'start' | 'end' | 'waypoint', completed?: boolean) => {
  if (type === 'start') return { preset: 'islands#greenCircleIcon', iconColor: '#51cf66' };
  if (type === 'end') return { preset: 'islands#redCircleIcon', iconColor: '#e03131' };
  if (type === 'waypoint') {
    return completed 
      ? { preset: 'islands#blueCircleIcon', iconColor: '#339af0' }
      : { preset: 'islands#yellowCircleIcon', iconColor: '#fab005' };
  }
  return { preset: 'islands#grayCircleIcon', iconColor: '#868e96' };
};

interface YandexRoutesMapProps {
  routes?: RouteData[];
  onRouteClick?: (route: RouteData) => void;
  height?: number;
}

const YandexRoutesMap: React.FC<YandexRoutesMapProps> = ({ 
  routes = routesData, 
  onRouteClick,
  height = 400
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Загружаем Яндекс карты API
    const loadYandexMaps = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      // Проверяем, не загружается ли уже скрипт
      const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]') as HTMLScriptElementWithOnload;
      if (existingScript) {
        existingScript.onload = () => {
          if (window.ymaps) {
            window.ymaps.ready(initMap);
          }
        };
        return;
      }

      const script = document.createElement('script') as HTMLScriptElementWithOnload;
      // Получаем API ключ из переменных окружения (опционально)
      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
      const scriptSrc = apiKey 
        ? `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`
        : 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      
      script.src = scriptSrc;
      script.onload = () => {
        if (window.ymaps) {
          window.ymaps.ready(initMap);
        }
      };
      script.onerror = () => {
        setIsLoading(false);
        setError('Ошибка загрузки Яндекс.Карт');
        console.error('Ошибка загрузки Яндекс.Карт');
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      try {
        if (!mapRef.current || !window.ymaps) {
          console.warn('Map container or ymaps not ready');
          return;
        }

        const map = new window.ymaps.Map(mapRef.current, {
          center: [55.76, 37.64], // Центр России (Москва)
          zoom: 5,
          controls: ['zoomControl', 'fullscreenControl', 'routeButtonControl']
        });

        // Добавляем маршруты на карту
        routes.forEach(route => {
          // Добавляем точку старта
          const startPlacemark = new window.ymaps.Placemark(
            route.startPoint.coordinates,
            {
              balloonContentHeader: `Старт: ${route.name}`,
              balloonContentBody: `
                <div style="padding: 10px;">
                  <p><strong>Водитель:</strong> ${route.driver}</p>
                  <p><strong>Транспорт:</strong> ${route.vehicle}</p>
                  <p><strong>Расстояние:</strong> ${route.distance} км</p>
                  <p><strong>Время в пути:</strong> ${Math.floor(route.estimatedTime / 60)}ч ${route.estimatedTime % 60}м</p>
                  ${route.deliveryTime ? `<p><strong>Время доставки:</strong> ${route.deliveryTime}</p>` : ''}
                </div>
              `,
              hintContent: `${route.startPoint.name} - Старт маршрута`
            },
            getPointIcon('start')
          );

          // Добавляем точку финиша
          const endPlacemark = new window.ymaps.Placemark(
            route.endPoint.coordinates,
            {
              balloonContentHeader: `Финиш: ${route.name}`,
              balloonContentBody: `
                <div style="padding: 10px;">
                  <p><strong>Пункт назначения:</strong> ${route.endPoint.name}</p>
                  <p><strong>Статус:</strong> ${getStatusText(route.status)}</p>
                </div>
              `,
              hintContent: `${route.endPoint.name} - Финиш маршрута`
            },
            getPointIcon('end')
          );

          // Добавляем промежуточные точки
          route.waypoints?.forEach((waypoint, index) => {
            const waypointPlacemark = new window.ymaps.Placemark(
              waypoint.coordinates,
              {
                balloonContentHeader: `Промежуточная точка ${index + 1}`,
                balloonContentBody: `
                  <div style="padding: 10px;">
                    <p><strong>Название:</strong> ${waypoint.name}</p>
                    <p><strong>Статус:</strong> ${waypoint.completed ? 'Завершено' : 'В ожидании'}</p>
                  </div>
                `,
                hintContent: waypoint.name
              },
              getPointIcon('waypoint', waypoint.completed)
            );

            waypointPlacemark.events.add('click', () => {
              setSelectedRoute(route);
              onRouteClick?.(route);
            });

            map.geoObjects.add(waypointPlacemark);
          });

          // Добавляем обработчики кликов
          [startPlacemark, endPlacemark].forEach(placemark => {
            placemark.events.add('click', () => {
              setSelectedRoute(route);
              onRouteClick?.(route);
            });
            map.geoObjects.add(placemark);
          });

          // Создаем маршрут между точками
          const routePoints = [
            route.startPoint.coordinates,
            ...(route.waypoints?.map(wp => wp.coordinates) || []),
            route.endPoint.coordinates
          ];

          const multiRoute = new window.ymaps.multiRouter.MultiRoute({
            referencePoints: routePoints,
            params: {
              routingMode: 'auto'
            }
          }, {
            boundsAutoApply: false,
            routeActiveStrokeWidth: 4,
            routeActiveStrokeColor: statusColors[route.status],
            routeStrokeWidth: 3,
            routeStrokeColor: statusColors[route.status],
            opacity: 0.7
          });

          map.geoObjects.add(multiRoute);
        });

        setMapLoaded(true);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Ошибка инициализации карты:', err);
        setError('Ошибка инициализации карты');
        setIsLoading(false);
      }
    };

    // Небольшая задержка для гарантии готовности DOM
    const timer = setTimeout(() => {
      loadYandexMaps();
    }, 100);

    return () => clearTimeout(timer);
  }, [routes, onRouteClick]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'В пути';
      case 'completed': return 'Завершен';
      case 'delayed': return 'Задержка';
      case 'pending': return 'Ожидание';
      default: return 'Неизвестно';
    }
  };

  const refreshMap = () => {
    setIsLoading(true);
    setError(null);
    setSelectedRoute(null);
    // Перезагружаем карту
    window.location.reload();
  };

  return (
    <Paper p="md" withBorder>
      <Group justify="space-between" mb="md">
        <Group>
          <ThemeIcon size={32} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
            <IconRoute size={18} />
          </ThemeIcon>
          <div>
            <Text fw={600}>Карта маршрутов доставки</Text>
            <Text size="sm" c="dimmed">Интерактивная карта с маршрутами и статусами доставки</Text>
          </div>
        </Group>
        <Group>
          <Badge variant="light" color="blue">
            {routes.length} маршрутов
          </Badge>
          <ActionIcon variant="light" size="sm" onClick={refreshMap}>
            <IconRefresh size={16} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Яндекс карта */}
      <div style={{ position: 'relative' }}>
        <div 
          ref={mapRef}
          style={{ 
            height, 
            width: '100%', 
            borderRadius: '8px',
            background: '#f5f5f5'
          }}
        />
        
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <Loader size="md" />
            <Text size="sm" c="dimmed">Загрузка карты маршрутов...</Text>
          </div>
        )}

        {error && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <Text size="sm" c="red">{error}</Text>
            <ActionIcon variant="light" onClick={refreshMap}>
              <IconRefresh size={16} />
            </ActionIcon>
          </div>
        )}
      </div>

      {/* Легенда карты */}
      <Group mt="md" gap="xs">
        <Group gap={4}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: statusColors.active }}></div>
          <Text size="xs">В пути</Text>
        </Group>
        <Group gap={4}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: statusColors.completed }}></div>
          <Text size="xs">Завершен</Text>
        </Group>
        <Group gap={4}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: statusColors.delayed }}></div>
          <Text size="xs">Задержка</Text>
        </Group>
        <Group gap={4}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: statusColors.pending }}></div>
          <Text size="xs">Ожидание</Text>
        </Group>
      </Group>

      {/* Информация о выбранном маршруте */}
      {selectedRoute && (
        <Paper p="sm" mt="md" withBorder style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
          <Group>
            <ThemeIcon size={24} radius="md" color={selectedRoute.status === 'active' ? 'green' : selectedRoute.status === 'delayed' ? 'red' : 'blue'}>
              <IconTruck size={14} />
            </ThemeIcon>
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={600}>{selectedRoute.name}</Text>
              <Text size="xs" c="dimmed">{selectedRoute.driver} • {selectedRoute.distance} км</Text>
            </div>
            <Badge 
              size="sm" 
              color={selectedRoute.status === 'active' ? 'green' : selectedRoute.status === 'delayed' ? 'red' : selectedRoute.status === 'completed' ? 'blue' : 'orange'}
            >
              {getStatusText(selectedRoute.status)}
            </Badge>
          </Group>
        </Paper>
      )}

      {/* Статистика по маршрутам */}
      <Group mt="md" grow>
        <Paper p="xs" withBorder style={{ textAlign: 'center' }}>
          <Text size="lg" fw={700} c="green">
            {routes.filter(r => r.status === 'active').length}
          </Text>
          <Text size="xs" c="dimmed">В пути</Text>
        </Paper>
        <Paper p="xs" withBorder style={{ textAlign: 'center' }}>
          <Text size="lg" fw={700} c="blue">
            {routes.filter(r => r.status === 'completed').length}
          </Text>
          <Text size="xs" c="dimmed">Завершено</Text>
        </Paper>
        <Paper p="xs" withBorder style={{ textAlign: 'center' }}>
          <Text size="lg" fw={700} c="red">
            {routes.filter(r => r.status === 'delayed').length}
          </Text>
          <Text size="xs" c="dimmed">Задержки</Text>
        </Paper>
        <Paper p="xs" withBorder style={{ textAlign: 'center' }}>
          <Text size="lg" fw={700} c="orange">
            {routes.filter(r => r.status === 'pending').length}
          </Text>
          <Text size="xs" c="dimmed">Ожидание</Text>
        </Paper>
      </Group>
    </Paper>
  );
};

export default YandexRoutesMap;
export type { RouteData };