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
            'hero.title': 'VoxIntent: Voice-to-Intent Pipeline',
            'hero.venue': 'The Chinese University of Hong Kong',
            'hero.tagline': '16 kHz ALSA \u00b7 3-tier cascaded VAD \u00b7 4-engine streaming ASR \u00b7 dual-path NLU \u00b7 VLM instruction grounding \u00b7 TTS echo guard',
            'hero.vad': 'VAD',
            'hero.asr': 'ASR',
            'hero.nlu': 'NLU',
            'hero.results': 'Results',
            'hero.code': 'Code',
            /* Metrics */
            'm.vad': 'Far-field VAD hit rate',
            'm.asr': 'ASR partial latency',
            'm.engines': 'Pluggable ASR engines',
            'm.dict': 'zh\u2192en object dictionary',
            /* S0: Overview */
            's0.title': 'Overview',
            's0.p1': 'Deploying voice-controlled manipulation on Jetson AGX Orin surfaced a chain of interface failures: far-field speech vanishes into background noise, TTS echo re-triggers the ASR, cloud endpointing splits single commands, and dirty NLU output cascades into wrong targets. <strong>VoxIntent</strong> is a voice-to-intent pipeline that converts 16 kHz ALSA PCM into structured execution intents through a field-calibrated 3-tier VAD, a cloud-first 4-engine streaming ASR router with envelope AGC v5, dual-path NLU (6 Chinese action regex + qwen3.5-flash JSON), a 5-layer semantic defense cascade, VLM-grounded instruction understanding, and a multi-engine TTS feedback loop with echo suppression.',
            's0.c1': 'Engineered a <strong>3-tier cascaded VAD quality gate</strong> (adaptive P10 energy floor + software AGC \u221220 dBFS + stateful Silero v4 ONNX h/c [2,1,64]) with on-site field calibration (noise \u221246 dB, speech \u221239 dB, margin 6 dB), lifting far-field hit rate from 0% to 92%.',
            's0.c2': 'Architected a <strong>cloud-first 4-engine streaming ASR router</strong> (cloud_qwen3 / cloud_paraformer / local Qwen3-ASR TRT / FunASR) with envelope AGC v5 (fast peak ceiling + silence-creep ~2.4 s recovery), cloud endpointing ownership transfer, and rapid-stitch verb-head buffering, delivering 150\u2013300 ms streaming partials.',
            's0.c3': 'Designed a <strong>dual-path NLU</strong> (6 priority-ordered action regex against a 290+ object whitelist + qwen3.5-flash JSON, temperature=0, 28-token cap, reasoning mode disabled) with a <strong>5-layer semantic defense cascade</strong> and a <strong>6-state dialog manager</strong> with 3-score ambient rejection gating.',
            's0.c4': 'Integrated <strong>VLM-grounded instruction understanding</strong> (source-pixel xyxy bbox contract with letterbox alignment) and a <strong>multi-engine TTS feedback loop</strong> (preset cache / edge-tts streaming / Qwen TTS) with playback-active echo suppression replacing planned AEC.',
            /* S1: Pipeline Architecture */
            's1.title': 'Pipeline Architecture',
            's1.scope': '<strong>My scope:</strong> I owned the voice front-end (ALSA capture, 3-tier VAD, TTS echo guard), streaming ASR routing (4 engines, AGC v5, cloud endpointing), NLU parsing (regex + LLM, semantic defense, keyword extraction), dialog management, VLM instruction grounding (bbox bridge, translation), and TTS feedback. Downstream navigation, IK planning, and motor execution were collaborator-owned.',
            /* S2: ASR+VAD Architecture */
            's2.title': 'ASR + VAD Architecture',
            's2.cap': 'VadQualityGate front-end cascading into the 4-engine ASR router: local Qwen3-ASR TRT (conv_frontend + AuT encoder 32\u00d7SA+3\u00d7Conv2d + AuT decoder 8\u00d7) and cloud Qwen3 LM path, with post-processing chain feeding downstream NLU.',
            /* S3: Voice Frontend */
            's3.title': 'Voice Frontend: Field-Calibrated 3-Tier VAD',
            's3.p1': 'The <code>VadQualityGate</code> class implements a 3-tier cascaded quality gate. <strong>Layer 1</strong> (pre-AGC): adaptive energy filtering with self-calibrating noise floor \u2014 a sliding window collects non-speech energy history, computes P10 percentile as noise floor, and sets threshold = floor + margin. On-site measurements: noise \u2248 \u221246 dB, speech \u2248 \u221239 dB, margin = 6 dB. <strong>Layer 2</strong>: software AGC normalizes RMS to \u221220 dBFS target (max gain +30 dB, upward-only \u2014 never attenuates). <strong>Layer 3</strong>: Silero v4 ONNX on CPU, processing 512-sample chunks (32 ms @ 16 kHz), with h/c separated hidden state [2,1,64].',
            's3.p2': 'The critical fix was enabling <strong>stateful Silero inference</strong> across 64 ms audio blocks. Without <code>stateful_silero=True</code>, each ROS audio callback (1024 samples = 2 Silero chunks) ran Silero from cold-start h/c = zeros \u2014 far too little context for the RNN to distinguish weak speech from noise. Field logs showed <code>speech=0</code> across all windows despite peak amplitude 26063. With cross-call state preservation, the RNN accumulates context naturally, and speech detection recovers.',
            's3.h.postfilter': 'Layer 4: ASR Output Post-Filter',
            's3.p3': 'A 4th layer filters ASR output before downstream dispatch: <strong>hallucination detection</strong> (frozen set of 20+ phantom phrases like \u201c\u5b57\u5e55by\u201d/\u201c\u611f\u8c22\u89c2\u770b\u201d), <strong>rambling detection</strong> (\u22652 of: filler prefix, particle density \u226520%, hesitation words \u22652, bigram repeat \u22653), <strong>repeated phrase removal</strong> (regex <code>(.{2,})\\1+</code>), and <strong>non-CJK/English ratio</strong> (>30% foreign script \u2192 reject). This prevents ASR noise from polluting the NLU.',
            's3.result': 'Far-field Silero hit rate: <strong>0% \u2192 92%</strong> \u2022 VAD discrimination: noise < 0.01, speech > 0.99 \u2022 Noise floor converges in ~15 s',
            's3.bar.cap': 'Far-field VAD hit rate before vs after enabling stateful Silero inference across 64 ms blocks (field-reported, single Jetson AGX Orin).',
            /* S4: Streaming ASR */
            's4.title': 'Streaming ASR: Cloud-First 4-Engine Router',
            's4.p1': 'The <code>StreamingAsrNode</code> hosts a pluggable engine router (<code>build_engine()</code>) selecting one of 4 ASR backends at launch. Engine choice determines the audio path, endpointing ownership, and AGC strategy \u2014 the node auto-detects engine capabilities via <code>hasattr(engine, \'set_on_sentence_callback\')</code> and adapts accordingly.',
            's4.th.engine': 'Engine',
            's4.th.backend': 'Backend',
            's4.th.audio': 'Audio Path',
            's4.th.eou': 'Endpointing',
            's4.e1.backend': 'DashScope qwen3-asr-flash-realtime (WebSocket)',
            's4.e1.audio': 'Raw passthrough + envelope AGC v5',
            's4.e1.eou': 'Server VAD (threshold=0.0, silence=1500ms)',
            's4.e2.backend': 'DashScope paraformer-realtime-v2 (hotword)',
            's4.e2.audio': 'RMS gate (280) + hangover (0.6s) + zero-fill',
            's4.e2.eou': 'Cloud endpointing (max_sentence_silence=1800ms, heartbeat)',
            's4.e3.backend': 'Local Qwen3-ASR TRT-LLM (~3 GB GPU)',
            's4.e3.audio': 'Local VAD gate + accumulated rerun',
            's4.e3.eou': 'Local EOU (silence \u2265 0.8s)',
            's4.e4.backend': 'FunASR paraformer-zh-streaming (chunk)',
            's4.e4.audio': 'Local VAD gate + 600ms chunks',
            's4.e4.eou': 'Local EOU (silence \u2265 0.8s)',
            's4.h.agc': 'Envelope AGC v5: Silence-Creep + Fast Peak Ceiling',
            's4.p2': 'The <code>cloud_qwen3</code> path applies a 5-iteration envelope-following AGC (<code>_apply_envelope_agc</code>) before feeding raw audio to the cloud. Key design: (1) <strong>fast peak ceiling</strong> \u2014 if <code>peak \u00d7 gain > 0.85</code>, gain is instantly clamped to <code>0.85/peak</code>; (2) <strong>envelope follow</strong> \u2014 when <code>rms > noise_floor (\u221238 dBFS)</code>, gain tracks toward <code>target/rms</code> with attack=0.30 / release=0.30; (3) <strong>silence creep (v5)</strong> \u2014 when <code>rms \u2264 noise_floor</code>, gain slowly rises toward max_gain at <code>attack \u00d7 0.2 = 0.06</code> per chunk (~2.4 s to max), pre-staging for the next far-field utterance; (4) <strong>soft-clip</strong> \u2014 <code>tanh</code> compression above knee=0.9.',
            's4.h.endpointing': 'Cloud Endpointing Ownership Transfer',
            's4.p3': 'For cloud engines, the node transfers sentence boundary detection to the cloud: <code>engine_owns_endpointing = True</code>. The cloud\u2019s <code>sentence_end</code> callback (<code>_on_cloud_sentence</code>) directly drives <code>publish_final</code>. Local EOU is disabled except as a <code>max_utterance_sec=20s</code> timeout watchdog. This eliminates the destructive pattern where local EOU triggered <code>session.stop()+start()</code> on every silence gap, causing partial count freezes and race conditions.',
            's4.h.stitch': 'Rapid-Stitch: Short Verb-Head Buffering',
            's4.p4': 'Cloud ASR sometimes splits a single command at word-boundary pauses (e.g., \u201c\u628a\u201d + 0.8 s pause + \u201c\u68d5\u8272\u73a9\u5177\u718a\u653e\u8fdb\u767d\u8272\u7bee\u5b50\u91cc\u201d \u2192 two finals). The <code>_handle_qwen_final</code> method detects short verb-head finals (\u22643 chars, prefix in {\u628a,\u62ff,\u653e,\u6293,\u7ed9,\u5e2e,\u8bf7,...}) and buffers them for 1.5 s. If a continuation final arrives within the window, the two are stitched; otherwise the short head is published alone.',
            's4.result': 'ASR streaming partial: <strong>150\u2013300 ms</strong> \u2022 Session survival: heartbeat \u2192 no 23 s SDK timeout \u2022 AGC v5 far-field recovery: <strong>~2.4 s</strong> silence-to-max-gain',
            /* S5: NLU & Intent */
            's5.title': 'NLU, Dialog & Semantic Defense',
            's5.h.nlu': 'Dual-Path Intent Parsing',
            's5.p1': 'The <code>VoiceCommandParser</code> operates in <code>regex_then_llm</code> mode. <strong>Fast path</strong>: six priority-ordered Chinese action regex templates (BA_ACTION_LOC, BA_ACTION, BA_PUT_INTO, VERB_OBJ, PLACE_ONLY, OBJ_PUT_LOC) matched against a 290+ known-object whitelist extract intent (pick_up / pick_and_place / place_only / move_to / chat / unknown) and entities in <1 ms. <strong>LLM path</strong>: qwen3.5-flash through OpenAI-compatible HTTP with a structured system prompt defining 6 intent types, noise classification rules, and entity fields (target_object, quantity, location, object_en, location_en). Generation: <code>temperature=0</code>, <code>max_new_tokens=28</code>, reasoning mode explicitly disabled (<code>enable_thinking: False</code>) to avoid 5\u201330 s latency.',
            's5.h.dialog': '6-State Dialog Manager',
            's5.p2': 'The <code>DialogManager</code> routes each ASR utterance through a 6-state FSM (IDLE / TASK_EXECUTING / HOLDING_OBJECT / AWAITING_CLARIFICATION / CHAT_SESSION / ERROR_RECOVERY) with 3-score multi-dimensional gating: <strong>directed_score</strong> (+0.75 direct address \u201c\u8389\u8389\u4e1d/\u5e2e\u6211\u201d, +0.60 quick chat, +0.35 question, +0.45 followup within 12 s), <strong>ambient_score</strong> (+0.80 fragment, +0.85 third-person narration), and <strong>task_score</strong> (0.9 when holding an object + place command). Only utterances with directed_score \u2265 0.55 or an active wake session pass the gate.',
            's5.h.defense': '5-Layer Semantic Defense Cascade',
            's5.p3': 'Five ordered defense layers intercept errors before they cascade into wrong targets: (1) <strong>Whitelist recovery</strong> \u2014 regex dictionary maps ASR noise to known objects; (2) <strong>Color backfill</strong> \u2014 if ASR omits a color prefix present in the original command, the parser re-injects it from <code>_ZH_COLOR_PREFIXES</code>; (3) <strong>Hallucination stripping</strong> \u2014 removes phantom locations invented by the LLM; (4) <strong>Sentinel filtering</strong> \u2014 <code>translate_for_sam3</code> checks against a known-object dictionary to prevent dictionary pollution; (5) <strong>VLM-SAM3 contradiction</strong> \u2014 if VLM gives a concrete bbox but downstream returns an empty or too-small mask, the result is rejected before it can pollute the tracking cache.',
            's5.h.keyword': '290+ Object Dictionary & Translation',
            's5.p4': 'The <code>keyword_extract</code> module maintains a 290+ zh\u2192en object dictionary covering fruits, vegetables, food/drinks (including brand names), containers, daily items, and toys. Translation pipeline: dictionary hit \u2192 runtime cache \u2192 color decomposition \u2192 substring match \u2192 active Qwen \u2192 sentinel blacklist (15 toxic labels like \u201cunknown\u201d). A quick-chat bypass (5 regex rules for time/date/weekday) saves ~400 ms per trivial query.',
            's5.result': 'NLU intent: <strong>6 types + noise classification</strong> \u2022 Regex fast path: <strong><1 ms</strong> \u2022 LLM path: <strong>~300 ms</strong> (reasoning disabled) \u2022 Dialog: <strong>6 states, 3-score gating</strong>',
            /* S6: VLM Grounding */
            's6.title': 'VLM Instruction Grounding',
            's6.p1': 'The perception pipeline feeds NLU output to a Qwen-compatible VLM HTTP route for bounding-box extraction. The critical coordinate contract: VLM outputs 0~1000 normalized boxes, and <code>_bbox_1000_to_xyxy</code> decodes them to source-pixel <code>xyxy</code> (x/1000\u00d7W, y/1000\u00d7H). Downstream modules receive <code>input_boxes_pixel_xyxy</code> in the original image plane. The bridge includes category guards, color/brand discrimination at the VLM prompt stage (moved from HSV heuristics, with HSV rerank as rollback), and label rejection to prevent ambiguous targets from entering the grounding chain.',
            's6.p2': 'The HTTP layer uses a connection pool (8 connections/host, 45 s idle TTL, TCP_NODELAY + SO_KEEPALIVE) with SSE bracket-depth early JSON return: once a valid JSON object closes, the response is parsed immediately while a background thread drains the stream for connection reuse. VLM bbox TTFB: 850\u20132950 ms at full resolution, 500\u20132500 ms with <code>HAR_VLM_BBOX_MAX_SIDE=512</code>.',
            's6.scope': '<strong>Scope boundary:</strong> VLM instruction grounding (bbox extraction, coordinate mapping, prompt construction, translation) is on this page. SAM3 mask inference, 3D reconstruction, and grasp verification are downstream modules owned by the full pipeline.',
            's6.result': 'Field-reported VLM-assisted grounding: <strong>4/44 (box-only) \u2192 \u226590% (box+text)</strong> \u2022 Color routing moved to VLM stage \u2022 TTFB reduced with <code>max_side=512</code>',
            /* S7: TTS Feedback */
            's7.title': 'TTS Feedback & Echo Guard',
            's7.p1': 'The <code>TtsNode</code> manages a priority-ordered synthesis chain: (1) <strong>preset cache</strong> \u2014 pre-recorded audio for high-frequency responses (~0 ms); (2) <strong>edge-tts streaming</strong> \u2014 Microsoft XiaoxiaoNeural (~500 ms first audio); (3) <strong>Qwen TTS</strong> \u2014 Vivian voice via subprocess. A circuit breaker (3 consecutive failures = 60 s cooldown) prevents cascading TTS failures from blocking the pipeline. 35+ speech variant categories (2\u20137 variants each) with consecutive-repeat suppression drive the Lilith persona.',
            's7.h.echo': 'Echo Suppression Architecture',
            's7.p2': 'No AEC exists in the codebase. Echo suppression uses a <strong>two-layer playback-active gate</strong>: (1) at the ALSA capture node, TTS playback triggers <strong>PulseAudio source mute</strong> on the input device; (2) at the ASR streaming node, <code>/tts/playback_active</code> drives <strong>PCM zero-fill</strong> for the duration of playback + 350 ms post-guard. Barge-in is disabled by default (<code>barge_in_enabled: False</code>); the optional interrupt path remains guarded behind a separate flag.',
            's7.result': 'TTS preset: <strong>~0 ms</strong> \u2022 edge-tts first audio: <strong>~500 ms</strong> \u2022 Echo guard: <strong>source mute + zero-fill</strong> (no AEC) \u2022 Circuit breaker: <strong>3 fails \u2192 60 s cooldown</strong>',
            /* S8: Results */
            's8.title': 'Quantified Results',
            's8.th.metric': 'Metric',
            's8.th.before': 'Before',
            's8.th.after': 'After',
            's8.th.method': 'Method',
            's8.r1.m': 'Far-field VAD hit rate',
            's8.r1.how': 'Stateful Silero h/c [2,1,64] + field calibration',
            's8.r2.m': 'ASR streaming partial',
            's8.r2.b': 'Session rebuild \u2192 no output',
            's8.r2.how': 'Cloud endpointing ownership + heartbeat',
            's8.r3.m': 'AGC far-field recovery',
            's8.r3.b': 'Gain frozen at +0 dB',
            's8.r3.a': '~2.4 s to max gain',
            's8.r3.how': 'Envelope AGC v5 silence-creep',
            's8.r4.m': 'VLM-assisted grounding',
            's8.r4.how': 'Source-pixel VLM bbox + box/text joint prompt',
            's8.r5.m': 'NLU reasoning latency',
            's8.r5.b': '5\u201330 s (thinking mode)',
            's8.r5.a': '<300 ms',
            's8.r5.how': 'enable_thinking=False + 28-token cap',
            /* S9: Highlights */
            's9.title': 'Technical Highlights',
            's9.h1.title': 'Envelope AGC v5',
            's9.h1.desc': '4-stage design: fast peak ceiling (instant clamp at 0.85), envelope follow (attack/release=0.30), silence creep (slow rise to max gain in ~2.4 s), and tanh soft-clip. Solves the near-to-far transition where gain freezes at +0 dB after loud speech.',
            's9.h2.title': 'Cloud Endpointing + Rapid-Stitch',
            's9.h2.desc': 'Cloud owns sentence boundaries; local EOU is a 20 s watchdog only. Short verb-head finals (\u22643 chars, 14 prefix hints) are buffered 1.5 s for stitching, preventing command splits like \u201c\u628a\u201d + pause + \u201c\u68d5\u8272\u73a9\u5177\u718a\u653e\u8fdb\u7bee\u5b50\u201d from generating two separate intents.',
            's9.h3.title': '5-Layer Semantic Defense',
            's9.h3.desc': 'Whitelist recovery, ASR color backfill, hallucinated-place stripping, translation sentinel filtering (15 toxic labels), and VLM-SAM3 contradiction rejection. Each layer traces to code evidence with specific regex patterns and threshold values.',
            's9.h4.title': 'TTS Echo Guard (No AEC)',
            's9.h4.desc': 'PulseAudio source mute + PCM zero-fill during playback + 350 ms post-guard replaces planned AEC. Barge-in disabled by default; all PCM frames including silence stay in the cloud ASR stream so server-side endpointing fires correctly.',
            'footer': footer_en
        },
        zh: {
            'back': '\u8fd4\u56de\u4e3b\u9875',
            /* Hero */
            'hero.title': 'VoxIntent\uff1a\u8bed\u97f3\u610f\u56fe\u5168\u94fe\u8def',
            'hero.venue': '\u9999\u6e2f\u4e2d\u6587\u5927\u5b66',
            'hero.tagline': '16 kHz ALSA \u00b7 3 \u5c42\u7ea7\u8054 VAD \u00b7 4 \u5f15\u64ce\u6d41\u5f0f ASR \u00b7 \u53cc\u8def\u5f84 NLU \u00b7 VLM \u6307\u4ee4\u5b9a\u4f4d \u00b7 TTS \u56de\u58f0\u95e8\u63a7',
            'hero.vad': 'VAD',
            'hero.asr': 'ASR',
            'hero.nlu': 'NLU',
            'hero.results': '\u7ed3\u679c',
            'hero.code': '\u4ee3\u7801',
            /* Metrics */
            'm.vad': '\u8fdc\u573a VAD \u547d\u4e2d\u7387',
            'm.asr': 'ASR partial \u5ef6\u8fdf',
            'm.engines': '\u53ef\u63d2\u62d4 ASR \u5f15\u64ce',
            'm.dict': 'zh\u2192en \u5bf9\u8c61\u8bcd\u5178',
            /* S0: Overview */
            's0.title': '\u9879\u76ee\u6982\u8ff0',
            's0.p1': '\u5728 Jetson AGX Orin \u4e0a\u90e8\u7f72\u8bed\u97f3\u63a7\u5236\u64cd\u4f5c\u65f6\uff0c\u4e00\u7cfb\u5217\u63a5\u53e3\u6545\u969c\u6d6e\u51fa\u6c34\u9762\uff1a\u8fdc\u573a\u8bed\u97f3\u6de1\u5165\u80cc\u666f\u566a\u58f0\u3001TTS \u56de\u58f0\u91cd\u65b0\u89e6\u53d1 ASR\u3001\u4e91\u7aef\u65ad\u53e5\u62c6\u5206\u5355\u6761\u547d\u4ee4\u3001\u810f NLU \u8f93\u51fa\u7ea7\u8054\u4e3a\u9519\u8bef\u76ee\u6807\u3002<strong>VoxIntent</strong> \u662f\u4e00\u6761\u8bed\u97f3\u610f\u56fe\u5168\u94fe\u8def\uff1a\u628a 16 kHz ALSA PCM \u901a\u8fc7\u73b0\u573a\u6807\u5b9a\u7684 3 \u5c42 VAD\u30014 \u5f15\u64ce\u6d41\u5f0f ASR\uff08\u914d\u5305\u7edc AGC v5\uff09\u3001\u53cc\u8def\u5f84 NLU\uff086 \u4e2a\u4e2d\u6587\u52a8\u4f5c\u6b63\u5219 + qwen3.5-flash JSON\uff09\u30015 \u5c42\u8bed\u4e49\u9632\u7ebf\u3001VLM \u6307\u4ee4\u5b9a\u4f4d\u3001\u4ee5\u53ca\u5e26\u56de\u58f0\u6291\u5236\u7684\u591a\u5f15\u64ce TTS \u53cd\u9988\u73af\uff0c\u8f6c\u5316\u4e3a\u7ed3\u6784\u5316\u6267\u884c\u610f\u56fe\u3002',
            's0.c1': '\u5de5\u7a0b\u5316\u4e86\u4e00\u4e2a<strong>3 \u5c42\u7ea7\u8054 VAD \u8d28\u91cf\u95e8\u63a7</strong>\uff08\u81ea\u9002\u5e94 P10 \u80fd\u91cf\u5e95 + \u8f6f\u4ef6 AGC \u221220 dBFS + \u6709\u72b6\u6001 Silero v4 ONNX h/c [2,1,64]\uff09\uff0c\u73b0\u573a\u6807\u5b9a\uff08\u566a\u58f0 \u221246 dB\u3001\u8bed\u97f3 \u221239 dB\u3001\u88d5\u91cf 6 dB\uff09\uff0c\u8fdc\u573a\u547d\u4e2d\u7387 0% \u2192 92%\u3002',
            's0.c2': '\u67b6\u6784\u4e86\u4e00\u4e2a<strong>\u4e91\u4f18\u5148 4 \u5f15\u64ce\u6d41\u5f0f ASR \u8def\u7531</strong>\uff08cloud_qwen3 / cloud_paraformer / \u672c\u5730 Qwen3-ASR TRT / FunASR\uff09\uff0c\u914d\u5305\u7edc AGC v5\uff08\u5feb\u901f\u5cf0\u503c\u5c01\u9876 + \u9759\u9ed8\u722c\u5347 ~2.4 \u79d2\u6062\u590d\uff09\u3001\u4e91\u7aef endpointing \u4e3b\u6743\u8f6c\u79fb\u3001\u52a8\u8bcd\u5934\u5feb\u62fc\u7f13\u51b2\uff0c\u5b9e\u73b0 150\u2013300 ms \u6d41\u5f0f partial\u3002',
            's0.c3': '\u8bbe\u8ba1\u4e86<strong>\u53cc\u8def\u5f84 NLU</strong>\uff086 \u4e2a\u4f18\u5148\u7ea7\u52a8\u4f5c\u6b63\u5219\u5339\u914d 290+ \u5bf9\u8c61\u767d\u540d\u5355 + qwen3.5-flash JSON\uff0ctemperature=0\uff0c28-token \u4e0a\u9650\uff0c\u7981\u7528 reasoning \u6a21\u5f0f\uff09\uff0c\u642d\u914d<strong>5 \u5c42\u8bed\u4e49\u9632\u7ebf\u7ea7\u8054</strong>\u548c<strong>6 \u72b6\u6001\u5bf9\u8bdd\u7ba1\u7406\u5668</strong>\uff083 \u7ef4\u5ea6\u73af\u5883\u97f3\u62d2\u7edd\u95e8\u63a7\uff09\u3002',
            's0.c4': '\u96c6\u6210\u4e86<strong>VLM \u6307\u4ee4\u5b9a\u4f4d</strong>\uff08\u539f\u56fe\u50cf\u7d20 xyxy bbox \u5951\u7ea6 + letterbox \u5bf9\u9f50\uff09\u548c<strong>\u591a\u5f15\u64ce TTS \u53cd\u9988\u73af</strong>\uff08\u9884\u5f55\u7f13\u5b58 / edge-tts \u6d41\u5f0f / Qwen TTS\uff09\uff0c\u4ee5 playback-active \u56de\u58f0\u6291\u5236\u66ff\u4ee3\u8ba1\u5212\u4e2d\u7684 AEC\u3002',
            /* S1 */
            's1.title': '\u7ba1\u7ebf\u67b6\u6784',
            's1.scope': '<strong>\u6211\u7684\u804c\u8d23\uff1a</strong>\u8d1f\u8d23\u8bed\u97f3\u524d\u7aef\uff08ALSA \u91c7\u96c6\u30013 \u5c42 VAD\u3001TTS \u56de\u58f0\u95e8\u63a7\uff09\u3001\u6d41\u5f0f ASR \u8def\u7531\uff084 \u5f15\u64ce\u3001AGC v5\u3001\u4e91\u7aef endpointing\uff09\u3001NLU \u89e3\u6790\uff08\u6b63\u5219 + LLM\u3001\u8bed\u4e49\u9632\u7ebf\u3001\u5173\u952e\u8bcd\u63d0\u53d6\uff09\u3001\u5bf9\u8bdd\u7ba1\u7406\u3001VLM \u6307\u4ee4\u5b9a\u4f4d\uff08bbox bridge\u3001\u7ffb\u8bd1\uff09\u548c TTS \u53cd\u9988\u3002\u4e0b\u6e38\u5bfc\u822a\u3001IK \u89c4\u5212\u548c\u7535\u673a\u6267\u884c\u7531\u534f\u4f5c\u56e2\u961f\u8d1f\u8d23\u3002',
            /* S2 */
            's2.title': 'ASR + VAD \u67b6\u6784',
            's2.cap': 'VadQualityGate \u524d\u7aef\u7ea7\u8054\u81f3 4 \u5f15\u64ce ASR \u8def\u7531\uff1a\u672c\u5730 Qwen3-ASR TRT\uff08conv_frontend + AuT encoder 32\u00d7SA+3\u00d7Conv2d + AuT decoder 8\u00d7\uff09\u548c\u4e91\u7aef Qwen3 LM \u8def\u5f84\uff0c\u540e\u5904\u7406\u94fe\u8def\u8fde\u63a5\u4e0b\u6e38 NLU\u3002',
            /* S3 */
            's3.title': '\u8bed\u97f3\u524d\u7aef\uff1a\u73b0\u573a\u6807\u5b9a\u7684\u4e09\u5c42 VAD',
            's3.p1': '<code>VadQualityGate</code> \u7c7b\u5b9e\u73b0\u4e86 3 \u5c42\u7ea7\u8054\u8d28\u91cf\u95e8\u63a7\u3002<strong>\u7b2c 1 \u5c42</strong>\uff08AGC \u524d\uff09\uff1a\u81ea\u9002\u5e94\u80fd\u91cf\u8fc7\u6ee4\uff0c\u81ea\u6821\u51c6\u566a\u5e95 \u2014 \u6ed1\u52a8\u7a97\u53e3\u6536\u96c6\u975e\u8bed\u97f3\u80fd\u91cf\u5386\u53f2\uff0c\u8ba1\u7b97 P10 \u767e\u5206\u4f4d\u4f5c\u4e3a\u566a\u5e95\uff0c\u9608\u503c = \u566a\u5e95 + \u88d5\u91cf\u3002\u73b0\u573a\u6d4b\u91cf\uff1a\u566a\u58f0 \u2248 \u221246 dB\uff0c\u8bed\u97f3 \u2248 \u221239 dB\uff0c\u88d5\u91cf = 6 dB\u3002<strong>\u7b2c 2 \u5c42</strong>\uff1a\u8f6f\u4ef6 AGC \u5c06 RMS \u5f52\u4e00\u5230 \u221220 dBFS \u76ee\u6807\uff08\u6700\u5927\u589e\u76ca +30 dB\uff0c\u4ec5\u4e0a\u8c03 \u2014 \u4ece\u4e0d\u8870\u51cf\uff09\u3002<strong>\u7b2c 3 \u5c42</strong>\uff1aSilero v4 ONNX \u5728 CPU \u4e0a\u8fd0\u884c\uff0c\u5904\u7406 512 \u6837\u672c\u5757\uff0832 ms @ 16 kHz\uff09\uff0ch/c \u5206\u79bb\u9690\u85cf\u72b6\u6001 [2,1,64]\u3002',
            's3.p2': '\u5173\u952e\u4fee\u590d\u662f\u542f\u7528<strong>\u8de8 64 ms \u97f3\u9891\u5757\u7684\u6709\u72b6\u6001 Silero \u63a8\u7406</strong>\u3002\u672a\u542f\u7528 <code>stateful_silero=True</code> \u65f6\uff0c\u6bcf\u6b21 ROS \u97f3\u9891\u56de\u8c03\uff081024 \u6837\u672c = 2 \u4e2a Silero \u5757\uff09\u4ece\u96f6\u521d\u59cb\u5316 h/c \u8fd0\u884c Silero \u2014 RNN \u4e0a\u4e0b\u6587\u4e0d\u8db3\u4ee5\u533a\u5206\u5f31\u8bed\u97f3\u4e0e\u566a\u58f0\u3002\u73b0\u573a\u65e5\u5fd7\u663e\u793a\u6240\u6709\u7a97\u53e3 <code>speech=0</code>\uff0c\u5c3d\u7ba1\u5cf0\u503c\u632f\u5e45\u8fbe 26063\u3002\u542f\u7528\u8de8\u8c03\u7528\u72b6\u6001\u4fdd\u6301\u540e\uff0cRNN \u81ea\u7136\u7d2f\u79ef\u4e0a\u4e0b\u6587\uff0c\u8bed\u97f3\u68c0\u6d4b\u6062\u590d\u3002',
            's3.h.postfilter': '\u7b2c 4 \u5c42\uff1aASR \u8f93\u51fa\u540e\u8fc7\u6ee4',
            's3.p3': '\u7b2c 4 \u5c42\u5728\u4e0b\u6e38\u5206\u53d1\u524d\u8fc7\u6ee4 ASR \u8f93\u51fa\uff1a<strong>\u5e7b\u89c9\u68c0\u6d4b</strong>\uff0820+ \u6761\u5e7d\u7075\u77ed\u8bed\u51bb\u7ed3\u96c6\uff0c\u5982\u300c\u5b57\u5e55by\u300d/\u300c\u611f\u8c22\u89c2\u770b\u300d\uff09\uff0c<strong>\u5570\u55e6\u68c0\u6d4b</strong>\uff08\u22652 \u9879\u547d\u4e2d\uff1a\u586b\u5145\u524d\u7f00\u3001\u8bed\u6c14\u8bcd\u5bc6\u5ea6 \u226520%\u3001\u72b9\u8c6b\u8bcd \u22652\u3001bigram \u91cd\u590d \u22653\uff09\uff0c<strong>\u91cd\u590d\u77ed\u8bed\u79fb\u9664</strong>\uff08\u6b63\u5219 <code>(.{2,})\\1+</code>\uff09\uff0c\u4ee5\u53ca<strong>\u975e CJK/\u82f1\u6587\u6bd4\u4f8b</strong>\uff08>30% \u5916\u6587\u811a\u672c \u2192 \u62d2\u7edd\uff09\u3002\u9632\u6b62 ASR \u566a\u58f0\u6c61\u67d3 NLU\u3002',
            's3.result': '\u8fdc\u573a Silero \u547d\u4e2d\u7387\uff1a<strong>0% \u2192 92%</strong> \u2022 VAD \u533a\u5206\u5ea6\uff1a\u566a\u58f0 < 0.01\uff0c\u8bed\u97f3 > 0.99 \u2022 \u566a\u5e95\u7ea6 15 \u79d2\u6536\u655b',
            's3.bar.cap': '\u8fdc\u573a VAD \u547d\u4e2d\u7387\uff1a\u5728 64 ms \u5757\u4e0a\u542f\u7528 stateful Silero \u63a8\u7406\u524d\u540e\u5bf9\u6bd4\uff08\u73b0\u573a\u62a5\u544a\uff0c\u5355\u53f0 Jetson AGX Orin\uff09\u3002',
            /* S4 */
            's4.title': '\u6d41\u5f0f ASR\uff1a\u4e91\u4f18\u5148 4 \u5f15\u64ce\u8def\u7531',
            's4.p1': '<code>StreamingAsrNode</code> \u6258\u7ba1\u53ef\u63d2\u62d4\u5f15\u64ce\u8def\u7531\uff08<code>build_engine()</code>\uff09\uff0c\u542f\u52a8\u65f6\u9009\u62e9 4 \u79cd ASR \u540e\u7aef\u4e4b\u4e00\u3002\u5f15\u64ce\u9009\u62e9\u51b3\u5b9a\u97f3\u9891\u8def\u5f84\u3001endpointing \u5f52\u5c5e\u548c AGC \u7b56\u7565 \u2014 \u8282\u70b9\u901a\u8fc7 <code>hasattr(engine, \'set_on_sentence_callback\')</code> \u81ea\u52a8\u68c0\u6d4b\u5f15\u64ce\u80fd\u529b\u5e76\u76f8\u5e94\u9002\u914d\u3002',
            's4.th.engine': '\u5f15\u64ce',
            's4.th.backend': '\u540e\u7aef',
            's4.th.audio': '\u97f3\u9891\u8def\u5f84',
            's4.th.eou': '\u65ad\u53e5\u65b9\u5f0f',
            's4.e1.backend': 'DashScope qwen3-asr-flash-realtime\uff08WebSocket\uff09',
            's4.e1.audio': '\u539f\u59cb\u76f4\u901a + \u5305\u7edc AGC v5',
            's4.e1.eou': '\u670d\u52a1\u7aef VAD\uff08threshold=0.0, silence=1500ms\uff09',
            's4.e2.backend': 'DashScope paraformer-realtime-v2\uff08\u70ed\u8bcd\uff09',
            's4.e2.audio': 'RMS \u95e8\u63a7 (280) + \u6302\u7559 (0.6s) + \u96f6\u586b\u5145',
            's4.e2.eou': '\u4e91\u7aef\u53e5\u5c3e\u5224\u5b9a\uff08max_sentence_silence=1800ms, heartbeat\uff09',
            's4.e3.backend': '\u672c\u5730 Qwen3-ASR TRT-LLM\uff08~3 GB GPU\uff09',
            's4.e3.audio': '\u672c\u5730 VAD \u95e8\u63a7 + \u7d2f\u79ef\u91cd\u8dd1',
            's4.e3.eou': '\u672c\u5730 EOU\uff08\u9759\u9ed8 \u2265 0.8s\uff09',
            's4.e4.backend': 'FunASR paraformer-zh-streaming\uff08chunk\uff09',
            's4.e4.audio': '\u672c\u5730 VAD \u95e8\u63a7 + 600ms \u5206\u5757',
            's4.e4.eou': '\u672c\u5730 EOU\uff08\u9759\u9ed8 \u2265 0.8s\uff09',
            's4.h.agc': '\u5305\u7edc AGC v5\uff1a\u9759\u9ed8\u722c\u5347 + \u5feb\u901f\u5cf0\u503c\u5c01\u9876',
            's4.p2': '<code>cloud_qwen3</code> \u8def\u5f84\u5728\u5c06\u539f\u59cb\u97f3\u9891\u9001\u5165\u4e91\u7aef\u524d\uff0c\u5e94\u7528 5 \u8f6e\u8fed\u4ee3\u5305\u7edc\u8ddf\u8e2a AGC\uff08<code>_apply_envelope_agc</code>\uff09\u3002\u6838\u5fc3\u8bbe\u8ba1\uff1a(1) <strong>\u5feb\u901f\u5cf0\u503c\u5c01\u9876</strong> \u2014 \u82e5 <code>peak \u00d7 gain > 0.85</code>\uff0c\u589e\u76ca\u7acb\u5373\u94b3\u4f4d\u81f3 <code>0.85/peak</code>\uff1b(2) <strong>\u5305\u7edc\u8ddf\u8e2a</strong> \u2014 \u5f53 <code>rms > \u566a\u5e95 (\u221238 dBFS)</code>\uff0c\u589e\u76ca\u4ee5 attack=0.30 / release=0.30 \u8ffd\u8e2a <code>target/rms</code>\uff1b(3) <strong>\u9759\u9ed8\u722c\u5347 (v5)</strong> \u2014 \u5f53 <code>rms \u2264 \u566a\u5e95</code>\uff0c\u589e\u76ca\u4ee5 <code>attack \u00d7 0.2 = 0.06</code>/\u5757\u7f13\u6162\u722c\u5347\u81f3 max_gain\uff08\u7ea6 2.4 \u79d2\u5230\u6ee1\uff09\uff1b(4) <strong>\u8f6f\u9650\u5e45</strong> \u2014 knee=0.9 \u4ee5\u4e0a <code>tanh</code> \u538b\u7f29\u3002',
            's4.h.endpointing': '\u4e91\u7aef Endpointing \u4e3b\u6743\u8f6c\u79fb',
            's4.p3': '\u5bf9\u4e8e\u4e91\u7aef\u5f15\u64ce\uff0c\u8282\u70b9\u5c06\u53e5\u5b50\u8fb9\u754c\u68c0\u6d4b\u4e3b\u6743\u8f6c\u4ea4\u4e91\u7aef\uff1a<code>engine_owns_endpointing = True</code>\u3002\u4e91\u7aef\u7684 <code>sentence_end</code> \u56de\u8c03\uff08<code>_on_cloud_sentence</code>\uff09\u76f4\u63a5\u9a71\u52a8 <code>publish_final</code>\u3002\u672c\u5730 EOU \u4ec5\u4f5c\u4e3a <code>max_utterance_sec=20s</code> \u8d85\u65f6\u770b\u95e8\u72d7\u3002\u8fd9\u6d88\u9664\u4e86\u672c\u5730 EOU \u5728\u6bcf\u6b21\u9759\u9ed8\u95f4\u9699\u89e6\u53d1 <code>session.stop()+start()</code> \u7684\u7834\u574f\u6027\u6a21\u5f0f\uff0c\u540e\u8005\u5bfc\u81f4 partial \u8ba1\u6570\u51bb\u7ed3\u548c\u7ade\u6001\u3002',
            's4.h.stitch': '\u5feb\u901f\u62fc\u63a5\uff1a\u52a8\u8bcd\u5934\u77ed\u53e5\u7f13\u51b2',
            's4.p4': '\u4e91\u7aef ASR \u6709\u65f6\u5728\u8bcd\u8fb9\u754c\u505c\u987f\u5904\u5207\u5206\u5355\u6761\u6307\u4ee4\uff08\u5982\u300c\u628a\u300d+ 0.8 \u79d2\u505c\u987f +\u300c\u68d5\u8272\u73a9\u5177\u718a\u653e\u8fdb\u767d\u8272\u7bee\u5b50\u91cc\u300d\u2192 \u4e24\u4e2a final\uff09\u3002<code>_handle_qwen_final</code> \u65b9\u6cd5\u68c0\u6d4b\u77ed\u52a8\u8bcd\u5934 final\uff08\u22643 \u5b57\u7b26\uff0c\u524d\u7f00\u5c5e\u4e8e {\u628a,\u62ff,\u653e,\u6293,\u7ed9,\u5e2e,\u8bf7,...}\uff09\u5e76\u7f13\u51b2 1.5 \u79d2\u3002\u82e5\u5ef6\u7eed final \u5728\u7a97\u53e3\u5185\u5230\u8fbe\uff0c\u5219\u62fc\u63a5\uff1b\u5426\u5219\u77ed\u5934\u72ec\u7acb\u53d1\u5e03\u3002',
            's4.result': 'ASR \u6d41\u5f0f partial\uff1a<strong>150\u2013300 ms</strong> \u2022 \u4f1a\u8bdd\u5b58\u6d3b\uff1aheartbeat \u2192 \u65e0 23 \u79d2 SDK \u8d85\u65f6 \u2022 AGC v5 \u8fdc\u573a\u6062\u590d\uff1a<strong>~2.4 \u79d2</strong>\u9759\u9ed8\u81f3\u6ee1\u589e\u76ca',
            /* S5 */
            's5.title': 'NLU\u3001\u5bf9\u8bdd\u4e0e\u8bed\u4e49\u9632\u7ebf',
            's5.h.nlu': '\u53cc\u8def\u5f84\u610f\u56fe\u89e3\u6790',
            's5.p1': '<code>VoiceCommandParser</code> \u8fd0\u884c\u5728 <code>regex_then_llm</code> \u6a21\u5f0f\u3002<strong>\u5feb\u8def\u5f84</strong>\uff1a6 \u4e2a\u4f18\u5148\u7ea7\u4e2d\u6587\u52a8\u4f5c\u6b63\u5219\u6a21\u677f\uff08BA_ACTION_LOC\u3001BA_ACTION\u3001BA_PUT_INTO\u3001VERB_OBJ\u3001PLACE_ONLY\u3001OBJ_PUT_LOC\uff09\u5339\u914d 290+ \u5df2\u77e5\u5bf9\u8c61\u767d\u540d\u5355\uff0c\u63d0\u53d6\u610f\u56fe\uff08pick_up / pick_and_place / place_only / move_to / chat / unknown\uff09\u548c\u5b9e\u4f53\uff0c\u8017\u65f6 <1 ms\u3002<strong>LLM \u8def\u5f84</strong>\uff1aqwen3.5-flash \u901a\u8fc7 OpenAI-compatible HTTP \u8f93\u51fa\u7ed3\u6784\u5316 JSON\uff0csystem prompt \u5b9a\u4e49 6 \u79cd\u610f\u56fe\u3001\u566a\u58f0\u5206\u7c7b\u89c4\u5219\u548c\u5b9e\u4f53\u5b57\u6bb5\uff08target_object\u3001quantity\u3001location\u3001object_en\u3001location_en\uff09\u3002\u751f\u6210\u53c2\u6570\uff1a<code>temperature=0</code>\uff0c<code>max_new_tokens=28</code>\uff0creasoning \u6a21\u5f0f\u663e\u5f0f\u7981\u7528\uff08<code>enable_thinking: False</code>\uff09\u4ee5\u907f\u514d 5\u201330 \u79d2\u5ef6\u8fdf\u3002',
            's5.h.dialog': '6 \u72b6\u6001\u5bf9\u8bdd\u7ba1\u7406\u5668',
            's5.p2': '<code>DialogManager</code> \u5c06\u6bcf\u6761 ASR \u8bdd\u8bed\u901a\u8fc7 6 \u72b6\u6001 FSM\uff08IDLE / TASK_EXECUTING / HOLDING_OBJECT / AWAITING_CLARIFICATION / CHAT_SESSION / ERROR_RECOVERY\uff09\u8fdb\u884c\u8def\u7531\uff0c\u914d\u5408 3 \u7ef4\u5ea6\u95e8\u63a7\uff1a<strong>directed_score</strong>\uff08+0.75 \u76f4\u63a5\u79f0\u547c\u300c\u8389\u8389\u4e1d/\u5e2e\u6211\u300d\u3001+0.60 \u5feb\u901f\u95f2\u804a\u3001+0.35 \u63d0\u95ee\u3001+0.45 12 \u79d2\u5185\u8ffd\u95ee\uff09\u3001<strong>ambient_score</strong>\uff08+0.80 \u7247\u6bb5\u3001+0.85 \u7b2c\u4e09\u4eba\u79f0\u53d9\u8ff0\uff09\u548c <strong>task_score</strong>\uff08\u6301\u7269 + \u653e\u7f6e\u547d\u4ee4\u65f6 0.9\uff09\u3002\u4ec5 directed_score \u2265 0.55 \u6216\u6709\u6d3b\u8dc3\u5524\u9192\u4f1a\u8bdd\u65f6\u624d\u653e\u884c\u3002',
            's5.h.defense': '5 \u5c42\u8bed\u4e49\u9632\u7ebf\u7ea7\u8054',
            's5.p3': '5 \u5c42\u6709\u5e8f\u9632\u7ebf\u5728\u9519\u8bef\u7ea7\u8054\u4e3a\u9519\u8bef\u76ee\u6807\u524d\u9010\u5c42\u62e6\u622a\uff1a(1) <strong>\u767d\u540d\u5355\u56de\u6536</strong> \u2014 \u6b63\u5219\u8bcd\u5178\u628a ASR \u566a\u58f0\u6620\u5c04\u4e3a\u5df2\u77e5\u5bf9\u8c61\uff1b(2) <strong>\u989c\u8272\u56de\u586b</strong> \u2014 \u82e5 ASR \u6f0f\u6389\u539f\u59cb\u547d\u4ee4\u91cc\u7684\u989c\u8272\u524d\u7f00\uff0c\u89e3\u6790\u5668\u4ece <code>_ZH_COLOR_PREFIXES</code> \u56de\u586b\uff1b(3) <strong>\u5e7b\u89c9\u4f4d\u7f6e\u5265\u79bb</strong> \u2014 \u79fb\u9664 LLM \u865a\u6784\u7684\u4f4d\u7f6e\uff1b(4) <strong>sentinel \u8fc7\u6ee4</strong> \u2014 <code>translate_for_sam3</code> \u5bf9\u7167\u5df2\u77e5\u5bf9\u8c61\u8bcd\u5178\uff0c\u9632\u6b62 unknown \u7b49\u5360\u4f4d\u8bcd\u6c61\u67d3\u7f13\u5b58\uff1b(5) <strong>VLM-SAM3 \u77db\u76fe</strong> \u2014 \u82e5 VLM \u7ed9\u51fa\u5177\u4f53 bbox \u4f46\u4e0b\u6e38\u8fd4\u56de\u7a7a/\u8fc7\u5c0f mask\uff0c\u5199\u5165 tracking cache \u524d\u76f4\u63a5\u62d2\u7edd\u3002',
            's5.h.keyword': '290+ \u5bf9\u8c61\u8bcd\u5178\u4e0e\u7ffb\u8bd1',
            's5.p4': '<code>keyword_extract</code> \u6a21\u5757\u7ef4\u62a4\u4e00\u4e2a 290+ \u6761\u76ee\u7684\u4e2d\u82f1\u5bf9\u8c61\u8bcd\u5178\uff0c\u8986\u76d6\u6c34\u679c\u3001\u84c4\u83dc\u3001\u98df\u54c1/\u996e\u6599\uff08\u542b\u54c1\u724c\uff09\u3001\u5bb9\u5668\u3001\u65e5\u5e38\u7528\u54c1\u3001\u73a9\u5177\u3002\u7ffb\u8bd1\u7ba1\u7ebf\uff1a\u8bcd\u5178\u547d\u4e2d \u2192 \u8fd0\u884c\u65f6\u7f13\u5b58 \u2192 \u989c\u8272\u5206\u89e3 \u2192 \u5b50\u4e32\u5339\u914d \u2192 \u4e3b\u52a8 Qwen \u2192 sentinel \u9ed1\u540d\u5355\uff0815 \u4e2a\u6709\u6bd2\u6807\u7b7e\u5982\u300cunknown\u300d\uff09\u3002\u5feb\u901f\u95f2\u804a\u65c1\u8def\uff085 \u4e2a\u6b63\u5219\u89c4\u5219\u5904\u7406\u65f6\u95f4/\u65e5\u671f/\u661f\u671f\uff09\u8282\u7701 ~400 ms\u3002',
            's5.result': 'NLU \u610f\u56fe\uff1a<strong>6 \u79cd\u7c7b\u578b + \u566a\u58f0\u5206\u7c7b</strong> \u2022 \u6b63\u5219\u5feb\u8def\u5f84\uff1a<strong><1 ms</strong> \u2022 LLM \u8def\u5f84\uff1a<strong>~300 ms</strong>\uff08\u7981\u7528 reasoning\uff09 \u2022 \u5bf9\u8bdd\uff1a<strong>6 \u72b6\u6001\u30013 \u7ef4\u5ea6\u95e8\u63a7</strong>',
            /* S6 */
            's6.title': 'VLM \u6307\u4ee4\u5b9a\u4f4d',
            's6.p1': '\u611f\u77e5\u7ba1\u7ebf\u5c06 NLU \u8f93\u51fa\u9001\u5165 Qwen \u517c\u5bb9 VLM HTTP \u8def\u7531\u63d0\u53d6 bbox\u3002\u5173\u952e\u5750\u6807\u5951\u7ea6\uff1aVLM \u8f93\u51fa 0~1000 \u5f52\u4e00\u5316 bbox\uff0c<code>_bbox_1000_to_xyxy</code> \u89e3\u7801\u4e3a\u539f\u56fe\u50cf\u7d20 <code>xyxy</code>\uff08x/1000\u00d7W, y/1000\u00d7H\uff09\u3002\u4e0b\u6e38\u6a21\u5757\u63a5\u6536 <code>input_boxes_pixel_xyxy</code>\uff0c\u5728\u539f\u56fe\u50cf\u7d20\u5e73\u9762\u4e0a\u5de5\u4f5c\u3002bridge \u5305\u542b\u7c7b\u522b\u62a4\u680f\u3001VLM prompt \u9636\u6bb5\u7684\u989c\u8272/\u54c1\u724c\u5224\u522b\uff08\u4ece HSV \u542f\u53d1\u5f0f\u8fc1\u79fb\u800c\u6765\uff0cHSV rerank \u4f5c\u4e3a\u56de\u6eda\u4fdd\u7559\uff09\uff0c\u4ee5\u53ca\u6807\u7b7e\u62d2\u7edd\u4ee5\u9632\u6b62\u6a21\u7cca\u76ee\u6807\u8fdb\u5165\u5b9a\u4f4d\u94fe\u3002',
            's6.p2': 'HTTP \u5c42\u4f7f\u7528\u8fde\u63a5\u6c60\uff088 \u8fde\u63a5/\u4e3b\u673a\u300145 \u79d2\u7a7a\u95f2 TTL\u3001TCP_NODELAY + SO_KEEPALIVE\uff09\uff0c\u914d SSE \u62ec\u53f7\u6df1\u5ea6\u65e9\u671f JSON \u8fd4\u56de\uff1a\u5f53\u6709\u6548 JSON \u5bf9\u8c61\u5173\u95ed\u65f6\u7acb\u5373\u89e3\u6790\uff0c\u540e\u53f0\u7ebf\u7a0b drain \u6d41\u4ee5\u590d\u7528\u8fde\u63a5\u3002VLM bbox TTFB\uff1a\u539f\u56fe 850\u20132950 ms\uff0c<code>HAR_VLM_BBOX_MAX_SIDE=512</code> \u65f6 500\u20132500 ms\u3002',
            's6.scope': '<strong>\u8303\u56f4\u8fb9\u754c\uff1a</strong>VLM \u6307\u4ee4\u5b9a\u4f4d\uff08bbox \u63d0\u53d6\u3001\u5750\u6807\u6620\u5c04\u3001prompt \u6784\u5efa\u3001\u7ffb\u8bd1\uff09\u5728\u672c\u9875\u3002SAM3 mask \u63a8\u7406\u30013D \u91cd\u5efa\u3001\u6293\u53d6\u9a8c\u8bc1\u662f\u4e0b\u6e38\u6a21\u5757\uff0c\u5c5e\u4e8e\u5b8c\u6574\u7ba1\u7ebf\u3002',
            's6.result': '\u73b0\u573a\u62a5\u544a VLM \u8f85\u52a9\u5b9a\u4f4d\uff1a<strong>4/44\uff08\u4ec5 box\uff09\u2192 \u226590%\uff08box+text\uff09</strong> \u2022 \u989c\u8272\u8def\u7531\u8fc1\u79fb\u81f3 VLM \u9636\u6bb5 \u2022 TTFB \u901a\u8fc7 <code>max_side=512</code> \u964d\u4f4e',
            /* S7 */
            's7.title': 'TTS \u53cd\u9988\u4e0e\u56de\u58f0\u95e8\u63a7',
            's7.p1': '<code>TtsNode</code> \u7ba1\u7406\u4f18\u5148\u7ea7\u5408\u6210\u94fe\uff1a(1) <strong>\u9884\u5f55\u7f13\u5b58</strong> \u2014 \u9ad8\u9891\u54cd\u5e94\u7684\u9884\u5f55\u97f3\u9891\uff08~0 ms\uff09\uff1b(2) <strong>edge-tts \u6d41\u5f0f</strong> \u2014 \u5fae\u8f6f XiaoxiaoNeural\uff08~500 ms \u9996\u97f3\u9891\uff09\uff1b(3) <strong>Qwen TTS</strong> \u2014 Vivian \u58f0\u7ebf\uff0c\u5b50\u8fdb\u7a0b\u8c03\u7528\u3002\u7194\u65ad\u5668\uff083 \u6b21\u8fde\u7eed\u5931\u8d25 = 60 \u79d2\u51b7\u5374\uff09\u9632\u6b62 TTS \u5931\u8d25\u7ea7\u8054\u963b\u585e\u7ba1\u7ebf\u3002\u201cLilith\u201d \u4eba\u8bbe\u7531 35+ \u8bed\u97f3\u53d8\u4f53\u7c7b\u522b\uff082\u20137 \u53d8\u4f53/\u7c7b\uff09\u914d\u5408\u8fde\u7eed\u91cd\u590d\u6291\u5236\u9a71\u52a8\u3002',
            's7.h.echo': '\u56de\u58f0\u6291\u5236\u67b6\u6784',
            's7.p2': '\u4ee3\u7801\u5e93\u4e2d\u65e0 AEC\u3002\u56de\u58f0\u6291\u5236\u4f7f\u7528<strong>\u53cc\u5c42 playback-active \u95e8\u63a7</strong>\uff1a(1) \u5728 ALSA \u91c7\u96c6\u8282\u70b9\uff0cTTS \u64ad\u653e\u89e6\u53d1\u8f93\u5165\u8bbe\u5907\u7684 <strong>PulseAudio source mute</strong>\uff1b(2) \u5728 ASR \u6d41\u5f0f\u8282\u70b9\uff0c<code>/tts/playback_active</code> \u9a71\u52a8\u64ad\u653e\u671f\u95f4 + 350 ms \u540e\u62a4\u7684 <strong>PCM \u96f6\u586b\u5145</strong>\u3002Barge-in \u9ed8\u8ba4\u7981\u7528\uff08<code>barge_in_enabled: False</code>\uff09\uff1b\u53ef\u9009\u4e2d\u65ad\u8def\u5f84\u5355\u72ec\u53d7\u63a7\u3002',
            's7.result': 'TTS \u9884\u5f55\uff1a<strong>~0 ms</strong> \u2022 edge-tts \u9996\u97f3\u9891\uff1a<strong>~500 ms</strong> \u2022 \u56de\u58f0\u95e8\u63a7\uff1a<strong>source mute + \u96f6\u586b\u5145</strong>\uff08\u65e0 AEC\uff09 \u2022 \u7194\u65ad\u5668\uff1a<strong>3 \u6b21\u5931\u8d25 \u2192 60 \u79d2\u51b7\u5374</strong>',
            /* S8 */
            's8.title': '\u91cf\u5316\u6210\u679c',
            's8.th.metric': '\u6307\u6807',
            's8.th.before': '\u4fee\u590d\u524d',
            's8.th.after': '\u4fee\u590d\u540e',
            's8.th.method': '\u65b9\u6cd5',
            's8.r1.m': '\u8fdc\u573a VAD \u547d\u4e2d\u7387',
            's8.r1.how': '\u6709\u72b6\u6001 Silero h/c [2,1,64] + \u73b0\u573a\u6807\u5b9a',
            's8.r2.m': 'ASR \u6d41\u5f0f partial',
            's8.r2.b': 'Session \u91cd\u5efa \u2192 \u65e0\u8f93\u51fa',
            's8.r2.how': '\u4e91\u7aef endpointing \u4e3b\u6743 + heartbeat',
            's8.r3.m': 'AGC \u8fdc\u573a\u6062\u590d',
            's8.r3.b': '\u589e\u76ca\u51bb\u7ed3\u5728 +0 dB',
            's8.r3.a': '\u7ea6 2.4 \u79d2\u81f3\u6700\u5927\u589e\u76ca',
            's8.r3.how': '\u5305\u7edc AGC v5 \u9759\u9ed8\u722c\u5347',
            's8.r4.m': 'VLM \u8f85\u52a9\u5b9a\u4f4d',
            's8.r4.how': '\u539f\u56fe\u50cf\u7d20 VLM bbox + box/text \u8054\u5408 prompt',
            's8.r5.m': 'NLU reasoning \u5ef6\u8fdf',
            's8.r5.b': '5\u201330 \u79d2\uff08thinking \u6a21\u5f0f\uff09',
            's8.r5.a': '<300 ms',
            's8.r5.how': 'enable_thinking=False + 28-token \u4e0a\u9650',
            /* S9 */
            's9.title': '\u6280\u672f\u4eae\u70b9',
            's9.h1.title': '\u5305\u7edc AGC v5',
            's9.h1.desc': '4 \u9636\u6bb5\u8bbe\u8ba1\uff1a\u5feb\u901f\u5cf0\u503c\u5c01\u9876\uff080.85 \u5373\u65f6\u94b3\u4f4d\uff09\u3001\u5305\u7edc\u8ddf\u8e2a\uff08attack/release=0.30\uff09\u3001\u9759\u9ed8\u722c\u5347\uff08\u7ea6 2.4 \u79d2\u5347\u81f3\u6ee1\u589e\u76ca\uff09\u3001tanh \u8f6f\u9650\u5e45\u3002\u89e3\u51b3\u300c\u8fdc\u8fd1\u5207\u6362\u300d\u573a\u666f\u4e0b\u589e\u76ca\u51bb\u7ed3\u5728 +0 dB \u7684\u95ee\u9898\u3002',
            's9.h2.title': '\u4e91\u7aef\u65ad\u53e5 + \u5feb\u901f\u62fc\u63a5',
            's9.h2.desc': '\u4e91\u7aef\u638c\u63a7\u53e5\u5b50\u8fb9\u754c\uff1b\u672c\u5730 EOU \u4ec5\u4f5c 20 \u79d2\u770b\u95e8\u72d7\u3002\u52a8\u8bcd\u5934\u77ed\u53e5\uff08\u22643 \u5b57\u7b26\uff0c14 \u4e2a\u524d\u7f00\u63d0\u793a\uff09\u7f13\u51b2 1.5 \u79d2\u7b49\u5f85\u62fc\u63a5\uff0c\u9632\u6b62\u300c\u628a\u300d+ \u505c\u987f +\u300c\u68d5\u8272\u73a9\u5177\u718a\u653e\u8fdb\u7bee\u5b50\u300d\u4ea7\u751f\u4e24\u4e2a\u72ec\u7acb\u610f\u56fe\u3002',
            's9.h3.title': '5 \u5c42\u8bed\u4e49\u9632\u7ebf',
            's9.h3.desc': '\u767d\u540d\u5355\u56de\u6536\u3001ASR \u989c\u8272\u56de\u586b\u3001\u5e7b\u89c9\u4f4d\u7f6e\u5265\u79bb\u3001\u7ffb\u8bd1 sentinel \u8fc7\u6ee4\uff0815 \u4e2a\u6709\u6bd2\u6807\u7b7e\uff09\u548c VLM-SAM3 \u77db\u76fe\u62d2\u7edd\u3002\u6bcf\u5c42\u53ef\u8ffd\u6eaf\u81f3\u4ee3\u7801\u8bc1\u636e\uff0c\u5177\u4f53\u7684\u6b63\u5219\u6a21\u5f0f\u548c\u9608\u503c\u3002',
            's9.h4.title': 'TTS \u56de\u58f0\u95e8\u63a7\uff08\u65e0 AEC\uff09',
            's9.h4.desc': 'PulseAudio source mute + PCM \u96f6\u586b\u5145 + 350 ms \u540e\u62a4\u66ff\u4ee3\u8ba1\u5212\u4e2d\u7684 AEC\u3002Barge-in \u9ed8\u8ba4\u7981\u7528\uff1b\u5305\u62ec\u9759\u97f3\u5728\u5185\u7684\u6240\u6709 PCM \u5e27\u6301\u7eed\u8fdb\u5165\u4e91\u7aef ASR \u6d41\uff0c\u4fdd\u8bc1\u670d\u52a1\u7aef endpointing \u6b63\u5e38\u89e6\u53d1\u3002',
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
