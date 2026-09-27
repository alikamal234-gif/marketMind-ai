import os
import pandas as pd
import joblib

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "models", "demand_model.joblib")

def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Please train the model first.")
    return joblib.load(MODEL_PATH)

def predict_demand(model, input_data: dict) -> float:
    """
    Predicts demand given a single instance dictionary.
    """
    # The pipeline expects a DataFrame
    df = pd.DataFrame([input_data])
    
    # The pipeline handles scaling and encoding, so we just pass the DataFrame
    prediction = model.predict(df)[0]
    return float(prediction)

if __name__ == "__main__":
    print("Loading saved model...")
    try:
        model = load_model()
        
        # Test Prediction Example
        sample_input = {
            "price": 8.5,
            "stock": 40,
            "searches": 120,
            "views": 350,
            "orders": 80,
            "category": "Dairy",
            "month": 9,
            "day_of_week": 6
        }
        
        print(f"Predicting demand for sample input:\n{sample_input}")
        demand = predict_demand(model, sample_input)
        print(f"\n=> Predicted Demand: {demand:.2f} units/day")
        
    except Exception as e:
        print(f"Error: {e}")
