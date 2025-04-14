/**
 * Used locally by the `drizzle-kit` CLI to generate migration files
 */

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: 'server/drizzle/*.ts',
  schemaFilter: ['public'],
  out: 'server/drizzle/migrations', 
  breakpoints: false,
});
