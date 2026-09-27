import pandas as pd


def prepare_retail_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and prepare the retail dataset for ML.
    """

    df = df.copy()

    # Columns with no observations in the current dataset
    useless_columns = [
        "sold_count",
        "stock",
        "search",
        "views",
        "orders",
        "rating",
        "review_count",
    ]

    df = df.drop(columns=useless_columns, errors="ignore")

    # Convert dates
    date_columns = [
        "date",
        "scraped_at",
        "offer_start_date",
    ]

    for column in date_columns:
        if column in df.columns:
            df[column] = pd.to_datetime(
                df[column],
                errors="coerce"
            )

    # Convert numerical columns
    numerical_columns = [
        "price",
        "original_price",
        "discount_price",
        "discount_percentage",
        "flyer_page",
    ]

    for column in numerical_columns:
        if column in df.columns:
            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

    # Normalize boolean columns
    if "promotion" in df.columns:
        df["promotion"] = df["promotion"].astype(bool)

    if "advertised_in_flyer" in df.columns:
        df["advertised_in_flyer"] = (
            df["advertised_in_flyer"]
            .fillna(False)
            .astype(bool)
        )

    return df
