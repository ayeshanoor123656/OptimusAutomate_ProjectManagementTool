from pymongo import MongoClient
import os

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)

db = client["projectdb"]

users_collection = db["user"]
boards_collection = db["boards"]
tasks_collection = db["tasks"]