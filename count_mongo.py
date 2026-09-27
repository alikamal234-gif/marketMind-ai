import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

from backend.app.db import db

def main():
    try:
        count = db["products"].count_documents({})
        print(f"TOTAL_PRODUCTS: {count}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
