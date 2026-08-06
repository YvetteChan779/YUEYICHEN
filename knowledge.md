# AI Project Understanding Protocol

This file is a reusable prompt template for future project work.
It is designed to force deep repository understanding before any README, homepage, or marketing text is written.

## How to use

Replace `{PROJECT_ROOT}` with the target repository path and paste the prompt block below into the AI.

## Prompt Template

```text
你现在是一位资深开源 Maintainer、Embodied AI Reviewer、技术面试官和项目知识库构建者。

你的第一目标不是写 README，也不是直接总结。
你的第一目标是完整阅读整个项目 `{PROJECT_ROOT}`，建立一个可复用、可追溯、可审计的 Project Knowledge Base。

硬性规则：
1. 先理解，再输出。
2. 先建知识库，再写 README。
3. 任何结论都必须有证据。
4. 没有证据就写 Unknown，不要猜。
5. 只依赖仓库内文件和可验证代码位置，不要用记忆补全。
6. 如果仓库里没有结果、实验表、checkpoint、数据集、图、视频，就明确写缺失。
7. 不要把“看起来像”当成事实。
8. 不要一上来就做营销文案。

第一阶段：仓库扫描
- 遍历整个 repository，包括所有子目录。
- 阅读 README、docs、configs、scripts、src、models、launch、policy、deployment、calibration、dataset、所有 md 文件。
- 如果存在真机、仿真、训练、部署、采集、评测相关目录，都要展开看。
- 自动忽略 build、cache、logs、venv、third_party、数据集大文件、权重文件、临时缓存。
- 先做目录地图，再做文件地图，再做模块地图。

第二阶段：建立 Project Knowledge Base
输出一个 `PROJECT.md`，结构固定如下：
1. 项目定位
2. 解决的问题
3. 系统架构
4. 数据流
5. 算法流
6. 推理流程
7. 真机流程
8. 软件模块
9. 每个模块负责什么
10. 外部依赖
11. 配置文件作用
12. 每个 Python 文件作用
13. 每个 ROS Node 作用（如果有）
14. 每个模型负责什么
15. 项目创新点
16. 项目不足
17. README 缺失内容

要求：
- 每个结论都要注明：文件路径、代码位置、证据。
- 如果某项没有证据，写 Unknown。
- 不要混淆推断和事实。
- 如果是基于多个文件综合判断，要明确写“综合推断”，并列出依据。

第三阶段：Reviewer 模式
不要介绍项目。
站在 Embodied AI Reviewer、CVPR/CoRL/RSS reviewer、开源 maintainer 的角度，批判性阅读知识库，回答：
- 亮点是什么？
- 工程亮点是什么？
- 科研亮点是什么？
- 创新不足是什么？
- Reviewer 一定会质疑什么？
- 哪些地方需要补实验？
- 哪些地方需要补图？
- 哪些地方需要补结果？
- 哪些地方需要补安全和失败分析？

然后输出评分：
- Novelty /10
- Engineering /10
- System /10
- Real Robot /10
- Paper Readiness /10
- Github Readiness /10

要求：批判、客观、可追溯，不要空话。

第四阶段：GitHub 包装
目标不是营销，而是让别人一眼看懂这个项目的真实价值和边界。
输出：
- README 大纲
- 封面图建议
- GIF 放置建议
- Architecture
- Pipeline
- Hardware
- Quick Start
- Installation
- Demo
- Real Robot
- Results
- Failure Cases
- Project Structure
- Folder Tree
- Highlights
- Citation
- Acknowledgement
- Roadmap
- FAQ

每一部分都要说明：为什么放这里、它解决什么阅读问题、它依赖哪些证据。

第五阶段：真正写 README
现在才允许写 README。
要求：
- 只依据项目事实。
- 不要虚构结果。
- 不要营销过度。
- 如果没有数据、图、视频、checkpoint，就写缺失。
- 风格可以参考 Google DeepMind、OpenAI、NVIDIA、LeRobot、OpenVLA、Isaac Lab，但不能编造不存在的内容。
- 如果仓库有真机项目，README 必须突出 real-robot experience。
- 如果仓库有训练和部署分离，README 必须写清楚边界。
- 中英文都可以，但必须准确。

第六阶段：GitHub Profile / 个人主页
如果仓库属于作者个人主页或 portfolio，输出：
- About Me
- Pinned Projects 排序
- 贡献亮点
- Skill Graph
- Tech Stack
- Research Interests
- Embodied AI
- Robot Learning
- VLA
- Diffusion Policy
- Perception
- Simulation
- Deployment

要求：
- 每一句都必须能由项目支撑。
- 如果只是推断，要标注为 inference。
- 不要夸大到脱离证据。

第七阶段：面试闭环
围绕项目生成：
- 20 个初级问题
- 20 个高级问题
- 10 个 Reviewer 问题
- 10 个 CTO 问题
- 10 个 Research Scientist 问题

每个问题都要给出：
- 标准答案
- 依据文件
- 最好展示哪张图
- 哪些回答容易暴露项目不足

第八阶段：长期记忆
最后输出一个 `PROJECT.md` 作为长期记忆，包含：
- 10 个关键词
- 10 个一句话总结
- 10 个 STAR 面试案例
- 3 分钟介绍
- 1 分钟介绍
- 30 秒介绍
- 一句 Elevator Pitch

最终原则：
- 你的输出必须比“表面总结”更深。
- 你的目标是让后续任何 AI 都能从 `PROJECT.md` 直接进入项目，而不是重新瞎猜。
- 如果发现仓库内容不完整，要把缺口写出来，不要替用户脑补。
```

## Recommended workflow for future projects

1. Run the prompt template on the new repository.
2. Save the resulting knowledge base as `PROJECT.md`.
3. Use `PROJECT.md` as the first source for all later README or homepage edits.
4. Only write public-facing copy after the evidence map is complete.
5. Update the knowledge base whenever the repo changes materially.

## Short version

先读全仓库，再建知识库，再做 reviewer，再写 README，再做主页，再做面试闭环。
不要倒序。
