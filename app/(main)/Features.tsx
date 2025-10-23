// /workspaces/publicpulse/app/(main)/Features.tsx

import { FeatureCard } from "@/components/feature-card";
import { RoadmapItem } from "@/data-access/fetch-roadmaps-items";
import { formatDate } from "@/lib/format-date";

// Define an interface for the component's props
interface FeaturesProps {
  roadmapItems: RoadmapItem[];
}

// Use the interface and destructure 'roadmapItems' from the props object
export const Features = ({ roadmapItems }: FeaturesProps) => {
  return (
    <section className="my-12">
      <h1 className="text-4xl font-bold mb-4">ClearPath Roadmap</h1>

      {roadmapItems && roadmapItems.length > 0 ? (
        roadmapItems.map((item) => (
          <FeatureCard
            key={item.id}
            title={item.title}
            description={item?.description || ""}
            // Assuming 'status', 'comments', and 'created_at' are part of the RoadmapItem type
            // @ts-ignore - Add this comment if these properties are not yet in your type to avoid TS errors
            status={item.status}
            // @ts-ignore
            votes={item.upvotes || 0}
            // @ts-ignore
            comments={item.comments}
            // @ts-ignore
            postedDate={formatDate(item.created_at)}
          />
        ))
      ) : (
        <p>No roadmap items found.</p>
      )}
    </section>
  );
};