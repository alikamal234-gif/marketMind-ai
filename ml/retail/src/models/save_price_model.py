import json
from pathlib import Path

import joblib

from ml.retail.src.data.loader import load_retail_data
from ml.retail.src.data.preprocessing import prepare_retail_data
from ml.retail.src.data.features import create_features
from ml.retail.src.data.dataset import build_price_dataset
from ml.retail.src.models.train_test import split_data
from ml.retail.src.models.price_xgboost import train_xgboost


# =============================================================
# Configuration
# =============================================================

RETAIL_ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = RETAIL_ROOT / "data/raw/morocco_retail_products.json"

MODEL_DIR = RETAIL_ROOT / "models"

MODEL_PATH = MODEL_DIR / "price_xgboost.json"
PREPROCESSOR_PATH = MODEL_DIR / "price_preprocessor.joblib"
METADATA_PATH = MODEL_DIR / "price_model_metadata.json"


# =============================================================
# Main
# =============================================================

def main():

    print("=" * 60)
    print("MARKETMIND AI - SAVE PRICE MODEL")
    print("=" * 60)

    # ---------------------------------------------------------
    # 1. Create models directory
    # ---------------------------------------------------------

    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    # ---------------------------------------------------------
    # 2. Load dataset
    # ---------------------------------------------------------

    print("\n[1/7] Loading dataset...")

    df = load_retail_data(DATA_PATH)

    # ---------------------------------------------------------
    # 3. Preprocess
    # ---------------------------------------------------------

    print("\n[2/7] Preparing dataset...")

    df = prepare_retail_data(df)

    # ---------------------------------------------------------
    # 4. Feature engineering
    # ---------------------------------------------------------

    print("\n[3/7] Creating features...")

    df = create_features(df)

    # ---------------------------------------------------------
    # 5. Build ML dataset
    # ---------------------------------------------------------

    print("\n[4/7] Building ML dataset...")

    X, y = build_price_dataset(df)

    print(f"Features: {X.shape[1]}")
    print(f"Samples : {X.shape[0]}")

    # ---------------------------------------------------------
    # 6. Train/test split
    # ---------------------------------------------------------

    print("\n[5/7] Splitting dataset...")

    X_train, X_test, y_train, y_test = split_data(
        X,
        y,
    )

    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples : {len(X_test)}")

    # ---------------------------------------------------------
    # 7. Train XGBoost
    # ---------------------------------------------------------

    print("\n[6/7] Training XGBoost...")

    model, preprocessor, results, predictions = train_xgboost(
        X_train,
        y_train,
        X_test,
        y_test,
    )

    print("\nModel results:")
    print(f"MAE  : {results['mae']:.2f} MAD")
    print(f"RMSE : {results['rmse']:.2f} MAD")
    print(f"R²   : {results['r2']:.4f}")

    # ---------------------------------------------------------
    # Save XGBoost model
    # ---------------------------------------------------------

    print("\n[7/7] Saving model...")

    model.save_model(
        str(MODEL_PATH)
    )

    # ---------------------------------------------------------
    # Save preprocessor
    # ---------------------------------------------------------

    joblib.dump(
        preprocessor,
        PREPROCESSOR_PATH,
    )

    # ---------------------------------------------------------
    # Save metadata
    # ---------------------------------------------------------

    metadata = {
        "model": "XGBoost",
        "target": "price",
        "dataset": str(DATA_PATH),
        "n_samples": int(len(df)),
        "n_features": int(X.shape[1]),
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "random_state": 42,
        "metrics": {
            "mae": float(results["mae"]),
            "rmse": float(results["rmse"]),
            "r2": float(results["r2"]),
        },
        "model_parameters": {
            "n_estimators": 500,
            "max_depth": 7,
            "learning_rate": 0.05,
        },
        "feature_columns": list(X.columns),
    }

    with METADATA_PATH.open(
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            metadata,
            file,
            indent=4,
            ensure_ascii=False,
        )

    # ---------------------------------------------------------
    # Final output
    # ---------------------------------------------------------

    print("\n" + "=" * 60)
    print("MODEL SAVED SUCCESSFULLY")
    print("=" * 60)

    print(f"\nModel:")
    print(f"  {MODEL_PATH}")

    print(f"\nPreprocessor:")
    print(f"  {PREPROCESSOR_PATH}")

    print(f"\nMetadata:")
    print(f"  {METADATA_PATH}")


if __name__ == "__main__":
    main()
