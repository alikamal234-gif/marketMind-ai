from pydantic import BaseModel, Field
from typing import Optional, List

class DemandPredictionRequest(BaseModel):
    product_id: str
    month: int = Field(..., ge=1, le=12)
    quarter: int = Field(..., ge=1, le=4)
    day_of_week: int = Field(..., ge=0, le=6)
    is_weekend: int = Field(..., ge=0, le=1)
    season: str
    is_holiday: int = Field(..., ge=0, le=1)
    holiday_type: str
    category: str
    selling_price: float = Field(..., ge=0)
    purchase_price: float = Field(..., ge=0)
    stock: int = Field(..., ge=0)
    promotion: int = Field(..., ge=0, le=1)
    discount: float = Field(..., ge=0.0, le=1.0)
    sales_last_7_days: float = 0.0
    sales_last_30_days: float = 0.0
    rolling_mean_sales: float = 0.0
    rolling_max_sales: float = 0.0
    rolling_min_sales: float = 0.0
    generate_insights: bool = False

class DemandPredictionResponse(BaseModel):
    product_id: str
    predicted_demand: float
    stockout_risk: str
    insights: Optional[str] = None

class RecommendationResponse(BaseModel):
    product_id: str
    product_name: str
    category: str
    recommendation: str
    predicted_demand: float
    current_stock: int
    recommended_purchase: int
    selling_price: float
    purchase_price: float
    expected_revenue: float
    expected_profit: float
    expected_margin: float
    reliability_indicator: str = "Medium"

class RecommendationListResponse(BaseModel):
    month: str
    recommendations: List[RecommendationResponse]
