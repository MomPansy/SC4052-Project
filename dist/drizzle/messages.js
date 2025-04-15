import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  text,
  foreignKey,
  jsonb,
  integer,
  index,
  uuid
} from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { chats } from "./chats.js";
const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
    chatId: uuid("chat_id").notNull(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { precision: 3, withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true }).defaultNow().notNull().$onUpdate(() => /* @__PURE__ */ new Date()),
    archivedAt: timestamp("archived_at", { precision: 3, withTimezone: true }),
    position: integer("position").notNull(),
    role: text("role").notNull().$type(),
    content: text("content").notNull(),
    parts: jsonb("parts").array().$type(),
    toolInvocations: jsonb("tool_invocations").array().$type(),
    annotations: jsonb("annotations").array().$type(),
    reaction: text("reaction").$type()
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
      name: "messages_user_id_fk"
    }).onDelete("cascade")
  ]
);
const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id]
  }),
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  })
}));
export {
  messages,
  messagesRelations
};
