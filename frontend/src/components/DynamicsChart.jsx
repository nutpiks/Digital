// DynamicsChart.jsx — линейный график динамики (план 2025 vs факт 2026)
import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export default function DynamicsChart({ data, title }) {
  // какие линии включены (по умолчанию все)
  const [hidden, setHidden] = useState({});

  if (!data || data.length === 0) {
    return <div className="chart-empty">Нет данных для графика</div>;
  }

  // имена линий — все ключи кроме x
  const seriesNames = Object.keys(data[0]).filter((k) => k !== "x");

  const toggleSeries = (name) => {
    setHidden((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const colors = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

  return (
    <div className="chart-card">
      {title && <div className="chart-title">{title}</div>}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="x" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip
            contentStyle={{ background: "#1e1e1e", border: "1px solid #333", borderRadius: 8 }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend
            onClick={(e) => toggleSeries(e.dataKey)}
            wrapperStyle={{ cursor: "pointer", color: "#fff" }}
          />
          {seriesNames.map((name, i) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              hide={!!hidden[name]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}