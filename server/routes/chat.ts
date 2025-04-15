import { factory } from "server/factory.ts";
import { auth } from "server/middlewares/auth.ts";
import { MessageSchema } from "server/zod/chat.ts";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { drizzle } from "server/middlewares/drizzle.ts";
import { streamText, createDataStream, createDataStreamResponse } from "ai";
import { openai } from "@ai-sdk/openai";

export const ChatRequestSchema = z.object({
  id: z.string(),
  messages: z.array(MessageSchema),
});

export const route = factory
  .createApp()
  // .use(auth())
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        id: z.string(),
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
            toolInvocations: z
              .array(
                z.discriminatedUnion("state", [
                  z.object({
                    state: z.literal("call"),
                    toolCallId: z.string(),
                    toolName: z.string(),
                    args: z
                      .unknown()
                      .transform((value) => value as NonNullable<typeof value>),
                    result: z.unknown().optional(),
                  }),
                  z.object({
                    state: z.literal("result"),
                    toolCallId: z.string(),
                    toolName: z.string(),
                    args: z
                      .unknown()
                      .transform((value) => value as NonNullable<typeof value>),
                    result: z
                      .unknown()
                      .transform((value) => value as NonNullable<typeof value>),
                  }),
                ])
              )
              .optional()
              .nullable()
              .transform((value) => {
                if (value === null) {
                  return undefined;
                }
                return value;
              }),
            annotations: z.array(z.any()).optional().nullable(),
          })
        ),
      })
    ),
    drizzle({ lazy: true }),
    async (c) => {
      const { id: chatId, messages } = c.req.valid("json");
      const result = await streamText({
        model: openai("gpt-4o"),
        messages: messages,
      });

      console.log("result", result);

      return result.toDataStreamResponse()
    }
  );
