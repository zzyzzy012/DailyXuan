import Link from "next/link";
import { LogOut, Sparkles, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  let userEmail: string | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    userEmail = user?.email ?? null;
  } catch {
    userEmail = null;
  }

  async function handleSignOut() {
    "use server";

    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          {NAV_ITEMS.slice(0, 4).map((item) => (
            <Button key={item.href} variant="ghost" size="sm" asChild>
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {userEmail ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/account" className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  <span className="w-28 truncate sm:w-40">{userEmail}</span>
                </Link>
              </Button>
              <form action={handleSignOut}>
                <Button type="submit" variant="ghost" size="sm" className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span>退出</span>
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">登录</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">注册</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
