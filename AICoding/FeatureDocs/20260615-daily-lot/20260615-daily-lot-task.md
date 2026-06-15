# 今日灵签任务拆解文档

## 1. 关联文档

- 需求文档：`AICoding/FeatureDocs/20260615-daily-lot/20260615-daily-lot-requirement.md`
- 技术方案文档：`AICoding/FeatureDocs/20260615-daily-lot/20260615-daily-lot-design.md`

## 2. 分支信息

- 建议分支名：`feature/20260615-daily-lot`
- 用户是否已确认：是

## 3. 任务列表

- [x] 创建今日灵签 FeatureDocs
- [x] 创建并切换功能分支
- [x] 创建类型定义
- [x] 创建 schema 校验
- [x] 创建签池和关注项常量
- [x] 创建抽签 service
- [x] 创建 AI prompt service
- [x] 创建 AI 解签 service
- [x] 创建抽签 API
- [x] 创建解签 API
- [x] 创建页面组件
- [x] 创建页面路由
- [x] 修改首页“今日运势”为“今日灵签”
- [x] 修改导航“今日运势”为“今日灵签”
- [x] 修改页脚“今日运势”为“今日灵签”
- [x] 本地验证
- [x] AI 自检

## 4. 不做事项

- 不新增依赖
- 不修改数据库 schema
- 不接入报告保存
- 不接入次数扣减
- 不提交 commit、merge、push
- 不部署

## 5. 风险点

- AI 服务环境变量缺失时无法生成真实解签，只能验证友好错误。
- 现有部分中文文件在终端输出中存在编码显示问题，修改时需要保持 UTF-8。
