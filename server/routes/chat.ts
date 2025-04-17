import { factory } from "server/factory.ts";
import { auth } from "server/middlewares/auth.ts";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { drizzle } from "server/middlewares/drizzle.ts";
import {
  streamText,
  coreMessageSchema,
  coreUserMessageSchema,
  generateText,
  CoreUserMessage,
  CoreAssistantMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { type Message } from "@ai-sdk/ui-utils";
import { chats } from "server/drizzle/chats";
import { messages as messagesTable } from "server/drizzle/messages.ts";
import { and, eq, sql } from "drizzle-orm";
import { type Tx } from "server/lib/db.ts";

async function insertUserMessage({
  tx,
  chatId,
  userId,
  message,
  position,
}: {
  tx: Tx;
  chatId: string;
  userId: string;
  message: CoreUserMessage;
  position: number;
}) {
  const [chat] = await tx
    .selectDistinct({
      id: chats.id,
    })
    .from(chats)
    .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));

  if (!chat) {
    const { text } = await generateText({
      prompt: "Generate a title for the chat" + message.content,
      model: openai("gpt-4o"),
    });

    await tx.insert(chats).values({
      id: chatId,
      userId: userId,
      title: text,
    });
  } else {
    // if chat exists in the database, insert the message
    await tx.insert(messagesTable).values({
      chatId: chatId,
      userId: userId,
      role: message.role,
      content:
        typeof message.content === "string" ? message.content : undefined,
      position: position,
    });
  }
}

async function insertAssistantMessage({
  tx,
  chatId,
  userId,
  message,
  position,
  text,
}: {
  tx: Tx;
  chatId: string;
  userId: string;
  text: string;
  message?: CoreAssistantMessage;
  position: number;
}) {
  await tx.insert(messagesTable).values({
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
}

export const route = factory
  .createApp()
  .use(auth())
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        userId: z.string(),
        id: z.string(),
        messages: z.array(coreMessageSchema),
      })
    ),
    drizzle(),
    async (c) => {
      // Step 1: Extract and validate request data
      const { id: chatId, messages, userId } = c.req.valid("json");
      const { tx } = c.var;

      const lastMessageIndex = messages.length - 1;
      // Check if last message is from user or assistant
      const lastMessage = coreUserMessageSchema.parse(
        messages[lastMessageIndex]
      );

      // insert user message into database
      await insertUserMessage({
        tx,
        chatId,
        userId,
        message: lastMessage,
        position: lastMessageIndex,
      });

      const result = streamText({
        messages: messages,
        model: openai("gpt-4o"),
        onFinish: async (result) => {
          // Insert assistant message into the database
          await insertAssistantMessage({
            tx: tx,
            userId: userId,
            chatId: chatId,
            text: result.text,
            position: lastMessageIndex + 1,
          });
        },
      });
      return result.toDataStreamResponse();
    }
  )
  .get(
    "/:chatId/:userId",
    zValidator(
      "param",
      z.object({
        chatId: z.string(),
        userId: z.string(),
      })
    ),
    drizzle(),
    async (c) => {
      const { chatId, userId } = c.req.valid("param");
      const { tx } = c.var;

      // Fetch messages from the database
      const messages = await tx
        .select({
          id: messagesTable.id,
          createdAt: messagesTable.createdAt,
          role: messagesTable.role,
          content: messagesTable.content,
          userContent: messagesTable.userContent,
          assistantContent: messagesTable.assistantContent,
          toolContent: messagesTable.toolContent,
        })
        .from(messagesTable)
        .where(
          and(
            eq(messagesTable.chatId, chatId),
            eq(messagesTable.userId, userId)
          )
        )
        .orderBy(sql`position asc`);

      // convert to Message
      const uimessage = messages.map((message) => {
        const { id, createdAt, role, content } = message;
        const convertedMessage: Message = {
          id: id,
          createdAt: createdAt,
          content: content ?? "",
          role: role === "tool" ? "assistant" : role,
        };
        return convertedMessage;
      });

      return c.json(uimessage);
    }
  );
