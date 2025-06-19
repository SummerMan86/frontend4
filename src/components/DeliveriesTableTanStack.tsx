import React, { useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    ColumnResizeMode,
} from '@tanstack/react-table';
import {
    Paper,
    Table,
    Group,
    Button,
    TextInput,
    ActionIcon,
    Text,
    Badge,
    Menu,
    Checkbox,
    Pagination,
    Select,
    Box,
    Stack,
    Title,
    Flex,
    Tooltip,
} from '@mantine/core';
import {
    IconDownload,
    IconRefresh,
    IconEye,
    IconTruck,
    IconSearch,
    IconFilter,
    IconColumns,
    IconSortAscending,
    IconSortDescending,
    IconChevronUp,
    IconChevronDown,
} from '@tabler/icons-react';

// Интерфейс для данных поставки
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

interface DeliveriesTableProps {
    data: Delivery[];
}

const columnHelper = createColumnHelper<Delivery>();

const DeliveriesTableTanStack: React.FC<DeliveriesTableProps> = ({ data }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15,
    });

    // Определение колонок
    const columns = useMemo<ColumnDef<Delivery, any>[]>(
        () => [
            columnHelper.accessor('sku', {
                header: 'SKU',
                cell: (info) => (
                    <Text size="sm" fw={500}>
                        {info.getValue()}
                    </Text>
                ),
                enableResizing: true,
                minSize: 80,
                size: 120,
                maxSize: 200,
            }),
            columnHelper.accessor('orderNumber', {
                header: 'Номер заказа',
                cell: (info) => (
                    <Text size="sm">{info.getValue()}</Text>
                ),
                enableResizing: true,
                minSize: 100,
                size: 140,
                maxSize: 250,
            }),
            columnHelper.accessor('vendorCode', {
                header: 'Артикул продавца',
                cell: (info) => (
                    <Text size="sm">{info.getValue()}</Text>
                ),
                enableResizing: true,
                minSize: 120,
                size: 150,
                maxSize: 250,
            }),
            columnHelper.accessor('category', {
                header: 'Категория',
                cell: (info) => (
                    <Badge variant="light" size="sm">
                        {info.getValue()}
                    </Badge>
                ),
                enableResizing: true,
                minSize: 80,
                size: 120,
                maxSize: 200,
            }),
            columnHelper.accessor('barcodeWB', {
                header: 'Баркод WB',
                cell: (info) => (
                    <Text size="sm" ff="monospace">
                        {info.getValue()}
                    </Text>
                ),
                enableResizing: true,
                minSize: 100,
                size: 140,
                maxSize: 200,
            }),
            columnHelper.accessor('packed', {
                header: 'Упаковано',
                cell: (info) => (
                    <Text size="sm">{info.getValue()} шт</Text>
                ),
                enableResizing: true,
                minSize: 80,
                size: 100,
                maxSize: 150,
            }),
            columnHelper.accessor('accepted', {
                header: 'Принято',
                cell: (info) => (
                    <Text size="sm">{info.getValue()} шт</Text>
                ),
                enableResizing: true,
                minSize: 80,
                size: 100,
                maxSize: 150,
            }),
            columnHelper.accessor('inSale', {
                header: 'В продаже',
                cell: (info) => (
                    <Text size="sm">{info.getValue()} шт</Text>
                ),
                enableResizing: true,
                minSize: 80,
                size: 100,
                maxSize: 150,
            }),
            columnHelper.accessor('plannedDate', {
                header: 'Плановая дата',
                cell: (info) => (
                    <Text size="sm">{info.getValue()}</Text>
                ),
                enableResizing: true,
                minSize: 100,
                size: 120,
                maxSize: 180,
            }),
            columnHelper.accessor('warehouse', {
                header: 'Склад',
                cell: (info) => (
                    <Text size="sm">{info.getValue()}</Text>
                ),
                enableResizing: true,
                minSize: 80,
                size: 120,
                maxSize: 200,
            }),
            columnHelper.accessor('actualDate', {
                header: 'Фактическая дата',
                cell: (info) => (
                    <Text size="sm">{info.getValue() || '-'}</Text>
                ),
                enableResizing: true,
                minSize: 120,
                size: 140,
                maxSize: 200,
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Действия',
                cell: () => (
                    <Group gap="xs">
                        <Tooltip label="Просмотр">
                            <ActionIcon variant="light" color="blue" size="sm">
                                <IconEye size={16} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Отследить">
                            <ActionIcon variant="light" color="green" size="sm">
                                <IconTruck size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                ),
                enableResizing: true,
                minSize: 100,
                size: 120,
                maxSize: 180,
            }),
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        columnResizeMode: 'onEnd' as ColumnResizeMode,
        enableColumnResizing: true,
    });

    return (
        <Stack gap="md">
            {/* Заголовок и действия */}
            <Group justify="space-between">
                <Title order={4}>Остатки и ПВЗ</Title>
                <Group>
                    <Button leftSection={<IconDownload size={16} />} variant="light">
                        Экспорт
                    </Button>
                    <Button leftSection={<IconRefresh size={16} />} variant="light">
                        Обновить
                    </Button>
                </Group>
            </Group>

            {/* Панель фильтров и настроек */}
            <Paper p="md" withBorder>
                <Group justify="space-between">
                    <Group>
                        <TextInput
                            placeholder="Поиск по всем полям..."
                            leftSection={<IconSearch size={16} />}
                            value={globalFilter ?? ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            style={{ minWidth: 300 }}
                        />
                        <Select
                            placeholder="Размер страницы"
                            data={[
                                { value: '10', label: '10 записей' },
                                { value: '15', label: '15 записей' },
                                { value: '25', label: '25 записей' },
                                { value: '50', label: '50 записей' },
                            ]}
                            value={pagination.pageSize.toString()}
                            onChange={(value) => {
                                setPagination(prev => ({
                                    ...prev,
                                    pageSize: Number(value),
                                    pageIndex: 0,
                                }));
                            }}
                            style={{ width: 140 }}
                        />
                    </Group>
                    
                    {/* Настройка видимости колонок */}
                    <Menu shadow="md" width={250}>
                        <Menu.Target>
                            <Button variant="light" leftSection={<IconColumns size={16} />}>
                                Колонки
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Видимость колонок</Menu.Label>
                            {table.getAllLeafColumns().map(column => {
                                if (column.id === 'actions') return null;
                                return (
                                    <Menu.Item key={column.id}>
                                        <Checkbox
                                            checked={column.getIsVisible()}
                                            onChange={column.getToggleVisibilityHandler()}
                                            label={column.columnDef.header as string}
                                        />
                                    </Menu.Item>
                                );
                            })}
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Paper>

            {/* Таблица */}
            <Paper withBorder style={{ overflow: 'auto' }}>
                <Table
                    highlightOnHover
                    style={{
                        width: table.getCenterTotalSize(),
                        tableLayout: 'fixed',
                        userSelect: 'none',
                    }}
                >
                    <Table.Thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <Table.Tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <Table.Th
                                        key={header.id}
                                        style={{
                                            width: header.getSize(),
                                            position: 'relative',
                                            cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                        }}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <Flex align="center" gap="xs">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getCanSort() && (
                                                <Box>
                                                    {header.column.getIsSorted() === 'asc' ? (
                                                        <IconChevronUp size={14} />
                                                    ) : header.column.getIsSorted() === 'desc' ? (
                                                        <IconChevronDown size={14} />
                                                    ) : (
                                                        <Box style={{ width: 14, height: 14 }} />
                                                    )}
                                                </Box>
                                            )}
                                        </Flex>
                                        
                                        {/* Ресайзер колонки */}
                                        {header.column.getCanResize() && (
                                            <Box
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    top: 0,
                                                    height: '100%',
                                                    width: 5,
                                                    background: header.column.getIsResizing() ? '#3b82f6' : 'rgba(0,0,0,0.1)',
                                                    cursor: 'col-resize',
                                                    userSelect: 'none',
                                                    touchAction: 'none',
                                                    opacity: header.column.getIsResizing() ? 1 : 0,
                                                    transition: 'opacity 0.2s ease',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.opacity = '1';
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!header.column.getIsResizing()) {
                                                        e.currentTarget.style.opacity = '0';
                                                    }
                                                }}
                                            />
                                        )}
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        ))}
                    </Table.Thead>
                    <Table.Tbody>
                        {table.getRowModel().rows.map(row => (
                            <Table.Tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <Table.Td
                                        key={cell.id}
                                        style={{
                                            width: cell.column.getSize(),
                                        }}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Paper>

            {/* Пагинация */}
            <Group justify="space-between">
                <Text size="sm" c="dimmed">
                    Показано {table.getRowModel().rows.length} из {table.getFilteredRowModel().rows.length} записей
                    {table.getFilteredRowModel().rows.length !== data.length && (
                        <> (отфильтровано из {data.length})</>
                    )}
                </Text>
                
                <Pagination
                    total={table.getPageCount()}
                    value={table.getState().pagination.pageIndex + 1}
                    onChange={(page) => table.setPageIndex(page - 1)}
                    size="sm"
                />
            </Group>
        </Stack>
    );
};

export default DeliveriesTableTanStack;