CREATE TABLE "feature_votes" (
  "id" serial PRIMARY KEY,
  "feature_id" integer NOT NULL REFERENCES "roadmap_items"("id") ON DELETE CASCADE,
  "user_id" text REFERENCES "user"("id") ON DELETE CASCADE,
  "anonymous_id" uuid,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "feature_votes_unique_user_vote"
ON "feature_votes" ("feature_id", "user_id")
WHERE "user_id" IS NOT NULL;

CREATE UNIQUE INDEX "feature_votes_unique_anon_vote"
ON "feature_votes" ("feature_id", "anonymous_id")
WHERE "anonymous_id" IS NOT NULL;
