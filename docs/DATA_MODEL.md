# Data Model

机器可验证的完整字段、索引、权限摘要、Mock 来源和迁移策略位于 `database/schema.json`；`database/mock.json` 为所有集合提供可替换初始化入口。

## 集合分组

| 分组 | 集合 | 关键约束 |
| --- | --- | --- |
| 身份 | `users` | 本人只改允许字段；OpenID/管理员字段不下发 |
| 活动 | `activities`, `registrations`, `attendance` | 发起者只管自己的活动；活动+用户唯一报名；私密地址按权限投影 |
| 成长 | `pointLedger`, `levelConfigs`, `privilegeConfigs`, `userPrivileges` | 账本只追加且幂等；等级/特权配置化；无全站排行榜 |
| 赞助 | `platformSupportOrders`, `supporterWallEntries` | 订单幂等；服务端确认支付；上墙需同意；金额不排行且不影响积分 |
| 治理 | `feedback`, `reports` | 举报内容仅举报人和管理员可见；保留处理审计 |
| 配置 | `featureFlags` | 未知或读取失败时默认关闭 |

## 地址投影

`activities.address` 存储完整地址，但公开列表/详情的服务端 DTO 在 `addressVisibility=approved_only` 时只返回场地名称、区域和“报名通过后可见”。只有发起者或状态为 `approved` 的报名用户可收到详细地址。

## 幂等策略

- 报名：数据库唯一索引 `activityId + userId`，相同 idempotencyKey 返回已有结果。
- 积分：唯一 `idempotencyKey`，并校验 `userId + sourceType + sourceId + reason`。
- 赞助：唯一 `orderNo` 和 `idempotencyKey`，重复创建返回同一订单；状态只由服务端回调/查单推进。

## 迁移

文档包含 schema version。常规迁移只新增字段、写入安全默认值并分批回填；取消与删除使用状态和审计字段。不可逆迁移必须先备份、预演、提供补偿方案，并作为硬阻塞征得用户授权。

