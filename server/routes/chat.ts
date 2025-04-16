import { factory } from "server/factory.ts";
import { auth } from "server/middlewares/auth.ts";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { drizzle } from "server/middlewares/drizzle.ts";
import {
  streamText,
  coreMessageSchema,
  coreAssistantMessageSchema,
  coreSystemMessageSchema,
  coreToolMessageSchema,
  coreUserMessageSchema,
  createDataStreamResponse,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { chats } from "server/drizzle/chats";
import { messages as messagesTable } from "server/drizzle/messages.ts";
import { and, eq } from "drizzle-orm";

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
      // Step 1: Extract and validate request data
      const { id: chatId, messages, userId } = c.req.valid("json");
      const { withTx } = c.var;

      const lastMessageIndex = messages.length - 1;
      // Check if last message is from user or assistant
      const lastMessage = coreUserMessageSchema.parse(
        messages[lastMessageIndex]
      );

      return createDataStreamResponse({
        execute: async (dataStream) => {
          // Step 2: Initialize data stream
          dataStream.writeData("initialized call");
          console.log("Initialized call");
          await withTx(async (tx) => {
            // Step 3: Check if chat exists
            const [chat] = await tx
              .selectDistinct({
                id: chats.id,
              })
              .from(chats)
              .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));

            console.log("Chat found:", chat); 
            
            if (!chat) {
              console.log("Chat not found, creating new chat");
              // Step 3a: If chat doesn't exist, create a new chat with generated title
              const text = await streamText({
                model: openai("gpt-4o"),
                prompt: `Create a title for the following chat: ${messages[0].content}`,
                onFinish: async (result) => {
                  // Step 3b: Save the new chat to database
                  const [chat] = await tx
                    .insert(chats)
                    .values({
                      id: chatId,
                      userId: userId,
                      title: result.text,
                    })
                    .returning({ id: chats.id });

                  dataStream.writeMessageAnnotation({
                    id: chat.id,
                    other: "new chat",
                  });
                },
              });

              text.mergeIntoDataStream(dataStream);
            } 

            console.log("saving user message:", lastMessage.content);

            await tx.insert(messagesTable).values({
              chatId: chatId,
              userId: userId,
              role: lastMessage.role,
              content:
                typeof lastMessage.content === "string"
                  ? lastMessage.content
                  : undefined,
              position: lastMessageIndex,
            });
            console.log("User message saved:", lastMessage.content);
          });

          // Step 5: Generate AI response using the message history
          console.log("Generating AI response...");
          const result = streamText({
            model: openai("gpt-4o"),
            messages: messages,
            onFinish: async (result) => {
              // Step 6: Store the AI response in the database
              const messageId = await withTx(async (tx) => {
                const [messageId] = await tx
                  .insert(messagesTable)
                  .values({
                    chatId: chatId,
                    userId: userId,
                    role: "assistant",
                    content:
                      typeof result.text === "string" ? result.text : undefined,
                    position: lastMessageIndex + 1,
                  })
                  .returning({
                    id: messagesTable.id,
                  });
                return messageId.id;
              });

              // Step 7: Notify client that assistant message was saved
              dataStream.writeMessageAnnotation({
                id: messageId,
                other: "saved assistant message",
              });
            },
          });

          // Step 8: Stream AI response back to client in real-time
          result.mergeIntoDataStream(dataStream);
        },
        onError: (error) => {
          return error instanceof Error ? error.message : String(error);
        },
      });
    }
  );
