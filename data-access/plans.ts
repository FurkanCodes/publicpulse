import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  plans,
  userPlans,
  companyMembers,
  type InsertPlan,
  type SelectPlan,
} from "@/db/schema";
import {
  FALLBACK_PLAN,
  PLAN_CATALOG,
  type PlanLimits,
  type PlanLimitKind,
  PlanLimitExceededError,
} from "@/lib/plans";

function toPlanLimits(plan: SelectPlan): PlanLimits {
  return {
    id: plan.id,
    code: plan.code,
    name: plan.name,
    description: plan.description,
    monthlyPriceCents: plan.monthlyPriceCents ?? null,
    annualPriceCents: plan.annualPriceCents ?? null,
    companyLimit:
      plan.companyLimit === null || plan.companyLimit === undefined
        ? null
        : plan.companyLimit,
    seatLimit:
      plan.seatLimit === null || plan.seatLimit === undefined
        ? null
        : plan.seatLimit,
    featureLimit:
      plan.featureLimit === null || plan.featureLimit === undefined
        ? null
        : plan.featureLimit,
    isDefault: plan.isDefault,
    metadata: plan.metadata ?? null,
    allowPublicSuggestions: plan.allowPublicSuggestions,
  };
}

function toInsertPlan(plan: PlanLimits): InsertPlan {
  return {
    code: plan.code,
    name: plan.name,
    description: plan.description ?? null,
    monthlyPriceCents: plan.monthlyPriceCents ?? 0,
    annualPriceCents: plan.annualPriceCents ?? null,
    companyLimit: plan.companyLimit ?? null,
    seatLimit: plan.seatLimit ?? null,
    featureLimit: plan.featureLimit ?? null,
    isDefault: plan.isDefault ?? false,
    metadata: plan.metadata ?? null,
    allowPublicSuggestions: plan.allowPublicSuggestions,
  };
}

async function syncPlanCatalog(): Promise<void> {
  for (const definition of PLAN_CATALOG) {
    await db
      .insert(plans)
      .values({
        ...toInsertPlan(definition),
        isDefault: Boolean(definition.isDefault),
      })
      .onConflictDoUpdate({
        target: plans.code,
        set: {
          name: definition.name,
          description: definition.description ?? null,
          monthlyPriceCents: definition.monthlyPriceCents ?? 0,
          annualPriceCents: definition.annualPriceCents ?? null,
          companyLimit: definition.companyLimit ?? null,
          seatLimit: definition.seatLimit ?? null,
          featureLimit: definition.featureLimit ?? null,
          isDefault: Boolean(definition.isDefault),
          metadata: definition.metadata ?? null,
          allowPublicSuggestions: definition.allowPublicSuggestions,
          updatedAt: new Date(),
        },
      });
  }
}

export async function getDefaultPlan(): Promise<PlanLimits> {
  await syncPlanCatalog();

  const existing = await db
    .select()
    .from(plans)
    .where(eq(plans.isDefault, true))
    .orderBy(desc(plans.createdAt))
    .limit(1);

  if (existing[0]) {
    return toPlanLimits(existing[0]);
  }

  const fallbackRow = await db
    .select()
    .from(plans)
    .where(eq(plans.code, FALLBACK_PLAN.code))
    .limit(1);

  if (fallbackRow[0]) {
    return toPlanLimits(fallbackRow[0]);
  }

  return PLAN_CATALOG.find((plan) => plan.code === FALLBACK_PLAN.code) ?? FALLBACK_PLAN;
}

export async function getPlanByCode(
  code: string,
): Promise<PlanLimits | undefined> {
  await syncPlanCatalog();

  const result = await db
    .select()
    .from(plans)
    .where(eq(plans.code, code))
    .limit(1);

  return result[0] ? toPlanLimits(result[0]) : undefined;
}

export async function getActivePlanForUser(
  userId: string,
): Promise<PlanLimits> {
  const result = await db
    .select({
      plan: plans,
    })
    .from(userPlans)
    .innerJoin(plans, eq(userPlans.planId, plans.id))
    .where(
      and(eq(userPlans.userId, userId), eq(userPlans.status, "active")),
    )
    .orderBy(desc(userPlans.startedAt))
    .limit(1);

  if (result[0]) {
    return toPlanLimits(result[0].plan);
  }

  return getDefaultPlan();
}

export async function ensureUserPlan(
  userId: string,
  planCode?: string,
): Promise<PlanLimits> {
  if (planCode) {
    const existingPlan = await getPlanByCode(planCode);
    if (!existingPlan) {
      throw new Error(`Plan with code "${planCode}" does not exist.`);
    }

    await db
      .insert(userPlans)
      .values({
        userId,
        planId: existingPlan.id!,
        status: "active",
      })
      .onConflictDoNothing();

    return existingPlan;
  }

  const activePlan = await db
    .select({ plan: plans })
    .from(userPlans)
    .innerJoin(plans, eq(userPlans.planId, plans.id))
    .where(
      and(eq(userPlans.userId, userId), eq(userPlans.status, "active")),
    )
    .orderBy(desc(userPlans.startedAt))
    .limit(1);

  if (activePlan[0]) {
    return toPlanLimits(activePlan[0].plan);
  }

  const defaultPlan = await getDefaultPlan();

  await db
    .insert(userPlans)
    .values({
      userId,
      planId: defaultPlan.id!,
      status: "active",
    })
    .onConflictDoNothing();

  return defaultPlan;
}

export function assertWithinPlanLimit(
  plan: PlanLimits,
  usage: number,
  limit: number | null,
  kind: PlanLimitKind,
) {
  if (limit !== null && usage >= limit) {
    throw new PlanLimitExceededError(kind, plan, usage, limit);
  }
}

export async function getPlanUsageForUser(userId: string) {
  const plan = await getActivePlanForUser(userId);

  const [{ companyCount } = { companyCount: 0 }] = await db
    .select({
      companyCount: sql<number>`COUNT(DISTINCT ${companyMembers.companyId})`,
    })
    .from(companyMembers)
    .where(
      and(
        eq(companyMembers.userId, userId),
        eq(companyMembers.role, "owner"),
      ),
    );

  const companiesUsed = Number(companyCount ?? 0);
  const companyLimit = plan.companyLimit ?? null;
  const companiesRemaining =
    companyLimit === null ? null : Math.max(companyLimit - companiesUsed, 0);

  return {
    plan,
    usage: {
      companiesUsed,
      companyLimit,
      companiesRemaining,
    },
  };
}
