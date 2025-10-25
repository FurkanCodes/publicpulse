"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { companyMembers } from "@/db/schema";
import { authenticatedAction } from "@/lib/safe-action";
import { cookies } from "next/headers";

const setActiveWorkspaceSchema = z.object({
  workspaceId: z.string().uuid(),
});

export const setActiveWorkspaceAction = authenticatedAction
  .inputSchema(setActiveWorkspaceSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { workspaceId } = parsedInput;

    const membership = await db
      .select({ companyId: companyMembers.companyId })
      .from(companyMembers)
      .where(
        and(
          eq(companyMembers.companyId, workspaceId),
          eq(companyMembers.userId, ctx.session.user.id),
        ),
      )
      .limit(1);

    if (membership.length === 0) {
      throw new Error("You do not have access to that workspace.");
    }

    const cookieStore = cookies();
    (await cookieStore).set("selected_workspace_id", workspaceId, {
      path: "/",
      sameSite: "lax",
    });

    return { workspaceId };
  });
