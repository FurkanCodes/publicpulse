export default function DashboardHome() {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-dashed border-border/60 bg-card/50 p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Getting started
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Welcome to your workspace
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          We&apos;ll surface feature metrics, feedback signals, and team
          activity here once you begin adding items. The next milestone is to
          wire up feature creation via Next Safe Actions.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border/50 bg-background/50 p-6">
          <p className="text-sm font-medium text-foreground">Feature backlog</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No features created yet. Add your first initiative to start
            collecting upvotes.
          </p>
        </div>
        <div className="rounded-lg border border-border/50 bg-background/50 p-6">
          <p className="text-sm font-medium text-foreground">
            Feedback signals
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Hook up inbound feedback sources to see sentiment and volume trends
            as they roll in.
          </p>
        </div>
      </div>
    </section>
  );
}
