(function () {
    'use strict';

    /* ---------- Theme toggle ---------- */
    const toggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const saved = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', saved);

    toggle?.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    /* ---------- Auto year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- i18n ---------- */
    const Y = new Date().getFullYear();
    const footer_en = '&copy; <span id="year">' + Y + '</span> Yueyi Chen. Powered by <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a>.';
    const footer_zh = '&copy; <span id="year">' + Y + '</span> \u9648\u60a6\u6021. \u57fa\u4e8e <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a> \u642d\u5efa\u3002';

    const i18n = {
        en: {
            'back': 'Back to Home',
            /* Hero */
            'hero.title': 'PLAN-B: Voice-to-Grasp Pipeline for Humanoid Robot',
            'hero.venue': 'The Chinese University of Hong Kong',
            'hero.tagline': '3-tier VAD · cloud_qwen3 ASR · qwen3.5-flash NLU · Qwen2.5-VL + SAM3 · grasp_check + 13-mixin FSM',
            'hero.pipeline': 'Pipeline',
            'hero.visuals': 'Visuals',
            'hero.results': 'Results',
            /* Metrics */
            'm.vad': 'ASR partial latency',
            'm.mask': 'Far-field VAD hit rate',
            'm.engines': 'SAM3 mask success',
            'm.mixins': 'Closed-loop FSM mixins',
            /* S0: Overview */
            's0.title': 'Overview',
            's0.p1': 'Deploying voice-controlled grasping on real robots exposed a hard interface problem: far-field speech is buried in noise, small objects defy segmentation models, and grasp attempts fail silently. <strong>PLAN-B</strong> is a Jetson AGX Orin voice-to-grasp pipeline: 16 kHz PCM enters a 3-tier VAD quality gate, routes through cloud_qwen3 / fallback ASR, is parsed by regex + qwen3.5-flash NLU, and becomes a Qwen2.5-VL box prior, SAM3 mask, depth-based grasp_check vote, and 13-mixin closed-loop FSM.',
            's0.c1': 'Engineered a <strong>3-tier cascaded VAD quality gate</strong> (adaptive energy + software AGC + stateful Silero v4 ONNX h/c [2,1,64]), field-calibrated on-site (noise \u221246 dB, speech \u221239 dB, margin 6 dB), boosting far-field hit rate 0% \u2192 92%.',
            's0.c2': 'Architected a <strong>4-engine streaming ASR framework</strong> (cloud_qwen3 / cloud_paraformer / local Qwen3-ASR TRT / FunASR) with envelope AGC v5 (silence-creep + fast peak ceiling + soft-clip), cloud endpointing ownership transfer, and rapid-stitch for verb-head fragments.',
            's0.c3': 'Designed <strong>dual-path NLU</strong> (7-template regex fast-path + qwen3.5-flash LLM, temperature=0, max_new_tokens=28) with a 5-layer semantic defense cascade, and <strong>VLM bbox + CLIP joint grounding</strong> with letterbox alignment, lifting SAM3 mask success 9% → ≥90%.',
            's0.c4': 'Built a <strong>13-mixin pipeline FSM</strong> with 3D multi-feature grasp verification (grasp_check v1.0.0: median<55mm, P25<45mm, frac<3cm≥2%, frac<5cm≥8%) and tactile baseline verification, enabling closed-loop retry with 4-class failure grading.',
            /* Demo */
            'sd.title': 'Runtime Visualization',
            'sd.placeholder': 'One timeline keeps cloud_qwen3 ASR, qwen3.5-flash parsing, Qwen2.5-VL + SAM3 grounding, depth-based grasp_check, and barge-in recovery aligned on Jetson AGX Orin.',
            'sd.cap1': 'Runtime visualization of the serial voice-to-grasp loop: ASR, NLU, VLM-SAM3, depth, grasp_check, and target-lost recovery remain on one timeline.',
            'sd.cap2': 'Barge-in and target-loss recovery stay coupled.',
            'sd.result': 'Serial scheduling avoids GPU thrash while keeping barge-in and target-loss recovery live.',
            /* S1: System Architecture */
            's1.title': 'System Architecture',
            's1.cap': 'Voice-to-grasp architecture on Jetson AGX Orin: 3-tier VAD, cloud_qwen3/qwen3.5-flash routing, Qwen2.5-VL + SAM3 grounding, depth-based grasp_check, closed-loop verification, and downstream execution.',
            's1.scope': '<strong>My scope:</strong> I owned the voice front-end, cloud_qwen3 / paraformer ASR, qwen3.5-flash NLU, VLM-SAM3 visual grounding, depth-based grasp_check, and the 13-mixin closed-loop state machine. Downstream execution (navigation, IK planning, motor control) was handled by collaborators.',
            /* S2: Voice Frontend */
            's2.title': 'Voice Frontend: Field-Calibrated 3-Tier VAD',
            's2.cap1': 'Three-layer VAD cascade: Adaptive Energy Gate \u2192 Software AGC \u2192 Silero v4 (stateful h/c), with field-calibrated thresholds.',
            's2.p1': 'The <code>VadQualityGate</code> class implements a 3-tier cascaded quality gate. <strong>Layer 1</strong> (pre-AGC): adaptive energy filtering with self-calibrating noise floor \u2014 a sliding window collects non-speech energy history, computes P10 percentile as noise floor, and sets threshold = floor + margin. On-site measurements: noise \u2248 \u221246 dB, speech \u2248 \u221239 dB, margin = 6 dB (tight enough to reject background chatter). <strong>Layer 2</strong>: software AGC normalizes RMS to \u221220 dBFS target (max gain +30 dB, upward-only \u2014 never attenuates). <strong>Layer 3</strong>: Silero v4 ONNX on CPU, processing 512-sample chunks (32 ms @ 16 kHz), with h/c separated hidden state [2,1,64].',
            's2.p2': 'The critical fix was enabling <strong>stateful Silero inference</strong> across 64 ms audio blocks. Without <code>stateful_silero=True</code>, each ROS audio callback (1024 samples = 2 Silero chunks) ran Silero from cold-start h/c = zeros \u2014 far too little context for the RNN to distinguish weak speech from noise. Field logs showed <code>speech=0</code> across all windows despite peak amplitude 26063. With cross-call state preservation, the RNN accumulates context naturally, and speech detection recovers.',
            's2.h.postfilter': 'Layer 4: ASR Output Post-Filter',
            's2.p3': 'A 4th layer filters ASR output before downstream dispatch: <strong>hallucination detection</strong> (frozen set of 20+ phantom phrases like \u201c\u5b57\u5e55by\u201d/\u201c\u611f\u8c22\u89c2\u770b\u201d), <strong>rambling detection</strong> (\u22652 of: filler prefix, particle density \u226520%, hesitation words \u22652, bigram repeat \u22653), <strong>repeated phrase removal</strong> (regex <code>(.{2,})\\1+</code>), and <strong>non-CJK/English ratio</strong> (>30% foreign script \u2192 reject). This prevents ASR noise from polluting the NLU.',
            's2.result': 'Far-field Silero hit rate: <strong>0% \u2192 92%</strong> \u2022 VAD discrimination: noise < 0.01, speech > 0.99 \u2022 Noise floor converges in ~15 s',
            /* S3: Streaming ASR */
            's3.title': 'Streaming ASR: Cloud-First 4-Engine Router',
            's3.p1': 'The <code>StreamingAsrNode</code> hosts a pluggable engine router (<code>build_engine()</code>) selecting one of 4 ASR backends at launch. Engine choice determines the audio path, endpointing ownership, and AGC strategy \u2014 the node auto-detects engine capabilities via <code>hasattr(engine, \'set_on_sentence_callback\')</code> and adapts accordingly.',
            's3.th.engine': 'Engine',
            's3.th.backend': 'Backend',
            's3.th.audio': 'Audio Path',
            's3.th.eou': 'Endpointing',
            's3.e1.backend': 'DashScope qwen3-asr-flash-realtime (WebSocket)',
            's3.e1.audio': 'Raw passthrough + envelope AGC v5',
            's3.e1.eou': 'Server VAD (threshold=0.0, silence=1500ms)',
            's3.e2.backend': 'DashScope paraformer-realtime-v2 (hotword)',
            's3.e2.audio': 'RMS gate (280) + hangover (0.6s) + zero-fill',
            's3.e2.eou': 'Cloud endpointing (max_sentence_silence=800ms, heartbeat)',
            's3.e3.backend': 'Local Qwen3-ASR TRT-LLM (~3 GB GPU)',
            's3.e3.audio': 'Local VAD gate + accumulated rerun',
            's3.e3.eou': 'Local EOU (silence \u2265 0.8s)',
            's3.e4.backend': 'FunASR paraformer-zh-streaming (chunk)',
            's3.e4.audio': 'Local VAD gate + 600ms chunks',
            's3.e4.eou': 'Local EOU (silence \u2265 0.8s)',
            's3.h.agc': 'Envelope AGC v5: Silence-Creep + Fast Peak Ceiling',
            's3.p2': 'The <code>cloud_qwen3</code> path applies a 5-iteration envelope-following AGC (<code>_apply_envelope_agc</code>) before feeding raw audio to the cloud. Key design: (1) <strong>fast peak ceiling</strong> \u2014 if <code>peak \u00d7 gain > 0.85</code>, gain is instantly clamped to <code>0.85/peak</code> (no slow release, preventing hard clipping that freezes cloud ASR); (2) <strong>envelope follow</strong> \u2014 when <code>rms > noise_floor (\u221238 dBFS)</code>, gain tracks toward <code>target/rms</code> with attack=0.30 / release=0.30; (3) <strong>silence creep (v5)</strong> \u2014 when <code>rms \u2264 noise_floor</code>, gain slowly rises toward max_gain at <code>attack \u00d7 0.2 = 0.06</code> per chunk (~2.4 s to max), pre-staging for the next far-field utterance; (4) <strong>soft-clip</strong> \u2014 <code>tanh</code> compression above knee=0.9, eliminating harmonic distortion from any residual clipping.',
            's3.h.endpointing': 'Cloud Endpointing Ownership Transfer',
            's3.p3': 'For cloud engines, the node transfers sentence boundary detection to the cloud: <code>engine_owns_endpointing = True</code>. The cloud\u2019s <code>sentence_end</code> callback (<code>_on_cloud_sentence</code>) directly drives <code>publish_final</code>. Local EOU is disabled except as a <code>max_utterance_sec=20s</code> timeout watchdog. This eliminates the destructive pattern where local EOU triggered <code>session.stop()+start()</code> on every silence gap, causing partial count freezes and race conditions between <code>feed()</code> and <code>stop()</code>.',
            's3.h.stitch': 'Rapid-Stitch: Short Verb-Head Buffering',
            's3.p4': 'Cloud ASR sometimes splits a single command at word-boundary pauses (e.g., \u201c\u628a\u201d + 0.8 s pause + \u201c\u68d5\u8272\u73a9\u5177\u718a\u653e\u8fdb\u767d\u8272\u7bee\u5b50\u91cc\u201d \u2192 two finals). The <code>_handle_qwen_final</code> method detects short verb-head finals (\u22643 chars, prefix in {\u628a,\u62ff,\u653e,\u6293,\u7ed9,\u5e2e,\u8bf7,...}) and buffers them for 1.5 s. If a continuation final arrives within the window, the two are stitched; otherwise the short head is published alone.',
            's3.result': 'ASR streaming partial: <strong>150\u2013300 ms</strong> \u2022 Session survival: heartbeat \u2192 no 23 s SDK timeout \u2022 AGC v5 far-field recovery: <strong>~2.4 s</strong> silence-to-max-gain',
            /* S4: NLU + VLM + SAM3 */
            's4.title': 'Dual-Path NLU & VLM-SAM3 Grounding',
            's4.h.nlu': 'Dual-Path Intent Parsing',
            's4.p1': 'The <code>VoiceCommandParser</code> operates in <code>regex_then_llm</code> mode. <strong>Fast path</strong>: 7 regex templates extract intent (pick_up / pick_and_place / place_only / move_to / chat / unknown) and entities from clean commands in <1 ms. <strong>LLM path</strong>: qwen3.5-flash (TRT-LLM or OpenAI-compatible HTTP) with a structured system prompt defining 6 intent types, noise classification rules (garbled ASR, background speech, filler phrases), and entity fields (target_object, quantity, location, object_en, location_en). Generation: <code>temperature=0</code>, <code>max_new_tokens=28</code>. A <code>chat_fallback</code> regex catches clear questions that the LLM occasionally misclassifies as unknown.',
            's4.h.vlm': 'VLM Bbox + CLIP Text Joint Grounding',
            's4.p2': 'The perception pipeline feeds NLU output to VLM (Qwen2.5-VL via HTTP) for bounding-box extraction, then to SAM3 with <strong>joint box + CLIP English text prompts</strong>. The key geometric fix is <strong>letterbox alignment</strong>: VLM resizes the input image to fit its max resolution (e.g., 512 px) with padding, outputting bbox coordinates in letterboxed space. These must be inverse-transformed to original pixel coordinates before feeding SAM3 \u2014 naive resize produces 1.78\u00d7 vertical distortion, collapsing small-object masks. A color-to-VLM routing fix moved color discrimination from SAM3\u2019s HSV heuristic to VLM\u2019s semantic understanding, eliminating false rejections (e.g., \u201cred bull\u201d rejected because the can is blue/silver).',
            's4.cap1': 'Box-only: 9% \u2192 Box+Text joint grounding: \u226590% (44 trials)',
            's4.cap2': 'Letterbox preserves 16:9 aspect ratio; naive resize distorts 1.78\u00d7',
            's4.h.defense': '5-Layer Semantic Defense Cascade',
            's4.p3': 'Dirty data at any stage cascades into wrong targets and failed grasps. Five ordered defense layers intercept errors progressively: (1) <strong>Whitelist recovery</strong> \u2014 regex dictionary maps ASR noise to known objects (e.g., phonetic corruptions); (2) <strong>Color backfill</strong> \u2014 if ASR omits a color prefix present in the original command, the parser re-injects it from <code>_ZH_COLOR_PREFIXES</code>; (3) <strong>Hallucination stripping</strong> \u2014 removes phantom locations invented by the LLM; (4) <strong>Sentinel filtering</strong> \u2014 <code>translate_for_sam3</code> checks against a known-object dictionary to prevent dictionary pollution (e.g., an unknown object mapping to a wrong English word); (5) <strong>VLM-SAM3 contradiction</strong> \u2014 if VLM bbox and SAM3 mask disagree on spatial location (CLIP logit < 0.20 or mask area < 200 px), the result is rejected.',
            's4.result': 'SAM3 mask success (small targets): <strong>9% \u2192 \u226590%</strong> \u2022 Color/brand routing error: <strong>0</strong> \u2022 NLU intent: 6 types + noise classification',
            /* S5: Closed-Loop FSM */
            's5.title': 'Closed-Loop FSM & 3D Grasp Verification',
            's5.h.mixin': '13-Mixin Pipeline Architecture',
            's5.p0': 'The <code>MultimodalPipelineNode</code> uses mixin-based separation of concerns: <code>WakeWordMixin</code>, <code>NavMixin</code>, <code>GraspFeedbackMixin</code>, <code>TtsMixin</code>, <code>LongWaitFeedbackMixin</code>, <code>PlaceVerifyMixin</code>, <code>AsrMixin</code>, <code>Sam3Mixin</code>, <code>ArmMixin</code>, <code>CameraMixin</code>, <code>RdkMixin</code>, <code>BypassMixin</code>, and <code>OrchestrationMixin</code>. Pipeline stages: IDLE \u2192 NAV_TRACK_HEAD \u2192 NAV_REACHED_FLUSH \u2192 GRASP_RESEG_HEAD \u2192 GRASP_TRACK_LEFT \u2192 PLACE_TRACK_HEAD. A <code>DialogManager</code> handles conversation follow-up windows (12 s) and clarification timeouts (12 s).',
            's5.cap1': 'Pipeline FSM with verification feedback loop, \u22643 retry for pick, \u226410 retry for place, 4-class failure grading.',
            's5.h.grasp': 'grasp_check v1.0.0: 3D Multi-Feature Voting',
            's5.p1': 'After each grasp attempt, the <code>GraspFeedbackMixin</code> transitions through states: <code>idle \u2192 executing \u2192 verifying \u2192 retrying/aborting</code>. Verification uses a 3D multi-feature voting system on hand+object point cloud proximity: <strong>median distance < 55 mm</strong>, <strong>P25 < 45 mm</strong>, <strong>frac within 3 cm \u2265 2%</strong>, <strong>frac within 5 cm \u2265 8%</strong>. Tactile verification supplements vision: post-gripper-close baseline capture (<code>ResetTactileSensor()</code> + 0.35 s sampling window), then delta comparison at grasp_check position \u2014 retained force indicates true hold, force decay indicates empty grasp. Failures are classified into <strong>infrastructure</strong> (IK unreachable), <strong>genuine</strong> (object missed), and <strong>displacement</strong> (object moved) with graded TTS feedback.',
            's5.h.p0': 'P0 Cascading Failure: 7-Step Root-Cause Audit',
            's5.cap2': 'One missing flag triggered a 7-step cascade: stale frame \u2192 wrong bbox \u2192 degraded mask \u2192 retry deadlock. Fix: one line.',
            's5.cap3': 'Fix timeline: stale frame, mask collapse, and retry deadlock were traced back to one missing write-complete flag.',
            's5.result': 'A missing <code>ok=True</code> in <code>_bg_write_shm()</code> caused stale frame reads \u2192 degraded masks (<93 px) \u2192 infinite retry. Audit traced: flag \u2192 stale cache \u2192 VLM old frame \u2192 SAM3 misalignment \u2192 mask collapse \u2192 depth failure \u2192 retry loop. <strong>One-line fix restored full grasping success.</strong>',
            /* S6: Quantified Results */
            's6.title': 'Quantified Results',
            's6.th.metric': 'Metric',
            's6.th.before': 'Before',
            's6.th.after': 'After',
            's6.th.method': 'Method',
            's6.r1.m': 'Far-field VAD hit rate',
            's6.r1.how': 'Stateful Silero h/c [2,1,64] + field calibration',
            's6.r2.m': 'SAM3 mask success (small obj)',
            's6.r2.how': 'Letterbox + VLM bbox + CLIP text joint grounding',
            's6.r3.m': 'ASR streaming partial',
            's6.r3.b': 'Session rebuild \u2192 no output',
            's6.r3.how': 'Cloud endpointing ownership + heartbeat',
            's6.r4.m': 'AGC far-field recovery',
            's6.r4.b': 'Gain frozen at +0 dB',
            's6.r4.a': '~2.4 s to max gain',
            's6.r4.how': 'Envelope AGC v5 silence-creep',
            's6.r5.m': 'P0 grasping success',
            's6.r5.b': '4 retries, all failed',
            's6.r5.a': 'Closed-loop success',
            's6.r5.how': '7-step root-cause audit + 1-line fix',
            's6.r6.m': 'Color/brand routing error',
            's6.r6.b': 'HSV misclassification',
            's6.r6.how': 'VLM-stage color routing (HSV rerank disabled)',
            's6.r7.m': 'Target-lost timeout',
            's6.r7.b': '60 s',
            's6.r7.a': '3 s',
            's6.r7.how': 'sam3_lost_timeout_sec: 60 s -> 3 s',
            's6.cap1': 'End-to-end single-command latency on Jetson AGX Orin',
            's6.cap2': 'Key metrics: before vs after optimization',
            's6.cap3': 'Radar summary of voice, vision, and verification metrics after optimization.',
            /* S7: Technical Highlights */
            's7.title': 'Technical Highlights',
            's7.h1.title': 'Envelope AGC v5',
            's7.h1.desc': '5-iteration design: fast peak ceiling (instant clamp at 0.85), envelope follow (attack/release=0.30), silence creep (slow rise to max gain in ~2.4 s), and tanh soft-clip. Solves the \u201cnear-to-far transition\u201d where gain freezes at +0 dB after loud speech.',
            's7.h2.title': 'Letterbox Alignment',
            's7.h2.desc': 'Unified scale ratio preserves 16:9 aspect ratio for VLM-to-SAM3 coordinate transform, preventing 1.78x vertical distortion that collapsed small-object masks.',
            's7.h3.title': '5-Layer Semantic Defense',
            's7.h3.desc': 'Cascaded error interception: whitelist recovery, color backfill, hallucination stripping, sentinel filtering, VLM-SAM3 contradiction. Each layer catches what the previous one missed.',
            's7.h4.title': '3D Grasp Voting + Tactile',
            's7.h4.desc': 'Multi-feature point cloud verification (median/P25/frac thresholds) + post-close tactile baseline with ResetTactileSensor(). Delta judgment: retained force = true hold, force decay = empty grasp.',
            'footer': footer_en
        },
        zh: {
            'back': '\u8fd4\u56de\u4e3b\u9875',
            /* Hero */
            'hero.title': 'PLAN-B：人形机器人语音到抓取管线',
            'hero.venue': '\u9999\u6e2f\u4e2d\u6587\u5927\u5b66',
            'hero.tagline': '3 层 VAD · cloud_qwen3 ASR · qwen3.5-flash NLU · Qwen2.5-VL + SAM3 · grasp_check + 13-mixin FSM',
            'hero.pipeline': '管线',
            'hero.visuals': '可视化',
            'hero.results': '结果',
            /* Metrics */
            'm.vad': 'ASR partial 延迟',
            'm.mask': '远场 VAD 命中率',
            'm.engines': 'SAM3 掩码成功率',
            'm.mixins': '闭环 FSM Mixin 数',
            /* S0: Overview */
            's0.title': '\u9879\u76ee\u6982\u8ff0',
            's0.p1': '真实机器人上的语音抓取暴露出硬接口问题：远场语音低于噪声地板，云端 ASR 需要自己拥有 endpointing，小目标在 box-only grounding 下容易坍塌，抓取验证必须闭环而不是猜测成功。<strong>PLAN-B</strong> 是部署在 Jetson AGX Orin 上的语音到抓取管线：16 kHz PCM 进入 3 层 VAD 门控，经 cloud_qwen3 / fallback ASR 路由，由正则 + qwen3.5-flash NLU 解析，再变成 Qwen2.5-VL bbox、SAM3 mask、depth-based grasp_check 投票和 13-mixin 闭环 FSM。',
            's0.c1': '\u5de5\u7a0b\u5316\u4e86\u4e00\u4e2a<strong>3 \u5c42\u7ea7\u8054 VAD \u8d28\u91cf\u95e8\u63a7</strong>\uff08\u81ea\u9002\u5e94\u80fd\u91cf + \u8f6f\u4ef6 AGC + \u6709\u72b6\u6001 Silero v4 ONNX h/c [2,1,64]\uff09\uff0c\u73b0\u573a\u6807\u5b9a\uff08\u566a\u5e95 \u221246 dB\u3001\u8bed\u97f3 \u221239 dB\u3001\u88d5\u91cf 6 dB\uff09\uff0c\u8fdc\u573a\u547d\u4e2d\u7387 0% \u2192 92%\u3002',
            's0.c2': '\u67b6\u6784\u4e86<strong>4 \u5f15\u64ce\u6d41\u5f0f ASR \u6846\u67b6</strong>\uff08cloud_qwen3 / cloud_paraformer / \u672c\u5730 Qwen3-ASR TRT / FunASR\uff09\uff0c\u914d\u5408\u5305\u7edc AGC v5\uff08\u9759\u9ed8\u722c\u5347 + \u5feb\u901f\u5cf0\u503c\u5c01\u9876 + \u8f6f\u9650\u5e45\uff09\u3001\u4e91\u7aef endpointing \u4e3b\u6743\u8f6c\u79fb\u548c\u52a8\u8bcd\u5934\u5feb\u62fc\u3002',
            's0.c3': '设计了<strong>双路径 NLU</strong>（7 模板正则快路径 + qwen3.5-flash LLM，temperature=0，max_new_tokens=28）配合 5 层语义防线级联，以及 <strong>VLM bbox + CLIP 联合定位</strong>与 letterbox 对齐，SAM3 掩码成功率 9% → ≥90%。',
            's0.c4': '构建了<strong>13-mixin 管线状态机</strong>，配合 3D 多特征抓取验证（grasp_check v1.0.0：median<55mm、P25<45mm、frac<3cm≥2%、frac<5cm≥8%）和触觉基线验证，实现 4 级失败分类的闭环重试。',
            /* Demo */
            'sd.title': '运行可视化',
            'sd.placeholder': '一条时间线把 cloud_qwen3 ASR、qwen3.5-flash 解析、Qwen2.5-VL + SAM3 定位、depth-based grasp_check 和 barge-in 恢复对齐在 Jetson AGX Orin 上。',
            'sd.cap1': '串行语音到抓取回路的运行可视化：ASR、NLU、VLM-SAM3、depth、grasp_check 和目标丢失恢复保持在同一条时间线上。',
            'sd.cap2': 'barge-in 与目标丢失恢复保持联动。',
            'sd.result': '串行调度避免 GPU 争用，同时保留 barge-in 和目标丢失恢复。',
            's1.title': '系统架构',
            's1.cap': 'Jetson AGX Orin 上的语音到抓取架构：3 层 VAD、cloud_qwen3/qwen3.5-flash 路由、Qwen2.5-VL + SAM3 定位、depth-based grasp_check、闭环验证和下游执行。',
            's1.scope': '<strong>我的职责：</strong>负责语音前端、cloud_qwen3 / paraformer ASR、qwen3.5-flash NLU、VLM-SAM3 视觉定位、depth-based grasp_check 和 13-mixin 闭环状态机。下游执行（导航、IK 规划、电机控制）由协作团队负责。',
            /* S2: Voice Frontend */
            's2.title': '\u8bed\u97f3\u524d\u7aef\uff1a\u73b0\u573a\u6807\u5b9a\u7684\u4e09\u5c42 VAD',
            's2.cap1': '\u4e09\u5c42 VAD \u7ea7\u8054\uff1a\u81ea\u9002\u5e94\u80fd\u91cf\u95e8 \u2192 \u8f6f\u4ef6 AGC \u2192 Silero v4\uff08\u6709\u72b6\u6001 h/c\uff09\uff0c\u73b0\u573a\u6807\u5b9a\u9608\u503c\u3002',
            's2.p1': '<code>VadQualityGate</code> \u7c7b\u5b9e\u73b0\u4e86 3 \u5c42\u7ea7\u8054\u8d28\u91cf\u95e8\u63a7\u3002<strong>\u7b2c 1 \u5c42</strong>\uff08AGC \u524d\uff09\uff1a\u81ea\u9002\u5e94\u80fd\u91cf\u8fc7\u6ee4\uff0c\u81ea\u6821\u51c6\u566a\u5e95 \u2014 \u6ed1\u52a8\u7a97\u53e3\u6536\u96c6\u975e\u8bed\u97f3\u80fd\u91cf\u5386\u53f2\uff0c\u8ba1\u7b97 P10 \u767e\u5206\u4f4d\u4f5c\u4e3a\u566a\u5e95\uff0c\u9608\u503c = \u566a\u5e95 + \u88d5\u91cf\u3002\u73b0\u573a\u6d4b\u91cf\uff1a\u566a\u58f0 \u2248 \u221246 dB\uff0c\u8bed\u97f3 \u2248 \u221239 dB\uff0c\u88d5\u91cf = 6 dB\uff08\u8db3\u4ee5\u62d2\u7edd\u80cc\u666f\u95f2\u804a\uff09\u3002<strong>\u7b2c 2 \u5c42</strong>\uff1a\u8f6f\u4ef6 AGC \u5c06 RMS \u5f52\u4e00\u5230 \u221220 dBFS \u76ee\u6807\uff08\u6700\u5927\u589e\u76ca +30 dB\uff0c\u4ec5\u4e0a\u8c03 \u2014 \u4ece\u4e0d\u8870\u51cf\uff09\u3002<strong>\u7b2c 3 \u5c42</strong>\uff1aSilero v4 ONNX \u5728 CPU \u4e0a\u8fd0\u884c\uff0c\u5904\u7406 512 \u6837\u672c\u5757\uff0832 ms @ 16 kHz\uff09\uff0ch/c \u5206\u79bb\u9690\u85cf\u72b6\u6001 [2,1,64]\u3002',
            's2.p2': '\u5173\u952e\u4fee\u590d\u662f\u542f\u7528<strong>\u8de8 64 ms \u97f3\u9891\u5757\u7684\u6709\u72b6\u6001 Silero \u63a8\u7406</strong>\u3002\u672a\u542f\u7528 <code>stateful_silero=True</code> \u65f6\uff0c\u6bcf\u6b21 ROS \u97f3\u9891\u56de\u8c03\uff081024 \u6837\u672c = 2 \u4e2a Silero \u5757\uff09\u4ece\u96f6\u521d\u59cb\u5316 h/c \u8fd0\u884c Silero \u2014 RNN \u4e0a\u4e0b\u6587\u4e0d\u8db3\u4ee5\u533a\u5206\u5f31\u8bed\u97f3\u4e0e\u566a\u58f0\u3002\u73b0\u573a\u65e5\u5fd7\u663e\u793a\u6240\u6709\u7a97\u53e3 <code>speech=0</code>\uff0c\u5c3d\u7ba1\u5cf0\u503c\u632f\u5e45\u8fbe 26063\u3002\u542f\u7528\u8de8\u8c03\u7528\u72b6\u6001\u4fdd\u6301\u540e\uff0cRNN \u81ea\u7136\u7d2f\u79ef\u4e0a\u4e0b\u6587\uff0c\u8bed\u97f3\u68c0\u6d4b\u6062\u590d\u3002',
            's2.h.postfilter': '\u7b2c 4 \u5c42\uff1aASR \u8f93\u51fa\u540e\u8fc7\u6ee4',
            's2.p3': '\u7b2c 4 \u5c42\u5728\u4e0b\u6e38\u5206\u53d1\u524d\u8fc7\u6ee4 ASR \u8f93\u51fa\uff1a<strong>\u5e7b\u89c9\u68c0\u6d4b</strong>\uff0820+ \u6761\u5e7d\u7075\u77ed\u8bed\u51bb\u7ed3\u96c6\uff0c\u5982\u300c\u5b57\u5e55by\u300d/\u300c\u611f\u8c22\u89c2\u770b\u300d\uff09\uff0c<strong>\u5570\u55e6\u68c0\u6d4b</strong>\uff08\u22652 \u9879\u547d\u4e2d\uff1a\u586b\u5145\u524d\u7f00\u3001\u8bed\u6c14\u8bcd\u5bc6\u5ea6 \u226520%\u3001\u72b9\u8c6b\u8bcd \u22652\u3001bigram \u91cd\u590d \u22653\uff09\uff0c<strong>\u91cd\u590d\u77ed\u8bed\u79fb\u9664</strong>\uff08\u6b63\u5219 <code>(.{2,})\\1+</code>\uff09\uff0c\u4ee5\u53ca<strong>\u975e CJK/\u82f1\u6587\u6bd4\u4f8b</strong>\uff08>30% \u5916\u6587\u811a\u672c \u2192 \u62d2\u7edd\uff09\u3002\u9632\u6b62 ASR \u566a\u58f0\u6c61\u67d3 NLU\u3002',
            's2.result': '\u8fdc\u573a Silero \u547d\u4e2d\u7387\uff1a<strong>0% \u2192 92%</strong> \u2022 VAD \u533a\u5206\u5ea6\uff1a\u566a\u58f0 < 0.01\uff0c\u8bed\u97f3 > 0.99 \u2022 \u566a\u5e95\u7ea6 15 \u79d2\u6536\u655b',
            /* S3: Streaming ASR */
            's3.title': '流式 ASR：云优先 4 引擎路由',
            's3.p1': '<code>StreamingAsrNode</code> \u6258\u7ba1\u53ef\u63d2\u62d4\u5f15\u64ce\u8def\u7531\uff08<code>build_engine()</code>\uff09\uff0c\u542f\u52a8\u65f6\u9009\u62e9 4 \u79cd ASR \u540e\u7aef\u4e4b\u4e00\u3002\u5f15\u64ce\u9009\u62e9\u51b3\u5b9a\u97f3\u9891\u8def\u5f84\u3001endpointing \u5f52\u5c5e\u548c AGC \u7b56\u7565 \u2014 \u8282\u70b9\u901a\u8fc7 <code>hasattr(engine, \'set_on_sentence_callback\')</code> \u81ea\u52a8\u68c0\u6d4b\u5f15\u64ce\u80fd\u529b\u5e76\u76f8\u5e94\u9002\u914d\u3002',
            's3.th.engine': '\u5f15\u64ce',
            's3.th.backend': '\u540e\u7aef',
            's3.th.audio': '\u97f3\u9891\u8def\u5f84',
            's3.th.eou': '\u65ad\u53e5\u65b9\u5f0f',
            's3.e1.backend': 'DashScope qwen3-asr-flash-realtime（WebSocket）',
            's3.e1.audio': '\u539f\u59cb\u76f4\u901a + \u5305\u7edc AGC v5',
            's3.e1.eou': '\u670d\u52a1\u7aef VAD\uff08threshold=0.0, silence=1500ms\uff09',
            's3.e2.backend': 'DashScope paraformer-realtime-v2（热词）',
            's3.e2.audio': 'RMS \u95e8\u63a7 (280) + \u6302\u7559 (0.6s) + \u96f6\u586b\u5145',
            's3.e2.eou': '云端句尾判定（max_sentence_silence=800ms, heartbeat）',
            's3.e3.backend': '\u672c\u5730 Qwen3-ASR TRT-LLM\uff08~3 GB GPU\uff09',
            's3.e3.audio': '\u672c\u5730 VAD \u95e8\u63a7 + \u7d2f\u79ef\u91cd\u8dd1',
            's3.e3.eou': '\u672c\u5730 EOU\uff08\u9759\u9ed8 \u2265 0.8s\uff09',
            's3.e4.backend': 'FunASR paraformer-zh-streaming\uff08chunk\uff09',
            's3.e4.audio': '\u672c\u5730 VAD \u95e8\u63a7 + 600ms \u5206\u5757',
            's3.e4.eou': '\u672c\u5730 EOU\uff08\u9759\u9ed8 \u2265 0.8s\uff09',
            's3.h.agc': '\u5305\u7edc AGC v5\uff1a\u9759\u9ed8\u722c\u5347 + \u5feb\u901f\u5cf0\u503c\u5c01\u9876',
            's3.p2': '<code>cloud_qwen3</code> \u8def\u5f84\u5728\u5c06\u539f\u59cb\u97f3\u9891\u9001\u5165\u4e91\u7aef\u524d\uff0c\u5e94\u7528 5 \u8f6e\u8fed\u4ee3\u5305\u7edc\u8ddf\u8e2a AGC\uff08<code>_apply_envelope_agc</code>\uff09\u3002\u6838\u5fc3\u8bbe\u8ba1\uff1a(1) <strong>\u5feb\u901f\u5cf0\u503c\u5c01\u9876</strong> \u2014 \u82e5 <code>peak \u00d7 gain > 0.85</code>\uff0c\u589e\u76ca\u7acb\u5373\u94b3\u4f4d\u81f3 <code>0.85/peak</code>\uff08\u65e0\u6162\u91ca\u653e\uff0c\u9632\u6b62\u786c\u524a\u6ce2\u51bb\u7ed3\u4e91\u7aef ASR\uff09\uff1b(2) <strong>\u5305\u7edc\u8ddf\u8e2a</strong> \u2014 \u5f53 <code>rms > \u566a\u5e95 (\u221238 dBFS)</code>\uff0c\u589e\u76ca\u4ee5 attack=0.30 / release=0.30 \u8ffd\u8e2a <code>target/rms</code>\uff1b(3) <strong>\u9759\u9ed8\u722c\u5347 (v5)</strong> \u2014 \u5f53 <code>rms \u2264 \u566a\u5e95</code>\uff0c\u589e\u76ca\u4ee5 <code>attack \u00d7 0.2 = 0.06</code>/\u5757\u7f13\u6162\u722c\u5347\u81f3 max_gain\uff08\u7ea6 2.4 \u79d2\u5230\u6ee1\uff09\uff0c\u4e3a\u4e0b\u4e00\u6b21\u8fdc\u573a\u53d1\u58f0\u9884\u84c4\u589e\u76ca\uff1b(4) <strong>\u8f6f\u9650\u5e45</strong> \u2014 knee=0.9 \u4ee5\u4e0a <code>tanh</code> \u538b\u7f29\uff0c\u6d88\u9664\u6b8b\u4f59\u524a\u6ce2\u7684\u8c10\u6ce2\u5931\u771f\u3002',
            's3.h.endpointing': '\u4e91\u7aef Endpointing \u4e3b\u6743\u8f6c\u79fb',
            's3.p3': '\u5bf9\u4e8e\u4e91\u7aef\u5f15\u64ce\uff0c\u8282\u70b9\u5c06\u53e5\u5b50\u8fb9\u754c\u68c0\u6d4b\u4e3b\u6743\u8f6c\u4ea4\u4e91\u7aef\uff1a<code>engine_owns_endpointing = True</code>\u3002\u4e91\u7aef\u7684 <code>sentence_end</code> \u56de\u8c03\uff08<code>_on_cloud_sentence</code>\uff09\u76f4\u63a5\u9a71\u52a8 <code>publish_final</code>\u3002\u672c\u5730 EOU \u4ec5\u4f5c\u4e3a <code>max_utterance_sec=20s</code> \u8d85\u65f6\u770b\u95e8\u72d7\u3002\u8fd9\u6d88\u9664\u4e86\u672c\u5730 EOU \u5728\u6bcf\u6b21\u9759\u9ed8\u95f4\u9699\u89e6\u53d1 <code>session.stop()+start()</code> \u7684\u7834\u574f\u6027\u6a21\u5f0f\uff0c\u540e\u8005\u5bfc\u81f4 partial \u8ba1\u6570\u51bb\u7ed3\u548c <code>feed()</code> \u4e0e <code>stop()</code> \u4e4b\u95f4\u7684\u7ade\u6001\u6761\u4ef6\u3002',
            's3.h.stitch': '\u5feb\u901f\u62fc\u63a5\uff1a\u52a8\u8bcd\u5934\u77ed\u53e5\u7f13\u51b2',
            's3.p4': '\u4e91\u7aef ASR \u6709\u65f6\u5728\u8bcd\u8fb9\u754c\u505c\u987f\u5904\u5207\u5206\u5355\u6761\u6307\u4ee4\uff08\u5982\u300c\u628a\u300d+ 0.8 \u79d2\u505c\u987f +\u300c\u68d5\u8272\u73a9\u5177\u718a\u653e\u8fdb\u767d\u8272\u7bee\u5b50\u91cc\u300d\u2192 \u4e24\u4e2a final\uff09\u3002<code>_handle_qwen_final</code> \u65b9\u6cd5\u68c0\u6d4b\u77ed\u52a8\u8bcd\u5934 final\uff08\u22643 \u5b57\u7b26\uff0c\u524d\u7f00\u5c5e\u4e8e {\u628a,\u62ff,\u653e,\u6293,\u7ed9,\u5e2e,\u8bf7,...}\uff09\u5e76\u7f13\u51b2 1.5 \u79d2\u3002\u82e5\u5ef6\u7eed final \u5728\u7a97\u53e3\u5185\u5230\u8fbe\uff0c\u5219\u62fc\u63a5\uff1b\u5426\u5219\u77ed\u5934\u72ec\u7acb\u53d1\u5e03\u3002',
            's3.result': 'ASR \u6d41\u5f0f partial\uff1a<strong>150\u2013300 ms</strong> \u2022 \u4f1a\u8bdd\u5b58\u6d3b\uff1aheartbeat \u2192 \u65e0 23 \u79d2 SDK \u8d85\u65f6 \u2022 AGC v5 \u8fdc\u573a\u6062\u590d\uff1a<strong>~2.4 \u79d2</strong>\u9759\u9ed8\u81f3\u6ee1\u589e\u76ca',
            /* S4: NLU + VLM + SAM3 */
            's4.title': '\u53cc\u8def\u5f84 NLU \u4e0e VLM-SAM3 \u5b9a\u4f4d',
            's4.h.nlu': '\u53cc\u8def\u5f84\u610f\u56fe\u89e3\u6790',
            's4.p1': '<code>VoiceCommandParser</code> 运行在 <code>regex_then_llm</code> 模式。<strong>快路径</strong>：7 个正则模板在 <1 ms 内从清晰命令中提取意图（pick_up / pick_and_place / place_only / move_to / chat / unknown）和实体。<strong>LLM 路径</strong>：qwen3.5-flash（TRT-LLM 或 OpenAI 兼容 HTTP），结构化系统提示定义 6 种意图类型、噪声分类规则（乱码 ASR、背景语音、填充短语）和实体字段（target_object、quantity、location、object_en、location_en）。生成参数：<code>temperature=0</code>，<code>max_new_tokens=28</code>。<code>chat_fallback</code> 正则捕获 LLM 偶尔误分类为 unknown 的明确提问。',
            's4.h.vlm': 'VLM Bbox + CLIP \u6587\u672c\u8054\u5408\u5b9a\u4f4d',
            's4.p2': '\u611f\u77e5\u7ba1\u7ebf\u5c06 NLU \u8f93\u51fa\u9001\u5165 VLM\uff08Qwen2.5-VL via HTTP\uff09\u63d0\u53d6\u8fb9\u754c\u6846\uff0c\u518d\u9001\u5165 SAM3 \u8fdb\u884c<strong>\u8054\u5408 box + CLIP \u82f1\u6587\u6587\u672c\u63d0\u793a</strong>\u5b9a\u4f4d\u3002\u5173\u952e\u51e0\u4f55\u4fee\u590d\u662f <strong>letterbox \u5bf9\u9f50</strong>\uff1aVLM \u5c06\u8f93\u5165\u56fe\u50cf\u7f29\u653e\u5230\u5176\u6700\u5927\u5206\u8fa8\u7387\uff08\u5982 512 px\uff09\u5e76\u586b\u5145\uff0c\u8f93\u51fa letterbox \u7a7a\u95f4\u4e2d\u7684 bbox \u5750\u6807\u3002\u8fd9\u4e9b\u5750\u6807\u5fc5\u987b\u53cd\u53d8\u6362\u5230\u539f\u59cb\u50cf\u7d20\u5750\u6807\u540e\u518d\u9001\u5165 SAM3 \u2014 naive resize \u4f1a\u4ea7\u751f 1.78\u00d7 \u7eb5\u5411\u5931\u771f\uff0c\u4f7f\u5c0f\u76ee\u6807\u63a9\u7801\u574d\u585e\u3002\u989c\u8272\u5230 VLM \u8def\u7531\u4fee\u590d\u5c06\u989c\u8272\u5224\u522b\u4ece SAM3 \u7684 HSV \u542f\u53d1\u5f0f\u79fb\u81f3 VLM \u7684\u8bed\u4e49\u7406\u89e3\uff0c\u6d88\u9664\u4e86\u8bef\u62d2\uff08\u5982\u300c\u7ea2\u725b\u300d\u56e0\u7f50\u4f53\u4e3a\u84dd\u94f6\u8272\u88ab\u62d2\u7edd\uff09\u3002',
            's4.cap1': 'Box-only: 9% \u2192 Box+Text \u8054\u5408\u5b9a\u4f4d: \u226590%\uff0844 \u6b21\u8bd5\u9a8c\uff09',
            's4.cap2': 'Letterbox \u4fdd\u6301 16:9 \u5bbd\u9ad8\u6bd4\uff1bnaive resize \u62c9\u4f38 1.78\u00d7',
            's4.h.defense': '5 \u5c42\u8bed\u4e49\u9632\u7ebf\u7ea7\u8054',
            's4.p3': '\u4efb\u4f55\u9636\u6bb5\u7684\u810f\u6570\u636e\u90fd\u4f1a\u7ea7\u8054\u4e3a\u9519\u8bef\u76ee\u6807\u548c\u5931\u8d25\u6293\u53d6\u30025 \u5c42\u6709\u5e8f\u9632\u7ebf\u9010\u7ea7\u62e6\u622a\u9519\u8bef\uff1a(1) <strong>\u767d\u540d\u5355\u56de\u6536</strong> \u2014 \u6b63\u5219\u8bcd\u5178\u5c06 ASR \u566a\u58f0\u6620\u5c04\u4e3a\u5df2\u77e5\u5bf9\u8c61\uff08\u5982\u8c10\u97f3\u8bbe\u8bef\uff09\uff1b(2) <strong>\u989c\u8272\u56de\u586b</strong> \u2014 \u82e5 ASR \u9057\u6f0f\u4e86\u539f\u59cb\u547d\u4ee4\u4e2d\u7684\u989c\u8272\u524d\u7f00\uff0c\u89e3\u6790\u5668\u4ece <code>_ZH_COLOR_PREFIXES</code> \u91cd\u65b0\u6ce8\u5165\uff1b(3) <strong>\u5e7b\u89c9\u5265\u79bb</strong> \u2014 \u79fb\u9664 LLM \u865a\u6784\u7684\u4f4d\u7f6e\uff1b(4) <strong>\u54e8\u5175\u8fc7\u6ee4</strong> \u2014 <code>translate_for_sam3</code> \u6bd4\u5bf9\u5df2\u77e5\u5bf9\u8c61\u8bcd\u5178\uff0c\u9632\u6b62\u8bcd\u5178\u6c61\u67d3\uff08\u5982\u672a\u77e5\u5bf9\u8c61\u6620\u5c04\u5230\u9519\u8bef\u82f1\u6587\u8bcd\uff09\uff1b(5) <strong>VLM-SAM3 \u77db\u76fe</strong> \u2014 \u82e5 VLM bbox \u4e0e SAM3 \u63a9\u7801\u5728\u7a7a\u95f4\u4f4d\u7f6e\u4e0a\u4e0d\u4e00\u81f4\uff08CLIP logit < 0.20 \u6216\u63a9\u7801\u9762\u79ef < 200 px\uff09\uff0c\u7ed3\u679c\u88ab\u62d2\u7edd\u3002',
            's4.result': 'SAM3 \u63a9\u7801\u6210\u529f\u7387\uff08\u5c0f\u76ee\u6807\uff09\uff1a<strong>9% \u2192 \u226590%</strong> \u2022 \u989c\u8272/\u54c1\u724c\u8def\u7531\u9519\u8bef\uff1a<strong>0</strong> \u2022 NLU \u610f\u56fe\uff1a6 \u79cd\u7c7b\u578b + \u566a\u58f0\u5206\u7c7b',
            /* S5: Closed-Loop FSM */
            's5.title': '\u95ed\u73af\u72b6\u6001\u673a\u4e0e 3D \u6293\u53d6\u9a8c\u8bc1',
            's5.h.mixin': '13-Mixin 管线架构',
            's5.p0': '<code>MultimodalPipelineNode</code> \u91c7\u7528 mixin \u5173\u6ce8\u70b9\u5206\u79bb\uff1a<code>WakeWordMixin</code>\u3001<code>NavMixin</code>\u3001<code>GraspFeedbackMixin</code>\u3001<code>TtsMixin</code>\u3001<code>LongWaitFeedbackMixin</code>\u3001<code>PlaceVerifyMixin</code>\u3001<code>AsrMixin</code>\u3001<code>Sam3Mixin</code>\u3001<code>ArmMixin</code>\u3001<code>CameraMixin</code>\u3001<code>RdkMixin</code>\u3001<code>BypassMixin</code> \u548c <code>OrchestrationMixin</code>\u3002\u7ba1\u7ebf\u9636\u6bb5\uff1aIDLE \u2192 NAV_TRACK_HEAD \u2192 NAV_REACHED_FLUSH \u2192 GRASP_RESEG_HEAD \u2192 GRASP_TRACK_LEFT \u2192 PLACE_TRACK_HEAD\u3002<code>DialogManager</code> \u7ba1\u7406\u5bf9\u8bdd\u8ddf\u8fdb\u7a97\u53e3\uff0812 \u79d2\uff09\u548c\u6f84\u6e05\u8d85\u65f6\uff0812 \u79d2\uff09\u3002',
            's5.cap1': '\u7ba1\u7ebf FSM\uff1a\u9a8c\u8bc1\u53cd\u9988\u73af\u8def\uff0c\u6293\u53d6 \u22643 \u6b21\u91cd\u8bd5\uff0c\u653e\u7f6e \u226410 \u6b21\u91cd\u8bd5\uff0c4 \u7ea7\u5931\u8d25\u5206\u7c7b\u3002',
            's5.h.grasp': 'grasp_check v1.0.0\uff1a3D \u591a\u7279\u5f81\u7968\u51b3',
            's5.p1': '\u6bcf\u6b21\u6293\u53d6\u5c1d\u8bd5\u540e\uff0c<code>GraspFeedbackMixin</code> \u7ecf\u5386\u72b6\u6001\u8f6c\u79fb\uff1a<code>idle \u2192 executing \u2192 verifying \u2192 retrying/aborting</code>\u3002\u9a8c\u8bc1\u4f7f\u7528\u624b+\u7269\u4f53\u70b9\u4e91\u90bb\u8fd1\u5ea6\u7684 3D \u591a\u7279\u5f81\u7968\u51b3\u7cfb\u7edf\uff1a<strong>\u4e2d\u4f4d\u8ddd\u79bb < 55 mm</strong>\u3001<strong>P25 < 45 mm</strong>\u3001<strong>3 cm \u5185\u5360\u6bd4 \u2265 2%</strong>\u3001<strong>5 cm \u5185\u5360\u6bd4 \u2265 8%</strong>\u3002\u89e6\u89c9\u9a8c\u8bc1\u8865\u5145\u89c6\u89c9\uff1a\u6293\u53d6\u5668\u95ed\u5408\u540e\u57fa\u7ebf\u91c7\u96c6\uff08<code>ResetTactileSensor()</code> + 0.35 \u79d2\u91c7\u6837\u7a97\u53e3\uff09\uff0c\u7136\u540e\u5728 grasp_check \u4f4d\u7f6e\u8fdb\u884c delta \u6bd4\u8f83 \u2014 \u529b\u4fdd\u6301 = \u771f\u6293\u4f4f\uff0c\u529b\u8870\u51cf = \u7a7a\u6293\u3002\u5931\u8d25\u5206\u4e3a<strong>\u57fa\u7840\u8bbe\u65bd</strong>\uff08IK \u4e0d\u53ef\u8fbe\uff09\u3001<strong>\u771f\u5931\u8d25</strong>\uff08\u76ee\u6807\u672a\u6293\u5230\uff09\u548c<strong>\u4f4d\u79fb</strong>\uff08\u76ee\u6807\u79fb\u52a8\uff09\uff0c\u5206\u7ea7 TTS \u53cd\u9988\u3002',
            's5.h.p0': 'P0 \u7ea7\u8054\u6545\u969c\uff1a7 \u6b65\u6839\u56e0\u5ba1\u8ba1',
            's5.cap2': '\u4e00\u5904\u65d7\u6807\u6f0f\u5199\u89e6\u53d1 7 \u6b65\u7ea7\u8054\uff1a\u65e7\u5e27 \u2192 \u9519 bbox \u2192 \u9000\u5316 mask \u2192 \u91cd\u8bd5\u6b7b\u9501\u3002\u4fee\u590d\uff1a\u4e00\u884c\u4ee3\u7801\u3002',
            's5.cap3': '修复时间线：旧帧、mask 坍塌和重试死锁都追溯到一个写完成标志遗漏。',
            's5.result': '<code>_bg_write_shm()</code> \u6210\u529f\u8def\u5f84\u7f3a\u5931 <code>ok=True</code> \u5bfc\u81f4\u65e7\u5e27\u8bfb\u53d6 \u2192 \u9000\u5316\u63a9\u7801\uff08<93 px\uff09\u2192 \u65e0\u9650\u91cd\u8bd5\u3002\u5ba1\u8ba1\u8ffd\u6eaf\uff1a\u65d7\u6807 \u2192 stale \u7f13\u5b58 \u2192 VLM \u65e7\u5e27 \u2192 SAM3 \u9519\u4f4d \u2192 mask \u574d\u585e \u2192 \u6df1\u5ea6\u5931\u8d25 \u2192 \u91cd\u8bd5\u6b7b\u5faa\u73af\u3002<strong>\u4e00\u884c\u4fee\u590d\u6062\u590d\u5b8c\u6574\u6293\u53d6\u6210\u529f\u3002</strong>',
            /* S6: Quantified Results */
            's6.title': '\u91cf\u5316\u6210\u679c',
            's6.th.metric': '\u6307\u6807',
            's6.th.before': '\u4fee\u590d\u524d',
            's6.th.after': '\u4fee\u590d\u540e',
            's6.th.method': '\u65b9\u6cd5',
            's6.r1.m': '\u8fdc\u573a VAD \u547d\u4e2d\u7387',
            's6.r1.how': '\u6709\u72b6\u6001 Silero h/c [2,1,64] + \u73b0\u573a\u6807\u5b9a',
            's6.r2.m': 'SAM3 \u63a9\u7801\u6210\u529f\u7387\uff08\u5c0f\u76ee\u6807\uff09',
            's6.r2.how': 'Letterbox + VLM bbox + CLIP \u6587\u672c\u8054\u5408\u5b9a\u4f4d',
            's6.r3.m': 'ASR \u6d41\u5f0f partial',
            's6.r3.b': 'Session \u91cd\u5efa \u2192 \u65e0\u8f93\u51fa',
            's6.r3.how': '\u4e91\u7aef endpointing \u4e3b\u6743 + heartbeat',
            's6.r4.m': 'AGC \u8fdc\u573a\u6062\u590d',
            's6.r4.b': '\u589e\u76ca\u51bb\u7ed3\u5728 +0 dB',
            's6.r4.a': '\u7ea6 2.4 \u79d2\u81f3\u6700\u5927\u589e\u76ca',
            's6.r4.how': '\u5305\u7edc AGC v5 \u9759\u9ed8\u722c\u5347',
            's6.r5.m': 'P0 \u6293\u53d6\u6210\u529f\u7387',
            's6.r5.b': '4 \u8f6e\u91cd\u8bd5\u5168\u90e8\u5931\u8d25',
            's6.r5.a': '\u95ed\u73af\u53ef\u6210\u529f',
            's6.r5.how': '7 \u6b65\u6839\u56e0\u5ba1\u8ba1 + \u4e00\u884c\u4fee\u590d',
            's6.r6.m': '\u989c\u8272/\u54c1\u724c\u8def\u7531\u9519\u8bef',
            's6.r6.b': 'HSV \u8bef\u5206\u7c7b',
            's6.r6.how': 'VLM \u51fa\u6846\u9636\u6bb5\u8def\u7531\uff08\u5173\u95ed HSV rerank\uff09',
            's6.r7.m': '目标丢失超时',
            's6.r7.b': '60 秒',
            's6.r7.a': '3 秒',
            's6.r7.how': 'sam3_lost_timeout_sec: 60 秒 -> 3 秒',
            's6.cap1': '\u5355\u5361 AGX Orin \u7aef\u5230\u7aef\u5355\u6307\u4ee4\u5ef6\u8fdf',
            's6.cap2': '关键指标：修复前后对比',
            's6.cap3': '语音、视觉与验证指标在优化后的雷达汇总。',
            /* S7: Technical Highlights */
            's7.title': '\u6280\u672f\u4eae\u70b9',
            's7.h1.title': '\u5305\u7edc AGC v5',
            's7.h1.desc': '5 \u8f6e\u8fed\u4ee3\u8bbe\u8ba1\uff1a\u5feb\u901f\u5cf0\u503c\u5c01\u9876\uff080.85 \u5373\u65f6\u94b3\u4f4d\uff09\u3001\u5305\u7edc\u8ddf\u8e2a\uff08attack/release=0.30\uff09\u3001\u9759\u9ed8\u722c\u5347\uff08\u7ea6 2.4 \u79d2\u5347\u81f3\u6ee1\u589e\u76ca\uff09\u3001tanh \u8f6f\u9650\u5e45\u3002\u89e3\u51b3\u300c\u8fdc\u8fd1\u5207\u6362\u300d\u573a\u666f\u4e0b\u589e\u76ca\u51bb\u7ed3\u5728 +0 dB \u7684\u95ee\u9898\u3002',
            's7.h2.title': 'Letterbox \u5bf9\u9f50',
            's7.h2.desc': '\u7edf\u4e00\u7f29\u653e\u6bd4\u4fdd\u6301 16:9 \u5bbd\u9ad8\u6bd4\uff0c\u7528\u4e8e VLM \u5230 SAM3 \u7684\u5750\u6807\u53d8\u6362\uff0c\u9632\u6b62 1.78 \u500d\u7eb5\u5411\u62c9\u4f38\u5bfc\u81f4\u5c0f\u76ee\u6807\u63a9\u7801\u574d\u585e\u3002',
            's7.h3.title': '5 \u5c42\u8bed\u4e49\u9632\u7ebf',
            's7.h3.desc': '\u7ea7\u8054\u9519\u8bef\u62e6\u622a\uff1a\u767d\u540d\u5355\u56de\u6536\u3001\u989c\u8272\u56de\u586b\u3001\u5e7b\u89c9\u5265\u79bb\u3001\u54e8\u5175\u8fc7\u6ee4\u3001VLM-SAM3 \u77db\u76fe\u4fe1\u53f7\u68c0\u6d4b\u3002\u6bcf\u5c42\u6355\u83b7\u524d\u4e00\u5c42\u9057\u6f0f\u7684\u9519\u8bef\u3002',
            's7.h4.title': '3D \u6293\u53d6\u7968\u51b3 + \u89e6\u89c9',
            's7.h4.desc': '\u591a\u7279\u5f81\u70b9\u4e91\u9a8c\u8bc1\uff08median/P25/frac \u9608\u503c\uff09+ \u95ed\u5408\u540e\u89e6\u89c9\u57fa\u7ebf ResetTactileSensor()\u3002Delta \u5224\u5b9a\uff1a\u529b\u4fdd\u6301 = \u771f\u6293\u4f4f\uff0c\u529b\u8870\u51cf = \u7a7a\u6293\u3002',
            'footer': footer_zh
        }
    };

    const langBtn = document.getElementById('langToggle');
    let currentLang = localStorage.getItem('lang') || 'en';

    function setLang(lang) {
        currentLang = lang;
        const dict = i18n[lang];
        if (!dict) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] != null) el.textContent = dict[key];
        });

        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (dict[key] != null) el.innerHTML = dict[key];
        });

        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '\u4e2d';
        localStorage.setItem('lang', lang);
    }

    setLang(currentLang);

    langBtn?.addEventListener('click', () => {
        setLang(currentLang === 'en' ? 'zh' : 'en');
    });
})();
