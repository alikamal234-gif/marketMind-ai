class InventoryDecisionService:
    def __init__(self, safety_stock_percentage: float = 0.10):
        self.safety_stock_percentage = safety_stock_percentage

    def calculate_inventory_decision(self, expected_demand: float, current_stock: int) -> dict:
        safety_stock = expected_demand * self.safety_stock_percentage
        recommended_stock_level = expected_demand + safety_stock
        
        recommended_purchase = recommended_stock_level - current_stock
        
        # We cannot buy negative quantities
        if recommended_purchase < 0:
            recommended_purchase = 0
            
        return {
            "safety_stock": round(safety_stock, 1),
            "recommended_stock_level": round(recommended_stock_level, 1),
            "recommended_purchase": max(0, int(round(recommended_purchase)))
        }

inventory_decision_service = InventoryDecisionService()
