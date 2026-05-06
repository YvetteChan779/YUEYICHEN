# Yvette Chan · 悦怡宸 个人主页 🌸

> 一个用 HTML / CSS / JavaScript 纯静态搭建的个人主页，可一键部署到 GitHub Pages。

## ✨ 特性

- 🎨 **现代视觉**：渐变背景 + 玻璃拟态 + 浮动装饰，富有层次的精致质感
- 🌗 **明暗双主题**：一键切换，并自动跟随系统偏好与本地持久化
- ⌨️ **打字机效果**：动态轮播职业 / 兴趣标签
- 📊 **滚动动画**：基于 IntersectionObserver 的渐显与数字滚动
- 🎯 **响应式设计**：手机 / 平板 / 桌面均完美适配
- 🖱️ **鼠标视差**：背景 blob 与漂浮标签会跟着指针轻微移动
- 🚀 **零依赖**：纯原生实现，加载快、部署简单

## 📁 文件结构

```
.
├── index.html      # 主页结构
├── styles.css      # 全部样式（含主题变量与动画）
├── script.js       # 交互逻辑
├── README.md       # 项目说明
└── .gitignore
```

## 🚀 部署到 GitHub Pages

仓库推送成功后，在 GitHub 上：

1. 进入仓库 **Settings → Pages**
2. **Source** 选择 `Deploy from a branch`
3. **Branch** 选择 `main`，目录选 `/ (root)`，点击 **Save**
4. 稍等几分钟，访问 `https://YvetteChan779.github.io/YUEYICHEN/` 即可

## 🛠️ 本地预览

直接双击 `index.html` 即可在浏览器打开；也可以用任何静态服务器：

```bash
# 任选一种
npx serve .
python -m http.server 8000
```

## 🎨 自定义内容

打开 `index.html`，按章节修改：

- **首屏文案**：搜索 `悦怡宸` / `hero-description`
- **打字机内容**：在 `script.js` 找 `phrases` 数组
- **关于我四张卡片**：搜索 `about-card`
- **技能进度**：搜索 `skill-item`，修改 `data-width`
- **作品案例**：搜索 `project-card`
- **联系方式**：搜索 `contact-list`

修改主题色：在 `styles.css` 顶部的 `:root` 中调整 `--accent-1 / --accent-2 / --gradient`。

## 📜 License

MIT © Yvette Chan
