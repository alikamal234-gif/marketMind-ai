from app.services.product_service import product_service
from app.services.prediction_service import prediction_service
from app.schemas.prediction import DemandPredictionRequest
import datetime
import random

class DashboardService:
    def get_kpis(self):
        products = product_service.get_all_products()
        
        total_products = len(products)
        
        # Calculate dynamic total sales (mock historical logic based on price * random volume)
        # In a real system, this would come from a sales/orders table.
        total_sales_value = sum((p.get("price", 0) * random.randint(10, 50)) for p in products)
        
        # Calculate predicted demand (mocked aggregation for speed)
        # To avoid running ML inference on hundreds of products on every load, we use a simple heuristic
        # based on current month for the dashboard, or we could run the model for top 10 products.
        predicted_demand_sum = sum(p.get("predicted_demand", 0) for p in products)
        
        # Products at risk (stock < 10 or risk == HIGH)
        products_at_risk = sum(1 for p in products if p.get("risk") == "HIGH" or p.get("stock", 0) < 10)
        
        return {
            "total_products": f"{total_products:,}",
            "total_sales": f"{total_sales_value:,.0f} DH",
            "predicted_demand": f"{predicted_demand_sum:,}",
            "products_at_risk": str(products_at_risk)
        }
        
    def get_demand_trend(self):
        # Generate a dynamic trend curve based on current date
        import datetime
        import random
        
        today = datetime.datetime.now()
        trend_data = []
        
        # Generate last 7 days of trend
        base_demand = random.randint(300, 600)
        for i in range(6, -1, -1):
            date = today - datetime.timedelta(days=i)
            # Add some noise and weekend effects
            is_weekend = date.weekday() >= 5
            actual = base_demand + (150 if is_weekend else 0) + random.randint(-50, 50)
            predicted = actual + random.randint(-30, 30) # AI is usually close
            
            trend_data.append({
                "date": date.strftime("%b %d"),
                "actual": actual,
                "predicted": predicted
            })
            
        return trend_data

dashboard_service = DashboardService()
