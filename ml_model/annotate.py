import cv2
import os

# ==== CONFIG ====
IMG_ROOT = r"C:\Users\LENOVO\OneDrive\Desktop\deforestation-detect\images"
MASK_ROOT = r"C:\Users\LENOVO\OneDrive\Desktop\deforestation-detect\masks"
# ================

drawing = False
brush_size = 5
color = (255, 255, 255)

def draw(event, x, y, flags, param):
    global drawing, img
    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
    elif event == cv2.EVENT_MOUSEMOVE and drawing:
        cv2.circle(img, (x, y), brush_size, color, -1)
    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False

def annotate_image(img_path, save_path):
    global img
    orig = cv2.imread(img_path)
    img = cv2.cvtColor(orig.copy(), cv2.COLOR_BGR2GRAY)
    img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)

    cv2.namedWindow("Annotate - draw white on deforested area")
    cv2.setMouseCallback("Annotate - draw white on deforested area", draw)

    while True:
        cv2.imshow("Annotate - draw white on deforested area", img)
        key = cv2.waitKey(1) & 0xFF
        if key == ord('s'):
            mask = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            _, mask = cv2.threshold(mask, 1, 255, cv2.THRESH_BINARY)
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            cv2.imwrite(save_path, mask)
            print(f"✅ Saved mask: {save_path}")
            break
        elif key == 27: # ESC
            break

    cv2.destroyAllWindows()

if __name__ == "__main__":
    for folder in os.listdir(IMG_ROOT):
        if folder.endswith("_1"):  # use after images for clarity
            area = folder.split("_")[0]
            after_path = os.path.join(IMG_ROOT, folder)
            mask_folder = os.path.join(MASK_ROOT, area)
            os.makedirs(mask_folder, exist_ok=True)

            for img_file in os.listdir(after_path):
                if img_file.lower().endswith((".png",".jpg",".jpeg")):
                    img_path = os.path.join(after_path, img_file)
                    mask_path = os.path.join(mask_folder, img_file.rsplit('.',1)[0] + "_mask.png")
                    if os.path.exists(mask_path):
                        continue
                    annotate_image(img_path, mask_path)
