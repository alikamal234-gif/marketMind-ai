from pymongo import UpdateOne
from datetime import datetime, timezone
from app.db import db
from typing import List, Dict, Any

class ScrapingService:
    def __init__(self):
        self.products_collection = db["products"]
        self.price_history_collection = db["price_history"]
        self.sources_collection = db["sources"]

    def setup_indexes(self):
        """Create useful indexes after validating the schema."""
        self.products_collection.create_index("product_name")
        self.products_collection.create_index("category")
        self.products_collection.create_index("source")
        # Unique index on source + product_name to prevent duplicates
        self.products_collection.create_index([("source", 1), ("product_name", 1)], unique=True)
        
        self.price_history_collection.create_index("product_id")
        self.price_history_collection.create_index("observed_at")

    def clean_data(self, products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicates and validate data."""
        seen = set()
        cleaned = []
        for p in products:
            key = f"{p['source']}_{p['product_name']}"
            if key not in seen:
                # Basic validation
                if p.get("price") is not None and isinstance(p["price"], (int, float)):
                    seen.add(key)
                    cleaned.append(p)
        return cleaned

    def ingest_products(self, products: List[Dict[str, Any]]) -> Dict[str, int]:
        """Upsert products into MongoDB using bulk operations and record price history."""
        if not products:
            return {"inserted": 0, "updated": 0, "history_records": 0}

        cleaned_products = self.clean_data(products)
        if not cleaned_products:
            return {"inserted": 0, "updated": 0, "history_records": 0}

        operations = []
        for p in cleaned_products:
            # We use source and product_name as the composite key for upsert
            filter_query = {"source": p["source"], "product_name": p["product_name"]}
            update_query = {"$set": p}
            operations.append(UpdateOne(filter_query, update_query, upsert=True))

        # Perform bulk upsert
        result = self.products_collection.bulk_write(operations)
        inserted = result.upserted_count
        updated = result.modified_count

        # Record price history for all items
        history_records = []
        
        # After bulk write, we need the _ids to create history records
        # Easiest way is to fetch them back (only the ones we just touched)
        source_name = cleaned_products[0]["source"] if cleaned_products else "Unknown"
        product_names = [p["product_name"] for p in cleaned_products]
        
        db_products = list(self.products_collection.find(
            {"source": source_name, "product_name": {"$in": product_names}},
            {"_id": 1, "product_name": 1, "price": 1, "discount_percentage": 1}
        ))
        
        db_products_map = {p["product_name"]: p for p in db_products}
        
        for p in cleaned_products:
            db_p = db_products_map.get(p["product_name"])
            if db_p:
                history_records.append({
                    "product_id": str(db_p["_id"]),
                    "source": p["source"],
                    "price": p["price"],
                    "discount_percentage": p.get("discount_percentage", 0),
                    "observed_at": p["scraped_at"]
                })

        if history_records:
            self.price_history_collection.insert_many(history_records)
            
        # Update source metadata
        self.sources_collection.update_one(
            {"name": source_name},
            {"$set": {"last_scraped_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True
        )

        return {
            "inserted": inserted,
            "updated": updated,
            "history_records": len(history_records)
        }

scraping_service = ScrapingService()
