import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    MantineProvider,
    AppShell,
    Container,
    Grid,
    Card,
    Text,
    Title,
    Group,
    Badge,
    Button,
    Table,
    TextInput,
    Select,
    MultiSelect,
    Tabs,
    Progress,
    RingProgress,
    ThemeIcon,
    Paper,
    Stack,
    Flex,
    Box,
    ActionIcon,
    Menu,
    Avatar,
    Indicator,
    Timeline,
    Alert,
    NumberInput,
    SegmentedControl,
    Skeleton,
    Tooltip,
    Modal,
    Divider,
    useMantineTheme,
    Center,
    Loader,
    ScrollArea,
    Burger,
    ColorSwatch,
    HoverCard
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import YandexWarehouseMap from '../components/YandexWarehouseMap';
import {
    IconDashboard,
    IconPackage,
    IconTruck,
    IconMapPin,
    IconChartLine,
    IconCoin,
    IconChartBar,
    IconSettings,
    IconBell,
    IconSearch,
    IconFilter,
    IconDownload,
    IconRefresh,
    IconAlertCircle,
    IconTrendingUp,
    IconTrendingDown,
    IconEye,
    IconCalendar,
    IconClock,
    IconUser,
    IconLogout,
    IconMoon,
    IconSun,
    IconMenu2,
    IconX,
    IconChevronRight,
    IconExternalLink,
    IconInfoCircle,
    IconCircleCheck,
    IconAlertTriangle,
    IconPackageOff,
    IconBuildingWarehouse,
    IconCurrencyRubel,
    IconPercentage,
    IconArrowUp,
    IconArrowDown,
    IconDots,
    IconListDetails,
    IconSkull,
    IconFlame,
    IconTarget,
    IconRotate,
    IconBan,
    IconCalculator
} from '@tabler/icons-react';
// import WarehouseMap from '../components/WarehouseMap';

// Интерфейсы для типизации
interface Product {
    id: number;
    sku: string;
    name: string;
    category: string;
    vendorCode: string;
    barcode: string;
    warehouseStocks: Record<string, number>;
    totalStock: number;
    inTransit: number;
    atPickupPoints: number;
    avgSales: number;
    daysLeft: number;
    buyoutRate: number;
    lastDeliveryDate: string;
    plannedDelivery: string | null;
    status: string;
    price: number;
    storageCost: string;
    abc: string;
    xyz: string;
}

interface Delivery {
    id: number;
    orderNumber: string;
    items: number;
    totalQuantity: number;
    packed: number;
    accepted: number;
    inSale: number;
    plannedDate: string;
    actualDate: string | null;
    warehouse: string;
    status: string;
}

interface PickupPoint {
    id: number;
    city: string;
    address: string;
    orders: number;
    buyoutRate: number;
    avgDaysToPickup: number;
    returns: number;
}

// Дополнительные интерфейсы для ABC-XYZ анализа
interface ABCXYZGroup {
    count: number;
    revenue: number;
    stockDays: number;
    norm: string;
    turnover: number;
    status: string;
}

interface ABCXYZMatrix {
    [key: string]: ABCXYZGroup;
}

interface CZProduct {
    sku: string;
    name: string;
    stock: number;
    stockValue: number;
    monthlyLoss: number;
    liquidationDiscount: number;
    daysSinceLastSale: number;
}

// Генерация тестовых данных
const generateTestDataFirst = () => {
    const warehouses = ['Коледино', 'Электросталь', 'Казань', 'Екатеринбург', 'Новосибирск', 'Краснодар',
                        'Санкт-Петербург', 'Ростов-на-Дону', 'Самара', 'Челябинск', 'Хабаровск', 'Тольятти',
                        'Уфа', 'Воронеж', 'Владивосток', 'Нижний Новгород', 'Омск', 'Красноярск'];
    const categories = ['Одежда', 'Обувь', 'Электроника', 'Косметика', 'Товары для дома', 'Спорттовары'];
    
    // Генерация SKU
    const products: Product[] = Array.from({ length: 150 }, (_, i) => {
        const warehouseStocks: Record<string, number> = {};
        warehouses.forEach(w => {
            warehouseStocks[w] = Math.floor(Math.random() * 500);
        });
        
        const totalStock = Object.values(warehouseStocks).reduce((a, b) => a + b, 0);
        const avgSales = Math.floor(Math.random() * 50) + 5;
        const daysLeft = Math.floor(totalStock / avgSales);
        const buyoutRate = 65 + Math.random() * 30;
        
        return {
            id: i + 1,
            sku: `WB${String(i + 1).padStart(8, '0')}`,
            name: `Товар ${i + 1}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            vendorCode: `ART-${String(i + 1).padStart(5, '0')}`,
            barcode: `460${String(Math.floor(Math.random() * 1000000000)).padStart(10, '0')}`,
            warehouseStocks,
            totalStock,
            inTransit: Math.floor(Math.random() * 100),
            atPickupPoints: Math.floor(Math.random() * 50),
            avgSales,
            daysLeft,
            buyoutRate,
            lastDeliveryDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            plannedDelivery: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
            status: daysLeft < 7 ? 'Критический запас' : daysLeft > 60 ? 'Избыток' : 'В продаже',
            price: Math.floor(Math.random() * 5000) + 500,
            storageCost: (Math.random() * 50 + 10).toFixed(2),
            abc: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
            xyz: ['X', 'Y', 'Z'][Math.floor(Math.random() * 3)]
        };
    });

    // Генерация поставок
    const deliveries: Delivery[] = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        orderNumber: `П-2024${String(i + 1).padStart(5, '0')}`,
        items: Math.floor(Math.random() * 10) + 1,
        totalQuantity: Math.floor(Math.random() * 1000) + 100,
        packed: Math.floor(Math.random() * 1000) + 100,
        accepted: Math.floor(Math.random() * 900) + 50,
        inSale: Math.floor(Math.random() * 800) + 50,
        plannedDate: new Date(Date.now() + (i - 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        actualDate: i < 15 ? new Date(Date.now() + (i - 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
        warehouse: warehouses[Math.floor(Math.random() * warehouses.length)],
        status: i < 10 ? 'Принята' : i < 15 ? 'На приемке' : i < 20 ? 'В пути' : 'Запланирована'
    }));

    // Генерация данных по ПВЗ
    const pickupPoints: PickupPoint[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        city: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Челябинск'][Math.floor(Math.random() * 6)],
        address: `ул. Примерная, д. ${Math.floor(Math.random() * 100) + 1}`,
        orders: Math.floor(Math.random() * 50) + 10,
        buyoutRate: 60 + Math.random() * 35,
        avgDaysToPickup: Math.random() * 5 + 1,
        returns: Math.floor(Math.random() * 10)
    }));

    return { products, deliveries, pickupPoints };
};

// Компонент с графиком ECharts (заглушка для будущего внедрения)
const EChartsComponent: React.FC<{ option: any; style?: React.CSSProperties }> = ({ 
    option, 
    style = { height: '400px', width: '100%' } 
}) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Здесь будет инициализация ECharts
        console.log('ECharts option:', option);
    }, [option]);

    return (
        <div 
            ref={chartRef} 
            style={{ 
                ...style, 
                background: '#f8f9fa', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px dashed #ced4da',
                borderRadius: '8px'
            }}
        >
            <Text c="dimmed">График ECharts (в разработке)</Text>
        </div>
    );
};

// Компонент красивой воронки товародвижения
const SalesFunnel: React.FC<{ data: any[]; onStageClick?: (stage: string) => void }> = ({ 
    data, 
    onStageClick 
}) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
        <Stack gap="md">
            {data.map((stage, index) => {
                const widthPercent = (stage.value / maxValue) * 100;
                const isFirst = index === 0;
                const isLast = index === data.length - 1;
                
                // Цвета для каждого этапа
                const colors = ['#4c6ef5', '#51cf66', '#fab005', '#fd7e14'];
                const color = colors[index] || '#868e96';
                
                return (
                    <div key={stage.stage}>
                        {/* Воронка */}
                        <Paper
                            p="md"
                            style={{
                                background: `linear-gradient(135deg, ${color}, ${color}aa)`,
                                color: 'white',
                                cursor: onStageClick ? 'pointer' : 'default',
                                width: `${Math.max(widthPercent, 30)}%`,
                                margin: '0 auto',
                                clipPath: isFirst 
                                    ? 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)'
                                    : isLast 
                                    ? 'polygon(5% 0, 95% 0, 90% 100%, 10% 100%)'
                                    : 'polygon(5% 0, 95% 0, 90% 100%, 10% 100%)',
                                transition: 'all 0.3s ease',
                                minHeight: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                position: 'relative',
                                borderRadius: isFirst ? '12px 12px 0 0' : isLast ? '0 0 12px 12px' : '0'
                            }}
                            onClick={() => onStageClick?.(stage.stage)}
                            onMouseEnter={(e) => {
                                if (onStageClick) {
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (onStageClick) {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                }
                            }}
                        >
                            <Text size="lg" fw={700} ta="center" mb="xs">
                                {stage.stage}
                            </Text>
                            <Group gap="xs" justify="center">
                                <Text size="xl" fw={900}>
                                    {stage.value.toLocaleString()}
                                </Text>
                                {index > 0 && (
                                    <Badge 
                                        color="white" 
                                        variant="filled"
                                        style={{ 
                                            backgroundColor: 'rgba(255,255,255,0.9)', 
                                            color: color,
                                            fontWeight: 700
                                        }}
                                    >
                                        {stage.conversion}%
                                    </Badge>
                                )}
                            </Group>
                            
                            {/* Дополнительная информация */}
                            {index > 0 && (
                                <Text size="xs" style={{ opacity: 0.9 }} ta="center">
                                    -{(data[index-1].value - stage.value).toLocaleString()} от предыдущего этапа
                                </Text>
                            )}
                        </Paper>
                        
                        {/* Стрелка между этапами */}
                        {index < data.length - 1 && (
                            <Center my="xs">
                                <div style={{
                                    width: 0,
                                    height: 0,
                                    borderLeft: '12px solid transparent',
                                    borderRight: '12px solid transparent',
                                    borderTop: `20px solid ${color}`,
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                }} />
                            </Center>
                        )}
                    </div>
                );
            })}
            
            {/* Итоговая статистика */}
            <Paper p="sm" withBorder mt="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Group justify="space-around">
                    <div style={{ textAlign: 'center' }}>
                        <Text size="xs" c="dimmed">Общая конверсия</Text>
                        <Text size="sm" fw={700} c="green">
                            {((data[data.length - 1].value / data[0].value) * 100).toFixed(1)}%
                        </Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Text size="xs" c="dimmed">Потери на каждом этапе</Text>
                        <Text size="sm" fw={700} c="orange">
                            {data.map((stage, i) => i > 0 ? `${100 - stage.conversion}%` : '0%').join(' → ')}
                        </Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Text size="xs" c="dimmed">Эффективность воронки</Text>
                        <Text size="sm" fw={700} c="blue">
                            {data[data.length - 1].conversion > 75 ? 'Отлично' : 
                             data[data.length - 1].conversion > 60 ? 'Хорошо' : 'Требует улучшения'}
                        </Text>
                    </div>
                </Group>
            </Paper>
        </Stack>
    );
};

// Элегантная профессиональная воронка товародвижения в лучших практиках
const ProfessionalSalesFunnel: React.FC<{ data: any[]; onStageClick?: (stage: string) => void }> = ({ 
    data, 
    onStageClick 
}) => {
    const [hoveredStage, setHoveredStage] = useState<number | null>(null);
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
        <Stack gap="lg">
            {/* Заголовок с общей конверсией */}
            <Group justify="space-between" align="center">
                <div>
                    <Text size="lg" fw={700} c="dark">🚀 Воронка товародвижения</Text>
                    <Text size="sm" c="dimmed">Анализ конверсии по этапам покупательского пути</Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Text size="sm" c="dimmed" fw={500}>Общая конверсия</Text>
                    <Badge size="xl" variant="gradient" gradient={{ from: 'green', to: 'teal' }} fw={700}>
                        {((data[data.length - 1].value / data[0].value) * 100).toFixed(1)}%
                    </Badge>
                </div>
            </Group>

            {/* Воронка с правильными пропорциями */}
            <Paper p="xl" withBorder radius="xl" style={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                border: '1px solid #e2e8f0'
            }}>
                <Stack gap="xl">
                    {data.map((stage, index) => {
                        const widthPercent = Math.max((stage.value / maxValue) * 100, 20);
                        const isHovered = hoveredStage === index;
                        
                        // Элегантные цвета для каждого этапа
                        const stageColors = [
                            { main: '#3b82f6', light: '#dbeafe', dark: '#1d4ed8', bg: '#eff6ff' },
                            { main: '#8b5cf6', light: '#e9d5ff', dark: '#7c3aed', bg: '#f3e8ff' },
                            { main: '#06b6d4', light: '#cffafe', dark: '#0891b2', bg: '#ecfeff' },
                            { main: '#10b981', light: '#d1fae5', dark: '#059669', bg: '#ecfdf5' }
                        ];
                        const colors = stageColors[index] || stageColors[0];
                        
                        // Иконки для этапов
                        const StageIcon = [IconEye, IconPackage, IconTruck, IconCircleCheck][index];
                        
                        return (
                            <div key={stage.stage} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                {/* Основной блок воронки */}
                                <div
                                    style={{
                                        width: `${widthPercent}%`,
                                        minWidth: '280px',
                                        maxWidth: '100%',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={() => setHoveredStage(index)}
                                    onMouseLeave={() => setHoveredStage(null)}
                                >
                                    <Paper
                                        p="xl"
                                        radius="xl"
                                        style={{
                                            background: isHovered 
                                                ? `linear-gradient(135deg, ${colors.main} 0%, ${colors.dark} 100%)`
                                                : `linear-gradient(135deg, ${colors.bg} 0%, ${colors.light} 100%)`,
                                            border: `2px solid ${isHovered ? colors.main : colors.light}`,
                                            color: isHovered ? 'white' : colors.dark,
                                            cursor: onStageClick ? 'pointer' : 'default',
                                            transform: isHovered ? 'scale(1.03) translateY(-8px)' : 'scale(1)',
                                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            boxShadow: isHovered 
                                                ? `0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px ${colors.main}40` 
                                                : '0 8px 30px rgba(0,0,0,0.08)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        onClick={() => onStageClick?.(stage.stage)}
                                    >
                                        {/* Декоративные элементы */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '6px',
                                            background: `linear-gradient(90deg, ${colors.main}, ${colors.dark}, ${colors.main})`,
                                            opacity: isHovered ? 1 : 0.7
                                        }} />
                                        
                                        {!isHovered && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '20px',
                                                right: '20px',
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '50%',
                                                background: `${colors.main}10`,
                                                opacity: 0.5
                                            }} />
                                        )}
                                        
                                        {/* Содержимое */}
                                        <Group justify="space-between" align="flex-start" mb="lg">
                                            <div style={{ flex: 1 }}>
                                                <Group gap="lg" mb="md">
                                                    <ThemeIcon 
                                                        size={52} 
                                                        radius="xl" 
                                                        variant={isHovered ? "white" : "light"}
                                                        color={isHovered ? "white" : colors.main}
                                                        style={{ 
                                                            backgroundColor: isHovered ? 'rgba(255,255,255,0.2)' : colors.light,
                                                            border: isHovered ? '2px solid rgba(255,255,255,0.3)' : `2px solid ${colors.main}30`,
                                                            boxShadow: isHovered ? '0 8px 25px rgba(0,0,0,0.15)' : `0 4px 15px ${colors.main}20`
                                                        }}
                                                    >
                                                        <StageIcon size={28} style={{ color: isHovered ? 'white' : colors.main }} />
                                                    </ThemeIcon>
                                                    <div>
                                                        <Text size="xl" fw={800} mb={6}>
                                                            {stage.stage}
                                                        </Text>
                                                        <Text size="sm" fw={500} style={{ opacity: isHovered ? 0.9 : 0.7 }}>
                                                            Этап {index + 1} из {data.length}
                                                        </Text>
                                                    </div>
                                                </Group>
                                            </div>
                                            
                                            {/* Значения */}
                                            <div style={{ textAlign: 'right' }}>
                                                <Text size="2xl" fw={900} mb="sm" style={{ fontSize: '2rem' }}>
                                                    {stage.value > 1000 ? `${(stage.value / 1000).toFixed(1)}k` : stage.value.toLocaleString()}
                                                </Text>
                                                {index > 0 && (
                                                    <Badge 
                                                        size="xl"
                                                        variant={isHovered ? "white" : "light"}
                                                        color={isHovered ? "white" : colors.main}
                                                        style={{ 
                                                            backgroundColor: isHovered ? 'rgba(255,255,255,0.25)' : colors.light,
                                                            color: isHovered ? 'white' : colors.main,
                                                            fontWeight: 800,
                                                            fontSize: '0.9rem'
                                                        }}
                                                    >
                                                        {stage.conversion}%
                                                    </Badge>
                                                )}
                                            </div>
                                        </Group>
                                        
                                        {/* Прогресс-бар */}
                                        <div style={{ 
                                            width: '100%', 
                                            height: '8px', 
                                            backgroundColor: isHovered ? 'rgba(255,255,255,0.2)' : colors.light,
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                            marginBottom: '12px'
                                        }}>
                                            <div style={{
                                                width: `${(stage.value / maxValue) * 100}%`,
                                                height: '100%',
                                                background: isHovered ? 'white' : `linear-gradient(90deg, ${colors.main}, ${colors.dark})`,
                                                borderRadius: '4px',
                                                transition: 'all 0.6s ease',
                                                boxShadow: isHovered ? '0 2px 8px rgba(255,255,255,0.3)' : `0 2px 8px ${colors.main}30`
                                            }} />
                                        </div>
                                        
                                        {/* Дополнительная информация */}
                                        <Group justify="space-between" align="center">
                                            {index > 0 && (
                                                <div>
                                                    <Text size="sm" fw={600} style={{ opacity: isHovered ? 0.9 : 0.8 }}>
                                                        Потери: {(data[index-1].value - stage.value).toLocaleString()}
                                                    </Text>
                                                    <Text size="xs" fw={500} style={{ opacity: isHovered ? 0.8 : 0.6 }}>
                                                        от предыдущего этапа
                                                    </Text>
                                                </div>
                                            )}
                                            {index === 0 && (
                                                <Text size="sm" fw={600} style={{ opacity: isHovered ? 0.9 : 0.8 }}>
                                                    Начальная точка воронки
                                                </Text>
                                            )}
                                            <div style={{ textAlign: 'right' }}>
                                                <Text size="xs" fw={500} style={{ opacity: isHovered ? 0.8 : 0.6 }}>
                                                    Доля от входа
                                                </Text>
                                                <Text size="sm" fw={700} style={{ opacity: isHovered ? 0.9 : 0.8 }}>
                                                    {((stage.value / data[0].value) * 100).toFixed(1)}%
                                                </Text>
                                            </div>
                                        </Group>
                                    </Paper>
                                    
                                    {/* Элегантный коннектор между этапами */}
                                    {index < data.length - 1 && (
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'center', 
                                            margin: '20px 0',
                                            position: 'relative'
                                        }}>
                                            {/* Линия соединения */}
                                            <div style={{
                                                width: '3px',
                                                height: '30px',
                                                background: `linear-gradient(180deg, ${colors.main}, ${stageColors[index + 1]?.main || colors.main})`,
                                                borderRadius: '1.5px',
                                                opacity: 0.7
                                            }} />
                                            {/* Стрелка */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '22px',
                                                width: 0,
                                                height: 0,
                                                borderLeft: '8px solid transparent',
                                                borderRight: '8px solid transparent',
                                                borderTop: `12px solid ${stageColors[index + 1]?.main || colors.main}`,
                                                filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))'
                                            }} />
                                            {/* Потери */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '8px',
                                                left: '20px',
                                                padding: '4px 8px',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                color: '#dc2626',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                borderRadius: '6px',
                                                border: '1px solid rgba(239, 68, 68, 0.2)'
                                            }}>
                                                -{((data[index].value - data[index + 1].value) / 1000).toFixed(1)}k
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </Stack>
            </Paper>
            
            {/* Итоговая аналитика */}
            <Paper p="xl" withBorder radius="xl" style={{ 
                background: 'linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)',
                border: '1px solid #e2e8f0'
            }}>
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 3 }}>
                        <Group justify="center" gap="lg">
                            <ThemeIcon size={56} radius="xl" variant="gradient" gradient={{ from: 'green', to: 'teal' }}>
                                <IconTarget size={28} />
                            </ThemeIcon>
                            <div style={{ textAlign: 'center' }}>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Общая конверсия</Text>
                                <Text size="2xl" fw={900} c="green" style={{ fontSize: '2rem' }}>
                                    {((data[data.length - 1].value / data[0].value) * 100).toFixed(1)}%
                                </Text>
                                <Text size="xs" c="dimmed">от всех просмотров</Text>
                            </div>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 3 }}>
                        <Group justify="center" gap="lg">
                            <ThemeIcon size={56} radius="xl" variant="gradient" gradient={{ from: 'orange', to: 'red' }}>
                                <IconTrendingDown size={28} />
                            </ThemeIcon>
                            <div style={{ textAlign: 'center' }}>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Общие потери</Text>
                                <Text size="2xl" fw={900} c="orange" style={{ fontSize: '2rem' }}>
                                    {((data[0].value - data[data.length - 1].value) / 1000).toFixed(1)}k
                                </Text>
                                <Text size="xs" c="dimmed">пользователей потеряно</Text>
                            </div>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 3 }}>
                        <Group justify="center" gap="lg">
                            <ThemeIcon size={56} radius="xl" variant="gradient" gradient={{ from: 'blue', to: 'violet' }}>
                                <IconChartBar size={28} />
                            </ThemeIcon>
                            <div style={{ textAlign: 'center' }}>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Эффективность</Text>
                                <Badge 
                                    size="xl" 
                                    color={((data[data.length - 1].value / data[0].value) * 100) > 75 ? 'green' : 'yellow'}
                                    variant="gradient"
                                    gradient={((data[data.length - 1].value / data[0].value) * 100) > 75 ? 
                                        { from: 'green', to: 'teal' } : 
                                        { from: 'yellow', to: 'orange' }
                                    }
                                    fw={800}
                                >
                                    {((data[data.length - 1].value / data[0].value) * 100) > 75 ? 'Отлично' : 'Хорошо'}
                                </Badge>
                                <Text size="xs" c="dimmed">уровень воронки</Text>
                            </div>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 3 }}>
                        <Group justify="center" gap="lg">
                            <ThemeIcon size={56} radius="xl" variant="gradient" gradient={{ from: 'violet', to: 'pink' }}>
                                <IconClock size={28} />
                            </ThemeIcon>
                            <div style={{ textAlign: 'center' }}>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Время пути</Text>
                                <Text size="2xl" fw={900} c="violet" style={{ fontSize: '2rem' }}>
                                    2.3д
                                </Text>
                                <Text size="xs" c="dimmed">средний цикл</Text>
                            </div>
                        </Group>
                    </Grid.Col>
                </Grid>
            </Paper>
        </Stack>
    );
};



const WarehouseAndLogisticsPageExt: React.FC = () => {
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
    const [activeTab, setActiveTab] = useState('overview');
    const [opened, setOpened] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const theme = useMantineTheme();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const { products, deliveries, pickupPoints } = generateTestDataFirst();

    const toggleColorScheme = () => {
        setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
    };

    // KPI метрики
    const kpiData = [
        {
            title: 'Остатки на складах',
            value: '45,382',
            unit: 'шт',
            change: +12.5,
            icon: IconPackage,
            color: 'blue',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            title: 'В пути к покупателям',
            value: '3,847',
            unit: 'шт',
            change: -3.2,
            icon: IconTruck,
            color: 'orange',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            title: 'Общий % выкупа',
            value: '78.4',
            unit: '%',
            change: +2.1,
            icon: IconPercentage,
            color: 'green',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            title: 'Оборачиваемость',
            value: '24.7',
            unit: 'дней',
            change: -5.8,
            icon: IconRefresh,
            color: 'violet',
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        }
    ];

    // Расширенные KPI данные для склада
    const warehouseKPIs = [
        {
            title: 'Остатки на складах WB',
            value: '45,382',
            unit: 'шт',
            change: +12.5,
            icon: IconBuildingWarehouse,
            color: 'blue',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            details: { warehouses: 6, avgStock: 7563, critical: 15 }
        },
        {
            title: 'Товары в пути',
            value: '3,847',
            unit: 'шт',
            change: -3.2,
            icon: IconTruck,
            color: 'orange',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            details: { deliveries: 12, avgTime: 3.2, delayed: 3 }
        },
        {
            title: '% выкупа (общий)',
            value: '78.4',
            unit: '%',
            change: +2.1,
            icon: IconPercentage,
            color: 'green',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            details: { target: 85, categories: { shoes: 68, clothes: 82, accessories: 75 } }
        },
        {
            title: 'Оборачиваемость',
            value: '24.7',
            unit: 'дней',
            change: -5.8,
            icon: IconRotate,
            color: 'violet',
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            details: { target: 20, slow: 45, fast: 156 }
        },
        {
            title: 'Критический запас',
            value: '23',
            unit: 'товаров',
            change: +8.2,
            icon: IconAlertTriangle,
            color: 'red',
            gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
            details: { threshold: 3, urgent: 15, warning: 8 }
        },
        {
            title: 'Эффективность поставок',
            value: '92.3',
            unit: '%',
            change: +4.1,
            icon: IconTarget,
            color: 'green',
            gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
            details: { onTime: 28, delayed: 3, cancelled: 1 }
        }
    ];

    // Графики для дашборда (опции будут использоваться когда подключим ECharts)
    const salesChartOption = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Продажи', 'Выкупа', 'Возвраты'] },
        yAxis: { type: 'value' },
        series: [
            {
                name: 'Продажи',
                type: 'line',
                data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 300) + 200)
            }
        ]
    };

    // Данные для ABC-XYZ анализа
    const abcxyzData: ABCXYZMatrix = {
        AX: { count: 85, revenue: 45, stockDays: 12, norm: '10-15', turnover: 28, status: 'optimal' },
        AY: { count: 45, revenue: 20, stockDays: 25, norm: '20-30', turnover: 14.5, status: 'good' },
        AZ: { count: 25, revenue: 10, stockDays: 38, norm: '30-45', turnover: 9.5, status: 'attention' },
        BX: { count: 156, revenue: 12, stockDays: 18, norm: '15-25', turnover: 20, status: 'optimal' },
        BY: { count: 89, revenue: 6, stockDays: 32, norm: '25-40', turnover: 11.2, status: 'good' },
        BZ: { count: 67, revenue: 2, stockDays: 48, norm: '40-60', turnover: 7.6, status: 'good' },
        CX: { count: 234, revenue: 3, stockDays: 28, norm: '20-35', turnover: 13, status: 'good' },
        CY: { count: 178, revenue: 1.5, stockDays: 45, norm: '30-60', turnover: 8.1, status: 'good' },
        CZ: { count: 421, revenue: 0.5, stockDays: 125, norm: '0-30', turnover: 2.9, status: 'critical' }
    };

    const czProducts: CZProduct[] = [
        { 
            sku: 'CZ-001', 
            name: 'Сумка кожаная (старая коллекция)', 
            stock: 120, 
            stockValue: 480000,
            monthlyLoss: 8500,
            liquidationDiscount: 60,
            daysSinceLastSale: 142 
        },
        { 
            sku: 'CZ-002', 
            name: 'Пальто зимнее (прошлый сезон)', 
            stock: 45, 
            stockValue: 360000,
            monthlyLoss: 6200,
            liquidationDiscount: 70,
            daysSinceLastSale: 98 
        },
        { 
            sku: 'CZ-003', 
            name: 'Аксессуары декоративные', 
            stock: 380, 
            stockValue: 114000,
            monthlyLoss: 2850,
            liquidationDiscount: 80,
            daysSinceLastSale: 215 
        }
    ];

    // Состояние для модальных окон
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [groupModalOpened, setGroupModalOpened] = useState(false);
    const [liquidationModalOpened, setLiquidationModalOpened] = useState(false);
    const [funnelModalOpened, setFunnelModalOpened] = useState(false);
    const [selectedFunnelStage, setSelectedFunnelStage] = useState<string | null>(null);

    // Функции для статусов
    const getGroupStatus = (group: string): string => {
        const groupData = abcxyzData[group];
        const [minNorm, maxNorm] = groupData.norm.split('-').map((n: string) => parseInt(n));
        
        if (group === 'CZ') {
            return groupData.stockDays > 30 ? 'critical' : 'warning';
        }
        
        if (groupData.stockDays < minNorm * 0.8) {
            return 'low';
        } else if (groupData.stockDays > maxNorm * 1.5) {
            return 'excess';
        } else if (groupData.stockDays > maxNorm * 1.2) {
            return 'warning';
        }
        return 'optimal';
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            optimal: 'green',
            good: 'blue',
            warning: 'yellow',
            attention: 'orange',
            critical: 'red',
            low: 'grape',
            excess: 'pink'
        };
        return colors[status] || 'gray';
    };

    const handleCellClick = (group: string) => {
        setSelectedGroup(group);
        setGroupModalOpened(true);
    };

    // Фильтрация продуктов
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesWarehouse = !selectedWarehouse || product.warehouseStocks[selectedWarehouse] > 0;
            const matchesCategory = !selectedCategory || product.category === selectedCategory;
            return matchesSearch && matchesWarehouse && matchesCategory;
        });
    }, [searchQuery, selectedWarehouse, selectedCategory, products]);

    const renderOverview = () => {
        // Данные для карты остатков по складам - расширенный список
        const warehouseStockData = [
            { name: 'Коледино', stock: 15420, capacity: 20000, utilization: 77, critical: 5 },
            { name: 'Электросталь', stock: 12880, capacity: 15000, utilization: 86, critical: 3 },
            { name: 'Казань', stock: 8945, capacity: 12000, utilization: 75, critical: 4 },
            { name: 'Екатеринбург', stock: 6730, capacity: 10000, utilization: 67, critical: 2 },
            { name: 'Новосибирск', stock: 4680, capacity: 8000, utilization: 59, critical: 1 },
            { name: 'Краснодар', stock: 3240, capacity: 6000, utilization: 54, critical: 0 },
            { name: 'Санкт-Петербург', stock: 11200, capacity: 14000, utilization: 80, critical: 6 },
            { name: 'Ростов-на-Дону', stock: 5480, capacity: 7500, utilization: 73, critical: 2 },
            { name: 'Самара', stock: 4920, capacity: 6500, utilization: 76, critical: 3 },
            { name: 'Челябинск', stock: 3850, capacity: 5000, utilization: 77, critical: 1 },
            { name: 'Хабаровск', stock: 2180, capacity: 3500, utilization: 62, critical: 0 },
            { name: 'Тольятти', stock: 3650, capacity: 5000, utilization: 73, critical: 2 },
            { name: 'Уфа', stock: 4120, capacity: 5500, utilization: 75, critical: 3 },
            { name: 'Воронеж', stock: 3280, capacity: 4200, utilization: 78, critical: 1 },
            { name: 'Владивосток', stock: 1950, capacity: 3000, utilization: 65, critical: 0 },
            { name: 'Нижний Новгород', stock: 5640, capacity: 7000, utilization: 81, critical: 4 },
            { name: 'Омск', stock: 2890, capacity: 4000, utilization: 72, critical: 1 },
            { name: 'Красноярск', stock: 3470, capacity: 4500, utilization: 77, critical: 2 }
        ];



        // Топ-10 товаров с риском out-of-stock
        const outOfStockRisk = [
            { sku: 'WB00001234', name: 'Кроссовки Nike Air Max', stock: 5, dailySales: 2.5, daysLeft: 2, risk: 95 },
            { sku: 'WB00001235', name: 'Футболка базовая', stock: 8, dailySales: 4, daysLeft: 2, risk: 90 },
            { sku: 'WB00001236', name: 'Джинсы классические', stock: 12, dailySales: 3, daysLeft: 4, risk: 85 },
            { sku: 'WB00001237', name: 'Кроссовки Adidas', stock: 15, dailySales: 3.5, daysLeft: 4.3, risk: 80 },
            { sku: 'WB00001238', name: 'Платье летнее', stock: 18, dailySales: 3, daysLeft: 6, risk: 75 }
        ];

        return (
            <Stack gap="lg">
                {/* 🚨 Критические предупреждения */}
                <Paper p="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <Group>
                            <ThemeIcon size="lg" variant="light" color="red">
                                <IconAlertTriangle size={20} />
                            </ThemeIcon>
                            <div>
                                <Text fw={600} size="lg">🚨 Критические предупреждения</Text>
                                <Text size="sm" c="dimmed">Требуют немедленного внимания</Text>
                            </div>
                        </Group>
                        <Badge color="red" variant="filled" size="lg">
                            {warehouseAlerts.filter(a => a.type === 'critical').length} критических
                        </Badge>
                    </Group>

                    <Grid>
                        {warehouseAlerts.map(alert => (
                            <Grid.Col key={alert.id} span={{ base: 12, sm: 6, md: 3 }}>
                                <Paper 
                                    p="sm" 
                                    withBorder 
                                    style={{ 
                                        borderColor: `var(--mantine-color-${alert.color}-5)`,
                                        backgroundColor: `var(--mantine-color-${alert.color}-0)`
                                    }}
                                >
                                    <Group justify="space-between" mb="xs">
                                        <ThemeIcon size="md" color={alert.color} variant="light">
                                            <alert.icon size={16} />
                                        </ThemeIcon>
                                        <Badge color={alert.color} size="sm">
                                            {alert.count}
                                        </Badge>
                                    </Group>
                                    <Text size="sm" fw={600} mb="xs">{alert.title}</Text>
                                    <Text size="xs" c="dimmed" mb="md">{alert.description}</Text>
                                    <Button size="xs" variant="light" color={alert.color} fullWidth>
                                        Исправить
                                    </Button>
                                </Paper>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Paper>

                {/* 📈 KPI метрики (карточки) */}
                <Paper p="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <div>
                            <Text fw={600} size="lg">📈 KPI метрики</Text>
                            <Text size="sm" c="dimmed">Ключевые показатели эффективности</Text>
                        </div>
                        <Group>
                            <Button leftSection={<IconRefresh size={16} />} variant="light" size="sm">
                                Обновить
                            </Button>
                            <Button leftSection={<IconDownload size={16} />} variant="light" size="sm">
                                Экспорт
                            </Button>
                        </Group>
                    </Group>

                    <Grid>
                        {warehouseKPIs.map((kpi, index) => {
                            const Icon = kpi.icon;
                            return (
                                <Grid.Col key={index} span={{ base: 12, xs: 6, sm: 4, md: 2 }}>
                                    <Paper
                                        p="md"
                                        withBorder
                                        style={{
                                            background: kpi.gradient,
                                            color: 'white',
                                            transition: 'transform 0.2s ease',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'
                                        }
                                    >
                                        <Group justify="space-between" align="flex-start">
                                            <div>
                                                <Text size="xs" fw={500} style={{ opacity: 0.9 }}>
                                                    {kpi.title}
                                                </Text>
                                                <Group gap="xs" align="baseline" mt="xs">
                                                    <Title order={2} style={{ fontSize: '1.8rem' }}>
                                                        {kpi.value}
                                                    </Title>
                                                    <Text size="sm" fw={600}>
                                                        {kpi.unit}
                                                    </Text>
                                                </Group>
                                                <Group gap="xs" mt="sm">
                                                    {kpi.change > 0 ? (
                                                        <IconTrendingUp size={14} />
                                                    ) : (
                                                        <IconTrendingDown size={14} />
                                                    )}
                                                    <Text size="sm" fw={600}>
                                                        {kpi.change > 0 ? '+' : ''}{kpi.change}%
                                                    </Text>
                                                </Group>
                                            </div>
                                            <ThemeIcon
                                                size={42}
                                                radius="md"
                                                variant="light"
                                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                            >
                                                <Icon size={24} style={{ color: 'white' }} />
                                            </ThemeIcon>
                                        </Group>
                                    </Paper>
                                </Grid.Col>
                            );
                        })}
                    </Grid>
                </Paper>

                {/* 📊 Визуализации */}
                <Paper p="md" withBorder>
                    <Text fw={600} size="lg" mb="md">📊 Визуализации</Text>
                    
                    <Grid>
                        {/* Карта остатков по складам (тепловая) */}
                        <Grid.Col span={{ base: 12, md: 12 }}>
                            <Paper p="md" withBorder>
                                <Group justify="space-between" mb="md">
                                    <Text fw={600}>Карта остатков по складам</Text>
                                    <Tooltip label="Тепловая карта загрузки складов">
                                        <ActionIcon variant="subtle" size="sm">
                                            <IconInfoCircle size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                                
                                {/* Интерактивная карта складов с кружочками */}
                                <YandexWarehouseMap />
                            </Paper>
                        </Grid.Col>



                        {/* График выкупаемости */}
                        <Grid.Col span={{ base: 12, md: 8 }}>
                            <Paper p="md" withBorder>
                                <Text fw={600} mb="md">График выкупаемости (последние 30 дней)</Text>
                                <EChartsComponent 
                                    option={{
                                        tooltip: { trigger: 'axis' },
                                        legend: { data: ['Заказы', 'Выкупа', '% выкупа'] },
                                        xAxis: { 
                                            type: 'category', 
                                            data: Array.from({ length: 30 }, (_, i) => `${i + 1}.06`) 
                                        },
                                        yAxis: [
                                            { type: 'value', name: 'Количество' },
                                            { type: 'value', name: '% выкупа', position: 'right' }
                                        ],
                                        series: [
                                            {
                                                name: 'Продажи',
                                                type: 'bar',
                                                data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50)
                                            },
                                            {
                                                name: 'Выкупы',
                                                type: 'bar',
                                                data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 80) + 40)
                                            },
                                            {
                                                name: '% выкупа',
                                                type: 'line',
                                                yAxisIndex: 1,
                                                data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 70)
                                            }
                                        ]
                                    }} 
                                    style={{ height: '300px' }} 
                                />
                            </Paper>
                        </Grid.Col>

                        {/* Топ-10 риск out-of-stock */}
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Paper p="md" withBorder>
                                <Group justify="space-between" mb="md">
                                    <Text fw={600}>Топ-10 риск out-of-stock</Text>
                                    <Badge color="red" variant="light">
                                        {outOfStockRisk.length} товаров
                                    </Badge>
                                </Group>
                                
                                <ScrollArea h={300}>
                                    <Stack gap="xs">
                                        {outOfStockRisk.map(item => (
                                            <Paper key={item.sku} p="sm" radius="md" withBorder>
                                                <Group justify="space-between" mb="xs">
                                                    <Text size="xs" fw={500}>{item.sku}</Text>
                                                    <Badge 
                                                        color={item.risk > 90 ? 'red' : item.risk > 80 ? 'orange' : 'yellow'}
                                                        size="xs"
                                                    >
                                                        {item.risk}%
                                                    </Badge>
                                                </Group>
                                                <Text size="xs" c="dimmed" mb="xs">{item.name}</Text>
                                                <Group justify="space-between" align="center">
                                                    <Text size="xs">
                                                        {item.stock} шт / {item.daysLeft.toFixed(1)} дн.
                                                    </Text>
                                                    <Progress 
                                                        value={item.risk} 
                                                        color={item.risk > 90 ? 'red' : item.risk > 80 ? 'orange' : 'yellow'}
                                                        size="xs"
                                                        style={{ width: 50 }}
                                                    />
                                                </Group>
                                            </Paper>
                                        ))}
                                    </Stack>
                                </ScrollArea>
                            </Paper>
                        </Grid.Col>
                    </Grid>
                </Paper>

                {/* ⚡ Быстрые действия */}
                <Paper p="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <div>
                            <Text fw={600} size="lg">⚡ Быстрые действия</Text>
                            <Text size="sm" c="dimmed">Часто используемые операции</Text>
                        </div>
                    </Group>

                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Button 
                                fullWidth 
                                size="md" 
                                variant="gradient" 
                                gradient={{ from: 'blue', to: 'violet' }}
                                leftSection={<IconPackage size={20} />}
                            >
                                Создать поставку
                            </Button>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Button 
                                fullWidth 
                                size="md" 
                                variant="gradient" 
                                gradient={{ from: 'green', to: 'teal' }}
                                leftSection={<IconDownload size={20} />}
                            >
                                Скачать отчет
                            </Button>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Button 
                                fullWidth 
                                size="md" 
                                variant="gradient" 
                                gradient={{ from: 'orange', to: 'red' }}
                                leftSection={<IconRefresh size={20} />}
                            >
                                Обновить данные
                            </Button>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Button 
                                fullWidth 
                                size="md" 
                                variant="gradient" 
                                gradient={{ from: 'violet', to: 'pink' }}
                                leftSection={<IconChartBar size={20} />}
                            >
                                Аналитика
                            </Button>
                        </Grid.Col>
                    </Grid>

                    {/* Дополнительные действия */}
                    <Divider my="md" />
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 4 }}>
                            <Group justify="center">
                                <ActionIcon variant="light" color="blue" size="lg">
                                    <IconAlertTriangle size={20} />
                                </ActionIcon>
                                <div>
                                    <Text size="sm" fw={500}>Проблемы</Text>
                                    <Text size="xs" c="dimmed">Решить 15 проблем</Text>
                                </div>
                            </Group>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 4 }}>
                            <Group justify="center">
                                <ActionIcon variant="light" color="green" size="lg">
                                    <IconTarget size={20} />
                                </ActionIcon>
                                <div>
                                    <Text size="sm" fw={500}>Прогнозы</Text>
                                    <Text size="xs" c="dimmed">Планирование на 7 дней</Text>
                                </div>
                            </Group>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 4 }}>
                            <Group justify="center">
                                <ActionIcon variant="light" color="orange" size="lg">
                                    <IconCalculator size={20} />
                                </ActionIcon>
                                <div>
                                    <Text size="sm" fw={500}>Калькулятор</Text>
                                    <Text size="xs" c="dimmed">Расчет заказов</Text>
                                </div>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Paper>
            </Stack>
        );
    };

    const renderInventory = () => (
        <Stack gap="lg">
            <Paper p="md" withBorder>
                <Group justify="space-between" mb="md">
                    <Title order={4}>Управление запасами</Title>
                    <Group>
                        <Button leftSection={<IconDownload size={16} />} variant="light">
                            Экспорт
                        </Button>
                        <Button leftSection={<IconRefresh size={16} />} variant="light">
                            Обновить
                        </Button>
                    </Group>
                </Group>

                <ScrollArea>
                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>SKU</Table.Th>
                                <Table.Th>Название</Table.Th>
                                <Table.Th>Остаток</Table.Th>
                                <Table.Th>Дней до окончания</Table.Th>
                                <Table.Th>% выкупа</Table.Th>
                                <Table.Th>Стоимость хранения</Table.Th>
                                <Table.Th>ABC-XYZ</Table.Th>
                                <Table.Th>Действия</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {filteredProducts.slice(0, 20).map((product) => (
                                <Table.Tr key={product.id}>
                                    <Table.Td>
                                        <Text size="sm" fw={500}>{product.sku}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{product.name}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm" fw={500}>{product.totalStock}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={product.daysLeft < 7 ? 'red' : product.daysLeft < 14 ? 'yellow' : 'green'}
                                            variant="light"
                                        >
                                            {product.daysLeft} дн.
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <RingProgress
                                                size={30}
                                                thickness={3}
                                                sections={[{ value: product.buyoutRate, color: 'green' }]}
                                            />
                                            <Text size="sm">{product.buyoutRate.toFixed(1)}%</Text>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm" c="orange" fw={500}>
                                            ₽{product.storageCost}/день
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge color="violet">{product.abc}{product.xyz}</Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <ActionIcon variant="light" color="blue">
                                                <IconEye size={16} />
                                            </ActionIcon>
                                            <Menu>
                                                <Menu.Target>
                                                    <ActionIcon variant="light">
                                                        <IconDots size={16} />
                                                    </ActionIcon>
                                                </Menu.Target>
                                                <Menu.Dropdown>
                                                    <Menu.Item leftSection={<IconPackage size={14} />}>
                                                        Создать поставку
                                                    </Menu.Item>
                                                    <Menu.Item leftSection={<IconChartLine size={14} />}>
                                                        Анализ продаж
                                                    </Menu.Item>
                                                    <Menu.Item leftSection={<IconCurrencyRubel size={14} />}>
                                                        Экономика
                                                    </Menu.Item>
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Paper>
        </Stack>
    );

    const renderDeliveries = () => (
        <Stack gap="lg">
            <Paper p="md" withBorder>
                <Group justify="space-between" mb="md">
                    <Title order={4}>Управление поставками</Title>
                    <Group>
                        <Button leftSection={<IconDownload size={16} />} variant="light">
                            Экспорт
                        </Button>
                        <Button leftSection={<IconRefresh size={16} />} variant="light">
                            Обновить
                        </Button>
                    </Group>
                </Group>

                <ScrollArea>
                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Номер поставки</Table.Th>
                                <Table.Th>Позиций</Table.Th>
                                <Table.Th>Количество</Table.Th>
                                <Table.Th>Склад</Table.Th>
                                <Table.Th>План. дата</Table.Th>
                                <Table.Th>Статус</Table.Th>
                                <Table.Th>Действия</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {deliveries.slice(0, 15).map(delivery => (
                                <Table.Tr key={delivery.id}>
                                    <Table.Td>
                                        <Text size="sm" fw={500}>{delivery.orderNumber}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.items}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.totalQuantity} шт</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.warehouse}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.plannedDate}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge 
                                            color={
                                                delivery.status === 'Принята' ? 'green' :
                                                delivery.status === 'На приемке' ? 'blue' :
                                                delivery.status === 'В пути' ? 'orange' : 'gray'
                                            }
                                            variant="light"
                                        >
                                            {delivery.status}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <ActionIcon variant="light" color="blue">
                                                <IconEye size={16} />
                                            </ActionIcon>
                                            <ActionIcon variant="light" color="green">
                                                <IconTruck size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Paper>
        </Stack>
    );

    const renderAnalytics = () => (
        <Stack gap="lg">
            <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Paper p="md" withBorder>
                        <Title order={5} mb="md">ABC анализ товаров</Title>
                        <EChartsComponent option={{}} style={{ height: '300px' }} />
                    </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Paper p="md" withBorder>
                        <Title order={5} mb="md">XYZ анализ товаров</Title>
                        <EChartsComponent option={{}} style={{ height: '300px' }} />
                    </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Paper p="md" withBorder>
                        <Title order={5} mb="md">Динамика остатков по складам</Title>
                        <EChartsComponent option={{}} style={{ height: '300px' }} />
                    </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Paper p="md" withBorder>
                        <Title order={5} mb="md">Анализ оборачиваемости</Title>
                        <EChartsComponent option={{}} style={{ height: '300px' }} />
                    </Paper>
                </Grid.Col>
            </Grid>
        </Stack>
    );

    const renderABCXYZ = () => (
        <Stack gap="lg">
            {/* Критическое предупреждение для CZ товаров */}
            <Alert 
                icon={<IconSkull size={16} />} 
                title="Критическая ситуация с товарами CZ" 
                color="red"
                variant="filled"
            >
                <Stack gap="xs">
                    <Text size="sm">
                        {abcxyzData.CZ.count} товаров группы CZ создают убытки 145к ₽/мес
                    </Text>
                    <Group gap="xs">
                        <Button size="xs" color="white" variant="white" onClick={() => setLiquidationModalOpened(true)}>
                            План ликвидации
                        </Button>
                        <Text size="xs" c="white">
                            Потенциальная экономия: 2.1М ₽/год
                        </Text>
                    </Group>
                </Stack>
            </Alert>

            {/* ABC-XYZ матрица */}
            <Paper p="md" withBorder>
                <Title order={4} mb="md">Матрица ABC-XYZ</Title>
                
                <Grid gutter="xs">
                    {/* Заголовки */}
                    <Grid.Col span={3}></Grid.Col>
                    <Grid.Col span={3}>
                        <Text size="sm" fw={600} ta="center">X (стабильный)</Text>
                        <Text size="xs" c="dimmed" ta="center">КВ ≤ 10%</Text>
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Text size="sm" fw={600} ta="center">Y (умеренный)</Text>
                        <Text size="xs" c="dimmed" ta="center">КВ 10-25%</Text>
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Text size="sm" fw={600} ta="center">Z (нестабильный)</Text>
                        <Text size="xs" c="dimmed" ta="center">КВ &gt;25%</Text>
                    </Grid.Col>
                    
                    {/* Строка A */}
                    <Grid.Col span={3}>
                        <Box>
                            <Text size="sm" fw={600}>A (70-80%)</Text>
                            <Text size="xs" c="dimmed">Основная выручка</Text>
                        </Box>
                    </Grid.Col>
                    {['AX', 'AY', 'AZ'].map(group => (
                        <Grid.Col key={group} span={3}>
                            <HoverCard width={280} shadow="md">
                                <HoverCard.Target>
                                    <Card
                                        padding="sm"
                                        withBorder
                                        style={{ 
                                            cursor: 'pointer', 
                                            borderColor: `var(--mantine-color-${getStatusColor(getGroupStatus(group))}-4)` 
                                        }}
                                        onClick={() => handleCellClick(group)}
                                    >
                                        <Stack gap={4}>
                                            <Group justify="space-between">
                                                <Badge color={getStatusColor(getGroupStatus(group))} size="lg">
                                                    {group}
                                                </Badge>
                                                {group === 'AX' && <IconTarget size={16} />}
                                                {group === 'AY' && <IconChartBar size={16} />}
                                                {group === 'AZ' && <IconAlertTriangle size={16} />}
                                            </Group>
                                            <Text size="xs" c="dimmed">{abcxyzData[group].count} товаров</Text>
                                            <Text size="xs" fw={600}>{abcxyzData[group].revenue}% выручки</Text>
                                            <Progress value={(abcxyzData[group].stockDays / 150) * 100} size="xs" />
                                            <Text size="xs">{abcxyzData[group].stockDays} дн. запас</Text>
                                        </Stack>
                                    </Card>
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Stack gap={4}>
                                        <Text size="sm" fw={600}>{group}</Text>
                                        <Text size="xs">Товаров: {abcxyzData[group].count}</Text>
                                        <Text size="xs">Выручка: {abcxyzData[group].revenue}%</Text>
                                        <Text size="xs">Запас: {abcxyzData[group].stockDays} дней</Text>
                                        <Text size="xs">Норматив: {abcxyzData[group].norm} дней</Text>
                                        <Text size="xs">Оборот: {abcxyzData[group].turnover} раз/год</Text>
                                    </Stack>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </Grid.Col>
                    ))}
                    
                    {/* Строка B */}
                    <Grid.Col span={3}>
                        <Box>
                            <Text size="sm" fw={600}>B (15-20%)</Text>
                            <Text size="xs" c="dimmed">Средняя выручка</Text>
                        </Box>
                    </Grid.Col>
                    {['BX', 'BY', 'BZ'].map(group => (
                        <Grid.Col key={group} span={3}>
                            <HoverCard width={280} shadow="md">
                                <HoverCard.Target>
                                    <Card
                                        padding="sm"
                                        withBorder
                                        style={{ 
                                            cursor: 'pointer', 
                                            borderColor: `var(--mantine-color-${getStatusColor(getGroupStatus(group))}-4)` 
                                        }}
                                        onClick={() => handleCellClick(group)}
                                    >
                                        <Stack gap={4}>
                                            <Badge color={getStatusColor(getGroupStatus(group))} size="lg">
                                                {group}
                                            </Badge>
                                            <Text size="xs" c="dimmed">{abcxyzData[group].count} товаров</Text>
                                            <Text size="xs" fw={600}>{abcxyzData[group].revenue}% выручки</Text>
                                            <Progress value={(abcxyzData[group].stockDays / 150) * 100} size="xs" />
                                            <Text size="xs">{abcxyzData[group].stockDays} дн. запас</Text>
                                        </Stack>
                                    </Card>
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Stack gap={4}>
                                        <Text size="sm" fw={600}>{group}</Text>
                                        <Text size="xs">Товаров: {abcxyzData[group].count}</Text>
                                        <Text size="xs">Выручка: {abcxyzData[group].revenue}%</Text>
                                        <Text size="xs">Запас: {abcxyzData[group].stockDays} дней</Text>
                                        <Text size="xs">Норматив: {abcxyzData[group].norm} дней</Text>
                                        <Text size="xs">Оборот: {abcxyzData[group].turnover} раз/год</Text>
                                    </Stack>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </Grid.Col>
                    ))}
                    
                    {/* Строка C */}
                    <Grid.Col span={3}>
                        <Box>
                            <Text size="sm" fw={600}>C (5-10%)</Text>
                            <Text size="xs" c="dimmed">Низкая выручка</Text>
                        </Box>
                    </Grid.Col>
                    {['CX', 'CY', 'CZ'].map(group => (
                        <Grid.Col key={group} span={3}>
                            <HoverCard width={280} shadow="md">
                                <HoverCard.Target>
                                    <Card
                                        padding="sm"
                                        withBorder
                                        style={{ 
                                            cursor: 'pointer', 
                                            borderColor: group === 'CZ' ? 'var(--mantine-color-red-6)' : `var(--mantine-color-${getStatusColor(getGroupStatus(group))}-4)`,
                                            backgroundColor: group === 'CZ' ? 'var(--mantine-color-red-0)' : undefined
                                        }}
                                        onClick={() => handleCellClick(group)}
                                    >
                                        <Stack gap={4}>
                                            <Group justify="space-between">
                                                <Badge color={getStatusColor(getGroupStatus(group))} size="lg">
                                                    {group}
                                                </Badge>
                                                {group === 'CZ' && (
                                                    <Group gap={4}>
                                                        <IconFlame size={16} color="red" />
                                                        <IconSkull size={16} color="red" />
                                                    </Group>
                                                )}
                                            </Group>
                                            <Text size="xs" c="dimmed">{abcxyzData[group].count} товаров</Text>
                                            <Text size="xs" fw={600}>{abcxyzData[group].revenue}% выручки</Text>
                                            <Progress value={(abcxyzData[group].stockDays / 150) * 100} size="xs" color={group === 'CZ' ? 'red' : undefined} />
                                            <Text size="xs" c={group === 'CZ' ? 'red' : undefined} fw={group === 'CZ' ? 700 : 400}>
                                                {abcxyzData[group].stockDays} дн. запас
                                            </Text>
                                            {group === 'CZ' && <Text size="xs" c="red" fw={700}>УБЫТОЧНО!</Text>}
                                        </Stack>
                                    </Card>
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Stack gap={4}>
                                        <Text size="sm" fw={600}>{group}</Text>
                                        <Text size="xs">Товаров: {abcxyzData[group].count}</Text>
                                        <Text size="xs">Выручка: {abcxyzData[group].revenue}%</Text>
                                        <Text size="xs">Запас: {abcxyzData[group].stockDays} дней</Text>
                                        <Text size="xs">Норматив: {abcxyzData[group].norm} дней</Text>
                                        <Text size="xs">Оборот: {abcxyzData[group].turnover} раз/год</Text>
                                    </Stack>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </Grid.Col>
                    ))}
                </Grid>
                
                {/* Легенда */}
                <Group mt="md" gap="xs">
                    <Badge color="green" variant="light" leftSection={<ColorSwatch color="green" size={8} />}>Оптимально</Badge>
                    <Badge color="yellow" variant="light" leftSection={<ColorSwatch color="yellow" size={8} />}>Внимание</Badge>
                    <Badge color="red" variant="light" leftSection={<ColorSwatch color="red" size={8} />}>Критично</Badge>
                </Group>
            </Paper>

            {/* Нормативы по группам */}
            <Paper p="md" withBorder>
                <Title order={4} mb="md">Нормативы управления запасами по группам ABC-XYZ</Title>
                
                <ScrollArea>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Группа</Table.Th>
                                <Table.Th>Норматив запаса</Table.Th>
                                <Table.Th>Страховой запас</Table.Th>
                                <Table.Th>Частота контроля</Table.Th>
                                <Table.Th>Сервисный уровень</Table.Th>
                                <Table.Th>Макс. хранение/выручка</Table.Th>
                                <Table.Th>Стратегия</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td><Badge color="blue">AX</Badge></Table.Td>
                                <Table.Td>10-15 дней</Table.Td>
                                <Table.Td>3-5 дней</Table.Td>
                                <Table.Td>Ежедневно</Table.Td>
                                <Table.Td>98-99%</Table.Td>
                                <Table.Td>&lt;2%</Table.Td>
                                <Table.Td>Just-in-Time</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td><Badge color="blue">AY</Badge></Table.Td>
                                <Table.Td>20-30 дней</Table.Td>
                                <Table.Td>7-12 дней</Table.Td>
                                <Table.Td>Через день</Table.Td>
                                <Table.Td>95-97%</Table.Td>
                                <Table.Td>2-4%</Table.Td>
                                <Table.Td>Адаптивное планирование</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td><Badge color="orange">AZ</Badge></Table.Td>
                                <Table.Td>30-45 дней</Table.Td>
                                <Table.Td>15-25 дней</Table.Td>
                                <Table.Td>Ежедневно</Table.Td>
                                <Table.Td>90-95%</Table.Td>
                                <Table.Td>4-6%</Table.Td>
                                <Table.Td>Гибкие поставки</Table.Td>
                            </Table.Tr>
                            <Table.Tr style={{ backgroundColor: 'var(--mantine-color-red-0)' }}>
                                <Table.Td><Badge color="red" variant="filled">CZ</Badge></Table.Td>
                                <Table.Td>0-30 дней (цель: 0)</Table.Td>
                                <Table.Td>0 дней</Table.Td>
                                <Table.Td>Еженедельно</Table.Td>
                                <Table.Td>70-80%</Table.Td>
                                <Table.Td>&gt;10% (УБЫТОК)</Table.Td>
                                <Table.Td><Text c="red" fw={700}>ЛИКВИДАЦИЯ</Text></Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Paper>
        </Stack>
    );

    // Данные для предупреждений склада
    const warehouseAlerts = [
        {
            id: 'stock-critical',
            type: 'critical' as const,
            title: 'Товары с остатком < 3 дней',
            description: '15 товаров заканчиваются в ближайшие 3 дня',
            count: 15,
            icon: IconPackage,
            color: 'red',
            items: [
                { sku: 'WB00001234', name: 'Кроссовки Nike Air Max', stock: 5, daysLeft: 2 },
                { sku: 'WB00001235', name: 'Футболка базовая', stock: 3, daysLeft: 1 },
                { sku: 'WB00001236', name: 'Джинсы классические', stock: 8, daysLeft: 3 }
            ]
        },
        {
            id: 'buyout-decline',
            type: 'warning' as const,
            title: 'Снижение выкупа > 10%',
            description: 'Выкуп по категории "Обувь" снизился на 12% за неделю',
            count: 12,
            icon: IconTrendingDown,
            color: 'orange'
        },
        {
            id: 'acceptance-delays',
            type: 'warning' as const,
            title: 'Задержки приемки на WB',
            description: '3 поставки задерживаются на приемке более 2 дней',
            count: 3,
            icon: IconClock,
            color: 'yellow'
        },
        {
            id: 'pickup-anomalies',
            type: 'info' as const,
            title: 'Аномальные остатки ПВЗ',
            description: 'Необычно высокие остатки на 8 ПВЗ в Москве',
            count: 8,
            icon: IconMapPin,
            color: 'blue'
        }
    ];

    // Функция для получения координат складов
    const getWarehouseCoordinates = (warehouseName: string): [number, number] => {
        const coordinates: Record<string, [number, number]> = {
            'Коледино': [55.4, 37.5],
            'Электросталь': [55.8, 38.4],
            'Казань': [55.8, 49.1],
            'Екатеринбург': [56.8, 60.6],
            'Новосибирск': [55.0, 82.9],
            'Краснодар': [45.0, 39.0],
            'Санкт-Петербург': [59.9, 30.3],
            'Ростов-на-Дону': [47.2, 39.6],
            'Самара': [53.2, 50.1],
            'Челябинск': [55.2, 61.4],
            'Хабаровск': [48.5, 135.1],
            'Тольятти': [52.5, 50.4],
            'Уфа': [54.7, 55.9],
            'Воронеж': [50.6, 38.2],
            'Владивосток': [43.1, 131.9],
            'Нижний Новгород': [56.3, 44.0],
            'Омск': [54.9, 73.4],
            'Красноярск': [56.0, 92.9],
            'Москва': [55.7558, 37.6173] // Москва по умолчанию
        };
        return coordinates[warehouseName] || coordinates['Москва'];
    };

    return (
        <Container size="xl" p="md">
            <Paper withBorder p="md" mb="md">
                <Group justify="space-between">
                    <Group>
                        <ThemeIcon size={32} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'violet' }}>
                            <IconPackage size={20} />
                        </ThemeIcon>
                        <div>
                            <Text fw={600}>WB Warehouse Management System</Text>
                            <Text size="sm" c="dimmed">Система управления складами и логистикой</Text>
                        </div>
                    </Group>
                    <Group>
                        <ActionIcon variant="light" onClick={toggleColorScheme}>
                            {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
                        </ActionIcon>
                        <Indicator processing color="red" offset={4} size={8}>
                            <ActionIcon variant="light">
                                <IconBell size={18} />
                            </ActionIcon>
                        </Indicator>
                    </Group>
                </Group>
            </Paper>

            <Tabs value={activeTab} onChange={(value) => value && setActiveTab(value)}>
                <Tabs.List>
                    <Tabs.Tab value="overview" leftSection={<IconDashboard size={16} />}>
                        Обзор
                    </Tabs.Tab>
                    <Tabs.Tab value="inventory" leftSection={<IconPackage size={16} />}>
                        Запасы
                    </Tabs.Tab>
                    <Tabs.Tab value="abcxyz" leftSection={<IconTarget size={16} />}>
                        ABC-XYZ
                    </Tabs.Tab>
                    <Tabs.Tab value="deliveries" leftSection={<IconTruck size={16} />}>
                        Поставки
                    </Tabs.Tab>
                    <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
                        Аналитика
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="overview" pt="md">
                    {renderOverview()}
                </Tabs.Panel>

                <Tabs.Panel value="inventory" pt="md">
                    {renderInventory()}
                </Tabs.Panel>

                <Tabs.Panel value="abcxyz" pt="md">
                    {renderABCXYZ()}
                </Tabs.Panel>

                <Tabs.Panel value="deliveries" pt="md">
                    {renderDeliveries()}
                </Tabs.Panel>

                <Tabs.Panel value="analytics" pt="md">
                    {renderAnalytics()}
                </Tabs.Panel>
            </Tabs>

            {/* Модальные окна */}
            <Modal
                opened={groupModalOpened}
                onClose={() => setGroupModalOpened(false)}
                title={<Text size="lg" fw={500}>Детали группы {selectedGroup}</Text>}
                size="lg"
            >
                {selectedGroup && (
                    <Stack gap="md">
                        <Text>Детальная информация о группе {selectedGroup}</Text>
                        <Text size="sm" c="dimmed">
                            Здесь будет детальная аналитика по выбранной группе товаров
                        </Text>
                    </Stack>
                )}
            </Modal>

            <Modal
                opened={liquidationModalOpened}
                onClose={() => setLiquidationModalOpened(false)}
                title="План ликвидации CZ товаров"
                size="xl"
            >
                <Stack gap="md">
                    <Alert color="red" icon={<IconSkull size={16} />}>
                        <Text>Критические товары требуют немедленной ликвидации</Text>
                    </Alert>
                    <Text>Детальный план ликвидации будет добавлен позже</Text>
                </Stack>
            </Modal>
        </Container>
    );
};

export default WarehouseAndLogisticsPageExt;

