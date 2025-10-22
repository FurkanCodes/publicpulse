// src/app/page.tsx - CORRECTED

import { FeatureCard } from "@/components/feature-card";
import fetchRoadmapItems from "@/data-access/fetch-roadmaps-items";

function formatDate(dateString?: string | null) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString();
}

export default async function HomePage() {
 const roadmapItems = await fetchRoadmapItems();
 console.log("Fetched roadmap items:", roadmapItems);
  // You can return a simple list or the styled layout from before
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">ClearPath Roadmap</h1>
   
      {roadmapItems.items && roadmapItems.items.length > 0 ? (
        roadmapItems.items.map((item) => (
          <FeatureCard
                  key={item.id}
                  title={item.title}
                  description={item?.description || ""}
                  status={item.status}
                  votes={item.upvotes || 0}
                  comments={item.comments}
                  postedDate={formatDate(item.created_at)}
                />
        ))
      ) : (
        <p>No roadmap items found.</p>
      )}
    </main>
  );
}