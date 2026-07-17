# WeChat Setup

## Phase 1 游客预览

1. 安装微信开发者工具。
2. 导入仓库根目录，`project.config.json` 会指定 `miniprogram/`。
3. 无 AppID 时选择游客模式；项目内只使用本地 Mock，不调用云能力。
4. 若开发者工具提示 TypeScript 编译，确认“编译插件”包含 `typescript`。

## Phase 2 真实环境（硬阻塞）

用户提供 AppID、云环境 ID 和账号授权后：

1. 将真实 AppID 写入本机 `project.private.config.json`，不要提交。
2. 云环境 ID 放入本机忽略配置或平台环境变量。
3. 创建最小权限集合与索引，再运行幂等初始化。
4. 云函数通过微信上下文取得 OpenID；客户端不得发送或缓存 AppSecret。
5. 完成开发/预发/生产环境隔离。

提交体验版、正式审核或发布前必须再次获得用户明确授权。

