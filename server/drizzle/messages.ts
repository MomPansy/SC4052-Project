import { type CoreMessage, type UserContent, type AssistantContent, type ToolContent } from "ai";
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
    role: text("role").notNull().$type<CoreMessage["role"]>(),
    content: text("content"),
    userContent: jsonb("user_content").$type<UserContent>(),
    assistantContent: jsonb("assistant_content").$type<AssistantContent>(),
    toolContent: jsonb("tool_content").$type<ToolContent>(),
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
    foreignKey({
      columns: [table.chatId],
      foreignColumns: [chats.id],
      name: "messages_chat_id_fk",
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
