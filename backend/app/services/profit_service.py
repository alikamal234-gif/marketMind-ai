class ProfitService:
    def calculate_profit(self, predicted_units_sold: float, selling_price: float, purchase_price: float) -> dict:
        expected_revenue = predicted_units_sold * selling_price
        expected_cost = predicted_units_sold * purchase_price
        expected_gross_profit = expected_revenue - expected_cost
        
        expected_margin = 0.0
        if expected_revenue > 0:
            expected_margin = expected_gross_profit / expected_revenue
            
        return {
            "expected_revenue": round(expected_revenue, 2),
            "expected_cost": round(expected_cost, 2),
            "expected_gross_profit": round(expected_gross_profit, 2),
            "expected_margin": round(expected_margin, 3)
        }

profit_service = ProfitService()
