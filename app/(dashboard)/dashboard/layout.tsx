import type { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

import { auth } from "@/lib/auth";
import Link from "next/link";

import { ensureCompanyForUser } from "@/data-access/companies";
import { listOwnedWorkspaces } from "@/data-access/companies-list";
import { getPlanUsageForUser } from "@/data-access/plans";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardNav, NavItem } from "@/components/dashboard/dashboard-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";

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

  const cookieStore = cookies();
  const cookieWorkspaceId = (await cookieStore).get("selected_workspace_id")?.value;
  const company = await ensureCompanyForUser(
    {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
    cookieWorkspaceId,
  );

  const workspaces = await listOwnedWorkspaces(session.user.id);
  const activeWorkspaceId = company.id;
  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? {
    id: company.id,
    name: company.name,
    slug: company.slug,
    createdAt: company.createdAt,
  };

  const displayName = activeWorkspace.name;
  const { plan, usage } = await getPlanUsageForUser(session.user.id);
  const companyLimitLabel =
    usage.companyLimit === null
      ? "Unlimited workspaces"
      : `${usage.companiesUsed}/${usage.companyLimit} workspaces`;
  const remainingLabel =
    usage.companiesRemaining === null
      ? "Unlimited remaining"
      : `${usage.companiesRemaining} remaining`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-[var(--gradient-base)] via-[var(--gradient-mid)] to-[var(--gradient-glow)]">
        <header className="dashboard-header backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-1 flex-col gap-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border-[1.5px] border-[color:var(--outline-strong)] bg-[color:var(--surface-floating)] text-base font-semibold uppercase tracking-tight">
                    {displayName?.charAt(0) ?? "P"}
                  </div>
                  <div className="min-w-[220px]">
                    <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                      Workspace
                    </p>
                    <h1 className="mt-2 text-[1.85rem] font-semibold tracking-tight text-foreground">
                      {displayName}
                    </h1>
                  </div>
                </div>
                <p className="max-w-xl text-sm text-muted-foreground">
                  Track your features, understand feedback, and keep launches on course. Everything you need
                  lives here.
                </p>
                <div className="flex flex-wrap items-center gap-3 rounded-full border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-4 py-2 text-xs shadow-[0_6px_0_var(--shadow-color)]">
                  <span className="font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Plan: {plan.name}
                  </span>
                  <span className="text-muted-foreground">{companyLimitLabel}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-1 text-[0.7rem] font-semibold text-primary">
                    {remainingLabel}
                  </span>
                  <Link
                    href="/dashboard/settings#upgrade"
                    className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Manage plan
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-start gap-3 md:justify-end">
                <WorkspaceSwitcher workspaces={workspaces} activeWorkspaceId={activeWorkspaceId} />
                <ThemeToggle />
                <SignOutButton variant="outline" size="sm">
                  Sign out
                </SignOutButton>
                <Button size="default" className="gap-2" asChild>
                  <Link href="/dashboard/features" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" aria-hidden />
                    New feature
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-full border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-4 py-3 shadow-[0_8px_0_var(--shadow-color)]">
              <DashboardNav items={navigation} />
            </div>
          </div>
        </header>
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1200px] px-6 py-12 lg:py-14">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
