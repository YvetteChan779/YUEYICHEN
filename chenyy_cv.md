# Chen Yueyi CV Bullets - Affective Robot Interaction: A Multimodal System for Companion Robots

Source gate: `Project Mining Protocol.md`, `personnel page technical content KB.md`, Affective Robot Interaction source files, result tables, and readable excellent CV references were inspected before writing these bullets.

## Excellent CV Grammar Extracted

Reference pattern from `excellent cv/gl_cv_bullet_version.txt`, `excellent cv/lfy_cv_bullet.txt`, and `excellent cv/分层碰撞机制_末端姿态对.txt`:

| Grammar rule | Migration rule for Affective Robot Interaction |
| --- | --- |
| Start with ownership verbs such as `Led`, `Architected`, `Engineered`, `Calibrated`, `Optimized`, or `Validated`. | Use `Architected`, `Engineered`, and `Calibrated` because source evidence shows integration, model implementation, and calibration work. |
| Name the model stack early, not as a vague domain label. | Say `Qwen2.5-VL/OpenCV`, `Text-to-Action CVAE`, `image-conditioned Diffusion Policy`, `VDMocap`, `WebSocket + Dynamixel`. |
| Put mechanism before metric. | Describe interface contracts and training routes before 194 episodes, 535.95 val loss, 10 FPS, or Qwen-cache speedup. |
| Qualify metrics by scope. | Mark classification accuracy as a sanity check; mark Teleop MAE as retargeting support; do not claim CVAE-vs-DP real-robot success. |
| Avoid weak verbs and generic AI phrases. | Do not use `worked on`, `used multimodal AI`, `state-of-the-art`, `robust system`, or `VLA`. |

## Final English Resume Bullets

1. Architected Affective Robot Interaction, a social-robot multimodal interaction stack that routes Qwen2.5-VL/OpenCV perception and VDMocap inputs into Text-to-Action CVAE / image-conditioned Diffusion Policy branches, then streams 10D WebSocket + Dynamixel encoder trajectories at 10 FPS with a non-blocking execution lock over 194 three-class reaction episodes.

中文解释：这条是系统架构 ownership bullet，先定义 Affective Robot Interaction 的边界，再把 perception、policy、execution 三层接口串起来，最后用 194 episodes、10D、10 FPS 和 execution lock 做证据锚点。`Architected` 是轻微 overclaim，但可以防守，因为证据覆盖了多模块集成、执行链路和页面级架构重画。

Predicted interviewer follow-up: What exactly crosses the boundary between the policy and robot runtime, and how do you prevent overlapping robot commands?

Evidence:
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/docs/PLAN-A_云文档.md:10-30`
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/docs/assets/tables/t2_dataset_stats.csv:1-4`
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/text_to_action_cvae/websocket_text_to_action.py:30-75,138-157,339-421`

Risk boundary: Do not claim a controlled real-robot task-success benchmark; the defensible claim is integrated robot execution path plus documented module metrics.

2. Engineered the report Text-to-Action CVAE route with BERT-base-chinese CLS projection, 64D latent conditioning, a 2-layer / 4-head Transformer Decoder, and MSE + KL + CE training, reaching 535.95 best validation loss in a 50-epoch RTX 4090 run while keeping the 100% category accuracy framed as a label sanity check.

中文解释：这条是模型实现 bullet，语法模仿优秀简历里“模型名 + 训练机制 + 指标 + 限定语”的写法。它只写报告版 3 类 CVAE，不把 8 类主代码路径混进同一个结果里；100% 分类准确率明确降级为 sanity check，避免被问穿。

Predicted interviewer follow-up: Why is the classification accuracy not a strong semantic understanding metric, and what actually dominates the CVAE loss?

Evidence:
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/docs/scripts/01_train_cvae.py:29-95`
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/text_to_action_cvae/models/model_text_action_vae_transformer.py:48-164,166-223`
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/docs/assets/tables/t5_training_summary.csv:1-14`
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/docs/PLAN-A_云文档.md:260-281`

Risk boundary: Keep this as the report CVAE route; the main 8-category route has different latent/hidden/layer settings and should not inherit the 535.95 metric.

3. Calibrated the actuator-facing motion interface by mapping VDMocap 23-node pose/quaternion streams to `[0,4095]` 10D encoder commands with T-pose 2048 +/- 3 zeroing, while optimizing the heavier DP route through cached Qwen 256D condition tokens that reduced documented training cost from about 3 h/epoch to about 20 min/epoch.

中文解释：这条把硬件接口和 DP 训练优化合并为一条工程深度 bullet：前半句强调 retargeting 的执行器合约，后半句强调 Qwen cache 的算力 trade-off。它没有声称 DP 真机成功率，只声称训练成本下降和接口标定结果。

Predicted interviewer follow-up: How did T-pose zeroing convert global mocap rotations into robot encoder commands, and how does cached Qwen conditioning enter the DP forward path?

Evidence:
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/retargeting/vd_mocap_listener_struct.py:28-110`
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/retargeting/校准流程说明.md:52-104`
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/retargeting/calibrate_all_joints.py:215-298,623-633`
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/text_to_action_diffusion/dataset_qwen_episode.py:23-78,112-176`
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/text_to_action_diffusion/models/image_conditioned_dp_dynamic.py:287-459`
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/text_to_action_diffusion/diffusion_wrapper.py:94-145,307-391`
- `/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction/docs/PLAN-A_云文档.md:340-373,407-421`

Risk boundary: This bullet combines two engineering contributions; if a shorter CV is required, split into one retargeting bullet and one DP cache bullet. Do not add Teleop Transformer MAE here unless the resume section explicitly includes retargeting support experiments.
