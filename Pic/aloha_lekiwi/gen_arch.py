#!/usr/bin/env python3
"""Draw DreamZero-LeKiwi joint video-action VLA architecture.

Framework  : DreamZero (GEAR) Fig. — "Joint Video-Action Flow Matching" (train)
             + "Closed-Loop Real-World Execution" (inference). Two-panel grammar.
Inputs swap: DreamZero's generic manipulation clips -> our ALOHA/LeKiwi
             eval-viz rollout frames (cond t=0 input / Wan-generated pred).
Palette     : sampled from arch_style/dreamzero_model.pdf
             (sage DiT #7bae9d, pale-green VAE, cream action enc/dec, grey text).
Evidence    : DREAMZERO_ALOHA_LEKIWI_REPRO_AND_INTERVIEW.md (checkpoints Wan2.1-I2V
             -14B-480P / umt5-xxl / DreamZero-AgiBot; num_frames 33, action_horizon
             24, num_views 3, lr 1e-5, LoRA save_lora_only) + rollout eval-viz
             (dims 7..13 = right_j0..right_gripper => 14-D bimanual; action step k/23).
"""
import json, os, math

HERE = os.path.dirname(os.path.abspath(__file__))
FR = json.load(open(os.path.join(HERE, "frames", "b64.json")))

W, H = 2600, 1180
FF = "Inter, Helvetica, Arial, sans-serif"

# palette sampled from dreamzero_model.pdf
SAGE   = ("#7bae9d", "#4f7d6d")   # DiT core fill / stroke
SAGE_D = "#5f8c7c"                # inner bar
SAGE_L = "#cfe3dc"               # inner light tile
VAE    = ("#d3e3db", "#7bae9d")   # pale-green VAE enc/dec
CREAM  = ("#efe6d3", "#c9ad74")   # action enc/dec (beige)
GREY   = ("#ededed", "#b3bcbe")   # state/text encoder
PANEL  = ("#fbfcfb", "#e4eae7")   # panel background
NOISE  = ("#eceef0", "#9aa0a6")
INK    = "#1d2b30"
MUT    = "#5f7178"
ACC    = "#5f8c7c"                # arrows / annotations
FEED   = "#2f9e6f"               # feedback loop green
CURVE  = ["#2D9CDB", "#28B7A9", "#F59E0B", "#E0564B", "#7B61FF", "#4CAF50", "#E91E63"]
P = []


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def rect(x, y, w, h, fill, stroke, rx=12, sw=2.0, dash=None, op=1.0, sh=False):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    f = ' filter="url(#sh)"' if sh else ""
    P.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" ry="{rx}" '
             f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d} opacity="{op}"{f}/>')


def text(x, y, s, size=15, fill=INK, weight="400", anchor="middle", style="", ff=FF):
    st = f' font-style="{style}"' if style else ""
    P.append(f'<text x="{x}" y="{y}" font-family="{ff}" font-size="{size}" '
             f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{st}>{esc(s)}</text>')


def mtext(x, y, lines, size=13, fill=INK, weight="400", lh=None, anchor="middle"):
    lh = lh or size + 4
    y0 = y - (len(lines) - 1) * lh / 2
    for i, ln in enumerate(lines):
        text(x, y0 + i * lh + size * 0.34, ln, size, fill, weight, anchor)


def img(x, y, w, h, key, stroke="#ffffff", sw=2.2, rx=7):
    P.append(f'<clipPath id="c{key}"><rect x="{x}" y="{y}" width="{w}" height="{h}" '
             f'rx="{rx}" ry="{rx}"/></clipPath>')
    P.append(f'<image x="{x}" y="{y}" width="{w}" height="{h}" clip-path="url(#c{key})" '
             f'preserveAspectRatio="xMidYMid slice" '
             f'xlink:href="data:image/png;base64,{FR[key]}"/>')
    P.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" ry="{rx}" '
             f'fill="none" stroke="{stroke}" stroke-width="{sw}"/>')


def framestack(cx, cy, keys, tw=150, th=94, dx=17, dy=15):
    """Overlapping video frame stack (back->front)."""
    n = len(keys)
    x0 = cx - (tw + (n - 1) * dx) / 2
    y0 = cy - (th + (n - 1) * dy) / 2
    for i, k in enumerate(keys):
        img(x0 + i * dx, y0 + (n - 1 - i) * dy, tw, th, k)


def arrow(x1, y1, x2, y2, color=ACC, sw=2.4, dash=None, head=True):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = ' marker-end="url(#ah)"' if head else ""
    P.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" '
             f'stroke-width="{sw}"{d}{m} stroke-linecap="round"/>')


def path(d, color=ACC, sw=2.4, dash=None, head=True, fill="none"):
    dd = f' stroke-dasharray="{dash}"' if dash else ""
    m = ' marker-end="url(#ah)"' if head else ""
    P.append(f'<path d="{d}" fill="{fill}" stroke="{color}" stroke-width="{sw}"{dd}{m} '
             f'stroke-linecap="round" stroke-linejoin="round"/>')


def enc(cx, cy, w, h_in, h_out, fill, stroke, sw=2.2):
    """Trapezoid encoder: tall left (h_in) -> short right (h_out)."""
    x0, x1 = cx - w / 2, cx + w / 2
    P.append(f'<polygon points="{x0},{cy-h_in/2} {x1},{cy-h_out/2} {x1},{cy+h_out/2} '
             f'{x0},{cy+h_in/2}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" '
             f'stroke-linejoin="round"/>')


def dec(cx, cy, w, h_in, h_out, fill, stroke, sw=2.2):
    """Trapezoid decoder: short left (h_in) -> tall right (h_out)."""
    x0, x1 = cx - w / 2, cx + w / 2
    P.append(f'<polygon points="{x0},{cy-h_in/2} {x1},{cy-h_out/2} {x1},{cy+h_out/2} '
             f'{x0},{cy+h_in/2}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" '
             f'stroke-linejoin="round"/>')


def latent_tiles(cx, cy, n=3, s=30, gap=7, film=True):
    tot = n * s + (n - 1) * gap
    for i in range(n):
        y = cy - tot / 2 + i * (s + gap)
        rect(cx - s / 2, y, s, s, SAGE_L, SAGE[1], rx=5, sw=1.6)
        if film:
            for sx in (cx - s / 2 + 4, cx + s / 2 - 6):
                P.append(f'<rect x="{sx}" y="{y+3}" width="2.2" height="{s-6}" '
                         f'fill="{SAGE[1]}" opacity="0.55"/>')


def noise_tile(cx, cy, s=30):
    rect(cx - s / 2, cy - s / 2, s, s, NOISE[0], NOISE[1], rx=5, sw=1.6)
    for k in range(9):
        px = cx - s / 2 + 5 + (k % 3) * 8
        py = cy - s / 2 + 5 + (k // 3) * 8
        P.append(f'<circle cx="{px}" cy="{py}" r="1.6" fill="{NOISE[1]}"/>')


def plus(cx, cy, r=11):
    P.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#ffffff" stroke="{MUT}" stroke-width="1.8"/>')
    P.append(f'<line x1="{cx-5}" y1="{cy}" x2="{cx+5}" y2="{cy}" stroke="{MUT}" stroke-width="1.8"/>')
    P.append(f'<line x1="{cx}" y1="{cy-5}" x2="{cx}" y2="{cy+5}" stroke="{MUT}" stroke-width="1.8"/>')


def action_curve(x, y, w, h, ncur=7, steps=64, seed=0.0, marks=None):
    rect(x, y, w, h, "#ffffff", "#d7dedd", rx=8, sw=1.5)
    for c in range(ncur):
        ph = seed + c * 0.9
        amp = 0.30 + 0.12 * ((c % 3))
        pts = []
        for i in range(steps + 1):
            t = i / steps
            v = math.sin(t * (2.0 + 0.5 * c) * math.pi + ph) * amp
            v += 0.10 * math.sin(t * 6.28 * (1 + c * 0.3) + ph)
            px = x + 8 + t * (w - 16)
            py = y + h / 2 - v * (h / 2 - 8)
            pts.append(f"{px:.1f},{py:.1f}")
        P.append(f'<polyline points="{" ".join(pts)}" fill="none" '
                 f'stroke="{CURVE[c % len(CURVE)]}" stroke-width="2" opacity="0.9"/>')
    if marks:  # vertical execute-window marker
        mx = x + 8 + marks * (w - 16)
        P.append(f'<line x1="{mx}" y1="{y+4}" x2="{mx}" y2="{y+h-4}" stroke="{CREAM[1]}" '
                 f'stroke-width="2" stroke-dasharray="4 3"/>')


def dit_core(x, y, w, h, title_y, kv=False):
    rect(x, y, w, h, SAGE[0], SAGE[1], rx=18, sw=2.6, sh=True)
    text(x + w / 2, title_y, "Joint Video-Action DiT", size=18, weight="700", fill=INK)
    text(x + w / 2, y + 34, "Causal DiT Blocks", size=15, weight="700", fill="#ffffff")
    # vertical transformer bars
    nb = 4
    bw = 26
    inner_x = x + 26
    span = w - 52
    for i in range(nb):
        bx = inner_x + i * (span - bw) / (nb - 1)
        rect(bx, y + 52, bw, h - 150, SAGE_D, "#3f6a5b", rx=8, sw=1.6, op=0.92)
    # attention token grid
    gx = x + w / 2 - 33
    gy = y + h - 90
    for r in range(3):
        for c in range(3):
            on = (r + c) % 2 == 0
            rect(gx + c * 23, gy + r * 23, 18, 18,
                 "#ffffff" if on else SAGE_L, "#3f6a5b", rx=3, sw=1.3,
                 op=0.95 if on else 0.8)
    if kv:
        rect(x + w / 2 - 66, y + h - 34, 132, 26, "#ffffff", "#3f6a5b", rx=8, sw=1.6)
        text(x + w / 2, y + h - 16, "KV Cache", size=12.5, weight="700", fill="#3f6a5b")


# ---------------- scene ----------------
P.append(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
         f'width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="{FF}">')
P.append('<defs>'
         '<marker id="ah" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" '
         'markerHeight="7" orient="auto-start-reverse">'
         f'<path d="M0,0 L10,5 L0,10 z" fill="{ACC}"/></marker>'
         '<marker id="ahf" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" '
         'markerHeight="7" orient="auto-start-reverse">'
         f'<path d="M0,0 L10,5 L0,10 z" fill="{FEED}"/></marker>'
         '<filter id="sh" x="-20%" y="-20%" width="140%" height="140%">'
         '<feDropShadow dx="0" dy="8" stdDeviation="11" flood-color="#1d3340" flood-opacity="0.13"/>'
         '</filter></defs>')
rect(0, 0, W, H, "#ffffff", "#ffffff", rx=0, sw=0)

# title
text(W / 2, 40, "DreamZero-LeKiwi · Joint Video-Action VLA — DreamZero / Wan2.1 Causal DiT, LoRA on ALOHA/LeKiwi",
     size=24, weight="700")

# panels
rect(34, 108, 1226, 1000, PANEL[0], PANEL[1], rx=18, sw=1.6)
rect(1340, 108, 1226, 1000, PANEL[0], PANEL[1], rx=18, sw=1.6)
P.append(f'<line x1="1300" y1="120" x2="1300" y2="1096" stroke="{PANEL[1]}" '
         f'stroke-width="2" stroke-dasharray="9 8"/>')
text(647, 92, "Training · Joint Video-Action Flow Matching", size=19, weight="700", fill="#2e5a4c")
text(1953, 92, "Inference · Closed-Loop Real-World Execution", size=19, weight="700", fill="#2e5a4c")

# ============ LEFT (training) ============
CY_V, CY_A, CY_S = 300, 590, 900
core_x, core_y, core_w, core_h = 690, 400, 280, 380
core_cy = core_y + core_h / 2

# --- video input ---
framestack(150, CY_V, ["past3", "past2", "past1"])
mtext(150, CY_V + 78, ["multi-view video", "3 cams · num_frames 33"], size=12.5,
      weight="600", fill="#37474f", lh=15)
arrow(228, CY_V, 274, CY_V)
enc(320, CY_V, 78, 150, 92, *VAE)
text(320, CY_V - 92, "Wan2.1 VAE", size=12, weight="700", fill="#2e7d68")
text(320, CY_V + 92, "Enc", size=12, weight="700", fill="#2e7d68")
arrow(360, CY_V, 402, CY_V)
latent_tiles(430, CY_V)
plus(430, CY_V + 78)
noise_tile(430, CY_V + 108)
text(430, CY_V + 134, "noise", size=11, fill=MUT)

# --- action input ---
action_curve(66, CY_A - 55, 168, 110, seed=0.4)
mtext(150, CY_A + 74, ["action  14-D bimanual", "(j0–j5 + gripper) × 2 arms"], size=12,
      weight="600", fill="#8a6d1f", lh=15)
arrow(238, CY_A, 274, CY_A)
enc(320, CY_A, 78, 120, 74, *CREAM)
mtext(320, CY_A, ["Action", "Enc"], size=12, weight="700", fill="#8a6d1f", lh=14)
arrow(360, CY_A, 402, CY_A)
rect(415, CY_A - 15, 30, 30, CREAM[0], CREAM[1], rx=5, sw=1.6)
plus(430, CY_A + 45)
noise_tile(430, CY_A + 75)

# --- state / text input ---
rect(60, CY_S - 34, 180, 52, "#ffffff", "#c8d0d2", rx=9, sw=1.5)
mtext(150, CY_S - 8, ["proprioception", "joint + gripper state"], size=11.5, weight="600",
      fill=MUT, lh=14)
rect(60, CY_S + 30, 180, 40, "#f4f6f7", "#c8d0d2", rx=9, sw=1.5)
text(150, CY_S + 54, "“pick up cube, place in bin”", size=11, style="italic", fill="#556")
arrow(244, CY_S - 8, 280, CY_S - 8)
rect(300, CY_S - 40, 130, 64, *GREY, rx=10, sw=2.0)
mtext(365, CY_S - 8, ["umt5-xxl", "+ state MLP"], size=12, weight="700", fill="#556", lh=15)

# --- into core ---
arrow(458, CY_V, core_x - 4, CY_V + 40)
arrow(458, CY_A, core_x - 4, CY_A - 20)
path(f"M430 {CY_S+75} L430 {CY_S+100} L{core_x+core_w/2} {CY_S+100} "
     f"L{core_x+core_w/2} {core_y+core_h+3}")

# --- core ---
dit_core(core_x, core_y, core_w, core_h, core_y - 16)

# --- outputs / flow matching target ---
arrow(core_x + core_w, CY_V + 30, core_x + core_w + 42, CY_V + 30)
latent_tiles(core_x + core_w + 72, CY_V + 30)
arrow(core_x + core_w, core_cy + 60, core_x + core_w + 42, core_cy + 60)
rect(core_x + core_w + 57, core_cy + 45, 30, 30, CREAM[0], CREAM[1], rx=5, sw=1.6)
bx = core_x + core_w + 96
P.append(f'<path d="M{bx} {CY_V-8} C{bx+26} {CY_V-8} {bx+26} {core_cy+60} {bx} {core_cy+60}" '
         f'fill="none" stroke="{CREAM[1]}" stroke-width="2.4"/>')
mtext(bx + 96, (CY_V + core_cy + 60) / 2, ["Joint flow", "matching", "(teacher", "forcing)"],
      size=13, weight="700", fill="#8a6d1f", lh=17)
rect(690, 812, 452, 40, "#eef5f1", "#b9d5c8", rx=9, sw=1.5)
text(916, 837, "trainable: LoRA adapters   ·   base DreamZero-AgiBot DiT/VAE/umt5 frozen",
     size=12.5, weight="600", fill="#2e5a4c")

# ============ RIGHT (inference) ============
RcoreX, RcoreY, RcoreW, RcoreH = 1966, 400, 280, 380
Rcore_cy = RcoreY + RcoreH / 2
RCY_V, RCY_S = 320, 900

# past frames + feedback loop origin later
framestack(1430, RCY_V, ["past1", "past2", "past3"])
mtext(1430, RCY_V + 78, ["past frames", "(real observation)"], size=12.5, weight="600",
      fill="#37474f", lh=15)
arrow(1508, RCY_V, 1554, RCY_V)
enc(1600, RCY_V, 78, 150, 92, *VAE)
text(1600, RCY_V - 92, "Wan2.1 VAE", size=12, weight="700", fill="#2e7d68")
text(1600, RCY_V + 92, "Enc", size=12, weight="700", fill="#2e7d68")
arrow(1640, RCY_V, 1682, RCY_V)
latent_tiles(1710, RCY_V)
arrow(1738, RCY_V, RcoreX - 4, RCY_V + 40)

# state/text
rect(1360, RCY_S - 34, 180, 52, "#ffffff", "#c8d0d2", rx=9, sw=1.5)
mtext(1450, RCY_S - 8, ["proprioception", "joint + gripper state"], size=11.5, weight="600",
      fill=MUT, lh=14)
rect(1360, RCY_S + 30, 180, 40, "#f4f6f7", "#c8d0d2", rx=9, sw=1.5)
text(1450, RCY_S + 54, "“pick up cube, place in bin”", size=11, style="italic", fill="#556")
arrow(1544, RCY_S - 8, 1580, RCY_S - 8)
rect(1600, RCY_S - 40, 130, 64, *GREY, rx=10, sw=2.0)
mtext(1665, RCY_S - 8, ["umt5-xxl", "+ state MLP"], size=12, weight="700", fill="#556", lh=15)
path(f"M1730 {RCY_S+75} L1730 {RCY_S+100} L{RcoreX+RcoreW/2} {RCY_S+100} "
     f"L{RcoreX+RcoreW/2} {RcoreY+RcoreH+3}")

# core with KV cache
dit_core(RcoreX, RcoreY, RcoreW, RcoreH, RcoreY - 16, kv=True)
text(RcoreX + RcoreW / 2, RcoreY + RcoreH + 40, "autoregressive flow sampling",
     size=12.5, style="italic", weight="600", fill=ACC)

# --- decoders / outputs ---
arrow(RcoreX + RcoreW, RCY_V + 30, RcoreX + RcoreW + 40, RCY_V + 30)
dec(RcoreX + RcoreW + 84, RCY_V + 30, 74, 92, 150, *VAE)
text(RcoreX + RcoreW + 84, RCY_V - 60, "VAE Dec", size=12, weight="700", fill="#2e7d68")
arrow(RcoreX + RcoreW + 122, RCY_V + 30, RcoreX + RcoreW + 156, RCY_V + 30)
framestack(RcoreX + RcoreW + 236, RCY_V + 30, ["fut2", "fut1"], tw=132, th=84, dx=15, dy=13)
mtext(RcoreX + RcoreW + 236, RCY_V + 100, ["future frames", "(Wan-generated)"], size=12,
      weight="600", fill="#37474f", lh=15)

arrow(RcoreX + RcoreW, Rcore_cy + 70, RcoreX + RcoreW + 40, Rcore_cy + 70)
dec(RcoreX + RcoreW + 84, Rcore_cy + 70, 74, 74, 118, *CREAM)
mtext(RcoreX + RcoreW + 84, Rcore_cy + 154, ["Action", "Dec"], size=12, weight="700",
      fill="#8a6d1f", lh=14)
arrow(RcoreX + RcoreW + 122, Rcore_cy + 70, RcoreX + RcoreW + 156, Rcore_cy + 70)
action_curve(RcoreX + RcoreW + 168, Rcore_cy + 15, 190, 110, seed=1.1, marks=0.22)
mtext(RcoreX + RcoreW + 263, Rcore_cy + 148, ["future action chunk  [24 × 14]",
      "execute first 3–5 · replan"], size=12, weight="700", fill="#8a6d1f", lh=15)

# --- closed loop: real robot + feedback ---
rob_cx, rob_cy = 2000, 1000
img(rob_cx - 88, rob_cy - 44, 176, 92, "wrist", stroke="#c8d0d2", sw=2.0, rx=9)
text(rob_cx, rob_cy + 66, "async real-world execution · ALOHA / LeKiwi", size=12,
     weight="600", fill="#37474f")
# action chunk -> robot
path(f"M{RcoreX+RcoreW+263} {Rcore_cy+128} C{RcoreX+RcoreW+263} {rob_cy-30} "
     f"{rob_cx+120} {rob_cy-30} {rob_cx+90} {rob_cy}")
# feedback: robot -> past frames
path(f"M{rob_cx-88} {rob_cy} C1360 {rob_cy+30} 1360 {rob_cy+30} 1430 {RCY_V+66}",
     color=FEED, sw=2.6, dash="9 7")
P[-1] = P[-1].replace('marker-end="url(#ah)"', 'marker-end="url(#ahf)"')
text(1690, rob_cy + 40, "update with real observation", size=12.5, weight="700", fill=FEED)

# ============ legend ============
ly = 1140
rect(34, ly - 22, 2532, 30, "#fafafa", "#e0e0e0", rx=8, sw=0)  # spacer only (hidden)
lx = 60
rect(lx, ly - 14, 22, 22, *CREAM, rx=4, sw=1.6)
rect(lx + 150, ly - 14, 22, 22, *VAE, rx=4, sw=1.6)
text(lx + 28, ly + 3, "trained (LoRA)", size=12.5, anchor="start", fill=MUT)
lx = 340
rect(lx, ly - 14, 22, 22, SAGE[0], SAGE[1], rx=4, sw=1.6)
text(lx + 28, ly + 3, "frozen base (Causal DiT / VAE / umt5)", size=12.5, anchor="start", fill=MUT)
lx = 720
arrow(lx, ly - 3, lx + 32, ly - 3)
text(lx + 40, ly + 3, "forward", size=12.5, anchor="start", fill=MUT)
lx = 850
arrow(lx, ly - 3, lx + 32, ly - 3, color=FEED, dash="7 6")
P[-1] = P[-1].replace('marker-end="url(#ah)"', 'marker-end="url(#ahf)"')
text(lx + 40, ly + 3, "closed-loop feedback", size=12.5, anchor="start", fill=MUT)
lx = 1090
text(lx, ly + 3,
     "Layout follows DreamZero (GEAR) joint video-action figure; ALOHA/LeKiwi is the target "
     "embodiment via LoRA from DreamZero-AgiBot. Frames are eval-viz rollouts (cond / Wan-pred) — "
     "trainable signal is LeRobot state-action, not mp4.",
     size=12, anchor="start", fill="#b0392e", style="italic")

P.append("</svg>")
svg = "\n".join(P)
out = os.path.join(HERE, "dreamzero_lekiwi_arch.svg")
open(out, "w").write(svg)
print("wrote", out, len(svg), "bytes")
