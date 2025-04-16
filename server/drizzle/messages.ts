import { type Message, type ToolInvocation, type JSONValue } from "ai";
import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  text,
  foreignKey,
  jsonb,
  integer,
  index,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users.ts";
import { chats } from "./chats.ts";

export const messages = pgTable(
  "messages",
  {
    id: uuid("id")
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    chatId: uuid("chat_id").notNull(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { precision: 3, withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    archivedAt: timestamp("archived_at", { precision: 3, withTimezone: true }),
    position: integer("position").notNull(),
    role: text("role").notNull().$type<Message["role"]>(),
    content: text("content"),
    parts: jsonb("parts").array().$type<Message["parts"][]>(),
    toolInvocations: jsonb("tool_invocations")
      .array()
      .$type<ToolInvocation[]>(),
    annotations: jsonb("annotations").array().$type<JSONValue[]>(),
    reaction: text("reaction").$type<"up" | "down">(),
  },
  (table) => [
    index("messages_primary_idx").on(
      table.chatId,
      table.archivedAt,
      table.position
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "messages_user_id_fk",
    }).onDelete("cascade"),
  ]
);

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));
