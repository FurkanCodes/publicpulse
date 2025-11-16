import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/sign-out-button";
import { getPlanUsageForUser } from "@/data-access/plans";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    const next = encodeURIComponent("/dashboard/settings");
    redirect(`/sign-in?redirectTo=${next}`);
  }

  const { plan, usage } = await getPlanUsageForUser(session.user.id);

  const planUsageLabel =
    usage.companyLimit === null
      ? `${usage.companiesUsed} workspaces in use`
      : `${usage.companiesUsed}/${usage.companyLimit} workspaces in use`;
  const remainingLabel =
    usage.companiesRemaining === null
      ? "No limit on new workspaces"
      : `${usage.companiesRemaining} remaining`;
  const seatLabel =
    plan.seatLimit === null
      ? "Unlimited seats included"
      : `${plan.seatLimit} teammate${plan.seatLimit === 1 ? "" : "s"} included`;
  const featureLabel =
    plan.featureLimit === null
      ? "Unlimited roadmap items"
      : `Track up to ${plan.featureLimit} roadmap items`;
  const canSubmitSuggestions = plan.allowPublicSuggestions;
  const displayName = session.user.name ?? session.user.email ?? "Account";

  return (
    <section className="space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Account settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your PublicPulse account, review plan details, and control access.
          </p>
        </div>
        <SignOutButton variant="ghost" size="sm" />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-4 shadow-[0_6px_0_var(--shadow-color)]">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Plan</p>
          <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">{plan.name}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {canSubmitSuggestions ? "Community suggestions permitted" : "Community suggestions locked"}
          </p>
        </div>
        <div className="rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-4 shadow-[0_6px_0_var(--shadow-color)]">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Workspace usage</p>
          <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">{planUsageLabel}</p>
          <p className="mt-2 text-xs text-muted-foreground">{remainingLabel}</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-4 shadow-[0_6px_0_var(--shadow-color)]">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Seats</p>
          <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">{seatLabel}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Invite collaborators from workspace settings to share ownership.
          </p>
        </div>
        <div className="rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-4 shadow-[0_6px_0_var(--shadow-color)]">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Roadmap capacity</p>
          <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">{featureLabel}</p>
          <p className="mt-2 text-xs text-muted-foreground">Upgrade when you need more runway for initiatives.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div id="plan" className="dashboard-card space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Plan & limits</p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Stay within your current plan
            </h2>
            <p className="text-sm text-muted-foreground">
              Review what&apos;s included and decide when to expand capacity.
            </p>
          </div>
          <ul className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
            <li className="rounded-2xl border border-dashed border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Workspaces
              </p>
              <p className="mt-3 font-semibold text-foreground">
                {plan.companyLimit === null
                  ? "Unlimited workspaces"
                  : `${plan.companyLimit} workspace${plan.companyLimit === 1 ? "" : "s"} included`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Separate customer-facing boards with ease.</p>
            </li>
            <li className="rounded-2xl border border-dashed border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Collaborators
              </p>
              <p className="mt-3 font-semibold text-foreground">
                {plan.seatLimit === null
                  ? "Unlimited seats"
                  : `${plan.seatLimit} teammate${plan.seatLimit === 1 ? "" : "s"} included`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Invite teammates to manage roadmap and feedback.</p>
            </li>
            <li className="rounded-2xl border border-dashed border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Roadmap items
              </p>
              <p className="mt-3 font-semibold text-foreground">
                {plan.featureLimit === null
                  ? "Unlimited features"
                  : `Track up to ${plan.featureLimit} roadmap items`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Keep every validated initiative in one place.</p>
            </li>
            <li className="rounded-2xl border border-dashed border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Community access
              </p>
              <p className="mt-3 font-semibold text-foreground">
                {canSubmitSuggestions ? "Public suggestions enabled" : "Private feedback only"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Toggle customer submissions from the workspaces hub when you&apos;re ready.
              </p>
            </li>
          </ul>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/workspaces">Manage plan & workspaces</Link>
          </Button>
        </div>

        <div className="dashboard-card space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Account profile</p>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{displayName}</h2>
            <p className="text-xs text-muted-foreground">
              {session.user.email ?? "Update your profile details to keep teammates in the loop."}
            </p>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">User ID</p>
              <p className="mt-1 font-mono text-xs text-foreground">{session.user.id}</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Sign-in provider</p>
              <p className="mt-1 text-sm text-foreground">
                {session.user.email ? "Email & password" : "Social authentication"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Need to update your details? Reach out to support while in-app editing is on the roadmap.
            </p>
            <SignOutButton variant="outline" size="sm">
              Sign out
            </SignOutButton>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="dashboard-card space-y-5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Security & sessions</p>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Keep your account secure</h2>
            <p className="text-sm text-muted-foreground">
              Multi-factor authentication and session management controls are on the roadmap. For now, contact
              support if you suspect unauthorised access.
            </p>
          </div>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="mailto:support@publicpulse.app">Contact support</Link>
          </Button>
        </div>

        <div className="dashboard-card space-y-5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Notifications</p>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Product updates & releases
            </h2>
            <p className="text-sm text-muted-foreground">
              Subscribe to release notes so you know when new collaboration features land.
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="mailto:hello@publicpulse.app?subject=Release%20notes%20list">Join release list</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
