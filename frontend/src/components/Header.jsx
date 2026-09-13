// Header.jsx — шапка с фильтром учреждений
import React from "react";
import { useFilters } from "../context/FiltersContext";

export default function Header() {
  const { institutions, selectedIds, toggleInstitution, reset } = useFilters();

  return (
    <header className="r5-header">
      <div className="r5-header-top">
        <h1 className="r5-title">Дашборд ЦП/ТИ</h1>
        <button className="r5-btn-reset" onClick={reset}>
          Сбросить фильтры
        </button>
      </div>

      <div className="r5-filters">
        <span className="r5-filters-label">Учреждения:</span>
        <div className="r5-filters-chips">
          {institutions.map((inst) => {
            const active = selectedIds.includes(inst.institution_id);
            return (
              <button
                key={inst.institution_id}
                className={`r5-chip ${active ? "active" : ""}`}
                onClick={() => toggleInstitution(inst.institution_id)}
                title={inst.institution_name}
              >
                {inst.institution_id}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}