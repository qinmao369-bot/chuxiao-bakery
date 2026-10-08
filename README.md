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
| 购物袋 | 抽屉式面板，`localStorage` 持久化，满 ¥66 免配送进度条 |
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
├── index.html      # 前台页面结构与静态内容
├── admin.html      # 商品管理后台
├── config.js       # 数据库地址与 anon key（公开，需自己填）
├── data.js         # 数据层：商品读写 + SVG 插画库（前后台共用）
├── script.js       # 前台交互逻辑
├── admin.js        # 后台交互逻辑
├── styles.css      # 前台设计系统（配色、组件、响应式断点）
├── admin.css       # 后台设计系统
├── supabase/
│   └── schema.sql  # 建表 + 约束 + 索引 + 权限策略 + 初始数据
├── vercel.json
├── README.md
└── LICENSE
```

## 商品管理后台

访问 `admin.html`（前台页脚也有入口）即可管理商品。

### 可编辑属性

| 字段 | 说明 |
| --- | --- |
| 图片 | 上传实拍图，或选择内置 SVG 插画作占位 |
| 名称 | 最多 30 字，必填 |
| 价格 | 0–9999，支持小数 |
| 重量 / 规格 | 如 `480g`、`240ml`、`1 块` |
| 介绍 | 最多 200 字 |
| 分类 | 欧包 / 甜点 / 咸味 / 饮品 |
| 角标 | 最多 8 字，如「招牌」「限量」 |
| 搜索关键词 | 空格分隔，影响前台搜索命中 |
| 招牌标记 | 前台以强调色角标展示 |
| 今日售罄 | 前台置灰并禁用加购 |

### 数据存储说明

数据源优先级：**Supabase 数据库 > 本地镜像 > 内置示例数据**。

配置好数据库后，所有商品读写都走数据库，前台任意设备打开都一致。未配置时自动降级为内置示例数据，站点不会白屏。

#### 接入 Supabase（三步）

**1. 建库**

到 [supabase.com](https://supabase.com) 注册建项目，然后打开 **SQL Editor**，把
[`supabase/schema.sql`](supabase/schema.sql) 整段粘进去执行。

脚本会建好表、约束、索引、权限策略，并导入 8 款初始商品。

**2. 改一处占位符**

`schema.sql` 第 4.2 节里有两处 `YOUR_ADMIN_TOKEN_HERE`，换成你自己生成的随机串：

```bash
openssl rand -hex 16
```

**3. 填连接信息**

编辑 [`config.js`](config.js)，填入 Project URL 和 anon public key
（Supabase 后台 → Project Settings → Data API）。

然后打开后台 `/admin.html`，点右上角「数据库」按钮，填入**第 2 步那个管理令牌**，保存。

前台会自动开始从数据库读商品。

#### 为什么 anon key 可以公开

Supabase 的 anon key 本来就是设计给前端用的，官方教程也直接写在前端代码里。
**它的安全性不靠保密，靠数据库侧的 RLS 策略**：

| 操作 | 权限 |
| --- | --- |
| 读商品 | 所有人可读（访客要能看到商品） |
| 增删改 | 必须携带 `x-admin-token` 请求头且值匹配 |

管理令牌只保存在**你自己浏览器的 localStorage**，不进代码、不进仓库。

> 反过来说：如果 anon key 只存在你本地（不写进 `config.js`），访客的前台读不到数据库，
> 只能看到内置示例数据 —— 你改的东西别人看不见。所以 url 和 key 必须公开。

#### 图片字段

`img` 字段现在接受三种形式：

- `https://...` 图片 URL —— **推荐**，配合 Supabase Storage 使用
- `/path/to/img.jpg` 站内相对路径
- `data:image/...` base64 —— 旧的本地上传方式，仍兼容

留空则回退为手绘 SVG 插画。

#### 未连接数据库时

- 后台仍可编辑，改动只存在当前浏览器
- 徽标显示「未连数据库」
- 前台展示内置的 8 款示例数据

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
