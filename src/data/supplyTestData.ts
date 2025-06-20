// Тестовые данные для графа поставок
// Этот файл содержит моковые данные для демонстрации функциональности
// В продакшене эти данные должны загружаться из API

export interface SupplyNode {
  id: string;
  name: string;
  type: 'supplier' | 'warehouse' | 'distribution' | 'retail';
  country: string;
  city: string;
  coordinates: [number, number]; // [latitude, longitude]
  capacity?: number;
  currentStock?: number;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface SupplyEdge {
  id: string;
  from: string; // ID узла-источника
  to: string;   // ID узла-назначения
  type: 'sea' | 'air' | 'rail' | 'road';
  status: 'active' | 'delayed' | 'completed' | 'planned';
  volume: number; // объем поставки в тоннах
  cost: number;   // стоимость в USD
  duration: number; // длительность в днях
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastDelivery?: string;
  nextDelivery?: string;
}

// Узлы графа поставок
export const supplyNodes: SupplyNode[] = [
  // Поставщики в Китае
  {
    id: 'supplier-guangzhou',
    name: 'Guangzhou Electronics Co.',
    type: 'supplier',
    country: 'Китай',
    city: 'Гуанчжоу',
    coordinates: [23.1291, 113.2644],
    capacity: 10000,
    currentStock: 7500,
    status: 'active'
  },
  {
    id: 'supplier-shenzhen',
    name: 'Shenzhen Tech Manufacturing',
    type: 'supplier',
    country: 'Китай',
    city: 'Шэньчжэнь',
    coordinates: [22.5431, 114.0579],
    capacity: 15000,
    currentStock: 12000,
    status: 'active'
  },
  {
    id: 'supplier-shanghai',
    name: 'Shanghai Industrial Group',
    type: 'supplier',
    country: 'Китай',
    city: 'Шанхай',
    coordinates: [31.2304, 121.4737],
    capacity: 20000,
    currentStock: 18000,
    status: 'active'
  },
  {
    id: 'supplier-yiwu',
    name: 'Yiwu Trade Center',
    type: 'supplier',
    country: 'Китай',
    city: 'Иу',
    coordinates: [29.3063, 120.0759],
    capacity: 8000,
    currentStock: 6500,
    status: 'active'
  },
  
  // Склады в России
  {
    id: 'warehouse-moscow',
    name: 'Московский распределительный центр',
    type: 'warehouse',
    country: 'Россия',
    city: 'Москва',
    coordinates: [55.7558, 37.6176],
    capacity: 5000,
    currentStock: 3200,
    status: 'active'
  },
  {
    id: 'warehouse-spb',
    name: 'Санкт-Петербургский склад',
    type: 'warehouse',
    country: 'Россия',
    city: 'Санкт-Петербург',
    coordinates: [59.9311, 30.3609],
    capacity: 3000,
    currentStock: 2100,
    status: 'active'
  },
  {
    id: 'warehouse-ekb',
    name: 'Екатеринбургский склад',
    type: 'warehouse',
    country: 'Россия',
    city: 'Екатеринбург',
    coordinates: [56.8431, 60.6454],
    capacity: 2500,
    currentStock: 1800,
    status: 'active'
  },
  {
    id: 'warehouse-novosibirsk',
    name: 'Новосибирский склад',
    type: 'warehouse',
    country: 'Россия',
    city: 'Новосибирск',
    coordinates: [55.0084, 82.9357],
    capacity: 2000,
    currentStock: 1500,
    status: 'active'
  },
  
  // Распределительные центры
  {
    id: 'distribution-kazan',
    name: 'Казанский РЦ',
    type: 'distribution',
    country: 'Россия',
    city: 'Казань',
    coordinates: [55.8304, 49.0661],
    capacity: 1500,
    currentStock: 900,
    status: 'active'
  },
  {
    id: 'distribution-krasnodar',
    name: 'Краснодарский РЦ',
    type: 'distribution',
    country: 'Россия',
    city: 'Краснодар',
    coordinates: [45.0355, 38.9753],
    capacity: 1200,
    currentStock: 800,
    status: 'active'
  }
];

// Связи между узлами (поставки)
export const supplyEdges: SupplyEdge[] = [
  // Поставки из Китая в Россию
  {
    id: 'edge-guangzhou-moscow',
    from: 'supplier-guangzhou',
    to: 'warehouse-moscow',
    type: 'rail',
    status: 'active',
    volume: 500,
    cost: 25000,
    duration: 14,
    frequency: 'weekly',
    lastDelivery: '2024-01-15',
    nextDelivery: '2024-01-22'
  },
  {
    id: 'edge-shenzhen-spb',
    from: 'supplier-shenzhen',
    to: 'warehouse-spb',
    type: 'sea',
    status: 'active',
    volume: 800,
    cost: 35000,
    duration: 21,
    frequency: 'monthly',
    lastDelivery: '2024-01-10',
    nextDelivery: '2024-02-10'
  },
  {
    id: 'edge-shanghai-moscow',
    from: 'supplier-shanghai',
    to: 'warehouse-moscow',
    type: 'rail',
    status: 'completed',
    volume: 1200,
    cost: 45000,
    duration: 16,
    frequency: 'weekly',
    lastDelivery: '2024-01-18',
    nextDelivery: '2024-01-25'
  },
  {
    id: 'edge-yiwu-ekb',
    from: 'supplier-yiwu',
    to: 'warehouse-ekb',
    type: 'rail',
    status: 'delayed',
    volume: 400,
    cost: 20000,
    duration: 18,
    frequency: 'monthly',
    lastDelivery: '2024-01-05',
    nextDelivery: '2024-02-05'
  },
  {
    id: 'edge-shanghai-novosibirsk',
    from: 'supplier-shanghai',
    to: 'warehouse-novosibirsk',
    type: 'rail',
    status: 'planned',
    volume: 600,
    cost: 28000,
    duration: 12,
    frequency: 'monthly',
    nextDelivery: '2024-02-01'
  },
  
  // Внутренние поставки в России
  {
    id: 'edge-moscow-kazan',
    from: 'warehouse-moscow',
    to: 'distribution-kazan',
    type: 'road',
    status: 'active',
    volume: 200,
    cost: 5000,
    duration: 2,
    frequency: 'weekly',
    lastDelivery: '2024-01-19',
    nextDelivery: '2024-01-26'
  },
  {
    id: 'edge-moscow-krasnodar',
    from: 'warehouse-moscow',
    to: 'distribution-krasnodar',
    type: 'road',
    status: 'active',
    volume: 150,
    cost: 8000,
    duration: 3,
    frequency: 'weekly',
    lastDelivery: '2024-01-17',
    nextDelivery: '2024-01-24'
  },
  {
    id: 'edge-spb-moscow',
    from: 'warehouse-spb',
    to: 'warehouse-moscow',
    type: 'road',
    status: 'completed',
    volume: 300,
    cost: 6000,
    duration: 1,
    frequency: 'daily',
    lastDelivery: '2024-01-20',
    nextDelivery: '2024-01-21'
  },
  {
    id: 'edge-ekb-novosibirsk',
    from: 'warehouse-ekb',
    to: 'warehouse-novosibirsk',
    type: 'rail',
    status: 'active',
    volume: 250,
    cost: 4000,
    duration: 2,
    frequency: 'weekly',
    lastDelivery: '2024-01-16',
    nextDelivery: '2024-01-23'
  }
];

// Цвета для разных типов узлов
export const nodeColors = {
  supplier: '#e03131',    // красный для поставщиков
  warehouse: '#339af0',   // синий для складов
  distribution: '#51cf66', // зеленый для РЦ
  retail: '#fab005'       // желтый для розницы
};

// Цвета для разных статусов поставок
export const edgeColors = {
  active: '#51cf66',     // зеленый
  delayed: '#e03131',    // красный
  completed: '#339af0',  // синий
  planned: '#fab005'     // желтый
};

// Цвета для разных типов транспорта
export const transportColors = {
  sea: '#1c7ed6',       // темно-синий
  air: '#e03131',       // красный
  rail: '#51cf66',      // зеленый
  road: '#fab005'       // желтый
};