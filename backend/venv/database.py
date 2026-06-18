from pymongo import MongoClient

MONGO_URL = "

client = MongoClient(MONGO_URL)

db = client["taskflow"]

users_collection = db["user"]