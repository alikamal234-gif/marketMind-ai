import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI") or os.getenv("DATABASE_URL")
DB_NAME = "marketmind"

class Database:
    _client: MongoClient = None

    @classmethod
    def get_client(cls) -> MongoClient:
        if cls._client is None:
            if not MONGO_URI:
                raise Exception("Database connection string not found in environment variables.")
            cls._client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000, connectTimeoutMS=2000)
        return cls._client

    @classmethod
    def get_db(cls):
        return cls.get_client()[DB_NAME]

db = Database.get_db()
