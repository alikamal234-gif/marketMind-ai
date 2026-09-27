import requests
from typing import List, Dict, Any
from datetime import datetime, timezone
from app.scrapers.base import BaseScraper

class DummyJsonScraper(BaseScraper):
    def __init__(self):
        super().__init__()
        self.source_name = "DummyJSON"
        self.base_url = "https://dummyjson.com/products"

    def scrape_products(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Scrape products from DummyJSON."""
        url = f"{self.base_url}?limit={limit}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        products = []
        for item in data.get("products", []):
            product = {
                "source": self.source_name,
                "source_url": f"https://dummyjson.com/products/{item.get('id')}",
                "product_name": item.get("title", "").strip(),
                "brand": item.get("brand", "Unknown").strip() if item.get("brand") else "Unknown",
                "category": item.get("category", "Uncategorized").strip(),
                "price": float(item.get("price", 0.0)),
                "currency": "USD",
                "discount_percentage": float(item.get("discountPercentage", 0.0)),
                "availability": item.get("stock", 0) > 0,
                "stock": int(item.get("stock", 0)),
                "scraped_at": datetime.now(timezone.utc).isoformat()
            }
            products.append(product)
            
        return products
