import json
from pathlib import Path

import pandas as pd


def load_retail_data(path: str | Path) -> pd.DataFrame:
    """
    Load the Morocco retail JSON dataset into a pandas DataFrame.
    """

    path = Path(path)

    if not path.exists():
        raise FileNotFoundError(f"Dataset not found: {path}")

    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if "products" not in data:
        raise ValueError("Expected 'products' key in dataset.")

    df = pd.DataFrame(data["products"])

    print(f"Loaded {len(df):,} products.")
    print(f"Columns: {len(df.columns)}")

    return df
