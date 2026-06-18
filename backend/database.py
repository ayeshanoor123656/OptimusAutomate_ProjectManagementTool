
from pymongo import MongoClient

MONGO_URL = "mongodb+srv://l230549_db_user:ayesha12345@cluster0.ecx3wpx.mongodb.net/"

client = MongoClient(MONGO_URL)

db = client["projectdb"]

users_collection = db["user"]
boards_collection = db["boards"]