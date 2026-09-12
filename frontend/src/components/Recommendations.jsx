import React from "react";
import { useRecommendations } from "../api/hooks";

export default function Recommendations({ institutionIds = [] }) {
  const { data, loading, error } = useRecommendations(-0.5, institutionIds);

  if (loading) return <div className="r5-loading">Загрузка рекомендаций…</div>;
  if (error) return <div className="r5-error">API: {error}</div>;

  return (
    <div className="chart-card">
      <div className="chart-title">Рекомендации: что подтянуть</div>
      {(!data || data.length === 0) ? (
        <div className="chart-empty">Все показатели в норме</div>
      ) : (
        <div className="rec-list">
          {data.map((row, i) => (
            <div className="rec-item" key={i}>
              <div className="rec-head">
                <span className="rec-inst">{row.institution_id}</span>
                <span className="rec-name">{row.name}</span>
                <span className="rec-z">z = {Number(row.z_score).toFixed(2)}</span>
              </div>
              <div className="rec-advice">{row.advice}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}