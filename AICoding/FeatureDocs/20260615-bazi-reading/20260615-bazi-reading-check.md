# 功能自检文档

## 1. 本次完成内容

- 创建八字简批 FeatureDocs。
- 创建 `/bazi` 页面。
- 创建 `/api/bazi-readings` API。
- 创建八字简批表单、结果展示组件、schema、types、prompt service 和 reading service。
- 本期仅支持公历/阳历、中国大陆城市、未知出生时间三柱简批。
- 表单已调整为性别、具体时间/大概时段/未知时间、合并出生城市、可选具体出生地。
- 期望语气和轻量娱乐提醒已移除，输出语气由系统 Prompt 控制。
- 本期不做数据库保存、登录、会员、次数扣减和新增依赖。

## 2. 修改文件列表

| 文件 | 修改说明 |
| --- | --- |
| `AICoding/FeatureDocs/20260615-bazi-reading/20260615-bazi-reading-requirement.md` | 新增需求文档 |
| `AICoding/FeatureDocs/20260615-bazi-reading/20260615-bazi-reading-design.md` | 新增技术方案文档 |
| `AICoding/FeatureDocs/20260615-bazi-reading/20260615-bazi-reading-task.md` | 新增任务拆解文档并更新任务状态 |
| `AICoding/FeatureDocs/20260615-bazi-reading/20260615-bazi-reading-check.md` | 新增自检文档 |
| `src/app/bazi/page.tsx` | 新增八字简批页面 |
| `src/app/api/bazi-readings/route.ts` | 新增八字简批 API |
| `src/features/bazi/constants.ts` | 新增表单选项和校验长度常量 |
| `src/features/bazi/types/bazi.ts` | 新增前端 API 响应类型 |
| `src/features/bazi/schemas/baziSchema.ts` | 新增请求和 AI 输出 schema |
| `src/features/bazi/services/baziPromptService.ts` | 新增八字简批独立 Prompt |
| `src/features/bazi/services/baziReadingService.ts` | 新增 DeepSeek 调用和响应解析 |
| `src/features/bazi/components/BaziReadingForm.tsx` | 新增表单与请求交互 |
| `src/features/bazi/components/BaziReadingResult.tsx` | 新增报告展示 |

## 3. 验证方式

| 验证项 | 验证命令或方式 | 结果 |
| --- | --- | --- |
| 代码规范 | `pnpm run lint` | 通过 |
| 生产构建 | `pnpm run build` | 通过 |
| 页面访问 | `Invoke-WebRequest http://localhost:3000/bazi` | 返回 200 |
| API 直测 | `POST /api/bazi-readings` | 返回 `success: true` 和结构化报告 |
| 桌面浏览器检查 | in-app Browser 访问 `/bazi` | 标题、核心字段、提交按钮可见，无页面 console error |
| 移动端浏览器检查 | 390px 宽度访问 `/bazi` | 核心内容可见，无横向溢出，无页面 console error |
| 表单调整后二次检查 | in-app Browser 访问 `/bazi` | 已移除称谓倾向、期望语气、轻量娱乐提醒；已显示性别、大概出生时段、出生城市、具体出生地 |
| 大概时段 API 直测 | `POST /api/bazi-readings`，`birthTimeStatus=period` | 返回 `success: true` 和结构化报告 |

## 4. 功能检查

- [x] 页面是否可访问
- [x] 表单校验是否正常
- [x] API 是否返回预期结果
- [x] 错误状态是否处理
- [x] 加载状态是否处理
- [x] 空状态是否处理
- [x] 权限限制是否正确
- [x] 移动端基础布局是否正常

## 5. 测试结果

- `pnpm run lint` 通过。
- `pnpm run build` 通过。
- `/bazi` 页面返回 200。
- `/api/bazi-readings` 使用本地 DeepSeek 配置直测成功，返回结构化报告。
- 桌面与移动端基础浏览器检查通过。
- 表单体验调整后，`pnpm run lint` 通过。
- 大概出生时段路径 API 直测成功。

## 6. 已知问题

- 未配置 `DEEPSEEK_API_KEY` 时无法生成真实 AI 报告，会展示“AI 解读服务尚未配置”。
- 首页八字入口仍指向 `#bazi`，本次未修改 `src/lib/constants.ts`，需要后续确认后再改为 `/bazi`。
- `AICoding/` 当前被 `.gitignore` 忽略，FeatureDocs 文件已创建在本地，但后续如需提交文档，需要使用强制添加。

## 7. 风险说明

- 本期不做专业排盘，不输出四柱、十神、大运和流年。
- 出生城市使用固定“省份-城市”合并选项；具体出生地为可选文本输入。

## 8. 待用户验收事项

- 验收 `/bazi` 页面表单填写、校验和报告展示。
- 确认是否允许后续把首页和导航中的八字入口从 `#bazi` 改为 `/bazi`。
