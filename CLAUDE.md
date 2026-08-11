# CLAUDE.md — YUEYICHEN Personal Homepage Project

This file is Claude's local memory entrypoint for this directory. It must stay
aligned with `AGENTS.md`. If there is any conflict, `AGENTS.md` wins.

## 0. Owner

Yueyi Chen (陈悦仪), M.Sc. @ CUHK, Embodied AI / Robot Learning.
Expected AI level: robotics PhD / senior robotics engineer. Precision and
evidence matter more than fluent surface summaries.

## 1. Multi-Layer Memory Stack

Claude must reload these layers before project-related output.

| Priority | Memory layer | Role |
| --- | --- | --- |
| 1 | `AGENTS.md` | Single source of truth for all agents in this repo. Hard rules, project inventory, style rules, sync rules. |
| 2 | `Project Mining Protocol.md` | Current prompt workflow for reading new repos, building evidence, reviewer critique, homepage translation, resume conversion, and `PROJECT.md` memory. |
| 3 | `personnel page technical content KB.md` | Advanced robotics/VLA/WBC/model architecture reference. Internalize, do not copy. |
| 4 | `arch_style/` | Architecture and visual style memory: ACT, X-VLA, PLAN-B module pipeline, retargeting, PLAN-A hardware. |
| 5 | Homepage source | `index.html`, `styles.css`, `script.js`, existing project pages, `Pic/<project>/` assets. |
| 6 | Target project repo | Source of truth for code, configs, docs, results, logs, figures, and videos. |
| 7 | Per-project `PROJECT.md` | Long-term project memory after deep mining. Later public copy should derive from this plus source evidence. |
| 8 | `excellent cv/简历认知库.md` | Resume Cognition Base (load first for any resume work): 大厂算法/大模型/多模态 targeting, reference-CV grammar (阿秀 method, gl_cv north-star, lfy counter-example), 2026 JD demand model, project×JD mapping matrix, robotics→大模型 reframe strategy, resume architecture, gaps, iteration mechanism. |
| 9 | Excellent resume references | Default path `/home/CNS2026391745/Documents/YUEYICHEN/excellent cv`. Analyze bullet grammar first, then translate Yueyi projects into defensible resume language. |

Minimal session trigger:

```text
先读 AGENTS.md、Project Mining Protocol.md、personnel page technical content KB.md、
arch_style/、主页现有 HTML/CSS/JS 和目标项目源码/配置/文档。
Evidence Table 和 8 Technical Questions 完成前，不要写主页文案、README 或简历 bullet。
```

## 2. Hard Rules

### 2.1 Read Before Write

- Before any project-related output, read the actual code, configs, KB, project
  docs, and relevant homepage files in this session.
- Never produce project claims from memory or general knowledge alone.
- `personnel page technical content KB.md` defines the technical rigor standard.

### 2.2 Deep Mining, Not Surface Description

Avoid unsupported phrases:

```text
built an advanced system, improved robustness, used multimodal AI,
leveraged state-of-the-art, designed a comprehensive pipeline,
worked on, helped with, built a model
```

Require concrete details:

```text
architecture name, train/freeze scope, layer/dimension/rate, interface contract,
qpos/action schema, latency, horizon, benchmark, failure mode, fix, measured result
```

No-code-reader test: if someone could write the sentence without reading the
repo, rewrite it with evidence.

### 2.3 Technical Boundaries

Always separate:

- Flow Matching vs diffusion
- action chunking vs receding horizon
- LoRA vs full fine-tune
- qpos vs velocity vs pose target
- policy rate vs low-level control rate
- trained vs frozen modules
- measured vs inferred claims
- simulation benchmark vs real-robot deployment

### 2.4 Evidence Gate

No public-facing output before:

1. Read coverage
2. Evidence Table
3. 8 Technical Questions
4. Reviewer critique

Every claim must trace to file path, function, config, report, log, figure, or
video. If missing, write `Unknown`.

## 3. Project Inventory

| Project | Page | Required technical depth |
| --- | --- | --- |
| VoxIntent (PLAN-B robot voice subsystem) | `voxintent.html` | VAD -> 4-engine ASR -> dual-path NLU -> 6-state dialog -> VLM instruction grounding -> TTS echo guard, latency, failure diagnosis, JD-fit. Downstream SAM3/grasp/IK/motor are collaborator-owned, out of scope. |
| pi0.5/LIBERO | `pi05.html` | VLA fine-tuning, freeze-filter matrix, action normalization, norm_stats, 2000-episode eval. |
| ALOHA/LeKiwi | `aloha_lekiwi.html` | LeRobot schema conversion, embodiment registration, camera order, timestamp alignment, WebSocket inference. |
| Embodied Coin Standing and Placement | `coin_stand.html` | xArm6 + LEAP Hand manipulation, RADIO summaries, checkpoint switching, verification, recovery. |
| Affective Robot Interaction Retargeting (codename PLAN-A) | `affective_retargeting.html` | VDMocap 23-node mocap to 10D Dynamixel encoder contract, T-pose offset calibration, quaternion/position runtime mapping, Teleop Transformer 60D-to-10D regression, and 47-sample MAE caveat. |
| Affective Robot Interaction (codename PLAN-A) | `affective_interaction.html` + `index.html` reference | CVAE route, diffusion route, retargeting calibration, execution runtime. |

## 4. Execution Protocols

### 4.1 Deep Project

When asked to mine or add a project:

1. Read `AGENTS.md`.
2. Read `Project Mining Protocol.md`.
3. Read `personnel page technical content KB.md`.
4. Inspect `arch_style/` and relevant `Pic/<project>/` assets.
5. Read target project source, configs, docs, reports, logs, figures, videos.
6. Output Read Coverage, Evidence Table, 8 Questions, Reviewer Critique.
7. Only then write homepage, README, resume bullets, or interview material.

### 4.2 Resume Bullets

**Before anything else, load `excellent cv/简历认知库.md` in full and follow it.**
It is the mandatory memory layer for all resume work: confirm 目标方向, the Part 2
JD keyword cluster, candidate projects from the Part 3 matrix, and the Part 4
reframe口径 before writing. No bullet may contradict it.

When resume examples are provided:

1. Extract reference bullet grammar: verb, compression pattern, metric placement,
   ownership wording, acceptable overclaim.
2. Generate Yueyi bullets only from Evidence Table and `PROJECT.md`.
3. For each bullet include English bullet, Chinese rationale, interviewer
   follow-up, evidence, and overclaim risk.

Cognition-base gate (enforce every time): every bullet traces to `PROJECT.md`
evidence or deep-mined source and passes the no-code-reader test; not-yet-mined
projects (CUHK Koopman+SOS, CUHK UWM) get no bullets until `/deep-project` runs;
papers 在投 use "under review (target: venue)", never claimed acceptance;
中文先行 then translate; one resume file per direction, never "algorithm 通用".

## 5. Pre-Output Self-Check

Before any project-related output:

- [ ] Have I read `AGENTS.md` in this session?
- [ ] **If this is resume work: have I loaded `excellent cv/简历认知库.md` in full and confirmed 目标方向 + Part 2 JD 关键词簇 + Part 3 候选项目 + Part 4 reframe口径?**
- [ ] Have I read `Project Mining Protocol.md`?
- [ ] Have I read `personnel page technical content KB.md`?
- [ ] Have I read the actual project source/config/docs/results?
- [ ] Can every claim trace to file evidence or measured result?
- [ ] Are model/framework/benchmark names specific?
- [ ] Are dimensions, rates, horizons, latencies, schemas, or failure fixes stated where known?
- [ ] Have I checked `arch_style/` or existing visual precedent?
- [ ] Did every public sentence pass the no-code-reader test?

If any box fails, stop and read before writing.

## 6. Auto-Sync Rules

- `AGENTS.md` is the canonical cross-agent memory file. Claude must follow it.
- If `AGENTS.md` changes, update `CLAUDE.md` in the same task when the change
  affects memory layers, referenced files, project inventory, style rules, or
  execution protocol.
- If any file referenced by `AGENTS.md` or `CLAUDE.md` is renamed, replaced,
  deleted, or materially rewritten, update both memory files in the same task.
- This includes `Project Mining Protocol.md`, `personnel page technical content KB.md`,
  `arch_style/`, `/home/CNS2026391745/Documents/YUEYICHEN/excellent cv`, project source paths, figure inventories, and external source docs.
- When `arch_style/` changes, update the inventory in `AGENTS.md`; then mirror
  the relevant memory summary here if needed.

## 7. Tech Stack And Homepage Constraints

- Static HTML/CSS/JS on GitHub Pages. No build step.
- Dark-default theme.
- Bilingual EN/ZH via `data-i18n` and `data-i18n-html`.
- Project pages should follow: Hero -> Metrics -> Overview -> Architecture ->
  Interface/Data -> Training or Algorithm -> Inference/Deployment -> Results ->
  Failure Diagnosis -> Interview-Ready Technical Points.
- Use existing classes and patterns before inventing new ones: `hero`,
  `metrics-strip`, `metric-card`, `section-block`, `diagram`, `result-block`,
  `scope-callout`, `results-table`, `highlight-grid`.
