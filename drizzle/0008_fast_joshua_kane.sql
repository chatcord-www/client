DO $$ BEGIN
 IF EXISTS (
	SELECT 1
	FROM information_schema.columns
	WHERE table_schema = 'public'
		AND table_name = 'client_message'
		AND column_name = 'direct_owner_id'
 ) AND NOT EXISTS (
	SELECT 1
	FROM information_schema.columns
	WHERE table_schema = 'public'
		AND table_name = 'client_message'
		AND column_name = 'ownerId'
 ) THEN
	ALTER TABLE "client_message" RENAME COLUMN "direct_owner_id" TO "ownerId";
 END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (
	SELECT 1
	FROM information_schema.columns
	WHERE table_schema = 'public'
		AND table_name = 'client_message'
		AND column_name = 'direct_friend_id'
 ) AND NOT EXISTS (
	SELECT 1
	FROM information_schema.columns
	WHERE table_schema = 'public'
		AND table_name = 'client_message'
		AND column_name = 'friendId'
 ) THEN
	ALTER TABLE "client_message" RENAME COLUMN "direct_friend_id" TO "friendId";
 END IF;
END $$;--> statement-breakpoint
ALTER TABLE "client_message" DROP CONSTRAINT IF EXISTS "client_message_direct_owner_id_client_user_id_fk";
--> statement-breakpoint
ALTER TABLE "client_message" DROP CONSTRAINT IF EXISTS "client_message_direct_friend_id_client_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_message" ADD CONSTRAINT "client_message_ownerId_client_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."client_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_message" ADD CONSTRAINT "client_message_friendId_client_user_id_fk" FOREIGN KEY ("friendId") REFERENCES "public"."client_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
