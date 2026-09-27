import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.scrapers.aswak_scraper import AswakAssalamScraper
from app.services.scraping_service import scraping_service

def main():
    print("Setting up MongoDB indexes...")
    scraping_service.setup_indexes()
    
    print("\nStarting ingestion pipeline...")
    scraper = AswakAssalamScraper()
    
    # Step 6: Collect 20-50 products
    print(f"Scraping from {scraper.source_name}...")
    try:
        raw_products = scraper.scrape_products(limit=30)
        print(f"Source: {scraper.source_name}")
        print(f"Products collected: {len(raw_products)}")
        
        # Step 7: Validate and clean the data
        # Step 8: Insert the cleaned records into MongoDB
        print("Cleaning and inserting into MongoDB...")
        stats = scraping_service.ingest_products(raw_products)
        
        valid_products = stats['inserted'] + stats['updated']
        duplicates = len(raw_products) - valid_products
        
        # Step 10: Print safe statistics
        print(f"Valid products: {valid_products}")
        print(f"Duplicates/Invalid removed: {duplicates}")
        print(f"Products inserted (new): {stats['inserted']}")
        print(f"Products updated (existing): {stats['updated']}")
        print(f"Price history records created: {stats['history_records']}")
        
    except Exception as e:
        print(f"Ingestion failed: {e}")

if __name__ == "__main__":
    main()
