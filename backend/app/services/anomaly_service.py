class AnomalyDetectionService:
    def detect_anomalies(self, product: dict, predicted_demand: float) -> dict:
        """
        Detect unusual spikes or drops in demand, price, or inventory behavior.
        """
        anomalies = []
        is_anomalous = False
        
        current_stock = int(product.get("stock", 0))
        sales_30d = float(product.get("sales_last_30_days", 0.0))
        
        # 1. Extreme Demand Spike
        if sales_30d > 0 and predicted_demand > sales_30d * 3:
            anomalies.append("Extreme demand spike predicted compared to last 30 days")
            is_anomalous = True
            
        # 2. Sudden Demand Drop
        if sales_30d > 10 and predicted_demand < sales_30d * 0.1:
            anomalies.append("Severe demand drop predicted compared to last 30 days")
            is_anomalous = True
            
        # 3. Hoarding / Dead Stock Risk
        if current_stock > 0 and predicted_demand == 0 and sales_30d == 0:
            anomalies.append("Dead stock detected: zero recent and zero predicted demand")
            is_anomalous = True

        return {
            "is_anomalous": is_anomalous,
            "detected_anomalies": anomalies,
            "severity": "HIGH" if is_anomalous else "NONE"
        }

anomaly_service = AnomalyDetectionService()
