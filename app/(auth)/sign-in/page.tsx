import { CalendarCheck, Inbox, LineChart } from "lucide-react";

import SignIn from "@/components/sign-in";
import { Badge } from "@/components/ui/badge";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_62%)] dark:bg-[radial-gradient(circle_at_top,_rgba(80,99,225,0.24),_transparent_70%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 -z-30 hidden w-1/2 bg-[linear-gradient(220deg,rgba(59,130,246,0.1),transparent)] dark:bg-[linear-gradient(220deg,rgba(80,99,225,0.2),transparent)] md:block" />

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-12 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="relative order-last space-y-6 text-left md:order-first">
          <Badge className="border border-primary/20 bg-primary/10 text-primary">
            Welcome back to PublicPulse
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Stay in sync with every customer signal.
          </h1>
          <p className="text-balance text-base text-muted-foreground sm:text-lg">
            Log in to triage feedback, align priorities, and keep the whole org
            informed with effortless status updates.
          </p>
          <dl className="grid gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                <Inbox className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <dt className="font-medium text-foreground">Unified inbox</dt>
                <dd>Capture requests from widgets, email, and community hubs.</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                <LineChart className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <dt className="font-medium text-foreground">Confident roadmap</dt>
                <dd>Prioritise using impact scoring and customer segments.</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                <CalendarCheck className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <dt className="font-medium text-foreground">Launch rituals</dt>
                <dd>Automate update posts and close the loop with voters.</dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 blur-3xl bg-primary/10 dark:bg-primary/20" />
          <SignIn />
        </div>
      </div>
    </div>
  );
}
