#!/usr/bin/env python3
"""Gera favicon SVG + PNGs do PWA Prova FGV."""
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent

BG = (26, 35, 50, 255)  # #1a2332
ACCENT = (59, 130, 246, 255)  # #3b82f6
SURFACE = (36, 48, 68, 255)  # #243044
OK = (34, 197, 94, 255)  # #22c55e
WHITE = (226, 232, 240, 255)  # #e2e8f0
MUTED = (148, 163, 184, 255)


def rounded_rect(draw: ImageDraw.ImageDraw, xy, r, fill=None, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)


def draw_icon(size: int, *, maskable: bool = False) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pad = int(size * (0.12 if maskable else 0.0))

    if maskable:
        d.rectangle([0, 0, size, size], fill=BG)
    else:
        rounded_rect(d, [0, 0, size - 1, size - 1], int(size * 0.18), fill=BG)

    m = pad + int(size * 0.14)
    body = [m + int(size * 0.08), m + int(size * 0.12), size - m, size - m]
    rounded_rect(d, body, int(size * 0.08), fill=SURFACE)
    d.rounded_rectangle(
        body, radius=int(size * 0.08), outline=ACCENT, width=max(2, size // 48)
    )

    cw = int(size * 0.28)
    ch = int(size * 0.12)
    cx0 = (size - cw) // 2
    cy0 = m + int(size * 0.02)
    rounded_rect(d, [cx0, cy0, cx0 + cw, cy0 + ch], int(size * 0.04), fill=ACCENT)
    iw, ih = int(cw * 0.45), int(ch * 0.35)
    ix0 = (size - iw) // 2
    iy0 = cy0 + (ch - ih) // 2
    rounded_rect(d, [ix0, iy0, ix0 + iw, iy0 + ih], int(size * 0.02), fill=BG)

    lx0 = body[0] + int(size * 0.12)
    lx1 = body[2] - int(size * 0.12)
    for i, yf in enumerate((0.38, 0.52, 0.66)):
        y = int(size * yf)
        r = max(3, size // 28)
        bx = lx0 + r
        if i < 2:
            d.ellipse([bx - r, y - r, bx + r, y + r], fill=OK)
            d.line(
                [
                    (bx - r * 0.45, y),
                    (bx - r * 0.1, y + r * 0.45),
                    (bx + r * 0.5, y - r * 0.4),
                ],
                fill=BG,
                width=max(2, size // 64),
            )
            line_fill = WHITE
        else:
            d.ellipse(
                [bx - r, y - r, bx + r, y + r],
                outline=MUTED,
                width=max(2, size // 64),
            )
            line_fill = MUTED
        h = max(2, size // 80)
        rounded_rect(
            d, [bx + r * 2, y - h, lx1, y + h], 2, fill=line_fill
        )

    badge_s = int(size * 0.18)
    bx1 = body[2] - int(size * 0.06)
    by1 = body[3] - int(size * 0.06)
    bx0 = bx1 - badge_s
    by0 = by1 - badge_s
    rounded_rect(d, [bx0, by0, bx1, by1], int(size * 0.04), fill=ACCENT)
    mid_x = (bx0 + bx1) / 2
    mid_y = (by0 + by1) / 2
    s = badge_s * 0.28
    d.line(
        [
            (mid_x - s, mid_y),
            (mid_x - s * 0.2, mid_y + s * 0.7),
            (mid_x + s, mid_y - s * 0.55),
        ],
        fill=WHITE,
        width=max(2, size // 40),
    )
    return img


SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Prova FGV">
  <rect width="512" height="512" rx="92" fill="#1a2332"/>
  <rect x="110" y="118" width="292" height="320" rx="36" fill="#243044" stroke="#3b82f6" stroke-width="14"/>
  <rect x="184" y="78" width="144" height="60" rx="18" fill="#3b82f6"/>
  <rect x="226" y="96" width="60" height="24" rx="8" fill="#1a2332"/>
  <circle cx="168" cy="210" r="18" fill="#22c55e"/>
  <path d="M158 210 l7 8 14-16" fill="none" stroke="#1a2332" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="200" y="202" width="160" height="16" rx="8" fill="#e2e8f0"/>
  <circle cx="168" cy="278" r="18" fill="#22c55e"/>
  <path d="M158 278 l7 8 14-16" fill="none" stroke="#1a2332" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="200" y="270" width="160" height="16" rx="8" fill="#e2e8f0"/>
  <circle cx="168" cy="346" r="18" fill="none" stroke="#94a3b8" stroke-width="6"/>
  <rect x="200" y="338" width="160" height="16" rx="8" fill="#94a3b8"/>
  <rect x="318" y="352" width="64" height="64" rx="16" fill="#3b82f6"/>
  <path d="M334 384 l12 14 24-28" fill="none" stroke="#e2e8f0" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
"""


def main() -> None:
    (OUT / "icon.svg").write_text(SVG, encoding="utf-8")
    sizes = {
        "favicon-32.png": (32, False),
        "apple-touch-icon.png": (180, False),
        "icon-192.png": (192, False),
        "icon-512.png": (512, False),
        "icon-maskable-512.png": (512, True),
    }
    for name, (sz, mask) in sizes.items():
        draw_icon(sz, maskable=mask).save(OUT / name, "PNG")
        print("wrote", name)
    print("SVG + PNGs ok")


if __name__ == "__main__":
    main()
