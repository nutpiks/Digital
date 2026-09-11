// AgePie.jsx — круговая диаграмма (топ-5 + "Прочее")
import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export default function AgePie({ data, title }) {
  if (!data || data.length === 0) {
    return <div className="chart-empty">Нет данных</div>;
  }

  // сортируем по убыванию
  const sorted = [...data].sort((a, b) => b.value - a.value);

  // топ-5, остальное → "Прочее"
  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);
  const final = [...top];
  if (rest.length > 0) {
    final.push({
      name: "Прочее",
      value: rest.reduce((sum, item) => sum + item.value, 0),
    });
  }

  const colors = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#6b7280"];

  return (
    <div className="chart-card">
      {title && <div className="chart-title">{title}</div>}
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={final}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            paddingAngle={2}
            label={(entry) => `${entry.name}: ${entry.value}`}
            labelLine={{ stroke: "#666" }}
          >
            {final.map((entry, i) => (
              <Cell key={i} fill={colors[i % colors.length]} stroke="#1e1e1e" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#1e1e1e", border: "1px solid #333", borderRadius: 8 }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}