import { notFound } from "next/navigation";

import { headers } from "next/headers";

import { FeatureCard } from "@/components/feature-card";
import { SuggestFeatureForm } from "@/components/community/suggest-feature-form";
import { SuggestionBanner } from "@/components/community/suggestion-banner";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCompanyBySlug } from "@/data-access/companies";
import { getCompanySettings } from "@/data-access/company-settings";
import { countSuggestionsForUser } from "@/data-access/community-suggestions";
import { fetchRoadmapItemsForCompany } from "@/data-access/roadmap-items";
import { getActivePlanForUser } from "@/data-access/plans";
import { auth } from "@/lib/auth";

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
  const settings = await getCompanySettings(company.id);
  const plan = company.ownerUserId
    ? await getActivePlanForUser(company.ownerUserId)
    : null;
  const allowSuggestions = Boolean(
    settings?.enablePublicSuggestions && plan?.allowPublicSuggestions,
  );
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const viewerId = session?.user?.id ?? null;
  const requireAccount = settings?.requireAccountForSuggestions ?? true;
  const maxSuggestions = settings?.maxPublicSuggestionsPerUser ?? 3;
  const activeCount = viewerId
    ? await countSuggestionsForUser(company.id, viewerId)
    : 0;
  const remaining = Math.max(maxSuggestions - activeCount, 0);

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
        {allowSuggestions ? (
          <Card className="border-primary/40 bg-card/80">
            <CardHeader>
              <CardTitle className="text-xl">Have an idea?</CardTitle>
              <CardDescription>
                Share a suggestion and the team will review it before it goes live.
              </CardDescription>
            </CardHeader>
            <div className="px-6 pb-6 space-y-4">
              <SuggestionBanner
                requireAccount={requireAccount}
                isSignedIn={Boolean(viewerId)}
                remaining={remaining}
                signInHref={`/sign-in?redirectTo=/c/${company.slug}`}
              />
              {(!requireAccount || viewerId) && (remaining === null || remaining > 0) ? (
                <SuggestFeatureForm
                  companySlug={company.slug}
                  remaining={remaining}
                  requireAccount={requireAccount}
                  isSignedIn={Boolean(viewerId)}
                />
              ) : null}
            </div>
          </Card>
        ) : (
          <Card className="border-dashed border-border/60 bg-card/60">
            <CardHeader>
              <CardTitle className="text-lg">Suggestions closed</CardTitle>
              <CardDescription>
                The workspace owner isn&apos;t accepting new requests right now. Upvote existing ideas below or
                check back later.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
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
