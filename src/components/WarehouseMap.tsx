import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { Badge, Text, Group, Stack, Progress, ThemeIcon } from '@mantine/core';
import { IconBuildingWarehouse, IconAlertTriangle, IconCircleCheck } from '@tabler/icons-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Исправляем проблему с иконками в Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WarehouseLocation {
  name: string;
  stock: number;
  capacity: number;
  utilization: number;
  critical: number;
  lat: number;
  lng: number;
  city: string;
}

interface WarehouseMapProps {
  warehouses: WarehouseLocation[];
  height?: number | string;
}

const WarehouseMap: React.FC<WarehouseMapProps> = ({ 
  warehouses, 
  height = 400 
}) => {
  const [mapError, setMapError] = useState<string | null>(null);

  // Функция для определения цвета кружка по загрузке
  const getCircleColor = (utilization: number, critical: number) => {
    if (critical > 3) return '#fa5252'; // красный
    if (utilization > 85) return '#fd7e14'; // оранжевый
    if (utilization > 70) return '#fab005'; // желтый
    return '#51cf66'; // зеленый
  };

  // Функция для определения размера кружка по количеству товаров
  const getCircleRadius = (stock: number, maxStock: number) => {
    const minRadius = 15;
    const maxRadius = 35;
    const ratio = stock / maxStock;
    return minRadius + (maxRadius - minRadius) * ratio;
  };

  const maxStock = Math.max(...warehouses.map(w => w.stock));

  // Error boundary для карты
  if (mapError) {
    return (
      <div style={{ 
        height: height, 
        width: '100%', 
        borderRadius: '8px', 
        border: '1px solid #e9ecef',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <IconAlertTriangle size={48} style={{ marginBottom: '1rem' }} />
          <div>Ошибка загрузки карты</div>
          <div style={{ fontSize: '14px', marginTop: '0.5rem' }}>{mapError}</div>
        </div>
      </div>
    );
  }

  try {
    return (
      <div style={{ height: height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
        <MapContainer
          center={[61.5240, 105.3188]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {warehouses.map((warehouse, index) => {
            const radius = getCircleRadius(warehouse.stock, maxStock);
            const color = getCircleColor(warehouse.utilization, warehouse.critical);
            
            return (
              <CircleMarker
                key={`warehouse-${index}`}
                center={[warehouse.lat, warehouse.lng]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  color: color,
                  weight: 3,
                  opacity: 0.8,
                  fillOpacity: 0.6
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div>
                    <strong>{warehouse.name}</strong><br/>
                    Остатки: {warehouse.stock.toLocaleString()} шт<br/>
                    Загрузка: {warehouse.utilization}%<br/>
                    {warehouse.critical > 0 ? `⚠️ ${warehouse.critical} критических` : '✅ OK'}
                  </div>
                </Tooltip>

                <Popup maxWidth={300}>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0' }}>{warehouse.name}</h3>
                    <p style={{ margin: '5px 0', color: '#666' }}>{warehouse.city}</p>
                    
                    <div style={{ margin: '10px 0' }}>
                      <strong>Загрузка склада: {warehouse.utilization}%</strong>
                      <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        backgroundColor: '#e9ecef', 
                        borderRadius: '4px',
                        margin: '5px 0'
                      }}>
                        <div style={{ 
                          width: `${warehouse.utilization}%`, 
                          height: '100%', 
                          backgroundColor: warehouse.utilization > 85 ? '#fa5252' : warehouse.utilization > 70 ? '#fd7e14' : '#51cf66',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Текущие остатки</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{warehouse.stock.toLocaleString()}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>единиц товара</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#666' }}>Вместимость</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{warehouse.capacity.toLocaleString()}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>единиц максимум</div>
                      </div>
                    </div>

                    {warehouse.critical > 0 && (
                      <div style={{ 
                        padding: '8px', 
                        backgroundColor: '#fff5f5', 
                        border: '1px solid #fecaca', 
                        borderRadius: '4px',
                        color: '#dc2626',
                        fontSize: '14px'
                      }}>
                        ⚠️ {warehouse.critical} товаров требуют внимания
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    );
  } catch (error) {
    console.error('Map rendering error:', error);
    setMapError(error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
};

export default WarehouseMap;