import os
import joblib
import pandas as pd
from app.schemas.prediction import DemandPredictionRequest, DemandPredictionResponse

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "models", "demand_model.joblib")

class PredictionService:
    def __init__(self):
        self.model = None

    def load_model(self):
        if self.model is None:
            if os.path.exists(MODEL_PATH):
                self.model = joblib.load(MODEL_PATH)
            else:
                raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

    def predict_demand(self, request: DemandPredictionRequest) -> DemandPredictionResponse:
        self.load_model()
        
        data = request.model_dump()
        product_id = data.pop('product_id')
        data.pop('generate_insights', None)
        
        df = pd.DataFrame([data])
        
        # Ensure categorical types are correct for the pipeline
        categorical_features = ['season', 'holiday_type', 'category']
        for col in categorical_features:
            if col in df.columns:
                df[col] = df[col].astype(str)
                
        predicted_demand = float(self.model.predict(df)[0])
        predicted_demand = max(0, predicted_demand) # Prevent negatives
        
        # Keep old stockout risk logic just to not break existing frontend for now
        # but the decision engine is the new core
        if predicted_demand <= 0:
            risk = "low"
        else:
            days_coverage = data['stock'] / predicted_demand
            if days_coverage < 0.5:
                risk = "high"
            elif days_coverage < 1.5:
                risk = "medium"
            else:
                risk = "low"
                
        return DemandPredictionResponse(
            product_id=product_id,
            predicted_demand=round(predicted_demand, 2),
            stockout_risk=risk
        )

prediction_service = PredictionService()
