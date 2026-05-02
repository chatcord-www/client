-- Drop existing constraints
ALTER TABLE "client_message" DROP CONSTRAINT IF EXISTS "client_message_mode_consistency_check";
ALTER TABLE "client_message" DROP CONSTRAINT IF EXISTS "client_message_direct_not_self_check";

-- Drop the ownerId column
ALTER TABLE "client_message" DROP COLUMN "ownerId";

-- Update userId constraint to NOT NULL for both modes
ALTER TABLE "client_message" ALTER COLUMN "userId" SET NOT NULL;

-- Recreate constraints using userId instead of ownerId
DO $$ BEGIN
 ALTER TABLE "client_message"
 ADD CONSTRAINT "client_message_mode_consistency_check" CHECK (
  (
    "mode" = 'DIRECT'::"message_mode"
    AND "userId" IS NOT NULL
    AND "friendId" IS NOT NULL
    AND "serverId" IS NULL
    AND "channelId" IS NULL
  )
  OR
  (
    "mode" = 'CHANNEL'::"message_mode"
    AND "userId" IS NOT NULL
    AND "serverId" IS NOT NULL
    AND "channelId" IS NOT NULL
    AND "friendId" IS NULL
  )
 );
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "client_message"
 ADD CONSTRAINT "client_message_direct_not_self_check" CHECK (
  "mode" <> 'DIRECT'::"message_mode" OR "userId" <> "friendId"
 );
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
