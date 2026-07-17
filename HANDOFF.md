# Handoff

## 当前目标

Phase 0 和 Phase 1 已完成，Checkpoint A 已交付首页、活动详情、创建活动、个人主页和平台赞助页的清晰预览与可操作浏览器镜像，等待用户验收和 GitHub 仓库地址。

## 继续工作前

1. 阅读 `AGENTS.md`、`STATUS.md` 和 `DECISIONS.md`。
2. 执行 `npm.cmd install`（如依赖尚未安装）。
3. 执行 `npm.cmd run verify` 确认 19 项测试、13 集合数据模型和 5 页构建基线。
4. 检查当前分支；重大阶段不得直接在未验证的 `main` 上堆叠。

## 明确未接入

- 真实微信登录与云环境；
- 真实微信支付；
- 生产 AppID、Env ID、密钥和证书；
- Party、video、practice 的用户入口。

这些项目由 Feature Flag 或 Mock Provider 隔离，不构成 Phase 1 阻塞。用户提供 GitHub 地址后可配置 `origin` 并推送；此操作尚未执行，也不需要用户手动运行 Git 命令。
