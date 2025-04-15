import { z } from 'zod'

export const appEnvVariablesSchema = z.object({
    SUPABASE_ANON_KEY: z.string(),
    SUPABASE_JWT_SECRET: z.string(),
    SUPABASE_SERVICE_KEY: z.string(),
    SUPABASE_URL: z.string(),   
    DB_URL: z.string(),
    OPENAI_API_KEY: z.string(),
})

export type AppEnvVariables = z.infer<typeof appEnvVariablesSchema>;