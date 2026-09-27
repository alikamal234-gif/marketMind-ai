import pandas as pd

from ml.retail.src.data.model_features import PRICE_FEATURES, PRICE_TARGET


def build_price_dataset(df: pd.DataFrame):
    """
    Build X and y for the price prediction model.

    Only features defined in PRICE_FEATURES and actually
    available in the DataFrame are included.
    """

    # ---------------------------------------------------------
    # Select available ML features
    # ---------------------------------------------------------

    available_features = [
        column
        for column in PRICE_FEATURES
        if column in df.columns
    ]

    # ---------------------------------------------------------
    # Build X
    # ---------------------------------------------------------

    X = df[available_features].copy()

    # ---------------------------------------------------------
    # Build target y
    # ---------------------------------------------------------

    y = df[PRICE_TARGET].copy()

    return X, y