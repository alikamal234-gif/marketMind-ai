from fastapi import APIRouter
from app.services.insight_service import insight_service

router = APIRouter()

@router.get("/")
def get_insights():
    return insight_service.get_market_insights()
