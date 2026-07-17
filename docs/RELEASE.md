# Release Plan

## 阶段门

- Checkpoint A：高保真 Mock 原型与五页预览。
- Checkpoint B：真实云开发 MVP，发布—报名—审核—到场—积分—等级闭环。
- Checkpoint C：隐私配置、审核材料、体验版和支付准备完成。

## 每次候选版本

1. 工作区干净，`STATUS.md` 和 `CHANGELOG.md` 已更新。
2. `npm run verify` 通过，CI 绿灯。
3. 检查 Feature Flag，非 Cypher 类型关闭。
4. 检查不存在真实密钥、测试账号个人信息和 Mock 支付误切生产。
5. 微信开发者工具构建和真机核心路径通过。
6. 用户明确授权后才能上传体验版、提交正式审核或发布。

## 回滚

使用上一已验证 Git tag 重建；云数据迁移必须前向兼容并提供回滚/补偿脚本。取消类业务保留审计数据，禁止未经批准的生产物理删除。

