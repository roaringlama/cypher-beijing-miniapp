# Cloud Functions

Phase 1 不部署云函数。Phase 2 起按业务能力拆分命令型云函数，复用 `miniprogram/shared/types` 中的输入输出契约；身份必须从微信服务端上下文取得。生产部署配置不得提交 AppSecret 或环境密钥。

