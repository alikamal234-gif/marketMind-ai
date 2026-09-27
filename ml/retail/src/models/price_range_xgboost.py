from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)


def train_price_range_xgboost(
    X_train,
    y_train,
    X_test,
    y_test,
    preprocessor,
):
    """
    Train a CPU-based classifier to predict price ranges.
    """

    # Transform features
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)

    # Convert sparse matrices to dense arrays
    X_train_processed = X_train_processed.toarray()
    X_test_processed = X_test_processed.toarray()

    # CPU-based classifier
    model = HistGradientBoostingClassifier(
        max_iter=300,
        learning_rate=0.05,
        max_leaf_nodes=31,
        random_state=42,
    )

    # Train
    model.fit(
        X_train_processed,
        y_train,
    )

    # Predict
    predictions = model.predict(X_test_processed)

    # Metrics
    accuracy = accuracy_score(
        y_test,
        predictions,
    )

    report = classification_report(
        y_test,
        predictions,
        output_dict=True,
    )

    matrix = confusion_matrix(
        y_test,
        predictions,
    )

    results = {
        "accuracy": accuracy,
        "classification_report": report,
        "confusion_matrix": matrix,
    }

    return model, preprocessor, results, predictions