from datetime import date as Date
from typing import Literal

from pydantic import BaseModel, Field


class RetailProduct(BaseModel):
    product_id: str
    product_name: str = ""
    category: str = "Unknown"
    brand: str = "Unknown"
    subcategory: str = "Unknown"
    unit: str = "Unknown"
    quantity: str = "Unknown"
    availability: str = "Unknown"
    promotion: bool = False
    promotion_type: str = "Unknown"
    source_retailer: str = "Other"
    advertised_in_flyer: bool = False
    date: Date | None = None


class PricePredictionResponse(BaseModel):
    product_id: str
    predicted_price_mad: float
    model: str = "XGBoost"
    model_target: str = "observed retail price"


class RetailDecisionRequest(RetailProduct):
    current_price_mad: float = Field(ge=0)
    current_stock: float = Field(ge=0)
    expected_demand: float = Field(ge=0)
    safety_stock: float = Field(default=0, ge=0)
    margin_percentage: float = 0
    anomaly_detected: bool = False
    demand_source: Literal["demand_model", "historical", "demo"]


class RetailDecisionResponse(BaseModel):
    product_id: str
    predicted_price_mad: float
    decision: str
    recommended_quantity: int
    reason: str
    price_difference_percentage: float
    demand_source: str
    price_source: str = "retail_price_model"
