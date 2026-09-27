import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

# Set random seed for reproducibility
np.random.seed(42)

def get_season(date):
    month = date.month
    if month in [12, 1, 2]:
        return "Winter"
    elif month in [3, 4, 5]:
        return "Spring"
    elif month in [6, 7, 8]:
        return "Summer"
    else:
        return "Autumn"

def get_holiday(date):
    month, day = date.month, date.day
    # Simplified mock holidays for the sake of the dataset
    if month == 3 and day >= 10 and day <= 31: # Mocking Ramadan roughly
        return "Ramadan", 1
    elif month == 4 and day in [9, 10]: # Mocking Eid al-Fitr roughly
        return "Eid al-Fitr", 1
    elif month == 6 and day in [16, 17]: # Mocking Eid al-Adha roughly
        return "Eid al-Adha", 1
    elif month == 9 and day <= 15: # Back to school
        return "Back_to_school", 1
    return "None", 0

def generate_data(num_days=730): # 2 years
    products = [
        {"id": "P001", "name": "Jacket", "category": "Clothing", "purchase_price": 30.0, "base_price": 70.0, "base_demand": 5, "seasonality": {"Winter": 4.0, "Spring": 1.0, "Summer": 0.2, "Autumn": 2.0}},
        {"id": "P002", "name": "T-Shirt", "category": "Clothing", "purchase_price": 10.0, "base_price": 25.0, "base_demand": 15, "seasonality": {"Winter": 0.5, "Spring": 1.2, "Summer": 2.5, "Autumn": 1.0}},
        {"id": "P003", "name": "School Bag", "category": "Accessories", "purchase_price": 40.0, "base_price": 120.0, "base_demand": 2, "seasonality": {"Winter": 0.5, "Spring": 0.5, "Summer": 1.0, "Autumn": 5.0}}, # Huge spike in Autumn/Back to school
        {"id": "P004", "name": "Dates", "category": "Groceries", "purchase_price": 15.0, "base_price": 35.0, "base_demand": 10, "seasonality": {"Winter": 1.0, "Spring": 1.0, "Summer": 1.0, "Autumn": 1.0}}, # Special Ramadan spike
        {"id": "P005", "name": "Sunglasses", "category": "Accessories", "purchase_price": 10.0, "base_price": 50.0, "base_demand": 4, "seasonality": {"Winter": 0.3, "Spring": 1.0, "Summer": 3.0, "Autumn": 0.8}},
        {"id": "P006", "name": "Olive Oil 1L", "category": "Groceries", "purchase_price": 40.0, "base_price": 75.0, "base_demand": 20, "seasonality": {"Winter": 1.0, "Spring": 1.0, "Summer": 1.0, "Autumn": 1.2}}, # Stable
    ]
    
    start_date = datetime.today() - timedelta(days=num_days)
    records = []
    
    for product in products:
        stock = np.random.randint(100, 500)
        
        for day in range(num_days):
            current_date = start_date + timedelta(days=day)
            
            season = get_season(current_date)
            holiday_type, is_holiday = get_holiday(current_date)
            
            is_weekend = 1 if current_date.weekday() >= 5 else 0
            
            # Pricing logic
            promotion = 1 if np.random.random() < 0.1 else 0 # 10% chance of promotion
            discount = np.random.uniform(0.1, 0.3) if promotion else 0.0
            price = round(product["base_price"] * (1 - discount), 2)
            
            # Demand calculation
            season_multiplier = product["seasonality"][season]
            weekend_multiplier = 1.3 if is_weekend else 1.0
            
            # Holiday impacts
            holiday_multiplier = 1.0
            if holiday_type == "Ramadan" and product["name"] == "Dates":
                holiday_multiplier = 5.0
            elif holiday_type == "Back_to_school" and product["name"] == "School Bag":
                holiday_multiplier = 8.0
            
            # Price elasticity: lower price -> higher demand
            price_elasticity = 1 + (discount * 2.0)
            
            expected_demand = product["base_demand"] * season_multiplier * weekend_multiplier * holiday_multiplier * price_elasticity
            
            # Add some noise
            units_sold = max(0, int(np.random.normal(expected_demand, expected_demand * 0.2)))
            
            # Cap by stock
            if units_sold > stock:
                units_sold = stock
                
            stock -= units_sold
            
            records.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "month": current_date.month,
                "season": season,
                "is_holiday": is_holiday,
                "holiday_type": holiday_type,
                "product_id": product["id"],
                "product_name": product["name"],
                "category": product["category"],
                "selling_price": price,
                "purchase_price": product["purchase_price"],
                "stock": stock,
                "promotion": promotion,
                "discount": discount,
                "units_sold": units_sold
            })
            
            # Restock logic (retailer restocking when stock is low)
            if stock < product["base_demand"] * 10:
                stock += int(product["base_demand"] * np.random.uniform(30, 60))
                
    df = pd.DataFrame(records)
    
    # Save to data/raw
    output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "raw", "synthetic_sales_data.csv"))
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} records and saved to {output_path}")

if __name__ == "__main__":
    generate_data()
