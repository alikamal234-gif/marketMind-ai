class RecommendationService:
    def classify_product(self, expected_demand: float, current_stock: int, recommended_purchase: int) -> str:
        """
        BUY: Expected demand significantly exceeds current stock.
        HOLD: Current stock is approximately sufficient.
        REDUCE: Demand is weak compared with current stock.
        DON'T BUY: Demand is very low and existing stock is already sufficient/high.
        """
        # Thresholds can be made configurable later
        stock_to_demand_ratio = current_stock / max(expected_demand, 1.0)
        
        if recommended_purchase > 0:
            if current_stock == 0 or stock_to_demand_ratio < 0.5:
                return "BUY"
            else:
                return "BUY" # Since we need to restock to hit safety level, but we could categorize as weak buy
                
        else:
            # We have enough stock. Should we hold or reduce?
            if expected_demand <= 5 and current_stock > 10:
                return "DON'T BUY"
            elif stock_to_demand_ratio > 3.0:
                # We have 3x more stock than we need for this period
                return "REDUCE"
            elif stock_to_demand_ratio > 1.5:
                return "DON'T BUY"
            else:
                return "HOLD"
                
    def evaluate_product(self, product: dict, predicted_demand: float, anomaly_context: dict = None, trend_context: dict = None, seasonality_context: dict = None, price_context: dict = None) -> dict:
        from app.services.profit_service import profit_service
        from app.services.inventory_decision_service import inventory_decision_service
        
        current_stock = int(product.get("stock", 0))
        selling_price = float(product.get("selling_price", 0.0) or product.get("price", 0.0))
        purchase_price = float(product.get("purchase_price", selling_price * 0.5)) # fallback assumption
        
        # 1. Inventory Decision
        inv_decision = inventory_decision_service.calculate_inventory_decision(predicted_demand, current_stock)
        recommended_purchase = inv_decision["recommended_purchase"]
        
        # 2. Profit Calculation
        profit_calc = profit_service.calculate_profit(predicted_demand, selling_price, purchase_price)
        
        # 3. Final Recommendation Classification
        recommendation_label = self.classify_product(predicted_demand, current_stock, recommended_purchase)
        
        # 4. Reliability Indicator Calculation
        confidence_score = 100
        
        # Penalize for missing historical data
        if product.get("sales_last_30_days", 0) == 0:
            confidence_score -= 20
            
        # Penalize for missing financial data
        if selling_price == 0:
            confidence_score -= 30
            
        # Adjust confidence based on orchestrator's anomaly context
        if anomaly_context and anomaly_context.get("is_anomalous"):
            confidence_score -= 25  # High uncertainty due to anomalies
            
        # Penalize for extreme prediction variance compared to historical data or stock
        if predicted_demand > 3 * max(current_stock, 1):
            confidence_score -= 15
            
        if confidence_score >= 80:
            reliability = "High"
        elif confidence_score >= 50:
            reliability = "Medium"
        else:
            reliability = "Low"
            
        return {
            "product_id": product.get("product_id") or product.get("id"),
            "product_name": product.get("product_name") or product.get("name"),
            "category": product.get("category"),
            "recommendation": recommendation_label,
            "predicted_demand": round(predicted_demand, 1),
            "current_stock": current_stock,
            "recommended_purchase": recommended_purchase,
            "selling_price": selling_price,
            "purchase_price": purchase_price,
            "expected_revenue": profit_calc["expected_revenue"],
            "expected_profit": profit_calc["expected_gross_profit"],
            "expected_margin": profit_calc["expected_margin"],
            "reliability_indicator": reliability
        }

recommendation_service = RecommendationService()
