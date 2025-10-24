import { notFound } from "next/navigation";

import { FeatureCard } from "@/components/feature-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCompanyBySlug } from "@/data-access/companies";
import { fetchRoadmapItemsForCompany } from "@/data-access/roadmap-items";

interface CompanyFeaturesPageProps {
  params: { slug: string };
}

export default async function CompanyFeaturesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const company = slug ? await getCompanyBySlug(slug) : null;

  if (!company) {
    notFound();
  }

  const features = await fetchRoadmapItemsForCompany(company.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-4 text-center">
          <Badge variant="secondary" className="mx-auto border border-primary/30 text-primary">
            Product feedback
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {company.name}&apos;s feature backlog
          </h1>
          <p className="text-lg text-muted-foreground">
            Upvote the ideas that matter most to you and help shape the roadmap.
          </p>
        </div>
        <div className="mt-12 space-y-4">
          {features.length === 0 ? (
            <Card className="border-dashed border-border/60 bg-card/60">
              <CardHeader>
                <CardTitle className="text-lg">No features yet</CardTitle>
                <CardDescription>
                  Check back soon—this company hasn&apos;t added any features to vote on.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-4">
              {features.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} slug={company.slug ?? undefined} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
