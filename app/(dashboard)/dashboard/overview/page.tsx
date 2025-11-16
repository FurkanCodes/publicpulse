import Link from "next/link";
import { cookies, headers } from "next/headers";

import { auth } from "@/lib/auth";
import { ensureCompanyForUser } from "@/data-access/companies";
import { listOwnedWorkspaces } from "@/data-access/companies-list";
import { fetchRoadmapItemsForCompany } from "@/data-access/roadmap-items";
import { countSuggestionsByStatus, listCommunitySuggestions } from "@/data-access/community-suggestions";
import { Button } from "@/components/ui/button";
import { PendingQueueDropdown } from "@/components/dashboard/pending-queue-dropdown";

export default async function DashboardOverviewPage() {
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
  const pendingSuggestions = await listCommunitySuggestions(company.id, "pending");
  const topPendingSuggestions = pendingSuggestions.slice(0, 3);
  const hasMorePending = pendingSuggestions.length > topPendingSuggestions.length;

  const numberFormatter = new Intl.NumberFormat();
  const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

  const metrics = [
    {
      label: "Active features",
      value: numberFormatter.format(activeFeatures),
      description:
        activeFeatures === 0
          ? "Nothing in the backlog yet."
          : "Features currently moving through your workflow.",
    },
    {
      label: "Pending suggestions",
      value: numberFormatter.format(suggestionCounts.pending),
      description:
        suggestionCounts.pending === 0
          ? "No items waiting for review."
          : "Ideas awaiting moderation from customers or teammates.",
    },
    {
      label: "Workspaces",
      value: numberFormatter.format(workspaces.length),
      description:
        workspaces.length === 1
          ? "Organising a single workspace."
          : "Workspaces available across your organisation.",
    },
  ];

  const focusItems: string[] = [];

  if (suggestionCounts.pending > 0) {
    focusItems.push(
      `Moderate ${numberFormatter.format(suggestionCounts.pending)} pending suggestion${
        suggestionCounts.pending === 1 ? "" : "s"
      } to keep feedback fresh.`,
    );
  } else {
    focusItems.push("Invite customers to submit ideas so you can capture new signals.");
  }

  if (activeFeatures === 0) {
    focusItems.push("Create your first feature to start building momentum.");
  } else {
    focusItems.push(
      `Review progress on ${numberFormatter.format(activeFeatures)} active feature${
        activeFeatures === 1 ? "" : "s"
      } and confirm next steps.`,
    );
  }

  if (suggestionCounts.approved > 0) {
    focusItems.push(
      `Promote ${numberFormatter.format(suggestionCounts.approved)} approved suggestion${
        suggestionCounts.approved === 1 ? "" : "s"
      } into roadmap items.`,
    );
  } else {
    focusItems.push("Approve promising suggestions so they can progress into the roadmap.");
  }

  return (
    <section className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="dashboard-card space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                This week in {currentWorkspaceName}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                Keep momentum with clear priorities
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Scan the key signals, triage new feedback, and line up the next feature to tackle.
              </p>
            </div>
            <Button asChild size="sm" className="mt-2 md:mt-0">
              <Link href="/dashboard/features">Add a feature</Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-4 shadow-[0_6px_0_var(--shadow-color)]"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                  {metric.value}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-card space-y-4">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
            Quick actions
          </p>
          <div className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link href="/dashboard/features">Plan upcoming work</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link href="/dashboard/workspaces#community">Review feedback settings</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link href="/dashboard/workspaces">Manage workspaces</Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-dashed border-[color:var(--outline-soft)] bg-[color:var(--surface-subtle)]/60 px-4 py-4 text-xs text-muted-foreground">
            Keep these handy while you triage feedback or spin up new initiatives.
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="dashboard-card space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                Feedback queue
              </p>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                Pending suggestions
              </h3>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              {numberFormatter.format(suggestionCounts.pending)} waiting
            </span>
          </div>
          {topPendingSuggestions.length > 0 ? (
            <>
              <ul className="space-y-3">
                {topPendingSuggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="rounded-2xl border border-[color:var(--outline-soft)] bg-card px-4 py-3 shadow-[0_4px_0_var(--shadow-color)]"
                  >
                    <p className="text-sm font-semibold text-foreground">{suggestion.title}</p>
                    {suggestion.description ? (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {suggestion.description}
                      </p>
                    ) : null}
                    <p className="mt-3 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                      Submitted {dateFormatter.format(new Date(suggestion.createdAt))}
                    </p>
                  </li>
                ))}
              </ul>
              {hasMorePending ? (
                <p className="text-xs text-muted-foreground">
                  Showing the latest {topPendingSuggestions.length} suggestions. Review the full queue to see everything.
                </p>
              ) : null}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-6 text-sm text-muted-foreground">
              No pending suggestions right now. Share your public board to gather feedback, then moderate it here.
            </div>
          )}
          <PendingQueueDropdown
            pendingCount={suggestionCounts.pending}
            approvedCount={suggestionCounts.approved}
            dismissedCount={suggestionCounts.dismissed}
            suggestions={topPendingSuggestions.map((suggestion) => ({
              id: suggestion.id,
              title: suggestion.title,
              description: suggestion.description ?? null,
              createdAt: suggestion.createdAt,
            }))}
          />
        </div>

        <div className="dashboard-card space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
              Focus areas
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              What to tackle next
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {focusItems.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-block size-2 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-dashed border-[color:var(--outline-soft)] bg-[color:var(--surface-subtle)]/60 px-4 py-4 text-xs text-muted-foreground">
            Adjust your plan as you close feedback loops and promote suggestions into roadmap items.
          </div>
        </div>
      </div>
    </section>
  );
}
