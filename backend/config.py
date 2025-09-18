import os
from dotenv import load_dotenv
load_dotenv()

# Base directory of the project (one level above backend)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/defor_db")

# Model path (absolute)
MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(BASE_DIR, "ml_model", "model.pth"))

# Upload folder path (absolute)
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", os.path.join(BASE_DIR, "backend", "app", "static", "uploads"))

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "tif", "tiff"}
