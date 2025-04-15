import { z } from "zod";

const AttachmentSchema = z.object({
  name: z.string().optional(),
  contentType: z.string().optional(),
  url: z.string().url(),
});

const JsonValueSchema: z.ZodType<any> = z.lazy(() =>
  z.union([
    z.null(),
    z.string(),
    z.number(),
    z.boolean(),
    z.record(JsonValueSchema), // Object with string keys and JSONValue values
    z.array(JsonValueSchema), // Array of JSONValue
  ])
);

const TextUIPartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

const ReasoningDetailsSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    text: z.string(),
    signature: z.string().optional(),
  }),
  z.object({
    type: z.literal("redacted"),
    data: z.string(),
  }),
]);

const ToolCallSchema = z.object({
  toolCallId: z.string().describe("ID of the tool call"),
  toolName: z.string(),
  args: JsonValueSchema,
});

const ToolResultSchema = z.object({
  toolCallId: z.string().describe("ID of the tool call"),
  toolName: z.string(),
  args: JsonValueSchema,
  result: JsonValueSchema,
});

const ToolInvocationSchema = z.discriminatedUnion("state", [
  ToolCallSchema.extend({
    state: z.literal("partial-call"),
    step: z.number().optional(),
  }),
  ToolCallSchema.extend({
    state: z.literal("call"),
    step: z.number().optional(),
  }),
  ToolResultSchema.extend({
    state: z.literal("result"),
    step: z.number().optional(),
  }),
]);

const ToolInvocationUIPartSchema = z.object({
  type: z.literal("tool-invocation"),
  toolInvocation: ToolInvocationSchema,
});

const ReasoningUIPartSchema = z.object({
  type: z.literal("reasoning"),
  reasoning: z.string(),
  details: z.array(ReasoningDetailsSchema),
});

const LanguageModelV1ProviderMetadataSchema = z.record(
  z.string(),
  z.record(z.string(), JsonValueSchema)
);

const LanguageModelV1SourceSchema = z.object({
  sourceType: z.literal("url"),
  id: z.string(),
  url: z.string(),
  title: z.string().optional(),
  providerMetadata: LanguageModelV1ProviderMetadataSchema.optional(),
});

const SourceUIPartSchema = z.object({
  type: z.literal("source"),
  source: LanguageModelV1SourceSchema,
});

const FileUIPart = z.object({
  type: z.literal("file"),
  mimeType: z.string(),
  data: z.string(),
});

const StepStartUIPartSchema = z.object({
  type: z.literal("step-start"),
});

const UIPartSchema = z.discriminatedUnion("type", [
  TextUIPartSchema,
  ReasoningUIPartSchema,
  ToolInvocationUIPartSchema,
  SourceUIPartSchema,
  FileUIPart,
  StepStartUIPartSchema,
]);

const MessageSchema = z.object({
  id: z.string().describe("A unique identifier for the message").optional(),
  createdAt: z.date().optional().describe("The timestamp of the message"),
  content: z.string().describe("Text content of the message"),
  reasoning: z.string().optional().describe("Deprecated: Use parts instead"),
  experimental_attachments: z.array(AttachmentSchema).optional(),
  role: z
    .enum(["system", "user", "assistant", "data"])
    .describe("The 'data' role is deprecated"),
  data: JsonValueSchema.optional().describe(
    "Deprecated: Data messages will be removed"
  ),
  annotations: z
    .array(JsonValueSchema)
    .optional()
    .describe("Additional message-specific information"),
  toolInvocations: z
    .array(ToolInvocationSchema)
    .optional()
    .describe("Deprecated: Use parts instead"),
  parts: z
    .array(UIPartSchema)
    .describe("The parts of the message for UI rendering"),
});

// Since we're making parts required in MessageSchema, UIMessageSchema is now identical
export { MessageSchema };

// For backward compatibility, export UIMessageSchema as an alias to MessageSchema
export const UIMessageSchema = MessageSchema;
