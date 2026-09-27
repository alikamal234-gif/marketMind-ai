from fastapi import APIRouter, HTTPException
from app.schemas.prediction import DemandPredictionRequest, DemandPredictionResponse
from app.services.prediction_service import prediction_service
from app.services.ai_service import generate_business_insight

router = APIRouter()

@router.post("/demand", response_model=DemandPredictionResponse)
async def predict_demand(request: DemandPredictionRequest):
    try:
        # Get ML prediction
        result = prediction_service.predict_demand(request)
        
        # Optionally generate AI insight
        if request.generate_insights:
            insight = await generate_business_insight(
                prediction_data=request.model_dump(),
                ml_prediction=result.predicted_demand,
                risk_level=result.stockout_risk
            )
            result.insights = insight
            
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail="Model is not loaded or trained yet.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
