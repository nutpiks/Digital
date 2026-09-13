import React from "react";

export default function Heatmap({ rows, cols, matrix, title }) {
  if (!rows || !cols || rows.length === 0 || cols.length === 0) {
    return <div className="chart-empty">Нет данных</div>;
  }

  const getVal = (i, j) => (matrix && matrix[i] ? (matrix[i][j] ?? 0) : 0);

  let max = 0;
  rows.forEach((_, i) => cols.forEach((__, j) => {
    const v = Math.abs(getVal(i, j));
    if (v > max) max = v;
  }));

  const getColor = (v) => {
    if (max === 0) return "rgba(255,255,255,0.05)";
    const t = Math.min(1, Math.abs(v) / max);
    if (v >= 0) return `rgba(34,197,94,${(t * 0.8 + 0.05).toFixed(2)})`;
    return `rgba(239,68,68,${(t * 0.8 + 0.05).toFixed(2)})`;
  };

  return (
    <div className="chart-card">
      {title && <div className="chart-title">{title}</div>}
      <div className="heatmap-grid" style={{ gridTemplateColumns: `140px repeat(${cols.length}, 1fr)` }}>
        <div className="heatmap-corner"></div>
        {cols.map((c) => <div className="heatmap-col-head" key={c}>{c}</div>)}
        {rows.map((r, i) => (
          <React.Fragment key={r}>
            <div className="heatmap-row-head">{r}</div>
            {cols.map((c, j) => {
              const v = getVal(i, j);
              return (
                <div className="heatmap-cell" key={`${r}-${c}`}
                     style={{ background: getColor(v) }}
                     title={`${r} · ${c}: ${v.toFixed(2)}`}>
                  {v !== 0 ? v.toFixed(1) : ""}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}