#!/usr/bin/env python3
"""Redraw the ConSens coin policy architecture in ACT Fig.4 layout.

Framework  : ACT (Action Chunking Transformer) Fig.4 right panel.
Inputs swap: ACT camera images -> coin.mp4 task-rollout frames.
Palette     : Material pastels from private-kb/public mermaid diagrams.
Evidence    : ConSensPolicy/consens/policies/consens/*.py + configs.
             No CVAE / style-z (compute_loss = L1 only).
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
FRAMES = json.load(open(os.path.join(HERE, "frames", "b64.json")))
PHASES = ["setup", "stand", "confirm", "grasp", "place"]

W, H = 1780, 900
FF = "DejaVu Sans, Helvetica, Arial, sans-serif"

# Material palette (fill, stroke) lifted from private-kb/public/*.html
C = {
    "blue":   ("#e8f4fd", "#2196F3"),
    "orange": ("#fff3e0", "#FF9800"),
    "green":  ("#e8f5e9", "#4CAF50"),
    "purple": ("#f3e5f5", "#9C27B0"),
    "indigo": ("#ede7f6", "#673AB7"),
    "pink":   ("#fce4ec", "#E91E63"),
    "teal":   ("#e0f2f1", "#009688"),
    "grey":   ("#eceff1", "#90a4ae"),
}
INK = "#1a2230"
MUT = "#5b6570"
P = []  # svg fragments


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def rect(x, y, w, h, fill, stroke, rx=10, sw=2.0, dash=None, op=1.0):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    P.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" ry="{rx}" '
             f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d} opacity="{op}"/>')


def text(x, y, s, size=15, fill=INK, weight="400", anchor="middle", style="", ff=FF):
    st = f' font-style="{style}"' if style else ""
    P.append(f'<text x="{x}" y="{y}" font-family="{ff}" font-size="{size}" '
             f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{st}>{esc(s)}</text>')


def mtext(x, y, lines, size=13, fill=INK, weight="400", lh=None, anchor="middle"):
    lh = lh or size + 4
    y0 = y - (len(lines) - 1) * lh / 2
    for i, ln in enumerate(lines):
        text(x, y0 + i * lh + size * 0.35, ln, size, fill, weight, anchor)


def image(x, y, w, h, key, stroke=INK, sw=1.6, rx=6):
    P.append(f'<clipPath id="clip{key}"><rect x="{x}" y="{y}" width="{w}" height="{h}" '
             f'rx="{rx}" ry="{rx}"/></clipPath>')
    P.append(f'<image x="{x}" y="{y}" width="{w}" height="{h}" clip-path="url(#clip{key})" '
             f'preserveAspectRatio="xMidYMid slice" '
             f'xlink:href="data:image/png;base64,{FRAMES[key]}"/>')
    P.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" ry="{rx}" '
             f'fill="none" stroke="{stroke}" stroke-width="{sw}"/>')


def tokens(cx, cy, n, fills, s=17, gap=6, vertical=True, sw=1.4):
    total = n * s + (n - 1) * gap
    for i in range(n):
        off = -total / 2 + i * (s + gap)
        x = cx - s / 2 if vertical else cx + off
        y = cy + off if vertical else cy - s / 2
        f, st = fills[i % len(fills)]
        rect(x, y, s, s, f, st, rx=3, sw=sw)


def arrow(x1, y1, x2, y2, color=INK, sw=2.2, dash=None, head=True):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = ' marker-end="url(#ah)"' if head else ""
    P.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" '
             f'stroke-width="{sw}"{d}{m}/>')


def trapezoid(cx, cy, w_top, w_bot, h, fill, stroke, sw=2.0):
    x1, x2 = cx - w_bot / 2, cx + w_bot / 2      # bottom (wide, at input side = left)
    x3, x4 = cx - w_top / 2, cx + w_top / 2      # top (narrow, output side = right)
    # oriented left(tall)->right(short) like a CNN funnel; use rotated form:
    yt, yb = cy - h / 2, cy + h / 2
    P.append(f'<polygon points="{cx-w_top/2},{yt} {cx+w_top/2},{yt} '
             f'{cx+w_bot/2},{yb} {cx-w_bot/2},{yb}" fill="{fill}" stroke="{stroke}" '
             f'stroke-width="{sw}" stroke-linejoin="round"/>')


def funnel_lr(x, cy, w, h_in, h_out, fill, stroke, sw=2.0):
    """CNN-style funnel: tall left edge (h_in) -> short right edge (h_out)."""
    P.append(f'<polygon points="{x},{cy-h_in/2} {x+w},{cy-h_out/2} '
             f'{x+w},{cy+h_out/2} {x},{cy+h_in/2}" fill="{fill}" stroke="{stroke}" '
             f'stroke-width="{sw}" stroke-linejoin="round"/>')


# ---------------- scene ----------------
P.append(f'<svg xmlns="http://www.w3.org/2000/svg" '
         f'xmlns:xlink="http://www.w3.org/1999/xlink" width="{W}" height="{H}" '
         f'viewBox="0 0 {W} {H}" font-family="{FF}">')
P.append('<defs><marker id="ah" viewBox="0 0 10 10" refX="8.5" refY="5" '
         'markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
         f'<path d="M0,0 L10,5 L0,10 z" fill="{INK}"/></marker></defs>')
rect(0, 0, W, H, "#ffffff", "#ffffff", rx=0, sw=0)

# header
text(W / 2, 42, "ConSens Coin Policy — ACT-style Transformer Encoder / Decoder",
     size=25, weight="700")
text(W / 2, 70,
     "xArm6 + LEAP Hand  ·  frozen RADIO v2.5-b summaries  ·  5 views (4 RGB + 1 D435)"
     "  ·  8-D qpos  ·  horizon 16 / chunk 6  ·  11-D action",
     size=14.5, fill=MUT)

# ---- left: coin.mp4 task-rollout filmstrip ----
fw, fh, fgap = 176, 104, 12
band_cy = 474
n = len(PHASES)
tot = n * fh + (n - 1) * fgap
fy0 = band_cy - tot / 2
fx = 46
mtext(fx + fw / 2, fy0 - 24, ["coin.mp4 rollout", "(task phases over time)"],
      size=13, weight="700", fill="#37474f", lh=16)
for i, ph in enumerate(PHASES):
    yy = fy0 + i * (fh + fgap)
    image(fx, yy, fw, fh, ph)
    P.append(f'<circle cx="{fx+15}" cy="{yy+15}" r="11" fill="#000000" opacity="0.55"/>')
    text(fx + 15, yy + 20, str(i + 1), size=13, fill="#ffffff", weight="700")
    text(fx + fw - 8, yy + fh - 9, ph, size=12, fill="#ffffff", weight="600", anchor="end")

# obs arrow into RADIO
arrow(fx + fw + 4, band_cy, 268, band_cy)

# ---- frozen RADIO v2.5-b ViT funnel ----
funnel_lr(270, band_cy, 96, 470, 150, *C["orange"], sw=2.2)
mtext(318, band_cy - 6, ["frozen", "RADIO", "v2.5-b", "ViT"], size=13.5,
      weight="700", fill="#e65100")
rect(270, band_cy + 92, 96, 26, "#ffffff", "#e65100", rx=6, sw=1.4)
text(318, band_cy + 109, "no_grad", size=11.5, fill="#e65100", weight="700")
text(318, band_cy - 246, "2304-D summary / view", size=11.5, fill=MUT)

# ---- per-view MLP + nv embedding ----
arrow(366, band_cy, 392, band_cy)
rect(394, band_cy - 62, 96, 124, *C["indigo"], rx=10, sw=2.0)
mtext(442, band_cy, ["per-view", "MLP", "2304→1024", "→512", "+ nv-embed"],
      size=11.5, weight="600", fill="#4527a0")

# ---- 5 view tokens ----
arrow(490, band_cy, 528, band_cy)
tok_fills = [C["blue"], C["green"], C["orange"], C["pink"], C["teal"]]
tokens(548, band_cy, 5, tok_fills, s=20, gap=7)
mtext(548, band_cy + 92, ["5 view", "tokens", "[5, 512]"], size=11.5, fill=MUT)

# ---- Transformer Encoder ----
arrow(572, band_cy, 606, band_cy)
ENC = (606, band_cy - 88, 232, 176)
rect(*ENC, *C["green"], rx=12, sw=2.4)
mtext(606 + 116, band_cy, ["Transformer", "Encoder", "", "4 layers · 16 heads",
      "d = 512 · FFN 2048", "self-attn over", "5 view tokens"],
      size=13, weight="700", fill="#2e7d32", lh=19)

# ---- Transformer Decoder ----
arrow(838, band_cy, 918, band_cy)
text(878, band_cy - 12, "memory", size=11, fill=MUT)
DEC = (918, band_cy - 88, 246, 176)
rect(*DEC, *C["orange"], rx=12, sw=2.4)
mtext(918 + 123, band_cy - 8, ["Transformer", "Decoder", "", "4 layers · cross-attn",
      "16 action queries"], size=13, weight="700", fill="#e65100", lh=19)

# ---- feeds into decoder from below: qpos state + fixed query pos-emb ----
dec_bot = band_cy + 88
rect(922, 636, 112, 92, *C["blue"], rx=10, sw=2.0)
mtext(978, 682, ["qpos 8-D", "state MLP", "→ 512", "added to", "queries"],
      size=11.5, weight="600", fill="#1565c0")
arrow(978, 636, 978, dec_bot + 2)
rect(1050, 636, 112, 92, *C["pink"], rx=10, sw=2.0)
mtext(1106, 682, ["fixed query", "pos-emb", "Embedding(16)", "horizon", "queries"],
      size=11.5, weight="600", fill="#ad1457")
arrow(1106, 636, 1106, dec_bot + 2)

# ---- action head ----
arrow(1164, band_cy, 1198, band_cy)
rect(1200, band_cy - 52, 150, 104, *C["teal"], rx=11, sw=2.2)
mtext(1275, band_cy, ["Action Head", "", "Linear", "512→256→11"],
      size=12.5, weight="700", fill="#00695c", lh=18)

# ---- action sequence output (horizon 16, execute first 6) ----
arrow(1350, band_cy, 1388, band_cy)
seq_x, seq_gap, bw = 1396, 7, 15
seq_h = 116
acc = ["#1565c0", "#2e7d32", "#e65100", "#ad1457", "#00695c", "#4527a0"]
for i in range(16):
    x = seq_x + i * (bw + seq_gap)
    if i < 6:
        rect(x, band_cy - seq_h / 2, bw, seq_h, "#ffffff", acc[i % len(acc)], rx=3, sw=2.4)
    else:
        rect(x, band_cy - seq_h / 2 + 14, bw, seq_h - 28, "#f5f5f5", "#b0bec5", rx=3, sw=1.4)
seq_w = 16 * bw + 15 * seq_gap
text(seq_x + seq_w / 2, band_cy - seq_h / 2 - 24, "predicted action sequence  [16, 11]",
     size=12.5, weight="700")
b6 = seq_x + 6 * (bw + seq_gap) - seq_gap
P.append(f'<path d="M{seq_x},{band_cy+seq_h/2+10} L{seq_x},{band_cy+seq_h/2+18} '
         f'L{b6},{band_cy+seq_h/2+18} L{b6},{band_cy+seq_h/2+10}" fill="none" '
         f'stroke="#e65100" stroke-width="2"/>')
mtext((seq_x + b6) / 2, band_cy + seq_h / 2 + 42,
      ["execute first 6", "(chunk) · then replan"], size=11.5, weight="700", fill="#e65100")
text(seq_x + 11 * (bw + seq_gap), band_cy + seq_h / 2 + 34, "10 discarded",
     size=11, fill=MUT)

# ---- legend ----
ly = 806
rect(46, ly - 26, 1690, 70, "#fafafa", "#e0e0e0", rx=10, sw=1.4)
lx = 66
rect(lx, ly - 12, 24, 24, *C["orange"], rx=4, sw=1.8)
text(lx + 34, ly + 5, "frozen (RADIO ViT, no_grad)", size=12.5, anchor="start", fill=MUT)
lx = 356
rect(lx, ly - 12, 24, 24, *C["green"], rx=4, sw=1.8)
text(lx + 34, ly + 5, "trained (encoder / decoder / MLPs / head)", size=12.5,
     anchor="start", fill=MUT)
lx = 726
arrow(lx, ly, lx + 34, ly)
text(lx + 44, ly + 5, "forward pass", size=12.5, anchor="start", fill=MUT)
lx = 916
text(lx, ly + 5,
     "Layout borrows ACT Fig.4 grammar; ConSens drops ACT's CVAE / style-z — "
     "objective is L1 action loss only (compute_loss).",
     size=12, anchor="start", fill="#b0392e", style="italic")

P.append("</svg>")
svg = "\n".join(P)
out_svg = os.path.join(HERE, "coin_architecture.svg")
open(out_svg, "w").write(svg)
print("wrote", out_svg, len(svg), "bytes")

