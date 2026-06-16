"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ACCOUNT_SECTION_OPTIONS,
  type AccountSection,
} from "@/features/account/constants";

type AccountShellProps = {
  sections: Record<AccountSection, React.ReactNode>;
};

export function AccountShell({ sections }: AccountShellProps) {
  return (
    <Tabs
      defaultValue="overview"
      orientation="vertical"
      className="flex w-full flex-col gap-0 rounded-2xl border bg-card/90 p-4 shadow-sm sm:p-5"
    >
      <div className="rounded-xl border bg-background px-4 py-4 lg:hidden">
        <TabsList className="w-full justify-start overflow-x-auto" variant="line">
          {ACCOUNT_SECTION_OPTIONS.map((section) => (
            <TabsTrigger
              key={section.value}
              value={section.value}
              className="shrink-0 whitespace-nowrap px-3"
            >
              <section.icon className="h-4 w-4" aria-hidden="true" />
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="flex min-h-[720px] flex-col gap-4 lg:flex-row">
        <aside className="hidden rounded-xl border bg-muted/20 lg:block lg:w-[280px] lg:shrink-0">
          <div className="space-y-1 p-5">
            <p className="px-3 pb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Account Modules
            </p>
            <TabsList className="h-auto w-full flex-col bg-transparent p-0" variant="line">
              {ACCOUNT_SECTION_OPTIONS.map((section) => (
                <TabsTrigger
                  key={section.value}
                  value={section.value}
                  className="h-auto w-full items-start justify-start rounded-xl border px-4 py-4 text-left data-active:border-border data-active:bg-background"
                >
                  <section.icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="space-y-1.5">
                    <span className="block text-sm font-medium">{section.label}</span>
                    <span className="block text-xs leading-5 text-muted-foreground">
                      {section.description}
                    </span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </aside>

        <div className="min-w-0 flex-1 rounded-xl border bg-background">
          {ACCOUNT_SECTION_OPTIONS.map((section) => (
            <TabsContent
              key={section.value}
              value={section.value}
              className="m-0 h-full w-full p-6"
            >
              <div className="w-full">{sections[section.value]}</div>
            </TabsContent>
          ))}
        </div>
      </div>
    </Tabs>
  );
}
