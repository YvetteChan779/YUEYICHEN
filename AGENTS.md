# AGENTS.md — YUEYICHEN Personal Homepage Project

This file is the single-source agent instruction set for ALL AI agents (Codex, Claude Code, etc.) operating in this directory. It consolidates all memory, rules, and working contracts into one document.

---

## 0. Owner

Yueyi Chen (陈悦怡), M.Sc. @ CUHK, Embodied AI / Robot Learning.
- Deep understanding of robotics systems, VLA architectures, control theory
- Expects AI to engage at **peer level** (robotics PhD / senior engineer), not explain basics
- Values: precision > verbosity, evidence > claims, architecture > buzzwords

---

## 1. Hard Rules (Non-Negotiable)

### Rule 1: Read Before Write
- Before ANY project-related output: read the actual source code, configs, KB, and project docs.
- Never produce content from general knowledge alone.
- `personnel page technical content KB.md` is the curated technical-rigor and writing-contract layer — read it in full and match its depth.
- `private-kb/public/` is the authorized full-text model reference layer — read the relevant HTML documents before model-specific claims.

### Rule 2: Deep Mining, Not Surface Description
- **BANNED phrases**: "built an advanced system", "improved robustness", "used multimodal AI", "leveraged state-of-the-art", "designed a comprehensive pipeline"
- **REQUIRED**: specific architecture names, layer counts, dimensions, frequencies, interface contracts, failure modes, and fixes
- **Test**: "Could someone who never read the code write this?" → If yes, rewrite with specifics.

### Rule 3: Technical Depth Standard
- Know the difference between: flow matching vs diffusion, action chunking vs receding horizon, LoRA vs full fine-tune, qpos vs joint velocity, policy rate vs control rate
- For each project, understand: what model, what data, what was frozen/trained, what was measured, what broke, what was fixed

### Rule 4: Resume & Homepage Content
- Professional terminology, slight overclaiming OK (see Section 6 for rules)
- Every bullet must invite a follow-up question the user can confidently answer
- Structure: `[Strong verb] + [specific what] + [technical how] + [quantified scope]`
- Reference style: how researchers at Physical Intelligence / NVIDIA / DeepMind describe their work

### Rule 5: KB Usage Protocol
- `private-kb/`: authorized local full-text Robotics Knowledge Base mirror. `private-kb/public/` contains 20 HTML pages: overview plus 19 VLA, WBC, motion-generation, and 3D-VLM documents with complete diagrams, formulas, tables, hyperparameters, and source-file notes.
- `personnel page technical content KB.md`: curated cross-model map, writing grammar, technical-rigor standard, project-specific guidance, terminology, and publishing checklist. Its auto-managed catalog points to every local full-text page.
- `Project Mining Protocol.md`: current project mining protocol for reading a new repository, building evidence, reviewer critique, homepage translation, resume conversion, and long-term `PROJECT.md` memory.
- Usage order: read the curated Markdown in full, then open the matching `private-kb/public/*.html` pages for every model named in a claim or comparison.
- The catalog is not a substitute for the full HTML reference.

### Rule 6: Reference File Sync Protocol
- If any file referenced by `AGENTS.md` is renamed, replaced, deleted, or materially rewritten, update `AGENTS.md` in the same task.
- Keep reference filenames, inventories, phase counts, and usage descriptions aligned with the latest files.
- This includes `Project Mining Protocol.md`, `personnel page technical content KB.md`, `private-kb/`, `arch_style/`, `/home/CNS2026391745/Documents/YUEYICHEN/excellent cv`, project source paths, figure inventories, and external source-doc pointers.

---

## 2. Pre-Output Self-Check (Mandatory)

Before ANY project-related output, pass this checklist. If any item fails → stop and read before writing.

- [ ] Have I read the actual project source code in this session? (not from prior knowledge)
- [ ] Have I read `personnel page technical content KB.md` in full?
- [ ] Have I read the relevant full-text pages under `private-kb/public/` for every referenced model family?
- [ ] Can I name the specific model/framework/benchmark used?
- [ ] Does every claim trace to a file path or measured result?
- [ ] Would this sentence fail the "no-code-reader test"? (If someone who never read the code could write it → rewrite)
- [ ] Are architecture details stated with dimensions, frequencies, layer counts?
- [ ] Have I checked `arch_style/` for visual style precedent?

---

## 3. Project Inventory

### Homepage Repo Structure

| File | Role |
|------|------|
| `index.html` | Main homepage (profile sidebar, bio, news, selected projects) |
| `styles.css` | Shared CSS with CSS variables, light/dark theme, responsive breakpoints |
| `script.js` | Main page JS (theme toggle, nav highlight, i18n for index.html) |
| `private-kb/` | Authorized local full-text Robotics Knowledge Base mirror; deployable static site under `private-kb/public/` |
| `personnel page technical content KB.md` | Curated KB synthesis and auto-generated local reference catalog |
| `PROJECT.md` | PLAN-B Speech-to-Grasp mining record, evidence table, diagram audit, and resume bullets |
| `chenyy_cv.md` | PLAN-B resume bullets, grammar extraction, and risk notes |
| `planb.html` + `planb.js` | PLAN-B Speech-to-Grasp detail page (DreamZero-style, corrected model/runtime SVGs, bilingual i18n keys) |
| `pi05.html` + `pi05.js` | pi0.5/LIBERO fine-tuning project page |
| `aloha_lekiwi.html` + `aloha_lekiwi.js` | ALOHA/LeKiwi DreamZero reproduction page |
| `coin_stand.html` | Embodied Coin Standing and Placement project page |
| `plana.html` | PLAN-A multimodal interaction system detail page with bilingual inline i18n and redrawn model/runtime SVGs |
| `plana_retargeting.html` | PLAN-A Retargeting project detail page with bilingual inline i18n |

### Projects and Required Technical Depth

| Project | Page | Key Technical Depth | Source Docs |
|---------|------|-------------------|-------------|
| PLAN-B | planb.html | Streaming ALSA audio → cloud_qwen3 ASR → qwen3.5-flash JSON NLU → VLM bbox/SAM3 box-text grounding → TTS echo guard → 3D grasp_check server (no z_fallback) + optional pipeline `vlm_or_tactile` → 13-mixin FSM, latency budget, failure diagnosis | `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/` — `project.md` (988 lines), `docs/cyy/算法答辩云文档_new.md` (917 lines) |
| pi0.5/LIBERO | pi05.html | VLA fine-tuning, freeze-filter matrix, action normalization fix, 2000-episode eval | `Pic/pi05/pi05_libero_finetune_report.pdf` |
| ALOHA/LeKiwi | aloha_lekiwi.html | LeRobot schema conversion, embodiment registration, WebSocket inference | — |
| Embodied Coin Standing and Placement | coin_stand.html | Frozen RADIO summaries, ACT-style 4-layer encoder/decoder, checkpoint hot switching, grasp verification, rule-based half-arc transfer | — |
| PLAN-A Retargeting | plana_retargeting.html | VDMocap 23-node mocap to 10-DOF raw encoder interface, T-pose calibration, quaternion/position runtime mapping, 60D-to-10D Teleop Transformer | `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/retargeting/` |
| PLAN-A | plana.html | Qwen2.5-VL/OpenCV perception, Text-to-Action CVAE report route, image-conditioned Diffusion Policy, retargeting calibration, 10D WebSocket + Dynamixel execution | `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/` — `docs/PLAN-A_云文档.md`, `PlanA-情感陪伴场景的多模态交互系统.pdf` |

### What "deep mining" means per project

- **PLAN-B**: Don't say "multimodal perception". Describe the ALSA audio→cloud_qwen3 ASR→qwen3.5-flash NLU→VLM bbox→SAM3 box/text→PerceptionResult→TTS echo guard→3D grasp_check/FSM pipeline with latencies, failure modes, and specific fixes (source-pixel bbox contract, stateful Silero, stale SHM audit, no z_fallback in standalone grasp_check).
- **pi0.5/LIBERO**: Don't say "fine-tuned a VLA". Describe the freeze-filter matrix, action normalization fix, norm_stats reuse issue, LoRA scope, evaluation protocol.
- **ALOHA/LeKiwi**: Don't say "teleoperation". Describe LeRobot schema conversion, embodiment registration, camera order, timestamp alignment, WebSocket inference.
- **PLAN-A Retargeting**: Don't say "motion mapping". Describe VDMocap 23-node struct parsing, T-pose offset calibration, quaternion/position runtime routes, 10D Dynamixel encoder contract, `[0,4095]` clamps, 60D-to-10D Teleop Transformer regression, and the 47-sample final-frame MAE caveat.
- **PLAN-A**: Don't say "diffusion policy". Describe CVAE vs diffusion routes, retargeting calibration, latent dimension choices, scheduler steps.

---

## 4. Homepage Design Preferences

- **Style reference**: dreamzero0.github.io — product-style academic project page with hero sections, metric strips, visual evidence, progressive disclosure
- **Bilingual**: EN/ZH toggle via `data-i18n` / `data-i18n-html` attributes; all content must have both languages
- **Theme**: Light/dark toggle, default dark, CSS custom properties (`--bg`, `--accent`, etc.)
- **Content tone**: Solid research contributions from a robot lab graduate student; slight overclaiming acceptable — "designed", "proposed", "field-calibrated", "production-grade"
- **Depth level**: Product-style (results-focused, minimal code, figure-first with concise text and result callout blocks)
- **Tech stack**: Static HTML/CSS/JS on GitHub Pages, no build step, no framework

### Project Page Layout (DreamZero-inspired)
Hero → Metrics → Overview → Demo → Contributions → Results → Highlights

---

## 5. Architecture Diagram Styles

### Project Page Diagram Conventions

- **Source figures**: Pre-rendered PNGs in `Pic/<project>/` directories
- **Diagram wrapper**: `.diagram` class, theme-aware background `var(--bg-alt)`, border `var(--border)`, 8px radius, 16px padding, overflow-x auto
- **Captions**: 1 sentence, bilingual `data-i18n`, `<p class="fig-cap">`
- **Inline SVGs**: `currentColor` + `var(--accent)` for theme awareness. Rounded rects, arrows, dashed feedback loops
- **Side-by-side**: CSS grid `1fr 1fr`, gap 20px, single column at 768px
- **Result callout**: `.result-block` with accent left border
- **Scope callout**: `.scope-callout` to separate user's vs collaborator's contributions

### Architecture Style Reference Pool (`arch_style/`)

Free-choice pool of visual style references. No file is locked to a specific project. Browse and pick whichever fits.

| File | Content |
|------|---------|
| `ACT_arch.png` | ACT paper Fig.4 — CVAE encoder + Transformer encoder-decoder, multi-camera CNN input, action chunking output |
| `X-VLA_architechture.jpg` | X-VLA overview — Soft Prompt Library, Shared ViT, cross-embodiment LoRA (1%/9M params), radar chart results |
| `module_arch.pdf` | PLAN-B multimodal pipeline — 3 iterations, color-coded modules (audio+vision→VLM→TTS), AEC/SSL/ASR/VAD/SAM+MiDaS |
| `Retargeting.png` | AnyTeleop — vision-based teleoperation grid across IsaacGym/SAPIEN/Real World |
| `plana-robot.jpg` | PLAN-A hardware — 北岳 BEIYUE robots with exposed servos |

**Auto-update rule**: When `arch_style/` contents change, immediately update this inventory table.

### Figure Locations

| Project | Location |
|---------|----------|
| PLAN-B | `Pic/planb/` — 14 PNGs + 2 SVGs (`planb-model_architechture.svg`, `planb-runtime_visualization.svg`) (system_overview, dataflow_panorama, vad_funnel, engine_quadrant, sam3_improvement, letterbox_comparison, fsm_closed_loop, tracking_bargein, p0_causal_chain, p0_fix_timeline, metrics_comparison, latency_waterfall, gpu_gantt, radar_heatmap) |
| PLAN-A | `Pic/plan_a_system.png`; `Pic/plana/` (plana-model_architechture.svg, plana-runtime_visualization.svg) |
| PLAN-A Retargeting | `Pic/plana_retargeting/plana_retargeting_arch.svg` |
| pi0.5 | `Pic/pi05/` (includes `pi05_libero_finetune_report.pdf`) |
| Embodied Coin Standing and Placement | `Pic/coin_stand/coin_architecture.png`; `Pic/coin_stand/coin_stand_pipeline.svg` (ACT-style architecture sketch with preserved coin.mp4 frames + runtime pipeline) |

---

## 6. Resume Conversion Rules

### Verb Choice
- USE: "Architected", "Engineered", "Deployed", "Debugged", "Optimized", "Integrated"
- BAN: "Worked on", "Helped with", "Used", "Built" (too generic)

### Required Technical Details
Every bullet must include: model names (pi0.5, GR00T), frameworks (LeRobot, Isaac Lab), benchmarks (LIBERO), and quantified metrics (success rate, Hz, latency).

### Slight Overclaiming Boundaries
- OK: "Designed" when you adapted/implemented an existing design with modifications
- OK: "Production-grade" when the system runs reliably on real hardware
- OK: "End-to-end" when you touched most pipeline stages
- NOT OK: Claiming results you didn't measure, or features that don't exist in code

### Bullet Structure
`[Action verb] + [specific what] + [technical how] + [quantified scope/result]`

### Self-Check Per Bullet
"If the interviewer asks 'how exactly did you do this?', can the user answer confidently from project experience?" If not → delete or rewrite.

---

## 7. Technical Knowledge Base Reference

### KB Files

| File | Content | How to Use |
|------|---------|-----------|
| `private-kb/public/` | Full 20-page authorized HTML corpus: Pi0 family, Isaac-GR00T N1.5/N1.6, ACT, SmolVLA, WALL-OSS/X, X-VLA, Psi0, DreamZero, Fast-WAM, GR00T-WBC, Decoupled WBC, GEAR-SONIC, MotionBricks, and VLM3 | Read model-specific pages before architecture, training, inference, rate, dimension, benchmark, or comparison claims. Read all 20 pages during full deep-project mining. |
| `personnel page technical content KB.md` | Curated model-family map, writing grammar, 8-question rigor standard, project-specific guidance, terminology, publishing checklist, and auto-generated paths into `private-kb/public/` | Read in full before any technical output. Use it to decide what evidence and level of detail the output requires. |
| `Project Mining Protocol.md` | Latest project mining protocol: bootstrap read → KB alignment → repo reconstruction → evidence table → 8 questions → reviewer critique → figure plan → homepage translation → resume translation → implementation → final package | Use as the step-by-step prompt and output contract when deep-mining, reviewing, rewriting, or publishing a new project |

### Technical Rigor Standard (from KB)

Every project description must answer these 8 questions:

| Question | Required answer style |
|----------|----------------------|
| What problem does this own? | Define boundary: data collection, fine-tuning, inference, control, perception, or deployment |
| What model stack is used? | Name backbone, action head, tokenizer/diffusion head, controller, runtime |
| What crosses module boundaries? | Image streams, language instruction, robot state, action vector, token shape, qpos layout |
| What runs at what rate? | Hz, chunk length, horizon, latency, FPS. Separate policy rate from controller rate |
| What was trained? | Trainable modules, frozen modules, LoRA scope, loss/reward, optimizer, checkpoint step |
| What was measured? | Benchmark, tasks, episode count, success definition, baseline delta, ablation |
| What was hard? | Schema bugs, normalization bugs, frame mismatches, evaluation leakage, deployment latency, safety failures |
| What remains unproven? | Separate simulation success, benchmark success, and real-robot transfer |

### Homepage Card Standard (from KB)

4-7 sentences per card:
1. What the project is and target platform
2. The architecture route or pipeline
3. The most important interface detail
4. The key engineering fix or design choice
5. Measured result with scope
6. (Optional) Limitation or deployment status

### Terminology (keep stable)
VLA, VLM, WBC, IK, RL, PPO, DiT, Flow Matching, action chunk, action expert, tokenizer, qpos, proprioception, embodiment, rollout, policy server.
Model names: Pi0, Pi0.5, Pi0-FAST, Pi-Star, Pi0.7, Isaac-GR00T, ACT, SmolVLA, WALL-OSS/WALL-X, X-VLA, Psi0, DreamZero, Fast-WAM, GEAR-SONIC, MotionBricks, VLM3.
Data/runtime: LeRobot, LIBERO, MuJoCo, Isaac Lab, ONNX, TensorRT, WebSocket, DDS, ROS2.

---

## 8. Deep-Project Protocol

When asked to deep-mine a project, execute these steps in order (no skipping):

### Step 1: Read (produce NO output)
1. Read `Project Mining Protocol.md`
2. Read `personnel page technical content KB.md` in full
3. Read all 20 HTML documents under `private-kb/public/`; use the local catalog to verify coverage
4. Read all files in `arch_style/`
5. Read ALL source code, configs, and docs for the target project
6. If external source paths exist (e.g., PLAN-B at `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/`), read those too

### Step 2: Evidence Table
Output an evidence table:
| Technical claim | Evidence file:line | Type (code/config/doc/measurement) |

Claims not in the evidence table must not appear in later output.

### Step 3: Answer 8 KB Questions
Answer each of the 8 questions from Section 7's Technical Rigor Standard, with file-path evidence.

### Step 4: Self-Check
For every sentence in output, test: "Could someone who never read the code write this?"
If yes → rewrite with code-level evidence.

---

## 9. Resume-Bullet Protocol

When asked to generate resume bullets for a project:

### Prerequisites (execute first if not yet done)
1. Read `Project Mining Protocol.md`
2. Read all source code for the target project
3. Read `personnel page technical content KB.md` in full
4. Read the relevant `private-kb/public/*.html` documents for every model family named in the bullets
5. Browse `arch_style/` for style context

### Generation Rules
- Structure: `[Strong verb] + [specific what] + [technical how] + [quantified scope/result]`
- Must include model names, framework names, benchmark names, concrete numbers
- Slight overclaiming OK within boundaries (see Section 6)
- Fabrication of nonexistent features/results is never OK

### Output Format Per Bullet
1. Bullet text (English)
2. Chinese explanation: why written this way
3. Predicted interviewer follow-up question
4. Evidence location: code/doc file path

### Final Self-Check
"If the interviewer asks 'tell me exactly how you did this', can the user answer from real experience?" If not → delete or rewrite.

---

## 10. AI Working Contract (4-Point Summary)

### Point 1: Internalize the KB
Before any project-related output, read the curated `personnel page technical content KB.md` in full and the relevant full-text documents under `private-kb/public/`. Before full deep-project mining, read the complete 20-page HTML corpus. Convert both layers into working knowledge for architecture comparisons and technical positioning.

### Point 2: Read All Project Code
For each project, read ALL source code, configs, project docs, and architecture references before producing any content. Evidence = file path + function/config + measured result.

### Point 3: Match Architecture Style & Academic Rigor
- Study `arch_style/` for visual standards
- Study KB sections 2-4 for writing grammar and rigor, then verify model-specific details in the matching `private-kb/public/*.html` documents
- Every claim: module names, layer counts, dimensions, frequencies, interface contracts
- Separate: trained vs frozen, measured vs inferred, simulation vs real-robot

### Point 4: Resume-Grade Output with Reference Calibration
- Extract verb patterns and scope framing from reference resumes the user provides; default local reference path: `/home/CNS2026391745/Documents/YUEYICHEN/excellent cv`
- Apply to user's projects with slight overclaiming
- Every bullet specific enough to invite confident follow-up answers
