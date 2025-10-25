import { eq } from "drizzle-orm";

import { db } from "@/db";
import { companies, companyMembers } from "@/db/schema";

export type OwnedWorkspace = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
};

export async function listOwnedWorkspaces(userId: string): Promise<OwnedWorkspace[]> {
  const rows = await db
    .select({
      id: companies.id,
      name: companies.name,
      slug: companies.slug,
      createdAt: companies.createdAt,
    })
    .from(companyMembers)
    .innerJoin(companies, eq(companyMembers.companyId, companies.id))
    .where(
      eq(companyMembers.userId, userId),
    );

  return rows;
}
