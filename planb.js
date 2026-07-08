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
    const i18n = {
        en: {
            'back': 'Back to Home',
            'hero.title': 'PLAN-B: Multimodal Perception & Closed-Loop Grasping for Humanoid Robot',
            'hero.venue': 'Algorithm Intern',
            'hero.intro': 'A full-stack multimodal human–robot interaction system deployed on Jetson AGX Orin, covering the complete closed loop: <strong>Speech → Semantics → Perception → Planning → Execution → Verification</strong>. I owned the perception & integration layer — VAD/ASR tuning, NLU pipeline, VLM-SAM3 grounding, closed-loop state machine, and 3D grasp verification.',
            'm.vad': 'Far-field Silero hit rate',
            'm.mask': 'SAM3 mask success (small obj)',
            'm.fsm': 'State machine (main + grasp)',
            'm.guard': 'Guard mechanisms + P0 fix',
            's1.title': 'System Architecture',
            's1.cap': 'planb-robot Pipeline: Speech → State Machine → Perception → Execution, with color-coded subsystem boundaries',
            's1.p1': 'The system is a <strong>linear pipeline</strong> where each stage’s output serves as the next stage’s input contract. The central <code>multimodal_pipeline_node</code> (red) orchestrates an 8-state FSM. Left: voice frontend (VAD → ASR → NLU/LLM). Right: visual perception (RGB-D → VLM bbox → SAM3 mask) and execution (navigation → grasp). TTS reverse-gates VAD via <code>/tts/playback_active</code> to prevent self-triggering.',
            's2.title': 'Voice Frontend: 3-Tier VAD + Streaming ASR',
            's2.cap1': 'Data flow: Mic 16kHz → VadQualityGate (3-tier) → Streaming Engine Router (4 engines) → ASR post-processing → /asr/text',
            's2.vad.title': 'Three-Layer VAD Cascade',
            's2.cap2': 'VAD decision path: Energy gate (before AGC) → Software AGC → Silero v4 ONNX (stateful h/c)',
            's2.vad.p': 'The core challenge was far-field weak signals coupled with on-site noise, TTS self-echo, and long-command repetition. The 3-tier cascade (Adaptive Energy → Software AGC → Silero v4 stateful) was <strong>calibrated on-site</strong>: <code>silero_threshold</code> lowered from 0.5 to <strong>0.3</strong> for far-field recall; <code>min_energy_db=-48</code> (noise floor −46 dB − 2 dB margin); <code>noise_floor_margin_db=4</code> yielding −42 dB adaptive threshold with 3 dB speech headroom. The key fix was keeping Silero’s <code>h/c</code> state across calls (not resetting each 64ms frame), which boosted far-field hit rate from <strong>0% to 92%</strong>.',
            's2.asr.title': 'Streaming ASR Engine Router',
            's2.asr.p': 'Four engines switchable within the Router: <strong>cloud_qwen3</strong> (default, real-time streaming), <strong>cloud_paraformer</strong> (hot-swap backup), <strong>local Qwen3-ASR TRT</strong> (3-engine split: Conv Frontend / Encoder / Decoder INT8 KV-cache), and <strong>FunASR</strong> (chunk streaming). Post-processing chain: Overlap Stitcher → Hallucination Filter → Length Guard → <code>clean_asr_text</code> (4/5/6-gram N-gram dedup).',
            's2.result': 'Far-field Silero hit rate <strong>0% → 92%</strong> &nbsp;|&nbsp; VAD discrimination: noise prob < 0.01, speech prob > 0.99 &nbsp;|&nbsp; partial ASR latency <strong>150–300 ms</strong>',
            's3.title': 'Multimodal Semantic Understanding',
            's3.nlu.title': 'Dual-Path NLU: Regex Fast Path + LLM Fallback',
            's3.cap1': 'End-to-end semantic chain: ASR text → regex/whitelist fast path (≈0ms) or Qwen3-0.6B JSON parsing → VLM bbox → SAM3 segmentation',
            's3.nlu.p': '7 regex templates cover 90% common commands at 0 ms latency, freeing LLM compute for VLM. A ~300-word whitelist guards against ASR noise false matches. Qwen3-0.6B runs with <code>temperature=0</code> + <code>max_new_tokens=28</code> for stable JSON output. 8 ASR noise examples in the system prompt force-label noise as <code>unknown</code>, blocking false chat triggers.',
            's3.vlm.title': 'VLM bbox → SAM3 Mask with Letterbox Alignment',
            's3.vlm.p': 'The key fix: unified scale ratio from separate 0.7875/1.4 to <code>min(size/W, size/H)</code>, preserving 16:9 aspect ratio. A layout-aware inverse function maps original-image pixel coordinates into letterbox-internal coordinates, preventing ViT from seeing targets stretched 1.78×. Combined with CLIP English text joint grounding (<code>HAR_SAM3_BOX_TEXT_EMPTY=0</code>), small-object mask success jumped from <strong>9% to ≥90%</strong> across 44 green-apple trials.',
            's3.defense.title': '5-Layer Semantic Defense Chain',
            's3.cap2': '5-layer defense: (1) whitelist recovery, (2) ASR color backfill, (3) hallucination stripping, (4) sentinel anti-pollution, (5) VLM-SAM3 IoU/center-distance validation',
            's3.defense.p': 'Root cause across 5 failure types: <strong>upstream modules lacked signal-consistency validation against downstream artifacts</strong> — ASR didn’t verify known objects, NLU didn’t verify color completeness, LLM didn’t verify placement verbs, translation cache didn’t verify sentinel tokens, VLM-SAM3 didn’t verify spatial consistency. Any stage letting dirty data through causes exponential amplification downstream.',
            's3.result': 'SAM3 mask success (small targets): <strong>9% → ≥90%</strong> &nbsp;|&nbsp; VLM bbox TTFB: <strong>−300–500 ms</strong> &nbsp;|&nbsp; color/brand routing error → <strong>0</strong>',
            's3.cap3': 'VLM bbox HTTP TTFB: max_side 768 → 512, saving 300–500 ms per call (15–41% reduction)',
            's4.title': 'Closed-Loop State Machine & Grasp Verification',
            's4.cap1': 'Pipeline Main FSM: 8 states from idle → classify → parse → sam3 → waitNav → flushGrasp → waitGrasp → verify, with retry loop and giveUp',
            's4.cap2': 'Grasp Sub-FSM: 5 states — idle → executing → verifying → retrying → aborting, adding a verifying intermediate state for “executor self-report + visual verification” two-level judgment',
            's4.check.title': 'grasp_check: 3D Multi-Feature Voting',
            's4.cap3': 'Multi-feature voting: main gate median < 0.055m (mandatory) + 3 auxiliary voters (P25, frac<3cm, frac<5cm), any 1 passing suffices',
            's4.check.p': 'The algorithm upgrade from v0 (single Z-threshold) to v1.0.0 (hand+object 3D voting): input expanded from object mask + depth to object mask + <strong>hand mask</strong> + depth; judgment metrics from 1 (centroid_Z + z_min) to 4 (median/P25/frac<3cm/frac<5cm); failure fallback changed from pure depth center to <strong>reverse ROI re-check</strong> (refusing hand’s own false positives). SAM3 runs <code>batch=2</code> to co-segment object and dexterous hand simultaneously.',
            's4.p0.title': 'P0 Bug: 7-Step Cascading Failure Audit',
            's4.p0.desc': '<strong>Symptom:</strong> grasping “apple” retried 3+ times, always failing. <strong>Root cause:</strong> <code>_bg_write_shm()</code> logged success but never set <code>shm_write_ok["ok"]=True</code>. One missing flag triggered a <strong>7-step cascade:</strong> flag False → fallback path → stale parser state → VLM old frame → SAM3 wrong bbox → mask <93px → depth_meta=None → fail-fast retry. <strong>Fix:</strong> one line.',
            's5.title': 'Quantified Improvements',
            's5.cap': 'Before/after comparison across model layer (mask success), latency layer (TTFB), and robustness layer (4 types of pollution defense)',
            'footer': '&copy; <span id="year">' + new Date().getFullYear() + '</span> Yueyi Chen. Powered by <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a>.'
        },
        zh: {
            'back': '返回主页',
            'hero.title': 'PLAN-B：多模态感知与闭环抓取系统（人形机器人）',
            'hero.venue': '算法实习',
            'hero.intro': '部署在 Jetson AGX Orin 上的全栈多模态人机交互系统，覆盖完整闭环：<strong>语音 → 语义 → 感知 → 规划 → 执行 → 验证</strong>。我负责感知与集成层 — VAD/ASR 调优、NLU 管线、VLM-SAM3 接地、闭环状态机和 3D 抓取验证。',
            'm.vad': '远场 Silero 命中率',
            'm.mask': 'SAM3 掩码成功率（小目标）',
            'm.fsm': '状态机（主 + 抓取）',
            'm.guard': '守卫机制 + P0 修复',
            's1.title': '系统架构',
            's1.cap': 'planb-robot 管线：语音 → 状态机 → 感知 → 执行，按子系统色码分区',
            's1.p1': '系统采用<strong>线性串联</strong>架构，每一级的产出即下一级的入口契约。核心 <code>multimodal_pipeline_node</code>（红色）协调 8 态 FSM。左侧：语音前端（VAD → ASR → NLU/LLM）；右侧：视觉感知（RGB-D → VLM bbox → SAM3 mask）与执行（导航 → 抓取）。TTS 通过 <code>/tts/playback_active</code> 反向门控 VAD，防止自听自说。',
            's2.title': '语音前端：三层 VAD + 流式 ASR',
            's2.cap1': '数据流：麦克风 16kHz → VadQualityGate（3 层）→ 流式引擎路由（4 引擎）→ ASR 后处理 → /asr/text',
            's2.vad.title': '三层 VAD 级联',
            's2.cap2': 'VAD 决策路径：能量门（AGC 前）→ 软件 AGC → Silero v4 ONNX（有状态 h/c）',
            's2.vad.p': '核心挑战是远场弱信号叠加现场噪声、TTS 自回声和长指令重复。三层级联（自适应能量 → 软件 AGC → Silero v4 有状态）<strong>现场标定</strong>：<code>silero_threshold</code> 从 0.5 降至 <strong>0.3</strong> 提升远场召回；<code>min_energy_db=-48</code>（噪底 −46 dB − 2 dB 裕度）；<code>noise_floor_margin_db=4</code> 得到 −42 dB 自适应阈值，留 3 dB 语音余量。关键修复是保持 Silero 的 <code>h/c</code> 状态跨帧传递（而非每 64ms 重置），远场命中率从 <strong>0% 提升至 92%</strong>。',
            's2.asr.title': '流式 ASR 引擎路由',
            's2.asr.p': '四引擎在 Router 内互斥可切：<strong>cloud_qwen3</strong>（默认，实时流式）、<strong>cloud_paraformer</strong>（热切备选）、<strong>本地 Qwen3-ASR TRT</strong>（3 引擎拆分：Conv Frontend / Encoder / Decoder INT8 KV-cache）和 <strong>FunASR</strong>（chunk 流式）。后处理链：Overlap Stitcher → Hallucination Filter → Length Guard → <code>clean_asr_text</code>（4/5/6-gram N-gram 去重）。',
            's2.result': '远场 Silero 命中率 <strong>0% → 92%</strong> &nbsp;|&nbsp; VAD 区分度：白噪声 prob < 0.01，真实语音 prob > 0.99 &nbsp;|&nbsp; partial ASR 延迟 <strong>150–300 ms</strong>',
            's3.title': '多模态语义理解',
            's3.nlu.title': '双路 NLU：正则快路径 + LLM 兆底',
            's3.cap1': '端到端语义链：ASR 文本 → 正则/白名单快路径（≈0ms）或 Qwen3-0.6B JSON 解析 → VLM bbox → SAM3 分割',
            's3.nlu.p': '7 条正则模板覆盖 90% 常见指令，0 ms 延迟，释放 LLM 算力给 VLM。~300 词白名单防止 ASR 噪声误匹配。Qwen3-0.6B 使用 <code>temperature=0</code> + <code>max_new_tokens=28</code> 保证稳定 JSON 输出。system prompt 内嵌 8 条 ASR 噪声示例，强制判 <code>unknown</code>，禁判 chat。',
            's3.vlm.title': 'VLM bbox → SAM3 Mask（Letterbox 对齐）',
            's3.vlm.p': '关键修复：将水平/垂直缩放比从 0.7875/1.4 统一为 <code>min(size/W, size/H)</code>，保持 16:9 宽高比。调用方仍传原图 pixel xyxy，由 layout-aware 反推函数推到 letterbox 内坐标。避免 ViT 看到“被纵向拉长 1.78×”的目标。配合 CLIP 英文 text 联合先验（<code>HAR_SAM3_BOX_TEXT_EMPTY=0</code>），小目标掩码成功率从 <strong>9% 跃升至 ≥90%</strong>（44 次青苹果场景）。',
            's3.defense.title': '五层语义防线级联',
            's3.cap2': '五层防线：(1) 白名单回收 (2) ASR 颜色回填 (3) 幻觉剥离 (4) sentinel 反污染 (5) VLM-SAM3 IoU/中心距校验',
            's3.defense.p': '五类故障的共同根因：<strong>上游模块缺乏对下游产物的信号一致性校验</strong> — ASR 未校验已知物体、NLU 未校验颜色完整性、LLM 未校验放置动词、翻译缓存未校验 sentinel token、VLM-SAM3 未校验空间一致性。任一层放过脏数据都会在下游指数放大。',
            's3.result': 'SAM3 掩码成功率（小目标）：<strong>9% → ≥90%</strong> &nbsp;|&nbsp; VLM bbox TTFB：<strong>−300–500 ms</strong> &nbsp;|&nbsp; 颜色/品牌路由错误 → <strong>0</strong>',
            's3.cap3': 'VLM bbox HTTP TTFB：max_side 768 → 512，每次调用节省 300–500 ms（15–41% 减少）',
            's4.title': '闭环状态机与抓取验证',
            's4.cap1': '管线主 FSM：8 态，从 idle → classify → parse → sam3 → waitNav → flushGrasp → waitGrasp → verify，含重试环和 giveUp',
            's4.cap2': '抓取子 FSM：5 态 — idle → executing → verifying → retrying → aborting，增加 verifying 中间态实现“执行器自报 + 视觉复核”两级判定',
            's4.check.title': 'grasp_check：3D 多特征票决',
            's4.cap3': '多特征票决：主门 median < 0.055m（必要）+ 3 个辅门（P25、frac<3cm、frac<5cm），任一通过即得票',
            's4.check.p': '算法从 v0（单 Z 阈值）升级到 v1.0.0（hand+object 3D 票决）：输入从 object mask + depth 扩展为 object mask + <strong>hand mask</strong> + depth；判定指标从 1 个（centroid_Z + z_min）增至 4 个（median/P25/frac<3cm/frac<5cm）；失败回退从纯深度中心改为<strong>反向 ROI 复核</strong>（拒绝手部自身假阳性）。SAM3 使用 <code>batch=2</code> 同时输出 object 与 hand 两路 mask，避免跨帧错位。',
            's4.p0.title': 'P0 Bug：7 步级联失败审计',
            's4.p0.desc': '<strong>现象：</strong>抓“苹果”反复重试 3+ 次均失败。<strong>根因：</strong><code>_bg_write_shm()</code> 成功路径只打了 log 但没有置位 <code>shm_write_ok["ok"]=True</code>。一处旗标漏写触发了 <strong>7 步连锁：</strong>旗标 False → 兆底路径 → stale 解析器 → VLM 顺旧帧 → SAM3 错 bbox → mask <93px → depth_meta=None → fail-fast 重试。<strong>修复：</strong>一行代码。',
            's5.title': '关键指标汇总',
            's5.cap': '修复前/后对比：模型层（掩码成功率）、延迟层（TTFB）、鲁棒性层（4 类污染防御）',
            'footer': '&copy; <span id="year">' + new Date().getFullYear() + '</span> 陈悦怡. 基于 <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a> 搭建。'
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
        if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
        localStorage.setItem('lang', lang);
    }

    setLang(currentLang);

    langBtn?.addEventListener('click', () => {
        setLang(currentLang === 'en' ? 'zh' : 'en');
    });
})();
