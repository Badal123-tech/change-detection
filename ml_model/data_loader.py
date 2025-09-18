import os
from PIL import Image
from torch.utils.data import Dataset
import torchvision.transforms as T

class PatchPairDataset(Dataset):
    """
    Expects a parent directory where each sample folder contains images (patches)
    For demo, pair is chosen by suffix or ordering; adapt for your dataset structure.
    """
    def __init__(self, root_dir, transform=None):
        self.root_dir = root_dir
        self.samples = [os.path.join(root_dir, d) for d in os.listdir(root_dir) if os.path.isdir(os.path.join(root_dir,d))]
        self.transform = transform or T.Compose([T.Resize((256,256)), T.ToTensor()])

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        folder = self.samples[idx]
        # pick two images inside folder for demo (first two)
        files = sorted([f for f in os.listdir(folder) if f.lower().endswith((".png",".jpg",".tif",".tiff"))])
        if len(files) < 2:
            raise ValueError(f"Need at least two images in {folder}")
        im1 = Image.open(os.path.join(folder, files[0])).convert("RGB")
        im2 = Image.open(os.path.join(folder, files[1])).convert("RGB")
        x1 = self.transform(im1)
        x2 = self.transform(im2)
        return x1, x2
