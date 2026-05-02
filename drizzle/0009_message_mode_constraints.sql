DO $$ BEGIN
 CREATE TYPE "message_mode" AS ENUM('CHANNEL', 'DIRECT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "client_message" ADD COLUMN IF NOT EXISTS "mode" "message_mode";
--> statement-breakpoint
UPDATE "client_message"
SET "mode" = CASE
  WHEN "ownerId" IS NOT NULL OR "friendId" IS NOT NULL THEN 'DIRECT'::"message_mode"
  ELSE 'CHANNEL'::"message_mode"
END
WHERE "mode" IS NULL;
--> statement-breakpoint
ALTER TABLE "client_message" ALTER COLUMN "mode" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_message" ADD CONSTRAINT "client_message_mode_consistency_check" CHECK (
  (
    "mode" = 'DIRECT'::"message_mode"
    AND "ownerId" IS NOT NULL
    AND "friendId" IS NOT NULL
    AND "serverId" IS NULL
    AND "channelId" IS NULL
  )
  OR
  (
    "mode" = 'CHANNEL'::"message_mode"
    AND "serverId" IS NOT NULL
    AND "channelId" IS NOT NULL
    AND "ownerId" IS NULL
    AND "friendId" IS NULL
  )
 );
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_message" ADD CONSTRAINT "client_message_direct_not_self_check" CHECK (
  "mode" <> 'DIRECT'::"message_mode" OR "ownerId" <> "friendId"
 );
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
