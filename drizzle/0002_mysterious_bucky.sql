DO $$ BEGIN
 CREATE TYPE "public"."activity" AS ENUM('ONLINE', 'IDLE', 'DND', 'OFFLINE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "client_user" ADD COLUMN "activity" "activity" DEFAULT 'ONLINE';--> statement-breakpoint
ALTER TABLE "client_user" ADD COLUMN "about_me" varchar(255);--> statement-breakpoint
ALTER TABLE "client_user" ADD COLUMN "status" json;--> statement-breakpoint
ALTER TABLE "client_user" ADD COLUMN "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_discriminator" ON "client_user" ("name","discriminator");