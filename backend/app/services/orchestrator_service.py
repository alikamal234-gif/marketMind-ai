from app.schemas.prediction import DemandPredictionRequest
from app.services.prediction_service import prediction_service
from app.services.anomaly_service import anomaly_service
from app.services.trend_service import sales_trend_service
from app.services.seasonality_service import seasonality_service
from app.services.price_promotion_service import price_promotion_service
from app.services.recommendation_service import recommendation_service

class OrchestratorService:
    def process_product(self, req: DemandPredictionRequest) -> dict:
        """
        Orchestrates multiple specialized models to form a coherent recommendation.
        """
        product_data = req.model_dump()
        product_data['product_name'] = req.product_id  # fallback
        
        # 1. Demand Forecasting Model
        ml_response = prediction_service.predict_demand(req)
        predicted_demand = ml_response.predicted_demand
        
        # 2. Anomaly Detection Model
        anomaly_ctx = anomaly_service.detect_anomalies(product_data, predicted_demand)
        
        # 3. Sales Trend Model
        trend_ctx = sales_trend_service.analyze_trend(product_data)
        
        # 4. Seasonality Model
        seasonality_ctx = seasonality_service.analyze_seasonality(product_data, predicted_demand)
        
        # 5. Price / Promotion Model
        price_ctx = price_promotion_service.analyze_price_impact(product_data, predicted_demand)
        
        # 6. Integrate context and pass to deterministic Decision Engine
        # We pass the analytical context into the recommendation service to adjust confidence/rules
        rec = recommendation_service.evaluate_product(
            product=product_data, 
            predicted_demand=predicted_demand,
            anomaly_context=anomaly_ctx,
            trend_context=trend_ctx,
            seasonality_context=seasonality_ctx,
            price_context=price_ctx
        )
        
        return rec

orchestrator_service = OrchestratorService()
