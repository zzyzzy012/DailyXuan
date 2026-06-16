# 技术方案文档

## 1. 功能范围

实现八字简批 MVP：用户在 `/bazi` 填写出生信息和关注方向后，通过 `/api/bazi-readings` 调用 DeepSeek 生成结构化娱乐向简批报告。本期不做确定性八字排盘，只基于用户提供的公历生日、时间完整度和上下文生成轻量解读，并明确三柱简批边界。

## 2. 页面路径设计

| 页面 | 路径 | 说明 |
| --- | --- | --- |
| 八字简批 | `/bazi` | 表单填写与报告展示 |

## 3. API 设计

| 方法 | 路径 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| POST | `/api/bazi-readings` | 生成八字简批报告 | 否 |

## 4. 数据库设计

### 新增表

无。

### 修改表

无。

### 字段说明

本期不保存数据库，仅当次请求使用表单输入和 AI 返回结果。

## 5. 组件设计

| 组件名 | 文件路径 | 职责 |
| --- | --- | --- |
| `BaziReadingForm` | `src/features/bazi/components/BaziReadingForm.tsx` | 维护表单状态、校验输入、调用 API、处理加载和错误状态 |
| `BaziReadingResult` | `src/features/bazi/components/BaziReadingResult.tsx` | 展示结构化八字简批报告 |

## 5.1 文件变更清单

| 类型 | 路径 | 操作 | 用途 |
| --- | --- | --- | --- |
| 文档 | `AICoding/FeatureDocs/20260615-bazi-reading/20260615-bazi-reading-requirement.md` | 新增 | 需求文档 |
| 文档 | `AICoding/FeatureDocs/20260615-bazi-reading/20260615-bazi-reading-design.md` | 新增 | 技术方案文档 |
| 文档 | `AICoding/FeatureDocs/20260615-bazi-reading/20260615-bazi-reading-task.md` | 新增 | 任务拆解文档 |
| 文档 | `AICoding/FeatureDocs/20260615-bazi-reading/20260615-bazi-reading-check.md` | 新增 | 自检文档 |
| 页面 | `src/app/bazi/page.tsx` | 新增 | 八字简批页面 |
| API | `src/app/api/bazi-readings/route.ts` | 新增 | 八字简批 API |
| 常量 | `src/features/bazi/constants.ts` | 新增 | 表单选项、长度限制、中国大陆城市选项 |
| 类型 | `src/features/bazi/types/bazi.ts` | 新增 | 八字简批业务类型 |
| schema | `src/features/bazi/schemas/baziSchema.ts` | 新增 | 请求和 AI 输出结构校验 |
| service | `src/features/bazi/services/baziPromptService.ts` | 新增 | 独立 Prompt 模板 |
| service | `src/features/bazi/services/baziReadingService.ts` | 新增 | DeepSeek 调用和响应解析 |
| 组件 | `src/features/bazi/components/BaziReadingForm.tsx` | 新增 | 表单与请求交互 |
| 组件 | `src/features/bazi/components/BaziReadingResult.tsx` | 新增 | 报告展示 |

## 6. hooks 设计

本期不新增独立 hook，表单状态集中在 `BaziReadingForm` 内处理。

## 7. service 设计

| service | 文件路径 | 职责 |
| --- | --- | --- |
| `baziPromptService.ts` | `src/features/bazi/services/baziPromptService.ts` | 生成 system prompt 和 user prompt |
| `baziReadingService.ts` | `src/features/bazi/services/baziReadingService.ts` | 读取 DeepSeek 配置、发起请求、校验 AI JSON 输出 |

## 8. 类型设计

| 类型名 | 文件路径 | 用途 |
| --- | --- | --- |
| `BaziReadingRequest` | `src/features/bazi/schemas/baziSchema.ts` | API 请求类型 |
| `BaziReadingResult` | `src/features/bazi/schemas/baziSchema.ts` | API 返回类型 |
| `BaziReadingApiResponse` | `src/features/bazi/types/bazi.ts` | 前端请求响应类型 |

## 9. 表单校验

- 使用项目已有 `zod`。
- 昵称 1-16 字。
- 出生日期必填，限制在合理日期范围内。
- 出生时间状态为 `exact` 时，出生时间必填。
- 出生时间状态为 `period` 时，大概出生时段必填。
- 性别、出生时间状态、大概出生时段、出生城市、关注方向必须来自固定选项。
- 出生城市使用“省份-城市”合并选项，例如 `浙江省-杭州市`。
- 具体出生地可选并限制长度。
- 当前状态可选，最多 160 字。

## 10. 权限规则

- 无登录要求。
- 无权限控制。
- 无次数扣减。

## 11. 错误处理

- API 对 Zod 校验错误返回 `INVALID_BAZI_READING_REQUEST`。
- DeepSeek 未配置返回 `AI_SERVICE_NOT_CONFIGURED`。
- DeepSeek 鉴权、额度、频率限制分别返回稳定错误码。
- AI JSON 为空、非 JSON、结构不匹配时返回稳定错误码。
- 前端展示友好中文错误，不展示原始异常对象。

## 12. 测试方案

- 运行 `pnpm run lint` 检查类型和代码规范。
- 手动访问 `/bazi`，验证页面可渲染。
- 手动测试表单校验：
  - 空昵称
  - 未选择出生时间但状态为准确时间
  - 不知道出生时间时可提交
- 在未配置 DeepSeek API Key 时，验证友好错误提示。

## 13. 命名确认清单

- 功能短名：`bazi-reading`
- 分支名：`feature/20260615-bazi-reading`
- 页面路径：`/bazi`
- API 路径：`/api/bazi-readings`
- 组件：`BaziReadingForm`、`BaziReadingResult`
- service：`baziPromptService.ts`、`baziReadingService.ts`
- schema：`baziSchema.ts`
- types：`bazi.ts`
- 不新增依赖。
- 不新增数据库对象。

## 14. 风险与取舍

- 本期不引入排盘依赖，因此不输出专业四柱、十神、大运等确定性结果。
- 本期按北京时间和中国大陆城市处理，不支持海外时区。
- 未知出生时间只做三柱简批语义提示，结果完整度较低。
- 后期如需可靠排盘，需要重新设计农历转换、节气、时区、夏令时和真太阳时方案。

## 15. 待确认问题

当前无待确认问题。本期按已确认 MVP 范围执行。
