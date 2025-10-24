CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "companies" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "slug" varchar(120) NOT NULL UNIQUE,
  "description" text,
  "logo_url" text,
  "owner_user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "company_members" (
  "company_id" uuid NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "role" varchar(20) DEFAULT 'owner' NOT NULL,
  "joined_at" timestamp DEFAULT now() NOT NULL,
  PRIMARY KEY ("company_id", "user_id")
);

-- Create a default company for every user that currently exists.
INSERT INTO "companies" ("id", "name", "slug", "owner_user_id")
SELECT
  gen_random_uuid(),
  COALESCE(NULLIF(trim("user"."name"), ''), split_part("user"."email", '@', 1)),
  lower(
    regexp_replace(
      COALESCE(NULLIF(trim("user"."name"), ''), split_part("user"."email", '@', 1)),
      '[^a-z0-9]+',
      '-',
      'g'
    )
  ) || '-' || substring(gen_random_uuid()::text, 1, 6),
  "user"."id"
FROM "user";

INSERT INTO "company_members" ("company_id", "user_id", "role")
SELECT "companies"."id", "companies"."owner_user_id", 'owner'
FROM "companies"
WHERE "companies"."owner_user_id" IS NOT NULL
ON CONFLICT DO NOTHING;

ALTER TABLE "roadmap_items"
ADD COLUMN "company_uuid" uuid;

UPDATE "roadmap_items" AS ri
SET "company_uuid" = c."id",
    "created_by_user_id" = ri."created_by_user_id" -- no-op, ensures column touched for migration tools
FROM "companies" AS c
WHERE c."owner_user_id" = ri."company_id";

-- Fallback: assign any orphan roadmap items to an arbitrary company (first company).
UPDATE "roadmap_items"
SET "company_uuid" = (
  SELECT "id" FROM "companies" ORDER BY "created_at" LIMIT 1
)
WHERE "company_uuid" IS NULL;

ALTER TABLE "roadmap_items"
ALTER COLUMN "company_uuid" SET NOT NULL;

ALTER TABLE "roadmap_items"
DROP CONSTRAINT IF EXISTS "roadmap_items_company_id_user_id_fk";

ALTER TABLE "roadmap_items"
DROP CONSTRAINT IF EXISTS "roadmap_items_company_id_fkey";

ALTER TABLE "roadmap_items"
DROP COLUMN "company_id";

ALTER TABLE "roadmap_items"
RENAME COLUMN "company_uuid" TO "company_id";

ALTER TABLE "roadmap_items"
ADD CONSTRAINT "roadmap_items_company_id_companies_id_fk"
FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE;

ALTER TABLE "roadmap_items"
ADD COLUMN IF NOT EXISTS "created_by_user_id" text REFERENCES "user"("id") ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "companies_slug_idx" ON "companies" ("slug");
