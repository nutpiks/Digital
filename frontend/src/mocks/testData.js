// testData.js — временные данные для теста компонентов
// Когда придёт API от бэкенда — эти данные удалятся

export const mockKpi = [
  { label: "Резиденты",   value: 356,     unit: "чел.", delta: 12 },
  { label: "Продукты",    value: 115,     unit: "шт.",  delta: -5 },
  { label: "Услуги",      value: 1224900, unit: "₽",    delta: 8 },
  { label: "Темп роста",  value: 23,      unit: "%",    delta: -34 },
];

export const mockDynamics = [
  { x: "Модули",         "АГИК": 3,  "ВГИИ": 10, "Андрияки": 3, "гмп": 3 },
  { x: "Мастер-классы",  "АГИК": 19, "ВГИИ": 4,  "Андрияки": 4, "гмп": 1 },
  { x: "КПК",            "АГИК": 1,  "ВГИИ": 0,  "Андрияки": 0, "гмп": 1 },
  { x: "КППК",           "АГИК": 0,  "ВГИИ": 0,  "Андрияки": 0, "гмп": 1 },
];

export const mockTop = [
  { name: "Мастер-классы",          value: 19 },
  { name: "Образовательные модули", value: 3  },
  { name: "Курсы повышения",        value: 1  },
  { name: "Проф. переподготовка",   value: 0  },
];

export const mockPie = [
  { name: "АГИК",     value: 356 },
  { name: "ВГИИ",     value: 160 },
  { name: "гмп",      value: 55  },
  { name: "Андрияки", value: 21  },
  { name: "театриум", value: 0   },
];

export const heatRows = ["АГИК", "ВГИИ", "гмп", "Андрияки", "театриум"];
export const heatCols = ["Модули", "МК", "КПК", "КППК", "Резиденты"];
export const heatValues = {
  "АГИК":     { "Модули": 3,  "МК": 19, "КПК": 1, "КППК": 0, "Резиденты": 356 },
  "ВГИИ":     { "Модули": 10, "МК": 4,  "КПК": 0, "КППК": 0, "Резиденты": 160 },
  "гмп":      { "Модули": 3,  "МК": 1,  "КПК": 1, "КППК": 1, "Резиденты": 55  },
  "Андрияки": { "Модули": 3,  "МК": 4,  "КПК": 0, "КППК": 0, "Резиденты": 21  },
  "театриум": { "Модули": 0,  "МК": 1,  "КПК": 0, "КППК": 0, "Резиденты": 0   },
};

export const tableData = [
  { institution: "АГИК",     code: "3", name: "Резиденты",   fact: 356 },
  { institution: "АГИК",     code: "4", name: "Продукты",    fact: 115 },
  { institution: "АГИК",     code: "6", name: "Объём услуг", fact: 1224900 },
  { institution: "ВГИИ",     code: "3", name: "Резиденты",   fact: 160 },
  { institution: "ВГИИ",     code: "6", name: "Объём услуг", fact: 3550500 },
  { institution: "гмп",      code: "3", name: "Резиденты",   fact: 55 },
  { institution: "гмп",      code: "6", name: "Объём услуг", fact: 936500 },
  { institution: "Андрияки", code: "3", name: "Резиденты",   fact: 21 },
  { institution: "Андрияки", code: "6", name: "Объём услуг", fact: 149600 },
  { institution: "театриум", code: "3", name: "Резиденты",   fact: 0 },
];

export const tableColumns = [
  { key: "institution", label: "Учреждение" },
  { key: "code",        label: "Код" },
  { key: "name",        label: "Показатель" },
  { key: "fact",        label: "Факт 2026",
    format: (v) => new Intl.NumberFormat("ru-RU").format(v ?? 0) },
];