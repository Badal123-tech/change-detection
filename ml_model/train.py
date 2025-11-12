import os, torch
from torch.utils.data import Dataset, DataLoader
from models.resnet_mtl import DeforNet
from preprocess import load_image, load_mask
import torch.nn as nn
import torch.optim as optim
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
import numpy as np
from tqdm import tqdm
import matplotlib.pyplot as plt


# -----------------------------
# Dataset Definition
# -----------------------------
class DeforestationDataset(Dataset):
    def __init__(self, img_root, mask_root):
        self.samples = []
        all_folders = os.listdir(img_root)

        # Extract area IDs (like 10001, 10002)
        area_ids = sorted(set(f.split("_")[0] for f in all_folders))

        for area in area_ids:
            before_path = None
            after_path = None

            # Find before (_0) and after (_1 or _2) folders
            for folder in all_folders:
                if folder.startswith(area + "_0"):
                    before_path = os.path.join(img_root, folder)
                elif folder.startswith(area + "_1") or folder.startswith(area + "_2"):
                    after_path = os.path.join(img_root, folder)

            if before_path is None or after_path is None:
                continue  # skip incomplete areas

            mask_area_path = os.path.join(mask_root, area)
            if not os.path.exists(mask_area_path):
                continue

            # For every mask image inside that area
            for mfile in os.listdir(mask_area_path):
                if not mfile.endswith("_mask.png"):
                    continue

                base = mfile.replace("_mask.png", "")
                img_jpg = base + ".jpg"
                img_png = base + ".png"

                # Try to find matching before/after images
                for ext in [img_jpg, img_png]:
                    b_path = os.path.join(before_path, ext)
                    a_path = os.path.join(after_path, ext)
                    if os.path.exists(b_path) and os.path.exists(a_path):
                        mask_path = os.path.join(mask_area_path, mfile)
                        self.samples.append((b_path, a_path, mask_path))
                        break

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        b_path, a_path, m_path = self.samples[idx]
        before = load_image(b_path)
        after = load_image(a_path)
        mask = load_mask(m_path)
        return before, after, mask


# -----------------------------
# Training + Evaluation Function
# -----------------------------
def train(data_root, mask_root, epochs=10, batch_size=4, lr=1e-4, device="cpu"):
    ds = DeforestationDataset(data_root, mask_root)
    if len(ds) == 0:
        raise RuntimeError("❌ No training samples found. Check your folder names and mask structure.")

    print(f"✅ Found {len(ds)} samples for training.")
    loader = DataLoader(ds, batch_size=batch_size, shuffle=True)

    model = DeforNet(num_classes=1).to(device)
    criterion = nn.BCEWithLogitsLoss(pos_weight=torch.tensor([3.0]).to(device))  # handle imbalance
    opt = optim.Adam(model.parameters(), lr=lr)

    for e in range(epochs):
        model.train()
        total = 0.0
        for b, a, m in loader:
            b, a, m = b.to(device), a.to(device), m.to(device)
            _, change = model(b, a)
            loss = criterion(change, m)
            opt.zero_grad()
            loss.backward()
            opt.step()
            total += loss.item()
        print(f"Epoch {e+1}/{epochs} - loss={total/len(loader):.4f}")

    torch.save(model.state_dict(), "model.pth")
    print("✅ Saved trained model to model.pth")

    # -----------------------------
    # Evaluation After Training
    # -----------------------------
    print("\n🔍 Evaluating model performance...")
    model.eval()
    all_preds, all_labels = [], []

    with torch.no_grad():
        for b, a, m in tqdm(loader, desc="Evaluating"):
            b, a, m = b.to(device), a.to(device), m.to(device)
            _, change = model(b, a)
            preds = torch.sigmoid(change)
            preds = (preds > 0.5).float()

            all_preds.extend(preds.cpu().numpy().flatten())
            all_labels.extend(m.cpu().numpy().flatten())

    y_true = np.array(all_labels)
    y_pred = np.array(all_preds)

    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, zero_division=0)
    rec = recall_score(y_true, y_pred, zero_division=0)
    f1 = f1_score(y_true, y_pred, zero_division=0)
    cm = confusion_matrix(y_true, y_pred)

    print("\n--- Evaluation Metrics ---")
    print(f"Accuracy : {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall   : {rec:.4f}")
    print(f"F1 Score : {f1:.4f}")
    print("Confusion Matrix:\n", cm)

    np.savetxt("confusion_matrix.csv", cm, fmt="%d", delimiter=",")
    print("📁 Confusion matrix saved to confusion_matrix.csv")

    # -----------------------------
    # Save confusion matrix as PNG
    # -----------------------------
    plt.figure(figsize=(4, 4))
    plt.imshow(cm, cmap='Blues')
    plt.title("Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            plt.text(j, i, str(cm[i, j]), ha='center', va='center', color='red')
    plt.tight_layout()
    plt.savefig("confusion_matrix.png")
    plt.close()
    print("🖼️ Confusion matrix image saved as confusion_matrix.png")


# -----------------------------
# Entry Point
# -----------------------------
if __name__ == "__main__":
    train(
        data_root=r"D:\deforestation-detect\images",
        mask_root=r"D:\deforestation-detect\masks",
        device="cuda" if torch.cuda.is_available() else "cpu",
        epochs=10,
        batch_size=4,
        lr=1e-4
    )
