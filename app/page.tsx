

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

import { AnimatedHeadline } from "@/components/animated-headline";
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
    title: "Unified feedback inbox",
    description:
      "Collect signals from portals, emails, Slack, and community channels without losing context.",
    icon: Inbox,
  },
  {
    title: "Prioritisation that scales",
    description:
      "Score opportunities across impact, effort, and customer segments to build consensus quickly.",
    icon: Target,
  },
  {
    title: "Transparent roadmaps",
    description:
      "Publish real-time status updates and automatically notify subscribers when things ship.",
    icon: Rocket,
  },
  {
    title: "Powerful insights",
    description:
      "Spot trends by persona, account value, or product area so PMs act on what truly matters.",
    icon: BarChart3,
  },
  {
    title: "Collaborative workflows",
    description:
      "Loop in engineering, marketing, and success with shared views and async approvals.",
    icon: Users,
  },
  {
    title: "Enterprise safeguards",
    description:
      "Granular permissions, audit trails, and SOC2-ready infrastructure keep data in the right hands.",
    icon: ShieldCheck,
  },
];

const workflow = [
  {
    title: "Capture every signal",
    description:
      "Route widget submissions, inbound email, and Slack requests into a single triage queue enriched with customer metadata.",
    icon: Sparkles,
  },
  {
    title: "Align on what’s next",
    description:
      "Use impact scoring models and saved customer cohorts to prioritise outcomes, not gut feelings.",
    icon: CheckCircle2,
  },
  {
    title: "Plan and launch",
    description:
      "Push prioritised ideas into delivery tools, track progress, and publish digestible updates as milestones are hit.",
    icon: Rocket,
  },
  {
    title: "Close the loop",
    description:
      "Automatically notify voters and champions, keeping your community engaged and your team accountable.",
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
        <section className="relative overflow-hidden bg-background pb-24 pt-20">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(80,99,225,0.28),_transparent_72%)]" />
          <div className="absolute inset-x-0 top-1/3 -z-20 h-[500px] bg-[linear-gradient(180deg,rgba(59,130,246,0.12),transparent)] dark:bg-[linear-gradient(180deg,rgba(80,99,225,0.2),transparent)]" />
          <div className="container mx-auto flex flex-col gap-16 px-4">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
              <div className="space-y-8">
                <FadeIn className="w-fit">
                  <Badge
                    variant="secondary"
                    className="w-fit border border-primary/20 bg-primary/10 text-primary"
                  >
                    New: AI-assisted triage rules in beta
                  </Badge>
                </FadeIn>
                <FadeIn delay={120}>
                  <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                    Turn customer{" "}
                    <AnimatedHeadline
                      phrases={["feedback", "signals", "chatter", "ideas"]}
                      className="sm:min-w-[9ch]"
                      gradientClassName="from-primary via-[var(--accent-cyan)] to-primary/80"
                    />{" "}
                    into a roadmap the whole company trusts.
                  </h1>
                </FadeIn>
                <FadeIn delay={220}>
                  <p className="text-balance text-lg text-muted-foreground sm:text-xl">
                    PublicPulse unifies requests, prioritisation, and launch
                    comms so product teams move faster with confidence—and
                    customers see their voice reflected in every release.
                  </p>
                </FadeIn>
                <FadeIn delay={320} className="flex flex-wrap items-center gap-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/sign-up">
                      Start for free
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/sign-in">View live workspace</Link>
                  </Button>
                </FadeIn>
                <FadeIn
                  delay={420}
                  className="flex flex-wrap gap-6 text-sm text-muted-foreground"
                >
                  <div>
                    <span className="text-2xl font-semibold text-foreground">
                      12k+
                    </span>{" "}
                    active roadmap followers
                  </div>
                  <div>
                    <span className="text-2xl font-semibold text-foreground">
                      92%
                    </span>{" "}
                    of launches delivered on time
                  </div>
                </FadeIn>
              </div>
              <FadeIn delay={200} className="h-full">
                <Card className="relative h-full overflow-hidden border-border/60 bg-card/90 shadow-lg shadow-primary/10">
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/30 to-transparent dark:from-primary/20" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Weekly Product Pulse
                    </CardTitle>
                    <CardDescription>
                      An at-a-glance summary of what customers are asking for and
                      how your roadmap is responding.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border border-border/60 bg-background/50 px-4 py-4">
                      <p className="text-sm uppercase tracking-wide text-muted-foreground">
                        Top request this week
                      </p>
                      <h3 className="mt-2 text-lg font-semibold">
                        Advanced admin roles
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        64 enterprise accounts requested finer permission
                        controls. Scheduled for Q3 release.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-border/60 bg-background/50 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Feedback processed
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">
                          1,248
                        </p>
                        <p className="text-xs text-muted-foreground">
                          32% faster than previous sprint.
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-background/50 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Customer sentiment
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">
                          +18
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Net promoter score from latest launch.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 px-4 py-3 text-sm">
                      <span className="font-medium text-foreground">
                        145 subscribers notified
                      </span>
                      <Button size="sm" variant="secondary">
                        View timeline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
            <FadeIn
              delay={480}
              className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground"
            >
              <span className="uppercase tracking-wide text-xs">
                Trusted by customer-first teams at
              </span>
              <div className="flex flex-wrap gap-6">
                {["Northwind Labs", "Acme SaaS", "Launchlane", "Brightside"].map(
                  (company) => (
                    <span
                      key={company}
                      className="font-medium text-foreground/80 dark:text-foreground/70"
                    >
                      {company}
                    </span>
                  ),
                )}
              </div>
            </FadeIn>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Why teams switch to PublicPulse
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to champion customer-led roadmaps.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Replace scattered spreadsheets and forms with a shared system that
              keeps product, success, and engineering in lockstep.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FadeIn key={feature.title} delay={index * 80}>
                <Card className="border-border/60 bg-card/60 transition-transform hover:-translate-y-1 hover:border-primary/40">
                  <CardHeader>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <CardTitle className="mt-4 text-xl">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
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
