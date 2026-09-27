from ml.retail.src.decision.engine import DecisionInput, make_decision


def main():

    inputs = DecisionInput(
        expected_demand=100,
        current_stock=30,
        safety_stock=20,
        predicted_price=8344.72,
        current_price=7000,
        margin_percentage=18,
        anomaly_detected=False,
    )

    result = make_decision(inputs)

    print("=" * 60)
    print("MARKETMIND AI - DECISION ENGINE")
    print("=" * 60)

    print(f"Decision:              {result.decision}")
    print(f"Recommended quantity:  {result.recommended_quantity}")
    print(f"Expected demand:       {result.expected_demand}")
    print(f"Current stock:         {result.current_stock}")
    print(f"Safety stock:          {result.safety_stock}")
    print(f"Predicted price:       {result.predicted_price:.2f} MAD")
    print(f"Current price:         {result.current_price:.2f} MAD")
    print(
        f"Price difference:      "
        f"{result.price_difference_percentage:.2f}%"
    )
    print(f"Margin:                {result.margin_percentage:.2f}%")
    print(f"Reason:                {result.reason}")


if __name__ == "__main__":
    main()
