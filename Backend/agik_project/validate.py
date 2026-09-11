"""
Валидатор чистых таблиц.

Проверяет:
  1. Все ожидаемые файлы на месте
  2. Уникальность ключей (institution_id, form, code)
  3. Нет пустых обязательных полей (institution_id, form, code, name)
  4. Подпункты Ф2 ссылаются на существующих родителей
  5. Суммы подпунктов сходятся с родителями (warning, не error)
  6. Все 4 учреждения на месте

Выход: data/clean/validation_report.json
"""
import json
from pathlib import Path
import pandas as pd

CLEAN = Path("data/clean")
EXPECTED_INSTITUTIONS = {"agik", "teatrium", "vgii", "andriyaki"}

errors = []
warnings = []

# ---------- 1. Файлы на месте ----------
required = [
    "indicators.parquet", "indicators.csv",
    "institutions.parquet", "institutions.csv",
    "aggregates.parquet", "aggregates.csv",
    "clusters.parquet", "clusters.csv",
    "schema.json",
]
for f in required:
    if not (CLEAN / f).exists():
        errors.append(f"Файл отсутствует: {f}")

if errors:
    print("КРИТИЧНО — нет файлов, дальше не идём")
    for e in errors:
        print("  X", e)
    raise SystemExit(1)

# ---------- загружаем ----------
df = pd.read_parquet(CLEAN / "indicators.parquet")
inst = pd.read_parquet(CLEAN / "institutions.parquet")

# ---------- 2. Уникальность ключа ----------
dups = df[df.duplicated(["institution_id", "form", "code"], keep=False)]
if not dups.empty:
    errors.append(f"Дубли ключа (institution_id, form, code): "
                  f"{dups[['institution_id','form','code']].values.tolist()}")

# ---------- 3. Пустые обязательные поля ----------
for col in ["institution_id", "form", "code", "name"]:
    n = df[col].isna().sum()
    if n:
        errors.append(f"Пустых значений в '{col}': {n}")

# ---------- 4. Все учреждения на месте ----------
actual = set(inst["institution_id"].tolist())
missing = EXPECTED_INSTITUTIONS - actual
extra = actual - EXPECTED_INSTITUTIONS
if missing:
    errors.append(f"Не хватает учреждений: {sorted(missing)}")
if extra:
    warnings.append(f"Неожиданные учреждения: {sorted(extra)}")

# ---------- 5. Подпункты Ф2 ссылаются на родителей ----------
f2 = df[df["form"] == "form2"]
parents_by_inst = {
    iid: set(g.loc[g["level"] == 0, "code"])
    for iid, g in f2.groupby("institution_id")
}
for _, r in f2[f2["level"] == 1].iterrows():
    p = r["parent_code"]
    iid = r["institution_id"]
    if p not in parents_by_inst.get(iid, set()):
        errors.append(
            f"{iid} {r['code']}: родитель {p} не найден"
        )

# ---------- 6. Суммы подпунктов vs родители ----------
for iid, g in f2.groupby("institution_id"):
    parents = g[g["level"] == 0]
    kids = g[g["level"] == 1]
    for _, p in parents.iterrows():
        p_code = p["code"]
        p_val = p["fact_2026"]
        if pd.isna(p_val):
            continue
        kid_sum = kids.loc[kids["parent_code"] == p_code, "fact_2026"].sum()
        if kid_sum and abs(kid_sum - p_val) > 0.01:
            warnings.append(
                f"{iid} Ф2 код {p_code}: родитель={p_val}, "
                f"сумма детей={kid_sum} (расхождение {p_val - kid_sum})"
            )

# ---------- итог ----------
print("=" * 60)
print("ERRORS:" if errors else "ERRORS: нет")
for e in errors:
    print("  X", e)

print()
print("WARNINGS:" if warnings else "WARNINGS: нет")
for w in warnings:
    print("  !", w)

print("=" * 60)
print(f"Строк в indicators: {len(df)}")
print(f"Учреждений: {len(inst)}")
print(f"Ошибок: {len(errors)}  Предупреждений: {len(warnings)}")

report = {
    "errors": errors,
    "warnings": warnings,
    "stats": {
        "indicators_rows": len(df),
        "institutions": len(inst),
        "institution_ids": sorted(actual),
    },
}
(CLEAN / "validation_report.json").write_text(
    json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
)