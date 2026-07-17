# Architecture

## 运行时分层

```text
WXML/WXSS pages + components
          |
      Page models
          |
Activity / Registration / Point / User / Report services
          |
Mock providers (Phase 1) | Cloud-function providers (Phase 2+)
          |
Shared TypeScript domain and API contracts
```

页面不直接操作数据库或支付 SDK。`ServiceRegistry` 根据 Feature Flag 和运行环境选择 Provider。真实身份与权限判断必须放在云函数端，前端判断只用于体验提示。

## 核心模块

- `FeedbackManager`：统一音效、震动、动效和 Toast，负责节流与资源释放。
- `FeatureFlagService`：控制活动类型、Mock 支付和阶段性能力；默认失败关闭。
- `ActivityService`：列表、详情、创建、取消和发起者权限。
- `RegistrationService`：报名、审核、取消、容量与重复报名规则。
- `PointService`：基于 `pointLedger` 的幂等积分与等级计算。
- `UserService`：公开资料投影和仅本人可写资料。
- `ReportService`：活动/用户举报，保留审计轨迹。
- `PlatformSupportPaymentService`：创建/查询平台赞助订单；Phase 1 仅 Mock。

## 安全边界

- 客户端只携带公开用户字段和当前会话必要数据；`openid`、管理员字段永不进入页面模型。
- 云函数从平台上下文取得身份，不信任客户端提供的 userId/organizerId。
- 私密地址由服务端按发起者/已通过报名投影，数据库原文不直接下发。
- 写请求使用 `idempotencyKey`；积分使用唯一 `sourceType + sourceId + userId`；支付使用唯一业务订单号。
- 删除/取消采用状态迁移与 `cancelledAt/cancelledBy/reason`，不直接物理删除。

## Phase 1 交付方式

`miniprogram/` 是正式源。`prototype/` 仅复刻五个验收页面，使用同一色彩、间距和 Mock 内容，便于在缺少微信工具与 AppID 时截图。任何业务规则只在共享 Service 与测试中维护，预览镜像不作为后续后端基础。

