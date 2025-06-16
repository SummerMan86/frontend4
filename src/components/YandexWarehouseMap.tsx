import React, { useRef, useState, useEffect } from 'react';
import { Paper, Text, Group, ThemeIcon, ActionIcon, Badge, Loader, Stack } from '@mantine/core';
import { IconMapPin, IconRefresh, IconBuildingWarehouse } from '@tabler/icons-react';

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
 * Компонент интерактивной карты складов с использованием Yandex Maps API
 * 
 * ВАЖНО: Для продакшена необходимо:
 * 1. Получить API ключ на https://developer.tech.yandex.ru/
 * 2. Добавить ключ в переменную окружения VITE_YANDEX_MAPS_API_KEY
 * 3. Заменить строку загрузки API на: 
 *    `https://api-maps.yandex.ru/2.1/?apikey=${import.meta.env.VITE_YANDEX_MAPS_API_KEY}&lang=ru_RU`
 */

// Типы для данных складов
interface WarehouseData {
  id: string;
  name: string;
  city: string;
  coordinates: [number, number]; // [latitude, longitude]
  stock: number;
  capacity: number;
  status: 'high' | 'medium' | 'low' | 'critical';
  address: string;
}

// Тестовые данные складов по России
const warehousesData: WarehouseData[] = [
  {
    id: 'msk-001',
    name: 'Склад Москва Центр',
    city: 'Москва',
    coordinates: [55.7558, 37.6176],
    stock: 45382,
    capacity: 50000,
    status: 'high',
    address: 'г. Москва, ул. Тверская, 1'
  },
  {
    id: 'spb-001',
    name: 'Склад СПб Север',
    city: 'Санкт-Петербург',
    coordinates: [59.9311, 30.3609],
    stock: 32150,
    capacity: 40000,
    status: 'high',
    address: 'г. Санкт-Петербург, Невский пр., 28'
  },
  {
    id: 'nsk-001',
    name: 'Склад Новосибирск',
    city: 'Новосибирск',
    coordinates: [55.0084, 82.9357],
    stock: 18750,
    capacity: 25000,
    status: 'medium',
    address: 'г. Новосибирск, ул. Красный пр., 153'
  },
  {
    id: 'ekb-001',
    name: 'Склад Екатеринбург',
    city: 'Екатеринбург',
    coordinates: [56.8431, 60.6454],
    stock: 12400,
    capacity: 20000,
    status: 'medium',
    address: 'г. Екатеринбург, ул. Ленина, 51'
  },
  {
    id: 'kzn-001',
    name: 'Склад Казань',
    city: 'Казань',
    coordinates: [55.8304, 49.0661],
    stock: 8950,
    capacity: 15000,
    status: 'medium',
    address: 'г. Казань, ул. Баумана, 58'
  },
  {
    id: 'nng-001',
    name: 'Склад Нижний Новгород',
    city: 'Нижний Новгород',
    coordinates: [56.2965, 43.9361],
    stock: 6780,
    capacity: 12000,
    status: 'medium',
    address: 'г. Нижний Новгород, ул. Большая Покровская, 15'
  },
  {
    id: 'ros-001',
    name: 'Склад Ростов-на-Дону',
    city: 'Ростов-на-Дону',
    coordinates: [47.2357, 39.7015],
    stock: 4250,
    capacity: 10000,
    status: 'low',
    address: 'г. Ростов-на-Дону, пр. Ворошиловский, 23'
  },
  {
    id: 'sam-001',
    name: 'Склад Самара',
    city: 'Самара',
    coordinates: [53.2001, 50.1500],
    stock: 3890,
    capacity: 8000,
    status: 'low',
    address: 'г. Самара, ул. Молодогвардейская, 151'
  },
  {
    id: 'ufa-001',
    name: 'Склад Уфа',
    city: 'Уфа',
    coordinates: [54.7388, 55.9721],
    stock: 2150,
    capacity: 6000,
    status: 'low',
    address: 'г. Уфа, ул. Ленина, 3'
  },
  {
    id: 'vlg-001',
    name: 'Склад Волгоград',
    city: 'Волгоград',
    coordinates: [48.7080, 44.5133],
    stock: 1250,
    capacity: 5000,
    status: 'critical',
    address: 'г. Волгоград, пр. Ленина, 7'
  },
  {
    id: 'krsk-001',
    name: 'Склад Красноярск',
    city: 'Красноярск',
    coordinates: [56.0184, 92.8672],
    stock: 950,
    capacity: 4000,
    status: 'critical',
    address: 'г. Красноярск, ул. Мира, 91'
  },
  {
    id: 'irkutsk-001',
    name: 'Склад Иркутск',
    city: 'Иркутск',
    coordinates: [52.2978, 104.2964],
    stock: 780,
    capacity: 3000,
    status: 'critical',
    address: 'г. Иркутск, ул. Карла Маркса, 1'
  },
  {
    id: 'vld-001',
    name: 'Склад Владивосток',
    city: 'Владивосток',
    coordinates: [43.1056, 131.8735],
    stock: 650,
    capacity: 2500,
    status: 'critical',
    address: 'г. Владивосток, ул. Светланская, 33'
  },
  {
    id: 'krd-001',
    name: 'Склад Краснодар',
    city: 'Краснодар',
    coordinates: [45.0355, 38.9753],
    stock: 5420,
    capacity: 9000,
    status: 'medium',
    address: 'г. Краснодар, ул. Красная, 122'
  },
  {
    id: 'vrnz-001',
    name: 'Склад Воронеж',
    city: 'Воронеж',
    coordinates: [51.6720, 39.1843],
    stock: 3150,
    capacity: 7000,
    status: 'low',
    address: 'г. Воронеж, пр. Революции, 19'
  }
];

// Цвета для разных статусов остатков
const statusColors = {
  high: '#51cf66',
  medium: '#fab005',
  low: '#fd7e14',
  critical: '#e03131'
};

interface YandexWarehouseMapProps {
  warehouses?: WarehouseData[];
  onWarehouseClick?: (warehouse: WarehouseData) => void;
}

const YandexWarehouseMap: React.FC<YandexWarehouseMapProps> = ({ 
  warehouses = warehousesData, 
  onWarehouseClick 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseData | null>(null);

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
      // Используем API без ключа для демонстрации (ограниченная функциональность)
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.onload = () => {
        if (window.ymaps) {
          window.ymaps.ready(initMap);
        }
      };
      script.onerror = () => {
        setIsLoading(false);
        console.error('Ошибка загрузки Яндекс.Карт');
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.ymaps) return;

      const map = new window.ymaps.Map(mapRef.current, {
        center: [55.76, 37.64], // Центр России (Москва)
        zoom: 5,
        controls: ['zoomControl', 'fullscreenControl']
      });

      // Добавляем маркеры складов
      warehouses.forEach(warehouse => {
        const placemark = new window.ymaps.Placemark(
          warehouse.coordinates,
          {
            balloonContentHeader: warehouse.name,
            balloonContentBody: `
              <div style="padding: 10px;">
                <p><strong>Город:</strong> ${warehouse.city}</p>
                <p><strong>Адрес:</strong> ${warehouse.address}</p>
                <p><strong>Остатки:</strong> ${warehouse.stock.toLocaleString()} шт.</p>
                <p><strong>Вместимость:</strong> ${warehouse.capacity.toLocaleString()} шт.</p>
                <p><strong>Заполненность:</strong> ${Math.round((warehouse.stock / warehouse.capacity) * 100)}%</p>
              </div>
            `,
            balloonContentFooter: `<small>ID: ${warehouse.id}</small>`,
            hintContent: `${warehouse.name} - ${warehouse.stock.toLocaleString()} шт.`
          },
          {
            preset: 'islands#circleIcon',
            iconColor: statusColors[warehouse.status],
            iconSize: [30, 30]
          }
        );

        placemark.events.add('click', () => {
          setSelectedWarehouse(warehouse);
          onWarehouseClick?.(warehouse);
        });

        map.geoObjects.add(placemark);
      });

      setMapLoaded(true);
      setIsLoading(false);
    };

    loadYandexMaps();
  }, [warehouses, onWarehouseClick]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'high': return 'Высокие остатки';
      case 'medium': return 'Средние остатки';
      case 'low': return 'Низкие остатки';
      case 'critical': return 'Критические остатки';
      default: return 'Неизвестно';
    }
  };

  return (
    <Paper p="md" withBorder>
      <Group justify="space-between" mb="md">
        <Group>
          <ThemeIcon size={32} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
            <IconMapPin size={18} />
          </ThemeIcon>
          <div>
            <Text fw={600}>Карта остатков по складам</Text>
            <Text size="sm" c="dimmed">Интерактивная карта с данными по остаткам</Text>
          </div>
        </Group>
        <Group>
          <Badge variant="light" color="blue">
            {warehouses.length} складов
          </Badge>
          <ActionIcon variant="light" size="sm">
            <IconRefresh size={16} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Яндекс карта */}
      <div style={{ position: 'relative' }}>
        <div 
          ref={mapRef}
          style={{ 
            height: 400, 
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
            <Text size="sm" c="dimmed">Загрузка карты...</Text>
          </div>
        )}
      </div>

      {/* Легенда карты */}
      <Group mt="md" gap="xs">
        <Group gap={4}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: statusColors.high }}></div>
          <Text size="xs">Высокие остатки</Text>
        </Group>
        <Group gap={4}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: statusColors.medium }}></div>
          <Text size="xs">Средние остатки</Text>
        </Group>
        <Group gap={4}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: statusColors.low }}></div>
          <Text size="xs">Низкие остатки</Text>
        </Group>
        <Group gap={4}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: statusColors.critical }}></div>
          <Text size="xs">Критические остатки</Text>
        </Group>
      </Group>

      {/* Информация о выбранном складе */}
      {selectedWarehouse && (
        <Paper p="sm" mt="md" withBorder style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
          <Group>
            <ThemeIcon size={24} radius="md" color={selectedWarehouse.status === 'high' ? 'green' : selectedWarehouse.status === 'critical' ? 'red' : 'orange'}>
              <IconBuildingWarehouse size={14} />
            </ThemeIcon>
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={600}>{selectedWarehouse.name}</Text>
              <Text size="xs" c="dimmed">{selectedWarehouse.city} • {selectedWarehouse.stock.toLocaleString()} шт.</Text>
            </div>
            <Badge 
              size="sm" 
              color={selectedWarehouse.status === 'high' ? 'green' : selectedWarehouse.status === 'critical' ? 'red' : 'orange'}
            >
              {getStatusText(selectedWarehouse.status)}
            </Badge>
          </Group>
        </Paper>
      )}

      {/* Статистика по складам */}
      <Group mt="md" grow>
        <Paper p="xs" withBorder style={{ textAlign: 'center' }}>
          <Text size="lg" fw={700} c="green">
            {warehouses.filter(w => w.status === 'high').length}
          </Text>
          <Text size="xs" c="dimmed">Высокие остатки</Text>
        </Paper>
        <Paper p="xs" withBorder style={{ textAlign: 'center' }}>
          <Text size="lg" fw={700} c="orange">
            {warehouses.filter(w => w.status === 'medium').length}
          </Text>
          <Text size="xs" c="dimmed">Средние остатки</Text>
        </Paper>
        <Paper p="xs" withBorder style={{ textAlign: 'center' }}>
          <Text size="lg" fw={700} c="yellow">
            {warehouses.filter(w => w.status === 'low').length}
          </Text>
          <Text size="xs" c="dimmed">Низкие остатки</Text>
        </Paper>
        <Paper p="xs" withBorder style={{ textAlign: 'center' }}>
          <Text size="lg" fw={700} c="red">
            {warehouses.filter(w => w.status === 'critical').length}
          </Text>
          <Text size="xs" c="dimmed">Критические</Text>
        </Paper>
      </Group>
    </Paper>
  );
};

export default YandexWarehouseMap;
export type { WarehouseData };