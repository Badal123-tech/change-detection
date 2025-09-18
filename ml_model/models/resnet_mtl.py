import torch
import torch.nn as nn
import torchvision.models as tv

class SimpleDecoder(nn.Module):
    def __init__(self, in_channels=2048, out_channels=1):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels, 512, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(512)
        self.up1 = nn.Upsample(scale_factor=2, mode='bilinear', align_corners=False)
        self.conv2 = nn.Conv2d(512, 128, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(128)
        self.up2 = nn.Upsample(scale_factor=4, mode='bilinear', align_corners=False)
        self.conv3 = nn.Conv2d(128, out_channels, kernel_size=1)

    def forward(self, x):
        x = nn.ReLU()(self.bn1(self.conv1(x)))
        x = self.up1(x)
        x = nn.ReLU()(self.bn2(self.conv2(x)))
        x = self.up2(x)
        x = self.conv3(x)
        return x

class DeforNet(nn.Module):
    """
    Input: x1, x2 each [B,3,H,W]
    Output: segmentation logits for x2 and change logits
    """
    def __init__(self, num_classes=1):
        super().__init__()
        resnet = tv.resnet50(pretrained=True)
        # remove classification head
        self.encoder = nn.Sequential(*list(resnet.children())[:-2])  # outputs [B,2048,H/32,W/32]
        self.seg_head = SimpleDecoder(in_channels=2048, out_channels=num_classes)
        # change head: take difference of encoded features, then decode
        self.change_head = SimpleDecoder(in_channels=2048, out_channels=1)

    def forward(self, x1, x2):
        f1 = self.encoder(x1)
        f2 = self.encoder(x2)
        seg_logits = self.seg_head(f2)
        diff = torch.abs(f2 - f1)
        change_logits = self.change_head(diff)
        # return segmentation logits and change logits (choose change as primary)
        return seg_logits, change_logits
