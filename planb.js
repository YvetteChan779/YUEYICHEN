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
            's1.cap': 'End-to-end data flow: Sensors → Frontend → Semantics → Visual Perception → Execution Control → Output Feedback, with 9 Actor nodes',
            's1.p1': 'The system is a <strong>linear pipeline</strong> where each stage\'s output serves as the next stage\'s input contract. The central <code>multimodal_pipeline_node</code> orchestrates an 8-state FSM. Left: voice frontend (VAD → ASR → NLU/LLM). Right: visual perception (RGB-D → VLM bbox → SAM3 mask) and execution (navigation → grasp). TTS reverse-gates VAD via <code>/tts/playback_active</code> to prevent self-triggering.',
            's2.title': 'Voice Frontend: 3-Tier VAD + Streaming ASR',
            's2.vad.title': 'Three-Layer VAD Cascade',
            's2.cap1': 'VAD 3-tier cascade funnel: L1 Adaptive Energy Gate (~60% filtered) → L2 Software AGC (~55%) → L3 Silero v4 (~15%), with discrimination metrics',
            's2.vad.p': 'The core challenge was far-field weak signals coupled with on-site noise, TTS self-echo, and long-command repetition. The 3-tier cascade (Adaptive Energy → Software AGC → Silero v4 stateful) was <strong>calibrated on-site</strong>: <code>silero_threshold</code> lowered from 0.5 to <strong>0.3</strong> for far-field recall; <code>min_energy_db=-48</code> (noise floor −46 dB − 2 dB margin); <code>noise_floor_margin_db=4</code> yielding −42 dB adaptive threshold with 3 dB speech headroom. The key fix was keeping Silero\'s <code>h/c</code> state across calls (not resetting each 64ms frame), which boosted far-field hit rate from <strong>0% to 92%</strong>.',
            's2.asr.title': 'ASR Engine Selection & SAM3 Performance Profiling',
            's2.cap2': 'Left: 4-engine ASR selection quadrant (realtime vs deployment). Right: SAM3 inference profiling (speed vs accuracy at vision_input 1008/640)',
            's2.asr.p': 'Four engines switchable within the Router: <strong>cloud_qwen3</strong> (default, real-time streaming), <strong>cloud_paraformer</strong> (hot-swap backup), <strong>local Qwen3-ASR TRT</strong> (3-engine split: Conv Frontend / Encoder / Decoder INT8 KV-cache), and <strong>FunASR</strong> (chunk streaming). Post-processing chain: Overlap Stitcher → Hallucination Filter → Length Guard → <code>clean_asr_text</code> (4/5/6-gram N-gram dedup).',
            's2.result': 'Far-field Silero hit rate <strong>0% → 92%</strong> &nbsp;|&nbsp; VAD discrimination: noise prob < 0.01, speech prob > 0.99 &nbsp;|&nbsp; partial ASR latency <strong>150–300 ms</strong>',
            's3.title': 'Multimodal Semantic Understanding',
            's3.sam.title': 'SAM3 Mask Success: 9% → ≥90%',
            's3.cap1': 'SAM3 small-target mask success rate: Box-only 9% (3/44) → Box+Text joint grounding 90% (39/44), a 10× improvement across 44 green-apple trials',
            's3.vlm.title': 'VLM bbox → SAM3 Mask: Letterbox Alignment Fix',
            's3.cap2': 'Letterbox geometric alignment vs Naive Resize: preserving 16:9 aspect ratio prevents ViT from seeing targets stretched 1.78×',
            's3.vlm.p': 'The key fix: unified scale ratio from separate 0.7875/1.4 to <code>min(size/W, size/H)</code>, preserving 16:9 aspect ratio. A layout-aware inverse function maps original-image pixel coordinates into letterbox-internal coordinates, preventing ViT from seeing targets stretched 1.78×. Combined with CLIP English text joint grounding (<code>HAR_SAM3_BOX_TEXT_EMPTY=0</code>), small-object mask success jumped from <strong>9% to ≥90%</strong> across 44 green-apple trials.',
            's3.result': 'SAM3 mask success (small targets): <strong>9% → ≥90%</strong> &nbsp;|&nbsp; VLM bbox TTFB: <strong>−300–500 ms</strong> &nbsp;|&nbsp; color/brand routing error → <strong>0</strong>',
            's4.title': 'Closed-Loop State Machine & Grasp Verification',
            's4.cap1': 'Pipeline Mixin closed-loop FSM: Perceive → Plan → Execute → Verify, with ≤3 retry, 4-class failure grading, and giveUp terminal',
            's4.track.title': 'Tracking & Barge-in State Machines',
            's4.cap2': 'Left: SAM3 3-state tracker (TRACKING / OCCLUDED / LOST). Right: Barge-in & TTS concerto state machine with playback_mute_buffer',
            's4.check.p': 'The grasp verification algorithm upgraded from v0 (single Z-threshold) to v1.0.0 (hand+object 3D voting): input expanded from object mask + depth to object mask + <strong>hand mask</strong> + depth; judgment metrics from 1 (centroid_Z + z_min) to 4 (median/P25/frac<3cm/frac<5cm); failure fallback changed from pure depth center to <strong>reverse ROI re-check</strong> (refusing hand\'s own false positives). SAM3 runs <code>batch=2</code> to co-segment object and dexterous hand simultaneously.',
            's5.title': 'P0 Bug: Cascading Failure Audit',
            's5.cap1': 'Top: P0 dead-loop causal chain — one missing flag triggers 7-step cascade to 0% success. Bottom: Cloud streaming ASR timing sequence for a single utterance',
            's5.cap2': 'P0 → P2 fix timeline (apple grasping scenario): 5-stage repair from crash → flag fix → depth settle → BT consistency → full 4/4 success, with before/after quantification',
            's5.p0.desc': '<strong>Symptom:</strong> grasping "apple" retried 3+ times, always failing. <strong>Root cause:</strong> <code>_bg_write_shm()</code> logged success but never set <code>shm_write_ok["ok"]=True</code>. One missing flag triggered a <strong>7-step cascade:</strong> flag False → fallback path → stale parser state → VLM old frame → SAM3 wrong bbox → mask <93px → depth_meta=None → fail-fast retry. <strong>Fix:</strong> one line.',
            's6.title': 'Quantified Results',
            's6.cap1': '7 key metrics before/after optimization: SAM3 mask success, ASR latency, VAD discrimination, SAM3 speedup, NLU acceleration, and grasp retry success',
            's6.cap2': 'End-to-end single-command latency breakdown on single-GPU AGX Orin: ASR ~600ms → NLU+VLM+SAM3 ~1.2s → CuRobo IK → mechanical execution → grasp_check → TTS, total 6–9s',
            's6.cap3': 'Single-GPU AGX Orin scheduling: GPU-exclusive zone (NLU/VLM/SAM3 sequential, no concurrency) with IO/SHM and mechanical execution in parallel',
            's6.cap4': 'Left: 5-module capability radar (accuracy, optimization, stability, error handling, engineering). Right: Module × Dimension contribution heatmap',
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
            's1.cap': '端到端数据流：传感器 → 前端处理 → 语义理解 → 视觉感知 → 执行控制 → 输出反馈，共 9 个 Actor 节点',
            's1.p1': '系统采用<strong>线性串联</strong>架构，每一级的产出即下一级的入口契约。核心 <code>multimodal_pipeline_node</code> 协调 8 态 FSM。左侧：语音前端（VAD → ASR → NLU/LLM）；右侧：视觉感知（RGB-D → VLM bbox → SAM3 mask）与执行（导航 → 抓取）。TTS 通过 <code>/tts/playback_active</code> 反向门控 VAD，防止自听自说。',
            's2.title': '语音前端：三层 VAD + 流式 ASR',
            's2.vad.title': '三层 VAD 级联',
            's2.cap1': 'VAD 三层级联漏斗：L1 自适应能量门（~60% 过滤）→ L2 软件 AGC（~55%）→ L3 Silero v4（~15%），附区分度指标',
            's2.vad.p': '核心挑战是远场弱信号叠加现场噪声、TTS 自回声和长指令重复。三层级联（自适应能量 → 软件 AGC → Silero v4 有状态）<strong>现场标定</strong>：<code>silero_threshold</code> 从 0.5 降至 <strong>0.3</strong> 提升远场召回；<code>min_energy_db=-48</code>（噪底 −46 dB − 2 dB 裕度）；<code>noise_floor_margin_db=4</code> 得到 −42 dB 自适应阈值，留 3 dB 语音余量。关键修复是保持 Silero 的 <code>h/c</code> 状态跨帧传递（而非每 64ms 重置），远场命中率从 <strong>0% 提升至 92%</strong>。',
            's2.asr.title': 'ASR 引擎选型与 SAM3 性能剖面',
            's2.cap2': '左：4 引擎 ASR 选型象限（实时性 vs 部署独立性）。右：SAM3 推理档位（vision_input 1008/640 速度 vs 精度）',
            's2.asr.p': '四引擎在 Router 内互斥可切：<strong>cloud_qwen3</strong>（默认，实时流式）、<strong>cloud_paraformer</strong>（热切备选）、<strong>本地 Qwen3-ASR TRT</strong>（3 引擎拆分：Conv Frontend / Encoder / Decoder INT8 KV-cache）和 <strong>FunASR</strong>（chunk 流式）。后处理链：Overlap Stitcher → Hallucination Filter → Length Guard → <code>clean_asr_text</code>（4/5/6-gram N-gram 去重）。',
            's2.result': '远场 Silero 命中率 <strong>0% → 92%</strong> &nbsp;|&nbsp; VAD 区分度：白噪声 prob < 0.01，真实语音 prob > 0.99 &nbsp;|&nbsp; partial ASR 延迟 <strong>150–300 ms</strong>',
            's3.title': '多模态语义理解',
            's3.sam.title': 'SAM3 掩码成功率：9% → ≥90%',
            's3.cap1': 'SAM3 小目标掩码成功率：Box-only 9%（3/44）→ Box+Text 联合先验 90%（39/44），44 次青苹果场景 10 倍提升',
            's3.vlm.title': 'VLM bbox → SAM3 Mask：Letterbox 对齐修复',
            's3.cap2': 'Letterbox 几何对齐 vs Naive Resize：保持 16:9 宽高比，防止 ViT 看到纵向拉伸 1.78× 的目标',
            's3.vlm.p': '关键修复：将水平/垂直缩放比从 0.7875/1.4 统一为 <code>min(size/W, size/H)</code>，保持 16:9 宽高比。调用方仍传原图 pixel xyxy，由 layout-aware 反推函数推到 letterbox 内坐标。避免 ViT 看到"被纵向拉长 1.78×"的目标。配合 CLIP 英文 text 联合先验（<code>HAR_SAM3_BOX_TEXT_EMPTY=0</code>），小目标掩码成功率从 <strong>9% 跃升至 ≥90%</strong>（44 次青苹果场景）。',
            's3.result': 'SAM3 掩码成功率（小目标）：<strong>9% → ≥90%</strong> &nbsp;|&nbsp; VLM bbox TTFB：<strong>−300–500 ms</strong> &nbsp;|&nbsp; 颜色/品牌路由错误 → <strong>0</strong>',
            's4.title': '闭环状态机与抓取验证',
            's4.cap1': 'Pipeline Mixin 闭环状态机：感知 → 规划 → 执行 → 验证，≤3 次重试、4 类失败分级、giveUp 终态',
            's4.track.title': '追踪与 Barge-in 状态机',
            's4.cap2': '左：SAM3 三态追踪器（TRACKING / OCCLUDED / LOST）。右：Barge-in 与 TTS 协奏状态机，含 playback_mute_buffer',
            's4.check.p': '抓取验证算法从 v0（单 Z 阈值）升级到 v1.0.0（hand+object 3D 票决）：输入从 object mask + depth 扩展为 object mask + <strong>hand mask</strong> + depth；判定指标从 1 个（centroid_Z + z_min）增至 4 个（median/P25/frac<3cm/frac<5cm）；失败回退从纯深度中心改为<strong>反向 ROI 复核</strong>（拒绝手部自身假阳性）。SAM3 使用 <code>batch=2</code> 同时输出 object 与 hand 两路 mask，避免跨帧错位。',
            's5.title': 'P0 Bug：级联失败审计',
            's5.cap1': '上：P0 死循环因果链 — 一处旗标漏写触发 7 步级联至 0% 成功率。下：云端真流式 ASR 单次发声时序图',
            's5.cap2': 'P0 → P2 修复时间线（苹果抓取场景）：5 阶段修复，从崩溃 → 旗标修复 → depth settle → BT 一致性 → 4/4 全成功，含修复前后量化对比',
            's5.p0.desc': '<strong>现象：</strong>抓"苹果"反复重试 3+ 次均失败。<strong>根因：</strong><code>_bg_write_shm()</code> 成功路径只打了 log 但没有置位 <code>shm_write_ok["ok"]=True</code>。一处旗标漏写触发了 <strong>7 步连锁：</strong>旗标 False → 兜底路径 → stale 解析器 → VLM 顺旧帧 → SAM3 错 bbox → mask <93px → depth_meta=None → fail-fast 重试。<strong>修复：</strong>一行代码。',
            's6.title': '量化成果',
            's6.cap1': '7 项关键指标优化前后对比：SAM3 掩码成功率、ASR 延迟、VAD 区分度、SAM3 提速、NLU 加速、抓取重试成功率',
            's6.cap2': '单卡 AGX Orin 端到端单指令延迟分解：ASR ~600ms → NLU+VLM+SAM3 ~1.2s → CuRobo IK → 机械执行 → grasp_check → TTS，总计 6–9s',
            's6.cap3': '单卡 AGX Orin 调度：GPU 独占区（NLU/VLM/SAM3 串行不并发）+ IO/SHM 与机械执行并行',
            's6.cap4': '左：五模块能力雷达图（精度、优化、稳定性、错误处理、工程）。右：模块 × 维度贡献热力图',
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
