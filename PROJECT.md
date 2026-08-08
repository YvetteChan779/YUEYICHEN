# PLAN-B Mining Record

Target repo: `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot`
Homepage outputs: `planb.html`, `planb.js`, `index.html`, `script.js`
Memory outputs: `PROJECT.md`, `chenyy_cv.md`

Public boundary:
- PLAN-B is a voice-to-grasp perception / routing / verification stack.
- It is not a VLA or flow-matching policy.
- The defensible pipeline is `ASR -> NLU -> VLM -> SAM3 -> depth -> grasp_check -> FSM`.

## 0. Read Coverage

| Area | Files | Notes |
| --- | --- | --- |
| Source code | `src/har_interaction/config/asr_params.yaml`, `src/har_interaction/config/parser_params.yaml`, `src/har_interaction/config/pipeline_params.yaml`, `src/har_interaction/src/nlu/parser.py`, `src/har_interaction/src/pipeline/node/streaming_asr_node.py`, `src/har_interaction/src/pipeline/node/multimodal_pipeline_node.py`, `src/har_interaction/src/pipeline/segmentation/vlm_box_sam_bridge.py`, `src/har_interaction/src/grasp_check/core.py`, `src/har_interaction/src/grasp_check/server.py` | Runtime routing, parser mode, coordinate contract, pipeline mixins, and grasp voting. |
| Docs and measurements | `docs/cyy/算法答辩云文档_new.md`, `docs/PLAN-B_云文档.md`, `project.md` | Public metrics, latency notes, 44-trial grounding result, P0 root-cause audit, and report narrative. |
| Homepage surfaces | `planb.html`, `planb.js`, `index.html`, `script.js` | The redrawn detail page and synchronized homepage card. |
| Visual references | `arch_style/module_arch.pdf`, `Pic/planb/planb-model_architechture.svg`, `Pic/planb/planb-runtime_visualization.svg` | Module-block style and the final PLAN-B figures. |
| Resume references | `excellent cv/gl_cv_bullet_version.txt`, `excellent cv/lfy_cv_bullet.txt`, `excellent cv/分层碰撞机制_末端姿态对.txt` | Grammar extraction for three defensible bullets. |

## 1. System Map

- `16 kHz PCM -> 3-tier VAD -> cloud_qwen3 / paraformer / local ASR -> regex + qwen3.5-flash NLU -> Qwen2.5-VL bbox -> SAM3 -> depth / grasp_check -> 13-mixin FSM -> robot execution`.
- `cloud_qwen3` owns endpointing and the envelope AGC v5 path.
- `vlm_box_sam_bridge.py` keeps bbox coordinates in the original-pixel frame through the letterbox inverse transform.
- `grasp_check` uses point-cloud voting plus tactile verification; the server path has no z_fallback.
- `DialogManager` keeps 12 s follow-up and clarification windows.

## 2. Evidence Table

| Claim | Evidence | Type |
| --- | --- | --- |
| PLAN-B owns the voice entry of the humanoid-robot chain from ASR to grasp verification. | `docs/cyy/算法答辩云文档_new.md:3-8,57-64,637-774` | doc |
| `cloud_qwen3` is the default ASR engine. | `src/har_interaction/config/asr_params.yaml:62-90` | config |
| The cloud ASR path uses envelope AGC v5 and transfers endpointing ownership to the cloud callback. | `src/har_interaction/src/pipeline/node/streaming_asr_node.py:177-315,357-675` | code |
| `qwen3.5-flash` is the NLU model and the parser runs in `regex_then_llm` mode. | `src/har_interaction/config/parser_params.yaml:32-52`, `src/har_interaction/src/nlu/parser.py:9-47,183-360` | config/code |
| `pipeline_params.yaml` sets the SAM3 tracking rate to 4 Hz. | `src/har_interaction/config/pipeline_params.yaml:44-49` | config |
| `vlm_box_sam_bridge.py` inverse-transforms letterboxed bbox coordinates. | `src/har_interaction/src/pipeline/segmentation/vlm_box_sam_bridge.py:1-43,139-220` | code |
| `MultimodalPipelineNode` mixes 13 components and keeps 12 s dialog windows. | `src/har_interaction/src/pipeline/node/multimodal_pipeline_node.py:36-117,193-197` | code |
| `grasp_check` uses 3D voting thresholds and the server path explicitly has no z_fallback. | `src/har_interaction/src/grasp_check/core.py:220-319`, `src/har_interaction/src/grasp_check/server.py:1-12` | code |
| The cloud doc records the 44-trial SAM3 improvement, 60 s -> 3 s target-lost timeout, and the P0 stale-frame audit. | `docs/cyy/算法答辩云文档_new.md:555-600,790-869` | measurement/doc |
| `planb-model_architechture.svg` and `planb-runtime_visualization.svg` are the redrawn public figures. | `Pic/planb/planb-model_architechture.svg`, `Pic/planb/planb-runtime_visualization.svg`, `planb.html` | asset |
| `index.html` and `script.js` publish the same PLAN-B stack on the homepage card. | `index.html:270-282`, `script.js:76-92` | implementation |

## 3. Eight Questions

| Question | Answer | Evidence |
| --- | --- | --- |
| What problem does this own? | The voice entry of a humanoid-robot grasp loop: speech, command parsing, visual grounding, grasp verification, and retry control. | `docs/cyy/算法答辩云文档_new.md:3-8,57-64,637-774` |
| What model stack is used? | Silero v4 VAD, cloud_qwen3 / paraformer / local Qwen3-ASR, `qwen3.5-flash`, Qwen2.5-VL, SAM3, and `grasp_check` inside a 13-mixin FSM. | `asr_params.yaml:62-90`, `parser_params.yaml:32-52`, `multimodal_pipeline_node.py:36-117`, `grasp_check/core.py:220-319` |
| What crosses module boundaries? | 16 kHz PCM, endpointing callbacks, qwen3.5-flash intent fields, original-pixel bbox coordinates, point-cloud votes, and 10D robot-facing commands. | `streaming_asr_node.py:177-675`, `parser.py:183-360`, `vlm_box_sam_bridge.py:1-43,139-220`, `grasp_check/core.py:220-319` |
| What runs at what rate? | ASR partials are documented at 150-300 ms, SAM3 tracking is configured at 4 Hz, dialog windows are 12 s, and target-lost timeout is 3 s. | `docs/cyy/算法答辩云文档_new.md:572-589,790-869`, `pipeline_params.yaml:44-49`, `multimodal_pipeline_node.py:193-197` |
| What was trained? | No new end-to-end policy checkpoint is claimed for the public PLAN-B route; the work is runtime routing, parser configuration, coordinate calibration, and verification thresholds. | `parser_params.yaml:32-52`, `streaming_asr_node.py:177-675`, `grasp_check/core.py:220-319` |
| What was measured? | Far-field VAD hit rate moved 0% -> 92%, SAM3 mask success moved 9% -> >=90%, target-lost timeout moved 60 s -> 3 s, and the grounding table used 44 trials. | `docs/cyy/算法答辩云文档_new.md:555-600,790-869` |
| What was hard? | Endpointing ownership, verb-head stitching, letterbox mismatch, stale shared-memory frames, and the lack of z_fallback in grasp_check. | `streaming_asr_node.py:292-315,517-675`, `vlm_box_sam_bridge.py:1-43`, `docs/cyy/算法答辩云文档_new.md:790-869` |
| What remains unproven? | No controlled end-to-end success benchmark or standalone perception accuracy table was found. | Absence from the read docs and result tables |

## 4. Reviewer Critique

| Dimension | Score | Concern | Fix |
| --- | --- | --- | --- |
| Novelty | 6 | This is a strong integration story, not a new model family. | Frame it as system ownership and interface engineering. |
| Engineering | 8 | Good runtime routing, endpointing, letterbox, and recovery work. | Keep the exact contracts visible in the page and bullets. |
| Evaluation | 5 | Metrics are module-level, not a controlled end-to-end benchmark. | Keep success claims scoped to the measured module. |
| Real robot | 6 | Real deployment is evident, but the public route is still a support/integration story. | Say `deployed`, `calibrated`, and `debugged`, not `solved`. |
| Reproducibility | 7 | Configs and docs are traceable, but there is no unified benchmark table. | Keep file/line evidence attached to every claim. |
| Homepage readiness | 8 | The new SVGs make the architecture readable at a glance. | Keep the card short and metric-led. |
| Resume readiness | 8 | Three bullets are defensible if they stay scoped. | Use ownership verbs and qualify the metrics. |

## 5. Figure Plan

| Figure | Purpose | Style cue | Notes |
| --- | --- | --- | --- |
| `Pic/planb/planb-model_architechture.svg` | Show the module boundary from VAD to grasp verification. | `arch_style/module_arch.pdf`, ACT-style module blocks | First-viewport architecture evidence on `planb.html`. |
| `Pic/planb/planb-runtime_visualization.svg` | Show runtime serialization, barge-in, and target-loss recovery on one timeline. | Compact result-plot style | Supports the `#runtime` section and the results summary. |
| `Pic/planb/sam3_improvement.png`, `Pic/planb/tracking_bargein.png`, `Pic/planb/p0_fix_timeline.png` | Keep the detailed evidence figures for SAM3, barge-in, and the P0 audit. | Existing PNG evidence | These remain supporting figures, not the primary hero visuals. |

## 6. Homepage Translation Notes

- The homepage card should name the actual pipeline first, then the measured deltas, then the limitation.
- The detail page should make the model architecture and runtime visualization first-class evidence, not supporting decoration.
- Keep the public wording inside the module-level boundary: routing, calibration, and verification, not a new trained policy claim.

## 7. Resume Grammar Extracted

| Rule | Migration rule for PLAN-B |
| --- | --- |
| Lead with ownership verbs. | Use `Architected`, `Engineered`, `Calibrated`, `Debugged`, `Optimized`, and `Integrated`. |
| Name the stack early. | Say `cloud_qwen3`, `qwen3.5-flash`, `Qwen2.5-VL`, `SAM3`, `grasp_check`, and `13-mixin FSM`. |
| Put mechanism before metric. | Describe endpointing, letterbox inversion, or point-cloud voting before the percentage or latency. |
| Scope-qualify every number. | Use `documented`, `field-calibrated`, or `reported` so the metric stays defensible. |
| Avoid generic AI language. | Do not say `built an advanced system`, `used multimodal AI`, or `leveraged state-of-the-art`. |
| Keep the sentence shape fixed. | `[verb] + [specific what] + [technical how] + [quantified scope]` |

## 8. Gaps / Residual Risk

- No controlled end-to-end success benchmark was found.
- No standalone perception accuracy table was found.
- `qwen3.5-flash` and `cloud_qwen3` are runtime routing evidence, not a new trained model.
- `planb.html` should be read as integration evidence, not algorithm novelty.

## 9. Implementation Notes

- `planb.html` now includes `planb.js` and the redrawn SVGs.
- `index.html` and `script.js` are synchronized with the same PLAN-B stack.
- `AGENTS.md` is updated for the new SVG assets and the output files.
