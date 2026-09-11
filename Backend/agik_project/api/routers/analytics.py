"""Аналитические роуты: /overview, /dynamics, /top, /heatmap, /table, /recommendations."""
from fastapi import APIRouter, Query
from typing import Optional

from data_store import DataStore
from services import (
    filter_indicators, compute_kpi, plan_vs_fact,
    top_indicators, breakdown, heatmap_matrix, table_view, recommendations,
)

router = APIRouter()


@router.get("/overview")
def overview(institution_ids: Optional[list[str]] = Query(None)):
    """4 KPI-карточки (задача 3.5)."""
    df = filter_indicators(DataStore.agg(), institution_ids=institution_ids)
    return {
        "kpi": compute_kpi(df),
        "plan_vs_fact": plan_vs_fact(df),
        "records": len(df),
    }


@router.get("/dynamics")
def dynamics(institution_ids: Optional[list[str]] = Query(None)):
    """Сравнение plan 2025 vs fact 2026 (задача 3.6, адаптировано)."""
    df = filter_indicators(DataStore.agg(), institution_ids=institution_ids)
    result = []
    for iid, group in df.groupby("institution_id"):
        result.append({
            "institution_id": iid,
            **plan_vs_fact(group),
        })
    return result


@router.get("/top")
def top(n: int = 10, by: str = "fact_2026",
        institution_ids: Optional[list[str]] = Query(None)):
    """Топ-N показателей (задача 3.7)."""
    df = filter_indicators(DataStore.agg(), institution_ids=institution_ids)
    return top_indicators(df, n=n, by=by)


@router.get("/breakdown")
def breakdown_route(by: str = "form",
                    institution_ids: Optional[list[str]] = Query(None)):
    """Разбивка по форме (задача 3.8)."""
    df = filter_indicators(DataStore.agg(), institution_ids=institution_ids)
    return breakdown(df, by=by)


@router.get("/heatmap")
def heatmap(metric: str = "z_score",
            institution_ids: Optional[list[str]] = Query(None)):
    """Матрица учреждения × показатели (задача 3.9)."""
    df = filter_indicators(DataStore.agg(), institution_ids=institution_ids)
    return heatmap_matrix(df, metric=metric)


@router.get("/table")
def table(
    sort_by: str = "fact_2026",
    order: str = "desc",
    search: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    institution_ids: Optional[list[str]] = Query(None),
):
    """Таблица с пагинацией (задача 3.10)."""
    df = filter_indicators(DataStore.agg(), institution_ids=institution_ids)
    return table_view(df, sort_by=sort_by, order=order,
                      search=search, limit=limit, offset=offset)


@router.get("/recommendations")
def recommendations_route(z_threshold: float = -0.5,
                          institution_ids: Optional[list[str]] = Query(None)):
    """Рекомендации: где z < threshold (бонус)."""
    df = filter_indicators(DataStore.agg(), institution_ids=institution_ids)
    return recommendations(df, z_threshold=z_threshold)