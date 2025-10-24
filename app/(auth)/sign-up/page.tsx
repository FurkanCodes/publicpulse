import { Check } from "lucide-react";

import SignUp from "@/components/sign-up";
import { Badge } from "@/components/ui/badge";

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_62%)] dark:bg-[radial-gradient(circle_at_top,_rgba(80,99,225,0.28),_transparent_70%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-30 hidden w-1/2 bg-[linear-gradient(140deg,rgba(59,130,246,0.12),transparent)] dark:bg-[linear-gradient(140deg,rgba(80,99,225,0.22),transparent)] md:block" />

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-12 md:grid-cols-[minmax(0,1.05fr)_minmax(0,420px)]">
        <div className="space-y-6 text-center md:text-left">
          <Badge className="mx-auto md:mx-0 border border-primary/20 bg-primary/10 text-primary">
            Now onboarding teams
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Shape public feedback into a living roadmap.
          </h1>
          <p className="text-balance text-base text-muted-foreground sm:text-lg">
            PublicPulse keeps every stakeholder aligned by bringing customer
            signals, prioritisation, and launch planning into one shared
            workspace.
          </p>
          <ul className="mx-auto flex max-w-md flex-col gap-3 text-left text-sm text-muted-foreground md:mx-0">
            <li className="flex items-center gap-3">
              <Check className="h-4 w-4 text-primary" aria-hidden />
              Collect feedback from web, email, and community touchpoints.
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-4 w-4 text-primary" aria-hidden />
              Prioritise initiatives with shared scoring frameworks.
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-4 w-4 text-primary" aria-hidden />
              Celebrate launches with automated status updates.
            </li>
          </ul>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 blur-3xl bg-primary/10 dark:bg-primary/20" />
          <SignUp />
        </div>
      </div>
    </div>
  );
}
