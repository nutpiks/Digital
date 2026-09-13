"""Системные роуты: /health, /meta, /institutions, /clusters."""
from fastapi import APIRouter
from data_store import DataStore
from services import clean_records

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "loaded": DataStore.is_loaded()}


@router.get("/meta")
def meta():
    """Справочник: учреждения, диапазон лет, даты отчётов."""
    inst = DataStore.institutions()
    agg = DataStore.agg()

    return {
        "institutions_count": len(inst),
        "indicators_count": len(agg),
        "institution_ids": inst["institution_id"].tolist(),
        "years": sorted(inst["year"].dropna().unique().tolist()),
        "forms": sorted(agg["form"].dropna().unique().tolist()),
    }


@router.get("/institutions")
def institutions():
    """Полный справочник учреждений."""
    inst = DataStore.institutions()
    cols = ["institution_id", "institution_name", "center_name",
            "center_type", "report_date", "period", "year", "rector", "center_head"]
    existing = [c for c in cols if c in inst.columns]
    return clean_records(inst[existing].to_dict(orient="records"))


@router.get("/clusters")
def clusters():
    """Кластеры учреждений (k-means)."""
    df = DataStore.clusters()
    return clean_records(df.to_dict(orient="records"))