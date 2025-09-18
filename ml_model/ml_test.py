import os, random
import torch
from PIL import Image
import torchvision.transforms as T
import numpy as np
from models.resnet_mtl import DeforNet

# ==== CONFIG ====
ROOT = r"C:\Users\LENOVO\OneDrive\Desktop\deforestation-detect\images"
OUT_MASK = "test_mask.png"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
# =================

# find matching pairs of folders: (area_0, area_1)
all_folders = [f for f in os.listdir(ROOT) if os.path.isdir(os.path.join(ROOT,f))]
areas = set(f.split('_')[0] for f in all_folders)
pairs = []
for a in areas:
    f0 = os.path.join(ROOT, f"{a}_0")
    f1 = os.path.join(ROOT, f"{a}_1")
    if os.path.exists(f0) and os.path.exists(f1):
        pairs.append((f0, f1))

if not pairs:
    raise RuntimeError("No matching *_0 and *_1 folder pairs found!")

# pick one random area pair
before_folder, after_folder = random.choice(pairs)

def pick_random_image(folder):
    imgs = [f for f in os.listdir(folder) if f.lower().endswith((".png",".jpg",".jpeg",".tif",".tiff"))]
    if len(imgs) < 1:
        raise ValueError(f"No images found in {folder}")
    return os.path.join(folder, random.choice(imgs))

img1_path = pick_random_image(before_folder)
img2_path = pick_random_image(after_folder)

print(f"🖼 BEFORE: {img1_path}")
print(f"🖼 AFTER : {img2_path}")
print("Using device:", DEVICE)

# load model
model = DeforNet().to(DEVICE)
model.eval()

# preprocessing
tf = T.Compose([
    T.Resize((256,256)),
    T.ToTensor(),
    T.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
])

# load images
im1 = tf(Image.open(img1_path).convert("RGB")).unsqueeze(0).to(DEVICE)
im2 = tf(Image.open(img2_path).convert("RGB")).unsqueeze(0).to(DEVICE)

# run model
with torch.no_grad():
    seg, change = model(im1, im2)
    prob = torch.sigmoid(change)
    mask = (prob>0.5).float().squeeze().cpu().numpy()

# save as image
mask_img = (mask*255).astype(np.uint8)
Image.fromarray(mask_img).save(OUT_MASK)

print("✅ Mask saved to", OUT_MASK)
