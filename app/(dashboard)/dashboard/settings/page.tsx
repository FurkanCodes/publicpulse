import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { CreateWorkspaceForm } from "@/components/dashboard/create-workspace-form";
import { CommunitySuggestionsToggle } from "@/components/dashboard/community-suggestions-toggle";
import { CommunitySuggestionQueue } from "@/components/dashboard/community-suggestion-queue";
import { WorkspaceList } from "@/components/dashboard/workspace-list";
import { SignOutButton } from "@/components/sign-out-button";
import { getCompanySettings } from "@/data-access/company-settings";
import { ensureCompanyForUser } from "@/data-access/companies";
import { listCommunitySuggestions } from "@/data-access/community-suggestions";
import { listOwnedWorkspaces } from "@/data-access/companies-list";
import { getPlanUsageForUser } from "@/data-access/plans";
import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    const next = encodeURIComponent("/dashboard/settings");
    redirect(`/sign-in?redirectTo=${next}`);
  }

  const { plan, usage } = await getPlanUsageForUser(session.user.id);
  const preferredWorkspaceId = (await cookies()).get("selected_workspace_id")?.value;
  const company = await ensureCompanyForUser(
    {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
    preferredWorkspaceId,
  );
  const settings = await getCompanySettings(company.id);
  const pendingSuggestions = await listCommunitySuggestions(company.id, "pending");
  const allSuggestions = await listCommunitySuggestions(company.id, "all");
  const approvedCount = allSuggestions.filter((item) => item.status === "approved").length;
  const dismissedCount = allSuggestions.filter((item) => item.status === "dismissed").length;
  const ownedWorkspaces = await listOwnedWorkspaces(session.user.id);

  return (
    <section className="space-y-8">
      <div id="upgrade" className="dashboard-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Workspace settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage how your team collaborates and how public contributors interact with your board.
            </p>
          </div>
          <SignOutButton variant="ghost" size="sm" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Plan includes
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                {plan.companyLimit === null
                  ? "Unlimited workspaces for organizing feedback across teams."
                  : `${plan.companyLimit} workspace${plan.companyLimit === 1 ? "" : "s"} to separate customer or product areas.`}
              </li>
              <li>
                {plan.seatLimit === null
                  ? "Unlimited collaborator seats per workspace."
                  : `${plan.seatLimit} teammate seat${plan.seatLimit === 1 ? "" : "s"} included.`}
              </li>
              <li>
                {plan.featureLimit === null
                  ? "Track an unlimited number of roadmap items."
                  : `Track up to ${plan.featureLimit} roadmap items.`}
              </li>
            </ul>
          </div>
          <div className="dashboard-card bg-[color:var(--surface-subtle)]/60 shadow-none">
            <CreateWorkspaceForm
              planName={plan.name}
              companiesUsed={usage.companiesUsed}
              companyLimit={usage.companyLimit}
              companiesRemaining={usage.companiesRemaining}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-card space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
            Community participation
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Invite customers to propose ideas
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            When enabled, visitors on your public board can submit new suggestions. Approved submissions
            appear alongside your roadmap backlog.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
          <CommunitySuggestionsToggle
            companyId={company.id}
            enabled={settings?.enablePublicSuggestions ?? false}
            planAllows={Boolean(plan.allowPublicSuggestions)}
            planName={plan.name}
            requireAccount={settings?.requireAccountForSuggestions ?? true}
            maxPerUser={settings?.maxPublicSuggestionsPerUser ?? 3}
          />
          <div className="rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-4 py-4 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Suggestion activity
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {pendingSuggestions.length} pending · {approvedCount} approved · {dismissedCount} dismissed
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Per-user limit: {settings?.maxPublicSuggestionsPerUser ?? 3}
            </p>
          </div>
        </div>
        {pendingSuggestions.length > 0 ? (
          <CommunitySuggestionQueue
            companyId={company.id}
            suggestions={pendingSuggestions}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            No pending suggestions right now. When new ideas come in, they’ll appear here for review.
          </p>
        )}
      </div>

      <div className="dashboard-card space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
            Your workspaces
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Manage public boards and links
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Share the public board link with customers or jump straight into the dashboard.
          </p>
        </div>
        <WorkspaceList workspaces={ownedWorkspaces} />
      </div>
    </section>
  );
}
