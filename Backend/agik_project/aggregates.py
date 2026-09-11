"""
Производные таблицы для дашборда.

Вход:  data/clean/indicators.parquet
Выход: data/clean/aggregates.parquet   — среднее по группе + z-score
       data/clean/aggregates.csv
       data/clean/clusters.parquet      — кластеры учреждений (k-means)
       data/clean/clusters.csv

Что считаем:
  * mean / std / min / max по каждому показателю среди всех учреждений
  * z-score каждого учреждения по каждому показателю
  * k-means по 3 ключевым показателям (резиденты, продукты, объём услуг)
"""
from pathlib import Path
import pandas as pd
import numpy as np

CLEAN = Path("data/clean")

# 3 ключевых показателя, по которым кластеризуем
KEY_CODES = {
    "form2": "3",   # резиденты
    "form2_4": "4", # созданные продукты
    "form2_6": "6", # объём услуг, руб
}


def main():
    df = pd.read_parquet(CLEAN / "indicators.parquet")
    inst = pd.read_parquet(CLEAN / "institutions.parquet")

    # ========== 1. Среднее по группе ==========
    stats = (
        df.groupby(["form", "code", "name"])["fact_2026"]
          .agg(["mean", "std", "min", "max", "count"])
          .reset_index()
          .rename(columns={
              "mean": "group_mean",
              "std":  "group_std",
              "min":  "group_min",
              "max":  "group_max",
              "count": "group_count",
          })
    )

    # присоединяем к каждой строке
    df2 = df.merge(stats, on=["form", "code", "name"], how="left")

    # ========== 2. z-score ==========
    df2["z_score"] = np.where(
        df2["group_std"] > 0,
        (df2["fact_2026"] - df2["group_mean"]) / df2["group_std"],
        0.0,
    )

    # ========== 3. deviation от среднего в % ==========
    df2["deviation_from_mean_pct"] = np.where(
        df2["group_mean"] > 0,
        (df2["fact_2026"] - df2["group_mean"]) / df2["group_mean"] * 100,
        np.nan,
    )

    # сохраняем
    df2.to_parquet(CLEAN / "aggregates.parquet", index=False)
    df2.to_csv(CLEAN / "aggregates.csv", index=False, encoding="utf-8-sig")

    # ========== 4. Кластеризация (k-means, 2 кластера) ==========
    # берём 3 ключевых показателя по учреждениям
    pivot_rows = []
    for inst_id, group in df2.groupby("institution_id"):
        row = {"institution_id": inst_id}
        for label, code in [("residents", "3"), ("products", "4"), ("services_rub", "6")]:
            val = group.loc[
                (group["form"] == "form2") & (group["code"] == code), "fact_2026"
            ]
            row[label] = float(val.iloc[0]) if len(val) and not pd.isna(val.iloc[0]) else 0.0
        pivot_rows.append(row)

    piv = pd.DataFrame(pivot_rows).fillna(0)

    # простая нормализация (z-стандартизация по колонкам)
    X = piv[["residents", "products", "services_rub"]].values
    X_std = (X - X.mean(axis=0)) / (X.std(axis=0) + 1e-9)

    # k-means вручную, k=2 (чтобы не тащить sklearn)
    np.random.seed(42)
    k = 2
    centers = X_std[np.random.choice(len(X_std), k, replace=False)]
    for _ in range(50):
        dists = np.linalg.norm(X_std[:, None, :] - centers[None, :, :], axis=2)
        labels = dists.argmin(axis=1)
        new_centers = np.array([X_std[labels == i].mean(axis=0) if (labels == i).any()
                                 else centers[i] for i in range(k)])
        if np.allclose(new_centers, centers):
            break
        centers = new_centers

    piv["cluster"] = labels
    piv["cluster_label"] = piv["cluster"].map({0: "cluster_A", 1: "cluster_B"})

    piv.to_parquet(CLEAN / "clusters.parquet", index=False)
    piv.to_csv(CLEAN / "clusters.csv", index=False, encoding="utf-8-sig")

    # ========== 5. Итоговый отчёт в терминал ==========
    print(f"OK aggregates: {len(df2)} строк")
    print(f"OK clusters:   {len(piv)} учреждений\n")
    print(piv.to_string(index=False))


if __name__ == "__main__":
    main()