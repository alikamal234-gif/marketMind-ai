import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

load_dotenv()

uri = os.getenv("MONGODB_URI") or os.getenv("DATABASE_URL")
if not uri:
    print("Error: No connection string found.")
    exit(1)

try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("MongoDB connection: SUCCESS")
except ConnectionFailure:
    print("MongoDB connection: FAILED")
except Exception as e:
    print(f"MongoDB connection: FAILED ({type(e).__name__})")
