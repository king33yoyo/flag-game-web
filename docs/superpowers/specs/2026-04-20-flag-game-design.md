# 世界插旗挑战 — 设计文档

## 概述

一款单文件互动网页地理游戏。玩家选择一个大洲，将国旗拖拽到地图上对应国家的位置。放对即时锁定，放错弹回。

## 核心玩法

- **模式：** 拖拽匹配 — 地图上有空位标记，玩家从底部托盘拖国旗到正确位置
- **范围：** 单区域模式 — 每次玩一个大洲（亚洲/欧洲/非洲/南美/北美/大洋洲）
- **反馈：** 即时反馈 — 放对锁定 + 绿色对勾 + 音效，放错弹回 + 闪红 + 音效
- **结算：** 全部放对后弹出结果面板，显示得分、用时、每题回顾

## 页面结构

### 1. 首页

- 顶部导航栏（Logo + 标题）
- 3x2 大洲卡片网格，每个大洲有独立色系和国家数量
- 点击卡片进入对应大洲的游戏

### 2. 游戏页

- **顶部栏：** 大洲名称 + 得分（N/总数）+ 计时器
- **地图区域：** 全屏 SVG 地图，使用真实 GeoJSON + Natural Earth 投影渲染
  - 已放对的国家：绿色填充 + 国旗标记 + 对勾
  - 待放的国家：浅紫色填充 + 脉冲圆圈空位引导
  - 悬停高亮效果
- **底部旗子托盘：** 待放置的国旗芯片列表，放对后灰掉

### 3. 结算页

- 环形得分图（conic-gradient）
- 正确数/错误数/用时统计
- 每题回顾列表（正确/错误 + 误放位置提示）
- "再来一次" 和 "换个大洲" 按钮

## 技术方案

### 地图渲染

- **数据源：** Natural Earth 110m 精度公开 GeoJSON，按大洲过滤
- **投影：** 内联 Natural Earth 投影函数（约 2KB），将经纬度转为 SVG 坐标
- **渲染：** SVG `<path>` 元素，每个国家一个 path，天然支持 DOM 事件
- **样式：** 卡通风格 — 圆润 stroke-linejoin、柔和填色、Claymorphism 效果

### 拖拽交互

- 桌面：HTML5 Drag & Drop API
- 移动端：Touch Events（touchstart/touchmove/touchend）
- 拖拽时旗子半透明 + 放大 1.1 倍
- 目标国家悬停高亮
- 放对：动画锁定 + Web Audio API "叮" 音效
- 放错：弹回动画 + Web Audio API "嗡" 音效 + 目标闪红

### 国旗显示

- 使用 emoji 国旗（零外部资源）
- 全平台原生支持（macOS/iOS/Android/Windows）

### 数据结构

```javascript
const continents = {
  asia: {
    name: "亚洲",
    color: "#FEE2E2",
    textColor: "#991B1B",
    countries: [
      { id: "CN", name: "中国", flag: "\u{1F1E8}\u{1F1F3}", geo: [...] },
      // ...
    ]
  },
  // europe, africa, south-america, north-america, oceania
};

const gameState = {
  continent: "asia",
  countries: [],      // 本轮随机选取的国家列表
  placed: [],         // [{countryId, correct}]
  score: 0,
  startTime: null,
  elapsed: 0,
  isComplete: false
};
```

### 音效

- Web Audio API 生成简单正弦波音效，无需外部音频文件
- 正确：高频短促（800Hz, 150ms）
- 错误：低频短促（300Hz, 200ms）

## 视觉设计

- **风格：** Claymorphism（黏土拟物）— 柔软 3D、圆角、双层阴影
- **配色：**
  - Primary: `#4F46E5` (Indigo)
  - Secondary: `#818CF8`
  - CTA: `#F97316` (Orange)
  - Background: `#EEF2FF`
  - Text: `#1E1B4B`
- **字体：** Baloo 2（标题）+ Comic Neue（正文）— Google Fonts
- **图标：** SVG 内联图标（Heroicons 风格），不使用 emoji 作 UI 图标

## 文件结构

```
flag-game.html    ← 单文件，包含所有 CSS/JS/GeoJSON 数据
```

## 数据体积

| 组件 | 大小 |
|------|------|
| GeoJSON（单大洲 110m） | 50-150 KB |
| JS 逻辑 | ~15 KB |
| CSS 样式 | ~5 KB |
| 投影函数 | ~2 KB |
| 总计（单大洲） | 70-170 KB |

## 约束

- 零外部依赖，纯 HTML/CSS/JS
- 单文件，浏览器直接打开即可玩
- 响应式：支持桌面和移动端
- 无需网络（GeoJSON 内嵌，字体有 fallback）
