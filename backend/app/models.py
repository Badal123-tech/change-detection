from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from config import MONGO_URI

_db = None

def init_db():
    global _db
    if _db is None:
        client = MongoClient(MONGO_URI)
        _db = client.get_default_database()
        # create collection if it doesn't exist
        if "images" not in _db.list_collection_names():
            _db.create_collection("images", capped=False)
    return _db

def insert_image_doc(doc):
    db = init_db()
    res = db.images.insert_one(doc)
    return res.inserted_id

def get_image_doc(id_or_obj):
    db = init_db()
    try:
        # accept string id
        return db.images.find_one({"_id": ObjectId(id_or_obj)})
    except Exception:
        # maybe it's already a dict or path, fallback search by file_url
        return db.images.find_one({"file_url": id_or_obj})
