import { DISCLAIMER_TEXT, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-foreground">{SITE_NAME}</p>
          <p>今日运势 · 梦境解析 · 塔罗占卜 · 八字简批</p>
        </div>
        <p>{DISCLAIMER_TEXT}</p>
      </div>
    </footer>
  );
}
