from PIL import Image
import torchvision.transforms as T
import torch
import numpy as np

img_tf = T.Compose([
    T.Resize((256,256)),
    T.ToTensor(),
    T.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
])

mask_tf = T.Compose([
    T.Resize((64,64)),  # match model output
    T.ToTensor()
])


def load_image(path):
    img = Image.open(path).convert("RGB")
    return img_tf(img)

def load_mask(path):
    mask = Image.open(path).convert("L")  # grayscale
    m = mask_tf(mask)
    # make binary (0 or 1)
    m = (m>0.5).float()
    return m
