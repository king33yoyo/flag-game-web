# 世界插旗挑战 🚩

一个把国旗拖到地图正确位置的地理小游戏,亮色糖果风 UI,部署在 GitHub Pages。

**在线试玩**:<https://king33yoyo.github.io/flag-game-web/>

## 玩法

1. 在首页选择大洲,卡片右上角「🎯 全部 N 国」可挑战整洲全部国家,否则每局随机 10 题
2. 放置方式二选一:**拖拽**国旗到国家轮廓或 `?` 标记;或**点击**国旗卡选中后再点击地图放置(对触屏单手友好)
3. 放对得分并插旗;放错闪红并**绿色脉冲提示正确位置**,把失误变成学习
4. 支持 ⏸ 暂停(暂停期间禁止操作)、💡 显隐提示、🔊 音效开关、🌙 日/夜间模式
5. 每个大洲的最佳成绩(分数 → 用时 → 失误数)本地保存;7 项成就、生涯统计;结算页可 📸 一键生成糖果风成绩卡分享

## 技术说明

- 纯静态单页应用,无构建步骤:`index.html` + `data.js`(193 国 GeoJSON)+ `utils.js`(纯函数)+ `vendor/`(自托管 Leaflet 1.9.4)
- [Leaflet](https://leafletjs.com/) 只负责视口/坐标换算与手势,**不加载任何在线瓦片**——世界地图完全由 `data.js` 自绘:当前大洲为可交互轮廓,其余大洲为剪影背景,赤道/回归线为虚线参考,海洋为糖果色渐变
- PWA:`manifest.webmanifest` + `sw.js` 预缓存全部资源,可安装到主屏、完全离线游玩
- 测试:`npm test`(node:test,覆盖成绩比较/洗牌/格式化等纯函数)

## 本地运行

```bash
cd flag-game-web
python3 -m http.server 8765
# 打开 http://127.0.0.1:8765
npm test   # 运行纯函数测试
```

## 部署

GitHub Pages 已配置为从 `master` 分支根目录部署,推送 `master` 即自动更新(约 1-2 分钟生效)。更新缓存策略时记得同步修改 `sw.js` 中的版本号。

## 目录结构

```
├── index.html            # 页面结构 + 样式 + 游戏逻辑
├── data.js               # COUNTRY_DATA:193 国的名称/国旗/质心/简化 GeoJSON
├── utils.js              # 纯函数工具集(页面与测试共用)
├── tests/                # node:test 单元测试
├── vendor/               # 自托管 Leaflet
├── assets/               # 封面图片与 PWA 图标
├── manifest.webmanifest  # PWA 清单
├── sw.js                 # service worker(离线缓存)
├── docs/                 # 设计文档与开发计划
└── favicon.svg
```

## 已知限制

- 国家轮廓为高度简化多边形,微小国家(梵蒂冈等)仅示意性呈现
- 俄罗斯数据归属欧洲组,亚洲模式下不可出现

## License

MIT
