(function () {
    'use strict';

    const toggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const saved = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', saved);

    toggle?.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const Y = new Date().getFullYear();
    const footerEn = '&copy; <span id="year">' + Y + '</span> Yueyi Chen. Powered by <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a>.';
    const footerZh = '&copy; <span id="year">' + Y + '</span> 陈悦怡. 基于 <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a> 搭建。';

    const i18n = {
        en: {
            'back': 'Back to Home',
            'hero.title': 'ALOHA/LeKiwi SFT Full Episode: DreamZero VLA Reproduction',
            'hero.venue': 'Embodied AI / Robot Learning Project',
            'hero.tagline': 'LeRobot data collection, GEAR-style conversion, DreamZero LoRA fine-tuning, and receding-horizon robot inference.',
            'hero.arch': 'Architecture',
            'hero.design': 'Experiment Design',
            'hero.demo': 'Rollout Videos',
            'm.views': 'Synchronized observation',
            'm.data': 'State/action dataset',
            'm.sft': 'DreamZero fine-tuning',
            'm.chunk': 'Action chunk inference',
            's0.title': 'Overview',
            's0.p1': 'This project reproduces a <strong>DreamZero-style Vision-Language-Action pipeline</strong> on an ALOHA/LeKiwi tabletop manipulation setup. I treated the existing synchronized mp4 rollouts as qualitative inference references, then designed the trainable path around LeRobot demonstrations with aligned RGB, robot state, action, timestamp, and language annotation.',
            's0.c1': 'Designed the end-to-end reproduction route: <strong>LeRobot collection -> GEAR metadata -> DreamZero embodiment config -> LoRA SFT -> WebSocket inference</strong>.',
            's0.c2': 'Defined a 3-camera observation contract and action/state schema for ALOHA/LeKiwi, with explicit checks for camera order, gripper convention, and action normalization.',
            's0.c3': 'Built the experiment design around staged validation: small-episode overfit, 50-episode pilot, 100-300 episode SFT, then real-robot rollout evaluation.',
            's0.c4': 'Integrated rollout videos into the project page as visual evidence for the inference/evaluation interface, while keeping them separate from trainable data.',
            's0.scope': '<strong>Data note:</strong> the mp4 files shown below are inference results, not training data. Training requires synchronized state/action trajectories, episode metadata, and language labels collected through LeRobot.',
            's1.title': 'System Architecture',
            's1.cap': 'Full reproduction pipeline: data acquisition, LeRobot-to-GEAR conversion, DreamZero LoRA fine-tuning, WebSocket inference, safety adapter, and closed-loop rollout evaluation.',
            's2.title': 'Experimental Design',
            's2.p1': 'I designed the experiment as an engineering-first reproduction, because VLA failures on real robots are often caused by data-control interface bugs rather than model capacity. The first priority is proving that the observation/action schema is correct before scaling training.',
            's2.th.stage': 'Stage',
            's2.th.goal': 'Goal',
            's2.th.check': 'Main Check',
            's2.th.output': 'Output',
            's2.r1.stage': '0. Data sanity',
            's2.r1.goal': 'Collect a small clean set',
            's2.r1.check': 'camera order, timestamp alignment, action dimension',
            's2.r1.output': 'validated LeRobot dataset',
            's2.r2.stage': '1. Overfit run',
            's2.r2.goal': 'Catch schema bugs early',
            's2.r2.check': 'loss drop, action direction, gripper timing',
            's2.r2.output': 'conversion/config fix list',
            's2.r3.stage': '2. LoRA pilot',
            's2.r3.goal': 'Adapt DreamZero-AgiBot',
            's2.r3.check': 'offline rollout smoothness and chunk stability',
            's2.r3.output': 'task LoRA checkpoint',
            's2.r4.stage': '3. Real rollout',
            's2.r4.goal': 'Evaluate closed-loop behavior',
            's2.r4.check': 'success phase, clipping rate, failure mode',
            's2.r4.output': 'video + phase metrics',
            's2.result': 'The key implementation detail is the <strong>robot adapter</strong>: unnormalize model actions, clamp joint/gripper limits, execute only the first few steps of each generated chunk, then replan from fresh camera observations.',
            's3.title': 'Data, Training and Fine-Tuning Protocol',
            's3.p1': 'The trainable dataset should be collected with LeRobot rather than reconstructed from mp4 files. Each episode needs three RGB streams, robot state, action command, timestamps, episode boundaries, and a consistent English task instruction. The DreamZero side then consumes the dataset through a GEAR-style modality description.',
            's3.h1.title': 'Multi-view Contract',
            's3.h1.desc': 'Front, side, and wrist views are fixed as embodiment-level keys. I avoid changing camera order between collection, training, and inference.',
            's3.h2.title': 'Action Scale Audit',
            's3.h2.desc': 'Joint, gripper, and optional base actions are inspected from parquet shapes before writing modality configs.',
            's3.h3.title': 'LoRA First',
            's3.h3.desc': 'I start from DreamZero-AgiBot and tune low-rank adapters before attempting heavier full-parameter training.',
            's3.h4.title': 'Safety-Aware Inference',
            's3.h4.desc': 'Model output is treated as a high-level command stream; the low-level controller still handles limits, smoothing, and emergency stop.',
            's4.title': 'Inference Rollout Videos',
            's4.p1': 'The videos below are representative synchronized rollouts from the provided project folder. I use them on the homepage as qualitative inference evidence and as a target format for later closed-loop evaluation videos.',
            's4.v1': 'Episode 000: synchronized multi-view inference rollout.',
            's4.v2': 'Episode 003: longer rollout used for phase and stability inspection.',
            's4.v3': 'Episode 009: compact rollout for fast page review.',
            's5.title': 'Interview-Ready Technical Points',
            's5.h1.title': 'VLA Reproduction',
            's5.h1.desc': 'The main challenge is not just training, but aligning vision, language, state, action, and robot execution conventions.',
            's5.h2.title': 'Latency vs Closed Loop',
            's5.h2.desc': 'Action chunking reduces server pressure, while receding-horizon execution limits open-loop drift.',
            's5.h3.title': 'Control Interface',
            's5.h3.desc': 'The VLA policy outputs commands, but safety clamp, interpolation, and low-level servo control stay outside the model.',
            's5.h4.title': 'Failure Diagnosis',
            's5.h4.desc': 'If loss looks normal but rollout fails, I first check camera order, gripper sign, action scale, and time alignment.',
            'footer': footerEn
        },
        zh: {
            'back': '返回主页',
            'hero.title': 'ALOHA/LeKiwi SFT Full Episode：DreamZero VLA 复现',
            'hero.venue': '具身智能 / 机器人学习项目',
            'hero.tagline': 'LeRobot 数据采集、GEAR 格式转换、DreamZero LoRA 微调与 receding-horizon 机器人推理。',
            'hero.arch': '架构图',
            'hero.design': '实验设计',
            'hero.demo': '推理视频',
            'm.views': '同步多视角观测',
            'm.data': '状态/动作数据集',
            'm.sft': 'DreamZero 微调',
            'm.chunk': '动作块推理',
            's0.title': '项目概述',
            's0.p1': '本项目在 ALOHA/LeKiwi 桌面操作任务上复现 <strong>DreamZero 风格的视觉-语言-动作管线</strong>。我将已有同步 mp4 rollout 作为定性推理参考，真正可训练的路径则围绕 LeRobot 示教数据设计，要求 RGB、机器人状态、动作、时间戳和语言标注对齐。',
            's0.c1': '设计完整复现路线：<strong>LeRobot 采集 -> GEAR 元数据 -> DreamZero embodiment 配置 -> LoRA SFT -> WebSocket 推理</strong>。',
            's0.c2': '为 ALOHA/LeKiwi 定义三相机观测协议和状态/动作 schema，显式检查相机顺序、夹爪约定和动作归一化。',
            's0.c3': '按阶段设计实验：小样本 overfit、50 episode pilot、100-300 episode SFT，再进入真实机器人 rollout 评估。',
            's0.c4': '将 rollout 视频集成到项目页中，作为推理/评估接口的可视化证据，同时和训练数据严格区分。',
            's0.scope': '<strong>数据说明：</strong>下方 mp4 是推理结果，不是训练数据。训练需要通过 LeRobot 重新采集同步状态/动作轨迹、episode 元数据和语言标签。',
            's1.title': '系统架构',
            's1.cap': '完整复现管线：数据采集、LeRobot 到 GEAR 转换、DreamZero LoRA 微调、WebSocket 推理、安全适配器与闭环 rollout 评估。',
            's2.title': '实验设计',
            's2.p1': '我将实验设计成工程优先的复现流程，因为真实机器人上的 VLA 失败往往来自数据-控制接口错误，而不是模型容量不足。第一优先级是在扩大训练前证明观测/动作 schema 正确。',
            's2.th.stage': '阶段',
            's2.th.goal': '目标',
            's2.th.check': '核心检查',
            's2.th.output': '产出',
            's2.r1.stage': '0. 数据 sanity',
            's2.r1.goal': '采集小规模干净数据',
            's2.r1.check': '相机顺序、时间戳对齐、动作维度',
            's2.r1.output': '验证过的 LeRobot 数据集',
            's2.r2.stage': '1. 小样本过拟合',
            's2.r2.goal': '尽早捕获 schema bug',
            's2.r2.check': 'loss 下降、动作方向、夹爪时序',
            's2.r2.output': '转换/配置修复清单',
            's2.r3.stage': '2. LoRA pilot',
            's2.r3.goal': '适配 DreamZero-AgiBot',
            's2.r3.check': '离线 rollout 平滑性与 chunk 稳定性',
            's2.r3.output': '任务 LoRA checkpoint',
            's2.r4.stage': '3. 真实 rollout',
            's2.r4.goal': '评估闭环行为',
            's2.r4.check': '阶段成功率、限幅频率、失败模式',
            's2.r4.output': '视频 + 分阶段指标',
            's2.result': '关键实现点是 <strong>robot adapter</strong>：反归一化模型动作，限制关节/夹爪范围，只执行每个动作块前几步，然后用新的相机观测重新规划。',
            's3.title': '数据、训练与微调协议',
            's3.p1': '可训练数据应通过 LeRobot 采集，而不是从 mp4 反推。每个 episode 需要三路 RGB、机器人状态、动作命令、时间戳、episode 边界和一致的英文任务指令。DreamZero 侧通过 GEAR 风格的 modality 描述消费这些数据。',
            's3.h1.title': '多视角协议',
            's3.h1.desc': 'front、side、wrist 视角固定为 embodiment 级 key，采集、训练和推理阶段不改变相机顺序。',
            's3.h2.title': '动作尺度审计',
            's3.h2.desc': '在编写 modality 配置前，先从 parquet shape 检查关节、夹爪和可选底盘动作维度。',
            's3.h3.title': '优先 LoRA',
            's3.h3.desc': '从 DreamZero-AgiBot 出发先训练低秩 adapter，再考虑成本更高的全量微调。',
            's3.h4.title': '安全感知推理',
            's3.h4.desc': '模型输出被视为高层命令流；限幅、平滑和急停仍由低层控制器负责。',
            's4.title': '推理 Rollout 视频',
            's4.p1': '下方视频来自你提供的项目文件夹，是代表性的同步 rollout。我将其作为主页上的定性推理证据，并作为后续闭环评估视频的目标格式。',
            's4.v1': 'Episode 000：同步多视角推理 rollout。',
            's4.v2': 'Episode 003：较长 rollout，用于阶段行为与稳定性检查。',
            's4.v3': 'Episode 009：较短 rollout，适合快速预览页面。',
            's5.title': '面试可讲技术点',
            's5.h1.title': 'VLA 复现',
            's5.h1.desc': '难点不只是训练，而是对齐视觉、语言、状态、动作和机器人执行约定。',
            's5.h2.title': '延迟与闭环',
            's5.h2.desc': '动作块降低 server 压力，receding-horizon 执行限制开环漂移。',
            's5.h3.title': '控制接口',
            's5.h3.desc': 'VLA policy 输出命令，但安全限幅、插值和底层伺服控制仍在模型外部。',
            's5.h4.title': '失败诊断',
            's5.h4.desc': '如果 loss 正常但 rollout 失败，我会先查相机顺序、夹爪符号、动作尺度和时间对齐。',
            'footer': footerZh
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
