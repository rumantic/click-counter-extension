from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageOps


HERE = Path(__file__).resolve().parent

# Expected source file name. Put your Sora image here.
SOURCE_CANDIDATES = [
    HERE / "mouse-icon.png",
    HERE / "icon-source.png",
    HERE / "icon-source.jpg",
    HERE / "icon-source.jpeg",
    HERE / "icon-source.webp",
]

OUTPUTS = {
    16: HERE / "icon16.png",
    48: HERE / "icon48.png",
    128: HERE / "icon128.png",
}


def _find_source() -> Path:
    for p in SOURCE_CANDIDATES:
        if p.exists():
            return p
    raise FileNotFoundError(
        "Source icon not found. Place the provided image as one of: "
        + ", ".join(str(p.name) for p in SOURCE_CANDIDATES)
    )


def _make_square(img: Image.Image) -> Image.Image:
    # Ensure we keep the art centered and don't distort aspect ratio.
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA")

    w, h = img.size
    size = max(w, h)

    # Use edge color (top-left) as padding background to blend.
    bg = img.getpixel((0, 0))
    if isinstance(bg, int):
        bg = (bg, bg, bg, 255)
    elif len(bg) == 3:
        bg = (*bg, 255)

    square = Image.new("RGBA", (size, size), bg)
    square.paste(img, ((size - w) // 2, (size - h) // 2), img if img.mode == "RGBA" else None)
    return square


def _resize_for(size: int, src_square: Image.Image) -> Image.Image:
    # Downscale with high-quality resampling.
    resized = src_square.resize((size, size), Image.Resampling.LANCZOS)

    # A tiny boost for small sizes to keep it crisp.
    # Skip autocontrast for RGBA to avoid OSError
    if size <= 48 and resized.mode == "RGB":
        resized = ImageOps.autocontrast(resized)

    return resized


def main() -> None:
    src_path = _find_source()
    img = Image.open(src_path)

    # Preserve transparency if present.
    if img.mode not in ("RGBA", "RGB"):
        img = img.convert("RGBA")

    square = _make_square(img)

    for s, out in OUTPUTS.items():
        rendered = _resize_for(s, square)
        rendered.save(out, format="PNG", optimize=True)
        print(f"✓ wrote {out.name} ({s}x{s})")


if __name__ == "__main__":
    main()
