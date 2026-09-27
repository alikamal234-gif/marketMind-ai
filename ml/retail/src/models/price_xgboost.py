import numpy as np

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

from xgboost import XGBRegressor


# =============================================================
# CATEGORICAL FEATURES
# =============================================================

CATEGORICAL_FEATURES = [
    "category",
    "brand",
    "subcategory",
    "unit",
    "quantity",
    "availability",
    "promotion_type",
    "source_retailer",
]


# =============================================================
# NUMERICAL FEATURES
# =============================================================

NUMERICAL_FEATURES = [
    # Promotion
    "promotion",
    "advertised_in_flyer",

    # Date
    "year",
    "month",
    "day_of_week",

    # Product name
    "product_name_length",
    "product_name_word_count",
    "product_name_first_number",
    "product_name_number_count",

    # Product specifications
    "has_4k",
    "has_uhd",
    "has_smart_tv",
    "has_no_frost",

    # Quantity / unit
    "has_quantity",
    "has_unit",
]


# =============================================================
# TRAIN XGBOOST
# =============================================================

def train_xgboost(
    X_train,
    y_train,
    X_test,
    y_test,
):
    """
    Train and evaluate an XGBoost regression model
    for retail price prediction.
    """

    # ---------------------------------------------------------
    # 1. Select categorical features that exist
    # ---------------------------------------------------------

    categorical_features = [
        column
        for column in CATEGORICAL_FEATURES
        if column in X_train.columns
    ]

    # ---------------------------------------------------------
    # 2. Select numerical features that exist
    # ---------------------------------------------------------

    numerical_features = [
        column
        for column in NUMERICAL_FEATURES
        if column in X_train.columns
    ]

    print("\n=== FEATURES USED ===")

    print("\nCategorical:")
    for feature in categorical_features:
        print(f"  - {feature}")

    print("\nNumerical:")
    for feature in numerical_features:
        print(f"  - {feature}")

    # ---------------------------------------------------------
    # 3. Create preprocessing pipeline
    # ---------------------------------------------------------

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "categorical",
                OneHotEncoder(
                    handle_unknown="ignore",
                    sparse_output=True,
                ),
                categorical_features,
            ),
            (
                "numerical",
                "passthrough",
                numerical_features,
            ),
        ]
    )

    # ---------------------------------------------------------
    # 4. Encode features
    # ---------------------------------------------------------

    X_train_encoded = preprocessor.fit_transform(
        X_train
    )

    X_test_encoded = preprocessor.transform(
        X_test
    )

    print("\n=== ENCODED DATA ===")

    print(
        f"X_train encoded shape: "
        f"{X_train_encoded.shape}"
    )

    print(
        f"X_test encoded shape: "
        f"{X_test_encoded.shape}"
    )

    # ---------------------------------------------------------
    # 5. Create XGBoost model
    # ---------------------------------------------------------

    model = XGBRegressor(
        n_estimators=500,
        max_depth=7,
        learning_rate=0.05,
        objective="reg:squarederror",
        eval_metric="rmse",
        random_state=42,
        n_jobs=-1,
    )

    # ---------------------------------------------------------
    # 6. Train model
    # ---------------------------------------------------------

    print("\n=== TRAINING XGBOOST ===")

    model.fit(
        X_train_encoded,
        y_train,
    )

    # ---------------------------------------------------------
    # 7. Predictions
    # ---------------------------------------------------------

    predictions = model.predict(
        X_test_encoded
    )

    # ---------------------------------------------------------
    # 8. Evaluation
    # ---------------------------------------------------------

    mae = mean_absolute_error(
        y_test,
        predictions,
    )

    rmse = np.sqrt(
        mean_squared_error(
            y_test,
            predictions,
        )
    )

    r2 = r2_score(
        y_test,
        predictions,
    )

    # ---------------------------------------------------------
    # 9. Results
    # ---------------------------------------------------------

    results = {
        "model": "XGBoost",
        "mae": mae,
        "rmse": rmse,
        "r2": r2,
    }

    return (
        model,
        preprocessor,
        results,
        predictions,
    )