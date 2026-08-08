# PLAN-A PROJECT.md

Generated for `/home/CNS2026391745/Documents/YUEYICHEN`.

Target project:
`/home/CNS2026391745/Documents/PLAN-A-CYY/RBS-Software-Interaction`

Target outputs:
- `PROJECT.md`
- PLAN-A homepage project page: `plana.html` plus homepage card in `index.html` / `script.js`
- 3 English resume bullets in `chenyy_cv.md`

## 0. Protocol Gates

Status:
- `AGENTS.md`: active project contract.
- `Project Mining Protocol.md`: read before writing public copy.
- `personnel page technical content KB.md`: read before writing technical claims.
- Excellent CV references: readable `.txt` files inspected before writing resume bullets.
- Target project source/docs/config/results: main docs, CVAE, DP, Qwen/OpenCV, retargeting, ROS2 IK, data recording, and result tables inspected.

Important publication boundary:
- PLAN-A is not a VLA or Flow-Matching policy project.
- Defensible wording: multimodal perception, Text-to-Action CVAE, image-conditioned Diffusion Policy, calibrated 10D encoder execution.
- The 3-class report route and the 8-class CVAE code path must stay separate.
- Teleop Transformer MAE is retargeting support evidence, not full PLAN-A task success.
- DP has architecture and training-interface evidence; no controlled real-robot CVAE-vs-DP task-success benchmark was found.

## 1. Read Coverage

| Area | Files read | Why it matters | Gap |
| --- | --- | --- | --- |
| Homepage contract | `AGENTS.md`, `Project Mining Protocol.md`, `personnel page technical content KB.md`, `index.html`, `script.js`, `plana.html`, `styles.css` | Defines evidence-first workflow, bilingual i18n, static HTML/CSS/JS constraints, and technical rigor level. | None for public page mechanics. |
| Architecture style | `arch_style/ACT_arch.png`, `arch_style/X-VLA_architechture.jpg`, `arch_style/module_arch.pdf`, `arch_style/Retargeting.png`, `arch_style/plana-robot.jpg`; existing `Pic/plana/*.svg` | Guides figure-first project page and module-block diagram style. | `view_image` failed in sandbox with `bwrap: loopback: Failed RTM_NEWADDR`; visual inspection was limited to file inventory and existing AGENTS descriptions. |
| Old PLAN-A docs | `PlanA-情感陪伴场景的多模态交互系统.pdf`, `docs/PLAN-A_云文档.md` | Source of system boundary, dataset stats, latency, CVAE/DP split, calibration, data diagnosis, and Qwen cache result. | PDF content matches cloud doc at high level; cloud doc is the cleaner line-referenced source. |
| Results | `docs/assets/tables/t1_techstack.csv` to `t6_repo_index.csv`, `docs/assets/exports/training_history.json`, `retargeting/data/human_upper_as_elbow/test_summary.json` | Supplies measured values used publicly: 194 episodes, training configs, best val loss, thinking data diagnosis, Teleop Transformer MAE. | No full real-robot task-success table comparing CVAE and DP. |
| CVAE | `text_to_action_cvae/models/model_text_action_vae_transformer.py`, `dataset/dataset_text_action.py`, `train.py`, `predict.py`, `websocket_text_to_action.py`, `docs/scripts/01_train_cvae.py` | Defines text/action data contract, BERT + CVAE architecture, 3-class report config, 8-class main config, losses, inference stop rule, and WebSocket runtime. | Report route and main route differ in class count and dimensions; claims must name the route. |
| Diffusion Policy | `text_to_action_diffusion/models/image_conditioned_dp_dynamic.py`, `diffusion_wrapper.py`, `dataset_qwen_episode.py`, `train_qwen_dp.py`, `qwen_embed.py`, `Data_Recording/capture_image_series.py` | Defines DINOv2/Qwen condition path, 6-layer action transformer, v-prediction, DDIM 1000, self-conditioning, min-SNR, dynamic length masks, and image/action pairing. | No task-success benchmark found for DP. |
| Qwen/OpenCV perception | `qwen_multimodal/detect_face_complete.py`, `qwen_multimodal/load_qwen_vl.py`, `qwen_multimodal/README_detect_face_complete.md` | Defines Qwen2.5-VL/OpenCV cascade, face count, 9x9 grid position, 7 human emotions to 6 robot emotions, and fallback behavior. | Runtime accuracy metrics for emotion detection were not found. |
| Retargeting | `vd_mocap_listener_struct.py`, `mocap_to_joint_angles.py`, `calibrate_all_joints.py`, `calibrate_all_joints_position.py`, `test_tpose_angles.py`, `校准流程说明.md`, `train_teleop_transformer.py`, `MODEL_ARCHITECTURE.md`, `README_teleop_transformer.md`, `test_summary.json` | Defines VDMocap 23-node schema, T-pose offset, quaternion/position mapping, `[0,4095]` clamp, 10D encoder order, 60D to 10D Transformer regressor, and 47-sample MAE. | Retargeting results are interface-level; not end-to-end PLAN-A success. |
| ROS2 IK | `ros2_ws/src/robot_ik_solver/README.md`, `config/ik_config.yaml`, `srv/SolveIK.srv`, `srv/SolveFK.srv`, `src/ik_solver.cpp`, `src/ik_service_node.cpp`, `include/robot_ik_solver/ik_solver.hpp` | Defines KDL IK/FK service contract, URDF loading, joint limits, position-only mode, damped pseudo-inverse numerical IK fallback. | No quantitative IK accuracy benchmark beyond service/tests found. |
| Resume references | `excellent cv/gl_cv_bullet_version.txt`, `excellent cv/lfy_cv_bullet.txt`, `excellent cv/分层碰撞机制_末端姿态对.txt`; image files inventoried | Extracts bullet grammar before Yueyi bullet writing. | Image-only references were not OCRed in this pass; use only readable `.txt` grammar. |

## 2. Robotics Context Map

| KB family | Relevance | Wording impact |
| --- | --- | --- |
| ACT / action chunking | CVAE and DP both generate action sequences, but there is no ACT temporal aggregation implementation. | Use "10D trajectory" and "autoregressive or padded sequence decoding"; do not call it ACT. |
| Flow-matching VLA | DP uses diffusion-style denoising with DDIM, not Flow Matching. Qwen is perception/condition encoding, not a unified VLA action expert. | Avoid "VLA", "Flow Matching", "action expert". Say "image-conditioned Diffusion Policy with v-prediction". |
| DreamZero / Fast-WAM | Relevant only as style for visual/action latent caching; PLAN-A caches Qwen condition tokens for DP. | Wording can mention "precomputed Qwen condition tokens"; not a world model. |
| WBC / controller interface | PLAN-A actions end as 10D encoder counts and WebSocket/Dynamixel commands. | Always state qpos/encoder layout, clamp `[0,4095]`, playback rate, and execution lock. |
| VLM3 / multimodal perception | Qwen/OpenCV perception produces face grid, emotion label, and fallback. | Describe camera output contracts and failure fallbacks, not generic "multimodal AI". |
| Retargeting / motion generation | VDMocap 23-node body/hand schema is mapped to robot encoder commands through calibration. | Treat as actuator adapter and calibration layer, separate from model success. |

## 3. Repository Map

| Path | Role | Public relevance | Notes |
| --- | --- | --- | --- |
| `docs/PLAN-A_云文档.md` | Report doc and source-of-truth summary | Yes | Lines 10-30 define system stack, dataset, latency, tech table. Lines 228-421 hold experiments and STAR cases. |
| `docs/assets/tables/*.csv` | Machine-readable result tables | Yes | Used for dataset count, train config, CVAE training metrics, thinking diagnosis. |
| `qwen_multimodal/` | Perception scripts | Yes | Qwen2.5-VL/OpenCV cascade, face-count fallback, emotion mapping. |
| `text_to_action_cvae/` | Text-to-action policy route | Yes | BERT + conditional VAE + Transformer Decoder + WebSocket runtime. |
| `text_to_action_diffusion/` | Image-conditioned DP route | Yes, with limits | DINOv2/Qwen condition sequence, self/cross-attention action transformer, diffusion wrapper. |
| `retargeting/` | Mocap to encoder interface | Yes | VDMocap parsing, calibration, quaternion/position mapping, Teleop Transformer support. |
| `ros2_ws/src/robot_ik_solver/` | IK/FK service | Secondary | Supports URDF/KDL validation; not the main reported policy. |
| `Data/robot_reactions/{举手,伸手,坐着}` | 3-class CVAE report dataset | Yes | Dataset stats are reported via docs tables. |
| `Data_Recording/capture_image_series.py` | Image/action episode capture | Secondary | Aligns image folders with action NPZ for DP route. |

## 4. Module Map

| Module | Evidence | Input | Output | Rate / shape | Failure mode or guard |
| --- | --- | --- | --- | --- | --- |
| Qwen/OpenCV perception | `detect_face_complete.py:16-54`, `:111-173`, `:235-331`, `:352-520` | RGB image or camera frame | Face count, 9x9 face grid, 7-class human emotion, 6-state robot emotion | Timing printed per face count, position, expression; no fixed FPS claim | No face or parse failure falls back to `熟睡`. |
| VDMocap SDK parser | `vd_mocap_listener_struct.py:28-130`, `:229-250`, `:260-431` | UDP mocap packet | 23 body nodes, quats, positions, gyro/acc/velocity, arms JSON | `frequency` field from mocap stream | Dynamic library missing or no update blocks data capture. |
| Retargeting geometry | `校准流程说明.md:9-104`, `test_tpose_angles.py:12-26`, `calibrate_all_joints_position.py:138-226` | Shoulder/upper-arm position, optional quaternion, T-pose offset | J1/J2 encoder counts | `[0,4095]`, center 2048 | Direct absolute angles fail; T-pose offset and left-arm mirror fix operator offsets. |
| Quaternion runtime retargeting | `calibrate_all_joints.py:215-298`, `:301-408`, `:623-633` | Upper/lower-arm quaternions | 10 encoder counts: left J1-J4, center, right J1-J4, center | loop sleep default 0.01 s; output command is 10D | Clamps counts and keeps reserved channels at 2048. |
| Text-to-Action CVAE | `model_text_action_vae_transformer.py:48-164`, `:166-223`, `:244-315`, `:315-415`, `:452-480` | BERT tokens + one-hot category | `(T,10)` normalized action trajectory | Report config max 64; main config max 256 | Autoregressive inference stops after consecutive low-motion frames. |
| CVAE dataset | `dataset_text_action.py:34-45`, `:120-139`, `:170-210`, `:251-299` | NPZ trajectories and category text | Padded normalized `(max_seq_len,10)` samples | 8-category default, stratified split | Missing joint key or no trajectories raises explicit error. |
| CVAE execution | `websocket_text_to_action.py:30-75`, `:94-157`, `:181-231`, `:339-421`, `:489-505` | WebSocket JSON `{status,text,timestamp}` | Robot WebSocket `{"angles":[10],session_id,frame,total_frames}` | default 10 FPS; prediction max 50 / min 20 | Non-blocking execution lock, `skipped_busy`, clamp `[0,4095]`, persistent robot connection. |
| Image DP model | `image_conditioned_dp_dynamic.py:49-156`, `:188-248`, `:287-459` | Image sequence or precomputed condition seq plus noisy actions | Predicted diffusion target over `(B,T,10)` | DINOv2-B 768D, token 256, depth 6, 8 heads, horizon configurable | Dynamic action/image masks, precomputed condition bypass. |
| Diffusion wrapper | `diffusion_wrapper.py:94-137`, `:225-305`, `:307-391` | Normalized actions + image conditions | DDIM/DDPM sample or training loss | 1000 timesteps, objective `v`, self-cond 0.9, min-SNR 5 | Requires image sequence or condition sequence; normalizes to `[-1,1]`. |
| Qwen DP dataset | `dataset_qwen_episode.py:23-78`, `:112-176`, `:179-257` | Action NPZ + image folder | actions `(T,10)`, `cond_seq (T,256)` | lengths aligned by `min(T_action,T_img)` | Qwen cached `.npy`, `num_workers=0` to avoid model duplication. |
| ROS2 IK/FK | `SolveIK.srv:1-13`, `SolveFK.srv:1-10`, `ik_solver.cpp:19-101`, `:202-360`, `ik_service_node.cpp:41-54`, `:57-123` | Target pose or joint positions | Joint positions or pose | KDL chain from URDF; position-only mode uses damped pseudo-inverse | Unreachable pose returns failure or best low-error solution when acceptable. |

## 5. Execution Path

Primary CVAE closed-loop path:

1. Entry point: `text_to_action_cvae/websocket_text_to_action.py` listens on `ws://<ws-ip>:9010/ws/pose` and parses JSON messages with `status`, `text`, and `timestamp`.
2. Guard: only `status == "ok"` and non-empty `text` are processed; execution lock is acquired non-blockingly.
3. Policy call: `TextActionPredictorTransformer.predict()` tokenizes text, classifies category, generates a normalized trajectory, then denormalizes to encoder counts.
4. Post-processing: `_execute_trajectory_persistent()` clips the generated `(T,10)` trajectory to `[0,4095]`.
5. Robot command: each frame is sent as `{"angles": [...], "session_id": ..., "frame": i, "total_frames": T}` to `ws://<robot_ip>:<robot_port>/control`.
6. Timing: default playback is `fps=10`, so frame interval is 100 ms; report document decomposes runtime into receive about 5 ms, inference about 500 ms, and playback `T x 100 ms`.
7. Logging: runtime prints processed/executed/error/skipped stats.

DP training/inference path:

1. Image/action collection: `capture_image_series.py` records JPG folders aligned to NPZ trajectory frame counts.
2. Dataset: `QwenEpisodeDataset` pairs `robot_reactions/<cat>/episode_*.npz` with `image_base/<cat>/<episode_name>`.
3. Condition: DINOv2 encodes frames live, or Qwen hidden states are projected to 256D and cached as `.npy`.
4. Model: `ImageConditionedDiffusionPolicy` sends noisy action tokens through 6 self-attention layers interleaved with cross-attention over `cond_seq`.
5. Objective: `ActionDiffusionPolicy` trains v-prediction with min-SNR weighting and optional self-conditioning.
6. Sampling: DDIM uses 1000 steps by default and requires `image_sequence` or `image_cond_seq`.

Retargeting path:

1. SDK parser reads 23 body nodes and hand/face fields from VDMocap UDP.
2. Calibration records T-pose offset from shoulder/upper-arm geometry.
3. Runtime computes relative J1/J2 or swing/twist J1-J4 and maps to encoder center 2048.
4. Output is a 10D encoder vector with reserved joints fixed at 2048.

## 6. Evidence Table

Claims outside this table must not enter public copy.

| Claim | Evidence | Type | Confidence | Public-safe wording |
| --- | --- | --- | --- | --- |
| PLAN-A routes camera/VDMocap input through Qwen/OpenCV perception, CVAE/DP policies, and WebSocket/Dynamixel 10D execution. | `docs/PLAN-A_云文档.md:10`, `docs/assets/tables/t1_techstack.csv:2-9` | doc/config | High | PLAN-A is a multimodal interaction stack with Qwen/OpenCV perception, CVAE/DP routes, and 10D encoder execution. |
| The validated report path uses 194 episodes across 3 classes. | `docs/PLAN-A_云文档.md:10`, `docs/assets/tables/t2_dataset_stats.csv:2-4` | measurement | High | Reported CVAE validation uses 54 waving, 112 reaching, and 28 sitting episodes. |
| End-to-end CVAE execution latency is documented as about 2.5-5.5 s. | `docs/PLAN-A_云文档.md:299-311`, `websocket_text_to_action.py:221-231` | doc/runtime code | Medium | The report decomposes WebSocket/CVAE playback into about 2.5-5.5 s; code logs the same phases. |
| CVAE report script uses 3 conditions, 50 epochs, action_dim 10, latent 64, hidden 128, 2 decoder layers, 4 heads, max_seq_len 64. | `docs/scripts/01_train_cvae.py:29-44`, `docs/assets/tables/t3_train_config.csv:4-9` | config | High | The report CVAE route is a small 3-class BERT + CVAE + 2L/4H Transformer Decoder. |
| Main CVAE training entry keeps an 8-category, latent-128, hidden-256, 4L/8H configuration. | `text_to_action_cvae/train.py:202-233`, `dataset_text_action.py:34-45` | code/config | High | The codebase has an 8-category extension path separate from report metrics. |
| CVAE architecture uses BERT CLS, text projection, category embedding, latent `mu/logvar`, classifier, and Transformer Decoder. | `model_text_action_vae_transformer.py:48-164`, `:166-223` | code | High | The CVAE route conditions BERT features and category embedding before Transformer decoding. |
| CVAE inference can be autoregressive and stops after consecutive low-motion frames. | `model_text_action_vae_transformer.py:315-415`, `predict.py:144-228` | code | High | Inference supports dynamic sequence length through an autoregressive low-motion stopping rule. |
| CVAE loss combines reconstruction MSE, KL, and classification CE; beta anneals 0.01 to 0.1 in the report script. | `docs/scripts/01_train_cvae.py:54-95`, `train.py:25-56`, `docs/assets/tables/t5_training_summary.csv:13` | code/config/result | High | CVAE training uses MSE + beta KL + CE, with report beta annealing 0.010 to 0.100. |
| CVAE report best validation loss is 535.95 at epoch 5; final validation classification accuracy is 100%. | `docs/assets/tables/t5_training_summary.csv:1-14`, `docs/PLAN-A_云文档.md:260-281` | measurement | High | Report CVAE run reached best val loss 535.95; classification accuracy is a label sanity check. |
| Validation reconstruction MAE is smaller for sitting and higher for larger-motion classes. | `docs/PLAN-A_云文档.md:283-297` | measurement/doc | Medium | Report reconstruction shows sitting easier than waving/reaching; do not claim task success. |
| WebSocket runtime serializes robot playback with a non-blocking lock and `skipped_busy`. | `websocket_text_to_action.py:30-75`, `:138-157`, `:432-443` | code | High | Runtime protects execution from overlapping trajectories. |
| Runtime clamps each 10D frame to `[0,4095]` and streams at 10 FPS by default. | `websocket_text_to_action.py:348-421`, `:489-505` | code | High | Robot commands are 10 integer encoder counts at configurable FPS, default 10. |
| DP route uses DINOv2 or precomputed Qwen condition tokens. | `image_conditioned_dp_dynamic.py:49-156`, `dataset_qwen_episode.py:23-78`, `qwen_embed.py:67-84` | code | High | DP accepts live DINOv2 features or cached Qwen condition sequences. |
| DP action backbone is 6-layer interleaved self-attention and cross-attention over 10D actions and visual condition tokens. | `image_conditioned_dp_dynamic.py:287-459`, `train_qwen_dp.py:123-145` | code/config | High | DP uses a 6-layer action transformer with cross-attention to 256D visual tokens. |
| DP wrapper uses DDIM, 1000 timesteps, cosine schedule, v-prediction, self-conditioning 0.9, and min-SNR gamma 5 in Qwen training. | `diffusion_wrapper.py:94-137`, `:225-305`, `:307-391`, `train_qwen_dp.py:137-145` | code/config | High | DP is diffusion-style denoising, not Flow Matching. |
| Qwen cache speeds training from about 3 h/epoch live Qwen to about 20 min/epoch precomputed Qwen. | `docs/PLAN-A_云文档.md:407-421`, `docs/assets/tables/t3_train_config.csv:13` | doc/measurement | Medium | Report Qwen-cache acceleration as approximate internal training speedup. |
| OpenCV Haar counts faces and produces 9x9 grid coordinates; Qwen handles fallback and emotion parsing. | `detect_face_complete.py:111-173`, `:235-331`, `:352-520` | code | High | The perception stack is a Qwen/OpenCV cascade with explicit fallback. |
| Human emotion classes are 7; robot emotion states are 6 with `熟睡` fallback. | `detect_face_complete.py:18-54`, `:324-331`, `:375-382`, `:419-437` | code | High | Emotion mapping is rule-defined; no emotion accuracy benchmark is claimed. |
| VDMocap SDK struct exposes 23 body nodes plus hand and face fields. | `vd_mocap_listener_struct.py:28-130` | code/schema | High | Retargeting starts from VDMocap 23-body-node schema. |
| T-pose calibration maps relative angles to encoder center 2048 and clamps encoder range. | `校准流程说明.md:52-104`, `calibrate_all_joints_position.py:217-226`, `test_tpose_angles.py:85-108` | doc/code | High | Calibration makes T-pose the zero reference at encoder 2048. |
| Quaternion runtime retargeting maps arm quaternions to a 10D encoder vector with reserved center joints. | `calibrate_all_joints.py:215-298`, `:301-408`, `:623-633` | code | High | Retargeting produces actuator-facing 10D counts. |
| T-pose result is documented as 2048 +/- 3 and 90 degrees corresponds to about 1024 encoder counts. | `docs/PLAN-A_云文档.md:340-373` | measurement/doc | Medium | Report as calibration validation, not task success. |
| Teleop Transformer input is 60D IMU features and output is 10D encoders. | `MODEL_ARCHITECTURE.md:9-18`, `train_teleop_transformer.py:21-35`, `:143-214`, `:255-316` | code/doc | High | Learning-based teleop regresses six arm joints' IMU features to 10 encoder counts. |
| Teleop Transformer has about 1,000,970 parameters and 4 Transformer Encoder layers. | `MODEL_ARCHITECTURE.md:35-86`, `train_teleop_transformer.py:258-316`, `:464` | code/doc | High | Teleop regression model is about 1.00M parameters. |
| Teleop Transformer test set has 47 samples and 71.90-count overall MAE. | `test_summary.json:1-18` | measurement | High | Report this as 47 final-frame pair regression, not full system success. |
| Thinking data diagnosis found 122 thinking vs 100 bothhandsup samples, 14 short thinking samples, and 27% lower average motion. | `docs/assets/tables/t4_thinking_diag.csv:1-9`, `docs/PLAN-A_云文档.md:375-405` | measurement | High | Data-quality fix was length/motion filtering, not a model architecture improvement. |
| ROS2 IK service uses KDL and URDF joint limits with IK/FK services. | `README.md:3-13`, `SolveIK.srv:1-13`, `SolveFK.srv:1-10`, `ik_solver.cpp:19-101` | code/doc | High | IK/FK is a support service for pose/joint validation. |
| ROS2 position-only IK uses damped pseudo-inverse numerical fallback. | `ik_solver.hpp:51-79`, `ik_solver.cpp:202-360`, `ik_service_node.cpp:88-110` | code | High | IK supports position-only targets with numerical damping. |

## 7. Eight Technical Questions

| Question | Answer | Evidence |
| --- | --- | --- |
| What problem does this own? | PLAN-A owns social-robot interaction from camera/VDMocap input to robot reaction execution. It covers perception, generative action trajectory routes, retargeting, and 10D encoder streaming. | `docs/PLAN-A_云文档.md:10`, `t1_techstack.csv:2-9`, `websocket_text_to_action.py:94-157` |
| What model stack is used? | Perception: Qwen2.5-VL + OpenCV Haar. Text route: BERT-base-chinese + conditional VAE + Transformer Decoder. Image route: DINOv2 or cached Qwen condition tokens + 6-layer self/cross-attention Diffusion Policy. Runtime: WebSocket + Dynamixel. Support: VDMocap retargeting and ROS2 KDL IK. | `detect_face_complete.py:16-54`, `docs/scripts/01_train_cvae.py:29-44`, `image_conditioned_dp_dynamic.py:373-459`, `diffusion_wrapper.py:94-137`, `ros2_ws/src/robot_ik_solver/README.md:3-13` |
| What crosses module boundaries? | RGB frames, face count, 9x9 grid coordinates, 7-class human emotion, 6-state robot emotion, VDMocap 23-node pose/quaternion records, BERT token IDs/masks, one-hot category, normalized `(T,10)` trajectories, cached `cond_seq (T,256)`, and robot WebSocket `angles[10]`. | `detect_face_complete.py:111-173`, `vd_mocap_listener_struct.py:98-130`, `dataset_text_action.py:203-210`, `dataset_qwen_episode.py:170-176`, `websocket_text_to_action.py:376-383` |
| What runs at what rate? | CVAE playback defaults to 10 FPS; report decomposes receive about 5 ms, inference about 500 ms, playback `T x 100 ms`, total about 2.5-5.5 s. Image capture can record at 30 FPS. VDMocap loops use `sleep=0.01` but actual mocap frequency comes from SDK packets. | `websocket_text_to_action.py:33-50`, `:414-421`, `docs/PLAN-A_云文档.md:299-311`, `Data_Recording/capture_image_series.py:28-45`, `calibrate_all_joints.py:522-535` |
| What was trained? | CVAE report route trains BERT and non-BERT parameters with AdamW, beta annealing, MSE/KL/CE losses on 194 episodes. Main CVAE path supports 8 classes. DP Qwen route trains a diffusion wrapper and action transformer with Adam, cosine LR, v-prediction, self-conditioning 0.9 and min-SNR. Teleop Transformer trains 60D to 10D regression with MSE and Adam. | `docs/scripts/01_train_cvae.py:29-95`, `train.py:202-335`, `train_qwen_dp.py:81-186`, `train_teleop_transformer.py:319-378` |
| What was measured? | 194-episode 3-class dataset stats; CVAE best val loss 535.95 and 100% classification sanity accuracy; reconstruction MAE by class; runtime latency; Qwen-cache acceleration; thinking data quality diagnosis; Teleop Transformer 47-sample MAE 71.90; T-pose calibration 2048 +/- 3. | `t2_dataset_stats.csv:2-4`, `t5_training_summary.csv:1-14`, `docs/PLAN-A_云文档.md:283-311`, `:340-421`, `test_summary.json:1-18` |
| What was hard? | Direct global mocap quaternions do not map to robot joint zero; thinking class data had short/low-motion bias; live Qwen made DP training too slow; playback could receive overlapping requests; emotion/face perception needs fallback when no face or parse failure occurs. | `docs/PLAN-A_云文档.md:340-421`, `websocket_text_to_action.py:138-157`, `detect_face_complete.py:375-437` |
| What remains unproven? | No controlled real-robot task-success benchmark comparing CVAE and DP was found. No perception accuracy table was found. ROS2 IK has service/code evidence but no benchmark table. Teleop MAE is final-frame pair regression, not full interaction success. | Absence from read result tables and docs; explicit page wording should keep claims scoped. |

## 8. Reviewer Critique

| Dimension | Score /10 | Evidence | Concern | Wording / fix |
| --- | --- | --- | --- | --- |
| Novelty | 6 | CVAE/DP/retargeting are integrated but largely known methods. | A CoRL/RSS reviewer would not accept novelty as model contribution. | Frame as real-system integration and interface engineering. |
| Engineering | 8 | WebSocket lock, `[0,4095]` clamps, Qwen cache, T-pose SOP. | Needs more failure logs for field deployment. | Use "engineered", "calibrated", "instrumented"; avoid "state-of-the-art". |
| System integration | 8 | End-to-end doc plus multiple modules. | Need one diagram that keeps route boundaries separate. | Existing `plana-model_architechture.svg` and runtime visualization are suitable. |
| Real robot | 6 | WebSocket/Dynamixel and retargeting execution code exist. | No controlled rollout success table. | Say "robot execution path" and "documented closed-loop latency", not "validated success rate". |
| Evaluation | 5 | CVAE losses, reconstruction, data quality, Teleop MAE. | No task-level benchmark or ablation across CVAE vs DP. | Report module metrics separately. |
| Reproducibility | 7 | Docs scripts, result CSVs, config tables. | Some paths in docs point to `/home/ps` and may need path repair. | Preserve path audit in `PROJECT.md`; avoid external reproducibility overclaim. |
| Homepage readiness | 8 | Page already bilingual with figures and evidence index. | Add interview-ready technical points to match protocol. | Patch `plana.html` with final section. |
| Resume readiness | 8 | Strong evidence for 3 defensible bullets. | Must avoid DP task-success or perception accuracy claims. | Bullets use "architected/engineered/calibrated/optimized" with metrics and boundaries. |

Reviewer attack points:
- The CVAE classification accuracy is inflated because the input text is the class label.
- The DP route has no matched success benchmark; it is architecture and training-route evidence.
- The dataset has only 194 report episodes for 3 classes; 8-class code path should not inherit those metrics.
- Teleop Transformer is evaluated on 47 final-frame pairs, not continuous sequence playback.

Hiring manager first questions:
- What exactly is the 10D action layout and how is it clamped?
- Why does T-pose calibration matter and how do you compute offsets?
- What was trained versus frozen/precomputed in DP?
- How does your runtime avoid overlapping robot commands?
- What result can you defend without overstating real-robot success?

Best missing experiment:
- A task-level rollout table with success definition, episode count, and matched CVAE/DP settings.
- Perception accuracy / latency table for Qwen/OpenCV cascade.
- Retargeting continuous-sequence error, not final-frame-only MAE.

Defensible overclaim:
- "Architected" is defensible because the evidence shows integration across perception, policies, retargeting, runtime, and docs.
- "Deployed" is defensible only for the WebSocket/Dynamixel execution path, not for a benchmarked product.
- "Optimized" is defensible for Qwen cache speedup and data-quality filtering.

## 9. Figure Plan

| Figure | Purpose | Style reference | Required labels | Evidence |
| --- | --- | --- | --- | --- |
| `Pic/plana/plana-model_architechture.svg` | Explain module boundaries and two policy routes | ACT architecture and module-block style | Camera, VDMocap, Qwen/OpenCV, CVAE, DP, 10D encoder, WebSocket/Dynamixel | Evidence table rows for system, CVAE, DP, execution. |
| `Pic/plana/plana-runtime_visualization.svg` | Keep measured results scoped by module | PLAN-B result-block style, X-VLA compact metrics | Dataset, latency, Qwen cache, T-pose, Teleop MAE, thinking diagnosis | `t2`, `t3`, `t4`, `t5`, `test_summary.json`. |
| Retargeting link page | Deep dive into mocap interface | `Retargeting.png`, AnyTeleop-style mapping | 23 nodes, T-pose, `[0,4095]`, 10D layout, WebSocket | `retargeting/*`, `plana_retargeting.html`. |
| Result table in page | Prevent overclaiming | Project page `.results-table` | Value + scope in separate columns | Result CSVs and cloud doc. |

## 10. Homepage Translation Notes

Homepage card constraints:
- 4-7 dense sentences.
- Must mention 194 episodes, `(T,10)` action contract, CVAE dimensions, DP route, runtime guard, and limited benchmark scope.
- Must not say "VLA", "Flow Matching", or "task success improvement".

Current public-safe homepage card:
- The existing PLAN-A card in `index.html` and `script.js` already follows the evidence gate.
- It separates "validated report path" from DP and retargeting support.
- It states no controlled CVAE-vs-DP task-success benchmark is claimed.

Detail page changes completed:
- Added "Interview-Ready Technical Points" before Evidence Index in `plana.html`.
- Each point is tied to source evidence and states a scoped boundary.

## 11. Reference CV Grammar Table

Readable reference files:
- `excellent cv/gl_cv_bullet_version.txt`
- `excellent cv/lfy_cv_bullet.txt`
- `excellent cv/分层碰撞机制_末端姿态对.txt`

Unreadable or partial:
- Image-only `.jpg` / `.png` references were inventoried but not OCRed in this pass due sandbox viewer limits.

| Reference bullet | Verb | Compression pattern | Metric placement | What to imitate |
| --- | --- | --- | --- | --- |
| "Led VLA-based embodied visual tracking ... by post-training a Qwen2.5-VL-3B + Flow Matching Head..." | Led | System + target condition + model stack + training method | Benchmark/result in later bullet | Strong ownership and exact model head naming. |
| "Combined simulation-collected trajectories with VQA data during SFT..." | Combined | Data sources + training phase + reason | No metric; method-only | Explain why data mix exists, not just that data was used. |
| "Architected MotionVLA as a MoT-inspired text-action dual-modal expert model..." | Architected | Architecture analogy + modality contract + initialization | No metric in same sentence | Use "Architected" when module boundaries and design choices are clear. |
| "Preserved language semantics by freezing the text branch, inserted..." | Preserved | Problem + freeze/train split + inserted modules | No metric | Explicit trained/frozen boundary. |
| "Reported real-robot execution success improvement from 40% to 95%..." | Reported | Result is qualified as reported + deployment path | End of bullet | Use "reported" for sourced metrics; do not over-own unverified results. |
| "Led 0-to-1 development of DiffVL..." | Led | 0-to-1 ownership + model identity + reframing of task | Downstream deployment in later bullet | Good for system identity sentence, but only if evidence supports ownership. |
| "Adopted MobileDet-0.25 backbones and quantization..." | Adopted | Specific backbone + compression + deployment constraint | No numeric result | Pair model choice with runtime constraint. |
| "负责轨迹后处理...缩短作业时间 30% 以上" | 负责/Optimized | Algorithm function + constraints + measured improvement | Metric near sentence end | For robotics controls bullets, put constraints before metric. |
| "实验验证与迁移...仿真成功率 94%...真机 90%" | Validated | Simulation + real robot + baseline deltas | Several metrics in one compact line | Separate sim and real robot results. |

Extracted grammar:
- Start with `Architected`, `Engineered`, `Calibrated`, `Optimized`, `Integrated`, or `Validated`.
- Compress as: `[ownership verb] + [specific system/model] + [mechanism/interface] + [scale/result] + [scope boundary]`.
- Put metrics after the mechanism, and qualify their scope.
- Use "reported" or "documented" when a metric is from docs/logs and not personally re-run.
- Avoid weak verbs: "worked on", "helped with", "used", "built" as main verbs.
- Do not invent publication/result claims.

## 12. Resume Bullet Candidates

Final bullets are stored in `chenyy_cv.md`; these are the evidence-backed directions.

1. PLAN-A system architecture:
   - Scope: Qwen/OpenCV + VDMocap, CVAE/DP routes, WebSocket/Dynamixel 10D execution.
   - Metrics: 194 episodes, 2.5-5.5 s latency, 10 FPS.
   - Risk: do not imply benchmarked product success.

2. CVAE policy route:
   - Scope: BERT-base-chinese CLS, 64D latent report route, 2L/4H Transformer Decoder, MSE/KL/CE.
   - Metrics: 50 epochs, best val loss 535.95, 100% classification sanity accuracy.
   - Risk: classification metric is a sanity check, not semantic NLU performance.

3. Retargeting/DP optimization:
   - Scope: T-pose calibration, 10D clamp, Qwen cache to 256D condition tokens, DP v-prediction and self-conditioning.
   - Metrics: 2048 +/- 3 T-pose, 71.90-count MAE on 47 pairs, about 9x Qwen-cache speedup.
   - Risk: Teleop MAE is support branch; DP has no task-success comparison.

## 13. Gaps

Known gaps to keep visible:
- No controlled CVAE vs DP real-robot success benchmark found.
- No emotion/face perception accuracy table found.
- No continuous retargeting sequence error table found; only final-frame pair MAE is available.
- Some docs paths reference `/home/ps/...` while current project root is `/home/CNS2026391745/Documents/PLAN-A-CYY/...`.
- Image-only excellent CV references were not OCRed in this pass.
- `view_image` failed in sandbox; visual assets were checked by path inventory and XML/HTML validation rather than screenshot inspection.

