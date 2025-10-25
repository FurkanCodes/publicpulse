export type PlanLimits = {
  id?: string;
  code: string;
  name: string;
  description?: string | null;
  monthlyPriceCents?: number | null;
  annualPriceCents?: number | null;
  companyLimit: number | null;
  seatLimit: number | null;
  featureLimit: number | null;
  isDefault?: boolean | null;
  metadata?: Record<string, unknown> | null;
  allowPublicSuggestions: boolean;
};

export const FALLBACK_PLAN: PlanLimits = {
  code: "starter",
  name: "Starter",
  description: "Default individual workspace plan",
  monthlyPriceCents: 0,
  annualPriceCents: 0,
  companyLimit: 1,
  seatLimit: 3,
  featureLimit: null,
  isDefault: true,
  allowPublicSuggestions: false,
  metadata: {
    badge: "Always free",
  },
};

export const PLAN_CATALOG: PlanLimits[] = [
  FALLBACK_PLAN,
  {
    code: "growth",
    name: "Growth",
    description: "For teams collaborating on multiple initiatives.",
    monthlyPriceCents: 4900,
    annualPriceCents: 49900,
    companyLimit: 5,
    seatLimit: 10,
    featureLimit: null,
    isDefault: false,
    metadata: {
      includes: ["Custom domain", "Board theming", "Email digests"],
      badge: "Most popular",
    },
    allowPublicSuggestions: false,
  },
  {
    code: "scale",
    name: "Scale",
    description: "Advanced controls and integrations for product organisations.",
    monthlyPriceCents: 14900,
    annualPriceCents: 149900,
    companyLimit: 15,
    seatLimit: 30,
    featureLimit: null,
    isDefault: false,
    metadata: {
      includes: [
        "Priority support",
        "SSO",
        "Automation rules",
        "Advanced analytics",
      ],
    },
    allowPublicSuggestions: false,
  },
  {
    code: "community_pro",
    name: "Community Pro",
    description: "Unlock public idea submissions with moderation tooling.",
    monthlyPriceCents: 24900,
    annualPriceCents: 249900,
    companyLimit: 25,
    seatLimit: 60,
    featureLimit: null,
    isDefault: false,
    metadata: {
      includes: [
        "Public suggestion inbox",
        "Moderation workflow",
        "Suggestion exports",
      ],
    },
    allowPublicSuggestions: true,
  },
];

export type PlanLimitKind = "company" | "seat" | "feature";

export class PlanLimitExceededError extends Error {
  readonly limit: PlanLimitKind;
  readonly plan: PlanLimits;
  readonly currentUsage: number;
  readonly limitValue: number | null;

  constructor(
    limit: PlanLimitKind,
    plan: PlanLimits,
    currentUsage: number,
    limitValue: number | null,
  ) {
    const friendlyName =
      limit === "company"
        ? "companies"
        : limit === "seat"
          ? "seats"
          : "tracked features";

    const label =
      limitValue === null
        ? "unlimited"
        : limitValue === 1
          ? "1 slot"
          : `${limitValue} slots`;

    super(
      `Plan limit reached: ${plan.name} (${plan.code}) allows ${label} for ${friendlyName}.`,
    );

    this.limit = limit;
    this.plan = plan;
    this.currentUsage = currentUsage;
    this.limitValue = limitValue;
  }
}
