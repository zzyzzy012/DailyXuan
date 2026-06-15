# 今日灵签功能自检文档

## 1. 本次完成内容

- 新增今日灵签页面 `/daily-lot`。
- 新增今日灵签抽签 API `/api/daily-lot-draws`。
- 新增今日灵签解签 API `/api/daily-lot-readings`。
- 新增 60 支本地轻量签池。
- 新增今日灵签 schema、types、抽签 service、prompt service、AI 解签 service。
- 新增今日灵签前端交互组件和结果展示组件。
- 将首页、导航、页脚中的“今日运势”调整为“今日灵签”。

## 2. 修改文件列表

| 文件 | 修改说明 |
| --- | --- |
| `AICoding/FeatureDocs/20260615-daily-lot/20260615-daily-lot-requirement.md` | 新增需求文档 |
| `AICoding/FeatureDocs/20260615-daily-lot/20260615-daily-lot-design.md` | 新增技术方案文档 |
| `AICoding/FeatureDocs/20260615-daily-lot/20260615-daily-lot-task.md` | 新增并更新任务拆解文档 |
| `AICoding/FeatureDocs/20260615-daily-lot/20260615-daily-lot-check.md` | 新增并更新自检文档 |
| `src/app/daily-lot/page.tsx` | 新增今日灵签页面 |
| `src/app/api/daily-lot-draws/route.ts` | 新增抽签 API |
| `src/app/api/daily-lot-readings/route.ts` | 新增解签 API |
| `src/features/daily-lot/constants.ts` | 新增关注项、限制常量和 60 支签池 |
| `src/features/daily-lot/types/dailyLot.ts` | 新增今日灵签类型 |
| `src/features/daily-lot/schemas/dailyLotSchema.ts` | 新增请求和 AI 输出校验 |
| `src/features/daily-lot/services/dailyLotDrawService.ts` | 新增后端随机抽签服务 |
| `src/features/daily-lot/services/dailyLotPromptService.ts` | 新增 AI prompt |
| `src/features/daily-lot/services/dailyLotReadingService.ts` | 新增 AI 解签服务 |
| `src/features/daily-lot/components/DailyLotPanel.tsx` | 新增交互主面板 |
| `src/features/daily-lot/components/DailyLotDrawResult.tsx` | 新增签文展示 |
| `src/features/daily-lot/components/DailyLotReadingResult.tsx` | 新增解签展示 |
| `src/lib/constants.ts` | 修改首页和导航的今日灵签文案、入口链接 |
| `src/components/layout/SiteFooter.tsx` | 修改页脚今日灵签文案 |

## 3. 验证方式

| 验证项 | 验证命令或方式 | 结果 |
| --- | --- | --- |
| 代码规范 | `pnpm run lint` | 通过 |
| 生产构建 | `pnpm run build` | 通过 |
| 页面访问 | 浏览器访问 `http://localhost:3000/daily-lot` | 通过 |
| 抽签流程 | 输入昵称、出生日期，选择“财运”，点击抽取 | 通过 |
| 解签流程 | 点击“生成解签” | 通过 |
| 浏览器控制台 | 检查 error/warning 日志 | 无 error/warning |

## 4. 功能检查

- [x] 页面是否可访问
- [x] 表单校验是否正常
- [x] 抽签 API 是否返回预期结果
- [x] 解签 API 是否返回预期结果或友好错误
- [x] 错误状态是否处理
- [x] 加载状态是否处理
- [x] 空状态是否处理
- [x] 移动端基础布局是否正常

## 5. 测试结果

- `pnpm run lint` 通过。
- `pnpm run build` 通过。
- 浏览器验证 `/daily-lot` 页面可访问，抽签和解签流程可完成。

## 6. 已知问题

- `git status --short` 未显示 `AICoding/FeatureDocs` 变更，疑似该目录受忽略规则影响；文件已在本地创建并验证存在。

## 7. 风险说明

- 当前 AI 解签依赖 `.env.local` 中 DeepSeek 配置；未配置环境变量时会返回友好错误。
- 第一版暂不接入报告保存、登录态和次数扣减。

## 8. 待用户验收事项

- 验收 `/daily-lot` 页面视觉与交互。
- 验收首页、导航、页脚中“今日灵签”文案是否符合预期。
- 验收 60 支签池内容风格是否需要调整。
