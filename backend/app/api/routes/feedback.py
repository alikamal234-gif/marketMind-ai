from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter()

class SalesFeedbackItem(BaseModel):
    product_id: str
    month: int
    actual_sales: float
    predicted_demand: float

class SalesFeedbackRequest(BaseModel):
    feedback: List[SalesFeedbackItem]

@router.post("/sales")
def ingest_sales_feedback(req: SalesFeedbackRequest):
    """
    Ingest actual sales data for previous months to evaluate model performance
    and trigger continuous learning (retraining).
    """
    if not req.feedback:
        return {"status": "success", "message": "No feedback provided."}
        
    # Calculate Prediction Error (MAE - Mean Absolute Error)
    total_error = 0.0
    for item in req.feedback:
        error = abs(item.actual_sales - item.predicted_demand)
        total_error += error
        
    mae = total_error / len(req.feedback)
    
    # Store feedback in database (mocked for now)
    # db["feedback_history"].insert_many([item.model_dump() for item in req.feedback])
    
    # Simple Retraining Strategy Stub
    # If the MAE exceeds a certain threshold, we might flag the model for retraining.
    retrain_flagged = False
    if mae > 20.0:  # Threshold can be configurable
        retrain_flagged = True
        
    return {
        "status": "success",
        "message": f"Processed {len(req.feedback)} sales records.",
        "metrics": {
            "mean_absolute_error": round(mae, 2),
            "retrain_flagged": retrain_flagged,
            "next_training_run": "Scheduled for end of month" if not retrain_flagged else "Immediate retrain requested"
        }
    }
