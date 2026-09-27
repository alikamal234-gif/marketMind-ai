from dataclasses import dataclass


@dataclass
class DecisionInput:
    expected_demand: float
    current_stock: float
    safety_stock: float

    predicted_price: float
    current_price: float

    margin_percentage: float = 0.0
    anomaly_detected: bool = False


@dataclass
class DecisionResult:
    decision: str
    recommended_quantity: int
    expected_demand: float
    current_stock: float
    safety_stock: float
    predicted_price: float
    current_price: float
    price_difference_percentage: float
    margin_percentage: float
    anomaly_detected: bool
    reason: str


def calculate_recommended_quantity(
    expected_demand: float,
    current_stock: float,
    safety_stock: float,
) -> int:

    quantity = (
        expected_demand
        - current_stock
        + safety_stock
    )

    return max(0, round(quantity))


def calculate_price_difference(
    predicted_price: float,
    current_price: float,
) -> float:

    if current_price <= 0:
        return 0.0

    return (
        (predicted_price - current_price)
        / current_price
    ) * 100


def make_decision(inputs: DecisionInput) -> DecisionResult:

    recommended_quantity = calculate_recommended_quantity(
        expected_demand=inputs.expected_demand,
        current_stock=inputs.current_stock,
        safety_stock=inputs.safety_stock,
    )

    price_difference_percentage = calculate_price_difference(
        predicted_price=inputs.predicted_price,
        current_price=inputs.current_price,
    )

    # ---------------------------------------
    # Decision rules
    # ---------------------------------------

    if inputs.anomaly_detected:
        decision = "HOLD"
        reason = (
            "A price anomaly was detected. "
            "The system recommends reviewing the situation "
            "before making a purchase decision."
        )

    elif recommended_quantity <= 0:
        decision = "DON'T BUY"
        reason = (
            "Current stock already covers expected demand "
            "and safety stock requirements."
        )

    elif inputs.margin_percentage < 5:
        decision = "REDUCE"
        reason = (
            "The estimated margin is below the minimum "
            "threshold."
        )

    elif (
        price_difference_percentage > 10
        and recommended_quantity > 0
    ):
        decision = "BUY"
        reason = (
            "Expected demand exceeds available stock "
            "requirements and the predicted market price "
            "is significantly above the current price."
        )

    else:
        decision = "HOLD"
        reason = (
            "The available signals do not provide a strong "
            "enough condition for a purchase."
        )

    return DecisionResult(
        decision=decision,
        recommended_quantity=recommended_quantity,
        expected_demand=inputs.expected_demand,
        current_stock=inputs.current_stock,
        safety_stock=inputs.safety_stock,
        predicted_price=inputs.predicted_price,
        current_price=inputs.current_price,
        price_difference_percentage=price_difference_percentage,
        margin_percentage=inputs.margin_percentage,
        anomaly_detected=inputs.anomaly_detected,
        reason=reason,
    )
