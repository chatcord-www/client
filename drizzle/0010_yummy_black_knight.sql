DO $$ BEGIN
 CREATE TYPE "public"."message_mode" AS ENUM('CHANNEL', 'DIRECT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "client_message" ADD COLUMN "mode" "message_mode" NOT NULL;