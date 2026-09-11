"""
Универсальный парсер отчётов ЦП/ТИ (формат АГИК/ТЕАТРИУМ/ВГИИ/Андрияки).

Вход:  data/raw/*.xlsx  (4 файла одного формата)
Выход: data/clean/institutions.parquet   — справочник организаций
       data/clean/institutions.csv
       data/clean/indicators.parquet     — все показатели всех организаций
       data/clean/indicators.csv
       data/clean/schema.json            — описание полей
"""
import re
import json
from pathlib import Path
import pandas as pd

RAW = Path("data/raw")
CLEAN = Path("data/clean")
CLEAN.mkdir(parents=True, exist_ok=True)

# ---- маппинг имени файла на institution_id
FILE_TO_ID = {
    "АГИК":     "agik",
    "театриум": "teatrium",
    "ВГИИ":     "vgii",
    "Андрияки": "andriyaki",
}


# ================= УТИЛИТЫ =================

def to_num(x):
    """'1 224 900' → 1224900.0 ; excel-формула или 'не требуется' → None."""
    if x is None:
        return None
    s = str(x).strip()
    if not s or s.lower() in {"не требуется", "nan", "none", "-"}:
        return None
    if s.startswith("="):
        return None
    s = s.replace("\xa0", "").replace(" ", "").replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return None


def split_unit(name):
    """'…, единиц' → ('…', 'единиц')."""
    m = re.match(r"^(.*?),\s*([^,]+)$", str(name).strip())
    return (m.group(1).strip(), m.group(2).strip()) if m else (str(name).strip(), "")


def letterize(df):
    """Даёт колонкам имена A, B, C… — не зависим от шапки."""
    df = df.copy()
    df.columns = [chr(ord("A") + i) for i in range(len(df.columns))]
    return df


def extract_meta(title_df):
    """ТИТУЛ → словарь метаданных."""
    text = "\n".join(
        str(v) for v in title_df.astype(str).values.ravel() if str(v).strip()
    )

    def grab(pattern, default=None):
        m = re.search(pattern, text)
        return m.group(1).strip() if m else default

    org = grab(r"(?:на базе которой создан[^\n]*?)[\n:]\s*([^\n]{5,200})")
    if not org:
        org = grab(r"(?:организация|институт|академия)[^\n]{0,40}[:\-]\s*([^\n]{5,200})")

    center = grab(r"(?:творческий инкубатор|центр прототипирования|центр)\s*[:\-]\s*([^\n]{3,200})")
    date = grab(r"Дата формирования отчета[:\s]+([\d.]+)")
    deadline = grab(r"(не позднее [^\n]+|\d{1,2}\s+сентября)")
    period = grab(r"(Ежеквартальная|Ежемесячная|Ежегодная)")
    year = grab(r"(\d{4})\s*год")

    return {
        "institution_name": org,
        "center_name": center,
        "report_date": date,
        "deadline": deadline,
        "period": period,
        "year": int(year) if year else 2026,
        "center_type": (
            "Творческий инкубатор" if "инкубатор" in text.lower()
            else "Центр прототипирования" if "прототип" in text.lower()
            else None
        ),
    }


def extract_signatures(df):
    """Ловит ФИО ректора и руководителя ЦП."""
    text = "\n".join(str(v) for v in df.astype(str).values.ravel() if str(v).strip())

    rector = re.search(
        r"(?:ректор|директор|и\.о\.\s*ректора|врио\s*директора)\s*[^\n]{0,40}?"
        r"([А-ЯЁ][а-яё]+\s+[А-ЯЁ]\.\s?[А-ЯЁ]?\.?)",
        text, re.IGNORECASE,
    )
    head = re.search(
        r"(?:руководитель\s+(?:ЦП|ТИ))\s*[^\n]{0,40}?"
        r"([А-ЯЁ][а-яё]+\s+[А-ЯЁ]\.\s?[А-ЯЁ]?\.?)",
        text, re.IGNORECASE,
    )
    return {
        "rector": rector.group(1) if rector else None,
        "center_head": head.group(1) if head else None,
    }


# ================= ПАРСЕРЫ ЛИСТОВ =================

def parse_form1(df, inst_id):
    rows = []
    for _, r in df.iterrows():
        name = str(r.get("B", "")).strip()
        if not name:
            continue
        if "Темп роста" not in name and "Увеличение числа" not in name:
            continue
        clean_name, unit = split_unit(name)
        plan = to_num(r.get("C"))
        pct = to_num(r.get("D"))
        fact = to_num(r.get("E"))
        rows.append({
            "institution_id": inst_id,
            "form": "form1",
            "code": "1",
            "parent_code": None,
            "level": 0,
            "name": clean_name,
            "unit": unit or "процент",
            "plan_2025": plan,
            "fact_2026": fact,
            "plan_percent": pct,
            "deviation": (fact - plan) if fact is not None and plan is not None else None,
            "deviation_pct": ((fact - plan) / plan * 100)
                              if fact is not None and plan not in (None, 0) else None,
            "formula": str(r.get("F", "")).strip() or None,
            "evidence": None,
        })
    return rows


def parse_appendix_f1(df, inst_id):
    rows = []
    for _, r in df.iterrows():
        code = str(r.get("A", "")).strip()
        if not re.match(r"^\d+$", code):
            continue
        name = str(r.get("B", "")).strip()
        clean_name, unit = split_unit(name)
        plan = to_num(r.get("C"))
        fact = to_num(r.get("D"))
        rows.append({
            "institution_id": inst_id,
            "form": "appendix_f1",
            "code": code,
            "parent_code": None,
            "level": 0,
            "name": clean_name,
            "unit": unit or "единиц",
            "plan_2025": plan,
            "fact_2026": fact,
            "plan_percent": None,
            "deviation": (fact - plan) if fact is not None and plan is not None else None,
            "deviation_pct": ((fact - plan) / plan * 100)
                              if fact is not None and plan not in (None, 0) else None,
            "formula": None,
            "evidence": str(r.get("E", "")).strip() or None,
        })
    return rows


def parse_form2(df, inst_id):
    rows = []
    for _, r in df.iterrows():
        raw_a = r.get("A")
        code = "" if pd.isna(raw_a) else str(raw_a).strip()
        name = str(r.get("B", "")).strip()

        # если в A пусто — смотрим, не начинается ли name с "3.1. ..." и т.д.
        if not code:
            m = re.match(r"^(\d+\.\d+)\.\s*(.+)$", name)
            if m:
                code = m.group(1)
                name = m.group(2).strip()

        if not re.match(r"^\d+(\.\d+)?$", code):
            continue

        clean_name, unit = split_unit(name)
        fact = to_num(r.get("C"))
        rows.append({
            "institution_id": inst_id,
            "form": "form2",
            "code": code,
            "parent_code": code.split(".")[0] if "." in code else None,
            "level": 1 if "." in code else 0,
            "name": clean_name,
            "unit": unit,
            "plan_2025": None,
            "fact_2026": fact,
            "plan_percent": None,
            "deviation": None,
            "deviation_pct": None,
            "formula": str(r.get("D", "")).strip() or None,
            "evidence": str(r.get("E", "")).strip() or None,
        })
    return rows

# ================= MAIN =================

def process_file(path):
    stem = path.stem
    inst_id = FILE_TO_ID.get(stem, stem.lower().replace(" ", "_"))

    xls = pd.ExcelFile(path)
    sheets = {s.strip().lower(): s for s in xls.sheet_names}

    def sheet(*candidates):
        for c in candidates:
            if c.lower() in sheets:
                return xls.parse(sheets[c.lower()], header=None)
        raise KeyError(f"Лист {candidates} не найден в {path.name}")

    df_title = sheet("титул")
    df_f1    = sheet("форма 1")
    df_f1a   = sheet("приложение к отчету ф1")
    df_f2    = sheet("форма 2")

    meta = extract_meta(df_title)
    meta["institution_id"] = inst_id
    meta["source_file"] = path.name
    meta.update(extract_signatures(df_f1))

    rows = (
        parse_form1(letterize(df_f1), inst_id)
        + parse_appendix_f1(letterize(df_f1a), inst_id)
        + parse_form2(letterize(df_f2), inst_id)
    )
    return meta, rows


def main():
    all_meta, all_rows = [], []

    for path in sorted(RAW.glob("*.xlsx")):
        if path.name.startswith("~") or path.name.startswith("."):
            continue
        print(f"-> парсим {path.name}")
        meta, rows = process_file(path)
        all_meta.append(meta)
        all_rows.extend(rows)

    df_inst = pd.DataFrame(all_meta)
    df_ind = pd.DataFrame(all_rows)

    cols = ["institution_id", "form", "code", "parent_code", "level", "name",
            "unit", "plan_2025", "fact_2026", "plan_percent",
            "deviation", "deviation_pct", "formula", "evidence"]
    df_ind = df_ind[cols]

    df_inst.to_parquet(CLEAN / "institutions.parquet", index=False)
    df_inst.to_csv(CLEAN / "institutions.csv", index=False, encoding="utf-8-sig")
    df_ind.to_parquet(CLEAN / "indicators.parquet", index=False)
    df_ind.to_csv(CLEAN / "indicators.csv", index=False, encoding="utf-8-sig")

    schema = {
        "institutions": {c: str(df_inst[c].dtype) for c in df_inst.columns},
        "indicators":   {c: str(df_ind[c].dtype) for c in df_ind.columns},
        "rows": {"institutions": len(df_inst), "indicators": len(df_ind)},
    }
    (CLEAN / "schema.json").write_text(
        json.dumps(schema, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"\nOK institutions: {len(df_inst)}")
    print(df_inst[["institution_id", "institution_name", "center_name"]].to_string())
    print(f"\nOK indicators: {len(df_ind)}")
    print(df_ind.groupby(["institution_id", "form"]).size())


if __name__ == "__main__":
    main()