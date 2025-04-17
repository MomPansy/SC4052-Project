import { factory } from "../factory.js";
import { auth } from "../middlewares/auth.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { drizzle } from "../middlewares/drizzle.js";
import {
  streamText,
  coreMessageSchema,
  coreUserMessageSchema,
  generateText
} from "ai";
import { openai } from "@ai-sdk/openai";
import { chats } from "../drizzle/chats";
import { messages as messagesTable } from "../drizzle/messages.js";
import { and, eq, sql } from "drizzle-orm";
async function insertUserMessage({
  tx,
  chatId,
  userId,
  message,
  position
}) {
  const [chat] = await tx.selectDistinct({
    id: chats.id
  }).from(chats).where(and(eq(chats.id, chatId), eq(chats.userId, userId)));
  if (!chat) {
    const { text } = await generateText({
      prompt: "Generate a title for the chat" + message.content,
      model: openai("gpt-4o")
    });
    await tx.insert(chats).values({
      id: chatId,
      userId,
      title: text
    });
  } else {
    await tx.insert(messagesTable).values({
      chatId,
      userId,
      role: message.role,
      content: typeof message.content === "string" ? message.content : void 0,
      position
    });
  }
}
async function insertAssistantMessage({
  tx,
  chatId,
  userId,
  message,
  position,
  text
}) {
  await tx.insert(messagesTable).values({
    chatId,
    userId,
    role: "assistant",
    content: text || (message && typeof message.content === "string" ? message.content : void 0),
    assistantContent: message && message.content,
    position
  });
}
const route = factory.createApp().use(auth()).post(
  "/",
  zValidator(
    "json",
    z.object({
      userId: z.string(),
      id: z.string(),
      messages: z.array(coreMessageSchema)
    })
  ),
  drizzle(),
  async (c) => {
    const { id: chatId, messages, userId } = c.req.valid("json");
    const { tx } = c.var;
    const lastMessageIndex = messages.length - 1;
    const lastMessage = coreUserMessageSchema.parse(
      messages[lastMessageIndex]
    );
    await insertUserMessage({
      tx,
      chatId,
      userId,
      message: lastMessage,
      position: lastMessageIndex
    });
    const result = streamText({
      messages,
      model: openai("gpt-4o"),
      onFinish: async (result2) => {
        await insertAssistantMessage({
          tx,
          userId,
          chatId,
          text: result2.text,
          position: lastMessageIndex + 1
        });
      }
    });
    return result.toDataStreamResponse();
  }
).get(
  "/:chatId/:userId",
  zValidator(
    "param",
    z.object({
      chatId: z.string(),
      userId: z.string()
    })
  ),
  drizzle(),
  async (c) => {
    const { chatId, userId } = c.req.valid("param");
    const { tx } = c.var;
    const messages = await tx.select({
      id: messagesTable.id,
      createdAt: messagesTable.createdAt,
      role: messagesTable.role,
      content: messagesTable.content,
      userContent: messagesTable.userContent,
      assistantContent: messagesTable.assistantContent,
      toolContent: messagesTable.toolContent
    }).from(messagesTable).where(
      and(
        eq(messagesTable.chatId, chatId),
        eq(messagesTable.userId, userId)
      )
    ).orderBy(sql`position asc`);
    const uimessage = messages.map((message) => {
      const { id, createdAt, role, content } = message;
      const convertedMessage = {
        id,
        createdAt,
        content: content ?? "",
        role: role === "tool" ? "assistant" : role
      };
      return convertedMessage;
    });
    return c.json(uimessage);
  }
);
export {
  route
};
