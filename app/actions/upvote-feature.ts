"use server";

import { randomUUID } from "crypto";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { actionClient } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { companies, featureVotes, roadmapItems } from "@/db/schema";

import { isUniqueViolation } from "@/lib/sql-errors";

const ANON_COOKIE_NAME = "publicpulse_voter_id";
const ANON_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const upvoteFeatureAction = actionClient
  .inputSchema(
    z.object({
      featureId: z.number().int().positive(),
      slug: z.string().min(1).optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { featureId, slug: providedSlug } = parsedInput;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const cookieStore = await cookies();

    const voterUserId = session?.user.id ?? null;
    let voterAnonymousId: string | null = null;

    if (!voterUserId) {
      voterAnonymousId = cookieStore.get(ANON_COOKIE_NAME)?.value ?? null;
      if (!voterAnonymousId) {
        voterAnonymousId = randomUUID();
        cookieStore.set({
          name: ANON_COOKIE_NAME,
          value: voterAnonymousId,
          httpOnly: true,
          sameSite: "lax",
          maxAge: ANON_COOKIE_MAX_AGE,
          path: "/",
        });
      }
    }

    const voteCondition = voterUserId
      ? and(eq(featureVotes.featureId, featureId), eq(featureVotes.userId, voterUserId))
      : and(eq(featureVotes.featureId, featureId), eq(featureVotes.anonymousId, voterAnonymousId!));

    const existingVote = await db
      .select({ id: featureVotes.id })
      .from(featureVotes)
      .where(voteCondition)
      .limit(1);

    if (existingVote.length) {
      throw new Error("You already upvoted this feature.");
    }

    try {
      await db.insert(featureVotes).values({
        featureId,
        userId: voterUserId,
        anonymousId: voterAnonymousId,
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new Error("You already upvoted this feature.");
      }
      throw error;
    }

    const [updated] = await db
      .update(roadmapItems)
      .set({
        upvotes: sql`${roadmapItems.upvotes} + 1`,
      })
      .where(eq(roadmapItems.id, featureId))
      .returning({
        upvotes: roadmapItems.upvotes,
        companyId: roadmapItems.companyId,
      });

    if (!updated) {
      throw new Error("Feature not found.");
    }

    const [company] = await db
      .select({ slug: companies.slug })
      .from(companies)
      .where(eq(companies.id, updated.companyId))
      .limit(1);

    const slug = providedSlug ?? company?.slug ?? null;

    if (slug) {
      revalidatePath(`/c/${slug}`);
    }
    revalidatePath("/dashboard/features");

    return {
      upvotes: updated.upvotes,
    };
  });
