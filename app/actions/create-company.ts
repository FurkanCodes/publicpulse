"use server";

import { revalidatePath } from "next/cache";

import { createCompanyForUser } from "@/data-access/companies";
import { PlanLimitExceededError } from "@/lib/plans";
import { authenticatedAction } from "@/lib/safe-action";
import { createCompanySchema } from "./create-company-schema";



export const createCompanyAction = authenticatedAction
  .inputSchema(createCompanySchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const result = await createCompanyForUser(
        {
          id: ctx.session.user.id,
          name: ctx.session.user.name,
          email: ctx.session.user.email,
        },
        parsedInput,
      );

      revalidatePath("/dashboard/overview");
      revalidatePath("/dashboard/workspaces");
      revalidatePath("/dashboard/settings");

      return {
        company: result.company,
        plan: {
          code: result.plan.code,
          name: result.plan.name,
        },
        usage: result.usage,
      };
    } catch (error) {
      if (error instanceof PlanLimitExceededError) {
        return {
          error: {
            kind: "plan-limit" as const,
            message: error.message,
            limit: error.limit,
            plan: {
              code: error.plan.code,
              name: error.plan.name,
            },
            usage: {
              current: error.currentUsage,
              limit: error.limitValue,
            },
          },
        };
      }

      throw error;
    }
  });
