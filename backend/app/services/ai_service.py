import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if api_key:
    client = Groq(api_key=api_key)
else:
    print("WARNING: GROQ_API_KEY not found in environment variables.")
    client = None

async def generate_business_insight(prediction_data: dict, ml_prediction: float, risk_level: str) -> str:
    """
    Takes the structured ML outputs and generates a natural language business insight.
    """
    if not client:
        return "Insight generation disabled. No GROQ_API_KEY provided."

    prompt = f"""
    You are an expert business analyst for MarketMind AI. 
    Analyze the following product decision and provide a concise, actionable business insight (max 3 sentences).
    
    Product Context:
    - Product: {prediction_data.get('product_name') or prediction_data.get('product_id')}
    - Category: {prediction_data.get('category')}
    
    ML & Decision Engine:
    - Expected Demand: {ml_prediction:.1f} units
    - Current Stock: {prediction_data.get('stock')}
    - Recommended Decision: {risk_level.upper()} (Risk level is now Recommendation Label)
    
    Provide an analysis explaining *why* the recommendation is what it is, based on demand and stock.
    Important: Do NOT invent any numbers. Rely strictly on the data provided above.
    Communicate like a professional business analyst (e.g. 'Based on the expected demand of X...').
    """
    
    try:
        completion = client.chat.completions.create(
            model="qwen/qwen3.8-27b", 
            messages=[
                {"role": "system", "content": "You are a professional business analyst."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error calling Groq: {e}")
        return "Insight generation failed. Please check your API configuration or network."
