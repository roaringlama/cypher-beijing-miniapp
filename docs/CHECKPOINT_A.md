# Checkpoint A — 高保真视觉原型

状态：已达到，等待用户验收。

## 本地预览

运行 `scripts/preview.ps1` 后访问 `http://127.0.0.1:4173`。顶部可切换五个验收页面；该页面是与原生 WXML/WXSS 同视觉的浏览器镜像，仅用于当前机器未安装微信开发者工具时的截图验收。

微信原生工程位于 `miniprogram/`。安装微信开发者工具后导入仓库根目录，可使用 `touristappid` 与本地 Mock 预览；真实 AppID 与云环境等到 Phase 2 再配置。

当前 `build` 会检查 TypeScript、页面清单、WXML 标签结构、WXSS 大括号、数据模型和资源，但本机未安装微信开发者工具，因此尚不能替代开发者工具编译与真机兼容验收；这项风险已明确保留到获得相应环境后处理。

可交付压缩包位于 `dist/cypher-beijing-checkpoint-a.zip`（生成产物不提交 Git）。

## 验收截图

| 页面 | 截图 |
| --- | --- |
| 首页 | `artifacts/checkpoint-a/home.png` |
| 活动详情 | `artifacts/checkpoint-a/detail.png` |
| 创建活动 | `artifacts/checkpoint-a/create.png` |
| 个人主页 | `artifacts/checkpoint-a/profile.png` |
| 平台赞助 | `artifacts/checkpoint-a/support.png` |

## 已验证交互

- 首页筛选与页面导航；
- 详情报名确认、提交锁与成功反馈；
- 五步创建流程、设置开关与 Mock 发布反馈；
- 音效、震动、减少动画设置与页面退出资源释放；
- 平台赞助金额、匿名/上墙选择、幂等 Mock 订单和明显测试标识；
- 五页在 390×844 视口均无横向溢出，浏览器控制台无错误或警告；
- 19 项关键规则测试、13 集合数据模型、敏感信息扫描与构建检查。
