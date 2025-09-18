from flask import Flask
from config import UPLOAD_FOLDER
from flask_cors import CORS  # <-- add this
import os

def create_app():
    app = Flask(__name__, static_folder="static", template_folder="templates")
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Enable CORS for all routes (development)
    CORS(app)

    from .routes import bp
    app.register_blueprint(bp, url_prefix="/api")
    return app
