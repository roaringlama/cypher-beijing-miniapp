# Cypher Beijing

面向北京 Old School Dancer 的线下 Cypher 组织与参与小程序。

> NOT EVERY DANCE NEEDS A WINNER. 不是 Battle，也能认真跳舞。

当前仓库聚焦 Phase 0（工程与文档）和 Phase 1（高保真 Mock 原型）。首版只开放 `cypher`；`party`、`video`、`practice` 已在类型和 Feature Flag 中预留。

## 开始使用

环境要求：Node.js 20+、npm 10+。真机或模拟器预览另需微信开发者工具，未提供 AppID 时可使用游客模式查看 Mock 页面。

```powershell
.\scripts\setup.ps1
.\scripts\verify.ps1
.\scripts\preview.ps1
```

常用命令：

- `npm run lint`：代码与文档基础规范检查；
- `npm run typecheck`：TypeScript 类型检查；
- `npm run test`：关键业务单元测试；
- `npm run build`：小程序结构、页面和数据模型构建检查；
- `npm run verify`：完整本地验收；
- `npm run preview`：启动 Checkpoint A 浏览器预览镜像。

## 目录

```text
miniprogram/          微信原生 TypeScript 小程序
  components/         复用视觉组件
  pages/              页面
  services/           可替换的业务服务与 Provider
  shared/             领域类型与共享规则
  styles/             Design Tokens 和全局样式
  mocks/              可复现 Mock 数据
cloudfunctions/       Phase 2 起接入的云函数边界
database/             集合规范、索引、权限和初始化数据
prototype/            与小程序视觉一致的验收预览镜像
tests/                单元与契约测试
tools/                跨平台验证工具
scripts/              Windows 工作流脚本
docs/                 产品、UX、架构、隐私和发布文档
```

项目进度见 [STATUS.md](STATUS.md)，Checkpoint A 预览见 [docs/CHECKPOINT_A.md](docs/CHECKPOINT_A.md)，关键取舍见 [DECISIONS.md](DECISIONS.md)，微信配置见 [docs/WECHAT_SETUP.md](docs/WECHAT_SETUP.md)。
