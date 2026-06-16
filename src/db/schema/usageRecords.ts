import { date, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const usageRecords = pgTable("usage_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  featureType: text("feature_type").notNull(),
  quotaBucket: text("quota_bucket").notNull(),
  membershipLevel: text("membership_level").notNull(),
  usageDate: date("usage_date").notNull(),
  status: text("status").notNull(),
  reservedAt: timestamp("reserved_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  refundedAt: timestamp("refunded_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UsageRecord = typeof usageRecords.$inferSelect;
export type NewUsageRecord = typeof usageRecords.$inferInsert;
