from ml.retail.src.orchestrator.orchestrator import (
    build_context,
    context_to_dict,
)


def main():

    context = build_context(
        product_id="MM-001",
        product_name="Samsung Smart TV 55 4K UHD",

        price_prediction={
            "predicted_price": 8344.72,
            "model": "XGBoost",
            "confidence": None,
        },

        demand_signal={
            "expected_demand": 100,
            "model": "demo",
        },

        inventory_signal={
            "current_stock": 30,
            "safety_stock": 20,
            "model": "demo",
        },

        profitability_signal={
            "margin_percentage": 18.0,
            "model": "demo",
        },

        anomaly_signal={
            "detected": False,
            "model": "demo",
        },
    )

    print("=" * 60)
    print("MARKETMIND AI - ORCHESTRATOR")
    print("=" * 60)

    print(context_to_dict(context))


if __name__ == "__main__":
    main()
