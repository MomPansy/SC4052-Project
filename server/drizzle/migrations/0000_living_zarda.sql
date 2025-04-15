CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"auth_user_id" uuid NOT NULL,
	"workspace_id" text NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp (3) with time zone,
	"name" text,
	"email" text,
	"phone" text,
	"avatar_url" text
);
