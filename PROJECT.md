# Retrieval-Augmented Manipulation (RAM) / 检索增强式具身操作

Project name:
- English: **Retrieval-Augmented Manipulation**
- Chinese: **检索增强式具身操作**

Mining scope: live object discovery, depth reconstruction, object-centric 3D priors, VLM task planning, path planning, and Fairino execution. Excludes upstream GroundingDINO/SAM2/VGGT implementation internals and vendor SDK internals.

Positioning (2026-08-10, updated): the homepage and resume present RAM as **Yueyi's personal project from an idea & design angle** — she owns the retrieval-first system decomposition, the object-representation contract, and the RAMNet training-scheme design. The underlying work is her senior colleague's publication (Chen et al., *Science Robotics* 2026, CUHK), reused **with explicit permission**. Framing rule: claim design/pipeline ownership, attribute all quantitative results to the paper, never present paper numbers as locally re-measured. The old "reproduction" framing on the public page has been retired. All technical facts below were re-verified against source in this session.

Public results status: the Science Robotics DOI is paywalled (HTTP 403) and no preprint was found; the only publicly retrievable quantitative figure is **14 manipulation tasks / 31 objects** (CUHK article). Per-task success rates and baseline deltas are NOT publicly disclosed — do not invent a headline percentage.

Target project:
- Source repo: `/home/CNS2026391745/Documents/YUEYICHEN/Retrieval-augmented-Manipulation/`
- Paper: `https://doi.org/10.1126/scirobotics.aea2092`
- Source code: `https://github.com/RetrievalManip/Retrieval-augmented-Manipulation`
- Homepage target: `ram.html` + `ram.js` (idea-first structure) + `index.html` RAM card
- Visual assets: `Pic/ram/ram-model_architechture.svg`, `Pic/ram/ram-runtime_visualization.svg`

---

## Read Coverage

| Area | Files read | Why it matters | Gap |
| --- | --- | --- | --- |
| Protocol and KB | `AGENTS.md`, `Project Mining Protocol.md`, `personnel page technical content KB.md`, `private-kb/public/19.VLM3_Architecture.html` | Writing grammar, 3D spatial wording, evidence gates. | VLM3 is the closest KB family; RAM is not a VLM3 benchmark. |
| Public repo root | `Retrieval-augmented-Manipulation/README.md` | Four-stage runtime, setup, templates, citation. | None. |
| RAM config | `Retrieval-augmented-Manipulation/config/config.yaml` | `ram_k`, backbone, feature layers, map size, thresholds. | None. |
| RAM backbone | `Retrieval-augmented-Manipulation/visions/ram/lib/network.py` | Frozen DINOv2-B/14 and adapter/decoder layout. | None. |
| Training path | `Retrieval-augmented-Manipulation/tools/ram_training/train_bop.py` | Frozen backbone, losses, epoch/step budget. | None. |
| Runtime stages | `step1_grounding.py`, `step2_ram.py`, `step3_planning.py`, `step4_conducting.py` | End-to-end execution path and file contracts. | None. |
| Control path | `utils/constraint_parser.py`, `planner/path_planner.py`, `planner/trajectory_generator.py`, `controller/fairino_arm.py` | Constraint grammar, voxel planning, robot SDK boundary. | None. |
| Prompting / grounding | `languages/ram_vlm.py`, `languages/ram_vlm_utils.py`, `visions/grounding/dino_grounding.py` | OpenAI-compatible VLM client and GroundingDINO + SAM2 contract. | None. |
| Template path | `tools/template_renderer/render_templates.py`, `visions/ram/ram.py` | 128-view templates, primitive metadata, RAM inference contract. | None. |
| Public paper sources | DOI + CUHK article + PubMed abstract | Claims about real-world scope and benchmark framing. | No local benchmark logbook. |

## Robotics Context Map

| KB family | Relevance | Wording impact |
| --- | --- | --- |
| VLM3 | High | Use explicit coordinate / geometry contracts, not generic "VLM grounding" language. |

## Repository Reconstruction

### Repository Map
| Path | Role | Public relevance | Notes |
| --- | --- | --- | --- |
| `README.md` | setup, synthetic data, template prep, citations, stage split | yes | source of the 4-stage public narrative |
| `config/config.yaml` | model, camera, robot, planner config | yes | pins the exact runtime contract |
| `step1_grounding.py` | prompt -> VLM object discovery -> 2D grounding | yes | writes inspectable artifacts |
| `step2_ram.py` | VGGT-1B + RAMNet object priors | yes | produces object metadata, grasp poses, support planes |
| `step3_planning.py` | long-task decomposition -> subtasks/actions | yes | generates VLM JSON planning outputs |
| `step4_conducting.py` | parse constraints -> path planning -> execution | yes | motion boundary ends here |
| `visions/ram/ram.py` | RAMTemplate / RAMIO / RAMModel | yes | template loading, viewpoint, NOCS, grasp, plane |
| `visions/ram/lib/network.py` | RAMNet backbone and heads | yes | the core learned module |
| `tools/ram_training/train_bop.py` | training entry point | yes | freeze strategy + losses |
| `planner/path_planner.py` | voxel search and postprocess | yes | max steps / stop threshold / obstacle weighting |
| `planner/trajectory_generator.py` | voxel -> trajectory -> robot waypoints | yes | execution boundary |
| `controller/fairino_arm.py` | Fairino robot wrapper | yes | MoveL / MoveC / gripper |

### Module Map
| Module | Evidence | Input | Output | Rate / shape | Failure mode |
| --- | --- | --- | --- | --- | --- |
| Grounding | `step1_grounding.py:76-191`, `visions/grounding/dino_grounding.py:145-235` | prompt + RGB-D | masks, boxes, category JSON | one pass per prompt | empty / low-confidence detections |
| RAM inference | `step2_ram.py:221-363`, `visions/ram/ram.py:35-735` | detections + views + templates | object pose, grasp, plane metadata | `ram_k=5`, `n_pts=1024`, `img_size=224` | missing template, bad depth confidence, symmetry ambiguity |
| Planning | `step3_planning.py:103-211` | RAM metadata + prompt | `vlm_subtasks.json`, `vlm_actions.json` | JSON-only contract | malformed JSON or action names |
| Constraint parsing | `utils/constraint_parser.py:215-447` | action JSON + object transforms | gripper pose list | 14 step types | wrong action branch / pose update |
| Path planning | `planner/path_planner.py:27-129`, `planner/planner_config.json:1-13` | voxel maps | path voxels | `100^3`, max 300 steps | no valid nearby voxel / bad costmap |
| Trajectory generation | `planner/trajectory_generator.py:278-359,461-489` | path voxels | robot waypoints | base-frame conversion | table-height clamp / invalid gripper state |
| Robot execution | `controller/fairino_arm.py:45-191` | waypoint pose + gripper state | MoveL / MoveC / gripper motion | 60 / 20 velocity defaults | SDK / connection / motion errors |

### Execution Path
1. `step1_grounding.py` captures the prompt, RGB-D frame, and object list.
2. `step2_ram.py` reconstructs depth with VGGT-1B and predicts object-centric priors with RAMNet.
3. `step3_planning.py` turns those priors into VLM subtasks and action constraints.
4. `step4_conducting.py` converts constraints into voxel paths and Fairino waypoints.
5. `trajectory_generator.py` and `fairino_arm.py` execute the final motion primitive.

## Evidence Table

| Claim | Evidence | Type | Confidence | Public-safe wording |
| --- | --- | --- | --- | --- |
| RAM is a retrieval-augmented framework for object-centric manipulation. | `README.md:1-4` | doc | high | retrieval-augmented manipulation framework |
| Runtime is split into four scripts. | `README.md:184-193` | doc | high | 4-stage public pipeline |
| RAM config fixes `ram_k=5`, DINOv2-B/14, `[7,9,11]`, `224`, `1024`, `100`. | `config/config.yaml:26-34`, `planner/planner_config.json:1-13` | config | high | fixed retrieval and planning contracts |
| RAMNet uses a frozen DINOv2-B/14 backbone and `2304 -> 512 -> 256 -> 3` decoder. | `visions/ram/lib/network.py:23-66,123-187` | code | high | frozen backbone + adapters + geometric decoder |
| Training uses `PoseNCE`, `NOCSLoss`, `MatchLoss`, `50` epochs, `2000` steps, `lr=1e-4`. | `tools/ram_training/train_bop.py:20-71,152-178,231-317,487-511` | code | high | structured training with frozen backbone |
| Template rendering defaults to `128` views. | `tools/template_renderer/render_templates.py:34-70` | code | high | 128-view template preparation |
| Step 1 writes prompt, RGB-D, detections, and category JSON. | `step1_grounding.py:74-191` | code | high | inspectable grounding artifacts |
| Step 2 loads VGGT-1B and writes `vggt_depth_ext.npy`, `vggt_K.npy`, `ram_objects_meta.npy`. | `step2_ram.py:221-363` | code | high | geometry and object metadata artifacts |
| Step 3 writes `vlm_subtasks.json` and `vlm_actions.json`. | `step3_planning.py:155-211` | code | high | JSON planning contract |
| Step 4 loads the actions and passes them to `ConstraintParser` and `TrajectoryGenerator`. | `step4_conducting.py:149-205` | code | high | motion boundary and execution boundary |
| ConstraintParser supports 14 step types and explicit reset/release/push/grasp/lift branches. | `utils/constraint_parser.py:215-447` | code | high | 14-branch constraint grammar |
| PathPlanner uses a 100^3 map with max 300 steps and obstacle/target weights. | `planner/path_planner.py:27-129`, `planner/planner_config.json:1-13` | code | high | voxel costmap search |
| Fairino wrapper calls `MoveL` at 60 and `MoveC` at 20 and handles gripper motion. | `controller/fairino_arm.py:45-191` | code | high | explicit robot SDK motion layer |
| The paper frames the system for zero-shot real-world robot execution and CO3D generalization. | DOI / PubMed abstract / CUHK article | paper/web | medium | public paper claim |

## Eight Technical Questions

| Question | Required answer | Evidence |
| --- | --- | --- |
| What problem does this own? | Object-centric manipulation with retrieval, geometry, planning, and execution. | `README.md:1-4,184-193` |
| What model stack is used? | GroundingDINO + SAM2, VGGT-1B, frozen DINOv2-B/14 RAMNet, VLM planner, Fairino motion layer. | `config/config.yaml:17-34`, `visions/ram/lib/network.py:23-66`, `step2_ram.py:221-363`, `controller/fairino_arm.py:45-191` |
| What crosses module boundaries? | Prompt, RGB-D, boxes, masks, VLM object JSON, object metadata, subtasks, action JSON, voxel paths, robot poses. | `step1_grounding.py:76-191`, `step2_ram.py:268-363`, `step3_planning.py:167-211`, `step4_conducting.py:135-205` |
| What runs at what rate? | 128 template views, `ram_k=5`, `n_pts=1024`, `map_size=100`, `max_steps=300`, `MoveL` 60, `MoveC` 20. | `render_templates.py:66-70`, `config/config.yaml:26-34,72-80`, `planner/planner_config.json:1-13`, `controller/fairino_arm.py:66-88` |
| What was trained? | DINO backbone frozen; adapters and geometric heads trained with `PoseNCE`, `NOCSLoss`, `MatchLoss`. | `train_bop.py:152-178,231-317,487-511`, `network.py:23-66` |
| What was measured? | Public paper claims zero-shot real-world execution and CO3D generalization; repo does not ship logs. | DOI / PubMed abstract / CUHK article; README citation block |
| What was hard? | Calibration, depth confidence filtering, symmetry handling, template loading, and JSON contract integrity. | `step2_ram.py:241-363`, `visions/ram/ram.py:117-229,573-685`, `step3_planning.py:57-100` |
| What remains unproven? | Local repo benchmark numbers, full real-robot reproduction without external checkpoints, and comparative ablations. | repo gaps + README dependency section |

## Reviewer Critique (idea/design framing)

| Dimension | Score /10 | Evidence | Concern | Fix |
| --- | --- | --- | --- | --- |
| Idea clarity | 8 | retrieval-first thesis is crisp and code-backed | idea is the colleague's, not originally Yueyi's | own the *articulation and design translation*; attribute the origin with permission |
| Design reasoning | 8 | every choice (freeze backbone, templates, deterministic motion) has a stated why | must connect each why to code, not vibes | keep the "why" tied to `network.py` / `train_bop.py` / `path_planner.py` |
| System integration | 9 | four-stage pipeline + explicit artifacts | external checkpoints still required | state dependencies clearly |
| Real robot | 8 | Fairino SDK, camera calibration, waypoint execution | benchmark logs absent locally | present as design + pipeline, not a local benchmark claim |
| Evaluation honesty | 7 | paper claims exist, repo lacks logs; page attributes 14/31 to paper | tempting to quote an invented success rate | cite paper explicitly, quote no headline % that is not public |
| Reproducibility | 8 | config, scripts, template layout, outputs | large assets not vendored | list the external assets explicitly |
| Homepage readiness | 9 | idea-first narrative with code evidence and honest scope callout | overclaim risk if "designed" is read as "invented the paper" | the hero cite + scope callout keep it defensible |

What a reviewer or interviewer will attack first:
- "Is this your idea or your senior colleague's?" — answer: the published idea is hers; what I own is the system-design articulation, the object-representation contract reasoning, and the training-scheme design, reused with her permission.
- Whether `VGGT`, `Grounded-SAM-2`, and the RAM templates were actually available for a run.
- Whether any quoted number is mine or the paper's — answer: all quantitative results are paper-attributed; I quote no local benchmark.

Design questions I must be able to answer (the real test of "design ownership"):
- Why retrieval-first instead of end-to-end? (new object = lookup, not new training; cost is the template must exist.)
- Why freeze DINOv2? (keep the visual prior, train only geometry heads → single-image zero-shot is plausible.)
- Why keep motion deterministic? (intelligence lives in the object representation; execution stays auditable/clampable.)
- Why 128 template views / `ram_k=5`? (retrieval coverage vs. cost; the runtime scores `ram_k` candidates by Umeyama inlier ratio.)

Missing experiment that would strengthen the claim:
- A small ablation on `ram_k`, template views, and depth confidence filtering — would convert "design I understand" into "design I measured."

Defensible ownership statement in interview:
- "The idea is my senior colleague's published work, which I was authorized to build on. What I own is the design articulation — I reconstructed the retrieval-first decomposition, made the object-representation contract explicit, and designed the training scheme (frozen backbone, BOP data, template priors, PoseNCE/NOCS/Match) to match it. I verified every technical claim against the code; the benchmark numbers are the paper's, not mine."

## Figure Plan

| Figure | Purpose | Style reference | Required labels | Evidence |
| --- | --- | --- | --- | --- |
| System overview | module boundaries | `module_arch.pdf` style / RAM SVG | Grounding, depth, RAMNet, planner, execution | `README.md`, `step1-4` |
| Model architecture | train/freeze/action path | ACT / X-VLA style | frozen DINOv2, adapters, decoder | `network.py`, `train_bop.py` |
| Runtime pipeline | deployment flow | PLAN-B style | process split, artifact outputs, SDK boundary | `step1-4`, `planner`, `controller` |

## What To Learn Next

To turn RAM into an interview-safe秋招项目, learn these in order:
1. GroundingDINO + SAM2 object grounding and box/mask handoff.
2. VGGT-1B depth / pose estimation and stereo-baseline rescaling.
3. DINOv2 token extraction, transformer adapters, and NOCS-style geometric reasoning.
4. BOP / BlenderProc template rendering, object metadata, and primitive annotation.
5. Voxel costmaps, constraint parsing, and robot waypoint generation.
6. Fairino `MoveL` / `MoveC` / gripper control and camera calibration contracts.

## Resume Bullets

Framing: idea & design ownership, built on an authorized senior-colleague publication. Lead with design verbs (designed / architected / decomposed), attribute results to the paper.

1. `Designed a retrieval-first manipulation system that treats an unseen object as a template lookup rather than an end-to-end learning problem — discovering the object, retrieving a 3D category template, and inheriting grasp points, hinges, and support planes so a single RGB frame drives action.`
   - Evidence: `README.md:1-4,184-193`, `config/config.yaml:26-34`, `visions/ram/ram.py:35-735`
   - Interviewer follow-up: "Whose idea?" → published work by a senior colleague (Chen et al., Science Robotics 2026), built on with permission; I own the design articulation and training scheme.
   - Overclaim risk: medium — must not imply authorship of the paper. Mitigated by explicit attribution.

2. `Architected the RAMNet core as a frozen DINOv2-B/14 backbone (features [7,9,11] → 2304-D) with lightweight 1-layer view / 4-layer shape / 4-layer map adapters and a 2304→512→256→3 deformation decoder, keeping the visual prior intact while learning only geometry heads.`
   - Evidence: `visions/ram/lib/network.py:23-66,123-187`, `tools/ram_training/train_bop.py:20-71`
   - Overclaim risk: low — all numbers code-verified.

3. `Designed a training scheme matched to the retrieval idea — BOP-style BlenderProc data, 128-view category templates, and a PoseNCE / NOCSLoss / MatchLoss objective that fits templates to pixels rather than memorizing instances (frozen backbone, 50 epochs, 2000 steps, lr 1e-4).`
   - Evidence: `README.md:49-129`, `tools/template_renderer/render_templates.py:34-70`, `tools/ram_training/train_bop.py:152-178,231-317,487-511`
   - Overclaim risk: low — code-verified; "designed" = designed the scheme understanding, not claiming original authorship of train_bop.py.

4. `Decoupled the runtime into four inspectable stages from object discovery to Fairino execution, drawing the hard contract at the object representation and keeping a 100^3 voxel planner + MoveL/MoveC motion layer deterministic and auditable.`
   - Evidence: `README.md:184-193`, `step1_grounding.py:76-191`, `step2_ram.py:221-363`, `step3_planning.py:155-211`, `step4_conducting.py:149-205`, `planner/path_planner.py:27-129`, `controller/fairino_arm.py:45-191`
   - Overclaim risk: low — architecture code-verified.

Results line (attributed, never as own measurement): `Reported across 14 manipulation tasks / 31 objects with zero-shot real-world execution and CO3D generalization (Chen et al., Science Robotics 2026); repo ships the full code path but no benchmark logs.`

## Open Gaps

- The full stack was not run locally because the large external checkpoints and SDK dependencies (Grounded-SAM-2, VGGT, DINOv2-B/14, Fairino SDK, RAM templates) are not vendored here.
- No local benchmark logbook exists, so every quantitative claim on the public page is paper-attributed; do not present any percentage as a local measurement.
- The paywalled Science Robotics numbers (per-task success, baseline deltas) could not be retrieved this session (DOI 403, no preprint). Only 14 tasks / 31 objects is publicly confirmed.
- Strongest next artifact for interview depth: a small reproducibility log with one successful dry run and a short ablation on `ram_k` or template views — converts "design I understand" into "design I measured."
## PLAN-B Voice-to-Intent Pipeline (语音意图全链路)

Project name:
- English: **PLAN-B Voice-to-Intent Pipeline**
- Chinese: **PLAN-B 语音意图全链路**

Mining scope: streaming audio capture, VAD, ASR, NLU, intent recognition, keyword recognition, dialog management, VLM instruction grounding, TTS feedback, and all voice/instruction-understanding model code. Excludes SAM3 segmentation engine, 3D grasp verification internals, navigation, IK, and motor control.

Target project:
- Source focus: `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/src/har_interaction/src/`
- Scoped modules: `audio/`, `asr/`, `nlu/`, `tts/`, `dialog/`, `common/keyword_extract.py`, `common/quick_chat_responses.py`, `common/model_paths.py`, `pipeline/dialog/`, `pipeline/speech/`, `pipeline/mixins/_asr_mixin.py`, `_tts_mixin.py`, `_wake_mixin.py`, `pipeline/segmentation/vlm_box_sam_bridge.py` (VLM bbox bridge only), `inference/har_qwen_inference_client.py`, `inference/remote_inference_client.py`
- Homepage target: `/home/CNS2026391745/Documents/YUEYICHEN/voxintent.html` + `voxintent.js` (published as project **VoxIntent**; replaced the former planb.html/planb.js)
- Architecture diagram: new SVG required (existing module_arch.pdf is aspirational, not factual)

---

## Read Coverage

| Area | Files read | Why it matters | Gap |
| --- | --- | --- | --- |
| Protocol | `AGENTS.md`, `Project Mining Protocol.md`, `personnel page technical content KB.md` | Evidence gates, writing contract, 8-question standard. | None. |
| Robotics KB | 20 HTML pages under `private-kb/public/` | VLM3 coordinate/grounding framing; VLA/WBC style calibration only. | PLAN-B is not a VLA; KB is context, not claim source. |
| Style references | `arch_style/module_arch.pdf`, `ACT_arch.png`, `X-VLA_architechture.jpg` | Visual module-block style. module_arch.pdf found to be aspirational. | module_arch.pdf must be replaced with code-evidence diagram. |
| Audio capture | `audio/alsa_stream_node.py` (551 lines) | ALSA PCM capture, pre-amp, TTS mute, device resolution. | None. |
| VAD quality gate | `asr/vad_quality_gate_asr_node.py` (1362 lines) | 3-tier cascade, Silero v4/v5, adaptive noise floor, hallucination filter. | None. |
| Streaming ASR | `asr/streaming_asr_node.py` (1119 lines), `asr/streaming_engines.py` (361 lines), `asr/cloud_asr_engines.py` (976 lines) | 4-engine router, envelope AGC v5, cloud endpointing, rapid-stitch. | None. |
| Local ASR TRT | `asr/qwen3_asr_trt_runner.py` (129 lines), `asr/har_asr_inference_client.py` (89 lines), `asr/asr_venv_client.py` (82 lines) | Local Qwen3-ASR TensorRT fallback, /dev/shm zero-copy. | None. |
| NLU parser | `nlu/parser.py` (373 lines), `nlu/parser_node.py` (7992 lines), `nlu/parse_voice_bt.py` (256 lines) | Dual-path regex+LLM, post-parse cleanup, VLM dispatch. | None. |
| Cloud/local NLU inference | `nlu/qwen_openai_parse.py` (958 lines), `nlu/qwen3_trt_infer.py` (224 lines), `nlu/qwen_trt_client.py` (127 lines) | HTTP pool + SSE + reasoning-mode disable; local Qwen3-0.6B TRT-LLM. | None. |
| Dialog management | `pipeline/dialog/dialog_manager.py` (368 lines), `dialog/cloud_llm_client.py` (336 lines) | 6-state FSM, ambient rejection scoring, Qwen-max routing. | None. |
| Keyword extraction | `common/keyword_extract.py` (653 lines), `common/quick_chat_responses.py` (56 lines) | 290+ object dict, 6 regex patterns, zh-en translation, sentinel defense, quick chat bypass. | None. |
| TTS | `tts/tts_node.py` (1018 lines), `tts/tts_qwen_client.py` (127 lines) | Edge-tts + Qwen TTS, preset cache, echo guard, Lilith persona. | None. |
| VLM bbox bridge | `pipeline/segmentation/vlm_box_sam_bridge.py` (3912 lines) | Source-pixel xyxy coordinate mapping, letterbox, color routing, VLM prompts. | SAM3 mask internals excluded per scope. |
| Pipeline mixins | `pipeline/mixins/_asr_mixin.py` (461 lines), `_tts_mixin.py` (362 lines), `_wake_mixin.py` (82 lines) | ASR buffer strategy, speech variant routing, wake word FSM. | None. |
| Speech variants | `pipeline/speech/variants.py` (394 lines) | 35+ TTS response categories, persona design. | None. |
| Pipeline node | `pipeline/node/multimodal_pipeline_node.py` (1737 lines), `_node_params.py` (1303 lines), `_node_ros_setup.py` (651 lines) | 13-mixin composition, 180+ ROS2 params, full topic/service map. | None. |
| Model paths | `common/model_paths.py` (182 lines) | Qwen2.5-VL-3B > Qwen3-0.6B priority, TRT engine discovery. | None. |
| Project docs | `project.md` (981 lines), `docs/cyy/算法答辩云文档_new.md` (918 lines) | Reported metrics, P0 audit, field calibration. | None. |
| Config | `config/asr_params.yaml`, `config/parser_params.yaml`, `config/pipeline_params.yaml`, `config/tts_params.yaml` | Production parameter values. | None. |

Total source lines read (speech scope): ~21,300+

---

## Module Map (Speech Pipeline Scope)

| Module | Code | Input | Output | Rate / latency | Key algorithm |
| --- | --- | --- | --- | --- | --- |
| ALSA capture | `alsa_stream_node.py` | Hardware mic (USB) | `AudioStamped` on `/audio/stream` | 16 kHz, 1024-sample blocks (64 ms) | +10dB pre-amp, TTS source mute, device resolution cascade |
| VAD quality gate | `vad_quality_gate_asr_node.py` | `/audio/stream` | Gated audio + `/asr/text` (local fallback) | 512-sample Silero chunks (32 ms) | 3-tier: adaptive energy (P10 floor) -> software AGC (-20 dBFS) -> stateful Silero v4 ONNX [2,1,64] |
| ASR hallucination filter | `vad_quality_gate_asr_node.py:691-780` | ASR text | Cleaned text or rejection | Per-utterance | 24-phrase set + rambling (filler+particle>=20%+hesitation>=2+bigram>=3) + repeat regex + CJK ratio |
| Streaming ASR router | `streaming_asr_node.py` + engines | `/audio/stream` | `/asr/partial`, `/asr/final`, `/asr/text` | 150-300 ms partials (cloud_qwen3) | 4-engine router, envelope AGC v5, cloud endpointing ownership, rapid-stitch |
| cloud_qwen3 engine | `cloud_asr_engines.py:538-976` | Raw PCM (passthrough + AGC) | Sentence-end callbacks | Server VAD (threshold=0.3, silence=600 ms) | WebSocket to dashscope, OpenAI-Realtime protocol, watchdog rebuild |
| cloud_paraformer engine | `cloud_asr_engines.py:1-537` | RMS-gated + hangover + zero-fill PCM | Sentence-end callbacks | max_sentence_silence=1800 ms | DashScope SDK Recognition, heartbeat, idle watchdog 180 s |
| Local Qwen3-ASR TRT | `qwen3_asr_trt_runner.py` + client | Accumulated audio | Full transcription | ~3 GB GPU | TRT conv_frontend + encoder_fp32 + decoder_int8, /dev/shm zero-copy |
| FunASR streaming | `streaming_engines.py:168-290` | 600 ms chunks | Streaming transcription | encoder lookback 4, decoder lookback 1 | Subprocess worker, JSON-over-stdin/stdout RPC |
| Envelope AGC v5 | `streaming_asr_node.py:357-410` | Float32 audio | Gain-adjusted audio | Per-chunk | (1) fast peak ceiling at 0.85, (2) envelope follow attack/release=0.30, (3) silence creep 0.06/chunk (~2.4 s to max), (4) tanh soft-clip knee=0.9 |
| NLU parser | `parser.py` + `keyword_extract.py` | ASR text | JSON intent + entities | <1 ms regex, ~300 ms LLM | Dual-path: 6 action regex templates -> qwen3.5-flash JSON (temp=0, 28 tokens) |
| Post-parse cleanup | `parse_voice_bt.py` | NLU output | Corrected intent | Per-parse | 7-step BT: color backfill -> hallucinated-place strip -> chat reply -> object_en registration -> fused SAM3 trigger |
| Dialog manager | `dialog_manager.py` | ASR text + pipeline state | Route decision | Per-utterance | 6-state FSM, 3-score system (directed/ambient/task), 12 regex gates |
| Cloud dialog LLM | `cloud_llm_client.py` | User text + context | Intent routing + turn-complete | Timeout 3 s | Qwen-max, coreference resolution, temperature=0.1 |
| Keyword extraction | `keyword_extract.py` | Chinese text | Intent dict or None | <1 ms | 6 priority-ordered regex: BA_ACTION_LOC -> BA_ACTION -> BA_PUT_INTO -> VERB_OBJ -> PLACE_ONLY -> OBJ_PUT_LOC |
| zh-en translation | `keyword_extract.py:380-520` | Chinese object name | English SAM3 prompt | Cache hit: <1 ms; active: ~200 ms | 290+ dict -> runtime cache -> color decomposition -> substring match -> active Qwen -> sentinel blacklist |
| Quick chat | `quick_chat_responses.py` | ASR text | Canned response or None | <1 ms | 5 regex rules for time/date/weekday |
| Wake word | `_wake_mixin.py` | ASR text | Session activation | Immediate | "莉莉丝" detection -> active session -> idle prompt timer -> clear |
| VLM bbox bridge | `vlm_box_sam_bridge.py` | RGB + task text | Source-pixel xyxy bbox | TTFB 850-2950 ms (full-res), 500-2500 ms (max_side=512) | OpenAI-compatible HTTP, 0~1000 -> pixel decode, letterbox layout, color/category guards, label rejection |
| TTS engine | `tts_node.py` + `tts_qwen_client.py` | Text + voice | Audio playback + `/tts/playback_active` | Preset: ~0 ms; edge-tts stream: ~500 ms first audio | Priority: preset cache -> edge-tts (XiaoxiaoNeural) -> Qwen TTS (Vivian), circuit breaker |
| TTS echo guard | `alsa_stream_node.py:374-415`, `streaming_asr_node.py:545-576` | `/tts/playback_active` | Audio frame drop / zero-fill | Duration of TTS + 350 ms post-guard | PulseAudio source mute + PCM zero-fill (not AEC) |
| ASR pipeline mixin | `_asr_mixin.py` | `/asr/text` | Pipeline dispatch | Per-utterance | Language filter -> stop-op -> rambling -> wake -> keyword -> buffer stitch -> regex -> dialog routing |
| TTS pipeline mixin | `_tts_mixin.py` | Speech category | Preset/synth playback | Per-event | Variant pool selection, per-task once-gate dedup, dual cooldown |
| Speech variants | `variants.py` | Category key | Randomized TTS text | Per-event | 35+ categories x 2-7 variants, Lilith persona, template placeholders |

---

## Evidence Table

Claims not listed here must not enter homepage or resume copy.

| # | Claim | Evidence | Type | Confidence |
| --- | --- | --- | --- | --- |
| 1 | Audio input is 16 kHz mono ALSA PCM with +10 dB software pre-amp | `alsa_stream_node.py:195-198`, `:271-272`, `:308-320` | code | high |
| 2 | TTS echo is suppressed by playback_active zero-fill + PulseAudio source mute, not AEC | `alsa_stream_node.py:374-415`, `streaming_asr_node.py:545-576`, `tts_node.py:560-600` | code | high |
| 3 | No AEC, SSL, beamforming, SE, voiceprint (CAM++), or emotion recognition exists in code | Full codebase grep returns zero module implementations | code (absence) | high |
| 4 | VAD is 3-tier cascade: adaptive energy (P10 noise floor + margin) -> software AGC (-20 dBFS, max +30 dB, no attenuation) -> stateful Silero v4 ONNX h/c [2,1,64] | `vad_quality_gate_asr_node.py:176-187`, `:208-216`, `:289-295`, `:351-414`, `:492-544` | code | high |
| 5 | Field-calibrated noise floor -46 dB, speech -39 dB, margin 6 dB | `docs/cyy/算法答辩云文档_new.md:209-239` | measurement doc | medium |
| 6 | Stateful Silero fix: h/c preserved across ROS callbacks; without it, far-field hit was 0% | `vad_quality_gate_asr_node.py:360-374`, `docs/cyy/算法答辩云文档_new.md:239` | code + measurement | medium |
| 7 | Reported far-field Silero hit rate: 0% -> 92% | `docs/cyy/算法答辩云文档_new.md:61`, `:239`, `:292` | measurement doc | medium |
| 8 | Default ASR engine is cloud_qwen3 (qwen3-asr-flash-realtime) with server VAD | `config/asr_params.yaml:76`, `cloud_asr_engines.py:538-976` | config/code | high |
| 9 | 4-engine ASR router: cloud_qwen3, cloud_paraformer, local Qwen3-ASR TRT, FunASR; cloud falls back to local | `streaming_engines.py:297-361` | code | high |
| 10 | cloud_qwen3 uses WebSocket to dashscope with OpenAI-Realtime protocol | `cloud_asr_engines.py:590-640` | code | high |
| 11 | cloud_paraformer uses DashScope SDK Recognition with heartbeat and max_sentence_silence=1800 ms | `cloud_asr_engines.py:100-200` | code | high |
| 12 | Envelope AGC v5: fast peak ceiling (0.85) + envelope follow (attack/release=0.30) + silence creep (0.06/chunk, ~2.4 s to max) + tanh soft-clip (knee=0.9) | `streaming_asr_node.py:357-410` | code | high |
| 13 | Cloud endpointing ownership: cloud sentence_end callback drives publish_final; local EOU disabled except 20 s watchdog | `streaming_asr_node.py:292-315` | code | high |
| 14 | Rapid-stitch: short verb-head finals (<=3 chars, 14 prefix hints) buffered 1.5 s for concatenation | `streaming_asr_node.py:826-900` | code | high |
| 15 | Reported ASR streaming partial latency: 150-300 ms | `docs/cyy/算法答辩云文档_new.md:61`, `:291-323` | measurement doc | medium |
| 16 | ASR hallucination post-filter: 24-phrase frozen set + rambling detection + repeat regex + CJK ratio >30% | `vad_quality_gate_asr_node.py:691-780` | code | high |
| 17 | NLU dual-path: 6 action regex templates (known-object whitelist required) -> qwen3.5-flash JSON (temp=0, max_new_tokens=28) | `keyword_extract.py:37-79`, `parser.py:101-127`, `config/parser_params.yaml:9-14` | code/config | high |
| 18 | 6 regex patterns in priority order: BA_ACTION_LOC, BA_ACTION, BA_PUT_INTO, VERB_OBJ, PLACE_ONLY, OBJ_PUT_LOC | `keyword_extract.py:37-79` | code | high |
| 19 | Intent schema: pick_up, pick_and_place, place_only, move_to, chat, unknown | `parser.py:11-24`, `:36-44` | code | high |
| 20 | qwen3.5-flash reasoning mode explicitly disabled (enable_thinking: False) to avoid 5-30 s reasoning latency | `qwen_openai_parse.py:280-295` | code | high |
| 21 | HTTP connection pool: 8 connections/host, 45 s idle TTL, 30 s keep-alive ping, TCP_NODELAY + SO_KEEPALIVE | `qwen_openai_parse.py:45-80` | code | high |
| 22 | SSE early JSON return via bracket-depth tracking; background thread drains for connection reuse | `qwen_openai_parse.py:320-380` | code | high |
| 23 | Local NLU fallback: Qwen3-0.6B TensorRT-LLM; TRT-LLM 0.12 MODEL_MAP hack for Qwen3ForCausalLM | `qwen3_trt_infer.py:40-55` | code | high |
| 24 | 290+ zh-en object dictionary covering fruits, vegetables, food/drinks (including brand names), containers, daily items, toys | `keyword_extract.py:90-370` | code | high |
| 25 | Translation sentinel blacklist: 15 toxic labels prevent VLM "unknown" from polluting cache | `keyword_extract.py:430-445` | code | high |
| 26 | 5-layer semantic defense: (1) regex whitelist recovery, (2) ASR color backfill, (3) hallucinated-place stripping, (4) sentinel filtering, (5) VLM-SAM3 contradiction rejection | `parse_voice_bt.py:51-149`, `keyword_extract.py:430-445`, `parser.py:183-211` | code | high |
| 27 | Dialog manager: 6 states (IDLE, TASK_EXECUTING, HOLDING_OBJECT, AWAITING_CLARIFICATION, CHAT_SESSION, ERROR_RECOVERY) | `dialog_manager.py:55-90` | code | high |
| 28 | Dialog scoring: directed_score (+0.75 direct address, +0.60 quick chat, +0.35 question, +0.45 followup), ambient_score (+0.80 fragment, +0.85 narration), task_score (0.9 holding+place) | `dialog_manager.py:195-280` | code | high |
| 29 | Cloud dialog LLM: Qwen-max, coreference resolution (last_target, last_destination), temperature=0.1, timeout=3 s | `cloud_llm_client.py:50-100`, `:180-240` | code | high |
| 30 | Turn-complete endpoint detection: Qwen-max judges partial text completeness | `cloud_llm_client.py:250-290` | code | high |
| 31 | VLM bbox bridge: 0~1000 normalized -> source-pixel xyxy; SAM3 receives input_boxes_pixel_xyxy | `vlm_box_sam_bridge.py:151-213` | code | high |
| 32 | VLM prompt includes spatial constraints, attribute matching, brand/color disambiguation, category guards | `vlm_box_sam_bridge.py:2200-2400` | code | high |
| 33 | Color routing moved to VLM bbox stage; HSV rerank disabled by default | `parser_node.py:326-334`, `config/parser_params.yaml:49-55` | code/config | high |
| 34 | TTS priority chain: preset cache (0 ms) -> edge-tts streaming (~500 ms) -> Qwen TTS subprocess; circuit breaker (3 fails = 60 s cooldown) | `tts_node.py:660-705`, `:430-500` | code | high |
| 35 | TTS voices: Lilith persona forces female (edge-tts: zh-CN-XiaoxiaoNeural; Qwen: Vivian) | `tts_node.py:91-108` | code | high |
| 36 | 35+ TTS speech variant categories x 2-7 variants each, consecutive-repeat suppression | `variants.py:10-394` | code | high |
| 37 | Quick chat bypass: 5 regex rules for time/date/weekday, saves ~400 ms | `quick_chat_responses.py:1-56` | code | high |
| 38 | Wake word: "莉莉丝" detection -> active session -> idle prompt -> clear | `_wake_mixin.py:1-82` | code | high |
| 39 | ASR buffer strategy: overlap stitch via longest suffix-prefix match, location keyword triggers immediate dispatch | `_asr_mixin.py:180-250` | code | high |
| 40 | Reported SAM3 small-object mask success: 4/44 (box-only) -> >=90% (box+text grounding) | `docs/cyy/算法答辩云文档_new.md:555-570` | measurement doc | medium |
| 41 | Barge-in disabled by default; TTS echo guard uses zero-fill + source mute | `config/asr_params.yaml:123`, `streaming_asr_node.py:150,169,653-656` | config/code | high |
| 42 | Pipeline readiness aggregator waits for ASR, qwen_api, vlm_http, sam3_fused, serve (180 s timeout) | `multimodal_pipeline_node.py:324-355` | code | high |

---

## Eight Technical Questions

| Question | Answer | Evidence |
| --- | --- | --- |
| **What problem does this own?** | A real-robot voice-to-intent interaction boundary: from raw 16 kHz ALSA PCM through VAD, 4-engine ASR, dual-path NLU, dialog management, VLM instruction grounding, and TTS feedback to downstream execution. Does NOT own ASR model training, SAM3 engine, 3D grasp verification, navigation, IK, or motor control. | `launch/full_pipeline.launch.py`, `docs/cyy/算法答辩云文档_new.md:33-37` |
| **What model stack is used?** | *ASR:* cloud_qwen3/qwen3-asr-flash-realtime (primary), cloud_paraformer/paraformer-realtime-v2, local Qwen3-ASR TRT, FunASR. *VAD:* Silero v4 ONNX. *NLU:* qwen3.5-flash (cloud) / Qwen3-0.6B (local TRT). *Dialog:* Qwen-max (cloud). *VLM:* Qwen-compatible VLM HTTP (qwen-vl-plus). *TTS:* edge-tts (XiaoxiaoNeural) / Qwen TTS (Vivian). | `config/asr_params.yaml:76`, `config/parser_params.yaml:28-34`, `cloud_asr_engines.py:538-976`, `cloud_llm_client.py:50-100`, `tts_node.py:91-108` |
| **What crosses module boundaries?** | `/audio/stream` (AudioStamped PCM) -> `/asr/text` (String) -> ParseVoiceCommand service (intent JSON + entities) -> VLM HTTP (RGB JPEG + task text -> bbox JSON) -> SAM3 (pixel_boxes_xyxy + English text) -> PerceptionResult (mask/bbox/centroid/metadata) -> `/tts/playback_active` (Bool). Dialog context: DialogContext dataclass with last_target, last_destination, exec_state. Translation: ZH_EN_OBJECT_MAP dict + runtime cache. | `alsa_stream_node.py:195`, `streaming_asr_node.py:333-340`, `parser.py:298-360`, `vlm_box_sam_bridge.py:151-213`, `dialog_manager.py:20-40` |
| **What runs at what rate?** | Audio: 16 kHz, 1024-sample blocks (64 ms). Silero VAD: 512-sample chunks (32 ms). ASR partials: 150-300 ms (cloud_qwen3). NLU regex: <1 ms; qwen3.5-flash: ~300 ms. VLM bbox TTFB: 850-2950 ms (full-res) / 500-2500 ms (max_side=512). TTS preset: ~0 ms; edge-tts: ~500 ms. AGC v5 silence-to-max: ~2.4 s. | `alsa_stream_node.py:195`, `vad_quality_gate_asr_node.py:187`, `streaming_asr_node.py:357-410`, `docs/cyy/算法答辩云文档_new.md:61` |
| **What was trained?** | No model training claimed. All ASR/NLU/VLM/TTS models are off-the-shelf cloud APIs or pre-trained checkpoints. Engineering work: prompt design, runtime routing/calibration, coordinate contracts, noise/hallucination filtering, dialog FSM design, AGC signal processing, failure-cascade diagnosis. | Evidence by absence: no training scripts, loss curves, or dataset construction |
| **What was measured?** | (1) ASR partial latency: 150-300 ms. (2) Far-field Silero hit rate: 0% -> 92%. (3) SAM3 mask success (44-trial): 4/44 -> >=90%. (4) AGC v5 far-field recovery: ~2.4 s. All from field reports, not formal benchmarks. | `docs/cyy/算法答辩云文档_new.md:61-64`, `:239`, `:555-570` |
| **What was hard?** | (1) Silero h/c state loss across ROS callbacks (fix: stateful_silero=True). (2) Cloud vs local endpointing conflict (fix: ownership transfer). (3) TTS echo contaminating ASR (fix: zero-fill + source mute). (4) ASR splitting verb-head commands (fix: rapid-stitch 1.5 s buffer). (5) VLM/SAM3 coordinate misalignment (fix: source-pixel bbox contract). (6) LLM hallucinating place locations (fix: place-verb regex guard). (7) Translation cache pollution (fix: sentinel blacklist). (8) Qwen3 reasoning mode adding 5-30 s latency (fix: enable_thinking=False). (9) Ambient speech false triggers (fix: 3-score dialog gating). | Respective code locations in evidence table |
| **What remains unproven?** | (1) No ASR WER benchmark. (2) No NLU intent accuracy table. (3) No dialog routing precision/recall. (4) No VLM grounding mAP. (5) No end-to-end task success table. (6) Metrics are module-level field reports. | Evidence gaps |

---

## Reviewer Critique

| Dimension | Score /10 | Evidence | Concern | Wording/fix |
| --- | --- | --- | --- | --- |
| Novelty | 5 | Integration of off-the-shelf models with engineering fixes. | Not a new model architecture. | Frame as deployment engineering with specific failure diagnosis. |
| Engineering depth | 9 | AGC v5, 3-tier VAD, 4-engine router, dual-path NLU, 5-layer defense, dialog FSM, translation sentinel, coordinate contracts. | Hard to reproduce without field hardware. | Lead with interfaces, thresholds, and failure-fix pairs. |
| System integration | 9 | 21,300+ lines, 13-mixin pipeline, ROS2 topic/service map, 180+ parameters. | Downstream execution is collaborator-owned. | Keep scope boundary explicit. |
| Real robot | 8 | Jetson AGX Orin, field calibration. | No synchronized video+log artifacts for every metric. | Use "field-reported" for metrics from docs. |
| Evaluation | 4 | Module-level field metrics only; no formal benchmark or ablation. | Weakest dimension. | Do not claim "robust" without formal evaluation. |
| Reproducibility | 6 | Config and code are line-traceable; models named. | API keys, hardware not packaged. | Provide source/config evidence, not install promises. |
| Homepage readiness | 7 | Strong code evidence. Architecture diagram needs complete redraw. | module_arch.pdf is aspirational. | New SVG from code evidence. |
| Resume readiness | 8 | Bullets can cite model names, mechanisms, field metrics. | Overclaim risk around aspirational modules. | Use code-verified modules only. |

**Hiring manager first question:**
"Walk me through what happens when the user says '把红色杯子放到白色篮子里' in a noisy room." -> Answer with full pipeline: ALSA +10dB -> TTS mute check -> adaptive energy (P10 floor) -> AGC (-20 dBFS) -> Silero v4 (stateful h/c) -> cloud_qwen3 passthrough + envelope AGC v5 -> server VAD endpointing -> rapid-stitch if split -> hallucination filter -> dialog manager (directed_score >= 0.55) -> regex match BA_PUT_INTO -> intent=pick_and_place, target=红色杯子, location=白色篮子 -> color backfill check -> translate_for_sam3 ("red cup", "white basket") -> VLM bbox -> source-pixel xyxy -> TTS "收到" preset with source mute.

---

## Architecture Diagram Audit (module_arch.pdf vs Code)

### Modules in diagram that DO NOT exist in code

| Diagram module | Code reality | Action |
| --- | --- | --- |
| 回声消除 AEC | Zero AEC code. Echo suppressed by playback_active zero-fill + PulseAudio source mute. | **Remove**. Replace with "TTS Echo Guard". |
| 声源定位 SSL | No SSL. Single-channel ALSA, input_channel_index selects from multi-channel device. | **Remove**. |
| Beamforming | No beamforming. Single-channel USB mic extraction. | **Remove**. |
| 语音增强 SE | No neural SE. Closest: +10 dB pre-amp + envelope AGC v5. | **Replace** with "Software AGC". |
| 声纹识别 CAM++ | Zero voiceprint code. | **Remove**. |
| 情感识别 | No emotion recognition. | **Remove**. |
| 情感风格映射 / 情感自适应TTS | Fixed Lilith persona, not emotion-adaptive. | **Replace** with "Lilith Persona TTS". |
| SenseVoice (primary ASR) | Only fallback model path check; primary is cloud_qwen3. | **Replace** with "4-engine ASR router". |
| 共享Encoder | No shared audio encoder. | **Remove**. |
| MiDaS | Depth from hardware camera SHM. | **Remove** (out of speech scope). |
| 直接生成语音信号 | Conventional TTS synthesis. | **Remove**. |

### Modules in code but MISSING from diagram

| Missing module | Importance |
| --- | --- |
| NLU Intent Parser (6 regex + qwen3.5-flash JSON) | **Critical** |
| Dialog Manager (6-state FSM, 3-score ambient rejection) | **Critical** |
| Cloud Dialog LLM (Qwen-max routing + turn-complete) | **High** |
| 4-Engine ASR Router (cloud_qwen3/paraformer/TRT/FunASR) | **Critical** |
| Envelope AGC v5 (peak ceiling + follow + silence creep + soft-clip) | **High** |
| 3-Tier VAD Quality Gate (energy + AGC + stateful Silero) | **High** |
| ASR Hallucination Post-Filter | **High** |
| 290+ Object Dictionary + zh-en Translation Cache | **High** |
| 5-Layer Semantic Defense Cascade | **High** |
| Translation Sentinel Blacklist | **High** |
| VLM Bbox Bridge (source-pixel xyxy) | **High** |
| Wake Word Module (session FSM) | **Medium** |
| Quick Chat Responses (bypass) | **Medium** |
| Cloud Endpointing Ownership Transfer | **High** |
| Rapid-Stitch (verb-head buffering) | **Medium** |
| TTS Preset Cache | **Medium** |
| HTTP Connection Pool + SSE Early JSON | **Medium** |
| Qwen3 Reasoning Mode Disable | **Medium** |

**Verdict:** module_arch.pdf is fundamentally aspirational — ~10 unimplemented modules shown, ~18 implemented modules missing. Complete redraw required.

---

## Three English Resume Bullets

### Bullet 1: Voice Front-End & ASR

**English bullet:**
Engineered a field-calibrated voice front-end on Jetson AGX Orin: 3-tier cascaded VAD (adaptive P10 noise floor + software AGC + stateful Silero v4 ONNX h/c [2,1,64]), envelope AGC v5 (fast peak ceiling, silence-creep far-field recovery in ~2.4 s), and a cloud-first 4-engine streaming ASR router (qwen3-asr-flash-realtime / paraformer-realtime-v2 / Qwen3-ASR TRT / FunASR) with cloud endpointing ownership transfer and rapid-stitch verb-head buffering, achieving 150-300 ms ASR partials and 0->92% far-field VAD hit rate in field tests.

**Chinese rationale:**
压缩了硬件平台、VAD 三层级联（每层具体到算法名和参数）、AGC v5 的 4 个阶段、4 引擎 ASR 路由（具体到每个引擎模型名）、两个关键工程修复（endpointing ownership + rapid-stitch）、两个实测指标。所有信息可追溯到代码。

**Predicted interviewer follow-up:**
"Why did stateful Silero matter?" -> ROS callback delivers 1024 samples = 2 Silero chunks. Without state carry-over, RNN sees only 64 ms context, insufficient for weak far-field speech vs noise. Field logs: speech=0 despite peak 26063. With stateful_silero=True, RNN accumulates context naturally.

**Evidence:** `vad_quality_gate_asr_node.py:351-414`, `streaming_asr_node.py:357-410,292-315,826-900`, `cloud_asr_engines.py:538-976`, `docs/cyy/算法答辩云文档_new.md:61,239`

**Risk:** "Engineered" defensible (implementation ownership). "Field-calibrated" defensible (documented on-site tuning). Do not extend to ASR model training.

### Bullet 2: NLU & Dialog Intelligence

**English bullet:**
Architected a dual-path command-understanding layer with context-aware dialog routing: 6 priority-ordered Chinese action regex templates against a 290+ object whitelist, qwen3.5-flash OpenAI-compatible JSON NLU (temperature=0, 28-token cap, reasoning mode disabled), a 6-state dialog manager rejecting ambient speech via 3-score (directed/ambient/task) multi-dimensional gating, and a 5-layer semantic defense cascade (whitelist recovery, ASR color backfill, hallucinated-place stripping, translation sentinel filtering, VLM-SAM3 contradiction rejection).

**Chinese rationale:**
核心是指令理解的多层防御架构：正则快速路径（6 模板 + 290+ 白名单）-> LLM（qwen3.5-flash，禁用 reasoning）-> 对话管理器（6 状态 FSM + 三维评分）-> 5 层语义防御。每层代码可查。

**Predicted interviewer follow-up:**
"How does the dialog manager distinguish directed speech from ambient?" -> directed_score (+0.75 direct address "莉莉丝/帮我/请问", +0.45 followup within 12 s), ambient_score (+0.85 third-person narration, +0.80 fragments), completion_score. Route requires directed_score >= 0.55 or wake word active.

**Evidence:** `keyword_extract.py:37-79,90-370,430-445`, `parser.py:11-24,101-127`, `dialog_manager.py:55-90,195-280`, `parse_voice_bt.py:51-149`, `qwen_openai_parse.py:280-295`

**Risk:** "Architected" slight overclaim if some regex existed before; defensible as multi-layer defense design. "290+ object whitelist" is exact count.

### Bullet 3: VLM Instruction Grounding & TTS Feedback

**English bullet:**
Integrated VLM-grounded instruction understanding into a ROS2 perception pipeline: Qwen-compatible VLM HTTP bbox extraction decoded from 0~1000 normalized to source-pixel xyxy with letterbox alignment and category/color guards, Chinese-to-English prompt translation via 290+ dictionary with runtime cache and sentinel anti-pollution defense, and a multi-engine TTS feedback loop (preset cache / edge-tts streaming / Qwen TTS) with playback-active echo suppression replacing planned AEC -- field-reported small-object grounding improved from 9% (4/44 box-only) to >=90% (box+text).

**Chinese rationale:**
VLM 指令理解（坐标映射、翻译系统、sentinel 防污染）和 TTS 反馈闭环（多引擎 + echo 抑制）压缩在一起，明确 AEC 是计划未实现被替换为 playback-active 方案。包含量化指标（4/44->>=90%）。

**Predicted interviewer follow-up:**
"How does the coordinate contract prevent VLM and SAM3 from decoding in different image planes?" -> _bbox_1000_to_xyxy maps VLM 0~1000 to pixel coordinates on original image (x/1000*W, y/1000*H). SAM3 receives input_boxes_pixel_xyxy and handles letterbox internally. Both operate on same source image.

**Evidence:** `vlm_box_sam_bridge.py:151-213,2200-2400`, `keyword_extract.py:380-520,430-445`, `tts_node.py:660-705`, `docs/cyy/算法答辩云文档_new.md:555-570`

**Risk:** "replacing planned AEC" is factual. ">=90%" from 44-trial field report, not formal benchmark -- state "field-reported". Do not claim VLM model ownership.

---

## Public Wording Boundaries

**Use:**
- "voice-to-intent pipeline"
- "3-tier cascaded VAD" (energy + AGC + stateful Silero)
- "4-engine streaming ASR router"
- "envelope AGC v5"
- "cloud endpointing ownership transfer"
- "dual-path NLU: 6 regex + qwen3.5-flash JSON"
- "6-state dialog manager with 3-score ambient rejection"
- "5-layer semantic defense cascade"
- "290+ object whitelist"
- "translation sentinel anti-pollution"
- "source-pixel xyxy bbox contract"
- "TTS echo guard (playback-active zero-fill + source mute)"
- "preset cache / edge-tts / Qwen TTS"
- "field-reported" for all metrics

**Never claim (not in code):**
- AEC, SSL, beamforming, speech enhancement (SE)
- voiceprint / speaker verification (CAM++)
- emotion recognition, emotion-adaptive TTS
- SenseVoice as primary ASR
- shared audio encoder, MiDaS depth
- any model training
- ASR WER or NLU accuracy benchmark
- "production-grade" without qualifier
