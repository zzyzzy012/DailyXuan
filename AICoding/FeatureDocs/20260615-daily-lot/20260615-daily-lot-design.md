# 今日灵签技术方案文档

## 1. 功能范围

实现今日灵签页面、抽签 API、AI 解签 API、业务类型、schema、service、prompt 和展示组件，并调整首页和导航中的“今日运势”文案。

## 2. 页面路径设计

| 页面 | 路径 | 说明 |
| --- | --- | --- |
| 今日灵签 | `/daily-lot` | 用户输入信息、抽签、生成解签 |

## 3. API 设计

| 方法 | 路径 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| POST | `/api/daily-lot-draws` | 根据用户输入抽取今日灵签 | 否 |
| POST | `/api/daily-lot-readings` | 根据用户输入和签文生成 AI 解读 | 否 |

## 4. 数据库设计

### 新增表

无。

### 修改表

无。

### 字段说明

第一版不涉及数据库字段。

## 5. 组件设计

| 组件名称 | 文件路径 | 职责 |
| --- | --- | --- |
| DailyLotPanel | `src/features/daily-lot/components/DailyLotPanel.tsx` | 今日灵签交互主面板 |
| DailyLotDrawResult | `src/features/daily-lot/components/DailyLotDrawResult.tsx` | 展示抽到的签文 |
| DailyLotReadingResult | `src/features/daily-lot/components/DailyLotReadingResult.tsx` | 展示 AI 解签结果 |

## 5.1 文件变更清单

| 类型 | 路径 | 操作 | 用途 |
| --- | --- | --- | --- |
| 目录 | `AICoding/FeatureDocs/20260615-daily-lot` | 新增 | 功能过程文档 |
| 文件 | `AICoding/FeatureDocs/20260615-daily-lot/20260615-daily-lot-requirement.md` | 新增 | 需求文档 |
| 文件 | `AICoding/FeatureDocs/20260615-daily-lot/20260615-daily-lot-design.md` | 新增 | 技术方案 |
| 文件 | `AICoding/FeatureDocs/20260615-daily-lot/20260615-daily-lot-task.md` | 新增 | 任务拆解 |
| 文件 | `AICoding/FeatureDocs/20260615-daily-lot/20260615-daily-lot-check.md` | 新增 | 自检记录 |
| 文件 | `src/app/daily-lot/page.tsx` | 新增 | 今日灵签页面 |
| 文件 | `src/app/api/daily-lot-draws/route.ts` | 新增 | 抽签 API |
| 文件 | `src/app/api/daily-lot-readings/route.ts` | 新增 | 解签 API |
| 目录 | `src/features/daily-lot` | 新增 | 今日灵签业务模块 |
| 文件 | `src/features/daily-lot/constants.ts` | 新增 | 签池、关注项、限制常量 |
| 文件 | `src/features/daily-lot/types/dailyLot.ts` | 新增 | 类型定义 |
| 文件 | `src/features/daily-lot/schemas/dailyLotSchema.ts` | 新增 | 请求和输出校验 |
| 文件 | `src/features/daily-lot/services/dailyLotDrawService.ts` | 新增 | 抽签服务 |
| 文件 | `src/features/daily-lot/services/dailyLotPromptService.ts` | 新增 | AI prompt |
| 文件 | `src/features/daily-lot/services/dailyLotReadingService.ts` | 新增 | AI 解签服务 |
| 文件 | `src/features/daily-lot/components/DailyLotPanel.tsx` | 新增 | 交互主组件 |
| 文件 | `src/features/daily-lot/components/DailyLotDrawResult.tsx` | 新增 | 签文展示组件 |
| 文件 | `src/features/daily-lot/components/DailyLotReadingResult.tsx` | 新增 | 解签展示组件 |
| 文件 | `src/components/home/FeatureEntryGrid.tsx` | 修改 | 首页入口文案和链接 |
| 文件 | `src/components/layout/SiteHeader.tsx` | 修改 | 导航文案和链接 |
| 文件 | `src/components/layout/SiteFooter.tsx` | 修改 | 页脚功能文案 |

## 6. hooks 设计

第一版不新增 hook，交互状态放在 `DailyLotPanel` 内。

## 7. service 设计

| service | 文件路径 | 职责 |
| --- | --- | --- |
| `createDailyLotDraw` | `src/features/daily-lot/services/dailyLotDrawService.ts` | 使用后端随机从签池抽签 |
| `createDailyLotReading` | `src/features/daily-lot/services/dailyLotReadingService.ts` | 调用 DeepSeek 并校验 JSON 输出 |
| `createDailyLotReadingPrompt` | `src/features/daily-lot/services/dailyLotPromptService.ts` | 生成系统提示词和用户提示词 |

## 8. 类型设计

| 类型名称 | 文件路径 | 用途 |
| --- | --- | --- |
| DailyLotFocus | `src/features/daily-lot/types/dailyLot.ts` | 今日关注方向 |
| DailyLotLevel | `src/features/daily-lot/types/dailyLot.ts` | 签等级 |
| DailyLot | `src/features/daily-lot/types/dailyLot.ts` | 单支签 |
| DailyLotDrawResult | `src/features/daily-lot/types/dailyLot.ts` | 抽签结果 |
| DailyLotReadingResult | `src/features/daily-lot/types/dailyLot.ts` | AI 解读结果 |

## 9. 表单校验

- 昵称可选，限制最大长度。
- 出生日期必填，使用 `YYYY-MM-DD` 格式。
- 今日关注限定为预设值。
- 当前日期由服务端按北京时间生成。

## 10. 权限规则

第一版无需登录，无权限校验。

## 11. 错误处理

- Zod 校验失败返回稳定错误码和用户友好提示。
- AI 服务未配置、鉴权失败、额度不足、请求频率限制、响应为空、JSON 格式错误、schema 不匹配均返回稳定错误码。
- 前端展示友好错误，不暴露原始异常对象。

## 12. 测试方案

- 运行 `pnpm run lint`。
- 运行 `pnpm run build`。
- 本地启动后访问 `/daily-lot` 做基础交互验证。
- 验证抽签 API 可返回签文。
- 在未配置 DeepSeek 时验证解签 API 友好失败。

## 13. 命名确认清单

- feature 分支：`feature/20260615-daily-lot`
- 功能短名：`daily-lot`
- 页面路径：`/daily-lot`
- 抽签 API：`/api/daily-lot-draws`
- 解签 API：`/api/daily-lot-readings`
- 组件：`DailyLotPanel`、`DailyLotDrawResult`、`DailyLotReadingResult`
- service：`dailyLotDrawService.ts`、`dailyLotPromptService.ts`、`dailyLotReadingService.ts`
- types：`dailyLot.ts`
- schema：`dailyLotSchema.ts`

## 14. 风险与取舍

- 本地签池适合第一版快速上线，但后续如果需要运营配置，需要迁移到数据库或 CMS。
- 第一版不保存报告，避免提前引入登录、数据库和次数扣减复杂度。
- AI 解签依赖环境变量，未配置时只能验证抽签和错误提示。

## 15. 待确认问题

无。
