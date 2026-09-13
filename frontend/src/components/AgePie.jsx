import React from "react";

// Круговой пирог через SVG (без recharts).
export default function AgePie({ data, title }) {
  if (!data || data.length === 0) {
    return <div className="chart-empty">Нет данных</div>;
  }

  // сортировка + топ-5 + "Прочее"
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);
  const items = [...top];
  if (rest.length > 0) {
    items.push({
      name: "Прочее",
      value: rest.reduce((sum, x) => sum + x.value, 0),
    });
  }

  const total = items.reduce((sum, x) => sum + x.value, 0) || 1;
  const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

  // строим conic-gradient
  let acc = 0;
  const segments = items.map((item, i) => {
    const start = (acc / total) * 100;
    acc += item.value;
    const end = (acc / total) * 100;
    return `${colors[i % colors.length]} ${start}% ${end}%`;
  }).join(", ");

  return (
    <div className="chart-card">
      {title && <div className="chart-title">{title}</div>}
      <div className="pie-wrap">
        <div
          className="pie-circle"
          style={{ background: `conic-gradient(${segments})` }}
        >
          <div className="pie-hole">
            <div className="pie-total">{new Intl.NumberFormat("ru-RU").format(total)}</div>
            <div className="pie-total-label">всего</div>
          </div>
        </div>
        <div className="pie-legend">
          {items.map((item, i) => (
            <div className="pie-legend-row" key={i}>
              <span
                className="pie-dot"
                style={{ background: colors[i % colors.length] }}
              />
              <span className="pie-legend-name">{item.name}</span>
              <span className="pie-legend-value">
                {new Intl.NumberFormat("ru-RU").format(item.value)}
              </span>
              <span className="pie-legend-pct">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}