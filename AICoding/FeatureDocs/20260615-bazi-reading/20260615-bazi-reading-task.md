# 任务拆解文档

## 1. 关联文档

- 需求文档：`AICoding/FeatureDocs/20260615-bazi-reading/20260615-bazi-reading-requirement.md`
- 技术方案文档：`AICoding/FeatureDocs/20260615-bazi-reading/20260615-bazi-reading-design.md`

## 2. 分支信息

- 建议分支名：`feature/20260615-bazi-reading`
- 用户是否已确认：是

## 3. 任务列表

- [x] 创建或调整类型定义
- [x] 创建或调整 schema 校验
- [x] 创建或调整数据库 schema
- [x] 创建或调整 API
- [x] 创建或调整 service
- [x] 创建或调整 hooks
- [x] 创建或调整组件
- [x] 创建或调整页面
- [ ] 添加测试（本期未新增自动化测试文件，使用 lint/build/API/浏览器验证）
- [x] 本地验证
- [x] AI 自检

## 4. 不做事项

- 不支持农历/阴历。
- 不支持海外出生地、时区和夏令时。
- 不做真太阳时换算。
- 不新增八字排盘依赖。
- 不保存历史报告。
- 不做登录、会员、次数扣减。
- 不修改数据库 schema。
- 不修改首页入口和导航常量。

## 5. 风险点

- 当前版本为娱乐向轻量简批，不等同专业八字排盘。
- DeepSeek 未配置时无法生成 AI 报告，只能展示错误提示。
- 不知道出生时间时缺少时柱，报告完整度较低。
