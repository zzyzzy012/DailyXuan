import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { USAGE_RULES } from "@/lib/constants";

export function FreeUsagePanel() {
  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8"
      aria-labelledby="usage-rule-title"
    >
      <div className="rounded-lg border bg-muted/30 p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">免费规则</p>
          <h2 id="usage-rule-title" className="text-2xl font-semibold sm:text-3xl">
            每日体验规则
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            登录后可每日免费体验 2 次 AI 解读：今日灵签解读独立 1 次，梦境解析、塔罗占卜和八字简批共享 1 次。抽签本身可先体验，生成 AI 解读会消耗对应次数。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {USAGE_RULES.map((rule) => {
            const Icon = rule.icon;

            return (
              <Card key={rule.title}>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <CardTitle className="text-lg">{rule.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">{rule.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
