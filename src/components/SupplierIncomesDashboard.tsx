import { SimpleGrid, Card, Title, Loader, Center } from "@mantine/core";
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useCubeQuery } from "@cubejs-client/react";
import { buildQuery } from "../utils/buildQuery";
import { useFiltersStore } from "../stores/useFiltersStore";

/**
 * SupplierIncomesDashboard
 * ------------------------------------------------------------------
 * Небольшой дашборд из трёх графиков:
 *   1. Динамика выручки по дням (линейный график)
 *   2. Структура выручки по складам (круговая диаграмма)
 *   3. Топ‑10 артикулов по количеству (горизонтальная гистограмма)
 *
 * Все графики «слушают» глобальные фильтры через buildQuery().
 */
export default function SupplierIncomesDashboard() {
  /* ------------------------------------------------------------------ */
  /*  Подписываемся на стор, чтобы при изменении фильтров происходил      */
  /*  автоматический перерендер (buildQuery внутри useCubeQuery сделает  */
  /*  новый запрос, resultSet поменяется → useMemo пересчитает графики).  */
  /* ------------------------------------------------------------------ */
  useFiltersStore((s) => s); // только для подписки

  /* ------------------------------------------------------------------ */
  /*  Cube‑запросы                                                      */
  /* ------------------------------------------------------------------ */
  // 1️⃣ Динамика выручки (granularity = day). buildQuery вернёт timeDimensions
  const revenueTimeQ = useCubeQuery({
    measures: ["SupplierIncomes.totalRevenue"],
    ...buildQuery(),
  });

  // 2️⃣ Выручка по складам (исключаем собственное измерение для «equals»‑фильтра)
  const revenueWhQ = useCubeQuery({
    dimensions: ["SupplierIncomes.warehouseName"],
    measures: ["SupplierIncomes.totalRevenue"],
    order: { "SupplierIncomes.totalRevenue": "desc" },
    ...buildQuery(["SupplierIncomes.warehouseName"]),
  });

  // 3️⃣ Количество по артикулам (top‑10)
  const qtyArticleQ = useCubeQuery({
    dimensions: ["SupplierIncomes.supplierArticle"],
    measures: ["SupplierIncomes.totalQuantity"],
    order: { "SupplierIncomes.totalQuantity": "desc" },
    limit: 10,
    ...buildQuery(["SupplierIncomes.supplierArticle"]),
  });

  /* ------------------------------------------------------------------ */
  /*  Преобразование resultSet → ECharts options                        */
  /* ------------------------------------------------------------------ */
  const revenueTimeOpts = useMemo(() => {
    if (!revenueTimeQ.resultSet) return null;
    const rows = revenueTimeQ.resultSet.chartPivot();
    const dates = rows.map((r) => r.x);
    const revenue = rows.map((r) => Number(r["SupplierIncomes.totalRevenue"]));

    return {
      tooltip: {
        trigger: "axis",
        valueFormatter: (val: number) => val.toLocaleString("ru-RU", { style: "currency", currency: "RUB" }),
      },
      xAxis: { type: "category", data: dates },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (val: number) => val.toLocaleString("ru-RU"),
        },
      },
      series: [
        {
          name: "Выручка, ₽",
          data: revenue,
          type: "line",
          smooth: true,
        },
      ],
    } as const;
  }, [revenueTimeQ.resultSet]);

  const revenueWhOpts = useMemo(() => {
    if (!revenueWhQ.resultSet) return null;
    const rows = revenueWhQ.resultSet.tablePivot();
    const data = rows.map((r) => ({
      name: r["SupplierIncomes.warehouseName"],
      value: Number(r["SupplierIncomes.totalRevenue"]),
    }));
    return {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ₽ ({d}%)",
      },
      legend: { top: "bottom" },
      series: [
        {
          name: "Выручка по складам",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 4, borderColor: "#fff", borderWidth: 2 },
          data,
        },
      ],
    } as const;
  }, [revenueWhQ.resultSet]);

  const qtyArticleOpts = useMemo(() => {
    if (!qtyArticleQ.resultSet) return null;
    const rows = qtyArticleQ.resultSet.tablePivot();
    const articles = rows.map((r) => r["SupplierIncomes.supplierArticle"]);
    const qty = rows.map((r) => Number(r["SupplierIncomes.totalQuantity"]));
    return {
      tooltip: {
        trigger: "axis",
        valueFormatter: (val: number) => val.toLocaleString("ru-RU"),
      },
      grid: { left: 100 },
      xAxis: { type: "value" },
      yAxis: { type: "category", data: articles.reverse() },
      series: [
        {
          name: "Количество",
          type: "bar",
          data: qty.reverse(),
        },
      ],
    } as const;
  }, [qtyArticleQ.resultSet]);

  /* ------------------------------------------------------------------ */
  /*  Вспомогательный компонент Card                                    */
  /* ------------------------------------------------------------------ */
  const renderCard = (title: string, option: any, loading: boolean) => (
    <Card shadow="sm" padding="xs" radius="lg" withBorder>
      <Title order={6} mb="xs">
        {title}
      </Title>
      {loading && (
        <Center h={200}>
          <Loader size="sm" />
        </Center>
      )}
      {!loading && option && (
        <ReactECharts option={option} style={{ height: 240 }} />
      )}
    </Card>
  );

  /* ------------------------------------------------------------------ */
  /*  JSX                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
      {renderCard("Динамика выручки", revenueTimeOpts, revenueTimeQ.isLoading)}
      {renderCard("Выручка по складам", revenueWhOpts, revenueWhQ.isLoading)}
      {renderCard(
        "Топ‑10 артикулов по количеству",
        qtyArticleOpts,
        qtyArticleQ.isLoading
      )}
    </SimpleGrid>
  );
}
