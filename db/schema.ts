import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const roadmapItems = pgTable('roadmap_items', {
  id: serial('id').primaryKey(),
  status: varchar('status', { length: 50 }).default('planned').notNull(), // e.g., 'planned', 'in_progress', 'complete'
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  upvotes: integer('upvotes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});