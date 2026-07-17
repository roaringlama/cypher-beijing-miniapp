# Project Operating Contract

## 产品边界

Cypher Beijing 帮助北京 Old School Dancer 组织和参加线下活动。核心理念是“NOT EVERY DANCE NEEDS A WINNER.” 产品不以 Battle、输赢、排名、奖杯或舞蹈实力认证为核心；舞力值只体现参与、履约、组织和社区贡献。

Phase 1 只正式展示 Cypher。Party、约录视频和练舞局仅保留数据能力，并由 Feature Flag 关闭。

## 体验原则

界面采用深色夜场、Neon、Party flyer、Sticker、唱片、波形和聚光灯语言；交互有弹性、节奏和明确反馈，同时保证可读性与减少动画模式。不得复制任何现有游戏或品牌资产，不得退化成企业后台或默认蓝白表单，不得 Battle 化。

## 工程规则

- 改动前阅读 `STATUS.md`、`DECISIONS.md` 和相关文档；普通技术或产品细节自主选择并记录。
- 前端、数据库与云函数边界共用 `miniprogram/shared` 的类型或保持可验证的一致。
- 支付使用 `PlatformSupportPaymentService` 抽象；没有微信商户配置时只能启用明确标记的 Mock Provider。
- 积分和支付必须幂等；取消和删除可追溯；私密地址不可泄露。
- 修改后必须运行 `npm run verify`；涉及预览时还要人工检查五个 Checkpoint A 核心页面。
- 每次提交更新 `STATUS.md`。提交信息使用 Conventional Commits，例如 `feat: complete checkpoint A prototype`。
- 重大阶段在独立分支或 worktree 开发，经验证后合并到 `main`。

## 安全红线

不得提交 AppSecret、OpenID 样本、真实 AppID、云环境 ID、商户号、私钥、证书、管理员字段或任何生产凭据。真实配置只存放于已忽略文件或平台密钥管理中。发现疑似密钥必须停止提交、移除并轮换。

## 硬阻塞

只有以下情况可以要求用户介入：明显改变品牌定位的视觉选择；真实 AppID、云环境 ID 或账号授权；真实微信支付商户资料；不可逆数据迁移/删除；购买收费服务；提交正式审核/发布；现有需求无法裁决的同等产品方向。除硬阻塞外自主决定并继续执行。

