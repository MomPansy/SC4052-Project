import { expose } from "threads/worker";
import {
  CoreAssistantMessage,
  CoreUserMessage,
  generateText,
  ToolCallPart,
} from "ai";
import { db } from "server/lib/db.ts";
import { chats } from "server/drizzle/chats.ts";
import { and, eq } from "drizzle-orm";
import { openai } from "@ai-sdk/openai";
import { messages } from "server/drizzle/messages";

const dbWorker = {
  async insertUserMessage({
    userId,
    chatId,
    message,
    position,
  }: {
    userId: string;
    chatId: string;
    message: CoreUserMessage;
    position: number;
  }) {
    try {
      await db.transaction(async (tx) => {
        // first check if the chat exists
        const [chat] = await tx
          .selectDistinct({
            id: chats.id,
          })
          .from(chats)
          .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));

        // if chat doesn't exit create a new chat
        if (!chat) {
          const { text } = await generateText({
            prompt: "Generate a title for the chat",
            messages: [message],
            model: openai("gpt-4o"),
          });

          await tx.insert(chats).values({
            id: chatId,
            userId: userId,
            title: text,
          });
        } else {
          // if chat exists in the database, insert the message
          await tx.insert(messages).values({
            chatId: chatId,
            userId: userId,
            role: message.role,
            content:
              typeof message.content === "string" ? message.content : undefined,
            position: position,
          });
        }
      });
    } catch (error) {
      console.error("Error inserting user message:", error);
      throw error;
    }
  },

  async insertAssistantMessage({
    text,
    message,
    position,
    chatId,
    userId,
  }: {
    text: string;
    message?: CoreAssistantMessage;
    position: number;
    chatId: string;
    userId: string;
  }) {
    try {
      await db.transaction(async (tx) => {
        await tx.insert(messages).values({
          chatId: chatId,
          userId: userId,
          role: "assistant",
          content:
            text ||
            (message && typeof message.content === "string"
              ? message.content
              : undefined),
          assistantContent: message && message.content,
          position: position,
        });
      });
    } catch (error) {
      console.error("Error inserting assistant message:", error);
      throw error;
    }
  },
};

export type DbWorker = typeof dbWorker;

expose(dbWorker);
