import Link from "next/link";
import { cookies, headers } from "next/headers";

import { CreateFeatureForm } from "@/components/dashboard/create-feature-form";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { fetchRoadmapItemsForCompany } from "@/data-access/roadmap-items";
import { ensureCompanyForUser } from "@/data-access/companies";
import { FeatureCard } from "@/components/feature-card";

export default async function DashboardFeaturesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <section className="space-y-8">
        <CreateFeatureForm />
        <Card className="border-dashed border-border/60 bg-background/40">
          <CardHeader>
            <CardTitle className="text-lg">No workspace</CardTitle>
            <CardDescription>
              Sign in to view and manage your company backlog.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    );
  }

  const cookieStore = cookies();
  const preferredWorkspaceId = (await cookieStore).get("selected_workspace_id")?.value;

  const company = await ensureCompanyForUser(
    {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
    preferredWorkspaceId,
  );

  const features = await fetchRoadmapItemsForCompany(company.id);

  return (
    <section className="space-y-8">
      <CreateFeatureForm />
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Feature backlog</h2>
            <p className="text-sm text-muted-foreground">
              Keep track of the ideas you&apos;re exploring before they make the roadmap.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-primary/30 text-primary">
              {features.length} item{features.length === 1 ? "" : "s"}
            </Badge>
            {company.slug ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/c/${company.slug}`}>View public board</Link>
              </Button>
            ) : null}
          </div>
        </div>
        {features.length === 0 ? (
          <Card className="border-dashed border-border/60 bg-background/40">
            <CardHeader>
              <CardTitle className="text-lg">No features yet</CardTitle>
              <CardDescription>
                Capture an opportunity to start gathering votes and feedback from your community.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">

            {features.map((feature) => (
          
              <FeatureCard key={feature.id} feature={feature} disableVoting={true} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
