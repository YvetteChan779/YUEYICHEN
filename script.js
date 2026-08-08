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
            'nav.skills': 'skills',
            'nav.pubs': 'projects',
            'profile.title': 'M.Sc. in Computer Science',
            'profile.affiliation': 'The Chinese University of Hong Kong',
            'bio.p1': 'I am a M.Sc. student at <a href="https://www.cuhk.edu.hk/" target="_blank" rel="noopener">The Chinese University of Hong Kong (CUHK)</a>. I build embodied AI systems that connect teleoperation, multimodal perception, policy learning, and real-robot deployment.',
            'bio.p2': 'My recent work spans xArm6 + LEAP Hand manipulation, VLA fine-tuning, diffusion-policy style robot control, humanoid perception, dataset tooling, and deployment pipelines that run beyond offline benchmarks.',
            'highlight': '<i class="fa-solid fa-bullhorn"></i> Current focus: real-robot manipulation systems with traceable data flow, policy serving, sensor feedback, and recovery logic.',
            'education.title': 'Education',
            'education.cuhk.school': 'The Chinese University of Hong Kong',
            'education.cuhk.program': 'Department of Computer Science and Engineering · M.Sc. in Computer Science',
            'education.cuhk.honor': '<strong>Honor:</strong> M.Sc. in Computer Science Programme Excellent Student Scholarship, The Chinese University of Hong Kong',
            'education.sysu.school': 'Sun Yat-sen University',
            'education.sysu.program': 'School of Intelligent Systems Engineering · B.Eng. in Intelligent Science and Technology · GPA <strong>3.7 / 4.0</strong>',
            'education.sysu.honor': '<strong>Major honors:</strong> SYSU Outstanding Undergraduate Third-Class Scholarship, Guangdong Soong Ching Ling Scholarship, Jieyang Outstanding Student Cadre',
            'experience.title': 'Experience',
            'experience.huawei.org': 'Huawei Technologies Co., Ltd. & SYSU VLN Lab',
            'experience.huawei.role': 'VLM Navigation Intern · NavLLaVA visual-language navigation decision model',
            'experience.huawei.b1': 'Curated and normalized <strong>120K</strong> boundary images, then designed scene-description / instruction / model-imagination prompts for multi-scenario navigation decisions.',
            'experience.huawei.b2': 'Applied LoRA fine-tuning with only <strong>0.5%</strong> trainable parameters and rank <code>r=16</code>, reducing memory use by <strong>42%</strong> and improving navigation success by <strong>6.8 pp</strong>.',
            'experience.huawei.b3': 'Improved decision-output format consistency to <strong>87%</strong>; reported <strong>52.1%</strong> success for LLaVA-7B in multi-scenario navigation evaluation.',
            'news.title': '<i class="fa-solid fa-newspaper"></i> News',
            'news.1': 'Personal academic homepage is online!',
            'news.2': 'Completed the full-chain multimodal perception stack (ASR + VAD + TTS + NLU + VLM) and presented at the internship defense.',
            'news.3': 'Achieved <strong>94.2%</strong> mean success rate on LIBERO benchmark with pi0.5 LoRA fine-tuning (+2.0 pp over official baseline).',
            'news.4': 'Engineered PLAN-A multimodal robot interaction stack: voice + vision + 10-DOF manipulation with documented 2.5-5.5s closed-loop latency.',
            'projects.title': '<i class="fa-solid fa-thumbtack"></i> Pinned Projects',
            'proj.plana.title': 'PLAN-A: Multimodal Human-Robot Interaction System',
            'proj.plana.venue': '<em>Algorithm Intern Project</em>, 2026',
            'proj.plana.desc': 'Engineered PLAN-A as a social-robot multimodal interaction stack that routes camera and VDMocap inputs through Qwen2.5-VL / OpenCV perception, Text-to-Action CVAE, image-conditioned Diffusion Policy, and a 10D WebSocket + Dynamixel execution layer. The validated report path uses 194 episodes across waving / reaching / sitting with a shared Normalized Actions <code>(T,10)</code> contract. The CVAE branch encodes BERT-base-chinese CLS to 128D, fuses a 128D category embedding, samples a 64D latent, and decodes with a 2-layer / 4-head Transformer Decoder. The DP branch conditions a 6-layer self+cross-attention action transformer on DINOv2-B/14 or cached Qwen-VL 256D tokens, using DDIM 1000-step v-prediction with self-conditioning 0.9 and min-SNR gamma 5. Runtime streams trajectories at 10 FPS with an execution lock and <code>skipped_busy</code> guard, while retargeting maps VDMocap 23-node pose into <code>[0,4095]</code> encoders through T-pose calibration. Reported scope: 535.95 best CVAE val loss, 100% category sanity accuracy, 2.5-5.5s documented latency, and ~9x Qwen-cache training speedup; no controlled CVAE-vs-DP task-success benchmark is claimed.',
            'proj.plana.link.details': 'Details',
            'proj.plana.link.model': 'Model',
            'proj.plana.link.retarget': 'Retargeting',
            'proj.pi05.title': 'π0.5 VLA Fine-Tuning on LIBERO Benchmark',
            'proj.pi05.venue': '<em>Algorithm Intern Project</em>, 2026',
            'proj.pi05.desc': 'Fine-tuned Physical Intelligence’s π0.5 Vision-Language-Action model on the LIBERO benchmark using LoRA on a single RTX 4090. Designed a freeze-filter strategy matrix spanning 2.6M, 18M, and 305M trainable parameters; fixed action-expert LoRA leakage, norm_stats reuse, and checkpoint-aware evaluation logging. Achieved <strong>94.2%</strong> mean success rate across 2000 episodes (+2.0 pp over official, +18.2 pp over OpenVLA-7B), with Long-10 reaching <strong>88.8%</strong>.',
            'proj.aloha.title': 'ALOHA/LeKiwi SFT Full Episode: DreamZero VLA Reproduction',
            'proj.aloha.venue': '<em>Robot Learning Project</em>, 2026',
            'proj.aloha.desc': 'Built a reproduction-oriented VLA pipeline for an ALOHA/LeKiwi tabletop manipulation setup, covering LeRobot data collection design, GEAR-style metadata conversion, DreamZero embodiment registration, LoRA fine-tuning protocol, and WebSocket-based action-chunk inference. The project emphasizes practical robot-learning details often missed in paper-level reproductions: 3-view camera-order validation, state/action schema audit, gripper normalization, receding-horizon execution, safety clamping, and rollout-video based evaluation.',
            'proj.planb.title': 'PLAN-B: Multimodal Perception & Closed-Loop Grasping for Humanoid Robot',
            'proj.planb.venue': '<em>Algorithm Intern Project</em> · Jetson AGX Orin, 2026',
            'proj.planb.desc': 'Built a full-stack multimodal perception & grasping pipeline for a humanoid robot on Jetson AGX Orin: 3-tier cascaded VAD boosting far-field Silero hit rate from <strong>0% → 92%</strong>; dual-path NLU + VLM-guided SAM3 segmentation raising mask success from <strong>9% → ≥90%</strong>; 8-state closed-loop FSM with 7 guard mechanisms and 3D multi-feature grasp verification (median/P25/frac voting). Diagnosed and fixed a P0 cascading bug via 7-step root-cause audit.',
            'footer': '&copy; <span id="year">' + new Date().getFullYear() + '</span> Yueyi Chen. Powered by <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a>.'
        },
        zh: {
            'nav.about': '关于',
            'nav.skills': '能力',
            'nav.pubs': '项目',
            'profile.title': '计算机科学理学硕士',
            'profile.affiliation': '香港中文大学',
            'bio.p1': '我是<a href="https://www.cuhk.edu.hk/" target="_blank" rel="noopener">香港中文大学（CUHK）</a>的硕士研究生，专注于把遥操作、多模态感知、策略学习和真机部署连接起来的具身智能系统。',
            'bio.p2': '近期工作覆盖 xArm6 + LEAP Hand 真机操作、VLA 微调、Diffusion Policy 风格机器人控制、人形机器人感知、数据集工具和真实部署链路。',
            'highlight': '<i class="fa-solid fa-bullhorn"></i> 当前重点：有可追溯数据流、policy serving、传感器反馈和恢复逻辑的真机操作系统。',
            'education.title': '教育背景',
            'education.cuhk.school': '香港中文大学',
            'education.cuhk.program': '计算机科学与工程学系 · 计算机科学理学硕士',
            'education.cuhk.honor': '<strong>荣誉：</strong>香港中文大学计算机科学理学硕士课程优秀学生奖学金',
            'education.sysu.school': '中山大学',
            'education.sysu.program': '智能工程学院 · 智能科学与技术专业 · 绩点 <strong>3.7 / 4.0</strong>',
            'education.sysu.honor': '<strong>主要荣誉：</strong>中山大学优秀大学生三等奖学金、广东省宋庆龄奖学金、揭阳市优秀学生干部',
            'experience.title': '实习经历',
            'experience.huawei.org': '华为技术有限公司 & SYSU VLN 实验室',
            'experience.huawei.role': 'VLM 导航算法实习 · NavLLaVA 多场景导航决策模型',
            'experience.huawei.b1': '收集并规范化 <strong>12 万</strong>张边界图像，设计“场景描述 - 指令 - 模型想象”Prompt，用于多场景导航决策。',
            'experience.huawei.b2': '采用 LoRA 微调，仅注入 <strong>0.5%</strong> 可训练参数、rank <code>r=16</code>，显存占用降低 <strong>42%</strong>，导航成功率提升 <strong>6.8 pp</strong>。',
            'experience.huawei.b3': '将决策输出格式一致性提升至 <strong>87%</strong>；报告 LLaVA-7B 在多场景导航评测中成功率达到 <strong>52.1%</strong>。',
            'news.title': '<i class="fa-solid fa-newspaper"></i> 动态',
            'news.1': '个人学术主页上线！',
            'news.2': '完成全链路多模态感知系统（ASR + VAD + TTS + NLU + VLM），并在实习答辩中展示。',
            'news.3': '在 LIBERO 基准上通过 π0.5 LoRA 微调达到 <strong>94.2%</strong> 平均成功率（+2.0 pp 超越官方基线）。',
            'news.4': '工程化实现 PLAN-A 多模态机器人交互栈：语音 + 视觉 + 10-DOF 操作，文档记录闭环延迟为 2.5–5.5 秒。',
            'projects.title': '<i class="fa-solid fa-thumbtack"></i> 置顶项目',
            'proj.plana.title': 'PLAN-A：多模态人机交互系统',
            'proj.plana.venue': '<em>算法实习项目</em>, 2026',
            'proj.plana.desc': '将 PLAN-A 工程化为面向社交机器人的多模态交互栈：摄像头与 VDMocap 输入进入 Qwen2.5-VL / OpenCV 感知、Text-to-Action CVAE、图像条件 Diffusion Policy，以及 10D WebSocket + Dynamixel 执行层。验证报告路线使用 194 个 waving / reaching / sitting episode，并共享 Normalized Actions <code>(T,10)</code> 合约。CVAE 分支将 BERT-base-chinese CLS 投影到 128D，融合 128D 类别 embedding，采样 64D latent，再用 2 层 / 4 头 Transformer Decoder 解码。DP 分支用 DINOv2-B/14 或缓存后的 Qwen-VL 256D token 条件化 6 层 self+cross-attention action transformer，采用 DDIM 1000-step v-prediction、self-conditioning 0.9 与 min-SNR gamma 5。运行时以 10 FPS 流式下发轨迹，用 execution lock 和 <code>skipped_busy</code> 防止重入；retargeting 则通过 T-pose 标定把 VDMocap 23 节点姿态映射到 <code>[0,4095]</code> 编码器。可公开报告范围：CVAE best val loss 535.95、类别 sanity accuracy 100%、文档记录延迟 2.5-5.5s、Qwen cache 训练约 9 倍加速；不声称 CVAE 与 DP 的受控真机任务成功率对比。',
            'proj.plana.link.details': '详情',
            'proj.plana.link.model': '模型',
            'proj.plana.link.retarget': 'Retargeting',
            'proj.pi05.title': 'π0.5 VLA 模型在 LIBERO 基准上的微调',
            'proj.pi05.venue': '<em>算法实习项目</em>, 2026',
            'proj.pi05.desc': '在 LIBERO 基准上使用 LoRA 对 Physical Intelligence 的 π0.5 视觉-语言-动作模型进行微调，硬件为单张 RTX 4090。设计 freeze-filter 策略矩阵，覆盖 2.6M、18M、305M 三档可训参数；修复 action-expert LoRA 漏冻、norm_stats 复用与 checkpoint-aware 评测日志归档问题。在 2000 个 episode 上达到 <strong>94.2%</strong> 平均成功率（+2.0 pp 超越官方基线，+18.2 pp 超越 OpenVLA-7B），Long-10 达到 <strong>88.8%</strong>。',
            'proj.aloha.title': 'ALOHA/LeKiwi SFT Full Episode：DreamZero VLA 复现',
            'proj.aloha.venue': '<em>机器人学习项目</em>, 2026',
            'proj.aloha.desc': '围绕 ALOHA/LeKiwi 桌面操作任务构建 DreamZero 风格 VLA 复现管线，覆盖 LeRobot 数据采集设计、GEAR 格式元数据转换、DreamZero embodiment 注册、LoRA 微调协议与 WebSocket 动作块推理。项目重点放在真实机器人学习中容易被忽略的工程细节：三视角相机顺序校验、状态/动作 schema 审计、夹爪归一化、receding-horizon 执行、安全限幅和基于 rollout 视频的评估。',
            'proj.planb.title': 'PLAN-B：多模态感知与闭环抓取系统（人形机器人）',
            'proj.planb.venue': '<em>算法实习项目</em> · Jetson AGX Orin, 2026',
            'proj.planb.desc': '在 Jetson AGX Orin 上构建人形机器人全栈多模态感知与抓取管线：3 级级联 VAD 将远场 Silero 命中率从 <strong>0% 提升至 92%</strong>；双路 NLU + VLM 引导的 SAM3 分割将掩码成功率从 <strong>9% 提升至 ≥90%</strong>；8 态闭环状态机配合 7 条守卫机制与 3D 多特征抓取验证（median/P25/frac 票决）。通过 7 步根因审计定位并修复了一个 P0 级联 bug。',
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
