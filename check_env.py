import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGODB_URI")
db = os.getenv("MONGODB_DATABASE")

if uri:
    print("MONGODB_URI is set (hidden).")
else:
    print("MONGODB_URI is MISSING!")

if db:
    print(f"MONGODB_DATABASE is set to: {db}")
else:
    print("MONGODB_DATABASE is MISSING!")
