import pandas as pd


def analyze_dataset(df: pd.DataFrame) -> None:
    """Print useful dataset statistics for model preparation."""

    print("\n" + "=" * 60)
    print("DATASET OVERVIEW")
    print("=" * 60)

    print(f"Rows: {len(df):,}")
    print(f"Columns: {len(df.columns)}")

    print("\n--- Price statistics ---")
    print(df["price"].describe())

    print("\n--- Promotion distribution ---")
    print(df["promotion"].value_counts())
    print("\nPercentage:")
    print(df["promotion"].value_counts(normalize=True) * 100)

    print("\n--- Categories ---")
    print(df["category"].value_counts().head(20))

    print("\n--- Brands ---")
    print(df["brand"].value_counts().head(20))

    print("\n--- Subcategories ---")
    print(df["subcategory"].value_counts().head(20))

    print("\n--- Sources ---")
    print(df["source"].value_counts())

    print("\n--- Cities ---")
    print(df["city"].value_counts().head(20))

    print("\n--- Promotion types ---")
    print(df["promotion_type"].value_counts())

    print("\n--- Discount statistics ---")
    print(df["discount_percentage"].describe())

    print("\n--- Missing values ---")
    missing = df.isna().sum()
    print(missing[missing > 0].sort_values(ascending=False))
