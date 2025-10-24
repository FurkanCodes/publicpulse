import { randomUUID } from "crypto";

import { and, eq, like } from "drizzle-orm";

import { db } from "@/db";
import {
  companies,
  companyMembers,
  type SelectCompany,
} from "@/db/schema";
import { isUniqueViolation } from "@/lib/sql-errors";

type UserIdentity = {
  id: string;
  name?: string | null;
  email?: string | null;
};

export async function ensureCompanyForUser(
  user: UserIdentity,
): Promise<SelectCompany> {
  const ownedCompany = await findOwnedCompany(user.id);
  if (ownedCompany) {
    return ownedCompany;
  }

  const name =
    user.name?.trim() || user.email?.split("@")[0] || "Workspace";

  let lastError: unknown;
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = await generateUniqueCompanySlug(name);

    try {
      const [company] = await db
        .insert(companies)
        .values({
          name,
          slug,
          ownerUserId: user.id,
        })
        .returning();

      await db
        .insert(companyMembers)
        .values({
          companyId: company.id,
          userId: user.id,
          role: "owner",
        })
        .onConflictDoNothing();

      return company;
    } catch (error) {
      lastError = error;

      if (isUniqueViolation(error)) {
        const existingCompany = await findOwnedCompany(user.id);
        if (existingCompany) {
          return existingCompany;
        }
        continue;
      }

      throw error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Unable to create company for user");
}

export async function getCompanyById(
  companyId: string,
): Promise<SelectCompany | undefined> {
  const result = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  return result[0];
}

export async function getCompanyBySlug(
  slug: string,
): Promise<SelectCompany | undefined> {
  const exact = await db
    .select()
    .from(companies)
    .where(eq(companies.slug, slug))
    .limit(1);

  if (exact[0]) {
    return exact[0];
  }

  const fallback = await db
    .select()
    .from(companies)
    .where(like(companies.slug, `${slug}-%`))
    .limit(1);

  return fallback[0];
}

async function generateUniqueCompanySlug(base: string): Promise<string> {
  const normalized =
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "workspace";

  let attempt = 0;

  while (true) {
    const suffix =
      attempt === 0 ? "" : `-${randomUUID().replace(/-/g, "").slice(0, 5)}`;
    const candidate = `${normalized}${suffix}`;

    const existing = await db
      .select({ id: companies.id })
      .from(companies)
      .where(eq(companies.slug, candidate))
      .limit(1);

    if (existing.length === 0) {
      return candidate;
    }

    attempt += 1;
  }
}

async function findOwnedCompany(
  userId: string,
): Promise<SelectCompany | undefined> {
  const result = await db
    .select({ company: companies })
    .from(companyMembers)
    .innerJoin(
      companies,
      eq(companyMembers.companyId, companies.id),
    )
    .where(
      and(
        eq(companyMembers.userId, userId),
        eq(companyMembers.role, "owner"),
      ),
    )
    .limit(1);

  return result[0]?.company;
}
