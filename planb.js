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
    const footer_zh = '&copy; <span id="year">' + Y + '</span> 陈悦怡. 基于 <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a> 搭建。';

    const i18n = {
        en: {
            'back': 'Back to Home',
            /* Hero */
            'hero.title': 'PLAN-B: Multimodal Perception & Closed-Loop Grasping for Humanoid Robot',
            'hero.venue': 'The Chinese University of Hong Kong',
            'hero.tagline': 'Full-stack multimodal human–robot interaction system · Deployed on Jetson AGX Orin',
            'hero.report': 'Report',
            'hero.code': 'Code',
            'hero.demo': 'Demo',
            /* Metrics */
            'm.vad': 'Far-field VAD hit rate',
            'm.mask': 'SAM3 mask success rate',
            'm.fsm': 'Closed-loop FSM states',
            'm.latency': 'ASR streaming latency',
            /* Overview */
            's0.title': 'Overview',
            's0.p1': 'Deploying vision-language-action models on real robots exposes a critical gap: existing systems assume clean sensor inputs and reliable single-shot execution. In practice, far-field speech is buried in noise, small objects defy segmentation models, and grasping attempts fail silently. <strong>PLAN-B</strong> addresses this with an end-to-end multimodal pipeline built on multi-layer defense and closed-loop verification.',
            's0.c1': 'Designed a <strong>field-calibrated 3-tier VAD</strong> system with stateful Silero inference, boosting far-field voice detection from 0% to 92%.',
            's0.c2': 'Proposed <strong>VLM+CLIP joint grounding</strong> with letterbox geometric alignment, improving small-object SAM3 mask success by 10× (9% → ≥90%).',
            's0.c3': 'Built an <strong>8-state closed-loop FSM</strong> with 3D multi-feature grasp verification (median/P25/frac voting), enabling retry-on-failure rather than open-loop execution.',
            's0.c4': 'Diagnosed a P0 cascading failure through <strong>7-step root-cause audit</strong>, tracing a single missing flag to a system-wide retry deadlock.',
            /* Demo */
            'sd.title': 'Demo',
            'sd.placeholder': 'Robot grasping demo video — drop your video file at Pic/planb/demo.mp4',
            /* S1: Architecture */
            's1.title': 'System Architecture',
            's1.cap': 'Full-stack pipeline deployed on Jetson AGX Orin: voice frontend, semantic understanding, visual perception, closed-loop execution, and verification feedback.',
            's1.scope': '<strong>My scope:</strong> I owned the entire perception & integration layer (green box) — VAD/ASR tuning, NLU pipeline, VLM-SAM3 visual grounding, closed-loop state machine, and 3D grasp verification. Downstream execution (navigation, IK planning, motor control) was handled by collaborators.',
            /* S2: Voice */
            's2.title': 'Voice Frontend: Field-Calibrated 3-Tier VAD',
            's2.cap1': 'Three-layer VAD cascade: Adaptive Energy Gate → Software AGC → Silero v4 (stateful), with field-calibrated thresholds.',
            's2.p1': 'Real-world far-field speech detection requires more than a single VAD model. We designed a <strong>3-tier cascaded quality gate</strong> — adaptive energy filtering (noise floor −46 dB, 3 dB headroom), software AGC normalization, and Silero v4 with cross-call <code>h/c</code> state preservation. All thresholds were derived from on-site acoustic measurements, not default values.',
            's2.p2': 'The critical fix was preserving Silero\'s RNN hidden state across 64ms frames. Without this, far-field signals were systematically classified as non-speech despite energy gate confirmation. Combined with cloud-side endpointing handover (eliminating local session rebuilds), streaming partial latency reached <strong>150–300 ms</strong>.',
            's2.result': 'Far-field Silero hit rate: <strong>0% → 92%</strong> • VAD discrimination: noise < 0.01, speech > 0.99 • Streaming partial latency: <strong>150–300 ms</strong>',
            /* S3: NLU */
            's3.title': 'Multimodal Semantic Understanding',
            's3.p1': 'The semantic layer bridges natural language commands to pixel-level targets. A dual-path NLU (regex fast-path + Qwen3-0.6B LLM) feeds into VLM-guided bbox extraction, which provides spatial priors for SAM3 segmentation. The key innovation is <strong>VLM bbox + CLIP English text joint grounding</strong> with letterbox geometric alignment — without which small-object mask success was only 9%.',
            's3.cap1': 'Box-only: 9% → Box+Text joint grounding: ≥90% (44 trials)',
            's3.cap2': 'Letterbox preserves 16:9 aspect ratio; naive resize distorts 1.78×',
            's3.p2': 'A <strong>5-layer semantic defense cascade</strong> intercepts errors at every stage: regex whitelist recovery (ASR noise), ASR color backfill (missing color terms), hallucination stripping (phantom locations), translation sentinel filtering (dictionary pollution), and VLM-SAM3 contradiction detection (spatial inconsistency). Each layer catches what the previous one missed, preventing dirty data from cascading into the tracking cache.',
            's3.result': 'SAM3 mask success (small targets): <strong>9% → ≥90%</strong> • VLM bbox TTFB: <strong>−300–500 ms</strong> • Color/brand routing error: <strong>0</strong>',
            /* S4: FSM */
            's4.title': 'Closed-Loop State Machine & 3D Grasp Verification',
            's4.cap1': '8-state pipeline FSM with ≤3 retry, verification feedback loop, and 4-class failure grading.',
            's4.p1': 'Unlike open-loop demos that execute once and hope, PLAN-B employs an <strong>8-state FSM with verification feedback</strong>. After each grasp attempt, a 3D multi-feature voting system (using hand+object point cloud proximity: median, P25, frac<3cm, frac<5cm) determines true success. Failed verifications trigger re-segmentation and retry (≤3 times), with failure classified into infrastructure / genuine / displacement categories for graded TTS feedback.',
            's4.p0.title': 'P0 Cascading Failure: 7-Step Root-Cause Audit',
            's4.cap2': 'One missing flag triggered a 7-step cascade: stale frame → wrong bbox → degraded mask → retry deadlock. Fix: one line.',
            's4.result': 'A single missing <code>ok=True</code> flag in <code>_bg_write_shm()</code> caused the parser to always read stale frames, producing degraded masks (<93px), triggering infinite retry. The 7-step audit traced: flag → stale cache → VLM old frame → SAM3 misalignment → mask collapse → depth failure → retry loop. <strong>One-line fix restored full grasping success.</strong>',
            /* S5: Results */
            's5.title': 'Quantified Results',
            's5.th.metric': 'Metric',
            's5.th.before': 'Before',
            's5.th.after': 'After',
            's5.th.method': 'Method',
            's5.r1.m': 'Far-field VAD hit rate',
            's5.r1.how': 'Stateful Silero h/c + field calibration',
            's5.r2.m': 'SAM3 mask success (small obj)',
            's5.r2.how': 'Letterbox + box+text joint grounding',
            's5.r3.m': 'VLM bbox TTFB',
            's5.r3.how': 'Decoupled bbox resolution (max_side 512)',
            's5.r4.m': 'ASR streaming partial',
            's5.r4.b': 'Session rebuild → no output',
            's5.r4.how': 'Cloud endpointing handover',
            's5.r5.m': 'P0 grasping success',
            's5.r5.b': '4 retries, all failed',
            's5.r5.a': 'Closed-loop success',
            's5.r5.how': '7-step root-cause audit + 1-line fix',
            's5.r6.m': 'Color/brand routing error',
            's5.r6.b': 'HSV misclassification',
            's5.r6.how': 'VLM-stage routing (disabled HSV rerank)',
            's5.r7.m': 'SAM3 inference speed',
            's5.r7.a': '640, 30–50% faster',
            's5.r7.how': 'Reduced vision_input_size',
            's5.cap1': 'End-to-end single-command latency on Jetson AGX Orin: total 6–9s',
            's5.cap2': '7 key metrics: before vs after optimization',
            /* S6: Highlights */
            's6.title': 'Technical Highlights',
            's6.h1.title': 'Letterbox Alignment',
            's6.h1.desc': 'Unified scale ratio preserves 16:9 aspect ratio for VLM-to-SAM3 coordinate transform, preventing 1.78x vertical distortion that collapsed small-object masks.',
            's6.h2.title': '5-Layer Semantic Defense',
            's6.h2.desc': 'Cascaded error interception from ASR noise to VLM-SAM3 spatial contradiction. Each layer catches what the previous one missed, preventing dirty data from reaching the tracking cache.',
            's6.h3.title': 'Stateful Silero VAD',
            's6.h3.desc': 'Preserving RNN hidden state (h/c) across 64ms frames enables far-field voice detection. Without it, each frame is evaluated in isolation and systematically misclassified as noise.',
            's6.h4.title': '3D Grasp Voting',
            's6.h4.desc': 'Multi-feature point cloud verification (median/P25/frac) replaces single Z-threshold. SAM3 batch=2 co-segments object and hand to avoid cross-frame misalignment.',
            'footer': footer_en
        },
        zh: {
            'back': '返回主页',
            /* Hero */
            'hero.title': 'PLAN-B：多模态感知与闭环抓取系统（人形机器人）',
            'hero.venue': '香港中文大学',
            'hero.tagline': '全栈多模态人机交互系统 · 部署于 Jetson AGX Orin',
            'hero.report': '报告',
            'hero.code': '代码',
            'hero.demo': '演示',
            /* Metrics */
            'm.vad': '远场 VAD 命中率',
            'm.mask': 'SAM3 掩码成功率',
            'm.fsm': '闭环状态机状态数',
            'm.latency': 'ASR 流式延迟',
            /* Overview */
            's0.title': '项目概述',
            's0.p1': '将视觉-语言-动作模型部署到真实机器人上会暴露一个关键差距：现有系统假设传感器输入干净且单次执行可靠。实际上，远场语音淹没在噪声中，小目标让分割模型失败，抓取尝试静默失败。<strong>PLAN-B</strong> 通过多层防线与闭环验证的端到端多模态管线解决这一问题。',
            's0.c1': '设计了<strong>现场标定的三层 VAD</strong> 系统，采用有状态 Silero 推理，将远场语音检测从 0% 提升至 92%。',
            's0.c2': '提出 <strong>VLM+CLIP 联合接地</strong>与 letterbox 几何对齐，将小目标 SAM3 掩码成功率提升 10 倍（9% → ≥90%）。',
            's0.c3': '构建了 <strong>8 态闭环状态机</strong>，配合 3D 多特征抓取验证（median/P25/frac 票决），实现失败重试而非开环执行。',
            's0.c4': '通过 <strong>7 步根因审计</strong>诊断了一个 P0 级联故障，追溯一个缺失的旗标到系统级重试死锁。',
            /* Demo */
            'sd.title': '演示',
            'sd.placeholder': '机器人抓取演示视频 — 请将视频文件放入 Pic/planb/demo.mp4',
            /* S1: Architecture */
            's1.title': '系统架构',
            's1.cap': '部署在 Jetson AGX Orin 上的全栈管线：语音前端、语义理解、视觉感知、闭环执行与验证反馈。',
            's1.scope': '<strong>我的职责：</strong>负责整个感知与集成层（绿色框）— VAD/ASR 调优、NLU 管线、VLM-SAM3 视觉接地、闭环状态机和 3D 抓取验证。下游执行（导航、IK 规划、电机控制）由协作团队负责。',
            /* S2: Voice */
            's2.title': '语音前端：现场标定的三层 VAD',
            's2.cap1': '三层 VAD 级联：自适应能量门 → 软件 AGC → Silero v4（有状态），现场标定阈值。',
            's2.p1': '真实远场语音检测需要的不仅仅是一个 VAD 模型。我们设计了<strong>三层级联质量门控</strong> — 自适应能量过滤（噪底 −46 dB，3 dB 余量）、软件 AGC 归一、Silero v4 跨调用 <code>h/c</code> 状态保持。所有阈值均来自现场声学测量，而非默认值。',
            's2.p2': '关键修复是保持 Silero 的 RNN 隐藏状态跨 64ms 帧传递。否则，远场信号会被系统性地误判为非语音。配合云端 endpointing 主导权回归（消除本地 session 重建），流式 partial 延迟达到 <strong>150–300 ms</strong>。',
            's2.result': '远场 Silero 命中率：<strong>0% → 92%</strong> • VAD 区分度：噪声 < 0.01，语音 > 0.99 • 流式 partial 延迟：<strong>150–300 ms</strong>',
            /* S3: NLU */
            's3.title': '多模态语义理解',
            's3.p1': '语义层将自然语言指令桥接到像素级目标。双路 NLU（正则快路径 + Qwen3-0.6B LLM）馈入 VLM 引导的 bbox 提取，为 SAM3 分割提供空间先验。核心创新是 <strong>VLM bbox + CLIP 英文 text 联合接地</strong>与 letterbox 几何对齐 — 否则小目标掩码成功率仅 9%。',
            's3.cap1': 'Box-only: 9% → Box+Text 联合先验: ≥90%（44 次试验）',
            's3.cap2': 'Letterbox 保持 16:9 宽高比；naive resize 拉伸 1.78×',
            's3.p2': '<strong>5 层语义防线级联</strong>在每个阶段拦截错误：正则白名单回收（ASR 噪声）、ASR 颜色回填（缺失颜色词）、幻觉位置剥离（虚假 location）、翻译 sentinel 过滤（词典污染）、VLM-SAM3 矛盾信号检测（空间不一致）。每层捕获前一层遗漏的错误，防止脏数据级联进入追踪缓存。',
            's3.result': 'SAM3 掩码成功率（小目标）：<strong>9% → ≥90%</strong> • VLM bbox TTFB：<strong>−300–500 ms</strong> • 颜色/品牌路由错误：<strong>0</strong>',
            /* S4: FSM */
            's4.title': '闭环状态机与 3D 抓取验证',
            's4.cap1': '8 态主状态机，≤3 次重试、验证反馈回流、4 类失败分级。',
            's4.p1': '不同于开环 demo 执行一次就希望成功，PLAN-B 采用 <strong>8 态 FSM + 验证反馈</strong>。每次抓取后，3D 多特征票决系统（手物点云近邻：median、P25、frac<3cm、frac<5cm）判定真实成功。验证失败触发重分割与重试（≤3 次），失败分为基础设施 / 真失败 / 位移类三类，分级 TTS 反馈。',
            's4.p0.title': 'P0 级联故障：7 步根因审计',
            's4.cap2': '一处旗标漏写触发 7 步级联：旧帧 → 错 bbox → 退化 mask → 重试死锁。修复：一行代码。',
            's4.result': '<code>_bg_write_shm()</code> 成功路径缺失 <code>ok=True</code> 旗标，导致解析器始终读取旧帧，产生退化掩码（<93px），触发无限重试。7 步审计追溯：旗标 → stale 缓存 → VLM 旧帧 → SAM3 错位 → mask 崩溃 → 深度失败 → 重试死循环。<strong>一行修复恢复完整抓取成功。</strong>',
            /* S5: Results */
            's5.title': '量化成果',
            's5.th.metric': '指标',
            's5.th.before': '修复前',
            's5.th.after': '修复后',
            's5.th.method': '方法',
            's5.r1.m': '远场 VAD 命中率',
            's5.r1.how': '有状态 Silero h/c + 现场标定',
            's5.r2.m': 'SAM3 掩码成功率（小目标）',
            's5.r2.how': 'Letterbox + box+text 联合接地',
            's5.r3.m': 'VLM bbox TTFB',
            's5.r3.how': '解耦 bbox 分辨率（max_side 512）',
            's5.r4.m': 'ASR 流式 partial',
            's5.r4.b': 'Session 重建 → 无输出',
            's5.r4.how': '云端 endpointing 主导权回归',
            's5.r5.m': 'P0 抓取成功率',
            's5.r5.b': '4 轮重试全部失败',
            's5.r5.a': '闭环可成功',
            's5.r5.how': '7 步根因审计 + 一行修复',
            's5.r6.m': '颜色/品牌路由错误',
            's5.r6.b': 'HSV 误分类',
            's5.r6.how': 'VLM 出框阶段路由（关闭 HSV rerank）',
            's5.r7.m': 'SAM3 推理速度',
            's5.r7.a': '640，提速 30–50%',
            's5.r7.how': '降低 vision_input_size',
            's5.cap1': '单卡 AGX Orin 端到端单指令延迟：总计 6–9s',
            's5.cap2': '7 项关键指标优化前后对比',
            /* S6: Highlights */
            's6.title': '技术亮点',
            's6.h1.title': 'Letterbox 对齐',
            's6.h1.desc': '统一缩放比保持 16:9 宽高比，用于 VLM 到 SAM3 的坐标变换，防止 1.78 倍纵向拉伸导致小目标掩码崩溃。',
            's6.h2.title': '5 层语义防线',
            's6.h2.desc': '从 ASR 噪声到 VLM-SAM3 空间矛盾的级联错误拦截。每层捕获前一层遗漏的错误，防止脏数据进入追踪缓存。',
            's6.h3.title': '有状态 Silero VAD',
            's6.h3.desc': '保持 RNN 隐藏状态 (h/c) 跨 64ms 帧传递实现远场语音检测。否则每帧孤立评估，系统性地被误判为噪声。',
            's6.h4.title': '3D 抓取票决',
            's6.h4.desc': '多特征点云验证（median/P25/frac）替代单一 Z 阈值。SAM3 batch=2 同时分割物体与手，避免跨帧错位。',
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
        if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
        localStorage.setItem('lang', lang);
    }

    setLang(currentLang);

    langBtn?.addEventListener('click', () => {
        setLang(currentLang === 'en' ? 'zh' : 'en');
    });
})();
