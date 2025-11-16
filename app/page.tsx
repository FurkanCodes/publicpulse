

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Inbox,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { FadeIn } from "@/components/fade-in";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Workspace control centre",
    description:
      "Create and switch between workspaces in seconds. Every customer segment gets a focused hub without duct-taped tooling.",
    icon: Inbox,
  },
  {
    title: "Community suggestion queue",
    description:
      "Give customers a voice when you want it, pause submissions when you don’t. Moderate, approve, or dismiss from one queue.",
    icon: Target,
  },
  {
    title: "Roadmap ready features",
    description:
      "Promote approved ideas straight into backlog items so your roadmap always reflects what’s been validated.",
    icon: Rocket,
  },
  {
    title: "Usage & limit visibility",
    description:
      "Stay ahead of workspace limits with real-time counters and plan summaries baked into the dashboard.",
    icon: BarChart3,
  },
  {
    title: "Shareable workspace directory",
    description:
      "Copy public board links, jump into dashboards, and keep every stakeholder pointed at the right source of truth.",
    icon: Users,
  },
  {
    title: "Owner-only safeguards",
    description:
      "Only workspace owners can change community settings or moderate feedback, protecting your roadmap from surprise edits.",
    icon: ShieldCheck,
  },
];

const workflow = [
  {
    title: "Open the door",
    description:
      "Enable customer submissions when you’re ready for ideas and collect them in a tidy, owner-only queue.",
    icon: Sparkles,
  },
  {
    title: "Review with confidence",
    description:
      "Approve great suggestions, dismiss the rest, and keep track of who asked for what without spreadsheets.",
    icon: CheckCircle2,
  },
  {
    title: "Promote to roadmap",
    description:
      "Turn an approved suggestion into a feature card instantly, ready for prioritisation and delivery.",
    icon: Rocket,
  },
  {
    title: "Keep momentum",
    description:
      "Monitor workspace usage, switch boards, and keep stakeholders informed without bouncing between tools.",
    icon: Bell,
  },
];

const faqs = [
  {
    question: "Can PublicPulse sync with our existing product tools?",
    answer:
      "Yes. We integrate with Jira, Linear, Slack, HubSpot, and dozens more. Pull context in, push roadmap decisions back out.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Trackers, automations, and stakeholder seats are free during beta. Admin and workspace pricing will be usage-based after launch.",
  },
  {
    question: "Is customer data secure?",
    answer:
      "We encrypt data at rest and in transit, apply RBAC, and offer audit logs. SOC2 Type II is in-progress with quarterly pen tests.",
  },
  {
    question: "Do you support custom domains for public roadmaps?",
    answer:
      "Absolutely. Publish your roadmap on a branded domain with custom themes so it feels native to your product.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-background pb-28 pt-24">
          <div className="absolute inset-0 -z-20">
            <div className="absolute inset-x-0 top-[-40%] h-[520px] rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.22),_transparent_65%)] blur-3xl dark:bg-[radial-gradient(circle,_rgba(80,99,225,0.35),_transparent_70%)]" />
            <div className="absolute inset-x-0 bottom-[-50%] h-[420px] rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.12),_transparent_65%)] blur-3xl dark:bg-[radial-gradient(circle,_rgba(16,185,129,0.22),_transparent_70%)]" />
          </div>
          <div className="container relative z-10 mx-auto flex flex-col gap-16 px-4">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
              <div className="space-y-10">
                <FadeIn className="w-fit">
                  <Badge
                    variant="secondary"
                    className="w-fit border border-primary/30 bg-primary/10 text-primary"
                  >
                    New: interactive workspace tour now live
                  </Badge>
                </FadeIn>
                <FadeIn delay={120}>
                  <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.75rem]">
                    Build the roadmap{" "}
                    <span className="bg-gradient-to-r from-primary via-[var(--accent-cyan)] to-primary/70 bg-clip-text text-transparent">
                      your customers cheer for
                    </span>
                    .
                  </h1>
                </FadeIn>
                <FadeIn delay={220}>
                  <p className="text-balance text-lg text-muted-foreground sm:text-xl">
                    PublicPulse makes it effortless to collect every signal, back decisions with data,
                    and show stakeholders the plan—in one place that feels built for momentum.
                  </p>
                </FadeIn>
                <FadeIn delay={320} className="flex flex-wrap items-center gap-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/sign-up">
                      Start interactive tour
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/sign-in">Browse sample workspace</Link>
                  </Button>
                </FadeIn>
                <FadeIn delay={420} className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {["KT", "AL", "JD"].map((initials) => (
                        <span
                          key={initials}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xs font-semibold uppercase text-primary backdrop-blur"
                        >
                          {initials}
                        </span>
                      ))}
                    </div>
                    <div>
                      Product teams at{" "}
                      <span className="font-medium text-foreground">
                        Northwind • Launchlane • StellarOps
                      </span>{" "}
                      ship with PublicPulse.
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-2xl font-semibold text-foreground">12k+</span>
                      <span className="text-xs uppercase tracking-[0.24em]">Roadmap followers</span>
                    </div>
                    <div className="h-10 w-px bg-border/60" />
                    <div className="flex flex-col">
                      <span className="text-2xl font-semibold text-foreground">92%</span>
                      <span className="text-xs uppercase tracking-[0.24em]">On-time launches</span>
                    </div>
                  </div>
                </FadeIn>
              </div>
              <FadeIn delay={240} className="relative">
                <div className="absolute inset-0 -z-10 rounded-[40px] bg-gradient-to-br from-primary/20 via-transparent to-transparent blur-2xl" />
                <div className="relative overflow-hidden rounded-[36px] border border-primary/25 bg-[color-mix(in_srgb,var(--surface-floating)_92%,transparent)] p-8 shadow-[0_32px_80px_rgba(15,23,42,0.36)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <Sparkles className="h-4 w-4" aria-hidden />
                      Product pulse
                    </span>
                    <Badge variant="secondary" className="border-primary/20 bg-primary/10 text-primary">
                      Live
                    </Badge>
                  </div>
                  <div className="mt-6 space-y-5">
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        Up next
                      </p>
                      <h3 className="mt-3 text-lg font-semibold text-foreground">
                        Advanced admin roles
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        64 enterprise accounts asked for finer permissions. Scheduled for a Q3 launch with early access invites going out now.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          Feedback processed
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-foreground">1,248</p>
                        <p className="text-xs text-muted-foreground">32% faster than last sprint.</p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          Sentiment lift
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-foreground">+18</p>
                        <p className="text-xs text-muted-foreground">NPS change post-launch.</p>
                      </div>
                    </div>
                    <div className="space-y-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">145 champions notified</span>
                        <Button size="sm" variant="secondary">
                          View timeline
                        </Button>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-dashed border-border/60 bg-background/40 px-4 py-3 text-xs text-muted-foreground">
                        <span className="uppercase tracking-[0.24em]">Signal surge</span>
                        <span className="font-medium text-primary">+38% week over week</span>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
            <FadeIn
              delay={520}
              className="flex flex-wrap items-center gap-8 rounded-2xl border border-border/40 bg-background/80 px-6 py-4 text-sm text-muted-foreground backdrop-blur"
            >
              <span className="uppercase tracking-[0.24em] text-xs">
                Teams exploring PublicPulse today
              </span>
              <div className="flex flex-wrap gap-x-8 gap-y-3 font-medium text-foreground/80 dark:text-foreground/70">
                {["Northwind Labs", "Acme SaaS", "Launchlane", "Brightside", "OrbitAI"].map((company) => (
                  <span key={company}>{company}</span>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              What you’ll explore inside PublicPulse
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Every signal, priority, and launch update in one clear workspace.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Step through the live tour to see how feedback routes in, decisions get made,
              and customers stay in the loop—without spreadsheets or guesswork.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FadeIn key={feature.title} delay={index * 90}>
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-background/70 via-background to-background/60 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition-transform duration-200 ease-out hover:-translate-y-1">
                  <div className="space-y-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary shadow-[0_8px_16px_rgba(59,130,246,0.16)]">
                      <feature.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <span className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                    Explore in tour
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-20 translate-y-10 rounded-full bg-gradient-to-t from-primary/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section
          id="workflow"
          className="relative overflow-hidden bg-muted/40 py-24 dark:bg-muted/20"
        >
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-64 -translate-y-1/2 bg-[radial-gradient(circle,_rgba(59,130,246,0.14),_transparent_70%)] dark:bg-[radial-gradient(circle,_rgba(80,99,225,0.24),_transparent_70%)]" />
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4">
                A calm, repeatable workflow
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                From signal to shipped—without the busywork.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                PublicPulse adapts to how your teams already work while removing
                the friction of collecting and acting on customer insights.
              </p>
            </div>
            <div className="mt-16 grid gap-6 lg:grid-cols-4">
              {workflow.map((step, index) => (
                <FadeIn key={step.title} delay={index * 90}>
                  <Card className="relative border-border/60 bg-card/60">
                    <span className="absolute right-4 top-4 text-4xl font-bold text-muted-foreground/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <CardHeader className="space-y-4">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <step.icon className="h-5 w-5" aria-hidden />
                      </span>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {step.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="container mx-auto px-4 py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <FadeIn className="space-y-6">
              <Badge variant="outline" className="border-primary/30 text-primary">
                In early access
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Zero-risk pilot for teams who lead with customer empathy.
              </h2>
              <p className="text-lg text-muted-foreground">
                Join our early access program to shape the roadmap, migrate your
                existing feedback, and get white-glove onboarding. No credit card
                required during beta.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 text-primary" aria-hidden />
                  Unlimited tracked requests, voters, and timeline updates.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 text-primary" aria-hidden />
                  Dedicated onboarding specialist and data migration help.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 text-primary" aria-hidden />
                  Early access to AI triage, executive dashboards, and API.
                </li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/sign-up">Reserve a workspace</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="mailto:hello@publicpulse.com">Talk to product</Link>
                </Button>
              </div>
            </FadeIn>
            <FadeIn delay={160}>
              <Card className="border-primary/30 bg-primary/10 text-primary-foreground dark:bg-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary-foreground">
                    Early Access
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Ideal for product teams of 5-25 prioritising customer-led
                    growth.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <span className="text-4xl font-semibold text-primary-foreground">
                      $0
                    </span>
                    <span className="ml-2 text-sm text-primary-foreground/80">
                      through general availability
                    </span>
                  </div>
                  <ul className="space-y-3 text-sm text-primary-foreground/90">
                    <li>• Unlimited viewers and stakeholders</li>
                    <li>• Two roadmap workspaces</li>
                    <li>• AI-assisted triage rules</li>
                    <li>• SOC2-ready infrastructure</li>
                  </ul>
                  <p className="text-xs text-primary-foreground/70">
                    Lock in early-access benefits and influence roadmap direction
                    before GA pricing rolls out.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>

        <section id="faq" className="container mx-auto px-4 pb-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Frequently asked
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Answers for teams evaluating PublicPulse.
            </h2>
          </div>
          <div className="mx-auto grid max-w-3xl gap-4">
            {faqs.map((faq, index) => (
              <FadeIn key={faq.question} delay={index * 70}>
                <Card className="border-border/60 bg-card/60 transition-colors hover:border-primary/40">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden py-24">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,_rgba(59,130,246,0.16),_transparent_70%)] dark:bg-[radial-gradient(circle,_rgba(80,99,225,0.3),_transparent_70%)]" />
          <div className="container mx-auto px-4">
            <FadeIn className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-primary/10 p-12 text-center shadow-lg shadow-primary/10 dark:border-primary/30 dark:bg-primary/20">
              <h2 className="text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to build in public with your customers?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/90">
                Spin up a workspace in minutes, invite your stakeholders, and see
                how calm customer-led planning can be.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/sign-up">Create your workspace</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/sign-in">Sign in to existing workspace</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
