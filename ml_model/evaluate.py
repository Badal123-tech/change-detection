import torch
import torch.nn.functional as F
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
import numpy as np
from tqdm import tqdm

def evaluate_model(model, dataloader, device='cuda'):
    model.eval()
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for x1, x2, labels in tqdm(dataloader, desc="Evaluating"):
            x1, x2, labels = x1.to(device), x2.to(device), labels.to(device)
            _, change_logits = model(x1, x2)
            preds = torch.sigmoid(change_logits)
            preds = (preds > 0.5).float()

            all_preds.extend(preds.cpu().numpy().flatten())
            all_labels.extend(labels.cpu().numpy().flatten())

    # Convert to numpy arrays
    y_true = np.array(all_labels)
    y_pred = np.array(all_preds)

    # Metrics
    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, zero_division=0)
    rec = recall_score(y_true, y_pred, zero_division=0)
    f1 = f1_score(y_true, y_pred, zero_division=0)
    cm = confusion_matrix(y_true, y_pred)

    print("\n--- Evaluation Results ---")
    print(f"Accuracy:  {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall:    {rec:.4f}")
    print(f"F1 Score:  {f1:.4f}")
    print("Confusion Matrix:")
    print(cm)

    return acc, prec, rec, f1, cm
