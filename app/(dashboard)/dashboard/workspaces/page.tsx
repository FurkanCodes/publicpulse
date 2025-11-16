import { cookies, headers } from "next/headers";

import { ensureCompanyForUser } from "@/data-access/companies";
import { getCompanySettings } from "@/data-access/company-settings";
import { listCommunitySuggestions } from "@/data-access/community-suggestions";
import { listOwnedWorkspaces } from "@/data-access/companies-list";
import { getPlanUsageForUser } from "@/data-access/plans";
import { auth } from "@/lib/auth";
import { CreateWorkspacePanel } from "@/components/dashboard/workspaces/create-workspace-panel";
import { WorkspaceDirectoryPanel } from "@/components/dashboard/workspaces/workspace-directory-panel";
import { CommunityAccessPanel } from "@/components/dashboard/workspaces/community-access-panel";

export default async function WorkspacesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const preferredWorkspaceId = (await cookies()).get("selected_workspace_id")?.value;
  const company = await ensureCompanyForUser(
    {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
    preferredWorkspaceId,
  );

  const { plan, usage } = await getPlanUsageForUser(session.user.id);
  const ownedWorkspaces = await listOwnedWorkspaces(session.user.id);
  const settings = await getCompanySettings(company.id);
  const pendingSuggestions = await listCommunitySuggestions(company.id, "pending");
  const allSuggestions = await listCommunitySuggestions(company.id, "all");
  const approvedCount = allSuggestions.filter((item) => item.status === "approved").length;
  const dismissedCount = allSuggestions.filter((item) => item.status === "dismissed").length;

  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Workspaces</h1>
        <p className="text-sm text-muted-foreground">
          Launch boards, manage access, and keep your public links organised.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <CreateWorkspacePanel
          planName={plan.name}
          companiesUsed={usage.companiesUsed}
          companyLimit={usage.companyLimit}
          companiesRemaining={usage.companiesRemaining}
        />
        <WorkspaceDirectoryPanel workspaces={ownedWorkspaces} />
      </div>

      <CommunityAccessPanel
        companyId={company.id}
        planName={plan.name}
        planAllows={Boolean(plan.allowPublicSuggestions)}
        enabled={settings?.enablePublicSuggestions ?? false}
        requireAccount={settings?.requireAccountForSuggestions ?? true}
        maxPerUser={settings?.maxPublicSuggestionsPerUser ?? 3}
        pendingSuggestions={pendingSuggestions}
        approvedCount={approvedCount}
        dismissedCount={dismissedCount}
      />
    </section>
  );
}
