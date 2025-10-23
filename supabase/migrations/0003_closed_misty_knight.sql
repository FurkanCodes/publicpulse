CREATE TABLE "roadmap_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" varchar(50) DEFAULT 'planned' NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
