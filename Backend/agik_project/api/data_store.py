"""
DataStore — единая точка загрузки всех parquet-файлов.
Загружается ОДИН раз при старте FastAPI (задача 3.1).
"""
from pathlib import Path
import pandas as pd


class DataStore:
    """Синглтон: держит датафреймы в памяти на всё время работы сервера."""

    # api/data_store.py → ../data/clean/
    CLEAN_DIR = Path(__file__).resolve().parent.parent / "data" / "clean"

    _agg: pd.DataFrame | None = None
    _inst: pd.DataFrame | None = None
    _clusters: pd.DataFrame | None = None
    _loaded: bool = False

    @classmethod
    def load(cls) -> None:
        if cls._loaded:
            return

        cls._agg = pd.read_parquet(cls.CLEAN_DIR / "aggregates.parquet")
        cls._inst = pd.read_parquet(cls.CLEAN_DIR / "institutions.parquet")
        cls._clusters = pd.read_parquet(cls.CLEAN_DIR / "clusters.parquet")

        for df in (cls._agg, cls._inst, cls._clusters):
            if "institution_id" in df.columns:
                df["institution_id"] = df["institution_id"].astype(str)

        cls._loaded = True
        print(f"DataStore: aggregates={len(cls._agg)}, "
              f"institutions={len(cls._inst)}, clusters={len(cls._clusters)}")

    @classmethod
    def agg(cls) -> pd.DataFrame:
        if cls._agg is None:
            raise RuntimeError("DataStore не загружен!")
        return cls._agg

    @classmethod
    def institutions(cls) -> pd.DataFrame:
        if cls._inst is None:
            raise RuntimeError("DataStore не загружен!")
        return cls._inst

    @classmethod
    def clusters(cls) -> pd.DataFrame:
        if cls._clusters is None:
            raise RuntimeError("DataStore не загружен!")
        return cls._clusters

    @classmethod
    def is_loaded(cls) -> bool:
        return cls._loaded