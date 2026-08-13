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
            'education.cuhk.program': 'Department of Computer Science and Engineering · M.Sc. in Computer Science · GPA <strong>3.7 / 4.0</strong>',
            'education.cuhk.honor': '<strong>Honor:</strong> M.Sc. in Computer Science Programme Excellent Student Scholarship, The Chinese University of Hong Kong',
            'education.sysu.school': 'Sun Yat-sen University',
            'education.sysu.program': 'School of Intelligent Systems Engineering · B.Eng. in Intelligent Science and Technology · GPA <strong>3.7 / 4.0</strong>',
            'education.sysu.honor': '<strong>Major honors:</strong> SYSU Outstanding Undergraduate Third-Class Scholarship, Guangdong Soong Ching Ling Scholarship, Jieyang Outstanding Student Cadre',
            'experience.title': 'Experience',
            'experience.roboscience.org': 'Beijing Jike Future Technology Co., Ltd. (RoboScience)',
            'experience.roboscience.role': 'Algorithm Intern · Social-robot interaction and real-robot manipulation systems',
            'experience.roboscience.b1': '<strong>Affective Robot Interaction:</strong> engineered a multimodal social-robot interaction stack with Qwen2.5-VL/OpenCV perception, Text-to-Action CVAE, image-conditioned Diffusion Policy, and 10D WebSocket + Dynamixel execution over 194 reaction episodes.',
            'experience.roboscience.b2': '<strong>VoxIntent:</strong> engineered the voice-to-intent subsystem of a Jetson AGX Orin manipulation robot around a 3-tier VAD, a cloud-first 4-engine streaming ASR router, dual-path NLU (6 action regex + qwen3.5-flash JSON), a 6-state dialog manager with 3-score ambient rejection, VLM instruction grounding with a source-pixel xyxy bbox contract, and a TTS echo guard, lifting field-reported far-field VAD hit rate from 0% to 92% with 150-300 ms ASR partials.',
            'experience.roboscience.b3': '<strong>Embodied Coin Standing and Placement:</strong> architected an xArm6 + LEAP Hand closed-loop manipulation workflow with D435 / fingertip cameras, frozen RADIO summaries, a 16-step / 6-step ACT-style policy, checkpoint hot-switching, HSV tilt + hand-joint gating, grasp verification, rule-based half-arc transfer, and automatic episode reset.',
            'experience.huawei.org': 'Huawei Technologies Co., Ltd. & SYSU VLN Lab',
            'experience.huawei.role': 'VLM Navigation Intern · NavLLaVA visual-language navigation decision model',
            'experience.huawei.b1': 'Curated and normalized <strong>120K</strong> boundary images, then designed scene-description / instruction / model-imagination prompts for multi-scenario navigation decisions.',
            'experience.huawei.b2': 'Applied LoRA fine-tuning with only <strong>0.5%</strong> trainable parameters and rank <code>r=16</code>, reducing memory use by <strong>42%</strong> and improving navigation success by <strong>6.8 pp</strong>.',
            'experience.huawei.b3': 'Improved decision-output format consistency to <strong>87%</strong>; reported <strong>52.1%</strong> success for LLaVA-7B in multi-scenario navigation evaluation.',
            'news.title': '<i class="fa-solid fa-newspaper"></i> News',
            'news.1': 'Personal academic homepage is online!',
            'news.2': 'Completed the full-chain multimodal perception stack (ASR + VAD + TTS + NLU + VLM) and presented at the internship defense.',
            'news.3': 'Achieved <strong>94.2%</strong> mean success rate on LIBERO benchmark with pi0.5 LoRA fine-tuning (+2.0 pp over official baseline).',
            'news.4': 'Engineered Affective Robot Interaction: a voice + vision social-robot stack with 10-DOF manipulation and documented 2.5-5.5s closed-loop latency.',
            'projects.title': '<i class="fa-solid fa-thumbtack"></i> Pinned Projects',
            'card.value': 'Value',
            'card.challenge': 'Edge',
            'card.metrics': 'Metrics',
            'proj.affective.title': 'Affective Robot Interaction: A Multimodal System for Companion Robots',
            'proj.affective.venue': '<em>Algorithm Intern Project</em>, 2026',
            'proj.affective.desc': 'A social-robot multimodal interaction stack routing camera / VDMocap input through Qwen2.5-VL perception into two generative trajectory routes (Text-to-Action CVAE and image-conditioned Diffusion Policy), then a calibrated 10D Dynamixel execution layer.',
            'proj.affective.link.details': 'Details',
            'proj.affective.link.model': 'Model',
            'proj.affective.link.retarget': 'Retargeting',
            'proj.coin.title': 'Embodied Coin Standing and Placement',
            'proj.coin.venue': '<em>Embodied AI / Real-Robot Deployment Project</em>, 2026',
            'proj.coin.desc': 'A closed-loop xArm6 + LEAP Hand system that stands a coin, verifies the grasp by vision and hand state, hot-switches from a stand to a place policy, transfers along a rule-based arc, and auto-resets for the next episode.',
            'proj.pi05.title': 'π0.5 VLA Fine-Tuning on LIBERO Benchmark',
            'proj.pi05.venue': '<em>Algorithm Intern Project</em>, 2026',
            'proj.pi05.desc': 'Migrated Physical Intelligence’s π0.5 VLA to the LIBERO benchmark under a 24 GB single-GPU LoRA budget, packaged as a reproducible benchmark pipeline rather than a one-off run.',
            'proj.aloha.title': 'DreamZero-LeKiwi: Joint Video-Action VLA Fine-Tuning on ALOHA/LeKiwi',
            'proj.aloha.venue': '<em>Robot Learning Project</em>, 2026',
            'proj.aloha.desc': 'A DreamZero-style joint video-action VLA pipeline on an ALOHA/LeKiwi tabletop setup, built on the thesis that most real-robot VLA failures are data-control interface bugs, not model capacity.',
            'proj.ram.title': 'Retrieval-Augmented Manipulation',
            'proj.ram.venue': '<em>Personal Project · Idea & Design</em>, 2026 · on Chen et al., <i>Science Robotics</i>',
            'proj.ram.desc': 'A <strong>retrieval-first</strong> manipulation design: discover the object, retrieve a 3D category template, inherit its grasp points and support planes — so a single RGB frame of an unseen instance is enough to act. I own the system design and training scheme; quantitative results are attributed to the paper.',
            'proj.ram.link.details': 'Details',
            'proj.ram.link.code': 'Code',
            'proj.ram.link.paper': 'Paper',
            'proj.voxintent.title': 'VoxIntent: Voice-to-Intent Pipeline for Manipulation Robot',
            'proj.voxintent.venue': '<em>Algorithm Intern Project</em> · Jetson AGX Orin, 2026',
            'proj.voxintent.desc': 'Owned the voice-to-intent front-end of a Jetson AGX Orin manipulation robot — turning noisy far-field ALSA audio into structured execution intents (downstream SAM3 / grasp / IK / motors are collaborator-owned).',
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
            'education.cuhk.program': '计算机科学与工程学系 · 计算机科学理学硕士 · GPA <strong>3.7 / 4.0</strong>',
            'education.cuhk.honor': '<strong>荣誉：</strong>香港中文大学计算机科学理学硕士课程优秀学生奖学金',
            'education.sysu.school': '中山大学',
            'education.sysu.program': '智能工程学院 · 智能科学与技术专业 · 绩点 <strong>3.7 / 4.0</strong>',
            'education.sysu.honor': '<strong>主要荣誉：</strong>中山大学优秀大学生三等奖学金、广东省宋庆龄奖学金、揭阳市优秀学生干部',
            'experience.title': '实习经历',
            'experience.roboscience.org': '北京机科未来科技有限公司 RoboScience',
            'experience.roboscience.role': '算法实习生 · 社交机器人交互与真机操作系统',
            'experience.roboscience.b1': '<strong>情感陪伴场景的多模态交互系统：</strong>工程化实现多模态社交机器人交互栈，覆盖 Qwen2.5-VL/OpenCV 感知、Text-to-Action CVAE、图像条件 Diffusion Policy，以及 194 个反应 episode 上的 10D WebSocket + Dynamixel 执行链路。',
            'experience.roboscience.b2': '<strong>VoxIntent：</strong>负责 Jetson AGX Orin 操作机器人的语音意图子系统，围绕 3 级 VAD、云优先 4 引擎流式 ASR 路由、双路径 NLU（6 动作正则 + qwen3.5-flash JSON）、6 状态对话管理器搭配 3 维度环境音拒绝、原图像素 xyxy bbox 契约的 VLM 指令定位，以及 TTS 回声门控，将现场记录的远场 VAD 命中率从 0% 提升到 92%，ASR partial 150-300 ms。',
            'experience.roboscience.b3': '<strong>具身硬币立起与放置：</strong>工程化实现 xArm6 + LEAP Hand 闭环操作流程，接入 D435 / 指尖相机、冻结的 RADIO summary、16 步 / 6 步 ACT 风格策略、checkpoint 热切换、HSV 倾角 + 手指关节门控、夹稳验证、规则化半弧转移与 episode 自动复位。',
            'experience.huawei.org': '华为技术有限公司 & SYSU VLN 实验室',
            'experience.huawei.role': 'VLM 导航算法实习 · NavLLaVA 多场景导航决策模型',
            'experience.huawei.b1': '收集并规范化 <strong>12 万</strong>张边界图像，设计“场景描述 - 指令 - 模型想象”Prompt，用于多场景导航决策。',
            'experience.huawei.b2': '采用 LoRA 微调，仅注入 <strong>0.5%</strong> 可训练参数、rank <code>r=16</code>，显存占用降低 <strong>42%</strong>，导航成功率提升 <strong>6.8 pp</strong>。',
            'experience.huawei.b3': '将决策输出格式一致性提升至 <strong>87%</strong>；报告 LLaVA-7B 在多场景导航评测中成功率达到 <strong>52.1%</strong>。',
            'news.title': '<i class="fa-solid fa-newspaper"></i> 动态',
            'news.1': '个人学术主页上线！',
            'news.2': '完成全链路多模态感知系统（ASR + VAD + TTS + NLU + VLM），并在实习答辩中展示。',
            'news.3': '在 LIBERO 基准上通过 π0.5 LoRA 微调达到 <strong>94.2%</strong> 平均成功率（+2.0 pp 超越官方基线）。',
            'news.4': '工程化实现情感陪伴场景的多模态交互系统：语音 + 视觉 + 10-DOF 操作，文档记录闭环延迟为 2.5–5.5 秒。',
            'projects.title': '<i class="fa-solid fa-thumbtack"></i> 置顶项目',
            'card.value': '价值',
            'card.challenge': '难点',
            'card.metrics': '指标',
            'proj.affective.title': '情感陪伴机器人的多模态交互系统',
            'proj.affective.venue': '<em>算法实习项目</em>, 2026',
            'proj.affective.desc': '面向社交机器人的多模态交互栈：摄像头 / VDMocap 输入经 Qwen2.5-VL 感知，进入两条生成式轨迹路线（Text-to-Action CVAE 与图像条件 Diffusion Policy），再由标定后的 10D Dynamixel 执行层输出。',
            'proj.affective.link.details': '详情',
            'proj.affective.link.model': '模型',
            'proj.affective.link.retarget': 'Retargeting',
            'proj.coin.title': '具身硬币立起与放置系统',
            'proj.coin.venue': '<em>具身智能 / 真机部署项目</em>, 2026',
            'proj.coin.desc': '基于 xArm6 + LEAP Hand 的闭环系统：立起硬币，用视觉与手部状态验证夹取，从 stand 策略热切换到 place 策略，沿规则化圆弧转移，并在每轮结束后自动复位。',
            'proj.pi05.title': 'π0.5 VLA 模型在 LIBERO 基准上的微调',
            'proj.pi05.venue': '<em>算法实习项目</em>, 2026',
            'proj.pi05.desc': '在 24 GB 单卡 LoRA 预算下，把 Physical Intelligence 的 π0.5 VLA 迁移到 LIBERO 基准，并做成可复现的 benchmark 管线，而非一次性跑通。',
            'proj.aloha.title': 'DreamZero-LeKiwi：ALOHA/LeKiwi 上的联合视频-动作 VLA 微调',
            'proj.aloha.venue': '<em>机器人学习项目</em>, 2026',
            'proj.aloha.desc': 'ALOHA/LeKiwi 桌面操作上的 DreamZero 风格联合视频-动作 VLA 复现管线，核心判断是：真机 VLA 失败多源于数据-控制接口 bug，而非模型能力不足。',
            'proj.ram.title': '检索增强式具身操作',
            'proj.ram.venue': '<em>个人项目 · 构想与设计</em>, 2026 · 基于 Chen 等人, <i>Science Robotics</i>',
            'proj.ram.desc': '一套<strong>检索优先</strong>的操作设计：先发现物体、检索三维类别模板，并继承该类别的抓取点与支撑面——于是一张未见实例的 RGB 图像就足以驱动动作。我负责系统设计与训练方案；量化结果归属于论文。',
            'proj.ram.link.details': '详情',
            'proj.ram.link.code': '代码',
            'proj.ram.link.paper': '论文',
            'proj.voxintent.title': 'VoxIntent：操作机器人语音意图全链路',
            'proj.voxintent.venue': '<em>算法实习项目</em> · Jetson AGX Orin, 2026',
            'proj.voxintent.desc': '负责 Jetson AGX Orin 操作机器人的语音意图前端——把嘈杂的远场 ALSA 音频转成结构化执行意图（下游 SAM3 / 抓取 / IK / 电机由协作方负责）。',
            'footer': '&copy; <span id="year">' + new Date().getFullYear() + '</span> 陈悦仪. 基于 <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a> 搭建。'
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
