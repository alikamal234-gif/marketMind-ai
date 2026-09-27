from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseScraper(ABC):
    def __init__(self):
        self.source_name = "Base"
        
    @abstractmethod
    def scrape_products(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Scrape products from the source, up to the specified limit."""
        pass
