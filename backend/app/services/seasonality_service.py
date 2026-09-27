class SeasonalityService:
    def analyze_seasonality(self, product: dict, predicted_demand: float) -> dict:
        """
        Detect recurring seasonal, monthly, holiday, or period effects.
        For now, this is a rule-based simulation of a seasonality model.
        """
        season = product.get("season", "Unknown")
        is_holiday = int(product.get("is_holiday", 0))
        
        # Categorize seasonality impact
        seasonality_label = "LOW"
        multiplier = 1.0
        
        if is_holiday == 1:
            seasonality_label = "HIGH"
            multiplier = 1.5
        elif season in ["Winter", "Summer"]: # Assuming these are peak seasons
            seasonality_label = "MEDIUM"
            multiplier = 1.2
            
        return {
            "seasonality_label": seasonality_label,
            "seasonality_multiplier": multiplier,
            "season": season,
            "is_holiday": is_holiday == 1
        }

seasonality_service = SeasonalityService()
