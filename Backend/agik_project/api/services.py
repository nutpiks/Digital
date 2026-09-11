"""
Математика: фильтрация и агрегации над aggregates.parquet.
Задачи 3.2, 3.3, 3.4, 3.5, 3.7, 3.8, 3.9, 3.10 + бонус.
"""
import pandas as pd
import numpy as np


def filter_indicators(
    df: pd.DataFrame,
    institution_ids: list[str] | None = None,
    forms: list[str] | None = None,
    codes: list[str] | None = None,
    level: int | None = None,
) -> pd.DataFrame:
    """Общий фильтр для всех аналитических роутов (задача 3.2)."""
    result = df
    if institution_ids:
        result = result[result["institution_id"].isin(institution_ids)]
    if forms:
        result = result[result["form"].isin(forms)]
    if codes:
        result = result[result["code"].isin(codes)]
    if level is not None:
        result = result[result["level"] == level]
    return result


def compute_kpi(df: pd.DataFrame) -> dict:
    """KPI для /overview (задача 3.5)."""
    def _val(form: str, code: str) -> float:
        row = df[(df["form"] == form) & (df["code"] == code)]
        if row.empty or pd.isna(row["fact_2026"].iloc[0]):
            return 0.0
        return float(row["fact_2026"].iloc[0])

    services = _val("form2", "6")
    residents = _val("form2", "3")
    products = _val("form2", "4")
    avg_z = float(df["z_score"].mean()) if not df["z_score"].isna().all() else 0.0

    return {
        "services_rub": services,
        "residents": int(residents),
        "products": int(products),
        "avg_z_score": round(avg_z, 3),
    }


def plan_vs_fact(df: pd.DataFrame) -> dict:
    """Сравнение plan_2025 vs fact_2026 (задача 3.3)."""
    sub = df.dropna(subset=["plan_2025", "fact_2026"])
    if sub.empty:
        return {"plan_2025": 0.0, "fact_2026": 0.0, "delta_pct": 0.0}

    plan = float(sub["plan_2025"].sum())
    fact = float(sub["fact_2026"].sum())
    delta = ((fact - plan) / plan * 100) if plan else 0.0

    return {
        "plan_2025": round(plan, 2),
        "fact_2026": round(fact, 2),
        "delta_pct": round(delta, 2),
    }


def top_indicators(df: pd.DataFrame, n: int = 10, by: str = "fact_2026") -> list[dict]:
    """Топ-N показателей (задача 3.7)."""
    sub = df.dropna(subset=[by]).nlargest(n, by)
    cols = ["institution_id", "form", "code", "name", "unit", by]
    return sub[cols].round(3).to_dict(orient="records")


def breakdown(df: pd.DataFrame, by: str = "form") -> list[dict]:
    """Разбивка по форме/единице — для пирога (задача 3.8)."""
    grouped = (
        df.groupby(by, observed=True)["fact_2026"]
          .sum()
          .reset_index()
          .sort_values("fact_2026", ascending=False)
    )
    return grouped.round(2).to_dict(orient="records")


def heatmap_matrix(df: pd.DataFrame, metric: str = "z_score") -> dict:
    """Матрица учреждения × показатели (задача 3.9)."""
    sub = df[df["level"] == 0].copy()
    sub["label"] = sub["form"] + ":" + sub["code"]

    pivot = sub.pivot_table(
        index="institution_id",
        columns="label",
        values=metric,
        aggfunc="mean",
    ).fillna(0)

    return {
        "rows": pivot.index.tolist(),
        "cols": pivot.columns.tolist(),
        "values": pivot.round(3).values.tolist(),
        "metric": metric,
    }


def table_view(
    df: pd.DataFrame,
    sort_by: str = "fact_2026",
    order: str = "desc",
    search: str | None = None,
    limit: int = 20,
    offset: int = 0,
) -> dict:
    """Таблица с пагинацией (задача 3.10)."""
    sub = df.copy()
    if search:
        sub = sub[sub["name"].str.contains(search, case=False, na=False)]

    ascending = order.lower() == "asc"
    sub = sub.sort_values(sort_by, ascending=ascending)

    total = len(sub)
    page = sub.iloc[offset : offset + limit]
    cols = ["institution_id", "form", "code", "name", "unit",
            "fact_2026", "group_mean", "z_score", "deviation_pct"]

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "items": page[cols].round(3).to_dict(orient="records"),
    }


def recommendations(df: pd.DataFrame, z_threshold: float = -0.5) -> list[dict]:
    """Показатели, где z < threshold — 'подтянуть' (бонус)."""
    sub = df[df["z_score"] < z_threshold].copy().sort_values("z_score")
    sub["advice"] = "Ниже среднего по группе — стоит подтянуть"
    cols = ["institution_id", "form", "code", "name",
            "fact_2026", "group_mean", "z_score", "advice"]
    return sub[cols].round(3).head(20).to_dict(orient="records")