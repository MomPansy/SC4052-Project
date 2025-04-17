import { createFactory } from 'hono/factory';
import { spawn, Worker} from "threads"
import { appEnvVariables } from 'server/env.ts';
import { type AppEnvVariables } from 'server/zod/env.ts';
import { DbWorker } from './workers/db.ts'

export const dbWorker = spawn<DbWorker>(new Worker("./workers/db.ts", { type: "module" }))

export type Variables = Record<string, unknown> & AppEnvVariables & {
    dbWorker: DbWorker;
};

export const factory = createFactory<{ Variables: Variables }>({
    initApp: (app) => {
        app.use(async (c, next) => {
            for (const [key, value] of Object.entries(appEnvVariables)) {
                c.set(key as keyof AppEnvVariables, value);
            }
            await next();
        });
        app.use(
            async (c, next) => {
                c.set('dbWorker', await dbWorker);
                await next();
            }
        );
    },
});