from app.mock.products_data import MOCK_PRODUCTS
from app.db import db
import random

class ProductService:
    def __init__(self):
        self.collection = db["products"]

    def get_all_products(self):
        try:
            # Try fetching from MongoDB
            mongo_products = list(self.collection.find({}, {"_id": 0}))
            if mongo_products:
                # Map the MongoDB schema to what the frontend expects
                # (frontend expects id, name, category, price, stock, risk, predicted_demand)
                mapped_products = []
                for idx, p in enumerate(mongo_products):
                    mapped_products.append({
                        "id": p.get("source_url", f"Mongo-{idx}"),
                        "name": p.get("product_name", "Unknown"),
                        "category": p.get("category", "Uncategorized"),
                        "price": p.get("price", 0.0),
                        "stock": p.get("stock", 0) or random.randint(10, 200),
                        "predicted_demand": random.randint(10, 100), # Mocked because demand model is separate
                        "risk": random.choice(["LOW", "MEDIUM", "HIGH"]), # Mocked until integrated
                        "status": "Active"
                    })
                return mapped_products
        except Exception as e:
            print(f"Error fetching from MongoDB: {e}")
            
        # Fallback to mock data if Mongo is empty or fails
        return MOCK_PRODUCTS
        
    def add_product(self, product_data):
        # We can still add it to Mongo if we want, but for now we just fallback to the original behavior
        new_product = {
            "id": f"P{random.randint(100, 999)}",
            "name": product_data.get("name", "New Product"),
            "category": product_data.get("category", "Uncategorized"),
            "price": product_data.get("price", 0.0),
            "stock": product_data.get("stock", 0),
            "predicted_demand": random.randint(10, 100),
            "risk": random.choice(["LOW", "MEDIUM", "HIGH"]),
            "status": "New"
        }
        MOCK_PRODUCTS.append(new_product)
        return new_product

    def add_products_bulk(self, products_list):
        if not products_list:
            return {"inserted": 0}
            
        formatted_products = []
        for p in products_list:
            formatted_products.append({
                "product_name": p.get("name", "Unknown"),
                "category": p.get("category", "Uncategorized"),
                "price": float(p.get("price", 0.0) or 0.0),
                "stock": int(p.get("current_stock", 0) or 0),
                "source_url": p.get("product_id", f"Custom-{random.randint(1000,9999)}")
            })
            
        try:
            # We use insert_many for simplicity. In a real system, we might upsert based on source_url
            result = self.collection.insert_many(formatted_products)
            return {"inserted": len(result.inserted_ids)}
        except Exception as e:
            print(f"Error bulk inserting to MongoDB: {e}")
            return {"inserted": 0, "error": str(e)}

product_service = ProductService()
