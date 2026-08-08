# PLAN-B Resume Bullets

Source gate: `Project Mining Protocol.md`, `personnel page technical content KB.md`, the PLAN-B source tree, and the excellent CV references were read before writing these bullets.

## Excellent CV Grammar Extracted

| Grammar rule | Migration rule for PLAN-B |
| --- | --- |
| Start with ownership verbs. | Use `Architected`, `Engineered`, `Calibrated`, `Debugged`, and `Optimized` because the evidence is about system ownership and integration. |
| Name the stack early. | Put `cloud_qwen3`, `qwen3.5-flash`, `Qwen2.5-VL`, `SAM3`, `grasp_check`, and `13-mixin FSM` in the first clause. |
| Put mechanism before metric. | Describe endpointing, letterbox inversion, or point-cloud voting before the percentage or latency. |
| Scope-qualify metrics. | Use `documented`, `field-calibrated`, or `reported` so the number stays defensible. |
| Avoid generic AI phrases. | Do not say `built an advanced system`, `used multimodal AI`, or `leveraged state-of-the-art`. |
| Fixed sentence shape. | `[verb] + [specific what] + [technical how] + [quantified scope]` |

## Final English Resume Bullets

1. Architected PLAN-B, a Jetson AGX Orin voice-to-grasp pipeline that chains 3-tier VAD, cloud_qwen3 ASR, qwen3.5-flash intent parsing, Qwen2.5-VL + SAM3 grounding, depth-based grasp_check, and a 13-mixin FSM, lifting documented far-field VAD hit rate from 0% to 92% and small-target SAM3 mask success from 9% to >=90%.

   中文解释：这条先把系统边界说清楚，再把语音、语义、视觉、抓取和状态机串成一条完整链路，最后用 0% -> 92% 和 9% -> >=90% 作为可防守的量化锚点。`Architected` 属于轻微 overclaim，但可以防守，因为代码和文档都证明了跨模块集成与页面级重画。

   Predicted interviewer follow-up: What exactly crosses the boundary between ASR, NLU, VLM, SAM3, depth, and grasp_check?

   Evidence:
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/src/har_interaction/config/asr_params.yaml:62-90`
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/src/har_interaction/config/parser_params.yaml:32-52`
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/src/har_interaction/src/pipeline/node/streaming_asr_node.py:177-675`
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/src/har_interaction/src/pipeline/node/multimodal_pipeline_node.py:36-117`
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/src/har_interaction/src/pipeline/segmentation/vlm_box_sam_bridge.py:1-43,139-220`
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/src/har_interaction/src/grasp_check/core.py:220-319`
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/docs/cyy/算法答辩云文档_new.md:555-600,637-774`

   Risk boundary: Do not claim a controlled end-to-end success benchmark; the defensible claim is integrated robot execution plus module-level measurements.

2. Engineered the streaming speech stack with stateful Silero v4 [2,1,64], envelope AGC v5, cloud-owned endpointing, and rapid-stitch recovery for split verb-head fragments, cutting partial ASR latency to 150-300 ms and preventing session-rebuild deadlocks on the cloud_qwen3 path.

   中文解释：这条把语音前端的核心工程点集中在一条里：状态化 VAD、AGC、端点所有权和短动词片段拼接。它比“做了语音识别”更具体，也更容易被追问实现细节。

   Predicted interviewer follow-up: How did you keep the cloud ASR session alive while still allowing barge-in and endpointing?

   Evidence:
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/src/har_interaction/config/asr_params.yaml:62-90`
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/src/har_interaction/src/pipeline/node/streaming_asr_node.py:177-675`
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/docs/cyy/算法答辩云文档_new.md:82-84,182-183,572-589`

   Risk boundary: Keep this as a routing and latency story, not a claim about a new ASR model.

3. Debugged the closed-loop grasp path by tracing one missing ok=True write-complete flag through shared memory, stale VLM frames, SAM3 misalignment, and retry deadlock, then tightened target-lost timeout from 60 s to 3 s and validated grasp_check v1.0.0 voting on median<55 mm, P25<45 mm, frac<3 cm>=2%, and frac<5 cm>=8%.

   中文解释：这条最像优秀简历里的“问题定位 + 修复 + 结果”写法。它把 P0 故障、超时参数和 grasp_check 的 3D 票决放在一起，既像工程 ownership，也能被面试官顺着追问。

   Predicted interviewer follow-up: How did the stale-frame bug propagate into the grasp loop, and why was 3 s the right timeout?

   Evidence:
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/src/har_interaction/src/grasp_check/core.py:220-319`
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/src/har_interaction/src/grasp_check/server.py:1-12`
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/src/har_interaction/src/pipeline/node/multimodal_pipeline_node.py:193-197`
   - `/home/CNS2026391745/Documents/PLAN-B-CYY/planb-robot/docs/cyy/算法答辩云文档_new.md:790-869`

   Risk boundary: Do not turn the P0 fix into an end-to-end benchmark claim; it is a root-cause fix on the reported route.
