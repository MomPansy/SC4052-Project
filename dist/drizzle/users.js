import { sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  text,
  uuid
} from "drizzle-orm/pg-core";
const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  authUserId: uuid("auth_user_id"),
  workspaceId: text("workspace_id"),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true }).defaultNow().notNull().$onUpdate(() => /* @__PURE__ */ new Date()),
  archivedAt: timestamp("archived_at", { precision: 3, withTimezone: true }),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  avatarUrl: text("avatar_url")
});
export {
  users
};
