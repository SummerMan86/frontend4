import React, { useEffect, useState } from 'react';
import { Paper, Text, Group, ThemeIcon, ActionIcon, Badge, Loader, Stack, Title, Grid } from '@mantine/core';
import { IconTruck, IconRefresh, IconShip, IconPlane, IconTrain, IconRoad } from '@tabler/icons-react';
import { supplyNodes, supplyEdges, nodeColors, edgeColors, transportColors, SupplyNode, SupplyEdge } from '../data/supplyTestData';

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
 * Компонент интерактивной карты графа поставок с использованием Yandex Maps API
 * Отображает поставщиков из Китая, склады и распределительные центры в России
 * 
 * ВАЖНО: Для продакшена необходимо:
 * 1. Получить API ключ на https://developer.tech.yandex.ru/
 * 2. Добавить ключ в переменную окружения VITE_YANDEX_MAPS_API_KEY
 * 3. Заменить строку загрузки API на: 
 *    `https://api-maps.yandex.ru/2.1/?apikey=${import.meta.env.VITE_YANDEX_MAPS_API_KEY}&lang=ru_RU`
 */

interface YandexSupplyGraphMapProps {
  nodes?: SupplyNode[];
  edges?: SupplyEdge[];
  onNodeClick?: (node: SupplyNode) => void;
  onEdgeClick?: (edge: SupplyEdge) => void;
  height?: number;
}

const YandexSupplyGraphMap: React.FC<YandexSupplyGraphMapProps> = ({
  nodes = supplyNodes,
  edges = supplyEdges,
  onNodeClick,
  onEdgeClick,
  height = 600
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<SupplyNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<SupplyEdge | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadYandexMaps = () => {
      // Проверяем, загружен ли уже API
      if (window.ymaps) {
        initMap();
        return;
      }

      // Проверяем, есть ли уже скрипт на странице
      const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
      if (existingScript) {
        // Если скрипт уже есть, ждем его загрузки
        const checkYmaps = setInterval(() => {
          if (window.ymaps) {
            clearInterval(checkYmaps);
            initMap();
          }
        }, 100);
        return;
      }

      // Загружаем API Yandex Maps
      const script = document.createElement('script') as HTMLScriptElementWithOnload;
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.onload = () => {
        window.ymaps.ready(() => {
          initMap();
        });
      };
      script.onerror = () => {
        setError('Ошибка загрузки Yandex Maps API');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      try {
        // Создаем карту с центром между Китаем и Россией
        const map = new window.ymaps.Map('supply-graph-map', {
          center: [45.0, 90.0], // Центр между Китаем и Россией
          zoom: 2, // Уменьшаем зум для лучшего обзора
          controls: ['zoomControl', 'fullscreenControl']
        });

        // Добавляем узлы (поставщики, склады, РЦ)
        nodes.forEach(node => {
          const placemark = new window.ymaps.Placemark(
            node.coordinates,
            {
              balloonContentHeader: `<strong>${node.name}</strong>`,
              balloonContentBody: `
                <div style="padding: 10px;">
                  <p><strong>Тип:</strong> ${getNodeTypeLabel(node.type)}</p>
                  <p><strong>Страна:</strong> ${node.country}</p>
                  <p><strong>Город:</strong> ${node.city}</p>
                  ${node.capacity ? `<p><strong>Вместимость:</strong> ${node.capacity.toLocaleString()} тонн</p>` : ''}
                  ${node.currentStock ? `<p><strong>Текущий запас:</strong> ${node.currentStock.toLocaleString()} тонн</p>` : ''}
                  <p><strong>Статус:</strong> <span style="color: ${node.status === 'active' ? '#51cf66' : '#e03131'}">${getStatusLabel(node.status)}</span></p>
                </div>
              `,
              balloonContentFooter: `<small>ID: ${node.id}</small>`
            },
            {
              preset: getNodePreset(node.type),
              iconColor: nodeColors[node.type]
            }
          );

          placemark.events.add('click', () => {
            setSelectedNode(node);
            onNodeClick?.(node);
          });

          map.geoObjects.add(placemark);
        });

        // Добавляем связи (поставки)
        edges.forEach(edge => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          
          if (fromNode && toNode) {
            // Создаем линию со стрелкой для показа направления поставки
            const polyline = new window.ymaps.Polyline(
              [fromNode.coordinates, toNode.coordinates],
              {
                balloonContentHeader: `<strong>Поставка: ${fromNode.name} → ${toNode.name}</strong>`,
                balloonContentBody: `
                  <div style="padding: 10px;">
                    <p><strong>Тип транспорта:</strong> ${getTransportTypeLabel(edge.type)}</p>
                    <p><strong>Статус:</strong> <span style="color: ${edgeColors[edge.status]}">${getStatusLabel(edge.status)}</span></p>
                    <p><strong>Объем:</strong> ${edge.volume.toLocaleString()} тонн</p>
                    <p><strong>Стоимость:</strong> $${edge.cost.toLocaleString()}</p>
                    <p><strong>Длительность:</strong> ${edge.duration} дней</p>
                    <p><strong>Частота:</strong> ${getFrequencyLabel(edge.frequency)}</p>
                    ${edge.lastDelivery ? `<p><strong>Последняя поставка:</strong> ${edge.lastDelivery}</p>` : ''}
                    ${edge.nextDelivery ? `<p><strong>Следующая поставка:</strong> ${edge.nextDelivery}</p>` : ''}
                  </div>
                `,
                balloonContentFooter: `<small>ID: ${edge.id}</small>`
              },
              {
                strokeColor: edgeColors[edge.status],
                strokeWidth: getStrokeWidth(edge.volume),
                strokeOpacity: 0.8,
                strokeStyle: edge.status === 'planned' ? '5 5' : 'solid',
                // Добавляем стрелку для показа направления
                arrowStyle: {
                  enabled: true,
                  size: 8,
                  fillColor: edgeColors[edge.status],
                  strokeColor: edgeColors[edge.status]
                }
              }
            );
            
            // Добавляем стрелку в середине линии для лучшей видимости направления
            const midPoint = [
              (fromNode.coordinates[0] + toNode.coordinates[0]) / 2,
              (fromNode.coordinates[1] + toNode.coordinates[1]) / 2
            ];
            
            const arrowPlacemark = new window.ymaps.Placemark(
               midPoint,
               {
                 hintContent: `${fromNode.name} → ${toNode.name}`,
                 balloonContent: `Направление поставки: ${fromNode.name} → ${toNode.name}`
               },
               {
                 preset: 'islands#arrowIcon',
                 iconColor: edgeColors[edge.status],
                 iconImageSize: [20, 20],
                 iconImageOffset: [-10, -10]
               }
             );
             
             map.geoObjects.add(polyline);
             map.geoObjects.add(arrowPlacemark);

            polyline.events.add('click', () => {
              setSelectedEdge(edge);
              onEdgeClick?.(edge);
            });
          }
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

    loadYandexMaps();
  }, [nodes, edges, onNodeClick, onEdgeClick]);

  const refreshMap = () => {
    setIsLoading(true);
    setError(null);
    setSelectedNode(null);
    setSelectedEdge(null);
    
    // Очищаем контейнер карты
    const mapContainer = document.getElementById('supply-graph-map');
    if (mapContainer) {
      mapContainer.innerHTML = '';
    }
    
    // Перезагружаем карту
    setTimeout(() => {
      if (window.ymaps) {
        window.ymaps.ready(() => {
          const initMap = () => {
            try {
              const map = new window.ymaps.Map('supply-graph-map', {
                center: [50.0, 80.0],
                zoom: 3,
                controls: ['zoomControl', 'fullscreenControl']
              });

              // Повторяем логику добавления узлов и связей
              nodes.forEach(node => {
                const placemark = new window.ymaps.Placemark(
                  node.coordinates,
                  {
                    balloonContentHeader: `<strong>${node.name}</strong>`,
                    balloonContentBody: `
                      <div style="padding: 10px;">
                        <p><strong>Тип:</strong> ${getNodeTypeLabel(node.type)}</p>
                        <p><strong>Страна:</strong> ${node.country}</p>
                        <p><strong>Город:</strong> ${node.city}</p>
                        ${node.capacity ? `<p><strong>Вместимость:</strong> ${node.capacity.toLocaleString()} тонн</p>` : ''}
                        ${node.currentStock ? `<p><strong>Текущий запас:</strong> ${node.currentStock.toLocaleString()} тонн</p>` : ''}
                        <p><strong>Статус:</strong> <span style="color: ${node.status === 'active' ? '#51cf66' : '#e03131'}">${getStatusLabel(node.status)}</span></p>
                      </div>
                    `,
                    balloonContentFooter: `<small>ID: ${node.id}</small>`
                  },
                  {
                    preset: getNodePreset(node.type),
                    iconColor: nodeColors[node.type]
                  }
                );

                placemark.events.add('click', () => {
                  setSelectedNode(node);
                  onNodeClick?.(node);
                });

                map.geoObjects.add(placemark);
              });

              edges.forEach(edge => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                
                if (fromNode && toNode) {
                  const polyline = new window.ymaps.Polyline(
                    [fromNode.coordinates, toNode.coordinates],
                    {
                      balloonContentHeader: `<strong>Поставка: ${fromNode.name} → ${toNode.name}</strong>`,
                      balloonContentBody: `
                        <div style="padding: 10px;">
                          <p><strong>Тип транспорта:</strong> ${getTransportTypeLabel(edge.type)}</p>
                          <p><strong>Статус:</strong> <span style="color: ${edgeColors[edge.status]}">${getStatusLabel(edge.status)}</span></p>
                          <p><strong>Объем:</strong> ${edge.volume.toLocaleString()} тонн</p>
                          <p><strong>Стоимость:</strong> $${edge.cost.toLocaleString()}</p>
                          <p><strong>Длительность:</strong> ${edge.duration} дней</p>
                          <p><strong>Частота:</strong> ${getFrequencyLabel(edge.frequency)}</p>
                          ${edge.lastDelivery ? `<p><strong>Последняя поставка:</strong> ${edge.lastDelivery}</p>` : ''}
                          ${edge.nextDelivery ? `<p><strong>Следующая поставка:</strong> ${edge.nextDelivery}</p>` : ''}
                        </div>
                      `,
                      balloonContentFooter: `<small>ID: ${edge.id}</small>`
                    },
                    {
                      strokeColor: edgeColors[edge.status],
                      strokeWidth: getStrokeWidth(edge.volume),
                      strokeOpacity: 0.8,
                      strokeStyle: edge.status === 'planned' ? '5 5' : 'solid'
                    }
                  );

                  polyline.events.add('click', () => {
                    setSelectedEdge(edge);
                    onEdgeClick?.(edge);
                  });

                  map.geoObjects.add(polyline);
                }
              });

              setMapLoaded(true);
              setIsLoading(false);
            } catch (err) {
              console.error('Ошибка обновления карты:', err);
              setError('Ошибка обновления карты');
              setIsLoading(false);
            }
          };
          
          initMap();
        });
      }
    }, 100);
  };

  // Вспомогательные функции
  const getNodeTypeLabel = (type: string) => {
    const labels = {
      supplier: 'Поставщик',
      warehouse: 'Склад',
      distribution: 'Распределительный центр',
      retail: 'Розничная точка'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'Активный',
      inactive: 'Неактивный',
      maintenance: 'Обслуживание',
      delayed: 'Задержка',
      completed: 'Завершено',
      planned: 'Запланировано'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTransportTypeLabel = (type: string) => {
    const labels = {
      sea: 'Морской',
      air: 'Авиа',
      rail: 'Железнодорожный',
      road: 'Автомобильный'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      daily: 'Ежедневно',
      weekly: 'Еженедельно',
      monthly: 'Ежемесячно',
      quarterly: 'Ежеквартально'
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  const getNodePreset = (type: string) => {
    const presets = {
      supplier: 'islands#redFactoryIcon',
      warehouse: 'islands#blueWarehouseIcon',
      distribution: 'islands#greenHomeIcon',
      retail: 'islands#yellowShopIcon'
    };
    return presets[type as keyof typeof presets] || 'islands#grayCircleIcon';
  };

  const getStrokeWidth = (volume: number) => {
    if (volume >= 1000) return 6;
    if (volume >= 500) return 4;
    if (volume >= 200) return 3;
    return 2;
  };

  const getTransportIcon = (type: string) => {
    const icons = {
      sea: IconShip,
      air: IconPlane,
      rail: IconTrain,
      road: IconRoad
    };
    return icons[type as keyof typeof icons] || IconTruck;
  };

  // Подсчет статистики
  const nodeStats = {
    suppliers: nodes.filter(n => n.type === 'supplier').length,
    warehouses: nodes.filter(n => n.type === 'warehouse').length,
    distribution: nodes.filter(n => n.type === 'distribution').length,
    active: nodes.filter(n => n.status === 'active').length
  };

  const edgeStats = {
    active: edges.filter(e => e.status === 'active').length,
    delayed: edges.filter(e => e.status === 'delayed').length,
    completed: edges.filter(e => e.status === 'completed').length,
    planned: edges.filter(e => e.status === 'planned').length,
    totalVolume: edges.reduce((sum, e) => sum + e.volume, 0),
    totalCost: edges.reduce((sum, e) => sum + e.cost, 0)
  };

  return (
    <Stack gap="md">
      {/* Заголовок и управление */}
      <Group justify="space-between" align="center">
        <Group align="center">
          <ThemeIcon size="lg" variant="light" color="blue">
            <IconTruck size={20} />
          </ThemeIcon>
          <div>
            <Title order={3}>Граф поставок из Китая</Title>
            <Text size="sm" c="dimmed">
              Интерактивная карта цепочки поставок
            </Text>
          </div>
        </Group>
        
        <ActionIcon 
          variant="light" 
          color="blue" 
          size="lg"
          onClick={refreshMap}
          loading={isLoading}
        >
          <IconRefresh size={18} />
        </ActionIcon>
      </Group>

      {/* Карта */}
      <Paper withBorder style={{ position: 'relative', height: `${height}px` }}>
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
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1000
          }}>
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text>Загрузка карты поставок...</Text>
            </Stack>
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 1000
          }}>
            <Stack align="center" gap="md">
              <Text c="red" size="lg">{error}</Text>
              <ActionIcon variant="light" color="blue" onClick={refreshMap}>
                <IconRefresh size={18} />
              </ActionIcon>
            </Stack>
          </div>
        )}
        
        <div id="supply-graph-map" style={{ width: '100%', height: '100%' }} />
      </Paper>

      {/* Легенда и информация */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper p="md" withBorder>
            <Title order={4} mb="md">Легенда узлов</Title>
            <Stack gap="xs">
              <Group>
                <div style={{ width: 12, height: 12, backgroundColor: nodeColors.supplier, borderRadius: '50%' }} />
                <Text size="sm">Поставщики ({nodeStats.suppliers})</Text>
              </Group>
              <Group>
                <div style={{ width: 12, height: 12, backgroundColor: nodeColors.warehouse, borderRadius: '50%' }} />
                <Text size="sm">Склады ({nodeStats.warehouses})</Text>
              </Group>
              <Group>
                <div style={{ width: 12, height: 12, backgroundColor: nodeColors.distribution, borderRadius: '50%' }} />
                <Text size="sm">Распред. центры ({nodeStats.distribution})</Text>
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper p="md" withBorder>
            <Title order={4} mb="md">Статусы поставок</Title>
            <Stack gap="xs">
              <Group>
                <div style={{ width: 12, height: 3, backgroundColor: edgeColors.active }} />
                <Text size="sm">Активные ({edgeStats.active})</Text>
              </Group>
              <Group>
                <div style={{ width: 12, height: 3, backgroundColor: edgeColors.delayed }} />
                <Text size="sm">Задержанные ({edgeStats.delayed})</Text>
              </Group>
              <Group>
                <div style={{ width: 12, height: 3, backgroundColor: edgeColors.completed }} />
                <Text size="sm">Завершенные ({edgeStats.completed})</Text>
              </Group>
              <Group>
                <div style={{ width: 12, height: 3, backgroundColor: edgeColors.planned, borderStyle: 'dashed' }} />
                <Text size="sm">Запланированные ({edgeStats.planned})</Text>
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper p="md" withBorder>
            <Title order={4} mb="md">Общая статистика</Title>
            <Stack gap="xs">
              <Text size="sm">📦 Общий объем: {edgeStats.totalVolume.toLocaleString()} тонн</Text>
              <Text size="sm">💰 Общая стоимость: ${edgeStats.totalCost.toLocaleString()}</Text>
              <Text size="sm">🏭 Активных узлов: {nodeStats.active}</Text>
              <Text size="sm">🚛 Всего поставок: {edges.length}</Text>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Информация о выбранном узле */}
      {selectedNode && (
        <Paper p="md" withBorder>
          <Title order={4} mb="md">Выбранный узел: {selectedNode.name}</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm"><strong>Тип:</strong> {getNodeTypeLabel(selectedNode.type)}</Text>
              <Text size="sm"><strong>Страна:</strong> {selectedNode.country}</Text>
              <Text size="sm"><strong>Город:</strong> {selectedNode.city}</Text>
              <Text size="sm"><strong>Статус:</strong> <Badge color={selectedNode.status === 'active' ? 'green' : 'red'}>{getStatusLabel(selectedNode.status)}</Badge></Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              {selectedNode.capacity && <Text size="sm"><strong>Вместимость:</strong> {selectedNode.capacity.toLocaleString()} тонн</Text>}
              {selectedNode.currentStock && <Text size="sm"><strong>Текущий запас:</strong> {selectedNode.currentStock.toLocaleString()} тонн</Text>}
              {selectedNode.capacity && selectedNode.currentStock && (
                <Text size="sm"><strong>Заполненность:</strong> {Math.round((selectedNode.currentStock / selectedNode.capacity) * 100)}%</Text>
              )}
            </Grid.Col>
          </Grid>
        </Paper>
      )}

      {/* Информация о выбранной поставке */}
      {selectedEdge && (
        <Paper p="md" withBorder>
          <Title order={4} mb="md">Выбранная поставка</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm"><strong>Маршрут:</strong> {nodes.find(n => n.id === selectedEdge.from)?.name} → {nodes.find(n => n.id === selectedEdge.to)?.name}</Text>
              <Text size="sm"><strong>Тип транспорта:</strong> {getTransportTypeLabel(selectedEdge.type)}</Text>
              <Text size="sm"><strong>Статус:</strong> <Badge color={selectedEdge.status === 'active' ? 'green' : selectedEdge.status === 'delayed' ? 'red' : 'blue'}>{getStatusLabel(selectedEdge.status)}</Badge></Text>
              <Text size="sm"><strong>Частота:</strong> {getFrequencyLabel(selectedEdge.frequency)}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm"><strong>Объем:</strong> {selectedEdge.volume.toLocaleString()} тонн</Text>
              <Text size="sm"><strong>Стоимость:</strong> ${selectedEdge.cost.toLocaleString()}</Text>
              <Text size="sm"><strong>Длительность:</strong> {selectedEdge.duration} дней</Text>
              {selectedEdge.nextDelivery && <Text size="sm"><strong>Следующая поставка:</strong> {selectedEdge.nextDelivery}</Text>}
            </Grid.Col>
          </Grid>
        </Paper>
      )}
    </Stack>
  );
};

export default YandexSupplyGraphMap;