# ml_interface.py - wrapper around ml_model so backend can import easily
import sys
from pathlib import Path
import torch
import torchvision.transforms as T
import numpy as np
from PIL import Image

# Add the absolute path of 'ml_model' folder to sys.path
ML_MODEL_PATH = Path(__file__).resolve().parent.parent / "ml_model"
sys.path.append(str(ML_MODEL_PATH))

# Now you can import the model class
from models.resnet_mtl import DeforNet

class ResNetMTLWrapper:
    def __init__(self):
        self.model = DeforNet(num_classes=1)  # binary mask
        self.transform = T.Compose([
            T.Resize((256, 256)),
            T.ToTensor(),
            T.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
        ])

    def load_state(self, path, device):
        checkpoint = torch.load(path, map_location=device)
        self.model.load_state_dict(checkpoint)

    def predict_pair(self, pil_img1, pil_img2, device=torch.device("cpu")):
        """
        Returns a binary mask tensor (H x W), values 0 or 1
        """
        x1 = self.transform(pil_img1).unsqueeze(0).to(device)
        x2 = self.transform(pil_img2).unsqueeze(0).to(device)
        with torch.no_grad():
            out = self.model(x1, x2)   # raw logits or probabilities
            # assume out is [B,1,H,W]; apply sigmoid to get prob
            seg = out[0] if isinstance(out, (tuple,list)) else out
            prob = torch.sigmoid(seg)
            mask = (prob > 0.5).squeeze(0).squeeze(0).cpu()
        return mask
