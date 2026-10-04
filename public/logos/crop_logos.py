"""
Crop whitespace / black borders from animated GIFs for CIRC logo.
- logo 1.gif  => circ-logo-light.gif  (used in LIGHT mode, dark logo on light bg)
- logo 2.gif  => circ-logo-dark.gif   (used in DARK  mode, light logo on dark bg)
Uses pure PIL - no numpy needed.
"""

import os
import shutil
from PIL import Image, ImageSequence

BASE = os.path.dirname(os.path.abspath(__file__))
# crop_logos.py lives in public/logos/; go up twice to reach circ-website/
WEBSITE_ROOT = os.path.abspath(os.path.join(BASE, "..", ".."))

SRC = [
    (os.path.join(WEBSITE_ROOT, "logo 1.gif"), os.path.join(BASE, "circ-logo-light.gif"), False),
    (os.path.join(WEBSITE_ROOT, "logo 2.gif"), os.path.join(BASE, "circ-logo-dark.gif"),  True),
]


def union_bbox(frames, is_dark_bg):
    """
    Return the union bounding box of all non-background pixels across all frames.
    is_dark_bg=True  → background is black; we look for pixels that are NOT black.
    is_dark_bg=False → background is white; we look for pixels that are NOT white.
    """
    union = None
    for frame in frames:
        rgba = frame.convert("RGBA")
        r, g, b, a = rgba.split()

        if is_dark_bg:
            # Create a mask where pixels are "not black"
            # Composite the frame over a white canvas so transparent→white,
            # then threshold brightness < 240 means content.
            canvas = Image.new("RGB", rgba.size, (0, 0, 0))
            canvas.paste(rgba, mask=a)
            # Invert: darken pixels on black bg look bright after pasting on black,
            # content on dark bg = pixels brighter than near-black.
            gray = canvas.convert("L")
            mask_img = gray.point(lambda px: 255 if px > 20 else 0, mode="1")
        else:
            # Background is white; content pixels are not white.
            canvas = Image.new("RGB", rgba.size, (255, 255, 255))
            canvas.paste(rgba, mask=a)
            gray = canvas.convert("L")
            mask_img = gray.point(lambda px: 255 if px < 235 else 0, mode="1")

        bbox = mask_img.getbbox()
        if bbox is None:
            continue
        if union is None:
            union = list(bbox)
        else:
            union[0] = min(union[0], bbox[0])
            union[1] = min(union[1], bbox[1])
            union[2] = max(union[2], bbox[2])
            union[3] = max(union[3], bbox[3])

    return tuple(union) if union else None


def add_padding(box, pad, w, h):
    return (
        max(0,  box[0] - pad),
        max(0,  box[1] - pad),
        min(w,  box[2] + pad),
        min(h,  box[3] + pad),
    )


for src_path, dst_path, is_dark in SRC:
    name = os.path.basename(src_path)
    print(f"\n{'='*60}")
    print(f"Source : {src_path}")
    print(f"Dest   : {dst_path}")
    print(f"Dark bg: {is_dark}")

    if not os.path.exists(src_path):
        print(f"  ERROR: source file not found: {src_path}")
        continue

    gif = Image.open(src_path)
    frames, durations = [], []
    for frame in ImageSequence.Iterator(gif):
        frames.append(frame.copy().convert("RGBA"))
        durations.append(frame.info.get("duration", 80))

    W, H = frames[0].size
    print(f"  Frames: {len(frames)}  Size: {W}×{H}")

    bbox = union_bbox(frames, is_dark)
    print(f"  Raw bbox  : {bbox}")

    if bbox is None:
        print("  WARNING: no content found — copying original unchanged")
        shutil.copy(src_path, dst_path)
        continue

    bbox_padded = add_padding(bbox, pad=8, w=W, h=H)
    print(f"  Crop bbox : {bbox_padded}")

    cropped_rgba  = [f.crop(bbox_padded) for f in frames]
    palette_frames = [f.convert("P", palette=Image.ADAPTIVE, colors=256)
                      for f in cropped_rgba]

    palette_frames[0].save(
        dst_path,
        save_all=True,
        append_images=palette_frames[1:],
        loop=0,
        duration=durations,
        optimize=False,
        disposal=2,
    )

    kb_before = os.path.getsize(src_path) // 1024
    kb_after  = os.path.getsize(dst_path) // 1024
    cw, ch    = palette_frames[0].size
    print(f"  Output    : {cw}×{ch}  {kb_before}kB → {kb_after}kB  ✓")

print("\nAll done!")
