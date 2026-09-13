// FiltersContext.jsx — общее состояние фильтров (учреждения)
import { createContext, useContext, useState, useEffect } from "react";
import { useInstitutions } from "../api/hooks";

const FiltersContext = createContext(null);

export function FiltersProvider({ children }) {
  const [selectedIds, setSelectedIds] = useState([]);      // [] = все
  const { data: institutions } = useInstitutions();

  // когда список учреждений загрузился — выбираем все
  useEffect(() => {
    if (institutions && selectedIds.length === 0) {
      setSelectedIds(institutions.map((i) => i.institution_id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutions]);

  const toggleInstitution = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (institutions) setSelectedIds(institutions.map((i) => i.institution_id));
  };

  const reset = () => selectAll();

  return (
    <FiltersContext.Provider
      value={{
        institutions: institutions || [],
        selectedIds,
        toggleInstitution,
        selectAll,
        reset,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used inside FiltersProvider");
  return ctx;
}
