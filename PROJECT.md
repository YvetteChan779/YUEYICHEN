# PLAN-B Speech-to-Grasp Interaction Stack

Project name:
- English: **PLAN-B Speech-to-Grasp Interaction Stack**
- Chinese: **PLAN-B 语音理解到抓取交互栈**

Target project:
- Source focus: `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/src/har_interaction/src`
- Project root context: `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot`
- Homepage target: `/home/CNS2026391745/Documents/YUEYICHEN/planb.html` + `planb.js`
- Diagram targets: `Pic/planb/planb-model_architechture.svg`, `Pic/planb/planb-runtime_visualization.svg`

## Read Coverage

| Area | Files read | Why it matters | Gap |
| --- | --- | --- | --- |
| Protocol and writing contract | `Project Mining Protocol.md` (449 lines), `personnel page technical content KB.md` (295 lines), `AGENTS.md` | Defines evidence-first mining, 8 technical questions, resume grammar, page constraints. | None. |
| Full robotics KB | 20 HTML pages under `private-kb/public/` (21,637 total lines by `wc -l`) | Prevents unsupported VLA/WBC claims; VLM3 used for coordinate/text geometry framing. | PLAN-B is not a VLA or learned WBC policy, so VLA model details are style/context only. |
| Style references | `arch_style/ACT_arch.png`, `X-VLA_architechture.jpg`, `module_arch.pdf`, `Retargeting.png`, `plana-robot.jpg` | Confirms module-block, evidence-figure, and rate/interface presentation style. | None. |
| Resume references | `excellent cv/gl_cv_bullet_version.txt`, `lfy_cv_bullet.txt`, `阿秀校招简历.md`, `分层碰撞机制_末端姿态对.txt` | Extracts compressed bullet grammar: strong verb + mechanism + model/interface + metric. | Image-only references were not OCRed beyond available text extracts. |
| PLAN-B source | `launch/full_pipeline.launch.py`, `config/*.yaml`, `src/har_interaction/src/audio`, `asr`, `tts`, `nlu`, `pipeline`, `perception`, `grasp_check` | Source of truth for audio, VAD, ASR, TTS, NLU, VLM/SAM3, FSM, and verification. | Downstream navigation/IK/motor internals are collaborator scope and not mined as owned work. |
| Results docs | `docs/cyy/算法答辩云文档_new.md`, `src/har_interaction/docs/ASR_LATENCY_ANALYSIS.md`, root `project.md` | Holds reported latency, VAD, SAM3, and P0 audit metrics. | Some report prose is stale versus live config, especially barge-in and old grasp-check routing. |

## Robotics Context Map

| KB family | Relevance | Wording impact |
| --- | --- | --- |
| VLM3 / 3D VLM | High. PLAN-B uses VLM text output to carry geometry-like bbox coordinates before SAM3. | Explain normalized bbox/source-pixel contracts and ambiguity control; do not call the system a VLA. |
| WBC / GR00T-WBC style | Medium as interface style only. PLAN-B feeds a lower-level execution chain but does not implement whole-body policy learning. | Separate perception/FSM ownership from downstream navigation, IK, and motor control. |
| ACT / Pi0 / GR00T / Flow Matching VLA | Low. Useful as writing calibration, not as a technical claim. | Do not claim action chunking, flow matching, LoRA, policy training, or benchmark evaluation. |

## Repository Map

| Path | Role | Public relevance | Notes |
| --- | --- | --- | --- |
| `launch/full_pipeline.launch.py` | Launches ALSA audio, ASR node, perception container, TTS, grasp_check, and grasp executor. | High | Default route is `streaming_asr_node`; local `vad_quality_gate_asr_node` is fallback. |
| `config/asr_params.yaml` | ASR/VAD/TTS feedback config. | High | `asr_engine: cloud_qwen3`; `enable_barge_in: false`; qwen server VAD enabled. |
| `config/parser_params.yaml` | NLU, qwen3.5-flash, VLM bbox, SAM3 config. | High | `regex_then_llm`; `vlm_bbox_then_mask`; `openai_http`; `qwen_openai_model: qwen3.5-flash`. |
| `config/pipeline_params.yaml` | FSM, SAM3 tracking, grasp verification, tactile/VLM verification routing. | High | `pick_grasp_check_method: vlm_or_tactile`; `/check_grasp` enabled. |
| `audio/alsa_stream_node.py` | Raw ALSA PCM publisher to `AudioStamped`. | High | 16 kHz, mono, 1024-frame blocks, `/audio/stream`. |
| `asr/streaming_asr_node.py` | Cloud-first ASR node, AGC, qwen3 passthrough, optional barge-in. | High | TTS playback zero-fill/echo guard is live; barge-in is optional and disabled by config. |
| `asr/cloud_asr_engines.py` and `asr/streaming_engines.py` | DashScope qwen3 ASR WebSocket and engine factory. | High | Cloud qwen3 realtime engine, server VAD, fallback to local qwen if cloud fails. |
| `asr/vad_quality_gate_asr_node.py` | Local VAD gate and local ASR fallback. | Medium | Defines adaptive energy + AGC + Silero state handling and ASR noise filters. |
| `tts/tts_node.py`, `tts/tts_qwen_client.py` | TTS feedback, cache, edge-tts, Qwen TTS worker, playback state topics. | High | Publishes `/tts/playback_active` and `/tts/playback_duration`. |
| `nlu/parser.py`, `common/keyword_extract.py` | Intent parsing and keyword extraction. | High | Six action regex templates plus chat/wake phrase handling; qwen path for JSON NLU. |
| `nlu/parser_node.py`, `nlu/parse_voice_bt.py` | ROS NLU service, VLM/SAM3 dispatch, post-parse cleanup. | High | Color routing moved to VLM; translation cache/sentinel filtering; VLM bbox/SAM3 env setup. |
| `pipeline/segmentation/vlm_box_sam_bridge.py`, `sam3_steps.py` | Coordinate bridge and SAM3 visual gates/head scan. | High | Source-pixel bbox contract, SAM3 `input_boxes_pixel_xyxy`, timing logs, mask gates. |
| `perception/perception_container_node.py` | ParserNode + MultimodalPipelineNode in one process. | High | 4-thread ROS executor and direct tracking method injection reduce race/copy overhead. |
| `pipeline/node/multimodal_pipeline_node.py` | Main FSM and mixin composition. | High | ASR -> parse -> SAM3 -> `PerceptionResult` -> TTS/execution workflow. |
| `grasp_check/server.py`, `grasp_check/core.py` | Standalone `/check_grasp` service. | High | SAM3 target+hand batch2 + 3D nearest-neighbor overlap; no z_fallback. |
| `pipeline/mixins/_grasp_mixin.py` | Pick verification orchestration, optional serial VLM/tactile route. | High | Distinct from `grasp_check_server`; `vlm_or_tactile` requires VLM success then tactile confirm. |

## Execution Path

1. `full_pipeline.launch.py` starts `alsa_stream_node`, default `streaming_asr_node`, `perception_container_node`, `tts_node`, `grasp_check_server`, and `grasp_perception_node`.
2. `alsa_stream_node.py` publishes 16 kHz mono PCM as `AudioStamped` on `/audio/stream`.
3. `streaming_asr_node.py` sends cloud_qwen3 audio as passthrough with envelope AGC v5; server VAD owns endpointing and sentence callbacks publish `/asr/final` and `/asr/text`.
4. `VoiceCommandParser` runs `clean_asr_text`, regex fast path when safe, wake/chat routing, and qwen3.5-flash JSON NLU when regex is insufficient.
5. `parse_voice_bt.py` post-processes ASR color backfill, hallucinated-place stripping, chat replies, and object/location English prompt translation.
6. `parser_node.py` dispatches VLM bbox + SAM3 box/text segmentation, then writes mask/bbox/centroid geometry into `PerceptionResult`.
7. `MultimodalPipelineNode` consumes ASR/text and perception states through mixins, publishes navigation/grasp/place states, and routes TTS feedback.
8. Grasp verification can call `/check_grasp` for SAM3 target+hand 3D overlap; current pipeline config uses `vlm_or_tactile` as a serial VLM success plus tactile confirmation route.

## Evidence Table

Claims not listed here should not enter homepage or resume copy.

| Claim | Evidence | Type | Confidence | Public-safe wording |
| --- | --- | --- | --- | --- |
| The launch graph includes audio, ASR, parser/pipeline container, TTS, grasp_check, and grasp executor. | `launch/full_pipeline.launch.py:10-17`, `:156-192`, `:256-296`, `:416-421` | code | high | PLAN-B launches a voice-to-grasp ROS2 chain with audio, ASR, perception container, TTS, grasp verification, and executor nodes. |
| Audio input is 16 kHz mono ALSA PCM on `/audio/stream`. | `config/asr_params.yaml:6-7`, `audio/alsa_stream_node.py:195-198`, `:271-272` | code/config | high | 16 kHz PCM enters the speech stack via `/audio/stream`. |
| Default ASR engine is `cloud_qwen3`, with qwen3-asr-flash-realtime and server VAD. | `config/asr_params.yaml:76`, `:194-208`, `streaming_engines.py:297-319` | config/code | high | The production ASR route is cloud_qwen3/qwen3-asr-flash-realtime with server VAD. |
| Default barge-in is disabled; TTS playback still gates echo by zero-filling while TTS is active. | `config/asr_params.yaml:123`, `streaming_asr_node.py:150,169,545-576,653-656` | config/code | high | Public wording must say TTS echo guard / optional barge-in, not default barge-in. |
| The ASR node publishes `/asr/partial`, `/asr/final`, and `/asr/text`. | `streaming_asr_node.py:333-340`, `:1019-1034` | code | high | Final ASR text is mirrored to `/asr/final` and `/asr/text`. |
| Envelope AGC v5 is applied on cloud_qwen3 passthrough. | `streaming_asr_node.py:357-410`, `:545-585` | code | high | The cloud_qwen3 route applies envelope AGC before cloud feeding. |
| Local VAD quality gate uses adaptive energy, AGC, and Silero ONNX; state can be preserved across calls. | `vad_quality_gate_asr_node.py:176-187`, `:208-216`, `:289-295`, `:351-414`, `:492-544` | code | high | The VAD gate combines adaptive energy, AGC, and stateful Silero diagnostics/local fallback. |
| Reported ASR partial latency is 150-300 ms. | `docs/cyy/算法答辩云文档_new.md:61`, `:209`, `:291-323` | measurement doc | medium | Field report recorded 150-300 ms partials after cloud endpointing fix. |
| Reported far-field Silero hit rate improved from 0% to 92%. | `docs/cyy/算法答辩云文档_new.md:61`, `:239`, `:292` | measurement doc | medium | Field report recorded far-field Silero hit recovery from 0% to 92%. |
| TTS uses preset/runtime cache, edge-tts fast path, Qwen fallback, and publishes playback state. | `tts_node.py:91-108`, `:157-184`, `:237-239`, `:660-705`, `tts_qwen_client.py:50-80`, `:85-126` | code | high | TTS feedback is cached where possible, edge-tts first, Qwen fallback, with playback-active feedback. |
| NLU has six action regex templates plus wake/chat phrase handling, then qwen JSON parsing. | `keyword_extract.py:20-26`, `:37-79`, `:538-652`, `parser.py:298-360` | code | high | Say "six action regex templates plus wake/chat handling", not "7-template regex". |
| qwen3.5-flash NLU is OpenAI-compatible HTTP with temp 0 and 28 token cap in config. | `config/parser_params.yaml:9-14`, `:28-34`, `parser.py:101-127`, `:183-211` | config/code | high | qwen3.5-flash is the structured JSON NLU route with deterministic decoding. |
| Intent schema includes `pick_up`, `pick_and_place`, `place_only`, `move_to`, `chat`, `unknown`. | `parser.py:11-24`, `:36-44` | code | high | Public copy can state six intent types and noise-to-unknown rules. |
| Post-parse cleanup covers color backfill, hallucinated-place stripping, chat reply, translation, and unknown fill. | `parse_voice_bt.py:51-78`, `:93-149`, `:231-255` | code | high | The parser has explicit cleanup before SAM3/VLM dispatch. |
| Color routing was moved to VLM; HSV rerank is disabled by default. | `parser_node.py:326-334`, `config/parser_params.yaml:49-55` | code/config | high | Color/brand disambiguation is routed through the VLM bbox stage, with HSV as rollback. |
| VLM bbox + SAM3 coordinate bridge uses source-pixel xyxy and passes original pixel boxes into SAM3. | `vlm_box_sam_bridge.py:9-32`, `:151-213`, `:2417-2441`, `:3043-3074`, `:3546-3582` | code | high | VLM and SAM3 share the same original image pixel plane; SAM3 receives `input_boxes_pixel_xyxy`. |
| VLM3 KB supports the general idea that VLM text can carry normalized coordinates when ambiguity is controlled. | `private-kb/public/19.VLM3_Architecture.html:183-238`, `:481-511` | KB | medium | Use VLM3 as context for coordinate contracts, not as a PLAN-B component. |
| SAM3 visual gates include logit/area/nonempty checks, head scan, and fresh-frame guards. | `sam3_steps.py:93-155`, `:326-592` | code | high | Visual grounding is gated before publishing downstream masks. |
| Reported SAM3 small-object success improved from 4/44 (~9%) box-only to at least 90% with box+text. | `docs/cyy/算法答辩云文档_new.md:555-570`, `:595` | measurement doc | medium | Field report measured 4/44 to >=90% for the 44-trial small-object scenario. |
| Parser and pipeline run in one perception container with 4 executor threads and direct tracking callbacks. | `perception_container_node.py:6-11`, `:19-32`, `:39` | code | high | ParserNode and MultimodalPipelineNode are colocated to reduce copy/race overhead. |
| Pipeline node is composed of 13 mixins. | `multimodal_pipeline_node.py:37-51`, `:90-102` | code | high | The FSM uses 13 explicit mixins for wake/nav/grasp/TTS/SAM3/camera/RDK/orchestration concerns. |
| Pipeline readiness waits for ASR/qwen_api/VLM/SAM3/serve depending on config. | `multimodal_pipeline_node.py:324-355`, `:374-441` | code | high | Warmup/readiness is explicitly tracked by expected component set. |
| PerceptionResult carries masks, bbox, centroid, area, and capture metadata. | `perception_publish.py:17-38`, `:82-126`, `:143-200` | code | high | Downstream execution receives stamped geometry and capture metadata, not only labels. |
| Standalone `grasp_check_server` uses SAM3 batch2 target+hand and 3D hand-object overlap; it does not use z_fallback. | `grasp_check/server.py:2-12`, `:431-452`, `:512-624`, `:647-651` | code | high | `grasp_check_server` is vision/3D overlap, with no pure-depth z_fallback. |
| 3D overlap thresholds are median 0.055 m, p25 0.045 m, frac<0.03 0.02, frac<0.05 0.08, votes>=1. | `grasp_check/server.py:251-256`, `grasp_check/core.py:220-243`, `:277-306` | code | high | Public copy can state the 3D hand-object nearest-neighbor gates. |
| Pipeline verification config currently enables `/check_grasp` and selects `vlm_or_tactile`. | `config/pipeline_params.yaml:432-456` | config | high | Separate server `grasp_check` from the pipeline's serial VLM/tactile verification route. |
| `vlm_or_tactile` fails on VLM failure and runs tactile polling only after VLM success. | `_grasp_mixin.py:2965-2999`, `:3270-3379`, `:3420-3485` | code | high | Optional tactile confirmation is serial and gated by VLM success, not part of standalone `grasp_check_server`. |
| P0 stale SHM bug caused stale frames, wrong bbox, mask degradation, and retry deadlock; reported fix changed 4 failed retries to closed-loop success. | `docs/cyy/算法答辩云文档_new.md:790-844`, `:860-871` | measurement doc | medium | Reported P0 audit changed the failing retry loop into a closed-loop success path. |
| Target-lost timeout is set to 3 s in parser config. | `config/parser_params.yaml:123`, `parser_node.py:565` | config/code | high | Public copy can state `sam3_lost_timeout_sec=3.0` in current config. |

## Eight Technical Questions

| Question | Answer | Evidence |
| --- | --- | --- |
| What problem does this own? | A real-robot speech-to-grasp interaction boundary: streaming audio, ASR endpointing, NLU, VLM/SAM3 grounding, perception result geometry, TTS feedback, and grasp verification routing. It does not own downstream navigation, IK, or motor control. | `launch/full_pipeline.launch.py:10-17`, `docs/cyy/算法答辩云文档_new.md:33-37`, `multimodal_pipeline_node.py:4-11` |
| What model stack is used? | cloud_qwen3/qwen3-asr-flash-realtime ASR by default; local qwen/cloud_paraformer/FunASR fallback; qwen3.5-flash structured NLU; Qwen-compatible VLM HTTP bbox route; SAM3 mask refinement; optional TTS edge/Qwen path; grasp_check 3D overlap service. | `config/asr_params.yaml:63-76`, `config/parser_params.yaml:28-55`, `tts_node.py:91-108`, `grasp_check/server.py:2-12` |
| What crosses module boundaries? | `/audio/stream` PCM, `/asr/text`, JSON intent/entities, English object/location prompts, VLM bbox in original pixels, SAM3 masks/bboxes/centroids, `PerceptionResult` state and capture metadata, `/tts/playback_active`, `/check_grasp`. | `audio/alsa_stream_node.py:195-198`, `parser.py:11-24`, `vlm_box_sam_bridge.py:9-32`, `perception_publish.py:82-200`, `tts_node.py:237-239` |
| What runs at what rate or latency? | Audio is 16 kHz, ALSA blocksize 1024 samples. Local Silero processes 512-sample/32 ms chunks. Reported ASR partials are 150-300 ms. SAM3 tracking config is 4 Hz. Parser config sets target-lost timeout to 3 s. | `audio/alsa_stream_node.py:195-198`, `vad_quality_gate_asr_node.py:187`, `docs/cyy/算法答辩云文档_new.md:61`, `config/pipeline_params.yaml:49`, `config/parser_params.yaml:123` |
| What was trained? | No end-to-end VLA/policy/model training is claimed for this public route. The work is runtime routing, calibration, parser/VLM prompting, coordinate contracts, segmentation gates, and verification logic. | `config/parser_params.yaml:9-55`, `streaming_asr_node.py:245-315`, `vlm_box_sam_bridge.py:9-32` |
| What was measured? | Reported measurements include ASR partial 150-300 ms, far-field Silero hit 0% to 92%, 44-trial small-object SAM3 success 4/44 to >=90%, and P0 retry loop changing from 4 failed retries to closed-loop success. | `docs/cyy/算法答辩云文档_new.md:61-64`, `:239`, `:555-570`, `:860-871` |
| What was hard? | Endpointing ownership, stateful Silero context, TTS echo contamination, regex/LLM noise handling, VLM/SAM3 coordinate alignment, stale SHM frame reads, and separating standalone 3D overlap from tactile-assisted pipeline verification. | `streaming_asr_node.py:292-315`, `vad_quality_gate_asr_node.py:360-374`, `vlm_box_sam_bridge.py:9-32`, `docs/cyy/算法答辩云文档_new.md:790-844`, `_grasp_mixin.py:2965-2999` |
| What remains unproven? | No public benchmark-style evaluation, no ablation beyond report-level field logs, no end-to-end learned policy result, and no quantified grasp success rate across object categories beyond P0 narrative and module-specific metrics. | Evidence gaps from docs and source review. |

## Reviewer Critique

| Dimension | Score /10 | Evidence | Concern | Wording/fix |
| --- | --- | --- | --- | --- |
| Novelty | 6 | Code integrates ASR/NLU/VLM/SAM3/grasp verification. | Not a new model architecture or VLA training result. | Call it an interaction stack and deployment architecture, not a foundation model. |
| Engineering depth | 9 | Source has endpointing, AGC, coordinate, stale-frame, and verification fixes. | Many fixes are operational and hard to reproduce without logs. | Lead with interfaces and failure modes. |
| System integration | 9 | Launch/container/FSM source shows full ROS2 chain. | Downstream execution is collaborator-owned. | Keep scope boundary explicit. |
| Real robot | 8 | Docs state Jetson AGX Orin and field calibration. | Public page lacks synchronized videos/log artifacts for every metric. | Use "reported field result" where metric is from docs. |
| Evaluation | 6 | 150-300 ms, 0->92%, 4/44->>=90%, P0 audit. | No full task success table by object/location/lighting. | Avoid broad "robust grasping" success claims. |
| Reproducibility | 7 | Config and code are line-traceable. | API keys, robot hardware, SAM3 worker environment are not packaged. | Provide source/config evidence, not install promises. |
| Homepage readiness | 8 | Strong figures exist; SVG needed stale-label correction. | Old page overclaimed barge-in and tactile in `grasp_check`. | Patch figures/page to say TTS echo guard and split tactile route. |
| Resume readiness | 8 | Bullets can cite model names, routes, and metrics. | Overclaim risk around "production-grade" and VLM model exact name. | Use "deployed on Jetson AGX Orin" and measured module metrics only. |

CoRL/RSS reviewer attack:
- "Where is the full task success table?" The defensible answer is that current public metrics are module-level plus P0 audit; no broad benchmark claim is made.
- "Is this a learned policy?" No. It is a speech/vision/FSM interaction stack feeding a collaborator execution chain.
- "Is tactile part of `grasp_check`?" No. The server is SAM3 target+hand + 3D overlap; tactile exists in the pipeline verification route.

Hiring manager first question:
- "How exactly did you prevent ASR/TTS and VLM/SAM3 errors from cascading?" Answer with `/tts/playback_active` zero-fill, cloud endpointing, regex_then_llm, sentinel filtering, source-pixel bbox contract, and stale-SHM P0 audit.

Missing experiment that would strengthen the claim:
- A table of N commands x M objects x K lighting/noise settings with full pick/place success, ASR WER, segmentation success, verification precision/recall, and latency percentiles.

Defensible overclaim:
- "End-to-end speech-to-grasp stack" is defensible because the owned code touches voice input through perception and verification output, but must be paired with collaborator boundary for navigation/IK/motor execution.

## Architecture Diagram Audit

| Existing issue | Evidence | Fix applied/planned |
| --- | --- | --- |
| Diagram/page implied default barge-in is live. | `config/asr_params.yaml:123` sets `enable_barge_in: false`; ASR code only interrupts when `_enable_barge_in` is true at `streaming_asr_node.py:653-656`. | Reword to "TTS echo guard / optional barge-in disabled by default". |
| `grasp_check` box said "3D overlap + tactile". | `grasp_check/server.py:2-12` says SAM3 target+hand + 3D overlap, no z_fallback; tactile is in `_grasp_mixin.py:2965-2999`. | Split server `grasp_check` from optional pipeline `vlm_or_tactile`. |
| NLU said 7 regex templates. | Six action regex objects at `keyword_extract.py:37-79`; chat/wake handled separately. | Reword to "six action regex templates plus wake/chat handling". |
| VLM/SAM3 wording implied VLM always outputs letterbox coordinates and that CLIP is the owned module. | `vlm_box_sam_bridge.py:9-32` says default VLM bbox is source 0-1000 mapped to original pixels; SAM3 receives original pixel boxes. | Reword to original-pixel bbox contract + SAM3 box/text mask refinement. |
| SVG/runtime said tactile confirmation as part of `grasp_check`. | `config/pipeline_params.yaml:432-456` selects pipeline `vlm_or_tactile`; `grasp_check/server.py:647-651` fails without prompt/SAM3 rather than tactile. | Show tactile only as optional pipeline sanity route. |

## Figure Plan

| Figure | Purpose | Required labels | Evidence |
| --- | --- | --- | --- |
| `planb-model_architechture.svg` | Full module topology | ALSA stream, cloud_qwen3, qwen3.5-flash, VLM bbox source pixels, SAM3 box/text, `grasp_check_server`, optional VLM/tactile pipeline, TTS echo guard. | Launch/config/source table above. |
| `planb-runtime_visualization.svg` | Single request timing and runtime contracts | 150-300 ms partials, 0->92%, 4/44->>=90%, TTS echo guard, no default barge-in, no z_fallback. | Measurement docs and code audit. |
| `vad_funnel.png`, `engine_quadrant.png` | Speech evidence | VAD layers and ASR router. | ASR source/config. |
| `sam3_improvement.png`, `letterbox_comparison.png` | VLM/SAM3 result and coordinate risk | 44-trial metric and pixel-coordinate contract. | `docs/cyy/算法答辩云文档_new.md:555-570`, `vlm_box_sam_bridge.py:9-32`. |
| `p0_causal_chain.png`, `p0_fix_timeline.png` | Failure diagnosis | Stale SHM -> wrong bbox -> mask collapse -> retry deadlock. | `docs/cyy/算法答辩云文档_new.md:790-871`. |

## Resume Reference Grammar

| Reference source | Extracted grammar | What to imitate |
| --- | --- | --- |
| `excellent cv/gl_cv_bullet_version.txt` | "Led/Architected/Designed + model stack + training/deployment mechanism + measured result" | Dense technical compression; put model names and metric in the same bullet. |
| `excellent cv/lfy_cv_bullet.txt` | "Responsible for algorithm/system + constraints + measured cycle/success change" | Engineering systems style: constraints, deployment, testing. |
| `excellent cv/阿秀校招简历.md` | "针对问题, 采用技术, 实现结果, 最终指标" | Result-first, data-supported wording; no empty adjectives. |
| `excellent cv/分层碰撞机制_末端姿态对.txt` | "Task definition + model mechanism + validation setting + sim/real metric" | Separate method from validation scope. |

## Three English Resume Bullets

1. **Engineered a cloud-first streaming speech front end on Jetson AGX Orin, routing 16 kHz ALSA PCM through envelope AGC v5 and cloud_qwen3/qwen3-asr-flash-realtime server VAD with cloud_paraformer, FunASR, and local Qwen3-ASR fallbacks; field report recorded 150-300 ms ASR partials and far-field Silero recovery from 0% to 92%.**

Chinese rationale:
This bullet compresses audio capture, ASR routing, model names, hardware, and measured speech metrics. It avoids claiming WER or full task success.

Predicted interviewer follow-up:
How did endpointing ownership change between local VAD and cloud_qwen3, and why did it reduce partial freeze?

Evidence:
- `audio/alsa_stream_node.py:195-198`, `config/asr_params.yaml:76,194-208`, `streaming_asr_node.py:292-315,545-585`, `docs/cyy/算法答辩云文档_new.md:61,239,291-323`

Risk:
- "Engineered" is defensible as implementation/integration ownership. Do not extend it to ASR model training.

2. **Architected a dual-path command-understanding layer combining six action regex templates, wake/chat routing, qwen3.5-flash OpenAI-compatible JSON NLU (temperature 0, 28-token cap), ASR color backfill, hallucinated-place stripping, and Qwen-backed Chinese-to-English prompt caching before VLM/SAM3 dispatch.**

Chinese rationale:
This bullet centers the instruction-understanding stack: regex, LLM NLU, post-parse cleanup, translation, and dispatch boundary. It fixes the old unsupported "7-template" wording.

Predicted interviewer follow-up:
What are the six regex routes, and when do you force the LLM path instead?

Evidence:
- `keyword_extract.py:37-79,538-652`, `parser.py:11-24,101-127,298-360`, `config/parser_params.yaml:9-14,28-34,46-55`, `parse_voice_bt.py:51-149`

Risk:
- "Architected" is a slight overclaim if some modules existed before; defensible if explained as route design and cleanup integration.

3. **Integrated VLM-grounded segmentation and grasp verification into a ROS2 perception container, preserving original-pixel bbox contracts between the Qwen-compatible VLM HTTP route and SAM3 box/text masks, publishing stamped PerceptionResult geometry, and validating grasps through SAM3 target+hand 3D overlap with no z_fallback.**

Chinese rationale:
This bullet is strongest for robotics interviews because it exposes the interface contract: source-pixel bbox, SAM3 masks, PerceptionResult geometry, and grasp verification. It explicitly avoids saying tactile is part of the standalone server.

Predicted interviewer follow-up:
How do you prevent VLM bbox coordinates from being decoded in the wrong image plane before SAM3?

Evidence:
- `perception_container_node.py:6-11,19-32`, `vlm_box_sam_bridge.py:9-32,3043-3074,3546-3582`, `perception_publish.py:82-200`, `grasp_check/server.py:2-12,512-624`, `grasp_check/core.py:220-306`

Risk:
- "Qwen-compatible VLM" is safer than claiming one exact hosted model endpoint unless deployment logs/API config are shown.

## Public Wording Boundaries

Use:
- "speech-to-grasp interaction stack"
- "cloud_qwen3/qwen3-asr-flash-realtime"
- "six action regex templates plus wake/chat handling"
- "qwen3.5-flash OpenAI-compatible JSON NLU"
- "VLM bbox + SAM3 box/text mask refinement"
- "source-pixel bbox contract"
- "TTS echo guard; optional barge-in disabled by default"
- "`grasp_check_server`: SAM3 target+hand batch2 + 3D overlap, no z_fallback"
- "pipeline `vlm_or_tactile`: serial VLM success then tactile confirmation"

Avoid:
- "default barge-in"
- "7-template regex"
- "`grasp_check` tactile baseline verification"
- "z fallback"
- "trained a VLA / policy / action head"
- "end-to-end model"
- "full task success rate" unless a task table is added later.
