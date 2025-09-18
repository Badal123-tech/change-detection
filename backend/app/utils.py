import os, uuid
from PIL import Image
import numpy as np
import torch
from config import MODEL_PATH
from pathlib import Path
import sys

# Add backend root to sys.path so we can import ml_interface
sys.path.append(str(Path(__file__).resolve().parent.parent))  # adds 'backend' folder

from ml_interface import ResNetMTLWrapper  # absolute import from backend/ml_interface.py

ALLOWED = {"png", "jpg", "jpeg", "tif", "tiff"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED

# Lazy load model
_model = None
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model():
    global _model
    if _model is None:
        _model = ResNetMTLWrapper()
        try:
            _model.load_state(MODEL_PATH, _device)
        except Exception:
            print("No pretrained model found at", MODEL_PATH)
        _model.model.to(_device)
        _model.model.eval()
    return _model

def run_inference_and_save_mask(img_path1, img_path2, out_folder):
    model_wrapper = load_model()
    # load images (PIL)
    im1 = Image.open(img_path1).convert("RGB")
    im2 = Image.open(img_path2).convert("RGB")
    mask_tensor = model_wrapper.predict_pair(im1, im2, device=_device)  # returns HxW (0/1)
    mask_np = (mask_tensor.cpu().numpy().astype('uint8') * 255)
    # save
    name = f"mask_{uuid.uuid4().hex[:8]}.png"
    out_path = os.path.join(out_folder, name)
    Image.fromarray(mask_np).save(out_path)
    # compute percent (approx ratio of mask pixels / total)
    pct = float(mask_np.sum()) / (255 * mask_np.size) * 100.0
    return out_path, round(pct, 4)
