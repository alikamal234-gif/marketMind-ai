class SalesTrendService:
    def analyze_trend(self, product: dict) -> dict:
        """
        Analyze recent sales evolution and momentum.
        """
        sales_7d = float(product.get("sales_last_7_days", 0.0))
        sales_30d = float(product.get("sales_last_30_days", 0.0))
        
        # Calculate weekly run rate based on 30d vs actual 7d
        expected_weekly = sales_30d / 4.0 if sales_30d > 0 else 0
        
        trend_label = "STABLE"
        trend_percentage = 0.0
        
        if expected_weekly > 0:
            variance = (sales_7d - expected_weekly) / expected_weekly
            trend_percentage = round(variance * 100, 1)
            
            if variance > 0.2:
                trend_label = "INCREASING"
            elif variance < -0.2:
                trend_label = "DECREASING"
        elif sales_7d > 0 and expected_weekly == 0:
            trend_label = "NEW_SPIKE"
            trend_percentage = 100.0

        return {
            "trend_label": trend_label,
            "trend_percentage": trend_percentage
        }

sales_trend_service = SalesTrendService()
