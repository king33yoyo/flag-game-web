# 世界插旗挑战 🚩

一个把国旗拖到地图正确位置的地理小游戏,亮色糖果风 UI,部署在 GitHub Pages。

**在线试玩**:<https://king33yoyo.github.io/flag-game-web/>

## 玩法

1. 在首页选择大洲(亚洲 45 国 / 欧洲 36 国 / 非洲 50 国 / 南美 13 国 / 北美 18 国 / 大洋洲 8 国)
2. 每局随机抽 10 个国家,把国旗卡片拖到地图上对应的国家轮廓或 `?` 标记处
3. 放对得分并插旗,放错闪红光;全部放对即通关
4. 支持 ⏸ 暂停(暂停期间禁止操作)、💡 显隐 `?` 提示、缩放/平移地图
5. 每个大洲的最佳成绩(分数 → 用时 → 失误数)保存在浏览器本地,首页卡片和结算页可见

## 技术说明

- 纯静态单页应用,无构建步骤:`index.html` + `data.js`(国家 GeoJSON 数据)+ `vendor/`(自托管 Leaflet 1.9.4)
- [Leaflet](https://leafletjs.com/) 提供 CARTO Voyager 彩色底图与视口换算,国家轮廓用 SVG overlay 绘制
- 桌面端走 HTML5 Drag & Drop,移动端走 touch 拖拽克隆
- 无任何境外静态资源依赖(底图瓦片为运行时请求,© OpenStreetMap contributors © CARTO)

## 本地运行

```bash
cd flag-game-web
python3 -m http.server 8765
# 打开 http://127.0.0.1:8765
```

## 部署

GitHub Pages 已配置为从 `master` 分支根目录部署,推送 `master` 即自动更新(约 1-2 分钟生效)。

## 目录结构

```
├── index.html      # 页面结构 + 样式 + 游戏逻辑
├── data.js         # COUNTRY_DATA:170 国的名称/国旗 emoji/质心/简化 GeoJSON
├── vendor/         # 自托管 Leaflet(js/css/marker 图标)
├── docs/           # 设计文档与开发计划
└── favicon.svg
```

## 已知限制

- 欧洲/大洋洲等大洲的国家数据尚不全(共 170 国),后续可继续补充 `data.js`
- 每局固定 10 题,暂无"全部国家"模式

## License

MIT
