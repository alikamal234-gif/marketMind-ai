import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any
from datetime import datetime, timezone
import re
from app.scrapers.base import BaseScraper

class AswakAssalamScraper(BaseScraper):
    def __init__(self):
        super().__init__()
        self.source_name = "AswakAssalam"
        self.base_url = "https://www.aswakassalam.com/"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

    def scrape_products(self, limit: int = 50) -> List[Dict[str, Any]]:
        response = requests.get(self.base_url, headers=self.headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        products = []
        items = soup.find_all('div', class_=lambda c: c and 'product-inner' in c.lower())
        if not items:
            items = soup.find_all('li', class_=lambda c: c and 'product' in c.lower())
            
        for item in items[:limit]:
            title_elem = item.find(['h2', 'h3'])
            if not title_elem: continue
            
            title = title_elem.text.strip().encode('ascii', 'ignore').decode('utf-8') # clean strange characters
            
            price_elem = item.find(class_='woocommerce-Price-amount')
            if not price_elem: continue
            
            # Extract number from price (e.g. 43,95 Dh)
            price_str = price_elem.text.strip().replace(',', '.').replace(' ', '')
            price_match = re.search(r'([0-9.]+)', price_str)
            price = float(price_match.group(1)) if price_match else 0.0
            
            products.append({
                "source": self.source_name,
                "source_url": self.base_url,
                "product_name": title,
                "brand": title.split(' ')[-1].strip() if ' ' in title else "Unknown",
                "category": "Epicerie", # Default for homepage items
                "price": price,
                "currency": "MAD",
                "discount_percentage": 0.0,
                "availability": True,
                "stock": 100, # Fake stock since it's not visible
                "scraped_at": datetime.now(timezone.utc).isoformat()
            })
            
        return products
