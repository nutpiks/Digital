// KpiCards.jsx — 4 карточки с ключевыми показателями
import React from "react";

export default function KpiCards({ data }) {
  if (!data || data.length === 0) {
    return <div className="kpi-empty">Нет данных</div>;
  }

  const formatValue = (value, unit) => {
    if (value === null || value === undefined) return "—";
    if (unit === "₽") {
      return new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " ₽";
    }
    if (unit === "%") return value.toFixed(0) + "%";
    return new Intl.NumberFormat("ru-RU").format(value);
  };

  const renderDelta = (delta) => {
    if (delta === null || delta === undefined) return null;
    const positive = delta >= 0;
    return (
      <span className={`kpi-delta ${positive ? "up" : "down"}`}>
        {positive ? "▲" : "▼"} {Math.abs(delta).toFixed(0)}%
      </span>
    );
  };

  return (
    <div className="kpi-grid">
      {data.map((item, idx) => (
        <div className="kpi-card" key={idx}>
          <div className="kpi-value">{formatValue(item.value, item.unit)}</div>
          <div className="kpi-label">{item.label}</div>
          {renderDelta(item.delta)}
        </div>
      ))}
    </div>
  );
}