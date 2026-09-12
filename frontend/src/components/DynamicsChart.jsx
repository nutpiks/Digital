import React from "react";

// Линейный график на чистом SVG. Без recharts.
export default function DynamicsChart({ data, title }) {
  if (!data || data.length === 0) {
    return <div className="chart-empty">Нет данных</div>;
  }

  // data = [{ x: "agik", "План 2025": 35, "Факт 2026": 23 }, ...]
  const seriesNames = Object.keys(data[0]).filter((k) => k !== "x");
  const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

  // ширина / высота графика
  const W = 800;
  const H = 320;
  const PAD = 50;

  // максимум по всем значениям
  let maxVal = 0;
  data.forEach((row) => {
    seriesNames.forEach((s) => {
      const v = Number(row[s]) || 0;
      if (v > maxVal) maxVal = v;
    });
  });
  maxVal = Math.max(maxVal, 1); // защита от деления на 0

  const stepX = (W - PAD * 2) / Math.max(data.length - 1, 1);

  const getY = (v) => H - PAD - ((v / maxVal) * (H - PAD * 2));

  // генерация координат для каждой серии
  const lines = seriesNames.map((name, si) => {
    const points = data
      .map((row, i) => `${PAD + i * stepX},${getY(Number(row[name]) || 0)}`)
      .join(" ");
    return { name, points, color: colors[si % colors.length] };
  });

  return (
    <div className="chart-card">
      {title && <div className="chart-title">{title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: 320 }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* сетка по Y */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = PAD + t * (H - PAD * 2);
          const val = Math.round(maxVal * (1 - t));
          return (
            <g key={t}>
              <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#333" strokeDasharray="3 3" />
              <text x={PAD - 8} y={y + 4} fill="#aaa" fontSize="11" textAnchor="end">
                {val}
              </text>
            </g>
          );
        })}

        {/* подписи по X */}
        {data.map((row, i) => (
          <text
            key={i}
            x={PAD + i * stepX}
            y={H - PAD + 18}
            fill="#aaa"
            fontSize="11"
            textAnchor="middle"
          >
            {row.x}
          </text>
        ))}

        {/* линии */}
        {lines.map((l) => (
          <polyline
            key={l.name}
            points={l.points}
            fill="none"
            stroke={l.color}
            strokeWidth="2.5"
          />
        ))}

        {/* точки */}
        {lines.map((l) =>
          data.map((row, i) => (
            <circle
              key={`${l.name}-${i}`}
              cx={PAD + i * stepX}
              cy={getY(Number(row[l.name]) || 0)}
              r="4"
              fill={l.color}
            />
          ))
        )}

        {/* легенда */}
        {lines.map((l, i) => (
          <g key={l.name} transform={`translate(${PAD + i * 140}, 20)`}>
            <rect x="0" y="-8" width="14" height="14" fill={l.color} rx="2" />
            <text x="20" y="3" fill="#ddd" fontSize="12">{l.name}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}