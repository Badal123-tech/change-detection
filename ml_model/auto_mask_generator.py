import cv2
import os
import numpy as np

# ==== CONFIG ====
IMG_ROOT = r"C:\Users\LENOVO\OneDrive\Desktop\deforestation-detect\images"
MASK_ROOT = r"C:\Users\LENOVO\OneDrive\Desktop\deforestation-detect\masks"
# ================

def generate_mask(before_path, after_path, save_path):
    # read and resize
    b = cv2.imread(before_path)
    a = cv2.imread(after_path)
    b = cv2.resize(b, (256,256))
    a = cv2.resize(a, (256,256))

    # convert to grayscale
    b_gray = cv2.cvtColor(b, cv2.COLOR_BGR2GRAY)
    a_gray = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)

    # absolute difference
    diff = cv2.absdiff(a_gray, b_gray)

    # normalize and threshold
    diff = cv2.GaussianBlur(diff, (5,5), 0)
    _, mask = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)

    # clean noise
    kernel = np.ones((3,3), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    cv2.imwrite(save_path, mask)
    print("✅ saved", save_path)

def main():
    all_folders = os.listdir(IMG_ROOT)
    areas = set(f.split('_')[0] for f in all_folders if '_' in f)

    for area in areas:
        f0 = os.path.join(IMG_ROOT, f"{area}_0")
        f1 = os.path.join(IMG_ROOT, f"{area}_1")
        if not os.path.exists(f0) or not os.path.exists(f1):
            continue

        files = [f for f in os.listdir(f0) if f.lower().endswith((".png",".jpg",".jpeg"))]
        for file in files:
            before = os.path.join(f0, file)
            after = os.path.join(f1, file)
            if not os.path.exists(after): continue

            mask_out = os.path.join(MASK_ROOT, area, file.rsplit('.',1)[0] + "_mask.png")
            if os.path.exists(mask_out): continue

            generate_mask(before, after, mask_out)

if __name__ == "__main__":
    main()
