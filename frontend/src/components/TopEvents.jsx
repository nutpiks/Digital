import React from "react";

// Горизонтальные столбики на div — без библиотек.
export default function TopEvents({ data, title, max = 10 }) {
  if (!data || data.length === 0) {
    return <div className="chart-empty">Нет данных</div>;
  }

  // сортировка по убыванию + топ-N
  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, max);
  const maxVal = Math.max(...sorted.map((d) => d.value), 1);

  const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4",
                  "#8b5cf6", "#ec4899", "#10b981", "#3b82f6", "#f97316"];

  return (
    <div className="chart-card">
      {title && <div className="chart-title">{title}</div>}
      <div className="bars">
        {sorted.map((item, i) => {
          const pct = (item.value / maxVal) * 100;
          return (
            <div className="bar-row" key={i}>
              <div className="bar-label" title={item.name}>
                {item.name}
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: colors[i % colors.length],
                  }}
                />
              </div>
              <div className="bar-value">
                {new Intl.NumberFormat("ru-RU").format(item.value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}