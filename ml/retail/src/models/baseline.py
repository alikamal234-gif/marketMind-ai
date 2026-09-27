import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def evaluate_baseline(y_train, y_test):
    """
    Evaluate a median-price baseline.
    """

    median_price = y_train.median()

    predictions = np.full(
        shape=len(y_test),
        fill_value=median_price,
    )

    mae = mean_absolute_error(y_test, predictions)

    rmse = np.sqrt(
        mean_squared_error(y_test, predictions)
    )

    r2 = r2_score(y_test, predictions)

    return {
        "model": "Median Baseline",
        "mae": mae,
        "rmse": rmse,
        "r2": r2,
    }
