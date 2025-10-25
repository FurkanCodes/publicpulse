import { pgTable, serial, text, varchar, integer, timestamp, boolean, uuid, primaryKey, jsonb } from 'drizzle-orm/pg-core';

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const companies = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  description: text('description'),
  logoUrl: text('logo_url'),
  ownerUserId: text('owner_user_id').references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const companyMembers = pgTable(
  'company_members',
  {
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 20 }).default('owner').notNull(),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.companyId, table.userId] }),
  }),
);

export const plans = pgTable('plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 120 }).notNull(),
  description: text('description'),
  monthlyPriceCents: integer('monthly_price_cents').default(0).notNull(),
  annualPriceCents: integer('annual_price_cents'),
  companyLimit: integer('company_limit'),
  seatLimit: integer('seat_limit'),
  featureLimit: integer('feature_limit'),
  isDefault: boolean('is_default').default(false).notNull(),
  allowPublicSuggestions: boolean('allow_public_suggestions').default(false).notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userPlans = pgTable('user_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id')
    .notNull()
    .references(() => plans.id, { onDelete: 'restrict' }),
  status: varchar('status', { length: 24 }).default('active').notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endsAt: timestamp('ends_at'),
  renewsAt: timestamp('renews_at'),
  trialEndsAt: timestamp('trial_ends_at'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const roadmapItems = pgTable('roadmap_items', {
  id: serial('id').primaryKey(),
  status: varchar('status', { length: 50 }).default('planned').notNull(), // e.g., 'planned', 'in_progress', 'complete'
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  upvotes: integer('upvotes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  createdByUserId: text('created_by_user_id').references(() => user.id, { onDelete: 'set null' }),
});

export const featureVotes = pgTable('feature_votes', {
  id: serial('id').primaryKey(),
  featureId: integer('feature_id')
    .notNull()
    .references(() => roadmapItems.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  anonymousId: uuid('anonymous_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});




export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const companySettings = pgTable("company_settings", {
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" })
    .primaryKey(),
  enablePublicSuggestions: boolean("enable_public_suggestions")
    .default(false)
    .notNull(),
  requireAccountForSuggestions: boolean("require_account_for_suggestions")
    .default(true)
    .notNull(),
  maxPublicSuggestionsPerUser: integer("max_public_suggestions_per_user")
    .default(3)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const communitySuggestions = pgTable("community_suggestions", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description"),
  submitterName: varchar("submitter_name", { length: 120 }),
  submitterEmail: varchar("submitter_email", { length: 180 }),
  status: varchar("status", { length: 32 }).default("pending").notNull(),
  submittedByUserId: text("submitted_by_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  moderatedAt: timestamp("moderated_at"),
  moderatedBy: text("moderated_by").references(() => user.id, {
    onDelete: "set null",
  }),
  resolutionNote: text("resolution_note"),
});

export type InsertCompany = typeof companies.$inferInsert;
export type SelectCompany = typeof companies.$inferSelect;
export type InsertCompanyMember = typeof companyMembers.$inferInsert;
export type SelectCompanyMember = typeof companyMembers.$inferSelect;
export type InsertPlan = typeof plans.$inferInsert;
export type SelectPlan = typeof plans.$inferSelect;
export type InsertUserPlan = typeof userPlans.$inferInsert;
export type SelectUserPlan = typeof userPlans.$inferSelect;
export type InsertRoadmapItem = typeof roadmapItems.$inferInsert;
export type SelectRoadmapItem = typeof roadmapItems.$inferSelect;
export type InsertFeatureVote = typeof featureVotes.$inferInsert;
export type SelectFeatureVote = typeof featureVotes.$inferSelect;
export type InsertCompanySettings = typeof companySettings.$inferInsert;
export type SelectCompanySettings = typeof companySettings.$inferSelect;
export type InsertCommunitySuggestion = typeof communitySuggestions.$inferInsert;
export type SelectCommunitySuggestion = typeof communitySuggestions.$inferSelect;
