// TopEvents.jsx — горизонтальные столбики (топ-10)
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

export default function TopEvents({ data, title }) {
  if (!data || data.length === 0) {
    return <div className="chart-empty">Нет данных</div>;
  }

  // сортировка по убыванию, потом топ-10
  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 10);

  const colors = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6"];

  return (
    <div className="chart-card">
      {title && <div className="chart-title">{title}</div>}
      <ResponsiveContainer width="100%" height={Math.max(300, sorted.length * 50)}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 10, right: 40, bottom: 10, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
          <XAxis type="number" stroke="#aaa" />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#aaa"
            width={200}
            tick={{ fontSize: 12, fill: "#ccc" }}
            interval={0}
          />
          <Tooltip
            contentStyle={{ background: "#1e1e1e", border: "1px solid #333", borderRadius: 8 }}
            labelStyle={{ color: "#fff" }}
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
            {sorted.map((entry, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}