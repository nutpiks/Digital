// Heatmap.jsx — тепловая карта (CSS-сетка)
// У нас нет данных по дням/часам, поэтому показываем матрицу
// "учреждение × показатель" с интенсивностью по значению.
import React from "react";

export default function Heatmap({ rows, cols, values, title }) {
  if (!rows || !cols || !values || rows.length === 0 || cols.length === 0) {
    return <div className="chart-empty">Нет данных</div>;
  }

  // находим максимум для нормализации
  let max = 0;
  rows.forEach((r) => cols.forEach((c) => {
    const v = values[r]?.[c] ?? 0;
    if (v > max) max = v;
  }));

  const getColor = (v) => {
    if (max === 0) return "rgba(255,255,255,0.05)";
    const alpha = Math.min(1, Math.max(0.05, v / max));
    return `rgba(245, 158, 11, ${alpha.toFixed(2)})`; // оранжевый
  };

  return (
    <div className="chart-card">
      {title && <div className="chart-title">{title}</div>}
      <div
        className="heatmap-grid"
        style={{
          gridTemplateColumns: `140px repeat(${cols.length}, 1fr)`,
        }}
      >
        {/* верхний левый угол — пустой */}
        <div className="heatmap-corner"></div>

        {/* заголовки колонок */}
        {cols.map((c) => (
          <div className="heatmap-col-head" key={`col-${c}`}>{c}</div>
        ))}

        {/* строки */}
        {rows.map((r) => (
          <React.Fragment key={`row-${r}`}>
            <div className="heatmap-row-head">{r}</div>
            {cols.map((c) => {
              const v = values[r]?.[c] ?? 0;
              return (
                <div
                  className="heatmap-cell"
                  key={`${r}-${c}`}
                  style={{ background: getColor(v) }}
                  title={`${r} · ${c}: ${v}`}
                >
                  {v > 0 ? v : ""}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}