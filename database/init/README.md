# Database Initialization

Phase 1 已提供 `seed.mjs --dry-run`，它读取 `schema.json` 与代表 Mock 数据并输出无写入计划。Phase 2 接入云适配器后必须幂等创建索引、仅写入缺失配置并输出审计摘要。不得覆盖已有业务数据；生产执行前必须使用预发数据验证并获得相应授权。
