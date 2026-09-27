import sys
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)

from backend.app.schemas.prediction import DemandPredictionRequest
from backend.app.services.prediction_service import prediction_service

def run_test():
    request_data = {
        "product_id": "P001",
        "price": 8.5,
        "stock": 40,
        "searches": 120,
        "views": 350,
        "orders": 80,
        "category": "Electronics",
        "month": 9,
        "day_of_week": 6,
        "generate_insights": False
    }
    req = DemandPredictionRequest(**request_data)
    try:
        resp = prediction_service.predict_demand(req)
        print("SUCCESS!")
        print("Prediction:", resp.model_dump())
    except Exception as e:
        print("FAILED:", e)

if __name__ == "__main__":
    run_test()
