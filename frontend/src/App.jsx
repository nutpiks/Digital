import React from "react";
import { FiltersProvider, useFilters } from "./context/FiltersContext";
import Header from "./components/Header";
import KpiCards from "./components/KpiCards";
import DynamicsChart from "./components/DynamicsChart";
import TopEvents from "./components/TopEvents";
import AgePie from "./components/AgePie";
import Heatmap from "./components/Heatmap";
import DataTable from "./components/DataTable";
import { useOverview, useDynamics, useTop, useBreakdown, useHeatmap, useTable } from "./api/hooks";
import "./App.css";

function Dashboard() {
  const { selectedIds } = useFilters();
  const overview = useOverview(selectedIds);
  const dynamics = useDynamics(selectedIds);
  const top = useTop(10, selectedIds);
  const breakdown = useBreakdown("form", selectedIds);
  const heatmap = useHeatmap("z_score", selectedIds);
  const table = useTable("fact_2026", "desc", "", 20, 0, selectedIds);

  const kpiData = overview.data
    ? [
        { label: "Резиденты", value: overview.data.kpi.residents, unit: "чел.", delta: 0 },
        { label: "Продукты", value: overview.data.kpi.products, unit: "шт.", delta: 0 },
        { label: "Услуги", value: overview.data.kpi.services_rub, unit: "₽", delta: overview.data.plan_vs_fact?.delta_pct ?? 0 },
        { label: "Ср. отклонение", value: overview.data.kpi.avg_deviation_pct, unit: "%", delta: 0 },
      ]
    : [];

  return (
    <div className="app-container">
      <Header />

      {overview.error && <div className="r5-error">API: {overview.error}</div>}

      {overview.loading ? (
        <div className="r5-loading">Загрузка KPI…</div>
      ) : (
        <KpiCards data={kpiData} />
      )}

      {!dynamics.loading && dynamics.data && (
        <DynamicsChart
          data={dynamics.data.map((d) => ({
            x: d.institution_id,
            "План 2025": d.plan_2025,
            "Факт 2026": d.fact_2026,
          }))}
          title="План 2025 vs Факт 2026"
        />
      )}

      {!top.loading && top.data && (
        <TopEvents
          data={top.data.map((d) => ({ name: d.name, value: d.fact_2026 }))}
          title="Топ-10 показателей"
        />
      )}

      {!breakdown.loading && breakdown.data && (
        <AgePie
          data={breakdown.data.map((d) => ({ name: d.form, value: d.fact_2026 }))}
          title="Разбивка по формам"
        />
      )}

      {!heatmap.loading && heatmap.data && heatmap.data.rows?.length > 0 && (
        <Heatmap
          rows={heatmap.data.rows}
          cols={heatmap.data.cols.slice(0, 8)}
          matrix={heatmap.data.values.map((row) => row.slice(0, 8))}
          title="Матрица (z-score)"
        />
      )}

      {!table.loading && table.data && (
        <DataTable
          data={table.data.items}
          columns={[
            { key: "institution_id", label: "Учреждение" },
            { key: "code", label: "Код" },
            { key: "name", label: "Показатель" },
            { key: "fact_2026", label: "Факт", format: (v) => new Intl.NumberFormat("ru-RU").format(v ?? 0) },
          ]}
          title="Все показатели (с API)"
          pageSize={20}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <FiltersProvider>
      <Dashboard />
    </FiltersProvider>
  );
}