import { db } from "@/db";
import { roadmapItems } from "@/db/schema";


// /workspaces/publicpulse/data-access/fetch-roadmaps-items.tsx
export type RoadmapItem = {
    id: number;
    title: string;
    description?: string | null;
    upvotes?: number | null;
    [key: string]: any;
};

type FetchResult = {
    items: RoadmapItem[] | null;
    error: string | null;
};

/**
 * Fetch roadmap_items from Supabase using the Fetch API (PostgREST).
 */
export default async function fetchRoadmapItems(): Promise<FetchResult> {
  const result = await db.select().from(roadmapItems)
  return {
    items: result,
    error: null,
  };    
}