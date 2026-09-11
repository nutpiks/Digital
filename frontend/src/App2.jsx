
import React from "react";
import KpiCards from "./components/KpiCards";
import DynamicsChart from "./components/DynamicsChart";

import "./App.css";
import TopEvents from "./components/TopEvents";

import AgePie from "./components/AgePie";
import Heatmap from "./components/Heatmap";

import DataTable from "./components/DataTable";

const mockTop = [
  { name: "Мастер-классы",         value: 19 },
  { name: "Образовательные модули", value: 3  },
  { name: "Курсы повышения",        value: 1  },
  { name: "Проф. переподготовка",   value: 0  },
];

export default function App() {
  const mockKpi = [
    { label: "Резиденты",   value: 356,     unit: "чел.", delta: 12 },
    { label: "Продукты",    value: 115,     unit: "шт.",  delta: -5 },
    { label: "Услуги",      value: 1224900, unit: "₽",    delta: 8 },
    { label: "Темп роста",  value: 23,      unit: "%",    delta: -34 },
  ];

  const mockDynamics = [
    { x: "Образовательные модули", "АГИК": 3, "ВГИИ": 10, "Андрияки": 3, "гмп": 3 },
    { x: "Мастер-классы",          "АГИК": 19, "ВГИИ": 4,  "Андрияки": 4, "гмп": 1 },
    { x: "Курсы повышения",        "АГИК": 1,  "ВГИИ": 0,  "Андрияки": 0, "гмп": 1 },
    { x: "Проф. переподготовка",   "АГИК": 0,  "ВГИИ": 0,  "Андрияки": 0, "гмп": 1 },
  ];

  const mockPie = [
    { name: "АГИК",       value: 356 },
    { name: "ВГИИ",       value: 160 },
    { name: "гмп",        value: 55  },
    { name: "Андрияки",   value: 21  },
    { name: "театриум",   value: 0   },
  ];

  const heatRows = ["АГИК", "ВГИИ", "гмп", "Андрияки", "театриум"];
  const heatCols = ["Модули", "МК", "КПК", "КППК", "Резиденты"];
  const heatValues = {
    "АГИК":     { "Модули": 3,  "МК": 19, "КПК": 1, "КППК": 0, "Резиденты": 356 },
    "ВГИИ":     { "Модули": 10, "МК": 4,  "КПК": 0, "КППК": 0, "Резиденты": 160 },
    "гмп":      { "Модули": 3,  "МК": 1,  "КПК": 1, "КППК": 1, "Резиденты": 55  },
    "Андрияки": { "Модули": 3,  "МК": 4,  "КПК": 0, "КППК": 0, "Резиденты": 21  },
    "театриум": { "Модули": 0,  "МК": 1,  "КПК": 0, "КППК": 0, "Резиденты": 0   },
  };

  const tableData = [
    { institution: "АГИК",     code: "3",   name: "Резиденты",       plan: null, fact: 356 },
    { institution: "АГИК",     code: "4",   name: "Продукты",        plan: null, fact: 115 },
    { institution: "АГИК",     code: "6",   name: "Объём услуг",     plan: null, fact: 1224900 },
    { institution: "ВГИИ",     code: "3",   name: "Резиденты",       plan: null, fact: 160 },
    { institution: "ВГИИ",     code: "6",   name: "Объём услуг",     plan: null, fact: 3550500 },
    { institution: "гмп",      code: "3",   name: "Резиденты",       plan: null, fact: 55 },
    { institution: "гмп",      code: "6",   name: "Объём услуг",     plan: null, fact: 936500 },
    { institution: "Андрияки", code: "3",   name: "Резиденты",       plan: null, fact: 21 },
    { institution: "Андрияки", code: "6",   name: "Объём услуг",     plan: null, fact: 149600 },
    { institution: "театриум", code: "3",   name: "Резиденты",       plan: null, fact: 0 },
  ];

  const tableColumns = [
    { key: "institution", label: "Учреждение" },
    { key: "code",        label: "Код" },
    { key: "name",        label: "Показатель" },
    { key: "fact",        label: "Факт 2026",
      format: (v) => new Intl.NumberFormat("ru-RU").format(v ?? 0) },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ color: "#fff" }}>Дашборд ЦП/ТИ</h1>
      <KpiCards data={mockKpi} />
      <DynamicsChart data={mockDynamics} title="Показатели по учреждениям (2026)" />
      <TopEvents data={mockTop} title="Топ мероприятий (АГИК)" />
      <AgePie data={mockPie} title="Резиденты по учреждениям" />
      <Heatmap
        rows={heatRows}
        cols={heatCols}
        values={heatValues}
        title="Матрица показателей по учреждениям"
        />
        <DataTable
          data={tableData}
          columns={tableColumns}
          title="Все показатели"
          pageSize={10}
        />
    </div>
  );
}

