import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  communitySuggestions,
  type SelectCommunitySuggestion,
} from "@/db/schema";

export type SuggestionStatus = "pending" | "approved" | "dismissed";

type CreateSuggestionInput = {
  companyId: string;
  title: string;
  description?: string | null;
  submitterName?: string | null;
  submitterEmail?: string | null;
  submittedByUserId?: string | null;
};

export async function createCommunitySuggestion(
  input: CreateSuggestionInput,
): Promise<SelectCommunitySuggestion> {
  const [suggestion] = await db
    .insert(communitySuggestions)
    .values({
      companyId: input.companyId,
      title: input.title,
      description: input.description ?? null,
      submitterName: input.submitterName ?? null,
      submitterEmail: input.submitterEmail ?? null,
      submittedByUserId: input.submittedByUserId ?? null,
    })
    .returning();

  return suggestion;
}

export async function listCommunitySuggestions(
  companyId: string,
  status: SuggestionStatus | "all" = "pending",
): Promise<SelectCommunitySuggestion[]> {
  const base = db
    .select()
    .from(communitySuggestions)
    .where(eq(communitySuggestions.companyId, companyId))
    .orderBy(desc(communitySuggestions.createdAt));

  if (status === "all") {
    return base;
  }

  return db
    .select()
    .from(communitySuggestions)
    .where(
      and(
        eq(communitySuggestions.companyId, companyId),
        eq(communitySuggestions.status, status),
      ),
    )
    .orderBy(desc(communitySuggestions.createdAt));
}

export async function getCommunitySuggestionById(
  companyId: string,
  suggestionId: string,
): Promise<SelectCommunitySuggestion | undefined> {
  const [suggestion] = await db
    .select()
    .from(communitySuggestions)
    .where(
      and(
        eq(communitySuggestions.companyId, companyId),
        eq(communitySuggestions.id, suggestionId),
      ),
    )
    .limit(1);

  return suggestion;
}

type UpdateStatusInput = {
  suggestionId: string;
  companyId: string;
  status: SuggestionStatus;
  moderatedBy: string;
  resolutionNote?: string | null;
};

export async function updateSuggestionStatus({
  suggestionId,
  companyId,
  status,
  moderatedBy,
  resolutionNote,
}: UpdateStatusInput): Promise<SelectCommunitySuggestion | undefined> {
  const [updated] = await db
    .update(communitySuggestions)
    .set({
      status,
      moderatedBy,
      moderatedAt: new Date(),
      resolutionNote: resolutionNote ?? null,
    })
    .where(
      and(
        eq(communitySuggestions.id, suggestionId),
        eq(communitySuggestions.companyId, companyId),
      ),
    )
    .returning();

  return updated;
}

export async function countSuggestionsForUser(
  companyId: string,
  userId: string,
): Promise<number> {
  const result = await db
    .select({ total: sql<number>`count(*)` })
    .from(communitySuggestions)
    .where(
      and(
        eq(communitySuggestions.companyId, companyId),
        eq(communitySuggestions.submittedByUserId, userId),
        inArray(communitySuggestions.status, ["pending", "approved"]),
      ),
    );

  const total = result[0]?.total ?? 0;
  return Number(total);
}

export async function countSuggestionsByStatus(
  companyId: string,
): Promise<Record<SuggestionStatus, number>> {
  const rows = await db
    .select({ status: communitySuggestions.status, total: sql<number>`count(*)` })
    .from(communitySuggestions)
    .where(eq(communitySuggestions.companyId, companyId))
    .groupBy(communitySuggestions.status);

  const counts: Record<SuggestionStatus, number> = {
    pending: 0,
    approved: 0,
    dismissed: 0,
  };

  for (const row of rows) {
    const status = row.status as SuggestionStatus;
    counts[status] = Number(row.total ?? 0);
  }

  return counts;
}
