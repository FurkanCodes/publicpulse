import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  roadmapItems,
  type InsertRoadmapItem,
  type SelectRoadmapItem,
} from "@/db/schema";

export type RoadmapItem = SelectRoadmapItem;

export async function fetchRoadmapItemsForCompany(
  companyId: string,
): Promise<RoadmapItem[]> {
  return db
    .select()
    .from(roadmapItems)
    .where(eq(roadmapItems.companyId, companyId))
    .orderBy(desc(roadmapItems.createdAt));
}

export async function createRoadmapItem(
  values: InsertRoadmapItem,
): Promise<RoadmapItem> {
  const [feature] = await db
    .insert(roadmapItems)
    .values(values)
    .returning();

  return feature;
}
