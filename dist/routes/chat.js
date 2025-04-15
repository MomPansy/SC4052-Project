import { factory } from "../factory.js";
import { MessageSchema } from "../zod/chat.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { drizzle } from "../middlewares/drizzle";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
const ChatRequestSchema = z.object({
  id: z.string(),
  messages: z.array(MessageSchema)
});
const route = factory.createApp().post(
  "/",
  zValidator(
    "json",
    z.object({
      id: z.string(),
      messages: z.array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
          toolInvocations: z.array(
            z.discriminatedUnion("state", [
              z.object({
                state: z.literal("call"),
                toolCallId: z.string(),
                toolName: z.string(),
                args: z.unknown().transform((value) => value),
                result: z.unknown().optional()
              }),
              z.object({
                state: z.literal("result"),
                toolCallId: z.string(),
                toolName: z.string(),
                args: z.unknown().transform((value) => value),
                result: z.unknown().transform((value) => value)
              })
            ])
          ).optional().nullable().transform((value) => {
            if (value === null) {
              return void 0;
            }
            return value;
          }),
          annotations: z.array(z.any()).optional().nullable()
        })
      )
    })
  ),
  drizzle({ lazy: true }),
  async (c) => {
    const { id: chatId, messages } = c.req.valid("json");
    const result = await streamText({
      model: openai("gpt-4o"),
      messages
    });
    console.log("result", result);
    return result.toDataStreamResponse();
  }
);
export {
  ChatRequestSchema,
  route
};
