from ml.retail.src.models.predict_price import predict_price

from ml.retail.src.orchestrator.orchestrator import build_context

from ml.retail.src.decision.engine import (
    DecisionInput,
    make_decision,
)


def main():

    # ==========================================
    # 1. Product
    # ==========================================

    product = {
        "category": "MULTIMÉDIA",
        "brand": "SAMSUNG",
        "subcategory": "TV",
        "unit": "PIÈCE",
        "quantity": "1",
        "availability": "Available",
        "promotion": False,
        "promotion_type": "None",
        "source_retailer": "Aswak Assalam",
        "advertised_in_flyer": False,
        "year": 2026,
        "month": 9,
        "day_of_week": 6,

        "product_name_length": 35,
        "product_name_word_count": 7,
        "product_name_first_number": 55,
        "product_name_number_count": 1,

        "has_4k": 1,
        "has_uhd": 1,
        "has_smart_tv": 1,
        "has_no_frost": 0,

        "has_quantity": 1,
        "has_unit": 1,
    }

    product_id = "MM-001"

    product_name = "Samsung Smart TV 55 4K UHD"

    # ==========================================
    # 2. Price prediction
    # ==========================================

    predicted_price = predict_price(product)

    price_signal = {
        "predicted_price": predicted_price,
        "model": "XGBoost",
        "confidence": None,
    }

    # ==========================================
    # 3. Other signals
    #
    # DEMO values for now
    # ==========================================

    demand_signal = {
        "expected_demand": 100,
        "model": "demo",
    }

    inventory_signal = {
        "current_stock": 30,
        "safety_stock": 20,
        "model": "demo",
    }

    profitability_signal = {
        "margin_percentage": 18.0,
        "model": "demo",
    }

    anomaly_signal = {
        "detected": False,
        "model": "demo",
    }

    # ==========================================
    # 4. Orchestrator
    # ==========================================

    context = build_context(
        product_id=product_id,
        product_name=product_name,
        price_prediction=price_signal,
        demand_signal=demand_signal,
        inventory_signal=inventory_signal,
        profitability_signal=profitability_signal,
        anomaly_signal=anomaly_signal,
    )

    # ==========================================
    # 5. Decision Engine
    # ==========================================

    decision_input = DecisionInput(
        expected_demand=demand_signal["expected_demand"],
        current_stock=inventory_signal["current_stock"],
        safety_stock=inventory_signal["safety_stock"],
        predicted_price=predicted_price,
        current_price=7000,
        margin_percentage=profitability_signal["margin_percentage"],
        anomaly_detected=anomaly_signal["detected"],
    )

    decision = make_decision(decision_input)

    # ==========================================
    # 6. Final output
    # ==========================================

    print("\n")
    print("=" * 60)
    print("MARKETMIND AI - COMPLETE PIPELINE")
    print("=" * 60)

    print("\nPRODUCT")
    print(f"  ID:       {product_id}")
    print(f"  Product:  {product_name}")

    print("\nPRICE MODEL")
    print(f"  Predicted price: {predicted_price:,.2f} MAD")

    print("\nORCHESTRATOR")
    print(f"  Signals complete: {context.data_quality['complete']}")

    print("\nDECISION ENGINE")
    print(f"  Decision:             {decision.decision}")
    print(f"  Recommended quantity: {decision.recommended_quantity}")
    print(
        f"  Price difference:     "
        f"{decision.price_difference_percentage:.2f}%"
    )
    print(f"  Margin:               {decision.margin_percentage:.2f}%")

    print("\nREASON")
    print(f"  {decision.reason}")

    print("\n" + "=" * 60)


if __name__ == "__main__":
    main()
