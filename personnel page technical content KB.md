# YUEYICHEN Technical Content KB: VLA / WBC / Embodied AI

Primary full-text reference: `/home/CNS2026391745/Documents/YUEYICHEN/private-kb`
HTML document root: `/home/CNS2026391745/Documents/YUEYICHEN/private-kb/public`
Source provenance: https://vla.yilong-zhu.com/
Authorized mirror snapshot: 2026-08-08 CST
Last manually synthesized: 2026-08-09
Purpose: this Markdown is the curated cross-model map, writing grammar, and rigor contract. Use the local `private-kb` mirror for complete model-specific text, diagrams, tables, formulas, and source-file references.

<!-- AUTO-SOURCE-START -->
Local reference status:
- Last indexed: 2026-08-09 02:10:54 CST
- Primary full-text reference: /home/CNS2026391745/Documents/YUEYICHEN/private-kb
- HTML document root: /home/CNS2026391745/Documents/YUEYICHEN/private-kb/public
- Source provenance: https://vla.yilong-zhu.com/
- Pages indexed: 20
- Combined digest: 77ef20c0c2e39555
- Local reference changed in last run: no
- Index mode: local authorized mirror; no network or Chrome session required
- Schedule: 17 9 * * 1 every Monday, local machine time

Latest local reference catalog:
| Page | Local full-text reference | Top-level outline | Anchors |
| --- | --- | --- | --- |
| Overview | `private-kb/public/index.html` | Robotics Knowledge Base; VLA 模型 14; Pi0; Pi0.5; Pi0-FAST | ACT, Decoupled WBC, DreamZero, FAST, Fast-WAM, Flow Matching, GEAR-SONIC, GR00T; 2B, 300M, 3B, 32 层, 4 层, 16 层, 500M, 29 DoF |
| Pi0 | `private-kb/public/01.Pi0_Architecture.html` | Pi0 (Physical Intelligence Zero) 模型架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 PaliGemma 视觉语言模型 (SigLIP + Gemma 2B); 2.2 Action Expert (Gemma 300M) | ACT, Flow Matching, Gemma, PaliGemma, Pi0, SigLIP; 2B, 300M, 2048维, 1024维, 18层, 18 层, 10 步, 1000 步 |
| Pi0.5 | `private-kb/public/02.Pi0.5_Architecture.html` | Pi0.5 模型架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 PaliGemma 视觉语言模型; SigLIP vs CLIP/GLIP 对比 | ACT, Flow Matching, Gemma, LeRobot, PaliGemma, Pi0, SigLIP; 300M, 2B, 18层, 10步, 10 步, 1024维, 18 层 |
| Pi0-FAST | `private-kb/public/03.Pi0-FAST_Architecture.html` | Pi0-FAST 模型架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 PaliGemma 视觉语言模型; 2.2 FAST 动作分词器 (Action Tokenizer) | FAST, Flow Matching, Gemma, PaliGemma, Pi0, SigLIP; 2B, 18 层, 10 步, 300M |
| π*₀.₆ (Pi-Star-0.6) | `private-kb/public/04.Pi-Star-0.6_Architecture.html` | π*₀.₆ (Pi-Star-0.6) 训练范式与数据; 1. 整体定位与论文出处; 2. 网络架构（简短一节）; 3. 训练范式：RECAP（核心）; 3.1 三个子过程 | ACT, FAST, Flow Matching, Gemma, PPO, PaliGemma, Pi-Star, Pi0; 2 小时, 4B, 860M, 50 Hz, 300M, 670M, 6.7B, 960 条 |
| π₀.₇ (Pi-0.7) | `private-kb/public/05.Pi0.7_Architecture.html` | π₀.₇ (Pi-0.7) 训练范式与数据; 1. 整体定位与论文出处; 2. 网络架构（简短一节）; 3. 训练范式：diverse context conditioning（核心）; 3.1 prompt 结构 | ACT, FAST, Flow Matching, PaliGemma, Pi-Star, Pi0, action expert; 14B, 5B, 4B, 860M, 400M, 6 帧, 1 s, 50 步 |
| Isaac-GR00T N1.6 | `private-kb/public/06.Isaac-GR00T-N1.6_Architecture.html` | Isaac GR00T N1.6 模型架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 Eagle Vision-Language Backbone; 2.2 Embodiment 条件化的状态/动作编码 | ACT, Diffusion, Flow Matching, GR00T, LeRobot, ONNX, Pi0, TensorRT; 3B, 2B, 32 层, 4 层, 4 步, 10 步, 27 Hz, 2 ms |
| Isaac-GR00T N1.5 | `private-kb/public/07.Isaac-GR00T-N1.5_Architecture.html` | Isaac GR00T N1.5 模型架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 Eagle 2 VLM Backbone (完全冻结); 2.2 Post-VLM 4 层 Transformer Adapter (N1.5 特有) | ACT, Flow Matching, GR00T, LeRobot, ONNX, TensorRT; 3B, 4 层, 16 层, 4 步, 2B, 32 层, 40GB |
| ACT | `private-kb/public/08.ACT_Architecture.html` | ACT (Action Chunking Transformer) 模型架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 ResNet18 视觉编码器; 2.2 VAE 编码器 (可选) | ACT, LeRobot; 4层, 1层, 1, B, 100 步 |
| SmolVLA | `private-kb/public/09.SmolVLA_Architecture.html` | SmolVLA 模型架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 SmolVLM2-500M 视觉语言模型; 2.2 Action Expert 网络（交叉注意力） | ACT, Flow Matching, GR00T, Pi0, SigLIP, SmolVLA; 500M, 16 层, 1.7B, 2B, 10 步, 4 步, 50 token, 50 步 |
| WALL-OSS / WALL-X | `private-kb/public/10.WALL-OSS_Architecture.html` | WALL-OSS (WALL-X) 模型架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 Qwen2.5-VL MoE 视觉语言骨干网络; 2.2 3D RoPE 位置编码 (时间-高度-宽度) | ACT, Diffusion, Flow Matching, GR00T, Qwen, WALL-OSS, WALL-X; 32 层, 31 层, 3, B |
| X-VLA | `private-kb/public/11.X-VLA_Architecture.html` | X-VLA 模型架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 Florence2 视觉语言模型 (Vision Tower + BART 编码器); 2.2 SoftPromptedTransformer (软提示 Transformer) | ACT, Diffusion, Flow Matching, GR00T, LeRobot, X-VLA; 32 tokens, 24层, 10步 |
| Psi0 (ψ₀) | `private-kb/public/12.Psi0_Architecture.html` | Ψ₀ (Psi-0) 模型架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 System-2:Qwen3-VL-2B-Instruct 主干; 2.2 System-1:VLATransformerBlock(SD3 风格 MMDiT) | ACT, Diffusion, DreamZero, FAST, Flow Matching, GR00T, LeRobot, MuJoCo; 2B, 500M, 6 层, 200K, 30K, 1000 步, 1536 维, 48K |
| DreamZero | `private-kb/public/13.DreamZero_Architecture.html` | DreamZero (WAM) 模型架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 感知编码器; 2.2 视频 VAE | DreamZero, Flow Matching, LeRobot, TensorRT; 1280 维, 4096 维, 0 token, 1 token, 40 层, 14B |
| Fast-WAM | `private-kb/public/14.FastWAM_Architecture.html` | Fast-WAM 模型架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 视频专家:Wan2.2-TI2V-5B DiT; 2.2 视频自注意力掩码: first_frame_causal | DreamZero, Fast-WAM, Flow Matching, LIBERO; 5B, 30 层, 33 帧, 0 步 |
| GR00T-WBC 总览 | `private-kb/public/15.GR00T-WBC_Overview.html` | GR00T-WholeBodyControl 总览; 1. 这个仓库是什么; 2. 两条控制路线的分野; 2.1 核心差异; 2.2 该选哪个 | DDS, Decoupled WBC, FSQ, GEAR-SONIC, GR00T, Isaac Lab, LeRobot, MotionBricks; 29 DoF, 43 DoF, 15,000 FPS, 2.5 Hz, 64 token, 20 Hz, 50 Hz, 64 维 |
| Decoupled WBC | `private-kb/public/16.Decoupled-WBC_Architecture.html` | Decoupled WBC 架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 解耦契约: G1DecoupledWholeBodyPolicy; 2.2 上下半身的唯一物理耦合:躯干相对腰部姿态 | ACT, DDS, Decoupled WBC, GEAR-SONIC, GR00T, Isaac Lab, LeRobot, MuJoCo; 50 Hz, 20 Hz, 3 步, 86 维, 6 帧, 15 维, 29 DoF, 200 Hz |
| GEAR-SONIC | `private-kb/public/17.GEAR-SONIC_Architecture.html` | GEAR-SONIC 架构; 1. 整体架构概览; 2. 核心组件详解; 2.1 Universal Token:64 维从哪来; 2.2 三个编码器 | Decoupled WBC, FSQ, GEAR-SONIC, GR00T, Isaac Lab, LeRobot, MotionBricks, MuJoCo; 64 维, 50 Hz, 2.5 Hz, 10 帧, 0.1 s, 0.02 s, 2 token, 32 维 |
| MotionBricks | `private-kb/public/18.MotionBricks_Architecture.html` | MotionBricks 架构; 1. 整体架构概览; 2. 运动表征; 2.1 DualRootGlobalJoints on G1Skeleton34; 2.2 没有固定朝向规范化 | Decoupled WBC, GEAR-SONIC, GR00T, MotionBricks, MuJoCo, ONNX, VQVAE; 15,000 FPS, 3 层, 16 层, 418 维, 36 维, 29 DoF, 200,000 步, 1.0 s |
| VLM³ | `private-kb/public/19.VLM3_Architecture.html` | VLM³ 方法架构; 1. 核心主张; 2. 方法:只有两个技巧; 2.1 焦距归一化:解决相机歧义; 2.2 文本化坐标:解决指代问题 | FAST, GR00T, VLM3, VLM³, action expert; 4B |

Refresh behavior: the weekly job indexes `private-kb/public`, updates only this auto-managed block, and preserves the manually synthesized writing guide below. Refresh the authorized mirror separately before indexing when the upstream KB changes.
<!-- AUTO-SOURCE-END -->

## 0. Two-Layer Reference Contract

The technical KB has two complementary layers:

| Layer | Path | Responsibility |
| --- | --- | --- |
| Full-text reference | `private-kb/public/` | Authorized 20-page HTML mirror: overview plus 19 VLA, WBC, motion-generation, and 3D-VLM documents, including full diagrams, formulas, tables, hyperparameters, and source-file notes. |
| Curated synthesis | `personnel page technical content KB.md` | Cross-model taxonomy, writing grammar, technical-rigor rules, project-specific translation guidance, terminology, and publishing checks. |

Usage rules:

1. Read this Markdown in full before project-related technical writing.
2. Read the matching page under `private-kb/public/` before making a model-specific architecture, training, inference, rate, dimension, or benchmark claim.
3. For architecture comparisons, read every compared model page rather than relying on the catalog row.
4. For full project deep-mining, treat all 20 HTML pages as the complete KB reference corpus.
5. The auto-managed catalog is an index, not a substitute for the full HTML documents.

## 1. Coverage Shift

This file should no longer be WBC-only. Treat the knowledge base as a full embodied-AI technical map with three layers:

1. VLA model architectures: Pi0, Pi0.5, Pi0-FAST, Pi-Star-0.6, Pi0.7, Isaac-GR00T N1.5/N1.6, ACT, SmolVLA, WALL-OSS/WALL-X, X-VLA, Psi0, DreamZero, Fast-WAM.
2. Whole-body control and motion generation: GR00T-WBC overview, Decoupled WBC, GEAR-SONIC, MotionBricks.
3. 3D vision and VLM interfaces: VLM3.

Use the authorized local mirror as the full technical and style reference. The target is a technically accountable personal research page: compact enough for a portfolio, but precise enough that a robotics/VLA reader can reconstruct the pipeline.

## 2. Full-KB Writing Signature

The knowledge base has a consistent document grammar:

1. Overall architecture first.
2. Core components second.
3. Training pipeline third.
4. Inference/deployment pipeline fourth.
5. Hyperparameter and source-file tables last.
6. For data-centric papers, add data composition, task setup, and result/ablation sections.
7. For WBC/control pages, add control frequency, coordinate conventions, robot interface, deployment, and configuration tables.
8. For 3D/VLM pages, add task interface definitions and input-output formatting.

Adopt that grammar for YUEYICHEN pages. Do not write project descriptions as a list of buzzwords. Write them as compact architecture notes with interfaces, numbers, and decisions.

## 3. Model-Family Map

| Family | Pages | What to learn for YUEYICHEN writing |
| --- | --- | --- |
| Flow-matching VLA | Pi0, Pi0.5, Isaac-GR00T N1.5/N1.6, SmolVLA, X-VLA, Psi0 | Explain action generation as a denoising or flow process with time conditioning, action horizon, and chunk decoding. |
| Token/action discretization | Pi0-FAST, WALL-OSS fast mode, GEAR-SONIC token interface | Separate discrete action-token prediction from continuous control execution. State tokenizer role and runtime tradeoff. |
| Context/data scaling | Pi-Star-0.6, Pi0.7 | Explain training paradigm, heterogeneous data, prompt/context conditioning, and ablations instead of only model topology. |
| Video/action world models | DreamZero, Fast-WAM | Explain how visual latent modeling connects to action prediction, caching, attention masks, and distributed inference. |
| Classical imitation baseline | ACT | Use as a reference for action chunking, visual encoder, transformer decoder, and temporal aggregation. |
| Whole-body control | GR00T-WBC, Decoupled WBC, GEAR-SONIC, MotionBricks | Treat VLA output as an interface into a lower-level controller. Specify control rate, DoF, qpos/action layout, IK/RL split, and safety assumptions. |
| 3D VLM | VLM3 | Make camera geometry, coordinate textification, depth/object/correspondence/pose tasks explicit. |

## 4. Technical Rigor Standard

A good embodied-AI project note should answer these questions:

| Question | Required answer style |
| --- | --- |
| What problem does this own? | Define the boundary: data collection, fine-tuning, inference, control, perception, or deployment. |
| What model stack is used? | Name the backbone, action head, tokenizer/diffusion head, controller, and runtime service. |
| What crosses module boundaries? | State image streams, language instruction, robot state, action vector, token shape, qpos layout, or metadata schema. |
| What runs at what rate? | Use Hz, chunk length, horizon, latency, or FPS. Separate policy rate from controller rate. |
| What was trained? | Name trainable modules, frozen modules, LoRA scope, loss/reward, optimizer, environment count, or checkpoint step. |
| What was measured? | State benchmark, tasks, episode count, success definition, baseline delta, and ablation. |
| What was hard? | Surface schema bugs, normalization bugs, frame/order mismatches, evaluation leakage, deployment latency, or safety failures. |
| What remains unproven? | Separate simulation success, benchmark success, and real-robot transfer. |

Target rigor: reproduction-level for detail pages, decision-level for homepage cards.

## 5. Reusable Page Structure

Use this skeleton when writing a long technical page:

1. Overview
   - System definition.
   - Target platform.
   - Main technical risk.
   - Final outcome.

2. Architecture
   - Backbone/perception.
   - Representation/action head.
   - Policy/control layer.
   - Runtime/deployment layer.

3. Interface Contracts
   - Observation schema.
   - Action schema.
   - Timing and frequency.
   - Coordinate convention.
   - Dataset format.

4. Training Or Adaptation
   - Frozen vs trainable modules.
   - Data source and preprocessing.
   - Loss/reward or diffusion objective.
   - Hyperparameters that changed the result.

5. Inference And Deployment
   - Server/process topology.
   - Action chunking or receding horizon.
   - Safety clamps and recovery.
   - Logging/visualization.

6. Evaluation
   - Benchmark/task suite.
   - Episode count.
   - Baseline comparison.
   - Ablation and failure analysis.

7. Reproducibility Notes
   - Checkpoint.
   - Config file.
   - Script entry point.
   - Known caveats.

## 6. Homepage Card Standard

Homepage cards should be dense but readable. Use 4-7 sentences:

1. Sentence 1: what the project is and target platform.
2. Sentence 2: the architecture route or pipeline.
3. Sentence 3: the most important interface detail.
4. Sentence 4: the key engineering fix or design choice.
5. Sentence 5: measured result with scope.
6. Optional sentence: limitation or deployment status.

Avoid:
- "Built an advanced robot system."
- "Improved robustness."
- "Used multimodal AI."

Prefer:
- "Fine-tuned pi0.5 on LIBERO with LoRA over a freeze-filter matrix; fixed action-expert leakage and norm_stats reuse before 2000-episode evaluation."
- "Converted LeRobot demonstrations into a GEAR-style schema with aligned RGB/state/action/timestamp/language fields before DreamZero-style LoRA SFT."

## 7. Project-Specific Guidance For YUEYICHEN

### pi0.5 VLA Fine-Tuning on LIBERO

Use the Pi0/Pi0.5/GR00T family style:
- Define the VLA backbone and action-generation objective.
- Explain action normalization and checkpoint/eval contract before reporting results.
- Make the freeze-filter matrix a table.
- Separate baseline comparison from implementation fixes.
- State what was not evaluated, especially real-robot transfer if absent.

Suggested sections:
- Model and benchmark boundary
- Data/action normalization
- LoRA/freeze strategy
- Training setup
- Evaluation protocol
- Failure fixes
- Result table
- Reproducibility notes

### ALOHA / LeKiwi DreamZero Reproduction

Use the DreamZero/Fast-WAM/LeRobot style:
- Treat the project as a data-contract problem and an inference-contract problem.
- Lead with LeRobot collection, schema conversion, embodiment registration, SFT, and WebSocket inference.
- Explain camera order, timestamp alignment, gripper normalization, and receding-horizon execution.
- Clarify that rollout videos are qualitative unless backed by synchronized state/action trajectories.

Suggested sections:
- Hardware and camera layout
- Demonstration schema
- LeRobot-to-GEAR conversion
- Embodiment config
- LoRA SFT protocol
- Inference server and safety adapter
- Rollout inspection

### PLAN-B Multimodal Perception And Grasping

Use the VLM3 + WBC control-flow style:
- Split ASR/VAD, NLU, VLM, SAM3 segmentation, depth perception, grasp decision, and FSM execution.
- For each module, state input, output, latency, confidence or fallback path.
- Show the FSM as a transition table.
- Root-cause diagnosis should be written as evidence, not a story.

Suggested sections:
- System boundary
- Perception pipeline
- NLU/VLM decision contract
- Segmentation and 3D grasp verification
- FSM guards
- Latency budget
- Failure diagnosis
- Field-test metrics

### PLAN-A Multimodal Interaction And Policy Routes

Use the model-variant comparison style:
- Present Text-to-Action CVAE and image-conditioned diffusion as two policy routes.
- For CVAE: language encoder, latent dimension, decoder structure, stopping rule.
- For diffusion: visual condition encoder, cross-attention, scheduler/steps, training acceleration.
- Retargeting and calibration should be a separate interface contract.
- Execution should list protocol, actuator update rate, concurrency isolation, and validation episodes.

Suggested sections:
- Perception and state mapping
- Retargeting calibration
- Text policy route
- Image-conditioned diffusion route
- Execution runtime
- Data quality diagnosis
- Closed-loop validation

## 8. Terminology Rules

Keep these terms stable in English/code form:
- VLA, VLM, WBC, IK, RL, PPO, DiT, Flow Matching, action chunk, action expert, tokenizer, qpos, proprioception, embodiment, rollout, policy server.
- Model names: Pi0, Pi0.5, Pi0-FAST, Pi-Star, Pi0.7, Isaac-GR00T, ACT, SmolVLA, WALL-OSS/WALL-X, X-VLA, Psi0, DreamZero, Fast-WAM, GEAR-SONIC, MotionBricks, VLM3.
- Data/runtime names: LeRobot, LIBERO, MuJoCo, Isaac Lab, ONNX, TensorRT, WebSocket, DDS, ROS2.

Use Chinese for explanation and judgment. Use tables for contracts and comparisons.

## 9. Publishing Checklist

Before publishing or rewriting a project page, verify:

- The first paragraph defines the system boundary.
- The architecture is split into modules or layers.
- Observation/action/data contracts are visible.
- Dimensions, frequencies, horizon, and latency are stated where known.
- Training scope is separated from inference/deployment scope.
- Results include evaluation count and baseline.
- Failure modes and fixes are described concretely.
- Private implementation details are omitted unless safe and necessary.
- At least one table or diagram helps reconstruct the system.
- Limitations are stated when a result is benchmark-only or simulation-only.

## 10. Automatic Update Behavior

The weekly updater should index the complete authorized mirror under `private-kb/public`, not fetch the remote site directly. It should update the auto-managed block at the top of this file with:

- last indexed time
- page count
- combined source digest
- per-page local reference path and catalog
- top-level technical anchors

It should preserve the manually synthesized writing guide below the auto-managed block. If the local mirror is missing, incomplete, or does not contain exactly 20 pages, the script must leave this file unchanged and log the failure. Refresh `private-kb` separately when the authorized upstream source changes, then rerun the indexer.
