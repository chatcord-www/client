ALTER TABLE "client_message" RENAME COLUMN "direct_owner_id" TO "ownerId";--> statement-breakpoint
ALTER TABLE "client_message" RENAME COLUMN "direct_friend_id" TO "friendId";--> statement-breakpoint
ALTER TABLE "client_message" DROP CONSTRAINT "client_message_direct_owner_id_client_user_id_fk";
--> statement-breakpoint
ALTER TABLE "client_message" DROP CONSTRAINT "client_message_direct_friend_id_client_user_id_fk";
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
