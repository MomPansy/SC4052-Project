import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  text,
  uuid,
  foreignKey,
  boolean,
} from "drizzle-orm/pg-core";

import { messages } from "./messages.ts";
import { users } from "./users.ts";

export const chats = pgTable(
  "chats",
  {
    id: uuid("id")
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { precision: 3, withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    archivedAt: timestamp("archived_at", { precision: 3, withTimezone: true }),
    title: text("title"),
    lockable: boolean("lockable").notNull().default(false),
    locked: boolean("locked").notNull().default(false),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "chats_user_id_fk",
    }).onDelete("cascade"),
  ]
);

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));
