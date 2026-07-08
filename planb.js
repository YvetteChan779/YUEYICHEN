(function () {
    'use strict';

    /* ---------- Theme toggle ---------- */
    const toggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const saved = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', saved);

    function updateMermaidTheme(theme) {
        if (window.__mermaid) {
            window.__mermaid.initialize({
                startOnLoad: false,
                theme: theme === 'dark' ? 'dark' : 'neutral',
                securityLevel: 'loose'
            });
        }
    }
    updateMermaidTheme(saved);

    toggle?.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateMermaidTheme(next);
    });

    /* ---------- Auto year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- i18n ---------- */
    const i18n = {
        en: {
            'back': 'Back to Home',
            'header.title': 'PLAN-B: Multimodal Perception & Closed-Loop Grasping for Humanoid Robot',
            'header.venue': 'Algorithm Intern Project',
            'header.intro': 'planb-robot is a multimodal human–robot interaction system deployed on Jetson AGX Orin, covering the full closed loop of <strong>Speech → Semantics → Perception → Planning → Execution → Verification</strong>. This page documents the system architecture, key technical innovations, and quantitative results across five subsystems.',
            's1.title': 'System Overview',
            's1.desc': 'The system is organized as a <strong>linear pipeline</strong> where each stage\'s output serves as the next stage\'s input contract. Key design principles: (1) TTS reverse-gates VAD via <code>/tts/playback_active</code> to prevent self-triggering; (2) the verification layer feeds failures back to the planning layer (not idle), enabling retry on "executor reports success but vision reports failure"; (3) any stage\'s error can be grepped via ROS topic constants.',
            's2.title': 'Voice Frontend: 3-Tier VAD + Streaming ASR',
            's2.vad.title': 'Three-Layer VAD Decision Path',
            's2.param': 'Parameter', 's2.value': 'Value', 's2.meaning': 'Meaning',
            's2.p1': 'Lowered from 0.5 default for far-field recall',
            's2.p2': 'Noise floor −46 dB − 2 dB safety margin',
            's2.p3': 'Adaptive threshold → −42 dB, leaving 3 dB speech headroom',
            's2.p4': 'AGC RMS normalization target for far-field matching',
            's2.p5': 'P10 sliding window for noise floor estimation',
            's2.asr.title': 'Streaming ASR Engine Router',
            's2.asr.desc': 'Four ASR engines switchable within the Router: <strong>cloud_qwen3</strong> (default, real-time streaming), <strong>cloud_paraformer</strong> (hot-swap backup), <strong>local Qwen3-ASR TRT</strong> (offline), and <strong>FunASR</strong> (chunk streaming). Cloud streaming is production-preferred with server-side VAD + endpointing; the final text undergoes <code>clean_asr_text</code> post-processing (Overlap Stitcher → Hallucination Filter → Length Guard).',
            's2.bargein.title': 'Barge-in Controller',
            's2.bargein.desc': 'TTS playback state reverse-gates VAD via <code>/tts/playback_active</code>, forming a closed-loop dialogue guard: when TTS is speaking, VAD is suppressed to prevent the robot from hearing its own voice. Users can interrupt at any time — barge-in detection immediately stops TTS and re-enables the pipeline.',
            's2.result.label': 'Key Result:',
            's2.result.text': 'Far-field Silero hit rate <strong>0% → 92%</strong>; VAD discrimination: white noise prob < 0.01, real speech prob > 0.99; partial ASR latency <strong>150–300 ms</strong>.',
            's3.title': 'Multimodal Semantic Understanding: NLU + VLM + SAM3',
            's3.nlu.title': 'Dual-Path NLU Design',
            's3.design': 'Design Point', 's3.principle': 'Principle', 's3.outcome': 'Outcome',
            's3.d1.name': 'Regex Fast Path', 's3.d1.p': '7 templates cover 90% common commands at 0 ms', 's3.d1.o': 'Frees LLM compute for VLM',
            's3.d2.name': 'Whitelist Guard', 's3.d2.p': '~300 word dictionary substring match', 's3.d2.o': 'Prevents ASR noise false matches',
            's3.d3.name': 'JSON Schema Constraint', 's3.d3.p': 'temperature=0 + max_new_tokens=28', 's3.d3.o': 'Greedy decoding, stable output',
            's3.d4.name': 'Noise → unknown', 's3.d4.p': '8 ASR noise examples in system prompt', 's3.d4.o': 'Force-labels noise, blocks false chat',
            's3.d5.name': 'chat_fallback', 's3.d5.p': 'Only when LLM says unknown but sentence ends with ?', 's3.d5.o': 'Saves clear questions, not garbled input',
            's3.vlm.title': 'VLM bbox → SAM3 Mask (Letterbox Alignment)',
            's3.vlm.desc': 'Key fix: unified scale ratio from separate 0.7875/1.4 to <code>min(size/W, size/H)</code>, preserving 16:9 aspect ratio. The API passes original-image pixel coordinates; a layout-aware inverse function maps them into letterbox-internal coordinates. This prevents ViT from seeing targets stretched 1.78× vertically. Combined with CLIP English text joint grounding (<code>HAR_SAM3_BOX_TEXT_EMPTY=0</code>), small-object mask success jumped from <strong>9% to ≥90%</strong> (44 green-apple trials).',
            's3.defense.title': '5-Layer Semantic Defense Chain',
            's3.layer': 'Layer', 's3.mechanism': 'Mechanism', 's3.purpose': 'Purpose',
            's3.l1.m': 'Whitelist longest-substring recovery', 's3.l1.p': 'Recovers objects from ASR sliding-window noise',
            's3.l2.m': 'ASR color backfill into prompt', 's3.l2.p': 'Fixes NLU dropping color attributes',
            's3.l3.m': 'Hallucinated location stripping', 's3.l3.p': 'Removes phantom placement locations from LLM',
            's3.l4.m': 'Translation sentinel blacklist', 's3.l4.p': 'Breaks dictionary-miss infinite loops',
            's3.l5.m': 'VLM-SAM3 IoU / center-distance validation', 's3.l5.p': 'Catches VLM-SAM3 spatial contradictions before cache write',
            's3.result.label': 'Key Results:',
            's3.result.text': 'SAM3 mask success (small targets): <strong>9% → ≥90%</strong>; VLM bbox TTFB saved <strong>300–500 ms</strong>; color/brand routing error rate → <strong>0</strong>.',
            's4.title': 'Closed-Loop State Machine & Grasp Verification',
            's4.fsm.title': 'Pipeline Main FSM (8 States)',
            's4.sub.title': 'Grasp Sub-FSM (5 States)',
            's4.check.title': 'grasp_check: 3D Multi-Feature Voting',
            's4.check.desc': 'The main gate (median < 0.055m) is mandatory — if the distribution center is too far, the object is clearly not in hand. Three auxiliary voters (P25, frac<3cm, frac<5cm) each capture different contact evidence; any one passing suffices. SAM3 runs <code>batch=2</code> to output both object and hand masks simultaneously, avoiding cross-frame misalignment.',
            's4.guard.title': '7 Guard Mechanisms',
            's4.guard.name': 'Guard', 's4.guard.param': 'Description', 's4.guard.value': 'Parameter',
            's4.g1': 'Nav status arbiter',
            's4.g2.name': 'Deferred command flush', 's4.g2.p': 'REACHED → EXEC',
            's4.g3.name': 'Grasp retry ≤ 3', 's4.g3.p': 'Infra / real fail / moved',
            's4.g4.p': '3D point cloud voting',
            's4.g5.p': 'Left-cam SAM3 re-check',
            's4.g6.p': 'mask inclusion / IoU / depth',
            's4.g7.name': 'VLM grasp verify (opt.)', 's4.g7.p': 'Qwen2.5-VL override',
            's4.p0.title': 'P0 Bug Case Study',
            's4.p0.desc': '<strong>Symptom:</strong> grasping "apple" repeatedly retried 3+ times, always failing. <strong>Root cause:</strong> <code>_bg_write_shm()</code> success path only logged but never set <code>shm_write_ok["ok"]=True</code>. This single missing flag triggered a <strong>7-step cascading error chain</strong>: flag False → fallback path → stale parser state → VLM sees old frame → SAM3 gets wrong bbox → mask too small (27/65/93 px) → depth_meta=None → fail-fast retry. <strong>Fix:</strong> one line — add <code>shm_write_ok["ok"] = True</code> after successful <code>os.replace()</code>.',
            's5.title': 'Key Metrics Summary',
            's5.metric': 'Metric', 's5.before': 'Before', 's5.after': 'After', 's5.source': 'Source',
            's5.m1': 'SAM3 mask success (small targets)',
            's5.m3': 'Far-field Silero hit rate',
            's5.m4': 'Fallback drift pollution', 's5.m4b': 'Frequent (log L399-420)', 's5.m4a': 'All blocked by defense', 's5.m4s': 'Defense Layer 5',
            's5.m5': 'Dictionary-miss infinite loop', 's5.m5b': 'Permanent cache pollution', 's5.m5a': 'Sentinel blacklist rejects', 's5.m5s': 'Defense Layer 4',
            's5.m6': 'Color/brand routing', 's5.m6b': 'HSV rejects red bull', 's5.m6a': 'VLM-stage routing, correct', 's5.m6s': 'Disabled HSV rerank',
            's5.m7': 'Longest-word priority', 's5.m7b': '"green apple" truncated to "apple"', 's5.m7a': 'Whitelist longest-match recovery', 's5.m7s': 'Defense Layer 1',
            'footer': '&copy; <span id="year">' + new Date().getFullYear() + '</span> Yueyi Chen. Powered by <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a>.'
        },
        zh: {
            'back': '返回主页',
            'header.title': 'PLAN-B：多模态感知与闭环抓取系统（人形机器人）',
            'header.venue': '算法实习项目',
            'header.intro': 'planb-robot 是部署在 Jetson AGX Orin 上的多模态人形机器人交互系统，覆盖<strong>语音 → 语义 → 感知 → 规划 → 执行 → 验证</strong>完整闭环。本页记录系统架构、关键技术创新与量化结果，涵盖五大子系统。',
            's1.title': '系统总览',
            's1.desc': '系统采用<strong>线性串联</strong>架构，每一级的产出即下一级的入口契约。核心设计原则：(1) TTS 通过 <code>/tts/playback_active</code> 反向门控 VAD，防止机器人"自听自说"；(2) 验证层失败回流到规划层（而非 idle），支持"执行器报成功但视觉报失败"的重试；(3) 任意一层的状态均可在 ROS topic 上 grep 到。',
            's2.title': '语音前端：三层 VAD + 流式 ASR',
            's2.vad.title': '三层 VAD 决策路径',
            's2.param': '参数', 's2.value': '值', 's2.meaning': '含义',
            's2.p1': '从默认 0.5 降低至 0.3 以提升远场召回',
            's2.p2': '噪底 −46 dB − 2 dB 安全裕度',
            's2.p3': '自适应阈值 → −42 dB，留 3 dB 语音余量',
            's2.p4': 'AGC RMS 归一目标，远场弱信号匹配',
            's2.p5': 'P10 滑窗估计噪底，跟随环境慢漂移',
            's2.asr.title': '流式 ASR 引擎路由',
            's2.asr.desc': '四引擎在 Router 内互斥可切：<strong>cloud_qwen3</strong>（默认，实时流式）、<strong>cloud_paraformer</strong>（热切备选）、<strong>本地 Qwen3-ASR TRT</strong>（离线）和 <strong>FunASR</strong>（chunk 流式）。云端真流式为生产首选；最终文本经 <code>clean_asr_text</code> 后处理（Overlap Stitcher → Hallucination Filter → Length Guard）。',
            's2.bargein.title': '打断控制器',
            's2.bargein.desc': 'TTS 播放状态通过 <code>/tts/playback_active</code> 反向门控 VAD，形成闭环对话守卫：TTS 播放时抑制 VAD，防止机器人自听自说误触发。用户随时可打断——打断检测立即停止 TTS 并重新启用管线。',
            's2.result.label': '关键产出：',
            's2.result.text': '远场 Silero 命中率 <strong>0% → 92%</strong>；VAD 区分度：白噪声 prob < 0.01，真实语音 prob > 0.99；partial ASR 延迟 <strong>150–300 ms</strong>。',
            's3.title': '多模态语义理解：NLU + VLM + SAM3',
            's3.nlu.title': '双路 NLU 设计',
            's3.design': '设计点', 's3.principle': '原理', 's3.outcome': '产出',
            's3.d1.name': '正则快路径', 's3.d1.p': '7 条模板覆盖 90% 常见指令，0 ms', 's3.d1.o': '释放 LLM 算力给 VLM',
            's3.d2.name': '白名单兜底', 's3.d2.p': '~300 词字典子串匹配', 's3.d2.o': '防 ASR 噪声误匹配',
            's3.d3.name': 'JSON Schema 约束', 's3.d3.p': 'temperature=0 + max_new_tokens=28', 's3.d3.o': '贪心解码，结果稳定',
            's3.d4.name': 'Noise → unknown', 's3.d4.p': 'system prompt 内嵌 8 条 ASR 噪声示例', 's3.d4.o': '强制判 unknown，禁判 chat',
            's3.d5.name': 'chat_fallback', 's3.d5.p': '仅当 LLM 判 unknown 但句尾有 ？', 's3.d5.o': '只救清晰提问，不救残句',
            's3.vlm.title': 'VLM bbox → SAM3 Mask（Letterbox 对齐）',
            's3.vlm.desc': '关键修复：将水平/垂直缩放比从 0.7875/1.4 统一为 <code>min(size/W, size/H)</code>，保持 16:9 宽高比。调用方仍传原图 pixel xyxy，由 layout-aware 反推函数推到 letterbox 内坐标。避免 ViT 看到"被纵向拉长 1.78×"的目标。配合 CLIP 英文 text 联合先验（<code>HAR_SAM3_BOX_TEXT_EMPTY=0</code>），小目标掩码成功率从 <strong>9% 跃升至 ≥90%</strong>（44 次青苹果场景）。',
            's3.defense.title': '五层语义防线级联',
            's3.layer': '防线', 's3.mechanism': '机制', 's3.purpose': '目的',
            's3.l1.m': '白名单子串长词优先回收', 's3.l1.p': '从 ASR 滑窗拼接噪声中恢复物体',
            's3.l2.m': 'ASR 颜色回填到 prompt', 's3.l2.p': '修复 NLU 漏颜色属性',
            's3.l3.m': '幻觉位置剥离', 's3.l3.p': '剔除 LLM 无中生有的放置位置',
            's3.l4.m': '翻译 sentinel 黑名单', 's3.l4.p': '打破字典缺词死循环',
            's3.l5.m': 'VLM-SAM3 IoU / 中心距校验', 's3.l5.p': '在写入缓存前拦截空间矛盾',
            's3.result.label': '关键产出：',
            's3.result.text': 'SAM3 掩码成功率（小目标）：<strong>9% → ≥90%</strong>；VLM bbox TTFB 节省 <strong>300–500 ms</strong>；颜色/品牌路由错误率 → <strong>0</strong>。',
            's4.title': '闭环状态机与抓取验证',
            's4.fsm.title': 'Pipeline 主状态机（8 态）',
            's4.sub.title': '抓取子状态机（5 态）',
            's4.check.title': 'grasp_check：3D 多特征票决',
            's4.check.desc': '主门 median < 0.055m 为必要条件——分布中部太远说明物体根本没在手附近。三个辅门（P25、frac<3cm、frac<5cm）各捕获不同接触证据，任一通过即得票。SAM3 使用 <code>batch=2</code> 同时输出 object 与 hand 两路 mask，避免跨帧错位。',
            's4.guard.title': '7 条守卫机制',
            's4.guard.name': '守卫', 's4.guard.param': '说明', 's4.guard.value': '参数',
            's4.g1': '导航状态终态判定',
            's4.g2.name': '延迟指令 flush', 's4.g2.p': 'REACHED 后才下发',
            's4.g3.name': '抓取重试 ≤ 3', 's4.g3.p': '区分基础设施/真失败/位移',
            's4.g4.p': '3D 点云票决',
            's4.g5.p': '左手相机 SAM3 复检',
            's4.g6.p': 'mask 包含/IoU/深度一致性',
            's4.g7.name': 'VLM 抓取验证（可选）', 's4.g7.p': 'Qwen2.5-VL 推翻执行器',
            's4.p0.title': 'P0 Bug 案例',
            's4.p0.desc': '<strong>现象：</strong>抓"苹果"反复重试 3+ 次均失败。<strong>根因：</strong><code>_bg_write_shm()</code> 成功路径只打了 log 但没有置位 <code>shm_write_ok["ok"]=True</code>。这一处旗标漏写触发了 <strong>7 步连锁误差链</strong>：旗标 False → 走兜底 → 读 stale → VLM 顺旧帧给 bbox → SAM3 出 mask → mask 太小 (27/65/93 px) → depth_meta=None → fail-fast 重试。<strong>修复：</strong>一行——在 <code>os.replace()</code> 成功后加 <code>shm_write_ok["ok"] = True</code>。',
            's5.title': '关键指标汇总',
            's5.metric': '指标', 's5.before': '修复前', 's5.after': '修复后', 's5.source': '来源',
            's5.m1': 'SAM3 掩码成功率（小目标）',
            's5.m3': '远场 Silero 命中率',
            's5.m4': '整图 fallback 漂移污染', 's5.m4b': '频发 (log L399-420)', 's5.m4a': '双道防线全部拦截', 's5.m4s': '防线 5',
            's5.m5': '字典缺词死循环', 's5.m5b': '永久污染缓存', 's5.m5a': 'sentinel 黑名单静默拒绝', 's5.m5s': '防线 4',
            's5.m6': '颜色/品牌路由', 's5.m6b': 'HSV 误拒 red bull', 's5.m6a': 'VLM 出框阶段正确路由', 's5.m6s': '关闭 HSV rerank',
            's5.m7': '长词优先', 's5.m7b': '"青苹果"被截为"苹果"', 's5.m7a': '白名单子串长词优先回收', 's5.m7s': '防线 1',
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
