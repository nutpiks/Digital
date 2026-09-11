import pandas as pd

df = pd.read_parquet("data/clean/aggregates.parquet")
print("Shape:", df.shape)
print("Columns:", df.columns.tolist())
print()
print(df[["institution_id", "form", "code", "name", "fact_2026", "z_score"]].head(10))