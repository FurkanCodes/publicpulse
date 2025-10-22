import { createClient } from "@/db/supabase/server";

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
    const supabase = await createClient();

  const { data: items, error } = await supabase.from('roadmap_items').select('*')

    if (error) {
        return { items: null, error: error.message };
    }

    return { items, error: null };  
}