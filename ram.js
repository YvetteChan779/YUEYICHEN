(function () {
    'use strict';

    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const langToggle = document.getElementById('langToggle');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);

    themeToggle?.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const i18n = {
        en: {
            back: 'Back to Home',
            'hero.kicker': 'Personal Project · Idea & Design',
            'hero.title': 'Retrieval-Augmented Manipulation',
            'hero.venue': 'Object-centric manipulation · a retrieval-first system design',
            'hero.tagline': 'A retrieval-first design for manipulating unseen objects: discover the object, retrieve a category template, reconstruct an object-centric 3D frame, then hand explicit geometry to a deterministic motion layer.',
            'hero.links.code': 'GitHub',
            'hero.links.paper': 'Paper',
            'hero.links.article': 'CUHK article',
            'hero.cite': 'Design and pipeline work by Yueyi Chen, building on Chen et al., <a href="https://doi.org/10.1126/scirobotics.aea2092" target="_blank" rel="noopener"><i>Science Robotics</i> 2026</a> (CUHK). Quantitative results on this page are attributed to that paper.',
            'm.k': '5',
            'm.kLabel': 'retrieval candidates per object (RAM-K)',
            'm.views': '128',
            'm.viewsLabel': 'template views per object category',
            'm.stages': '4',
            'm.stagesLabel': 'decoupled runtime stages',
            'm.emb': '2304-D',
            'm.embLabel': 'fused DINOv2 feature embedding',
            'overview.title': 'The Idea',
            'overview.p1': 'Most manipulation policies try to learn the pixel-to-torque mapping end to end, which means every new object is a new data problem. The design bet here is the opposite: treat manipulation as <strong>retrieval first, motion second</strong>. If a robot can recognize what an object <em>is</em> and pull a matching 3D category template from memory, it inherits that category\'s grasp points, hinges, and support planes for free — so a single RGB frame of an <em>unseen</em> instance is enough to act on.',
            'overview.p2': 'That bet forces one clean boundary: the hard contract is the <strong>object representation</strong>, not the robot SDK. The design splits into four decoupled stages — <code>step1_grounding</code> discovers object instances in a live RGB frame, <code>step2_ram</code> lifts them into an explicit object-centric 3D frame (viewpoint + NOCS + affordances), <code>step3_planning</code> turns that geometry into VLM subgoals, and <code>step4_conducting</code> converts subgoals into robot waypoints. Because geometry is explicit and every stage writes an inspectable artifact, the perception half can be debugged without ever touching the arm.',
            'overview.scope': '<i class="fa-solid fa-user-pen"></i>My role: I own the system design and the training-side pipeline on this page — the retrieval-first decomposition, the object-representation contract, and the RAMNet training scheme (frozen backbone, BOP-style data, template priors, the loss mix). The idea builds on published work by my senior colleague (Chen et al., <i>Science Robotics</i> 2026), reused here with permission; quantitative results are attributed to that paper rather than re-run locally.',
            'overview.result': '<i class="fa-solid fa-bullhorn"></i>What the design buys, per the paper: zero-shot real-world execution on unseen objects, spatially aware manipulation from a single 2D image, and adaptive replanning under physical constraints such as object size and collision.',
            'architecture.title': 'Architecture',
            'architecture.cap': 'The design reuses strong off-the-shelf perception (GroundingDINO + SAM2 for discovery, VGGT-1B for metric depth) and spends its own learned capacity only where it matters — RAMNet, the module that fuses 2D features with a retrieved 3D template. Everything downstream of geometry stays deterministic on purpose.',
            'architecture.card1.title': 'RAMNet core — the learned bet',
            'architecture.card1.body': 'The one module worth training. <code>visions/ram/lib/network.py</code> keeps DINOv2-B/14 <strong>frozen</strong> (features from layers <code>[7,9,11]</code> concatenated to a <code>2304-D</code> embedding) and learns only lightweight heads: a 1-layer view adapter, a 4-layer shape encoder, a 4-layer map adapter, and a <code>2304 → 512 → 256 → 3</code> deformation decoder. The design choice is to <em>adapt</em> a strong visual prior into geometry, not relearn vision.',
            'architecture.card2.title': 'Decoupled stages — why four scripts',
            'architecture.card2.body': 'Semantics, geometry, planning, and motion are deliberately separated: <code>step1_grounding.py</code> discovers objects, <code>step2_ram.py</code> estimates pose and functional priors, <code>step3_planning.py</code> decomposes the instruction into constraints, and <code>step4_conducting.py</code> emits waypoints. Each boundary is a file on disk, so a failure localizes to one stage instead of hiding inside an end-to-end net.',
            'interfaces.title': 'Data Contracts',
            'interfaces.cap': 'Each stage writes inspectable artifacts, which makes the pipeline debuggable without hidden state.',
            'interfaces.th.stage': 'Stage',
            'interfaces.th.inputs': 'Inputs',
            'interfaces.th.outputs': 'Outputs',
            'interfaces.th.note': 'Note',
            'training.title': 'Training Scheme by Design',
            'training.p1': 'The training-side design follows from the idea: if the runtime retrieves category templates, then training should teach RAMNet to <em>fit</em> a template to observed pixels, not to memorize instances. So supervision comes from BOP-style scenes rendered with BlenderProc (<code>--num-scenes 400</code>, <code>--views-per-scene 25</code>), and each category is pre-rendered into <code>128</code> template views stored as <code>obj_&lt;id&gt;.ply</code> plus <code>&lt;template_id&gt;.pkl</code> — a reusable geometric memory the network can index at inference.',
            'training.p2': '<code>train_bop.py</code> builds RAMNet from the DINOv2-B/14 checkpoint, <strong>freezes the foundation model</strong> (only non-<code>foundation_model</code> params are trainable), and optimizes a three-part objective that mirrors the three things the runtime needs: <code>PoseNCE</code> (view-contrastive, so retrieval picks the right viewpoint), <code>NOCSLoss</code> (dense object-coordinate regression, so geometry is metric), and <code>MatchLoss</code> (an entropy term that sharpens 2D-3D correspondence). Budget: <code>50</code> epochs, <code>2000</code> steps, batch size <code>4</code>, lr <code>1e-4</code>.',
            'training.p3': 'Templates are category-specific by design: <code>template.json</code> drives loading of <code>grasp_*</code>, <code>contact_point_*</code>, <code>hinge*</code>, and <code>plane_*</code> primitives, so what the runtime recovers is object-specific affordances (where to grasp, where it hinges, what surface supports it) rather than a generic bounding box.',
            'training.result': '<i class="fa-solid fa-layer-group"></i>Design consequence: this is structured geometry fitting, not end-to-end policy learning. Freezing the backbone keeps the visual prior intact while lightweight heads absorb category geometry — which is what makes single-image, zero-shot transfer to unseen instances plausible.',
            'runtime.title': 'Runtime and Control',
            'runtime.cap': 'The execution layer stays explicit all the way to robot motion.',
            'runtime.p1': 'Once geometry is explicit, motion should be boring and predictable — that is the design intent. <code>PathPlanner</code> runs a <code>100³</code> voxel costmap (<code>max_steps=300</code>, <code>stop_threshold=0.001</code>, <code>target_map_weight=2</code>, <code>obstacle_map_weight=1</code>, <code>pushing_skip_per_k=5</code>). <code>TrajectoryGenerator</code> converts voxels to base-frame poses, clamps Z to <code>table_height</code>, and emits waypoints carrying orientation and gripper state.',
            'runtime.p2': '<code>controller/fairino_arm.py</code> wraps the Fairino <code>Robot.RPC</code> interface, issuing <code>MoveL</code> at velocity <code>60</code>, <code>MoveC</code> at velocity <code>20</code>, plus gripper commands. Keeping this a conventional, inspectable motion layer — rather than a learned policy — means the intelligence lives in the object representation, and execution stays auditable and safe to clamp.',
            'runtime.p3': 'The four-script split pays off at debug time: camera calibration, VGGT depth rescaling, template lookup, and constraint parsing each fail in their own file, with their own artifact, so root-causing a bad grasp does not require unwinding the whole stack.',
            'results.title': 'What the Design Achieves',
            'results.p1': 'Attributed to the paper (Chen et al., <i>Science Robotics</i> 2026) and the CUHK release: the system was evaluated across <strong>14 manipulation tasks</strong> spanning <strong>31 objects</strong>, demonstrating zero-shot real-world execution, spatially aware manipulation from a single 2D image, and adaptive replanning under physical constraints such as object size and collision. The release also reports CO3D generalization to unseen categories and robustness to shape and occlusion variation.',
            'results.p2': 'I present these as the paper\'s reported outcomes, not as numbers I re-measured. Per-task success rates and baseline deltas are not disclosed in the publicly accessible article or repository, so I deliberately do not quote a headline percentage here — the contribution I claim is the system design and the training-side scheme, which I verified line-by-line against the code.',
            'results.limit': '<i class="fa-solid fa-triangle-exclamation"></i>Honest scope: a full run needs external assets that are not vendored — Grounded-SAM-2, VGGT, DINOv2-B/14, the Fairino SDK, and the RAM template payloads. The repo exposes the complete code path but no benchmark logbook, so any quantitative claim on this page traces to the publication, not to a local rollout.',
            'highlights.title': 'Design Decisions I Can Defend',
            'highlights.card1.title': 'Why retrieve, not learn end-to-end',
            'highlights.card1.body': 'Filtering categories with <code>RamVLM</code>, then boxing with GroundingDINO and masking with SAM2, means a new object is a <em>lookup</em>, not a new training run. The cost is a category template must exist; the payoff is single-image, zero-shot action.',
            'highlights.card2.title': 'Why freeze DINOv2 and learn geometry',
            'highlights.card2.body': 'RAMNet fuses frozen DINOv2 tokens with position embeddings, <code>choose</code> indices, and template priors to predict view, NOCS, grasps, and planes. Freezing the backbone is the choice that keeps a strong visual prior and limits training to the geometry heads.',
            'highlights.card3.title': 'Why keep motion deterministic',
            'highlights.card3.body': '<code>ConstraintParser</code> turns VLM subgoals into gripper poses; <code>PathPlanner</code> and <code>TrajectoryGenerator</code> turn those into Fairino motion. Putting the intelligence in the object representation, not the controller, keeps execution auditable and safe to clamp.',
            'fig.arch': 'RAM architecture diagram showing the GroundingDINO + SAM2, VGGT-1B, RAMNet, planner, and Fairino execution stack.',
            'fig.runtime': 'RAM runtime visualization with the four scripts and their inspectable file contracts.',
            footer: '&copy; <span id="year"></span> Yueyi Chen. Powered by <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a>.'
        },
        zh: {
            back: '返回主页',
            'hero.kicker': '个人项目 · 构想与设计',
            'hero.title': '检索增强式具身操作',
            'hero.venue': '物体中心操作 · 一套“检索优先”的系统设计',
            'hero.tagline': '面向未见物体的“检索优先”设计：先发现物体，再检索类别模板，重建物体中心的三维坐标系，最后把显式几何交给确定性的运动层执行。',
            'hero.links.code': '代码',
            'hero.links.paper': '论文',
            'hero.links.article': 'CUHK 文章',
            'hero.cite': '设计与管线整理：陈悦仪；构想基于 Chen 等人，<a href="https://doi.org/10.1126/scirobotics.aea2092" target="_blank" rel="noopener"><i>Science Robotics</i> 2026</a>（CUHK）。本页的定量结果均归属于该论文。',
            'm.k': '5',
            'm.kLabel': '每个物体的检索候选数（RAM-K）',
            'm.views': '128',
            'm.viewsLabel': '每个物体类别的模板视角数',
            'm.stages': '4',
            'm.stagesLabel': '解耦的运行阶段',
            'm.emb': '2304 维',
            'm.embLabel': '融合后的 DINOv2 特征 embedding',
            'overview.title': '核心构想',
            'overview.p1': '大多数操作策略试图端到端地学习“像素到力矩”的映射，这意味着每来一个新物体都是一个新的数据问题。这里的设计押注恰恰相反：把操作当成<strong>先检索、后运动</strong>。只要机器人能认出一个物体<em>是什么</em>，并从记忆里取出匹配的三维类别模板，它就能免费继承这个类别的抓取点、铰链和支撑面——于是一张未见实例的 RGB 图像就足以驱动动作。',
            'overview.p2': '这个押注逼出一条干净的边界：真正难的合约是<strong>物体表示</strong>，而不是机器人 SDK。设计被拆成四个解耦阶段——<code>step1_grounding</code> 在实时 RGB 帧中发现物体实例，<code>step2_ram</code> 把它抬升为显式的物体中心三维坐标系（视角 + NOCS + affordance），<code>step3_planning</code> 把几何转成 VLM 子目标，<code>step4_conducting</code> 再把子目标转成机器人轨迹点。因为几何是显式的、每个阶段都会写出可检查的产物，感知这半边可以完全不碰机械臂就调试。',
            'overview.scope': '<i class="fa-solid fa-user-pen"></i>我的角色：本页里我负责系统设计和训练侧管线——检索优先的分解方式、物体表示合约，以及 RAMNet 的训练方案（冻结 backbone、BOP 风格数据、模板先验、损失组合）。这个构想建立在师姐已发表的工作之上（Chen 等人，<i>Science Robotics</i> 2026），经授权在此复用；定量结果归属于该论文，而非本地重新跑出。',
            'overview.result': '<i class="fa-solid fa-bullhorn"></i>按论文所述，这套设计带来的收益：对未见物体的零样本真机执行、单张 2D 图像下的空间化操作，以及在物体尺寸和碰撞等物理约束下的自适应重规划。',
            'architecture.title': '架构',
            'architecture.cap': '这套设计复用了强大的现成感知（GroundingDINO + SAM2 负责发现、VGGT-1B 负责度量深度），只在最关键处投入自己训练的容量——RAMNet，即把 2D 特征与检索到的 3D 模板融合的模块。几何之后的一切都刻意保持确定性。',
            'architecture.card1.title': 'RAMNet 核心 —— 值得学习的押注',
            'architecture.card1.body': '唯一值得训练的模块。<code>visions/ram/lib/network.py</code> 让 DINOv2-B/14 保持<strong>冻结</strong>（从 <code>[7,9,11]</code> 三层取特征拼成 <code>2304 维</code> embedding），只学习轻量的 head：1 层 view adapter、4 层 shape encoder、4 层 map adapter，以及 <code>2304 → 512 → 256 → 3</code> 的 deformation decoder。设计取舍是把强视觉先验<em>适配</em>成几何，而不是重新学一遍视觉。',
            'architecture.card2.title': '解耦阶段 —— 为什么是四个脚本',
            'architecture.card2.body': '语义、几何、规划、运动被刻意分开：<code>step1_grounding.py</code> 发现物体，<code>step2_ram.py</code> 估计位姿和功能先验，<code>step3_planning.py</code> 把指令拆成约束，<code>step4_conducting.py</code> 产出轨迹点。每条边界都是硬盘上的一个文件，因此故障会定位到单个阶段，而不是藏在端到端网络里。',
            'interfaces.title': '数据合约',
            'interfaces.cap': '每个阶段都会写出可检查的中间产物，因此整条管线可以在没有隐藏状态的情况下调试。',
            'interfaces.th.stage': '阶段',
            'interfaces.th.inputs': '输入',
            'interfaces.th.outputs': '输出',
            'interfaces.th.note': '说明',
            'training.title': '训练方案的设计',
            'training.p1': '训练侧的设计直接从构想推导而来：既然运行时靠检索类别模板，那训练就应该教 RAMNet 去把模板<em>拟合</em>到观测像素上，而不是去背实例。因此监督来自 BlenderProc 渲染的 BOP 风格场景（<code>--num-scenes 400</code>、<code>--views-per-scene 25</code>），每个类别预渲染成 <code>128</code> 个模板视角，保存为 <code>obj_&lt;id&gt;.ply</code> 和 <code>&lt;template_id&gt;.pkl</code>——一份网络在推理时可以索引的、可复用的几何记忆。',
            'training.p2': '<code>train_bop.py</code> 用 DINOv2-B/14 checkpoint 初始化 RAMNet，<strong>冻结 foundation model</strong>（只有非 <code>foundation_model</code> 的参数可训练），并优化一个三段式目标，恰好对应运行时需要的三件事：<code>PoseNCE</code>（视角对比，让检索选对视角）、<code>NOCSLoss</code>（稠密物体坐标回归，让几何是度量的）和 <code>MatchLoss</code>（一个熵项，锐化 2D-3D 对应）。预算：<code>50</code> 个 epoch、<code>2000</code> 步、batch size <code>4</code>、学习率 <code>1e-4</code>。',
            'training.p3': '模板按类别设计：<code>template.json</code> 决定加载 <code>grasp_*</code>、<code>contact_point_*</code>、<code>hinge*</code> 和 <code>plane_*</code> primitives，因此运行时恢复的是物体特定的 affordance（在哪抓、在哪铰接、哪个面支撑），而不是一个通用包围盒。',
            'training.result': '<i class="fa-solid fa-layer-group"></i>设计后果：这是结构化几何拟合，而不是端到端策略学习。冻结 backbone 保住了视觉先验，同时让轻量 head 去吸收类别几何——正是这一点让单图、零样本迁移到未见实例变得可行。',
            'runtime.title': '运行与控制',
            'runtime.cap': '执行层一直保持显式，直到机器人运动为止。',
            'runtime.p1': '一旦几何变成显式，运动就应该无聊且可预测——这正是设计意图。<code>PathPlanner</code> 跑一个 <code>100³</code> 的 voxel 代价地图（<code>max_steps=300</code>、<code>stop_threshold=0.001</code>、<code>target_map_weight=2</code>、<code>obstacle_map_weight=1</code>、<code>pushing_skip_per_k=5</code>）。<code>TrajectoryGenerator</code> 把 voxel 转成 base-frame 位姿，把 Z 限制在 <code>table_height</code>，再输出带朝向和夹爪状态的 waypoint。',
            'runtime.p2': '<code>controller/fairino_arm.py</code> 封装 Fairino 的 <code>Robot.RPC</code> 接口，以速度 <code>60</code> 调 <code>MoveL</code>、以速度 <code>20</code> 调 <code>MoveC</code>，外加夹爪命令。把这里保持成传统、可检查的运动层——而不是学习出来的策略——意味着智能存在于物体表示里，执行则保持可审计、可安全钳制。',
            'runtime.p3': '四脚本拆分在调试时才显出价值：相机标定、VGGT 深度重标定、模板查找和约束解析各自在自己的文件里失败、各有自己的产物，所以排查一次坏抓取不需要把整条栈拆开。',
            'results.title': '这套设计达成了什么',
            'results.p1': '归属于论文（Chen 等人，<i>Science Robotics</i> 2026）和 CUHK 发布：该系统在 <strong>14 个操作任务</strong>、涵盖 <strong>31 个物体</strong>上评测，展示了零样本真机执行、单张 2D 图像下的空间化操作，以及在物体尺寸和碰撞等物理约束下的自适应重规划；发布还报告了 CO3D 上对未见类别的泛化，以及对形状和遮挡变化的鲁棒性。',
            'results.p2': '我把这些当成论文报告的结果来呈现，而不是我自己重新测出的数字。逐任务成功率和 baseline 差值在可公开访问的文章或仓库中并未披露，因此我刻意不在此处引用某个头条百分比——我主张的贡献是系统设计和训练侧方案，这两点我都对着代码逐行核对过。',
            'results.limit': '<i class="fa-solid fa-triangle-exclamation"></i>诚实的边界：完整跑一次需要仓库未附带的外部资产——Grounded-SAM-2、VGGT、DINOv2-B/14、Fairino SDK 和 RAM 模板 payload。仓库暴露了完整代码路径，但没有 benchmark 日志本身，所以本页任何定量说法都追溯到论文，而非本地一次 rollout。',
            'highlights.title': '我能扛住追问的设计取舍',
            'highlights.card1.title': '为什么检索，而不是端到端学习',
            'highlights.card1.body': '先用 <code>RamVLM</code> 筛类别，再用 GroundingDINO 框、SAM2 分割，意味着一个新物体是一次<em>查表</em>，而不是一次新训练。代价是必须存在对应的类别模板；回报是单图、零样本就能动作。',
            'highlights.card2.title': '为什么冻结 DINOv2 只学几何',
            'highlights.card2.body': 'RAMNet 把冻结的 DINOv2 token、position embedding、<code>choose</code> 索引和模板先验融合起来，预测 view、NOCS、grasp 和 plane。冻结 backbone 正是那个既保住强视觉先验、又把训练限制在几何 head 上的取舍。',
            'highlights.card3.title': '为什么让运动保持确定性',
            'highlights.card3.body': '<code>ConstraintParser</code> 把 VLM 子目标转成夹爪位姿；<code>PathPlanner</code> 和 <code>TrajectoryGenerator</code> 再把它们转成 Fairino 运动。把智能放在物体表示里、而不是控制器里，让执行保持可审计、可安全钳制。',
            'fig.arch': 'RAM 架构图，展示 GroundingDINO + SAM2、VGGT-1B、RAMNet、planner 和 Fairino 执行栈。',
            'fig.runtime': 'RAM 运行时图，展示四个脚本及其可检查文件合约。',
            footer: '&copy; <span id="year"></span> 陈悦仪. 基于 <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a> 搭建。'
        }
    };

    let currentLang = localStorage.getItem('lang') || 'en';

    function setLang(lang) {
        const dict = i18n[lang];
        if (!dict) return;

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] != null) el.textContent = dict[key];
        });

        document.querySelectorAll('[data-i18n-html]').forEach((el) => {
            const key = el.getAttribute('data-i18n-html');
            if (dict[key] != null) el.innerHTML = dict[key];
        });

        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        if (langToggle) langToggle.textContent = lang === 'zh' ? 'EN' : '中';
        localStorage.setItem('lang', lang);
        currentLang = lang;
    }

    setLang(currentLang);

    langToggle?.addEventListener('click', () => {
        setLang(currentLang === 'en' ? 'zh' : 'en');
    });
})();
