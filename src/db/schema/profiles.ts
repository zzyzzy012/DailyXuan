import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  nickname: text("nickname"),
  avatarUrl: text("avatar_url"),
  membershipLevel: text("membership_level").notNull().default("free"),
  remainingCredits: integer("remaining_credits").notNull().default(0),
  membershipExpiresAt: timestamp("membership_expires_at", { withTimezone: true }),
  contactWechat: text("contact_wechat"),
  profileUpdatedAt: timestamp("profile_updated_at", { withTimezone: true }),
  emailRebindRequestedAt: timestamp("email_rebind_requested_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
