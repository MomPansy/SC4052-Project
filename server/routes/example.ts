import { factory } from "server/factory.ts";
import { auth } from "server/middlewares/auth.ts";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { drizzle } from "server/middlewares/drizzle.ts";
import {
  coreMessageSchema,
  coreUserMessageSchema,
  streamText
} from "ai";
import { openai } from "@ai-sdk/openai";
import { Thread } from "threads";

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
    drizzle({ lazy: true }),
    async (c) => {
      const dbWorker = c.var.dbWorker;
      // Step 1: Extract and validate request data
      const { id: chatId, messages, userId } = c.req.valid("json");
      const { withTx } = c.var;

      const lastMessageIndex = messages.length - 1;
      // Check if last message is from user or assistant
      const lastMessage = coreUserMessageSchema.parse(
        messages[lastMessageIndex]
      );
      
      // Insert user message into the database
      dbWorker.insertUserMessage({
        userId: userId,
        chatId: chatId,
        message: lastMessage,
        position: lastMessageIndex
      })
      // first generate a response from the assistant 
      const result = streamText({
        messages: messages,
        model: openai('gpt-4o'),
        onFinish: async (result) => {
          // Insert assistant message into the database
          await dbWorker.insertAssistantMessage({
            userId: userId,
            chatId: chatId,
            text: result.text,
            position: lastMessageIndex + 1
          })
        }
      })

      result.toDataStreamResponse()
      // Step 2: Initialize data stream
    }
  );
