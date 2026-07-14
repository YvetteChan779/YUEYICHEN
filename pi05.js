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
            'hero.title': 'pi0.5 VLA Fine-Tuning on LIBERO Benchmark',
            'hero.venue': 'Embodied AI / VLA Fine-Tuning Project',
            'hero.tagline': "Single-GPU LoRA adaptation of Physical Intelligence's pi0.5 VLA model with reproducible LIBERO evaluation.",
            'hero.results': 'Results',
            'hero.arch': 'Architecture',
            'hero.engineering': 'Engineering',
            'hero.report': 'Report',
            'hero.code': 'Code',
            'm.mean': 'Mean success rate',
            'm.official': 'vs. official pi0.5 LIBERO',
            'm.episodes': 'Evaluation episodes',
            'm.gpu': 'Low-memory LoRA training',
            's0.title': 'Overview',
            's0.p1': "This project migrates Physical Intelligence's <strong>pi0.5 Vision-Language-Action model</strong> to the LIBERO simulation benchmark under a 24 GB single-GPU budget. I used LoRA fine-tuning from <code>pi05_base</code>, built a freeze-filter strategy matrix, and completed a reproducible evaluation path across the four LIBERO suites.",
            's0.c1': '<strong>Algorithm:</strong> designed three freeze-filter strategies covering about 2.6M, 18M, and 305M trainable parameters.',
            's0.c2': '<strong>Training:</strong> ran full-model LoRA on a single RTX 4090 with batch 16, peak LR 5e-5, 10k warmup, and no EMA shadow copy.',
            's0.c3': '<strong>Evaluation:</strong> served checkpoints through WebSocket and evaluated 4 suites x 10 tasks x 50 trials, with checkpoint-aware logs and videos.',
            's0.c4': '<strong>Result:</strong> selected the 55k-step LoRA checkpoint, reaching 96.6 / 98.8 / 92.6 / 88.8 success across Spatial, Object, Goal, and Long-10.',
            's0.scope': 'All success rates on this page are from the 50-trials-per-task protocol unless explicitly marked otherwise; the weighted mean uses <strong>2000 total episodes</strong>.',
            's1.title': 'Model and Fine-Tuning Design',
            's1.p1': 'The pi0.5 policy keeps the visual-language backbone and adapts the continuous action path: a PaliGemma-style visual-language stack feeds a Gemma-300M Action Expert and a Flow Matching action head. The LIBERO adaptation focuses on LoRA placement, trainable-parameter scope, and action/state normalization.',
            's1.cap1': 'pi0.5 architecture and project entry points: LoRA adaptation, action expert, Flow Matching action head, and LIBERO serve/eval path.',
            's1.cap2': 'Freeze-filter strategy matrix: action-expert LoRA, full-model LoRA, and action-head full fine-tuning under the 24 GB budget.',
            's1.p2': 'The key implementation detail is that <code>freeze_filter</code> marks parameters to freeze, so the action-expert LoRA intersection must be negated. This reduced an accidental large trainable set to the intended action-expert adapter parameters.',
            's2.title': 'LIBERO Results',
            's2.p1': 'The final checkpoint is <strong>Full LoRA at 55k steps</strong>. It improves the official pi0.5 LIBERO baseline by 2.0 percentage points and the OpenVLA-7B baseline by 18.2 percentage points, with the largest practical gain on the long-horizon suite.',
            's2.th.suite': 'Suite',
            's2.row.ours': 'Ours, Full LoRA 55k',
            's2.cap1': 'Method comparison: the 55k-step LoRA checkpoint leads the public baselines across all four suites.',
            's2.cap2': 'Fine-tuning variants: head-only LoRA is memory-light but saturates far below full-model LoRA.',
            's3.title': 'Training Dynamics and Checkpoint Choice',
            's3.p1': 'The Flow Matching MSE drops quickly in the first 10k steps and stabilizes near 0.018 by 50k steps. The scaling curve shows that most suites converge by 20k-30k, while Long-10 continues improving until the 55k checkpoint.',
            's3.cap1': 'Training loss: smooth convergence without large spikes or plateau collapse.',
            's3.cap2': 'Scaling curve: 55k steps is the selected ROI point, especially for Long-10.',
            's4.title': 'Engineering and Reproducibility',
            's4.p1': 'The project was built as a reproducible benchmark pipeline, not just a one-off run. The evaluation scripts serve one checkpoint, loop all four LIBERO suites, preserve checkpoint metadata, and archive logs/videos under timestamped directories.',
            's4.h1.title': '24 GB Training Budget',
            's4.h1.desc': 'Batch 16, LoRA adapters, disabled EMA, and XLA memory fraction tuning make pi0.5 adaptation runnable on a single RTX 4090.',
            's4.h2.title': 'Freeze-Filter Audit',
            's4.h2.desc': 'Regular-expression filters separate backbone, action expert, LoRA adapters, and action head for controlled ablation.',
            's4.h3.title': 'Serve/Eval Metadata',
            's4.h3.desc': 'WebSocket metadata carries policy config and checkpoint path so client-side logs and rollout videos are checkpoint-aware.',
            's4.h4.title': 'One-Run Archiving',
            's4.h4.desc': 'A shared run id groups Spatial, Object, Goal, and Long-10 logs, making 2000-episode evaluation auditable.',
            's5.title': 'Debug Cases',
            's5.h1.title': 'LoRA Leakage',
            's5.h1.desc': 'The default config left too many backbone parameters trainable when only the action expert used LoRA; a custom filter isolated action-expert adapters.',
            's5.h2.title': 'OOM on Full Fine-Tuning',
            's5.h2.desc': 'Full-parameter pi0.5 fine-tuning was infeasible on 24 GB, so the run was redesigned around low-rank adapters and smaller batches.',
            's5.h3.title': 'Missing norm_stats',
            's5.h3.desc': 'The base checkpoint lacked LIBERO normalization statistics; reusing official LIBERO assets made zero-shot and fine-tuned evaluation comparable.',
            's5.h4.title': 'Overwritten Videos',
            's5.h4.desc': 'Flat video directories caused rollout collisions; checkpoint and timestamp based paths fixed multi-suite evaluation tracking.',
            's6.title': 'Interview-Ready Technical Points',
            's6.h1.title': 'VLA Adaptation',
            's6.h1.desc': 'Explain how visual-language representations, action expert parameters, and continuous Flow Matching action prediction interact.',
            's6.h2.title': 'Ablation Logic',
            's6.h2.desc': 'The 2.6M -> 18M -> 305M matrix turns memory constraints into a controlled experimental variable.',
            's6.h3.title': 'Checkpoint Selection',
            's6.h3.desc': 'Use suite-level scaling curves to justify 55k steps rather than selecting only by final loss.',
            's6.h4.title': 'Reproducible Evaluation',
            's6.h4.desc': 'A benchmark claim is credible only when checkpoint, suite, trial count, logs, and videos can be traced together.',
            'footer': footerEn
        },
        zh: {
            'back': '返回主页',
            'hero.title': 'π0.5 VLA 模型在 LIBERO 基准上的微调',
            'hero.venue': '具身智能 / VLA 微调项目',
            'hero.tagline': '在单卡 RTX 4090 上用 LoRA 迁移 Physical Intelligence 的 π0.5 VLA 模型，并完成可复现 LIBERO 评测。',
            'hero.results': '实验结果',
            'hero.arch': '模型架构',
            'hero.engineering': '工程化',
            'hero.report': '报告',
            'hero.code': '代码',
            'm.mean': '平均成功率',
            'm.official': '相对官方 π0.5 LIBERO',
            'm.episodes': '评测 episodes',
            'm.gpu': '低显存 LoRA 训练',
            's0.title': '项目概述',
            's0.p1': '本项目在 24 GB 单卡显存约束下，把 Physical Intelligence 的 <strong>π0.5 视觉-语言-动作模型</strong>迁移到 LIBERO 仿真基准。项目从 <code>pi05_base</code> 出发做 LoRA 微调，构建 freeze-filter 策略矩阵，并打通四个 LIBERO suite 的可复现评测链路。',
            's0.c1': '<strong>算法：</strong>设计 3 套 freeze-filter 策略，覆盖约 2.6M、18M、305M 可训参数。',
            's0.c2': '<strong>训练：</strong>在单张 RTX 4090 上跑通 full-model LoRA，batch 16，peak LR 5e-5，10k warmup，并关闭 EMA 影子参数。',
            's0.c3': '<strong>评测：</strong>通过 WebSocket serve checkpoint，完成 4 suite x 10 task x 50 trial，并按 checkpoint 归档日志与视频。',
            's0.c4': '<strong>结果：</strong>最终采用 55k step LoRA checkpoint，在 Spatial、Object、Goal、Long-10 上分别达到 96.6 / 98.8 / 92.6 / 88.8 成功率。',
            's0.scope': '本页成功率默认来自 50 trials/task 协议；加权平均基于 <strong>2000 个 evaluation episodes</strong>。',
            's1.title': '模型与微调设计',
            's1.p1': 'π0.5 policy 保留视觉-语言骨干，并重点适配连续动作路径：PaliGemma 风格视觉语言栈接入 Gemma-300M Action Expert 与 Flow Matching 动作头。LIBERO 迁移的关键在于 LoRA 放置、可训参数范围与 action/state 归一化。',
            's1.cap1': 'π0.5 架构与项目接入点：LoRA 适配、action expert、Flow Matching 动作头，以及 LIBERO serve/eval 路径。',
            's1.cap2': 'Freeze-filter 策略矩阵：action-expert LoRA、full-model LoRA 与 action-head full fine-tuning，均围绕 24 GB 显存预算设计。',
            's1.p2': '关键实现细节是 <code>freeze_filter</code> 表示“需要冻结的参数”，因此 action-expert LoRA 的交集需要取反。这个修正把误开放的大量可训参数收敛到预期的 action-expert adapter。',
            's2.title': 'LIBERO 主结果',
            's2.p1': '最终 checkpoint 为 <strong>55k step Full LoRA</strong>。相对官方 pi0.5 LIBERO baseline 提升 2.0 个百分点，相对 OpenVLA-7B baseline 提升 18.2 个百分点，其中 long-horizon suite 的实际收益最明显。',
            's2.th.suite': 'Suite',
            's2.row.ours': 'Ours, Full LoRA 55k',
            's2.cap1': '方法对比：55k-step LoRA checkpoint 在四个 suite 上均优于公开基线。',
            's2.cap2': '微调变体：head-only LoRA 显存友好，但上限明显低于 full-model LoRA。',
            's3.title': '训练动态与 Checkpoint 选择',
            's3.p1': 'Flow Matching MSE 在前 10k step 快速下降，并在 50k step 附近稳定到 0.018 量级。Scaling 曲线显示大部分 suite 在 20k-30k 收敛，而 Long-10 到 55k step 仍有收益。',
            's3.cap1': '训练 loss：平滑收敛，无明显 spike 或 plateau collapse。',
            's3.cap2': 'Scaling 曲线：55k step 是最终采用的 ROI 点，尤其照顾 Long-10 收益。',
            's4.title': '工程化与可复现',
            's4.p1': '项目不是一次性跑分，而是可复现 benchmark 管线。评测脚本会 serve 指定 checkpoint，循环四个 LIBERO suite，保留 checkpoint metadata，并按时间戳归档日志与视频。',
            's4.h1.title': '24 GB 训练预算',
            's4.h1.desc': '通过 batch 16、LoRA adapter、关闭 EMA 与 XLA 显存预分配配置，让 π0.5 能在单张 RTX 4090 上完成迁移。',
            's4.h2.title': 'Freeze-Filter 审计',
            's4.h2.desc': '用正则 filter 区分 backbone、action expert、LoRA adapter 与 action head，使消融实验受控。',
            's4.h3.title': 'Serve/Eval 元信息',
            's4.h3.desc': 'WebSocket metadata 透传 policy config 与 checkpoint path，使客户端日志和 rollout 视频能追溯到具体 checkpoint。',
            's4.h4.title': '单次评测归档',
            's4.h4.desc': '共享 run id 把 Spatial、Object、Goal、Long-10 的日志串成同一批次，让 2000-episode 评测可审计。',
            's5.title': 'Debug 难点',
            's5.h1.title': 'LoRA 漏冻',
            's5.h1.desc': '默认配置在只给 action expert 开 LoRA 时仍误开放过多 backbone 参数；自定义 filter 将训练范围收敛到 action-expert adapter。',
            's5.h2.title': '全参微调 OOM',
            's5.h2.desc': '24 GB 显存无法承载 π0.5 全参微调，因此重构为低秩 adapter 与小 batch 训练。',
            's5.h3.title': '缺失 norm_stats',
            's5.h3.desc': 'base checkpoint 没有 LIBERO 归一化统计量；复用官方 LIBERO assets 后，zero-shot 与微调模型才能进入同一评测协议。',
            's5.h4.title': '视频互相覆盖',
            's5.h4.desc': '原平铺视频目录会导致 rollout 文件冲突；按 checkpoint 与时间戳分层后，多 suite 评测可以稳定追踪。',
            's6.title': '面试可讲技术点',
            's6.h1.title': 'VLA 迁移',
            's6.h1.desc': '解释视觉语言表征、action expert 参数和连续 Flow Matching 动作预测如何协同。',
            's6.h2.title': '消融逻辑',
            's6.h2.desc': '2.6M -> 18M -> 305M 的策略矩阵把显存限制转化为可控实验变量。',
            's6.h3.title': 'Checkpoint 选择',
            's6.h3.desc': '用 suite-level scaling 曲线解释为什么选择 55k step，而不是只看最终 loss。',
            's6.h4.title': '可复现评测',
            's6.h4.desc': '一个 benchmark claim 是否可信，取决于 checkpoint、suite、trial 数、日志和视频能否一起追溯。',
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
