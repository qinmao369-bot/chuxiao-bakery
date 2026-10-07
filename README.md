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

## 关于站内数据

站内品牌（初麦）、门店地址、电话号码及商品信息均为**虚构示例内容**，仅用于界面演示，不对应任何真实商户。上线前请替换为实际信息。

## License

MIT
