import { cookies, headers } from "next/headers";

import { auth } from "@/lib/auth";
import { ensureCompanyForUser } from "@/data-access/companies";
import { listOwnedWorkspaces } from "@/data-access/companies-list";
import { fetchRoadmapItemsForCompany } from "@/data-access/roadmap-items";
import { countSuggestionsByStatus } from "@/data-access/community-suggestions";

export default async function DashboardHome() {
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

  const features = await fetchRoadmapItemsForCompany(company.id);
  const suggestionCounts = await countSuggestionsByStatus(company.id);
  const activeFeatures = features.filter((feature) => (feature.status ?? "planned") !== "completed").length;
  const workspaces = await listOwnedWorkspaces(session.user.id);
  const currentWorkspaceName = workspaces.find((w) => w.id === company.id)?.name ?? company.name;

  return (
    <section className="space-y-10">
      <div className="dashboard-grid">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)_minmax(0,320px)]">
          <div className="space-y-6">
            <div className="dashboard-card space-y-8">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                  Snapshot
                </p>
                <p className="mt-4 text-[3.5rem] font-semibold leading-none tracking-tight text-foreground">
                  {activeFeatures}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Active features sitting in your backlog for {currentWorkspaceName}.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="rounded-2xl border border-dashed border-[color:var(--outline-soft)] bg-[color:var(--highlight)] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Next milestone
                  </p>
                  <p className="mt-3 text-lg font-semibold text-foreground">
                    Review community suggestions
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    There are {suggestionCounts.pending} ideas waiting for moderation. Approve, dismiss, or convert them into backlog items.
                  </p>
                </div>
                <div className="rounded-2xl border border-dashed border-[color:var(--outline-soft)] bg-[color:var(--surface-elevated)] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Suggestion queue
                  </p>
                  <p className="mt-3 text-lg font-semibold text-foreground">
                    {suggestionCounts.pending} pending · {suggestionCounts.approved} approved
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Moderate new ideas to keep the backlog tidy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="dashboard-card dashboard-card--highlight space-y-6">
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                Workspace health
              </p>
              <h2 className="text-4xl font-semibold tracking-tight text-foreground">
                Stay ahead of your roadmap
              </h2>
              <p className="text-base text-muted-foreground">
                Review community feedback, convert approved suggestions into features, and keep the backlog lean.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-[color:var(--outline-soft)] bg-[color:var(--surface-elevated)] px-3 py-1 text-xs font-medium text-foreground">
                  {suggestionCounts.approved} suggestion{suggestionCounts.approved === 1 ? "" : "s"} approved
                </span>
                <span className="inline-flex items-center rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                  {activeFeatures} active feature{activeFeatures === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <div className="dashboard-card space-y-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Ask Satori anything
                </p>
                <div className="inline-flex items-center rounded-full border border-[color:var(--outline-soft)] bg-[color:var(--surface-elevated)] px-3 py-1 text-xs font-medium text-muted-foreground">
                  Coming soon
                </div>
              </div>
              <div className="rounded-2xl border border-dashed border-[color:var(--outline-soft)] bg-[color:var(--surface-elevated)] px-5 py-4 text-sm text-muted-foreground">
                Once you start shipping features, this space becomes your go-to teammate for quick context and
                planning nudges.
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="dashboard-card space-y-5">
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                Do this next
              </p>
              <div className="space-y-4">
                <div className="rounded-2xl border border-[color:var(--outline-soft)] bg-card px-5 py-4 shadow-[0_6px_0_var(--shadow-color)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Feature backlog</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        No features created yet. Add your first initiative to start collecting upvotes.
                      </p>
                    </div>
                    <span className="mt-1 inline-flex min-w-max items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                      Start
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl border border-[color:var(--outline-soft)] bg-card px-5 py-4 shadow-[0_6px_0_var(--shadow-color)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Feedback signals</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Hook up inbound feedback sources to see sentiment and volume trends as they roll in.
                      </p>
                    </div>
                    <span className="mt-1 inline-flex min-w-max items-center rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-[var(--accent-foreground)]">
                      Connect
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card space-y-4">
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                Side quests
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block size-2 rounded-full bg-primary" />
                  Invite teammates to collaborate from day one.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block size-2 rounded-full bg-[var(--accent)]" />
                  Draft a welcome note for future feedback contributors.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block size-2 rounded-full bg-foreground" />
                  Explore analytics once your first feature is live.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
