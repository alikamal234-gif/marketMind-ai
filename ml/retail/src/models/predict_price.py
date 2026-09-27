from functools import lru_cache
from pathlib import Path

import joblib
import pandas as pd
from xgboost import XGBRegressor

from ml.retail.src.data.features import create_features
from ml.retail.src.data.model_features import PRICE_FEATURES


MODEL_DIR = Path(__file__).resolve().parents[2] / "models"

MODEL_PATH = MODEL_DIR / "price_xgboost.json"
PREPROCESSOR_PATH = MODEL_DIR / "price_preprocessor.joblib"


@lru_cache(maxsize=1)
def load_price_model():
    """
    Load the trained XGBoost price model
    and its preprocessing pipeline.
    """

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found: {MODEL_PATH}"
        )

    if not PREPROCESSOR_PATH.exists():
        raise FileNotFoundError(
            f"Preprocessor not found: {PREPROCESSOR_PATH}"
        )

    model = XGBRegressor()
    model.load_model(str(MODEL_PATH))

    preprocessor = joblib.load(PREPROCESSOR_PATH)

    return model, preprocessor


def predict_price(product: dict) -> float:
    """
    Predict the price of one product.

    Parameters
    ----------
    product : dict
        Raw product information.

    Returns
    -------
    float
        Predicted price in MAD.
    """

    model, preprocessor = load_price_model()

    df = pd.DataFrame([product])

    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
    if "source_retailer" not in df.columns and "store_name" in df.columns:
        df["source_retailer"] = df["store_name"]

    # Create the same features used during training
    df = create_features(df)

    # Keep only features used by the model
    X = df.reindex(columns=PRICE_FEATURES).copy()

    # Apply the same preprocessing
    X_encoded = preprocessor.transform(X)

    # Predict
    prediction = model.predict(X_encoded)[0]

    return float(prediction)


if __name__ == "__main__":

    example_product = {
        "category": "MULTIMÉDIA",
        "brand": "SAMSUNG",
        "subcategory": "TV",
        "unit": "PIÈCE",
        "quantity": "1",
        "availability": "Available",
        "promotion": False,
        "promotion_type": "None",
        "source_retailer": "Aswak Assalam",
        "advertised_in_flyer": False,
        "year": 2026,
        "month": 9,
        "day_of_week": 6,
        "product_name_length": 35,
        "product_name_word_count": 7,
        "product_name_first_number": 55,
        "product_name_number_count": 1,
        "has_4k": 1,
        "has_uhd": 1,
        "has_smart_tv": 1,
        "has_no_frost": 0,
        "has_quantity": 1,
        "has_unit": 1,
    }

    predicted_price = predict_price(example_product)

    print("=" * 60)
    print("MARKETMIND AI - PRICE PREDICTION")
    print("=" * 60)
    print(f"Predicted price: {predicted_price:,.2f} MAD")
