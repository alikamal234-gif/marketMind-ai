from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.schemas.prediction import DemandPredictionRequest, RecommendationResponse, RecommendationListResponse
from app.services.orchestrator_service import orchestrator_service

router = APIRouter()

@router.post("/generate", response_model=RecommendationListResponse)
async def generate_recommendations(requests: List[DemandPredictionRequest]):
    """
    Given a list of products and their current state (simulating a month upload),
    generate business recommendations for all of them.
    """
    try:
        recommendations = []
        for req in requests:
            # The orchestrator handles ML prediction, anomaly detection, trend analysis, and decision making
            rec = orchestrator_service.process_product(req)
            recommendations.append(RecommendationResponse(**rec))
            
        return RecommendationListResponse(
            month="Selected Month",
            recommendations=recommendations
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
