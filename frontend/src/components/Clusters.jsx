import React from "react";
import { useClusters } from "../api/hooks";

export default function Clusters() {
  const { data, loading, error } = useClusters();

  if (loading) return <div className="r5-loading">Загрузка кластеров…</div>;
  if (error) return <div className="r5-error">API: {error}</div>;
  if (!data || data.length === 0) return <div className="chart-empty">Нет данных</div>;

  return (
    <div className="chart-card">
      <div className="chart-title">Кластеры учреждений (k-means)</div>
      <div className="dt-wrapper">
        <table className="dt-table">
          <thead>
            <tr>
              <th>Учреждение</th>
              <th>Кластер</th>
              <th>Резиденты</th>
              <th>Продукты</th>
              <th>Услуги (₽)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.institution_id}>
                <td>{row.institution_id}</td>
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 12px",
                      borderRadius: 6,
                      background: row.cluster === 1 ? "#6366f1" : "#f59e0b",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {row.cluster_label || `cluster_${row.cluster}`}
                  </span>
                </td>
                <td>{new Intl.NumberFormat("ru-RU").format(row.residents ?? 0)}</td>
                <td>{new Intl.NumberFormat("ru-RU").format(row.products ?? 0)}</td>
                <td>{new Intl.NumberFormat("ru-RU").format(row.services_rub ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}