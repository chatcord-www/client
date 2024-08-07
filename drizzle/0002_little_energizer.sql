DO $$ BEGIN
 CREATE TYPE "public"."channel" AS ENUM('VOICE', 'TEXT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "client_channel" ALTER COLUMN "type" SET DATA TYPE channel;