from flask import Blueprint, request, jsonify, send_from_directory, current_app
from werkzeug.utils import secure_filename
import os
from .utils import allowed_file, run_inference_and_save_mask
from .models import init_db, insert_image_doc, get_image_doc
import traceback

bp = Blueprint("api", __name__)

# init DB (connect)
init_db()

# --- Root route ---
@bp.route("/", methods=["GET"])
def home():
    return jsonify({"status": "ok", "msg": "Backend is running!"})

@bp.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status":"ok", "msg":"API alive"})

@bp.route("/images", methods=["POST"])
def upload_image():
    try:
        if "file" not in request.files:
            return jsonify({"error":"no file"}), 400
        f = request.files["file"]
        if f.filename == "":
            return jsonify({"error":"no filename"}), 400
        if not allowed_file(f.filename):
            return jsonify({"error":"file not allowed"}), 400

        os.makedirs(current_app.config["UPLOAD_FOLDER"], exist_ok=True)
        filename = secure_filename(f.filename)
        path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
        f.save(path)

        data = {
            "file_url": path,
            "acquisition_date": request.form.get("acquisition_date"),
            "sensor": request.form.get("sensor", "unknown"),
        }
        doc_id = insert_image_doc(data)
        return jsonify({"status":"ok", "id": str(doc_id)}), 201
    except Exception as e:
        print("Error in /images:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@bp.route("/detect", methods=["POST"])
def detect_change():
    try:
        if "image1" in request.files and "image2" in request.files:
            i1 = request.files["image1"]
            i2 = request.files["image2"]
            fn1 = secure_filename(i1.filename)
            fn2 = secure_filename(i2.filename)
            p1 = os.path.join(current_app.config["UPLOAD_FOLDER"], fn1)
            p2 = os.path.join(current_app.config["UPLOAD_FOLDER"], fn2)
            print("Saving uploaded files to:", p1, p2)
            i1.save(p1)
            i2.save(p2)
        else:
            data = request.get_json() or {}
            id1 = data.get("id1"); id2 = data.get("id2")
            if not id1 or not id2:
                return jsonify({"error":"provide image files or ids"}), 400
            doc1 = get_image_doc(id1); doc2 = get_image_doc(id2)
            if not doc1 or not doc2:
                return jsonify({"error":"image ids not found"}), 404
            p1, p2 = doc1["file_url"], doc2["file_url"]
            print("Using images from DB:", p1, p2)

        mask_path, change_pct = run_inference_and_save_mask(p1, p2, current_app.config["UPLOAD_FOLDER"])
        print("Mask saved to:", mask_path, "Change %:", change_pct)

        doc = {
            "file1": p1,
            "file2": p2,
            "mask_url": mask_path,
            "change_percent": change_pct
        }
        new_id = insert_image_doc(doc)
        return jsonify({"status":"ok", "mask_url": mask_path, "change_percent": change_pct, "analysis_id": str(new_id)})

    except Exception as e:
        print("ERROR in /detect:", e)
        return jsonify({"error": str(e)}), 500


@bp.route("/mask/<path:filename>", methods=["GET"])
def get_mask(filename):
    folder = current_app.config["UPLOAD_FOLDER"]
    return send_from_directory(folder, filename)
