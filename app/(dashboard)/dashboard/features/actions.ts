"use server";

import { revalidatePath } from "next/cache";

import { authenticatedAction } from "@/lib/safe-action";
import { ensureCompanyForUser } from "@/data-access/companies";
import { createRoadmapItem } from "@/data-access/roadmap-items";

import { createFeatureSchema } from "./schema";

export const createFeatureAction = authenticatedAction
  .inputSchema(createFeatureSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { title, description } = parsedInput;

    const company = await ensureCompanyForUser({
      id: ctx.session.user.id,
      name: ctx.session.user.name,
      email: ctx.session.user.email,
    });

    const feature = await createRoadmapItem({
      title,
      description,
      companyId: company.id,
      createdByUserId: ctx.session.user.id,
    });

    revalidatePath("/dashboard/features");
    revalidatePath("/dashboard");

    return {
      feature,
      message: "Feature created successfully.",
    };
  });
