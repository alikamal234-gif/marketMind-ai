from fastapi import APIRouter, HTTPException

from app.schemas.retail import (
    RetailProduct, RetailDecisionRequest, PricePredictionResponse,
    RetailDecisionResponse,
)
from app.services.retail_service import price_for_product, decision_for_product

router = APIRouter()


@router.post("/price", response_model=PricePredictionResponse)
def predict_retail_price(product: RetailProduct):
    try:
        price = price_for_product(product)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return PricePredictionResponse(
        product_id=product.product_id, predicted_price_mad=price,
    )


@router.post("/decision", response_model=RetailDecisionResponse)
def retail_decision(request: RetailDecisionRequest):
    try:
        price, decision = decision_for_product(request)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return RetailDecisionResponse(
        product_id=request.product_id,
        predicted_price_mad=price,
        decision=decision.decision,
        recommended_quantity=decision.recommended_quantity,
        reason=decision.reason,
        price_difference_percentage=round(decision.price_difference_percentage, 2),
        demand_source=request.demand_source,
    )
