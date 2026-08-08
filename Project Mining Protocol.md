# YUEYICHEN Project Mining Protocol

Purpose: a compact prompt handbook for every new robotics project added to the
YUEYICHEN personal homepage. It forces AI to read advanced robotics KB, read the
project repository, reconstruct evidence, critique the work, then convert it into
homepage, README, resume, and interview-ready material.

Audience: Yueyi Chen, M.Sc. at CUHK, embodied AI / robot learning / real-robot
deployment. Expected AI level: robotics PhD or senior robotics engineer.

## 0. Memory Mechanism

Do not rely on chat memory. Every session must reload these layers:

| Layer | Role |
| --- | --- |
| `AGENTS.md` | Hard rules for this homepage repo. |
| `personnel page technical content KB.md` | Advanced robotics/VLA/WBC/model reference. Internalize, do not copy. |
| `Project Mining Protocol.md` | This execution prompt. |
| `excellent cv/` | Default resume reference corpus. Extract bullet grammar before writing Yueyi bullets. |
| Target project repo | Source of truth for code, configs, docs, results. |
| Per-project `PROJECT.md` | Long-term memory generated after deep reading. |

Minimal trigger:

```text
你现在在 /home/CNS2026391745/Documents/YUEYICHEN 工作。
请严格执行 AGENTS.md 和 Project Mining Protocol.md。
目标项目：{PROJECT_ROOT}
任务：{TASK}

先读 AGENTS.md、personnel page technical content KB.md、arch_style/、主页现有
HTML/CSS/JS 和目标项目全量源码/配置/文档。Evidence Table 和 8 Technical
Questions 完成前，不要写主页文案、README、简历 bullet 或宣传总结。
```

## 1. User Inputs

Provide as many fields as possible. Missing values must stay `Unknown`.

```text
PROJECT_ROOT:
PROJECT_NAME:
PROJECT_TYPE:
TARGET_OUTPUT:
USER_SCOPE:
COLLABORATOR_SCOPE:
HARDWARE:
MODEL_STACK:
DATASET_OR_BENCHMARK:
RESULTS_SOURCE:
PUBLIC_PRIVATE_BOUNDARY:
RESUME_REFERENCE_FILES: /home/CNS2026391745/Documents/YUEYICHEN/excellent cv
HOMEPAGE_TARGET:
```

Good prompt:

```text
请按 Project Mining Protocol.md 完整协议处理：
PROJECT_ROOT = ...
PROJECT_NAME = ...
TARGET_OUTPUT = PROJECT.md + 主页项目页 + 3 条英文简历 bullet
USER_SCOPE = ...
RESULTS_SOURCE = ...

先 deep mining，不要先写文案。优秀简历我会另发；你要先提取它们的
bullet 语法，再迁移到我的项目，允许可防守的轻微 overclaim，但不能编造结果。
```

## 2. Non-Negotiable Gates

1. Read before write.
   - Read `AGENTS.md`, KB, `arch_style/`, current homepage files, similar project
     pages, and target project source/docs/configs/results.

2. Evidence before claim.
   - Every public claim needs `file path + line/function/config/result`.
   - Use `Unknown` when evidence is absent.
   - Label `Fact`, `Measurement`, `Inference`, and `Public-safe wording`.

3. No shallow language.
   - Avoid: `advanced system`, `improved robustness`, `used multimodal AI`,
     `leveraged state-of-the-art`, `comprehensive pipeline`, `worked on`,
     `helped with`, `built a model`.
   - Replace with model names, interfaces, dimensions, rates, schema, failure
     modes, and fixes.

4. Separate boundaries.
   - trained vs frozen
   - measured vs inferred
   - simulation vs real robot
   - policy rate vs control rate
   - Flow Matching vs diffusion
   - action chunking vs receding horizon
   - qpos vs velocity vs pose target

5. No public-facing output before:
   - read coverage
   - evidence table
   - 8 technical questions
   - reviewer critique

## 3. Required Workflow

| Phase | Action | Output |
| --- | --- | --- |
| 0. Bootstrap | Read repo controls, KB, arch_style, homepage code, target project files. | Read Coverage |
| 1. KB alignment | Map relevant KB families to this project. | Robotics Context Map |
| 2. Repo reconstruction | Build source/module/runtime maps from code. | Repository Map, Module Map, Execution Path |
| 3. Evidence gate | Convert facts into traceable claims. | Evidence Table |
| 4. Technical model | Answer the 8 questions. | 8-Question Reconstruction |
| 5. Critique | Review as CoRL/RSS reviewer + robotics hiring manager. | Reviewer Critique |
| 6. Visual plan | Choose architecture/result figures and style references. | Figure Plan |
| 7. Homepage translation | Convert evidence into card/page content. | EN/ZH homepage draft or implementation |
| 8. Resume translation | Analyze `excellent cv/` first, then write defensible bullets. If the references are image-only and no OCR/viewer is available, record that as a gap and use only confirmed grammar rules from `AGENTS.md` / this protocol. | Reference grammar table + bullets + rationale + evidence |
| 9. Implementation | Edit static HTML/CSS/JS if requested. | Verified homepage change |
| 10. Package | Preserve knowledge for future sessions. | `PROJECT.md` + gaps |

## 4. Phase Outputs

### 4.1 Read Coverage

```markdown
| Area | Files read | Why it matters | Gap |
| --- | --- | --- | --- |
| Homepage contract | ... | i18n/style/layout | ... |
| Robotics KB | ... | model/control vocabulary | ... |
| Target source | ... | code evidence | ... |
| Results | ... | measured claims | ... |
| Visual assets | ... | figures/captions | ... |
```

### 4.2 Robotics Context Map

Select only relevant KB families.

```markdown
| KB family | Relevance | Wording impact |
| --- | --- | --- |
| Pi0 / Pi0.5 / GR00T | ... | Flow Matching, action expert, LoRA/freeze scope |
| ACT | ... | action chunking, temporal aggregation |
| DreamZero / Fast-WAM | ... | world model, action latent, caching |
| WBC / GEAR / MotionBricks | ... | controller rate, qpos/action layout, safety boundary |
| VLM3 / 3D VLM | ... | camera/depth/coordinate interface |
```

Checks:

- Closest model family?
- What is not equivalent?
- Which impressive terms are unsupported?
- Which terms must be used exactly?

### 4.3 Repository Reconstruction

```markdown
## Repository Map
| Path | Role | Public relevance | Notes |
| --- | --- | --- | --- |
| ... | model/config/runtime/result | yes/no | ... |

## Module Map
| Module | Evidence | Input | Output | Rate/shape | Failure mode |
| --- | --- | --- | --- | --- | --- |
| perception | ... | RGB-D | bbox/mask/depth | ... | ... |
| policy | ... | image+language+state | action chunk | ... | ... |
| control | ... | target pose/qpos | motor command | ... Hz | ... |

## Execution Path
1. Entry point:
2. Config loading:
3. Data preprocessing:
4. Model/policy call:
5. Post-processing:
6. Robot or benchmark step:
7. Logging/result artifact:
```

Extract at minimum:

- backbone, action head, tokenizer/diffusion/Flow Matching head
- observation/action/state/language/timestamp schema
- robot interface: qpos, pose, velocity, gripper, clamp
- runtime: WebSocket, ZMQ, ROS2, DDS, HTTP, checkpoint loading
- timing: FPS, Hz, horizon, chunk length, latency, rollout length
- training: frozen/trainable modules, LoRA scope, optimizer, LR, checkpoint
- evaluation: benchmark, tasks, episodes, success definition, baseline, ablation
- failure fixes: norm stats, camera order, frame mismatch, stale buffer, safety

### 4.4 Evidence Table

Claims outside this table cannot enter public copy.

```markdown
| Claim | Evidence | Type | Confidence | Public-safe wording |
| --- | --- | --- | --- | --- |
| ... | `file:line`, config, report, log, video | code/config/doc/measurement/figure/video/inference | high/medium/low/unknown | ... |
```

Rules:

- `high`: direct code/config/result evidence.
- `medium`: supported by multiple files but no direct measurement.
- `low`: plausible but not publishable as fact.
- `unknown`: do not claim.

### 4.5 Eight Technical Questions

```markdown
| Question | Required answer | Evidence |
| --- | --- | --- |
| What problem does this own? | data, fine-tuning, inference, control, perception, deployment boundary | ... |
| What model stack is used? | backbone, action head, controller, runtime | ... |
| What crosses module boundaries? | image, language, state, token/action vector, qpos, metadata | ... |
| What runs at what rate? | FPS, Hz, horizon, chunk, latency; policy vs controller rate | ... |
| What was trained? | frozen/trainable modules, LoRA, loss, optimizer, checkpoint | ... |
| What was measured? | benchmark, tasks, episodes, success definition, baseline, ablation | ... |
| What was hard? | schema bugs, normalization, frame/order mismatch, latency, safety | ... |
| What remains unproven? | sim vs real, qualitative vs quantitative, missing ablation | ... |
```

### 4.6 Reviewer Critique

```markdown
| Dimension | Score /10 | Evidence | Concern | Wording/fix |
| --- | --- | --- | --- | --- |
| Novelty | ... | ... | ... | ... |
| Engineering | ... | ... | ... | ... |
| System integration | ... | ... | ... | ... |
| Real robot | ... | ... | ... | ... |
| Evaluation | ... | ... | ... | ... |
| Reproducibility | ... | ... | ... | ... |
| Homepage readiness | ... | ... | ... | ... |
| Resume readiness | ... | ... | ... | ... |
```

Answer explicitly:

- What would a CoRL/RSS reviewer attack?
- What would a robotics hiring manager ask first?
- What missing experiment would strengthen the claim?
- Which overclaim is defensible in interview?

### 4.7 Architecture Figure Plan

```markdown
| Figure | Purpose | Style reference | Required labels | Evidence |
| --- | --- | --- | --- | --- |
| System overview | module boundaries | `module_arch.pdf`, X-VLA | sensor, model, controller, feedback | ... |
| Model architecture | train/freeze/action path | ACT, Pi0.5 | backbone, LoRA, action head | ... |
| Runtime pipeline | deployment flow | PLAN-B style | process, rate, latency, fallback | ... |
| Results visual | measured result | X-VLA table/radar | metric, baseline, scope | ... |
```

Homepage figure rules:

- Use real assets under `Pic/<project>/` when possible.
- Captions: one precise sentence, bilingual if public.
- Use `.diagram`, `.result-block`, `.scope-callout`, `.results-table` consistently.
- Do not draw modules that the code does not implement.

### 4.8 Homepage Translation

Homepage card must be 4 to 7 dense sentences:

1. project identity and platform
2. architecture route or pipeline
3. key interface contract
4. engineering fix or design decision
5. measured result with scope
6. optional limitation or deployment status

Detail page order:

```text
Hero -> Metrics -> Overview -> Architecture -> Interface/Data ->
Training or Algorithm -> Inference/Deployment -> Results ->
Failure Diagnosis -> Interview-Ready Technical Points
```

Implementation constraints:

- static HTML/CSS/JS, no build step
- bilingual `data-i18n` / `data-i18n-html`
- dark/light theme compatibility
- current classes: `hero`, `metrics-strip`, `metric-card`, `section-block`,
  `diagram`, `result-block`, `scope-callout`, `results-table`, `highlight-grid`
- no placeholder links unless intentionally marked

### 4.9 Resume Translation

When resume references are provided, analyze them first. Default local reference path: `/home/CNS2026391745/Documents/YUEYICHEN/excellent cv`.

Reference handling rules:

- List the reference files actually inspected.
- Extract only readable bullet grammar: verb choice, compression pattern, metric placement, ownership wording, and acceptable overclaim style.
- If the reference files are images and OCR or visual inspection is unavailable, do not invent reference bullets. Mark the extraction as blocked/partial, then fall back to the verified grammar in `AGENTS.md` and this protocol.
- Store the final reference grammar and any unreadable-reference gap inside the project `PROJECT.md`.

```markdown
| Reference bullet | Verb | Compression pattern | Metric placement | What to imitate |
| --- | --- | --- | --- | --- |
| ... | Architected/Engineered/Optimized | model + system + result | ... | ... |
```

Then produce each Yueyi bullet as:

```markdown
English bullet:
- ...

Chinese rationale:
...

Predicted interviewer follow-up:
...

Evidence:
- `file:line`, config, result table, log, video

Risk:
- overclaim boundary and how to defend it
```

Preferred verbs:

```text
Architected, Engineered, Deployed, Debugged, Optimized, Integrated,
Calibrated, Instrumented, Validated, Profiled
```

Avoid as main verbs:

```text
Worked on, Helped with, Used, Built, Participated in
```

Bullet formula:

```text
[Strong verb] + [specific system/model/module] + [mechanism/interface]
+ [scale/result/frequency/latency/benchmark] + [fix/deployment scope]
```

Do not write a bullet Yueyi cannot defend with real project experience.

## 5. Anti-Shallow Checklist

Before publishing any sentence:

```markdown
| Sentence | No-code-reader test pass? | Evidence | Rewrite? |
| --- | --- | --- | --- |
| ... | yes/no | ... | ... |
```

A strong sentence usually contains at least one:

- model/architecture name
- module boundary
- data/action schema
- dimension, frequency, latency, horizon, episode count
- train/freeze distinction
- benchmark or hardware platform
- failure mode and concrete fix
- result with scope

## 6. Prompt Templates

### Full Project Mining

```text
你是 YUEYICHEN 个人主页的 robotics project mining agent。
严格执行：
- /home/CNS2026391745/Documents/YUEYICHEN/AGENTS.md
- /home/CNS2026391745/Documents/YUEYICHEN/Project Mining Protocol.md
- /home/CNS2026391745/Documents/YUEYICHEN/personnel page technical content KB.md

PROJECT_ROOT = {PROJECT_ROOT}
PROJECT_NAME = {PROJECT_NAME}
TARGET_OUTPUT = {TARGET_OUTPUT}
USER_SCOPE = {USER_SCOPE}
RESULTS_SOURCE = {RESULTS_SOURCE}
PUBLIC_PRIVATE_BOUNDARY = {PUBLIC_PRIVATE_BOUNDARY}

顺序不能跳：Bootstrap Read -> KB Alignment -> Repo Reconstruction ->
Evidence Table -> 8 Questions -> Reviewer Critique -> Figure Plan ->
Homepage Translation -> Resume Translation -> Implementation -> Final Package。

Evidence Table 和 8 Questions 前，不要写主页文案、README、简历 bullet 或摘要。
无证据写 Unknown。所有 public claim 必须追溯到 file/line/config/figure/log/report/video。
```

### Homepage After `PROJECT.md`

```text
请基于 {PROJECT_ROOT}/PROJECT.md 和原始证据更新 YUEYICHEN 主页的 {PROJECT_NAME}。
先核对 Evidence Table，不新增无证据 claim。主页 card 写 4-7 句；detail page
按 Hero -> Metrics -> Overview -> Architecture -> Interface -> Training/Algorithm
-> Inference/Deployment -> Results -> Failure Diagnosis -> Interview Points。
所有内容双语，图放 Pic/{project}/，图注一句话。
```

### Resume Bullets

```text
优秀简历默认路径：/home/CNS2026391745/Documents/YUEYICHEN/excellent cv
请先提取 bullet 语法：动词、技术压缩、metric 位置、ownership、
可防守 overclaim。再基于 PROJECT.md 和 Evidence Table 写 {PROJECT_NAME} 的
3-6 条英文 bullet。每条包含英文 bullet、中文解释、面试追问、证据、风险边界。
```

### Sanity Review

```text
请按 YUEYICHEN anti-shallow 规则逐句检查下面文本：
1. 有没有证据？
2. 是否具体到模型/接口/频率/维度/结果/失败修复？
3. 是否混淆训练、推理、部署、评测？
4. 是否有不能防守的 overclaim？
5. 如何改成主页或简历表达？

文本：...
```

## 7. Done Definition

A project is homepage-ready only when:

- target source/config/docs/results have been read
- Evidence Table exists
- 8 Questions are answered
- reviewer concerns and missing evidence are listed
- homepage claims are traceable
- visual assets and captions are selected
- EN/ZH content is prepared
- resume bullets, if requested, include evidence and interview follow-up
- `Unknown` remains `Unknown`

Short version:

```text
先读 AGENTS 和 KB，再读完整项目仓库。
先证据表和 8 问，再 reviewer critique。
最后才写 PROJECT.md、主页、README、简历和面试答案。
不要倒序。
```
