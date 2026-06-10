/* ==========================================================
   Academic Homepage — Minimal JS
   ========================================================== */

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

    /* ---------- Active nav highlight ---------- */
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], .profile-layout[id]');

    const highlight = () => {
        const y = window.scrollY + 100;
        let current = '';
        sections.forEach(s => {
            if (y >= s.offsetTop) current = s.id;
        });
        links.forEach(l => {
            const href = l.getAttribute('href')?.replace('#', '');
            l.classList.toggle('active', href === current);
        });
    };
    window.addEventListener('scroll', highlight, { passive: true });

    /* ---------- Auto year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- i18n ---------- */
    const i18n = {
        en: {
            'nav.about': 'about',
            'nav.pubs': 'publications',
            'profile.title': 'M.Sc. Student',
            'profile.affiliation': 'The Chinese University of Hong Kong',
            'bio.p1': 'I am a M.Sc. student at <a href="https://www.cuhk.edu.hk/" target="_blank" rel="noopener">The Chinese University of Hong Kong (CUHK)</a>. My research interests lie in <strong>embodied AI</strong>, <strong>multimodal perception</strong>, and <strong>robot learning</strong>, with a focus on vision-language-action models and end-to-end robot manipulation systems.',
            'bio.p2': 'I have hands-on experience building full-stack robot perception pipelines (ASR/NLU/VLM/SAM) and fine-tuning large-scale VLA models (pi0.5) for robotic control. I am also experienced in designing multimodal interaction systems for humanoid robots.',
            'highlight': '<i class="fa-solid fa-bullhorn"></i> I am actively looking for research / industry opportunities in embodied AI and robot learning. Feel free to reach out!',
            'news.title': '<i class="fa-solid fa-newspaper"></i> News',
            'news.1': 'Personal academic homepage is online!',
            'news.2': 'Completed the full-chain multimodal perception stack (ASR + VAD + TTS + NLU + VLM) and presented at the internship defense.',
            'news.3': 'Achieved <strong>94.2%</strong> mean success rate on LIBERO benchmark with pi0.5 LoRA fine-tuning (+2.0 pp over official baseline).',
            'news.4': 'Built PLAN-A end-to-end multimodal robot interaction system: voice + vision + 10-DOF manipulation, achieving 2.5-5.5s closed-loop latency.',
            'projects.title': '<i class="fa-solid fa-book"></i> Selected Projects',
            'proj.plana.title': 'PLAN-A: End-to-End Multimodal Robot Interaction System',
            'proj.plana.venue': '<em>Algorithm Intern Project</em>, 2026',
            'proj.plana.desc': 'Designed and implemented an end-to-end multimodal human–robot interaction system for a 10-DOF social robot, spanning perception, representation, policy, and execution. <strong>Perception layer</strong>: cascaded Qwen2.5-VL-7B + OpenCV Haar face detection with emotion recognition (7 classes → 6 robot states), plus VDMocap quaternion input. <strong>Retargeting</strong>: T-pose calibration pipeline using forward kinematics + <code>scipy.optimize.least_squares</code> numerical IK, mapping global quaternions to encoder values [0, 4095] with zero-position accuracy of 2048 ± 3. <strong>Dual policy routes</strong>: (1) Text-to-Action CVAE — BERT-base-chinese encoding + Transformer Decoder (2L-4H, latent 64d), parallel/autoregressive dual decoding with dynamic stopping, ∼0.5s inference; (2) Image-Conditioned Diffusion Policy — DINOv2/Qwen-VL condition encoding + 6-layer Cross-Attention + DDIM 1000-step with v-prediction, self-conditioning (p=0.9), and min-SNR (γ=5) weighting. Introduced offline Qwen-VL embedding precomputation achieving <strong>∼9× training speedup</strong> (3h → 20min/epoch). <strong>Execution</strong>: WebSocket + Dynamixel real-time control at 10 FPS with mutex-based concurrent isolation. Closed-loop validated on 194 episodes across 3 action categories, achieving <strong>2.5–5.5s</strong> end-to-end latency. Also developed a data quality diagnosis methodology that identified and resolved biased training samples.',
            'proj.pi05.title': 'π0.5 VLA Fine-Tuning on LIBERO Benchmark',
            'proj.pi05.venue': '<em>Algorithm Intern Project</em>, 2026',
            'proj.pi05.desc': 'Fine-tuned Physical Intelligence’s π0.5 Vision-Language-Action model on the LIBERO benchmark using LoRA on a single RTX 4090. Designed 3 freeze-filter strategies spanning 2.6M–305M trainable parameters. Achieved <strong>94.2%</strong> mean success rate across 2000 episodes (+2.0 pp over official, +18.2 pp over OpenVLA-7B).',
            'proj.perception.title': 'Full-Chain Multimodal Robot Perception Stack',
            'proj.perception.venue': '<em>Algorithm Intern Project</em>, 2026',
            'proj.perception.desc': 'Designed and implemented a production-grade perception pipeline for service robots: 3-tier cascaded VAD (Adaptive Energy + Software AGC + Silero v4) achieving 92% far-field wake rate; streaming ASR with 150–300ms partial latency; dual-path NLU (regex fast-path + Qwen structured parsing); VLM-guided SAM3 segmentation boosting mask success from 9% to ≥90%. Integrated barge-in control and 5-layer data consistency safeguards.',
            'proj.tro.title': 'TRO-1B: Large-Scale Robot Manipulation Model',
            'proj.tro.venue': '<em>Research Project</em>, 2026',
            'proj.tro.desc': 'Contributed to a 1B-parameter robot manipulation model with multi-level evaluation. Implemented IK retargeting via Pyroki, multi-machine distributed training, and simulation-based validation pipeline using Isaac Gym.',
            'footer': '&copy; <span id="year">' + new Date().getFullYear() + '</span> Yueyi Chen. Powered by <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a>.'
        },
        zh: {
            'nav.about': '关于',
            'nav.pubs': '项目',
            'profile.title': '硕士研究生',
            'profile.affiliation': '香港中文大学',
            'bio.p1': '我是<a href="https://www.cuhk.edu.hk/" target="_blank" rel="noopener">香港中文大学（CUHK）</a>的硕士研究生。我的研究兴趣包括<strong>具身智能</strong>、<strong>多模态感知</strong>和<strong>机器人学习</strong>，聚焦于视觉-语言-动作模型与端到端机器人操作系统。',
            'bio.p2': '我具有构建全栈机器人感知管线（ASR/NLU/VLM/SAM）和微调大规模 VLA 模型（π0.5）的实践经验，同时在人形机器人多模态交互系统设计方面有丰富经验。',
            'highlight': '<i class="fa-solid fa-bullhorn"></i> 我正在积极寻找具身智能和机器人学习方向的科研 / 产业机会，欢迎联系！',
            'news.title': '<i class="fa-solid fa-newspaper"></i> 动态',
            'news.1': '个人学术主页上线！',
            'news.2': '完成全链路多模态感知系统（ASR + VAD + TTS + NLU + VLM），并在实习答辩中展示。',
            'news.3': '在 LIBERO 基准上通过 π0.5 LoRA 微调达到 <strong>94.2%</strong> 平均成功率（+2.0 pp 超越官方基线）。',
            'news.4': '构建 PLAN-A 端到端多模态机器人交互系统：语音 + 视觉 + 10-DOF 操作，实现 2.5–5.5 秒闭环延迟。',
            'projects.title': '<i class="fa-solid fa-book"></i> 精选项目',
            'proj.plana.title': 'PLAN-A：端到端多模态机器人交互系统',
            'proj.plana.venue': '<em>算法实习项目</em>, 2026',
            'proj.plana.desc': '设计并实现了面向 10-DOF 社交机器人的端到端多模态人机交互系统，涵盖感知、表征、策略与执行四大模块。<strong>感知层</strong>：级联 Qwen2.5-VL-7B + OpenCV Haar 人脸检测与情绪识别（7 类 → 6 种机器人状态），配合 VDMocap 四元数输入。<strong>遥操作标定</strong>：基于正向运动学 + <code>scipy.optimize.least_squares</code> 数值逆解的 T-pose 校准管线，全局四元数映射至编码器值 [0, 4095]，零位精度 2048 ± 3。<strong>双策略路线</strong>：(1) Text-to-Action CVAE — BERT-base-chinese 编码 + Transformer Decoder（2L-4H，latent 64d），并行/自回归双解码模式与动态停止策略，推理约 0.5s；(2) Image-Conditioned Diffusion Policy — DINOv2/Qwen-VL 条件编码 + 6 层 Cross-Attention + DDIM 1000 步，采用 v-prediction、self-conditioning (p=0.9) 与 min-SNR (γ=5) 加权。提出 Qwen-VL 离线嵌入预计算方案，实现<strong>约 9 倍训练加速</strong>（3h → 20min/epoch）。<strong>执行层</strong>：WebSocket + Dynamixel 实时控制，10 FPS 帧率，基于互斥锁的并发隔离机制。在 194 个 episode、3 类动作上完成闭环验证，端到端延迟 <strong>2.5–5.5 秒</strong>。同时开发了数据质量诊断方法论，识别并修复了有偏训练样本。',
            'proj.pi05.title': 'π0.5 VLA 模型在 LIBERO 基准上的微调',
            'proj.pi05.venue': '<em>算法实习项目</em>, 2026',
            'proj.pi05.desc': '在 LIBERO 基准上使用 LoRA 对 Physical Intelligence 的 π0.5 视觉-语言-动作模型进行微调，硬件为单张 RTX 4090。设计了 3 种冻结-过滤策略，可训练参数范围 2.6M–305M。在 2000 个 episode 上达到 <strong>94.2%</strong> 平均成功率（+2.0 pp 超越官方基线，+18.2 pp 超越 OpenVLA-7B）。',
            'proj.perception.title': '全链路多模态机器人感知系统',
            'proj.perception.venue': '<em>算法实习项目</em>, 2026',
            'proj.perception.desc': '设计并实现了面向服务机器人的生产级感知管线：3 级级联 VAD（自适应能量 + 软件 AGC + Silero v4）实现 92% 远场唤醒率；流式 ASR 延迟 150–300ms；双路 NLU（正则快速路径 + Qwen 结构化解析）；VLM 引导的 SAM3 分割将掩码成功率从 9% 提升至 ≥90%。集成了打断控制和 5 层数据一致性保障机制。',
            'proj.tro.title': 'TRO-1B：大规模机器人操作模型',
            'proj.tro.venue': '<em>科研项目</em>, 2026',
            'proj.tro.desc': '参与了一个 10 亿参数的机器人操作模型的研发，包含多级评估体系。负责基于 Pyroki 的 IK 重定向、多机分布式训练，以及基于 Isaac Gym 的仿真验证管线。',
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
