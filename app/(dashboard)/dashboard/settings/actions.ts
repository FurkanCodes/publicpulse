"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { companyMembers } from "@/db/schema";
import { upsertCompanySettings } from "@/data-access/company-settings";
import { getActivePlanForUser } from "@/data-access/plans";
import {
  getCommunitySuggestionById,
  updateSuggestionStatus,
} from "@/data-access/community-suggestions";
import { createRoadmapItem } from "@/data-access/roadmap-items";
import { authenticatedAction } from "@/lib/safe-action";

const updateCommunitySettingsSchema = z.object({
  companyId: z.string().uuid(),
  enable: z.boolean().optional(),
  requireAccount: z.boolean().optional(),
  maxSuggestions: z.number().int().min(1).max(50).optional(),
});

export const updateCommunitySettingsAction = authenticatedAction
  .inputSchema(updateCommunitySettingsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { companyId, enable, requireAccount, maxSuggestions } = parsedInput;

    const plan = await getActivePlanForUser(ctx.session.user.id);
    if (!plan.allowPublicSuggestions) {
      throw new Error(
        `${plan.name} does not include community suggestions. Upgrade to unlock this feature.`,
      );
    }

    const [membership] = await db
      .select({ userId: companyMembers.userId })
      .from(companyMembers)
      .where(
        and(
          eq(companyMembers.companyId, companyId),
          eq(companyMembers.userId, ctx.session.user.id),
          eq(companyMembers.role, "owner"),
        ),
      )
      .limit(1);

    if (!membership) {
      throw new Error("You need to be an owner of this company to update settings.");
    }

    const sanitizedMax =
      typeof maxSuggestions === "number"
        ? Math.min(50, Math.max(1, maxSuggestions))
        : undefined;

    const settings = await upsertCompanySettings(companyId, {
      enablePublicSuggestions: enable,
      requireAccountForSuggestions: requireAccount,
      maxPublicSuggestionsPerUser: sanitizedMax,
    });

    revalidatePath("/dashboard/workspaces");
    revalidatePath("/dashboard/overview");

    return {
      settings,
      plan: {
        code: plan.code,
        name: plan.name,
      },
    };
  });

const moderateSuggestionSchema = z.object({
  companyId: z.string().uuid(),
  suggestionId: z.string().uuid(),
  decision: z.enum(["approve", "dismiss"]),
  note: z
    .string()
    .max(360, "Resolution notes must be under 360 characters.")
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : null)),
});

export const moderateSuggestionAction = authenticatedAction
  .inputSchema(moderateSuggestionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { companyId, suggestionId, decision, note } = parsedInput;

    const [membership] = await db
      .select({ userId: companyMembers.userId })
      .from(companyMembers)
      .where(
        and(
          eq(companyMembers.companyId, companyId),
          eq(companyMembers.userId, ctx.session.user.id),
          eq(companyMembers.role, "owner"),
        ),
      )
      .limit(1);

    if (!membership) {
      throw new Error("Only workspace owners can moderate suggestions.");
    }

    const suggestion = await getCommunitySuggestionById(companyId, suggestionId);

    if (!suggestion || suggestion.status !== "pending") {
      throw new Error("Suggestion already moderated or not found.");
    }

    if (decision === "approve") {
      await createRoadmapItem({
        companyId,
        title: suggestion.title,
        description: suggestion.description,
        createdByUserId: ctx.session.user.id,
      });
    }

    const updated = await updateSuggestionStatus({
      suggestionId,
      companyId,
      status: decision === "approve" ? "approved" : "dismissed",
      moderatedBy: ctx.session.user.id,
      resolutionNote: note,
    });

    revalidatePath("/dashboard/workspaces");
    revalidatePath("/dashboard/overview");

    return {
      suggestion: updated,
      decision,
    };
  });
