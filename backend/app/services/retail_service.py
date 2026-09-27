from pathlib import Path
import sys

from app.schemas.retail import RetailProduct, RetailDecisionRequest

# Uvicorn is normally launched from backend/, while the ML package lives at
# the repository root. Resolve it relative to this file, independent of cwd.
PROJECT_ROOT = Path(__file__).resolve().parents[3]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ml.retail.src.models.predict_price import predict_price  # noqa: E402
from ml.retail.src.decision.engine import DecisionInput, make_decision  # noqa: E402


def price_for_product(product: RetailProduct) -> float:
    payload = product.model_dump(mode="json")
    return max(0.0, round(predict_price(payload), 2))


def decision_for_product(request: RetailDecisionRequest):
    price = price_for_product(request)
    decision = make_decision(DecisionInput(
        expected_demand=request.expected_demand,
        current_stock=request.current_stock,
        safety_stock=request.safety_stock,
        predicted_price=price,
        current_price=request.current_price_mad,
        margin_percentage=request.margin_percentage,
        anomaly_detected=request.anomaly_detected,
    ))
    return price, decision
