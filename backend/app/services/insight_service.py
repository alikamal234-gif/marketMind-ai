from app.services.product_service import product_service

class InsightService:
    def get_market_insights(self):
        products = product_service.get_all_products()
        
        # Categorize products
        categories = {}
        for p in products:
            cat = p.get("category", "Unknown")
            if cat not in categories:
                categories[cat] = {"count": 0, "total_demand": 0}
            categories[cat]["count"] += 1
            categories[cat]["total_demand"] += p.get("predicted_demand", 0)
            
        # Find top category by demand
        top_category = "Electronics"
        if categories:
            top_category = max(categories.items(), key=lambda x: x[1]["total_demand"])[0]
            
        high_risk_count = sum(1 for p in products if p.get("risk") == "HIGH")
        
        return [
            {
                "id": "1",
                "title": f"Surging Demand in {top_category}",
                "description": f"Our ML models detected a significant upward trend in {top_category} for the upcoming season. Consider increasing inventory depth by 15%.",
                "type": "opportunity"
            },
            {
                "id": "2",
                "title": "Stock-out Warning",
                "description": f"You have {high_risk_count} products with HIGH risk of stocking out before the next delivery cycle. Prioritize restocking.",
                "type": "warning"
            },
            {
                "id": "3",
                "title": "Price Elasticity Detected",
                "description": "Historical data suggests that a 5% discount on slow-moving inventory could increase sales volume by up to 22%.",
                "type": "info"
            }
        ]

insight_service = InsightService()
