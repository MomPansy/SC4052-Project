ALTER TABLE "messages" ALTER COLUMN "content" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "auth_user_id" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "workspace_id" DROP NOT NULL;
ALTER TABLE "messages" ADD COLUMN "parts" jsonb[];