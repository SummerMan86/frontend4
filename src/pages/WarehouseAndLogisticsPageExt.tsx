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
    HoverCard,
    Checkbox
} from '@mantine/core';

import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';
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

// Интерфейсы для типизации
interface KpiDetailData {
    date: string;
    value: number;
    [key: string]: any;
}

interface KpiDetails {
    [key: string]: string | number | { [key: string]: number };
}

interface SelectedKpi {
    type?: string;
    title: string;
    value: string;
    unit: string;
    change: number;
    color: string;
    icon: any;
    gradient?: string;
    details?: KpiDetails;
}

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
    sku: string;
    orderNumber: string;
    vendorCode: string;
    category: string;
    barcodeWB: string;
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

interface EChartsWrapperProps {
    option: EChartsOption;
    style?: React.CSSProperties;
    onChartReady?: (chartInstance: any) => void;
    onEvents?: Record<string, Function>;
    syncGroup?: string;
    notMerge?: boolean;
    lazyUpdate?: boolean;
    showLoading?: boolean;
}

// Компонент-обертка для ECharts с поддержкой синхронизации и экспорта
const EChartsWrapper: React.FC<EChartsWrapperProps> = ({
    option,
    style = { height: '400px', width: '100%' },
    onChartReady,
    onEvents,
    syncGroup,
    notMerge = false,
    lazyUpdate = false,
    showLoading = false,
}) => {
    const chartRef = useRef<ReactECharts>(null);
    const [isReady, setIsReady] = useState(false);
    const resizeObserverRef = useRef<ResizeObserver>();

    // Задержка для правильной инициализации в модальных окнах
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
            if (chartRef.current) {
                const chartInstance = chartRef.current.getEchartsInstance();
                if (chartInstance && !chartInstance.isDisposed()) {
                    chartInstance.resize();
                }
            }
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    // Следим за изменением размеров контейнера
    useEffect(() => {
        if (chartRef.current) {
            const chartDom = chartRef.current.getEchartsInstance().getDom();
            if (chartDom) {
                resizeObserverRef.current = new ResizeObserver(() => {
                    if (chartRef.current) {
                        const instance = chartRef.current.getEchartsInstance();
                        if (instance && !instance.isDisposed()) {
                            instance.resize();
                        }
                    }
                });
                resizeObserverRef.current.observe(chartDom);
            }
        }
        
        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
        };
    }, [isReady]);

    // Обновление размеров при изменении опций
    useEffect(() => {
        if (isReady && chartRef.current) {
            const timer = setTimeout(() => {
                const chartInstance = chartRef.current?.getEchartsInstance();
                if (chartInstance && !chartInstance.isDisposed()) {
                    chartInstance.resize();
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [option, isReady]);

    // Базовая конфигурация с toolbox для экспорта
    const baseOption = useMemo(() => ({
        toolbox: {
            feature: {
                saveAsImage: {
                    show: true,
                    title: 'Сохранить',
                    pixelRatio: 2
                },
                dataView: {
                    show: true,
                    title: 'Данные',
                    readOnly: false,
                    lang: ['Данные', 'Закрыть', 'Обновить']
                },
                restore: {
                    show: true,
                    title: 'Сбросить'
                },
                dataZoom: {
                    show: true,
                    title: {
                        zoom: 'Увеличить',
                        back: 'Назад'
                    }
                }
            },
            right: 20,
            top: 5
        },
        // Анимации для плавных переходов - отключаем при первой загрузке
        animation: isReady,
        animationThreshold: 2000,
        animationDuration: isReady ? 1000 : 0,
        animationEasing: 'cubicOut',
        animationDelay: 0,
        animationDurationUpdate: 500,
        animationEasingUpdate: 'cubicOut',
        animationDelayUpdate: 0,
        ...option
    }), [option, isReady]);

    // Синхронизация графиков
    useEffect(() => {
        if (syncGroup && chartRef.current) {
            const chartInstance = chartRef.current.getEchartsInstance();
            chartInstance.group = syncGroup;
        }
    }, [syncGroup]);

    return (
        <>
            {!isReady && (
                <Center style={style}>
                    <Loader size="lg" />
                </Center>
            )}
            <ReactECharts
                ref={chartRef}
                option={baseOption}
                style={{ ...style, display: isReady ? 'block' : 'none' }}
                notMerge={notMerge}
                lazyUpdate={lazyUpdate}
                showLoading={showLoading}
                onChartReady={onChartReady}
                onEvents={onEvents}
                opts={{ renderer: 'canvas' }}
            />
        </>
    );
};

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
        sku: `SKU${String(i + 1).padStart(6, '0')}`,
        orderNumber: `П-2024${String(i + 1).padStart(5, '0')}`,
        vendorCode: `АРТ${String(i + 1).padStart(4, '0')}`,
        category: ['Одежда', 'Обувь', 'Аксессуары', 'Электроника', 'Дом и сад'][Math.floor(Math.random() * 5)],
        barcodeWB: `2${String(Math.floor(Math.random() * 1000000000000)).padStart(12, '0')}`,
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

// Красивая воронка товародвижения
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
    
    // Создаем ECharts версию воронки
    const funnelChartOption: EChartsOption = {
        title: {
            text: 'Воронка товародвижения',
            subtext: 'Анализ конверсии по этапам',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params: any) {
                const data = params.data;
                return `${data.name}<br/>Количество: ${data.value.toLocaleString()}<br/>Конверсия: ${data.conversion || 100}%`;
            }
        },
        legend: {
            data: data.map(d => d.stage),
            bottom: 10
        },
        series: [
            {
                name: 'Воронка',
                type: 'funnel',
                left: '10%',
                top: 80,
                bottom: 60,
                width: '80%',
                min: 0,
                max: 100,
                minSize: '0%',
                maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: {
                    show: true,
                    position: 'inside',
                    fontSize: 14,
                    formatter: function(params: any) {
                        return `${params.name}\n${params.value.toLocaleString()}\n${params.data.conversion || 100}%`;
                    }
                },
                labelLine: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        fontSize: 20
                    }
                },
                data: data.map((item, index) => ({
                    value: (item.value / data[0].value) * 100,
                    name: item.stage,
                    conversion: item.conversion,
                    originalValue: item.value,
                    itemStyle: { 
                        color: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'][index] || '#868e96'
                    }
                }))
            }
        ]
    };

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

            {/* ECharts воронка */}
            <Paper p="xl" withBorder radius="xl" style={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                border: '1px solid #e2e8f0'
            }}>
                <EChartsWrapper 
                    option={funnelChartOption}
                    style={{ height: '500px' }}
                    onEvents={{
                        'click': (params: any) => onStageClick?.(params.name)
                    }}
                />
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
    const [kpiModalOpened, setKpiModalOpened] = useState(false);
    const [selectedKpi, setSelectedKpi] = useState<SelectedKpi | null>(null);
    const [chartKey, setChartKey] = useState(0);

    // Обновление ключа графика при открытии модального окна для принудительного ререндера
    useEffect(() => {
        if (kpiModalOpened || groupModalOpened || liquidationModalOpened || funnelModalOpened) {
            // Даем время модальному окну отрендериться
            const timer = setTimeout(() => {
                setChartKey(prev => prev + 1);
                // Принудительно обновляем размеры всех графиков
                window.dispatchEvent(new Event('resize'));
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [kpiModalOpened, groupModalOpened, liquidationModalOpened, funnelModalOpened]);

    // Функция для генерации данных KPI детализации
    const generateKpiDetailData = (kpiType: string): KpiDetailData[] => {
        const dates = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 30 + i);
            return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
        });

        switch(kpiType) {
            case 'stock':
                return dates.map(date => ({
                    date,
                    value: Math.floor(Math.random() * 5000) + 40000,
                    target: 45000,
                    critical: 38000
                }));
            case 'transit':
                return dates.map(date => ({
                    date,
                    value: Math.floor(Math.random() * 1000) + 3000,
                    delivered: Math.floor(Math.random() * 800) + 2000,
                    delayed: Math.floor(Math.random() * 200) + 100
                }));
            case 'buyout':
                return dates.map(date => ({
                    date,
                    value: Math.random() * 10 + 73,
                    orders: Math.floor(Math.random() * 500) + 1000,
                    buyouts: Math.floor(Math.random() * 400) + 700
                }));
            case 'turnover':
                return dates.map(date => ({
                    date,
                    value: Math.random() * 5 + 22,
                    sales: Math.floor(Math.random() * 2000) + 3000,
                    avgStock: Math.floor(Math.random() * 10000) + 20000
                }));
            case 'critical':
                return dates.map(date => ({
                    date,
                    value: Math.floor(Math.random() * 10) + 18,
                    new: Math.floor(Math.random() * 5) + 2,
                    resolved: Math.floor(Math.random() * 3) + 1
                }));
            case 'efficiency':
                return dates.map(date => ({
                    date,
                    value: Math.random() * 5 + 89,
                    onTime: Math.floor(Math.random() * 50) + 150,
                    delayed: Math.floor(Math.random() * 10) + 5
                }));
            default:
                return [];
        }
    };

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

    // Синхронизация графиков
    useEffect(() => {
        return () => {
            // Cleanup handled by React component unmounting
        };
    }, []);

    // Функция генерации данных для heatmap
    const generateWarehouseHeatmapData = () => {
        const warehouses = ['Коледино', 'Электросталь', 'Казань', 'Екатеринбург', 'Новосибирск', 
                           'Краснодар', 'СПб', 'Ростов', 'Самара', 'Челябинск'];
        const categories = ['Одежда', 'Обувь', 'Электроника', 'Косметика', 'Для дома'];
        
        const data: any[] = [];
        warehouses.forEach((warehouse, wIndex) => {
            categories.forEach((category, cIndex) => {
                const value = Math.floor(Math.random() * 1000) + 100;
                data.push([cIndex, wIndex, value]);
            });
        });
        
        return { warehouses, categories, data };
    };

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

        // График выкупаемости
        const buyoutChartOption: EChartsOption = {
            title: {
                text: 'График выкупаемости (последние 30 дней)',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: true
                },
                formatter: function(params: any) {
                    let result = params[0].name + '<br/>';
                    params.forEach((param: any) => {
                        const value = param.value;
                        const color = param.color;
                        result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`;
                        if (param.seriesName === '% выкупа') {
                            result += `${param.seriesName}: ${value}%<br/>`;
                        } else {
                            result += `${param.seriesName}: ${value} шт<br/>`;
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: ['Заказы', 'Выкупы', '% выкупа'],
                bottom: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: Array.from({ length: 30 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - 30 + i);
                    return `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                }),
                axisLabel: {
                    rotate: 45,
                    interval: 4
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Количество',
                    position: 'left',
                    axisLabel: {
                        formatter: '{value} шт'
                    }
                },
                {
                    type: 'value',
                    name: '% выкупа',
                    position: 'right',
                    min: 0,
                    max: 100,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: 'Заказы',
                    type: 'bar',
                    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 150),
                    itemStyle: {
                        color: '#5470c6'
                    }
                },
                {
                    name: 'Выкупы',
                    type: 'bar',
                    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 80) + 100),
                    itemStyle: {
                        color: '#91cc75'
                    }
                },
                {
                    name: '% выкупа',
                    type: 'line',
                    yAxisIndex: 1,
                    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 70),
                    smooth: true,
                    itemStyle: {
                        color: '#fac858'
                    },
                    areaStyle: {
                        opacity: 0.2
                    }
                }
            ]
        };

        // Обработчик клика для drill-down
        const onBuyoutChartClick = (params: any) => {
            if (params.componentType === 'series') {
                notifications.show({
                    title: `Детали за ${params.name}`,
                    message: `${params.seriesName}: ${params.value}${params.seriesName === '% выкупа' ? '%' : ' шт'}`,
                    color: 'blue'
                });
            }
        };

        // Heatmap опции
        const { warehouses: heatmapWarehouses, categories: heatmapCategories, data: heatmapData } = generateWarehouseHeatmapData();
        const warehouseHeatmapOption: EChartsOption = {
            title: {
                text: 'Распределение товаров по складам и категориям',
                left: 'center'
            },
            tooltip: {
                position: 'top',
                formatter: function(params: any) {
                    const warehouse = heatmapWarehouses[params.value[1]];
                    const category = heatmapCategories[params.value[0]];
                    return `${warehouse}<br/>${category}: ${params.value[2]} шт`;
                }
            },
            grid: {
                height: '70%',
                left: '15%',
                top: '15%'
            },
            xAxis: {
                type: 'category',
                data: heatmapCategories,
                splitArea: {
                    show: true
                },
                axisLabel: {
                    rotate: 45
                }
            },
            yAxis: {
                type: 'category',
                data: heatmapWarehouses,
                splitArea: {
                    show: true
                }
            },
            visualMap: {
                min: 0,
                max: 1000,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '5%',
                inRange: {
                    color: ['#f8f9fa', '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3']
                },
                text: ['Больше', 'Меньше'],
                textStyle: {
                    color: '#666'
                }
            },
            series: [{
                name: 'Остатки',
                type: 'heatmap',
                data: heatmapData,
                label: {
                    show: true,
                    fontSize: 10
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        // Обработчик клика на KPI карточку
        const handleKpiClick = (kpi: any) => {
            setSelectedKpi(kpi);
            setKpiModalOpened(true);
        };

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
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        onClick={() => handleKpiClick({
                                            ...kpi,
                                            type: ['stock', 'transit', 'buyout', 'turnover', 'critical', 'efficiency'][index]
                                        })}
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
                                <EChartsWrapper 
                                    option={buyoutChartOption}
                                    style={{ height: '350px' }}
                                    onEvents={{
                                        'click': onBuyoutChartClick
                                    }}
                                    syncGroup="warehouse-charts"
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

                        {/* Heatmap распределения товаров */}
                        <Grid.Col span={{ base: 12, md: 12 }}>
                            <Paper p="md" withBorder>
                                <EChartsWrapper 
                                    option={warehouseHeatmapOption}
                                    style={{ height: '400px' }}
                                    syncGroup="warehouse-charts"
                                />
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
                                <Table.Th>SKU</Table.Th>
                                <Table.Th>Номер заказа</Table.Th>
                                <Table.Th>Артикул продавца</Table.Th>
                                <Table.Th>Категория</Table.Th>
                                <Table.Th>Баркод WB</Table.Th>
                                <Table.Th>Количество упаковано</Table.Th>
                                <Table.Th>Количество принято</Table.Th>
                                <Table.Th>Количество поступило в продажу</Table.Th>
                                <Table.Th>Плановая дата</Table.Th>
                                <Table.Th>Склад</Table.Th>
                                <Table.Th>Фактическая дата</Table.Th>
                                <Table.Th>Действия</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {deliveries.slice(0, 15).map(delivery => (
                                <Table.Tr key={delivery.id}>
                                    <Table.Td>
                                        <Text size="sm" fw={500}>{delivery.sku}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.orderNumber}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.vendorCode}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.category}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.barcodeWB}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.packed} шт</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.accepted} шт</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.inSale} шт</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.plannedDate}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.warehouse}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{delivery.actualDate || '-'}</Text>
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

    const renderAnalytics = () => {
        // ABC-XYZ scatter plot
        const abcxyzScatterOption: EChartsOption = {
            title: {
                text: 'ABC-XYZ анализ товаров',
                subtext: 'Кликните на точку для детальной информации',
                left: 'center'
            },
            grid: {
                left: '3%',
                right: '7%',
                bottom: '7%',
                containLabel: true
            },
            tooltip: {
                showDelay: 0,
                formatter: function (params: any) {
                    if (params.value.length > 1) {
                        return `${params.seriesName}<br/>
                                Выручка: ${params.value[0]}%<br/>
                                Вариация спроса: ${params.value[1]}%<br/>
                                Товаров: ${params.value[2]}<br/>
                                Группа: ${params.value[3]}`;
                    }
                },
                axisPointer: {
                    show: true,
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                }
            },
            xAxis: {
                type: 'value',
                name: 'Доля в выручке, %',
                nameLocation: 'middle',
                nameGap: 30,
                scale: true,
                axisLabel: {
                    formatter: '{value}%'
                },
                splitLine: {
                    show: true
                }
            },
            yAxis: {
                type: 'value',
                name: 'Коэффициент вариации спроса, %',
                nameLocation: 'middle',
                nameGap: 50,
                scale: true,
                axisLabel: {
                    formatter: '{value}%'
                },
                splitLine: {
                    show: true
                }
            },
            visualMap: {
                min: 0,
                max: 500,
                dimension: 2,
                orient: 'vertical',
                right: 10,
                top: 'center',
                text: ['Много товаров', 'Мало товаров'],
                calculable: true,
                inRange: {
                    color: ['#50a3ba', '#eac736', '#d94e5d']
                }
            },
            series: [
                {
                    name: 'ABC-XYZ',
                    type: 'scatter',
                    symbolSize: function (val: any) {
                        return Math.sqrt(val[2]) * 5;
                    },
                    data: [
                        [45, 5, 85, 'AX'],
                        [20, 17, 45, 'AY'],
                        [10, 35, 25, 'AZ'],
                        [12, 7, 156, 'BX'],
                        [6, 18, 89, 'BY'],
                        [2, 40, 67, 'BZ'],
                        [3, 8, 234, 'CX'],
                        [1.5, 20, 178, 'CY'],
                        [0.5, 55, 421, 'CZ']
                    ],
                    markArea: {
                        silent: true,
                        itemStyle: {
                            color: 'transparent',
                            borderWidth: 1,
                            borderType: 'dashed'
                        },
                        data: [
                            [{
                                name: 'A группа',
                                xAxis: 15,
                                yAxis: 0
                            }, {
                                xAxis: 100,
                                yAxis: 50
                            }],
                            [{
                                name: 'B группа',
                                xAxis: 5,
                                yAxis: 0
                            }, {
                                xAxis: 15,
                                yAxis: 50
                            }],
                            [{
                                name: 'C группа',
                                xAxis: 0,
                                yAxis: 0
                            }, {
                                xAxis: 5,
                                yAxis: 60
                            }]
                        ]
                    }
                }
            ]
        };

        // Динамика остатков
        const stockDynamicsOption: EChartsOption = {
            title: {
                text: 'Динамика остатков по складам',
                subtext: 'Последние 7 дней'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: true
                }
            },
            legend: {
                data: ['Коледино', 'Электросталь', 'Казань', 'Екатеринбург', 'Новосибирск'],
                bottom: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - 7 + i);
                    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
                })
            },
            yAxis: {
                type: 'value',
                name: 'Остатки, шт',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [
                {
                    name: 'Коледино',
                    type: 'line',
                    smooth: true,
                    data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 5000) + 10000),
                    areaStyle: { opacity: 0.3 }
                },
                {
                    name: 'Электросталь',
                    type: 'line',
                    smooth: true,
                    data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 4000) + 8000),
                    areaStyle: { opacity: 0.3 }
                },
                {
                    name: 'Казань',
                    type: 'line',
                    smooth: true,
                    data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 3000) + 6000),
                    areaStyle: { opacity: 0.3 }
                },
                {
                    name: 'Екатеринбург',
                    type: 'line',
                    smooth: true,
                    data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 2500) + 5000),
                    areaStyle: { opacity: 0.3 }
                },
                {
                    name: 'Новосибирск',
                    type: 'line',
                    smooth: true,
                    data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 2000) + 4000),
                    areaStyle: { opacity: 0.3 }
                }
            ]
        };

        // Анализ оборачиваемости
        const turnoverAnalysisOption: EChartsOption = {
            title: {
                text: 'Анализ оборачиваемости по категориям',
                subtext: 'Кликните на столбец для детализации'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params: any) {
                    let result = params[0].name + '<br/>';
                    params.forEach((param: any) => {
                        result += `${param.marker} ${param.seriesName}: ${param.value} дней<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                data: ['Текущая', 'Целевая'],
                bottom: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Одежда', 'Обувь', 'Электроника', 'Косметика', 'Для дома', 'Спорттовары'],
                axisLabel: {
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                name: 'Дней',
                axisLabel: {
                    formatter: '{value} дн'
                }
            },
            series: [
                {
                    name: 'Текущая',
                    type: 'bar',
                    data: [28, 35, 42, 25, 38, 31],
                    itemStyle: {
                        color: function(params: any) {
                            const value = params.value;
                            if (value > 40) return '#ff6666';
                            if (value > 30) return '#fac858';
                            return '#91cc75';
                        }
                    }
                },
                {
                    name: 'Целевая',
                    type: 'bar',
                    data: [20, 25, 30, 20, 25, 25],
                    itemStyle: {
                        color: '#5470c6',
                        opacity: 0.7
                    }
                }
            ]
        };

        // Pie chart распределения товаров
        const createPieChartOption = (): EChartsOption => ({
            title: {
                text: 'Распределение товаров по статусам',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Статус товаров',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 45, name: 'В продаже', itemStyle: { color: '#91cc75' }},
                        { value: 23, name: 'Критический запас', itemStyle: { color: '#ff6666' }},
                        { value: 15, name: 'Избыток', itemStyle: { color: '#fac858' }},
                        { value: 8, name: 'В пути', itemStyle: { color: '#5470c6' }},
                        { value: 9, name: 'На приемке', itemStyle: { color: '#ee6666' }}
                    ]
                }
            ]
        });

        // Обработчик для drill-down оборачиваемости
        const onTurnoverChartClick = (params: any) => {
            if (params.componentType === 'series' && params.seriesName === 'Текущая') {
                const categoryProducts = products.filter(p => p.category === params.name);
                notifications.show({
                    title: `Детализация по категории "${params.name}"`,
                    message: `Найдено ${categoryProducts.length} товаров. Средняя оборачиваемость: ${params.value} дней`,
                    color: 'blue'
                });
            }
        };

        return (
            <Stack gap="lg">
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper p="md" withBorder>
                            <EChartsWrapper 
                                option={abcxyzScatterOption}
                                style={{ height: '400px' }}
                                onEvents={{
                                    'click': (params: any) => {
                                        if (params.componentType === 'series') {
                                            setSelectedGroup(params.value[3]);
                                            setGroupModalOpened(true);
                                        }
                                    }
                                }}
                                syncGroup="analytics-charts"
                            />
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper p="md" withBorder>
                            <EChartsWrapper 
                                option={stockDynamicsOption}
                                style={{ height: '400px' }}
                                syncGroup="analytics-charts"
                            />
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper p="md" withBorder>
                            <EChartsWrapper 
                                option={turnoverAnalysisOption}
                                style={{ height: '400px' }}
                                onEvents={{
                                    'click': onTurnoverChartClick
                                }}
                                syncGroup="analytics-charts"
                            />
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper p="md" withBorder>
                            <EChartsWrapper 
                                option={createPieChartOption()}
                                style={{ height: '400px' }}
                                syncGroup="analytics-charts"
                            />
                        </Paper>
                    </Grid.Col>
                </Grid>
            </Stack>
        );
    };

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

            {/* ECharts визуализация ABC-XYZ анализа */}
            <Paper p="md" withBorder>
                <Title order={4} mb="md">Визуализация ABC-XYZ анализа</Title>
                <EChartsWrapper 
                    option={{
                        title: {
                            text: 'Матрица ABC-XYZ',
                            subtext: 'Размер пузыря = количество товаров',
                            left: 'center'
                        },
                        grid: {
                            left: '3%',
                            right: '7%',
                            bottom: '7%',
                            containLabel: true
                        },
                        tooltip: {
                            showDelay: 0,
                            formatter: function (params: any) {
                                if (params.value.length > 1) {
                                    return `Группа ${params.value[3]}<br/>
                                            Выручка: ${params.value[0]}%<br/>
                                            Вариация спроса: ${params.value[1]}%<br/>
                                            Товаров: ${params.value[2]}<br/>
                                            Запас: ${abcxyzData[params.value[3]].stockDays} дней`;
                                }
                            }
                        },
                        xAxis: {
                            type: 'value',
                            name: 'Доля в выручке, %',
                            nameLocation: 'middle',
                            nameGap: 30,
                            scale: true,
                            axisLabel: {
                                formatter: '{value}%'
                            }
                        },
                        yAxis: {
                            type: 'value',
                            name: 'Коэффициент вариации спроса, %',
                            nameLocation: 'middle',
                            nameGap: 50,
                            scale: true,
                            axisLabel: {
                                formatter: '{value}%'
                            }
                        },
                        visualMap: {
                            min: 0,
                            max: 450,
                            dimension: 2,
                            orient: 'vertical',
                            right: 10,
                            top: 'center',
                            text: ['Много товаров', 'Мало товаров'],
                            calculable: true,
                            inRange: {
                                color: ['#91cc75', '#fac858', '#ff6666']
                            }
                        },
                        series: [
                            {
                                name: 'ABC-XYZ',
                                type: 'scatter',
                                symbolSize: function (val: any) {
                                    return Math.sqrt(val[2]) * 5;
                                },
                                data: Object.entries(abcxyzData).map(([key, value]) => {
                                    const xyzMap: Record<string, number> = {
                                        'X': 7,
                                        'Y': 20,
                                        'Z': 40
                                    };
                                    return [
                                        value.revenue,
                                        xyzMap[key.charAt(1)],
                                        value.count,
                                        key
                                    ];
                                }),
                                markArea: {
                                    silent: true,
                                    itemStyle: {
                                        color: 'transparent',
                                        borderWidth: 1,
                                        borderType: 'dashed'
                                    },
                                    data: [
                                        [{
                                            name: 'A группа',
                                            xAxis: 15,
                                            yAxis: 0
                                        }, {
                                            xAxis: 100,
                                            yAxis: 50
                                        }],
                                        [{
                                            name: 'B группа',
                                            xAxis: 5,
                                            yAxis: 0
                                        }, {
                                            xAxis: 15,
                                            yAxis: 50
                                        }],
                                        [{
                                            name: 'C группа',
                                            xAxis: 0,
                                            yAxis: 0
                                        }, {
                                            xAxis: 5,
                                            yAxis: 60
                                        }]
                                    ]
                                }
                            }
                        ]
                    }}
                    style={{ height: '500px' }}
                    onEvents={{
                        'click': (params: any) => {
                            if (params.componentType === 'series') {
                                setSelectedGroup(params.value[3]);
                                setGroupModalOpened(true);
                            }
                        }
                    }}
                />
            </Paper>
        </Stack>
    );

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
                        {selectedGroup === 'CZ' && (
                            <Alert icon={<IconSkull size={16} />} color="red">
                                Товары этой группы создают убытки и требуют немедленной ликвидации
                            </Alert>
                        )}
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

            {/* Модальное окно детализации KPI */}
            <Modal
                opened={kpiModalOpened}
                onClose={() => setKpiModalOpened(false)}
                size="xl"
                title={
                    <Group gap="md">
                        {selectedKpi && (
                            <>
                                <ThemeIcon 
                                    size={48} 
                                    radius="xl" 
                                    variant="gradient"
                                    gradient={{ from: selectedKpi.color, to: 'violet' }}
                                >
                                    <selectedKpi.icon size={24} />
                                </ThemeIcon>
                                <div>
                                    <Text size="xl" fw={700}>{selectedKpi.title}</Text>
                                    <Group gap="xs">
                                        <Text size="sm" c="dimmed">Текущее значение:</Text>
                                        <Badge size="lg" variant="light" color={selectedKpi.color}>
                                            {selectedKpi.value} {selectedKpi.unit}
                                        </Badge>
                                    </Group>
                                </div>
                            </>
                        )}
                    </Group>
                }
                styles={{
                    header: {
                        backgroundColor: 'var(--mantine-color-gray-0)',
                        padding: '20px'
                    },
                    body: {
                        padding: 0
                    }
                }}
            >
                {selectedKpi && (
                    <Stack gap={0}>
                        {/* Суммарная статистика */}
                        <Paper p="xl" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                            <Grid>
                                <Grid.Col span={{ base: 12, sm: 3 }}>
                                    <Paper p="md" radius="lg" withBorder>
                                        <Group justify="space-between">
                                            <div>
                                                <Text size="xs" c="dimmed" fw={500}>За 30 дней</Text>
                                                <Text size="lg" fw={700}>
                                                    {selectedKpi.change > 0 ? '+' : ''}{selectedKpi.change}%
                                                </Text>
                                            </div>
                                            <RingProgress
                                                size={60}
                                                thickness={6}
                                                sections={[
                                                    { 
                                                        value: Math.abs(selectedKpi.change), 
                                                        color: selectedKpi.change > 0 ? 'green' : 'red' 
                                                    }
                                                ]}
                                            />
                                        </Group>
                                    </Paper>
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 3 }}>
                                    <Paper p="md" radius="lg" withBorder>
                                        <Text size="xs" c="dimmed" fw={500}>Среднее значение</Text>
                                        <Text size="lg" fw={700}>
                                            {(parseFloat(selectedKpi.value.toString().replace(',', '')) * 0.95).toLocaleString()} {selectedKpi.unit}
                                        </Text>
                                        <Progress value={75} size="xs" color={selectedKpi.color} mt="xs" />
                                    </Paper>
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 3 }}>
                                    <Paper p="md" radius="lg" withBorder>
                                        <Text size="xs" c="dimmed" fw={500}>Цель на месяц</Text>
                                        <Text size="lg" fw={700}>
                                            {(parseFloat(selectedKpi.value.toString().replace(',', '')) * 1.1).toLocaleString()} {selectedKpi.unit}
                                        </Text>
                                        <Badge color="blue" variant="light" size="sm" mt="xs">
                                            +10% к текущему
                                        </Badge>
                                    </Paper>
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 3 }}>
                                    <Paper p="md" radius="lg" withBorder>
                                        <Text size="xs" c="dimmed" fw={500}>Прогноз на 7 дней</Text>
                                        <Text size="lg" fw={700}>
                                            {(parseFloat(selectedKpi.value.toString().replace(',', '')) * 1.05).toLocaleString()} {selectedKpi.unit}
                                        </Text>
                                        <Group gap={4} mt="xs">
                                            <IconTrendingUp size={16} color="var(--mantine-color-green-6)" />
                                            <Text size="xs" c="green">+5%</Text>
                                        </Group>
                                    </Paper>
                                </Grid.Col>
                            </Grid>
                        </Paper>

                        {/* График динамики */}
                        <Paper p="xl">
                            <Text size="lg" fw={600} mb="md">📈 Динамика за последние 30 дней</Text>
                            <div style={{ height: '350px', width: '100%', minHeight: '350px' }}>
                                {kpiModalOpened && (
                                    <EChartsWrapper
                                        key={`kpi-chart-${chartKey}`}
                                        option={{
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {
                                                    type: 'cross',
                                                    animation: true,
                                                    label: {
                                                        backgroundColor: '#6a7985'
                                                    }
                                                },
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                borderWidth: 1,
                                                borderColor: '#ccc',
                                                padding: 10,
                                                textStyle: {
                                                    color: '#000'
                                                }
                                            },
                                            grid: {
                                                left: '3%',
                                                right: '4%',
                                                bottom: '3%',
                                                containLabel: true
                                            },
                                            xAxis: {
                                                type: 'category',
                                                boundaryGap: false,
                                                data: generateKpiDetailData(selectedKpi.type || 'stock').map((d: KpiDetailData) => d.date),
                                                axisLabel: {
                                                    rotate: 45,
                                                    interval: 4
                                                }
                                            },
                                            yAxis: {
                                                type: 'value',
                                                name: selectedKpi.unit,
                                                axisLabel: {
                                                    formatter: function(value: number) {
                                                        if (selectedKpi.unit === '%') return `${value}%`;
                                                        if (selectedKpi.unit === 'дней') return `${value} дн.`;
                                                        return value.toLocaleString();
                                                    }
                                                }
                                            },
                                            series: [
                                                {
                                                    name: selectedKpi.title,
                                                    type: 'line',
                                                    smooth: true,
                                                    symbol: 'circle',
                                                    symbolSize: 8,
                                                    sampling: 'lttb',
                                                    itemStyle: {
                                                        color: `var(--mantine-color-${selectedKpi.color}-6)`
                                                    },
                                                    areaStyle: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0,
                                                            y: 0,
                                                            x2: 0,
                                                            y2: 1,
                                                            colorStops: [{
                                                                offset: 0,
                                                                color: `rgba(var(--mantine-color-${selectedKpi.color}-6-rgb), 0.5)` // 50% opacity
                                                            }, {
                                                                offset: 1,
                                                                color: `rgba(var(--mantine-color-${selectedKpi.color}-6-rgb), 0.1)` // 10% opacity
                                                            }]
                                                        }
                                                    },
                                                    data: generateKpiDetailData(selectedKpi.type || 'stock').map((d: KpiDetailData) => d.value)
                                                },
                                                ...(selectedKpi.type === 'stock' ? [{
                                                    name: 'Целевой уровень',
                                                    type: 'line',
                                                    lineStyle: {
                                                        type: 'dashed',
                                                        color: '#91cc75'
                                                    },
                                                    data: generateKpiDetailData(selectedKpi.type).map((d: KpiDetailData) => 45000)
                                                }] : [])
                                            ],
                                            dataZoom: [
                                                {
                                                    type: 'inside',
                                                    start: 0,
                                                    end: 100
                                                },
                                                {
                                                    start: 0,
                                                    end: 100
                                                }
                                            ]
                                        }}
                                        style={{ height: '100%', width: '100%' }}
                                    />
                                )}
                            </div>
                        </Paper>

                        {/* Детальная информация по типу KPI */}
                        <Paper p="xl" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                            <Text size="lg" fw={600} mb="md">📊 Детальная разбивка</Text>
                            {selectedKpi.details && (
                                <Grid>
                                    {Object.entries(selectedKpi.details).map(([key, value]) => (
                                        <Grid.Col key={key} span={{ base: 12, sm: 6, md: 4 }}>
                                            <Paper p="md" withBorder radius="lg">
                                                <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                                                    {key === 'warehouses' ? 'Складов' :
                                                     key === 'avgStock' ? 'Средний остаток' :
                                                     key === 'critical' ? 'Критических' :
                                                     key === 'deliveries' ? 'Поставок' :
                                                     key === 'avgTime' ? 'Среднее время' :
                                                     key === 'delayed' ? 'Задержанных' :
                                                     key === 'target' ? 'Цель' :
                                                     key === 'categories' ? 'По категориям' :
                                                     key === 'slow' ? 'Медленных' :
                                                     key === 'fast' ? 'Быстрых' :
                                                     key === 'threshold' ? 'Порог' :
                                                     key === 'urgent' ? 'Срочных' :
                                                     key === 'warning' ? 'Предупреждений' :
                                                     key === 'onTime' ? 'Вовремя' :
                                                     key === 'cancelled' ? 'Отменено' : key}
                                                </Text>
                                                {typeof value === 'object' && value !== null ? (
                                                    <Stack gap={4} mt="xs">
                                                        {Object.entries(value as { [key: string]: number }).map(([k, v]) => (
                                                            <Group key={k} justify="space-between">
                                                                <Text size="sm">{k}</Text>
                                                                <Badge color={selectedKpi.color} variant="light">
                                                                    {v}%
                                                                </Badge>
                                                            </Group>
                                                        ))}
                                                    </Stack>
                                                ) : (
                                                    <Text size="xl" fw={700} mt="xs">
                                                        {value as React.ReactNode}{key === 'avgTime' ? ' дн.' : 
                                                               key === 'target' || key.includes('Rate') ? '%' : ''}
                                                    </Text>
                                                )}
                                            </Paper>
                                        </Grid.Col>
                                    ))}
                                </Grid>
                            )}
                        </Paper>

                        {/* Рекомендации */}
                        <Paper p="xl">
                            <Group gap="md" mb="md">
                                <ThemeIcon size="lg" radius="xl" variant="light" color="blue">
                                    <IconInfoCircle size={20} />
                                </ThemeIcon>
                                <Text size="lg" fw={600}>💡 Рекомендации</Text>
                            </Group>
                            <Stack gap="md">
                                {selectedKpi.change < 0 ? (
                                    <Alert 
                                        icon={<IconAlertTriangle size={16} />} 
                                        color="orange"
                                        title="Негативная динамика"
                                    >
                                        <Text size="sm">
                                            Показатель снижается. Рекомендуется провести анализ причин и разработать план улучшений.
                                        </Text>
                                    </Alert>
                                ) : (
                                    <Alert 
                                        icon={<IconCircleCheck size={16} />} 
                                        color="green"
                                        title="Позитивная динамика"
                                    >
                                        <Text size="sm">
                                            Показатель растет. Продолжайте текущую стратегию и масштабируйте успешные практики.
                                        </Text>
                                    </Alert>
                                )}
                                <Grid>
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <Paper p="sm" radius="md" withBorder>
                                            <Group gap="xs" mb="xs">
                                                <IconTarget size={16} color="var(--mantine-color-blue-6)" />
                                                <Text size="sm" fw={500}>Краткосрочные действия</Text>
                                            </Group>
                                            <Stack gap={4}>
                                                <Text size="xs">• Оптимизировать текущие процессы</Text>
                                                <Text size="xs">• Провести аудит проблемных зон</Text>
                                                <Text size="xs">• Усилить контроль за метрикой</Text>
                                            </Stack>
                                        </Paper>
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <Paper p="sm" radius="md" withBorder>
                                            <Group gap="xs" mb="xs">
                                                <IconChartLine size={16} color="var(--mantine-color-violet-6)" />
                                                <Text size="sm" fw={500}>Долгосрочная стратегия</Text>
                                            </Group>
                                            <Stack gap={4}>
                                                <Text size="xs">• Внедрить автоматизацию процессов</Text>
                                                <Text size="xs">• Разработать систему прогнозирования</Text>
                                                <Text size="xs">• Оптимизировать цепочку поставок</Text>
                                            </Stack>
                                        </Paper>
                                    </Grid.Col>
                                </Grid>
                            </Stack>
                        </Paper>

                        {/* Кнопки действий */}
                        <Paper p="xl" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                            <Group justify="space-between">
                                <Group>
                                    <Button 
                                        leftSection={<IconDownload size={16} />} 
                                        variant="light"
                                        color={selectedKpi.color}
                                    >
                                        Скачать отчет
                                    </Button>
                                    <Button 
                                        leftSection={<IconRefresh size={16} />} 
                                        variant="subtle"
                                    >
                                        Обновить данные
                                    </Button>
                                </Group>
                                <Button 
                                    variant="gradient"
                                    gradient={{ from: selectedKpi.color, to: 'violet' }}
                                    leftSection={<IconChartBar size={16} />}
                                >
                                    Углубленная аналитика
                                </Button>
                            </Group>
                        </Paper>
                    </Stack>
                )}
            </Modal>
        </Container>
    );
};



export default WarehouseAndLogisticsPageExt;