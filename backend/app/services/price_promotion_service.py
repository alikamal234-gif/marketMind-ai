class PricePromotionService:
    def analyze_price_impact(self, product: dict, predicted_demand: float) -> dict:
        """
        Analyze the relationship between price, discount, promotion, and expected demand.
        For now, this provides a heuristic-based contextual analysis of the current pricing.
        """
        selling_price = float(product.get("selling_price", 0.0) or product.get("price", 0.0))
        discount = float(product.get("discount", 0.0))
        promotion = int(product.get("promotion", 0))
        
        elasticity_label = "NEUTRAL"
        
        # High discount without a major spike in demand suggests inelasticity or poor product performance
        if discount > 0.3 and predicted_demand < 5:
            elasticity_label = "INELASTIC_LOW_DEMAND"
            
        # Small discount leading to good demand suggests high elasticity
        elif discount > 0 and discount <= 0.15 and predicted_demand > 20:
            elasticity_label = "HIGHLY_ELASTIC"
            
        return {
            "discount_applied": discount,
            "promotion_active": promotion == 1,
            "elasticity_estimate": elasticity_label,
            "pricing_risk": "HIGH" if elasticity_label == "INELASTIC_LOW_DEMAND" else "LOW"
        }

price_promotion_service = PricePromotionService()
