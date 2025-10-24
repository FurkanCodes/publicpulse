import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

import { auth } from "@/lib/auth";
import { ensureCompanyForUser } from "@/data-access/companies";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardNav, NavItem } from "@/components/dashboard/dashboard-nav";
import Link from "next/link";

const navigation: NavItem[] = [
  { name: "Overview", href: "/dashboard", icon: "overview" },
  { name: "Features", href: "/dashboard/features", icon: "features" },
  { name: "Feedback", href: "/dashboard/feedback", icon: "feedback" },
  { name: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    const next = encodeURIComponent("/dashboard");
    redirect(`/sign-in?redirectTo=${next}`);
  }

  const company = await ensureCompanyForUser({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  });

  const displayName = company.name;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative flex min-h-screen">
        <aside className="hidden w-64 border-r border-border/80 bg-card/60 px-4 py-8 lg:block">
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Workspace
              </p>
              <p className="mt-2 font-semibold">{displayName}</p>
            </div>
            <DashboardNav items={navigation} />
          </div>
        </aside>
        <div className="flex flex-1 flex-col">
          <header className="border-b border-border/80 bg-card/80 backdrop-blur">
            <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div className="space-y-1">
                <h1 className="text-lg font-semibold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Track your features, understand feedback, and keep launches on
                  course.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                
                <Button size="sm" className="gap-2">
                  <Link href="/dashboard/features" className="flex gap-2 justify-center items-center">
                    <Sparkles className="h-4 w-4" aria-hidden />
                    New feature
                  </Link>
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 bg-muted/20 px-4 py-10 lg:px-8">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
