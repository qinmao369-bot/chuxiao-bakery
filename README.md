# 初麦 CHUXIAO BAKERY

> 天然鲁邦种 · 36 小时冷发酵 · 每日现烤

一个面包烘焙品牌的单页官网。零依赖、零构建 —— 双击 `index.html` 即可打开。

![首页](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-green)

## 特性

- **零依赖** —— 无 npm、无打包工具、无框架，纯 HTML/CSS/JS 三个文件
- **纯手绘 SVG 插画** —— 全部商品图由内联 SVG 绘制，离线可用、任意缩放不失真
- **完整交互** —— 分类筛选、全站搜索、购物袋抽屉、门店预留、订阅表单
- **响应式** —— 桌面 1440 / 平板 / 移动 390 三端均已适配
- **无障碍与降级** —— 尊重 `prefers-reduced-motion`，支持键盘 `Esc` 关闭与 `Cmd+K` 唤起搜索

## 功能一览

| 模块 | 说明 |
| --- | --- |
| 分类筛选 | 全部 / 欧包 / 甜点 / 咸味 / 饮品，空分类有兜底空状态 |
| 全站搜索 | `Cmd + K` 或 `Ctrl + K` 唤起，匹配商品名、描述、标签 |
| 购物袋 | 抽屉式面板，`localStorage` 持久化，满 ¥88 免配送进度条 |
| 门店预留 | 三家门店各自弹窗，提交手机号后模拟确认 |
| 订阅表单 | 周配面包订阅，含 11 位手机号格式校验 |
| 滚动进场 | `IntersectionObserver` 驱动的淡入动画 |

## 本地运行

直接打开即可：

```bash
open index.html
```

或起一个本地服务（推荐，避免个别浏览器对 `file://` 的限制）：

```bash
python3 -m http.server 8080
# 然后访问 http://127.0.0.1:8080
```

## 目录结构

```
.
├── index.html    # 页面结构与静态内容
├── styles.css    # 设计系统（配色、组件、响应式断点）
├── script.js     # 商品数据、SVG 插画库与全部交互逻辑
├── README.md
└── LICENSE
```

## 设计系统

配色以暖麦色系为主，全部定义为 CSS 自定义属性，位于 `styles.css` 顶部：

```css
--cream:  #FBF6EC;  /* 页面底色 */
--paper:  #FFFDF8;  /* 卡片纸面 */
--ink:    #2C2118;  /* 主文字 */
--crust:  #B4682C;  /* 品牌强调色（焦糖） */
```

字体：中文思源宋体（Noto Serif SC）+ 西文 Cormorant Garamond，均通过 Google Fonts 引入，并带系统衬线字体降级。

## 线上部署

已部署至 Vercel：

| 环境 | 地址 |
| --- | --- |
| Production | https://bakery-site-sigma-seven.vercel.app |
| Production（Git 集成） | https://bakery-site-git-main-luo-fei-yu.vercel.app |
| GitHub | https://github.com/qinmao369-bot/chuxiao-bakery |

站点为纯静态，无需构建。`vercel.json` 中 `buildCommand` 设为 `null`，直接以仓库根目录作为静态输出。

### 自动部署已启用

GitHub 仓库 `qinmao369-bot/chuxiao-bakery` 已连接至 Vercel 项目（`bakery-site`）。工作流：

```bash
git add .
git commit -m "描述本次改动"
git push origin main        # Vercel 约 30–60 秒内自动构建并更新正式域名
```

推送到 `main` 分支即自动部署到生产环境，**无需手动执行任何 Vercel 命令**。分支预览部署同样生效，合并前可先开 PR 看预览效果。

> 注意：Vercel 后台的 Deployment Protection 默认为开启状态，此时外部访客访问 `vercel.app` 会被登录墙拦截。如需对外公开访问，请在项目 Settings → Deployment Protection 中关闭。

### 本地 CLI 部署（备用）

日常开发用上面的自动部署即可。仅在需要手动触发时才用 CLI：

```bash
npm i -g vercel          # 若未安装
vercel login             # 设备授权，浏览器确认即可
vercel deploy --prod     # 手动生产部署
```

`.vercel/` 目录含项目 ID 与环境变量，已在 `.gitignore` 中排除，请勿提交。

## 关于站内数据

站内品牌（初麦）、门店地址、电话号码及商品信息均为**虚构示例内容**，仅用于界面演示，不对应任何真实商户。上线前请替换为实际信息。

## License

MIT
