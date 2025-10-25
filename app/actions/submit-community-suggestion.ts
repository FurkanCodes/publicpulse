"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { createCommunitySuggestion } from "@/data-access/community-suggestions";
import { getCompanyBySlug } from "@/data-access/companies";
import { getCompanySettings } from "@/data-access/company-settings";
import { countSuggestionsForUser } from "@/data-access/community-suggestions";
import { getActivePlanForUser } from "@/data-access/plans";
import { actionClient } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import { limitCommunitySuggestion } from "@/lib/ratelimit";
import { notifyNewSuggestion } from "@/lib/notifications";

const submitSuggestionSchema = z.object({
  companySlug: z.string().min(1),
  title: z
    .string()
    .min(4, "Share a bit more detail so the team can act on it.")
    .max(180, "Keep suggestion titles under 180 characters."),
  description: z
    .string()
    .max(600, "Try a shorter summary (max 600 characters).")
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : null)),
  submitterName: z
    .string()
    .max(120, "Names must be under 120 characters.")
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : null)),
  submitterEmail: z
    .string()
    .email("Enter a valid email or leave blank.")
    .max(180)
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : null)),
});

export const submitCommunitySuggestionAction = actionClient
  .inputSchema(submitSuggestionSchema)
  .action(async ({ parsedInput }) => {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });
    const userId = session?.user?.id ?? null;

    const company = await getCompanyBySlug(parsedInput.companySlug);

    if (!company) {
      throw new Error("That company board is no longer available.");
    }

    const settings = await getCompanySettings(company.id);
    if (!settings?.enablePublicSuggestions) {
      throw new Error("This board isn’t accepting suggestions right now.");
    }

    const planOwnerId = company.ownerUserId;
    if (!planOwnerId) {
      throw new Error("This board isn’t accepting suggestions right now.");
    }

    const plan = await getActivePlanForUser(planOwnerId);
    if (!plan.allowPublicSuggestions) {
      throw new Error("This board isn’t accepting suggestions right now.");
    }

    if (settings.requireAccountForSuggestions && !userId) {
      throw new Error("Sign in to share a suggestion.");
    }

    if (userId && settings.maxPublicSuggestionsPerUser) {
      const activeCount = await countSuggestionsForUser(company.id, userId);
      if (activeCount >= settings.maxPublicSuggestionsPerUser) {
        throw new Error("You’ve reached the suggestion limit for this workspace.");
      }
    }

    const rateKey = userId
      ? `user:${userId}`
      : `ip:${requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"}`;

    const rateLimit = await limitCommunitySuggestion(rateKey);
    if (!rateLimit.success) {
      throw new Error("You’re sharing ideas too quickly. Try again in a bit.");
    }

    const suggestion = await createCommunitySuggestion({
      companyId: company.id,
      title: parsedInput.title,
      description: parsedInput.description,
      submitterEmail: parsedInput.submitterEmail,
      submitterName: parsedInput.submitterName ?? session?.user?.name ?? null,
      submittedByUserId: userId,
    });

    notifyNewSuggestion({
      companyName: company.name,
      companySlug: company.slug,
      title: suggestion.title,
      description: suggestion.description,
      submitterName: suggestion.submitterName,
      submitterEmail: suggestion.submitterEmail,
    }).catch((error) => {
      console.error("[notification] community suggestion", error);
    });

    return {
      suggestion,
      message: "Thanks! Your idea is waiting for moderation.",
    };
  });
