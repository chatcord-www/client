DO $$ BEGIN
 CREATE TYPE "public"."message_mode" AS ENUM('CHANNEL', 'DIRECT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "client_message" ADD COLUMN IF NOT EXISTS "mode" "message_mode";
--> statement-breakpoint
ALTER TABLE "client_message" ALTER COLUMN "mode" SET NOT NULL;