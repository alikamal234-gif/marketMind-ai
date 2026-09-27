from ml.retail.src.llm.explainer import explain_decision


def main():

    decision_data = {
        "product": "Samsung Smart TV 55 4K UHD",

        "price_prediction": {
            "predicted_price": 8344.72,
            "model": "XGBoost",
        },

        "current_price": 7000,

        "price_difference_percentage": 19.21,

        "demand_signal": {
            "expected_demand": 100,
            "source": "demo",
        },

        "inventory_signal": {
            "current_stock": 30,
            "safety_stock": 20,
            "source": "demo",
        },

        "profitability_signal": {
            "margin_percentage": 18,
            "source": "demo",
        },

        "decision": "BUY",

        "recommended_quantity": 90,

        "decision_reason": (
            "Expected demand exceeds available stock "
            "requirements and the predicted market price "
            "is significantly above the current price."
        ),
    }

    explanation = explain_decision(decision_data)

    print("=" * 60)
    print("MARKETMIND AI - LLM EXPLANATION")
    print("=" * 60)
    print()
    print(explanation)
    print()
    print("=" * 60)


if __name__ == "__main__":
    main()
