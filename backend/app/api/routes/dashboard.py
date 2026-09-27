from fastapi import APIRouter
from app.services.dashboard_service import dashboard_service

router = APIRouter()

@router.get("/metrics")
def get_dashboard_metrics():
    return dashboard_service.get_kpis()

@router.get("/trend")
def get_demand_trend():
    return dashboard_service.get_demand_trend()
