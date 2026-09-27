from catboost import CatBoostRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np


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


def train_catboost(
    X_train,
    y_train,
    X_test,
    y_test,
):
    """
    Train and evaluate a CatBoost price prediction model.
    """

    cat_features = [
        X_train.columns.get_loc(column)
        for column in CATEGORICAL_FEATURES
        if column in X_train.columns
    ]

    model = CatBoostRegressor(
        iterations=500,
        depth=7,
        learning_rate=0.05,
        loss_function="RMSE",
        random_seed=42,
        verbose=100,
    )

    model.fit(
        X_train,
        y_train,
        cat_features=cat_features,
    )

    predictions = model.predict(X_test)

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

    results = {
        "model": "CatBoost",
        "mae": mae,
        "rmse": rmse,
        "r2": r2,
    }

    return model, results
