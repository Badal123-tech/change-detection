import os, torch
from torch.utils.data import Dataset, DataLoader
from models.resnet_mtl import DeforNet
from preprocess import load_image, load_mask
import torch.nn as nn
import torch.optim as optim

class DeforestationDataset(Dataset):
    def __init__(self, img_root, mask_root):
        self.samples = []
        # go through every area folder inside masks
        for area in os.listdir(mask_root):
            mask_area_path = os.path.join(mask_root, area)
            img_after_path = os.path.join(img_root, f"{area}_1")
            if not os.path.exists(img_after_path):
                continue

            for mfile in os.listdir(mask_area_path):
                if not mfile.endswith("_mask.png"):
                    continue

                # try to find a matching after-image (same base name but .jpg/.png)
                base = mfile.replace("_mask.png", "")
                img_jpg = base + ".jpg"
                img_png = base + ".png"

                if os.path.exists(os.path.join(img_after_path, img_jpg)):
                    img_path = os.path.join(img_after_path, img_jpg)
                elif os.path.exists(os.path.join(img_after_path, img_png)):
                    img_path = os.path.join(img_after_path, img_png)
                else:
                    continue

                mask_path = os.path.join(mask_area_path, mfile)
                self.samples.append((img_path, mask_path))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, mask_path = self.samples[idx]
        img = load_image(img_path)
        mask = load_mask(mask_path)
        # feed same image as both before/after for model input
        return img, img, mask


def train(data_root, mask_root, epochs=10, batch_size=4, lr=1e-4, device="cpu"):
    ds = DeforestationDataset(data_root, mask_root)

    if len(ds) == 0:
        raise RuntimeError("No training samples found. Check if masks exist and filenames match images!")

    loader = DataLoader(ds, batch_size=batch_size, shuffle=True)
    model = DeforNet(num_classes=1).to(device)
    criterion = nn.BCEWithLogitsLoss()
    opt = optim.Adam(model.parameters(), lr=lr)

    for e in range(epochs):
        model.train()
        total = 0.0
        for b,a,m in loader:
            b,a,m = b.to(device),a.to(device),m.to(device)
            _, change = model(b,a)
            loss = criterion(change, m)
            opt.zero_grad()
            loss.backward()
            opt.step()
            total += loss.item()
        print(f"Epoch {e+1}/{epochs} - loss={total/len(loader):.4f}")

    torch.save(model.state_dict(), "model.pth")
    print("✅ Saved trained model to model.pth")


if __name__=="__main__":
    train(
        data_root=r"C:\Users\LENOVO\OneDrive\Desktop\deforestation-detect\images",
        mask_root=r"C:\Users\LENOVO\OneDrive\Desktop\deforestation-detect\masks",
        device="cuda" if torch.cuda.is_available() else "cpu"
    )
