// DataTable.jsx — таблица с сортировкой, поиском, пагинацией
import React, { useState, useMemo } from "react";

export default function DataTable({ data, columns, title, pageSize = 20 }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  if (!data || data.length === 0) {
    return <div className="chart-empty">Нет данных</div>;
  }

  // фильтрация по поиску
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((c) => String(row[c.key] ?? "").toLowerCase().includes(q))
    );
  }, [data, columns, search]);

  // сортировка
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // пагинация
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="chart-card">
      {title && <div className="chart-title">{title}</div>}

      <div className="dt-controls">
        <input
          className="dt-search"
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="dt-count">
          Найдено: {sorted.length} / {data.length}
        </div>
      </div>

      <div className="dt-wrapper">
        <table className="dt-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} onClick={() => handleSort(c.key)}>
                  {c.label}
                  {sortKey === c.key && (
                    <span className="dt-sort-icon">
                      {sortDir === "asc" ? " ▲" : " ▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c.key}>
                    {c.format ? c.format(row[c.key]) : row[c.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dt-pagination">
        <button
          className="dt-btn"
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
        >
          ← Назад
        </button>
        <span className="dt-page-info">
          Стр. {currentPage} из {totalPages}
        </span>
        <button
          className="dt-btn"
          disabled={currentPage === totalPages}
          onClick={() => setPage(currentPage + 1)}
        >
          Вперёд →
        </button>
      </div>
    </div>
  );
}