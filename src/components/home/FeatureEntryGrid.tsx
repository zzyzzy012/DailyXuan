import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FEATURE_ENTRIES } from "@/lib/constants";

export function FeatureEntryGrid() {
  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8"
      aria-labelledby="feature-entry-title"
    >
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">网站模块</p>
        <h2 id="feature-entry-title" className="text-2xl font-semibold sm:text-3xl">
          选择你今天想探索的方向
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURE_ENTRIES.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card key={feature.id} id={feature.id} className="flex h-full flex-col">
              <CardHeader className="gap-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <Badge variant="outline">{feature.badge}</Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-between" asChild>
                  <a href={feature.href}>
                    {feature.cta}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
