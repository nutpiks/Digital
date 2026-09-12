// hooks.js — хуки для каждого роута бэкенда
import { useEffect, useState } from "react";
import { apiGet } from "./client";

/**
 * Универсальный хук GET-запроса.
 * При изменении deps — перезапрашивает.
 */
function useFetch(path, params, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiGet(path, params)
      .then((json) => { if (!cancelled) setData(json); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

export function useHealth() {
  return useFetch("/health", {}, []);
}

export function useMeta() {
  return useFetch("/meta", {}, []);
}

export function useInstitutions() {
  return useFetch("/institutions", {}, []);
}

export function useOverview(institutionIds = []) {
  return useFetch("/overview", { institution_ids: institutionIds }, [institutionIds.join(",")]);
}

export function useDynamics(institutionIds = []) {
  return useFetch("/dynamics", { institution_ids: institutionIds }, [institutionIds.join(",")]);
}

export function useTop(n = 10, institutionIds = []) {
  return useFetch("/top", { n, institution_ids: institutionIds }, [n, institutionIds.join(",")]);
}

export function useBreakdown(by = "form", institutionIds = []) {
  return useFetch("/breakdown", { by, institution_ids: institutionIds }, [by, institutionIds.join(",")]);
}

export function useHeatmap(metric = "z_score", institutionIds = []) {
  return useFetch("/heatmap", { metric, institution_ids: institutionIds }, [metric, institutionIds.join(",")]);
}

export function useTable(sortBy = "fact_2026", order = "desc", search = "", limit = 20, offset = 0, institutionIds = []) {
  return useFetch("/table",
    { sort_by: sortBy, order, search, limit, offset, institution_ids: institutionIds },
    [sortBy, order, search, limit, offset, institutionIds.join(",")]
  );
}

export function useClusters() {
  return useFetch("/clusters", {}, []);
}

export function useRecommendations(zThreshold = -0.5, institutionIds = []) {
  return useFetch("/recommendations", { z_threshold: zThreshold, institution_ids: institutionIds }, [zThreshold, institutionIds.join(",")]);
}
